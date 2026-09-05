// src/types/citations.ts

import { ChunkType, MandatoryStatus } from "./rag";

export interface Citation {
  refId: string;
  standardNumber: string;
  documentTitle: string;
  clauseNumber: string;
  clauseTitle: string;
  pageNumber: number;
  sourceUrl: string;
  mandatoryStatus: MandatoryStatus;
  chunkType: ChunkType;
  quote?: string;
}

export interface CitationValidationResult {
  validCitations: Citation[];
  invalidCitationRefs: string[];
  hasHallucinations: boolean;
  relatedStandards: string[];
}
