vector_store.py  from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Dict, Tuple
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class VectorStore:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
        self.embeddings = None
        self.chunks = None
        logger.info(f"Initialized VectorStore with {model_name}")
    
    def index_chunks(self, chunks: List[Dict[str, any]]) -> None:
        if not chunks:
            raise ValueError("Cannot index empty chunks")
        
        texts = [chunk['text'] for chunk in chunks]
        logger.info(f"Generating embeddings for {len(texts)} chunks")
        
        self.embeddings = self.model.encode(
            texts, 
            convert_to_numpy=True,
            show_progress_bar=False,
            normalize_embeddings=True
        )
        self.chunks = chunks
        logger.info(f"Indexed {len(chunks)} chunks")
    
    def search(self, query: str, top_k: int = 10) -> List[Tuple[Dict, float]]:
        if self.embeddings is None or self.chunks is None:
            raise ValueError("Vector store not indexed")
        
        query_embedding = self.model.encode(
            query,
            convert_to_numpy=True,
            normalize_embeddings=True
        )
        
        similarities = np.dot(self.embeddings, query_embedding)
        top_k = min(top_k, len(self.chunks))
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            chunk = self.chunks[idx].copy()
            score = float(similarities[idx])
            results.append((chunk, score))
        
        logger.info(f"Search returned {len(results)} results")
        return results
    
    def clear(self) -> None:
        self.embeddings = None
        self.chunks = None
        logger.info("Vector store cleared")
