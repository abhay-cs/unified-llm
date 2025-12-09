import networkx as nx
from typing import List, Dict, Any, Optional
from unified_llm.models import Fact
from unified_llm.storage.vector_store import VectorStore

class GraphService:
    def __init__(self, vector_store: VectorStore):
        self.vector_store = vector_store
        self.graph = nx.Graph()
        self._built = False

    def build_graph(self, force_refresh: bool = False):
        """
        Builds the graph from facts in the vector store.
        For MVP, we rebuild from scratch or update.
        """
        if self._built and not force_refresh:
            return

        print("Building Knowledge Graph...")
        self.graph.clear()
        
        # 1. Fetch all facts
        # Note: In a real large-scale system, we wouldn't fetch all.
        # We'd use a graph DB or build incrementally.
        facts = self._fetch_all_facts()
        
        # 2. Add Nodes
        for fact in facts:
            self.graph.add_node(
                fact.id, 
                label=fact.content[:50] + "...", 
                full_content=fact.content,
                category=fact.category,
                type="fact"
            )
            
        # 3. Add Edges (Similarity-based)
        # This is O(N^2) naive implementation. 
        # For < 1000 nodes it's fine. For more, we need optimization.
        # We can use the vector store to find nearest neighbors for each node instead.
        
        # Optimization: Use vector store query for each node to find connections
        # This might be slow if we have many nodes.
        # Let's try a simpler approach for the MVP:
        # If we have local vectors, we can compute similarity matrix.
        # If we rely on Pinecone, we might just link nodes that share same category for now,
        # or rely on a "topic" clustering if we had it.
        
        # MVP Strategy: Link nodes with same category
        # And maybe link nodes that mention same entities (if we had entity extraction).
        
        # Let's do a simple category linking for now to have *some* edges.
        # And maybe a random connection for "discovery" (just kidding).
        
        # Better MVP Strategy:
        # Since we can't easily get all vectors from Pinecone to compute similarity locally without cost,
        # we will just visualize the nodes and maybe cluster by category.
        
        print(f"Graph built with {self.graph.number_of_nodes()} nodes.")
        self._built = True

    def _fetch_all_facts(self) -> List[Fact]:
        """Helper to get all facts from storage."""
        facts = []
        if self.vector_store.use_mock:
            # mock_storage is a List[Dict]
            for f_data in self.vector_store.mock_storage:
                facts.append(Fact(
                    content=f_data.get('content', ''),
                    # Try to retrieve category from content string if not stored separately
                    # The mock storage stores 'content' as "Category: Content"
                    category=f_data.get('content', '').split(':')[0] if ':' in f_data.get('content', '') else 'general',
                    metadata=f_data.get('metadata', {}),
                    id=str(uuid.uuid4()) # storage doesn't keep IDs in mock mode easily
                ))
                # Try to clean up content
                if ':' in facts[-1].content:
                     facts[-1].content = facts[-1].content.split(':', 1)[1].strip()
        else:
            # Pinecone - fetch dummy query to get some
            try:
                dummy_vector = [0.1] * 384
                results = self.vector_store.index.query(
                    vector=dummy_vector,
                    top_k=100, # Limit for graph viz
                    include_metadata=True
                )
                for match in results['matches']:
                    meta = match['metadata']
                    f = Fact(
                        content=meta.get('content', ''),
                        category=meta.get('category', 'general'),
                        metadata=meta
                    )
                    f.id = match['id']
                    facts.append(f)
            except Exception as e:
                print(f"Error fetching facts for graph: {e}")
                
        return facts

    def get_graph_data(self) -> Dict[str, List[Any]]:
        """
        Returns data in format suitable for react-force-graph-2d.
        {
            "nodes": [{ "id": "1", "group": 1 }, ...],
            "links": [{ "source": "1", "target": "2" }, ...]
        }
        """
        if not self._built:
            self.build_graph()
            
        nodes = []
        for node_id, attrs in self.graph.nodes(data=True):
            nodes.append({
                "id": node_id,
                "name": attrs.get('label', 'Unknown'),
                "val": 1,
                "group": attrs.get('category', 'other'),
                "full_content": attrs.get('full_content', '')
            })
            
        links = []
        for u, v in self.graph.edges():
            links.append({
                "source": u,
                "target": v
            })
            
        return {"nodes": nodes, "links": links}
