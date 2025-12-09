import unittest
import os
from unified_llm.importers.chatgpt_importer import ChatGPTImporter

class TestChatGPTImporter(unittest.TestCase):
    def setUp(self):
        self.test_file = os.path.join(os.path.dirname(__file__), 'test_data', 'chatgpt_sample.json')
        self.importer = ChatGPTImporter()

    def test_import_data(self):
        conversations = self.importer.import_data(self.test_file)
        self.assertEqual(len(conversations), 1)
        
        conv = conversations[0]
        self.assertEqual(conv.title, "Test Conversation")
        self.assertEqual(len(conv.messages), 2)  # System message should be skipped
        
        msg1 = conv.messages[0]
        self.assertEqual(msg1.role, "user")
        self.assertEqual(msg1.content, "Hello AI, I love coding in Python!")
        
        msg2 = conv.messages[1]
        self.assertEqual(msg2.role, "assistant")
        self.assertEqual(msg2.content, "Hello User")

from unified_llm.importers.claude_importer import ClaudeImporter

class TestClaudeImporter(unittest.TestCase):
    def setUp(self):
        self.test_file = os.path.join(os.path.dirname(__file__), 'test_data', 'claude_sample.json')
        self.importer = ClaudeImporter()

    def test_import_data(self):
        conversations = self.importer.import_data(self.test_file)
        self.assertEqual(len(conversations), 1)
        
        conv = conversations[0]
        self.assertEqual(conv.title, "Claude Conversation")
        self.assertEqual(len(conv.messages), 2)
        
        msg1 = conv.messages[0]
        self.assertEqual(msg1.role, "user")
        self.assertEqual(msg1.content, "Hi Claude")
        
        msg2 = conv.messages[1]
        self.assertEqual(msg2.role, "assistant")
        self.assertEqual(msg2.content, "Hello! How can I help?")

if __name__ == '__main__':
    unittest.main()


