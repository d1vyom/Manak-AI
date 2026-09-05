// scripts/test-phase6.ts
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { generateCompliancePathway } from "../src/lib/compliance/pathway";
import { performGapAnalysis } from "../src/lib/compliance/gap-analysis";

async function main() {
  console.log("=================================================");
  console.log("  PHASE 6: COMPLIANCE PATHWAY & GAP ANALYSIS     ");
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
  // SUITE 1: COMPLIANCE PATHWAY GENERATION
  // ==========================================
  console.log("--- Suite 1: Compliance Pathway Generator ---");

  // Test 1: Stainless Steel Water Bottles
  console.log("\n[Test 1] Generating Pathway for 'Stainless Steel Water Bottles' (IS 14543)...");
  const pathway1 = await generateCompliancePathway("I manufacture stainless steel water bottles. What is the certification pathway?", "en");
  
  assert("Pathway product identified correctly", pathway1.product.includes("Stainless Steel"), `Got: ${pathway1.product}`);
  assert("Overall status is MANDATORY", pathway1.overallStatus === "mandatory", `Got: ${pathway1.overallStatus}`);
  assert("QCO details present", !!pathway1.qcoDetails?.qcoNumber.includes("3922"), `Got: ${JSON.stringify(pathway1.qcoDetails)}`);
  assert("Generates exactly 7 structured steps", pathway1.steps.length === 7, `Steps count: ${pathway1.steps.length}`);
  assert("Step 1 specifies applicable standard", pathway1.steps[0].title.includes("Applicable Indian Standards"));
  assert("Step 2 specifies QCO legal mandate", pathway1.steps[1].title.includes("Regulatory Status"));
  assert("Step 3 specifies Grade 304 material requirement", pathway1.steps[2].details.some((d) => d.includes("Grade 304")));
  assert("Step 4 specifies Boiling Citric Acid Test", pathway1.steps[3].details.some((d) => d.includes("Boiling Citric Acid")));
  assert("Step 6 specifies Manakonline Scheme-I application", pathway1.steps[5].details.some((d) => d.includes("manakonline.in")));
  assert("Step 7 specifies CML number marking", pathway1.steps[6].details.some((d) => d.includes("CM/L")));
  assert("Estimated timeline included", pathway1.estimatedTimeline.includes("months"));
  assert("Official disclaimer included", pathway1.disclaimer.includes("Bureau of Indian Standards"));

  // Test 2: Domestic Pressure Cookers
  console.log("\n[Test 2] Generating Pathway for 'Domestic Pressure Cookers' (IS 2347)...");
  const pathway2 = await generateCompliancePathway("Domestic pressure cookers safety requirements and BIS ISI license", "en");
  assert("Cooker pathway identifies IS 2347", pathway2.applicableStandards[0].standardNumber.includes("IS 2347"));
  assert("Cooker pathway specifies mandatory status", pathway2.overallStatus === "mandatory");
  assert("Cooker pathway includes dual safety valve testing", pathway2.steps[3].details.some((d) => d.includes("Safety Relief Valve")));

  // Test 3: Plain and Reinforced Concrete (Voluntary standard)
  console.log("\n[Test 3] Generating Pathway for 'Plain and Reinforced Concrete' (IS 456)...");
  const pathway3 = await generateCompliancePathway("Plain and reinforced concrete design code requirements IS 456", "en");
  assert("Concrete identifies voluntary status", pathway3.overallStatus === "voluntary");

  // Test 4: Multilingual Hindi Pathway
  console.log("\n[Test 4] Generating Bilingual Pathway in Hindi ('hi')...");
  const pathwayHi = await generateCompliancePathway("स्टेनलेस स्टील पानी की बोतल निर्माण नियम", "hi");
  assert("Hindi step 1 title in Devanagari", pathwayHi.steps[0].title.includes("भारतीय मानक की पहचान"));
  assert("Hindi step 2 title in Devanagari", pathwayHi.steps[1].title.includes("विनियामक स्थिति"));

  // ==========================================
  // SUITE 2: COMPLIANCE GAP ANALYSIS ENGINE
  // ==========================================
  console.log("\n--- Suite 2: Compliance Gap Analysis Engine ---");

  // Test 5: Fully Non-Compliant Manufacturer (SS 202, visual check only, ISO 9001 only)
  console.log("\n[Test 5] Auditing Non-Compliant Manufacturer (SS 202, Visual Check, ISO 9001 only)...");
  const gapNonCompliant = await performGapAnalysis({
    product: "Stainless Steel Water Bottle",
    material: "Grade 202 (Ferritic / 200 Series)",
    capacity: "1000 ml",
    currentTests: ["Visual surface check", "Water fill leakage test"],
    currentCertifications: ["ISO 9001:2015"],
  });

  const materialGap = gapNonCompliant.requirements.find((r) => r.category === "material");
  const testGap = gapNonCompliant.requirements.find((r) => r.requirement.includes("Boiling Citric Acid"));
  const certGap = gapNonCompliant.requirements.find((r) => r.category === "certification");

  assert("Flags Grade 202 as NOT_SATISFIED", materialGap?.status === "NOT_SATISFIED", `Got: ${materialGap?.status}`);
  assert("Material evidence states prohibited grade", !!materialGap?.evidence.includes("CRITICAL NON-COMPLIANCE"));
  assert("Flags missing Boiling Citric Acid test as NOT_SATISFIED", testGap?.status === "NOT_SATISFIED");
  assert("Flags ISO 9001 as NOT_SATISFIED (does not substitute ISI Mark)", certGap?.status === "NOT_SATISFIED");
  assert("Calculates non-zero critical gaps", gapNonCompliant.summary.criticalGaps.length >= 3, `Count: ${gapNonCompliant.summary.criticalGaps.length}`);
  assert("Provides sequential next steps", gapNonCompliant.summary.nextSteps.length >= 3);
  assert("Links authentic clause reference", materialGap?.reference !== null && materialGap?.reference?.clauseNumber === "4.1");

  // Test 6: Fully Compliant Manufacturer (Grade 304, Citric acid test, ISI Mark certified)
  console.log("\n[Test 6] Auditing Compliant Manufacturer (Grade 304, Citric Acid Test, ISI Certified)...");
  const gapCompliant = await performGapAnalysis({
    product: "Stainless Steel Water Bottle",
    material: "Austenitic Stainless Steel Grade 304 (X04Cr19Ni9)",
    capacity: "750 ml",
    currentTests: ["2-Hour Boiling Citric Acid test", "Chemical composition analysis via spectrometer"],
    currentCertifications: ["BIS ISI Mark License CM/L-8765432"],
  });

  const compMaterial = gapCompliant.requirements.find((r) => r.category === "material");
  const compTest = gapCompliant.requirements.find((r) => r.requirement.includes("Boiling Citric Acid"));
  const compCert = gapCompliant.requirements.find((r) => r.category === "certification");

  assert("Grade 304 is SATISFIED", compMaterial?.status === "SATISFIED", `Got: ${compMaterial?.status}`);
  assert("Citric acid test is SATISFIED", compTest?.status === "SATISFIED", `Got: ${compTest?.status}`);
  assert("ISI certification is SATISFIED", compCert?.status === "SATISFIED", `Got: ${compCert?.status}`);
  assert("Critical gaps count is 0 for compliant manufacturer", gapCompliant.summary.notSatisfied === 0, `Count: ${gapCompliant.summary.notSatisfied}`);

  // Test 7: Pressure Cooker Gap Analysis
  console.log("\n[Test 7] Auditing Pressure Cooker Manufacturer missing burst test...");
  const gapCooker = await performGapAnalysis({
    product: "Domestic Pressure Cooker",
    material: "Food Grade Aluminium Alloy",
    currentTests: ["Visual check"],
    currentCertifications: [],
  });
  const burstGap = gapCooker.requirements.find((r) => r.requirement.includes("Hydrostatic"));
  assert("Missing hydrostatic burst test is NOT_SATISFIED", burstGap?.status === "NOT_SATISFIED");

  console.log(`\n=================================================`);
  console.log(`  PHASE 6 SUMMARY: ${passed}/${total} ASSERTIONS PASSED!`);
  console.log(`=================================================\n`);

  if (passed !== total) {
    throw new Error(`Phase 6 test failure: ${total - passed} assertions failed!`);
  }
}

main().catch((err) => {
  console.error("Phase 6 Test Suite Failed:", err);
  process.exit(1);
});
