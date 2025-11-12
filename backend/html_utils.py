import requests
from bs4 import BeautifulSoup
from typing import Tuple
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class HTMLFetchError(Exception):
    pass

def fetch_and_clean_html(url: str, timeout: int = 10) -> Tuple[str, str]:
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml',
        }
        
        response = requests.get(url, timeout=timeout, headers=headers)
        response.raise_for_status()
        
        content_type = response.headers.get('content-type', '')
        if 'text/html' not in content_type:
            raise HTMLFetchError(f"URL does not return HTML: {content_type}")
        
        soup = BeautifulSoup(response.text, 'lxml')
        title = soup.title.string if soup.title else "Untitled"
        
        for tag in soup(['script', 'style', 'noscript', 'iframe', 'svg', 'head']):
            tag.decompose()
        
        body = soup.body if soup.body else soup
        text = body.get_text(separator=' ', strip=True)
        text = ' '.join(text.split())
        
        if not text or len(text) < 50:
            raise HTMLFetchError("Extracted text is too short")
        
        logger.info(f"Fetched and cleaned HTML from {url}")
        return text, title
        
    except requests.RequestException as e:
        raise HTMLFetchError(f"Failed to fetch URL: {str(e)}")
    except Exception as e:
        raise HTMLFetchError(f"Failed to parse HTML: {str(e)}")
