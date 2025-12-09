# Simple Program Flow - Visual Guide

## 🎬 Main User Flows

### Flow 1: Import Chat History (Most Common)

```
┌─────────────────────────────────────────────────────────────┐
│ USER UPLOADS: conversations.json (ChatGPT/Claude export)    │
└───────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Parser (ChatGPTImporter or ClaudeImporter)          │
│                                                              │
│ Reads JSON file                                              │
│ Converts to: List[Conversation]                              │
│ Each Conversation has: id, title, List[Message]             │
└───────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Fact Extractor (MemoryExtractor)                    │
│                                                              │
│ Takes: List[Message]                                         │
│ Filters: Removes "hi", "thanks", short messages              │
│ Batches: Groups 10 messages together                        │
│ Sends to LLM: "Extract facts from these messages"            │
│ Gets back: "Fact: I prefer Python. Category: preference"    │
│ Returns: List[Fact]                                          │
└───────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Vector Store (VectorStore)                          │
│                                                              │
│ Takes: List[Fact]                                            │
│ Converts to text: "preference: I prefer Python"              │
│ Generates embedding: [0.1, 0.3, -0.2, ...] (384 numbers)    │
│ Stores in Pinecone: embedding + metadata                    │
│                                                              │
│ ✅ Facts are now searchable!                                 │
└─────────────────────────────────────────────────────────────┘
```

### Flow 2: Ask a Question (RAG)

```
┌─────────────────────────────────────────────────────────────┐
│ USER ASKS: "What are my preferences?"                       │
└───────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Retrieval Service (RetrievalService)               │
│                                                              │
│ Takes: "What are my preferences?"                            │
│ Converts to embedding: [0.2, 0.1, -0.3, ...]                │
│ Searches Pinecone: "Find 5 most similar facts"              │
│ Gets back:                                                   │
│   - "preference: I prefer Python"                             │
│   - "preference: I like React"                                │
│   - "preference: I use VS Code"                              │
└───────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: RAG Engine (RAGEngine)                              │
│                                                              │
│ Builds context:                                              │
│   "Retrieved Facts:                                          │
│    - preference: I prefer Python                             │
│    - preference: I like React                                 │
│    - preference: I use VS Code"                              │
│                                                              │
│ Sends to LLM:                                                │
│   System: "You have access to user's memory: [facts]"        │
│   User: "What are my preferences?"                           │
└───────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: LLM Generates Answer                                │
│                                                              │
│ LLM Response:                                                │
│   "Based on your memory, your preferences include:           │
│    - Python as your programming language                     │
│    - React for frontend development                          │
│    - VS Code as your editor"                                │
└───────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ USER SEES: Answer + Retrieved Facts                          │
└─────────────────────────────────────────────────────────────┘
```

### Flow 3: View Knowledge Graph

```
┌─────────────────────────────────────────────────────────────┐
│ USER CLICKS: "View Graph"                                    │
└───────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Graph Service (GraphService)                                │
│                                                              │
│ Fetches all facts from Vector Store                          │
│ Creates nodes: One node per fact                             │
│ Creates edges: Links between related facts                    │
│ Returns: {nodes: [...], links: [...]}                        │
└───────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend Visualizes                                          │
│                                                              │
│ Shows interactive graph with:                                 │
│   - Nodes (facts) as circles                                 │
│   - Edges (relationships) as lines                           │
│   - Click to see fact details                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ How Modules Connect

### Simple View:

```
┌──────────────┐
│   models.py  │  ← Base data structures (Message, Conversation, Fact)
└──────┬───────┘
       │
       │ Used by everyone
       │
┌──────▼──────────────────────────────────────────────┐
│              factory.py                             │
│  (Creates all services in correct order)            │
└───┬───┬───┬───┬───┬───┬───┬───────────────────────┘
    │   │   │   │   │   │   │
    │   │   │   │   │   │   └──► rag_engine.py
    │   │   │   │   │   │        (Uses retriever + LLM)
    │   │   │   │   │   │
    │   │   │   │   │   └──► graph/
    │   │   │   │   │         (Uses vector_store)
    │   │   │   │   │
    │   │   │   │   └──► retrieval/
    │   │   │   │         (Uses vector_store)
    │   │   │   │
    │   │   │   └──► memory/
    │   │   │         (Uses LLM client)
    │   │   │
    │   │   └──► storage/
    │   │         (Uses embeddings)
    │   │
    │   └──► embeddings/
    │
    └──► importers/
          (Uses models)
```

### Detailed Connections:

```
importers/
  └─► Uses: models.py (Message, Conversation)
  └─► Used by: main.py, server.py

memory/extractor.py
  └─► Uses: models.py (Message, Fact), LLM API
  └─► Used by: factory.py, main.py, server.py

storage/
  ├─► embeddings.py
  │   └─► Uses: sentence-transformers (external)
  │   └─► Used by: vector_store.py
  │
  └─► vector_store.py
      └─► Uses: embeddings.py, models.py (Fact)
      └─► Used by: retrieval/, graph/, factory.py

retrieval/retriever.py
  └─► Uses: storage/vector_store.py
  └─► Used by: rag_engine.py

rag_engine.py
  └─► Uses: retrieval/retriever.py, memory/extractor.py (LLMClient)
  └─► Used by: main.py, server.py

graph/
  ├─► service.py
  │   └─► Uses: storage/vector_store.py, models.py
  │   └─► Used by: persona.py, server.py
  │
  └─► persona.py
      └─► Uses: graph/service.py, memory/extractor.py (LLMClient)
      └─► Used by: server.py

factory.py
  └─► Uses: ALL modules (creates them)
  └─► Used by: main.py, server.py

main.py
  └─► Uses: factory.py, rag_engine.py, importers/
  └─► Entry point for CLI

server.py
  └─► Uses: factory.py, rag_engine.py, importers/
  └─► Entry point for API
  └─► Used by: web-ui/ (via HTTP)
```

---

## 📦 What Each File Does (One Sentence)

| File | What It Does |
|------|-------------|
| `models.py` | Defines data structures (Message, Conversation, Fact) |
| `factory.py` | Creates and initializes all services |
| `importers/base_importer.py` | Defines interface for importers |
| `importers/chatgpt_importer.py` | Parses ChatGPT export JSON → Conversations |
| `importers/claude_importer.py` | Parses Claude export JSON → Conversations |
| `memory/extractor.py` | Extracts facts from messages using LLM |
| `storage/embeddings.py` | Converts text to numerical vectors |
| `storage/vector_store.py` | Stores facts as vectors in Pinecone |
| `retrieval/retriever.py` | Finds similar facts to a query |
| `rag_engine.py` | Combines retrieval + generation for answers |
| `graph/service.py` | Builds knowledge graph from facts |
| `graph/persona.py` | Generates persona summary from facts |
| `main.py` | CLI tool for importing and querying |
| `server.py` | FastAPI server with REST endpoints |
| `web-ui/` | Next.js frontend interface |

---

## 🔄 Complete Import-to-Query Flow

```
START: User has ChatGPT export file

1. main.py or server.py receives file
   │
   ├─► ChatGPTImporter.import_data()
   │   └─► Reads JSON
   │   └─► Returns: [Conversation, Conversation, ...]
   │
2. For each Conversation:
   │
   ├─► MemoryExtractor.extract_facts()
   │   ├─► Filters messages
   │   ├─► Batches messages
   │   ├─► LLMClient.generate_async()
   │   │   └─► Sends to DeepSeek API
   │   │   └─► Gets: "Fact: ... Category: ..."
   │   └─► Returns: [Fact, Fact, ...]
   │
3. VectorStore.add_facts()
   │   ├─► Converts facts to text
   │   ├─► EmbeddingService.embed()
   │   │   └─► sentence-transformers model
   │   │   └─► Returns: [[0.1, 0.2, ...], ...]
   │   └─► Stores in Pinecone
   │
END: Facts are now in vector database

─────────────────────────────────────────────────────────

START: User asks "What are my preferences?"

1. RAGEngine.generate_response()
   │
   ├─► RetrievalService.retrieve()
   │   ├─► VectorStore.search()
   │   │   ├─► EmbeddingService.embed(query)
   │   │   └─► Pinecone.query()
   │   │       └─► Returns: [similar facts]
   │   └─► Returns: [Fact, Fact, ...]
   │
2. RAGEngine builds context
   │   └─► "Retrieved Facts: ..."
   │
3. LLMClient.generate_async()
   │   └─► Sends to DeepSeek API
   │   └─► Gets: "Based on your memory, ..."
   │
4. Returns answer to user

END: User sees personalized answer
```

---

## 🎯 Key Takeaways

1. **Import Flow**: JSON → Parse → Extract Facts → Store as Vectors
2. **Query Flow**: Query → Find Similar Facts → Build Context → Generate Answer
3. **Factory Pattern**: One place creates all services
4. **RAG Pattern**: Retrieve first, then generate with context
5. **Vector Search**: Embeddings enable semantic search (meaning, not words)

---

## 💡 Quick Reference

**To add a new importer:**
- Extend `BaseImporter`
- Implement `import_data()` → returns `List[Conversation]`
- Add to `main.py` and `server.py`

**To change LLM provider:**
- Modify `LLMClient` in `memory/extractor.py`
- Change API key in `.env`

**To change vector database:**
- Modify `VectorStore` in `storage/vector_store.py`
- Keep same interface (add_facts, search)

**To add new fact category:**
- Update `MemoryExtractor` prompt
- Update `Fact` model if needed

