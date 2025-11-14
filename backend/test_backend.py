import pytest
from fastapi.testclient import TestClient
from backend.app import app
from backend.chunking import TextChunker
from backend.vector_store import VectorStore
import logging

logger = logging.getLogger(__name__)

# Test client for FastAPI
client = TestClient(app)


def test_root_endpoint():
    """Test the health check endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data
    logger.info("Root endpoint test passed")


def test_chunker_basic():
    """Test basic text chunking functionality"""
    chunker = TextChunker(max_tokens=10, overlap_tokens=2)
    text = "This is a simple test. " * 20
    chunks = chunker.chunk_text(text)

    assert len(chunks) > 0
    assert all("text" in chunk for chunk in chunks)
    assert all("start_token" in chunk for chunk in chunks)
    assert all("end_token" in chunk for chunk in chunks)
    logger.info(f"Chunker created {len(chunks)} chunks")


def test_chunker_empty_text():
    """Test chunker with empty text"""
    chunker = TextChunker(max_tokens=500)
    chunks = chunker.chunk_text("")
    assert len(chunks) == 0


def test_vector_store_initialization():
    """Test VectorStore initialization"""
    vector_store = VectorStore(model_name="all-MiniLM-L6-v2")
    assert vector_store.model is not None
    assert vector_store.embeddings is None
    assert vector_store.chunks is None
    logger.info("VectorStore initialized successfully")


def test_vector_store_indexing():
    """Test VectorStore indexing functionality"""
    vector_store = VectorStore()
    test_chunks = [
        {"text": "Machine learning is a subset of AI", "start": 0, "end": 36},
        {"text": "Python is a popular programming language", "start": 0, "end": 40},
        {"text": "Deep learning uses neural networks", "start": 0, "end": 35},
    ]

    vector_store.index_chunks(test_chunks)
    assert vector_store.embeddings is not None
    assert vector_store.chunks is not None
    assert len(vector_store.chunks) == 3
    logger.info(f"Indexed {len(test_chunks)} chunks successfully")


def test_vector_store_search():
    """Test VectorStore search functionality"""
    vector_store = VectorStore()
    test_chunks = [
        {
            "text": "Python is used for data science",
            "chunk_index": 0,
            "start_token": 0,
            "end_token": 31,
            "token_count": 7,
        },
        {
            "text": "JavaScript is used for web development",
            "chunk_index": 1,
            "start_token": 0,
            "end_token": 39,
            "token_count": 8,
        },
        {
            "text": "Java is used for enterprise applications",
            "chunk_index": 2,
            "start_token": 0,
            "end_token": 41,
            "token_count": 8,
        },
    ]

    vector_store.index_chunks(test_chunks)
    results = vector_store.search("programming language for data analysis", top_k=2)

    assert len(results) == 2
    # Results are tuples of (chunk_dict, score)
    assert all(isinstance(result, tuple) and len(result) == 2 for result in results)
    # Python chunk should be most relevant
    assert "Python" in results[0][0]["text"]
    logger.info(f"Search returned {len(results)} results")


def test_search_endpoint_invalid_url():
    """Test search endpoint with invalid URL"""
    response = client.post(
        "/search", json={"url": "not-a-valid-url", "query": "test query"}
    )
    assert response.status_code == 422  # Pydantic validation error
    logger.info("Invalid URL test passed")


def test_search_endpoint_missing_fields():
    """Test search endpoint with missing required fields"""
    response = client.post("/search", json={"url": "https://example.com"})
    assert response.status_code == 422  # Validation error
    logger.info("Missing fields test passed")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
