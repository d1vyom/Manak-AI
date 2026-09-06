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
7. Standard Number Identification & Preservation: ALWAYS explicitly state the applicable Indian Standard designation (e.g. "IS 14543:2016", "IS 2347:2017") in Latin script in your answer. Never translate standard numbers into Devanagari (write "IS 14543", not "आई एस").
8. No LaTeX / Dollar Signs: Do NOT use LaTeX math syntax or enclose chemical formulas or units in dollar signs (e.g. write "CaCO3", "Cl", "Fluoride", "mg/l" directly in plain text, NEVER "$CaCO_3$" or "$Cl$").

Tone: Authoritative, objective, structured, professional government/regulatory style.`;
}

import {
  detectLanguage,
  extractCrossLingualKeywords,
  ensureLatinStandardPreservation,
} from "../utils/language";
import { cleanFormulaText } from "../utils/format";
import { findDemoCachedResponse } from "./demo-cache";

export { detectLanguage };

/**
 * Orchestrates the complete RAG execution flow with offline demo guardrails.
 */
export async function runRagPipeline(query: string, requestedLang?: "en" | "hi" | "auto") {
  const language = detectLanguage(query, requestedLang);

  try {
    // 1. Entity Extraction
    const entities = await extractEntities(query);

    // 2. Query Embedding
    const queryEmbedding = await generateEmbedding(
      entities.englishQuery || query,
      "RETRIEVAL_QUERY"
    );

    // 3. Hybrid Retrieval with cross-lingual keyword expansion
    const crossLingualKeywords = extractCrossLingualKeywords(query);
    const allKeywords = Array.from(
      new Set([...(entities.keywords || []), ...crossLingualKeywords])
    );
    const searchKeywords = allKeywords.length > 0 ? allKeywords.join(" ") : query;

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

    // 7. Post-Verification Callback with Latin Script Preservation & Clean Formatting
    const sanitizedStream = (async function* () {
      for await (const chunk of responseStream) {
        if (chunk.text) {
          yield { text: cleanFormulaText(ensureLatinStandardPreservation(chunk.text)) };
        } else {
          yield chunk;
        }
      }
    })();

    const finalize = (fullText: string): CitationValidationResult => {
      const preservedText = cleanFormulaText(ensureLatinStandardPreservation(fullText));
      return validateAndExtractCitations(
        preservedText,
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
      responseStream: sanitizedStream,
      finalize,
    };
  } catch (err: any) {
    console.warn("Live RAG pipeline encountered an error; checking demo cache fallback guardrail:", err?.message || err);

    // Check if query matches a pre-verified high-fidelity demo query
    const demoFallback = findDemoCachedResponse(query);
    if (demoFallback) {
      console.log(`✅ Activating verified demo fallback guardrail for: "${query}" (${demoFallback.category})`);

      const responseStream = (async function* () {
        const paragraphs = demoFallback.content.split("\n\n");
        for (const para of paragraphs) {
          yield { text: para + "\n\n" };
        }
      })();

      const finalize = (_fullText: string): CitationValidationResult => {
        return {
          validCitations: demoFallback.citations,
          invalidCitationRefs: [],
          hasHallucinations: false,
          hallucinatedStandards: [],
          groundingScore: demoFallback.confidence.score,
          relatedStandards: [],
          isAbstention: demoFallback.category === "abstention",
          abstentionReason:
            demoFallback.category === "abstention"
              ? "Out-of-scope query: no mandatory Indian Standards or QCOs indexed for this product."
              : undefined,
        };
      };

      return {
        language: demoFallback.language,
        confidence: demoFallback.confidence,
        entities: demoFallback.entities,
        evidenceBlocks: demoFallback.evidenceBlocks,
        mandatoryStatus: demoFallback.mandatoryStatus,
        isAbstention: demoFallback.category === "abstention",
        responseStream,
        finalize,
      };
    }

    // If no demo response matches, re-throw error for standard API handling
    throw err;
  }
}
