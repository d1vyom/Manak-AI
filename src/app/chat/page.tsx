// src/app/chat/page.tsx
"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare, ShieldCheck, Sparkles, FileText, ChevronRight } from "lucide-react";
import { useAppStore, ChatMessage as ChatMessageType } from "@/lib/store/app-store";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatEmptyState } from "@/components/chat/ChatEmptyState";
import { CitationPanel } from "@/components/chat/CitationPanel";
import { Citation } from "@/types/citations";
import { ConfidenceResult } from "@/types/rag";
import { CompliancePathway } from "@/types/compliance";

function ChatContainer() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");

  const {
    messages,
    addMessage,
    updateLastMessage,
    isStreaming,
    setIsStreaming,
    setActiveCitations,
    setActiveConfidence,
    setActivePathway,
    isDrawerOpen,
    setIsDrawerOpen,
    language,
    activeCitations,
  } = useAppStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const initialSentRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle query parameter on first mount
  useEffect(() => {
    if (initialQuery && !initialSentRef.current && messages.length === 0) {
      initialSentRef.current = true;
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim() || isStreaming) return;

    // 1. Add user message
    const userMsgId = `user-${Date.now()}`;
    const userTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    addMessage({
      id: userMsgId,
      role: "user",
      content: queryText,
      timestamp: userTimestamp,
    });

    // 2. Prepare Assistant placeholder message
    const assistantMsgId = `asst-${Date.now()}`;
    const assistantTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    addMessage({
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: assistantTimestamp,
      isStreaming: true,
    });

    setIsStreaming(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: queryText, language }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`Chat API error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulatedContent = "";
      let receivedCitations: Citation[] = [];
      let receivedConfidence: ConfidenceResult | undefined;
      let detectedMandatory: "mandatory" | "voluntary" | "conditional" | "unknown" = "unknown";
      let qcoReference: string | undefined;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let currentEvent = "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith("event:")) {
            currentEvent = trimmed.replace("event:", "").trim();
          } else if (trimmed.startsWith("data:")) {
            const dataStr = trimmed.replace("data:", "").trim();
            try {
              const data = JSON.parse(dataStr);

              if (currentEvent === "metadata") {
                if (data.confidence) {
                  receivedConfidence = data.confidence;
                  setActiveConfidence(data.confidence);
                  updateLastMessage((prev) => ({
                    ...prev,
                    confidence: data.confidence,
                  }));
                }
                if (data.extractedEntities?.intent === "check_compliance") {
                  detectedMandatory = "mandatory";
                }
              } else if (currentEvent === "content") {
                if (data.text) {
                  accumulatedContent += data.text;
                  updateLastMessage((prev) => ({
                    ...prev,
                    content: accumulatedContent,
                  }));
                }
              } else if (currentEvent === "citations") {
                if (Array.isArray(data.citations)) {
                  receivedCitations = data.citations;
                  setActiveCitations(data.citations);

                  // Detect mandatory status from citations
                  const hasMandatory = data.citations.some(
                    (c: Citation) => c.mandatoryStatus === "mandatory"
                  );
                  if (hasMandatory) {
                    detectedMandatory = "mandatory";
                  }

                  updateLastMessage((prev) => ({
                    ...prev,
                    citations: data.citations,
                    mandatoryStatus: detectedMandatory,
                  }));
                }
              } else if (currentEvent === "done") {
                // Done event
              } else if (currentEvent === "error") {
                accumulatedContent += `\n\n*Error: ${data.error || "An error occurred during response generation."}*`;
                updateLastMessage((prev) => ({
                  ...prev,
                  content: accumulatedContent,
                  error: data.error,
                }));
              }
            } catch (err) {
              console.error("Error parsing SSE data:", err, dataStr);
            }
          }
        }
      }

      // Check if this query pertains to a product that has a pathway
      let generatedPathway: CompliancePathway | null = null;
      if (
        queryText.toLowerCase().includes("bottle") ||
        queryText.toLowerCase().includes("water") ||
        queryText.toLowerCase().includes("toy") ||
        queryText.toLowerCase().includes("cooker") ||
        queryText.toLowerCase().includes("steel")
      ) {
        try {
          const pathwayRes = await fetch("/api/compliance/pathway", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product: queryText }),
          });
          if (pathwayRes.ok) {
            const pathwayData = await pathwayRes.json();
            if (pathwayData.pathway) {
              generatedPathway = pathwayData.pathway;
              setActivePathway(generatedPathway);
              if (pathwayData.pathway.qcoDetails?.qcoNumber) {
                qcoReference = pathwayData.pathway.qcoDetails.qcoNumber;
                detectedMandatory = "mandatory";
              }
            }
          }
        } catch (e) {
          console.warn("Could not fetch pathway for chat:", e);
        }
      }

      // Finalize assistant message
      updateLastMessage((prev) => ({
        ...prev,
        content: accumulatedContent,
        citations: receivedCitations,
        confidence: receivedConfidence,
        pathway: generatedPathway,
        mandatoryStatus: detectedMandatory,
        qcoReference,
        isStreaming: false,
      }));
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") {
        updateLastMessage((prev) => ({
          ...prev,
          content: prev.content + "\n\n*(Generation stopped by user)*",
          isStreaming: false,
        }));
      } else {
        console.error("Chat error:", err);
        updateLastMessage((prev) => ({
          ...prev,
          content:
            prev.content ||
            "Unable to retrieve response from BIS compliance engine. Please try again or check the standards explorer.",
          isStreaming: false,
          error: (err as Error)?.message,
        }));
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* LEFT PANEL: 60% AI Chat Stream */}
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-navy-100 bg-white/80 px-4 py-3 backdrop-blur dark:border-navy-800 dark:bg-navy-950/80 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800 text-white dark:bg-navy-700">
              <MessageSquare className="h-5 w-5 text-saffron-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-navy-900 dark:text-white sm:text-base">
                  BIS Compliance Assistant
                </h1>
                <span className="hidden sm:inline-flex rounded bg-saffron-100 px-2 py-0.5 text-[10px] font-bold text-saffron-800 dark:bg-saffron-950/80 dark:text-saffron-300">
                  RAG Hybrid RRF
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Authoritative answers with clause-level citations and official gazette tracking
              </p>
            </div>
          </div>

          {/* Mobile toggle for evidence drawer */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="flex lg:hidden items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-navy-800 shadow-sm dark:border-navy-700 dark:bg-navy-900 dark:text-navy-100"
          >
            <FileText className="h-3.5 w-3.5 text-saffron-500" />
            <span>Sources ({activeCitations.length})</span>
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 ? (
            <ChatEmptyState onSelectPrompt={handleSendMessage} />
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Bar */}
        <div className="border-t border-navy-100 bg-white/95 p-3 backdrop-blur dark:border-navy-800 dark:bg-navy-950/95 sm:p-4">
          <div className="mx-auto max-w-3xl">
            <ChatInput
              onSendMessage={handleSendMessage}
              onStopStreaming={handleStopStreaming}
              disabled={isStreaming}
            />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: 40% Interactive Source Evidence Drawer (Desktop) */}
      <div
        className={`fixed inset-y-16 right-0 z-40 w-full sm:w-[420px] lg:static lg:inset-auto lg:w-[400px] xl:w-[460px] lg:flex transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <CitationPanel
          className="w-full h-full shadow-2xl lg:shadow-none"
          onClose={() => setIsDrawerOpen(false)}
        />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 animate-spin text-saffron-500" />
            <span>Loading BIS Assistant...</span>
          </div>
        </div>
      }
    >
      <ChatContainer />
    </Suspense>
  );
}
