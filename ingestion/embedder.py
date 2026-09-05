"""Embedding generator using Gemini Embedding API (768-dim) with exponential backoff."""

import time
import requests
from typing import List, Optional
from ingestion.config import GEMINI_API_KEY, EMBEDDING_MODEL, EMBEDDING_DIM

class GeminiEmbedder:
    """Generates embeddings for document chunks using Gemini Embedding API."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or GEMINI_API_KEY
        if not self.api_key:
            print("WARNING: GEMINI_API_KEY is not set. Embeddings will not be generated.")

    def embed_text(self, text: str, task_type: str = "RETRIEVAL_DOCUMENT") -> List[float]:
        """Embed a single text string using Gemini Embeddings API."""
        if not self.api_key:
            # Fallback zero-vector for testing without key
            return [0.0] * EMBEDDING_DIM

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{EMBEDDING_MODEL}:embedContent?key={self.api_key}"
        payload = {
            "model": f"models/{EMBEDDING_MODEL}",
            "content": {
                "parts": [{"text": text}]
            },
            "taskType": task_type,
            "outputDimensionality": EMBEDDING_DIM
        }

        max_retries = 4
        delay = 2

        for attempt in range(max_retries):
            try:
                response = requests.post(url, json=payload, timeout=20)
                if response.status_code == 200:
                    data = response.json()
                    return data.get("embedding", {}).get("values", [0.0] * EMBEDDING_DIM)
                elif response.status_code == 429:
                    time.sleep(delay)
                    delay *= 2
                else:
                    print(f"Embedding API error ({response.status_code}): {response.text}")
                    break
            except Exception as e:
                print(f"Network error during embedding: {e}")
                time.sleep(delay)
                delay *= 2

        return [0.0] * EMBEDDING_DIM

    def embed_batch(self, texts: List[str], task_type: str = "RETRIEVAL_DOCUMENT") -> List[List[float]]:
        """Embed a list of strings with progressive rate-limiting."""
        embeddings = []
        for i, text in enumerate(texts):
            emb = self.embed_text(text, task_type=task_type)
            embeddings.append(emb)
            if i % 10 == 0 and i > 0:
                time.sleep(0.5)  # Stay within free-tier rate limits
        return embeddings
