import { create } from "zustand";
import { persist } from "zustand/middleware";
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

  // Theme State (Dark / Light Mode)
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;

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

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (lang) => set({ language: lang }),

      theme: "light",
      setTheme: (theme) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("manak-theme", theme);
          if (theme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
        set({ theme });
      },
      toggleTheme: () => {
        set((state) => {
          const nextTheme = state.theme === "dark" ? "light" : "dark";
          if (typeof window !== "undefined") {
            localStorage.setItem("manak-theme", nextTheme);
            if (nextTheme === "dark") {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
          }
          return { theme: nextTheme };
        });
      },

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
    }),
    {
      name: "manak-ai-app-storage",
      partialize: (state) => ({ language: state.language, theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== "undefined") {
          const storedTheme = localStorage.getItem("manak-theme") || state.theme;
          const isDark =
            storedTheme === "dark" ||
            (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
          if (isDark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      },
    }
  )
);

