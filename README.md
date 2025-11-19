# Semantic HTML Search Engine

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688.svg)
![Next.js](https://img.shields.io/badge/Next.js-latest-black.svg)
![Qdrant](https://img.shields.io/badge/Qdrant-Vector_DB-6366F1.svg)

A production-ready semantic search engine for HTML content using **Qdrant vector database**, sentence embeddings, FastAPI, and Next.js with a beautiful modern UI.

**Built for Smarter.codes Technical Assignment**

[Features](#-key-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [API](#-api-usage)

</div>

---

## 🎯 Overview

This application demonstrates modern NLP techniques and vector database integration for semantic search:

- **Vector Database**: Qdrant for persistent, scalable vector storage
- **Semantic Search**: sentence-transformers (all-MiniLM-L6-v2) for meaning-based similarity  
- **HTML Processing**: Intelligent fetching and cleaning of web content
- **Smart Chunking**: BERT tokenizer-based text splitting (500 tokens max)
- **RESTful API**: FastAPI with automatic OpenAPI documentation
- **Modern Frontend**: Next.js SPA with beautiful gradient UI and animations
- **Type Safety**: Full Pydantic models and TypeScript
- **Production Ready**: Comprehensive error handling and logging

---

## ✨ Key Features

### Backend
- ✅ **Qdrant Integration**: Fast, persistent vector database
- ✅ **500 Token Chunks**: BERT tokenizer with 50-token overlap
- ✅ **Semantic Embeddings**: 384-dimensional vectors (all-MiniLM-L6-v2)
- ✅ **Health Endpoints**: `/` and `/health` with vector store stats
- ✅ **CORS Support**: Configured for frontend integration
- ✅ **Docker Ready**: Complete Docker Compose setup

### Frontend  
- ✅ **Modern UI**: Beautiful gradient design with animated backgrounds
- ✅ **Responsive Layout**: Mobile-first Tailwind CSS
- ✅ **Real-time Feedback**: Loading states and error handling
- ✅ **Result Visualization**: Score circles and relevance percentages
- ✅ **TypeScript**: Full type safety across components

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+**
- **Node.js 16+**
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

#### Step 1: Start Qdrant

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

---

## 📖 How It Works

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
  - Scalable to millions of vectors
  - Built-in dashboard

### 5. Semantic Search
- Generates embedding for the query
- Searches Qdrant using cosine similarity
- Returns top-k results ranked by relevance score

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

## 🧪 Running Tests

```bash
cd backend
pytest test_backend.py -v
```

---

## 📊 Performance

- **First Request**: ~2-3 seconds (model loading)
- **Subsequent Requests**: <1 second for typical pages
- **Memory Usage**: ~500MB for embedding model
- **Qdrant Storage**: Persistent on disk
- **Chunking Speed**: ~10,000 tokens/second
- **Embedding Speed**: ~5,000 sentences/second (CPU)

---

## 🐛 Troubleshooting

### Issue: Qdrant connection failed

**Solution**: Ensure Qdrant is running:
```bash
docker ps | grep qdrant
# Or check Qdrant logs
docker logs qdrant
```

### Issue: Frontend can't connect to backend

**Solution**: Check CORS settings and verify `.env.local`:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > frontend/.env.local
```

### Issue: Import errors

**Solution**: Install all dependencies:
```bash
pip install -r requirements.txt
```

---

## ✅ Technical Assignment Compliance

- ✅ **Frontend**: Next.js SPA with URL + query inputs
- ✅ **Backend**: FastAPI with Python
- ✅ **HTML Parsing**: BeautifulSoup for DOM extraction
- ✅ **Tokenization**: BERT tokenizer with 500 token chunks
- ✅ **Vector Database**: Qdrant for semantic search
- ✅ **Top 10 Results**: Returns ranked results with scores
- ✅ **Clean Content**: Removes scripts, styles, navigation
- ✅ **Setup Instructions**: Complete documentation
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
- Powered by **Qdrant** vector database
- Inspired by modern semantic search applications

---

<div align="center">

**Made with ❤️ for Smarter.codes**

</div>
