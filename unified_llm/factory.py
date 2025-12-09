import os
from typing import Optional, Tuple
from dotenv import load_dotenv

from unified_llm.storage.vector_store import VectorStore
from unified_llm.storage.embeddings import LocalEmbeddingService
from unified_llm.memory.extractor import MemoryExtractor, LLMClient
from unified_llm.retrieval.retriever import RetrievalService

# Load environment variables once
load_dotenv()

class ServiceFactory:
    _instance = None
    
    def __init__(self):
        self.embedding_service = None
        self.vector_store = None
        self.llm_client = None
        self.extractor = None
        self.retriever = None
        self._initialized = False

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = ServiceFactory()
        return cls._instance

    def initialize(self):
        if self._initialized:
            return

        print("Initializing Unified LLM Services...")
        
        # 1. Embeddings
        print("Loading Embedding Service (all-MiniLM-L6-v2)...")
        self.embedding_service = LocalEmbeddingService()
        
        # 2. Vector Store
        self.vector_store = VectorStore(embedding_service=self.embedding_service)
        
        # 3. LLM Client
        deepseek_key = os.environ.get("DEEPSEEK_API_KEY")
        if not deepseek_key:
            print("WARNING: DEEPSEEK_API_KEY not found. Using MOCK LLM.")
            self.llm_client = LLMClient() # Mock
        else:
            print("Initializing DeepSeek LLM...")
            self.llm_client = LLMClient(
                api_key=deepseek_key,
                base_url="https://api.deepseek.com",
                model="deepseek-chat"
            )
            
        # 4. Services
        self.extractor = MemoryExtractor(llm_client=self.llm_client)
        self.retriever = RetrievalService(vector_store=self.vector_store)
        
        # 5. Graph Services
        from unified_llm.graph.service import GraphService
        from unified_llm.graph.persona import PersonaEngine
        
        self.graph_service = GraphService(vector_store=self.vector_store)
        self.persona_engine = PersonaEngine(
            graph_service=self.graph_service,
            llm_client=self.llm_client
        )
        
        self._initialized = True
        print("Services Initialized.")

    def get_components(self):
        """Returns all initialized components."""
        if not self._initialized:
            self.initialize()
            
        return {
            "embedding_service": self.embedding_service,
            "vector_store": self.vector_store,
            "llm_client": self.llm_client,
            "extractor": self.extractor,
            "retriever": self.retriever,
            "graph_service": self.graph_service,
            "persona_engine": self.persona_engine
        }

def get_services():
    """Convenience function to get all services."""
    factory = ServiceFactory.get_instance()
    return factory.get_components()
