# Manak AI

> 🇮🇳 AI-Powered BIS Standards & Compliance Intelligence Platform

**SIH 2026 — Problem Statement SIH26107**

Manak AI helps Indian manufacturers, consumers, and compliance professionals understand which Bureau of Indian Standards (BIS) standards, certifications, and regulatory requirements apply to their products.

## Features

- 🔍 **Smart Standards Retrieval** — Hybrid RAG with vector + keyword search
- 📋 **Clause-Level Citations** — Every claim backed by standard, clause, and page number
- ✅ **Mandatory/Voluntary Detection** — QCO-aware compliance determination
- 📊 **AI Compliance Pathway** — Step-by-step certification workflow
- 🌐 **Hindi & English** — Multilingual query and response support
- 🛡️ **Evidence-Based Confidence** — Retrieval-grounded confidence scoring
- ❌ **Anti-Hallucination** — Refuses to answer without evidence

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Next.js Route Handlers |
| Database | Supabase PostgreSQL + pgvector |
| ORM | Prisma + raw SQL |
| LLM | Gemini 2.5 Flash |
| Embeddings | Gemini Embedding 2 (768-dim) |
| Ingestion | Python + PyMuPDF |
| Deployment | Vercel + Supabase |

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm
- Python 3.11+ (for ingestion only)
- Supabase account (free)
- Google AI Studio API key (free)

### Setup

```bash
# Clone the repo
git clone https://github.com/your-team/manak-ai.git
cd manak-ai

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# Set up database
pnpm prisma generate
pnpm prisma db push

# Run development server
pnpm dev
```

### Ingestion Pipeline

```bash
cd ingestion
pip install -r requirements.txt
python ingest.py --pdf-dir data/pdfs --config-dir data/configs
```

## Documentation

| Document | Description |
|---|---|
| [PRD](docs/PRD.md) | Product Requirements |
| [Architecture](docs/brain.md) | System architecture, database schema, RAG algorithm |
| [Tech Stack](docs/TechStack.md) | Technology choices and rationale |
| [API Spec](docs/APISpec.md) | Backend API specification |
| [Frontend](docs/Frontend.md) | UI architecture and component design |
| [Plan](docs/Plan.md) | Implementation roadmap |
| [Dataset Strategy](docs/DatasetStrategy.md) | Document sourcing and ingestion guide |
| [Required APIs](docs/RequiredAPIs.md) | External API dependencies |
| [Evaluation](docs/Evaluation.md) | RAG evaluation framework |
| [Security & Cost](docs/Security-Cost-Risks.md) | Security checklist and cost analysis |
| [Demo Script](docs/DemoScript.md) | SIH judge demonstration script |

## Team

Built by [Your Team Name] for Smart India Hackathon 2026.

## Disclaimer

Manak AI is an informational tool for reference purposes only. It does not constitute official BIS certification or legal advice. Please verify all information with the Bureau of Indian Standards (bis.gov.in).
