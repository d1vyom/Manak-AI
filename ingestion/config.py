"""Configuration module for Manak AI document ingestion pipeline."""

import os
from pathlib import Path
from dotenv import load_dotenv

# Search for .env.local or .env in project root
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env.local")
load_dotenv(BASE_DIR / ".env")

# API Keys & URLs
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
DATABASE_URL = os.getenv("DATABASE_URL", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")

# AI & Embedding Parameters
EMBEDDING_MODEL = "gemini-embedding-2"
EMBEDDING_DIM = 768
EMBEDDING_TASK_TYPE = "RETRIEVAL_DOCUMENT"

# Chunking Parameters (per BIS domain standards)
MIN_CHUNK_TOKENS = 100
MAX_CHUNK_TOKENS = 500
OVERLAP_TOKENS = 50

# Directories
INGESTION_DIR = Path(__file__).resolve().parent
DATA_DIR = INGESTION_DIR / "data"
PDF_DIR = DATA_DIR / "pdfs"
CONFIGS_DIR = DATA_DIR / "configs"
SEEDS_DIR = DATA_DIR / "seeds"

PDF_DIR.mkdir(parents=True, exist_ok=True)
CONFIGS_DIR.mkdir(parents=True, exist_ok=True)
SEEDS_DIR.mkdir(parents=True, exist_ok=True)
