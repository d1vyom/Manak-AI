# Manak AI — API Specification

> Next.js Route Handlers specification for all backend endpoints

---

## API Overview

| Endpoint | Method | Purpose | Auth |
|---|---|---|---|
| `/api/chat` | POST | AI chat with RAG pipeline | None (rate-limited) |
| `/api/search` | POST | Hybrid search without LLM generation | None |
| `/api/standards` | GET | List/search indexed standards | None |
| `/api/standards/[id]` | GET | Get standard details + chunks | None |
| `/api/compliance/pathway` | POST | Generate compliance pathway | None |
| `/api/compliance/gap-analysis` | POST | Compliance gap analysis | None |

> [!NOTE]
> No authentication for SIH prototype. All endpoints are rate-limited by IP (20 req/min).

---

## 1. POST `/api/chat`

**Purpose**: Main AI assistant endpoint. Runs the full RAG pipeline and returns a structured, cited answer.

### Request
```typescript
interface ChatRequest {
  query: string;          // User's question (max 1000 chars)
  language?: "en" | "hi" | "auto"; // Default: "auto"
}
```

```json
// Example
{
  "query": "I manufacture stainless steel water bottles. Which BIS standards apply?",
  "language": "auto"
}
```

### Response (Streaming SSE)
The response streams as Server-Sent Events for real-time display.

**Event: `metadata`** (sent first)
```json
{
  "type": "metadata",
  "data": {
    "language": "en",
    "confidence": "HIGH",
    "confidenceExplanation": "Strong match found: IS 14543:2016 directly addresses stainless steel utensils including water bottles. Multiple supporting clauses retrieved.",
    "entities": {
      "product": "stainless steel water bottle",
      "material": "stainless steel",
      "industry": "consumer_goods",
      "intent": "find_standards"
    },
    "retrievedDocuments": 3,
    "mandatoryStatus": "MANDATORY"
  }
}
```

**Event: `content`** (streamed chunks)
```json
{
  "type": "content",
  "data": "Based on the information available, the following BIS standards and requirements apply to stainless steel water bottles:\n\n**Applicable Standard**: IS 14543:2016 [REF_1]..."
}
```

**Event: `citations`** (sent after content)
```json
{
  "type": "citations",
  "data": [
    {
      "refId": "REF_1",
      "standardNumber": "IS 14543:2016",
      "documentTitle": "Stainless Steel Utensils for Domestic Purposes — Specification",
      "clauseNumber": "4.2",
      "clauseTitle": "Chemical Requirements",
      "pageNumber": 12,
      "sourceUrl": "https://services.bis.gov.in/...",
      "mandatoryStatus": "mandatory",
      "chunkType": "clause"
    },
    {
      "refId": "REF_2",
      "standardNumber": "IS 14543:2016",
      "documentTitle": "Stainless Steel Utensils for Domestic Purposes — Specification",
      "clauseNumber": "5.1",
      "clauseTitle": "Testing Requirements",
      "pageNumber": 18,
      "sourceUrl": "https://services.bis.gov.in/...",
      "mandatoryStatus": "mandatory",
      "chunkType": "clause"
    }
  ]
}
```

**Event: `pathway`** (sent after citations, if applicable)
```json
{
  "type": "pathway",
  "data": {
    "product": "Stainless Steel Water Bottle",
    "steps": [
      {
        "stepNumber": 1,
        "title": "Identify Applicable Standards",
        "description": "IS 14543:2016 applies to your product",
        "status": "mandatory",
        "details": ["Stainless Steel Utensils for Domestic Purposes"],
        "references": ["REF_1"]
      }
    ],
    "disclaimer": "This pathway is for informational purposes only."
  }
}
```

**Event: `related`** (sent last)
```json
{
  "type": "related",
  "data": ["IS 9845:2019 — Overall Migration Limit", "IS 7790:1975 — Dimensions"]
}
```

**Event: `done`**
```json
{
  "type": "done"
}
```

### Error Response
```json
{
  "error": "Service temporarily busy. Please try again.",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

### Database Interaction
1. Entity extraction → Gemini Flash-Lite
2. Query embedding → Gemini Embedding 2
3. Hybrid search → `hybrid_search()` RPC on Supabase
4. QCO lookup → `qcos` table query via Prisma
5. LLM generation → Gemini 2.5 Flash (streaming)

---

## 2. POST `/api/search`

**Purpose**: Direct hybrid search without LLM generation. Useful for standards exploration.

### Request
```typescript
interface SearchRequest {
  query: string;              // Search query
  filters?: {
    standardNumber?: string;  // Filter by specific standard
    documentType?: string;    // "standard" | "qco" | "guideline"
    status?: string;          // "current" | "superseded"
    isMandatory?: boolean;    // Only mandatory standards
  };
  limit?: number;             // Default: 10, max: 20
}
```

### Response
```typescript
interface SearchResponse {
  results: {
    chunkId: string;
    content: string;
    clauseNumber: string;
    clauseTitle: string;
    pageNumber: number;
    standardNumber: string;
    fullDesignation: string;
    documentTitle: string;
    documentType: string;
    isMandatory: boolean;
    sourceUrl: string;
    score: number;
  }[];
  totalResults: number;
  searchTime: number; // milliseconds
}
```

### Database Interaction
1. Query embedding → Gemini Embedding 2
2. Hybrid search → `hybrid_search()` RPC with filters
3. Return raw results (no LLM processing)

---

## 3. GET `/api/standards`

**Purpose**: List all indexed standards with metadata. Supports search and filtering.

### Query Parameters
```
GET /api/standards?search=water&type=standard&mandatory=true&page=1&limit=10
```

| Param | Type | Default | Description |
|---|---|---|---|
| `search` | string | - | Search in title and standard number |
| `type` | string | - | Filter: standard, qco, guideline |
| `mandatory` | boolean | - | Filter mandatory status |
| `industry` | string | - | Filter by industry category |
| `page` | number | 1 | Pagination page |
| `limit` | number | 10 | Items per page (max 50) |

### Response
```typescript
interface StandardsListResponse {
  standards: {
    id: string;
    standardNumber: string;
    fullDesignation: string;
    title: string;
    documentType: string;
    status: string;
    revisionYear: number;
    isMandatory: boolean;
    productCategories: string[];
    industries: string[];
    scopeSummary: string;
    chunkCount: number;
  }[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Database Interaction
- Prisma `findMany` with filters on `documents` table
- Aggregate `chunkCount` from related `document_chunks`

---

## 4. GET `/api/standards/[id]`

**Purpose**: Get full details for a specific standard including its chunks.

### Response
```typescript
interface StandardDetailResponse {
  standard: {
    id: string;
    standardNumber: string;
    fullDesignation: string;
    title: string;
    documentType: string;
    status: string;
    revisionYear: number;
    publicationDate: string;
    effectiveDate: string;
    isMandatory: boolean;
    productCategories: string[];
    industries: string[];
    scopeSummary: string;
    sourceUrl: string;
    language: string;
  };
  qco: {
    qcoNumber: string;
    effectiveDate: string;
    certificationType: string;
  } | null;
  sections: {
    clauseNumber: string;
    clauseTitle: string;
    chunkType: string;
    pageNumber: number;
    preview: string; // First 200 chars
  }[];
}
```

### Database Interaction
- Prisma `findUnique` on `documents` with `include: { chunks }`
- Prisma `findFirst` on `qcos` matching `standardNumber`

---

## 5. POST `/api/compliance/pathway`

**Purpose**: Generate a structured compliance pathway for a product query.

### Request
```typescript
interface PathwayRequest {
  query: string;       // Product/industry description
  language?: "en" | "hi";
}
```

### Response
```typescript
interface PathwayResponse {
  product: string;
  steps: ComplianceStep[];
  applicableStandards: string[];
  mandatoryStatus: "MANDATORY" | "VOLUNTARY" | "CONDITIONAL" | "UNKNOWN";
  estimatedTimeline: string;
  citations: Citation[];
  confidence: "HIGH" | "MEDIUM" | "LOW";
  disclaimer: string;
}
```

### Database Interaction
- Same as `/api/chat` (runs RAG pipeline)
- Additional: structured prompt for pathway generation

---

## 6. POST `/api/compliance/gap-analysis`

**Purpose**: Compare user's current compliance state against BIS requirements.

### Request
```typescript
interface GapAnalysisRequest {
  product: string;
  material?: string;
  capacity?: string;
  currentTests: string[];
  currentCertifications: string[];
  manufacturingProcess?: string;
  additionalInfo?: string;
  language?: "en" | "hi";
}
```

```json
// Example
{
  "product": "Stainless Steel Water Bottle",
  "material": "SS 304",
  "capacity": "1 litre",
  "currentTests": ["Material composition test", "Leakage test"],
  "currentCertifications": [],
  "language": "en"
}
```

### Response
```typescript
interface GapAnalysisResponse {
  product: string;
  applicableStandards: string[];
  requirements: {
    requirement: string;
    category: "material" | "testing" | "manufacturing" | "certification" | "documentation";
    status: "SATISFIED" | "NOT_SATISFIED" | "NEEDS_VERIFICATION" | "UNKNOWN";
    evidence: string;
    recommendation: string;
    reference: Citation | null;
  }[];
  summary: {
    totalRequirements: number;
    satisfied: number;
    notSatisfied: number;
    needsVerification: number;
    criticalGaps: string[];
    nextSteps: string[];
  };
  citations: Citation[];
  confidence: "HIGH" | "MEDIUM" | "LOW";
  disclaimer: string;
}
```

### Database Interaction
1. RAG retrieval for the product (same as `/api/chat`)
2. Comparison prompt: user's data vs retrieved requirements
3. Structured output parsing

---

## 7. Shared Types

```typescript
// src/types/api.ts

interface Citation {
  refId: string;
  standardNumber: string;
  documentTitle: string;
  clauseNumber: string;
  clauseTitle: string;
  pageNumber: number;
  sourceUrl: string;
  mandatoryStatus: "mandatory" | "voluntary" | "conditional" | "unknown";
  chunkType: string;
}

interface ComplianceStep {
  stepNumber: number;
  title: string;
  description: string;
  status: "mandatory" | "voluntary" | "recommended";
  details: string[];
  references: string[]; // REF_IDs
}

type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";
type MandatoryStatus = "MANDATORY" | "VOLUNTARY" | "CONDITIONAL" | "UNKNOWN";
```

---

## 8. Error Codes

| HTTP Status | Code | Meaning |
|---|---|---|
| 400 | `INVALID_REQUEST` | Malformed request body |
| 400 | `QUERY_TOO_SHORT` | Query less than 3 characters |
| 400 | `QUERY_TOO_LONG` | Query exceeds 1000 characters |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests from this IP |
| 500 | `LLM_ERROR` | Gemini API call failed |
| 500 | `RETRIEVAL_ERROR` | Database search failed |
| 500 | `EMBEDDING_ERROR` | Embedding generation failed |
| 503 | `SERVICE_UNAVAILABLE` | Supabase or Gemini temporarily down |
