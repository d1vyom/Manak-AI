# Manak AI — Architecture & Brain Document

> Complete technical architecture, RAG design, database schema, citation system, and algorithmic details.

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER (Browser)                             │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  ┌───────────┐ │
│  │ Chat UI     │  │ Standards    │  │ Compliance │  │ Gap       │ │
│  │ (Hindi/Eng) │  │ Explorer     │  │ Pathway    │  │ Analysis  │ │
│  └──────┬──────┘  └──────┬───────┘  └─────┬──────┘  └─────┬─────┘ │
└─────────┼────────────────┼────────────────┼────────────────┼───────┘
          │                │                │                │
          ▼                ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Next.js App Router (Vercel)                     │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    API Layer (Route Handlers)                 │   │
│  │  POST /api/chat  │ POST /api/search │ GET /api/standards     │   │
│  │  POST /api/compliance │ POST /api/gap-analysis               │   │
│  └──────────────────────────┬───────────────────────────────────┘   │
│                              │                                       │
│  ┌──────────────────────────▼───────────────────────────────────┐   │
│  │                   RAG Pipeline Engine                         │   │
│  │                                                               │   │
│  │  ┌─────────────┐  ┌───────────────┐  ┌───────────────────┐   │   │
│  │  │ 1. Query    │  │ 2. Entity     │  │ 3. Language       │   │   │
│  │  │ Understand  │→ │ Extraction    │→ │ Detection         │   │   │
│  │  └─────────────┘  └───────────────┘  └───────────────────┘   │   │
│  │         │                                                     │   │
│  │         ▼                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────┐  │   │
│  │  │              4. Hybrid Retrieval                         │  │   │
│  │  │  ┌──────────┐  ┌───────────┐  ┌──────────────────────┐  │  │   │
│  │  │  │ Vector   │  │ Keyword   │  │ Metadata Filtering   │  │  │   │
│  │  │  │ Search   │  │ Search    │  │ (standard, year,     │  │  │   │
│  │  │  │(pgvector)│  │(tsvector) │  │  type, status)       │  │  │   │
│  │  │  └────┬─────┘  └────┬──────┘  └──────────┬───────────┘  │  │   │
│  │  │       └──────────────┴───────────────────┘               │  │   │
│  │  │                      │                                    │  │   │
│  │  │              ┌───────▼──────────┐                        │  │   │
│  │  │              │ 5. RRF Fusion    │                        │  │   │
│  │  │              └───────┬──────────┘                        │  │   │
│  │  └──────────────────────┼──────────────────────────────────┘  │   │
│  │                         │                                     │   │
│  │                ┌────────▼─────────┐                           │   │
│  │                │ 6. Re-ranking    │  (LLM-based or simple)    │   │
│  │                └────────┬─────────┘                           │   │
│  │                         │                                     │   │
│  │  ┌──────────────────────▼──────────────────────────────────┐  │   │
│  │  │              7. Evidence Assembly                        │  │   │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │   │
│  │  │  │ Confidence   │  │ Citation     │  │ Mandatory/   │  │  │   │
│  │  │  │ Scoring      │  │ Formatting   │  │ Voluntary    │  │  │   │
│  │  │  └──────────────┘  └──────────────┘  └──────────────┘  │  │   │
│  │  └──────────────────────┬──────────────────────────────────┘  │   │
│  │                         │                                     │   │
│  │                ┌────────▼─────────┐                           │   │
│  │                │ 8. LLM Generation│  (Gemini 2.5 Flash)      │   │
│  │                │ + Citation Inject │                           │   │
│  │                └────────┬─────────┘                           │   │
│  │                         │                                     │   │
│  │                ┌────────▼─────────┐                           │   │
│  │                │ 9. Post-Verify   │  (Citation validation)    │   │
│  │                └────────┬─────────┘                           │   │
│  └──────────────────────────┼───────────────────────────────────┘   │
│                              │                                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Supabase PostgreSQL + pgvector                    │
│                                                                     │
│  ┌──────────┐  ┌──────────────┐  ┌────────┐  ┌─────────────────┐   │
│  │documents │  │document_     │  │ qcos   │  │ Supabase        │   │
│  │          │  │chunks        │  │        │  │ Storage (PDFs)  │   │
│  │          │  │ + embedding  │  │        │  │                 │   │
│  │          │  │ + tsvector   │  │        │  │                 │   │
│  └──────────┘  └──────────────┘  └────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. RAG Pipeline — Step-by-Step Algorithm

### Step 1: Language Detection
```
Input: raw user query
Output: { language: "en" | "hi" | "hinglish", original_query }
```
- Use Gemini 2.5 Flash-Lite with a simple prompt:
  ```
  Detect the language of this text. Reply with ONLY one of: en, hi, hinglish
  Text: "{query}"
  ```
- Cache common patterns (e.g., if query contains Devanagari characters → `hi`)
- Fast regex-based pre-check: `/[\u0900-\u097F]/` → Hindi

### Step 2: Query Understanding & Entity Extraction
```
Input: { query, language }
Output: {
  intent: "find_standards" | "check_compliance" | "compare_standards" | "general_info",
  entities: {
    product: "stainless steel water bottle",
    material: "stainless steel",
    standard_number: "IS 14543" | null,
    clause_number: "4.2.1" | null,
    industry: "food_contact_materials",
    product_category: "containers_utensils",
    certification_type: "ISI" | null
  },
  search_keywords: ["stainless steel", "water bottle", "food grade", "IS 14543"],
  english_query: "..." // translated if Hindi
}
```
- Use Gemini 2.5 Flash-Lite with structured output (JSON mode)
- Extract both Hindi and English keywords for hybrid search
- If standard numbers are mentioned (e.g., "IS 14543"), extract them for metadata filtering

### Step 3: Hybrid Retrieval

#### 3a. Build Search Parameters
```typescript
interface SearchParams {
  queryEmbedding: number[];      // Gemini Embedding 2 of the query
  keywords: string[];            // Extracted keywords (Hindi + English)
  standardFilter?: string;       // e.g., "IS 14543" if mentioned
  documentTypeFilter?: string;   // e.g., "standard", "qco"
  statusFilter?: string;         // "current" (default)
  topK: number;                  // 30 for initial retrieval
}
```

#### 3b. Vector Search (Semantic)
```sql
SELECT id, content, metadata,
       1 - (embedding <=> $1::vector) AS similarity,
       ROW_NUMBER() OVER (ORDER BY embedding <=> $1::vector) AS rank
FROM document_chunks
WHERE ($2::text IS NULL OR document_id IN (
    SELECT id FROM documents WHERE standard_number = $2
))
AND status = 'current'
ORDER BY embedding <=> $1::vector
LIMIT 30;
```

#### 3c. Keyword Search (Lexical)
```sql
SELECT id, content, metadata,
       ts_rank_cd(search_vector, query) AS rank_score,
       ROW_NUMBER() OVER (ORDER BY ts_rank_cd(search_vector, query) DESC) AS rank
FROM document_chunks,
     plainto_tsquery('english', $1) AS query
WHERE search_vector @@ query
AND ($2::text IS NULL OR document_id IN (
    SELECT id FROM documents WHERE standard_number = $2
))
AND status = 'current'
ORDER BY rank_score DESC
LIMIT 30;
```

#### 3d. Reciprocal Rank Fusion (RRF)
```
For each document d appearing in either result set:
  RRF_score(d) = Σ 1/(k + rank_m(d))  for each method m where d appears
  where k = 60 (constant)

Sort by RRF_score descending
Take top 15
```

### Step 4: Re-ranking

For prototype, use **LLM-based relevance scoring** (free, no extra dependencies):

```
Input: top-15 chunks from RRF
For each chunk, ask Gemini 2.5 Flash-Lite:
  "Rate the relevance of this passage to the query on a scale of 1-5.
   Query: {query}
   Passage: {chunk.content}
   Reply with ONLY a number 1-5."
Sort by relevance score descending
Take top 5-7
```

**Alternative (better quality, costs nothing extra)**: Skip dedicated re-ranking and rely on a larger top-K with good RRF. For a prototype with a small knowledge base, RRF alone may be sufficient.

> [!TIP]
> **Prototype recommendation**: Start WITHOUT re-ranking. Add it only if retrieval quality is poor. Every re-rank call costs a Gemini API request.

### Step 5: Evidence Assembly

For each of the top-K retrieved chunks, assemble a citation block:
```typescript
interface EvidenceBlock {
  refId: string;          // e.g., "REF_1"
  standardNumber: string; // e.g., "IS 14543:2016"
  documentTitle: string;
  clauseNumber: string;   // e.g., "4.2.1"
  sectionTitle: string;   // e.g., "Chemical Requirements"
  pageNumber: number;
  content: string;        // The actual chunk text
  sourceUrl: string;
  documentType: string;   // "standard", "qco", "guideline"
  mandatoryStatus: string; // "mandatory", "voluntary", "conditional"
}
```

### Step 6: Confidence Scoring (Retrieval-Based)

```typescript
function calculateConfidence(results: RetrievalResult[]): ConfidenceLevel {
  const signals = {
    // 1. Top similarity score (0-1)
    topSimilarity: results[0]?.similarity ?? 0,

    // 2. How many results from BOTH vector and keyword search
    hybridConsensus: results.filter(r => r.inVectorTop10 && r.inKeywordTop10).length / results.length,

    // 3. Metadata match (did we find the exact standard mentioned?)
    metadataMatch: results.some(r => r.matchesRequestedStandard) ? 1.0 : 0.0,

    // 4. Score margin (gap between #1 and #5)
    scoreMargin: Math.min(1.0, ((results[0]?.rrf_score ?? 0) - (results[4]?.rrf_score ?? 0)) / 0.01),
  };

  const score = 0.35 * signals.topSimilarity
              + 0.25 * signals.hybridConsensus
              + 0.25 * signals.metadataMatch
              + 0.15 * signals.scoreMargin;

  if (score >= 0.7) return "HIGH";
  if (score >= 0.4) return "MEDIUM";
  return "LOW";
}
```

### Step 7: LLM Generation with Citations

System prompt structure:
```
You are Manak AI, an expert assistant for Indian Standards (BIS) compliance.

RULES:
1. Answer ONLY based on the provided context documents.
2. Every factual claim MUST cite its source using [REF_N] format.
3. Do NOT invent standard numbers, clause numbers, or requirements.
4. If the context does not contain sufficient information, explicitly state:
   "The available documents do not provide sufficient information on this topic."
5. Distinguish between mandatory and voluntary requirements based on QCO status.
6. Respond in {detected_language}.
7. Preserve standard numbers (IS XXXXX) and clause numbers in their original form.

CONTEXT DOCUMENTS:
---
[REF_1 | IS 14543:2016 | Clause 4.2 | Page 12]
{chunk_content_1}
---
[REF_2 | IS 14543:2016 | Clause 5.1 | Page 18]
{chunk_content_2}
---

USER QUERY: {query}
```

### Step 8: Post-Verification

After LLM generates response:
1. **Extract citations**: Regex for `[REF_N]` patterns in the response
2. **Validate**: Check each cited REF_N was actually in the provided context
3. **Flag invalid citations**: If LLM cites a REF_N that doesn't exist, flag it
4. **Extract numbers**: Verify any quoted numbers/limits appear in the cited chunk

---

## 3. Database Schema

### Entity Relationship

```
documents ──────────── 1:N ──── document_chunks
    │                                │
    │                           (embedding, tsvector)
    │
    ├── standard_number
    ├── document_type
    ├── status
    │
qcos ──────────────── N:1 ──── documents (via standard_number)
```

### Table: `documents`
```sql
CREATE TABLE documents (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    standard_number     VARCHAR(50),        -- e.g., 'IS 14543'
    part_number         VARCHAR(20),        -- e.g., 'Part 1'
    revision_year       INTEGER,            -- e.g., 2016
    full_designation    VARCHAR(100) NOT NULL, -- e.g., 'IS 14543:2016'
    title               TEXT NOT NULL,
    document_type       VARCHAR(30) NOT NULL, -- 'standard', 'qco', 'guideline', 'faq', 'amendment'
    status              VARCHAR(20) DEFAULT 'current', -- 'current', 'superseded', 'withdrawn'
    superseded_by       VARCHAR(100),       -- full designation of replacement
    publication_date    DATE,
    effective_date      DATE,               -- important for QCOs
    ics_code            VARCHAR(50),        -- International Classification for Standards
    product_categories  TEXT[],             -- array: ['water_bottles', 'food_contact']
    industries          TEXT[],             -- array: ['food_processing', 'consumer_goods']
    language            VARCHAR(10) DEFAULT 'en', -- 'en', 'hi', 'bilingual'
    source_url          TEXT,
    source_file_path    TEXT,               -- Supabase Storage path
    total_pages         INTEGER,
    is_mandatory        BOOLEAN DEFAULT FALSE, -- derived from QCO linkage
    scope_summary       TEXT,               -- brief scope description
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_standard ON documents(standard_number);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_mandatory ON documents(is_mandatory);
CREATE INDEX idx_documents_categories ON documents USING GIN(product_categories);
CREATE INDEX idx_documents_industries ON documents USING GIN(industries);
```

### Table: `document_chunks`
```sql
CREATE TABLE document_chunks (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id         UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index         INTEGER NOT NULL,    -- ordering within document
    clause_number       VARCHAR(50),         -- e.g., '4.2.1'
    clause_title        TEXT,                -- e.g., 'Chemical Requirements'
    section_path        TEXT,                -- e.g., 'Requirements > Chemical Requirements'
    chunk_type          VARCHAR(30) NOT NULL, -- 'clause', 'table', 'annexure_normative', 'annexure_informative', 'scope', 'definition', 'foreword'
    page_number_start   INTEGER,
    page_number_end     INTEGER,
    content             TEXT NOT NULL,        -- the actual chunk text
    content_with_context TEXT,               -- content prefixed with breadcrumb for embedding
    parent_chunk_id     UUID REFERENCES document_chunks(id), -- for small-to-big retrieval
    embedding           vector(768),         -- Gemini Embedding 2 (768-dim)
    search_vector       tsvector GENERATED ALWAYS AS (
                            to_tsvector('english', coalesce(content, ''))
                        ) STORED,
    token_count         INTEGER,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- HNSW index for vector similarity search
CREATE INDEX idx_chunks_embedding ON document_chunks
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- GIN index for full-text search
CREATE INDEX idx_chunks_search_vector ON document_chunks USING GIN(search_vector);

-- B-tree indexes for metadata filtering
CREATE INDEX idx_chunks_document_id ON document_chunks(document_id);
CREATE INDEX idx_chunks_clause ON document_chunks(clause_number);
CREATE INDEX idx_chunks_type ON document_chunks(chunk_type);
CREATE INDEX idx_chunks_page ON document_chunks(page_number_start);
```

### Table: `qcos`
```sql
CREATE TABLE qcos (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qco_number          VARCHAR(100) NOT NULL,  -- Gazette notification number
    qco_title           TEXT NOT NULL,
    standard_number     VARCHAR(50) NOT NULL,    -- The standard made mandatory
    standard_designation VARCHAR(100),           -- e.g., 'IS 14543:2016'
    product_description TEXT,
    gazette_date        DATE,
    effective_date      DATE NOT NULL,
    amendment_dates     DATE[],                  -- subsequent amendments
    certification_type  VARCHAR(30),             -- 'ISI', 'CRS', 'FMCS'
    scope_description   TEXT,
    source_url          TEXT,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_qcos_standard ON qcos(standard_number);
CREATE INDEX idx_qcos_active ON qcos(is_active);
CREATE INDEX idx_qcos_effective ON qcos(effective_date);
```

### Hybrid Search RPC Function
```sql
CREATE OR REPLACE FUNCTION hybrid_search(
    query_text TEXT,
    query_embedding vector(768),
    match_count INT DEFAULT 10,
    filter_standard TEXT DEFAULT NULL,
    filter_doc_type TEXT DEFAULT NULL,
    filter_status TEXT DEFAULT 'current',
    rrf_k INT DEFAULT 60
)
RETURNS TABLE (
    chunk_id UUID,
    document_id UUID,
    content TEXT,
    clause_number VARCHAR(50),
    clause_title TEXT,
    section_path TEXT,
    chunk_type VARCHAR(30),
    page_number_start INTEGER,
    standard_number VARCHAR(50),
    full_designation VARCHAR(100),
    document_title TEXT,
    doc_type VARCHAR(30),
    source_url TEXT,
    is_mandatory BOOLEAN,
    rrf_score NUMERIC,
    in_vector_results BOOLEAN,
    in_keyword_results BOOLEAN
)
LANGUAGE sql AS $$
WITH filtered_chunks AS (
    SELECT dc.*, d.standard_number, d.full_designation, d.title AS doc_title,
           d.document_type AS doc_type, d.source_url, d.is_mandatory
    FROM document_chunks dc
    JOIN documents d ON dc.document_id = d.id
    WHERE (filter_status IS NULL OR d.status = filter_status)
    AND (filter_standard IS NULL OR d.standard_number = filter_standard)
    AND (filter_doc_type IS NULL OR d.document_type = filter_doc_type)
),
vector_search AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY embedding <=> query_embedding) AS rank
    FROM filtered_chunks
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> query_embedding
    LIMIT match_count * 3
),
keyword_search AS (
    SELECT id, ROW_NUMBER() OVER (
        ORDER BY ts_rank_cd(search_vector, plainto_tsquery('english', query_text)) DESC
    ) AS rank
    FROM filtered_chunks
    WHERE search_vector @@ plainto_tsquery('english', query_text)
    ORDER BY ts_rank_cd(search_vector, plainto_tsquery('english', query_text)) DESC
    LIMIT match_count * 3
)
SELECT
    fc.id AS chunk_id,
    fc.document_id,
    fc.content,
    fc.clause_number,
    fc.clause_title,
    fc.section_path,
    fc.chunk_type,
    fc.page_number_start,
    fc.standard_number,
    fc.full_designation,
    fc.doc_title AS document_title,
    fc.doc_type,
    fc.source_url,
    fc.is_mandatory,
    ROUND(
        (COALESCE(1.0 / (rrf_k + v.rank), 0.0) +
         COALESCE(1.0 / (rrf_k + k.rank), 0.0))::numeric, 6
    ) AS rrf_score,
    v.id IS NOT NULL AS in_vector_results,
    k.id IS NOT NULL AS in_keyword_results
FROM filtered_chunks fc
LEFT JOIN vector_search v ON fc.id = v.id
LEFT JOIN keyword_search k ON fc.id = k.id
WHERE v.id IS NOT NULL OR k.id IS NOT NULL
ORDER BY rrf_score DESC
LIMIT match_count;
$$;
```

### Prisma Schema
```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

model Document {
  id                String    @id @default(uuid())
  standardNumber    String?   @map("standard_number")
  partNumber        String?   @map("part_number")
  revisionYear      Int?      @map("revision_year")
  fullDesignation   String    @map("full_designation")
  title             String
  documentType      String    @map("document_type")
  status            String    @default("current")
  supersededBy      String?   @map("superseded_by")
  publicationDate   DateTime? @map("publication_date")
  effectiveDate     DateTime? @map("effective_date")
  icsCode           String?   @map("ics_code")
  productCategories String[]  @map("product_categories")
  industries        String[]  @map("industries")
  language          String    @default("en")
  sourceUrl         String?   @map("source_url")
  sourceFilePath    String?   @map("source_file_path")
  totalPages        Int?      @map("total_pages")
  isMandatory       Boolean   @default(false) @map("is_mandatory")
  scopeSummary      String?   @map("scope_summary")
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")

  chunks            DocumentChunk[]

  @@map("documents")
  @@index([standardNumber])
  @@index([documentType])
  @@index([status])
}

model DocumentChunk {
  id                 String    @id @default(uuid())
  documentId         String    @map("document_id")
  chunkIndex         Int       @map("chunk_index")
  clauseNumber       String?   @map("clause_number")
  clauseTitle        String?   @map("clause_title")
  sectionPath        String?   @map("section_path")
  chunkType          String    @map("chunk_type")
  pageNumberStart    Int?      @map("page_number_start")
  pageNumberEnd      Int?      @map("page_number_end")
  content            String
  contentWithContext String?   @map("content_with_context")
  parentChunkId      String?   @map("parent_chunk_id")
  // embedding is managed via raw SQL (Prisma doesn't support vector type)
  embedding          Unsupported("vector(768)")?
  // search_vector is auto-generated (STORED tsvector)
  tokenCount         Int?      @map("token_count")
  createdAt          DateTime  @default(now()) @map("created_at")

  document           Document  @relation(fields: [documentId], references: [id], onDelete: Cascade)
  parentChunk        DocumentChunk? @relation("ChunkHierarchy", fields: [parentChunkId], references: [id])
  childChunks        DocumentChunk[] @relation("ChunkHierarchy")

  @@map("document_chunks")
  @@index([documentId])
  @@index([clauseNumber])
  @@index([chunkType])
}

model Qco {
  id                 String    @id @default(uuid())
  qcoNumber          String    @map("qco_number")
  qcoTitle           String    @map("qco_title")
  standardNumber     String    @map("standard_number")
  standardDesignation String?  @map("standard_designation")
  productDescription String?   @map("product_description")
  gazetteDate        DateTime? @map("gazette_date")
  effectiveDate      DateTime  @map("effective_date")
  certificationType  String?   @map("certification_type")
  scopeDescription   String?   @map("scope_description")
  sourceUrl          String?   @map("source_url")
  isActive           Boolean   @default(true) @map("is_active")
  createdAt          DateTime  @default(now()) @map("created_at")

  @@map("qcos")
  @@index([standardNumber])
  @@index([isActive])
}
```

> [!IMPORTANT]
> **Where to use Prisma vs Raw SQL**:
> - **Prisma**: All CRUD operations (creating documents, chunks, QCOs), schema migrations, typed queries
> - **Raw SQL (`prisma.$queryRaw`)**: All vector search, full-text search, hybrid search, RRF fusion — Prisma cannot express these natively

---

## 4. Citation Architecture

### Flow: Database → Retrieval → Prompt → Response → UI

```
┌───────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  Database     │     │  Retrieval      │     │  LLM Prompt      │
│               │     │                 │     │                  │
│ chunk.content │────▶│ EvidenceBlock   │────▶│ [REF_1 | IS ...] │
│ chunk.clause  │     │ { refId,        │     │ {content}        │
│ chunk.page    │     │   standard,     │     │                  │
│ doc.title     │     │   clause,       │     │ RULES:           │
│ doc.url       │     │   page, ... }   │     │ Cite [REF_N]     │
└───────────────┘     └─────────────────┘     └────────┬─────────┘
                                                       │
                                              ┌────────▼─────────┐
                                              │  LLM Response    │
                                              │                  │
                                              │ "...must meet    │
                                              │  requirements    │
                                              │  [REF_1]..."     │
                                              └────────┬─────────┘
                                                       │
                                              ┌────────▼─────────┐
                                              │  Post-Process    │
                                              │                  │
                                              │ Extract [REF_N]  │
                                              │ Map to Evidence  │
                                              │ Validate exists  │
                                              └────────┬─────────┘
                                                       │
                                              ┌────────▼─────────┐
                                              │  Frontend        │
                                              │                  │
                                              │ Inline citation  │
                                              │ Citation panel   │
                                              │ Source viewer    │
                                              └──────────────────┘
```

### Citation Data Structure
```typescript
interface Citation {
  refId: string;              // "REF_1"
  standardNumber: string;     // "IS 14543:2016"
  documentTitle: string;      // "Stainless Steel Utensils..."
  clauseNumber: string;       // "4.2.1"
  sectionTitle: string;       // "Chemical Requirements"
  pageNumber: number;         // 12
  sourceUrl: string;          // "https://www.services.bis.gov.in/..."
  mandatoryStatus: string;    // "mandatory" | "voluntary"
  relevanceScore: number;     // 0.87
}

interface ChatResponse {
  answer: string;             // Markdown with [REF_N] inline
  citations: Citation[];      // Array of all citations
  confidence: "HIGH" | "MEDIUM" | "LOW";
  confidenceExplanation: string;
  compliancePathway?: CompliancePathway;
  relatedStandards: string[];
  language: "en" | "hi";
}
```

### Preventing Hallucinated Citations
1. **Closed-world citations**: LLM can ONLY cite `[REF_1]` through `[REF_N]` where N = number of chunks provided
2. **Post-extraction validation**: Extract all `[REF_\d+]` from response, verify each exists in the provided context
3. **Number verification**: Any quoted thresholds/limits are checked against the cited chunk text
4. **Abstention instruction**: System prompt explicitly instructs abstention when evidence is insufficient

---

## 5. Mandatory vs Voluntary Logic

### Decision Tree
```
For a retrieved standard:
│
├── Is the standard linked to an active QCO?
│   ├── YES → Is the effective date in the past?
│   │   ├── YES → MANDATORY
│   │   └── NO → CONDITIONAL (becomes mandatory on {date})
│   └── NO → Does the standard mention it is for voluntary use?
│       ├── YES → VOLUNTARY
│       └── CANNOT DETERMINE → INSUFFICIENT EVIDENCE
│
└── Is the document a QCO itself?
    ├── YES → The products listed are MANDATORY for BIS certification
    └── NO → Continue above logic
```

### Implementation
```typescript
function determineMandatoryStatus(
  document: Document,
  qcos: Qco[],
  retrievedChunks: DocumentChunk[]
): MandatoryStatus {
  // 1. Check if any active QCO references this standard
  const activeQco = qcos.find(q =>
    q.standardNumber === document.standardNumber &&
    q.isActive &&
    q.effectiveDate <= new Date()
  );

  if (activeQco) {
    return {
      status: "MANDATORY",
      reason: `Covered under QCO ${activeQco.qcoNumber}, effective ${activeQco.effectiveDate}`,
      qcoReference: activeQco,
      certificationRequired: activeQco.certificationType // "ISI", "CRS", etc.
    };
  }

  // 2. Check for upcoming QCO
  const upcomingQco = qcos.find(q =>
    q.standardNumber === document.standardNumber &&
    q.isActive &&
    q.effectiveDate > new Date()
  );

  if (upcomingQco) {
    return {
      status: "CONDITIONAL",
      reason: `Will become mandatory on ${upcomingQco.effectiveDate} under QCO ${upcomingQco.qcoNumber}`,
      qcoReference: upcomingQco
    };
  }

  // 3. Default to voluntary unless we have contradicting evidence
  return {
    status: "VOLUNTARY",
    reason: "No Quality Control Order found making this standard mandatory. Standard may be adopted voluntarily.",
    disclaimer: "This assessment is based on available data. Verify with BIS for the most current QCO status."
  };
}
```

---

## 6. Compliance Pathway Data Structure

```typescript
interface CompliancePathway {
  product: string;
  steps: ComplianceStep[];
  estimatedTimeline: string;
  disclaimer: string;
}

interface ComplianceStep {
  stepNumber: number;
  title: string;
  description: string;
  status: "mandatory" | "voluntary" | "recommended";
  details: string[];
  references: Citation[];
}
```

### Example Output
```json
{
  "product": "Stainless Steel Water Bottle",
  "steps": [
    {
      "stepNumber": 1,
      "title": "Identify Applicable Standards",
      "description": "The following BIS standards apply to your product",
      "status": "mandatory",
      "details": [
        "IS 14543:2016 — Stainless Steel Utensils for Domestic Purposes",
        "IS 9845:2019 — Determination of Overall Migration Limit (food contact)"
      ],
      "references": ["REF_1", "REF_3"]
    },
    {
      "stepNumber": 2,
      "title": "Verify Mandatory Certification",
      "description": "BIS certification (ISI Mark) is mandatory for this product",
      "status": "mandatory",
      "details": [
        "Covered under QCO SO 2655(E) dated 17.07.2018",
        "Certification type: Product Certification (ISI Mark)"
      ],
      "references": ["REF_2"]
    },
    {
      "stepNumber": 3,
      "title": "Meet Material Requirements",
      "description": "Stainless steel grade must comply with IS 14543, Clause 4.1",
      "status": "mandatory",
      "details": [
        "Permitted grades: AISI 201, 202, 301, 302, 304, 316",
        "Chemical composition per Clause 4.1, Table 1"
      ],
      "references": ["REF_1"]
    },
    {
      "stepNumber": 4,
      "title": "Required Testing",
      "description": "Product must pass the following tests",
      "status": "mandatory",
      "details": [
        "Chemical composition analysis (Clause 5.2)",
        "Overall migration test as per IS 9845 (Clause 5.3)",
        "Dimensional requirements (Clause 5.1)"
      ],
      "references": ["REF_1", "REF_3"]
    },
    {
      "stepNumber": 5,
      "title": "Apply for BIS Certification",
      "description": "Submit application to BIS for ISI Mark",
      "status": "mandatory",
      "details": [
        "Apply through BIS portal: manakonline.bis.gov.in",
        "Factory inspection required",
        "Testing at BIS-recognized laboratory"
      ],
      "references": []
    }
  ],
  "estimatedTimeline": "3-6 months (typical for new ISI Mark applications)",
  "disclaimer": "This pathway is generated for informational purposes. Consult BIS directly for official certification guidance."
}
```

---

## 7. Compliance Gap Analysis Data Structure

```typescript
interface GapAnalysisInput {
  product: string;
  material: string;
  capacity?: string;
  currentTests: string[];
  currentCertifications: string[];
  manufacturingProcess?: string;
  additionalInfo?: string;
}

interface GapAnalysisResult {
  product: string;
  applicableStandards: string[];
  requirements: RequirementGap[];
  summary: GapSummary;
  disclaimer: string;
}

interface RequirementGap {
  requirement: string;
  category: "material" | "testing" | "manufacturing" | "certification" | "documentation";
  status: "SATISFIED" | "NOT_SATISFIED" | "NEEDS_VERIFICATION" | "UNKNOWN";
  evidence: string;
  recommendation: string;
  reference: Citation | null;
}

interface GapSummary {
  totalRequirements: number;
  satisfied: number;
  notSatisfied: number;
  needsVerification: number;
  unknown: number;
  criticalGaps: string[];
  nextSteps: string[];
}
```

---

## 8. Multilingual Architecture

```
Hindi query → Language Detection (regex + Flash-Lite)
                    │
                    ├── If Hindi/Hinglish:
                    │   ├── Generate English keywords (Flash-Lite)
                    │   ├── Keep Hindi keywords for keyword search
                    │   └── Use original query for embedding (Gemini Embedding 2 is multilingual)
                    │
                    └── If English:
                        └── Proceed normally
                    │
                    ▼
            Hybrid Retrieval
            (embedding works cross-lingually,
             keyword search uses both Hindi + English terms)
                    │
                    ▼
            LLM Generation
            (instructed to respond in user's language,
             preserve standard numbers in Latin script)
```

### Key Decisions:
1. **Do NOT translate the full query before embedding** — Gemini Embedding 2 natively handles Hindi
2. **DO extract English keywords** — because our document text is primarily English, BM25/tsvector needs English terms
3. **DO preserve standard numbers** in Latin script always (IS 14543, not आई एस 14543)

---

## 9. Document Ingestion Pipeline

```
BIS PDFs (local folder)
     │
     ▼
┌─────────────────────────┐
│ 1. PDF Loading          │ PyMuPDF (fitz)
│    - Detect digital vs  │
│      scanned pages      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 2. Text Extraction      │ PyMuPDF (digital) or
│    + OCR if needed      │ Tesseract (scanned)
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 3. Structure Detection  │ Regex-based heading detection
│    - Clauses (1.1, 1.2) │ Font size analysis
│    - Tables              │ PyMuPDF find_tables()
│    - Annexures           │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 4. Chunking             │ Structure-aware splitting
│    - Clause-level chunks │ Max 500 tokens
│    - Table chunks        │ Min 100 tokens
│    - Parent-child links  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 5. Metadata Extraction  │ From PDF + filename + manual config
│    - Standard number     │
│    - Revision year       │
│    - Document type       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 6. Context Enrichment   │ Prepend breadcrumb to content
│    "[IS 14543:2016 |     │
│     Clause 4.2.1 |       │
│     Chemical Req.]       │
│     {content}"           │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 7. Embedding Generation │ Gemini Embedding 2 (768-dim)
│    - Batch processing    │
│    - Rate limit handling │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 8. Database Insertion   │ PostgreSQL via psycopg2
│    - documents table     │
│    - document_chunks     │
│    - Supabase Storage    │
└─────────────────────────┘
```

### Chunking Rules for Standards Documents

1. **Clause-level splitting**: Primary split boundary is at clause/sub-clause headings
2. **Size bounds**: Min 100 tokens, Max 500 tokens
3. **Merge small clauses**: If a sub-clause is < 100 tokens, merge with its parent or next sibling
4. **Split large clauses**: If a clause > 500 tokens, split at paragraph boundaries, keeping the clause heading in each chunk
5. **Tables**: Extract as structured text, always include table number + caption + column headers in each chunk
6. **Annexures**: Tag as `annexure_normative` or `annexure_informative`
7. **Breadcrumb injection**: Every chunk gets a prefix with its location context
8. **Parent-child**: Store parent clause ID for small-to-big retrieval

---

## 10. Folder Structure

```
manak-ai/
├── docs/                           # Documentation (you are here)
│   ├── PRD.md
│   ├── TechStack.md
│   ├── RequiredAPIs.md
│   ├── brain.md                    # This file
│   ├── Plan.md                     # Implementation plan
│   ├── DemoScript.md
│   └── Evaluation.md
│
├── src/                            # Next.js App
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Landing page
│   │   ├── chat/
│   │   │   └── page.tsx            # AI Chat interface
│   │   ├── explore/
│   │   │   └── page.tsx            # Standards explorer
│   │   ├── compliance/
│   │   │   └── page.tsx            # Compliance gap analysis
│   │   └── api/
│   │       ├── chat/
│   │       │   └── route.ts        # POST /api/chat
│   │       ├── search/
│   │       │   └── route.ts        # POST /api/search
│   │       ├── standards/
│   │       │   └── route.ts        # GET /api/standards
│   │       └── compliance/
│   │           └── route.ts        # POST /api/compliance
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── chat/
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   └── ExampleQueries.tsx
│   │   ├── citations/
│   │   │   ├── CitationPanel.tsx
│   │   │   ├── CitationBadge.tsx
│   │   │   └── SourceViewer.tsx
│   │   ├── compliance/
│   │   │   ├── CompliancePathway.tsx
│   │   │   ├── ComplianceStep.tsx
│   │   │   └── GapAnalysis.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── LanguageToggle.tsx
│   │   └── shared/
│   │       ├── ConfidenceBadge.tsx
│   │       ├── MandatoryBadge.tsx
│   │       └── LoadingState.tsx
│   │
│   ├── lib/
│   │   ├── rag/
│   │   │   ├── pipeline.ts         # Main RAG orchestrator
│   │   │   ├── retrieval.ts        # Hybrid search + RRF
│   │   │   ├── reranking.ts        # Re-ranking logic
│   │   │   ├── evidence.ts         # Evidence assembly
│   │   │   ├── confidence.ts       # Confidence scoring
│   │   │   └── citations.ts        # Citation extraction + validation
│   │   ├── llm/
│   │   │   ├── gemini.ts           # Gemini API client
│   │   │   ├── prompts.ts          # System prompts
│   │   │   └── entity-extraction.ts # Query understanding
│   │   ├── db/
│   │   │   ├── prisma.ts           # Prisma client singleton
│   │   │   ├── queries.ts          # Raw SQL queries
│   │   │   └── embeddings.ts       # Embedding generation
│   │   ├── compliance/
│   │   │   ├── pathway.ts          # Compliance pathway generation
│   │   │   ├── gap-analysis.ts     # Gap analysis logic
│   │   │   └── mandatory.ts        # Mandatory/voluntary logic
│   │   └── utils/
│   │       ├── language.ts          # Language detection
│   │       └── validation.ts        # Input validation
│   │
│   └── types/
│       ├── rag.ts                  # RAG pipeline types
│       ├── citations.ts            # Citation types
│       ├── compliance.ts           # Compliance types
│       └── api.ts                  # API request/response types
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│       └── 001_init/
│           └── migration.sql       # Includes pgvector setup
│
├── ingestion/                      # Python ingestion pipeline
│   ├── requirements.txt
│   ├── ingest.py                   # Main ingestion script
│   ├── parser.py                   # PDF parsing
│   ├── chunker.py                  # Structure-aware chunking
│   ├── embedder.py                 # Embedding generation
│   ├── metadata.py                 # Metadata extraction
│   ├── config.py                   # Document configs
│   └── data/
│       ├── pdfs/                   # Source PDFs
│       └── configs/                # Per-document metadata configs
│
├── evaluation/                     # RAG evaluation
│   ├── benchmark.json              # Test questions + expected answers
│   └── evaluate.py                 # Evaluation script
│
├── public/                         # Static assets
│   └── images/
│
├── .env.local                      # Environment variables (git-ignored)
├── .env.example                    # Template
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```
