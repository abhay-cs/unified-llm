# Documentation Index

This directory contains all documentation for the Unified LLM project.

## 📚 Quick Start Guides

- **[Simple Flow Guide](SIMPLE_FLOW.md)** - Visual guide showing how the system works (start here!)
- **[Module Reference](MODULE_REFERENCE.md)** - Quick lookup for what each file does
- **[Architecture Breakdown](ARCHITECTURE_BREAKDOWN.md)** - Detailed technical architecture

## 🛠️ Development & Maintenance

- **[Codebase Issues](UNDERSTANDABILITY_ISSUES.md)** - Known issues and problems
- **[Improvement Suggestions](CODEBASE_IMPROVEMENTS.md)** - Improvements needed
- **[Quick Fix Checklist](QUICK_FIX_CHECKLIST.md)** - Critical fixes to apply

## 📁 Project Structure

```
unified-llm/
├── README.md                    # Main project README (start here)
├── main.py                      # CLI entry point
├── server.py                    # FastAPI server
├── unified_llm/                 # Main Python package
│   ├── models.py               # Data models
│   ├── factory.py              # Service factory
│   ├── rag_engine.py           # RAG orchestration
│   ├── importers/              # Chat history importers
│   ├── memory/                 # Fact extraction
│   ├── storage/                # Vector database
│   ├── retrieval/              # Semantic search
│   └── graph/                  # Knowledge graph
├── web-ui/                      # Next.js frontend
├── tests/                       # Test files
└── docs/                        # This directory
```

## 🎯 Recommended Reading Order

1. Start with the [Simple Flow Guide](SIMPLE_FLOW.md) to understand the big picture
2. Use [Module Reference](MODULE_REFERENCE.md) as a quick lookup
3. Read [Architecture Breakdown](ARCHITECTURE_BREAKDOWN.md) for deep dive
4. Check [Quick Fix Checklist](QUICK_FIX_CHECKLIST.md) if you're fixing bugs

## 📝 Other Files

- **portfolio/** - Portfolio entry files (not core documentation)

