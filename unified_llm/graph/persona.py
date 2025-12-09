from typing import Dict, Any
from unified_llm.memory.extractor import LLMClient
from unified_llm.graph.service import GraphService

class PersonaEngine:
    def __init__(self, graph_service: GraphService, llm_client: LLMClient):
        self.graph_service = graph_service
        self.llm_client = llm_client

    async def generate_persona(self) -> Dict[str, Any]:
        """
        Generates a persona summary (Bio, Traits) based on the current graph.
        """
        # 1. Get Graph Data
        # We'll use the nodes' content to summarize.
        if not self.graph_service._built:
            self.graph_service.build_graph()
            
        nodes = self.graph_service.graph.nodes(data=True)
        
        # Collect content by category
        categories = {}
        for _, attrs in nodes:
            cat = attrs.get('category', 'other')
            content = attrs.get('full_content', '')
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(content)
            
        # 2. Construct Prompt
        # Limit content to avoid context window overflow
        summary_text = ""
        for cat, items in categories.items():
            summary_text += f"\n## {cat.upper()}\n"
            # Take top 5 items per category for now
            for item in items[:5]:
                summary_text += f"- {item}\n"
                
        prompt = f"""
        You are an AI analyzing a user's digital memory to construct a "Digital Persona".
        Based on the following facts about the user, generate a structured profile.
        
        User Facts:
        {summary_text}
        
        Output Format (JSON):
        {{
            "bio": "A short, professional biography (3-4 sentences).",
            "traits": {{
                "role": "Primary professional role",
                "skills": ["Skill 1", "Skill 2", ...],
                "interests": ["Interest 1", "Interest 2", ...]
            }},
            "key_themes": ["Theme 1", "Theme 2"]
        }}
        
        Ensure the tone is professional yet personal.
        """
        
        # 3. Generate
        # We need to ensure we get JSON back. 
        # For DeepSeek, we might need to be careful with parsing if it's not strict JSON mode.
        response = await self.llm_client.generate_async(
            messages=[{"role": "user", "content": prompt}]
        )
        
        # Simple parsing (robustness needed in prod)
        import json
        import re
        
        content = response.content
        try:
            # Try to find JSON block
            match = re.search(r'\{.*\}', content, re.DOTALL)
            if match:
                json_str = match.group(0)
                data = json.loads(json_str)
                return data
            else:
                # Fallback
                return {
                    "bio": content, 
                    "traits": {}, 
                    "error": "Could not parse JSON"
                }
        except Exception as e:
            return {
                "bio": "Error generating persona.",
                "traits": {},
                "error": str(e)
            }
