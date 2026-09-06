// src/lib/rag/verification.ts
import { EvidenceBlock } from "@/types/rag";
import { Citation, RelatedStandard } from "@/types/citations";
import { SEED_DOCUMENTS } from "@/lib/data/seed-data";
import { STANDARDS_KNOWLEDGE_GRAPH, getRelatedStandardsForList } from "@/lib/data/standards-graph";
import { cleanFormulaText, cleanQuoteText } from "@/lib/utils/format";

export interface VerificationDetails {
  validCitations: Citation[];
  invalidCitationRefs: string[];
  hallucinatedStandards: string[];
  hasHallucinations: boolean;
  groundingScore: number;
  relatedStandards: RelatedStandard[];
}

/**
 * Extracts a verbatim or high-relevance quote from the evidence block that aligns
 * with the sentence citing that reference, automatically sanitizing markdown tables and hyphens.
 */
function extractMatchingQuote(
  evidenceContent: string,
  citingSentence: string
): string {
  // First, clean formulas and LaTeX symbols
  const sanitizedContent = cleanFormulaText(evidenceContent);

  // Split evidence into candidate segments (sentences or clean table rows)
  const segments = sanitizedContent
    .split(/(?:(?<=[.?!])\s+|\r?\n)/)
    .map((s) => s.trim())
    // Exclude empty lines and table divider lines like |---|---|---|
    .filter((s) => s.length > 10 && !/^\|?\s*[-:]+[-| :]+\|?$/.test(s));

  if (segments.length === 0) {
    return cleanQuoteText(sanitizedContent.slice(0, 250).trim() + "...");
  }

  // Tokenize citing sentence to find the segment with highest token overlap
  const citingTokens = new Set(
    citingSentence
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3 || /\d/.test(w))
  );

  let bestSegment = segments[0];
  let maxScore = -1;

  if (citingTokens.size > 0) {
    for (const seg of segments) {
      const sTokens = seg
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length >= 3 || /\d/.test(w));

      let matchScore = 0;
      for (const t of sTokens) {
        if (citingTokens.has(t)) {
          const isIdentifier = /\d/.test(t) || t.length > 5;
          matchScore += isIdentifier ? 2 : 1;
        }
      }

      if (matchScore > maxScore) {
        maxScore = matchScore;
        bestSegment = seg;
      }
    }
  }

  // Format table rows or strip lingering markdown pipes
  return cleanQuoteText(bestSegment);
}

/**
 * Scans text to find Indian Standard numbers (e.g. "IS 14543", "IS 9873 (Part 1)", "IS 456").
 */
export function extractStandardNumbers(text: string): string[] {
  // Matches Indian Standard identifiers like "IS 14543", "IS 9873 (Part 1)", "IS 456:2000"
  // Does not match lowercase English word "is" or decimals like "is 0.01"
  const isRegex = /\bIS\s+([1-9]\d*(?:\s*\([Pp]art\s+\d+\))?)(?::\d{4})?(?!\.?\d)/g;
  const matches = text.match(isRegex) || [];
  const normalized = matches.map((m) => {
    // Strip year revision like :2016 for comparison
    return m.replace(/:\d{4}/, "").replace(/\s+/g, " ").trim().toUpperCase();
  });
  return Array.from(new Set(normalized));
}

/**
 * Performs rigorous anti-hallucination verification on LLM response text against
 * the provided evidence blocks and domain knowledge base.
 */
export function verifyRagResponse(
  responseText: string,
  evidenceBlocks: EvidenceBlock[]
): VerificationDetails {
  // 1. Extract and normalize all [REF_N] citation tags
  // Matches [REF_1], [REF_1, REF_2], [ref_1], [REF_1][REF_2]
  const bracketBlocks = responseText.match(/\[(?:REF_\d+(?:[,\s]+)?)+\]/gi) || [];
  const citedRefIds: string[] = [];

  for (const block of bracketBlocks) {
    const singleMatches = block.match(/REF_(\d+)/gi) || [];
    for (const m of singleMatches) {
      citedRefIds.push(m.toUpperCase());
    }
  }

  const uniqueCitedRefIds = Array.from(new Set(citedRefIds));
  const evidenceMap = new Map<string, EvidenceBlock>(
    evidenceBlocks.map((b) => [b.refId.toUpperCase(), b])
  );

  // 2. Map sentences to citations to allow pinpoint quote extraction
  const responseSentences = responseText.split(/(?<=[.?!])\s+/);
  const sentenceByRef = new Map<string, string>();
  for (const refId of uniqueCitedRefIds) {
    const citingSentence = responseSentences.find((s) =>
      new RegExp(`\\[[^\\]]*${refId}[^\\]]*\\]`, "i").test(s)
    );
    if (citingSentence) {
      sentenceByRef.set(refId, citingSentence);
    }
  }

  // 3. Separate valid and invalid citation references
  const validCitations: Citation[] = [];
  const invalidCitationRefs: string[] = [];

  for (const refId of uniqueCitedRefIds) {
    const evidence = evidenceMap.get(refId);
    if (evidence) {
      const citingSentence = sentenceByRef.get(refId) || "";
      const quote = extractMatchingQuote(evidence.content, citingSentence);

      validCitations.push({
        refId: evidence.refId,
        standardNumber: evidence.standardNumber,
        fullDesignation: evidence.standardNumber,
        documentTitle: evidence.documentTitle,
        clauseNumber: evidence.clauseNumber,
        clauseTitle: evidence.clauseTitle,
        pageNumber: evidence.pageNumber,
        sourceUrl: evidence.sourceUrl,
        mandatoryStatus: evidence.mandatoryStatus,
        chunkType: evidence.chunkType,
        quote,
        verified: true,
        confidenceScore: 0.95,
      });
    } else {
      invalidCitationRefs.push(refId);
    }
  }

  // 4. Hallucinated Standard Number Verification
  // Check every standard mentioned in responseText
  const mentionedStandards = extractStandardNumbers(responseText);

  // Build authentic known standards set:
  const authenticStandards = new Set<string>();
  // From retrieved evidence:
  for (const eb of evidenceBlocks) {
    authenticStandards.add(eb.standardNumber.toUpperCase());
    // Also extract cross-references mentioned in the content of the evidence blocks
    const crossRefsInEvidence = extractStandardNumbers(eb.content);
    for (const cr of crossRefsInEvidence) authenticStandards.add(cr);
  }
  // From seed documents:
  for (const doc of SEED_DOCUMENTS) {
    authenticStandards.add(doc.standardNumber.toUpperCase());
    if (doc.partNumber) {
      authenticStandards.add(`${doc.standardNumber} (${doc.partNumber})`.toUpperCase());
    }
  }
  // From standards graph:
  for (const [key, rels] of Object.entries(STANDARDS_KNOWLEDGE_GRAPH)) {
    authenticStandards.add(key.toUpperCase());
    for (const r of rels) {
      authenticStandards.add(r.standardNumber.toUpperCase());
    }
  }

  const hallucinatedStandards: string[] = [];
  for (const std of mentionedStandards) {
    const baseStd = std.split("(")[0].trim();
    if (!authenticStandards.has(std) && !authenticStandards.has(baseStd)) {
      hallucinatedStandards.push(std);
    }
  }

  // 5. Calculate Grounding / Faithfulness Score
  let groundingScore = 1.0;

  if (uniqueCitedRefIds.length === 0) {
    // If no citations were used at all in a response that claims facts, lower grounding
    groundingScore = evidenceBlocks.length === 0 ? 1.0 : 0.4;
  } else {
    const validRatio = validCitations.length / uniqueCitedRefIds.length;
    groundingScore = validRatio * 0.85;

    // Additional bonus for authentic quote match
    if (validCitations.length > 0) {
      groundingScore += 0.15;
    }
  }

  // Heavy penalties for hallucinations
  if (invalidCitationRefs.length > 0) {
    groundingScore -= invalidCitationRefs.length * 0.25;
  }
  if (hallucinatedStandards.length > 0) {
    groundingScore -= hallucinatedStandards.length * 0.35;
  }

  groundingScore = Math.max(0.0, Math.min(1.0, Math.round(groundingScore * 100) / 100));

  // 6. Discover Related Standards
  const citedStandardNumbers = Array.from(new Set(validCitations.map((c) => c.standardNumber)));
  const evidenceStandardNumbers = Array.from(new Set(evidenceBlocks.map((b) => b.standardNumber)));

  // Combine cited standards + evidence standards to query knowledge graph
  const allContextStandards = Array.from(new Set([...citedStandardNumbers, ...evidenceStandardNumbers]));
  const graphRelated = getRelatedStandardsForList(allContextStandards);

  // Also include co-retrieved standards that were not cited
  const coRetrievedStandards: RelatedStandard[] = [];
  for (const std of evidenceStandardNumbers) {
    if (!citedStandardNumbers.includes(std)) {
      const doc = SEED_DOCUMENTS.find((d) => d.standardNumber === std);
      if (doc) {
        coRetrievedStandards.push({
          standardNumber: doc.standardNumber,
          title: doc.title,
          relationship: "Co-retrieved Companion Standard in Search Results",
          mandatoryStatus: doc.isMandatory ? "mandatory" : "voluntary",
          sourceUrl: doc.sourceUrl,
        });
      }
    }
  }

  // Deduplicate related standards
  const seenRelated = new Set<string>(citedStandardNumbers);
  const finalRelatedStandards: RelatedStandard[] = [];

  for (const rel of [...coRetrievedStandards, ...graphRelated]) {
    if (!seenRelated.has(rel.standardNumber)) {
      seenRelated.add(rel.standardNumber);
      finalRelatedStandards.push(rel);
    }
  }

  return {
    validCitations,
    invalidCitationRefs,
    hallucinatedStandards,
    hasHallucinations: invalidCitationRefs.length > 0 || hallucinatedStandards.length > 0,
    groundingScore,
    relatedStandards: finalRelatedStandards,
  };
}
