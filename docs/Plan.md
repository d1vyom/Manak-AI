# Manak AI — Implementation Plan

> Development roadmap, phased tasks, team allocation, and timeline for SIH 2026

---

## Phase Overview

| Phase | Focus | Duration | Difficulty |
|---|---|---|---|
| 1 | Project Setup | 1 day | Easy |
| 2 | Knowledge Base Ingestion | 3-4 days | Medium |
| 3 | Database + Vector Search | 2 days | Medium |
| 4 | RAG Pipeline | 3-4 days | Hard |
| 5 | Citation Engine | 2 days | Medium |
| 6 | Compliance Pathway | 2 days | Medium |
| 7 | Multilingual Support | 1-2 days | Medium |
| 8 | Frontend | 4-5 days | Medium |
| 9 | Testing & Evaluation | 2 days | Medium |
| 10 | Deployment | 1 day | Easy |
| 11 | Demo Preparation | 2 days | Easy |
| **Total** | | **~23-28 days** | |

> [!TIP]
> Phases can overlap. Backend (4-7) and Frontend (8) can run in parallel with different team members. Actual critical path is ~18-20 days.

---

## Team Roles (4-6 Members)

| Role | Responsibilities | Phases |
|---|---|---|
| **Backend Lead** | RAG pipeline, API endpoints, Gemini integration | 3, 4, 5, 6, 7 |
| **Frontend Lead** | Next.js UI, components, responsive design | 1, 8 |
| **Data Engineer** | PDF parsing, ingestion pipeline, database setup | 2, 3 |
| **AI/Prompt Engineer** | Prompt design, entity extraction, evaluation | 4, 5, 7, 9 |
| **DevOps / Full-Stack** | Deployment, CI, testing, demo prep | 1, 10, 11 |
| **Research / Content** | BIS document sourcing, metadata, QCO data | 2, 9, 11 |

---

## Phase 1 — Project Setup (Day 1)

### Tasks
- [ ] Initialize Next.js 15 project with App Router, TypeScript, Tailwind CSS
- [ ] Install dependencies: `@google/genai`, `@prisma/client`, `@supabase/supabase-js`, `zod`, shadcn/ui
- [ ] Set up project folder structure (as defined in `brain.md`)
- [ ] Create Supabase project, enable pgvector extension
- [ ] Set up Prisma schema and initial migration
- [ ] Configure environment variables (`.env.local`, `.env.example`)
- [ ] Set up Git repository, `.gitignore`
- [ ] Create Google AI Studio API key
- [ ] Verify Gemini API connection (simple test call)
- [ ] Set up ESLint + Prettier

### Expected Output
- Clean Next.js project running on `localhost:3000`
- Supabase project with pgvector enabled
- Prisma connected to Supabase
- Gemini API key working

### Dependencies
- None

### Team
- Frontend Lead + DevOps

---

## Phase 2 — Knowledge Base Ingestion (Days 2-5)

### Tasks
- [ ] **Document Sourcing** (Day 2)
  - Download 15-20 priority BIS standard PDFs from BIS portal or Internet Archive
  - Focus on: IS 10500, IS 14543, IS 456, IS 1786, IS 2062, IS 269, IS 9873, IS 4151, IS 2347, IS 13252
  - Download relevant QCO gazette notifications
  - Create metadata config files for each document (standard number, year, type, mandatory status)

- [ ] **PDF Parser** (Days 2-3)
  - Build Python script using PyMuPDF (`fitz`)
  - Implement scanned-page detection heuristic
  - Implement OCR fallback with Tesseract (eng+hin)
  - Extract text blocks with page numbers
  - Detect tables using `page.find_tables()`
  - Detect clause headings via regex: `/^(?:Clause\s+)?(\d+(?:\.\d+)*)\s+([A-Z][^\n]+)/`

- [ ] **Structure-Aware Chunking** (Days 3-4)
  - Build chunker that splits at clause boundaries
  - Implement min/max token bounds (100-500)
  - Handle table chunking (include headers in each chunk)
  - Tag chunk types: clause, table, annexure_normative, annexure_informative, scope, definition
  - Build breadcrumb context: `[IS 14543:2016 | Clause 4.2 | Chemical Requirements]`
  - Establish parent-child chunk relationships

- [ ] **Embedding Generation** (Day 4-5)
  - Build embedding script using Gemini Embedding 2 API
  - Generate 768-dim embeddings for each chunk's `content_with_context`
  - Implement rate-limit handling (sleep/retry)
  - Batch processing with progress bar

- [ ] **Database Population** (Day 5)
  - Insert documents into `documents` table
  - Insert chunks into `document_chunks` table with embeddings
  - Insert QCO data into `qcos` table
  - Upload PDFs to Supabase Storage
  - Verify data integrity

### Expected Output
- Python ingestion pipeline (`ingestion/` folder)
- 15-20 processed documents in database
- ~2,000-5,000 chunks with embeddings
- QCO data populated
- PDFs in Supabase Storage

### Dependencies
- Phase 1 complete (database exists)

### Team
- Data Engineer + Research/Content

### Difficulty
- **Medium** — PDF parsing quality varies; expect manual cleanup for some documents

---

## Phase 3 — Database + Vector Search (Days 4-5)

### Tasks
- [ ] Create hybrid search RPC function in Supabase SQL Editor
- [ ] Build HNSW index on embeddings column
- [ ] Build GIN index on tsvector column
- [ ] Build B-tree indexes on metadata columns
- [ ] Test vector search independently with sample queries
- [ ] Test keyword search independently
- [ ] Test hybrid search with RRF fusion
- [ ] Build TypeScript wrapper functions for hybrid search (`src/lib/db/queries.ts`)
- [ ] Build embedding generation utility (`src/lib/db/embeddings.ts`)
- [ ] Verify Prisma raw SQL works with pgvector

### Expected Output
- Working hybrid search that returns relevant chunks for test queries
- TypeScript functions wrapping database operations
- Latency benchmarks (target: < 200ms for hybrid search)

### Dependencies
- Phase 2 at least partially complete (some chunks in DB)

### Team
- Backend Lead + Data Engineer

---

## Phase 4 — RAG Pipeline (Days 6-9)

### Tasks
- [ ] **Gemini Client** (`src/lib/llm/gemini.ts`)
  - Initialize `@google/genai` client
  - Create wrapper for `generateContent` with streaming
  - Create wrapper for embedding generation
  - Implement error handling and rate limiting

- [ ] **Entity Extraction** (`src/lib/llm/entity-extraction.ts`)
  - Build Gemini 2.5 Flash-Lite prompt for structured entity extraction
  - Extract: product, material, standard_number, clause_number, industry, intent
  - Return JSON-structured output
  - Handle Hindi queries (extract both Hindi and English keywords)

- [ ] **Retrieval Module** (`src/lib/rag/retrieval.ts`)
  - Build query embedding generation
  - Build metadata filter construction from extracted entities
  - Call hybrid search RPC
  - Return ranked results with metadata

- [ ] **Evidence Assembly** (`src/lib/rag/evidence.ts`)
  - Format retrieved chunks as evidence blocks
  - Assign reference IDs (REF_1, REF_2, ...)
  - Include all metadata (standard, clause, page, URL)
  - Determine mandatory/voluntary status for each source

- [ ] **Confidence Scoring** (`src/lib/rag/confidence.ts`)
  - Implement retrieval-based confidence calculation
  - Score based on: top similarity, hybrid consensus, metadata match, score margin
  - Classify as HIGH / MEDIUM / LOW
  - Generate explanation string

- [ ] **LLM Generation** (`src/lib/rag/pipeline.ts`)
  - Build system prompt with citation rules
  - Inject evidence blocks with reference IDs
  - Stream response from Gemini 2.5 Flash
  - Post-process: extract and validate citations

- [ ] **Citation Validation** (`src/lib/rag/citations.ts`)
  - Extract `[REF_N]` patterns from LLM response
  - Validate each citation exists in provided context
  - Flag any hallucinated citations
  - Map citations to source metadata

- [ ] **API Route** (`src/app/api/chat/route.ts`)
  - POST endpoint accepting user query + language preference
  - Orchestrate full RAG pipeline
  - Return structured response with streaming
  - Error handling

### Expected Output
- End-to-end RAG pipeline: query → answer with citations
- Working `/api/chat` endpoint
- Citation validation working
- Confidence scoring working

### Dependencies
- Phase 3 complete

### Team
- Backend Lead + AI/Prompt Engineer

### Difficulty
- **Hard** — Most critical phase; prompt engineering requires iteration

---

## Phase 5 — Citation Engine (Days 9-10)

### Tasks
- [ ] Refine citation extraction regex
- [ ] Build citation formatting for frontend consumption
- [ ] Test citation accuracy on 10+ sample queries
- [ ] Implement "no citation found" handling
- [ ] Build related standards suggestion (based on co-occurring documents in results)
- [ ] Test mandatory/voluntary determination accuracy

### Expected Output
- > 90% citation accuracy on test queries
- Clean citation data structure for frontend

### Dependencies
- Phase 4 complete

### Team
- AI/Prompt Engineer + Backend Lead

---

## Phase 6 — Compliance Pathway (Days 10-11)

### Tasks
- [ ] **Pathway Generation** (`src/lib/compliance/pathway.ts`)
  - Build prompt that converts retrieved evidence into structured pathway
  - Define step categories: Standards, Mandatory Status, Requirements, Testing, Manufacturing, Certification, Next Steps
  - Parse LLM response into CompliancePathway data structure
  - Link each step to citations

- [ ] **Gap Analysis** (`src/lib/compliance/gap-analysis.ts`)
  - Build input form data structure
  - Build comparison prompt: user data vs retrieved requirements
  - Parse into RequirementGap structure
  - Add disclaimers

- [ ] **API Routes**
  - POST `/api/compliance` — compliance pathway from query
  - POST `/api/gap-analysis` — gap analysis from user input

### Expected Output
- Compliance pathway generation working for demo queries
- Gap analysis generating structured output
- Clear disclaimers included

### Dependencies
- Phase 4 complete

### Team
- Backend Lead

---

## Phase 7 — Multilingual Support (Days 11-12)

### Tasks
- [ ] **Language Detection** (`src/lib/utils/language.ts`)
  - Regex-based Hindi detection (Devanagari character range)
  - Fallback to Flash-Lite for ambiguous cases
  - Cache detection results

- [ ] **Cross-lingual Keyword Extraction**
  - For Hindi queries, extract English keywords via Flash-Lite
  - Preserve standard numbers in original form
  - Generate both Hindi and English search terms

- [ ] **Response Language Control**
  - Update system prompt to respond in user's language
  - Ensure standard numbers stay in Latin script
  - Test Hindi response quality

- [ ] **UI Strings**
  - Create translation map for UI labels (Hindi/English)
  - Language toggle component

### Expected Output
- Hindi query → Hindi response with correct citations
- Language toggle working in UI
- Standard numbers preserved in both languages

### Dependencies
- Phase 4 complete

### Team
- AI/Prompt Engineer

---

## Phase 8 — Frontend (Days 6-12, parallel with backend)

### Tasks
- [ ] **Layout & Branding** (Day 6-7)
  - Set up shadcn/ui components
  - Create Header with Manak AI branding (Ashoka Chakra / BIS-inspired)
  - Create professional color scheme (government-blue, saffron accents)
  - Responsive layout

- [ ] **Landing Page** (Day 7)
  - Hero section with product description
  - Feature highlights (3-4 cards)
  - Example queries section
  - "Try Manak AI" CTA button

- [ ] **Chat Interface** (Days 8-9)
  - ChatInterface component with input area
  - ChatMessage component (user + assistant)
  - Markdown rendering for assistant messages
  - Streaming response display
  - Example query buttons
  - Loading/thinking states

- [ ] **Citation Panel** (Day 9-10)
  - Side panel or expandable section showing citations
  - CitationBadge component (inline `[1]` links)
  - Source details: Standard, Clause, Page
  - Link to source URL
  - MandatoryBadge (mandatory/voluntary indicator)

- [ ] **Confidence Indicator** (Day 10)
  - ConfidenceBadge component (HIGH/MEDIUM/LOW)
  - Color-coded: green/yellow/red
  - Tooltip with explanation

- [ ] **Compliance Pathway View** (Day 10-11)
  - Step-by-step visual workflow
  - Vertical timeline/stepper component
  - Each step shows title, description, status badge, references
  - Collapsible details

- [ ] **Gap Analysis Form** (Day 11)
  - Form with fields: product, material, capacity, current tests, certifications
  - Results table: requirement, status, recommendation
  - Summary statistics
  - Disclaimer

- [ ] **Standards Explorer** (Day 11-12)
  - Searchable list/table of indexed standards
  - Filters: document type, mandatory status, industry
  - Standard detail view with metadata

- [ ] **Language Toggle** (Day 12)
  - Hindi/English switch in header
  - Translate UI labels
  - Pass language preference to API

### Expected Output
- Complete, polished UI
- All pages functional and responsive
- Professional government/enterprise aesthetic

### Dependencies
- API endpoints available for integration (Phase 4+)

### Team
- Frontend Lead (+ 1 helper)

---

## Phase 9 — Testing & Evaluation (Days 13-14)

### Tasks
- [ ] Create benchmark dataset: 20-30 BIS questions with expected answers
- [ ] Run evaluation script measuring:
  - Retrieval Recall@K and Precision@K
  - Citation correctness (% of valid citations)
  - Answer faithfulness (does answer match evidence?)
  - Hallucination rate
  - Hindi query accuracy
  - Response latency
- [ ] Fix issues found during evaluation
- [ ] Prompt tuning based on failures
- [ ] End-to-end testing of all demo flows
- [ ] Mobile responsiveness check
- [ ] Error state testing

### Expected Output
- Evaluation report with metrics
- All demo queries working reliably
- Known issues documented

### Dependencies
- Phases 4-8 complete

### Team
- AI/Prompt Engineer + entire team

---

## Phase 10 — Deployment (Day 15)

### Tasks
- [ ] Push to GitHub (ensure `.env` is gitignored)
- [ ] Connect Vercel to GitHub repo
- [ ] Set environment variables in Vercel dashboard
- [ ] Deploy and verify production build
- [ ] Test all features on production URL
- [ ] Set up Supabase project auto-wake (prevent pausing)
- [ ] Verify API latency on Vercel
- [ ] Configure Vercel function timeout (increase to 30-60s if needed)

### Expected Output
- Live URL on Vercel
- All features working in production
- Acceptable latency

### Dependencies
- Phase 9 complete

### Team
- DevOps

---

## Phase 11 — Demo Preparation (Days 16-17)

### Tasks
- [ ] Practice 3-5 minute demo flow
- [ ] Pre-test all demo queries on production
- [ ] Prepare backup responses (in case API fails during demo)
- [ ] Create 1-slide architecture diagram for judges
- [ ] Prepare answers for expected judge questions:
  - "How do you handle documents you haven't ingested?"
  - "What prevents hallucination?"
  - "Is this legally valid?"
  - "How does it scale?"
  - "What's novel compared to ChatGPT?"
- [ ] Record backup video demo (in case of network issues)
- [ ] Test on multiple browsers/devices

### Expected Output
- Smooth, rehearsed 3-5 minute demo
- Backup plan ready
- Team confident on Q&A

### Dependencies
- Phase 10 complete

### Team
- Entire team

---

## Critical Path & Parallelization

```
Week 1: Phase 1 (all) → Phase 2 (Data team) | Phase 8 starts (Frontend)
Week 2: Phase 3 → Phase 4 (Backend) | Phase 8 continues (Frontend)
Week 3: Phase 5 + 6 + 7 (Backend) | Phase 8 completes (Frontend)
Week 4: Phase 9 (all) → Phase 10 → Phase 11
```

> [!IMPORTANT]
> **The critical bottleneck is Phase 2 (Ingestion)**. If PDFs are poorly structured or OCR quality is low, this phase can expand significantly. Start ingestion early and be prepared to manually clean documents.

---

## Risk Mitigation During Development

| Risk | Mitigation |
|---|---|
| PDF parsing fails on certain documents | Manually extract key clauses as JSON; have 5 clean documents minimum |
| Gemini API rate limits hit | Implement exponential backoff; cache demo responses |
| Low retrieval quality | Increase top-K; add more metadata to chunks; improve prompts |
| Frontend takes too long | Use shadcn/ui templates; simplify to essentials only |
| Supabase project pauses | Set up daily cron ping; have backup local database |
| Demo network failure | Pre-record backup video; cache responses client-side |
