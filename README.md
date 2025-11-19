# Semantic HTML Search Engine

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688.svg)
![Next.js](https://img.shields.io/badge/Next.js-latest-black.svg)
![Pinecone](https://img.shields.io/badge/Pinecone-Vector_DB-6366F1.svg)

A production-ready semantic search engine for HTML content using **Pinecone vector database**, sentence embeddings, FastAPI, and Next.js.

**Built for Smarter.codes Technical Assessment**

[Features](#-key-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [API](#-api-usage)

</div>

---

## 🎯 Overview

This application demonstrates modern NLP techniques and vector database integration for semantic search:

- **Vector Database**: Pinecone serverless for scalable, persistent vector storage
- **Semantic Search**: sentence-transformers (all-MiniLM-L6-v2) for meaning-based similarity
- **HTML Processing**: Intelligent fetching and cleaning of web content
- **Smart Chunking**: BERT tokenizer-based text splitting (500 tokens max)
- **RESTful API**: FastAPI with automatic OpenAPI documentation
- **Modern Frontend**: Next.js SPA with beautiful gradient UI
- **Type Safety**: Full Pydantic models and TypeScript
- **Production Ready**: Comprehensive error handling and logging

---

## ✨ Key Features

### Backend
- ✅ **Pinecone Integration**: Cloud-native vector database with namespace support
- ✅ **500 Token Chunks**: BERT tokenizer with 50-token overlap
- ✅ **Semantic Embeddings**: 384-dimensional vectors (all-MiniLM-L6-v2)
- ✅ **URL-based Namespacing**: Organized indexing per website
- ✅ **Health Endpoints**: `/` and `/health` with vector store stats
- ✅ **CORS Support**: Configured for frontend integration

### Frontend
- ✅ **Modern UI**: Gradient design with animated backgrounds
- ✅ **Responsive Layout**: Mobile-first Tailwind CSS
- ✅ **Real-time Feedback**: Loading states and error handling
- ✅ **Result Visualization**: Score circles and relevance percentages
- ✅ **TypeScript**: Full type safety across components

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **Pinecone Account** ([Sign up free](https://www.pinecone.io/))

### Option 1: Local Development (Recommended)

#### Step 1: Get Pinecone API Key

1. Sign up at [pinecone.io](https://www.pinecone.io/)
2. Create a new project
3. Copy your **API Key** from the dashboard
4. Note your preferred **cloud** (aws/gcp/azure) and **region**

#### Step 2: Setup Backend

```bash
# Clone the repository
git clone https://github.com/aaron-seq/semantic-html-search-smarter-codes.git
cd semantic-html-search-smarter-codes/backend

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
```

**Edit `.env` file:**
```env
PINECONE_API_KEY=your_api_key_here
PINECONE_INDEX_NAME=html-search
PINECONE_CLOUD=aws
PINECONE_REGION=us-east-1
BACKEND_PORT=8000
LOG_LEVEL=INFO
```

```bash
# Run the backend
python app.py
```

✅ Backend running at **http://localhost:8000**  
📚 API Docs at **http://localhost:8000/docs**

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

✅ Frontend running at **http://localhost:3000**

### Option 2: Docker Deployment

```bash
# Create .env file with Pinecone credentials
cp .env.example .env
# Edit .env with your PINECONE_API_KEY

# Build and start
docker-compose up -d

# Check status
docker-compose ps
```

---

## 📖 Documentation

### Architecture

```
.
├── backend/                 # FastAPI Backend
│   ├── app.py              # Main application & endpoints
│   ├── models.py           # Pydantic request/response models
│   ├── html_utils.py       # HTML fetching and cleaning
│   ├── chunking.py         # Text chunking with BERT tokenizer
│   ├── vector_store.py     # Pinecone vector database integration
│   ├── test_backend.py     # Comprehensive test suite
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js Frontend
│   ├── pages/
│   │   └── index.tsx       # Main search interface (SPA)
│   └── components/
│       ├── SearchForm.tsx  # Modern search form component
│       └── ResultsList.tsx # Beautiful results display
├── docker-compose.yml      # Docker orchestration
├── Dockerfile             # Backend container image
└── README.md              # This file
```

### Technology Stack

**Backend:**
- Framework: FastAPI 0.104.1
- Vector Database: Pinecone (Serverless)
- Embeddings: sentence-transformers (all-MiniLM-L6-v2)
- HTML Parsing: BeautifulSoup4
- Tokenization: Transformers (BERT tokenizer)

**Frontend:**
- Framework: Next.js (React)
- Styling: Tailwind CSS
- Language: TypeScript

---

## 🔧 API Usage

### Health Check

```bash
curl http://localhost:8000/
```

**Response:**
```json
{
  "status": "healthy",
  "service": "Semantic HTML Search",
  "version": "2.0.0",
  "vector_db": "Pinecone"
}
```

### Detailed Health

```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "healthy",
  "vector_store": "connected",
  "stats": {
    "index_name": "html-search",
    "total_vector_count": 1234,
    "dimension": 384,
    "distance_metric": "cosine"
  }
}
```

### Search Endpoint

**POST** `/search`

**Request Body:**
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
        "text": "Deep learning is part of a broader family of machine learning methods...",
        "start": 0,
        "end": 156
      },
      "score": 0.856
    }
  ],
  "total_chunks": 42
}
```

**Example with curl:**
```bash
curl -X POST "http://localhost:8000/search" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://en.wikipedia.org/wiki/Machine_learning",
    "query": "neural networks and deep learning",
    "top_k": 5
  }'
```

---

## 🎨 UI Screenshots

### Modern Search Interface
- **Gradient Background**: Animated blob effects
- **Clean Forms**: Rounded inputs with icons
- **Status Badges**: Real-time Pinecone connection indicator

### Results Display
- **Relevance Scores**: Circular progress indicators
- **Beautiful Cards**: Hover effects and animations
- **Metadata**: Position tracking and character counts

---

## 🔬 How It Works

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

### 4. Pinecone Vector Database
- **Index**: `html-search` (configurable)
- **Namespaces**: URL-based for organization
- **Distance Metric**: Cosine similarity
- **Features**:
  - Serverless, auto-scaling
  - Fast approximate nearest neighbor search
  - Metadata filtering support
  - Scalable to millions of vectors

### 5. Semantic Search
- Generates embedding for the query
- Searches Pinecone using cosine similarity
- Returns top-k results ranked by relevance score

---

## 🧪 Running Tests

```bash
cd backend
pytest test_backend.py -v
```

**Test Coverage:**
- ✅ API endpoint functionality
- ✅ Text chunking algorithm
- ✅ Vector store operations
- ✅ Error handling
- ✅ Edge cases

---

## 📊 Performance

- **First Request**: ~2-3 seconds (model loading)
- **Subsequent Requests**: <1 second for typical pages
- **Memory Usage**: ~500MB for embedding model
- **Pinecone Storage**: Serverless, auto-scaling
- **Chunking Speed**: ~10,000 tokens/second
- **Embedding Speed**: ~5,000 sentences/second (CPU)

---

## 🚢 Production Deployment

### Environment Variables

**Required:**
```env
PINECONE_API_KEY=your_api_key_here
```

**Optional:**
```env
PINECONE_INDEX_NAME=html-search
PINECONE_CLOUD=aws
PINECONE_REGION=us-east-1
BACKEND_PORT=8000
LOG_LEVEL=INFO
FRONTEND_URL=https://your-frontend.com
```

### Scaling Recommendations

1. **Infrastructure**
   - Deploy backend on cloud platforms (AWS, GCP, Azure)
   - Use CDN for frontend assets
   - Add load balancer for multiple backend instances

2. **Performance**
   - GPU acceleration for embedding generation
   - Redis caching for frequently accessed embeddings
   - Async processing for background indexing

3. **Security**
   - Add authentication (API keys or OAuth2)
   - Rate limiting (Slowapi)
   - Input validation and sanitization
   - HTTPS/TLS encryption

4. **Monitoring**
   - Prometheus metrics
   - Grafana dashboards
   - Error tracking (Sentry)
   - Request logging

---

## 🐛 Troubleshooting

### Issue: Pinecone connection failed

**Solution**: Verify API key and check index exists:
```bash
# Check environment variables
echo $PINECONE_API_KEY

# Verify in Pinecone dashboard
# https://app.pinecone.io/
```

### Issue: Model download fails

**Solution**: Models download automatically on first run. Ensure internet connection and sufficient disk space (~500MB).

### Issue: Out of memory

**Solution**: The embedding model requires ~500MB RAM. Close other applications or use a machine with more memory.

### Issue: Import errors

**Solution**: Ensure all dependencies are installed:
```bash
pip install -r requirements.txt
```

### Issue: Frontend can't connect to backend

**Solution**: Check CORS settings and verify `NEXT_PUBLIC_API_URL` in `.env.local`:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > frontend/.env.local
```

---

## ✅ Technical Assignment Compliance

- ✅ **Frontend**: Next.js SPA with URL + query inputs
- ✅ **Backend**: FastAPI with Python
- ✅ **HTML Parsing**: BeautifulSoup for DOM extraction
- ✅ **Tokenization**: BERT tokenizer with 500 token chunks
- ✅ **Vector Database**: Pinecone for semantic search
- ✅ **Top 10 Results**: Returns ranked results with scores
- ✅ **Clean Content**: Removes scripts, styles, navigation
- ✅ **Setup Instructions**: Complete README with prerequisites
- ✅ **Modern UI**: Beautiful gradient design with animations

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file

---

## 👤 Author

**Aaron Sequeira**  
GitHub: [@aaron-seq](https://github.com/aaron-seq)

---

## 🙏 Acknowledgments

- Built for **Smarter.codes** technical assessment
- Uses Hugging Face transformers and sentence-transformers
- Powered by **Pinecone** vector database
- Inspired by modern semantic search applications

---

## 📚 Additional Resources

- [Pinecone Documentation](https://docs.pinecone.io/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Sentence Transformers](https://www.sbert.net/)
- [Technical Assignment](./SUBMISSION_CHECKLIST.md)

---

<div align="center">

**Made with ❤️ for Smarter.codes**

</div>
