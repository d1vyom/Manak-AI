// src/components/chat/ChatInput.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Square, Sparkles, Trash2, Globe } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";

interface ChatInputProps {
  onSendMessage: (query: string) => void;
  onStopStreaming?: () => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, onStopStreaming, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isStreaming, clearMessages, messages, language } = useAppStore();

  const chips = [
    { label: "Water Bottles QCO", query: "Which BIS standards apply to stainless steel water bottles?" },
    { label: "Toy Safety QCO 2020", query: "Is BIS certification mandatory for toys under QCO?" },
    { label: "Pressure Cooker IS 2347", query: "What are the safety requirements for pressure cookers under IS 2347?" },
    { label: "Drinking Water Limits", query: "What are the chemical testing limits for drinking water under IS 10500:2012?" },
    { label: "हिन्दी प्रश्न", query: "पीने के पानी के लिए BIS मानक क्या है?" },
  ];

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isStreaming) return;
    onSendMessage(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSelectChip = (query: string) => {
    setInput(query);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1 hidden sm:inline">
          Suggestions:
        </span>
        {chips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectChip(chip.query)}
            className="shrink-0 rounded-full border border-navy-200/80 bg-white px-2.5 py-1 text-[11px] font-medium text-navy-800 transition-colors hover:border-saffron-400 hover:bg-saffron-50/40 dark:border-navy-800 dark:bg-navy-900/80 dark:text-navy-200 dark:hover:border-saffron-500/40"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Box Card */}
      <form
        onSubmit={handleSubmit}
        className="relative rounded-2xl border border-navy-300/80 bg-white p-2.5 shadow-md focus-within:border-saffron-500 focus-within:ring-2 focus-within:ring-saffron-500/20 dark:border-navy-700 dark:bg-navy-900 dark:focus-within:border-saffron-400"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            language === "hi"
              ? "BIS मानकों, परीक्षण आवश्यकताओं या ISI मार्क प्रमाणन के बारे में पूछें..."
              : "Ask about BIS standards, testing requirements, QCO gazettes, or ISI Mark certification..."
          }
          rows={1}
          disabled={disabled || isStreaming}
          className="w-full resize-none bg-transparent px-2.5 py-1.5 text-sm text-navy-900 placeholder:text-muted-foreground/70 focus:outline-none dark:text-white"
        />

        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearMessages}
                className="inline-flex items-center gap-1 rounded px-2 py-1 hover:bg-slate-100 hover:text-navy-900 dark:hover:bg-navy-800 dark:hover:text-white"
                title="Clear conversation"
              >
                <Trash2 className="h-3 w-3" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
            <span className="hidden md:inline">
              Press <kbd className="rounded border bg-muted px-1 py-0.5 text-[10px]">Enter</kbd> to send, <kbd className="rounded border bg-muted px-1 py-0.5 text-[10px]">Shift+Enter</kbd> for new line
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isStreaming ? (
              <button
                type="button"
                onClick={onStopStreaming}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-rose-700 transition-colors"
              >
                <Square className="h-3 w-3 fill-white" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim() || disabled}
                className="inline-flex items-center justify-center rounded-xl bg-saffron-500 p-2 text-white shadow-md shadow-saffron-500/20 transition-all hover:bg-saffron-600 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Send query"
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
