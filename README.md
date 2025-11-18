# Semantic HTML Search Engine

## Overview

A production-ready semantic search engine for HTML content that uses **Qdrant vector database** and sentence embeddings to find conceptually similar text. Built with FastAPI (backend) and Next.js (frontend), this system demonstrates modern NLP techniques, vector database integration, and clean API design.

**Built for Smarter.codes Technical Assessment**

## Key Features

-  **Vector Database**: Qdrant integration for persistent, scalable vector storage
-  **Semantic Search**: Uses sentence-transformers (all-MiniLM-L6-v2) for meaning-based similarity
-  **HTML Processing**: Fetches and cleans HTML content automatically
-  **Smart Chunking**: Intelligent text splitting with BERT tokenizer (500 tokens max)
-  **RESTful API**: FastAPI with automatic OpenAPI documentation
-  **Modern Frontend**: Next.js single-page application with responsive UI
-  **Type Safety**: Full Pydantic models and Python type hints
-  **Docker Ready**: Complete Docker Compose setup for easy deployment
-  **Comprehensive Tests**: Unit and integration tests with pytest

## Architecture

```
.
├── backend/                      # FastAPI Backend
│   ├── app.py                   # Main application & endpoints
│   ├── models.py                # Pydantic request/response models
│   ├── html_utils.py            # HTML fetching and cleaning
│   ├── chunking.py              # Text chunking with BERT tokenizer
│   ├── vector_store.py          # Qdrant vector database integration
│   ├── test_backend.py          # Comprehensive test suite
│   └── requirements.txt         # Python dependencies
├── frontend/                     # Next.js Frontend
│   └── pages/
│       └── index.tsx            # Main search interface (SPA)
├── docker-compose.yml           # Docker orchestration with Qdrant
├── Dockerfile                   # Backend container image
└── README.md                    # This file
```

## Technology Stack

### Backend
- **Framework**: FastAPI 0.104.1
- **Vector Database**: Qdrant (latest)
- **Embeddings**: sentence-transformers (all-MiniLM-L6-v2)
- **HTML Parsing**: BeautifulSoup4
- **Tokenization**: Transformers (BERT tokenizer)

### Frontend
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Quick Start

### Prerequisites

- **Python 3.8+**
- **Node.js 16+** (for frontend)
- **Docker & Docker Compose** (recommended)

### Option 1: Docker Deployment (Recommended)

**Fastest way to get started:**

```bash
# 1. Clone the repository
git clone https://github.com/aaron-seq/semantic-html-search-smarter-codes.git
cd semantic-html-search-smarter-codes

# 2. Start all services (Qdrant + Backend)
docker-compose up -d

# 3. Check services are running
docker-compose ps
```

**Services:**
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Qdrant Dashboard**: http://localhost:6333/dashboard

### Option 2: Local Development

#### Step 1: Start Qdrant Vector Database

```bash
# Using Docker (easiest)
docker run -d \
  --name qdrant \
  -p 6333:6333 \
  -p 6334:6334 \
  -v $(pwd)/qdrant_storage:/qdrant/storage \
  qdrant/qdrant:latest
```

#### Step 2: Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp ../.env.example .env
# Edit .env if needed (default values work for local setup)

# Run the backend
python app.py
```

Backend will be available at **http://localhost:8000**

#### Step 3: Setup Frontend (Optional)

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run development server
npm run dev
```

Frontend will be available at **http://localhost:3000**

## API Usage

### Health Check

```bash
curl http://localhost:8000/
```

**Response:**
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
  "top_k": 10
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
    "top_k": 5
  }'
```

## How It Works

### 1. HTML Processing
- Fetches HTML from the provided URL
- Cleans content using BeautifulSoup (removes scripts, styles, navigation)
- Extracts readable text content

### 2. Text Chunking
- Uses BERT tokenizer (bert-base-uncased)
- Maximum 500 tokens per chunk
- 50 token overlap between chunks (prevents information loss)
- Maintains chunk position metadata

### 3. Vector Embedding
- Model: **all-MiniLM-L6-v2** (384 dimensions)
- Generates semantic embeddings for each chunk
- Fast: ~5000 sentences/second on CPU

### 4. Qdrant Vector Database
- **Collection**: `html_chunks`
- **Distance Metric**: Cosine similarity
- **Features**:
  - Persistent storage
  - Fast approximate nearest neighbor search
  - Metadata filtering support
  - Scalable to millions of vectors

### 5. Semantic Search
- Generates embedding for the query
- Searches Qdrant using cosine similarity
- Returns top-k results ranked by relevance score

## Running Tests

```bash
cd backend
pytest test_backend.py -v
```

**Test Coverage:**
- API endpoint functionality
- Text chunking algorithm
- Vector store operations (with Qdrant)
- Error handling
- Edge cases

## API Documentation

Once the backend is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Qdrant Dashboard

Access the Qdrant web interface:

- **Dashboard**: http://localhost:6333/dashboard

**Features:**
- View collections
- Browse vectors and payloads
- Test queries
- Monitor performance

## Configuration

### Environment Variables

Create a `.env` file (see `.env.example`):

```bash
# Backend
BACKEND_PORT=8000
LOG_LEVEL=INFO

# Qdrant
QDRANT_HOST=localhost  # Use 'qdrant' for Docker
QDRANT_PORT=6333

# Frontend
FRONTEND_URL=http://localhost:3000
```

## Project Structure Details

### Backend Components

1. **app.py**: Main FastAPI application
   - Health check endpoint (`GET /`)
   - Search endpoint (`POST /search`)
   - CORS middleware
   - Comprehensive error handling

2. **models.py**: Pydantic models
   - `SearchRequest`: Request validation
   - `SearchResponse`: Response structure
   - `ChunkResult`: Individual results
   - `ErrorResponse`: Error formatting

3. **html_utils.py**: HTML processing
   - URL fetching with error handling
   - BeautifulSoup cleaning
   - Text extraction

4. **chunking.py**: Text segmentation
   - BERT tokenizer
   - Sliding window with overlap
   - Position tracking

5. **vector_store.py**: Qdrant integration
   - Collection management
   - Vector indexing
   - Semantic search
   - Statistics and monitoring

## Performance Considerations

- **First Request**: ~2-3 seconds (model loading)
- **Subsequent Requests**: <1 second for typical pages
- **Memory Usage**: ~500MB for embedding model
- **Qdrant Storage**: Persistent on disk
- **Chunking Speed**: ~10,000 tokens/second
- **Embedding Speed**: ~5,000 sentences/second (CPU)

## Scaling to Production

### Current Implementation
-  Persistent vector database (Qdrant)
-  Docker containerization
-  Stateless API design
-  Comprehensive error handling

### Production Recommendations

1. **Infrastructure**
   - Deploy Qdrant cluster for high availability
   - Use Redis for caching frequently accessed embeddings
   - Add load balancer for multiple backend instances

2. **Performance**
   - GPU acceleration for embedding generation
   - Async processing for background indexing
   - CDN for frontend assets

3. **Security**
   - Add authentication (API keys or OAuth2)
   - Rate limiting (e.g., Slowapi)
   - Input validation and sanitization
   - HTTPS/TLS encryption

4. **Monitoring**
   - Prometheus metrics
   - Grafana dashboards
   - Error tracking (Sentry)
   - Request logging

## Troubleshooting

### Issue: Qdrant connection failed

**Solution**: Ensure Qdrant is running:
```bash
docker ps | grep qdrant
# Or check Qdrant logs
docker logs qdrant
```

### Issue: Model download fails

**Solution**: Models download automatically on first run. Ensure internet connection.

### Issue: Out of memory

**Solution**: The embedding model requires ~500MB RAM. Close other applications or use a machine with more memory.

### Issue: Import errors

**Solution**: Install all dependencies:
```bash
pip install -r requirements.txt
```

### Issue: Qdrant port already in use

**Solution**: Change port in `.env` or stop the conflicting service:
```bash
# Find process using port 6333
lsof -i :6333
# Kill the process or change QDRANT_PORT in .env
```

## Dependencies

### Backend
```
fastapi==0.104.1          # Web framework
uvicorn[standard]==0.24.0 # ASGI server
pydantic==2.5.0           # Data validation
qdrant-client==1.7.0      # Vector database client
sentence-transformers     # Embeddings
transformers              # BERT tokenizer
beautifulsoup4            # HTML parsing
requests                  # HTTP client
numpy                     # Numerical operations
pytest                    # Testing
```

### Frontend
```
next                      # React framework
react                     # UI library
typescript                # Type safety
tailwindcss               # Styling
```

## Assignment Compliance Checklist

 **Frontend**: Next.js SPA with URL + query inputs  
 **Backend**: FastAPI with Python  
 **HTML Parsing**: BeautifulSoup for DOM extraction  
 **Tokenization**: BERT tokenizer with 500 token chunks  
 **Vector Database**: Qdrant for semantic search  
 **Top 10 Results**: Returns ranked results with scores  
 **Clean Content**: Removes scripts, styles, navigation  
 **Setup Instructions**: Complete README with prerequisites  
 **Docker Support**: docker-compose.yml for easy deployment  

## License

MIT License - see LICENSE file

## Author

**Aaron Sequeira**  
GitHub: [@aaron-seq](https://github.com/aaron-seq)

## Acknowledgments

- Built for **Smarter.codes** technical assessment
- Uses Hugging Face transformers and sentence-transformers
- Powered by Qdrant vector database
- Inspired by modern semantic search applications
