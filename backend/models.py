from pydantic import BaseModel, HttpUrl, Field, validator
from typing import List, Optional


class SearchRequest(BaseModel):
    """Request model for semantic search endpoint."""

    url: HttpUrl = Field(..., description="Target webpage URL to search")
    query: str = Field(..., min_length=1, max_length=500, description="Search query")

    @validator("query")
    def query_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Query cannot be empty or whitespace only")
        return v.strip()


class ChunkResult(BaseModel):
    """Individual chunk result with metadata."""

    chunk_index: int = Field(..., description="Zero-based chunk index")
    score: float = Field(..., ge=0, le=1, description="Cosine similarity score")
    text: str = Field(..., description="Chunk content")
    start_token: int = Field(..., description="Starting token position")
    end_token: int = Field(..., description="Ending token position")
    token_count: int = Field(..., description="Number of tokens in chunk")


class SearchResponse(BaseModel):
    """Response model containing search results and metadata."""

    url: str = Field(..., description="Original search URL")
    query: str = Field(..., description="Original search query")
    total_chunks: int = Field(..., description="Total chunks indexed from page")
    results: List[ChunkResult] = Field(..., description="Top-k relevant chunks")
    processing_time_ms: Optional[float] = Field(
        None, description="Total processing time"
    )


class ErrorResponse(BaseModel):
    """Error response model for failed requests."""

    error: str
    detail: Optional[str] = None
