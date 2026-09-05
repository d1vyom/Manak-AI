// src/types/citations.ts

import { ChunkType, MandatoryStatus } from "./rag";

export interface Citation {
  refId: string;
  standardNumber: string;
  fullDesignation?: string;
  documentTitle: string;
  clauseNumber: string;
  clauseTitle: string;
  pageNumber: number;
  sourceUrl: string;
  mandatoryStatus: MandatoryStatus;
  chunkType: ChunkType;
  quote?: string;
  confidenceScore?: number;
  verified?: boolean;
}

export interface RelatedStandard {
  standardNumber: string;
  title: string;
  relationship: string;
  mandatoryStatus: MandatoryStatus;
  sourceUrl?: string;
}

export interface CitationValidationResult {
  validCitations: Citation[];
  invalidCitationRefs: string[];
  hallucinatedStandards: string[];
  hasHallucinations: boolean;
  groundingScore: number;
  relatedStandards: RelatedStandard[];
  isAbstention: boolean;
  abstentionReason?: string;
}

