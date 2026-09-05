# Manak AI — Phase Tracker & Build Progress

> **Project**: Manak AI (Bureau of Indian Standards Compliance Intelligence Platform)  
> **Repository**: [d1vyom/Manak-AI](https://github.com/d1vyom/Manak-AI)  
> **SIH 2026 Problem Statement**: SIH26107  
> **Status Tracker**: Use this file to monitor completed phases, active milestones, and git commits.

---

## Phase Checklist

- [x] **Phase 1: Project Setup & Foundation**
  - Next.js 15 App Router + TypeScript + Tailwind CSS setup
  - Core dependencies (`@google/genai`, `@supabase/supabase-js`, Prisma, Zod, Lucide)
  - Project directory structure & TypeScript interfaces
  - Prisma schema with vector and full-text search definitions
  - *Status*: Completed & Verified (Clean Next.js 15 build, TypeScript type checks, Prisma client generated)

- [ ] **Phase 2: Knowledge Base & Ingestion Pipeline**
  - Python ingestion scripts (`ingestion/` with PyMuPDF, structure-aware chunking)
  - Clause-level boundary splitting & breadcrumb context injection
  - Curated seed dataset of Tier 1 BIS standards (IS 14543, IS 10500, IS 2347, IS 9873, IS 4151, IS 1786, IS 456)
  - QCO gazette notification records & metadata configs
  - *Git Commit*: Pending

- [ ] **Phase 3: Database & Hybrid Vector Search**
  - Supabase PostgreSQL schema migration (HNSW vector index + GIN tsvector)
  - Hybrid search RPC function (`hybrid_search`) with Reciprocal Rank Fusion (RRF)
  - Database access layer (`src/lib/db/prisma.ts`, `src/lib/db/queries.ts`)
  - In-memory vector fallback for offline execution & testing
  - *Git Commit*: Pending

- [ ] **Phase 4: RAG Pipeline Engine**
  - Gemini client wrapper (`gemini-2.5-flash`, `gemini-2.5-flash-lite`, `gemini-embedding-2`)
  - Entity & intent extraction (product, material, standard, clause, industry)
  - Hybrid retrieval & evidence block assembly (`[REF_N | Standard | Clause | Page]`)
  - Retrieval-grounded confidence scoring (HIGH / MEDIUM / LOW)
  - Server-Sent Events (SSE) streaming API (`POST /api/chat`)
  - *Git Commit*: Pending

- [ ] **Phase 5: Citation Engine & Verification**
  - Strict citation regex parsing and reference map builder
  - Anti-hallucination verification (cross-checking claims against source text)
  - Related standards suggestion algorithm
  - Refusal & abstention response when evidence is insufficient
  - *Git Commit*: Pending

- [ ] **Phase 6: Compliance Pathway & Gap Analysis**
  - Structured 7-step certification pathway builder (`POST /api/compliance/pathway`)
  - Compliance gap analysis engine (`POST /api/compliance/gap-analysis`)
  - Requirement audit classifier (SATISFIED, NOT_SATISFIED, NEEDS_VERIFICATION)
  - *Git Commit*: Pending

- [ ] **Phase 7: Multilingual Support (Hindi & English)**
  - Devanagari language detection & fallback handler
  - Cross-lingual technical keyword extraction for search vector
  - Latin alphanumeric script preservation for Indian Standard designations
  - Bilingual UI strings and dictionary (`src/lib/utils/i18n.ts`)
  - *Git Commit*: Pending

- [ ] **Phase 8: Enterprise Frontend UI**
  - Design system: Government/Enterprise aesthetic (Navy `#1B2A4A`, Saffron `#F28C28`)
  - Header with BIS emblem branding, navigation, and Hindi/English switch
  - Landing Page (`/`): Hero, 4 capability cards, interactive example prompts
  - AI Chat Page (`/chat`): Split-panel (60% chat stream with inline citations, 40% source drawer)
  - Standards Explorer Page (`/explore`): Searchable, filterable standards index
  - Compliance Audit Page (`/compliance`): Multi-step form & gap analysis visualizer
  - *Git Commit*: Pending

- [ ] **Phase 9: Testing, Evaluation & Playwright Verification**
  - Benchmark dataset (`evaluation/benchmark.json`) with 25+ ground truth questions
  - Automated evaluation script for recall, precision, and faithfulness
  - Playwright E2E tests for chat, citations, language switch, and compliance form
  - *Git Commit*: Pending

- [ ] **Phase 10: Production Deployment**
  - Vercel deployment configuration (`vercel.json`), function timeouts, streaming
  - Supabase connection pooling setup (pgbouncer port 6543 vs direct 5432)
  - Production build verification (`npm run build`)
  - *Git Commit*: Pending

- [ ] **Phase 11: SIH Demo Rehearsal & Backup Guardrails**
  - Cached offline responses for 3 core demo queries (Manufacturer, Consumer, Hindi)
  - Demo script walkthrough verification
  - Fallback error resilience & judge presentation notes
  - *Git Commit*: Pending

---

## Instructions for AI Agents
1. Before starting any phase, read `docs/` and `AGENTS.md`.
2. Check `MANUAL_STEPS_AND_KEYS.md` for required keys or user actions.
3. Test and verify thoroughly before completing each phase.
4. Mark `[x]` on the completed phase, record the Git commit SHA, commit changes to GitHub, and request user permission before starting the next phase.
