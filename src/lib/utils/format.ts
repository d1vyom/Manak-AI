// src/lib/utils/format.ts

/**
 * Unicode subscript map for chemical formulas and scientific numbers.
 */
const SUBSCRIPT_MAP: Record<string, string> = {
  "0": "₀",
  "1": "₁",
  "2": "₂",
  "3": "₃",
  "4": "₄",
  "5": "₅",
  "6": "₆",
  "7": "₇",
  "8": "₈",
  "9": "₉",
  "+": "⁺",
  "-": "⁻",
};

const SUPERSCRIPT_MAP: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "+": "⁺",
  "-": "⁻",
};

/**
 * Converts subscript indicators like _3 or _{3} to Unicode subscripts.
 */
function toSubscript(numStr: string): string {
  return numStr
    .split("")
    .map((char) => SUBSCRIPT_MAP[char] || char)
    .join("");
}

/**
 * Cleans LaTeX math delimiters ($...$), converts chemical formulas to readable Unicode,
 * and strips unnecessary complex notation.
 *
 * Examples:
 *   "$CaCO_3$" -> "CaCO₃"
 *   "$Cl$" -> "Cl"
 *   "$F$" -> "F"
 *   "$H_2O$" -> "H₂O"
 *   "$Cr6+$" -> "Cr⁶⁺"
 */
export function cleanFormulaText(text: string): string {
  if (!text) return text;

  let cleaned = text;

  // Specific common chemical formula replacements
  cleaned = cleaned.replace(/\$CaCO_?3\$/gi, "CaCO₃");
  cleaned = cleaned.replace(/\$H_?2O\$/gi, "H₂O");
  cleaned = cleaned.replace(/\$SO_?4\$/gi, "SO₄");
  cleaned = cleaned.replace(/\$NO_?3\$/gi, "NO₃");
  cleaned = cleaned.replace(/\$CO_?2\$/gi, "CO₂");
  cleaned = cleaned.replace(/\$Cr(?:6\+|(?:\^{?6\+}?))\$/gi, "Cr⁶⁺");
  cleaned = cleaned.replace(/\$N\/mm\^?2\$/gi, "N/mm²");
  cleaned = cleaned.replace(/\$kg\/m\^?3\$/gi, "kg/m³");

  // General chemical formula with subscripts inside math delimiters: $A_2$ -> A₂
  cleaned = cleaned.replace(/\$([A-Za-z]+)_\{?(\d+)\}?\$/g, (_, el, sub) => {
    return `${el}${toSubscript(sub)}`;
  });

  // Simple chemical symbols inside math delimiters: $Cl$ -> Cl, $F$ -> F, $Pb$ -> Pb
  cleaned = cleaned.replace(/\$([A-Z][a-z]?)\$/g, "$1");

  // Any remaining math delimiters around plain text words or units: $mg/l$ -> mg/l
  cleaned = cleaned.replace(/\$([a-zA-Z0-9\s/.,()%+-]+)\$/g, "$1");

  return cleaned;
}

/**
 * Sanitizes citation quotes by stripping raw markdown table separators (e.g. |---|---|---|),
 * converting table rows into clean, readable text statements, and removing stray pipes and hyphens.
 */
export function cleanQuoteText(quote: string): string {
  if (!quote) return quote;

  let text = cleanFormulaText(quote);

  // Check if text has markdown table markup (pipes and dashes)
  if (text.includes("|") && (text.includes("---") || text.includes("| -"))) {
    // Split into lines or cell blocks
    const lines = text.split(/\r?\n/);
    const parsedRows: string[][] = [];
    let titlePrefix = "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Detect separator line: |---|---|...
      if (/^\|?\s*[-:]+[-| :]+\|?$/.test(trimmed)) {
        continue;
      }

      // If line is a table row starting and/or ending with pipe
      if (trimmed.includes("|")) {
        const cells = trimmed
          .split("|")
          .map((c) => c.trim())
          .filter((c) => c.length > 0 && !/^[-:]+$/.test(c));

        if (cells.length > 0) {
          parsedRows.push(cells);
        }
      } else {
        // Line before table (e.g. Table title)
        titlePrefix = trimmed;
      }
    }

    if (parsedRows.length >= 2) {
      // First row is header
      const headers = parsedRows[0];
      const dataRows = parsedRows.slice(1);

      const formattedEntries = dataRows.map((row) => {
        const paramName = row[0] || "";
        const reqLimit = row[1] || "";
        const permLimit = row[2] || "";

        if (reqLimit && permLimit && permLimit.toLowerCase() !== "no relaxation") {
          return `${paramName}: ${reqLimit} (Permissible: ${permLimit})`;
        } else if (reqLimit && permLimit) {
          return `${paramName}: ${reqLimit} [Permissible: ${permLimit}]`;
        } else if (reqLimit) {
          return `${paramName}: ${reqLimit}`;
        }
        return row.join(" — ");
      });

      const joined = formattedEntries.join("; ");
      return titlePrefix ? `${titlePrefix} — ${joined}` : joined;
    }
  }

  // If text has inline pipes without line breaks: | Parameter | Req | ... | |---|---|---| | pH | ...
  if (text.includes("|---|") || text.includes("|:---")) {
    // Remove separator blocks
    text = text.replace(/\|\s*[-:]+[-| :]+\|/g, " | ");
    // Split cells by pipe
    const rawParts = text
      .split("|")
      .map((p) => p.trim())
      .filter((p) => p.length > 0 && !/^[-:]+$/.test(p));

    return rawParts.join(" • ");
  }

  // Remove excessive consecutive hyphens not part of em-dash or standard words
  text = text.replace(/(\s)-{3,}(\s)/g, "$1—$2");

  return text.trim();
}

/**
 * Formats a raw citation reference into a human-friendly source index.
 * E.g. "REF_1" -> "1", "REF_2" -> "2", "1" -> "1".
 */
export function formatRefNumber(refId: string): string {
  if (!refId) return "";
  return refId.toUpperCase().replace(/^REF_/, "").trim();
}
