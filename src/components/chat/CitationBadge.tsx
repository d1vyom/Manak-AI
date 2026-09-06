// src/components/chat/CitationBadge.tsx
"use client";

import { useAppStore } from "@/lib/store/app-store";
import { Citation } from "@/types/citations";

interface CitationBadgeProps {
  refId: string;
  citation?: Citation;
  allMessageCitations?: Citation[];
}

export function CitationBadge({ refId, citation, allMessageCitations }: CitationBadgeProps) {
  const {
    highlightedCitationId,
    setHighlightedCitationId,
    setIsDrawerOpen,
    activeCitations,
    setActiveCitations,
  } = useAppStore();

  const numOnly = refId.toUpperCase().replace(/^REF_/, "");
  const resolvedCitation =
    citation ||
    activeCitations.find((c) => {
      const cNum = c.refId.toUpperCase().replace(/^REF_/, "");
      return cNum === numOnly;
    });

  const cardRefId = resolvedCitation?.refId || (refId.toUpperCase().startsWith("REF_") ? refId.toUpperCase() : `REF_${refId}`);
  const isHighlighted =
    highlightedCitationId === refId ||
    highlightedCitationId === numOnly ||
    highlightedCitationId === cardRefId;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (allMessageCitations && allMessageCitations.length > 0) {
      setActiveCitations(allMessageCitations);
    }
    setHighlightedCitationId(cardRefId);
    setIsDrawerOpen(true);

    // Smooth scroll in citation drawer
    setTimeout(() => {
      const cardEl =
        document.getElementById(`citation-card-${cardRefId}`) ||
        document.getElementById(`citation-card-${numOnly}`) ||
        document.getElementById(`citation-card-${refId}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const isMandatory = resolvedCitation?.mandatoryStatus === "mandatory";

  return (
    <button
      type="button"
      onClick={handleClick}
      title={
        resolvedCitation
          ? `Source: ${resolvedCitation.standardNumber} — ${resolvedCitation.clauseTitle || resolvedCitation.documentTitle}`
          : `Source Citation [${numOnly}]`
      }
      className={`inline-flex items-center justify-center font-mono font-bold text-[11px] align-super mx-0.5 px-1.5 py-0.5 rounded cursor-pointer transition-all duration-200 ${
        isHighlighted
          ? "bg-saffron-500 text-white shadow-md scale-110 ring-2 ring-saffron-400"
          : isMandatory
          ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700"
          : "bg-navy-100 text-navy-800 border border-navy-300 hover:bg-navy-200 dark:bg-navy-800 dark:text-navy-200 dark:border-navy-600"
      }`}
    >
      [{numOnly}]
    </button>
  );
}
