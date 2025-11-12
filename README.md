# Semantic HTML Search Engine

## Overview

A production-ready semantic search engine for HTML content that uses vector embeddings to find conceptually similar text. Built with FastAPI (backend) and designed for Next.js (frontend), this system demonstrates modern NLP techniques and clean API design.

**Built for**: Smarter.codes Technical Interview Assessment

## Features

- **Semantic Search**: Uses sentence-transformers to find meaning-based similarities
- **HTML Processing**: Automatically fetches and cleans HTML content
- **Text Chunking**: Intelligent text splitting with BERT tokenizer
- **Vector Embeddings**: 384-dimensional embeddings with all-MiniLM-L6-v2
- **RESTful API**: FastAPI with automatic OpenAPI documentation
- **Type Safety**: Full Pydantic models and Python type hints
- **Comprehensive Tests**: Unit and integration tests with pytest

## Architecture

```
backend/
├── app.py              # FastAPI application and endpoints
├── models.py           # Pydantic request/response models
├── html_utils.py       # HTML fetching and cleaning
├── chunking.py         # Text chunking with sliding window
├── vector_store.py     # Embedding generation and search
├── test_backend.py     # Comprehensive test suite
└── requirements.txt    # Python dependencies
```

## Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aaron-seq/semantic-html-search-smarter-codes.git
   cd semantic-html-search-smarter-codes
   ```

2. **Set up virtual environment** (recommended)
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Running the Backend

```bash
cd backend
python app.py
```

The API will be available at `http://localhost:8000`

### API Documentation

Once the backend is running, visit:
- **Interactive docs**: http://localhost:8000/docs (Swagger UI)
- **Alternative docs**: http://localhost:8000/redoc (ReDoc)

## API Usage

### Health Check
```bash
curl http://localhost:8000/
```

Response:
```json
{
  "status": "healthy",
  "service": "Semantic HTML Search"
}
```

### Search Endpoint

**POST** `/search`

**Request Body:**
```json
{
  "url": "https://example.com",
  "query": "machine learning concepts",
  "top_k": 5
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "query": "machine learning concepts",
  "results": [
    {
      "chunk": {
        "text": "Machine learning is a subset of AI...",
        "start": 0,
        "end": 156
      },
      "score": 0.856
    }
  ],
  "total_chunks": 42
}
```

### Example with curl

```bash
curl -X POST "http://localhost:8000/search" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://en.wikipedia.org/wiki/Machine_learning",
    "query": "neural networks and deep learning",
    "top_k": 3
  }'
```

## Running Tests

```bash
cd backend
pytest test_backend.py -v
```

Tests cover:
- API endpoint functionality
- Text chunking algorithm
- Vector store operations
- Error handling
- Edge cases

## Technical Details

### Text Chunking
- **Algorithm**: Sliding window with overlap
- **Tokenizer**: BERT tokenizer (bert-base-uncased)
- **Max tokens per chunk**: 500
- **Overlap**: 50 tokens
- **Why overlap?**: Prevents information loss at chunk boundaries

### Embedding Model
- **Model**: all-MiniLM-L6-v2 (sentence-transformers)
- **Dimensions**: 384
- **Why this model?**: Excellent balance of speed and accuracy
- **Performance**: ~5000 sentences/second on CPU

### Semantic Search
- **Similarity metric**: Cosine similarity
- **Implementation**: Normalized dot product
- **Ranking**: Top-k results by similarity score

## Project Structure Explained

### Backend Components

1. **app.py**: Main FastAPI application
   - Health check endpoint (`GET /`)
   - Search endpoint (`POST /search`)
   - CORS middleware for frontend integration
   - Comprehensive error handling

2. **models.py**: Pydantic models
   - `SearchRequest`: Validates incoming search requests
   - `SearchResponse`: Structured search results
   - `ChunkResult`: Individual chunk with score
   - `ErrorResponse`: Standardized error messages

3. **html_utils.py**: HTML processing
   - Fetches HTML from URLs
   - Cleans HTML with BeautifulSoup
   - Extracts text content
   - Handles request errors

4. **chunking.py**: Text segmentation
   - BERT tokenizer initialization
   - Sliding window algorithm
   - Maintains chunk metadata (start/end positions)

5. **vector_store.py**: Embedding and search
   - Loads sentence-transformer model
   - Generates embeddings for chunks
   - Performs semantic search
   - Returns ranked results

## Performance Considerations

- **First request delay**: Model loads on first use (~2-3 seconds)
- **Subsequent requests**: Fast (<1 second for typical pages)
- **Memory usage**: ~500MB for model in memory
- **Chunking speed**: ~10,000 tokens/second
- **Embedding speed**: ~5,000 sentences/second

## Scaling to Production

### Current Implementation (Demo)
- In-memory vector storage
- Single-instance deployment
- No persistence

### Production Recommendations
1. **Vector Database**: Use Pinecone, Weaviate, or Milvus
2. **Caching**: Redis for frequently accessed embeddings
3. **Load Balancing**: Multiple backend instances
4. **Async Processing**: Celery for background indexing
5. **Monitoring**: Prometheus + Grafana
6. **Rate Limiting**: Protect against abuse
7. **Authentication**: API keys or OAuth2

## Technical Interview Preparation

See [TECHNICAL_INTERVIEW.md](./TECHNICAL_INTERVIEW.md) for:
- Architecture deep dive
- Common interview questions
- Technical concept explanations
- System design considerations
- Performance optimization strategies

## Troubleshooting

### Issue: Model download fails
**Solution**: Models are downloaded automatically on first run. Ensure internet connection.

### Issue: Out of memory error
**Solution**: The model requires ~500MB RAM. Close other applications or use a machine with more RAM.

### Issue: Slow first request
**Solution**: Normal behavior. First request loads the model. Subsequent requests are fast.

### Issue: Import errors
**Solution**: Ensure all dependencies are installed:
```bash
pip install -r requirements.txt
```

## Dependencies

- **FastAPI**: Modern web framework
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation
- **sentence-transformers**: Embedding models
- **transformers**: BERT tokenizer
- **beautifulsoup4**: HTML parsing
- **requests**: HTTP client
- **numpy**: Numerical operations
- **pytest**: Testing framework

## License

MIT License - see LICENSE file

## Author

aaron-seq

## Acknowledgments

- Built for Smarter.codes technical assessment
- Uses Hugging Face transformers and sentence-transformers
- Inspired by modern semantic search applications

---

**Note**: This is a demonstration project showcasing semantic search capabilities. For production use, implement proper authentication, rate limiting, and use a dedicated vector database.
