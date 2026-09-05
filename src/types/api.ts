// src/types/api.ts

import { Citation } from "./citations";
import { ConfidenceLevel, ExtractedEntities, MandatoryStatus } from "./rag";

export interface ChatRequest {
  query: string;
  language?: "en" | "hi" | "auto";
}

export interface ChatMetadataEvent {
  type: "metadata";
  data: {
    language: "en" | "hi";
    confidence: ConfidenceLevel;
    confidenceExplanation: string;
    entities: ExtractedEntities;
    retrievedDocuments: number;
    mandatoryStatus: MandatoryStatus;
  };
}

export interface ChatContentEvent {
  type: "content";
  data: string;
}

export interface ChatCitationsEvent {
  type: "citations";
  data: Citation[];
}

export interface ChatDoneEvent {
  type: "done";
  data: {
    completedAt: string;
    totalTokensEstimated?: number;
  };
}

export type ChatStreamEvent =
  | ChatMetadataEvent
  | ChatContentEvent
  | ChatCitationsEvent
  | ChatDoneEvent;

export interface StandardSummary {
  id: string;
  standardNumber: string;
  fullDesignation: string;
  title: string;
  documentType: string;
  status: string;
  isMandatory: boolean;
  productCategories: string[];
  industries: string[];
  scopeSummary?: string;
  sourceUrl?: string;
  totalPages?: number;
  qcoDetails?: {
    qcoNumber: string;
    qcoTitle: string;
    effectiveDate: string;
  };
}

export interface StandardsResponse {
  standards: StandardSummary[];
  total: number;
  page: number;
  pageSize: number;
  categories: string[];
  industries: string[];
}
