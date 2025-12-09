# Quick Fix Checklist for Codebase Understanding

## 🚨 Critical Fixes (Will Break at Runtime)

- [ ] **Fix RetrievalService.retrieve()** - Add missing method that returns `List[Fact]`
  - File: `unified_llm/retrieval/retriever.py`
  - Currently only has `retrieve_context()` which returns `List[str]`
  - Called by: `rag_engine.py:25, 56`

- [ ] **Fix LLMClient.generate_async() signature** - Change to accept `messages` parameter
  - File: `unified_llm/memory/extractor.py:19`
  - Currently: `async def generate_async(self, prompt: str) -> str`
  - Should be: `async def generate_async(self, messages: List[Dict[str, str]]) -> str`
  - Also fix `generate()` method similarly
  - Called by: `rag_engine.py:70`, `graph/persona.py:63`

- [ ] **Fix vector_store.local_storage reference** - Change to `mock_storage`
  - File: `unified_llm/graph/service.py:67`
  - File: `server.py:134`
  - `mock_storage` is a list, not dict - may need to restructure access

- [ ] **Add `id` field to Fact model**
  - File: `unified_llm/models.py:21`
  - Add: `id: Optional[str] = None`
  - Used by: `graph/service.py:31, 74, 91`

- [ ] **Fix duplicate __init__ in OpenAIEmbeddingService**
  - File: `unified_llm/storage/embeddings.py:16-22`
  - Remove duplicate, fix initialization logic

## 📝 Documentation Fixes

- [ ] **Create .env.example file**
  - Add: `DEEPSEEK_API_KEY`, `PINECONE_API_KEY`, `OPENAI_API_KEY`

- [ ] **Update README.md**
  - Fix: Says "ChromaDB" but uses Pinecone
  - Add: Usage examples
  - Add: Architecture overview
  - Complete: "Usage" section

- [ ] **Add docstrings to all public classes/methods**
  - Priority: `ServiceFactory`, `VectorStore`, `RAGEngine`, `MemoryExtractor`

## 🔧 Code Quality Improvements

- [ ] **Add comprehensive type hints**
  - All method return types
  - Function parameters
  - Class attributes

- [ ] **Extract magic numbers to constants**
  - `384` (embedding dimension) → `EMBEDDING_DIMENSION = 384`
  - `"all-MiniLM-L6-v2"` → `DEFAULT_EMBEDDING_MODEL`
  - `"deepseek-chat"` → `DEFAULT_LLM_MODEL`
  - Batch sizes, top_k limits, etc.

- [ ] **Standardize error handling**
  - Decide: exceptions vs return values
  - Add context to error messages
  - Use consistent patterns

- [ ] **Fix mock_storage structure**
  - Currently a list, but code expects dict-like access
  - Either change to dict or fix access patterns

## 🎯 Quick Wins (Easy Improvements)

- [ ] Remove unused imports (`Optional, Tuple` in factory.py)
- [ ] Add input validation to API endpoints
- [ ] Improve error messages with context
- [ ] Add comments explaining complex logic
- [ ] Rename confusing methods (`retrieve_context` vs `retrieve`)

## 📊 Testing & Validation

- [ ] Add file upload validation (size, format)
- [ ] Add query parameter validation
- [ ] Add import file structure validation
- [ ] Add unit tests for critical paths


