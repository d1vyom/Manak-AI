# Manak AI — Evaluation Strategy

> RAG evaluation framework, benchmark design, and quality metrics

---

## 1. Evaluation Dimensions

| Dimension | What We Measure | Target |
|---|---|---|
| **Retrieval Quality** | Are the right documents/chunks retrieved? | Recall@10 > 80% |
| **Citation Correctness** | Are cited clauses actually in the retrieved context? | > 95% |
| **Citation Completeness** | Did the answer cite all relevant sources? | > 80% |
| **Answer Faithfulness** | Does the answer only contain information from the evidence? | > 90% |
| **Hallucination Rate** | Does the answer invent standards/clauses/requirements? | < 5% |
| **Mandatory/Voluntary Accuracy** | Is the mandatory/voluntary determination correct? | > 90% |
| **Multilingual Accuracy** | Are Hindi queries answered correctly? | > 80% |
| **Latency** | End-to-end response time | < 10 seconds |
| **Abstention Quality** | Does the system refuse when evidence is lacking? | > 90% |

---

## 2. Benchmark Dataset

### Design Principles
- **Small but verified**: 25-30 questions, each with manually verified expected answers
- **Diverse**: Cover different product types, query types, and edge cases
- **Answerable**: Most questions should be answerable from our ingested knowledge base
- **Include unanswerable**: 3-5 questions that SHOULD NOT be answered (to test abstention)

### Benchmark Format
```json
{
  "id": "Q001",
  "query": "What are the chemical composition requirements for stainless steel utensils under IS 14543?",
  "language": "en",
  "category": "manufacturer",
  "expected_standard": "IS 14543:2016",
  "expected_clauses": ["4.1", "4.2"],
  "expected_mandatory_status": "mandatory",
  "expected_answer_contains": ["chromium", "nickel", "grade 304", "chemical composition"],
  "expected_answer_not_contains": [],
  "is_answerable": true,
  "difficulty": "easy"
}
```

### Sample Benchmark Questions

#### Category 1: Standard Identification (Easy)
1. "Which BIS standards apply to packaged drinking water?"
   - Expected: IS 14543:2004
2. "What is the BIS standard for domestic pressure cookers?"
   - Expected: IS 2347:2017
3. "Which Indian Standard covers safety of toys?"
   - Expected: IS 9873 (Part 1):2019

#### Category 2: Requirement Details (Medium)
4. "What are the permissible limits for lead in drinking water as per IS 10500?"
   - Expected: IS 10500:2012, Table 1, 0.01 mg/L
5. "What grades of stainless steel are permitted for utensils under IS 14543?"
   - Expected: IS 14543:2016, Clause 4.1, AISI 201/202/301/304/316
6. "What is the minimum compressive strength for M25 grade concrete?"
   - Expected: IS 456:2000, 25 MPa

#### Category 3: Mandatory/Voluntary (Medium)
7. "Is BIS certification mandatory for steel water bottles?"
   - Expected: Mandatory, QCO reference
8. "Is BIS certification required for office furniture?"
   - Expected: Voluntary (no QCO) or insufficient evidence
9. "Are toy manufacturers required to have ISI Mark?"
   - Expected: Mandatory, QCO by DPIIT

#### Category 4: Hindi Queries (Medium)
10. "पीने के पानी के लिए TDS की अधिकतम सीमा क्या है?"
    - Expected: IS 10500:2012, 500 mg/L (acceptable), 2000 mg/L (permissible)
11. "हेलमेट के लिए कौन सा BIS मानक है?"
    - Expected: IS 4151:2015

#### Category 5: Compliance Pathway (Hard)
12. "I want to start manufacturing cement. What BIS certifications do I need?"
    - Expected: IS 269:2015, mandatory QCO, ISI Mark, factory audit pathway
13. "What testing is required for LED bulbs to get BIS certification?"
    - Expected: IS 10322, CRS scheme, test reports from recognized lab

#### Category 6: Unanswerable / Abstention (Critical)
14. "What are the BIS standards for drone manufacturing?"
    - Expected: Abstention / insufficient evidence
15. "Which IS standard covers cryptocurrency regulations?"
    - Expected: Abstention / not a BIS domain
16. "What is the BIS standard for electric vehicle batteries?"
    - Expected: Partial answer or honest uncertainty

#### Category 7: Edge Cases
17. "IS 456 clause 5.3.1" (very specific clause lookup)
18. "Compare IS 10500 with WHO drinking water guidelines"
    - Expected: Only answer for IS 10500 (WHO not in our KB)
19. "What is the latest revision of IS 14543?"
    - Expected: Answer based on our indexed version

---

## 3. Evaluation Metrics

### 3a. Retrieval Metrics

**Recall@K** — Were the relevant chunks in the top-K results?
```python
def recall_at_k(retrieved_chunks, expected_clauses, k=10):
    """What fraction of expected clauses appear in top-K retrieved chunks?"""
    retrieved_clauses = {c.clause_number for c in retrieved_chunks[:k]}
    expected = set(expected_clauses)
    return len(retrieved_clauses & expected) / len(expected) if expected else 1.0
```

**Precision@K** — What fraction of top-K results are relevant?
```python
def precision_at_k(retrieved_chunks, expected_standard, k=10):
    """What fraction of top-K chunks are from the expected standard?"""
    relevant = sum(1 for c in retrieved_chunks[:k] if c.standard_number == expected_standard)
    return relevant / k
```

### 3b. Citation Metrics

**Citation Correctness** — Is every cited reference valid?
```python
def citation_correctness(response_citations, provided_evidence):
    """What % of citations in the response were actually in the evidence?"""
    valid = sum(1 for c in response_citations if c.ref_id in provided_evidence)
    return valid / len(response_citations) if response_citations else 1.0
```

**Citation Completeness** — Did the response cite all relevant evidence?
```python
def citation_completeness(response_citations, expected_clauses):
    """What % of expected clauses were cited in the response?"""
    cited_clauses = {c.clause_number for c in response_citations}
    expected = set(expected_clauses)
    return len(cited_clauses & expected) / len(expected) if expected else 1.0
```

### 3c. Answer Quality

**Faithfulness** — Does the answer only contain information from evidence?
- Use Gemini 2.5 Flash as an evaluator:
```
Given the following evidence and answer, does the answer contain
any claims NOT supported by the evidence? Reply YES or NO,
and list any unsupported claims.

Evidence: {evidence_blocks}
Answer: {generated_answer}
```

**Hallucination Detection** — Check for invented standard numbers or clauses
```python
def detect_hallucinations(response_text, knowledge_base):
    """Extract all IS XXXX patterns and verify they exist in our KB"""
    import re
    cited_standards = re.findall(r'IS\s+\d+(?:\s*:\s*\d{4})?', response_text)
    hallucinated = [s for s in cited_standards if s not in knowledge_base]
    return hallucinated
```

### 3d. Mandatory/Voluntary Accuracy
- Compare system's determination against manually verified ground truth
- Binary accuracy metric

### 3e. Abstention Quality
- For unanswerable questions, check if system abstains or hallucinates
- True positive: correctly abstains; False negative: answers when it shouldn't

### 3f. Latency
- Measure end-to-end from query submission to complete response
- Break down: embedding generation, retrieval, LLM generation

---

## 4. Running Evaluation

### Script: `evaluation/evaluate.py`
```python
# Pseudocode
import json

# Load benchmark
with open('benchmark.json') as f:
    benchmark = json.load(f)

results = []
for question in benchmark:
    # Call RAG pipeline
    response = call_api(question['query'], question['language'])

    # Measure metrics
    metrics = {
        'id': question['id'],
        'recall_at_10': recall_at_k(response.retrieved_chunks, question['expected_clauses']),
        'precision_at_10': precision_at_k(response.retrieved_chunks, question['expected_standard']),
        'citation_correctness': citation_correctness(response.citations, response.evidence),
        'citation_completeness': citation_completeness(response.citations, question['expected_clauses']),
        'mandatory_correct': response.mandatory_status == question['expected_mandatory_status'],
        'latency_ms': response.latency,
        'abstained_correctly': check_abstention(response, question),
    }
    results.append(metrics)

# Aggregate and report
print_report(results)
```

### Output Format
```
=== Manak AI RAG Evaluation Report ===
Questions: 25
Answerable: 20 | Unanswerable: 5

RETRIEVAL:
  Recall@10:    82.5%  (target: >80%)  ✅
  Precision@10: 65.0%

CITATIONS:
  Correctness:  96.0%  (target: >95%)  ✅
  Completeness: 78.0%  (target: >80%)  ⚠️

ANSWER QUALITY:
  Faithfulness:         92.0%  (target: >90%)  ✅
  Hallucination Rate:    4.0%  (target: <5%)   ✅

COMPLIANCE:
  Mandatory/Vol Accuracy: 90.0% ✅

MULTILINGUAL:
  Hindi Accuracy: 85.0%  ✅

SAFETY:
  Abstention Rate:  80.0% (4/5 unanswerable correctly refused)

PERFORMANCE:
  Avg Latency: 6.2 seconds  ✅
  P95 Latency: 9.1 seconds  ✅
```

---

## 5. Continuous Improvement Loop

```
Run evaluation
       │
       ▼
Identify failures
       │
       ├── Retrieval failures → Improve chunking, add metadata, increase top-K
       ├── Citation failures → Refine prompts, add post-validation rules
       ├── Hallucinations → Strengthen abstention prompts, lower confidence thresholds
       └── Latency issues → Reduce top-K, cache embeddings, optimize queries
       │
       ▼
Re-run evaluation
```
