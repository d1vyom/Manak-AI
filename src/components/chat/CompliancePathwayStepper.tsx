// src/components/chat/CompliancePathwayStepper.tsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, GitFork, CheckCircle2, ShieldAlert, Clock, ArrowRight } from "lucide-react";
import { CompliancePathway } from "@/types/compliance";
import { CitationBadge } from "./CitationBadge";
import Link from "next/link";

interface CompliancePathwayStepperProps {
  pathway: CompliancePathway;
  defaultExpanded?: boolean;
}

export function CompliancePathwayStepper({
  pathway,
  defaultExpanded = true,
}: CompliancePathwayStepperProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  if (!pathway || !pathway.steps || pathway.steps.length === 0) return null;

  return (
    <div className="mt-4 rounded-xl border border-navy-200/80 bg-white/90 shadow-sm overflow-hidden dark:border-navy-800 dark:bg-navy-900/60">
      {/* Header Accordion Toggle */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between bg-navy-50/60 px-4 py-3 text-left transition-colors hover:bg-navy-100/50 dark:bg-navy-950/40 dark:hover:bg-navy-900"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy-800 text-saffron-400 dark:bg-navy-700">
            <GitFork className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-navy-900 dark:text-white">
              7-Step BIS Certification Roadmap
            </h4>
            <span className="text-[11px] text-muted-foreground">
              Procedural pathway for {pathway.product}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {pathway.estimatedTimeline && (
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-navy-800 dark:text-slate-300">
              <Clock className="h-3 w-3 text-saffron-500" />
              {pathway.estimatedTimeline}
            </span>
          )}
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Roadmap Timeline */}
      {expanded && (
        <div className="p-4 sm:p-5">
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-navy-200 dark:before:bg-navy-700">
            {pathway.steps.map((step) => {
              const isSelected = activeStep === step.stepNumber;
              const isMandatory = step.status === "mandatory";

              return (
                <div key={step.stepNumber} className="relative group">
                  {/* Step Icon Circle */}
                  <button
                    type="button"
                    onClick={() => setActiveStep(isSelected ? null : step.stepNumber)}
                    className={`absolute -left-6 sm:-left-8 top-0 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-transform group-hover:scale-110 ${
                      isSelected
                        ? "bg-saffron-500 text-white ring-4 ring-saffron-200 dark:ring-saffron-950"
                        : isMandatory
                        ? "bg-navy-800 text-white dark:bg-navy-700"
                        : "bg-slate-200 text-slate-700 dark:bg-navy-800 dark:text-slate-300"
                    }`}
                  >
                    {step.stepNumber}
                  </button>

                  {/* Step Content */}
                  <div
                    onClick={() => setActiveStep(isSelected ? null : step.stepNumber)}
                    className="cursor-pointer rounded-lg border border-transparent p-2 transition-colors hover:border-border hover:bg-slate-50/80 dark:hover:bg-navy-950/40"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h5 className="text-xs font-bold text-navy-900 group-hover:text-saffron-600 dark:text-white dark:group-hover:text-saffron-400">
                        {step.title}
                      </h5>

                      {isMandatory ? (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <ShieldAlert className="h-2.5 w-2.5" />
                          Mandatory
                        </span>
                      ) : (
                        <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-medium text-slate-600 dark:bg-navy-800 dark:text-slate-300">
                          Recommended
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>

                    {/* Step References if available */}
                    {step.references && step.references.length > 0 && (
                      <div className="mt-1.5 flex items-center gap-1 text-[11px]">
                        <span className="text-muted-foreground text-[10px]">Citations:</span>
                        {step.references.map((r) => (
                          <CitationBadge key={r.refId} refId={r.refId} citation={r} />
                        ))}
                      </div>
                    )}

                    {/* Expandable Step Details */}
                    {isSelected && step.details && step.details.length > 0 && (
                      <div className="mt-2.5 rounded-lg border border-navy-100 bg-white p-3 text-xs dark:border-navy-800 dark:bg-navy-950/80 animate-in fade-in duration-200">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400">
                          Action Checklist & Documentation
                        </span>
                        <ul className="mt-2 space-y-1.5 text-[11px] text-muted-foreground">
                          {step.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick link to Gap Analysis */}
          <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-3">
            <span className="text-[11px] text-muted-foreground">
              Want a gap analysis against your exact material specs?
            </span>
            <Link
              href={`/compliance?product=${encodeURIComponent(pathway.product)}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-saffron-600 hover:underline dark:text-saffron-400"
            >
              <span>Run Gap Audit</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
