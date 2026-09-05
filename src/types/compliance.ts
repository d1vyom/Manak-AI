// src/types/compliance.ts

import { Citation } from "./citations";
import { MandatoryStatus } from "./rag";

export interface ComplianceStep {
  stepNumber: number;
  title: string;
  description: string;
  status: MandatoryStatus;
  details: string[];
  references: Citation[];
}

export interface CompliancePathway {
  product: string;
  applicableStandards: Array<{
    standardNumber: string;
    title: string;
    mandatoryStatus: MandatoryStatus;
    qcoReference?: string;
  }>;
  overallStatus: MandatoryStatus;
  qcoDetails?: {
    qcoNumber: string;
    title: string;
    effectiveDate: string;
    sourceUrl?: string;
  };
  steps: ComplianceStep[];
  estimatedTimeline: string;
  disclaimer: string;
}

export type RequirementCategory =
  | "material"
  | "testing"
  | "manufacturing"
  | "certification"
  | "documentation";

export type GapStatus =
  | "SATISFIED"
  | "NOT_SATISFIED"
  | "NEEDS_VERIFICATION"
  | "UNKNOWN";

export interface RequirementGap {
  requirement: string;
  category: RequirementCategory;
  status: GapStatus;
  evidence: string;
  recommendation: string;
  reference: Citation | null;
}

export interface GapSummary {
  totalRequirements: number;
  satisfied: number;
  notSatisfied: number;
  needsVerification: number;
  unknown: number;
  criticalGaps: string[];
  nextSteps: string[];
}

export interface GapAnalysisInput {
  product: string;
  material: string;
  capacity?: string;
  currentTests: string[];
  currentCertifications: string[];
  manufacturingProcess?: string;
  additionalInfo?: string;
}

export interface GapAnalysisResult {
  product: string;
  applicableStandards: string[];
  requirements: RequirementGap[];
  summary: GapSummary;
  disclaimer: string;
}
