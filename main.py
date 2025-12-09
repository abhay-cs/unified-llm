import os
import sys
import argparse
from dotenv import load_dotenv

from unified_llm.factory import get_services
from unified_llm.rag_engine import RAGEngine
from unified_llm.importers.chatgpt_importer import ChatGPTImporter
from unified_llm.importers.claude_importer import ClaudeImporter

def main():
    load_dotenv()
    
    parser = argparse.ArgumentParser(description="Unified LLM Workspace CLI")
    parser.add_argument("--import-file", help="Path to chat export file (conversations.json)")
    parser.add_argument("--type", choices=["chatgpt", "claude"], default="chatgpt", help="Type of export")
    parser.add_argument("--query", help="Query to ask the system")
    parser.add_argument("--interactive", action="store_true", help="Run in interactive mode")
    
    args = parser.parse_args()
    
    # Initialize components via Factory
    print("Initializing components...")
    services = get_services()
    
    rag_engine = RAGEngine(
        retrieval_service=services['retriever'],
        llm_client=services['llm_client']
    )
    
    vector_store = services['vector_store']
    extractor = services['extractor']
    
    # Import if requested
    if args.import_file:
        print(f"Importing from {args.import_file}...")
        if args.type == "chatgpt":
            importer = ChatGPTImporter()
        else:
            importer = ClaudeImporter()
            
        conversations = importer.import_data(args.import_file)
        print(f"Found {len(conversations)} conversations.")
        
        print("Extracting facts (this may take a while)...")
        
        all_facts = []
        for i, conv in enumerate(conversations):
            print(f"Processing conversation {i+1}/{len(conversations)}: {conv.title}")
            facts = extractor.extract_facts(conv.messages)
            if facts:
                print(f"  Found {len(facts)} facts.")
                all_facts.extend(facts)
            else:
                print("  No facts found in this conversation.")
        
        if all_facts:
            print(f"Storing {len(all_facts)} facts to Pinecone...")
            try:
                vector_store.add_facts(all_facts)
                print("Done storing.")
            except Exception as e:
                print(f"Error storing facts: {e}")
        else:
            print("No facts extracted from any conversation.")

    # Query
    if args.query:
        response = rag_engine.generate_response(args.query)
        print(f"\nQuery: {args.query}")
        print(f"Response: {response.answer}")
        
    # Interactive mode
    if args.interactive:
        print("\n--- Interactive Mode (type 'exit' to quit) ---")
        while True:
            q = input("\nUser: ")
            if q.lower() in ('exit', 'quit'):
                break
            response = rag_engine.generate_response(q)
            print(f"Assistant: {response.answer}")

if __name__ == "__main__":
    main()
