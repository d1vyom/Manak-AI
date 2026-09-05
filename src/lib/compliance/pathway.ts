// src/lib/compliance/pathway.ts
import { extractEntities } from "../llm/entity-extraction";
import { searchStandards } from "../db/queries";
import { assembleEvidenceBlocks } from "../rag/evidence";
import { calculateConfidence } from "../rag/confidence";
import { validateAndExtractCitations } from "../rag/citations";
import { CompliancePathway, ComplianceStep } from "@/types/compliance";
import { MandatoryStatus } from "@/types/rag";
import { SEED_DOCUMENTS, SEED_QCOS } from "../data/seed-data";
import { STANDARDS_KNOWLEDGE_GRAPH } from "../data/standards-graph";
import { generateStructuredJson } from "../llm/gemini";

/**
 * Standard templates for BIS Scheme-I 7-step certification pathways
 */
const CANONICAL_PATHWAYS: Record<
  string,
  {
    productName: string;
    standardNumber: string;
    qcoNumber: string;
    qcoTitle: string;
    effectiveDate: string;
    timeline: string;
    materialReqs: string[];
    testingReqs: string[];
    inHouseQcReqs: string[];
  }
> = {
  "IS 14543": {
    productName: "Stainless Steel Utensils & Domestic Water Bottles",
    standardNumber: "IS 14543:2016",
    qcoNumber: "S.O. 3922(E)",
    qcoTitle: "Stainless Steel and Aluminium Utensils (Quality Control) Order, 2023",
    effectiveDate: "2024-03-01",
    timeline: "3 to 5 months",
    materialReqs: [
      "Manufactured strictly from austenitic stainless steel of Designation Grade 304 (equivalent to X04Cr19Ni9 per IS 6911) or Grade 316 for food/water contact surfaces.",
      "Ferritic stainless steel (Grade 430) permitted only for non-food contact outer cladding.",
      "Chemical composition verification per IS 228: Chromium 17.5-19.5%, Nickel 8.0-10.5%, Carbon 0.08% max.",
      "Re-melted scrap or uncertified stainless steel alloys are strictly prohibited.",
    ],
    testingReqs: [
      "Boiling Citric Acid Corrosion Resistance Test (IS 14543 Clause 5.1): Immersion in boiling 3% citric acid solution for 2 hours with no pitting or etching.",
      "Chemical Composition Analysis (Clause 4.2 / IS 228): Spectrometric or wet analysis of elemental percentages.",
      "Dimensional & Capacity Verification (Clause 5.3): Nominal volume tolerance checking.",
      "Workmanship and Finish Inspection: Smooth, burr-free surfaces without crevices.",
    ],
    inHouseQcReqs: [
      "In-house testing facility equipped with citric acid test setup, precision balance, and dimensional measurement gauges.",
      "Traceability system matching raw material coil/sheet heat numbers with manufactured batches.",
      "Routine sampling and inspection plan per BIS Scheme of Testing and Inspection (STI).",
    ],
  },
  "IS 2347": {
    productName: "Domestic Pressure Cookers",
    standardNumber: "IS 2347:2017",
    qcoNumber: "S.O. 343(E)",
    qcoTitle: "Domestic Pressure Cookers (Quality Control) Order, 2020",
    effectiveDate: "2020-08-01",
    timeline: "3 to 6 months",
    materialReqs: [
      "Cooker body and lid fabricated from certified aluminium alloy (IS 21) or austenitic stainless steel (IS 6911).",
      "Sealing gasket complying with IS 7466 food-grade synthetic or natural rubber specifications.",
      "Handles composed of flame-resistant, insulating phenolic moulding materials.",
    ],
    testingReqs: [
      "Operating Pressure Test: Primary weight valve regulation between 0.5 to 1.1 bar.",
      "Safety Relief Valve Test (Clause 4.1): Secondary release opening at 1.4 to 1.8 times normal working pressure (maximum 2.0 bar).",
      "Gasket Release Mechanism (GMR) / Fusible Plug Test: Emergency release before internal pressure exceeds 3.0 times design pressure.",
      "Hydrostatic Proof Pressure Test (Clause 5.2): Withstand 2.0 times operating pressure for 5 minutes without distortion.",
      "Hydrostatic Burst Pressure Test (Clause 5.2): Must not rupture below 3.0 times declared working pressure.",
    ],
    inHouseQcReqs: [
      "Calibrated hydrostatic pressure test bench with certified gauges.",
      "Safety valve pressure opening verification test rig.",
      "100% hydrostatic proof testing for each produced cooker vessel prior to dispatch.",
    ],
  },
  "IS 9873": {
    productName: "Toys (Mechanical & Physical Properties)",
    standardNumber: "IS 9873 (Part 1):2019",
    qcoNumber: "S.O. 853(E)",
    qcoTitle: "Toys (Quality Control) Order, 2020",
    effectiveDate: "2021-01-01",
    timeline: "3 to 6 months",
    materialReqs: [
      "Virgin, non-toxic polymeric materials or clean wood/metal free from hazardous chemical additives.",
      "Strict restriction on migration of heavy metals (Lead, Cadmium, Arsenic, Mercury) under IS 9873 (Part 3).",
      "Non-flammable or flame-retardant textiles complying with IS 9873 (Part 2).",
    ],
    testingReqs: [
      "Small Parts Cylinder Test (Clause 4.2): No detachable component for children under 36 months shall fit inside the 31.7 mm truncated test cylinder.",
      "Sharp Edges and Points Test (Clause 4.3): Testing accessible edges with sharp edge tester per Clause 8.11.",
      "Abuse Testing: Drop test, torque test (0.45 Nm), and tension test (90 N) to verify no hazardous small parts are released.",
    ],
    inHouseQcReqs: [
      "Small parts truncated oblique cylinder test apparatus.",
      "Sharp edge and sharp point electronic test meters.",
      "Drop test platform and calibrated force gauges.",
    ],
  },
  "IS 4151": {
    productName: "Protective Helmets for Two-Wheeler Motor Vehicle Riders",
    standardNumber: "IS 4151:2015",
    qcoNumber: "S.O. 4252(E)",
    qcoTitle: "Helmets for riders of Two Wheeler Motor Vehicles (Quality Control) Order, 2020",
    effectiveDate: "2021-06-01",
    timeline: "4 to 6 months",
    materialReqs: [
      "Outer shell: High-impact injection moulded ABS, Polycarbonate, or fiber reinforced resin.",
      "Protective padding: High-density expanded polystyrene (EPS) energy absorbing liner.",
      "Retention system: High-tensile polyester/nylon webbing with secure quick-release or double D-ring fastener.",
    ],
    testingReqs: [
      "Impact Absorption Test: Free-fall drop test on flat and hemispherical steel anvils recording peak headform acceleration (max 300 g).",
      "Retention System Strength & Displacement Test (Clause 5.2): Chin strap width min 20 mm under 150 N load; dynamic displacement not exceeding 35 mm under 10 kg falling mass.",
      "Rigidity and Penetration Resistance Tests: Resistance to conical striker penetration.",
      "Visor Optical and Shatterproof Tests: Conformity to IS 7692.",
    ],
    inHouseQcReqs: [
      "Guided fall impact attenuation drop tower with calibrated accelerometer and triaxial headform.",
      "Dynamic retention system test rig.",
      "Conditioning chambers for ambient, heat (+50°C), cold (-10°C), and water immersion conditioning.",
    ],
  },
  "IS 1786": {
    productName: "High Strength Deformed Steel Bars (TMT Rebar)",
    standardNumber: "IS 1786:2008",
    qcoNumber: "S.O. 1546(E)",
    qcoTitle: "Steel and Steel Products (Quality Control) Order, 2020",
    effectiveDate: "2020-11-18",
    timeline: "3 to 6 months",
    materialReqs: [
      "Ladle analysis chemical limits for Fe 500D (Clause 4.1): Carbon max 0.25%, Sulfur max 0.040%, Phosphorus max 0.040%, S+P max 0.075%.",
      "Carbon equivalent (CE) max 0.42% for earthquake-resistant ductile grades.",
    ],
    testingReqs: [
      "Tensile & Proof Stress Testing (Clause 8.1): 0.2% proof stress min 500.0 N/mm²; Tensile strength min 565.0 N/mm² (TS/YS ratio min 1.10).",
      "Elongation Test: Min 16.0% elongation at gauge length 5.65√A; Total elongation at max force (TS/YS) min 5.0%.",
      "Bend and Rebend Tests: 180° cold bend without fracture or transverse cracks.",
    ],
    inHouseQcReqs: [
      "Universal Testing Machine (UTM) with computer data acquisition system.",
      "Optical Emission Spectrometer (OES) for fast heat ladle analysis.",
      "Mandrel bending machine.",
    ],
  },
  "IS 10500": {
    productName: "Drinking Water Supply & Treatment",
    standardNumber: "IS 10500:2012",
    qcoNumber: "Municipal Public Health Standard",
    qcoTitle: "National Drinking Water Quality Guidelines",
    effectiveDate: "2012-06-01",
    timeline: "2 to 4 months",
    materialReqs: [
      "Physical and organoleptic limits: pH 6.5 to 8.5, Turbidity max 1.0 NTU (acceptable) / 5.0 NTU (permissible), TDS max 500 mg/l (acceptable) / 2000 mg/l (permissible).",
      "Toxic substance limits (Table 2): Lead max 0.01 mg/l, Arsenic max 0.01 mg/l, Cadmium max 0.003 mg/l, Mercury max 0.001 mg/l, Chromium max 0.05 mg/l.",
    ],
    testingReqs: [
      "Daily bacteriological testing (Total Coliform and E. coli absent in 100 ml).",
      "Physical & chemical analysis per IS 3025.",
      "Pesticide residue quantification via Gas Chromatography / Mass Spectrometry.",
    ],
    inHouseQcReqs: [
      "Dedicated microbiology testing laboratory with autoclave, incubator, and laminar flow hood.",
      "Spectrophotometer and digital pH/turbidity/conductivity meters.",
      "Sampling bottles and chain-of-custody protocols.",
    ],
  },
  "IS 456": {
    productName: "Plain and Reinforced Concrete",
    standardNumber: "IS 456:2000",
    qcoNumber: "National Building Code Reference",
    qcoTitle: "Indian Standard Code of Practice for Structural Concrete",
    effectiveDate: "2000-10-01",
    timeline: "Ongoing Structural Quality Control",
    materialReqs: [
      "Cement conforming to IS 269 (OPC 33), IS 8112 (OPC 43), IS 12269 (OPC 53), or IS 455.",
      "Water conforming to IS 10500.",
      "Table 5 durability limits: Severe exposure reinforced concrete requires min cement 320 kg/m³ and max free W/C ratio 0.45.",
    ],
    testingReqs: [
      "Compressive strength testing of concrete cubes at 7 days and 28 days per IS 516.",
      "Slump cone workability testing per IS 1199.",
      "Aggregate gradation and silt content testing per IS 383.",
    ],
    inHouseQcReqs: [
      "Compression Testing Machine (CTM) with valid calibration certificate.",
      "Cube moulds (150x150x150 mm) and vibrating table.",
      "Slump cone and tamping rod.",
    ],
  },
};

/**
 * Generates a structured 7-step compliance certification pathway for a product query.
 */
export async function generateCompliancePathway(
  query: string,
  language: "en" | "hi" = "en"
): Promise<CompliancePathway> {
  // 1. Extract entities from query
  const entities = await extractEntities(query);

  // 2. Retrieve relevant standards and evidence
  const retrievalResults = await searchStandards({
    queryText: `${query} ${entities.keywords.join(" ")}`,
    filterStandard: entities.standardNumber,
    matchCount: 8,
  });

  const evidenceBlocks = assembleEvidenceBlocks(retrievalResults);
  const confidence = calculateConfidence(retrievalResults, entities.standardNumber);

  // 3. Identify matching standard key
  let matchedKey = "";
  if (entities.standardNumber) {
    const cleanStd = entities.standardNumber.toUpperCase();
    for (const key of Object.keys(CANONICAL_PATHWAYS)) {
      if (cleanStd.includes(key)) {
        matchedKey = key;
        break;
      }
    }
  }

  if (!matchedKey && retrievalResults.length > 0) {
    for (const res of retrievalResults) {
      const stdNum = res.standardNumber.toUpperCase();
      for (const key of Object.keys(CANONICAL_PATHWAYS)) {
        if (stdNum.includes(key)) {
          matchedKey = key;
          break;
        }
      }
      if (matchedKey) break;
    }
  }

  // Fallback to IS 14543 if query is about water bottles/utensils
  if (!matchedKey) {
    const qLower = query.toLowerCase();
    if (qLower.includes("bottle") || qLower.includes("utensil") || qLower.includes("steel")) {
      matchedKey = "IS 14543";
    } else if (qLower.includes("cooker") || qLower.includes("pressure")) {
      matchedKey = "IS 2347";
    } else if (qLower.includes("toy") || qLower.includes("child")) {
      matchedKey = "IS 9873";
    } else if (qLower.includes("helmet") || qLower.includes("two wheeler")) {
      matchedKey = "IS 4151";
    } else if (qLower.includes("rebar") || qLower.includes("tmt") || qLower.includes("iron")) {
      matchedKey = "IS 1786";
    } else if (qLower.includes("water") || qLower.includes("drinking")) {
      matchedKey = "IS 10500";
    } else if (qLower.includes("concrete") || qLower.includes("cement")) {
      matchedKey = "IS 456";
    } else {
      matchedKey = "IS 14543"; // Default demo product
    }
  }

  const template = CANONICAL_PATHWAYS[matchedKey] || CANONICAL_PATHWAYS["IS 14543"];
  const doc = SEED_DOCUMENTS.find((d) => d.standardNumber === matchedKey);
  const qco = SEED_QCOS.find((q) => q.standardNumber === matchedKey);

  const isMandatory = doc ? doc.isMandatory : true;
  const overallStatus: MandatoryStatus = isMandatory ? "mandatory" : "voluntary";

  // Build citations from evidence blocks
  const mockResponseText = evidenceBlocks.map((b) => `[${b.refId}]`).join(" ");
  const citationResult = validateAndExtractCitations(
    mockResponseText,
    evidenceBlocks,
    confidence,
    query,
    language
  );
  const citations = citationResult.validCitations;

  // Build the 7 structured steps
  const steps: ComplianceStep[] = [
    {
      stepNumber: 1,
      title: language === "hi" ? "लागू भारतीय मानक की पहचान" : "Identify Applicable Indian Standards",
      description:
        language === "hi"
          ? `आपके उत्पाद के लिए मुख्य मानक ${template.standardNumber} (${template.productName}) लागू होता है।`
          : `Primary standard ${template.standardNumber} (${template.productName}) applies directly to your product.`,
      status: overallStatus,
      details: [
        `Primary Standard: ${template.standardNumber}`,
        doc?.scopeSummary || `Specifies requirements, sampling methods, and tests for ${template.productName}.`,
        ...(STANDARDS_KNOWLEDGE_GRAPH[matchedKey]
          ? STANDARDS_KNOWLEDGE_GRAPH[matchedKey].map(
              (rel) => `Companion Standard: ${rel.standardNumber} — ${rel.title} (${rel.relationship})`
            )
          : []),
      ],
      references: citations.slice(0, 1),
    },
    {
      stepNumber: 2,
      title: language === "hi" ? "विनियामक स्थिति और QCO अधिदेश" : "Regulatory Status & Mandatory QCO Mandate",
      description:
        overallStatus === "mandatory"
          ? language === "hi"
            ? `गुणवत्ता नियंत्रण आदेश (QCO) के तहत ISI मार्क अनिवार्य है। बिना प्रमाणन के बिक्री या आयात गैरकानूनी है।`
            : `Mandatory compliance enforced under Central Government Quality Control Order. Uncertified manufacture or sale is illegal.`
          : language === "hi"
            ? `यह मानक स्वैच्छिक है, लेकिन सार्वजनिक निविदाओं और उपभोक्ता विश्वास के लिए अनुशंसित है।`
            : `Voluntary compliance standard. Recommended for public procurement and consumer quality assurance.`,
      status: overallStatus,
      details: [
        `Legal Mandate Status: ${overallStatus.toUpperCase()}`,
        qco
          ? `Order Notification: ${qco.qcoNumber} (${qco.qcoTitle}), gazetted on ${qco.gazetteDate}, effective from ${qco.effectiveDate}.`
          : `Regulatory Reference: ${template.qcoNumber} — ${template.qcoTitle}`,
        `Applicable BIS Scheme: Scheme-I (Product Certification - ISI Mark Monogram)`,
        overallStatus === "mandatory"
          ? "Offence under Section 29 of BIS Act, 2016: Penalties include fines, imprisonment, or seizure of uncertified goods."
          : "Voluntary adoption provides competitive advantage and eligibility for government procurement.",
      ],
      references: citations.slice(0, 2),
    },
    {
      stepNumber: 3,
      title: language === "hi" ? "कच्चे माल और डिजाइन विनिर्देश" : "Raw Material & Design Compliance",
      description:
        language === "hi"
          ? `उत्पाद निर्माण के लिए केवल प्रमाणित और अनुमत ग्रेड का ही उपयोग किया जाना चाहिए।`
          : `Manufacture must utilize only certified raw materials meeting chemical tolerances specified in the standard.`,
      status: "mandatory",
      details: template.materialReqs,
      references: citations.slice(0, 2),
    },
    {
      stepNumber: 4,
      title: language === "hi" ? "अनिवार्य प्रयोगशाला परीक्षण प्रोटोकॉल" : "Mandatory Laboratory Testing Protocols",
      description:
        language === "hi"
          ? `उत्पाद को मानक में निर्धारित सभी प्रकार (Type) और नियमित (Routine) परीक्षण पास करने होंगे।`
          : `Product must satisfy all type tests, acceptance tests, and routine quality verification protocols.`,
      status: "mandatory",
      details: template.testingReqs,
      references: citations.slice(1, 3),
    },
    {
      stepNumber: 5,
      title: language === "hi" ? "फैक्टरी अवसंरचना और इन-हाउस QC (STI)" : "Manufacturing Infrastructure & In-House QC (STI)",
      description:
        language === "hi"
          ? `BIS परीक्षण और निरीक्षण योजना (STI) के अनुसार इन-हाउस परीक्षण प्रयोगशाला स्थापित करें।`
          : `Establish dedicated in-house testing laboratory and adhere to BIS Scheme of Testing and Inspection (STI).`,
      status: "mandatory",
      details: [
        ...template.inHouseQcReqs,
        "Maintain calibration records from NABL-accredited calibration laboratories for all test gauges.",
        "Designate competent technical personnel for quality control and lot-by-lot release signoff.",
      ],
      references: citations.slice(0, 1),
    },
    {
      stepNumber: 6,
      title: language === "hi" ? "BIS पोर्टल आवेदन प्रक्रिया (Scheme-I)" : "BIS Portal Application Process (Scheme-I)",
      description:
        language === "hi"
          ? `आधिकारिक Manakonline पोर्टल के माध्यम से ISI मार्क प्रमाणन के लिए ऑनलाइन आवेदन जमा करें।`
          : `Submit formal online application for grant of ISI Mark license via the official Manakonline e-portal.`,
      status: "mandatory",
      details: [
        "Step 6.1: Register manufacturing premises on Manakonline (manakonline.in) under Product Certification Scheme-I.",
        "Step 6.2: Upload documentation: Factory layout, machinery list, in-house testing equipment, calibration certificates, and raw material supplier test certificates (MTC).",
        "Step 6.3: Remit prescribed application fee and inspection charges.",
        "Step 6.4: Factory Inspection: BIS Inspecting Officer visits factory to audit manufacturing process, verify testing facilities, and draw independent counter-samples.",
        "Step 6.5: Sample Testing: Counter-samples tested at BIS Central Laboratory or empaneled NABL lab.",
      ],
      references: [],
    },
    {
      stepNumber: 7,
      title: language === "hi" ? "लाइसेंस प्राप्ति, अंकन और निरंतर अनुपालन" : "Grant of License, Marking & Ongoing Compliance",
      description:
        language === "hi"
          ? `CM/L लाइसेंस नंबर प्राप्त होने पर उत्पाद पर अनिवार्य ISI मार्क अंकित करें और निगरानी का पालन करें।`
          : `Upon license grant, indelibly stamp the ISI Mark with CM/L number and maintain periodic surveillance compliance.`,
      status: "mandatory",
      details: [
        "Step 7.1: Receive Certificate of Manufacturing License (CM/L) with unique 7 or 8-digit identifier.",
        "Step 7.2: Stamping Format: Legibly stamp or laser-etch the base with: (a) Manufacturer trademark, (b) Grade/model, (c) ISI Mark logo, and (d) 'CM/L-XXXXXXXXXX'.",
        "Step 7.3: Pay annual marking fees based on production volume declared on the BIS portal.",
        "Step 7.4: Surveillance Audits: Accommodate periodic unannounced BIS market surveillance sample purchases and annual license renewal.",
      ],
      references: citations.slice(0, 1),
    },
  ];

  return {
    product: template.productName,
    applicableStandards: [
      {
        standardNumber: template.standardNumber,
        title: doc?.title || template.productName,
        mandatoryStatus: overallStatus,
        qcoReference: template.qcoNumber,
      },
    ],
    overallStatus,
    qcoDetails: qco
      ? {
          qcoNumber: qco.qcoNumber,
          title: qco.qcoTitle,
          effectiveDate: qco.effectiveDate,
          sourceUrl: qco.sourceUrl,
        }
      : undefined,
    steps,
    estimatedTimeline: template.timeline,
    disclaimer:
      "This compliance pathway is compiled for preliminary guidance and operational planning based on official Indian Standards and gazetted Quality Control Orders. Formal grant of license is governed exclusively by the Bureau of Indian Standards (BIS) under Scheme-I of the BIS (Conformity Assessment) Regulations, 2018.",
  };
}
