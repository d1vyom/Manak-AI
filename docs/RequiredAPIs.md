# Manak AI — Required APIs & Services

> All external APIs, services, and their free-tier viability for SIH 2026 prototype

---

## 1. Google Gemini API (Primary AI)

### LLM — Gemini 2.5 Flash
| Property | Value |
|---|---|
| **Model** | `gemini-2.5-flash` |
| **Purpose** | Main response generation, compliance analysis |
| **Free Tier** | ✅ Free of charge |
| **Free RPM** | ~10-15 RPM |
| **Free RPD** | ~1,500 RPD |
| **Free TPM** | ~250K-1M TPM |
| **Context Window** | 1,048,576 tokens input / 65,536 tokens output |
| **SDK** | `@google/genai` (npm) |
| **Auth** | API Key via Google AI Studio |

### LLM — Gemini 2.5 Flash-Lite (Entity Extraction)
| Property | Value |
|---|---|
| **Model** | `gemini-2.5-flash-lite` |
| **Purpose** | Query understanding, entity extraction, language detection |
| **Free Tier** | ✅ Free of charge |
| **Free RPM** | ~15 RPM |
| **Free RPD** | ~1,500 RPD |
| **Rationale** | Cheaper/faster for preprocessing tasks |

### Embeddings — Gemini Embedding 2
| Property | Value |
|---|---|
| **Model** | `gemini-embedding-2` |
| **Purpose** | Text embedding for semantic search |
| **Free Tier** | ✅ Free of charge |
| **Dimensions** | 768 (recommended for prototype) |
| **Input Limit** | 8,192 tokens |
| **Multilingual** | ✅ 100+ languages including Hindi |
| **Task Types** | Use `RETRIEVAL_QUERY` for queries, `RETRIEVAL_DOCUMENT` for chunks |

> [!WARNING]
> **Billing Trap**: Do NOT attach a billing account to your Google Cloud project. The free tier quota is removed once billing is enabled. Use a separate project for free-tier access.

### API Key Setup
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create API Key (no billing required)
3. Store in `.env.local` as `GEMINI_API_KEY`

---

## 2. Supabase (Database + Storage)

| Property | Value |
|---|---|
| **Purpose** | PostgreSQL database, pgvector, file storage |
| **Free Tier** | ✅ 2 active projects |
| **DB Storage** | 500 MB |
| **File Storage** | 1 GB (50 MB per file) |
| **Bandwidth** | 10 GB/month |
| **Connections** | 200 pooled / 15 direct |
| **Edge Functions** | 500K invocations/month |
| **Auth** | 50K MAU |

### Required Extensions
```sql
CREATE EXTENSION IF NOT EXISTS vector;     -- pgvector
CREATE EXTENSION IF NOT EXISTS pg_trgm;    -- Trigram matching
```

### Setup
1. Create project at [supabase.com](https://supabase.com)
2. Get `SUPABASE_URL` and `SUPABASE_ANON_KEY` from Settings > API
3. Get `DATABASE_URL` from Settings > Database (for Prisma)
4. Store all in `.env.local`

> [!CAUTION]
> Supabase free tier projects **pause after 7 days of inactivity**. Visit the dashboard periodically or set up a cron ping to prevent this during development.

---

## 3. Vercel (Deployment)

| Property | Value |
|---|---|
| **Purpose** | Next.js hosting |
| **Free Tier** | ✅ Hobby plan |
| **Bandwidth** | 100 GB/month |
| **Serverless Timeout** | 10s default (configurable up to 60s on Hobby) |
| **Function Invocations** | 1M/month |
| **Build Minutes** | 600/month |
| **Deployments** | 100/day |

### Limitations to Watch
- **10-second default serverless timeout** — our RAG pipeline must be fast
  - Mitigation: Use streaming responses; the connection stays alive during streaming
- **Non-commercial use only** on Hobby plan — fine for SIH

### Setup
1. Connect GitHub repo at [vercel.com](https://vercel.com)
2. Set environment variables in Vercel dashboard
3. Deploy with `git push`

---

## 4. Optional / Fallback APIs

### Cohere Rerank API (Optional Reranking)
| Property | Value |
|---|---|
| **Purpose** | Cross-encoder reranking of retrieved chunks |
| **Free Tier** | ✅ 1,000 rerank calls/month (Trial API key) |
| **Model** | `rerank-multilingual-v3.0` |
| **Multilingual** | ✅ Hindi + English |
| **SDK** | `cohere` npm package |

> [!TIP]
> We may not need this if our hybrid search + RRF is good enough. Only add if retrieval quality is insufficient.

---

## 5. Environment Variables

```env
# .env.local

# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# Optional
COHERE_API_KEY=your_cohere_key  # Only if using Cohere reranking
```

---

## 6. API Cost Summary

| Service | Monthly Free Allocation | Estimated Demo Usage | Cost |
|---|---|---|---|
| Gemini 2.5 Flash | ~1,500 RPD | ~50-100 queries/day during dev | ₹0 |
| Gemini 2.5 Flash-Lite | ~1,500 RPD | ~50-100 queries/day | ₹0 |
| Gemini Embedding 2 | ~1,500 RPD | ~100 embeddings during ingestion + queries | ₹0 |
| Supabase PostgreSQL | 500 MB | ~50-100 MB for prototype | ₹0 |
| Supabase Storage | 1 GB | ~200 MB for PDFs | ₹0 |
| Vercel Hosting | 100 GB bandwidth | ~1-5 GB | ₹0 |
| Cohere Rerank | 1,000 calls/month | ~200-500 calls | ₹0 |
| **Total** | | | **≈ ₹0** |

---

## 7. Python Dependencies (Ingestion Pipeline Only)

These are NOT part of the Next.js app. They run locally for document processing.

```txt
# requirements.txt for ingestion pipeline
pymupdf>=1.24.0        # PDF parsing
pytesseract>=0.3.10    # OCR (requires Tesseract installed)
google-genai>=1.0.0    # Gemini embeddings
psycopg2-binary>=2.9   # PostgreSQL connection
python-dotenv>=1.0     # Env vars
tqdm>=4.65             # Progress bars
```

### System Dependencies
```bash
# Tesseract OCR (for scanned PDFs)
# Windows: Download installer from https://github.com/UB-Mannheim/tesseract/wiki
# Add Hindi language data: tessdata/hin.traineddata
```
