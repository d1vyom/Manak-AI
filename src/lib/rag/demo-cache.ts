// src/lib/rag/demo-cache.ts
import { ConfidenceResult, ExtractedEntities, EvidenceBlock, MandatoryStatus } from "@/types/rag";
import { Citation } from "@/types/citations";
import { CompliancePathway } from "@/types/compliance";

export interface DemoCachedResponse {
  id: string;
  category: "manufacturer" | "consumer" | "hindi" | "abstention";
  triggerPatterns: string[];
  language: "en" | "hi";
  mandatoryStatus: MandatoryStatus;
  qcoReference?: string;
  confidence: ConfidenceResult;
  entities: ExtractedEntities;
  evidenceBlocks: EvidenceBlock[];
  citations: Citation[];
  content: string;
  pathway?: CompliancePathway;
}

export const DEMO_CACHE: DemoCachedResponse[] = [
  // Demo 1: Manufacturer Query (Stainless Steel Water Bottles)
  {
    id: "demo-manufacturer-water-bottle",
    category: "manufacturer",
    triggerPatterns: [
      "stainless steel water bottle",
      "water bottle",
      "water bottles",
      "stainless steel bottle",
      "steel bottle",
    ],
    language: "en",
    mandatoryStatus: "mandatory",
    qcoReference: "DPIIT QCO S.O. 1234(E)",
    confidence: {
      score: 0.92,
      level: "HIGH",
      signals: {
        topSimilarity: 0.94,
        hybridConsensus: 0.91,
        metadataMatch: 0.92,
        scoreMargin: 0.22,
      },
      explanation:
        "High authoritative grounding verified. Retrieved 4 exact normative clauses from IS 14543:2016 and DPIIT Gazette Quality Control Order mandates.",
    },
    entities: {
      product: "Stainless Steel Water Bottle",
      standardNumber: "IS 14543:2016",
      material: "Stainless Steel Grade 304/316",
      intent: "find_standards",
      keywords: ["stainless steel", "water bottle", "vacuum flask", "ISI mark", "food grade"],
    },
    evidenceBlocks: [
      {
        refId: "1",
        standardNumber: "IS 14543:2016",
        clauseNumber: "1.1",
        clauseTitle: "Scope and Application",
        pageNumber: 3,
        documentTitle: "Stainless Steel Vacuum Flasks and Insulated Containers",
        documentType: "standard",
        content:
          "This standard prescribes constructional, performance, and testing requirements for stainless steel vacuum flasks, bottles, and insulated beverage containers used for potable liquids.",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        sourceUrl: "/explore",
      },
      {
        refId: "2",
        standardNumber: "IS 14543:2016",
        clauseNumber: "4.1",
        clauseTitle: "Material Specifications",
        pageNumber: 5,
        documentTitle: "Stainless Steel Vacuum Flasks and Insulated Containers",
        documentType: "standard",
        content:
          "The inner container and any component in direct contact with potable liquid shall be manufactured from austenitic stainless steel conforming to Grade 304 or Grade 316 of IS 6911.",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        sourceUrl: "/explore",
      },
      {
        refId: "3",
        standardNumber: "IS 14543:2016",
        clauseNumber: "4.2",
        clauseTitle: "Chemical Composition & Heavy Metal Limits",
        pageNumber: 7,
        documentTitle: "Stainless Steel Vacuum Flasks and Insulated Containers",
        documentType: "standard",
        content:
          "Toxic element migration from inner surfaces shall not exceed permissible thresholds: Lead (Pb) <= 0.01 mg/kg, Cadmium (Cd) <= 0.005 mg/kg, and Chromium (Cr) <= 0.1 mg/kg when tested per IS 9845.",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        sourceUrl: "/explore",
      },
      {
        refId: "4",
        standardNumber: "IS 14543:2016",
        clauseNumber: "6.2",
        clauseTitle: "Marking and Mandatory ISI Certification",
        pageNumber: 12,
        documentTitle: "Stainless Steel Vacuum Flasks and Insulated Containers",
        documentType: "standard",
        content:
          "Each container shall be indelibly marked with manufacturer identification, batch number, capacity, and the Standard Mark (ISI Mark) under Scheme-I of BIS (Conformity Assessment) Regulations, 2018.",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        sourceUrl: "/explore",
      },
    ],
    citations: [
      {
        refId: "1",
        standardNumber: "IS 14543:2016",
        clauseNumber: "1.1",
        clauseTitle: "Scope and Application",
        pageNumber: 3,
        documentTitle: "Stainless Steel Vacuum Flasks and Insulated Containers",
        quote:
          "This standard prescribes constructional, performance, and testing requirements for stainless steel vacuum flasks, bottles, and insulated beverage containers used for potable liquids.",
        sourceUrl: "/explore",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        confidenceScore: 0.95,
        verified: true,
      },
      {
        refId: "2",
        standardNumber: "IS 14543:2016",
        clauseNumber: "4.1",
        clauseTitle: "Material Specifications",
        pageNumber: 5,
        documentTitle: "Stainless Steel Vacuum Flasks and Insulated Containers",
        quote:
          "The inner container and any component in direct contact with potable liquid shall be manufactured from austenitic stainless steel conforming to Grade 304 or Grade 316 of IS 6911.",
        sourceUrl: "/explore",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        confidenceScore: 0.93,
        verified: true,
      },
      {
        refId: "3",
        standardNumber: "IS 14543:2016",
        clauseNumber: "4.2",
        clauseTitle: "Chemical Composition & Heavy Metal Limits",
        pageNumber: 7,
        documentTitle: "Stainless Steel Vacuum Flasks and Insulated Containers",
        quote:
          "Toxic element migration from inner surfaces shall not exceed permissible thresholds: Lead (Pb) <= 0.01 mg/kg, Cadmium (Cd) <= 0.005 mg/kg, and Chromium (Cr) <= 0.1 mg/kg when tested per IS 9845.",
        sourceUrl: "/explore",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        confidenceScore: 0.91,
        verified: true,
      },
      {
        refId: "4",
        standardNumber: "IS 14543:2016",
        clauseNumber: "6.2",
        clauseTitle: "Marking and Mandatory ISI Certification",
        pageNumber: 12,
        documentTitle: "Stainless Steel Vacuum Flasks and Insulated Containers",
        quote:
          "Each container shall be indelibly marked with manufacturer identification, batch number, capacity, and the Standard Mark (ISI Mark) under Scheme-I of BIS (Conformity Assessment) Regulations, 2018.",
        sourceUrl: "/explore",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        confidenceScore: 0.89,
        verified: true,
      },
    ],
    content: `### Mandatory BIS Compliance Requirements for Stainless Steel Water Bottles

For manufacturing and commercial distribution of stainless steel water bottles and insulated flasks in India, compliance is **MANDATORY** under the Ministry of Commerce & Industry (DPIIT) Quality Control Order [1]. Under Section 16 of the BIS Act, 2016, no manufacturer may produce, store, import, or sell non-certified units.

#### 1. Primary Applicable Standard
* **IS 14543:2016**: *Stainless Steel Vacuum Flasks and Insulated Containers* [1].
* **Conformity Scheme**: **Scheme-I (ISI Mark Certification)**.

#### 2. Normative Material & Chemical Specifications
* **Approved Alloys**: The inner vessel and all fluid-contacting parts must be fabricated from food-grade austenitic stainless steel conforming to **Grade 304 (18/8)** or **Grade 316 (18/10)** of **IS 6911** [2].
* **Heavy Metal Migration**: Toxic chemical leaching must conform to **IS 9845** extraction limits [3]:
  * Lead (Pb): $\\le 0.01\\text{ mg/kg}$
  * Cadmium (Cd): $\\le 0.005\\text{ mg/kg}$
  * Chromium (Cr): $\\le 0.1\\text{ mg/kg}$

#### 3. Mandatory Performance & Safety Tests
* **Thermal Insulation Efficiency**: Hot liquid retention test (water $\\ge 60^\\circ\\text{C}$ after 6 hours).
* **Leakage Resistance**: Hydrostatic pressure test at $1.5\\times$ operating threshold.
* **Impact & Drop Test**: 1.2-meter free fall onto reinforced concrete without weld rupture or vacuum loss.
* **Corrosion Resistance**: 24-hour neutral salt spray test per **IS 9844**.

#### 4. Packaging & Mandatory Marking
Each manufactured piece must be permanently embossed or laser-etched with the **ISI Certification Mark**, CM/L license number, capacity rating, and batch traceability code [4].`,
  },

  // Demo 2: Consumer Safety Query (Pressure Cookers)
  {
    id: "demo-consumer-pressure-cooker",
    category: "consumer",
    triggerPatterns: [
      "pressure cooker",
      "verify pressure cooker",
      "buy pressure cooker",
      "pressure cookers",
      "cooker safe",
    ],
    language: "en",
    mandatoryStatus: "mandatory",
    qcoReference: "Consumer Affairs QCO S.O. 2894(E)",
    confidence: {
      score: 0.9,
      level: "HIGH",
      signals: {
        topSimilarity: 0.92,
        hybridConsensus: 0.89,
        metadataMatch: 0.9,
        scoreMargin: 0.2,
      },
      explanation:
        "High confidence verified. Retrieved consumer safety clauses from IS 2347:2017 and Ministry of Consumer Affairs mandatory certification orders.",
    },
    entities: {
      product: "Domestic Pressure Cooker",
      standardNumber: "IS 2347:2017",
      intent: "find_standards",
      keywords: ["pressure cooker", "ISI mark", "safety valve", "burst pressure", "BIS care app"],
    },
    evidenceBlocks: [
      {
        refId: "1",
        standardNumber: "IS 2347:2017",
        clauseNumber: "1.1",
        clauseTitle: "Scope & Classification",
        pageNumber: 2,
        documentTitle: "Domestic Pressure Cookers — Specification",
        documentType: "standard",
        content:
          "This standard specifies safety, design, and performance criteria for domestic pressure cookers made from aluminium alloy or stainless steel with nominal operating capacities up to 10 litres.",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        sourceUrl: "/explore",
      },
      {
        refId: "2",
        standardNumber: "IS 2347:2017",
        clauseNumber: "5.4",
        clauseTitle: "Safety Relief Valve & Fusible Alloy Plug",
        pageNumber: 6,
        documentTitle: "Domestic Pressure Cookers — Specification",
        documentType: "standard",
        content:
          "Every cooker shall be equipped with an independent safety relief valve and fusible safety plug that automatically releases excess pressure between 1.5 and 2.0 times operating pressure if the primary vent weight becomes obstructed.",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        sourceUrl: "/explore",
      },
      {
        refId: "3",
        standardNumber: "IS 2347:2017",
        clauseNumber: "6.1",
        clauseTitle: "Hydrostatic Burst Pressure Test",
        pageNumber: 9,
        documentTitle: "Domestic Pressure Cookers — Specification",
        documentType: "standard",
        content:
          "The cooker body and lid assembly shall safely withstand internal hydrostatic pressure of not less than three times (3x) the nominal working pressure (minimum 300 kPa) without catastrophic rupture or gasket blowout.",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        sourceUrl: "/explore",
      },
      {
        refId: "4",
        standardNumber: "IS 2347:2017",
        clauseNumber: "8.1",
        clauseTitle: "Consumer Safety Verification & Marking",
        pageNumber: 14,
        documentTitle: "Domestic Pressure Cookers — Specification",
        documentType: "standard",
        content:
          "Domestic pressure cookers must carry the official ISI Mark with standard code 'IS 2347' and a 7-digit CM/L license number verifiable via the BIS Care Mobile Application.",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        sourceUrl: "/explore",
      },
    ],
    citations: [
      {
        refId: "1",
        standardNumber: "IS 2347:2017",
        clauseNumber: "1.1",
        clauseTitle: "Scope & Classification",
        pageNumber: 2,
        documentTitle: "Domestic Pressure Cookers — Specification",
        quote:
          "This standard specifies safety, design, and performance criteria for domestic pressure cookers made from aluminium alloy or stainless steel with nominal operating capacities up to 10 litres.",
        sourceUrl: "/explore",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        confidenceScore: 0.94,
        verified: true,
      },
      {
        refId: "2",
        standardNumber: "IS 2347:2017",
        clauseNumber: "5.4",
        clauseTitle: "Safety Relief Valve & Fusible Alloy Plug",
        pageNumber: 6,
        documentTitle: "Domestic Pressure Cookers — Specification",
        quote:
          "Every cooker shall be equipped with an independent safety relief valve and fusible safety plug that automatically releases excess pressure between 1.5 and 2.0 times operating pressure if the primary vent weight becomes obstructed.",
        sourceUrl: "/explore",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        confidenceScore: 0.92,
        verified: true,
      },
      {
        refId: "3",
        standardNumber: "IS 2347:2017",
        clauseNumber: "6.1",
        clauseTitle: "Hydrostatic Burst Pressure Test",
        pageNumber: 9,
        documentTitle: "Domestic Pressure Cookers — Specification",
        quote:
          "The cooker body and lid assembly shall safely withstand internal hydrostatic pressure of not less than three times (3x) the nominal working pressure (minimum 300 kPa) without catastrophic rupture or gasket blowout.",
        sourceUrl: "/explore",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        confidenceScore: 0.89,
        verified: true,
      },
      {
        refId: "4",
        standardNumber: "IS 2347:2017",
        clauseNumber: "8.1",
        clauseTitle: "Consumer Safety Verification & Marking",
        pageNumber: 14,
        documentTitle: "Domestic Pressure Cookers — Specification",
        quote:
          "Domestic pressure cookers must carry the official ISI Mark with standard code 'IS 2347' and a 7-digit CM/L license number verifiable via the BIS Care Mobile Application.",
        sourceUrl: "/explore",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        confidenceScore: 0.87,
        verified: true,
      },
    ],
    content: `### Consumer Guide: How to Verify Genuine BIS Certification on Pressure Cookers

Domestic pressure cookers sold in India are legally mandated to carry the **ISI Mark** under the Domestic Pressure Cookers (Quality Control) Order [1]. Uncertified cookers present severe blast and burn hazards.

#### 1. Applicable Safety Standard
* **IS 2347:2017**: *Domestic Pressure Cookers — Specification* [1].
* **Legal Status**: **MANDATORY**. Selling non-ISI pressure cookers is a punishable statutory offence under Section 29 of the BIS Act, 2016.

#### 2. Key Safety Mechanisms to Check
* **Dual Pressure Relief System**: Ensure the lid possesses both a weighted vent valve and a secondary fusible alloy plug that triggers at $1.5\\times$ to $2.0\\times$ pressure if the main vent gets blocked [2].
* **Hydrostatic Burst Safety**: Compliant models are hydrostatically burst-tested to withstand over $3\\times$ nominal operating pressure ($>300\\text{ kPa}$) without metal fracture [3].

#### 3. How to Verify Authenticity with BIS Care App
1. **Locate the ISI Mark**: Look for the rectangular ISI Mark stamped or etched onto the cooker body or lid base [4].
2. **Find the 7-Digit CM/L Number**: Beneath the standard number **IS 2347**, you must see a valid license code format: \`CM/L-XXXXXXXXX\` [4].
3. **Verify on BIS Care Mobile App**:
   * Open the official government app **BIS Care** (available on iOS and Android).
   * Tap on **"Verify License Details"**.
   * Enter the 7-digit CM/L number.
   * Verify that the manufacturer name, brand, factory address, and validity status show **"OPERATIVE"**.`,
  },

  // Demo 3: Native Bilingual Hindi Query (Toy Safety)
  {
    id: "demo-hindi-toy-safety",
    category: "hindi",
    triggerPatterns: [
      "खिलौने",
      "खिलौनों",
      "toy safety",
      "toys",
      "खिलौना",
      "toy",
    ],
    language: "hi",
    mandatoryStatus: "mandatory",
    qcoReference: "Toys (Quality Control) Order, 2020",
    confidence: {
      score: 0.88,
      level: "HIGH",
      signals: {
        topSimilarity: 0.91,
        hybridConsensus: 0.87,
        metadataMatch: 0.88,
        scoreMargin: 0.18,
      },
      explanation:
        "उच्च प्रामाणिक विश्वसनीयता सत्यापित। IS 9873 (Part 1):2019 और DPIIT खिलौना गुणवत्ता नियंत्रण आदेश 2020 से आधिकारिक खंड प्राप्त किए गए।",
    },
    entities: {
      product: "Toys / खिलौने",
      standardNumber: "IS 9873 (Part 1):2019",
      intent: "find_standards",
      keywords: ["खिलौने", "toy safety", "IS 9873", "DPIIT QCO", "ISI mark"],
    },
    evidenceBlocks: [
      {
        refId: "1",
        standardNumber: "IS 9873 (Part 1):2019",
        clauseNumber: "1.1",
        clauseTitle: "Scope of Safety Requirements for Toys",
        pageNumber: 1,
        documentTitle: "Safety of Toys — Part 1: Mechanical and Physical Properties",
        documentType: "standard",
        content:
          "This standard specifies requirements and test methods for toys intended for use by children under 14 years of age. It applies to all manufactured or imported toys in India.",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        sourceUrl: "/explore",
      },
      {
        refId: "2",
        standardNumber: "IS 9873 (Part 1):2019",
        clauseNumber: "4.4",
        clauseTitle: "Small Parts & Choking Hazard Limits",
        pageNumber: 8,
        documentTitle: "Safety of Toys — Part 1: Mechanical and Physical Properties",
        documentType: "standard",
        content:
          "Toys for children under 36 months shall not fit entirely into the small parts cylinder (diameter 31.7 mm) to prevent ingestion and airway obstruction.",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        sourceUrl: "/explore",
      },
      {
        refId: "3",
        standardNumber: "IS 9873 (Part 1):2019",
        clauseNumber: "4.5",
        clauseTitle: "Sharp Edges and Points",
        pageNumber: 11,
        documentTitle: "Safety of Toys — Part 1: Mechanical and Physical Properties",
        documentType: "standard",
        content:
          "Accessible edges and wire terminations shall not present sharp cutting hazards or puncture risks when tested under designated torque and tension loads.",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        sourceUrl: "/explore",
      },
      {
        refId: "4",
        standardNumber: "IS 9873 (Part 1):2019",
        clauseNumber: "7.1",
        clauseTitle: "Mandatory Quality Control Order & Marking",
        pageNumber: 18,
        documentTitle: "Safety of Toys — Part 1: Mechanical and Physical Properties",
        documentType: "standard",
        content:
          "Under the Toys (Quality Control) Order, 2020, every toy manufactured in or imported into India must bear the ISI Standard Mark under Scheme-I certification.",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        sourceUrl: "/explore",
      },
    ],
    citations: [
      {
        refId: "1",
        standardNumber: "IS 9873 (Part 1):2019",
        clauseNumber: "1.1",
        clauseTitle: "Scope of Safety Requirements for Toys",
        pageNumber: 1,
        documentTitle: "Safety of Toys — Part 1: Mechanical and Physical Properties",
        quote:
          "This standard specifies requirements and test methods for toys intended for use by children under 14 years of age. It applies to all manufactured or imported toys in India.",
        sourceUrl: "/explore",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        confidenceScore: 0.94,
        verified: true,
      },
      {
        refId: "2",
        standardNumber: "IS 9873 (Part 1):2019",
        clauseNumber: "4.4",
        clauseTitle: "Small Parts & Choking Hazard Limits",
        pageNumber: 8,
        documentTitle: "Safety of Toys — Part 1: Mechanical and Physical Properties",
        quote:
          "Toys for children under 36 months shall not fit entirely into the small parts cylinder (diameter 31.7 mm) to prevent ingestion and airway obstruction.",
        sourceUrl: "/explore",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        confidenceScore: 0.92,
        verified: true,
      },
      {
        refId: "3",
        standardNumber: "IS 9873 (Part 1):2019",
        clauseNumber: "4.5",
        clauseTitle: "Sharp Edges and Points",
        pageNumber: 11,
        documentTitle: "Safety of Toys — Part 1: Mechanical and Physical Properties",
        quote:
          "Accessible edges and wire terminations shall not present sharp cutting hazards or puncture risks when tested under designated torque and tension loads.",
        sourceUrl: "/explore",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        confidenceScore: 0.89,
        verified: true,
      },
      {
        refId: "4",
        standardNumber: "IS 9873 (Part 1):2019",
        clauseNumber: "7.1",
        clauseTitle: "Mandatory Quality Control Order & Marking",
        pageNumber: 18,
        documentTitle: "Safety of Toys — Part 1: Mechanical and Physical Properties",
        quote:
          "Under the Toys (Quality Control) Order, 2020, every toy manufactured in or imported into India must bear the ISI Standard Mark under Scheme-I certification.",
        sourceUrl: "/explore",
        mandatoryStatus: "mandatory",
        chunkType: "clause",
        confidenceScore: 0.87,
        verified: true,
      },
    ],
    content: `### खिलौना निर्माण हेतु अनिवार्य बीआईएस (BIS) मानक एवं प्रमाणन दिशानिर्देश

भारत में 14 वर्ष से कम आयु के बच्चों के खिलौनों का निर्माण या आयात करने के लिए **बीआईएस प्रमाणन (ISI मार्क) कानूनी रूप से अनिवार्य (MANDATORY)** है [1]। वाणिज्य एवं उद्योग मंत्रालय (DPIIT) द्वारा जारी **खिलौना (गुणवत्ता नियंत्रण) आदेश, 2020 (Toys QCO)** के तहत बिना ISI मार्क के खिलौने बेचना प्रतिबंधित है [4]।

#### 1. लागू होने वाले मुख्य भारतीय मानक
* **गैर-विद्युत खिलौनों के लिए**: **IS 9873 (Part 1):2019** — *यांत्रिक और भौतिक सुरक्षा गुण* [1]।
* **ज्वलनशीलता सुरक्षा**: **IS 9873 (Part 2):2017** — *ज्वलनशीलता परीक्षण*।
* **विषाक्त तत्व प्रवासन**: **IS 9873 (Part 3):2017** — *भारी धातुओं (सीसा, कैडमियम, पारा) का प्रवासन*।
* **इलेक्ट्रिक खिलौनों के लिए**: **IS 15644:2006** — *इलेक्ट्रिक खिलौनों की सुरक्षा*।

#### 2. महत्वपूर्ण सुरक्षा परीक्षण एवं सीमाएं
* **दम घुटने का खतरा (Choking Hazard)**: 3 वर्ष से कम उम्र के बच्चों के खिलौनों का कोई भी भाग 31.7 मिमी वाले 'स्मॉल पार्ट्स सिलेंडर' में पूरा नहीं समाना चाहिए [2]।
* **नुकीले किनारे और कोने**: खिंचाव और दबाव परीक्षण के बाद कोई भी धारदार किनारा नहीं निकलना चाहिए [3]।

#### 3. प्रमाणन प्रक्रिया (Scheme-I)
1. **मानक पहचान**: खिलौने के प्रकार (प्लास्टिक, लकड़ी, धातु या इलेक्ट्रॉनिक) के अनुसार मानक निर्धारित करें।
2. **NABL / BIS मान्यता प्राप्त प्रयोगशाला में परीक्षण**: नमूना परीक्षण करवाएं।
3. **Manakonline पोर्टल पर आवेदन**: BIS पोर्टल पर फ़ॉर्म-V और शुल्क जमा करें।
4. **फैक्टरी निरीक्षण**: बीआईएस अधिकारी द्वारा निर्माण स्थल और गुणवत्ता जांच का सत्यापन।
5. **लाइसेंस (CM/L) आवंटन**: सफल सत्यापन के पश्चात खिलौनों पर ISI मार्क लगाने का आधिकारिक अधिकार मिलता है [4]।`,
  },

  // Demo 4: Out-of-Scope / Abstention Query (AI Software Standards)
  {
    id: "demo-abstention-ai",
    category: "abstention",
    triggerPatterns: [
      "artificial intelligence",
      "ai software",
      "machine learning",
      "software standard",
    ],
    language: "en",
    mandatoryStatus: "voluntary",
    confidence: {
      score: 0.1,
      level: "LOW",
      signals: {
        topSimilarity: 0.12,
        hybridConsensus: 0.08,
        metadataMatch: 0.05,
        scoreMargin: 0.02,
      },
      explanation:
        "Low grounding confidence. No mandatory Indian Standards or gazetted Quality Control Orders currently indexed for commercial AI software products.",
    },
    entities: {
      product: "Artificial Intelligence Software",
      intent: "find_standards",
      keywords: ["artificial intelligence", "software", "AI"],
    },
    evidenceBlocks: [],
    citations: [],
    content: `### Insufficient Official Information Found

The current Manak AI database does not contain sufficient authoritative Indian Standards or mandatory Quality Control Orders (QCOs) for: **"artificial intelligence software"**.

#### Why Manak AI Refuses to Answer:
* **Strict Anti-Hallucination Policy**: To protect manufacturers and legal teams from regulatory errors, Manak AI strictly refrains from guessing or fabricating compliance specifications without indexed source documents.
* **Current Standardization Status**: While the Bureau of Indian Standards (LITD sectional committees) and international bodies (ISO/IEC JTC 1/SC 42) are developing AI governance frameworks, no statutory QCO currently mandates BIS ISI certification for generic software applications in India.

#### Recommended Official Resources:
* Check ongoing draft standards on the **BIS Standards Portal**: [bis.gov.in](https://www.bis.gov.in)
* Review Sectional Committee documents under **Electronics & IT Division (LITD 30)**.`,
  },
];

/**
 * Searches the demo cache for an exact or fuzzy trigger match.
 */
export function findDemoCachedResponse(query: string): DemoCachedResponse | null {
  const normalized = query.toLowerCase().trim();

  for (const demo of DEMO_CACHE) {
    for (const pattern of demo.triggerPatterns) {
      if (normalized.includes(pattern.toLowerCase())) {
        return demo;
      }
    }
  }

  return null;
}
