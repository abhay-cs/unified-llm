import json
from typing import List, Dict, Any
from datetime import datetime
from unified_llm.models import Conversation, Message
from unified_llm.importers.base_importer import BaseImporter

class ChatGPTImporter(BaseImporter):
    """Importer for ChatGPT data exports (conversations.json)."""

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
        conv_id = data.get('id')
        title = data.get('title')
        create_time = data.get('create_time')
        
        created_at = None
        if create_time:
            created_at = datetime.fromtimestamp(create_time)

        mapping = data.get('mapping', {})
        
        # Find the leaf node (node with no children) to traverse backwards
        # Or better: Find the node that is "current_node" if it exists, or just the last one by time.
        # ChatGPT exports usually have a 'current_node' field in the root, but let's check.
        # Actually, 'mapping' is a dict of UUID -> Node.
        # We want to reconstruct the linear thread.
        # A robust way is to find the node with no children (leaf) that is the "main" path.
        # But there might be multiple leaves (regenerated responses).
        # For MVP, let's pick the leaf with the latest timestamp.
        
        nodes = list(mapping.values())
        if not nodes:
            return None

        # Build a map of id -> node
        node_map = {node['id']: node for node in nodes}
        
        # Find all leaves (nodes that are not anyone's parent)
        parent_ids = set()
        for node in nodes:
            if node.get('parent'):
                parent_ids.add(node.get('parent'))
        
        leaves = [n for n in nodes if n['id'] not in parent_ids]
        
        if not leaves:
             # Should not happen unless circular or empty
             return None
             
        # Pick the latest leaf
        # Safe get for create_time
        latest_leaf = max(leaves, key=lambda x: (x.get('message') or {}).get('create_time') or 0)
        
        # Traverse backwards
        messages = []
        current_node = latest_leaf
        
        while current_node:
            msg_data = current_node.get('message')
            if msg_data:
                author = msg_data.get('author', {})
                role = author.get('role')
                
                if role != 'system':
                    content_parts = msg_data.get('content', {}).get('parts', [])
                    text_content = ""
                    for part in content_parts:
                        if isinstance(part, str):
                            text_content += part
                    
                    if text_content:
                        msg_time = msg_data.get('create_time')
                        timestamp = datetime.fromtimestamp(msg_time) if msg_time else None
                        
                        messages.append(Message(
                            role=role,
                            content=text_content,
                            timestamp=timestamp,
                            metadata={'id': msg_data.get('id')}
                        ))
            
            parent_id = current_node.get('parent')
            current_node = node_map.get(parent_id)
            
        # Reverse to get chronological order
        messages.reverse()

        return Conversation(
            id=conv_id,
            title=title,
            messages=messages,
            created_at=created_at,
            metadata={'original_data': 'chatgpt_export'}
        )
