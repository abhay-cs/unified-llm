import os
from typing import List
from unified_llm.models import Message, Fact

# Placeholder for LLM client
# In a real app, we'd use openai or anthropic libraries
class LLMClient:
    def __init__(self, api_key: str = None, base_url: str = "https://api.deepseek.com", model: str = "deepseek-chat"):
        self.api_key = api_key or os.environ.get("DEEPSEEK_API_KEY") or os.environ.get("OPENAI_API_KEY")
        self.base_url = base_url
        self.model = model
        
        if self.api_key:
            from openai import AsyncOpenAI
            self.client = AsyncOpenAI(api_key=self.api_key, base_url=self.base_url)
        else:
            self.client = None

    async def generate_async(self, messages: Any) -> str:
        # Support both string prompt and messages list for backward compatibility
        if isinstance(messages, str):
            prompt = messages
            messages_payload = [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ]
        else:
            messages_payload = messages

        if not self.client:
            return "[MOCK MODE] I cannot generate real responses without a DEEPSEEK_API_KEY. Please set it and restart."
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages_payload,
                temperature=0
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling LLM: {e}")
            return "None"
    
    def generate(self, messages: Any) -> str:
        """Synchronous wrapper for backward compatibility."""
        import asyncio
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        return loop.run_until_complete(self.generate_async(prompt))

class MemoryExtractor:
    """Extracts structured facts from chat messages."""

    def __init__(self, llm_client=None):
        self.llm_client = llm_client or LLMClient()

    async def extract_facts_async(self, messages: List[Message], max_concurrent: int = 3, batch_size: int = 10) -> List[Fact]:
        """Async version with batching and smart filtering."""
        import asyncio
        
        # Filter messages that are unlikely to have facts
        filtered_messages = []
        skip_phrases = {'hi', 'hello', 'thanks', 'ok', 'thank you', 'bye', 'goodbye'}
        
        for i, msg in enumerate(messages):
            if msg.role != 'user':
                continue
            if len(msg.content) < 20:  # Skip very short messages
                continue
            if msg.content.lower().strip() in skip_phrases:
                continue
            
            # Get context
            context_msg = messages[i-1] if i > 0 else None
            context_content = context_msg.content if context_msg and context_msg.role == 'assistant' else "None"
            
            filtered_messages.append({
                'message': msg,
                'context': context_content,
                'index': i
            })
        
        if not filtered_messages:
            return []
        
        print(f"Processing {len(filtered_messages)} messages (filtered from {len(messages)})...")
        
        # Batch process messages
        batches = [filtered_messages[i:i+batch_size] for i in range(0, len(filtered_messages), batch_size)]
        
        semaphore = asyncio.Semaphore(max_concurrent)
        
        async def process_batch(batch):
            async with semaphore:
                return await self._extract_from_batch_async(batch)
        
        tasks = [process_batch(batch) for batch in batches]
        batch_results = await asyncio.gather(*tasks)
        
        # Flatten results
        all_facts = []
        for facts in batch_results:
            all_facts.extend(facts)
        
        return all_facts
    
    async def _extract_from_batch_async(self, batch: List[dict]) -> List[Fact]:
        """Process multiple messages in one LLM call."""
        if not batch:
            return []
        
        # Build a batch prompt
        batch_prompt = """
        Analyze the following user messages and extract any permanent facts about the user.
        For each message, return facts in this format:
        [MESSAGE_INDEX] Fact: <fact>. Category: <category>
        
        Categories: preference, project, user_info, goal, other.
        If a message has no facts, skip it.
        
        Messages:
        """
        
        for item in batch:
            msg = item['message']
            ctx = item['context']
            idx = item['index']
            batch_prompt += f"\n[{idx}] Context: {ctx[:100]}... | User: {msg.content[:200]}..."
        
        batch_prompt += "\n\nExtract facts:"
        
        response = await self.llm_client.generate_async(batch_prompt)
        
        # Parse batch response
        facts = []
        lines = response.split('\n')
        
        for line in lines:
            if '[' not in line or 'Fact:' not in line:
                continue
            
            try:
                # Extract index
                idx_str = line[line.find('[')+1:line.find(']')]
                msg_idx = int(idx_str)
                
                # Find the corresponding message
                msg_item = next((item for item in batch if item['index'] == msg_idx), None)
                if not msg_item:
                    continue
                
                # Parse fact
                if "Fact:" in line and "Category:" in line:
                    parts = line.split("Category:")
                    content = parts[0].split("Fact:")[1].strip()
                    category = parts[1].strip()
                    
                    facts.append(Fact(
                        content=content,
                        category=category,
                        source_message_id=msg_item['message'].metadata.get('id') if msg_item['message'].metadata else None,
                        timestamp=msg_item['message'].timestamp
                    ))
            except Exception as e:
                # Skip malformed lines
                continue
        
        return facts
    
    def extract_facts(self, messages: List[Message]) -> List[Fact]:
        """Synchronous wrapper that uses async internally."""
        import asyncio
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        return loop.run_until_complete(self.extract_facts_async(messages))
