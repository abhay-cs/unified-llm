# Unified LLM Workspace

A system to import chat history from LLM platforms (ChatGPT, Claude), extract structured memory facts, and use them to augment LLM responses.

## 📚 Documentation

**New to the project?** Check out the [docs/](docs/) directory:
- **[Simple Flow Guide](docs/SIMPLE_FLOW.md)** - Start here! Visual guide to how everything works
- **[Module Reference](docs/MODULE_REFERENCE.md)** - Quick lookup for what each file does
- **[Architecture Guide](docs/ARCHITECTURE_BREAKDOWN.md)** - Detailed technical documentation

## Phase 1 (MVP) Features
- Import ChatGPT and Claude chat exports.
- Extract key facts (preferences, project info) using an LLM agent.
- Store facts in a vector database (Pinecone) or local mock storage.
- Retrieve relevant context for new user prompts.

## Setup
1. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`.
   - Fill in your API keys (`DEEPSEEK_API_KEY`, `PINECONE_API_KEY`, etc.).

## Usage

### Run the Server
```bash
python server.py
```
The API will be available at `http://localhost:8000`.

### Import Data
You can import chat history exports via the `/import` endpoint:
```bash
curl -X POST -F "file=@/path/to/conversations.json" "http://localhost:8000/import?type=chatgpt"
```

### Query Memory
```bash
curl -X POST "http://localhost:8000/query" -H "Content-Type: application/json" -d '{"query": "What is my project about?"}'
```
