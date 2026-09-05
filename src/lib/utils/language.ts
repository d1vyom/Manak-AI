// src/lib/utils/language.ts

export type SupportedLanguage = "en" | "hi";

// In-memory cache for fast language detection lookups
const languageCache = new Map<string, SupportedLanguage>();

// High-frequency Hinglish / Romanized Hindi keywords
const HINGLISH_KEYWORDS = new Set([
  "kya",
  "hai",
  "hain",
  "kaise",
  "kyun",
  "chahiye",
  "jaroori",
  "jaruri",
  "anivarya",
  "hoti",
  "hota",
  "hote",
  "wale",
  "wali",
  "wala",
  "liye",
  "karta",
  "karna",
  "kaun",
  "kaunsa",
  "kaunsi",
  "kitna",
  "kitni",
  "lagta",
  "lagti",
  "manak",
  "sarkari",
  "niyam",
  "pramanit",
  "shuru",
  "kare",
  "karein",
  "kripya",
  "bataiye",
  "batao",
  "dekhe",
  "paani",
  "pani",
  "sariya",
  "khilone",
  "bartan",
]);

// Domain-specific bilingual mapping for cross-lingual search keyword expansion
const HINDI_TO_ENGLISH_KEYWORDS: Record<string, string[]> = {
  // Water bottles & utensils
  "पानी": ["water", "drinking water", "potable"],
  "बोतल": ["bottle", "water bottle", "flask", "container"],
  "बोतलें": ["bottles", "water bottles", "containers"],
  "बर्तन": ["utensils", "domestic utensils", "cookware", "tableware"],
  "स्टेनलेस": ["stainless", "stainless steel", "austenitic"],
  "स्टील": ["steel", "stainless steel", "alloy"],

  // Pressure cookers & appliances
  "प्रेशर": ["pressure", "pressure cooker"],
  "कुकर": ["cooker", "pressure cooker", "domestic cooker"],
  "सीटी": ["weight valve", "pressure regulator"],
  "वाल्व": ["safety valve", "relief valve"],
  "गैसकेट": ["gasket", "rubber gasket", "sealing"],

  // Toys
  "खिलौने": ["toys", "play equipment", "child safety"],
  "खिलौना": ["toy", "children product"],
  "बच्चों": ["children", "infants", "under 36 months"],
  "चोकिंग": ["choking", "small parts", "cylinder"],

  // Helmets
  "हेलमेट": ["helmet", "protective helmet", "headgear"],
  "दोपहिया": ["two wheeler", "motorcycle", "motor vehicle"],
  "सवार": ["rider", "pillion rider"],
  "पट्टा": ["retention strap", "chin strap"],

  // Steel Rebars & Construction
  "सरिया": ["tmt rebar", "steel bar", "reinforcement bar"],
  "कंक्रीट": ["concrete", "plain concrete", "reinforced concrete"],
  "सीमेंट": ["cement", "opc cement"],
  "भूकंप": ["earthquake resistant", "seismic", "ductile", "Fe 500D"],

  // Regulatory & Certification
  "अनिवार्य": ["mandatory", "statutory", "QCO"],
  "जरूरी": ["mandatory", "required", "compulsory"],
  "स्वैच्छिक": ["voluntary", "optional"],
  "लाइसेंस": ["license", "CM/L", "certification"],
  "प्रमाणन": ["certification", "ISI Mark", "Scheme-I"],
  "परीक्षण": ["testing", "laboratory test", "analysis"],
  "जांच": ["inspection", "STI", "audit"],
  "आदेश": ["order", "QCO", "gazette"],
  "मानक": ["standard", "specification", "IS"],
  "नियम": ["regulations", "rules", "requirements"],
};

/**
 * Checks if a string contains characters from the Devanagari script (U+0900 to U+097F).
 */
export function isDevanagariScript(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Normalizes Indian Standard number references (e.g. "is14543", "IS-14543", "आई एस 14543" -> "IS 14543").
 */
export function normalizeStandardNumber(std: string): string {
  let cleaned = std.trim();
  // Replace Devanagari script for "IS" (आई एस, आई.एस.)
  cleaned = cleaned.replace(/आई\s*[\.\s]?\s*एस/gi, "IS");
  // Normalize hyphen or no space e.g. IS-14543, IS14543 -> IS 14543
  cleaned = cleaned.replace(/\bIS[-\s]?(\d+)/gi, "IS $1");
  return cleaned;
}

/**
 * Detects whether a query should be handled in Hindi or English.
 * Automatically checks for Devanagari characters and Romanized Hinglish vocabulary.
 */
export function detectLanguage(
  query: string,
  requestedLang?: "en" | "hi" | "auto"
): SupportedLanguage {
  if (requestedLang === "hi") return "hi";
  if (requestedLang === "en") return "en";

  const trimmed = query.trim();
  if (languageCache.has(trimmed)) {
    return languageCache.get(trimmed)!;
  }

  // 1. Direct Devanagari character presence
  if (isDevanagariScript(trimmed)) {
    languageCache.set(trimmed, "hi");
    return "hi";
  }

  // 2. Hinglish token frequency check
  const words = trimmed
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);

  let hinglishHits = 0;
  for (const word of words) {
    if (HINGLISH_KEYWORDS.has(word)) {
      hinglishHits++;
    }
  }

  const isHinglish = hinglishHits >= 2 || (words.length <= 4 && hinglishHits >= 1);
  const detected: SupportedLanguage = isHinglish ? "hi" : "en";

  languageCache.set(trimmed, detected);
  return detected;
}

/**
 * Extracts English technical keywords from Hindi/Hinglish queries to ensure
 * high-recall hybrid retrieval against primarily English BIS standards text.
 */
export function extractCrossLingualKeywords(query: string): string[] {
  const extracted = new Set<string>();

  // Always extract any explicit standard numbers in Latin script (e.g. IS 14543)
  const isMatches = query.match(/\bIS\s*\d+(?:\s*\([^\)]+\))?/gi) || [];
  for (const m of isMatches) {
    extracted.add(normalizeStandardNumber(m));
  }

  // Check dictionary matches against Devanagari words or phrases
  for (const [hindiTerm, englishTerms] of Object.entries(HINDI_TO_ENGLISH_KEYWORDS)) {
    if (query.includes(hindiTerm)) {
      for (const eng of englishTerms) {
        extracted.add(eng);
      }
    }
  }

  // Also retain any English words already typed by the user (mixed query)
  const englishTokens = query
    .replace(/[\u0900-\u097F]/g, " ")
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !/^\d+$/.test(w) && !HINGLISH_KEYWORDS.has(w.toLowerCase()));

  for (const token of englishTokens) {
    extracted.add(token.toLowerCase());
  }

  return Array.from(extracted);
}

/**
 * Ensures standard designations are protected in Latin alphanumeric script.
 */
export function ensureLatinStandardPreservation(text: string): string {
  // Convert any phonetic Hindi renditions like "आई एस १४५४३" or "आई.एस. २३४७" back into canonical "IS 14543"
  let result = text.replace(/आई\s*[\.\s]?\s*एस[\.\s]*([०-९\d]+)/gi, (match, p1) => {
    // Convert Devanagari numerals to Latin numerals
    const devanagariDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    let latinDigits = p1;
    for (let i = 0; i < 10; i++) {
      latinDigits = latinDigits.replace(new RegExp(devanagariDigits[i], "g"), String(i));
    }
    return `IS ${latinDigits}`;
  });

  return result;
}
