// src/lib/store/app-store.ts

import { create } from "zustand";
import { Citation } from "@/types/citations";
import { CompliancePathway } from "@/types/compliance";
import { ConfidenceResult } from "@/types/rag";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  citations?: Citation[];
  confidence?: ConfidenceResult;
  pathway?: CompliancePathway | null;
  mandatoryStatus?: "mandatory" | "voluntary" | "conditional" | "unknown";
  qcoReference?: string;
  isStreaming?: boolean;
  error?: string;
}

interface AppState {
  // Multilingual State
  language: "en" | "hi";
  setLanguage: (lang: "en" | "hi") => void;

  // Chat State
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (updater: (prev: ChatMessage) => ChatMessage) => void;
  clearMessages: () => void;
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;

  // Citations & Side Panel Drawer
  activeCitations: Citation[];
  setActiveCitations: (citations: Citation[]) => void;
  highlightedCitationId: string | null;
  setHighlightedCitationId: (refId: string | null) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;

  // Compliance Pathway
  activePathway: CompliancePathway | null;
  setActivePathway: (pathway: CompliancePathway | null) => void;

  // Active Confidence
  activeConfidence: ConfidenceResult | null;
  setActiveConfidence: (conf: ConfidenceResult | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: "en",
  setLanguage: (lang) => set({ language: lang }),

  messages: [],
  setMessages: (messages) =>
    set((state) => ({
      messages: typeof messages === "function" ? messages(state.messages) : messages,
    })),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (updater) =>
    set((state) => {
      if (state.messages.length === 0) return state;
      const newMessages = [...state.messages];
      const lastIndex = newMessages.length - 1;
      newMessages[lastIndex] = updater(newMessages[lastIndex]);
      return { messages: newMessages };
    }),
  clearMessages: () =>
    set({
      messages: [],
      activeCitations: [],
      highlightedCitationId: null,
      activePathway: null,
      activeConfidence: null,
    }),
  isStreaming: false,
  setIsStreaming: (streaming) => set({ isStreaming: streaming }),

  activeCitations: [],
  setActiveCitations: (citations) =>
    set({
      activeCitations: citations,
      isDrawerOpen: citations.length > 0 ? true : false,
    }),
  highlightedCitationId: null,
  setHighlightedCitationId: (refId) =>
    set({
      highlightedCitationId: refId,
      isDrawerOpen: refId ? true : false,
    }),
  isDrawerOpen: false,
  setIsDrawerOpen: (open) => set({ isDrawerOpen: open }),

  activePathway: null,
  setActivePathway: (pathway) => set({ activePathway: pathway }),

  activeConfidence: null,
  setActiveConfidence: (conf) => set({ activeConfidence: conf }),
}));
