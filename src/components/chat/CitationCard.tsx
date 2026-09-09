// src/components/chat/CitationCard.tsx
"use client";

import { useState } from "react";
import { ExternalLink, Copy, Check, BookOpen, ShieldAlert, ShieldCheck, FileText } from "lucide-react";
import { Citation } from "@/types/citations";
import { useAppStore } from "@/lib/store/app-store";
import { t } from "@/lib/utils/i18n";
import { formatRefNumber, parseQuoteContent } from "@/lib/utils/format";
import { ClauseTableRenderer } from "../explore/ClauseTableRenderer";

interface CitationCardProps {
  citation: Citation;
}

export function CitationCard({ citation }: CitationCardProps) {
  const { highlightedCitationId, setHighlightedCitationId, language } = useAppStore();
  const [copied, setCopied] = useState(false);

  const isHighlighted = highlightedCitationId === citation.refId;
  const numOnly = formatRefNumber(citation.refId);
  const parsedQuote = parseQuoteContent(citation.quote || "");

  const handleCopyQuote = () => {
    const textToCopy = parsedQuote.formattedText
      ? `"${parsedQuote.formattedText}" — ${citation.standardNumber}, ${citation.clauseNumber}`
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
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex h-6 shrink-0 items-center gap-1 rounded-md bg-navy-800 px-2 text-[11px] font-semibold text-white shadow-xs dark:bg-navy-700">
            <FileText className="h-3 w-3 text-saffron-400 shrink-0" />
            <span>Source {numOnly}</span>
          </span>

          <span className="font-mono text-xs font-bold text-navy-900 dark:text-white">
            {citation.standardNumber}
          </span>

          {citation.pageNumber && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-navy-800 dark:text-navy-300">
              {t("page", language)} {citation.pageNumber}
            </span>
          )}
        </div>

        {citation.mandatoryStatus === "mandatory" ? (
          <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 shrink-0">
            <ShieldAlert className="h-3 w-3" />
            {t("statusMandatory", language)}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded bg-navy-100 px-2 py-0.5 text-[10px] font-medium text-navy-700 dark:bg-navy-800 dark:text-navy-300 shrink-0">
            <ShieldCheck className="h-3 w-3" />
            {t("statusVoluntary", language)}
          </span>
        )}
      </div>

      {/* Prominent Clause Headline & Standard Context */}
      <div className="mt-2.5">
        <div className="flex items-start gap-1.5">
          <BookOpen className="mt-0.5 h-3.5 w-3.5 text-saffron-500 shrink-0" />
          <h4 className="text-xs font-bold leading-snug text-navy-900 dark:text-white">
            {citation.clauseNumber ? `${citation.clauseNumber}: ` : ""}
            {citation.clauseTitle || "Clause Specification"}
          </h4>
        </div>
        <p className="mt-0.5 pl-5 text-[11px] text-muted-foreground line-clamp-1">
          {citation.documentTitle}
        </p>
      </div>

      {/* Verbatim Quote Excerpt / Structured Spec / Clause Table */}
      {parsedQuote.rawText && (
        <div className="mt-3 rounded-r-lg border-l-3 border-saffron-500 bg-slate-50/90 p-3 text-xs leading-relaxed text-navy-900 dark:bg-navy-950/60 dark:text-navy-100 shadow-2xs">
          {parsedQuote.type === "table" ? (
            <div className="pt-0.5">
              <ClauseTableRenderer content={parsedQuote.tableMarkdown || parsedQuote.formattedText} language={language} />
            </div>
          ) : parsedQuote.type === "metric_row" && parsedQuote.parameter && parsedQuote.acceptableLimit ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-1.5">
                <span className="font-semibold text-xs text-navy-900 dark:text-white">
                  {parsedQuote.parameter}
                </span>
                <span className="rounded bg-saffron-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-saffron-800 dark:bg-saffron-950/60 dark:text-saffron-300">
                  Specification
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md border border-slate-200/80 bg-white p-2 dark:border-navy-800/80 dark:bg-navy-900/80">
                  <span className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    Acceptable Limit
                  </span>
                  <span className="mt-0.5 block font-mono font-bold text-navy-900 dark:text-emerald-400">
                    {parsedQuote.acceptableLimit}
                  </span>
                </div>
                <div className="rounded-md border border-slate-200/80 bg-white p-2 dark:border-navy-800/80 dark:bg-navy-900/80">
                  <span className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    Permissible Limit
                  </span>
                  <span className="mt-0.5 block font-mono font-semibold text-navy-700 dark:text-navy-200">
                    {parsedQuote.permissibleLimit || "No relaxation"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="line-clamp-4 pl-1 italic text-navy-800 dark:text-navy-200">
              &ldquo;{parsedQuote.formattedText}&rdquo;
            </p>
          )}
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

