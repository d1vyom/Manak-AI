// src/lib/rag/confidence.ts
import { RetrievalResult, ConfidenceResult, ConfidenceLevel, ConfidenceSignals } from "@/types/rag";

/**
 * Calculates domain-specific confidence score based on retrieval signals.
 */
export function calculateConfidence(results: RetrievalResult[], requestedStandard?: string): ConfidenceResult {
  if (!results || results.length === 0) {
    return {
      level: "LOW",
      score: 0.1,
      signals: {
        topSimilarity: 0,
        hybridConsensus: 0,
        metadataMatch: 0,
        scoreMargin: 0,
      },
      explanation: "No authoritative Indian Standards or gazette documents were retrieved for this query.",
    };
  }

  const topSim = results[0]?.similarity ?? 0.0;
  const inBothCount = results.filter((r) => r.inVectorResults && r.inKeywordResults).length;
  const inKeywordCount = results.filter((r) => r.inKeywordResults).length;
  const hybridConsensus = inBothCount / Math.max(1, results.length);

  let metadataMatch = 0.0;
  if (requestedStandard) {
    metadataMatch = results.some((r) => r.standardNumber.toLowerCase().includes(requestedStandard.toLowerCase()))
      ? 1.0
      : 0.0;
  } else {
    // If no specific standard was requested, verify if any keywords matched Indian Standards
    if (inKeywordCount > 0 || hybridConsensus > 0) {
      metadataMatch = 0.8;
    } else {
      // Completely unrelated query with 0 keyword hits in standards
      metadataMatch = 0.0;
    }
  }

  const topScore = results[0]?.rrfScore ?? 0.016;
  const fifthScore = results[Math.min(4, results.length - 1)]?.rrfScore ?? 0.012;
  const scoreMargin = Math.min(1.0, Math.max(0, (topScore - fifthScore) / 0.005));

  const signals: ConfidenceSignals = {
    topSimilarity: Math.min(1.0, Math.max(0, topSim)),
    hybridConsensus,
    metadataMatch,
    scoreMargin,
  };

  const weightedScore =
    0.35 * signals.topSimilarity +
    0.25 * signals.hybridConsensus +
    0.25 * signals.metadataMatch +
    0.15 * signals.scoreMargin;

  let level: ConfidenceLevel = "LOW";
  if (weightedScore >= 0.65) {
    level = "HIGH";
  } else if (weightedScore >= 0.38) {
    level = "MEDIUM";
  }

  // Generate clear human-readable explanation
  let explanation = "";
  const primaryDoc = results[0]?.fullDesignation || results[0]?.standardNumber;
  const isMandatory = results.some((r) => r.isMandatory);

  if (level === "HIGH") {
    explanation = `Authoritative match found in ${primaryDoc}. Multiple verified clauses retrieved with strong consensus across keyword and semantic indices.${
      isMandatory ? " Product is covered under an active Quality Control Order (Mandatory ISI Mark)." : ""
    }`;
  } else if (level === "MEDIUM") {
    explanation = `Relevant clauses retrieved from ${primaryDoc}. Recommended for reference, though specific sub-clauses may require direct verification with BIS specifications.`;
  } else {
    explanation = `Limited direct evidence found. The knowledge base contains general standards, but no exact clause-level match was confirmed for this specific product or query.`;
  }

  return {
    level,
    score: Math.round(weightedScore * 100) / 100,
    signals,
    explanation,
  };
}
