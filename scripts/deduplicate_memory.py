import os
import sys
# Add parent directory to path to find unified_llm package
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import hashlib
from dotenv import load_dotenv
from unified_llm.storage.vector_store import VectorStore
from unified_llm.storage.embeddings import LocalEmbeddingService

# Load env
load_dotenv()

def log(msg):
    print(msg)
    with open("dedup.log", "a") as f:
        f.write(msg + "\n")

def deduplicate():
    log("Initializing...")
    embedding_service = LocalEmbeddingService()
    vector_store = VectorStore(embedding_service=embedding_service)
    
    if vector_store.use_mock:
        log("Using mock storage. Deduplication not needed/supported for mock in this script.")
        return

    log(f"Connected to Pinecone index: {vector_store.index_name}")
    
    # Fetch all items (up to 10k)
    limit = 10000
    dummy_vector = [0.1] * 384
    
    log("Fetching vectors...")
    results = vector_store.index.query(
        vector=dummy_vector,
        top_k=limit,
        include_metadata=True
    )
    
    matches = results['matches']
    log(f"Found {len(matches)} total vectors.")
    
    if len(matches) > 0:
        log("Sample metadata from first item:")
        log(str(matches[0]['metadata']))
    
    # Group by content hash
    content_map = {}
    ids_to_delete = []
    
    unique_signatures = set()
    
    for match in matches:
        meta = match['metadata']
        # Try to normalize content
        content = meta.get('content', '').strip()
        category = meta.get('category', '').strip()
        
        # If content already contains category prefix, maybe we should just use content?
        # Let's try just using 'content' as the signature if it's unique enough
        signature = content
        
        unique_signatures.add(signature)
        
        # Check if we've seen this signature
        if signature in content_map:
            # Duplicate found!
            # We prefer to keep the one with the deterministic ID (MD5) if possible
            existing_id = content_map[signature]
            current_id = match['id']
            
            # Calculate what the deterministic ID *should* be
            deterministic_id = hashlib.md5(signature.encode()).hexdigest()
            
            if current_id == deterministic_id:
                # Current is the "good" one, delete the existing (old) one
                ids_to_delete.append(existing_id)
                content_map[signature] = current_id
            elif existing_id == deterministic_id:
                # Existing is the "good" one, delete current
                ids_to_delete.append(current_id)
            else:
                # Neither is deterministic (both old random UUIDs), just keep the first one
                ids_to_delete.append(current_id)
        else:
            content_map[signature] = match['id']
            
    log(f"Found {len(ids_to_delete)} duplicates.")
    
    if ids_to_delete:
        log("Deleting duplicates...")
        # Delete in batches of 1000
        batch_size = 1000
        for i in range(0, len(ids_to_delete), batch_size):
            batch = ids_to_delete[i:i+batch_size]
            vector_store.index.delete(ids=batch)
            log(f"Deleted batch {i//batch_size + 1}")
            
        log("Deduplication complete.")
    else:
        log("No duplicates found.")

if __name__ == "__main__":
    deduplicate()
