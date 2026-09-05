// src/components/chat/MandatoryBadge.tsx
"use client";

import { ShieldAlert, ShieldCheck, HelpCircle, Calendar } from "lucide-react";
import { MandatoryStatus } from "@/types/rag";

interface MandatoryBadgeProps {
  status?: MandatoryStatus;
  qcoReference?: string;
  effectiveDate?: string;
  className?: string;
}

export function MandatoryBadge({
  status = "unknown",
  qcoReference,
  effectiveDate,
  className = "",
}: MandatoryBadgeProps) {
  const configs = {
    mandatory: {
      label: "MANDATORY (ISI Mark Required)",
      bg: "bg-emerald-500/15 dark:bg-emerald-950/50",
      border: "border-emerald-600/30 dark:border-emerald-500/40",
      text: "text-emerald-800 dark:text-emerald-300",
      icon: ShieldAlert,
      tagBg: "bg-emerald-600 text-white",
    },
    voluntary: {
      label: "VOLUNTARY STANDARD",
      bg: "bg-blue-500/15 dark:bg-blue-950/50",
      border: "border-blue-600/30 dark:border-blue-500/40",
      text: "text-blue-800 dark:text-blue-300",
      icon: ShieldCheck,
      tagBg: "bg-blue-600 text-white",
    },
    conditional: {
      label: "CONDITIONAL / UPCOMING QCO",
      bg: "bg-amber-500/15 dark:bg-amber-950/50",
      border: "border-amber-600/30 dark:border-amber-500/40",
      text: "text-amber-800 dark:text-amber-300",
      icon: Calendar,
      tagBg: "bg-amber-600 text-white",
    },
    unknown: {
      label: "STATUS VERIFICATION REQUIRED",
      bg: "bg-slate-500/15 dark:bg-slate-800/50",
      border: "border-slate-500/30 dark:border-slate-700",
      text: "text-slate-700 dark:text-slate-300",
      icon: HelpCircle,
      tagBg: "bg-slate-600 text-white",
    },
  };

  const config = configs[status] || configs.unknown;
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${config.bg} ${config.border} ${config.text} ${className}`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{config.label}</span>
      {qcoReference && (
        <span className={`ml-1 rounded px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider ${config.tagBg}`}>
          QCO {qcoReference}
        </span>
      )}
      {effectiveDate && (
        <span className="text-[10px] opacity-75 ml-1">
          (Eff: {effectiveDate})
        </span>
      )}
    </div>
  );
}
