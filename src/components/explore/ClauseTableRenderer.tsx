// src/components/explore/ClauseTableRenderer.tsx
"use client";

import React, { useState } from "react";
import { Table as TableIcon, Copy, Check, ChevronRight } from "lucide-react";

interface ClauseTableRendererProps {
  content: string;
  className?: string;
  language?: string;
}

interface ParsedTableBlock {
  type: "table";
  title?: string;
  headers: string[];
  alignments: Array<"left" | "center" | "right">;
  rows: string[][];
  rawMarkdown: string;
}

interface ParsedTextBlock {
  type: "text";
  text: string;
}

type ParsedBlock = ParsedTableBlock | ParsedTextBlock;

/**
 * Parses clause content that may contain embedded GitHub-flavored Markdown tables.
 */
function parseContentBlocks(content: string): ParsedBlock[] {
  if (!content) return [];

  // Normalize escaped newlines and CRLF
  let normalized = content
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n");

  // Separate title from starting pipe table if on the same line
  normalized = normalized
    .replace(/((?:table|तालिका)\s+[^|\n]+?):\s*(\|)/gi, "$1:\n$2")
    .replace(/\|\s*\|/g, "|\n|");

  const lines = normalized.split("\n");
  const blocks: ParsedBlock[] = [];

  let i = 0;
  let textBuffer: string[] = [];

  const flushTextBuffer = () => {
    if (textBuffer.length > 0) {
      const text = textBuffer.join("\n").trim();
      if (text) {
        blocks.push({ type: "text", text });
      }
      textBuffer = [];
    }
  };

  const isTableLine = (line: string) => {
    const trimmed = line.trim();
    return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.length > 2;
  };

  const isSeparatorLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed.includes("-") || !trimmed.startsWith("|")) return false;
    const inner = trimmed.replace(/^\|/, "").replace(/\|$/, "");
    const parts = inner.split("|");
    return (
      parts.length > 0 &&
      parts.every((part) => /^[\s\-:]+$/.test(part.trim()) && part.includes("-"))
    );
  };

  const parseRow = (rowStr: string) => {
    const trimmed = rowStr.trim();
    const inner = trimmed.replace(/^\|/, "").replace(/\|$/, "");
    return inner.split("|").map((c) => c.trim());
  };

  while (i < lines.length) {
    const line = lines[i];

    // Detect start of markdown table: current line is row and next is separator
    if (isTableLine(line) && i + 1 < lines.length && isSeparatorLine(lines[i + 1])) {
      // Check if the preceding line in textBuffer was a table title
      let title: string | undefined = undefined;
      if (textBuffer.length > 0) {
        const lastLine = textBuffer[textBuffer.length - 1].trim();
        if (
          /^table\s+\d+[:\s]/i.test(lastLine) ||
          /^table\s*[:\s]/i.test(lastLine) ||
          /table:?$/i.test(lastLine) ||
          /तालिका\s+\d+[:\s]/i.test(lastLine)
        ) {
          title = lastLine.replace(/^#+\s*/, "").replace(/:\s*$/, "").trim();
          textBuffer.pop();
        }
      }

      flushTextBuffer();

      const headerCells = parseRow(line);
      const sepCells = parseRow(lines[i + 1]);

      const alignments: Array<"left" | "center" | "right"> = sepCells.map((s) => {
        if (s.startsWith(":") && s.endsWith(":")) return "center";
        if (s.endsWith(":")) return "right";
        return "left";
      });

      const rawTableLines = [line, lines[i + 1]];
      i += 2;
      const rows: string[][] = [];

      while (i < lines.length && isTableLine(lines[i])) {
        rawTableLines.push(lines[i]);
        rows.push(parseRow(lines[i]));
        i++;
      }

      blocks.push({
        type: "table",
        title,
        headers: headerCells,
        alignments,
        rows,
        rawMarkdown: rawTableLines.join("\n"),
      });
      continue;
    }

    textBuffer.push(line);
    i++;
  }

  flushTextBuffer();
  return blocks;
}

/**
 * Renders cell content with smart badges for regulatory terms.
 */
function renderSmartCell(cellText: string) {
  const lower = cellText.toLowerCase().trim();

  // Highlight strict regulatory limit "No relaxation"
  if (lower === "no relaxation" || lower === "कोई छूट नहीं") {
    return (
      <span className="inline-flex items-center rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:text-amber-300">
        {cellText}
      </span>
    );
  }

  // Highlight "Below detectable limits"
  if (lower === "below detectable limits" || lower === "पहचान योग्य सीमा से नीचे" || lower === "bdl") {
    return (
      <span className="inline-flex items-center rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
        {cellText}
      </span>
    );
  }

  // Highlight "Mandatory" or "Prohibited"
  if (lower === "mandatory" || lower === "अनिवार्य") {
    return (
      <span className="inline-flex items-center rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
        {cellText}
      </span>
    );
  }

  if (lower.includes("prohibited") || lower === "प्रतिबंधित") {
    return (
      <span className="inline-flex items-center rounded-md bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[11px] font-bold text-rose-800 dark:text-rose-300">
        {cellText}
      </span>
    );
  }

  return <span>{cellText}</span>;
}

/**
 * Single Responsive Table Component
 */
function InteractiveTable({
  table,
  language = "en",
}: {
  table: ParsedTableBlock;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyTsv = () => {
    const tsvHeader = table.headers.join("\t");
    const tsvRows = table.rows.map((r) => r.join("\t")).join("\n");
    const fullTsv = `${table.title ? table.title + "\n" : ""}${tsvHeader}\n${tsvRows}`;

    navigator.clipboard.writeText(fullTsv).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-navy-200/90 bg-white shadow-xs dark:border-navy-800 dark:bg-navy-950/80">
      {/* Table Header Bar / Title */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-100 bg-navy-50/70 px-3.5 py-2.5 dark:border-navy-800 dark:bg-navy-900/60">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-saffron-500/15 text-saffron-600 dark:bg-saffron-500/20 dark:text-saffron-400">
            <TableIcon className="h-3.5 w-3.5" />
          </div>
          <span className="font-sans text-xs font-bold text-navy-900 dark:text-white">
            {table.title || (language === "hi" ? "विनियामक तालिका" : "Specification Table")}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyTsv}
          className="inline-flex items-center gap-1 rounded-md border border-navy-200/80 bg-white px-2 py-1 text-[10px] font-semibold text-navy-800 transition-colors hover:bg-slate-50 dark:border-navy-700 dark:bg-navy-800 dark:text-navy-200 dark:hover:bg-navy-700"
          title="Copy table data"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-600" />
              <span className="text-emerald-600 font-bold">
                {language === "hi" ? "कॉपी किया गया" : "Copied"}
              </span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 text-muted-foreground" />
              <span>{language === "hi" ? "डेटा कॉपी करें" : "Copy Data"}</span>
            </>
          )}
        </button>
      </div>

      {/* Horizontal Scrollable Table Body */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[380px] border-collapse">
          <thead>
            <tr className="border-b border-navy-200/80 bg-slate-100/70 text-[11px] font-bold uppercase tracking-wider text-navy-900 dark:border-navy-800 dark:bg-navy-900/90 dark:text-white">
              {table.headers.map((header, idx) => (
                <th
                  key={idx}
                  className={`px-3.5 py-2.5 whitespace-nowrap ${
                    table.alignments[idx] === "center"
                      ? "text-center"
                      : table.alignments[idx] === "right"
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100/70 font-sans dark:divide-navy-800/60">
            {table.rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className="transition-colors hover:bg-slate-50/80 dark:hover:bg-navy-900/40"
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className={`px-3.5 py-2.5 text-navy-800 dark:text-slate-200 leading-normal ${
                      cIdx === 0 ? "font-semibold text-navy-950 dark:text-white" : ""
                    } ${
                      table.alignments[cIdx] === "center"
                        ? "text-center"
                        : table.alignments[cIdx] === "right"
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {renderSmartCell(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="flex items-center justify-between border-t border-navy-100/60 bg-slate-50/60 px-3 py-1 text-[10px] text-muted-foreground sm:hidden dark:border-navy-800/60 dark:bg-navy-900/40">
        <span>{language === "hi" ? "पूरी तालिका देखने के लिए स्क्रॉल करें" : "Scroll horizontally for full table"}</span>
        <span className="flex items-center gap-0.5 font-bold text-saffron-600 dark:text-saffron-400">
          <span>Swipe</span>
          <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}

/**
 * Top-level Clause Content Renderer
 */
export function ClauseTableRenderer({
  content,
  className = "",
  language = "en",
}: ClauseTableRendererProps) {
  if (!content) return null;

  const blocks = parseContentBlocks(content);

  // If no blocks were extracted (e.g. whitespace only)
  if (blocks.length === 0) {
    return <p className={`text-xs text-muted-foreground ${className}`}>{content}</p>;
  }

  return (
    <div className={`space-y-2.5 ${className}`}>
      {blocks.map((block, idx) => {
        if (block.type === "table") {
          return <InteractiveTable key={idx} table={block} language={language} />;
        }

        return (
          <p
            key={idx}
            className="text-xs leading-relaxed text-muted-foreground dark:text-slate-300"
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
