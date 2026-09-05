// src/lib/llm/entity-extraction.ts
import { ExtractedEntities } from "@/types/rag";
import { generateStructuredJson } from "./gemini";

const ENTITY_EXTRACTION_PROMPT = `You are a compliance entity extraction engine for Bureau of Indian Standards (BIS).
Analyze the user's query and extract key compliance parameters into JSON format.

Output Schema:
{
  "product": string | null,
  "material": string | null,
  "standardNumber": string | null,
  "clauseNumber": string | null,
  "industry": string | null,
  "productCategory": string | null,
  "intent": "find_standards" | "check_compliance" | "compare_standards" | "general_info",
  "keywords": string[],
  "englishQuery": string
}

Rules:
1. Standard numbers should be in format "IS XXXXX" (e.g., "IS 14543", "IS 10500", "IS 2347").
2. If query is in Hindi, translate the core intent to englishQuery and provide both English and Hindi keywords in the keywords list.
3. If intent is asking about which standards apply, use "find_standards". If asking about tests or verification, use "check_compliance".`;

/**
 * Extracts compliance entities and search keywords from user query.
 */
export async function extractEntities(query: string): Promise<ExtractedEntities> {
  // Fast regex pre-check for standard numbers (e.g. IS 14543, IS10500, IS 2347:2017)
  const isMatch = query.match(/IS\s*(\d{3,5})/i);
  const detectedStandard = isMatch ? `IS ${isMatch[1]}` : undefined;

  try {
    const extracted = await generateStructuredJson<ExtractedEntities>({
      prompt: `User Query: "${query}"`,
      systemInstruction: ENTITY_EXTRACTION_PROMPT,
      temperature: 0.1,
    });

    if (detectedStandard && !extracted.standardNumber) {
      extracted.standardNumber = detectedStandard;
    }

    if (!extracted.keywords || extracted.keywords.length === 0) {
      extracted.keywords = query.split(/\s+/).filter((w) => w.length > 3);
    }

    return extracted;
  } catch (error) {
    console.warn("Entity extraction fallback heuristic used:", error);
    // Fallback heuristic
    return {
      product: undefined,
      material: undefined,
      standardNumber: detectedStandard,
      intent: detectedStandard ? "check_compliance" : "find_standards",
      keywords: query.split(/\s+/).filter((w) => w.length > 2),
      englishQuery: query,
    };
  }
}
