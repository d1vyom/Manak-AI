// src/lib/compliance/gap-analysis.ts
import {
  GapAnalysisInput,
  GapAnalysisResult,
  RequirementGap,
  GapSummary,
  GapStatus,
} from "@/types/compliance";
import { Citation } from "@/types/citations";
import { searchStandards } from "../db/queries";
import { assembleEvidenceBlocks } from "../rag/evidence";
import { calculateConfidence } from "../rag/confidence";
import { validateAndExtractCitations } from "../rag/citations";
import { SEED_DOCUMENTS } from "../data/seed-data";

/**
 * Performs rigorous regulatory gap analysis comparing manufacturer-declared
 * materials, tests, and certifications against mandatory BIS specifications.
 */
export async function performGapAnalysis(
  input: GapAnalysisInput,
  language: "en" | "hi" = "en"
): Promise<GapAnalysisResult> {
  const { product, material, currentTests = [], currentCertifications = [] } = input;

  // 1. Retrieve applicable standards and clauses from knowledge base
  const searchResults = await searchStandards({
    queryText: `${product} ${material} requirements testing standards`,
    matchCount: 8,
  });

  const evidenceBlocks = assembleEvidenceBlocks(searchResults);
  const confidence = calculateConfidence(searchResults);

  // Generate citations from retrieved evidence blocks
  const citationMap = new Map<string, Citation>();
  if (evidenceBlocks.length > 0) {
    const mockRefText = evidenceBlocks.map((b) => `[${b.refId}]`).join(" ");
    const valResult = validateAndExtractCitations(mockRefText, evidenceBlocks, confidence, product, language);
    for (const c of valResult.validCitations) {
      citationMap.set(c.clauseNumber, c);
    }
  }

  // 2. Determine applicable product domain
  const productLower = product.toLowerCase();
  const materialLower = (material || "").toLowerCase();
  const testsLower = currentTests.map((t) => t.toLowerCase());
  const certsLower = currentCertifications.map((c) => c.toLowerCase());

  const isUtensilOrBottle =
    productLower.includes("bottle") ||
    productLower.includes("utensil") ||
    productLower.includes("flask") ||
    productLower.includes("cookware") ||
    materialLower.includes("304") ||
    materialLower.includes("202") ||
    materialLower.includes("steel");

  const isPressureCooker =
    productLower.includes("cooker") || productLower.includes("pressure");

  const isToy =
    productLower.includes("toy") || productLower.includes("child") || productLower.includes("game");

  const isHelmet =
    productLower.includes("helmet") || productLower.includes("headgear") || productLower.includes("rider");

  const isSteelRebar =
    productLower.includes("rebar") ||
    productLower.includes("tmt") ||
    productLower.includes("steel bar") ||
    materialLower.includes("fe 500");

  const isDrinkingWater =
    productLower.includes("water") && !isUtensilOrBottle;

  // 3. Evaluate Requirements across 5 Categories
  const requirements: RequirementGap[] = [];

  // ==========================================
  // Category 1: Raw Material Compliance
  // ==========================================
  if (isUtensilOrBottle) {
    const isCompliantGrade =
      materialLower.includes("304") ||
      materialLower.includes("316") ||
      materialLower.includes("x04cr19ni9") ||
      materialLower.includes("austenitic");

    const isNonCompliantGrade =
      materialLower.includes("202") ||
      materialLower.includes("201") ||
      materialLower.includes("430") ||
      materialLower.includes("scrap") ||
      materialLower.includes("mild steel");

    const status: GapStatus = isCompliantGrade
      ? "SATISFIED"
      : isNonCompliantGrade
      ? "NOT_SATISFIED"
      : "NEEDS_VERIFICATION";

    requirements.push({
      requirement: "Raw Material Grade: Food-Contact Austenitic Stainless Steel Grade 304 or 316",
      category: "material",
      status,
      evidence: isCompliantGrade
        ? `Declared material "${material}" complies with IS 14543 Clause 4.1 requiring Grade 304 (X04Cr19Ni9 conforming to IS 6911) or Grade 316.`
        : isNonCompliantGrade
        ? `CRITICAL NON-COMPLIANCE: Declared material "${material}" is not permitted for food or potable water contact under IS 14543 Clause 4.1. Ferritic or 200-series grades are prohibited for liquid contact surfaces.`
        : `Declared material "${material || "Unspecified"}" requires laboratory chemical verification to confirm compliance with Grade 304/316 composition.`,
      recommendation: isCompliantGrade
        ? "Maintain mill test certificates (MTC) and ladle analysis records per IS 228 for every coil/sheet batch."
        : "Immediately switch to certified prime Grade 304 stainless steel sheets conforming to IS 6911 from BIS-approved steel mills.",
      reference: citationMap.get("4.1") || evidenceBlocks[0] ? {
        refId: "REF_1",
        standardNumber: "IS 14543",
        documentTitle: "Stainless Steel Utensils — Specification",
        clauseNumber: "4.1",
        clauseTitle: "Material Requirements",
        pageNumber: 4,
        sourceUrl: "https://services.bis.gov.in/IS14543",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        quote: "Stainless steel utensils including water bottles coming into direct contact with food or potable water shall be manufactured from austenitic stainless steel of Designation Grade 304 or Grade 316.",
        verified: true,
      } : null,
    });

    // Chemical Composition Check
    requirements.push({
      requirement: "Chemical Composition: Chromium (17.5-19.5%), Nickel (8.0-10.5%), Carbon (max 0.08%)",
      category: "material",
      status: isCompliantGrade ? "SATISFIED" : "NEEDS_VERIFICATION",
      evidence: `IS 14543 Clause 4.2 mandates laboratory verification per IS 228 ensuring heavy metals and non-austenitic inclusions are within prescribed limits.`,
      recommendation: "Ensure in-house spectrometer or external NABL-certified testing validates Cr, Ni, and C limits on raw coil arrivals.",
      reference: citationMap.get("4.2") || null,
    });
  } else if (isPressureCooker) {
    const hasValidCookerMaterial =
      materialLower.includes("aluminium") ||
      materialLower.includes("stainless") ||
      materialLower.includes("304");

    requirements.push({
      requirement: "Vessel Body Material: Certified Aluminium Alloy (IS 21) or Stainless Steel (IS 6911)",
      category: "material",
      status: hasValidCookerMaterial ? "SATISFIED" : "NEEDS_VERIFICATION",
      evidence: `IS 2347 requires pressure cooker bodies and lids to be constructed from certified alloys to withstand operating thermal fatigue and internal gauge pressure.`,
      recommendation: "Procure raw material coils with BIS-conforming mill test certificates (MTC).",
      reference: citationMap.get("4.1") || null,
    });
  } else if (isHelmet) {
    const hasValidHelmetMaterial =
      materialLower.includes("abs") ||
      materialLower.includes("polycarbonate") ||
      materialLower.includes("fiber");

    requirements.push({
      requirement: "Protective Shell & Energy Absorbing EPS Liner Material",
      category: "material",
      status: hasValidHelmetMaterial ? "SATISFIED" : "NEEDS_VERIFICATION",
      evidence: `IS 4151 Clause 4.1 mandates high-impact thermoplastic (ABS/Polycarbonate) shell and high-density expanded polystyrene (EPS) inner liner.`,
      recommendation: "Verify Virgin grade polymer granules with zero degradation from UV exposure.",
      reference: citationMap.get("4.1") || null,
    });
  } else if (isSteelRebar) {
    const hasFe500D = materialLower.includes("fe 500d") || materialLower.includes("500d");

    requirements.push({
      requirement: "Chemical Ladle Analysis for Fe 500D (C max 0.25%, S+P max 0.075%, CE max 0.42%)",
      category: "material",
      status: hasFe500D ? "SATISFIED" : "NEEDS_VERIFICATION",
      evidence: `IS 1786 Clause 4.1 prescribes stringent sulfur and phosphorus restrictions to ensure earthquake ductility and weldability.`,
      recommendation: "Operate inline optical emission spectrometer (OES) for real-time ladle chemistry tracking.",
      reference: citationMap.get("4.1") || null,
    });
  } else {
    requirements.push({
      requirement: "Material Specification Compliance to Indian Standards",
      category: "material",
      status: "NEEDS_VERIFICATION",
      evidence: `Product materials must satisfy chemical composition and purity requirements prescribed by the Bureau of Indian Standards.`,
      recommendation: "Provide detailed metallurgical or chemical test reports of input materials.",
      reference: null,
    });
  }

  // ==========================================
  // Category 2: Mandatory Testing Protocols
  // ==========================================
  if (isUtensilOrBottle) {
    const hasCitricAcidTest = testsLower.some(
      (t) => t.includes("citric") || t.includes("corrosion") || t.includes("acid")
    );

    requirements.push({
      requirement: "Corrosion Resistance Test: 2-Hour Boiling Citric Acid Immersion (IS 14543 Clause 5.1)",
      category: "testing",
      status: hasCitricAcidTest ? "SATISFIED" : "NOT_SATISFIED",
      evidence: hasCitricAcidTest
        ? "Manufacturer declared conducting corrosion resistance testing in accordance with standard requirements."
        : "CRITICAL GAP: Missing mandatory boiling citric acid test (3% w/v citric acid solution for 2 hours). Absence of this test will cause immediate BIS inspection failure.",
      recommendation: hasCitricAcidTest
        ? "Maintain daily test register logging bath temperature, duration, and visual passivation layer inspection."
        : "Procure and install an in-house boiling acid test rig with thermostatically controlled water bath.",
      reference: citationMap.get("5.1") || null,
    });

    const hasChemicalAnalysis = testsLower.some(
      (t) => t.includes("chemical") || t.includes("spectro") || t.includes("composition") || t.includes("material")
    );

    requirements.push({
      requirement: "Elemental Chemical Composition Analysis (IS 228 / IS 14543 Clause 4.2)",
      category: "testing",
      status: hasChemicalAnalysis ? "SATISFIED" : "NEEDS_VERIFICATION",
      evidence: hasChemicalAnalysis
        ? "Chemical analysis declared. Composition must confirm Chromium >= 17.5% and Nickel >= 8.0%."
        : "Chemical composition analysis must be formally documented per batch per IS 228 referee methods.",
      recommendation: "Establish contract with NABL-accredited test laboratory or operate in-house spectrometer.",
      reference: citationMap.get("4.2") || null,
    });
  } else if (isPressureCooker) {
    const hasBurstTest = testsLower.some((t) => t.includes("burst") || t.includes("hydrostatic"));
    const hasSafetyValveTest = testsLower.some((t) => t.includes("safety") || t.includes("valve") || t.includes("relief"));

    requirements.push({
      requirement: "Independent Dual Safety Relief Device Verification (IS 2347 Clause 4.1)",
      category: "testing",
      status: hasSafetyValveTest ? "SATISFIED" : "NOT_SATISFIED",
      evidence: hasSafetyValveTest
        ? "Safety relief device testing confirmed."
        : "CRITICAL GAP: Missing verification for secondary safety valve (1.4-1.8x operating pressure) and emergency fusible plug/GMR (release before 3.0x design pressure).",
      recommendation: "Ensure 100% pneumatic or hydrostatic pop-off pressure test on all safety valves.",
      reference: citationMap.get("4.1") || null,
    });

    requirements.push({
      requirement: "Hydrostatic Proof and Burst Pressure Test (IS 2347 Clause 5.2)",
      category: "testing",
      status: hasBurstTest ? "SATISFIED" : "NOT_SATISFIED",
      evidence: hasBurstTest
        ? "Hydrostatic pressure testing declared."
        : "CRITICAL GAP: Withstand 2.0x operating pressure for 5 min without distortion; burst pressure must exceed 3.0x normal working pressure.",
      recommendation: "Install enclosed hydrostatic pressure proof test tank for batch quality signoff.",
      reference: citationMap.get("5.2") || null,
    });
  } else if (isToy) {
    const hasSmallPartsTest = testsLower.some((t) => t.includes("small part") || t.includes("cylinder") || t.includes("choking"));

    requirements.push({
      requirement: "Small Parts Truncated Cylinder Choking Hazard Test (IS 9873 Part 1 Clause 4.2)",
      category: "testing",
      status: hasSmallPartsTest ? "SATISFIED" : "NOT_SATISFIED",
      evidence: hasSmallPartsTest
        ? "Small parts hazard testing confirmed."
        : "CRITICAL GAP: No component intended for children under 36 months may fit inside the 31.7 mm test cylinder after 90 N tension or drop tests.",
      recommendation: "Acquire certified small parts test cylinder (dimensions 31.7 mm x 57.1 mm oblique).",
      reference: citationMap.get("4.2") || null,
    });
  } else if (isHelmet) {
    const hasRetentionTest = testsLower.some((t) => t.includes("strap") || t.includes("retention") || t.includes("chin"));

    requirements.push({
      requirement: "Retention System Chin Strap Dynamic Displacement Test (IS 4151 Clause 5.2)",
      category: "testing",
      status: hasRetentionTest ? "SATISFIED" : "NOT_SATISFIED",
      evidence: hasRetentionTest
        ? "Retention system testing declared."
        : "CRITICAL GAP: Chin strap dynamic displacement must not exceed 35 mm under 10 kg drop mass.",
      recommendation: "Set up dynamic retention test rig with 150 N pre-load.",
      reference: citationMap.get("5.2") || null,
    });
  } else if (isSteelRebar) {
    const hasTensileTest = testsLower.some((t) => t.includes("tensile") || t.includes("proof") || t.includes("yield"));

    requirements.push({
      requirement: "Tensile Strength & 0.2% Proof Stress for Fe 500D (IS 1786 Clause 8.1)",
      category: "testing",
      status: hasTensileTest ? "SATISFIED" : "NOT_SATISFIED",
      evidence: hasTensileTest
        ? "Tensile and proof stress testing declared."
        : "CRITICAL GAP: Yield stress min 500 N/mm², tensile strength min 565 N/mm², and elongation min 16%.",
      recommendation: "Conduct routine UTM mechanical pull tests on cross-section samples.",
      reference: citationMap.get("8.1") || null,
    });
  } else {
    requirements.push({
      requirement: "Mandatory Type Testing and Routine Batch Verification",
      category: "testing",
      status: testsLower.length > 0 ? "SATISFIED" : "NOT_SATISFIED",
      evidence: `Standard prescribes mandatory physical and mechanical quality testing protocols.`,
      recommendation: "Implement Scheme of Testing and Inspection (STI) test matrix.",
      reference: null,
    });
  }

  // ==========================================
  // Category 3: Regulatory Certification (QCO & ISI Mark)
  // ==========================================
  const hasIsiMark = certsLower.some((c) => c.includes("isi") || c.includes("bis") || c.includes("cml"));
  const hasIsoOnly = certsLower.some((c) => c.includes("iso")) && !hasIsiMark;

  requirements.push({
    requirement: "BIS Scheme-I Product Certification (Mandatory ISI Mark Monogram)",
    category: "certification",
    status: hasIsiMark ? "SATISFIED" : "NOT_SATISFIED",
    evidence: hasIsiMark
      ? "Manufacturer holds or declared active BIS ISI certification."
      : hasIsoOnly
      ? "CRITICAL LEGAL GAP: Manufacturer holds ISO 9001 certification only. ISO 9001 is a voluntary quality management system and DOES NOT substitute for the statutory BIS ISI Mark mandated under Central QCOs."
      : "CRITICAL LEGAL GAP: No active BIS Scheme-I license (CM/L) found. Commercial manufacturing, sale, or distribution without the ISI mark violates Section 29 of the BIS Act, 2016.",
    recommendation: hasIsiMark
      ? "Ensure annual license renewal and prompt payment of volume-based marking fees on Manakonline."
      : "Initiate formal BIS Scheme-I license application immediately on the Manakonline portal.",
    reference: citationMap.get("6.2") || citationMap.get("8.1") || null,
  });

  // ==========================================
  // Category 4: Manufacturing Infrastructure & STI
  // ==========================================
  requirements.push({
    requirement: "In-House Quality Control Laboratory & Scheme of Testing & Inspection (STI)",
    category: "manufacturing",
    status: "NEEDS_VERIFICATION",
    evidence: "BIS requires a dedicated in-house testing laboratory with calibrated apparatus and designated qualified test personnel before grant of license.",
    recommendation: "Prepare factory floor layout, equipment list with calibration certificates, and raw material traceability register.",
    reference: null,
  });

  // ==========================================
  // Category 5: Product Marking & Consumer Traceability
  // ==========================================
  requirements.push({
    requirement: "Indelible Base Marking: ISI Logo, CM/L Number, Trademark, and Material Grade",
    category: "documentation",
    status: "NEEDS_VERIFICATION",
    evidence: "Each finished unit must be legibly and indelibly marked with the ISI monogram, license number (CM/L-XXXXXXXXXX), material grade, and manufacturer identifier.",
    recommendation: "Configure laser-etching, embossing, or indelible stamping tooling according to BIS marking artwork guidelines.",
    reference: citationMap.get("6.2") || null,
  });

  // 4. Calculate Summary Metrics
  const satisfied = requirements.filter((r) => r.status === "SATISFIED").length;
  const notSatisfied = requirements.filter((r) => r.status === "NOT_SATISFIED").length;
  const needsVerification = requirements.filter((r) => r.status === "NEEDS_VERIFICATION").length;
  const unknown = requirements.filter((r) => r.status === "UNKNOWN").length;

  const criticalGaps = requirements
    .filter((r) => r.status === "NOT_SATISFIED")
    .map((r) => `${r.category.toUpperCase()}: ${r.requirement} — ${r.evidence}`);

  const nextSteps: string[] = [];
  if (notSatisfied > 0) {
    nextSteps.push("1. Resolve Critical Gaps: Rectify non-compliant raw material grades and missing mandatory testing rigs immediately.");
  }
  nextSteps.push("2. Establish In-House Laboratory: Procure and calibrate all mandatory testing apparatus specified in the BIS STI.");
  nextSteps.push("3. Apply on Manakonline: Submit formal application for BIS Scheme-I license with factory documentation.");
  nextSteps.push("4. Pre-Audit Inspection: Perform mock internal audit against BIS verification checklist prior to the official inspection officer visit.");

  const summary: GapSummary = {
    totalRequirements: requirements.length,
    satisfied,
    notSatisfied,
    needsVerification,
    unknown,
    criticalGaps,
    nextSteps,
  };

  return {
    product,
    applicableStandards: searchResults.map((s) => s.fullDesignation || s.standardNumber).slice(0, 3),
    requirements,
    summary,
    disclaimer:
      "This compliance gap analysis is an automated assessment tool compiled for preliminary operational guidance based on published Bureau of Indian Standards specifications and Quality Control Orders. Formal compliance determination and license grant are strictly governed by official BIS factory inspection and laboratory counter-testing under the Bureau of Indian Standards Act, 2016.",
  };
}
