// tests/demo-rehearsal.ts
import { runRagPipeline } from "@/lib/rag/pipeline";
import { findDemoCachedResponse, DEMO_CACHE } from "@/lib/rag/demo-cache";

async function runDemoRehearsal() {
  console.log("=================================================");
  console.log("🇮🇳 MANAK AI — SIH 2026 DEMO REHEARSAL & VERIFICATION");
  console.log("=================================================\n");

  const testQueries = [
    {
      name: "Demo Query 1: Manufacturer (Water Bottle QCO)",
      query: "I manufacture stainless steel water bottles. Which BIS standards apply?",
      expectedStandard: "IS 14543:2016",
      expectedMandatory: "mandatory",
      expectedLanguage: "en",
    },
    {
      name: "Demo Query 2: Consumer Safety (Pressure Cooker)",
      query: "How do I verify if a pressure cooker has a valid ISI Mark?",
      expectedStandard: "IS 2347:2017",
      expectedMandatory: "mandatory",
      expectedLanguage: "en",
    },
    {
      name: "Demo Query 3: Native Bilingual Hindi (Toy Safety)",
      query: "खिलौनों की सुरक्षा के लिए कौन से बीआईएस मानक अनिवार्य हैं?",
      expectedStandard: "IS 9873 (Part 1)",
      expectedMandatory: "mandatory",
      expectedLanguage: "hi",
    },
    {
      name: "Demo Query 4: Safety / Abstention Guardrail (AI Software)",
      query: "What are the BIS standards for artificial intelligence software?",
      expectedMandatory: "voluntary",
      expectedAbstention: true,
      expectedLanguage: "en",
    },
  ];

  let allPassed = true;

  // 1. Verify Demo Cache Matching
  console.log("📋 STEP 1: Verifying Demo Cache Matchers...");
  for (const t of testQueries) {
    const cached = findDemoCachedResponse(t.query);
    if (!cached) {
      console.error(`❌ Demo cache match failed for: "${t.query}"`);
      allPassed = false;
    } else {
      console.log(`  ✓ Match confirmed: [${cached.category}] -> "${t.name}"`);
    }
  }

  // 2. Rehearse RAG Pipeline for Each Demo Query
  console.log("\n🚀 STEP 2: Executing Live / Guardrailed Pipeline Rehearsals...");

  for (let i = 0; i < testQueries.length; i++) {
    const item = testQueries[i];
    console.log(`\n-------------------------------------------------`);
    console.log(`[Test ${i + 1}/${testQueries.length}] ${item.name}`);
    console.log(`Query: "${item.query}"`);

    const startTime = Date.now();
    const result = await runRagPipeline(item.query);
    const timeTaken = Date.now() - startTime;

    let streamedText = "";
    for await (const chunk of result.responseStream) {
      if (chunk.text) streamedText += chunk.text;
    }

    const finalVerification = result.finalize(streamedText);

    console.log(`  ⏱️ Latency: ${timeTaken}ms`);
    console.log(`  🌐 Language: ${result.language}`);
    console.log(`  🛡️ Mandatory Status: ${result.mandatoryStatus.toUpperCase()}`);
    console.log(`  📊 Confidence: ${result.confidence.level} (${Math.round(result.confidence.score * 100)}%)`);
    console.log(`  📋 Citations Verified: ${finalVerification.validCitations.length}`);
    console.log(`  ❌ Hallucinations: ${finalVerification.hasHallucinations ? "DETECTED!" : "0.0% (Clean)"}`);

    if (item.expectedLanguage && result.language !== item.expectedLanguage) {
      console.error(`  ❌ Expected language ${item.expectedLanguage}, got ${result.language}`);
      allPassed = false;
    }

    if (item.expectedMandatory && result.mandatoryStatus !== item.expectedMandatory) {
      console.error(`  ❌ Expected mandatory ${item.expectedMandatory}, got ${result.mandatoryStatus}`);
      allPassed = false;
    }

    if (item.expectedAbstention && !result.isAbstention && !finalVerification.isAbstention) {
      console.error(`  ❌ Expected abstention guardrail to trigger for out-of-scope query`);
      allPassed = false;
    }

    if (finalVerification.hasHallucinations) {
      console.error(`  ❌ Hallucinations detected:`, finalVerification.hallucinatedStandards);
      allPassed = false;
    }

    console.log(`  ✅ Preview: ${streamedText.substring(0, 140).replace(/\n/g, " ")}...`);
  }

  console.log("\n=================================================");
  if (allPassed) {
    console.log("🎉 ALL SIH DEMO QUERIES & BACKUP GUARDRAILS VERIFIED! (100% PASS)");
  } else {
    console.error("⚠️ SOME DEMO CHECKS FAILED.");
    process.exit(1);
  }
  console.log("=================================================\n");
}

runDemoRehearsal().catch((err) => {
  console.error("Demo rehearsal failed with uncaught exception:", err);
  process.exit(1);
});
