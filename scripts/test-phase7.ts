// scripts/test-phase7.ts
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import {
  detectLanguage,
  isDevanagariScript,
  extractCrossLingualKeywords,
  ensureLatinStandardPreservation,
  normalizeStandardNumber,
} from "../src/lib/utils/language";
import { UI_STRINGS, t, Dictionary } from "../src/lib/utils/i18n";
import { runRagPipeline } from "../src/lib/rag/pipeline";

async function main() {
  console.log("=================================================");
  console.log("  PHASE 7: MULTILINGUAL SUPPORT (HINDI & ENGLISH)");
  console.log("=================================================\n");

  let passed = 0;
  let total = 0;

  function assert(name: string, condition: boolean, details?: string) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${name} ${details ? "- " + details : ""}`);
    }
  }

  // ==========================================
  // SUITE 1: LANGUAGE DETECTION & HINGLISH
  // ==========================================
  console.log("--- Suite 1: Language Detection & Hinglish Classifier ---");

  // Test 1: Devanagari detection
  const hindiQuery1 = "क्या स्टेनलेस स्टील पानी की बोतल के लिए ISI मार्क अनिवार्य है?";
  assert("Detects pure Devanagari as 'hi'", detectLanguage(hindiQuery1) === "hi");
  assert("Identifies Devanagari script", isDevanagariScript(hindiQuery1) === true);

  // Test 2: Hinglish detection
  const hinglishQuery = "kya pressure cooker ke liye ISI mark compulsory hai?";
  assert("Detects Romanized Hinglish as 'hi'", detectLanguage(hinglishQuery) === "hi");

  const hinglishQuery2 = "paani ki bottle ke liye kaun sa manak lagta hai";
  assert("Detects conversational Hinglish as 'hi'", detectLanguage(hinglishQuery2) === "hi");

  // Test 3: Pure English detection
  const englishQuery = "What are the permissible limits for Lead in drinking water under IS 10500?";
  assert("Detects standard English as 'en'", detectLanguage(englishQuery) === "en");
  assert("Confirms no Devanagari script in English", isDevanagariScript(englishQuery) === false);

  // Test 4: Explicit language override
  assert("Honors explicit 'hi' override", detectLanguage("Tell me about IS 14543", "hi") === "hi");
  assert("Honors explicit 'en' override", detectLanguage(hindiQuery1, "en") === "en");

  // Test 5: Standard normalization
  assert("Normalizes hyphenated standard", normalizeStandardNumber("IS-14543") === "IS 14543");
  assert("Normalizes closed standard", normalizeStandardNumber("IS10500") === "IS 10500");
  assert("Normalizes Devanagari IS prefix", normalizeStandardNumber("आई एस 2347") === "IS 2347");

  // ==========================================
  // SUITE 2: CROSS-LINGUAL KEYWORDS & LATIN PRESERVATION
  // ==========================================
  console.log("\n--- Suite 2: Cross-Lingual Keywords & Script Preservation ---");

  // Test 6: Cross-lingual keyword expansion
  const keywords = extractCrossLingualKeywords(hindiQuery1);
  assert("Extracts English 'water' from 'पानी'", keywords.some((k) => k.includes("water")));
  assert("Extracts English 'bottle' from 'बोतल'", keywords.some((k) => k.includes("bottle")));
  assert("Extracts English 'stainless' from 'स्टेनलेस'", keywords.some((k) => k.includes("stainless")));
  assert("Extracts English 'mandatory' from 'अनिवार्य'", keywords.some((k) => k.includes("mandatory")));
  assert("Retains explicit 'ISI' token", keywords.includes("isi"));

  // Test 7: Latin script preservation
  const devanagariStandardsText = "परीक्षण के लिए आई एस १४५४३ और आई.एस. २३४७ आवश्यक हैं।";
  const preserved = ensureLatinStandardPreservation(devanagariStandardsText);
  assert("Converts Devanagari digits & text to Latin IS 14543", preserved.includes("IS 14543"), `Got: ${preserved}`);
  assert("Converts Devanagari digits & text to Latin IS 2347", preserved.includes("IS 2347"), `Got: ${preserved}`);

  // ==========================================
  // SUITE 3: BILINGUAL UI DICTIONARY COVERAGE
  // ==========================================
  console.log("\n--- Suite 3: Bilingual UI Dictionary Coverage ---");

  const enKeys = Object.keys(UI_STRINGS.en) as (keyof Dictionary)[];
  const hiKeys = Object.keys(UI_STRINGS.hi) as (keyof Dictionary)[];

  assert("English dictionary has > 25 keys", enKeys.length >= 25, `Found: ${enKeys.length}`);
  assert("Hindi dictionary has identical keys count", enKeys.length === hiKeys.length, `En: ${enKeys.length}, Hi: ${hiKeys.length}`);

  let allKeysPopulated = true;
  for (const k of enKeys) {
    if (!UI_STRINGS.en[k] || !UI_STRINGS.hi[k]) {
      allKeysPopulated = false;
      console.error(`Missing translation for key: ${k}`);
    }
  }
  assert("All translation keys populated in both en and hi", allKeysPopulated);

  assert("t helper returns correct Hindi title", t("brandTitle", "hi") === "मानक AI");
  assert("t helper returns correct English title", t("brandTitle", "en") === "Manak AI");
  assert("t helper returns correct Hindi search placeholder", t("searchPlaceholder", "hi").includes("पूछें"));

  // ==========================================
  // SUITE 4: END-TO-END LIVE HINDI RAG PIPELINE
  // ==========================================
  console.log("\n--- Suite 4: End-to-End Live Hindi RAG Pipeline Query ---");
  console.log(`Query: "${hindiQuery1}"`);

  const pipelineResult = await runRagPipeline(hindiQuery1);

  assert("Pipeline detects 'hi' language", pipelineResult.language === "hi");
  assert("Pipeline retrieves evidence blocks", pipelineResult.evidenceBlocks.length > 0);
  assert("Mandatory QCO detected in Hindi query", pipelineResult.mandatoryStatus === "mandatory");

  let hindiResponse = "";
  for await (const chunk of pipelineResult.responseStream) {
    hindiResponse += chunk.text || "";
  }

  const finalVerification = pipelineResult.finalize(hindiResponse);

  console.log(`\nGenerated Hindi Response (first 280 chars):`);
  console.log(hindiResponse.slice(0, 280).trim() + (hindiResponse.length > 280 ? "..." : ""));

  assert("Response contains Devanagari characters", isDevanagariScript(hindiResponse));
  assert("Preserves Latin standard designation 'IS 14543'", hindiResponse.includes("IS 14543"));
  assert("Includes valid citations", finalVerification.validCitations.length > 0);
  assert("Zero hallucinations", !finalVerification.hasHallucinations);

  console.log(`\n=================================================`);
  console.log(`  PHASE 7 SUMMARY: ${passed}/${total} ASSERTIONS PASSED!`);
  console.log(`=================================================\n`);

  if (passed !== total) {
    throw new Error(`Phase 7 test failure: ${total - passed} assertions failed!`);
  }
}

main().catch((err) => {
  console.error("Phase 7 Test Suite Failed:", err);
  process.exit(1);
});
