// src/components/chat/CitationPanel.tsx
"use client";

import { X, ShieldCheck, BookOpen, ExternalLink, Network, Info } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { CitationCard } from "./CitationCard";
import { getRelatedStandards } from "@/lib/data/standards-graph";
import { t } from "@/lib/utils/i18n";

interface CitationPanelProps {
  className?: string;
  onClose?: () => void;
}

export function CitationPanel({ className = "", onClose }: CitationPanelProps) {
  const { activeCitations, isDrawerOpen, setIsDrawerOpen, language } = useAppStore();

  const handleClose = () => {
    setIsDrawerOpen(false);
    if (onClose) onClose();
  };

  // Find companion standards from the standards graph for all active citations
  const allRelated = activeCitations.flatMap((c) =>
    getRelatedStandards(c.standardNumber).map((r) => ({
      ...r,
      primaryStandard: c.standardNumber,
    }))
  );

  // De-duplicate related standards
  const uniqueRelated = Array.from(
    new Map(allRelated.map((item) => [item.standardNumber, item])).values()
  );

  return (
    <aside
      className={`flex h-full flex-col border-l border-navy-200/80 bg-slate-50/50 backdrop-blur-md dark:border-navy-800 dark:bg-navy-950/60 ${className}`}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-navy-200/80 px-4 py-3.5 dark:border-navy-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy-800 text-saffron-400 dark:bg-navy-700">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 dark:text-white">
              {t("panelEvidenceTitle", language)}
            </h3>
            <span className="text-[11px] text-muted-foreground">
              {t("panelEvidenceSubtitle", language)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeCitations.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-saffron-100 px-2 py-0.5 text-xs font-bold text-saffron-800 dark:bg-saffron-950/80 dark:text-saffron-300">
              {activeCitations.length} {activeCitations.length === 1 ? t("panelSourceCount", language) : t("panelSourcesCount", language)}
            </span>
          )}
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-slate-200 hover:text-navy-900 lg:hidden dark:hover:bg-navy-800 dark:hover:text-white"
            title="Close Drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Citations Scroll Area */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {activeCitations.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-navy-200 p-6 text-center dark:border-navy-800">
            <BookOpen className="h-8 w-8 text-muted-foreground/50" />
            <h4 className="mt-3 text-xs font-bold text-navy-800 dark:text-navy-200">
              {t("panelNoCitations", language)}
            </h4>
            <p className="mt-1 text-[11px] text-muted-foreground max-w-[220px]">
              {t("panelNoCitationsDesc", language)}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {activeCitations.map((citation) => (
                <CitationCard key={citation.refId} citation={citation} />
              ))}
            </div>

            {/* Companion Standards Knowledge Graph Section */}
            {uniqueRelated.length > 0 && (
              <div className="mt-6 rounded-xl border border-navy-200/80 bg-white p-3.5 shadow-sm dark:border-navy-800 dark:bg-navy-900/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-navy-900 dark:text-white">
                  <Network className="h-3.5 w-3.5 text-saffron-500" />
                  <span>{t("panelRelatedStandards", language)}</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {t("panelRelatedStandardsDesc", language)}
                </p>

                <div className="mt-3 space-y-2.5">
                  {uniqueRelated.map((rel, idx) => (
                    <a
                      key={idx}
                      href={`/explore?q=${encodeURIComponent(rel.standardNumber)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-lg border border-slate-200/80 bg-slate-50/70 p-2.5 text-xs transition-all hover:border-saffron-400 hover:bg-saffron-50/20 hover:shadow-xs dark:border-navy-800 dark:bg-navy-950/50 dark:hover:border-saffron-600"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="font-mono font-bold text-[12px] text-navy-900 group-hover:text-saffron-600 dark:text-white dark:group-hover:text-saffron-400">
                            {rel.standardNumber}
                          </span>
                          <ExternalLink className="h-2.5 w-2.5 text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                        <span
                          className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                            rel.mandatoryStatus === "mandatory"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                              : "bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-300"
                          }`}
                        >
                          {rel.mandatoryStatus === "mandatory" ? "Mandatory QCO" : "Companion"}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] font-medium text-navy-800 line-clamp-2 leading-snug dark:text-navy-200">
                        {rel.title}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground leading-normal break-words">
                        {rel.relationship.replace(/_/g, " ")}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Info / Official BIS Verification */}
      <div className="border-t border-navy-200/80 bg-white/80 p-3 text-[11px] text-muted-foreground dark:border-navy-800 dark:bg-navy-900/60">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Info className="h-3.5 w-3.5 text-saffron-500" />
            <span>{t("panelAntiHallucination", language)}</span>
          </span>
          <a
            href="https://www.bis.gov.in/standards/?lang=en"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-semibold text-navy-800 hover:text-saffron-600 dark:text-navy-200 dark:hover:text-saffron-400"
          >
            <span>{t("panelEBisPortal", language)}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </aside>
  );
}
