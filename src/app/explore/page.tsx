// src/app/explore/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Search,
  ShieldAlert,
  ShieldCheck,
  LayoutGrid,
  Table as TableIcon,
  Sparkles,
  ArrowRight,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { StandardSummary, StandardsResponse } from "@/types/api";
import { StandardDetailModal } from "@/components/explore/StandardDetailModal";
import { useAppStore } from "@/lib/store/app-store";
import { t } from "@/lib/utils/i18n";

export default function ExplorePage() {
  const { language } = useAppStore();
  const [standards, setStandards] = useState<StandardSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "mandatory" | "voluntary" | "water" | "consumer" | "construction">("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedStandard, setSelectedStandard] = useState<StandardSummary | null>(null);

  useEffect(() => {
    fetch("/api/standards")
      .then((res) => res.json())
      .then((data: StandardsResponse) => {
        if (data.standards) {
          setStandards(data.standards);
        }
      })
      .catch((err) => console.error("Error fetching standards:", err))
      .finally(() => setLoading(false));
  }, []);

  // Read URL query parameters (?q= or ?standard=) to auto-populate search and open modal
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") || params.get("standard");
      if (q) {
        setSearchQuery(q);
      }
    }
  }, []);

  // When standards load, auto-open standard detail modal if URL query matched a standard
  useEffect(() => {
    if (typeof window !== "undefined" && standards.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const q = (params.get("q") || params.get("standard") || "").trim().toLowerCase();
      if (q) {
        const cleanQ = q.replace(/[^a-z0-9]/g, "");
        const matched = standards.find((s) => {
          const sNum = s.standardNumber.toLowerCase();
          const sFull = s.fullDesignation.toLowerCase();
          const cleanSNum = sNum.replace(/[^a-z0-9]/g, "");
          return sNum.includes(q) || sFull.includes(q) || cleanSNum === cleanQ;
        });
        if (matched) {
          setSelectedStandard(matched);
        }
      }
    }
  }, [standards]);

  // Filter standards
  const filteredStandards = standards.filter((std) => {
    const matchesSearch =
      std.standardNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.fullDesignation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.industries.some((ind) => ind.toLowerCase().includes(searchQuery.toLowerCase())) ||
      std.productCategories.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedFilter === "mandatory") return std.isMandatory;
    if (selectedFilter === "voluntary") return !std.isMandatory;
    if (selectedFilter === "water") {
      return (
        std.productCategories.some((c) => c.toLowerCase().includes("water")) ||
        std.title.toLowerCase().includes("water")
      );
    }
    if (selectedFilter === "consumer") {
      return std.industries.some(
        (i) => i.toLowerCase().includes("consumer") || i.toLowerCase().includes("utensils")
      );
    }
    if (selectedFilter === "construction") {
      return (
        std.industries.some((i) => i.toLowerCase().includes("construction")) ||
        std.title.toLowerCase().includes("steel") ||
        std.title.toLowerCase().includes("concrete")
      );
    }

    return true;
  });

  const filterTabs = [
    { id: "all", label: t("filterAll", language) },
    { id: "mandatory", label: t("filterMandatory", language) },
    { id: "voluntary", label: t("filterVoluntary", language) },
    { id: "water", label: t("filterWater", language) },
    { id: "consumer", label: t("filterConsumer", language) },
    { id: "construction", label: t("filterConstruction", language) },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-3.5 py-6 sm:px-6 sm:py-8 w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="flex flex-col gap-4 border-b border-navy-100 pb-6 dark:border-navy-800 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-800 text-white shadow-md dark:bg-navy-700">
            <BookOpen className="h-6 w-6 text-saffron-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-navy-900 dark:text-white sm:text-2xl">
                {t("explorerTitle", language)}
              </h1>
              <span className="inline-flex items-center rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-900 shadow-2xs dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300">
                {t("standardsIndexedBadge", language)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              {t("explorerSubtitle", language)}
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex rounded-lg border border-navy-200 bg-white p-1 dark:border-navy-800 dark:bg-navy-900">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === "table"
                  ? "bg-navy-800 text-white dark:bg-navy-700"
                  : "text-muted-foreground hover:text-navy-900 dark:hover:text-white"
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span>{t("tableView", language)}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === "grid"
                  ? "bg-navy-800 text-white dark:bg-navy-700"
                  : "text-muted-foreground hover:text-navy-900 dark:hover:text-white"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>{t("cardsView", language)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchStandardsPlaceholder", language)}
            className="w-full rounded-xl border border-navy-200 bg-white pl-10 pr-4 py-2.5 text-xs text-navy-900 placeholder:text-muted-foreground/70 focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-white dark:focus:border-saffron-400"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-bold uppercase text-muted-foreground mr-1 hidden sm:inline">
            {t("filterLabel", language)}
          </span>
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                selectedFilter === tab.id
                  ? "bg-navy-800 text-white shadow-sm dark:bg-navy-700"
                  : "border border-navy-200 bg-white text-navy-800 hover:bg-slate-50 dark:border-navy-800 dark:bg-navy-900 dark:text-navy-200 dark:hover:bg-navy-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Standards List / Table */}
      <div className="mt-6">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 animate-spin text-saffron-500" />
              <span>{t("indexingStandards", language)}</span>
            </div>
          </div>
        ) : filteredStandards.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-navy-200 bg-white p-8 text-center dark:border-navy-800 dark:bg-navy-950">
            <BookOpen className="h-10 w-10 text-muted-foreground/40" />
            <h3 className="mt-3 text-sm font-bold text-navy-900 dark:text-white">
              {t("noStandardsFound", language)}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm">
              {searchQuery
                ? `${t("noStandardsDesc", language)} ("${searchQuery}")`
                : t("noStandardsDesc", language)}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("all");
              }}
              className="mt-4 rounded-lg bg-navy-800 px-4 py-2 text-xs font-bold text-white hover:bg-navy-700"
            >
              {t("btnResetFilters", language)}
            </button>
          </div>
        ) : viewMode === "table" ? (
          /* High-density Enterprise Table */
          <div className="w-full max-w-full overflow-hidden rounded-2xl border border-navy-200/80 bg-white shadow-sm dark:border-navy-800 dark:bg-navy-900/60">
            <div className="w-full max-w-full overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[640px]">
                <thead className="border-b border-navy-200/80 bg-navy-50/70 text-navy-900 dark:border-navy-800 dark:bg-navy-950/60 dark:text-white">
                  <tr>
                    <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">
                      {t("colStandard", language)}
                    </th>
                    <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">
                      {t("colTitleScope", language)}
                    </th>
                    <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">
                      {t("colStatus", language)}
                    </th>
                    <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">
                      {t("colCategories", language)}
                    </th>
                    <th className="px-5 py-3.5 text-right font-bold uppercase tracking-wider text-[11px]">
                      {t("colActions", language)}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100 dark:divide-navy-800/60">
                  {filteredStandards.map((std) => (
                    <tr
                      key={std.id}
                      className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-navy-900/80 cursor-pointer"
                      onClick={() => setSelectedStandard(std)}
                    >
                      {/* Designation */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-extrabold text-navy-900 group-hover:text-saffron-600 dark:text-white dark:group-hover:text-saffron-400">
                            {std.standardNumber}
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {std.fullDesignation}
                          </span>
                        </div>
                      </td>

                      {/* Title & Scope */}
                      <td className="px-5 py-4">
                        <div className="max-w-md">
                          <h4 className="font-semibold text-navy-900 dark:text-white line-clamp-1">
                            {std.title}
                          </h4>
                          <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                            {std.scopeSummary || "Official specifications under Bureau of Indian Standards."}
                          </p>
                        </div>
                      </td>

                      {/* Compliance Status */}
                      <td className="whitespace-nowrap px-5 py-4">
                        {std.isMandatory ? (
                          <div className="flex flex-col gap-1 items-start">
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                              <ShieldAlert className="h-3 w-3" />
                              {t("statusMandatory", language)}
                            </span>
                            {std.qcoDetails && (
                              <span className="font-mono text-[9px] text-muted-foreground">
                                QCO {std.qcoDetails.qcoNumber}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-navy-100 px-2 py-0.5 text-[11px] font-medium text-navy-700 dark:bg-navy-800 dark:text-navy-300">
                            <ShieldCheck className="h-3 w-3" />
                            {t("statusVoluntary", language)}
                          </span>
                        )}
                      </td>

                      {/* Categories */}
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {std.productCategories.slice(0, 2).map((cat, idx) => (
                            <span
                              key={idx}
                              className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-navy-800 dark:text-slate-300"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setSelectedStandard(std)}
                            className="inline-flex items-center gap-1 rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs font-semibold text-navy-800 hover:bg-slate-100 dark:border-navy-700 dark:text-navy-200 dark:hover:bg-navy-800"
                          >
                            <FileText className="h-3 w-3" />
                            <span>{t("btnDetails", language)}</span>
                          </button>

                          <Link
                            href={`/chat?q=${encodeURIComponent(`What are the testing and certification requirements under ${std.standardNumber}?`)}`}
                            className="inline-flex items-center gap-1 rounded-lg bg-saffron-500 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-saffron-600 transition-colors shadow-sm"
                          >
                            <Sparkles className="h-3 w-3" />
                            <span>{t("btnAskAi", language)}</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Cards Grid View */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStandards.map((std) => (
              <div
                key={std.id}
                onClick={() => setSelectedStandard(std)}
                className="group flex flex-col justify-between rounded-2xl border border-navy-200/80 bg-white p-5 shadow-sm transition-all hover:border-saffron-400 hover:shadow-md dark:border-navy-800 dark:bg-navy-900/60 cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-base font-extrabold text-navy-900 group-hover:text-saffron-600 dark:text-white dark:group-hover:text-saffron-400">
                      {std.standardNumber}
                    </span>
                    {std.isMandatory ? (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <ShieldAlert className="h-3 w-3" />
                        {t("statusMandatory", language)}
                      </span>
                    ) : (
                      <span className="rounded bg-navy-100 px-2 py-0.5 text-[10px] font-medium text-navy-700 dark:bg-navy-800 dark:text-navy-300">
                        {t("statusVoluntary", language)}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 text-xs font-bold text-navy-900 dark:text-white line-clamp-2">
                    {std.title}
                  </h3>

                  <p className="mt-2 text-[11px] text-muted-foreground line-clamp-3 leading-relaxed">
                    {std.scopeSummary || "Official specifications under Bureau of Indian Standards."}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {std.productCategories.slice(0, 2).map((cat, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-navy-800 dark:text-slate-300"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className="mt-5 flex items-center justify-between border-t border-border/60 pt-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedStandard(std)}
                    className="text-xs font-semibold text-muted-foreground hover:text-navy-900 dark:hover:text-white"
                  >
                    {t("btnViewClauses", language)}
                  </button>

                  <Link
                    href={`/chat?q=${encodeURIComponent(`What are the requirements for ${std.standardNumber}?`)}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-saffron-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-saffron-600 transition-colors"
                  >
                    <span>{t("btnAskAi", language)}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Flyout Modal */}
      {selectedStandard && (
        <StandardDetailModal
          standard={selectedStandard}
          onClose={() => setSelectedStandard(null)}
        />
      )}
    </div>
  );
}
