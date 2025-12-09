import unittest
import os
from unified_llm.importers.chatgpt_importer import ChatGPTImporter
from unified_llm.memory.extractor import MemoryExtractor, LLMClient
from unified_llm.storage.embeddings import MockEmbeddingService
from unified_llm.storage.vector_store import VectorStore
from unified_llm.retrieval.retriever import RetrievalService
from unified_llm.rag_engine import RAGEngine

class IntegrationMockLLM(LLMClient):
    async def generate_async(self, messages: any) -> str:
        return self.generate(messages)

    def generate(self, messages: any) -> str:
        # Extract prompt from messages list for simple matching
        prompt = ""
        if isinstance(messages, str):
            prompt = messages
        elif isinstance(messages, list):
             # basic concat of content
             prompt = " ".join([m.get("content", "") for m in messages])

        if "Analyze" in prompt:
            # Simple extraction of index from prompt to make the mock dynamic
            # Prompt contains "[<index>] Context:"
            import re
            match = re.search(r'\[(\d+)\]', prompt)
            idx = match.group(1) if match else "0"
            
            if "Python" in prompt:
                return f"[{idx}] Fact: User likes Python. Category: preference"
            return "None"
        if "You are a helpful assistant" in prompt:
            if "User likes Python" in prompt:
                return "I see you like Python! That's cool."
            return "I don't know much about you."
        return "Generic response"

class TestIntegration(unittest.TestCase):
    def setUp(self):
        self.test_file = os.path.join(os.path.dirname(__file__), 'test_data', 'chatgpt_sample.json')
        self.llm_client = IntegrationMockLLM()
        self.importer = ChatGPTImporter()
        self.extractor = MemoryExtractor(llm_client=self.llm_client)
        self.embedding_service = MockEmbeddingService()
        self.vector_store = VectorStore(embedding_service=self.embedding_service)
        self.retrieval_service = RetrievalService(vector_store=self.vector_store)
        self.app = RAGEngine(retrieval_service=self.retrieval_service, llm_client=self.llm_client)

    def test_full_flow(self):
        # 1. Import
        conversations = self.importer.import_data(self.test_file)
        self.assertEqual(len(conversations), 1)
        messages = conversations[0].messages
        
        # 2. Extract
        facts = self.extractor.extract_facts(messages)
        self.assertEqual(len(facts), 1)
        self.assertEqual(facts[0].content, "User likes Python.")
        
        # 3. Store
        self.vector_store.add_facts(facts)
        
        # 4. Retrieve & Respond
        response = self.app.generate_response("Do I like any programming languages?")
        
        
        self.assertIn("I see you like Python", response.answer)

if __name__ == '__main__':
    unittest.main()
