// src/components/explore/StandardDetailModal.tsx
"use client";

import { useEffect, useState } from "react";
import { X, ShieldAlert, ShieldCheck, BookOpen, ExternalLink, ArrowRight, CheckCircle2, Sparkles, FileText } from "lucide-react";
import Link from "next/link";
import { StandardSummary } from "@/types/api";
import { getRelatedStandards } from "@/lib/data/standards-graph";

interface StandardDetailModalProps {
  standard: StandardSummary | null;
  onClose: () => void;
}

export function StandardDetailModal({ standard, onClose }: StandardDetailModalProps) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-navy-700/20 bg-white shadow-2xl dark:border-navy-800 dark:bg-navy-950 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-navy-100 bg-navy-50/50 p-5 dark:border-navy-800 dark:bg-navy-900/50">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-800 text-white shadow-md dark:bg-navy-700">
              <BookOpen className="h-6 w-6 text-saffron-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-base font-extrabold text-navy-900 dark:text-white">
                  {standard.fullDesignation || standard.standardNumber}
                </span>
                {standard.isMandatory ? (
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    MANDATORY (ISI MARK)
                  </span>
                ) : (
                  <span className="rounded bg-navy-100 px-2 py-0.5 text-xs font-medium text-navy-700 dark:bg-navy-800 dark:text-navy-300">
                    VOLUNTARY
                  </span>
                )}
              </div>
              <h2 className="mt-1 text-sm font-semibold text-navy-800 dark:text-navy-100">
                {standard.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-slate-200 hover:text-navy-900 dark:hover:bg-navy-800 dark:hover:text-white"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Scope Summary */}
          {standard.scopeSummary && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400">
                Official Scope & Applicability
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
                <span>Gazette Quality Control Order (QCO) Reference</span>
              </div>
              <p className="mt-2 font-mono text-xs text-navy-900 dark:text-white font-semibold">
                Order: {standard.qcoDetails.qcoNumber}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {standard.qcoDetails.qcoTitle}
              </p>
              <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400">
                Effective Enforcement Date: <strong>{standard.qcoDetails.effectiveDate}</strong>
              </p>
            </div>
          )}

          {/* Indexed Clauses & Specifications */}
          {details?.chunks && details.chunks.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400">
                Indexed Key Clauses & Requirements ({details.chunks.length})
              </h4>
              <div className="mt-3 space-y-2.5">
                {details.chunks.map((chunk: any) => (
                  <div
                    key={chunk.id}
                    className="rounded-lg border border-border bg-slate-50/80 p-3 text-xs dark:bg-navy-900/60"
                  >
                    <div className="flex items-center justify-between font-bold text-navy-900 dark:text-white">
                      <span>{chunk.clauseNumber}: {chunk.clauseTitle}</span>
                      <span className="text-[10px] font-normal text-muted-foreground">
                        p. {chunk.pageNumberStart}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">
                      {chunk.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Normative Companion Standards */}
          {related.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400">
                Companion & Testing Standards
              </h4>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {related.map((rel, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-navy-100 bg-white p-3 text-xs dark:border-navy-800 dark:bg-navy-900/80"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-navy-900 dark:text-white">
                        {rel.standardNumber}
                      </span>
                      <span className="rounded bg-navy-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-navy-700 dark:bg-navy-800 dark:text-navy-300">
                        {rel.mandatoryStatus}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">
                      {rel.title}
                    </p>
                    <p className="mt-1 text-[10px] text-saffron-600 dark:text-saffron-400">
                      {rel.relationship}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-navy-100 bg-navy-50/50 p-4 dark:border-navy-800 dark:bg-navy-900/50">
          <a
            href={standard.sourceUrl || "https://services.bis.gov.in"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-navy-900 dark:hover:text-white"
          >
            <span>Official BIS Record</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <div className="flex items-center gap-2.5">
            <Link
              href={`/compliance?product=${encodeURIComponent(standard.title)}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-lg border border-navy-300 bg-white px-3.5 py-2 text-xs font-bold text-navy-900 hover:bg-slate-50 dark:border-navy-700 dark:bg-navy-800 dark:text-white dark:hover:bg-navy-700 shadow-sm"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Audit Product</span>
            </Link>

            <Link
              href={`/chat?q=${encodeURIComponent(`What are the technical and testing compliance requirements for ${standard.standardNumber}: ${standard.title}?`)}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-lg bg-saffron-500 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-saffron-600 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ask AI Assistant</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
