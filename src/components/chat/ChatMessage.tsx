// src/components/chat/ChatMessage.tsx
"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Shield, User, Copy, Check, FileText } from "lucide-react";
import { ChatMessage as ChatMessageType, useAppStore } from "@/lib/store/app-store";
import { t } from "@/lib/utils/i18n";
import { cleanFormulaText } from "@/lib/utils/format";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { MandatoryBadge } from "./MandatoryBadge";
import { CitationBadge } from "./CitationBadge";
import { CompliancePathwayStepper } from "./CompliancePathwayStepper";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { isDrawerOpen, setIsDrawerOpen, setActiveCitations, language } = useAppStore();
  const [copied, setCopied] = useState(false);

  const isAssistant = message.role === "assistant";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenEvidence = () => {
    if (message.citations && message.citations.length > 0) {
      setActiveCitations(message.citations);
      setIsDrawerOpen(true);
    }
  };

  if (!isAssistant) {
    return (
      <div className="flex justify-end gap-3 my-4">
        <div className="flex max-w-2xl flex-col items-end">
          <div className="rounded-2xl rounded-tr-sm bg-navy-800 px-4 py-3 text-sm text-white shadow-md dark:bg-navy-700">
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          </div>
          <span className="mt-1 text-[10px] text-muted-foreground">
            {message.timestamp}
          </span>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-100 text-navy-800 dark:bg-navy-800 dark:text-navy-200">
          <User className="h-4 w-4" />
        </div>
      </div>
    );
  }

  // Pre-process text to replace citation references [1], [2], [REF_1], [REF_1, REF_2] with an interactive CitationBadge
  const renderTextWithCitations = (text: string): React.ReactNode => {
    const cleanedText = cleanFormulaText(text);
    const parts: (string | React.ReactNode)[] = [];
    const regex = /\[((?:(?:REF_)?\d+(?:[,\s]+)?)+)\]/gi;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(cleanedText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(cleanedText.substring(lastIndex, match.index));
      }
      const rawRefs = match[1].split(/[,\s]+/).map((s) => s.trim()).filter(Boolean);
      rawRefs.forEach((rawRef, nIdx) => {
        const normRef = rawRef.toUpperCase();
        const numOnly = normRef.replace(/^REF_/, "");
        const matchedCitation = message.citations?.find((c) => {
          const cRef = c.refId.toUpperCase().trim();
          const cNum = cRef.replace(/^REF_/, "");
          return cRef === normRef || cNum === numOnly;
        });

        parts.push(
          <CitationBadge
            key={`${match!.index}-${nIdx}`}
            refId={numOnly}
            citation={matchedCitation}
            allMessageCitations={message.citations}
          />
        );
      });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < cleanedText.length) {
      parts.push(cleanedText.substring(lastIndex));
    }

    return parts.length > 0 ? parts : cleanedText;
  };

  // Recursively process children elements to inject interactive CitationBadge on all text nodes
  const renderNodeWithCitations = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child) => {
      if (typeof child === "string") {
        return renderTextWithCitations(child);
      }
      if (React.isValidElement<{ children?: React.ReactNode }>(child) && child.props && child.props.children) {
        return React.cloneElement(
          child,
          undefined,
          renderNodeWithCitations(child.props.children)
        );
      }
      return child;
    });
  };

  const sanitizedContent = cleanFormulaText(message.content);

  return (
    <div className="flex gap-3 my-5">
      {/* Manak AI Emblem Avatar */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-800 text-white shadow-md dark:bg-navy-700">
        <Shield className="h-5 w-5 text-saffron-400" />
      </div>

      <div className="flex flex-col max-w-3xl flex-1 min-w-0">
        {/* Message Header */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 border-b border-navy-100 pb-2.5 dark:border-navy-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-tight text-navy-900 dark:text-white">
              {language === "hi" ? "मानक AI सहायक" : "Manak AI Assistant"}
            </span>
            <span className="rounded bg-navy-100 px-1.5 py-0.2 text-[10px] font-semibold text-navy-800 dark:bg-navy-800 dark:text-navy-300">
              {language === "hi" ? "BIS इंटेलिजेंस" : "BIS Intelligence"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {message.confidence && (
              <ConfidenceBadge confidence={message.confidence} />
            )}
          </div>
        </div>

        {/* Mandatory QCO Banner (if applicable) */}
        {message.mandatoryStatus && message.mandatoryStatus !== "unknown" && (
          <div className="mt-3">
            <MandatoryBadge
              status={message.mandatoryStatus}
              qcoReference={message.qcoReference}
            />
          </div>
        )}

        {/* Message Markdown Body */}
        <div className="prose prose-sm prose-navy mt-3 max-w-none dark:prose-invert">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => {
                return (
                  <p className="leading-relaxed text-navy-900 dark:text-navy-100 mb-2.5">
                    {renderNodeWithCitations(children)}
                  </p>
                );
              },
              li: ({ children }) => {
                return (
                  <li className="text-navy-900 dark:text-navy-100 my-0.5">
                    {renderNodeWithCitations(children)}
                  </li>
                );
              },
              h1: ({ children }) => (
                <h1 className="text-lg font-bold text-navy-900 dark:text-white mt-4 mb-2">
                  {renderNodeWithCitations(children)}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-base font-bold text-navy-900 dark:text-white mt-3 mb-1.5">
                  {renderNodeWithCitations(children)}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-bold text-navy-900 dark:text-white mt-2.5 mb-1">
                  {renderNodeWithCitations(children)}
                </h3>
              ),
              blockquote: ({ children }) => (
                <blockquote className="my-3 rounded-r-lg border-l-3 border-saffron-500 bg-slate-50/80 p-3 text-xs italic text-navy-900 dark:bg-navy-950/60 dark:text-navy-100">
                  {renderNodeWithCitations(children)}
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="my-3.5 overflow-x-auto rounded-xl border border-navy-200/80 bg-white shadow-2xs dark:border-navy-800 dark:bg-navy-950/60">
                  <table className="min-w-full divide-y divide-border text-xs">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="bg-navy-50/90 px-3.5 py-2.5 text-left font-bold text-navy-900 dark:bg-navy-900/90 dark:text-white border-b border-border/80">
                  {renderNodeWithCitations(children)}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-3.5 py-2 text-navy-800 dark:text-navy-200 border-b border-border/40">
                  {renderNodeWithCitations(children)}
                </td>
              ),
            }}
          >
            {sanitizedContent}
          </ReactMarkdown>
        </div>

        {/* Streaming Pulse Indicator */}
        {message.isStreaming && (
          <div className="flex items-center gap-1.5 text-xs text-saffron-600 dark:text-saffron-400 mt-2 font-medium">
            <span className="h-2 w-2 rounded-full bg-saffron-500 animate-ping" />
            <span>{t("chatStreamingIndicator", language)}</span>
          </div>
        )}

        {/* 7-Step Compliance Roadmap Stepper (if present) */}
        {message.pathway && (
          <CompliancePathwayStepper pathway={message.pathway} />
        )}

        {/* Action Bar Footer */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-2.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 hover:text-navy-900 dark:hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">{t("chatCopied", language)}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>{t("chatCopy", language)}</span>
                </>
              )}
            </button>

            {message.citations && message.citations.length > 0 && (
              <button
                type="button"
                onClick={handleOpenEvidence}
                className="inline-flex items-center gap-1 font-semibold text-saffron-600 hover:text-saffron-700 dark:text-saffron-400 transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>{t("chatViewSources", language)} ({message.citations.length})</span>
              </button>
            )}
          </div>

          <span className="text-[10px] text-muted-foreground/80">
            {t("chatAntiHallucination", language)} • {message.timestamp}
          </span>
        </div>
      </div>
    </div>
  );
}

