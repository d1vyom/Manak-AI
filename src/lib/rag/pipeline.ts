// src/lib/rag/pipeline.ts
import { generateEmbedding, generateTextStream } from "../llm/gemini";
import { extractEntities } from "../llm/entity-extraction";
import { searchStandards } from "../db/queries";
import { assembleEvidenceBlocks, formatEvidenceContext } from "./evidence";
import { calculateConfidence } from "./confidence";
import { validateAndExtractCitations } from "./citations";
import { evaluateAbstention } from "./abstention";
import { ExtractedEntities, ConfidenceResult, EvidenceBlock, MandatoryStatus } from "@/types/rag";
import { Citation, CitationValidationResult } from "@/types/citations";

export interface RagPipelineResult {
  language: "en" | "hi";
  confidence: ConfidenceResult;
  entities: ExtractedEntities;
  evidenceBlocks: EvidenceBlock[];
  mandatoryStatus: MandatoryStatus;
  isAbstention: boolean;
  responseStream: AsyncGenerator<{ text?: string }, void, unknown>;
  finalize: (fullText: string) => CitationValidationResult;
}

/**
 * Builds the strict, anti-hallucination system prompt for Manak AI.
 */
function buildSystemPrompt(language: "en" | "hi"): string {
  return `You are Manak AI, an authoritative, AI-powered compliance intelligence assistant for Indian Standards (Bureau of Indian Standards — BIS).

STRICT COMPLIANCE & CITATION RULES:
1. Grounding: Answer ONLY using the facts explicitly stated in the CONTEXT DOCUMENTS below.
2. Citation Syntax: Every factual requirement, limit, standard number, or test method MUST be immediately followed by its reference tag (e.g. [REF_1], [REF_2]).
3. Anti-Hallucination: Do NOT invent clause numbers, standards, parameters, or dates not present in the context.
4. Abstention: If the provided context does NOT contain enough information to answer the question with certainty, state clearly:
   "The available Indian Standards and documents do not provide sufficient information on this topic." Do not guess or rely on external training data.
5. Mandatory Status: Clearly indicate whether the standard is MANDATORY under an active Quality Control Order (QCO) or VOLUNTARY.
6. Language: Respond in ${language === "hi" ? "Hindi (हिन्दी)" : "English"}.
7. Standard Number Preservation: Always write Indian Standard designations in Latin alphanumeric script (e.g. "IS 14543:2016", "IS 10500:2012", not "आई एस").

Tone: Authoritative, objective, structured, professional government/regulatory style.`;
}

/**
 * Detects whether the query is in Hindi based on Devanagari Unicode range.
 */
export function detectLanguage(query: string, requestedLang?: string): "en" | "hi" {
  if (requestedLang === "hi") return "hi";
  if (requestedLang === "en") return "en";
  // Check for Devanagari characters: U+0900 to U+097F
  const hasDevanagari = /[\u0900-\u097F]/.test(query);
  return hasDevanagari ? "hi" : "en";
}

/**
 * Orchestrates the complete RAG execution flow.
 */
export async function runRagPipeline(query: string, requestedLang?: "en" | "hi" | "auto") {
  const language = detectLanguage(query, requestedLang);

  // 1. Entity Extraction
  const entities = await extractEntities(query);

  // 2. Query Embedding
  const queryEmbedding = await generateEmbedding(
    entities.englishQuery || query,
    "RETRIEVAL_QUERY"
  );

  // 3. Hybrid Retrieval
  const searchKeywords = entities.keywords && entities.keywords.length > 0
    ? entities.keywords.join(" ")
    : query;

  const retrievalResults = await searchStandards({
    queryText: `${query} ${searchKeywords}`,
    queryEmbedding,
    filterStandard: entities.standardNumber,
    matchCount: 8,
  });

  // 4. Evidence Assembly & Confidence Scoring
  const evidenceBlocks = assembleEvidenceBlocks(retrievalResults);
  const confidence = calculateConfidence(retrievalResults, entities.standardNumber);

  // Determine overall mandatory status
  const hasMandatoryQco = evidenceBlocks.some((b) => b.mandatoryStatus === "mandatory");
  const mandatoryStatus: MandatoryStatus = hasMandatoryQco ? "mandatory" : "voluntary";

  // 5. Early Abstention Check (if evidence is completely absent)
  const initialAbstentionCheck = evaluateAbstention(
    query,
    evidenceBlocks,
    confidence,
    undefined,
    language
  );

  let responseStream: AsyncGenerator<{ text?: string }, void, unknown>;
  let isAbstention = initialAbstentionCheck.shouldAbstain;

  if (initialAbstentionCheck.shouldAbstain && initialAbstentionCheck.suggestedResponse) {
    // Generate an async stream yielding the abstention message without calling LLM
    const abstentionText = initialAbstentionCheck.suggestedResponse;
    responseStream = (async function* () {
      // Chunk response slightly for pleasant streaming appearance
      const chunks = abstentionText.split("\n\n");
      for (const chunk of chunks) {
        yield { text: chunk + "\n\n" };
      }
    })();
  } else {
    // 6. Construct Context & Prompts
    const formattedContext = formatEvidenceContext(evidenceBlocks);
    const systemInstruction = buildSystemPrompt(language);

    const prompt = `CONTEXT DOCUMENTS:
---
${formattedContext}
---

USER QUERY:
${query}

Provide a structured, evidence-based compliance answer with immediate [REF_N] citations.`;

    responseStream = await generateTextStream({
      prompt,
      systemInstruction,
      temperature: 0.15,
    });
  }

  // 7. Post-Verification Callback
  const finalize = (fullText: string): CitationValidationResult => {
    return validateAndExtractCitations(
      fullText,
      evidenceBlocks,
      confidence,
      query,
      language
    );
  };

  return {
    language,
    confidence,
    entities,
    evidenceBlocks,
    mandatoryStatus,
    isAbstention,
    responseStream,
    finalize,
  };
}
