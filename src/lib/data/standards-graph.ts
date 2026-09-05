// src/lib/data/standards-graph.ts
import { RelatedStandard } from "@/types/citations";

/**
 * Canonical domain knowledge graph mapping primary Indian Standards to their
 * companion testing, material, and sector-related standards.
 */
export interface StandardRelationshipNode {
  primaryStandard: string;
  related: RelatedStandard[];
}

export const STANDARDS_KNOWLEDGE_GRAPH: Record<string, RelatedStandard[]> = {
  // IS 14543: Stainless Steel Utensils and Bottles
  "IS 14543": [
    {
      standardNumber: "IS 6911",
      title: "Stainless Steel Plate, Sheet and Strip — Specification",
      relationship: "Normative Raw Material Standard (Mandatory Grade 304/316 composition)",
      mandatoryStatus: "mandatory",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%206911",
    },
    {
      standardNumber: "IS 228",
      title: "Methods of Chemical Analysis of Steels",
      relationship: "Referee Chemical Testing Method Standard",
      mandatoryStatus: "voluntary",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%20228",
    },
    {
      standardNumber: "IS 10500",
      title: "Drinking Water — Specification",
      relationship: "Companion Water Quality Standard for Potable Storage Containers",
      mandatoryStatus: "voluntary",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%2010500",
    },
  ],

  // IS 10500: Drinking Water Specification
  "IS 10500": [
    {
      standardNumber: "IS 14543",
      title: "Packaged Drinking Water (Other Than Packaged Natural Mineral Water)",
      relationship: "Companion Standard for Commercial Bottled / Packaged Water",
      mandatoryStatus: "mandatory",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%2014543",
    },
    {
      standardNumber: "IS 13428",
      title: "Packaged Natural Mineral Water — Specification",
      relationship: "Companion Standard for Mineral Water from Natural Springs",
      mandatoryStatus: "mandatory",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%2013428",
    },
    {
      standardNumber: "IS 3025",
      title: "Methods of Sampling and Test (Physical and Chemical) for Water and Wastewater",
      relationship: "Prescribed Testing Methods for Heavy Metals and Physical Parameters",
      mandatoryStatus: "voluntary",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%203025",
    },
  ],

  // IS 2347: Domestic Pressure Cookers
  "IS 2347": [
    {
      standardNumber: "IS 6911",
      title: "Stainless Steel Plate, Sheet and Strip",
      relationship: "Material Specification for Stainless Steel Pressure Cookers",
      mandatoryStatus: "mandatory",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%206911",
    },
    {
      standardNumber: "IS 21",
      title: "Wrought Aluminium and Aluminium Alloys for Utensils",
      relationship: "Material Specification for Aluminium Pressure Cooker Bodies",
      mandatoryStatus: "mandatory",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%2021",
    },
    {
      standardNumber: "IS 7466",
      title: "Rubber Gaskets for Domestic Pressure Cookers",
      relationship: "Normative Component Standard for Sealing and Safety Release Gaskets",
      mandatoryStatus: "mandatory",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%207466",
    },
  ],

  // IS 9873: Safety of Toys
  "IS 9873": [
    {
      standardNumber: "IS 9873 (Part 2)",
      title: "Safety of Toys — Part 2: Flammability Requirements",
      relationship: "Mandatory Safety Companion Standard under Toys QCO",
      mandatoryStatus: "mandatory",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%209873%20(Part%202)",
    },
    {
      standardNumber: "IS 9873 (Part 3)",
      title: "Safety of Toys — Part 3: Migration of Certain Elements (Heavy Metals)",
      relationship: "Mandatory Chemical Safety Companion Standard under Toys QCO",
      mandatoryStatus: "mandatory",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%209873%20(Part%203)",
    },
    {
      standardNumber: "IS 15644",
      title: "Safety of Electric Toys",
      relationship: "Mandatory Standard for Battery Operated or Electric Toys",
      mandatoryStatus: "mandatory",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%2015644",
    },
  ],

  // IS 4151: Two-Wheeler Protective Helmets
  "IS 4151": [
    {
      standardNumber: "IS 7692",
      title: "Visors for Helmets for Two-Wheeler Riders",
      relationship: "Normative Safety Standard for Optical Clarity and Shatterproof Visors",
      mandatoryStatus: "mandatory",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%207692",
    },
    {
      standardNumber: "IS 2925",
      title: "Industrial Safety Helmets — Specification",
      relationship: "Complementary Industrial Personal Protective Equipment Standard",
      mandatoryStatus: "mandatory",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%202925",
    },
  ],

  // IS 1786: High Strength Deformed Steel Bars (TMT)
  "IS 1786": [
    {
      standardNumber: "IS 456",
      title: "Plain and Reinforced Concrete — Code of Practice",
      relationship: "Parent Structural Code Defining Design & Detailing of TMT Rebars",
      mandatoryStatus: "voluntary",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%20456",
    },
    {
      standardNumber: "IS 13920",
      title: "Ductile Design and Detailing of Reinforced Concrete Structures Subjected to Seismic Forces",
      relationship: "Mandatory Earthquake Resistance Design Code (Specifies Fe 500D usage)",
      mandatoryStatus: "voluntary",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%2013920",
    },
    {
      standardNumber: "IS 1608",
      title: "Metallic Materials — Tensile Testing at Ambient Temperature",
      relationship: "Normative Referee Mechanical Testing Standard",
      mandatoryStatus: "voluntary",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%201608",
    },
  ],

  // IS 456: Plain and Reinforced Concrete
  "IS 456": [
    {
      standardNumber: "IS 1786",
      title: "High Strength Deformed Steel Bars and Wires for Concrete Reinforcement",
      relationship: "Primary Reinforcement Steel Material Standard",
      mandatoryStatus: "mandatory",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%201786",
    },
    {
      standardNumber: "IS 269",
      title: "Ordinary Portland Cement, 33 Grade — Specification",
      relationship: "Cement Constituent Standard",
      mandatoryStatus: "mandatory",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%20269",
    },
    {
      standardNumber: "IS 8112",
      title: "Ordinary Portland Cement, 43 Grade — Specification",
      relationship: "Cement Constituent Standard",
      mandatoryStatus: "mandatory",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%208112",
    },
    {
      standardNumber: "IS 12269",
      title: "Ordinary Portland Cement, 53 Grade — Specification",
      relationship: "Cement Constituent Standard",
      mandatoryStatus: "mandatory",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%2012269",
    },
    {
      standardNumber: "IS 383",
      title: "Coarse and Fine Aggregate for Concrete — Specification",
      relationship: "Concrete Aggregate Mineral Standard",
      mandatoryStatus: "voluntary",
      sourceUrl: "https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/IS%20383",
    },
  ],
};

/**
 * Retrieves related companion standards for a single standard number.
 */
export function getRelatedStandards(standard: string): RelatedStandard[] {
  return getRelatedStandardsForList([standard]);
}

/**
 * Retrieves related standards for a given standard or list of standards.
 */
export function getRelatedStandardsForList(standards: string[]): RelatedStandard[] {
  const seen = new Set<string>();
  const results: RelatedStandard[] = [];

  for (const std of standards) {
    const cleanStd = std.trim().toUpperCase();
    // Normalize e.g. "IS 9873 (PART 1)" -> "IS 9873"
    const baseKey = cleanStd.split("(")[0].trim();

    const relatedList = STANDARDS_KNOWLEDGE_GRAPH[cleanStd] || STANDARDS_KNOWLEDGE_GRAPH[baseKey] || [];
    for (const rel of relatedList) {
      if (!standards.includes(rel.standardNumber) && !seen.has(rel.standardNumber)) {
        seen.add(rel.standardNumber);
        results.push(rel);
      }
    }
  }

  return results;
}
