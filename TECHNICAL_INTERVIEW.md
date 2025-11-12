# Technical Interview Preparation Guide

## Project Overview

This semantic HTML search engine demonstrates proficiency in:
- **Backend Development**: FastAPI, Python type hints, RESTful APIs
- **NLP/ML**: Sentence transformers, vector embeddings, semantic search
- **Frontend Development**: Next.js, React, TypeScript
- **System Design**: Microservices architecture, API design
- **Testing**: Unit tests, integration tests with pytest

## Architecture Deep Dive

### Backend Architecture

#### 1. FastAPI Application (app.py)
**Key Technical Decisions:**
- **Why FastAPI?** Automatic OpenAPI documentation, async support, type validation with Pydantic
- **CORS Configuration**: Enables frontend-backend communication across different ports
- **Error Handling**: Structured HTTP exceptions with appropriate status codes

**Interview Questions to Prepare:**
- Q: Why use FastAPI over Flask?
  - A: FastAPI provides automatic request validation, OpenAPI docs, better async support, and type safety

- Q: How does async/await improve performance?
  - A: Allows handling multiple concurrent requests without blocking, especially useful for I/O operations

#### 2. Text Chunking (chunking.py)
**Algorithm**: Sliding window with overlap
- **Max tokens**: 500 (prevents context loss in embeddings)
- **Overlap**: 50 tokens (maintains context across chunks)
- **Why BERT tokenizer?** Matches the embedding model's tokenization

**Interview Questions:**
- Q: Why chunk text instead of embedding the entire document?
  - A: Embedding models have context length limits; chunking improves search granularity and relevance

- Q: Why use overlapping chunks?
  - A: Prevents information loss at chunk boundaries; ensures important context isn't split

#### 3. Vector Store (vector_store.py)
**Embedding Model**: all-MiniLM-L6-v2
- **Why this model?** Balance between performance and speed (384 dimensions, fast inference)
- **Similarity Metric**: Cosine similarity via dot product (embeddings are normalized)

**Interview Questions:**
- Q: How does semantic search differ from keyword search?
  - A: Semantic search uses vector embeddings to find meaning-based similarities, not just exact matches

- Q: What are alternatives to cosine similarity?
  - A: Euclidean distance, dot product, Manhattan distance (cosine is rotation-invariant and scale-independent)

### Data Flow

```
1. User Request → POST /search {url, query}
2. Fetch HTML → BeautifulSoup cleaning
3. Text Chunking → BERT tokenizer with sliding window
4. Generate Embeddings → sentence-transformers
5. Index Chunks → Store embeddings + metadata
6. Semantic Search → Cosine similarity ranking
7. Return Results → Top-k chunks with scores
```

## Technical Concepts to Master

### 1. Vector Embeddings
- **What**: Dense numerical representations of text
- **How**: Transformer models encode semantic meaning
- **Dimensionality**: all-MiniLM-L6-v2 produces 384-dimensional vectors

### 2. Semantic Search
- **Process**: Query → Embed → Compare → Rank
- **Advantage**: Finds conceptually similar content ("ML" matches "machine learning")

### 3. API Design
- **RESTful Principles**: Resource-based URLs, HTTP methods, status codes
- **Request Validation**: Pydantic models ensure type safety
- **Response Structure**: Consistent JSON format with metadata

### 4. Error Handling
- **400 Bad Request**: Invalid URL, empty content
- **422 Unprocessable Entity**: Missing required fields
- **500 Internal Server Error**: Unexpected failures

## Testing Strategy

### Unit Tests (test_backend.py)
1. **Component Testing**: Individual function verification
2. **Integration Testing**: FastAPI TestClient for endpoints
3. **Edge Cases**: Empty text, invalid URLs, missing fields

**Interview Questions:**
- Q: What's the difference between unit and integration tests?
  - A: Unit tests isolate single components; integration tests verify component interactions

## Performance Considerations

### Optimization Opportunities
1. **Caching**: Store embeddings for frequently accessed URLs
2. **Batch Processing**: Process multiple chunks simultaneously
3. **Model Quantization**: Reduce model size without significant accuracy loss
4. **Database**: Use vector databases (Pinecone, Weaviate) for large-scale deployment

### Scalability Discussion
- **Current**: In-memory vector store (suitable for demo)
- **Production**: Use dedicated vector DB, implement caching, add load balancing

## Common Interview Topics

### System Design
- **Q: How would you scale this to millions of documents?**
  - A: Use vector DB (Pinecone/Milvus), implement sharding, add caching layer (Redis), use message queues for async processing

### ML/NLP
- **Q: How do transformer models work?**
  - A: Self-attention mechanism captures word relationships; multiple layers build contextual understanding

### Backend
- **Q: How do you handle race conditions?**
  - A: Use locks, atomic operations, or message queues; in this app, each request has isolated vector store instance

## Code Quality Highlights

1. **Type Hints**: Full type annotations for better IDE support and error detection
2. **Logging**: Structured logging for debugging and monitoring
3. **Error Messages**: Descriptive messages for easier debugging
4. **Documentation**: Docstrings explain function behavior
5. **Modularity**: Separated concerns (chunking, embedding, API)

## Extension Ideas

1. **Persistence**: Save indexed documents to database
2. **User Authentication**: Add API keys or OAuth
3. **Query Expansion**: Use synonyms or related terms
4. **Multilingual Support**: Use multilingual embedding models
5. **Analytics**: Track popular queries and search patterns

## Key Talking Points

- **Technical Depth**: Understanding of transformers, embeddings, API design
- **Trade-offs**: Memory vs speed, accuracy vs latency
- **Production Readiness**: Error handling, logging, testing
- **Scalability**: Clear path from prototype to production
- **Best Practices**: Type safety, modularity, documentation

---

**Remember**: Be ready to explain WHY you made each technical decision, not just WHAT you implemented.
