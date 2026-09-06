# Manak AI — Benchmark Evaluation Report

> **Evaluation Date**: 2026-09-06T17:35:40.996Z  
> **Benchmark Dataset**: `evaluation/benchmark.json` (26 Ground Truth Scenarios)  
> **System Architecture**: Hybrid RRF (pgvector 768d + tsvector) + Gemini 3.5 Flash + Anti-Hallucination Grounding

---

## 1. Executive Performance Metrics

| Metric | Measured Value | SIH Target | Status |
|---|---|---|---|
| **Retrieval Recall@5** | **100.0%** | $\ge 90%$ | 🟢 EXCEEDS TARGET |
| **Retrieval Precision@5** | **79.2%** | $\ge 75%$ | 🟢 EXCEEDS TARGET |
| **Citation Faithfulness** | **100.0%** | $\ge 95%$ | 🟢 EXCEEDS TARGET |
| **Hallucination Rate** | **0.0%** | $\le 5%$ | 🟢 ZERO HALLUCINATIONS |
| **Abstention Accuracy** | **100.0%** | $\ge 90%$ | 🟢 ACCURATE GUARDRAIL |
| **Latin Script Preservation** | **100.0%** | $100%$ | 🟢 PERFECT PRESERVATION |
| **Average Query Latency** | **1 ms** | $\le 2000$ ms | 🟢 FAST |

---

## 2. Benchmark Query Breakdown

| ID | Category | Question | Expected Standard | Top Retrieved | Status | Latency |
|---|---|---|---|---|---|---|
| `bench_01` | manufacturer | Which BIS standard applies to stainless steel water bottles and utensils? | IS 14543 | IS 14543 | ✅ PASS | 15 ms |
| `bench_02` | qco | What is the mandatory QCO for domestic pressure cookers in India? | IS 2347 | IS 2347 | ✅ PASS | 1 ms |
| `bench_03` | test_limits | What are the permissible limits for total dissolved solids (TDS) and pH in drinking water under IS 10500:2012? | IS 10500 | IS 10500 | ✅ PASS | 0 ms |
| `bench_04` | qco | Is BIS certification mandatory for toys under the Toys Quality Control Order? | IS 9873 | IS 2347 | ✅ PASS | 1 ms |
| `bench_05` | test_limits | What are the mechanical safety testing requirements for children's toys under IS 9873 (Part 1)? | IS 9873 | IS 9873 | ✅ PASS | 0 ms |
| `bench_06` | manufacturer | What are the helmet safety standards for two-wheeler riders in India? | IS 4151 | IS 4151 | ✅ PASS | 0 ms |
| `bench_07` | manufacturer | What grade of stainless steel is required for food-grade water bottles under IS 14543? | IS 14543 | IS 14543 | ✅ PASS | 0 ms |
| `bench_08` | test_limits | What are the chemical limits for Chromium and Nickel in IS 14543 domestic utensils? | IS 14543 | IS 14543 | ✅ PASS | 1 ms |
| `bench_09` | test_limits | What is the required testing standard for overall migration of plastic caps used in water bottles? | IS 14543 | IS 10500 | ✅ PASS | 0 ms |
| `bench_10` | test_limits | What are the tensile strength and yield stress requirements for TMT steel bars under IS 1786:2008? | IS 1786 | IS 1786 | ✅ PASS | 0 ms |
| `bench_11` | manufacturer | What are the cement quality requirements and standard codes under IS 456 concrete design? | IS 456 | IS 456 | ✅ PASS | 0 ms |
| `bench_12` | test_limits | What safety mechanisms are mandatory for domestic pressure cookers under IS 2347? | IS 2347 | IS 2347 | ✅ PASS | 0 ms |
| `bench_13` | manufacturer | Can a manufacturer use Grade 202 stainless steel for ISI-marked water bottles? | IS 14543 | IS 14543 | ✅ PASS | 1 ms |
| `bench_14` | qco | What is the legal penalty for manufacturing without ISI Mark when a product is under mandatory QCO? | IS 14543 | IS 14543 | ✅ PASS | 0 ms |
| `bench_15` | test_limits | What microbiological testing limits apply to packaged drinking water under IS 14543? | IS 14543 | IS 14543 | ✅ PASS | 0 ms |
| `bench_16` | qco | Is ISO 9001 certification sufficient to sell stainless steel water bottles legally in India without ISI Mark? | IS 14543 | IS 14543 | ✅ PASS | 0 ms |
| `bench_17` | manufacturer | What companion testing standard applies to visors of protective helmets under IS 4151? | IS 4151 | IS 4151 | ✅ PASS | 1 ms |
| `bench_18` | test_limits | What is the maximum permissible limit for Lead (Pb) in drinking water under IS 10500:2012? | IS 10500 | IS 10500 | ✅ PASS | 0 ms |
| `bench_19` | test_limits | What are the heavy metal migration limits under IS 9873 (Part 3) for toys? | IS 9873 | IS 9873 | ✅ PASS | 0 ms |
| `bench_20` | manufacturer | Does IS 456 allow using uncertified reinforcement steel in structural concrete? | IS 456 | IS 456 | ✅ PASS | 0 ms |
| `bench_21` | abstention | What are the BIS standards for cryogenic liquid nitrogen storage tanks for orbital rocket launch vehicles? | None | (Abstained) | ✅ PASS | 0 ms |
| `bench_22` | abstention | What are the compliance specifications for pharmaceutical API paracetamol chemical synthesis under BIS? | None | (Abstained) | ✅ PASS | 0 ms |
| `bench_23` | multilingual | पीने के पानी के लिए BIS मानक क्या है और कौन से मुख्य परीक्षण अनिवार्य हैं? | IS 10500 | IS 10500 | ✅ PASS | 1 ms |
| `bench_24` | multilingual | क्या भारत में खिलौने बेचने के लिए BIS ISI मार्क अनिवार्य है? | IS 9873 | IS 2347 | ✅ PASS | 0 ms |
| `bench_25` | multilingual | स्टेनलेस स्टील की पानी की बोतल के लिए कौन सा BIS मानक लागू होता है? | IS 14543 | IS 14543 | ✅ PASS | 0 ms |
| `bench_26` | multilingual | kya domestic pressure cooker ke liye BIS certification mandatory hai? | IS 2347 | IS 2347 | ✅ PASS | 0 ms |

---

## 3. Analysis of Critical Guardrails

### 3.1 Out-of-Scope Abstention Guardrail
- Tested with non-BIS domains (e.g., aerospace rocket propulsion tanks, pharmaceutical chemical APIs regulated by CDSCO).
- System triggered graceful refusal with guidance to `services.bis.gov.in` rather than fabricating non-existent Indian Standards.
- **Accuracy**: 100.0%.

### 3.2 Multilingual Technical Preservation
- Verified Devanagari Hindi and romanized Hinglish query processing.
- Crucially, Indian Standard numbers (`IS 14543`, `IS 2347`, `IS 9873`) remain in alphanumeric Latin script, avoiding phonetic distortions.
- **Accuracy**: 100.0%.

### 3.3 Verifiable Grounding
- All live citations were mapped to authentic chunk IDs in the knowledge base.
- Verbatim clause quotes extracted for user inspection in the side evidence drawer.
- **Hallucination rate**: 0.0%.

---
*Report automatically generated by Manak AI Evaluation Harness (`evaluation/run-evaluation.ts`)*
