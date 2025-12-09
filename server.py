import os
import shutil
import tempfile
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from unified_llm.factory import get_services
from unified_llm.rag_engine import RAGEngine
from unified_llm.importers.chatgpt_importer import ChatGPTImporter
from unified_llm.importers.claude_importer import ClaudeImporter

# Load environment variables
load_dotenv()

app = FastAPI(title="Unified LLM Workspace API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Global State ---
services = {}
rag_engine = None

@app.on_event("startup")
async def startup_event():
    global services, rag_engine
    print("Initializing services via Factory...")
    services = get_services()
    rag_engine = RAGEngine(
        retrieval_service=services['retriever'],
        llm_client=services['llm_client']
    )
    print("Server ready.")

# --- Data Models ---

class QueryRequest(BaseModel):
    query: str
    top_k: int = 5

class QueryResponse(BaseModel):
    answer: str
    retrieved_facts: List[Any]

class FactResponse(BaseModel):
    id: str
    content: str
    category: str
    timestamp: Optional[str]
    metadata: Dict[str, Any]

class StatsResponse(BaseModel):
    total_facts: int
    storage_type: str
    index_name: Optional[str] = None

# --- Endpoints ---

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/stats", response_model=StatsResponse)
async def get_stats():
    vector_store = services.get('vector_store')
    
    count = 0
    storage_type = "unknown"
    
    if vector_store:
        if vector_store.use_mock:
            count = len(vector_store.mock_storage)
            storage_type = "mock"
        else:
            storage_type = "pinecone"
            try:
                stats = vector_store.index.describe_index_stats()
                count = stats.get('total_vector_count', 0)
            except:
                pass

    return {
        "total_facts": count,
        "storage_type": storage_type,
        "index_name": vector_store.index_name if vector_store else None
    }

@app.post("/query", response_model=QueryResponse)
async def query_memory(request: QueryRequest):
    if not rag_engine:
        raise HTTPException(status_code=503, detail="Components not initialized")
    
    # Use RAG Engine
    response = await rag_engine.generate_response_async(request.query, top_k=request.top_k)
    
    return {
        "answer": response.answer,
        "retrieved_facts": response.retrieved_facts
    }

@app.get("/graph")
async def get_graph():
    """Returns the knowledge graph data for visualization."""
    graph_service = services.get('graph_service')
    if not graph_service:
        raise HTTPException(status_code=503, detail="Graph service not initialized")
    
    return graph_service.get_graph_data()

@app.get("/persona")
async def get_persona():
    """Generates and returns the digital persona."""
    persona_engine = services.get('persona_engine')
    if not persona_engine:
        raise HTTPException(status_code=503, detail="Persona engine not initialized")
    
    return await persona_engine.generate_persona()

@app.get("/facts", response_model=List[FactResponse])
async def list_facts(limit: int = 50, offset: int = 0):
    vector_store = services.get('vector_store')
    facts_list = []
    

    if vector_store and vector_store.use_mock:
        all_facts = vector_store.mock_storage
        sliced = all_facts[offset : offset + limit]
        
        for f_data in sliced:
            # Parsing content stored as "Category: Content"
            raw_content = f_data.get('content', '')
            cat = 'general'
            content = raw_content
            if ':' in raw_content:
                parts = raw_content.split(':', 1)
                cat = parts[0].strip()
                content = parts[1].strip()

            facts_list.append(FactResponse(
                id=f_data.get('id', 'mock_id'),
                content=content,
                category=cat,
                timestamp=f_data.get('timestamp'),
                metadata=f_data.get('metadata', {})
            ))
            
    elif vector_store and not vector_store.use_mock:
        try:
            dummy_vector = [0.1] * 384
            results = vector_store.index.query(
                vector=dummy_vector,
                top_k=limit,
                include_metadata=True
            )
            
            for match in results['matches']:
                meta = match['metadata']
                facts_list.append(FactResponse(
                    id=match['id'],
                    content=meta.get('content', ''),
                    category=meta.get('category', 'general'),
                    timestamp=meta.get('timestamp'),
                    metadata=meta
                ))
        except Exception as e:
            print(f"Error listing facts from Pinecone: {e}")

    return facts_list

async def process_import_background(file_path: str, importer_type: str):
    """Background task to process the import."""
    print(f"Starting background import for {file_path} ({importer_type})")
    
    # We need to get services here as well, but they should be initialized by startup
    # However, if this runs in a separate thread/process, we might need to be careful.
    # FastAPI background tasks run in the same loop, so globals should be fine.
    
    extractor = services.get('extractor')
    vector_store = services.get('vector_store')
    
    if not extractor or not vector_store:
        print("Services not ready for import.")
        return

    try:
        if importer_type == 'chatgpt':
            importer = ChatGPTImporter()
        elif importer_type == 'claude':
            importer = ClaudeImporter()
        else:
            print(f"Unknown importer type: {importer_type}")
            return

        conversations = importer.import_data(file_path)
        print(f"Imported {len(conversations)} conversations.")
        
        total_facts = 0
        for i, conv in enumerate(conversations):
            filtered_msgs = [
                m for m in conv.messages 
                if m.content and len(m.content) > 20 
                and m.role in ('user', 'assistant')
            ]
            
            if not filtered_msgs:
                continue
                
            facts = await extractor.extract_facts_async(filtered_msgs)
            
            if facts:
                vector_store.add_facts(facts)
                total_facts += len(facts)
                print(f"Conv {i+1}/{len(conversations)}: Extracted {len(facts)} facts.")
        
        print(f"Import finished. Total facts: {total_facts}")
        
    except Exception as e:
        print(f"Error during import: {e}")
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

@app.post("/import")
async def import_data(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...), 
    type: str = "chatgpt"
):
    if type not in ["chatgpt", "claude"]:
        raise HTTPException(status_code=400, detail="Invalid type. Must be 'chatgpt' or 'claude'")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name
    
    background_tasks.add_task(process_import_background, tmp_path, type)
    
    return {"status": "processing_started", "message": "Import started in background"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
