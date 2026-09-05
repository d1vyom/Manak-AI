// src/lib/llm/gemini.ts
import { GoogleGenAI } from "@google/genai";

let geminiClientInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!geminiClientInstance) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not set in environment.");
    }
    geminiClientInstance = new GoogleGenAI({ apiKey });
  }
  return geminiClientInstance;
}

export const GEMINI_MODELS = {
  MAIN: "gemini-3.6-flash",
  FAST: "gemini-3.6-flash",
  EMBEDDING: "gemini-embedding-2",
};

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelayMs = 3000): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const isRateLimit =
        err?.status === 429 ||
        err?.code === 429 ||
        String(err?.message || "").includes("429") ||
        String(err?.message || "").includes("RESOURCE_EXHAUSTED");

      if (isRateLimit && attempt < maxRetries - 1) {
        const delay = initialDelayMs * Math.pow(2, attempt) + Math.random() * 500;
        console.warn(
          `[Gemini API] Rate limit (429) hit. Retrying attempt ${attempt + 1}/${maxRetries} after ${Math.round(delay)}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

export interface GenerateTextOptions {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

/**
 * Generate a complete text response using Gemini.
 */
export async function generateText(options: GenerateTextOptions): Promise<string> {
  const { prompt, systemInstruction, temperature = 0.2, maxOutputTokens = 2048 } = options;
  const client = getGeminiClient();

  return await withRetry(async () => {
    const response = await client.models.generateContent({
      model: GEMINI_MODELS.MAIN,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || undefined,
        temperature,
        maxOutputTokens,
      },
    });

    return response.text || "";
  });
}

/**
 * Generate a streaming text response using Gemini.
 */
export async function generateTextStream(options: GenerateTextOptions) {
  const { prompt, systemInstruction, temperature = 0.2, maxOutputTokens = 2048 } = options;
  const client = getGeminiClient();

  return await withRetry(async () => {
    return await client.models.generateContentStream({
      model: GEMINI_MODELS.MAIN,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || undefined,
        temperature,
        maxOutputTokens,
      },
    });
  });
}

/**
 * Generate structured JSON output using Gemini.
 */
export async function generateStructuredJson<T>(options: GenerateTextOptions): Promise<T> {
  const { prompt, systemInstruction, temperature = 0.1 } = options;

  const jsonPrompt = `${prompt}\n\nIMPORTANT: Respond ONLY with valid, unformatted JSON. Do not include markdown code fences or backticks.`;

  const raw = await generateText({
    prompt: jsonPrompt,
    systemInstruction,
    temperature,
  });

  try {
    const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.error("Failed to parse JSON from Gemini response:", raw);
    throw new Error("Invalid JSON response from Gemini");
  }
}

/**
 * Generate 768-dimensional text embedding using gemini-embedding-2.
 */
export async function generateEmbedding(
  text: string,
  taskType: "RETRIEVAL_QUERY" | "RETRIEVAL_DOCUMENT" = "RETRIEVAL_QUERY"
): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    return new Array(768).fill(0);
  }

  try {
    const client = getGeminiClient();
    const response = await withRetry(async () => {
      return await client.models.embedContent({
        model: GEMINI_MODELS.EMBEDDING,
        contents: text,
        config: {
          outputDimensionality: 768,
        },
      });
    }, 2, 2000);

    if (response.embeddings && response.embeddings.length > 0 && response.embeddings[0].values) {
      return response.embeddings[0].values;
    }
  } catch (err) {
    console.warn("Failed to generate embedding with Gemini API, falling back:", err);
  }

  return new Array(768).fill(0);
}
