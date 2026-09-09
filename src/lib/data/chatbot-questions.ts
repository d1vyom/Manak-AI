// src/lib/data/chatbot-questions.ts

export type QuestionCategory =
  | "all"
  | "qco"
  | "test_limits"
  | "safety"
  | "civil_materials"
  | "bilingual"
  | "consumer";

export interface ChatbotQuestionItem {
  id: string;
  category: QuestionCategory;
  standardNumber: string;
  iconName: "Award" | "FileCheck2" | "BookOpen" | "Globe2" | "HardHat" | "Building2" | "ShieldAlert" | "CheckCircle2";
  tag: {
    en: string;
    hi: string;
  };
  title: {
    en: string;
    hi: string;
  };
  prompt: {
    en: string;
    hi: string;
  };
  chipLabel: {
    en: string;
    hi: string;
  };
  desc: {
    en: string;
    hi: string;
  };
}

export const CHATBOT_QUESTIONS_DATASET: ChatbotQuestionItem[] = [
  {
    id: "q-bottles-qco",
    category: "qco",
    standardNumber: "IS 14543",
    iconName: "Award",
    tag: {
      en: "Mandatory QCO",
      hi: "अनिवार्य QCO",
    },
    title: {
      en: "Manufacturer Compliance",
      hi: "निर्माता अनुपालन (Manufacturer)",
    },
    prompt: {
      en: "Which BIS standards apply to stainless steel water bottles and what QCO applies?",
      hi: "स्टेनलेस स्टील पानी की बोतलों के लिए कौन सा BIS मानक और QCO लागू होता है?",
    },
    chipLabel: {
      en: "Water Bottles QCO",
      hi: "पानी की बोतलें QCO",
    },
    desc: {
      en: "Checks QCO order S.O. 2655(E), IS 14543 requirements, Grade 304 mandate, and ISI mark applicability.",
      hi: "QCO आदेश S.O. 2655(E), IS 14543 आवश्यकताएं, ग्रेड 304 और ISI मार्क जांचें।",
    },
  },
  {
    id: "q-toys-safety",
    category: "safety",
    standardNumber: "IS 9873",
    iconName: "FileCheck2",
    tag: {
      en: "Safety & Chemical",
      hi: "सुरक्षा एवं रसायन",
    },
    title: {
      en: "Toy Safety Standards",
      hi: "खिलौना सुरक्षा मानक (Toys)",
    },
    prompt: {
      en: "Is BIS certification mandatory for toys under Toys QCO 2020?",
      hi: "क्या खिलौने (गुणवत्ता नियंत्रण) आदेश 2020 के तहत खिलौनों के लिए BIS प्रमाणन अनिवार्य है?",
    },
    chipLabel: {
      en: "Toy Safety QCO 2020",
      hi: "खिलौना सुरक्षा QCO",
    },
    desc: {
      en: "Examines IS 9873 mechanical/flammability limits, small parts cylinder test, and Gazette mandates.",
      hi: "IS 9873 यांत्रिक/ज्वलनशीलता सीमाएं, छोटे पुर्जों का परीक्षण और राजपत्र आदेश जांचें।",
    },
  },
  {
    id: "q-water-limits",
    category: "test_limits",
    standardNumber: "IS 10500",
    iconName: "BookOpen",
    tag: {
      en: "Test Limits",
      hi: "परीक्षण सीमाएं",
    },
    title: {
      en: "Drinking Water Quality",
      hi: "पेयजल गुणवत्ता सीमाएं",
    },
    prompt: {
      en: "What are the chemical testing limits for drinking water under IS 10500:2012?",
      hi: "IS 10500:2012 के तहत पीने के पानी के लिए रासायनिक परीक्षण सीमाएं क्या हैं?",
    },
    chipLabel: {
      en: "Drinking Water Limits",
      hi: "पेयजल परीक्षण सीमाएं",
    },
    desc: {
      en: "Retrieves permissible and acceptable limits for TDS, pH, lead, arsenic, and pesticides.",
      hi: "TDS, pH, सीसा (Lead), आर्सेनिक और कीटनाशकों के लिए स्वीकार्य और अनुमेय सीमाएं।",
    },
  },
  {
    id: "q-helmets-is4151",
    category: "safety",
    standardNumber: "IS 4151",
    iconName: "HardHat",
    tag: {
      en: "Automotive Safety",
      hi: "ऑटोमोटिव सुरक्षा",
    },
    title: {
      en: "Rider Helmet Standards",
      hi: "दोपहिया हेलमेट मानक",
    },
    prompt: {
      en: "What are the impact absorption and dynamic testing requirements for two-wheeler helmets under IS 4151?",
      hi: "IS 4151 के तहत दोपहिया वाहन चालकों के सुरक्षात्मक हेलमेट के लिए प्रभाव अवशोषण और परीक्षण आवश्यकताएं क्या हैं?",
    },
    chipLabel: {
      en: "Helmets IS 4151",
      hi: "हेलमेट IS 4151",
    },
    desc: {
      en: "Covers outer hard shell, EPS impact absorption liner, chin strap retention load, and mandatory ISI mark.",
      hi: "हार्ड शेल, EPS लाइनर, 20 मिमी चिन स्ट्रैप और गतिशील विस्थापन परीक्षण को शामिल करता है।",
    },
  },
  {
    id: "q-tmt-rebar",
    category: "civil_materials",
    standardNumber: "IS 1786",
    iconName: "Building2",
    tag: {
      en: "Civil & Infrastructure",
      hi: "निर्माण एवं अवसंरचना",
    },
    title: {
      en: "TMT Steel Rebar Specs",
      hi: "TMT स्टील सरिया विनिर्देश",
    },
    prompt: {
      en: "What are the tensile strength and elongation requirements for Fe 500D TMT rebar under IS 1786?",
      hi: "IS 1786 के तहत Fe 500D भूकंप प्रतिरोधी TMT स्टील बार के तन्यता शक्ति और बढ़ाव आवश्यकताएं क्या हैं?",
    },
    chipLabel: {
      en: "TMT Rebar Fe 500D",
      hi: "TMT सरिया Fe 500D",
    },
    desc: {
      en: "Details 500 N/mm² yield stress, 565 N/mm² tensile strength, 16% elongation, and ladle analysis.",
      hi: "500 N/mm² यील्ड स्ट्रैस, 565 N/mm² तन्यता, 16% न्यूनतम बढ़ाव और रासायनिक सीमाओं का विवरण।",
    },
  },
  {
    id: "q-cooker-safety",
    category: "safety",
    standardNumber: "IS 2347",
    iconName: "ShieldAlert",
    tag: {
      en: "Consumer Safety",
      hi: "उपभोक्ता सुरक्षा",
    },
    title: {
      en: "Pressure Cooker Safety",
      hi: "प्रेशर कुकर सुरक्षा मानक",
    },
    prompt: {
      en: "What safety relief devices and bursting pressure tests are mandatory for pressure cookers under IS 2347?",
      hi: "IS 2347 के तहत घरेलू प्रेशर कुकर के लिए कौन से सुरक्षा राहत उपकरण और दबाव परीक्षण अनिवार्य हैं?",
    },
    chipLabel: {
      en: "Pressure Cooker IS 2347",
      hi: "प्रेशर कुकर IS 2347",
    },
    desc: {
      en: "Operating pressure thresholds (0.5–1.1 bar), spring-loaded fusible plugs, and gasket release systems.",
      hi: "0.5 से 1.1 बार ऑपरेटिंग दबाव, फ्यूजिबल सुरक्षा प्लग और गैसकेट रिलीज सिस्टम की जांच।",
    },
  },
  {
    id: "q-concrete-is456",
    category: "civil_materials",
    standardNumber: "IS 456",
    iconName: "Building2",
    tag: {
      en: "Structural Code",
      hi: "संरचनात्मक कोड",
    },
    title: {
      en: "Concrete Code & Water",
      hi: "कंक्रीट निर्माण एवं जल",
    },
    prompt: {
      en: "What are the cement quality requirements and can potable water conforming to IS 10500 be used under IS 456?",
      hi: "IS 456:2000 के तहत सीमेंट की आवश्यकताएं क्या हैं और क्या IS 10500 पेय जल का उपयोग कंक्रीट मिश्रण में हो सकता है?",
    },
    chipLabel: {
      en: "Concrete Code IS 456",
      hi: "कंक्रीट कोड IS 456",
    },
    desc: {
      en: "Standards for 33/43/53 grade OPC (IS 269, IS 8112) and water suitability for structural mixing.",
      hi: "OPC सीमेंट ग्रेड और कंक्रीट निर्माण में पेय जल की उपयुक्तता के आधिकारिक नियम।",
    },
  },
  {
    id: "q-verify-isi",
    category: "consumer",
    standardNumber: "e-BIS",
    iconName: "CheckCircle2",
    tag: {
      en: "Anti-Counterfeit",
      hi: "लाइसेंस सत्यापन",
    },
    title: {
      en: "Verify ISI License",
      hi: "ISI मार्क कैसे जांचें?",
    },
    prompt: {
      en: "How can a consumer verify if an ISI Mark and 7-digit CML license number is authentic using the BIS Care App?",
      hi: "उपभोक्ता BIS केयर ऐप या e-BIS पोर्टल से 7-अंकीय CML लाइसेंस नंबर कैसे सत्यापित कर सकते हैं?",
    },
    chipLabel: {
      en: "Verify ISI License",
      hi: "ISI मार्क जांचें",
    },
    desc: {
      en: "Step-by-step guidance to authenticate CM/L numbers and report counterfeit marks to BIS.",
      hi: "CM/L नंबर सत्यापित करने और नकली उत्पादों की शिकायत दर्ज करने की आधिकारिक प्रक्रिया।",
    },
  },
  {
    id: "q-bilingual-water",
    category: "bilingual",
    standardNumber: "IS 10500",
    iconName: "Globe2",
    tag: {
      en: "हिन्दी / English",
      hi: "द्विभाषी प्रश्न",
    },
    title: {
      en: "Devanagari Bilingual Query",
      hi: "हिन्दी में प्रश्न (Bilingual)",
    },
    prompt: {
      en: "पीने के पानी के लिए BIS मानक क्या है और कौन से मुख्य परीक्षण अनिवार्य हैं?",
      hi: "पीने के पानी के लिए BIS मानक क्या है और कौन से मुख्य परीक्षण अनिवार्य हैं?",
    },
    chipLabel: {
      en: "हिन्दी: पेयजल मानक",
      hi: "पेयजल मानक प्रश्न",
    },
    desc: {
      en: "Demonstrates cross-lingual Devanagari query grounding and technical preservation.",
      hi: "देवनागरी लिपि में तकनीकी संदर्भ और BIS क्लॉज सत्यापन का वास्तविक प्रदर्शन।",
    },
  },
  {
    id: "q-bilingual-qco",
    category: "bilingual",
    standardNumber: "IS 14543",
    iconName: "Globe2",
    tag: {
      en: "हिन्दी / English",
      hi: "द्विभाषी प्रश्न",
    },
    title: {
      en: "QCO Mandate in Hindi",
      hi: "QCO आदेश एवं कानूनी स्थिति",
    },
    prompt: {
      en: "क्या भारत में घरेलू बर्तन या पानी की बोतलें बिना ISI मार्क के बेचना कानूनी रूप से प्रतिबंधित है?",
      hi: "क्या भारत में घरेलू बर्तन या पानी की बोतलें बिना ISI मार्क के बेचना कानूनी रूप से प्रतिबंधित है?",
    },
    chipLabel: {
      en: "हिन्दी: बर्तन QCO प्रतिबंध",
      hi: "बर्तन QCO प्रतिबंध",
    },
    desc: {
      en: "Examines Section 17 of BIS Act 2016 penalties and mandatory ISI certification in Devanagari.",
      hi: "बीआईएस अधिनियम 2016 की धारा 17 के तहत जब्ती और कानूनी दंड की स्थिति की समीक्षा।",
    },
  },
];
