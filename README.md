<div align="center">

# 🇮🇳 MANAK AI (मानक AI)
### **Autonomous BIS Standards Intelligence & Regulatory Compliance Platform**

**Smart India Hackathon (SIH 2026) — Problem Statement SIH26107**  
*Team CodeSmiths • Empowering Indian MSMEs & Manufacturers with Zero-Hallucination Compliance*

---

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1.7-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-PyMuPDF_Ingestion-3776AB?style=for-the-badge&logo=python&logoColor=white)](ingestion/)
[![Google Gemini 2.5](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Supabase pgvector](https://img.shields.io/badge/Supabase-pgvector-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![E2E Tests](https://img.shields.io/badge/Playwright-100%25_Passing-brightgreen?style=for-the-badge&logo=playwright&logoColor=white)](tests/)
[![Bilingual](https://img.shields.io/badge/Bilingual-English_%7C_%E0%A4%B9%E0%A4%BF%E0%A4%82%E0%A4%A6%E0%A5%80-orange?style=for-the-badge)](#-bilingual-support)

---

[Executive Overview](#-executive-overview) • [SIH Presentation Deck](#-sih-2026-presentation-deck) • [Feature Comparison](#-feature-comparison) • [Document Processing (PyMuPDF)](#-document-processing-pipeline-python--pymupdf) • [Architecture & RAG](#-technical-architecture--hybrid-rag) • [UI Showcase](#-interactive-ui-showcase) • [Quick Start](#-quick-start-guide) • [Docs](#-project-documentation)

</div>

---

## 📌 Executive Overview

Navigating the **Bureau of Indian Standards (BIS)** and mandatory **Quality Control Orders (QCOs)** is daunting for India's 63+ million MSMEs. Technical jargon, complex testing tables, and frequent gazette amendments lead to costly delays, consulting fees, and shipment impoundments.

**Manak AI** transforms static BIS PDFs into an intelligent, interactive compliance copilot:
* ⚡ **Instant Regulatory Mapping**: Finds applicable Indian Standards (IS), mandatory QCO dates, and testing requirements in seconds.
* 🛡️ **Zero Hallucination with Proof**: Every statement is backed by clause-level citations, section numbers, and verified official excerpts.
* 📊 **Automated Gap Analysis**: Evaluates manufacturing readiness, identifies missing quality tests, and generates a 7-step certification roadmap.
* 🌐 **Equitable Bilingual Access**: Seamless native toggle between English and Hindi (हिन्दी) for grassroots manufacturers across Tier-2/3 industrial clusters.

---

## 🎯 SIH 2026 Presentation Deck

Below are the executive presentation slides submitted for **Smart India Hackathon 2026**:

### Slide 1: Solution Highlights & Pipeline
*Overview of core capabilities: End-to-end compliance roadmaps, automated gap analysis, evidence-backed citations, and version awareness.*
![Solution Highlights](docs/assets/slides/01_solution_highlights.png)

---

### Slide 2: Technical Approach & Tech Stack
*Full-stack pipeline from user query understanding, dense + sparse hybrid retrieval, and RRF ranking, to Gemini grounding and citation validation.*
![Technical Approach](docs/assets/slides/02_technical_approach.png)

---

### Slide 3: Feasibility & Business Viability
*Demonstrating technical viability on production-ready cloud services and massive business value (faster time-to-market, lower consulting costs, safer products).*
![Feasibility and Viability](docs/assets/slides/03_feasibility_viability.png)

---

### Slide 4: Impact & Measurable Benefits
*Real-world outcomes: 70%+ time saved, 90%+ accurate answers, empowering MSMEs, consumers, consultants, and regulators.*
![Impact and Benefits](docs/assets/slides/04_impact_benefits.png)

---

### Slide 5: Feature Comparison Matrix
*Clear comparison showing why Manak AI outperforms the static BIS portal, generic ChatPDF tools, and expensive consultants.*
![Feature Comparison](docs/assets/slides/05_feature_comparison.png)

---

## ⚖️ Feature Comparison

| Capability | **MANAK AI (Our Solution)** | Official BIS Portal | Generic ChatPDF / RAG | Regulatory Consultants |
| :--- | :---: | :---: | :---: | :---: |
| **Instant Self-Service Q&A UI** | 🟢 **Yes (Interactive)** | 🔴 No | 🟢 Yes | 🔴 No |
| **Precise Clause & Page Citations** | 🟢 **Yes (Clause-level)** | 🔴 No | 🟡 Basic / Unverified | 🟢 Yes |
| **Automated AI Compliance Pathway** | 🟢 **Yes (7-Step Roadmap)**| 🔴 No | 🔴 No | 🔴 No |
| **Automated Gap Analysis** | 🟢 **Yes (Instant Audit)** | 🔴 No | 🔴 No | 🔴 No |
| **Latest Standards & QCO Version Aware**| 🟢 **Yes (Active prioritised)**| 🟡 Manual Search | 🔴 No (Stale/Confused) | 🟢 Human Expertise |
| **Native Bilingual UI (Hindi / English)**| 🟢 **Yes (Full Localization)**| 🟡 Partial | 🔴 Weak | 🔴 No |
| **Operational Speed & Cost** | 🟢 **Fast / Low Cost** | 🟡 Slow / Free | 🟢 Fast / Low Cost | 🔴 Slow / High Cost |

---

## 📄 Document Processing Pipeline (Python & PyMuPDF)

BIS standards and gazette notifications are highly complex documents containing nested clauses, technical tables, footnotes, and occasionally scanned pages. Manak AI features a dedicated, production-grade Python ingestion pipeline in [`ingestion/`](ingestion/) powered by **PyMuPDF (`fitz`)**:

```
[BIS Standard / Gazette PDF]
           │
           ▼
  [ingestion/parser.py]
  ├── PyMuPDF (fitz) High-Speed Text & Layout Parsing
  ├── Scanned Page Detection Heuristic (len(text) < 50 & images > 0)
  │    └── Tesseract OCR Fallback (English + Hindi: eng+hin)
  ├── Structured Table Extraction (`page.find_tables()`) ➔ Markdown Tables
  └── Clause Boundary Regex Engine (`Clause X.X`, `Annexure [A-Z]`)
           │
           ▼
  [ingestion/chunker.py]
  ├── Context-Preserving Clause Hierarchy Assembly
  └── Self-Contained Chunk Generation with Parent Metadata
           │
           ▼
  [ingestion/embedder.py]
  └── Gemini Embedding 2 (768-dim Vector Embeddings)
           │
           ▼
  [Supabase PostgreSQL]
  ├── pgvector (HNSW Index for Cosine Similarity)
  └── PostgreSQL FTS (tsvector & trigram matching)
```

### Key Ingestion Highlights:
1. **High-Speed PyMuPDF Parsing**: Uses `pymupdf` (`fitz`) to extract text and layout coordinates up to 10x faster than traditional PDF parsers.
2. **Native Table Recovery**: Identifies tabular data using PyMuPDF's `find_tables()` API and converts it into structured Markdown tables so the LLM retains exact testing limits, tolerances, and parameter values.
3. **Scanned Page OCR Fallback**: If a page is a scanned document (common in older gazette notifications), it automatically invokes **Tesseract OCR** with bilingual support (`lang="eng+hin"`).
4. **Clause-Aware Segmentation**: Rather than arbitrary character chunking, `BISDocumentParser` segments text by regulatory clauses (e.g., `Clause 4.1`, `Clause 7.2.3`), preventing fragmented rules.
5. **Metadata Enrichment**: Chunks are enriched with standard number, year, section title, page number, and mandatory QCO enforcement dates before vectorization.

---

## 🏗️ Technical Architecture & Hybrid RAG

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Next.js 15 App Router)"]
        UI["Web Interface (Bilingual EN/HI)"]
        Chat["Compliance Chat & Split Evidence Drawer"]
        Audit["Gap Analysis & 7-Step Pathway Planner"]
    end

    subgraph API ["Edge & API Layer"]
        Route["Next.js Route Handlers (SSE Streaming)"]
        QueryEngine["Query Preprocessing & Intent Detection"]
    end

    subgraph Retrieval ["Hybrid Retrieval Engine"]
        Dense["Dense Vector Search<br/>(Gemini Embeddings 768-d)"]
        Sparse["Sparse Keyword Search<br/>(PostgreSQL tsvector & trigram)"]
        RRF["Reciprocal Rank Fusion (RRF k=60)<br/>Score = Σ 1/(60 + rank)"]
    end

    subgraph Intelligence ["Inference & Verification"]
        Gemini["Google Gemini 2.5 Flash"]
        Auditor["Dual-Tier Citation & Grounding Auditor"]
    end

    subgraph Storage ["Supabase PostgreSQL"]
        PGV["pgvector (Vector Chunks)"]
        FTS["Full-Text Index"]
        Catalog["Standards & QCO Catalog"]
    end

    UI --> Route
    Chat --> Route
    Audit --> Route
    Route --> QueryEngine
    QueryEngine --> Dense
    QueryEngine --> Sparse
    Dense --> PGV
    Sparse --> FTS
    PGV --> RRF
    FTS --> RRF
    RRF --> Gemini
    Gemini --> Auditor
    Auditor -->|Verified + Cited| Route
```

### Reciprocal Rank Fusion (RRF)
To ensure both exact standard codes (like `IS 16046 (Part 2)`) and conceptual queries (like *"lithium battery drop test"*) are retrieved with 100% recall, we combine vector and keyword ranks:

$$\text{RRF Score}(d) = \sum_{m \in \{\text{dense}, \text{sparse}\}} \frac{1}{60 + r_m(d)}$$

### Anti-Hallucination Citation Auditor
Before streaming tokens to the client, the response passes through a verification check that cross-references every cited clause against the retrieved evidence chunk. If a claim lacks supporting text, it is flagged or safely suppressed.

---

## 📸 Interactive UI Showcase

| 1. Landing Page & Intelligence Hub | 2. Live Standards Explorer |
| :---: | :---: |
| ![Landing Page](docs/assets/screenshots/01_landing_hero.png) | ![Standards Explorer](docs/assets/screenshots/02_standards_explorer.png) |
| *Hero search launcher, quick metrics, and key features.* | *Searchable catalog with active/withdrawn filters and QCO tags.* |

| 3. Deep Clause Dossier Modal | 4. Automated Compliance Gap Engine |
| :---: | :---: |
| ![Clause Dossier](docs/assets/screenshots/03_standard_details_modal.png) | ![Gap Engine](docs/assets/screenshots/04_compliance_audit_engine.png) |
| *Clause breakdown, testing requirements, and gazette links.* | *Interactive readiness meter, gap checklist, and lab directory.* |

| 5. AI Chat with Split Evidence Drawer | 6. Native Bilingual Support (हिन्दी) |
| :---: | :---: |
| ![AI Chat](docs/assets/screenshots/05_ai_chat_citations.png) | ![Hindi UI](docs/assets/screenshots/06_bilingual_hindi.png) |
| *Streaming Q&A with side-by-side clause verification.* | *Full Devanagari localization for grassroots industrialists.* |

---

## 📊 Evaluation & Benchmarks

Benchmarked against official BIS regulatory test scenarios:

| Metric | Manak AI | Generic RAG | Methodology |
| :--- | :---: | :---: | :--- |
| **Retrieval Recall@5** | **100.0%** | 74.5% | Relevant BIS clauses found in top 5 results |
| **Retrieval Precision@5** | **79.2%** | 51.0% | Proportion of retrieved chunks directly relevant |
| **Faithfulness Score** | **100.0%** | 82.3% | Claims fully supported by retrieved BIS evidence |
| **Hallucination Rate** | **0.0%** | 14.8% | Frequency of fabricated standards, clauses, or specs |
| **P95 Response Latency** | **< 1.8s** | 4.2s | End-to-end stream start with citation verification |
| **E2E Test Coverage** | **100% Passing** | — | Automated Playwright regression test suite |

---

## 🛠️ Complete Tech Stack

```
Frontend & UI
├── Next.js 15.1.7 (App Router & React 19)
├── TypeScript 5.7 (Strict type-checking)
├── Tailwind CSS 3.4 (Custom design system)
├── Lucide React (Accessible icons)
└── Zustand 5.0 (Bilingual & filter state management)

Backend & Artificial Intelligence
├── Next.js API Route Handlers (Edge & SSE streaming)
├── Google Gemini 2.5 Flash (Compliance reasoning & generation)
├── Google Gemini Embedding 2 (768-dim semantic vectors)
└── Reciprocal Rank Fusion (k=60 hybrid re-ranking)

Document Processing Pipeline
├── Python 3.11+
├── PyMuPDF (fitz >= 1.23.0) (High-speed PDF & table extraction)
├── Tesseract OCR (Fallback for scanned gazettes)
├── Pillow & Pydantic (Image preprocessing & schema validation)
└── BIS Structure Chunker (Clause boundary preservation)

Database & Storage
├── Supabase PostgreSQL 15
├── pgvector (HNSW vector similarity search)
├── PostgreSQL FTS (trigram & tsvector keyword search)
└── Prisma ORM 6.4 (Type-safe database client)

Testing & Deployment
├── Playwright (Cross-browser E2E testing)
├── Vercel (Edge deployment & CDN)
└── Automated Screenshot Capture Suite
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: `v20.x` or higher
* **Python**: `3.10+` (for document ingestion pipeline)
* **Google Gemini API Key**: [Google AI Studio](https://aistudio.google.com/)
* **Supabase Database** with `pgvector` enabled

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/manak-ai.git
cd manak-ai
```

### 2. Install Dependencies
```bash
# Install Web application dependencies
npm install

# Install Document processing pipeline dependencies
pip install -r ingestion/requirements.txt
```

### 3. Environment Configuration
Create a `.env.local` file in the project root:
```ini
# Google Gemini API
GEMINI_API_KEY="AIzaSy..."

# Supabase PostgreSQL (pgvector enabled)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Supabase Client Keys
NEXT_PUBLIC_SUPABASE_URL="https://[ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."
```

### 4. Database Setup & Ingestion
```bash
# Push Prisma schema to Supabase
npm run prisma:generate
npm run prisma:push

# (Optional) Run PyMuPDF document ingestion on raw BIS PDFs
python -m ingestion.ingest --embed
```

### 5. Start Development Server
```bash
npm run dev
# Open http://localhost:3000 in your browser
```

### 6. Run Test Suites
```bash
# Run Playwright End-to-End browser tests
npm run test:e2e

# Run RAG Retrieval & Faithfulness benchmark evaluation
npm run test:eval
```

---

## 📁 Repository Structure

```
manak-ai/
├── docs/                             # Engineering documentation & assets
│   ├── assets/
│   │   ├── screenshots/              # High-res application screenshots
│   │   └── slides/                   # SIH 2026 presentation slides
│   ├── PRD.md                        # Product Requirements Document
│   ├── brain.md                      # System Architecture & Algorithms
│   ├── Evaluation.md                 # RAG Evaluation & Benchmarks
│   ├── APISpec.md                    # REST / SSE API Specifications
│   └── Frontend.md                   # Design System & UI Architecture
├── ingestion/                        # Python Document Processing Pipeline
│   ├── parser.py                     # PyMuPDF parser + OCR fallback + table finder
│   ├── chunker.py                    # Clause boundary & hierarchy chunker
│   ├── embedder.py                   # Gemini 768-dim batch vector embedder
│   ├── ingest.py                     # CLI ingestion orchestrator
│   ├── config.py                     # Ingestion path & DB configurations
│   ├── requirements.txt              # Python dependencies (pymupdf, pytesseract)
│   └── data/                         # Source PDFs, metadata configs & seeds
├── evaluation/                       # Benchmark suite & evaluation datasets
│   ├── run-evaluation.ts             # Precision, Recall & Faithfulness harness
│   └── benchmark.json                # Ground-truth BIS test queries
├── prisma/
│   └── schema.prisma                 # Supabase PostgreSQL & pgvector schema
├── scripts/
│   ├── capture-screenshots.ts        # Automated Retina screenshot capture script
│   └── generate-presentation-pdf.ts  # Presentation dossier generator
├── src/
│   ├── app/                          # Next.js App Router routes & API endpoints
│   │   ├── api/                      # Standards search & chat streaming handlers
│   │   ├── chat/                     # AI compliance chat with citation drawer
│   │   ├── compliance/               # Gap analysis & 7-step roadmap UI
│   │   ├── explore/                  # Standards explorer & filtering UI
│   │   └── layout.tsx                # Root bilingual layout & navigation
│   ├── components/                   # Modular React 19 components
│   │   ├── chat/                     # Messages, citations & split drawer
│   │   ├── compliance/               # Gap gauges, checklist & lab cards
│   │   ├── standards/                # Filter bars, cards & clause modals
│   │   └── layout/                   # Navbar, footer & language switcher
│   ├── lib/                          # Core business logic & integrations
│   │   ├── gemini.ts                 # Gemini 2.5 Flash SDK wrapper
│   │   ├── hybrid-search.ts          # Reciprocal Rank Fusion (RRF) search engine
│   │   └── store/                    # Zustand client state (bilingual toggle)
│   └── types/                        # Type-safe TypeScript interfaces
├── tests/
│   └── e2e.ts                        # Playwright automated test suite
├── package.json
└── README.md
```

---

## 📖 Project Documentation

* 📑 [Product Requirements Document (PRD)](docs/PRD.md)
* 🏛️ [System Architecture & RAG Specification](docs/brain.md)
* 🔌 [API Specification](docs/APISpec.md)
* 🧪 [RAG Evaluation & Benchmark Report](docs/Evaluation.md)
* 🎨 [Frontend Architecture & Design Tokens](docs/Frontend.md)
* 🛡️ [Security & Cost Analysis](docs/Security-Cost-Risks.md)
* 🎙️ [SIH Judge Demonstration Script](docs/DemoScript.md)

---

## ⚖️ Disclaimer

**Manak AI** is an intelligent reference and regulatory audit copilot created to assist MSMEs, manufacturers, and compliance teams. It provides grounded references to official BIS documentation but does not replace statutory licenses or official audit decisions issued by the **Bureau of Indian Standards**. For official statutory certifications, visit [manakonline.in](https://www.manakonline.in).

---

<div align="center">

**Built with pride by Team CodeSmiths for Smart India Hackathon 2026 🇮🇳**  
*Empowering Atmanirbhar Bharat through Quality, Standards & Artificial Intelligence*

</div>
