from transformers import AutoTokenizer
from typing import List, Dict
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TextChunker:
    def __init__(self, model_name: str = "bert-base-uncased", max_tokens: int = 500, overlap_tokens: int = 50):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.max_tokens = max_tokens
        self.overlap_tokens = overlap_tokens
        logger.info(f"Initialized TextChunker with {model_name}")
    
    def chunk_text(self, text: str) -> List[Dict[str, any]]:
        tokens = self.tokenizer.encode(text, add_special_tokens=False)
        total_tokens = len(tokens)
        logger.info(f"Total tokens: {total_tokens}")
        
        chunks = []
        start_idx = 0
        chunk_index = 0
        
        while start_idx < total_tokens:
            end_idx = min(start_idx + self.max_tokens, total_tokens)
            chunk_tokens = tokens[start_idx:end_idx]
            chunk_text = self.tokenizer.decode(chunk_tokens, skip_special_tokens=True)
            
            chunks.append({
                'chunk_index': chunk_index,
                'text': chunk_text,
                'start_token': start_idx,
                'end_token': end_idx,
                'token_count': len(chunk_tokens)
            })
            
            chunk_index += 1
            if end_idx >= total_tokens:
                break
            start_idx = end_idx - self.overlap_tokens
        
        logger.info(f"Created {len(chunks)} chunks")
        return chunks
