// src/components/chat/ChatEmptyState.tsx
"use client";

import { Shield, ArrowRight, BookOpen, Award, FileCheck2, Globe2 } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";

interface ChatEmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

export function ChatEmptyState({ onSelectPrompt }: ChatEmptyStateProps) {
  const { language } = useAppStore();

  const examplePrompts = [
    {
      icon: Award,
      title: language === "hi" ? "निर्माता अनुपालन (Manufacturer)" : "Manufacturer Compliance",
      tag: language === "hi" ? "अनिवार्य QCO" : "Mandatory QCO",
      prompt: "Which BIS standards apply to stainless steel water bottles?",
      desc: language === "hi" ? "QCO आदेश S.O. 2655(E), IS 14543 आवश्यकताएं और ISI मार्क जांचें।" : "Checks QCO order S.O. 2655(E), IS 14543 requirements, and ISI mark applicability.",
    },
    {
      icon: FileCheck2,
      title: language === "hi" ? "खिलौना सुरक्षा मानक (Toys)" : "Toy Safety Standards",
      tag: language === "hi" ? "सुरक्षा एवं रसायन" : "Safety & Chemical",
      prompt: "Is BIS certification mandatory for toys under Toys QCO 2020?",
      desc: language === "hi" ? "IS 9873 यांत्रिक/ज्वलनशीलता सीमाएं और राजपत्र अधिदेश जांचें।" : "Examines IS 9873 mechanical/flammability limits and Gazette mandates.",
    },
    {
      icon: BookOpen,
      title: language === "hi" ? "पेयजल गुणवत्ता सीमाएं" : "Drinking Water Quality",
      tag: language === "hi" ? "परीक्षण सीमाएं" : "Test Limits",
      prompt: "What are the chemical testing limits for drinking water under IS 10500:2012?",
      desc: language === "hi" ? "TDS, pH, सीसा (Lead) और कीटनाशकों के लिए स्वीकार्य सीमाएं।" : "Retrieves permissible and acceptable limits for TDS, pH, lead, and pesticides.",
    },
    {
      icon: Globe2,
      title: "हिन्दी में प्रश्न (Bilingual)",
      tag: "हिन्दी / English",
      prompt: "पीने के पानी के लिए BIS मानक क्या है और कौन से टेस्ट अनिवार्य हैं?",
      desc: language === "hi" ? "देवनागरी लिपि में तकनीकी संदर्भ और BIS क्लॉज सत्यापन।" : "Demonstrates cross-lingual Devanagari query grounding and technical preservation.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center sm:py-12">
      {/* Emblem Badge */}
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 shadow-xl ring-4 ring-saffron-500/20">
        <Shield className="h-8 w-8 text-saffron-400" />
        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-saffron-400 opacity-75" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-saffron-500" />
        </span>
      </div>

      <h2 className="mt-5 text-xl font-extrabold tracking-tight text-navy-900 sm:text-2xl dark:text-white">
        {language === "hi"
          ? "भारतीय मानक ब्यूरो AI इंटेलिजेंस"
          : "Bureau of Indian Standards AI Intelligence"}
      </h2>
      <p className="mt-2 max-w-lg text-xs leading-relaxed text-muted-foreground sm:text-sm">
        {language === "hi"
          ? "19,000+ भारतीय मानकों, गुणवत्ता नियंत्रण आदेशों (QCOs), अनुमेय परीक्षण सीमाओं और ISI मार्क प्रमाणन मार्गों के बारे में विनियामक प्रश्न पूछें।"
          : "Ask regulatory questions about 19,000+ Indian Standards, Quality Control Orders (QCOs), permissible test limits, and ISI Mark certification pathways."}
      </p>

      {/* 4 Clickable Example Cards */}
      <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2 text-left">
        {examplePrompts.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPrompt(item.prompt)}
              className="group flex flex-col justify-between rounded-xl border border-navy-200/80 bg-white p-4 text-left shadow-sm transition-all hover:border-saffron-400 hover:bg-saffron-50/20 hover:shadow-md dark:border-navy-800 dark:bg-navy-900/60 dark:hover:border-saffron-500/40"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded bg-navy-100 px-2 py-0.5 text-[10px] font-bold text-navy-800 dark:bg-navy-800 dark:text-navy-200">
                    <Icon className="h-3 w-3 text-saffron-500" />
                    {item.tag}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-saffron-500" />
                </div>
                <h3 className="mt-2.5 text-xs font-bold text-navy-900 group-hover:text-saffron-600 dark:text-white dark:group-hover:text-saffron-400">
                  {item.title}
                </h3>
                <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                  &ldquo;{item.prompt}&rdquo;
                </p>
              </div>
              <span className="mt-3 text-[10px] text-muted-foreground/80 line-clamp-1">
                {item.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
