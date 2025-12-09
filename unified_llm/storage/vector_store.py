import uuid
import hashlib
import os
import time
from typing import List, Dict, Any
from unified_llm.models import Fact
from unified_llm.storage.embeddings import EmbeddingService

class VectorStore:
    def __init__(self, embedding_service: EmbeddingService, index_name: str = "unified-llm-memory-384"):
        self.embedding_service = embedding_service
        self.index_name = index_name
        self.index = None
        self.use_mock = False
        
        api_key = os.environ.get("PINECONE_API_KEY")
        if not api_key:
            print("Warning: PINECONE_API_KEY not found. Using mock storage.")
            self.mock_storage = []
            self.use_mock = True
            return

        try:
            import pinecone
            
            # Try new API first (pinecone >= 3.0)
            try:
                from pinecone import Pinecone, ServerlessSpec
                self.pc = Pinecone(api_key=api_key)
                use_new_api = True
            except ImportError:
                # Fall back to old API (pinecone < 3.0)
                pinecone.init(api_key=api_key, environment="us-east-1")
                use_new_api = False
            
            # Check if index exists, create if not
            if use_new_api:
                existing_indexes = [i.name for i in self.pc.list_indexes()]
                if index_name not in existing_indexes:
                    print(f"Creating Pinecone index '{index_name}'...")
                    self.pc.create_index(
                        name=index_name,
                        dimension=384,
                        metric='cosine',
                        spec=ServerlessSpec(cloud='aws', region='us-east-1')
                    )
                    while not self.pc.describe_index(index_name).status['ready']:
                        time.sleep(1)
                self.index = self.pc.Index(index_name)
            else:
                # Old API
                if index_name not in pinecone.list_indexes():
                    print(f"Creating Pinecone index '{index_name}'...")
                    pinecone.create_index(index_name, dimension=384, metric='cosine')
                self.index = pinecone.Index(index_name)
            
        except Exception as e:
            print(f"Error initializing Pinecone: {e}")
            print("Using mock storage.")
            self.mock_storage = []
            self.use_mock = True

    def add_facts(self, facts: List[Fact]):
        if not facts:
            return

        texts = [f"{fact.category}: {fact.content}" for fact in facts]
        embeddings = self.embedding_service.embed(texts)
        
        if self.index:
            vectors = []
            for i, fact in enumerate(facts):
                meta = fact.metadata or {}
                meta['category'] = fact.category
                meta['timestamp'] = str(fact.timestamp) if fact.timestamp else ""
                meta['content'] = texts[i]
                
                # Pinecone metadata values must be strings, numbers, booleans, or list of strings
                # Ensure everything is stringified if complex
                clean_meta = {k: str(v) for k, v in meta.items()}
                
                # Generate deterministic ID based on content to prevent duplicates
                fact_id = hashlib.md5(f"{fact.category}:{fact.content}".encode()).hexdigest()
                vectors.append({
                    "id": fact_id,
                    "values": embeddings[i],
                    "metadata": clean_meta
                })
            
            # Upsert in batches of 100
            batch_size = 100
            for i in range(0, len(vectors), batch_size):
                batch = vectors[i:i+batch_size]
                self.index.upsert(vectors=batch)
        else:
            # Mock storage
            for i, text in enumerate(texts):
                self.mock_storage.append({
                    'content': text,
                    'embedding': embeddings[i]
                })

    def search(self, query: str, k: int = 5) -> List[Dict[str, Any]]:
        query_embedding = self.embedding_service.embed([query])[0]
        
        if self.index:
            results = self.index.query(
                vector=query_embedding,
                top_k=k,
                include_metadata=True
            )
            
            output = []
            for match in results['matches']:
                output.append({
                    'content': match['metadata'].get('content', ''),
                    'metadata': match['metadata'],
                    'distance': match['score']
                })
            return output
        else:
            # Mock search - just return everything for now since embeddings are dummy
            output = []
            for item in self.mock_storage:
                output.append({
                    'content': item['content'],
                    'metadata': item.get('metadata', {}),
                    'distance': 1.0 # precise match in mock land
                })
            return output[:k]
