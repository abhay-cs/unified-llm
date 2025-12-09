from abc import ABC, abstractmethod
from typing import List
import os

class EmbeddingService(ABC):
    @abstractmethod
    def embed(self, texts: List[str]) -> List[List[float]]:
        pass

class MockEmbeddingService(EmbeddingService):
    def embed(self, texts: List[str]) -> List[List[float]]:
        # Return dummy vectors of dimension 384
        return [[0.1] * 384 for _ in texts]

class OpenAIEmbeddingService(EmbeddingService):
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.environ.get("OPENAI_API_KEY")
        if self.api_key:
            from openai import OpenAI
            self.client = OpenAI(api_key=self.api_key)

    def embed(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        try:
            response = self.client.embeddings.create(
                input=texts,
                model="text-embedding-ada-002"
            )
            return [data.embedding for data in response.data]
        except Exception as e:
            print(f"Error generating embeddings: {e}")
            return []

class LocalEmbeddingService(EmbeddingService):
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        try:
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer(model_name)
        except ImportError:
            print("Error: sentence-transformers not installed. Please run 'pip install sentence-transformers'")
            self.model = None

    def embed(self, texts: List[str]) -> List[List[float]]:
        if not texts or not self.model:
            return []
        try:
            # encode returns numpy array, convert to list
            embeddings = self.model.encode(texts)
            return embeddings.tolist()
        except Exception as e:
            print(f"Error generating local embeddings: {e}")
            return []

