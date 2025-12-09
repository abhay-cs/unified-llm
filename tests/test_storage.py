import unittest
from unified_llm.storage.vector_store import VectorStore
from unified_llm.storage.embeddings import MockEmbeddingService
from unified_llm.models import Fact

class TestVectorStore(unittest.TestCase):
    def setUp(self):
        self.embedding_service = MockEmbeddingService()
        self.store = VectorStore(embedding_service=self.embedding_service)

    def test_add_and_search(self):
        facts = [
            Fact(content="User likes Python", category="preference"),
            Fact(content="Project is Unified LLM", category="project")
        ]
        
        self.store.add_facts(facts)
        
        # Check if added to mock storage (since chroma is likely missing)
        if hasattr(self.store, 'mock_storage'):
            self.assertEqual(len(self.store.mock_storage), 2)
            
            results = self.store.search("Python", k=1)
            self.assertEqual(len(results), 1)
            self.assertEqual(results[0]['content'], "preference: User likes Python")

if __name__ == '__main__':
    unittest.main()
