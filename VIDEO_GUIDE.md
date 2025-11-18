# Video Walkthrough Guide

## 🎥 5-10 Minute Technical Demonstration

This guide will help you create a professional walkthrough video for the Smarter.codes technical assessment.

---

## 🛠️ Recommended Tools

### **Option 1: Loom (Easiest - Recommended)**
- **Website**: https://www.loom.com/
- **Price**: Free tier available
- **Pros**: 
  - Easy to use
  - Automatic upload and sharing
  - Face cam option
  - Instant shareable link
- **Setup**: Install browser extension or desktop app

### **Option 2: OBS Studio (Advanced)**
- **Website**: https://obsproject.com/
- **Price**: Free and open-source
- **Pros**:
  - Professional quality
  - More control over recording
  - Multiple scenes
- **Setup**: Download and install, configure scenes

### **Option 3: Built-in Screen Recorder**

**Windows (Win + G):**
- Xbox Game Bar built-in recorder
- Simple and free

**macOS (Cmd + Shift + 5):**
- QuickTime or Screenshot toolbar
- Built-in, no installation needed

**Linux:**
- SimpleScreenRecorder
- Kazam

---

## 🎬 Video Structure (8-10 minutes)

### **Introduction (30 seconds)**

**Script:**
```
"Hello! My name is Aaron Sequeira, and this is my submission for the 
Smarter.codes technical assessment. Today I'll demonstrate my Semantic 
HTML Search Engine - a full-stack application that uses AI-powered 
vector databases to search website content semantically.

I'll show you the application in action, walk through the codebase, 
and explain the key technical decisions I made."
```

---

### **Part 1: Live Demo (3-4 minutes)**

#### **Setup (30 seconds)**

**Actions:**
1. Open terminal
2. Show docker-compose command:
   ```bash
   docker-compose up -d
   ```
3. Show services starting
4. Open browser tabs:
   - Frontend: http://localhost:3000
   - Backend API Docs: http://localhost:8000/docs
   - Qdrant Dashboard: http://localhost:6333/dashboard

**Script:**
```
"Let me start by launching the application using Docker Compose. 
With a single command, we're starting three services: the Next.js 
frontend, FastAPI backend, and Qdrant vector database.

As you can see, all services are now running. Let's look at the 
user interface."
```

---

#### **Demo 1: Simple Search (90 seconds)**

**Actions:**
1. Navigate to frontend (http://localhost:3000)
2. Enter URL: `https://en.wikipedia.org/wiki/Machine_learning`
3. Enter query: `neural networks and deep learning`
4. Click Submit
5. Show loading state
6. Highlight results:
   - Top 10 chunks displayed
   - Similarity scores
   - Total chunks processed

**Script:**
```
"The interface is clean and intuitive. Users enter a website URL 
and their search query. Let's search for 'neural networks and deep 
learning' on the Wikipedia Machine Learning page.

[Click Submit]

Notice the loading indicator while the backend processes the request. 
This involves fetching the HTML, chunking the text, generating 
embeddings, and searching the vector database.

[Results appear]

Excellent! We got 10 semantically relevant results, ranked by 
similarity score. The top result has a score of 0.87, which indicates 
very high semantic similarity. Each result shows the chunk of text, 
its position, and relevance score."
```

---

#### **Demo 2: Different Query (60 seconds)**

**Actions:**
1. Clear previous search
2. Use same URL
3. Enter different query: `applications of artificial intelligence`
4. Show different results
5. Point out semantic understanding

**Script:**
```
"Let's try a different query on the same page to demonstrate semantic 
understanding. I'll search for 'applications of artificial intelligence'.

[Show results]

Notice how the system found relevant content even though the exact 
phrase might not appear in the text. This is the power of semantic 
search - it understands meaning, not just keywords."
```

---

#### **Demo 3: Backend API Documentation (30 seconds)**

**Actions:**
1. Switch to http://localhost:8000/docs
2. Show Swagger UI
3. Expand `/search` endpoint
4. Show request/response schemas

**Script:**
```
"FastAPI automatically generates interactive API documentation. 
Here you can see our search endpoint, the request schema with 
validation, and the structured response format. This makes 
integration and testing much easier."
```

---

#### **Demo 4: Qdrant Dashboard (30 seconds)**

**Actions:**
1. Open http://localhost:6333/dashboard
2. Show `html_chunks` collection
3. Show vector count
4. Browse a few vectors and their payloads

**Script:**
```
"Here's the Qdrant vector database dashboard. You can see our 
'html_chunks' collection with all indexed vectors. Each vector 
represents a chunk of text with its 384-dimensional embedding. 
The payload stores the original text and position metadata."
```

---

### **Part 2: Codebase Walkthrough (4-5 minutes)**

#### **Project Structure (30 seconds)**

**Actions:**
1. Open VS Code or your IDE
2. Show directory structure
3. Highlight key folders: `backend/`, `frontend/`, `docker-compose.yml`

**Script:**
```
"Let's dive into the code. The project follows a clean, modular 
architecture. The backend contains our FastAPI application, the 
frontend is a Next.js SPA, and Docker Compose orchestrates 
everything."
```

---

#### **Backend Deep Dive (2 minutes)**

**File 1: app.py (30 seconds)**

**Actions:**
1. Open `backend/app.py`
2. Show imports
3. Highlight `/search` endpoint
4. Show error handling

**Script:**
```
"The main application file defines our FastAPI endpoints. The search 
endpoint follows a clear workflow: fetch HTML, chunk it, index in 
Qdrant, search, and return results. Notice comprehensive error 
handling at each step."
```

---

**File 2: vector_store.py (45 seconds)**

**Actions:**
1. Open `backend/vector_store.py`
2. Show Qdrant client initialization
3. Highlight `index_chunks()` method
4. Show `search()` method
5. Point out embedding generation

**Script:**
```
"This is the heart of our semantic search. The VectorStore class 
manages Qdrant integration. 

In index_chunks, we generate embeddings using sentence-transformers 
and upload them to Qdrant with metadata.

The search method encodes the query, performs cosine similarity 
search in Qdrant, and returns ranked results. This is where the 
magic happens - converting text to vectors and finding semantic 
similarity."
```

---

**File 3: chunking.py (30 seconds)**

**Actions:**
1. Open `backend/chunking.py`
2. Show BERT tokenizer initialization
3. Highlight sliding window algorithm
4. Show overlap parameter

**Script:**
```
"Text chunking uses a BERT tokenizer for consistent tokenization. 
The sliding window algorithm creates 500-token chunks with 50-token 
overlap. This overlap is crucial - it prevents information loss at 
chunk boundaries and maintains context."
```

---

**File 4: html_utils.py (15 seconds)**

**Actions:**
1. Open `backend/html_utils.py`
2. Show BeautifulSoup cleaning
3. Highlight removal of scripts/styles

**Script:**
```
"HTML processing uses BeautifulSoup to fetch and clean content. We 
remove scripts, styles, and navigation elements to extract only 
readable text."
```

---

#### **Frontend Overview (1 minute)**

**Actions:**
1. Open `frontend/pages/index.tsx`
2. Show component structure
3. Highlight state management
4. Show API call
5. Point out result rendering

**Script:**
```
"The frontend is a Next.js single-page application. It manages 
state with React hooks, makes POST requests to our backend API, 
and displays results in a clean, card-based layout.

The component handles loading states, errors, and empty states 
gracefully. TypeScript ensures type safety across the entire 
application."
```

---

#### **Docker Configuration (30 seconds)**

**Actions:**
1. Open `docker-compose.yml`
2. Show services: qdrant, backend
3. Highlight environment variables
4. Show volume mounts

**Script:**
```
"Docker Compose makes deployment trivial. We define two services: 
Qdrant for vector storage and our FastAPI backend. Environment 
variables configure the connection, and volumes ensure data 
persistence."
```

---

### **Part 3: Technical Highlights & Architecture (1-2 minutes)**

**Actions:**
1. Open README.md or draw a quick diagram
2. Show workflow diagram

**Script:**
```
"Let me summarize the technical architecture:

1. User submits URL and query via Next.js frontend
2. FastAPI backend fetches and cleans HTML with BeautifulSoup
3. BERT tokenizer chunks text into 500-token segments with overlap
4. Sentence-transformers generate 384-dimensional embeddings
5. Qdrant indexes vectors with cosine similarity
6. Search query is embedded and compared against indexed vectors
7. Top 10 results are returned and displayed

Key decisions:
- Qdrant for persistent, scalable vector storage
- all-MiniLM-L6-v2 for fast, accurate embeddings
- Overlap in chunking to maintain context
- Docker for reproducible deployment

This architecture is production-ready and can scale to handle 
millions of vectors with proper infrastructure."
```

---

### **Conclusion (30 seconds)**

**Script:**
```
"To summarize, I've built a complete semantic search engine that:
- Uses modern web technologies (Next.js, FastAPI)
- Integrates a production-grade vector database (Qdrant)
- Implements AI-powered semantic understanding
- Follows best practices for code quality and documentation
- Is fully containerized and deployment-ready

All code is available on GitHub, fully documented, and tested. 
Thank you for watching, and I look forward to discussing this 
project further!"
```

---

## ✅ Pre-Recording Checklist

### **Environment Setup**
- [ ] Clean desktop (close unnecessary windows)
- [ ] Restart Docker services to ensure clean state
- [ ] Test all URLs work:
  - [ ] Frontend: http://localhost:3000
  - [ ] Backend: http://localhost:8000/docs
  - [ ] Qdrant: http://localhost:6333/dashboard
- [ ] Prepare sample URLs for demo (Wikipedia articles work well)
- [ ] Close unnecessary browser tabs
- [ ] Set up code editor with files ready to show

### **Recording Setup**
- [ ] Test microphone (clear audio is critical)
- [ ] Quiet environment (no background noise)
- [ ] Good lighting (if using face cam)
- [ ] High resolution (1080p recommended)
- [ ] Stable internet connection
- [ ] Battery charged (if laptop)

### **Content Preparation**
- [ ] Practice walkthrough 2-3 times
- [ ] Time yourself (aim for 8-10 minutes)
- [ ] Prepare talking points (don't need full script)
- [ ] Have backup demo URLs ready
- [ ] Know exactly which code files to show

---

## 🎬 Recording Tips

### **Do:**
- ✅ Speak clearly and at a moderate pace
- ✅ Show enthusiasm for your project
- ✅ Explain WHY you made technical decisions
- ✅ Demonstrate actual functionality (not just code)
- ✅ Use specific examples
- ✅ Keep it under 10 minutes

### **Don't:**
- ❌ Rush through sections
- ❌ Read code line by line
- ❌ Spend too long on trivial details
- ❌ Apologize for minor mistakes
- ❌ Show debugging or errors (pre-test everything)

---

## 📝 Recording Script Template

Use this as a guide (don't read it word-for-word):

```
[0:00-0:30] Introduction
  - Name and project overview
  - What you'll demonstrate

[0:30-4:30] Live Demo
  - Start services
  - Demo 1: Search example
  - Demo 2: Different query
  - Show API docs
  - Show Qdrant dashboard

[4:30-8:30] Code Walkthrough
  - Project structure
  - Backend (app.py, vector_store.py, chunking.py)
  - Frontend overview
  - Docker configuration

[8:30-10:00] Architecture & Conclusion
  - Technical highlights
  - Key decisions
  - Thank you and closing
```

---

## 💾 Editing (Optional)

### **Basic Editing Tools**
- **Loom**: Built-in trimming
- **iMovie** (Mac): Free, user-friendly
- **DaVinci Resolve** (All platforms): Free, professional
- **Shotcut** (All platforms): Free, open-source

### **What to Edit**
1. **Trim dead air** at start/end
2. **Cut long pauses** (but keep natural breathing room)
3. **Add title slide** (optional):
   ```
   Semantic HTML Search Engine
   Smarter.codes Technical Assessment
   Aaron Sequeira
   ```
4. **Add captions** (optional but helpful)

---

## 🚀 Publishing & Sharing

### **Recommended Platforms**

1. **Loom** (Easiest)
   - Auto-uploads during recording
   - Shareable link immediately available
   - Can set privacy to "Anyone with link"

2. **YouTube** (Unlisted)
   - Upload as "Unlisted" video
   - Professional appearance
   - Reliable streaming

3. **Google Drive**
   - Upload video file
   - Share with "Anyone with link can view"
   - Works but less professional than Loom/YouTube

### **Sharing the Video**

Add link to:
1. **README.md** (create "Demo Video" section)
2. **Submission email** to Smarter.codes
3. **GitHub repository description**

---

## 📝 Example README Section

Add this to your README.md:

```markdown
## 🎥 Demo Video

Watch the full walkthrough video (8 minutes):

**[View Demo Video](<YOUR_VIDEO_LINK_HERE>)**

The video covers:
- Live demonstration of the application
- Code walkthrough and architecture explanation
- Technical decisions and implementation details
```

---

## ❓ FAQ

**Q: What if I make a mistake during recording?**  
A: Minor stumbles are fine! Just pause, take a breath, and continue. You can edit out long pauses later.

**Q: Should I show my face?**  
A: Optional. Face cam adds personality but isn't required. Your voice and screen are most important.

**Q: What resolution should I record at?**  
A: 1080p (1920x1080) is ideal. Minimum 720p.

**Q: How do I test my microphone?**  
A: Record a 10-second test clip and play it back. Ensure clear audio with no echo or background noise.

**Q: What if the demo breaks during recording?**  
A: Pre-test everything! But if something fails, stay calm, mention it's a demo environment issue, and continue with the code walkthrough.

---

## ✅ Final Checklist Before Submitting

- [ ] Video is 5-10 minutes long
- [ ] Audio is clear and understandable
- [ ] All features demonstrated work correctly
- [ ] Code sections are visible and readable
- [ ] You explained WHY you made technical choices
- [ ] Video link is included in submission
- [ ] Video is accessible (not private)
- [ ] You tested the link in incognito/private browser

---

**Good luck with your recording! You've built something great - now show it off with confidence!** 🚀
