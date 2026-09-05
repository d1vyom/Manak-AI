"""PDF parser module using PyMuPDF (fitz) with OCR fallback and table extraction."""

import re
from typing import Dict, List, Any, Optional
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

try:
    import pytesseract
    from PIL import Image
    import io
except ImportError:
    pytesseract = None

class BISDocumentParser:
    """Extracts text, clause boundaries, tables, and metadata from BIS standard PDFs."""

    CLAUSE_PATTERN = re.compile(
        r"^(?:Clause\s+)?(\d+(?:\.\d+)*)\s+([A-Z][A-Za-z0-9\s,\-\(\)\/]{2,60})$",
        re.MULTILINE
    )

    ANNEXURE_PATTERN = re.compile(
        r"^(?:ANNEX|ANNEXURE)\s+([A-Z])(?:\s+([A-Z\s]+))?",
        re.MULTILINE | re.IGNORECASE
    )

    def __init__(self, pdf_path: str):
        if fitz is None:
            raise RuntimeError("PyMuPDF is required. Install via: pip install pymupdf")
        self.pdf_path = Path(pdf_path)
        if not self.pdf_path.exists():
            raise FileNotFoundError(f"PDF not found: {pdf_path}")
        self.doc = fitz.open(str(self.pdf_path))

    def is_scanned_page(self, page) -> bool:
        """Heuristic: returns True if page has very little extractable text but has images."""
        text = page.get_text().strip()
        images = page.get_images()
        return len(text) < 50 and len(images) > 0

    def ocr_page(self, page) -> str:
        """Fallback OCR using pytesseract when page is scanned."""
        if pytesseract is None:
            return ""
        pix = page.get_pixmap(dpi=200)
        img = Image.open(io.BytesIO(pix.tobytes()))
        return pytesseract.image_to_string(img, lang="eng+hin")

    def extract_tables(self, page) -> List[Dict[str, Any]]:
        """Extract structured tables using PyMuPDF's built-in table finder."""
        tables = []
        try:
            tabs = page.find_tables()
            for idx, tab in enumerate(tabs):
                df_data = tab.extract()
                if df_data and len(df_data) > 1:
                    headers = [str(h).strip() if h else f"Col_{i}" for i, h in enumerate(df_data[0])]
                    rows = []
                    for row in df_data[1:]:
                        clean_row = [str(c).strip() if c else "" for c in row]
                        rows.append(clean_row)
                    
                    # Convert to markdown representation
                    md_lines = ["| " + " | ".join(headers) + " |", "| " + " | ".join(["---"] * len(headers)) + " |"]
                    for r in rows:
                        md_lines.append("| " + " | ".join(r) + " |")
                    
                    tables.append({
                        "table_index": idx + 1,
                        "headers": headers,
                        "rows": rows,
                        "markdown": "\n".join(md_lines),
                        "bbox": tab.bbox
                    })
        except Exception:
            pass
        return tables

    def parse(self) -> List[Dict[str, Any]]:
        """Parse the full document into structured page representations."""
        pages_data = []
        current_clause = None

        for page_num in range(len(self.doc)):
            page = self.doc[page_num]
            display_page_num = page_num + 1

            if self.is_scanned_page(page):
                raw_text = self.ocr_page(page)
            else:
                raw_text = page.get_text("text")

            tables = self.extract_tables(page)

            # Detect clause headings on this page
            clauses_found = []
            for match in self.CLAUSE_PATTERN.finditer(raw_text):
                clause_num = match.group(1).strip()
                clause_title = match.group(2).strip()
                clauses_found.append({
                    "clause_number": clause_num,
                    "clause_title": clause_title,
                    "span": match.span()
                })

            pages_data.append({
                "page_number": display_page_num,
                "text": raw_text,
                "tables": tables,
                "clauses": clauses_found
            })

        return pages_data
