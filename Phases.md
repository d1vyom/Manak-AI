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
  - *Git Commit*: `9f2349f`

- [x] **Phase 2: Knowledge Base & Ingestion Pipeline**
  - Python ingestion scripts (`ingestion/` with PyMuPDF, structure-aware chunking)
  - Clause-level boundary splitting & breadcrumb context injection
  - Curated seed dataset of Tier 1 BIS standards (IS 14543, IS 10500, IS 2347, IS 9873, IS 4151, IS 1786, IS 456)
  - QCO gazette notification records & metadata configs
  - Database seed script (`src/lib/db/seed.ts`) and typed dataset (`src/lib/data/seed-data.ts`)
  - *Status*: Completed & Verified (Python syntax checks pass, seed dataset validated, Next.js build clean)
  - *Git Commit*: `d2586e7`

- [x] **Phase 3: Database & Hybrid Vector Search**
  - Supabase PostgreSQL project provisioned (`manak-ai` in `ap-south-1`) via Supabase MCP
  - Extensions enabled: `vector` (pgvector) and `pg_trgm`
  - Database schema, HNSW index, and tsvector GIN index applied
  - Hybrid search RPC function (`hybrid_search`) with Reciprocal Rank Fusion (RRF k=60) created
  - Seed dataset loaded into Supabase tables (`documents`, `document_chunks`, `qcos`)
  - TypeScript query access layer (`src/lib/db/queries.ts`) with live Supabase & in-memory fallback
  - API endpoints `/api/standards` and `/api/search` implemented
  - *Status*: Completed & Verified (Live Supabase queries tested, keyword search validated, Next.js build clean)
  - *Git Commit*: `6887e6c`

- [x] **Phase 4: RAG Pipeline Engine**
  - Gemini client wrapper initialized (`gemini-3.6-flash` and `gemini-embedding-2`) with live API
  - Structured entity & intent extraction (`src/lib/llm/entity-extraction.ts`)
  - Hybrid retrieval & evidence block assembly (`src/lib/rag/evidence.ts`)
  - Retrieval-grounded confidence scoring (`src/lib/rag/confidence.ts`) with mathematical signal weights
  - End-to-end RAG orchestrator (`src/lib/rag/pipeline.ts`) with anti-hallucination prompts
  - Server-Sent Events (SSE) streaming API route (`POST /api/chat`)
  - *Status*: Completed & Verified (Live RAG pipeline test passed, 0 hallucinations detected, Next.js build clean)
  - *Git Commit*: `c8e7ec2`

- [x] **Phase 5: Citation Engine & Verification**
  - Strict citation regex parsing and multi-bracket normalization (`src/lib/rag/verification.ts`)
  - Authentic verbatim quote extraction from source evidence chunks for frontend citation cards
  - Anti-hallucination verification (checking ref IDs, authentic standard numbers, and calculating grounding score)
  - Indian Standards cross-reference relationship knowledge graph (`src/lib/data/standards-graph.ts`)
  - Out-of-scope abstention guardrail with official BIS portal guidance (`src/lib/rag/abstention.ts`)
  - Robust exponential backoff retry for Gemini API rate limits (`src/lib/llm/gemini.ts`)
  - *Status*: Completed & Verified (14/14 unit tests passed, 4/4 live pipeline compliance & abstention tests passed)
  - *Git Commit*: `8e66348`

- [x] **Phase 6: Compliance Pathway & Gap Analysis**
  - Structured 7-step certification pathway builder (`src/lib/compliance/pathway.ts`)
  - Compliance gap analysis engine (`src/lib/compliance/gap-analysis.ts`)
  - Requirement audit classifier (SATISFIED, NOT_SATISFIED, NEEDS_VERIFICATION across materials, testing, certification, manufacturing, and documentation)
  - Dedicated API endpoints: `POST /api/compliance/pathway` and `POST /api/compliance/gap-analysis`
  - *Status*: Completed & Verified (30/30 unit and integration assertions passed, clean Next.js 15 build)
  - *Git Commit*: `39a0e11`

- [x] **Phase 7: Multilingual Support (Hindi & English)**
  - Devanagari Unicode language detection & Hinglish transliteration classifier (`src/lib/utils/language.ts`)
  - Cross-lingual technical keyword extraction dictionary bridging Hindi terms to English standard vectors
  - Latin alphanumeric script preservation ensuring `IS XXXXX` designations are never phonetically distorted
  - Type-safe bilingual UI dictionary with 30+ terms for all platform modules (`src/lib/utils/i18n.ts`)
  - Integrated with live streaming RAG pipeline and verified end-to-end with live Hindi query
  - *Status*: Completed & Verified (31/31 assertions passed, clean Next.js 15 build)
  - *Git Commit*: `99e02c9`

- [x] **Phase 8: Enterprise Frontend UI (with Google Stitch MCP)**
  - Design system: Government/Enterprise aesthetic (Navy `#1B2A4A`, Saffron `#F28C28`, Gold `#D4AF37`) modeled with Google Stitch MCP (`projects/12642712368715710458`)
  - High-fidelity screens and tokens modeled with Google Stitch MCP
  - Header with BIS emblem branding, navigation, and live Hindi/English bilingual switch
  - Landing Page (`/`): Hero, live stats counter, 4 capability cards, interactive example prompts
  - AI Chat Page (`/chat`): Split-panel layout (60% chat stream with inline clickable citations [1][2], 40% interactive source drawer with verbatim quotes)
  - Standards Explorer Page (`/explore`): Searchable, filterable standards index with table & card grid views and clause flyout modal
  - Compliance Audit Page (`/compliance`): Interactive audit form with verified presets, readiness score ring, and detailed requirement gap checklist
  - E2E Playwright verification on live production build (Hindi toggle, compliance presets, audit calculation)
  - *Status*: Completed & Verified (Clean Next.js 15 production build, 9/9 pages generated, Playwright UI verified)
  - *Git Commit*: `cfb1d01`


- [x] **Phase 9: Testing, Evaluation & Playwright Verification**
  - Benchmark dataset (`evaluation/benchmark.json`) with 26 ground truth questions across 6 categories (Manufacturer, QCO, Test Limits, Abstention, Multilingual, Consumer)
  - Automated evaluation harness (`evaluation/run-evaluation.ts`) computing quantitative metrics & generating `evaluation/EVALUATION_REPORT.md`:
    - **Recall@5**: 100.0% (24/24 in-scope queries)
    - **Precision@5**: 79.2%
    - **Abstention Accuracy**: 100.0% (2/2 out-of-scope guardrail refusals)
    - **Latin Script Preservation**: 100.0% (4/4 Hindi/Hinglish IS standard code preservation)
    - **Live Citation Faithfulness**: 100.0%
    - **Hallucination Rate**: 0.0% (Strict anti-hallucination verified)
  - Playwright automated E2E test suite (`tests/e2e.ts`) verifying all core user flows:
    - Test 1: Landing page loads with SIH problem statement and title
    - Test 2: Hindi language toggle updates navigation and hero texts
    - Test 3: Standards Explorer loads standard catalogue and filters by QCO
    - Test 4: Standards Explorer opens details modal with normative clauses
    - Test 5: Compliance Gap Analysis loads demo presets and runs gap audit
    - Test 6: AI Chat queries BIS engine, streams tokens, and populates evidence drawer
    - Result: 6/6 Passed (100% SUCCESS)
  - *Status*: Completed & Verified
  - *Git Commit*: `406e959`

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
