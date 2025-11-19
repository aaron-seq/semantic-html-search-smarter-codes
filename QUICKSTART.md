# 🚀 Quick Start Guide

## 5-Minute Setup

Get the semantic search engine running locally in just 5 minutes!

---

## Prerequisites Check

Before starting, make sure you have:

- [ ] **Python 3.8+** installed (`python --version`)
- [ ] **Node.js 16+** installed (`node --version`)
- [ ] **Pinecone Account** ([Sign up free](https://www.pinecone.io/))
- [ ] **Git** installed

---

## Step 1: Get Pinecone API Key (2 minutes)

1. Go to [https://www.pinecone.io/](https://www.pinecone.io/)
2. Sign up for a free account
3. Create a new project
4. Navigate to **API Keys** in the dashboard
5. Copy your **API Key**
6. Note your **Environment** (e.g., `us-east-1-aws`)

---

## Step 2: Clone and Setup Backend (2 minutes)

```bash
# Clone repository
git clone https://github.com/aaron-seq/semantic-html-search-smarter-codes.git
cd semantic-html-search-smarter-codes

# Setup backend
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp ../.env.example .env
```

**Edit `.env` file with your Pinecone credentials:**

```env
PINECONE_API_KEY=your_api_key_here
PINECONE_INDEX_NAME=html-search
PINECONE_CLOUD=aws
PINECONE_REGION=us-east-1
```

**Start backend:**

```bash
python app.py
```

✅ Backend running at http://localhost:8000

---

## Step 3: Setup Frontend (1 minute)

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

## Step 4: Test the Application

1. Open browser to http://localhost:3000
2. Enter a URL: `https://en.wikipedia.org/wiki/Artificial_intelligence`
3. Enter a query: `machine learning and neural networks`
4. Click **Search**
5. View your semantic search results!

---

## Troubleshooting

### Backend won't start

**Error**: `PINECONE_API_KEY environment variable not set`

**Fix**: Make sure your `.env` file exists in the `backend/` directory with your API key.

### Frontend can't connect

**Error**: Network error or CORS issues

**Fix**: 
1. Verify backend is running at http://localhost:8000
2. Check `.env.local` file in `frontend/` directory
3. Restart both backend and frontend

### Module not found

**Fix**: Make sure you installed dependencies:

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

---

## Next Steps

- 📚 Read the full [README.md](./README.md)
- 🔧 Check out [API Documentation](http://localhost:8000/docs)
- 🧪 Run tests: `cd backend && pytest test_backend.py -v`
- 📦 Deploy with Docker: `docker-compose up -d`

---

## Need Help?

If you encounter any issues:

1. Check the [Troubleshooting section](./README.md#-troubleshooting) in README
2. Review backend logs in the terminal
3. Check browser console for frontend errors
4. Verify your Pinecone API key is valid

---

**Happy Searching! 🚀**
