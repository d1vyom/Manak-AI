// src/app/compliance/page.tsx
"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckSquare,
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  FileCheck2,
  Printer,
  RotateCcw,
  BookOpen,
  Info,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { GapAnalysisResult, GapAnalysisInput, RequirementGap } from "@/types/compliance";
import { useAppStore } from "@/lib/store/app-store";

// Preset product profiles for instant demonstration
const PRESETS = [
  {
    name: "Stainless Steel Water Bottles",
    standard: "IS 14543:2016",
    material: "Grade AISI 304 (18% Cr, 8% Ni)",
    capacity: "750 ml",
    tests: ["Overall Migration Test (IS 9845)", "Corrosion Resistance"],
    certs: ["ISO 9001:2015"],
  },
  {
    name: "Packaged Drinking Water",
    standard: "IS 14543:2016",
    material: "PET Bottle (Food Grade IS 12252)",
    capacity: "1000 ml",
    tests: ["TDS & pH Verification", "Microbiological Colony Count"],
    certs: ["FSSAI License"],
  },
  {
    name: "Domestic Pressure Cooker",
    standard: "IS 2347:2017",
    material: "Wrought Aluminium Alloy IS 21",
    capacity: "5 Litres",
    tests: ["Operating Pressure Test", "Safety Valve Release Test"],
    certs: ["ISO 9001:2015"],
  },
  {
    name: "Safety of Toys (Mechanical & Chemical)",
    standard: "IS 9873",
    material: "ABS Plastic & Non-Toxic Paint",
    capacity: "N/A",
    tests: ["Mechanical Hazard Drop Test", "Heavy Metal Migration (IS 9873 Part 3)"],
    certs: [],
  },
];

const COMMON_TESTS = [
  "Overall Migration Test (IS 9845)",
  "Toxic Heavy Metal Extraction (Lead, Cadmium, Chromium)",
  "Hydrostatic Burst & Operating Pressure Test",
  "Microbiological Colony Count & Pathogen Screen",
  "Tensile Yield Strength & Elongation Test",
  "Flammability Resistance Test",
  "Corrosion Resistance / Salt Spray Test",
  "Thermal Shock & Impact Drop Test",
];

const COMMON_CERTS = [
  "ISO 9001:2015 Quality Management System",
  "NABL-Accredited External Lab Test Report",
  "In-House Chemical & Mechanical Testing Lab",
  "Documented Batch Traceability System",
  "FSSAI Food Safety License",
];

function ComplianceAuditContainer() {
  const searchParams = useSearchParams();
  const initialProduct = searchParams.get("product");
  const { language } = useAppStore();

  const [product, setProduct] = useState("");
  const [material, setMaterial] = useState("");
  const [capacity, setCapacity] = useState("");
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [manufacturingProcess, setManufacturingProcess] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GapAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Handle URL query parameter pre-selection
  useEffect(() => {
    if (initialProduct) {
      const match = PRESETS.find((p) =>
        initialProduct.toLowerCase().includes(p.name.toLowerCase()) ||
        p.name.toLowerCase().includes(initialProduct.toLowerCase())
      );
      if (match) {
        applyPreset(match);
      } else {
        setProduct(initialProduct);
      }
    }
  }, [initialProduct]);

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setProduct(preset.name);
    setMaterial(preset.material);
    setCapacity(preset.capacity);
    setSelectedTests(preset.tests);
    setSelectedCerts(preset.certs);
    setError(null);
  };

  const handleToggleTest = (test: string) => {
    setSelectedTests((prev) =>
      prev.includes(test) ? prev.filter((t) => t !== test) : [...prev, test]
    );
  };

  const handleToggleCert = (cert: string) => {
    setSelectedCerts((prev) =>
      prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]
    );
  };

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.trim()) {
      setError("Please specify the product name or select a preset.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload: GapAnalysisInput & { language?: string } = {
      product: product.trim(),
      material: material.trim(),
      capacity: capacity.trim() || undefined,
      currentTests: selectedTests,
      currentCertifications: selectedCerts,
      manufacturingProcess: manufacturingProcess.trim() || undefined,
      language,
    };

    try {
      const res = await fetch("/api/compliance/gap-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Audit failed with status ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error("Gap analysis error:", err);
      setError("Failed to generate compliance gap analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  // Readiness calculation
  const totalReqs = result?.summary?.totalRequirements || 0;
  const satisfiedCount = result?.summary?.satisfied || 0;
  const readinessPercent =
    totalReqs > 0 ? Math.round((satisfiedCount / totalReqs) * 100) : 0;

  // Filtered requirements
  const filteredRequirements = result?.requirements.filter((req) => {
    if (filterCategory === "all") return true;
    return req.category === filterCategory;
  }) || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-navy-100 pb-6 dark:border-navy-800 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-800 text-white shadow-md dark:bg-navy-700">
            <CheckSquare className="h-6 w-6 text-saffron-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-navy-900 dark:text-white sm:text-2xl">
                Compliance Gap Analysis & Audit Tool
              </h1>
              <span className="rounded-full bg-saffron-100 px-2.5 py-0.5 text-xs font-bold text-saffron-800 dark:bg-saffron-950 dark:text-saffron-300">
                BIS ISI Readiness
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Evaluate your manufacturing, chemical composition, and testing specs against applicable Indian Standards (IS).
            </p>
          </div>
        </div>

        {result && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-900 shadow-sm hover:bg-slate-50 dark:border-navy-800 dark:bg-navy-900 dark:text-white"
            >
              <Printer className="h-3.5 w-3.5 text-saffron-500" />
              <span>Print Report</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg bg-navy-800 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-navy-700"
            >
              <RotateCcw className="h-3.5 w-3.5 text-saffron-400" />
              <span>New Audit</span>
            </button>
          </div>
        )}
      </div>

      {!result ? (
        /* AUDIT FORM VIEW */
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Left Column: Form (8 cols) */}
          <div className="lg:col-span-8">
            <form onSubmit={handleRunAudit} className="space-y-6">
              {/* Preset Quick Fill */}
              <div className="rounded-2xl border border-navy-100 bg-navy-50/50 p-5 dark:border-navy-800 dark:bg-navy-900/40">
                <span className="text-xs font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400">
                  Quick-Fill Verified Demo Presets
                </span>
                <p className="mt-1 text-xs text-muted-foreground">
                  Select a product profile to pre-fill tested materials, parameters, and standards:
                </p>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className={`flex flex-col rounded-xl border p-3 text-left transition-all ${
                        product === p.name
                          ? "border-saffron-500 bg-white shadow-md ring-2 ring-saffron-500/20 dark:bg-navy-800"
                          : "border-navy-200/80 bg-white/80 hover:border-navy-400 dark:border-navy-800 dark:bg-navy-900/80"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-navy-900 dark:text-white">
                          {p.name}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-saffron-600 dark:text-saffron-400">
                          {p.standard}
                        </span>
                      </div>
                      <span className="mt-1 text-[11px] text-muted-foreground line-clamp-1">
                        Material: {p.material}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info Section */}
              <div className="rounded-2xl border border-navy-200/80 bg-white p-5 shadow-sm dark:border-navy-800 dark:bg-navy-900/60 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 dark:text-white">
                  1. Product & Material Details
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-navy-800 dark:text-navy-200">
                      Product Name / Category *
                    </label>
                    <input
                      type="text"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      placeholder="e.g. Stainless Steel Water Bottles"
                      className="mt-1.5 w-full rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs text-navy-900 focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/20 dark:border-navy-700 dark:bg-navy-950 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy-800 dark:text-navy-200">
                      Material Specification & Grade
                    </label>
                    <input
                      type="text"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      placeholder="e.g. Grade AISI 304, Chromium 18%, Nickel 8%"
                      className="mt-1.5 w-full rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs text-navy-900 focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/20 dark:border-navy-700 dark:bg-navy-950 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-navy-800 dark:text-navy-200">
                      Capacity / Rating / Size
                    </label>
                    <input
                      type="text"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="e.g. 750 ml, 5 Litres, 12mm rebar"
                      className="mt-1.5 w-full rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs text-navy-900 focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/20 dark:border-navy-700 dark:bg-navy-950 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy-800 dark:text-navy-200">
                      Manufacturing Process Summary
                    </label>
                    <input
                      type="text"
                      value={manufacturingProcess}
                      onChange={(e) => setManufacturingProcess(e.target.value)}
                      placeholder="e.g. Deep drawing, TIG welding, Annealed"
                      className="mt-1.5 w-full rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs text-navy-900 focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/20 dark:border-navy-700 dark:bg-navy-950 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Current Tests Performed */}
              <div className="rounded-2xl border border-navy-200/80 bg-white p-5 shadow-sm dark:border-navy-800 dark:bg-navy-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 dark:text-white">
                    2. Laboratory Tests Currently Performed
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    {selectedTests.length} selected
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Select tests that your factory or third-party laboratory has already conducted:
                </p>

                <div className="grid gap-2 sm:grid-cols-2 pt-1">
                  {COMMON_TESTS.map((test, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-xs cursor-pointer transition-colors ${
                        selectedTests.includes(test)
                          ? "border-saffron-500 bg-saffron-50/40 text-navy-900 font-semibold dark:bg-saffron-950/20 dark:text-white"
                          : "border-navy-100 bg-slate-50/70 text-navy-800 hover:bg-slate-100 dark:border-navy-800 dark:bg-navy-950/40 dark:text-navy-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTests.includes(test)}
                        onChange={() => handleToggleTest(test)}
                        className="h-4 w-4 rounded border-navy-300 text-saffron-500 focus:ring-saffron-500"
                      />
                      <span>{test}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quality Certifications & Infrastructure */}
              <div className="rounded-2xl border border-navy-200/80 bg-white p-5 shadow-sm dark:border-navy-800 dark:bg-navy-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 dark:text-white">
                    3. Factory Infrastructure & Certifications
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    {selectedCerts.length} selected
                  </span>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 pt-1">
                  {COMMON_CERTS.map((cert, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-xs cursor-pointer transition-colors ${
                        selectedCerts.includes(cert)
                          ? "border-saffron-500 bg-saffron-50/40 text-navy-900 font-semibold dark:bg-saffron-950/20 dark:text-white"
                          : "border-navy-100 bg-slate-50/70 text-navy-800 hover:bg-slate-100 dark:border-navy-800 dark:bg-navy-950/40 dark:text-navy-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCerts.includes(cert)}
                        onChange={() => handleToggleCert(cert)}
                        className="h-4 w-4 rounded border-navy-300 text-saffron-500 focus:ring-saffron-500"
                      />
                      <span>{cert}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3.5 text-xs text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-saffron-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-saffron-500/20 transition-all hover:bg-saffron-600 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" />
                    <span>Auditing Specifications Against BIS Standards...</span>
                  </>
                ) : (
                  <>
                    <CheckSquare className="h-4 w-4" />
                    <span>Run Compliance Gap Analysis</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Guidance Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="rounded-2xl border border-navy-200/80 bg-white p-5 shadow-sm dark:border-navy-800 dark:bg-navy-900/60">
              <div className="flex items-center gap-2 text-xs font-bold text-navy-900 dark:text-white">
                <Info className="h-4 w-4 text-saffron-500" />
                <span>How Gap Analysis Works</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Manak AI evaluates your raw materials, testing limits, and factory quality control procedures against the normative requirements of the Bureau of Indian Standards.
              </p>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    ✓
                  </span>
                  <div>
                    <h5 className="font-bold text-navy-900 dark:text-white">Satisfied Requirements</h5>
                    <p className="text-[11px] text-muted-foreground">Parameters your product already fulfills.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[11px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    ✕
                  </span>
                  <div>
                    <h5 className="font-bold text-navy-900 dark:text-white">Critical Regulatory Gaps</h5>
                    <p className="text-[11px] text-muted-foreground">Missing mandatory tests or material non-compliances.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[11px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    !
                  </span>
                  <div>
                    <h5 className="font-bold text-navy-900 dark:text-white">Verification Required</h5>
                    <p className="text-[11px] text-muted-foreground">Tests needing factory inspection or lab reports.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-navy-700 bg-gradient-to-br from-navy-900 to-navy-800 p-5 text-white shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold text-saffron-400">
                <ShieldAlert className="h-4 w-4" />
                <span>Mandatory QCO Protection</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-navy-100">
                Selling non-certified products covered under a Quality Control Order (QCO) is illegal under Section 17 of the BIS Act, 2016, carrying heavy penalties and seizure.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* AUDIT RESULTS VIEW */
        <div className="mt-8 space-y-8 animate-in fade-in duration-300">
          {/* Readiness Banner & 4 Counters */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Readiness Gauge Card */}
            <div className="lg:col-span-2 flex items-center gap-4 rounded-2xl border border-navy-200/80 bg-white p-5 shadow-sm dark:border-navy-800 dark:bg-navy-900/80">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-navy-100 bg-slate-50 dark:border-navy-800 dark:bg-navy-950">
                <span
                  className={`text-xl font-extrabold ${
                    readinessPercent >= 75
                      ? "text-emerald-600 dark:text-emerald-400"
                      : readinessPercent >= 50
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {readinessPercent}%
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400">
                  Audit Verdict
                </span>
                <h3 className="text-base font-extrabold text-navy-900 dark:text-white">
                  {readinessPercent >= 75
                    ? "Substantially Compliant"
                    : readinessPercent >= 50
                    ? "Partial Compliance"
                    : "Significant Gaps Detected"}
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  {result.product} against {result.applicableStandards.join(", ")}
                </p>
              </div>
            </div>

            {/* Satisfied */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/40 p-4 dark:border-emerald-500/30 dark:bg-emerald-950/20">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                Satisfied Requirements
              </span>
              <div className="mt-2 text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">
                {result.summary.satisfied}
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                Verified against BIS clauses
              </span>
            </div>

            {/* Critical Gaps */}
            <div className="rounded-2xl border border-rose-500/20 bg-rose-50/40 p-4 dark:border-rose-500/30 dark:bg-rose-950/20">
              <span className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                Critical Gaps
              </span>
              <div className="mt-2 text-2xl font-extrabold text-rose-700 dark:text-rose-300">
                {result.summary.notSatisfied}
              </div>
              <span className="text-[10px] text-rose-600 dark:text-rose-400">
                Hurdles for ISI certification
              </span>
            </div>

            {/* Needs Verification */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-50/40 p-4 dark:border-amber-500/30 dark:bg-amber-950/20">
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                Needs Verification
              </span>
              <div className="mt-2 text-2xl font-extrabold text-amber-700 dark:text-amber-300">
                {result.summary.needsVerification}
              </div>
              <span className="text-[10px] text-amber-600 dark:text-amber-400">
                Pending factory evidence
              </span>
            </div>
          </div>

          {/* Critical Gaps Alert Box */}
          {result.summary.criticalGaps.length > 0 && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-50/60 p-5 dark:border-rose-500/40 dark:bg-rose-950/30">
              <div className="flex items-center gap-2 font-bold text-xs text-rose-900 dark:text-rose-200">
                <AlertCircle className="h-4 w-4 text-rose-600" />
                <span>Critical Compliance Gaps Requiring Immediate Remediation</span>
              </div>
              <ul className="mt-2.5 space-y-1.5 text-xs text-rose-950 dark:text-rose-200">
                {result.summary.criticalGaps.map((gap, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-600" />
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements Breakdown Table */}
          <div className="rounded-2xl border border-navy-200/80 bg-white shadow-sm dark:border-navy-800 dark:bg-navy-900/60 overflow-hidden">
            {/* Table Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-100 bg-navy-50/60 p-4 dark:border-navy-800 dark:bg-navy-950/60">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-saffron-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 dark:text-white">
                  Regulatory Requirements Checklist ({result.requirements.length})
                </h4>
              </div>

              <div className="flex flex-wrap items-center gap-1 text-xs">
                {[
                  { id: "all", label: "All Requirements" },
                  { id: "material", label: "Material" },
                  { id: "testing", label: "Testing" },
                  { id: "manufacturing", label: "Manufacturing" },
                  { id: "certification", label: "Certification" },
                  { id: "documentation", label: "Documentation" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterCategory(tab.id)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                      filterCategory === tab.id
                        ? "bg-navy-800 text-white dark:bg-navy-700"
                        : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-navy-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-navy-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-navy-900 dark:border-navy-800 dark:bg-navy-950/40 dark:text-white">
                  <tr>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">BIS Requirement</th>
                    <th className="px-4 py-3">Evidence / Current Spec</th>
                    <th className="px-4 py-3">Standard Reference</th>
                    <th className="px-4 py-3">Corrective Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100 dark:divide-navy-800/60">
                  {filteredRequirements.map((req, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-navy-900/50">
                      {/* Status */}
                      <td className="whitespace-nowrap px-4 py-3.5">
                        {req.status === "SATISFIED" ? (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            <ShieldCheck className="h-3 w-3" />
                            SATISFIED
                          </span>
                        ) : req.status === "NOT_SATISFIED" ? (
                          <span className="inline-flex items-center gap-1 rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                            <AlertCircle className="h-3 w-3" />
                            CRITICAL GAP
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                            <AlertTriangle className="h-3 w-3" />
                            NEEDS PROOF
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="whitespace-nowrap px-4 py-3.5 capitalize font-medium text-muted-foreground">
                        {req.category}
                      </td>

                      {/* Requirement */}
                      <td className="px-4 py-3.5 font-semibold text-navy-900 dark:text-white max-w-xs">
                        {req.requirement}
                      </td>

                      {/* Evidence */}
                      <td className="px-4 py-3.5 text-muted-foreground max-w-xs">
                        {req.evidence}
                      </td>

                      {/* Reference */}
                      <td className="whitespace-nowrap px-4 py-3.5 font-mono text-[11px] text-saffron-600 dark:text-saffron-400">
                        {req.reference ? (
                          <span>
                            {req.reference.standardNumber} ({req.reference.clauseNumber})
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>

                      {/* Recommendation */}
                      <td className="px-4 py-3.5 text-xs text-navy-800 dark:text-navy-200 max-w-xs">
                        {req.recommendation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Callout: Ask Assistant & Next Steps */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-navy-200/80 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900/60">
            <div>
              <h4 className="text-sm font-bold text-navy-900 dark:text-white">
                Need guidance on closing these compliance gaps?
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Ask Manak AI assistant for specific testing protocols, NABL lab options, and sample application forms.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/chat?q=${encodeURIComponent(`How do I close the compliance gaps for ${result.product} under ${result.applicableStandards.join(", ")}?`)}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-saffron-500 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-saffron-600 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Ask AI to Fix Gaps</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CompliancePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 animate-spin text-saffron-500" />
            <span>Loading Compliance Audit Engine...</span>
          </div>
        </div>
      }
    >
      <ComplianceAuditContainer />
    </Suspense>
  );
}
