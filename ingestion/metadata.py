"""Metadata models and validators for BIS documents, chunks, and QCOs."""

from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import date, datetime

class DocumentMetadata(BaseModel):
    standard_number: Optional[str] = Field(None, description="e.g. 'IS 14543'")
    part_number: Optional[str] = Field(None, description="e.g. 'Part 1'")
    revision_year: Optional[int] = Field(None, description="e.g. 2016")
    full_designation: str = Field(..., description="e.g. 'IS 14543:2016'")
    title: str = Field(..., description="Full title of the standard")
    document_type: str = Field("standard", description="standard, qco, guideline, amendment")
    status: str = Field("current", description="current, superseded, withdrawn")
    superseded_by: Optional[str] = None
    publication_date: Optional[str] = None
    effective_date: Optional[str] = None
    ics_code: Optional[str] = None
    product_categories: List[str] = Field(default_factory=list)
    industries: List[str] = Field(default_factory=list)
    language: str = Field("en", description="en, hi, bilingual")
    source_url: Optional[str] = None
    source_file_path: Optional[str] = None
    total_pages: Optional[int] = None
    is_mandatory: bool = Field(False, description="Derived from QCO linkage")
    scope_summary: Optional[str] = None

class ChunkMetadata(BaseModel):
    chunk_index: int
    clause_number: Optional[str] = Field(None, description="e.g. '4.2.1'")
    clause_title: Optional[str] = Field(None, description="e.g. 'Chemical Requirements'")
    section_path: Optional[str] = Field(None, description="e.g. 'Requirements > Chemical Requirements'")
    chunk_type: str = Field(..., description="clause, table, annexure_normative, annexure_informative, scope, definition, foreword")
    page_number_start: Optional[int] = None
    page_number_end: Optional[int] = None
    content: str
    content_with_context: Optional[str] = None
    parent_chunk_id: Optional[str] = None
    token_count: Optional[int] = None

class QcoMetadata(BaseModel):
    qco_number: str
    qco_title: str
    standard_number: str
    standard_designation: Optional[str] = None
    product_description: Optional[str] = None
    gazette_date: Optional[str] = None
    effective_date: str
    certification_type: str = Field("ISI", description="ISI, CRS, FMCS")
    scope_description: Optional[str] = None
    source_url: Optional[str] = None
    is_active: bool = True
