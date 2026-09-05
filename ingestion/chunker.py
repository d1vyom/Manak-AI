"""Structure-aware chunker for Bureau of Indian Standards (BIS) documents."""

import re
from typing import List, Dict, Any, Optional

def estimate_tokens(text: str) -> int:
    """Approximate token count (1 token ≈ 4 characters or 0.75 words)."""
    return max(1, int(len(text.split()) * 1.3))

class BISChunker:
    """Splits parsed BIS documents along clause boundaries with breadcrumb context injection."""

    def __init__(
        self,
        full_designation: str,
        standard_title: str,
        min_tokens: int = 100,
        max_tokens: int = 500
    ):
        self.full_designation = full_designation
        self.standard_title = standard_title
        self.min_tokens = min_tokens
        self.max_tokens = max_tokens

    def classify_chunk_type(self, clause_num: Optional[str], clause_title: Optional[str], content: str) -> str:
        """Categorize chunk type per BIS document conventions."""
        if not clause_num:
            if "FOREWORD" in content.upper()[:200]:
                return "foreword"
            if "SCOPE" in content.upper()[:200]:
                return "scope"
            return "clause"

        num_lower = clause_num.lower()
        title_lower = (clause_title or "").lower()

        if "scope" in title_lower or clause_num == "1":
            return "scope"
        if "definition" in title_lower or "terminology" in title_lower or clause_num == "2" or clause_num == "3":
            return "definition"
        if "annex" in num_lower or "annex" in title_lower:
            if "informative" in content.lower()[:300]:
                return "annexure_informative"
            return "annexure_normative"
        return "clause"

    def build_breadcrumb(self, clause_num: Optional[str], clause_title: Optional[str]) -> str:
        """Format breadcrumb prefix: [IS 14543:2016 | Clause 4.2 | Chemical Requirements]"""
        parts = [self.full_designation]
        if clause_num:
            parts.append(f"Clause {clause_num}")
        if clause_title:
            parts.append(clause_title)
        return f"[{' | '.join(parts)}]"

    def chunk_document(self, pages_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Split pages into structured chunks respecting clause boundaries and token bounds."""
        chunks = []
        chunk_index = 0

        # Accumulate sections with clause metadata
        current_clause_num = None
        current_clause_title = None
        current_content_lines = []
        start_page = 1

        for page in pages_data:
            page_num = page["page_number"]
            page_text = page["text"]
            tables = page.get("tables", [])

            # First handle standalone tables as individual chunks
            for table in tables:
                table_md = table["markdown"]
                headers = ", ".join(table["headers"])
                table_content = f"Table on Page {page_num}:\n{table_md}"
                breadcrumb = f"[{self.full_designation} | Table on Page {page_num} | Columns: {headers}]"

                chunks.append({
                    "chunk_index": chunk_index,
                    "clause_number": current_clause_num,
                    "clause_title": current_clause_title or f"Table on Page {page_num}",
                    "section_path": f"Requirements > {current_clause_title or 'Tables'}",
                    "chunk_type": "table",
                    "page_number_start": page_num,
                    "page_number_end": page_num,
                    "content": table_content,
                    "content_with_context": f"{breadcrumb}\n{table_content}",
                    "token_count": estimate_tokens(table_content)
                })
                chunk_index += 1

            # Now parse textual paragraphs and detect clause headings
            lines = page_text.split("\n")
            for line in lines:
                clean_line = line.strip()
                if not clean_line:
                    continue

                # Check if this line is a clause heading
                clause_match = re.match(r"^(?:Clause\s+)?(\d+(?:\.\d+)*)\s+([A-Z][A-Za-z0-9\s,\-\(\)\/]{2,60})$", clean_line)
                if clause_match:
                    # Flush accumulated chunk if it meets minimum size
                    if current_content_lines:
                        raw_chunk_text = "\n".join(current_content_lines)
                        toks = estimate_tokens(raw_chunk_text)
                        if toks >= self.min_tokens or current_clause_num is not None:
                            breadcrumb = self.build_breadcrumb(current_clause_num, current_clause_title)
                            ctype = self.classify_chunk_type(current_clause_num, current_clause_title, raw_chunk_text)
                            
                            chunks.append({
                                "chunk_index": chunk_index,
                                "clause_number": current_clause_num,
                                "clause_title": current_clause_title,
                                "section_path": f"{self.standard_title} > {current_clause_title or 'General'}",
                                "chunk_type": ctype,
                                "page_number_start": start_page,
                                "page_number_end": page_num,
                                "content": raw_chunk_text,
                                "content_with_context": f"{breadcrumb}\n{raw_chunk_text}",
                                "token_count": toks
                            })
                            chunk_index += 1
                            current_content_lines = []
                            start_page = page_num

                    current_clause_num = clause_match.group(1).strip()
                    current_clause_title = clause_match.group(2).strip()

                current_content_lines.append(clean_line)

                # Split if chunk exceeds max_tokens
                accumulated_text = "\n".join(current_content_lines)
                if estimate_tokens(accumulated_text) >= self.max_tokens:
                    breadcrumb = self.build_breadcrumb(current_clause_num, current_clause_title)
                    ctype = self.classify_chunk_type(current_clause_num, current_clause_title, accumulated_text)

                    chunks.append({
                        "chunk_index": chunk_index,
                        "clause_number": current_clause_num,
                        "clause_title": current_clause_title,
                        "section_path": f"{self.standard_title} > {current_clause_title or 'General'}",
                        "chunk_type": ctype,
                        "page_number_start": start_page,
                        "page_number_end": page_num,
                        "content": accumulated_text,
                        "content_with_context": f"{breadcrumb}\n{accumulated_text}",
                        "token_count": estimate_tokens(accumulated_text)
                    })
                    chunk_index += 1
                    current_content_lines = []
                    start_page = page_num

        # Flush any trailing lines
        if current_content_lines:
            raw_chunk_text = "\n".join(current_content_lines)
            breadcrumb = self.build_breadcrumb(current_clause_num, current_clause_title)
            ctype = self.classify_chunk_type(current_clause_num, current_clause_title, raw_chunk_text)

            chunks.append({
                "chunk_index": chunk_index,
                "clause_number": current_clause_num,
                "clause_title": current_clause_title,
                "section_path": f"{self.standard_title} > {current_clause_title or 'General'}",
                "chunk_type": ctype,
                "page_number_start": start_page,
                "page_number_end": pages_data[-1]["page_number"] if pages_data else start_page,
                "content": raw_chunk_text,
                "content_with_context": f"{breadcrumb}\n{raw_chunk_text}",
                "token_count": estimate_tokens(raw_chunk_text)
            })

        return chunks
