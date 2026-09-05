// src/lib/utils/i18n.ts
import { SupportedLanguage } from "./language";

export interface Dictionary {
  // Brand & Navigation
  brandTitle: string;
  brandSubtitle: string;
  navHome: string;
  navChat: string;
  navStandards: string;
  navPathway: string;
  navAudit: string;
  langToggle: string;

  // Hero & Capabilities
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  consultAiButton: string;

  // Confidence & Badges
  confidenceHigh: string;
  confidenceMedium: string;
  confidenceLow: string;
  statusMandatory: string;
  statusVoluntary: string;
  statusConditional: string;

  // Citations & Sources
  citationsTitle: string;
  clause: string;
  page: string;
  viewOfficialStandard: string;
  verifiedQuote: string;
  relatedStandardsTitle: string;
  zeroHallucinationGuaranteed: string;

  // Compliance Pathway
  pathwayTitle: string;
  timelineLabel: string;
  stepLabel: string;
  schemeLabel: string;
  mandatoryUnderQco: string;

  // Gap Analysis
  gapTitle: string;
  productNameLabel: string;
  materialGradeLabel: string;
  currentTestsLabel: string;
  currentCertsLabel: string;
  auditResultsLabel: string;
  satisfiedLabel: string;
  notSatisfiedLabel: string;
  needsVerificationLabel: string;
  criticalGapsLabel: string;
  nextStepsLabel: string;
  runAuditButton: string;

  // Disclaimers
  officialDisclaimer: string;
}

export const UI_STRINGS: Record<SupportedLanguage, Dictionary> = {
  en: {
    // Brand & Navigation
    brandTitle: "Manak AI",
    brandSubtitle: "Bureau of Indian Standards Intelligence Platform",
    navHome: "Home",
    navChat: "AI Compliance Chat",
    navStandards: "Standards Explorer",
    navPathway: "Certification Pathway",
    navAudit: "Gap Analysis",
    langToggle: "हिन्दी",

    // Hero & Capabilities
    heroBadge: "SIH 2026 Problem Statement SIH26107",
    heroTitle: "Authoritative Bureau of Indian Standards & QCO Intelligence",
    heroSubtitle:
      "Instant clause-level citations, mandatory vs voluntary determination, and end-to-end BIS Scheme-I compliance pathways for Indian manufacturers and consumers.",
    searchPlaceholder: "Ask anything about Indian Standards, QCOs, testing methods, or certification...",
    consultAiButton: "Consult AI",

    // Confidence & Badges
    confidenceHigh: "HIGH CONFIDENCE",
    confidenceMedium: "MEDIUM CONFIDENCE",
    confidenceLow: "LOW CONFIDENCE",
    statusMandatory: "MANDATORY QCO",
    statusVoluntary: "VOLUNTARY STANDARD",
    statusConditional: "CONDITIONAL MANDATE",

    // Citations & Sources
    citationsTitle: "Authoritative Sources & Verified Citations",
    clause: "Clause",
    page: "Page",
    viewOfficialStandard: "View Official BIS Standard",
    verifiedQuote: "Verified Clause Excerpt",
    relatedStandardsTitle: "Companion & Referenced Standards",
    zeroHallucinationGuaranteed: "100% Grounded — Zero Hallucinations",

    // Compliance Pathway
    pathwayTitle: "7-Step BIS Certification Pathway",
    timelineLabel: "Estimated Timeline",
    stepLabel: "Step",
    schemeLabel: "BIS Scheme-I (ISI Mark)",
    mandatoryUnderQco: "Mandatory under Quality Control Order (QCO)",

    // Gap Analysis
    gapTitle: "Compliance Gap Analysis & Audit Engine",
    productNameLabel: "Product Name",
    materialGradeLabel: "Material Grade & Specifications",
    currentTestsLabel: "Existing In-House / Laboratory Tests",
    currentCertsLabel: "Current Certifications (e.g. ISO, CE, ISI)",
    auditResultsLabel: "Audit Findings & Requirement Gaps",
    satisfiedLabel: "Compliant (Satisfied)",
    notSatisfiedLabel: "Non-Compliant (Critical Gap)",
    needsVerificationLabel: "Needs Verification",
    criticalGapsLabel: "Critical Regulatory Gaps",
    nextStepsLabel: "Actionable Next Steps",
    runAuditButton: "Perform Compliance Audit",

    // Disclaimers
    officialDisclaimer:
      "Disclaimer: Manak AI provides compliance intelligence compiled from published Bureau of Indian Standards documents and gazetted Quality Control Orders. It is intended for operational guidance and pre-audit readiness. Formal grant of license and statutory determination remain under the exclusive jurisdiction of the Bureau of Indian Standards (BIS) under the BIS Act, 2016.",
  },

  hi: {
    // Brand & Navigation
    brandTitle: "मानक AI",
    brandSubtitle: "भारतीय मानक ब्यूरो अनुपालन प्लेटफॉर्म",
    navHome: "मुख्य पृष्ठ",
    navChat: "AI अनुपालन चैट",
    navStandards: "मानक अन्वेषक",
    navPathway: "प्रमाणन मार्ग",
    navAudit: "अंतर विश्लेषण",
    langToggle: "English",

    // Hero & Capabilities
    heroBadge: "SIH 2026 समस्या कथन SIH26107",
    heroTitle: "भारतीय मानक ब्यूरो (BIS) एवं गुणवत्ता नियंत्रण आदेश (QCO) इंटेलिजेंस",
    heroSubtitle:
      "भारतीय निर्माताओं और उपभोक्ताओं के लिए तत्काल खंड-स्तरीय संदर्भ, अनिवार्य बनाम स्वैच्छिक स्थिति निर्धारण और सम्पूर्ण BIS स्कीम-I प्रमाणन मार्ग।",
    searchPlaceholder: "भारतीय मानक, QCO, परीक्षण विधियों या प्रमाणन के बारे में कुछ भी पूछें...",
    consultAiButton: "AI से पूछें",

    // Confidence & Badges
    confidenceHigh: "उच्च विश्वसनीयता",
    confidenceMedium: "मध्यम विश्वसनीयता",
    confidenceLow: "कम विश्वसनीयता",
    statusMandatory: "अनिवार्य QCO",
    statusVoluntary: "स्वैच्छिक मानक",
    statusConditional: "सशर्त अनिवार्य",

    // Citations & Sources
    citationsTitle: "आधिकारिक स्रोत एवं सत्यापित संदर्भ",
    clause: "खंड (Clause)",
    page: "पृष्ठ",
    viewOfficialStandard: "आधिकारिक BIS मानक देखें",
    verifiedQuote: "सत्यापित खंड उद्धरण",
    relatedStandardsTitle: "संबंधित और पूरक मानक",
    zeroHallucinationGuaranteed: "100% सत्यापित संदर्भ — शून्य भ्रम",

    // Compliance Pathway
    pathwayTitle: "7-चरणीय BIS प्रमाणन मार्ग",
    timelineLabel: "अनुमानित समय सीमा",
    stepLabel: "चरण",
    schemeLabel: "BIS स्कीम-I (ISI मार्क)",
    mandatoryUnderQco: "गुणवत्ता नियंत्रण आदेश (QCO) के तहत अनिवार्य",

    // Gap Analysis
    gapTitle: "अनुपालन अंतर विश्लेषण (Gap Analysis)",
    productNameLabel: "उत्पाद का नाम",
    materialGradeLabel: "सामग्री ग्रेड और विनिर्देश",
    currentTestsLabel: "वर्तमान इन-हाउस / प्रयोगशाला परीक्षण",
    currentCertsLabel: "वर्तमान प्रमाणन (उदा. ISO, CE, ISI)",
    auditResultsLabel: "ऑडिट निष्कर्ष और विनियामक कमियां",
    satisfiedLabel: "अनुपालित (संतुष्ट)",
    notSatisfiedLabel: "गैर-अनुपालित (गंभीर कमी)",
    needsVerificationLabel: "सत्यापन आवश्यक",
    criticalGapsLabel: "महत्वपूर्ण विनियामक कमियां",
    nextStepsLabel: "कार्रवाई योग्य अगले कदम",
    runAuditButton: "अनुपालन ऑडिट शुरू करें",

    // Disclaimers
    officialDisclaimer:
      "अस्वीकरण: मानक AI प्रकाशित भारतीय मानक ब्यूरो दस्तावेजों और राजपत्रित गुणवत्ता नियंत्रण आदेशों से संकलित अनुपालन जानकारी प्रदान करता है। यह प्रारंभिक तैयारी और परिचालन मार्गदर्शन के लिए है। लाइसेंस का औपचारिक अनुदान भारतीय मानक ब्यूरो (BIS) के विशेष अधिकार क्षेत्र में है।",
  },
};

/**
 * Helper to fetch localized string by key with type safety and fallback.
 */
export function t(key: keyof Dictionary, lang: SupportedLanguage = "en"): string {
  const dict = UI_STRINGS[lang] || UI_STRINGS.en;
  return dict[key] || UI_STRINGS.en[key] || String(key);
}
