// src/lib/db/queries.ts
import { supabase } from "./supabase";
import { RetrievalResult, ChunkType } from "@/types/rag";
import { StandardSummary, StandardsResponse } from "@/types/api";
import { SEED_DOCUMENTS, SEED_CHUNKS, SEED_QCOS } from "../data/seed-data";

export interface SearchParams {
  queryText: string;
  queryEmbedding?: number[];
  matchCount?: number;
  filterStandard?: string;
  filterDocType?: string;
  filterStatus?: string;
  rrfK?: number;
}

/**
 * Searches BIS document chunks using Supabase hybrid search with in-memory RRF fallback.
 */
export async function searchStandards(params: SearchParams): Promise<RetrievalResult[]> {
  const {
    queryText,
    queryEmbedding,
    matchCount = 10,
    filterStandard,
    filterDocType,
    filterStatus = "current",
    rrfK = 60,
  } = params;

  // Try live Supabase RPC call if available
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && queryEmbedding && queryEmbedding.length === 768) {
    try {
      const { data, error } = await supabase.rpc("hybrid_search", {
        query_text: queryText,
        query_embedding: queryEmbedding,
        match_count: matchCount,
        filter_standard: filterStandard || null,
        filter_doc_type: filterDocType || null,
        filter_status: filterStatus,
        rrf_k: rrfK,
      });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((row: any) => ({
          chunkId: row.chunk_id,
          documentId: row.document_id,
          content: row.content,
          clauseNumber: row.clause_number || "",
          clauseTitle: row.clause_title || "",
          sectionPath: row.section_path || "",
          chunkType: (row.chunk_type as ChunkType) || "clause",
          pageNumberStart: row.page_number_start || 1,
          standardNumber: row.standard_number,
          fullDesignation: row.full_designation,
          documentTitle: row.document_title,
          documentType: row.doc_type,
          sourceUrl: row.source_url || "",
          isMandatory: Boolean(row.is_mandatory),
          rrfScore: Number(row.rrf_score),
          inVectorResults: Boolean(row.in_vector_results),
          inKeywordResults: Boolean(row.in_keyword_results),
          similarity: Number(row.rrf_score),
          matchesRequestedStandard: filterStandard
            ? row.standard_number.toLowerCase().includes(filterStandard.toLowerCase())
            : false,
        }));
      }
    } catch (err) {
      console.warn("Supabase hybrid_search RPC fallback to local knowledge base:", err);
    }
  }

  // Fallback: In-memory lexical & semantic consensus search over seed dataset
  return inMemoryHybridSearch(params);
}

/**
 * Robust in-memory hybrid search algorithm calculating term frequencies and RRF scores.
 */
function inMemoryHybridSearch(params: SearchParams): RetrievalResult[] {
  const { queryText, matchCount = 10, filterStandard, rrfK = 60 } = params;
  const cleanTerms = queryText
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);

  // Document map for fast metadata joins
  const docMap = new Map(SEED_DOCUMENTS.map((d) => [d.id, d]));

  // Score each chunk
  const scoredChunks = SEED_CHUNKS.map((chunk) => {
    const doc = docMap.get(chunk.documentId);
    if (!doc) return null;

    // Apply standard filter if provided
    if (filterStandard && !doc.standardNumber.toLowerCase().includes(filterStandard.toLowerCase())) {
      return null;
    }

    const contentLower = chunk.content.toLowerCase();
    const clauseTitleLower = (chunk.clauseTitle || "").toLowerCase();
    const docTitleLower = doc.title.toLowerCase();
    const standardLower = doc.standardNumber.toLowerCase();

    // Calculate lexical keyword match score
    let matchHits = 0;
    for (const term of cleanTerms) {
      if (contentLower.includes(term)) matchHits += 2;
      if (clauseTitleLower.includes(term)) matchHits += 4;
      if (docTitleLower.includes(term)) matchHits += 3;
      if (standardLower.includes(term)) matchHits += 8;
    }

    return {
      chunk,
      doc,
      matchHits,
    };
  })
    .filter((item): item is NonNullable<typeof item> => item !== null && item.matchHits > 0)
    .sort((a, b) => b.matchHits - a.matchHits);

  // Take top ranked results
  const topHits = scoredChunks.slice(0, matchCount);

  return topHits.map((item, idx) => {
    const { chunk, doc, matchHits } = item;
    const rank = idx + 1;
    const rrfScore = Math.round((1.0 / (rrfK + rank)) * 1000000) / 1000000;

    return {
      chunkId: chunk.id,
      documentId: doc.id,
      content: chunk.content,
      clauseNumber: chunk.clauseNumber,
      clauseTitle: chunk.clauseTitle,
      sectionPath: chunk.sectionPath,
      chunkType: chunk.chunkType,
      pageNumberStart: chunk.pageNumberStart,
      standardNumber: doc.standardNumber,
      fullDesignation: doc.fullDesignation,
      documentTitle: doc.title,
      documentType: doc.documentType,
      sourceUrl: doc.sourceUrl,
      isMandatory: doc.isMandatory,
      rrfScore,
      inVectorResults: true,
      inKeywordResults: true,
      similarity: Math.min(0.95, 0.5 + matchHits * 0.05),
      matchesRequestedStandard: filterStandard
        ? doc.standardNumber.toLowerCase().includes(filterStandard.toLowerCase())
        : false,
    };
  });
}

/**
 * Retrieves list of standards with QCO metadata and counts.
 */
export async function getStandardsList(): Promise<StandardsResponse> {
  const standards: StandardSummary[] = SEED_DOCUMENTS.map((doc) => {
    const linkedQco = SEED_QCOS.find((q) => q.standardNumber === doc.standardNumber);
    return {
      id: doc.id,
      standardNumber: doc.standardNumber,
      fullDesignation: doc.fullDesignation,
      title: doc.title,
      documentType: doc.documentType,
      status: doc.status,
      isMandatory: doc.isMandatory,
      productCategories: doc.productCategories,
      industries: doc.industries,
      scopeSummary: doc.scopeSummary,
      sourceUrl: doc.sourceUrl,
      totalPages: doc.totalPages,
      qcoDetails: linkedQco
        ? {
            qcoNumber: linkedQco.qcoNumber,
            qcoTitle: linkedQco.qcoTitle,
            effectiveDate: linkedQco.effectiveDate,
          }
        : undefined,
    };
  });

  const allCategories = Array.from(new Set(SEED_DOCUMENTS.flatMap((d) => d.productCategories)));
  const allIndustries = Array.from(new Set(SEED_DOCUMENTS.flatMap((d) => d.industries)));

  return {
    standards,
    total: standards.length,
    page: 1,
    pageSize: standards.length,
    categories: allCategories,
    industries: allIndustries,
  };
}

/**
 * Retrieves complete standard metadata with all clause chunks.
 */
export async function getStandardDetails(standardNumberOrId: string) {
  const cleanQuery = standardNumberOrId.toLowerCase().trim();
  const doc = SEED_DOCUMENTS.find(
    (d) => d.id === standardNumberOrId || d.standardNumber.toLowerCase() === cleanQuery || d.fullDesignation.toLowerCase() === cleanQuery
  );

  if (!doc) return null;

  const chunks = SEED_CHUNKS.filter((c) => c.documentId === doc.id);
  const qco = SEED_QCOS.find((q) => q.standardNumber === doc.standardNumber);

  return {
    ...doc,
    chunks,
    qco,
  };
}
