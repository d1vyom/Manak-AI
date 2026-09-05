# Manak AI — SIH Demo Script

> 3-5 minute demonstration flow for SIH judges

---

## Demo Overview

**Duration**: 4 minutes
**Format**: Live demo on deployed URL + brief Q&A

### Opening (30 seconds)

> "Namaste! We are [Team Name]. We built Manak AI — India's first AI-powered BIS Compliance Intelligence Platform.
>
> India has over 19,000 Indian Standards. Determining which ones apply to your product, whether certification is mandatory, and what the actual requirements are — is confusing. Especially for small manufacturers and consumers.
>
> Manak AI solves this. Let me show you."

---

## Demo Query 1: Manufacturer Query (60 seconds)

### Input
```
I manufacture stainless steel water bottles. Which BIS standards and certification requirements apply to my product?
```

### What to Highlight for Judges

1. **Entity Extraction**: "Notice how the system identified the product (stainless steel water bottle), material (stainless steel), and user type (manufacturer)"

2. **Citation Quality**: "Every claim is backed by a specific clause and page number from an actual Indian Standard — IS 14543:2016, Clause 4.2, Page 12"

3. **Mandatory vs Voluntary**: "The system correctly identifies this product is under a Quality Control Order — BIS certification is MANDATORY, not voluntary. It tells you the specific QCO notification number."

4. **Compliance Pathway**: "Below the answer, you see a structured compliance pathway — step by step, from identifying standards to applying for ISI Mark certification"

5. **Confidence Level**: "The confidence indicator shows HIGH — because we found strong, authoritative evidence from multiple clauses"

---

## Demo Query 2: Consumer Query (60 seconds)

### Input
```
I want to buy a pressure cooker. How do I know if it is BIS certified and safe to use?
```

### What to Highlight

1. **Consumer-Friendly Language**: "Notice the response is in simple language — not technical jargon. It explains what ISI Mark is, where to find it on the product, and how to verify it"

2. **Practical Information**: "It tells the consumer about IS 2347:2017 (Domestic Pressure Cookers), what safety tests are required (burst pressure, safety valve), and how to check ISI Mark using the BIS Care app"

3. **Citation Panel**: "On the right, you can see all source citations — each one verifiable"

---

## Demo Query 3: Hindi Query (60 seconds)

### Input
```
मुझे खिलौने बनाने हैं। कौन से BIS मानक लागू होते हैं? क्या BIS प्रमाणन अनिवार्य है?
```
*(Translation: I want to manufacture toys. Which BIS standards apply? Is BIS certification mandatory?)*

### What to Highlight

1. **Hindi Response**: "The system detected Hindi and responded in Hindi — while preserving standard numbers like IS 9873 in their original form"

2. **Multilingual Retrieval**: "Even though our knowledge base is primarily in English, the multilingual embeddings correctly retrieved the relevant toy safety standard"

3. **Accurate Mandatory Status**: "It correctly identifies that toys under IS 9873 are under mandatory QCO by DPIIT — with the effective date"

---

## Demo Query 4: Safety/Failure Demo (45 seconds)

### Input
```
What are the BIS standards for artificial intelligence software?
```

### What to Highlight

> "This is our safety feature. Watch what happens when we ask about something NOT in our knowledge base."

1. **Honest Refusal**: "The system says: 'The available documents do not contain specific Indian Standards for AI software. While BIS may be developing standards in this area, I cannot provide requirements without authoritative evidence.'"

2. **LOW Confidence**: "Notice the confidence indicator is LOW — the system knows it doesn't have reliable information"

3. **No Hallucination**: "A generic AI chatbot would have invented standards. Manak AI refuses to guess — because in compliance, wrong information is worse than no information."

---

## Compliance Gap Analysis Demo (45 seconds — if time permits)

### Input Form
```
Product: Stainless Steel Water Bottle
Material: SS 304
Capacity: 1 litre
Current Tests: Material test, Leakage test
Current Certification: None
```

### What to Highlight

1. **Gap Identification**: "The system compares your current status against BIS requirements and shows: Material test ✅ Satisfied, Leakage test ✅ Satisfied, Overall migration test ❌ Not done, BIS certification ❌ Missing"

2. **Actionable Recommendations**: "For each gap, it provides specific next steps"

3. **Disclaimer**: "Note the clear disclaimer — this is an advisory tool, not official BIS certification"

---

## Closing (30 seconds)

> "Manak AI is more than a chatbot. It's a compliance intelligence platform that:
> - Retrieves from authoritative BIS documents
> - Provides clause-level citations
> - Distinguishes mandatory from voluntary
> - Generates compliance pathways
> - Supports Hindi and English
> - Refuses to hallucinate
>
> Our hybrid RAG pipeline combines semantic search, keyword search, and metadata filtering with retrieval-based confidence scoring.
>
> We believe this can be the foundation for a national BIS assistance platform. Thank you!"

---

## Expected Judge Questions & Answers

### Q: "How is this different from just using ChatGPT?"
> "Three critical differences:
> 1. ChatGPT hallucinates BIS standards — ours retrieves from actual documents with citations
> 2. ChatGPT can't tell you if certification is mandatory — ours cross-references Quality Control Orders
> 3. ChatGPT has no clause-level citations — ours shows exact standard, clause, and page number"

### Q: "What if you haven't ingested a particular standard?"
> "The system will say it doesn't have sufficient evidence. It never guesses. Additionally, the architecture supports incremental ingestion — new standards can be added by running our ingestion pipeline."

### Q: "Is this legally valid?"
> "No — and we explicitly disclaim this. Manak AI is an advisory and informational tool. Official certification decisions must come from BIS. Think of it like a knowledgeable advisor who points you to the right documents, not a certifying authority."

### Q: "How does it scale to 19,000+ standards?"
> "Our pgvector database with HNSW indexing scales sub-linearly. Adding more documents is running the ingestion pipeline. The retrieval latency stays under 200ms regardless of collection size. For production, we'd need more compute but the architecture is the same."

### Q: "What's novel / what's your innovation?"
> "Two innovations:
> 1. The Compliance Pathway — converting raw standard requirements into an actionable step-by-step workflow
> 2. The evidence-aware confidence system — retrieval-based, not LLM-generated, so it's grounded in actual data quality"

### Q: "Why not fine-tune a model?"
> "Fine-tuning bakes knowledge into weights — it can't be updated when standards change and can't cite sources. RAG keeps the knowledge external and citable. For compliance, traceability to source is non-negotiable."

---

## SIH Differentiators / USP

| Feature | Generic AI Chatbot | Manak AI |
|---|---|---|
| Citation accuracy | ❌ Hallucinates | ✅ Clause-level, verified |
| Mandatory/Voluntary | ❌ Cannot determine | ✅ QCO-aware logic |
| Compliance pathway | ❌ None | ✅ Structured workflow |
| Confidence scoring | ❌ Arbitrary | ✅ Retrieval-based |
| Hindi support | ⚠️ Generic | ✅ Domain-specific |
| Knowledge source | ❌ Training data (stale) | ✅ BIS documents (updatable) |
| Gap analysis | ❌ None | ✅ Requirement comparison |
| Failure handling | ❌ Confidently wrong | ✅ Explicitly uncertain |
