// src/components/chat/ChatEmptyState.tsx
"use client";

import { useState } from "react";
import {
  Shield,
  ArrowRight,
  BookOpen,
  Award,
  FileCheck2,
  Globe2,
  HardHat,
  Building2,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import {
  CHATBOT_QUESTIONS_DATASET,
  QuestionCategory,
  ChatbotQuestionItem,
} from "@/lib/data/chatbot-questions";

interface ChatEmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

const ICONS_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  FileCheck2,
  BookOpen,
  Globe2,
  HardHat,
  Building2,
  ShieldAlert,
  CheckCircle2,
};

const CATEGORIES: { id: QuestionCategory; label: { en: string; hi: string } }[] = [
  { id: "all", label: { en: "All Questions", hi: "सभी प्रश्न" } },
  { id: "qco", label: { en: "Mandatory QCOs", hi: "अनिवार्य QCO" } },
  { id: "safety", label: { en: "Safety Standards", hi: "सुरक्षा मानक" } },
  { id: "test_limits", label: { en: "Test Limits", hi: "परीक्षण सीमाएं" } },
  { id: "civil_materials", label: { en: "Steel & Concrete", hi: "स्टील एवं कंक्रीट" } },
  { id: "bilingual", label: { en: "हिन्दी (Devanagari)", hi: "हिन्दी प्रश्न" } },
];

export function ChatEmptyState({ onSelectPrompt }: ChatEmptyStateProps) {
  const { language } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>("all");

  const filteredQuestions =
    selectedCategory === "all"
      ? CHATBOT_QUESTIONS_DATASET
      : CHATBOT_QUESTIONS_DATASET.filter((q) => q.category === selectedCategory);

  return (
    <div className="flex flex-col items-center justify-center py-6 text-center sm:py-10">
      {/* Emblem Badge */}
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 shadow-xl ring-4 ring-saffron-500/20">
        <Shield className="h-7 w-7 text-saffron-400" />
        <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-saffron-400 opacity-75" />
          <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-saffron-500" />
        </span>
      </div>

      <h2 className="mt-4 text-xl font-extrabold tracking-tight text-navy-900 sm:text-2xl dark:text-white">
        {language === "hi"
          ? "भारतीय मानक ब्यूरो AI इंटेलिजेंस"
          : "Bureau of Indian Standards AI Intelligence"}
      </h2>
      <p className="mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
        {language === "hi"
          ? "19,000+ भारतीय मानकों, गुणवत्ता नियंत्रण आदेशों (QCOs), अनुमेय परीक्षण सीमाओं और ISI मार्क प्रमाणन मार्गों के बारे में विनियामक प्रश्न पूछें।"
          : "Ask regulatory questions about 19,000+ Indian Standards, Quality Control Orders (QCOs), permissible test limits, and ISI Mark certification pathways."}
      </p>

      {/* Category Filter Pills */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 max-w-2xl px-2">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count =
            cat.id === "all"
              ? CHATBOT_QUESTIONS_DATASET.length
              : CHATBOT_QUESTIONS_DATASET.filter((q) => q.category === cat.id).length;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-saffron-500 text-white shadow-xs dark:bg-saffron-600"
                  : "bg-white text-navy-800 hover:bg-slate-100 dark:bg-navy-900/80 dark:text-navy-200 dark:hover:bg-navy-800 border border-navy-200/80 dark:border-navy-800"
              }`}
            >
              <span>{cat.label[language === "hi" ? "hi" : "en"]}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-muted-foreground dark:bg-navy-800 dark:text-navy-300"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Interactive Question Cards */}
      <div className="mt-6 grid w-full max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-2 text-left px-2">
        {filteredQuestions.map((item: ChatbotQuestionItem) => {
          const Icon = ICONS_MAP[item.iconName] || BookOpen;
          const promptText = item.prompt[language === "hi" ? "hi" : "en"];
          const titleText = item.title[language === "hi" ? "hi" : "en"];
          const descText = item.desc[language === "hi" ? "hi" : "en"];
          const tagText = item.tag[language === "hi" ? "hi" : "en"];

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectPrompt(promptText)}
              className="group flex flex-col justify-between rounded-xl border border-navy-200/80 bg-white p-3.5 text-left shadow-xs transition-all hover:border-saffron-400 hover:bg-saffron-50/20 hover:shadow-md dark:border-navy-800 dark:bg-navy-900/60 dark:hover:border-saffron-500/40 dark:hover:bg-navy-900"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded bg-navy-100 px-2 py-0.5 text-[10px] font-bold text-navy-800 dark:bg-navy-800 dark:text-navy-200">
                      <Icon className="h-3 w-3 text-saffron-500" />
                      {tagText}
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-muted-foreground">
                      {item.standardNumber}
                    </span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-saffron-500 shrink-0" />
                </div>

                <h3 className="mt-2 text-xs font-bold text-navy-900 group-hover:text-saffron-600 dark:text-white dark:group-hover:text-saffron-400 leading-snug">
                  {titleText}
                </h3>
                <p className="mt-1 text-[11px] text-navy-700 dark:text-navy-200 font-medium line-clamp-2 leading-relaxed">
                  &ldquo;{promptText}&rdquo;
                </p>
              </div>

              <span className="mt-2.5 text-[10px] text-muted-foreground/80 line-clamp-1 border-t border-border/40 pt-2">
                {descText}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

