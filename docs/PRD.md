# Manak AI — Product Requirements Document (PRD)

> **SIH 2026 Problem Statement SIH26107**
> *AI-powered Intelligent Assistant for Indian Standards & BIS Services for Industries and Consumers*

---

## 1. Product Vision

**Manak AI** is an AI-powered BIS Compliance Intelligence Platform that helps Indian manufacturers, consumers, and compliance professionals understand which Bureau of Indian Standards (BIS) standards, certifications, and regulatory requirements apply to their products.

Unlike a generic chatbot, Manak AI is a **domain-specific compliance intelligence system** that retrieves authoritative information from BIS documents, provides clause-level citations, distinguishes between mandatory and voluntary requirements, and generates structured compliance pathways.

---

## 2. Problem Statement

### The Problem
- India has **19,000+** published Indian Standards across 14 sectors
- Quality Control Orders (QCOs) make certain standards **mandatory** — but determining which ones is confusing
- Small manufacturers often don't know which standards apply to their products
- Consumers can't easily verify if a product should carry BIS certification
- BIS information is scattered across PDFs, gazette notifications, and multiple websites
- No intelligent system exists that can interpret a product description and map it to applicable BIS requirements

### Who It Affects
1. **Manufacturers**: Need to know which standards and certifications are required before manufacturing/selling
2. **Consumers**: Want to verify if a product should be BIS-certified and what to look for
3. **Quality/Compliance Professionals**: Need quick access to requirements across standards
4. **Testing Laboratories**: Need to identify applicable test methods
5. **Government/BIS Officials**: Need a tool to help stakeholders navigate standards

---

## 3. Target Users

### Primary Users (SIH Demo Focus)
| User Type | Example Query | Key Need |
|---|---|---|
| **Manufacturer** | "I manufacture stainless steel water bottles. Which BIS standards apply?" | Standards identification, mandatory/voluntary status, certification pathway |
| **Consumer** | "Should a packaged drinking water bottle have a BIS mark?" | Simple yes/no with evidence, what to look for |
| **Compliance Officer** | "What are the testing requirements under IS 14543:2016?" | Detailed clause-level requirements |

### Secondary Users (Post-SIH)
- Testing laboratories
- BIS officials
- Legal/regulatory consultants

---

## 4. Core Features

### 4.1 AI Chat Assistant (P0 — Must Have)
- Natural language query input in English and Hindi
- Product + intent + entity extraction from queries
- Hybrid RAG-based retrieval from BIS knowledge base
- Structured, evidence-based responses
- Clause-level citations with page numbers
- Source document references
- Related standards suggestions

### 4.2 Citation System (P0 — Must Have)
- Every factual claim cites: Standard Number, Clause/Section, Page Number, Source URL
- Citations are verifiable against retrieved chunks (not hallucinated)
- Clickable citation references in the UI
- Source document viewer

### 4.3 Mandatory vs Voluntary Determination (P0 — Must Have)
- Distinguish between: Mandatory (QCO-backed), Voluntary, Conditional, Insufficient Evidence
- QCO-aware retrieval — link standards to their QCO status
- Explicit "insufficient evidence" response when evidence is lacking

### 4.4 AI Compliance Pathway (P0 — Primary Innovation)
- After answering, generate a structured compliance workflow:
  1. Applicable Standard(s)
  2. Mandatory/Voluntary Status
  3. Key Requirements Summary
  4. Testing Requirements
  5. Manufacturing/Quality Requirements
  6. Certification Path (ISI Mark, CRS, FMCS, etc.)
  7. Recommended Next Steps

### 4.5 Confidence/Evidence Layer (P0 — Must Have)
- Three-tier evidence assessment: HIGH / MEDIUM / LOW confidence
- Calculated from retrieval signals, not arbitrary LLM output
- Explicit explanation of why confidence level was assigned

### 4.6 Multilingual Support (P1 — Should Have)
- Hindi and English query support
- Language detection and response in the query language
- Preserve standard numbers and technical terms in original form
- Hindi/English UI toggle

### 4.7 Compliance Gap Analysis (P1 — Secondary Innovation)
- User provides product details, current tests, current certifications
- System compares against retrieved BIS requirements
- Generates: Requirements Met / Not Met / Needs Verification / Missing Tests / Next Steps
- Clear disclaimer that this is not official BIS certification

### 4.8 Standards Explorer (P2 — Nice to Have)
- Browse indexed standards
- Search by standard number, product category, industry
- View document metadata

---

## 5. Non-Functional Requirements

| Requirement | Target |
|---|---|
| **Response Latency** | < 8 seconds for full answer with citations |
| **Citation Accuracy** | > 90% of cited clauses must be verifiable |
| **Hallucination Rate** | < 5% of responses should contain ungrounded claims |
| **Concurrent Users** | Support SIH demo (3-5 concurrent) |
| **Uptime** | Vercel/Supabase defaults (99.9%) |
| **Languages** | English, Hindi |
| **Cost** | ≈ ₹0 (free tier only for prototype) |

---

## 6. Out of Scope (Do NOT Build)

| Feature | Why Not |
|---|---|
| User authentication/accounts | Not needed for SIH demo |
| Payment system | No monetization for prototype |
| Document upload by users | Adds complexity; use pre-ingested knowledge base |
| Real-time BIS website scraping | Unreliable; use pre-processed documents |
| Email/notification system | Not needed for demo |
| Mobile app | Web responsive is sufficient |
| Admin dashboard | Not needed for demo |
| Chat history persistence | In-memory or simple local storage is fine |
| Multi-turn conversation memory | Single-turn RAG is sufficient for prototype |
| Fine-tuned models | Use prompting; fine-tuning is expensive and slow |

---

## 7. Success Metrics (SIH Demo)

| Metric | Target |
|---|---|
| Can answer 3+ demo queries accurately | ✅ |
| Citations are correct and verifiable | ✅ |
| Correctly identifies mandatory vs voluntary | ✅ |
| Generates compliance pathway | ✅ |
| Supports Hindi query | ✅ |
| Refuses to answer when evidence is insufficient | ✅ |
| Response time < 10 seconds | ✅ |
| Professional, enterprise-quality UI | ✅ |
| System is live on Vercel (not just localhost) | ✅ |

---

## 8. Assumptions

1. BIS standard PDFs (or their publicly available scopes/summaries) can be legally used for a hackathon prototype
2. Gemini API free tier will have sufficient quota for demo
3. Supabase free tier will have sufficient storage for our knowledge base
4. The team has 4-6 members with basic web development skills
5. Timeline is approximately 4-6 weeks to build the prototype

---

## 9. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| BIS PDFs are copyrighted/not freely available | Cannot build knowledge base | Use publicly available scopes, QCO gazette notifications, BIS FAQ content; supplement with sample data |
| Gemini API rate limits hit during demo | Demo fails | Cache demo queries; have fallback responses ready |
| Supabase free tier runs out | DB goes down | Monitor usage; stay under 500 MB |
| OCR quality is poor for scanned documents | Bad retrieval results | Prioritize digitally-born PDFs; manually clean key documents |
| Hindi retrieval quality is poor | Demo fails for Hindi query | Pre-test Hindi queries; ensure embedding model handles Hindi well |

---

## 10. Glossary

| Term | Definition |
|---|---|
| **BIS** | Bureau of Indian Standards — India's national standards body |
| **IS** | Indian Standard — e.g., IS 10500:2012 |
| **QCO** | Quality Control Order — government gazette notification making a standard mandatory |
| **ISI Mark** | BIS certification mark for products |
| **CRS** | Compulsory Registration Scheme (for electronics) |
| **FMCS** | Foreign Manufacturers Certification Scheme |
| **RAG** | Retrieval-Augmented Generation |
| **pgvector** | PostgreSQL extension for vector similarity search |
| **RRF** | Reciprocal Rank Fusion — method to combine multiple search result lists |
