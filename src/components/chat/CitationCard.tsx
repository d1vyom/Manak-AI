// src/components/chat/CitationCard.tsx
"use client";

import { useState } from "react";
import { ExternalLink, Copy, Check, BookOpen, Quote, ShieldAlert, ShieldCheck, FileText } from "lucide-react";
import { Citation } from "@/types/citations";
import { useAppStore } from "@/lib/store/app-store";
import { t } from "@/lib/utils/i18n";
import { cleanQuoteText, formatRefNumber } from "@/lib/utils/format";

interface CitationCardProps {
  citation: Citation;
}

export function CitationCard({ citation }: CitationCardProps) {
  const { highlightedCitationId, setHighlightedCitationId, language } = useAppStore();
  const [copied, setCopied] = useState(false);

  const isHighlighted = highlightedCitationId === citation.refId;
  const numOnly = formatRefNumber(citation.refId);
  const formattedQuote = cleanQuoteText(citation.quote || "");

  const handleCopyQuote = () => {
    const textToCopy = formattedQuote
      ? `"${formattedQuote}" — ${citation.standardNumber}, ${citation.clauseNumber}`
      : `${citation.standardNumber}, ${citation.clauseNumber} (${citation.documentTitle})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id={`citation-card-${citation.refId}`}
      onClick={() => setHighlightedCitationId(citation.refId)}
      className={`group relative rounded-xl border p-4 transition-all duration-300 ${
        isHighlighted
          ? "border-saffron-500 bg-saffron-50/40 shadow-lg ring-2 ring-saffron-500/30 dark:border-saffron-400 dark:bg-saffron-950/20"
          : "border-navy-200/80 bg-white hover:border-navy-400 hover:shadow-md dark:border-navy-800 dark:bg-navy-900/60 dark:hover:border-navy-700"
      }`}
    >
      {/* Header: Ref pill + Standard Number + Mandatory Tag */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 shrink-0 items-center gap-1 rounded-md bg-navy-800 px-2 text-[11px] font-semibold text-white shadow-xs dark:bg-navy-700">
            <FileText className="h-3 w-3 text-saffron-400 shrink-0" />
            <span>Source {numOnly}</span>
          </span>
          <div>
            <h4 className="font-mono text-sm font-bold text-navy-900 group-hover:text-saffron-600 dark:text-white dark:group-hover:text-saffron-400">
              {citation.standardNumber}
            </h4>
          </div>
        </div>

        {citation.mandatoryStatus === "mandatory" ? (
          <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <ShieldAlert className="h-3 w-3" />
            {t("statusMandatory", language)}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded bg-navy-100 px-2 py-0.5 text-[10px] font-medium text-navy-700 dark:bg-navy-800 dark:text-navy-300">
            <ShieldCheck className="h-3 w-3" />
            {t("statusVoluntary", language)}
          </span>
        )}
      </div>

      {/* Title */}
      <p className="mt-2 text-xs font-medium text-navy-800 line-clamp-2 dark:text-navy-100">
        {citation.documentTitle}
      </p>

      {/* Clause & Page Location */}
      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-800 dark:bg-navy-800 dark:text-navy-200">
          <BookOpen className="h-3 w-3 text-saffron-500" />
          {citation.clauseNumber}: {citation.clauseTitle || "Clause"}
        </span>
        {citation.pageNumber && (
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-700 dark:bg-navy-800 dark:text-navy-300">
            {t("page", language)} {citation.pageNumber}
          </span>
        )}
      </div>

      {/* Verbatim Quote Excerpt */}
      {formattedQuote && (
        <div className="relative mt-3 rounded-lg border-l-2 border-saffron-500 bg-slate-50/90 p-3 text-xs italic leading-relaxed text-navy-900 dark:bg-navy-950/50 dark:text-navy-100">
          <Quote className="absolute -top-1 -left-1 h-3.5 w-3.5 text-saffron-500/40" />
          <p className="line-clamp-4 pl-2">&ldquo;{formattedQuote}&rdquo;</p>
        </div>
      )}

      {/* Footer Actions */}
      <div className="mt-3.5 flex items-center justify-between border-t border-border/60 pt-2.5 text-xs">
        <button
          type="button"
          onClick={handleCopyQuote}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-navy-900 dark:hover:text-white"
          title="Copy verbatim citation quote"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-600" />
              <span className="text-emerald-600 font-semibold">{t("btnQuoteCopied", language)}</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>{t("btnCopyQuote", language)}</span>
            </>
          )}
        </button>

        <a
          href={
            citation.sourceUrl && !citation.sourceUrl.includes("services.bis.gov.in")
              ? citation.sourceUrl
              : `/explore?q=${encodeURIComponent(citation.standardNumber)}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-[11px] text-saffron-600 transition-colors hover:text-saffron-700 hover:underline dark:text-saffron-400"
        >
          <span>{t("btnViewSource", language)}</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
