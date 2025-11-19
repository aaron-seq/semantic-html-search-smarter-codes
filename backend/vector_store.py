"""Vector store implementation using Pinecone for persistent vector storage and semantic search."""

from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, ServerlessSpec
from typing import List, Dict, Tuple
import logging
import os
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class VectorStore:
    """Vector store using Pinecone for indexing and semantic search."""
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize the vector store with Pinecone client and sentence transformer.
        
        Args:
            model_name: Name of the sentence-transformers model to use
        """
        # Initialize sentence transformer model
        self.model = SentenceTransformer(model_name)
        self.embedding_dim = self.model.get_sentence_embedding_dimension()
        
        # Initialize Pinecone client
        pinecone_api_key = os.getenv('PINECONE_API_KEY')
        if not pinecone_api_key:
            raise ValueError("PINECONE_API_KEY environment variable not set")
        
        logger.info("Initializing Pinecone client")
        self.pc = Pinecone(api_key=pinecone_api_key)
        
        # Index name for HTML chunks
        self.index_name = os.getenv('PINECONE_INDEX_NAME', 'html-search')
        
        # Ensure index exists
        self._ensure_index()
        
        # Get index reference
        self.index = self.pc.Index(self.index_name)
        
        logger.info(f"Initialized VectorStore with {model_name} (dim={self.embedding_dim})")
    
    def _ensure_index(self) -> None:
        """Create index if it doesn't exist."""
        try:
            existing_indexes = [index.name for index in self.pc.list_indexes()]
            
            if self.index_name not in existing_indexes:
                logger.info(f"Creating new Pinecone index: {self.index_name}")
                
                # Get cloud and region from env or use defaults
                cloud = os.getenv('PINECONE_CLOUD', 'aws')
                region = os.getenv('PINECONE_REGION', 'us-east-1')
                
                self.pc.create_index(
                    name=self.index_name,
                    dimension=self.embedding_dim,
                    metric='cosine',
                    spec=ServerlessSpec(
                        cloud=cloud,
                        region=region
                    )
                )
                
                # Wait for index to be ready
                logger.info("Waiting for index to be ready...")
                while not self.pc.describe_index(self.index_name).status['ready']:
                    time.sleep(1)
                
                logger.info(f"Index '{self.index_name}' created successfully")
            else:
                logger.info(f"Using existing index: {self.index_name}")
                
        except Exception as e:
            logger.error(f"Error managing index: {str(e)}")
            raise
    
    def index_chunks(self, chunks: List[Dict[str, any]], namespace: str = "") -> None:
        """
        Index text chunks into Pinecone vector database.
        
        Args:
            chunks: List of chunk dictionaries with 'text', 'start', and 'end' keys
            namespace: Optional namespace for organization (e.g., URL-based)
        
        Raises:
            ValueError: If chunks list is empty
        """
        if not chunks:
            raise ValueError("Cannot index empty chunks")
        
        # Clear existing vectors in namespace for fresh indexing
        if namespace:
            try:
                self.index.delete(delete_all=True, namespace=namespace)
                logger.info(f"Cleared namespace: {namespace}")
            except:
                pass  # Namespace might not exist yet
        
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
        
        # Prepare vectors for Pinecone (batch upsert)
        vectors = []
        for idx, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            vector_id = f"chunk_{idx}_{int(time.time() * 1000)}"
            vectors.append({
                'id': vector_id,
                'values': embedding.tolist(),
                'metadata': {
                    'text': chunk['text'],
                    'start': chunk['start'],
                    'end': chunk['end'],
                    'chunk_index': idx
                }
            })
        
        # Upsert vectors in batches (Pinecone recommends batch size of 100)
        batch_size = 100
        for i in range(0, len(vectors), batch_size):
            batch = vectors[i:i + batch_size]
            self.index.upsert(
                vectors=batch,
                namespace=namespace
            )
            logger.info(f"Upserted batch {i//batch_size + 1} ({len(batch)} vectors)")
        
        logger.info(f"Successfully indexed {len(chunks)} chunks in Pinecone")
    
    def search(self, query: str, top_k: int = 10, namespace: str = "") -> List[Tuple[Dict, float]]:
        """
        Perform semantic search using Pinecone vector database.
        
        Args:
            query: Search query string
            top_k: Number of top results to return
            namespace: Optional namespace to search within
        
        Returns:
            List of tuples containing (chunk_dict, similarity_score)
        
        Raises:
            ValueError: If vector store is not indexed
        """
        # Check if index has data
        try:
            stats = self.index.describe_index_stats()
            total_vectors = stats.get('total_vector_count', 0)
            
            if namespace:
                namespace_stats = stats.get('namespaces', {}).get(namespace, {})
                namespace_count = namespace_stats.get('vector_count', 0)
                if namespace_count == 0:
                    raise ValueError(f"No vectors found in namespace: {namespace}")
            elif total_vectors == 0:
                raise ValueError("Vector store not indexed - no vectors in index")
                
        except Exception as e:
            logger.error(f"Error checking index: {str(e)}")
            raise ValueError("Vector store not indexed")
        
        # Generate query embedding
        logger.info(f"Generating embedding for query: '{query}'")
        query_embedding = self.model.encode(
            query,
            convert_to_numpy=True,
            normalize_embeddings=True
        )
        
        # Search in Pinecone
        logger.info(f"Searching for top {top_k} results")
        search_results = self.index.query(
            vector=query_embedding.tolist(),
            top_k=top_k,
            namespace=namespace,
            include_metadata=True
        )
        
        # Format results
        results = []
        for match in search_results.get('matches', []):
            metadata = match.get('metadata', {})
            chunk = {
                'text': metadata.get('text', ''),
                'start': metadata.get('start', 0),
                'end': metadata.get('end', 0)
            }
            score = float(match.get('score', 0.0))
            results.append((chunk, score))
        
        logger.info(f"Search returned {len(results)} results")
        return results
    
    def clear(self, namespace: str = "") -> None:
        """Clear all data from the vector store or specific namespace."""
        try:
            if namespace:
                logger.info(f"Clearing namespace: {namespace}")
                self.index.delete(delete_all=True, namespace=namespace)
            else:
                logger.info("Clearing all vectors from index")
                self.index.delete(delete_all=True)
            logger.info("Vector store cleared")
        except Exception as e:
            logger.error(f"Error clearing vector store: {str(e)}")
            raise
    
    def get_stats(self) -> Dict[str, any]:
        """Get statistics about the vector store."""
        try:
            stats = self.index.describe_index_stats()
            return {
                'index_name': self.index_name,
                'total_vector_count': stats.get('total_vector_count', 0),
                'dimension': self.embedding_dim,
                'namespaces': stats.get('namespaces', {}),
                'distance_metric': 'cosine'
            }
        except Exception as e:
            logger.error(f"Error getting stats: {str(e)}")
            return {}
