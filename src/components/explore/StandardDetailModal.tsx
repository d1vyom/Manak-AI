// src/components/explore/StandardDetailModal.tsx
"use client";

import { useEffect, useState } from "react";
import {
  X,
  ShieldAlert,
  ShieldCheck,
  BookOpen,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Table as TableIcon,
} from "lucide-react";
import Link from "next/link";
import { StandardSummary } from "@/types/api";
import { getRelatedStandards } from "@/lib/data/standards-graph";
import { useAppStore } from "@/lib/store/app-store";
import { t } from "@/lib/utils/i18n";
import { ClauseTableRenderer } from "./ClauseTableRenderer";

interface StandardDetailModalProps {
  standard: StandardSummary | null;
  onClose: () => void;
}

export function StandardDetailModal({ standard, onClose }: StandardDetailModalProps) {
  const { language } = useAppStore();
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Lock body scroll while modal is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    if (!standard) return;
    setLoading(true);

    fetch(`/api/standards?id=${encodeURIComponent(standard.standardNumber)}`)
      .then((res) => res.json())
      .then((data) => {
        setDetails(data);
      })
      .catch((err) => console.error("Failed to load details:", err))
      .finally(() => setLoading(false));
  }, [standard]);

  if (!standard) return null;

  const related = getRelatedStandards(standard.standardNumber);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl border border-navy-700/20 bg-white shadow-2xl dark:border-navy-800 dark:bg-navy-950 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-standard-title"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-navy-100 bg-navy-50/50 p-4 sm:p-5 dark:border-navy-800 dark:bg-navy-900/50">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-navy-800 text-white shadow-md dark:bg-navy-700">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-saffron-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  id="modal-standard-title"
                  className="font-mono text-base font-extrabold text-navy-900 dark:text-white"
                >
                  {standard.fullDesignation || standard.standardNumber}
                </span>
                {standard.isMandatory ? (
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    {t("mandatoryIsiMark", language)}
                  </span>
                ) : (
                  <span className="rounded bg-navy-100 px-2 py-0.5 text-xs font-medium text-navy-700 dark:bg-navy-800 dark:text-navy-300">
                    {t("statusVoluntary", language)}
                  </span>
                )}
              </div>
              <h2 className="mt-1 text-xs sm:text-sm font-semibold text-navy-800 dark:text-navy-100">
                {standard.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-slate-200 hover:text-navy-900 dark:hover:bg-navy-800 dark:hover:text-white transition-colors"
            title="Close modal (Esc)"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Scope Summary */}
          {standard.scopeSummary && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400">
                {t("modalScopeTitle", language)}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {standard.scopeSummary}
              </p>
            </div>
          )}

          {/* QCO Gazette Notification Info */}
          {standard.qcoDetails && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/40 p-4 dark:border-emerald-500/20 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <ShieldAlert className="h-4 w-4 text-emerald-600" />
                <span>{t("modalQcoTitle", language)}</span>
              </div>
              <p className="mt-2 font-mono text-xs text-navy-900 dark:text-white font-semibold">
                {t("modalQcoOrder", language)} {standard.qcoDetails.qcoNumber}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {standard.qcoDetails.qcoTitle}
              </p>
              <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400">
                {t("modalEffectiveDate", language)} <strong>{standard.qcoDetails.effectiveDate}</strong>
              </p>
            </div>
          )}

          {/* Indexed Clauses & Specifications */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-2">
              <Sparkles className="h-5 w-5 animate-spin text-saffron-500" />
              <span className="text-xs text-muted-foreground font-medium">
                {t("indexingStandards", language)}
              </span>
            </div>
          ) : details?.chunks && details.chunks.length > 0 ? (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400">
                  {t("modalClausesTitle", language)} ({details.chunks.length})
                </h4>
                <span className="text-[10px] text-muted-foreground">
                  {language === "hi"
                    ? "आधिकारिक विनियामक खंड व विशिष्टता तालिकाएँ"
                    : "Authoritative clauses & specification tables"}
                </span>
              </div>

              <div className="mt-3 space-y-3">
                {details.chunks.map((chunk: any) => {
                  const hasTable =
                    chunk.chunkType === "table" ||
                    chunk.content?.includes("|---|") ||
                    chunk.content?.includes("| --- |");

                  return (
                    <div
                      key={chunk.id}
                      className="rounded-xl border border-navy-200/80 bg-slate-50/70 p-3.5 sm:p-4 text-xs dark:border-navy-800 dark:bg-navy-900/60 shadow-2xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-100/70 pb-2.5 font-bold text-navy-900 dark:border-navy-800/70 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-extrabold text-navy-950 dark:text-white">
                            {chunk.clauseNumber}: {chunk.clauseTitle}
                          </span>
                          {hasTable && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold text-amber-800 dark:text-amber-300">
                              <TableIcon className="h-2.5 w-2.5" />
                              {language === "hi" ? "मानक तालिका" : "Standard Table"}
                            </span>
                          )}
                        </div>
                        <span className="rounded bg-white px-2 py-0.5 text-[10px] font-medium text-muted-foreground shadow-2xs border border-navy-100 dark:border-navy-800 dark:bg-navy-800">
                          {t("page", language)} {chunk.pageNumberStart}
                        </span>
                      </div>

                      {/* Content with Tabular Rendering */}
                      <div className="mt-2.5">
                        <ClauseTableRenderer
                          content={chunk.content}
                          language={language}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Normative Companion Standards */}
          {related.length > 0 && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400">
                  {t("modalCompanionTitle", language)} ({related.length})
                </h4>
                <span className="text-[10px] text-muted-foreground">
                  {language === "hi"
                    ? "सहयोगी व परीक्षण मानक संदर्भ"
                    : "Companion & normative test standards"}
                </span>
              </div>

              {/* High-density Tabular Form for Companion Standards */}
              <div className="mt-3 overflow-hidden rounded-xl border border-navy-200/80 bg-white shadow-2xs dark:border-navy-800 dark:bg-navy-950/70">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[420px] border-collapse">
                    <thead>
                      <tr className="border-b border-navy-100 bg-navy-50/80 text-[11px] font-bold uppercase tracking-wider text-navy-900 dark:border-navy-800 dark:bg-navy-900/80 dark:text-white">
                        <th className="px-3.5 py-2.5 whitespace-nowrap">
                          {language === "hi" ? "मानक कोड" : "Standard Code"}
                        </th>
                        <th className="px-3.5 py-2.5">
                          {language === "hi" ? "शीर्षक व विवरण" : "Title & Description"}
                        </th>
                        <th className="px-3.5 py-2.5 whitespace-nowrap">
                          {language === "hi" ? "विनियामक संबंध" : "Relationship"}
                        </th>
                        <th className="px-3.5 py-2.5 text-right whitespace-nowrap">
                          {language === "hi" ? "स्थिति" : "Status"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-100/60 dark:divide-navy-800/60 font-sans">
                      {related.map((rel, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50/70 dark:hover:bg-navy-900/40 transition-colors"
                        >
                          <td className="px-3.5 py-2.5 font-mono font-bold text-navy-950 dark:text-white whitespace-nowrap">
                            {rel.standardNumber}
                          </td>
                          <td className="px-3.5 py-2.5 text-navy-800 dark:text-slate-200 text-xs">
                            {rel.title}
                          </td>
                          <td className="px-3.5 py-2.5 text-[11px] font-medium text-saffron-700 dark:text-saffron-300 whitespace-nowrap">
                            {rel.relationship}
                          </td>
                          <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                            {rel.mandatoryStatus === "mandatory" ? (
                              <span className="inline-flex items-center rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">
                                Mandatory
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-md bg-navy-100 dark:bg-navy-800 px-2 py-0.5 text-[10px] font-medium text-navy-700 dark:text-navy-300 uppercase">
                                Voluntary
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-navy-100 bg-navy-50/50 p-3.5 sm:p-4 dark:border-navy-800 dark:bg-navy-900/50">
          <a
            href={
              standard.sourceUrl && !standard.sourceUrl.includes("services.bis.gov.in")
                ? standard.sourceUrl
                : "https://www.bis.gov.in/standards/?lang=en"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-navy-900 dark:hover:text-white transition-colors"
          >
            <span>{t("modalOfficialBisRecord", language)}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/compliance?product=${encodeURIComponent(standard.title)}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-lg border border-navy-300 bg-white px-3 py-2 text-xs font-bold text-navy-900 hover:bg-slate-50 dark:border-navy-700 dark:bg-navy-800 dark:text-white dark:hover:bg-navy-700 shadow-xs transition-colors"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>{t("modalAuditProduct", language)}</span>
            </Link>

            <Link
              href={`/chat?q=${encodeURIComponent(
                `What are the technical and testing compliance requirements for ${standard.standardNumber}: ${standard.title}?`
              )}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-lg bg-saffron-500 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-saffron-600 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t("modalAskAssistant", language)}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
