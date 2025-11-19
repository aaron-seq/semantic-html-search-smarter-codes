# 🚀 Quick Start Guide

## 5-Minute Setup

Get the semantic search engine running locally in just 5 minutes!

---

## Prerequisites Check

Before starting, make sure you have:

- [ ] **Python 3.8+** installed (`python --version`)
- [ ] **Node.js 16+** installed (`node --version`)
- [ ] **Docker** installed (for Qdrant database)
- [ ] **Git** installed

---

## Step 1: Clone Repository

```bash
# Clone repository
git clone https://github.com/aaron-seq/semantic-html-search-smarter-codes.git
cd semantic-html-search-smarter-codes
```

---

## Step 2: Start Qdrant (1 minute)

```bash
# Start Qdrant using Docker
docker run -d \
  --name qdrant \
  -p 6333:6333 \
  -p 6334:6334 \
  -v $(pwd)/qdrant_storage:/qdrant/storage \
  qdrant/qdrant:latest

# Verify it's running
curl http://localhost:6333
```

✅ Qdrant running at http://localhost:6333

---

## Step 3: Setup Backend (2 minutes)

```bash
# Navigate to backend
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

# Create .env file (no API keys needed!)
cp ../.env.example .env

# Start backend
python app.py
```

✅ Backend running at http://localhost:8000

---

## Step 4: Setup Frontend (1 minute)

Open a **new terminal window**:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start frontend
npm run dev
```

✅ Frontend running at http://localhost:3000

---

## Step 5: Test the Application

1. Open browser to http://localhost:3000
2. Enter a URL: `https://en.wikipedia.org/wiki/Artificial_intelligence`
3. Enter a query: `machine learning and neural networks`
4. Click **Search**
5. View your beautiful semantic search results! 🎉

---

## Troubleshooting

### Qdrant won't start

**Fix**: Make sure Docker is running:
```bash
docker ps
```

### Backend won't start

**Fix**: Make sure virtual environment is activated and dependencies are installed:
```bash
pip install -r requirements.txt
```

### Frontend can't connect

**Fix**: 
1. Verify backend is running at http://localhost:8000
2. Check `.env.local` file in `frontend/` directory
3. Restart both backend and frontend

---

## Next Steps

- 📚 Read the full [README.md](./README.md)
- 🔧 Check out [API Documentation](http://localhost:8000/docs)
- 🧪 Run tests: `cd backend && pytest test_backend.py -v`
- 🎨 View Qdrant Dashboard: http://localhost:6333/dashboard
- 📦 Deploy with Docker: `docker-compose up -d`

---

**Happy Searching! 🚀**
