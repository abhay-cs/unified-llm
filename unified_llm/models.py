from dataclasses import dataclass
from typing import Optional, Dict, Any
from datetime import datetime

@dataclass
class Message:
    role: str  # 'user', 'assistant', 'system'
    content: str
    timestamp: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None

@dataclass
class Conversation:
    id: str
    title: Optional[str]
    messages: list[Message]
    created_at: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None

@dataclass
class Fact:
    content: str
    category: str  # 'preference', 'project', 'user_info', 'other'
    id: Optional[str] = None
    source_message_id: Optional[str] = None
    timestamp: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None

