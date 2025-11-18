"""Vector store implementation using Qdrant for persistent vector storage and semantic search."""

from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from typing import List, Dict, Tuple
import logging
import os
import uuid

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class VectorStore:
    """Vector store using Qdrant for indexing and semantic search."""
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize the vector store with Qdrant client and sentence transformer.
        
        Args:
            model_name: Name of the sentence-transformers model to use
        """
        # Initialize sentence transformer model
        self.model = SentenceTransformer(model_name)
        self.embedding_dim = self.model.get_sentence_embedding_dimension()
        
        # Initialize Qdrant client
        qdrant_host = os.getenv('QDRANT_HOST', 'localhost')
        qdrant_port = int(os.getenv('QDRANT_PORT', '6333'))
        
        logger.info(f"Connecting to Qdrant at {qdrant_host}:{qdrant_port}")
        self.client = QdrantClient(host=qdrant_host, port=qdrant_port)
        
        # Collection name for HTML chunks
        self.collection_name = "html_chunks"
        
        # Ensure collection exists
        self._ensure_collection()
        
        logger.info(f"Initialized VectorStore with {model_name} (dim={self.embedding_dim})")
    
    def _ensure_collection(self) -> None:
        """Create collection if it doesn't exist, or recreate it for fresh indexing."""
        try:
            # Check if collection exists
            collections = self.client.get_collections().collections
            collection_exists = any(c.name == self.collection_name for c in collections)
            
            if collection_exists:
                # Delete existing collection for fresh indexing
                logger.info(f"Deleting existing collection: {self.collection_name}")
                self.client.delete_collection(collection_name=self.collection_name)
            
            # Create new collection
            logger.info(f"Creating collection: {self.collection_name}")
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=self.embedding_dim,
                    distance=Distance.COSINE
                )
            )
            logger.info(f"Collection '{self.collection_name}' created successfully")
            
        except Exception as e:
            logger.error(f"Error managing collection: {str(e)}")
            raise
    
    def index_chunks(self, chunks: List[Dict[str, any]]) -> None:
        """
        Index text chunks into Qdrant vector database.
        
        Args:
            chunks: List of chunk dictionaries with 'text', 'start', and 'end' keys
        
        Raises:
            ValueError: If chunks list is empty
        """
        if not chunks:
            raise ValueError("Cannot index empty chunks")
        
        # Extract texts for embedding
        texts = [chunk['text'] for chunk in chunks]
        logger.info(f"Generating embeddings for {len(texts)} chunks")
        
        # Generate embeddings
        embeddings = self.model.encode(
            texts,
            convert_to_numpy=True,
            show_progress_bar=False,
            normalize_embeddings=True
        )
        
        # Prepare points for Qdrant
        points = []
        for idx, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            point = PointStruct(
                id=str(uuid.uuid4()),  # Generate unique ID
                vector=embedding.tolist(),
                payload={
                    'text': chunk['text'],
                    'start': chunk['start'],
                    'end': chunk['end'],
                    'chunk_index': idx
                }
            )
            points.append(point)
        
        # Upsert points to Qdrant
        logger.info(f"Upserting {len(points)} points to Qdrant")
        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )
        
        logger.info(f"Successfully indexed {len(chunks)} chunks in Qdrant")
    
    def search(self, query: str, top_k: int = 10) -> List[Tuple[Dict, float]]:
        """
        Perform semantic search using Qdrant vector database.
        
        Args:
            query: Search query string
            top_k: Number of top results to return
        
        Returns:
            List of tuples containing (chunk_dict, similarity_score)
        
        Raises:
            ValueError: If vector store is not indexed
        """
        # Check if collection has data
        try:
            collection_info = self.client.get_collection(collection_name=self.collection_name)
            if collection_info.points_count == 0:
                raise ValueError("Vector store not indexed - no points in collection")
        except Exception as e:
            logger.error(f"Error checking collection: {str(e)}")
            raise ValueError("Vector store not indexed")
        
        # Generate query embedding
        logger.info(f"Generating embedding for query: '{query}'")
        query_embedding = self.model.encode(
            query,
            convert_to_numpy=True,
            normalize_embeddings=True
        )
        
        # Search in Qdrant
        logger.info(f"Searching for top {top_k} results")
        search_results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding.tolist(),
            limit=top_k
        )
        
        # Format results
        results = []
        for result in search_results:
            chunk = {
                'text': result.payload['text'],
                'start': result.payload['start'],
                'end': result.payload['end']
            }
            score = float(result.score)
            results.append((chunk, score))
        
        logger.info(f"Search returned {len(results)} results")
        return results
    
    def clear(self) -> None:
        """Clear all data from the vector store."""
        try:
            logger.info(f"Clearing collection: {self.collection_name}")
            self.client.delete_collection(collection_name=self.collection_name)
            self._ensure_collection()
            logger.info("Vector store cleared")
        except Exception as e:
            logger.error(f"Error clearing vector store: {str(e)}")
            raise
    
    def get_stats(self) -> Dict[str, any]:
        """Get statistics about the vector store."""
        try:
            collection_info = self.client.get_collection(collection_name=self.collection_name)
            return {
                'collection_name': self.collection_name,
                'points_count': collection_info.points_count,
                'embedding_dim': self.embedding_dim,
                'distance_metric': 'cosine'
            }
        except Exception as e:
            logger.error(f"Error getting stats: {str(e)}")
            return {}
