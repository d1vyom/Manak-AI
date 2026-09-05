// src/components/chat/ConfidenceBadge.tsx
"use client";

import { useState } from "react";
import { ShieldCheck, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { ConfidenceResult } from "@/types/rag";
import { useAppStore } from "@/lib/store/app-store";
import { t } from "@/lib/utils/i18n";

interface ConfidenceBadgeProps {
  confidence?: ConfidenceResult;
  className?: string;
}

export function ConfidenceBadge({ confidence, className = "" }: ConfidenceBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { language } = useAppStore();

  if (!confidence) return null;

  const { level, score, signals, explanation } = confidence;
  const percentage = Math.round(score * 100);

  const levelStyles = {
    HIGH: {
      bg: "bg-emerald-500/10 dark:bg-emerald-950/40",
      border: "border-emerald-500/30 dark:border-emerald-500/40",
      text: "text-emerald-700 dark:text-emerald-300",
      dot: "bg-emerald-500",
      icon: CheckCircle2,
      label: language === "hi" ? "उच्च" : "HIGH",
    },
    MEDIUM: {
      bg: "bg-amber-500/10 dark:bg-amber-950/40",
      border: "border-amber-500/30 dark:border-amber-500/40",
      text: "text-amber-700 dark:text-amber-300",
      dot: "bg-amber-500",
      icon: AlertCircle,
      label: language === "hi" ? "मध्यम" : "MEDIUM",
    },
    LOW: {
      bg: "bg-rose-500/10 dark:bg-rose-950/40",
      border: "border-rose-500/30 dark:border-rose-500/40",
      text: "text-rose-700 dark:text-rose-300",
      dot: "bg-rose-500",
      icon: AlertCircle,
      label: language === "hi" ? "कम" : "LOW",
    },
  };

  const currentStyle = levelStyles[level] || levelStyles.MEDIUM;
  const Icon = currentStyle.icon;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm transition-all hover:scale-105 ${currentStyle.bg} ${currentStyle.border} ${currentStyle.text} ${className}`}
        title="Click to view grounding & confidence metrics"
      >
        <span className={`h-1.5 w-1.5 rounded-full ${currentStyle.dot} animate-pulse`} />
        <span>{percentage}%</span>
        <span>{currentStyle.label} {t("groundingLabel", language)}</span>
        <Info className="h-3 w-3 opacity-60 ml-0.5" />
      </button>

      {/* Grounding Explanation Tooltip / Popover */}
      {showTooltip && (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-navy-700/20 bg-white p-3.5 text-left shadow-xl dark:border-navy-700 dark:bg-navy-900 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-1.5 font-bold text-xs text-navy-900 dark:text-white">
              <ShieldCheck className="h-4 w-4 text-saffron-500" />
              <span>{t("retrievalScoreLabel", language)}</span>
            </div>
            <span className={`text-xs font-extrabold ${currentStyle.text}`}>
              {percentage}%
            </span>
          </div>

          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            {explanation}
          </p>

          {signals && (
            <div className="mt-3 space-y-1.5 border-t border-border/60 pt-2 text-[10px]">
              <div className="flex justify-between text-muted-foreground">
                <span>Vector Semantic Cosine:</span>
                <span className="font-semibold text-navy-900 dark:text-white">
                  {(signals.topSimilarity * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Hybrid RRF Consensus:</span>
                <span className="font-semibold text-navy-900 dark:text-white">
                  {(signals.hybridConsensus * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Exact Metadata Match:</span>
                <span className="font-semibold text-navy-900 dark:text-white">
                  {(signals.metadataMatch * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
