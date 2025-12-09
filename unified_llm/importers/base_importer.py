from abc import ABC, abstractmethod
from typing import List
from unified_llm.models import Conversation

class BaseImporter(ABC):
    """Abstract base class for chat history importers."""

    @abstractmethod
    def import_data(self, file_path: str) -> List[Conversation]:
        """
        Parses an export file and returns a list of Conversation objects.
        
        Args:
            file_path: Path to the export file (JSON, ZIP, etc.)
            
        Returns:
            List of Conversation objects.
        """
        pass
