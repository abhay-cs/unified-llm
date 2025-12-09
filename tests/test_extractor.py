import unittest
from unified_llm.models import Message
from unified_llm.memory.extractor import MemoryExtractor, LLMClient

class MockLLMClient(LLMClient):
    def generate(self, prompt: str) -> str:
        # Check if the *User Message* part contains python
        if "User Message: I love coding in Python" in prompt:
            return "Fact: User likes Python. Category: preference"
        return "None"

class TestMemoryExtractor(unittest.TestCase):
    def setUp(self):
        self.mock_llm = MockLLMClient()
        self.extractor = MemoryExtractor(llm_client=self.mock_llm)

    def test_extract_facts(self):
        messages = [
            Message(role="user", content="I love coding in Python!", metadata={'id': 'msg-1'}),
            Message(role="assistant", content="That's great."),
            Message(role="user", content="Short", metadata={'id': 'msg-2'}), # Should be skipped (too short)
            Message(role="user", content="I also like Rust.", metadata={'id': 'msg-3'}) # Mock returns None
        ]
        
        facts = self.extractor.extract_facts(messages)
        
        self.assertEqual(len(facts), 1)
        fact = facts[0]
        self.assertEqual(fact.content, "User likes Python.")
        self.assertEqual(fact.category, "preference")
        self.assertEqual(fact.source_message_id, "msg-1")

if __name__ == '__main__':
    unittest.main()
