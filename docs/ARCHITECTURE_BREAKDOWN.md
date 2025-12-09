# Architecture Breakdown - Unified LLM Memory

## 📁 Project Structure Overview

```
unified-llm/
├── main.py                    # CLI entry point
├── server.py                  # FastAPI web server entry point
├── unified_llm/              # Main package
│   ├── models.py             # Data models (Message, Conversation, Fact)
│   ├── factory.py            # Service factory (creates all services)
│   ├── rag_engine.py          # RAG orchestration
│   ├── importers/            # Chat history importers
│   ├── memory/               # Fact extraction
│   ├── storage/              # Vector database & embeddings
│   ├── retrieval/           # Semantic search
│   └── graph/                # Knowledge graph & persona
└── web-ui/                   # Next.js frontend
```

---

## 🔷 Module Breakdown

### 1. **models.py** - Data Structures
**Purpose:** Defines the core data models used throughout the application.

**What it contains:**
- `Message`: Represents a single chat message (user/assistant/system)
- `Conversation`: A collection of messages with metadata
- `Fact`: Extracted knowledge fact with category and metadata

**Connections:**
- Used by: ALL modules (importers, extractor, storage, graph)
- No dependencies on other modules

**Example:**
```python
Message(role="user", content="I prefer Python over Java")
Conversation(id="123", title="Python Discussion", messages=[...])
Fact(content="Prefers Python", category="preference")
```

---

### 2. **factory.py** - Service Initialization
**Purpose:** Creates and initializes all services using the Factory pattern (Singleton).

**What it does:**
1. Creates embedding service (for converting text to vectors)
2. Creates vector store (Pinecone or mock)
3. Creates LLM client (DeepSeek API)
4. Creates extractor (for fact extraction)
5. Creates retriever (for semantic search)
6. Creates graph service (for knowledge graph)
7. Creates persona engine (for persona generation)

**Key Class:**
- `ServiceFactory`: Singleton that manages all service creation

**Connections:**
- **Depends on:** All other modules (imports them)
- **Used by:** `main.py`, `server.py`
- **Returns:** Dictionary of all initialized services

**Initialization Order:**
```
1. EmbeddingService → 2. VectorStore → 3. LLMClient 
→ 4. MemoryExtractor → 5. RetrievalService 
→ 6. GraphService → 7. PersonaEngine
```

---

### 3. **importers/** - Chat History Import
**Purpose:** Parse and convert chat export files into standardized `Conversation` objects.

#### **base_importer.py**
- Abstract base class defining the importer interface
- All importers must implement `import_data(file_path) -> List[Conversation]`

#### **chatgpt_importer.py**
- Parses ChatGPT export JSON format
- Handles ChatGPT's tree structure (mapping nodes)
- Extracts messages from conversation threads
- **Returns:** List of `Conversation` objects

#### **claude_importer.py**
- Parses Claude export JSON format
- Handles Claude's linear message structure
- **Returns:** List of `Conversation` objects

**Connections:**
- **Depends on:** `models.py` (uses Message, Conversation)
- **Used by:** `main.py`, `server.py` (import endpoint)

**Flow:**
```
JSON File → Importer → List[Conversation] → Memory Extractor
```

---

### 4. **memory/extractor.py** - Fact Extraction
**Purpose:** Uses LLM to extract structured facts from chat messages.

**Key Classes:**
- `LLMClient`: Wrapper around OpenAI/DeepSeek API
  - `generate_async()`: Sends messages to LLM, gets response
  - `generate()`: Synchronous wrapper
  
- `MemoryExtractor`: Extracts facts from messages
  - `extract_facts_async()`: Main extraction method
  - Filters out short/greeting messages
  - Batches messages for efficiency
  - Uses LLM to identify facts (preferences, projects, etc.)

**How it works:**
1. Filters messages (removes "hi", "thanks", very short messages)
2. Batches messages together (10 per batch)
3. Sends batch to LLM with prompt: "Extract facts from these messages"
4. LLM returns facts in format: `[INDEX] Fact: ... Category: ...`
5. Parses response and creates `Fact` objects

**Connections:**
- **Depends on:** `models.py` (Message, Fact), LLM API
- **Used by:** `main.py`, `server.py` (during import)
- **Output:** List of `Fact` objects

**Flow:**
```
List[Message] → Filter → Batch → LLM → Parse → List[Fact]
```

---

### 5. **storage/** - Vector Database & Embeddings
**Purpose:** Store facts as vectors for semantic search.

#### **embeddings.py**
- Converts text to numerical vectors (embeddings)
- `LocalEmbeddingService`: Uses sentence-transformers (all-MiniLM-L6-v2)
  - Runs locally, no API needed
  - Returns 384-dimensional vectors
- `OpenAIEmbeddingService`: Uses OpenAI API (not currently used)
- `MockEmbeddingService`: Returns dummy vectors for testing

**Connections:**
- **Used by:** `vector_store.py`
- **No dependencies** on other project modules

#### **vector_store.py**
- Stores facts in vector database (Pinecone or mock)
- **Key Methods:**
  - `add_facts()`: Converts facts to embeddings, stores in Pinecone
  - `search()`: Finds similar facts using semantic search

**How it works:**
1. Takes list of `Fact` objects
2. Converts to text: `"{category}: {content}"`
3. Generates embeddings using `EmbeddingService`
4. Stores in Pinecone with metadata (category, timestamp, etc.)
5. If no Pinecone API key, uses mock storage (in-memory list)

**Connections:**
- **Depends on:** `embeddings.py`, `models.py` (Fact)
- **Used by:** `retrieval/retriever.py`, `graph/service.py`
- **Stores:** Facts as vectors for later retrieval

**Flow:**
```
List[Fact] → Convert to Text → Generate Embeddings → Store in Pinecone
```

---

### 6. **retrieval/retriever.py** - Semantic Search
**Purpose:** Retrieves relevant facts for a user query.

**Key Class:**
- `RetrievalService`: Finds similar facts to a query

**How it works:**
1. Takes user query string
2. Uses `VectorStore.search()` to find similar facts
3. Returns list of relevant facts (sorted by similarity)

**Connections:**
- **Depends on:** `storage/vector_store.py`
- **Used by:** `rag_engine.py`
- **Returns:** List of `Fact` objects (or strings, depending on method)

**Flow:**
```
User Query → Generate Query Embedding → Search Vector Store → Return Similar Facts
```

---

### 7. **rag_engine.py** - RAG Orchestration
**Purpose:** Combines retrieval and generation to answer queries.

**Key Class:**
- `RAGEngine`: Orchestrates the RAG pipeline

**How it works:**
1. Takes user query
2. Retrieves relevant facts using `RetrievalService`
3. Builds context string from retrieved facts
4. Creates prompt with context + user query
5. Sends to LLM to generate answer
6. Returns answer + retrieved facts

**Connections:**
- **Depends on:** `retrieval/retriever.py`, `memory/extractor.py` (LLMClient)
- **Used by:** `main.py`, `server.py` (query endpoint)
- **Returns:** `RAGResponse` (answer + facts)

**Flow:**
```
User Query → Retrieve Facts → Build Context → LLM Generation → Answer
```

---

### 8. **graph/** - Knowledge Graph & Persona
**Purpose:** Visualizes facts as a graph and generates persona summaries.

#### **service.py**
- `GraphService`: Builds knowledge graph from facts
- Uses NetworkX to create graph structure
- **Key Methods:**
  - `build_graph()`: Fetches all facts, creates nodes
  - `get_graph_data()`: Returns nodes/links for visualization

**How it works:**
1. Fetches all facts from vector store
2. Creates graph nodes (one per fact)
3. Adds edges (currently minimal - MVP)
4. Returns data for frontend visualization

**Connections:**
- **Depends on:** `storage/vector_store.py`, `models.py`
- **Used by:** `server.py` (graph endpoint), `persona.py`

#### **persona.py**
- `PersonaEngine`: Generates user persona from facts
- **How it works:**
  1. Gets all facts from graph
  2. Groups by category
  3. Sends to LLM: "Generate persona from these facts"
  4. Returns structured persona (bio, traits, skills, etc.)

**Connections:**
- **Depends on:** `graph/service.py`, `memory/extractor.py` (LLMClient)
- **Used by:** `server.py` (persona endpoint)

---

### 9. **main.py** - CLI Entry Point
**Purpose:** Command-line interface for importing and querying.

**What it does:**
1. Parses command-line arguments
2. Initializes services via Factory
3. If `--import-file`: Imports chat history, extracts facts, stores them
4. If `--query`: Queries the system using RAG
5. If `--interactive`: Interactive chat mode

**Connections:**
- **Depends on:** `factory.py`, `rag_engine.py`, `importers/`
- **Uses:** All services for import and query

**Usage:**
```bash
python main.py --import-file chat.json --type chatgpt
python main.py --query "What are my preferences?"
python main.py --interactive
```

---

### 10. **server.py** - Web API Server
**Purpose:** FastAPI server that provides REST API for frontend.

**Endpoints:**
- `GET /health` - Health check
- `GET /stats` - System statistics (total facts, storage type)
- `POST /query` - Query memory (uses RAG)
- `GET /facts` - List stored facts
- `POST /import` - Import chat history (background task)
- `GET /graph` - Get knowledge graph data
- `GET /persona` - Generate persona summary

**Connections:**
- **Depends on:** `factory.py`, `rag_engine.py`, `importers/`
- **Used by:** Frontend (web-ui) via HTTP requests

**Flow:**
```
Frontend Request → FastAPI Endpoint → Service → Response
```

---

### 11. **web-ui/** - Frontend Application
**Purpose:** Next.js React frontend for user interface.

**Pages:**
- `/` - Landing page with stats
- `/import` - Import chat history
- `/chat` - Query interface
- `/memory` - Browse stored facts

**Connections:**
- **Depends on:** `server.py` (API calls via axios)
- **No direct Python dependencies**

---

## 🔄 Program Flow

### Flow 1: Importing Chat History

```
1. User uploads JSON file (ChatGPT/Claude export)
   ↓
2. server.py receives file → Background task
   ↓
3. Importer (ChatGPTImporter/ClaudeImporter) parses JSON
   ↓
4. Returns List[Conversation] objects
   ↓
5. For each Conversation:
   ↓
6. MemoryExtractor.extract_facts_async()
   - Filters messages (removes short/greeting)
   - Batches messages (10 per batch)
   - Sends to LLM: "Extract facts from these messages"
   - LLM returns facts in structured format
   - Parses and creates Fact objects
   ↓
7. VectorStore.add_facts()
   - Converts facts to text: "{category}: {content}"
   - Generates embeddings (384-dim vectors)
   - Stores in Pinecone with metadata
   ↓
8. Facts are now searchable in vector database
```

### Flow 2: Querying the System (RAG)

```
1. User asks question: "What are my preferences?"
   ↓
2. RAGEngine.generate_response()
   ↓
3. RetrievalService.retrieve()
   - Converts query to embedding
   - Searches VectorStore for similar facts
   - Returns top 5 most relevant facts
   ↓
4. RAGEngine builds context:
   "Retrieved Facts:
   - preference: I prefer Python over Java
   - preference: I like working with React
   ..."
   ↓
5. RAGEngine sends to LLM:
   System: "You are a helpful assistant with access to user's memory.
            Use these facts to answer: [facts]"
   User: "What are my preferences?"
   ↓
6. LLM generates answer using context
   ↓
7. Returns RAGResponse(answer, retrieved_facts)
```

### Flow 3: Building Knowledge Graph

```
1. User requests graph visualization
   ↓
2. GraphService.build_graph()
   ↓
3. Fetches all facts from VectorStore
   ↓
4. Creates NetworkX graph:
   - Each fact = node
   - Edges = relationships (MVP: minimal)
   ↓
5. Returns graph data (nodes + links)
   ↓
6. Frontend visualizes using react-force-graph
```

### Flow 4: Generating Persona

```
1. User requests persona
   ↓
2. PersonaEngine.generate_persona()
   ↓
3. Gets all facts from GraphService
   ↓
4. Groups facts by category
   ↓
5. Sends to LLM:
   "Generate persona from these facts:
   ## preference
   - I prefer Python
   - I like React
   ..."
   ↓
6. LLM returns structured JSON:
   {
     "bio": "...",
     "traits": {...},
     "key_themes": [...]
   }
   ↓
7. Returns persona to frontend
```

---

## 🔗 Module Dependency Graph

```
┌─────────────┐
│  models.py  │ (No dependencies - base data structures)
└──────┬──────┘
       │
       ├─────────────────────────────────────────────┐
       │                                             │
┌──────▼──────┐                              ┌──────▼──────┐
│ importers/  │                              │  factory.py │
│             │                              │             │
│ - base      │                              │ Creates all │
│ - chatgpt   │                              │ services    │
│ - claude    │                              └──────┬──────┘
└──────┬──────┘                                     │
       │                                            │
       │                                            ├──► storage/
       │                                            │    - embeddings.py
       │                                            │    - vector_store.py
       │                                            │
       │                                            ├──► memory/
       │                                            │    - extractor.py
       │                                            │
       │                                            ├──► retrieval/
       │                                            │    - retriever.py
       │                                            │
       │                                            ├──► graph/
       │                                            │    - service.py
       │                                            │    - persona.py
       │                                            │
       │                                            └──► rag_engine.py
       │
┌──────▼──────┐                              ┌──────▼──────┐
│  main.py    │                              │ server.py   │
│ (CLI)       │                              │ (API)       │
└─────────────┘                              └──────┬──────┘
                                                      │
                                              ┌───────▼───────┐
                                              │   web-ui/     │
                                              │  (Frontend)    │
                                              └───────────────┘
```

---

## 🎯 Key Design Patterns

### 1. **Factory Pattern** (`factory.py`)
- Centralized service creation
- Singleton ensures one instance
- Lazy initialization

### 2. **Strategy Pattern** (Importers)
- Base class defines interface
- Different implementations (ChatGPT, Claude)
- Easy to add new importers

### 3. **Dependency Injection**
- Services passed to constructors
- Easy to test (can inject mocks)
- Loose coupling

### 4. **RAG Pattern** (`rag_engine.py`)
- Retrieve → Augment → Generate
- Standard pattern for LLM applications

---

## 📊 Data Flow Summary

```
Import Flow:
JSON → Conversation → Message → Fact → Embedding → Vector DB

Query Flow:
Query → Embedding → Vector Search → Facts → Context → LLM → Answer

Graph Flow:
Vector DB → Facts → Graph Nodes → Visualization

Persona Flow:
Graph → Facts → LLM → Persona JSON
```

---

## 🔑 Key Concepts Explained

### **Embeddings**
- Text converted to numbers (vectors)
- Similar text = similar vectors
- Enables semantic search (find meaning, not exact words)

### **Vector Database (Pinecone)**
- Stores vectors (embeddings)
- Fast similarity search
- Returns most similar items to a query

### **RAG (Retrieval-Augmented Generation)**
- Retrieve relevant context first
- Then generate answer with context
- More accurate than LLM alone

### **Knowledge Graph**
- Facts as nodes
- Relationships as edges
- Visual representation of knowledge

---

This architecture allows the system to:
1. Import from multiple platforms
2. Extract structured knowledge
3. Store for semantic search
4. Retrieve relevant context
5. Generate personalized responses
6. Visualize knowledge
7. Generate persona summaries

