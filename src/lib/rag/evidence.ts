// src/lib/rag/evidence.ts
import { RetrievalResult, EvidenceBlock, MandatoryStatus } from "@/types/rag";

/**
 * Converts retrieval results into structured evidence blocks with reference IDs.
 */
export function assembleEvidenceBlocks(results: RetrievalResult[]): EvidenceBlock[] {
  return results.map((r, index) => {
    const refId = `REF_${index + 1}`;
    const mandatoryStatus: MandatoryStatus = r.isMandatory ? "mandatory" : "voluntary";

    return {
      refId,
      standardNumber: r.standardNumber || r.fullDesignation,
      documentTitle: r.documentTitle,
      clauseNumber: r.clauseNumber || "General",
      clauseTitle: r.clauseTitle || "",
      sectionPath: r.sectionPath,
      pageNumber: r.pageNumberStart || 1,
      content: r.content,
      sourceUrl: r.sourceUrl,
      documentType: r.documentType,
      mandatoryStatus,
      chunkType: r.chunkType,
    };
  });
}

/**
 * Formats evidence blocks into a structured text prompt for the LLM.
 */
export function formatEvidenceContext(blocks: EvidenceBlock[]): string {
  if (blocks.length === 0) {
    return "NO RELEVANT DOCUMENTS FOUND IN KNOWLEDGE BASE.";
  }

  return blocks
    .map((b) => {
      const header = `[${b.refId} | ${b.standardNumber} | Clause ${b.clauseNumber}${
        b.clauseTitle ? ` - ${b.clauseTitle}` : ""
      } | Page ${b.pageNumber} | Status: ${b.mandatoryStatus.toUpperCase()}]`;
      return `${header}\n${b.content}`;
    })
    .join("\n\n---\n\n");
}
