// src/types/rag.ts

export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";

export type MandatoryStatus = "mandatory" | "voluntary" | "conditional" | "unknown";

export type ChunkType =
  | "clause"
  | "table"
  | "annexure_normative"
  | "annexure_informative"
  | "scope"
  | "definition"
  | "foreword";

export interface ExtractedEntities {
  product?: string;
  material?: string;
  standardNumber?: string;
  clauseNumber?: string;
  industry?: string;
  productCategory?: string;
  certificationType?: string;
  intent: "find_standards" | "check_compliance" | "compare_standards" | "general_info";
  keywords: string[];
  englishQuery?: string;
}

export interface EvidenceBlock {
  refId: string;
  standardNumber: string;
  documentTitle: string;
  clauseNumber: string;
  clauseTitle: string;
  sectionPath?: string;
  pageNumber: number;
  content: string;
  sourceUrl: string;
  documentType: string;
  mandatoryStatus: MandatoryStatus;
  chunkType: ChunkType;
}

export interface RetrievalResult {
  chunkId: string;
  documentId: string;
  content: string;
  clauseNumber: string;
  clauseTitle: string;
  sectionPath?: string;
  chunkType: ChunkType;
  pageNumberStart: number;
  standardNumber: string;
  fullDesignation: string;
  documentTitle: string;
  documentType: string;
  sourceUrl: string;
  isMandatory: boolean;
  rrfScore: number;
  inVectorResults: boolean;
  inKeywordResults: boolean;
  similarity?: number;
  matchesRequestedStandard?: boolean;
}

export interface ConfidenceSignals {
  topSimilarity: number;
  hybridConsensus: number;
  metadataMatch: number;
  scoreMargin: number;
}

export interface ConfidenceResult {
  level: ConfidenceLevel;
  score: number;
  signals: ConfidenceSignals;
  explanation: string;
}
