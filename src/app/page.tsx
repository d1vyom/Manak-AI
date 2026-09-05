// src/app/page.tsx
"use client";

import Link from "next/link";
import {
  Search,
  FileCheck2,
  GitFork,
  ArrowRight,
  Sparkles,
  Award,
  FileText,
  ShieldCheck,
  CheckSquare,
} from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { t } from "@/lib/utils/i18n";

export default function HomePage() {
  const { language } = useAppStore();

  const exampleQueries = [
    {
      title: language === "hi" ? "निर्माता प्रश्न" : "Manufacturer Query",
      text: "I manufacture stainless steel water bottles. Which BIS standards apply?",
      tag: language === "hi" ? "अनिवार्य QCO" : "Mandatory QCO",
    },
    {
      title: language === "hi" ? "उपभोक्ता प्रश्न" : "Consumer Query",
      text: "How do I verify if a pressure cooker has a valid ISI Mark?",
      tag: language === "hi" ? "उपभोक्ता सुरक्षा" : "Consumer Safety",
    },
    {
      title: "Hindi Query",
      text: "खिलौनों की सुरक्षा के लिए कौन से बीआईएस मानक अनिवार्य हैं?",
      tag: "हिन्दी / Multilingual",
    },
    {
      title: language === "hi" ? "परीक्षण आवश्यकताएं" : "Testing Requirements",
      text: "What are the chemical testing limits for drinking water under IS 10500:2012?",
      tag: language === "hi" ? "खंड संदर्भ" : "Clause Citations",
    },
  ];

  const features = [
    {
      icon: Search,
      title: language === "hi" ? "हाइब्रिड मानक पुनर्प्राप्ति" : "Hybrid Standards Retrieval",
      description:
        language === "hi"
          ? "19,000+ भारतीय मानकों को सटीकता से अनुक्रमित करने के लिए सिमेंटिक pgvector एम्बेडिंग और कीवर्ड सर्च (RRF) को जोड़ता है।"
          : "Combines semantic pgvector embeddings with lexical keyword search (RRF fusion) to accurately index 19,000+ Indian Standards.",
    },
    {
      icon: FileCheck2,
      title: language === "hi" ? "खंड-स्तरीय सत्यापनीय संदर्भ" : "Clause-Level Verifiable Citations",
      description:
        language === "hi"
          ? "हर तथ्यात्मक उत्तर मतिभ्रम रोकने के लिए सटीक मानक संख्या, खंड, अनुभाग और पृष्ठ संख्या का हवाला देता है।"
          : "Every factual answer cites the exact Standard Number, Clause, Section, and Page Number with direct source links to prevent hallucination.",
    },
    {
      icon: Award,
      title: language === "hi" ? "अनिवार्य बनाम स्वैच्छिक स्थिति" : "Mandatory vs Voluntary Detection",
      description:
        language === "hi"
          ? "गुणवत्ता नियंत्रण आदेशों (QCO) की पहचान करके स्वचालित रूप से भेद करता है कि अनुपालन कानूनी रूप से अनिवार्य है या स्वैच्छिक।"
          : "Automatically identifies Quality Control Orders (QCOs) to distinguish whether compliance is legally mandatory or voluntary.",
    },
    {
      icon: GitFork,
      title: language === "hi" ? "AI अनुपालन प्रमाणन मार्ग" : "AI Compliance Pathway",
      description:
        language === "hi"
          ? "सामग्री चयन और प्रयोगशाला परीक्षण से लेकर फैक्ट्री निरीक्षण और ISI मार्क आवेदन तक एक संपूर्ण चरणबद्ध रोडमैप बनाता है।"
          : "Generates a complete step-by-step roadmap from material selection and lab testing to factory inspection and BIS ISI Mark application.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-900 via-navy-800 to-navy-950 py-20 text-white sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(242,140,40,0.15),transparent_50%)]" />
        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-3.5 py-1.5 text-xs font-semibold text-saffron-300 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-saffron-400" />
              <span>{t("heroBadge", language)}</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl sm:leading-none">
              {language === "hi" ? (
                <>
                  एआई-संचालित <span className="text-saffron-400">BIS अनुपालन</span> इंटेलिजेंस
                </>
              ) : (
                <>
                  AI-Powered <span className="text-saffron-400">BIS Compliance</span> Intelligence
                </>
              )}
            </h1>

            <p className="mt-6 text-base sm:text-lg text-navy-100 leading-relaxed max-w-2xl mx-auto">
              {t("heroSubtitle", language)}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/chat"
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-saffron-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-saffron-500/25 transition-all hover:bg-saffron-600 hover:shadow-saffron-500/40"
              >
                <span>{t("launchAiAssistant", language)}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/explore"
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
              >
                <FileText className="h-4 w-4 text-saffron-400" />
                <span>{t("exploreStandardsBtn", language)}</span>
              </Link>
              <Link
                href="/compliance"
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
              >
                <CheckSquare className="h-4 w-4 text-emerald-400" />
                <span>{t("runGapAuditBtn", language)}</span>
              </Link>
            </div>

            {/* Quick Stats Banner */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-white/10 pt-8 text-left">
              <div className="rounded-xl bg-white/5 p-3.5 backdrop-blur-sm border border-white/5">
                <div className="text-2xl font-extrabold text-saffron-400">{t("statStandardsNum", language)}</div>
                <div className="text-[11px] text-navy-200 mt-0.5">{t("statStandardsLabel", language)}</div>
              </div>
              <div className="rounded-xl bg-white/5 p-3.5 backdrop-blur-sm border border-white/5">
                <div className="text-2xl font-extrabold text-emerald-400">{t("statCitationsNum", language)}</div>
                <div className="text-[11px] text-navy-200 mt-0.5">{t("statCitationsLabel", language)}</div>
              </div>
              <div className="rounded-xl bg-white/5 p-3.5 backdrop-blur-sm border border-white/5">
                <div className="text-2xl font-extrabold text-white">{t("statQcoNum", language)}</div>
                <div className="text-[11px] text-navy-200 mt-0.5">{t("statQcoLabel", language)}</div>
              </div>
              <div className="rounded-xl bg-white/5 p-3.5 backdrop-blur-sm border border-white/5">
                <div className="text-2xl font-extrabold text-saffron-300">{t("statBilingualNum", language)}</div>
                <div className="text-[11px] text-navy-200 mt-0.5">{t("statBilingualLabel", language)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Queries Section */}
      <section className="border-b border-navy-100 bg-white py-12 dark:bg-navy-950 dark:border-navy-900">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400">
              {t("demoTitle", language)}
            </h2>
            <p className="mt-1 text-2xl font-bold text-navy-900 dark:text-white">
              {t("demoSubtitle", language)}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {exampleQueries.map((q, idx) => (
              <Link
                key={idx}
                href={`/chat?q=${encodeURIComponent(q.text)}`}
                className="group flex flex-col justify-between rounded-xl border border-navy-100 bg-slate-50/70 p-5 transition-all hover:border-saffron-300 hover:bg-white hover:shadow-md dark:border-navy-800 dark:bg-navy-900/50 dark:hover:border-saffron-500/40"
              >
                <div>
                  <span className="inline-block rounded-md bg-navy-100 px-2.5 py-0.5 text-[11px] font-semibold text-navy-800 dark:bg-navy-800 dark:text-navy-200">
                    {q.tag}
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-navy-900 group-hover:text-saffron-600 dark:text-white">
                    {q.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-3">
                    &ldquo;{q.text}&rdquo;
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-saffron-600 group-hover:translate-x-0.5 transition-transform">
                  <span>{language === "hi" ? "प्रश्न पूछें" : "Ask query"}</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-navy-900/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400">
              {t("featuresTitle", language)}
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-navy-900 dark:text-white">
              {t("featuresSubtitle", language)}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("featuresDesc", language)}
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="relative rounded-2xl border border-navy-100/80 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 dark:border-navy-800 dark:bg-navy-900"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-navy-800 dark:bg-navy-800 dark:text-saffron-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-navy-900 dark:text-white">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compliance Guarantee Banner */}
      <section className="bg-navy-900 py-14 text-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border border-navy-700 bg-navy-800/60 p-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-saffron-400 mb-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Section 17 BIS Act Compliance</span>
              </div>
              <h3 className="text-xl font-bold">{t("ctaTitle", language)}</h3>
              <p className="mt-1 text-sm text-navy-200">
                {t("ctaDesc", language)}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/compliance"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
              >
                <span>{t("runGapAuditBtn", language)}</span>
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-lg bg-saffron-500 px-6 py-3 text-sm font-bold text-white shadow hover:bg-saffron-600 transition-colors"
              >
                <span>{t("launchAiAssistant", language)}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
