// src/lib/rag/citations.ts
import { EvidenceBlock } from "@/types/rag";
import { Citation, CitationValidationResult } from "@/types/citations";

/**
 * Extracts [REF_N] citation tags and validates them against the provided evidence blocks.
 */
export function validateAndExtractCitations(
  responseText: string,
  evidenceBlocks: EvidenceBlock[]
): CitationValidationResult {
  // Regex to find all [REF_N] occurrences (e.g. [REF_1], [REF_2], [REF_10])
  const refMatches = responseText.match(/\[REF_(\d+)\]/g) || [];
  const uniqueRefIds = Array.from(new Set(refMatches.map((m) => m.replace(/[\[\]]/g, ""))));

  const evidenceMap = new Map(evidenceBlocks.map((b) => [b.refId, b]));
  const validCitations: Citation[] = [];
  const invalidCitationRefs: string[] = [];

  for (const refId of uniqueRefIds) {
    const evidence = evidenceMap.get(refId);
    if (evidence) {
      validCitations.push({
        refId: evidence.refId,
        standardNumber: evidence.standardNumber,
        documentTitle: evidence.documentTitle,
        clauseNumber: evidence.clauseNumber,
        clauseTitle: evidence.clauseTitle,
        pageNumber: evidence.pageNumber,
        sourceUrl: evidence.sourceUrl,
        mandatoryStatus: evidence.mandatoryStatus,
        chunkType: evidence.chunkType,
      });
    } else {
      invalidCitationRefs.push(refId);
    }
  }

  // Find related standards mentioned in the retrieved evidence that were not explicitly cited
  const citedStandards = new Set(validCitations.map((c) => c.standardNumber));
  const relatedStandards = Array.from(
    new Set(
      evidenceBlocks
        .map((b) => b.standardNumber)
        .filter((std) => !citedStandards.has(std) && std.length > 0)
    )
  );

  return {
    validCitations,
    invalidCitationRefs,
    hasHallucinations: invalidCitationRefs.length > 0,
    relatedStandards,
  };
}
