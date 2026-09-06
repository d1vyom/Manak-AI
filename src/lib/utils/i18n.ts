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
  themeToggleDark: string;
  themeToggleLight: string;

  // Hero & Capabilities
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  consultAiButton: string;
  launchAiAssistant: string;
  exploreStandardsBtn: string;
  runGapAuditBtn: string;

  // Stats
  statStandardsNum: string;
  statStandardsLabel: string;
  statCitationsNum: string;
  statCitationsLabel: string;
  statQcoNum: string;
  statQcoLabel: string;
  statBilingualNum: string;
  statBilingualLabel: string;

  // Demos & Features
  demoTitle: string;
  demoSubtitle: string;
  featuresTitle: string;
  featuresSubtitle: string;
  featuresDesc: string;
  ctaTitle: string;
  ctaDesc: string;

  // Confidence & Badges
  confidenceHigh: string;
  confidenceMedium: string;
  confidenceLow: string;
  statusMandatory: string;
  statusVoluntary: string;
  statusConditional: string;
  statusVerificationRequired: string;
  groundingLabel: string;
  retrievalScoreLabel: string;

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
  stepperTitle: string;
  stepperSubtitle: string;
  stepperRecommended: string;
  stepperChecklistTitle: string;
  stepperGapPrompt: string;
  stepperRunAudit: string;

  // Gap Analysis & Audit Engine
  gapTitle: string;
  complianceTitle: string;
  complianceSubtitle: string;
  isiReadinessBadge: string;
  btnPrintReport: string;
  btnNewAudit: string;
  presetsTitle: string;
  presetsDesc: string;
  formSection1: string;
  formSection2: string;
  formSection3: string;
  productNameLabel: string;
  materialGradeLabel: string;
  capacityLabel: string;
  manufacturingProcessLabel: string;
  testsDesc: string;
  currentTestsLabel: string;
  currentCertsLabel: string;
  auditResultsLabel: string;
  satisfiedLabel: string;
  notSatisfiedLabel: string;
  needsVerificationLabel: string;
  criticalGapsLabel: string;
  nextStepsLabel: string;
  runAuditButton: string;
  auditingRunning: string;
  sidebarHowItWorks: string;
  sidebarHowItWorksDesc: string;
  satisfiedDesc: string;
  criticalGapsDesc: string;
  needsVerificationDesc: string;
  qcoProtectionTitle: string;
  qcoProtectionDesc: string;
  verdictTitle: string;
  verdictHigh: string;
  verdictMedium: string;
  verdictLow: string;
  verdictSatisfiedSub: string;
  verdictGapsSub: string;
  verdictVerifySub: string;
  criticalGapsAlertTitle: string;
  checklistTitle: string;
  filterAllReqs: string;
  filterMaterial: string;
  filterTesting: string;
  filterManufacturing: string;
  filterCertification: string;
  filterDocumentation: string;
  thStatus: string;
  thCategory: string;
  thBisReq: string;
  thEvidence: string;
  thStandardRef: string;
  thRecommendation: string;
  statusNeedsProof: string;
  helpClosingGapsTitle: string;
  helpClosingGapsDesc: string;
  btnAskAiFixGaps: string;

  // Standards Explorer
  explorerTitle: string;
  explorerSubtitle: string;
  standardsIndexedBadge: string;
  tableView: string;
  cardsView: string;
  filterLabel: string;
  filterAll: string;
  filterMandatory: string;
  filterVoluntary: string;
  filterWater: string;
  filterConsumer: string;
  filterConstruction: string;
  searchStandardsPlaceholder: string;
  colStandard: string;
  colTitleScope: string;
  colStatus: string;
  colCategories: string;
  colActions: string;
  btnDetails: string;
  btnAskAi: string;
  btnViewClauses: string;
  noStandardsFound: string;
  noStandardsDesc: string;
  btnResetFilters: string;
  indexingStandards: string;

  // Standards Detail Modal
  modalScopeTitle: string;
  modalQcoTitle: string;
  modalQcoOrder: string;
  modalEffectiveDate: string;
  modalClausesTitle: string;
  modalCompanionTitle: string;
  modalOfficialBisRecord: string;
  modalAuditProduct: string;
  modalAskAssistant: string;
  mandatoryIsiMark: string;

  // Chat Interface
  chatAssistantTitle: string;
  chatAssistantSubtitle: string;
  chatSourcesBtn: string;
  chatInputPlaceholder: string;
  chatStreamingIndicator: string;
  chatCopy: string;
  chatCopied: string;
  chatViewSources: string;
  chatAntiHallucination: string;
  chatSuggestions: string;
  chatClear: string;
  chatSendHint: string;

  // Citation Panel
  panelEvidenceTitle: string;
  panelEvidenceSubtitle: string;
  panelNoCitations: string;
  panelNoCitationsDesc: string;
  panelRelatedStandards: string;
  panelRelatedStandardsDesc: string;
  panelAntiHallucination: string;
  panelEBisPortal: string;
  panelSourcesCount: string;
  panelSourceCount: string;
  btnCopyQuote: string;
  btnQuoteCopied: string;
  btnViewSource: string;

  // Footer & Disclaimers
  footerHackathon: string;
  footerPortal: string;
  footerEBis: string;
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
    themeToggleDark: "Switch to Dark Mode",
    themeToggleLight: "Switch to Light Mode",

    // Hero & Capabilities
    heroBadge: "Smart India Hackathon 2026 — Problem Statement SIH26107",
    heroTitle: "Authoritative Bureau of Indian Standards & QCO Intelligence",
    heroSubtitle:
      "Instant clause-level citations, mandatory vs voluntary determination, and end-to-end BIS Scheme-I compliance pathways for Indian manufacturers and consumers.",
    searchPlaceholder: "Ask anything about Indian Standards, QCOs, testing methods, or certification...",
    consultAiButton: "Consult AI",
    launchAiAssistant: "Launch AI Assistant",
    exploreStandardsBtn: "Explore Standards",
    runGapAuditBtn: "Run Gap Audit",

    // Stats
    statStandardsNum: "19,000+",
    statStandardsLabel: "Indian Standards Indexed",
    statCitationsNum: "100%",
    statCitationsLabel: "Clause-Level Citations",
    statQcoNum: "QCO Track",
    statQcoLabel: "Gazette Mandates Linked",
    statBilingualNum: "Bilingual",
    statBilingualLabel: "Hindi & English Grounding",

    // Demos & Features
    demoTitle: "Interactive Demonstrations",
    demoSubtitle: "Try Common BIS Queries",
    featuresTitle: "Enterprise Compliance Intelligence",
    featuresSubtitle: "Why Manak AI is Not Just Another Chatbot",
    featuresDesc:
      "Built on strict anti-hallucination architectures, grounding every single claim in official gazette notifications and published Indian Standards.",
    ctaTitle: "Ready to verify your product compliance?",
    ctaDesc:
      "Audit your bill of materials and testing protocols against official Bureau of Indian Standards clauses in seconds.",

    // Confidence & Badges
    confidenceHigh: "HIGH CONFIDENCE",
    confidenceMedium: "MEDIUM CONFIDENCE",
    confidenceLow: "LOW CONFIDENCE",
    statusMandatory: "MANDATORY QCO",
    statusVoluntary: "VOLUNTARY STANDARD",
    statusConditional: "CONDITIONAL MANDATE",
    statusVerificationRequired: "STATUS VERIFICATION REQUIRED",
    groundingLabel: "Grounding",
    retrievalScoreLabel: "Retrieval Grounding Score",

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
    stepperTitle: "7-Step BIS Certification Roadmap",
    stepperSubtitle: "Procedural pathway for",
    stepperRecommended: "Recommended",
    stepperChecklistTitle: "Action Checklist & Documentation",
    stepperGapPrompt: "Want a gap analysis against your exact material specs?",
    stepperRunAudit: "Run Gap Audit",

    // Gap Analysis & Audit Engine
    gapTitle: "Compliance Gap Analysis & Audit Engine",
    complianceTitle: "Compliance Gap Analysis & Audit Tool",
    complianceSubtitle:
      "Evaluate your manufacturing, chemical composition, and testing specs against applicable Indian Standards (IS).",
    isiReadinessBadge: "BIS ISI Readiness",
    btnPrintReport: "Print Report",
    btnNewAudit: "New Audit",
    presetsTitle: "Quick-Fill Verified Demo Presets",
    presetsDesc: "Select a product profile to pre-fill tested materials, parameters, and standards:",
    formSection1: "1. Product & Material Details",
    formSection2: "2. Laboratory Tests Currently Performed",
    formSection3: "3. Factory Infrastructure & Certifications",
    productNameLabel: "Product Name / Category *",
    materialGradeLabel: "Material Specification & Grade",
    capacityLabel: "Capacity / Rating / Size",
    manufacturingProcessLabel: "Manufacturing Process Summary",
    testsDesc: "Select tests that your factory or third-party laboratory has already conducted:",
    currentTestsLabel: "Existing In-House / Laboratory Tests",
    currentCertsLabel: "Current Certifications (e.g. ISO, CE, ISI)",
    auditResultsLabel: "Audit Findings & Requirement Gaps",
    satisfiedLabel: "Compliant (Satisfied)",
    notSatisfiedLabel: "Non-Compliant (Critical Gap)",
    needsVerificationLabel: "Needs Verification",
    criticalGapsLabel: "Critical Regulatory Gaps",
    nextStepsLabel: "Actionable Next Steps",
    runAuditButton: "Run Compliance Gap Analysis",
    auditingRunning: "Auditing Specifications Against BIS Standards...",
    sidebarHowItWorks: "How Gap Analysis Works",
    sidebarHowItWorksDesc:
      "Manak AI evaluates your raw materials, testing limits, and factory quality control procedures against the normative requirements of the Bureau of Indian Standards.",
    satisfiedDesc: "Parameters your product already fulfills.",
    criticalGapsDesc: "Missing mandatory tests or material non-compliances.",
    needsVerificationDesc: "Tests needing factory inspection or lab reports.",
    qcoProtectionTitle: "Mandatory QCO Protection",
    qcoProtectionDesc:
      "Selling non-certified products covered under a Quality Control Order (QCO) is illegal under Section 17 of the BIS Act, 2016, carrying heavy penalties and seizure.",
    verdictTitle: "Audit Verdict",
    verdictHigh: "Substantially Compliant",
    verdictMedium: "Partial Compliance",
    verdictLow: "Significant Gaps Detected",
    verdictSatisfiedSub: "Verified against BIS clauses",
    verdictGapsSub: "Hurdles for ISI certification",
    verdictVerifySub: "Pending factory evidence",
    criticalGapsAlertTitle: "Critical Compliance Gaps Requiring Immediate Remediation",
    checklistTitle: "Regulatory Requirements Checklist",
    filterAllReqs: "All Requirements",
    filterMaterial: "Material",
    filterTesting: "Testing",
    filterManufacturing: "Manufacturing",
    filterCertification: "Certification",
    filterDocumentation: "Documentation",
    thStatus: "Status",
    thCategory: "Category",
    thBisReq: "BIS Requirement",
    thEvidence: "Evidence / Current Spec",
    thStandardRef: "Standard Reference",
    thRecommendation: "Corrective Recommendation",
    statusNeedsProof: "NEEDS PROOF",
    helpClosingGapsTitle: "Need guidance on closing these compliance gaps?",
    helpClosingGapsDesc:
      "Ask Manak AI assistant for specific testing protocols, NABL lab options, and sample application forms.",
    btnAskAiFixGaps: "Ask AI to Fix Gaps",

    // Standards Explorer
    explorerTitle: "Indian Standards Explorer",
    explorerSubtitle:
      "Explore officially indexed BIS standards, mandatory QCO Gazette status, and normative testing specifications.",
    standardsIndexedBadge: "19,000+ Standards Index",
    tableView: "Table",
    cardsView: "Cards",
    filterLabel: "Filter:",
    filterAll: "All Standards",
    filterMandatory: "Mandatory QCO",
    filterVoluntary: "Voluntary",
    filterWater: "Water & Potable",
    filterConsumer: "Consumer Goods",
    filterConstruction: "Construction & Steel",
    searchStandardsPlaceholder:
      "Search IS number, product, or keyword (e.g. IS 14543, stainless steel, toy)...",
    colStandard: "Standard Designation",
    colTitleScope: "Standard Title & Scope",
    colStatus: "Compliance Status",
    colCategories: "Sector / Categories",
    colActions: "Actions",
    btnDetails: "Details",
    btnAskAi: "Ask AI",
    btnViewClauses: "View Clauses",
    noStandardsFound: "No matching Indian Standards found",
    noStandardsDesc:
      "We couldn't find standards matching your query. Try searching for an IS number or general product term.",
    btnResetFilters: "Reset Filters",
    indexingStandards: "Indexing Indian Standards...",

    // Standards Detail Modal
    modalScopeTitle: "Official Scope & Applicability",
    modalQcoTitle: "Gazette Quality Control Order (QCO) Reference",
    modalQcoOrder: "Order:",
    modalEffectiveDate: "Effective Enforcement Date:",
    modalClausesTitle: "Indexed Key Clauses & Requirements",
    modalCompanionTitle: "Companion & Testing Standards",
    modalOfficialBisRecord: "Official BIS Record",
    modalAuditProduct: "Audit Product",
    modalAskAssistant: "Ask AI Assistant",
    mandatoryIsiMark: "MANDATORY (ISI MARK)",

    // Chat Interface
    chatAssistantTitle: "BIS Compliance Assistant",
    chatAssistantSubtitle:
      "Authoritative answers with clause-level citations and official gazette tracking",
    chatSourcesBtn: "Sources",
    chatInputPlaceholder:
      "Ask about BIS standards, testing requirements, QCO gazettes, or ISI Mark certification...",
    chatStreamingIndicator: "Analyzing Indian Standards & QCO gazettes...",
    chatCopy: "Copy",
    chatCopied: "Copied",
    chatViewSources: "View Sources",
    chatAntiHallucination: "Strict anti-hallucination verified",
    chatSuggestions: "Suggestions:",
    chatClear: "Clear",
    chatSendHint: "Press Enter to send, Shift+Enter for new line",

    // Citation Panel
    panelEvidenceTitle: "Evidence & Citations",
    panelEvidenceSubtitle: "Verifiable Gazette & Clause Sources",
    panelNoCitations: "No Active Citations",
    panelNoCitationsDesc:
      "Ask a question about BIS standards or ISI compliance. Clause excerpts and gazette links will populate here.",
    panelRelatedStandards: "Related Companion Standards",
    panelRelatedStandardsDesc: "Standards normatively referenced by the cited documents:",
    panelAntiHallucination: "Anti-Hallucination Verified",
    panelEBisPortal: "e-BIS Portal",
    panelSourcesCount: "Sources",
    panelSourceCount: "Source",
    btnCopyQuote: "Copy Quote",
    btnQuoteCopied: "Copied!",
    btnViewSource: "View Source",

    // Footer & Disclaimers
    footerHackathon: "Built for Smart India Hackathon 2026 (Problem Statement SIH26107).",
    footerPortal: "BIS Official Portal",
    footerEBis: "e-BIS Services (Manakonline)",
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
    themeToggleDark: "डार्क मोड चालू करें",
    themeToggleLight: "लाइट मोड चालू करें",

    // Hero & Capabilities
    heroBadge: "स्मार्ट इंडिया हैकाथॉन 2026 — समस्या कथन SIH26107",
    heroTitle: "भारतीय मानक ब्यूरो (BIS) एवं गुणवत्ता नियंत्रण आदेश (QCO) इंटेलिजेंस",
    heroSubtitle:
      "भारतीय निर्माताओं और उपभोक्ताओं के लिए तत्काल खंड-स्तरीय संदर्भ, अनिवार्य बनाम स्वैच्छिक स्थिति निर्धारण और सम्पूर्ण BIS स्कीम-I प्रमाणन मार्ग।",
    searchPlaceholder: "भारतीय मानक, QCO, परीक्षण विधियों या प्रमाणन के बारे में कुछ भी पूछें...",
    consultAiButton: "AI से पूछें",
    launchAiAssistant: "एआई सहायक शुरू करें",
    exploreStandardsBtn: "मानक खोजें",
    runGapAuditBtn: "गैप ऑडिट चलाएं",

    // Stats
    statStandardsNum: "19,000+",
    statStandardsLabel: "भारतीय मानक अनुक्रमित",
    statCitationsNum: "100%",
    statCitationsLabel: "खंड-स्तरीय संदर्भ",
    statQcoNum: "QCO ट्रैकर",
    statQcoLabel: "राजपत्र आदेश लिंक",
    statBilingualNum: "द्विभाषी",
    statBilingualLabel: "हिन्दी एवं अंग्रेजी समर्थन",

    // Demos & Features
    demoTitle: "संवादात्मक प्रदर्शन",
    demoSubtitle: "सामान्य BIS प्रश्नों को आजमाएं",
    featuresTitle: "एंटरप्राइज अनुपालन इंटेलिजेंस",
    featuresSubtitle: "मानक AI केवल एक चैटबॉट क्यों नहीं है",
    featuresDesc:
      "सख्त एंटी-मतिभ्रम आर्किटेक्चर पर निर्मित, हर दावे को आधिकारिक राजपत्र अधिसूचनाओं और प्रकाशित भारतीय मानकों से सत्यापित करता है।",
    ctaTitle: "क्या आप अपने उत्पाद अनुपालन को सत्यापित करने के लिए तैयार हैं?",
    ctaDesc:
      "सेकंडों में आधिकारिक भारतीय मानक ब्यूरो खंडों के विरुद्ध अपनी सामग्री और परीक्षण प्रोटोकॉल का ऑडिट करें।",

    // Confidence & Badges
    confidenceHigh: "उच्च विश्वसनीयता",
    confidenceMedium: "मध्यम विश्वसनीयता",
    confidenceLow: "कम विश्वसनीयता",
    statusMandatory: "अनिवार्य QCO",
    statusVoluntary: "स्वैच्छिक मानक",
    statusConditional: "सशर्त अनिवार्य",
    statusVerificationRequired: "स्थिति सत्यापन आवश्यक",
    groundingLabel: "सत्यापन स्तर",
    retrievalScoreLabel: "पुनर्प्राप्ति सत्यापन स्कोर",

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
    stepperTitle: "7-चरणीय BIS प्रमाणन रोडमैप",
    stepperSubtitle: "प्रक्रियात्मक मार्ग:",
    stepperRecommended: "अनुशंसित",
    stepperChecklistTitle: "कार्रवाई चेकलिस्ट एवं दस्तावेज़ीकरण",
    stepperGapPrompt: "क्या आप अपनी सटीक सामग्री के अनुसार अंतर विश्लेषण चाहते हैं?",
    stepperRunAudit: "गैप ऑडिट शुरू करें",

    // Gap Analysis & Audit Engine
    gapTitle: "अनुपालन अंतर विश्लेषण (Gap Analysis)",
    complianceTitle: "अनुपालन अंतर विश्लेषण एवं ऑडिट उपकरण",
    complianceSubtitle:
      "लागू भारतीय मानकों (IS) के विरुद्ध अपने निर्माण, रासायनिक संरचना और परीक्षण विनिर्देशों का मूल्यांकन करें।",
    isiReadinessBadge: "BIS ISI तत्परता",
    btnPrintReport: "रिपोर्ट प्रिंट करें",
    btnNewAudit: "नया ऑडिट",
    presetsTitle: "त्वरित सत्यापित डेमो प्रोफाइल",
    presetsDesc: "परीक्षण सामग्री, पैरामीटर और मानकों को स्वतः भरने के लिए उत्पाद चुनें:",
    formSection1: "1. उत्पाद और सामग्री विवरण",
    formSection2: "2. वर्तमान में किए गए प्रयोगशाला परीक्षण",
    formSection3: "3. फैक्ट्री अवसंरचना और गुणवत्ता प्रमाणन",
    productNameLabel: "उत्पाद का नाम / श्रेणी *",
    materialGradeLabel: "सामग्री विनिर्देश और ग्रेड",
    capacityLabel: "क्षमता / रेटिंग / आकार",
    manufacturingProcessLabel: "विनिर्माण प्रक्रिया सारांश",
    testsDesc: "वे परीक्षण चुनें जो आपकी फैक्ट्री या प्रयोगशाला द्वारा पहले से किए गए हैं:",
    currentTestsLabel: "वर्तमान इन-हाउस / प्रयोगशाला परीक्षण",
    currentCertsLabel: "वर्तमान प्रमाणन (उदा. ISO, CE, ISI)",
    auditResultsLabel: "ऑडिट निष्कर्ष और विनियामक कमियां",
    satisfiedLabel: "अनुपालित (संतुष्ट)",
    notSatisfiedLabel: "गैर-अनुपालित (गंभीर कमी)",
    needsVerificationLabel: "सत्यापन आवश्यक",
    criticalGapsLabel: "महत्वपूर्ण विनियामक कमियां",
    nextStepsLabel: "कार्रवाई योग्य अगले कदम",
    runAuditButton: "अनुपालन अंतर विश्लेषण चलाएं",
    auditingRunning: "BIS मानकों के विरुद्ध विनिर्देशों का ऑडिट किया जा रहा है...",
    sidebarHowItWorks: "अंतर विश्लेषण कैसे कार्य करता है",
    sidebarHowItWorksDesc:
      "मानक AI भारतीय मानक ब्यूरो की औपचारिक आवश्यकताओं के विरुद्ध आपके कच्चे माल, परीक्षण सीमाओं और गुणवत्ता प्रक्रियाओं का मूल्यांकन करता है।",
    satisfiedDesc: "पैरामीटर जो आपका उत्पाद पहले से पूरा करता है।",
    criticalGapsDesc: "लापता अनिवार्य परीक्षण या सामग्री विसंगतियां।",
    needsVerificationDesc: "फैक्ट्री निरीक्षण या लैब रिपोर्ट की आवश्यकता वाले परीक्षण।",
    qcoProtectionTitle: "अनिवार्य QCO सुरक्षा",
    qcoProtectionDesc:
      "गुणवत्ता नियंत्रण आदेश (QCO) के तहत गैर-प्रमाणित उत्पाद बेचना BIS अधिनियम, 2016 की धारा 17 के तहत गैरकानूनी है।",
    verdictTitle: "ऑडिट निर्णय",
    verdictHigh: "पर्याप्त रूप से अनुपालित",
    verdictMedium: "आंशिक अनुपालन",
    verdictLow: "महत्वपूर्ण कमियां पाई गईं",
    verdictSatisfiedSub: "BIS खंडों के विरुद्ध सत्यापित",
    verdictGapsSub: "ISI प्रमाणन के लिए बाधाएं",
    verdictVerifySub: "फैक्ट्री साक्ष्य लंबित",
    criticalGapsAlertTitle: "तत्काल समाधान की आवश्यकता वाली विनियामक कमियां",
    checklistTitle: "विनियामक आवश्यकताएं चेकलिस्ट",
    filterAllReqs: "सभी आवश्यकताएं",
    filterMaterial: "सामग्री",
    filterTesting: "परीक्षण",
    filterManufacturing: "विनिर्माण",
    filterCertification: "प्रमाणन",
    filterDocumentation: "दस्तावेज़ीकरण",
    thStatus: "स्थिति",
    thCategory: "श्रेणी",
    thBisReq: "BIS आवश्यकता",
    thEvidence: "वर्तमान साक्ष्य / विनिर्देश",
    thStandardRef: "मानक संदर्भ",
    thRecommendation: "सुधारात्मक अनुशंसा",
    statusNeedsProof: "साक्ष्य आवश्यक",
    helpClosingGapsTitle: "इन अनुपालन कमियों को दूर करने में सहायता चाहिए?",
    helpClosingGapsDesc:
      "विशिष्ट परीक्षण प्रोटोकॉल, NABL प्रयोगशाला विकल्पों और आवेदन प्रपत्रों के लिए मानक AI सहायक से पूछें।",
    btnAskAiFixGaps: "कमियां दूर करने हेतु AI से पूछें",

    // Standards Explorer
    explorerTitle: "भारतीय मानक अन्वेषक",
    explorerSubtitle:
      "आधिकारिक रूप से अनुक्रमित BIS मानकों, अनिवार्य QCO राजपत्र स्थिति और परीक्षण विनिर्देशों को देखें।",
    standardsIndexedBadge: "19,000+ मानक अनुक्रमित",
    tableView: "तालिका",
    cardsView: "कार्ड्स",
    filterLabel: "फ़िल्टर:",
    filterAll: "सभी मानक",
    filterMandatory: "अनिवार्य QCO",
    filterVoluntary: "स्वैच्छिक",
    filterWater: "पेयजल एवं जल",
    filterConsumer: "उपभोक्ता वस्तुएं",
    filterConstruction: "निर्माण एवं स्टील",
    searchStandardsPlaceholder:
      "IS नंबर, उत्पाद या कीवर्ड खोजें (उदा. IS 14543, स्टेनलेस स्टील, खिलौना)...",
    colStandard: "मानक पदनाम",
    colTitleScope: "मानक शीर्षक एवं कार्यक्षेत्र",
    colStatus: "अनुपालन स्थिति",
    colCategories: "क्षेत्र / श्रेणियां",
    colActions: "कार्रवाई",
    btnDetails: "विवरण",
    btnAskAi: "AI से पूछें",
    btnViewClauses: "खंड देखें",
    noStandardsFound: "कोई मेल खाने वाले भारतीय मानक नहीं मिले",
    noStandardsDesc:
      "आपके द्वारा खोजे गए शब्द से कोई मानक नहीं मिला। IS नंबर या सामान्य उत्पाद नाम खोजने का प्रयास करें।",
    btnResetFilters: "फ़िल्टर रीसेट करें",
    indexingStandards: "भारतीय मानकों को लोड किया जा रहा है...",

    // Standards Detail Modal
    modalScopeTitle: "आधिकारिक कार्यक्षेत्र एवं प्रयोज्यता",
    modalQcoTitle: "राजपत्र गुणवत्ता नियंत्रण आदेश (QCO) संदर्भ",
    modalQcoOrder: "आदेश संख्या:",
    modalEffectiveDate: "प्रभावी प्रवर्तन तिथि:",
    modalClausesTitle: "अनुक्रमित प्रमुख खंड एवं आवश्यकताएं",
    modalCompanionTitle: "संबंधित एवं परीक्षण मानक",
    modalOfficialBisRecord: "आधिकारिक BIS रिकॉर्ड",
    modalAuditProduct: "उत्पाद ऑडिट करें",
    modalAskAssistant: "AI सहायक से पूछें",
    mandatoryIsiMark: "अनिवार्य (ISI मार्क)",

    // Chat Interface
    chatAssistantTitle: "BIS अनुपालन सहायक",
    chatAssistantSubtitle:
      "खंड-स्तरीय संदर्भों और आधिकारिक राजपत्र ट्रैकिंग के साथ प्रामाणिक उत्तर",
    chatSourcesBtn: "स्रोत",
    chatInputPlaceholder:
      "BIS मानकों, परीक्षण आवश्यकताओं, QCO राजपत्र या ISI मार्क प्रमाणन के बारे में पूछें...",
    chatStreamingIndicator: "भारतीय मानकों एवं QCO राजपत्रों का विश्लेषण किया जा रहा है...",
    chatCopy: "कॉपी करें",
    chatCopied: "कॉपी किया गया",
    chatViewSources: "स्रोत देखें",
    chatAntiHallucination: "सख्त एंटी-मतिभ्रम सत्यापित",
    chatSuggestions: "सुझाव:",
    chatClear: "साफ़ करें",
    chatSendHint: "संदेश भेजने के लिए Enter दबाएं, नई पंक्ति के लिए Shift+Enter",

    // Citation Panel
    panelEvidenceTitle: "साक्ष्य एवं संदर्भ",
    panelEvidenceSubtitle: "सत्यापनीय राजपत्र एवं खंड स्रोत",
    panelNoCitations: "कोई सक्रिय संदर्भ नहीं",
    panelNoCitationsDesc:
      "BIS मानकों या ISI अनुपालन के बारे में प्रश्न पूछें। उद्धरण और राजपत्र लिंक यहां दिखाई देंगे।",
    panelRelatedStandards: "संबंधित पूरक मानक",
    panelRelatedStandardsDesc: "संदर्भित दस्तावेजों द्वारा उद्धृत मानक:",
    panelAntiHallucination: "एंटी-मतिभ्रम सत्यापित",
    panelEBisPortal: "ई-बीआईएस पोर्टल",
    panelSourcesCount: "स्रोत",
    panelSourceCount: "स्रोत",
    btnCopyQuote: "उद्धरण कॉपी करें",
    btnQuoteCopied: "कॉपी किया गया!",
    btnViewSource: "स्रोत देखें",

    // Footer & Disclaimers
    footerHackathon: "स्मार्ट इंडिया हैकाथॉन 2026 (समस्या कथन SIH26107) के लिए निर्मित।",
    footerPortal: "BIS आधिकारिक पोर्टल",
    footerEBis: "ई-बीआईएस सेवाएं (Manakonline)",
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
