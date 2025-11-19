# Semantic HTML Search Engine

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688.svg)
![Next.js](https://img.shields.io/badge/Next.js-latest-black.svg)
![Qdrant](https://img.shields.io/badge/Qdrant-Vector_DB-6366F1.svg)

Production-ready semantic search application for HTML content using Qdrant vector database, sentence-transformers embeddings, FastAPI backend, and Next.js frontend with modern gradient UI.

**Built for Smarter.codes Technical Assignment**

[Features](#key-features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [API](#api-usage)

---

## Overview

This application implements modern NLP techniques for semantic search across HTML content:

- **Vector Database**: Qdrant for persistent, scalable vector storage with cosine similarity
- **Semantic Search**: sentence-transformers (all-MiniLM-L6-v2) for meaning-based content retrieval
- **HTML Processing**: BeautifulSoup-powered intelligent fetching and cleaning
- **Chunking Strategy**: BERT tokenizer-based text splitting with 500 token maximum and 50 token overlap
- **RESTful API**: FastAPI with automatic OpenAPI documentation and Pydantic validation
- **Modern Frontend**: Next.js SPA with TypeScript, Tailwind CSS, and gradient animations
- **Type Safety**: Full Pydantic models on backend and TypeScript on frontend
- **Production Ready**: Comprehensive error handling, logging, and Docker support

---

## Key Features

### Backend Architecture

- **Qdrant Integration**: Fast vector operations with persistent storage and built-in dashboard
- **Token Chunking**: BERT tokenizer splits content into 500-token chunks with 50-token overlap
- **Semantic Embeddings**: 384-dimensional vectors using all-MiniLM-L6-v2 model
- **Health Endpoints**: Root and `/health` endpoints with vector store statistics
- **CORS Configuration**: Properly configured for frontend integration
- **Docker Ready**: Complete Docker Compose setup for one-command deployment

### Frontend Implementation

- **Modern UI**: Gradient backgrounds with glassmorphism effects and smooth animations
- **Responsive Design**: Mobile-first approach using Tailwind CSS utility classes
- **Real-time Feedback**: Loading states, error handling, and progress indicators
- **Result Visualization**: Relevance score bars, position indicators, and metadata cards
- **TypeScript**: Complete type safety across all components and API calls

---

## Quick Start

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- Docker and Docker Compose (recommended for quick setup)

### Option 1: Docker Deployment (Recommended)

Fastest way to get the application running:

```bash
# Clone the repository
git clone https://github.com/aaron-seq/semantic-html-search-smarter-codes.git
cd semantic-html-search-smarter-codes

# Start all services (Qdrant + Backend)
docker-compose up -d

# Verify services are running
docker-compose ps
```

**Services will be available at:**
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Qdrant Dashboard: http://localhost:6333/dashboard

### Option 2: Local Development

#### Step 1: Start Qdrant Vector Database

```bash
# Using Docker (easiest method)
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
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment configuration
cp ../.env.example .env

# Run the backend server
python app.py
```

Backend will be running at http://localhost:8000 with API documentation at http://localhost:8000/docs

#### Step 3: Setup Frontend

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run development server
npm run dev
```

Frontend will be accessible at http://localhost:3000

---

## Technical Implementation

### 1. HTML Processing Pipeline

- Fetches HTML content from provided URL using requests library
- Cleans content with BeautifulSoup, removing scripts, styles, and navigation elements
- Extracts readable text while preserving document structure
- Handles various character encodings and malformed HTML

### 2. Text Chunking Algorithm

- Uses BERT tokenizer (bert-base-uncased) for accurate token counting
- Maximum chunk size: 500 tokens
- Overlap between chunks: 50 tokens (prevents information loss at boundaries)
- Maintains chunk position metadata for result contextualization
- Preserves semantic coherence within chunks

### 3. Vector Embedding Generation

- Model: all-MiniLM-L6-v2 from sentence-transformers
- Embedding dimensionality: 384
- Performance: Approximately 5000 sentences per second on CPU
- Batch processing support for efficient embedding generation
- Mean pooling with attention mask for optimal representations

### 4. Qdrant Vector Database Configuration

- Collection name: `html_chunks`
- Distance metric: Cosine similarity
- Vector size: 384 dimensions
- Features:
  - Persistent storage to disk
  - Fast approximate nearest neighbor search using HNSW algorithm
  - Scalable to millions of vectors
  - Built-in web dashboard for monitoring
  - Payload filtering and metadata storage

### 5. Semantic Search Process

- Query embedding generated using same model as chunks
- Qdrant performs cosine similarity search
- Returns top-k results ranked by relevance score
- Score normalization for interpretability
- Results include chunk text, position, and metadata

---

## API Usage

### Health Check Endpoint

```bash
curl http://localhost:8000/
```

**Response:**
```json
{
  "status": "healthy",
  "service": "Semantic HTML Search",
  "version": "2.0.0",
  "vector_db": "Qdrant"
}
```

### Search Endpoint

**POST** `/search`

**Request:**
```json
{
  "url": "https://en.wikipedia.org/wiki/Machine_learning",
  "query": "neural networks and deep learning",
  "top_k": 10
}
```

**Response:**
```json
{
  "url": "https://en.wikipedia.org/wiki/Machine_learning",
  "query": "neural networks and deep learning",
  "results": [
    {
      "chunk": {
        "text": "Deep learning is part of a broader family...",
        "start": 0,
        "end": 156
      },
      "score": 0.856
    }
  ],
  "total_chunks": 42
}
```

---

## Running Tests

```bash
cd backend
pytest test_backend.py -v
```

---

## Performance Metrics

- **First Request**: 2-3 seconds (includes model loading and initialization)
- **Subsequent Requests**: Less than 1 second for typical web pages
- **Memory Usage**: Approximately 500MB for embedding model
- **Qdrant Storage**: Persistent on disk, minimal RAM footprint
- **Chunking Speed**: Around 10,000 tokens per second
- **Embedding Speed**: Approximately 5,000 sentences per second on CPU
- **Search Latency**: Sub-millisecond vector similarity search

---

## Troubleshooting

### Issue: Qdrant connection failed

**Solution**: Ensure Qdrant is running:
```bash
docker ps | grep qdrant
# Check Qdrant logs
docker logs qdrant
```

### Issue: Frontend cannot connect to backend

**Solution**: Verify CORS settings and `.env.local`:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > frontend/.env.local
```

### Issue: Import errors or missing dependencies

**Solution**: Reinstall all dependencies:
```bash
pip install -r requirements.txt
```

### Issue: Port already in use

**Solution**: Stop existing services:
```bash
# Stop Qdrant
docker stop qdrant
# Or change port in docker-compose.yml
```

---

## Assignment Compliance

This implementation fulfills all technical assignment requirements:

- **Frontend**: Next.js single-page application with URL and query input fields
- **Backend**: FastAPI framework in Python
- **HTML Parsing**: BeautifulSoup for DOM content extraction
- **Tokenization**: BERT tokenizer with 500 token maximum per chunk
- **Vector Database**: Qdrant for semantic search capabilities
- **Top 10 Results**: Returns ranked results with relevance scores
- **Clean Content**: Removes scripts, styles, and navigation elements
- **Setup Instructions**: Complete documentation with prerequisites
- **Modern UI**: Professional gradient design with animations

---

## Project Structure

```
semantic-html-search-smarter-codes/
├── backend/
│   ├── app.py              # FastAPI application and endpoints
│   ├── vector_store.py     # Qdrant vector database integration
│   ├── html_utils.py       # HTML fetching and cleaning
│   ├── chunking.py         # Text chunking with BERT tokenizer
│   ├── requirements.txt    # Python dependencies
│   └── test_backend.py     # Backend unit tests
├── frontend/
│   ├── pages/
│   │   ├── index.tsx       # Main search page
│   │   └── _app.tsx        # Next.js app configuration
│   ├── components/
│   │   ├── SearchForm.tsx  # Search input component
│   │   └── ResultsList.tsx # Search results display
│   ├── styles/
│   │   └── globals.css     # Global styles and Tailwind directives
│   ├── package.json        # Node.js dependencies
│   └── tailwind.config.js  # Tailwind CSS configuration
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile              # Backend Docker image
├── .env.example            # Environment variables template
└── README.md               # This file
```

---

## License

MIT License - see [LICENSE](LICENSE) file for details

---

## Author

**Aaron Sequeira**  
GitHub: [@aaron-seq](https://github.com/aaron-seq)

---

## Acknowledgments

- Built for Smarter.codes technical assessment
- Uses Hugging Face transformers and sentence-transformers libraries
- Powered by Qdrant vector database
- Inspired by modern semantic search applications and RAG architectures

---

**Built for Smarter.codes**
