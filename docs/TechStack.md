# Manak AI — Technology Stack

> **BIS Compliance Intelligence Platform** — SIH 2026 (SIH26107)

## Core Architecture

**Modular Next.js Monolith + Supabase**
- Single deployable unit, no microservices overhead
- Server-side and client-side in one codebase
- Supabase handles DB, auth, and storage

---

## Frontend

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 15.x (App Router) | Full-stack React framework |
| **TypeScript** | 5.x | Type safety across codebase |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **shadcn/ui** | Latest | Pre-built accessible components |
| **Lucide React** | Latest | Icon library |
| **Zustand** | Latest | Lightweight client state |
| **React Markdown** | Latest | Render LLM responses |

> [!TIP]
> shadcn/ui gives us a professional, government/enterprise aesthetic out of the box with minimal effort.

---

## Backend

| Technology | Version | Purpose |
|---|---|---|
| **Next.js Route Handlers** | 15.x | API endpoints via App Router |
| **Next.js Server Actions** | 15.x | Form handling, mutations |
| **TypeScript** | 5.x | Shared types across frontend/backend |
| **Zod** | Latest | Runtime request validation |

---

## Database & Storage

| Technology | Purpose |
|---|---|
| **Supabase PostgreSQL** | Primary relational database |
| **pgvector** (extension) | Vector similarity search |
| **PostgreSQL tsvector/tsquery** | Full-text keyword search (BM25-like) |
| **Supabase Storage** | PDF/document file storage |

---

## ORM & Database Access

| Technology | Purpose |
|---|---|
| **Prisma** | Schema management, migrations, typed CRUD |
| **Raw SQL (via Prisma `$queryRaw`)** | Vector search, full-text search, hybrid queries |

> [!IMPORTANT]
> Prisma does NOT natively support pgvector operations or PostgreSQL full-text search. All vector similarity queries, hybrid search, and tsvector operations MUST use `prisma.$queryRaw` or `prisma.$queryRawUnsafe`.

---

## AI / ML

| Technology | Purpose | Free Tier |
|---|---|---|
| **Gemini 2.5 Flash** | Primary LLM for generation | ✅ Free |
| **Gemini 2.5 Flash-Lite** | Query understanding, entity extraction | ✅ Free |
| **Gemini Embedding 2** | Text embeddings (768-dim for prototype) | ✅ Free |

### Model Selection Rationale

- **Gemini 2.5 Flash**: Best price-performance, 1M token context, free tier, reasoning capabilities
- **Gemini 2.5 Flash-Lite**: Cheaper/faster for simple extraction tasks (entity extraction, language detection)
- **Gemini Embedding 2**: Multimodal, multilingual (supports Hindi), flexible dimensions (128-3072), 8K token input limit, free tier

### Embedding Dimensions

| Dimension | Use Case | Recommendation |
|---|---|---|
| 768 | **Prototype (recommended)** — Good balance of quality and storage | ✅ Use this |
| 1536 | Production — Higher quality | Consider for production |
| 3072 | Maximum quality | Overkill for prototype |

> [!NOTE]
> 768 dimensions at `float4` = 3072 bytes per vector. For 10,000 chunks, total vector storage ≈ 30 MB — well within Supabase free tier (500 MB).

---

## Document Processing (Python)

| Technology | Purpose |
|---|---|
| **PyMuPDF (fitz)** | PDF text extraction, structure detection |
| **Tesseract OCR** | OCR for scanned PDFs (via pytesseract) |
| **Python 3.11+** | Ingestion pipeline runtime |

> [!NOTE]
> The ingestion pipeline is a **separate Python script**, not part of the Next.js app. It runs locally or in CI to process documents and populate the database. This is a deliberate architectural choice — PDF processing libraries are mature in Python, not JavaScript.

---

## Deployment

| Service | Purpose | Free Tier Limits |
|---|---|---|
| **Vercel** | Next.js hosting | 100 GB bandwidth, 10s serverless timeout (Hobby) |
| **Supabase** | PostgreSQL + pgvector + Storage | 500 MB DB, 1 GB storage, 50K monthly active users |
| **Google AI Studio** | Gemini API access | Free tier with rate limits |

---

## Development Tools

| Tool | Purpose |
|---|---|
| **pnpm** | Package manager (faster, disk-efficient) |
| **ESLint + Prettier** | Code quality |
| **Git + GitHub** | Version control |
| **dotenv** | Environment variable management |

---

## What We Are NOT Using (And Why)

| Technology | Why Not |
|---|---|
| **LangChain** | Over-abstraction for our use case; custom RAG pipeline is simpler and more transparent |
| **Pinecone / Weaviate** | pgvector in Supabase is free and sufficient; no separate vector DB needed |
| **Docker** | Adds complexity; Vercel + Supabase handles deployment |
| **Redis** | Not needed at prototype scale |
| **NextAuth.js** | Auth not needed for SIH demo; can add Supabase Auth later |
| **Microservices** | Over-engineering for a student prototype |
| **LlamaIndex** | Same as LangChain — custom is better for learning and control |
| **OpenAI** | Gemini has better free tier; SIH 2026 likely favors Indian/Google ecosystem |
