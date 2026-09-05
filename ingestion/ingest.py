"""Main orchestrator for Manak AI document ingestion pipeline."""

import json
import argparse
from pathlib import Path
from typing import Dict, Any, List

from ingestion.config import PDF_DIR, CONFIGS_DIR, SEEDS_DIR, DATABASE_URL
from ingestion.parser import BISDocumentParser
from ingestion.chunker import BISChunker
from ingestion.embedder import GeminiEmbedder

def process_document(
    pdf_path: Path,
    config_data: Dict[str, Any],
    embed: bool = False
) -> Dict[str, Any]:
    """Process a single BIS PDF into structured document metadata and chunks."""
    print(f"Parsing PDF: {pdf_path.name}...")
    parser = BISDocumentParser(str(pdf_path))
    pages_data = parser.parse()

    print(f"Extracted {len(pages_data)} pages. Chunking along clause boundaries...")
    chunker = BISChunker(
        full_designation=config_data.get("full_designation", "IS Unknown"),
        standard_title=config_data.get("title", "Standard"),
    )
    chunks = chunker.chunk_document(pages_data)
    print(f"Generated {len(chunks)} structured chunks.")

    if embed:
        print("Generating embeddings using Gemini Embedding 2 (768-dim)...")
        embedder = GeminiEmbedder()
        contents_to_embed = [c["content_with_context"] for c in chunks]
        embeddings = embedder.embed_batch(contents_to_embed)
        for i, emb in enumerate(embeddings):
            chunks[i]["embedding"] = emb

    doc_record = {
        "document": config_data,
        "chunks": chunks
    }
    return doc_record

def main():
    parser = argparse.ArgumentParser(description="Ingest BIS standard documents into Manak AI knowledge base.")
    parser.add_argument("--pdf-dir", default=str(PDF_DIR), help="Directory containing source PDFs")
    parser.add_argument("--config-dir", default=str(CONFIGS_DIR), help="Directory containing metadata configs")
    parser.add_argument("--out-dir", default=str(SEEDS_DIR), help="Output directory for processed seeds")
    parser.add_argument("--embed", action="store_true", help="Generate vector embeddings during ingestion")
    args = parser.parse_args()

    pdf_dir = Path(args.pdf_dir)
    config_dir = Path(args.config_dir)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    config_files = list(config_dir.glob("*.json"))
    if not config_files:
        print(f"No metadata configs found in {config_dir}. Looking for PDFs directly...")
        # If no config files, list PDFs
        pdfs = list(pdf_dir.glob("*.pdf"))
        print(f"Found {len(pdfs)} PDFs in {pdf_dir}.")
    else:
        print(f"Found {len(config_files)} metadata configs in {config_dir}.")
        for cfg_path in config_files:
            with open(cfg_path, "r", encoding="utf-8") as f:
                cfg = json.load(f)
            pdf_filename = cfg.get("filename")
            pdf_path = pdf_dir / pdf_filename if pdf_filename else None

            if pdf_path and pdf_path.exists():
                doc_record = process_document(pdf_path, cfg, embed=args.embed)
                out_file = out_dir / f"{cfg.get('standard_number', 'doc').replace(' ', '_')}.json"
                with open(out_file, "w", encoding="utf-8") as f:
                    json.dump(doc_record, f, indent=2)
                print(f"Saved processed document to {out_file}")
            else:
                print(f"Skipping {cfg_path.name}: PDF not found at {pdf_path}")

if __name__ == "__main__":
    main()
