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

logging.basicConfig(level=os.getenv('LOG_LEVEL', 'INFO'))
logger = logging.getLogger(__name__)

# Initialize FastAPI application
app = FastAPI(
    title="Semantic HTML Search",
    description="Search HTML content using semantic embeddings with Qdrant",
    version="2.0.0"
)

# Configure CORS - Allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        os.getenv('FRONTEND_URL', 'http://localhost:3000')
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
chunker = TextChunker(max_tokens=500, overlap_tokens=50)
vector_store = None

@app.on_event("startup")
async def startup_event():
    """Initialize vector store on startup"""
    global vector_store
    try:
        vector_store = VectorStore(model_name="all-MiniLM-L6-v2")
        logger.info("Vector store initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize vector store: {str(e)}")
        raise

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Semantic HTML Search",
        "version": "2.0.0",
        "vector_db": "Qdrant"
    }

@app.get("/health")
async def health_check():
    """Detailed health check with vector store stats"""
    try:
        stats = vector_store.get_stats() if vector_store else {}
        return {
            "status": "healthy",
            "vector_store": "connected" if vector_store else "not initialized",
            "stats": stats
        }
    except Exception as e:
        return {
            "status": "degraded",
            "error": str(e)
        }

@app.post("/search", response_model=SearchResponse)
async def search(
    request: SearchRequest
) -> SearchResponse:
    """
    Search endpoint that:
    1. Fetches HTML from the provided URL
    2. Chunks the text content (max 500 tokens per chunk)
    3. Indexes chunks in Qdrant vector store
    4. Performs semantic search
    5. Returns top-k results with scores
    """
    if not vector_store:
        raise HTTPException(
            status_code=503,
            detail="Vector store not initialized"
        )
    
    try:
        logger.info(f"Processing search request for URL: {request.url}")
        
        # Step 1: Fetch and clean HTML
        try:
            clean_text, title = fetch_and_clean_html(request.url)
            logger.info(f"Fetched {len(clean_text)} characters from URL")
            
            if not clean_text or len(clean_text.strip()) == 0:
                raise HTTPException(
                    status_code=400,
                    detail="No readable content found at the provided URL"
                )
        except HTTPException:
            raise
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
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to chunk text: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to process text: {str(e)}"
            )
        
        # Step 3: Index chunks in Qdrant
        try:
            vector_store.index_chunks(chunks)
            logger.info("Chunks indexed successfully")
        except Exception as e:
            logger.error(f"Failed to index chunks: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to index content: {str(e)}"
            )
        
        # Step 4: Perform semantic search
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

                # Format results for Pydantic validation
                formatted_results = [
                                {
                                                    'chunk': {
                                                                            'text': chunk['text'],
                                                                            'start': chunk['start'],
                                                                            'end': chunk['end']
                                                                        },
                                                    'score': score
                                                }
                                for chunk, score in results
                            ]
        return SearchResponse(
            url=str(request.url),
            query=request.query,
                        results=formatted_results,
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
    port = int(os.getenv('BACKEND_PORT', '8000'))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
