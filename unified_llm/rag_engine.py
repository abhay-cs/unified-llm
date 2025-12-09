from typing import List, Dict, Any, Optional
from dataclasses import dataclass

from unified_llm.memory.extractor import LLMClient
from unified_llm.retrieval.retriever import RetrievalService
from unified_llm.models import Fact

@dataclass
class RAGResponse:
    answer: str
    retrieved_facts: List[Fact]

class RAGEngine:
    def __init__(self, retrieval_service: RetrievalService, llm_client: LLMClient):
        self.retrieval_service = retrieval_service
        self.llm_client = llm_client

    def generate_response(self, user_query: str, top_k: int = 5) -> RAGResponse:
        """
        Generates a response to the user query using RAG.
        1. Retrieve relevant facts.
        2. Generate answer using LLM.
        """
        # 1. Retrieve relevant facts
        facts = self.retrieval_service.retrieve(user_query, top_k=top_k)
        
        # 2. Construct prompt
        context_str = "\n".join(f"- {fact.content}" for fact in facts)
        
        system_prompt = f"""You are a helpful assistant with access to the user's external memory.
Use the following retrieved facts to answer the user's question. 
If the facts don't contain the answer, say you don't know based on the memory.

Retrieved Facts:
{context_str}
"""
        
        # 3. Generate response
        # Using the synchronous generate method for simplicity in CLI/Scripts, 
        # but we can add async support if needed.
        response_text = self.llm_client.generate(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_query}
            ]
        )
        
        return RAGResponse(
            answer=response_text,
            retrieved_facts=facts
        )

    async def generate_response_async(self, user_query: str, top_k: int = 5) -> RAGResponse:
        """Async version for FastAPI"""
        # 1. Retrieve (sync for now as Pinecone/Local is sync in this codebase)
        facts = self.retrieval_service.retrieve(user_query, top_k=top_k)
        
        # 2. Construct prompt
        context_str = "\n".join(f"- {fact.content}" for fact in facts)
        
        system_prompt = f"""You are a helpful assistant with access to the user's external memory.
Use the following retrieved facts to answer the user's question. 
If the facts don't contain the answer, say you don't know based on the memory.

Retrieved Facts:
{context_str}
"""
        
        # 3. Generate response
        response_msg = await self.llm_client.generate_async(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_query}
            ]
        )
        
        return RAGResponse(
            answer=response_msg.content,
            retrieved_facts=facts
        )
