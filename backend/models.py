from pydantic import BaseModel, HttpUrl, Field, validator
from typing import List, Optional

class SearchRequest(BaseModel):
    """Request model for semantic search endpoint."""
    url: HttpUrl = Field(..., description="Target webpage URL to search")
    query: str = Field(..., min_length=1, max_length=500, description="Search query")
    top_k: int = Field(10, ge=1, le=100, description="Number of top results to return")
    
    @validator('query')
    def query_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Query cannot be empty or whitespace only')
        return v.strip()

class ChunkData(BaseModel):
    """Chunk data structure."""
    text: str
    start: int
    end: int

class SearchResultItem(BaseModel):
    """Individual search result."""
    chunk: ChunkData
    score: float

class SearchResponse(BaseModel):
    """Response model containing search results and metadata."""
    url: str = Field(..., description="Original search URL")
    query: str = Field(..., description="Original search query")
    total_chunks: int = Field(..., description="Total chunks indexed from page")
    results: List[SearchResultItem] = Field(..., description="Top-k relevant chunks")

class ErrorResponse(BaseModel):
    """Error response model for failed requests."""
    error: str
    detail: Optional[str] = None
