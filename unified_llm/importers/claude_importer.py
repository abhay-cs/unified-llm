import json
from typing import List, Dict, Any
from datetime import datetime
from unified_llm.models import Conversation, Message
from unified_llm.importers.base_importer import BaseImporter

class ClaudeImporter(BaseImporter):
    """Importer for Claude data exports (conversations.json)."""

    def import_data(self, file_path: str) -> List[Conversation]:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        conversations = []
        for item in data:
            conversation = self._parse_conversation(item)
            if conversation:
                conversations.append(conversation)
        
        return conversations

    def _parse_conversation(self, data: Dict[str, Any]) -> Conversation:
        conv_id = data.get('uuid')
        title = data.get('name')
        created_at_str = data.get('created_at')
        
        created_at = None
        if created_at_str:
            try:
                # ISO format usually: 2023-01-01T12:00:00.000000Z
                created_at = datetime.fromisoformat(created_at_str.replace('Z', '+00:00'))
            except ValueError:
                pass

        messages = []
        chat_messages = data.get('chat_messages', [])
        
        for msg_data in chat_messages:
            sender = msg_data.get('sender')
            text = msg_data.get('text')
            
            if not text:
                continue
                
            # Map sender to standard roles
            role = 'user' if sender == 'human' else 'assistant'
            
            msg_time_str = msg_data.get('created_at')
            timestamp = None
            if msg_time_str:
                try:
                    timestamp = datetime.fromisoformat(msg_time_str.replace('Z', '+00:00'))
                except ValueError:
                    pass

            messages.append(Message(
                role=role,
                content=text,
                timestamp=timestamp,
                metadata={'original_sender': sender}
            ))

        return Conversation(
            id=conv_id,
            title=title,
            messages=messages,
            created_at=created_at,
            metadata={'original_data': 'claude_export'}
        )
