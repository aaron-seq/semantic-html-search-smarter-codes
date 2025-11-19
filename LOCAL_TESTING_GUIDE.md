# 🧪 Local Testing Guide

## Complete Step-by-Step Instructions

This guide will help you run and test the updated semantic search engine with Pinecone integration and modern UI.

---

## 📚 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pinecone Setup](#pinecone-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Testing the Application](#testing-the-application)
6. [Common Issues](#common-issues)
7. [API Testing](#api-testing)

---

## Prerequisites

### Check Your System

Run these commands to verify installations:

```bash
# Check Python version (need 3.8+)
python --version
# or
python3 --version

# Check Node.js version (need 16+)
node --version

# Check npm
npm --version

# Check pip
pip --version
```

### Install Missing Tools

**Python 3.8+:**
- macOS: `brew install python3`
- Ubuntu: `sudo apt install python3 python3-pip`
- Windows: Download from [python.org](https://www.python.org/downloads/)

**Node.js 16+:**
- All platforms: Download from [nodejs.org](https://nodejs.org/)
- Or use nvm: `nvm install 16`

---

## Pinecone Setup

### Step 1: Create Account

1. Go to **https://www.pinecone.io/**
2. Click **"Start Free"** or **"Sign Up"**
3. Create account with email/Google/GitHub
4. Verify your email

### Step 2: Get API Key

1. **Log in** to Pinecone dashboard
2. Click on **"API Keys"** in the left sidebar
3. You'll see your **API Key** displayed
4. **Copy** the API key (it looks like: `xxxx-xxxx-xxxx-xxxx`)
5. Note your **Environment** (e.g., `us-east-1-aws`, `gcp-starter`, etc.)

### Step 3: Note Configuration

Write down:
- **API Key**: `your-api-key-here`
- **Cloud**: Usually `aws` or `gcp`
- **Region**: Usually `us-east-1` for AWS

⚠️ **Keep your API key secure!** Don't commit it to Git.

---

## Backend Setup

### Step 1: Clone Repository

```bash
# Clone the repo
git clone https://github.com/aaron-seq/semantic-html-search-smarter-codes.git

# Navigate to project
cd semantic-html-search-smarter-codes

# Checkout the Pinecone branch
git checkout pinecone-migration-ui-update
```

### Step 2: Create Virtual Environment

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv
# or if python3 is needed:
python3 -m venv venv
```

### Step 3: Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### Step 4: Install Dependencies

```bash
# Make sure you're in backend/ directory with venv activated
pip install -r requirements.txt
```

This will install:
- FastAPI
- Pinecone client
- sentence-transformers
- BeautifulSoup4
- and other dependencies

**Expected time:** 2-5 minutes (downloads ~500MB of ML models)

### Step 5: Configure Environment Variables

```bash
# Copy example .env file
cp ../.env.example .env
```

**Edit the `.env` file** (use your favorite text editor):

```env
# REQUIRED: Add your Pinecone API key
PINECONE_API_KEY=your-actual-api-key-here

# REQUIRED: Index name (you can keep default)
PINECONE_INDEX_NAME=html-search

# REQUIRED: Cloud provider (aws, gcp, or azure)
PINECONE_CLOUD=aws

# REQUIRED: Region (check your Pinecone dashboard)
PINECONE_REGION=us-east-1

# Optional settings
BACKEND_PORT=8000
LOG_LEVEL=INFO
FRONTEND_URL=http://localhost:3000
```

### Step 6: Run Backend

```bash
# Make sure you're in backend/ with venv activated
python app.py
```

**Expected output:**
```
INFO: Initializing Pinecone client
INFO: Using existing index: html-search
  OR
INFO: Creating new Pinecone index: html-search
INFO: Initialized VectorStore with all-MiniLM-L6-v2 (dim=384)
INFO: Vector store initialized successfully
INFO: Application startup complete.
INFO: Uvicorn running on http://0.0.0.0:8000
```

### Step 7: Verify Backend

Open **new terminal** and test:

```bash
curl http://localhost:8000/
```

**Expected response:**
```json
{
  "status": "healthy",
  "service": "Semantic HTML Search",
  "version": "2.0.0",
  "vector_db": "Pinecone"
}
```

✅ **Backend is running!**

---

## Frontend Setup

### Step 1: Open New Terminal

**Keep backend running!** Open a new terminal window/tab.

```bash
# Navigate to frontend folder
cd path/to/semantic-html-search-smarter-codes/frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

**Expected time:** 1-2 minutes

### Step 3: Configure Environment

```bash
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

**Or manually create** `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 4: Run Frontend

```bash
npm run dev
```

**Expected output:**
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
event - compiled client and server successfully
```

✅ **Frontend is running!**

---

## Testing the Application

### Step 1: Open Browser

Navigate to: **http://localhost:3000**

You should see:
- Beautiful gradient background with animated blobs
- "Semantic HTML Search" title
- Search form with URL and query inputs
- Status badges showing "Powered by Pinecone"

### Step 2: Test Search

**Test Case 1: Wikipedia Article**

1. **URL**: `https://en.wikipedia.org/wiki/Artificial_intelligence`
2. **Query**: `machine learning and neural networks`
3. Click **Search**

**Expected behavior:**
- Loading spinner appears
- After 2-3 seconds (first search loads models)
- Results appear with:
  - Gradient header showing query stats
  - Top 10 results with relevance scores
  - Circular progress indicators
  - Text snippets from the page

**Test Case 2: Different Topic**

1. **URL**: `https://en.wikipedia.org/wiki/Python_(programming_language)`
2. **Query**: `web frameworks and libraries`
3. Click **Search**

**Expected behavior:**
- Faster response (<1 second)
- Results relevant to Python web frameworks

**Test Case 3: Clear and Reset**

1. Click **Clear** button
2. Form should reset
3. Results should disappear

### Step 3: Test Error Handling

**Invalid URL:**
1. **URL**: `not-a-valid-url`
2. **Query**: `test`
3. Click **Search**
4. Should show error message

**Empty Fields:**
1. Leave fields empty
2. Click **Search**
3. Browser validation should prevent submission

---

## Common Issues

### Issue 1: Backend Won't Start

**Error:** `PINECONE_API_KEY environment variable not set`

**Solution:**
```bash
# Check .env file exists
ls -la .env

# Verify contents
cat .env

# Make sure API key is set (no quotes needed)
PINECONE_API_KEY=your-key-here
```

### Issue 2: Import Error

**Error:** `ModuleNotFoundError: No module named 'pinecone'`

**Solution:**
```bash
# Make sure virtual environment is activated
# You should see (venv) in prompt

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue 3: Frontend Can't Connect

**Error:** `Network Error` or `Failed to fetch`

**Solution:**
1. Check backend is running: `curl http://localhost:8000/`
2. Check `.env.local` exists in `frontend/`
3. Restart frontend: `Ctrl+C` then `npm run dev`

### Issue 4: Pinecone Connection Failed

**Error:** `Failed to initialize vector store`

**Solution:**
1. Verify API key is correct
2. Check internet connection
3. Log into Pinecone dashboard to confirm account is active
4. Try different region if needed

### Issue 5: Port Already in Use

**Error:** `Address already in use: 8000`

**Solution:**
```bash
# Find process using port 8000
lsof -i :8000
# or on Windows:
netstat -ano | findstr :8000

# Kill the process or change port in .env
BACKEND_PORT=8001
```

---

## API Testing

### Test with curl

**Health Check:**
```bash
curl http://localhost:8000/health
```

**Search Request:**
```bash
curl -X POST "http://localhost:8000/search" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://en.wikipedia.org/wiki/Machine_learning",
    "query": "neural networks",
    "top_k": 5
  }'
```

### Test with API Docs

1. Open: **http://localhost:8000/docs**
2. You'll see interactive Swagger UI
3. Click on **POST /search**
4. Click **"Try it out"**
5. Enter test data
6. Click **"Execute"**
7. See response

---

## Verification Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:8000/docs
- [ ] Search returns results
- [ ] Results show relevance scores
- [ ] UI looks modern with gradients
- [ ] Clear button works
- [ ] Error messages display properly
- [ ] No console errors in browser

---

## Next Steps

Once everything is working:

1. 🧪 **Run tests**: `cd backend && pytest test_backend.py -v`
2. 📚 **Read full docs**: Check [README.md](./README.md)
3. 🚀 **Deploy**: Try Docker deployment
4. 🔧 **Customize**: Modify UI or add features

---

## Getting Help

If you're still stuck:

1. Check backend logs in terminal
2. Check browser console (F12) for errors
3. Verify all environment variables
4. Ensure Pinecone account is active
5. Review [Troubleshooting](./README.md#-troubleshooting) in README

---

## Success! 🎉

You should now have:
- ✅ Backend running on port 8000
- ✅ Frontend running on port 3000
- ✅ Pinecone connected and working
- ✅ Beautiful modern UI
- ✅ Semantic search functionality

**Enjoy your semantic search engine!** 🚀
