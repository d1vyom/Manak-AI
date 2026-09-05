// src/lib/rag/citations.ts
import { EvidenceBlock, ConfidenceResult } from "@/types/rag";
import { CitationValidationResult } from "@/types/citations";
import { verifyRagResponse } from "./verification";
import { evaluateAbstention } from "./abstention";

/**
 * Extracts citation tags, validates them against evidence blocks, extracts quotes,
 * detects hallucinated standards, calculates grounding score, and flags abstentions.
 */
export function validateAndExtractCitations(
  responseText: string,
  evidenceBlocks: EvidenceBlock[],
  confidence?: ConfidenceResult,
  query?: string,
  language: "en" | "hi" = "en"
): CitationValidationResult {
  const verification = verifyRagResponse(responseText, evidenceBlocks);

  // Check abstention status
  let isAbstention = false;
  let abstentionReason: string | undefined = undefined;

  if (confidence && query) {
    const abstentionCheck = evaluateAbstention(
      query,
      evidenceBlocks,
      confidence,
      responseText,
      language
    );
    isAbstention = abstentionCheck.shouldAbstain;
    abstentionReason = abstentionCheck.reason;
  } else {
    // If confidence/query weren't directly passed, check if the text itself has abstention phrases
    isAbstention = responseText.toLowerCase().includes("insufficient information") ||
      responseText.toLowerCase().includes("do not provide sufficient information") ||
      responseText.includes("पर्याप्त जानकारी");
    if (isAbstention) {
      abstentionReason = "Context documents do not provide sufficient information";
    }
  }

  return {
    validCitations: verification.validCitations,
    invalidCitationRefs: verification.invalidCitationRefs,
    hallucinatedStandards: verification.hallucinatedStandards,
    hasHallucinations: verification.hasHallucinations,
    groundingScore: verification.groundingScore,
    relatedStandards: verification.relatedStandards,
    isAbstention,
    abstentionReason,
  };
}

