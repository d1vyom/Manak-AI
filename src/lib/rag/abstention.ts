// src/lib/rag/abstention.ts
import { ConfidenceResult, EvidenceBlock } from "@/types/rag";

export interface AbstentionEvaluation {
  shouldAbstain: boolean;
  reason?: string;
  suggestedResponse?: string;
}

const KNOWN_COVERED_STANDARDS_EN = [
  "IS 14543: Stainless Steel Utensils & Water Bottles",
  "IS 10500: Drinking Water Specifications & Heavy Metals",
  "IS 2347: Domestic Pressure Cookers & Safety Valves",
  "IS 9873 (Part 1): Safety of Toys & Choking Hazard Limits",
  "IS 4151: Protective Helmets for Two-Wheeler Riders",
  "IS 1786: High Strength Deformed Steel Bars (TMT Fe 500D)",
  "IS 456: Plain and Reinforced Concrete Structural Code",
];

const KNOWN_COVERED_STANDARDS_HI = [
  "IS 14543: स्टेनलेस स्टील के बर्तन और पानी की बोतलें",
  "IS 10500: पेयजल विनिर्देश और भारी धातु सीमाएं",
  "IS 2347: घरेलू प्रेशर कुकर और सुरक्षा वाल्व",
  "IS 9873 (Part 1): खिलौनों की सुरक्षा और चोकिंग खतरे की सीमाएं",
  "IS 4151: दोपहिया वाहन चालकों के लिए सुरक्षात्मक हेलमेट",
  "IS 1786: उच्च शक्ति विकृत स्टील बार (TMT Fe 500D)",
  "IS 456: सादा और प्रबलित कंक्रीट संरचनात्मक कोड",
];

/**
 * Checks if the generated text contains standard abstention or refusal phrases.
 */
export function containsAbstentionPhrases(text: string): boolean {
  const lower = text.toLowerCase();
  const phrases = [
    "do not provide sufficient information",
    "does not provide sufficient information",
    "insufficient information on this topic",
    "no relevant indian standards found",
    "not covered in the available indian standards",
    "no information available in the provided context",
    "पर्याप्त जानकारी प्रदान नहीं करते",
    "पर्याप्त जानकारी उपलब्ध नहीं है",
    "उपलब्ध भारतीय मानकों में शामिल नहीं है",
  ];
  return phrases.some((p) => lower.includes(p));
}

/**
 * Evaluates whether Manak AI should abstain from answering due to lack of evidence
 * or out-of-scope query.
 */
export function evaluateAbstention(
  query: string,
  evidenceBlocks: EvidenceBlock[],
  confidence: ConfidenceResult,
  generatedText?: string,
  language: "en" | "hi" = "en"
): AbstentionEvaluation {
  // Check 1: Zero evidence retrieved or LOW confidence score
  if (evidenceBlocks.length === 0 || confidence.level === "LOW") {
    const isHindi = language === "hi";
    const standardsList = isHindi ? KNOWN_COVERED_STANDARDS_HI : KNOWN_COVERED_STANDARDS_EN;

    const responseEn = `### Insufficient Official Information Found

The current Manak AI database does not contain sufficient authoritative Indian Standards or Quality Control Orders (QCOs) to answer your query: **"${query}"**.

To prevent hallucinations, Manak AI strictly refrains from guessing regulatory or technical compliance requirements.

#### Currently Indexed Standards & Categories:
${standardsList.map((s) => `- **${s}**`).join("\n")}

#### Recommended Official Resources:
- Search the official Bureau of Indian Standards portal: [BIS Standards Portal](https://www.services.bis.gov.in/)
- Check Quality Control Orders on the DPIIT / Ministry portals: [Manakonline](https://www.manakonline.in/)
- Refine your query with specific product keywords or standard numbers (e.g., *"IS 14543 water bottle requirements"* or *"IS 2347 pressure cooker safety"*).`;

    const responseHi = `### पर्याप्त आधिकारिक जानकारी नहीं मिली

वर्तमान मानक AI (Manak AI) डेटाबेस में आपके प्रश्न: **"${query}"** का उत्तर देने के लिए पर्याप्त आधिकारिक भारतीय मानक (BIS Standards) या गुणवत्ता नियंत्रण आदेश (QCO) उपलब्ध नहीं हैं।

भ्रामक या गलत जानकारी (Hallucination) से बचने के लिए, मानक AI बिना आधिकारिक संदर्भ के तकनीकी या विनियामक प्रश्नों का अनुमान नहीं लगाता है।

#### वर्तमान में शामिल मानक और श्रेणियां:
${standardsList.map((s) => `- **${s}**`).join("\n")}

#### अनुशंसित आधिकारिक स्रोत:
- भारतीय मानक ब्यूरो (BIS) के आधिकारिक पोर्टल पर खोजें: [BIS Standards Portal](https://www.services.bis.gov.in/)
- गुणवत्ता नियंत्रण आदेश (QCO) की जांच करें: [Manakonline](https://www.manakonline.in/)
- अपने प्रश्न में विशिष्ट उत्पाद नाम या मानक संख्या जोड़कर पुनः प्रयास करें (जैसे: *"IS 14543 पानी की बोतल नियम"* या *"IS 2347 प्रेशर कुकर सुरक्षा"*).`;

    return {
      shouldAbstain: true,
      reason: "No authoritative evidence blocks retrieved for query",
      suggestedResponse: isHindi ? responseHi : responseEn,
    };
  }

  // Check 2: The model itself issued an abstention in the generated text
  if (generatedText && containsAbstentionPhrases(generatedText)) {
    return {
      shouldAbstain: true,
      reason: "Model signaled insufficient evidence in context",
    };
  }

  return {
    shouldAbstain: false,
  };
}
