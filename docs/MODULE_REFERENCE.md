# Module Reference - Quick Lookup

## 📋 File-by-File Breakdown

### Core Data Models

| File | Purpose | Key Classes/Functions | Input | Output | Used By |
|------|---------|----------------------|-------|--------|---------|
| `models.py` | Data structures | `Message`, `Conversation`, `Fact` | - | Data classes | ALL modules |

**Details:**
- `Message`: Single chat message (role, content, timestamp)
- `Conversation`: Collection of messages (id, title, messages[])
- `Fact`: Extracted knowledge (content, category, metadata)

---

### Service Initialization

| File | Purpose | Key Classes/Functions | Input | Output | Used By |
|------|---------|----------------------|-------|--------|---------|
| `factory.py` | Creates all services | `ServiceFactory`, `get_services()` | - | Dict of services | `main.py`, `server.py` |

**What it creates:**
1. `EmbeddingService` - Text → vectors
2. `VectorStore` - Stores vectors
3. `LLMClient` - LLM API wrapper
4. `MemoryExtractor` - Extracts facts
5. `RetrievalService` - Semantic search
6. `GraphService` - Knowledge graph
7. `PersonaEngine` - Persona generation

---

### Import System

| File | Purpose | Key Classes/Functions | Input | Output | Used By |
|------|---------|----------------------|-------|--------|---------|
| `importers/base_importer.py` | Base interface | `BaseImporter` (abstract) | - | Interface | Other importers |
| `importers/chatgpt_importer.py` | ChatGPT parser | `ChatGPTImporter.import_data()` | JSON file path | `List[Conversation]` | `main.py`, `server.py` |
| `importers/claude_importer.py` | Claude parser | `ClaudeImporter.import_data()` | JSON file path | `List[Conversation]` | `main.py`, `server.py` |

**How it works:**
- Reads JSON export file
- Parses platform-specific format
- Converts to standard `Conversation` objects

---

### Memory Extraction

| File | Purpose | Key Classes/Functions | Input | Output | Used By |
|------|---------|----------------------|-------|--------|---------|
| `memory/extractor.py` | Fact extraction | `LLMClient`, `MemoryExtractor` | `List[Message]` | `List[Fact]` | `main.py`, `server.py` |

**Key Methods:**
- `LLMClient.generate_async(messages)` - Calls LLM API
- `MemoryExtractor.extract_facts_async(messages)` - Main extraction
  - Filters messages
  - Batches (10 per batch)
  - Sends to LLM
  - Parses response

**Process:**
```
Messages → Filter → Batch → LLM → Parse → Facts
```

---

### Storage System

| File | Purpose | Key Classes/Functions | Input | Output | Used By |
|------|---------|----------------------|-------|--------|---------|
| `storage/embeddings.py` | Text → vectors | `LocalEmbeddingService.embed()` | `List[str]` | `List[List[float]]` | `vector_store.py` |
| `storage/vector_store.py` | Vector database | `VectorStore.add_facts()`, `VectorStore.search()` | `List[Fact]` or `str` | Stored/Retrieved facts | `retrieval/`, `graph/` |

**How it works:**
- `add_facts()`: Facts → Text → Embeddings → Pinecone
- `search()`: Query → Embedding → Pinecone search → Similar facts

**Storage Options:**
- Pinecone (cloud) - if API key provided
- Mock (in-memory) - if no API key

---

### Retrieval System

| File | Purpose | Key Classes/Functions | Input | Output | Used By |
|------|---------|----------------------|-------|--------|---------|
| `retrieval/retriever.py` | Semantic search | `RetrievalService.retrieve()` | Query string | `List[Fact]` | `rag_engine.py` |

**How it works:**
- Takes user query
- Uses `VectorStore.search()` to find similar facts
- Returns top-k most relevant facts

---

### RAG System

| File | Purpose | Key Classes/Functions | Input | Output | Used By |
|------|---------|----------------------|-------|--------|---------|
| `rag_engine.py` | RAG orchestration | `RAGEngine.generate_response()` | Query string | `RAGResponse` (answer + facts) | `main.py`, `server.py` |

**Process:**
1. Retrieve relevant facts
2. Build context string
3. Send to LLM with context
4. Return answer

---

### Graph System

| File | Purpose | Key Classes/Functions | Input | Output | Used By |
|------|---------|----------------------|-------|--------|---------|
| `graph/service.py` | Knowledge graph | `GraphService.build_graph()`, `get_graph_data()` | - | Graph data (nodes, links) | `persona.py`, `server.py` |
| `graph/persona.py` | Persona generation | `PersonaEngine.generate_persona()` | - | Persona JSON | `server.py` |

**How it works:**
- `GraphService`: Fetches facts → Creates NetworkX graph → Returns for visualization
- `PersonaEngine`: Gets facts → Groups by category → Sends to LLM → Returns persona

---

### Entry Points

| File | Purpose | Key Functions | Input | Output | Used By |
|------|---------|--------------|-------|--------|---------|
| `main.py` | CLI tool | `main()` | Command-line args | Console output | User (terminal) |
| `server.py` | Web API | FastAPI endpoints | HTTP requests | JSON responses | `web-ui/` |

**Endpoints:**
- `GET /health` - Health check
- `GET /stats` - Statistics
- `POST /query` - Query memory
- `GET /facts` - List facts
- `POST /import` - Import chat history
- `GET /graph` - Get graph data
- `GET /persona` - Generate persona

---

## 🔗 Dependency Chain

```
models.py (base)
    │
    ├─► importers/ (uses Message, Conversation)
    │   └─► Used by: main.py, server.py
    │
    ├─► memory/extractor.py (uses Message, Fact)
    │   └─► Used by: factory.py, main.py, server.py
    │
    ├─► storage/
    │   ├─► embeddings.py (standalone)
    │   └─► vector_store.py (uses Fact, embeddings)
    │       └─► Used by: retrieval/, graph/, factory.py
    │
    ├─► retrieval/retriever.py (uses vector_store)
    │   └─► Used by: rag_engine.py
    │
    ├─► rag_engine.py (uses retriever, LLMClient)
    │   └─► Used by: main.py, server.py
    │
    └─► graph/
        ├─► service.py (uses vector_store, Fact)
        └─► persona.py (uses service, LLMClient)
            └─► Used by: server.py
```

---

## 📊 Data Flow Summary

### Import Flow
```
JSON File
  → Importer → List[Conversation]
  → MemoryExtractor → List[Fact]
  → VectorStore → Stored in Pinecone
```

### Query Flow
```
User Query
  → RetrievalService → List[Fact]
  → RAGEngine → Context + Query
  → LLMClient → Answer
```

### Graph Flow
```
VectorStore
  → GraphService → Graph Data
  → Frontend → Visualization
```

### Persona Flow
```
GraphService
  → PersonaEngine → Facts by Category
  → LLMClient → Persona JSON
```

---

## 🎯 Common Operations

### How to import chat history:
1. Use `ChatGPTImporter` or `ClaudeImporter`
2. Call `import_data(file_path)` → gets `List[Conversation]`
3. For each conversation, call `MemoryExtractor.extract_facts()`
4. Call `VectorStore.add_facts()` to store

### How to query:
1. Create `RAGEngine` with `RetrievalService` and `LLMClient`
2. Call `generate_response(query)` → gets `RAGResponse`
3. Response contains answer and retrieved facts

### How to get graph:
1. Get `GraphService` from factory
2. Call `build_graph()` (if not built)
3. Call `get_graph_data()` → gets nodes and links

### How to get persona:
1. Get `PersonaEngine` from factory
2. Call `generate_persona()` → gets persona JSON

---

## 🔑 Key Concepts

| Concept | What It Is | Where Used |
|---------|-----------|------------|
| **Embedding** | Text as numbers (vector) | `storage/embeddings.py` |
| **Vector Store** | Database for vectors | `storage/vector_store.py` |
| **Semantic Search** | Find by meaning, not words | `retrieval/retriever.py` |
| **RAG** | Retrieve + Augment + Generate | `rag_engine.py` |
| **Knowledge Graph** | Facts as connected nodes | `graph/service.py` |
| **Factory Pattern** | Centralized service creation | `factory.py` |

---

## 🚀 Quick Start Guide

**To understand the codebase:**

1. **Start with `models.py`** - Understand data structures
2. **Read `factory.py`** - See how services are created
3. **Follow import flow:**
   - `importers/` → `memory/extractor.py` → `storage/vector_store.py`
4. **Follow query flow:**
   - `retrieval/retriever.py` → `rag_engine.py`
5. **Check entry points:**
   - `main.py` (CLI) or `server.py` (API)

**To add a feature:**

1. Identify which module it belongs to
2. Check dependencies (what it needs)
3. Check who uses it (what depends on it)
4. Follow existing patterns

---

## 📝 Notes

- **Factory Pattern**: All services created in one place
- **Dependency Injection**: Services passed to constructors
- **Async Processing**: Used for LLM calls and batch processing
- **Mock Mode**: Works without external APIs (Pinecone, DeepSeek)
- **Extensible**: Easy to add new importers, storage backends, etc.

