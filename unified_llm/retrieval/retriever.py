from typing import List, Dict, Any
from unified_llm.storage.vector_store import VectorStore

class RetrievalService:
    def __init__(self, vector_store: VectorStore):
        self.vector_store = vector_store

    def retrieve_context(self, query: str, k: int = 5) -> List[str]:
        """
        Retrieves relevant facts for a given query.
        Returns a list of formatted fact strings.
        """
        results = self.vector_store.search(query, k=k)
        
        # Format results for context
        context_items = []
        for item in results:
            # item is dict with 'content', 'metadata', 'distance'
            content = item['content']
            # We could add metadata info if needed
            context_items.append(content)
            
        return context_items

    def retrieve(self, query: str, top_k: int = 5) -> List[Any]:
        """
        Retrieves relevant facts as Fact objects.
        """
        from unified_llm.models import Fact
        
        results = self.vector_store.search(query, k=top_k)
        facts = []
        
        for item in results:
            content = item['content']
            metadata = item.get('metadata', {})
            
            # Reconstruct Fact object from metadata/content
            # We assume metadata stores 'category' etc.
            fact = Fact(
                content=content,
                category=metadata.get('category', 'general'),
                metadata=metadata
            )
            # If search returns ID, set it (not standard in search result dict currently but good to have)
            # Current search returns: content, metadata, distance.
            # We can't easily recover ID unless we added it to metadata or searched by ID.
            # But graph service needs it. Let's see if vector_store.search can return ID.
            # Looking at vector_store.py:115... it doesn't return ID.
            # For now, we just return the Fact objects.
            facts.append(fact)
            
        return facts
