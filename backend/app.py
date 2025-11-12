from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import SearchRequest, SearchResponse, ErrorResponse
from html_utils import fetch_and_clean_html
from chunking import TextChunker
from vector_store import VectorStore
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.os.getenv('LOG_LEVEL', 'INFO'))
logger = logging.getLogger(__name__)

# Initialize FastAPI application
app = FastAPI(
    title="Semantic HTML Search",
    description="Search HTML content using semantic embeddings",
    version="1.0.0"
)

# Configure CORS - Allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://loca[os.getenv('FRONTEND_URL', 'http://localhost:3000')]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
chunker = TextChunker(max_tokens=500, overlap_tokens=50)
vector_store = VectorStore(model_name="all-MiniLM-L6-v2")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Semantic HTML Search"}

@app.post("/search", response_model=SearchResponse)
async def search(
    request: SearchRequest
) -> SearchResponse:
    """
    Search endpoint that:
    1. Fetches HTML from the provided URL
    2. Chunks the text content
    3. Indexes chunks in vector store
    4. Performs semantic search
    5. Returns top-k results with scores
    """
    try:
        logger.info(f"Processing search request for URL: {request.url}")
        
        # Step 1: Fetch and clean HTML
        try:
            clean_text = fetch_and_clean_html(request.url)
            logger.info(f"Fetched {len(clean_text)} characters from URL")
        except Exception as e:
            logger.error(f"Failed to fetch URL: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail=f"Failed to fetch URL: {str(e)}"
            )
        
        # Step 2: Chunk the text
        try:
            chunks = chunker.chunk_text(clean_text)
            logger.info(f"Created {len(chunks)} chunks")
            
            if not chunks:
                raise HTTPException(
                    status_code=400,
                    detail="No content could be extracted from the URL"
                )
        except Exception as e:
            logger.error(f"Failed to chunk text: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to process text: {str(e)}"
            )
        
        # Step 3: Index chunks
        try:
            vector_store.index_chunks(chunks)
            logger.info("Chunks indexed successfully")
        except Exception as e:
            logger.error(f"Failed to index chunks: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to index content: {str(e)}"
            )
        
        # Step 4: Perform search
        try:
            results = vector_store.search(
                query=request.query,
                top_k=request.top_k
            )
            logger.info(f"Found {len(results)} results")
        except Exception as e:
            logger.error(f"Search failed: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Search failed: {str(e)}"
            )
        
        # Step 5: Format response
        return SearchResponse(
            url=request.url,
            query=request.query,
            results=results,
            total_chunks=len(chunks)
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv('BACKEND_PORT', '8000')))
