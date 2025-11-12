"""Semantic HTML Search Engine - Backend Package

This package provides a semantic search engine for HTML content using:
- FastAPI for the REST API
- Sentence Transformers for semantic embeddings
- BERT tokenizer for text chunking
- Cosine similarity for search ranking
"""

__version__ = "1.0.0"
__author__ = "Aaron Sequeira"

# Package-level imports for convenience
from .app import app
from .models import SearchRequest, SearchResponse, ChunkResult
from .vector_store import VectorStore
from .chunking import TextChunker
from .html_utils import fetch_and_clean_html

__all__ = [
    "app",
    "SearchRequest",
    "SearchResponse",
    "ChunkResult",
    "VectorStore",
    "TextChunker",
    "fetch_and_clean_html",
]
