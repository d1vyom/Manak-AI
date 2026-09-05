# Manak AI — Dataset Strategy

> Which BIS documents to prioritize, how to source them, and how to structure metadata

---

## 1. Document Sourcing Priorities

### Tier 1: Must-Have for Demo (10-12 documents)

These are high-impact, commonly referenced standards across multiple industries:

| # | Standard | Title | Sector | Why Priority |
|---|---|---|---|---|
| 1 | IS 14543:2016 | Stainless Steel Utensils for Domestic Purposes | Consumer/Food | Perfect demo query (water bottles, utensils), mandatory QCO |
| 2 | IS 10500:2012 | Drinking Water — Specification | Water | Consumer-friendly, has clear parameter tables |
| 3 | IS 14543:2004 | Packaged Drinking Water | Water/FMCG | Mandatory, relatable product |
| 4 | IS 9873 (Part 1):2019 | Safety of Toys — Mechanical & Physical | Consumer/Child Safety | Mandatory QCO, emotional impact for judges |
| 5 | IS 4151:2015 | Protective Helmets for Two Wheeler Riders | Automotive/Consumer | Mandatory, universally understood |
| 6 | IS 2347:2017 | Domestic Pressure Cookers | Consumer/Appliances | Mandatory, safety-critical |
| 7 | IS 1786:2008 | TMT Steel Bars for Concrete | Steel/Construction | Mandatory QCO, industrial relevance |
| 8 | IS 269:2015 | Ordinary Portland Cement | Construction | Mandatory QCO, infrastructure |
| 9 | IS 456:2000 | Plain & Reinforced Concrete — Code of Practice | Construction | National Building Code reference |
| 10 | IS 1417:2016 | Gold Jewellery — Fineness & Marking | Precious Metals | Mandatory hallmarking, consumer interest |

### Tier 2: Nice-to-Have (5-8 documents)

| # | Standard | Title | Sector |
|---|---|---|---|
| 11 | IS 13252 (Part 1):2010 | IT Equipment Safety | Electronics |
| 12 | IS 2062:2011 | Structural Steel | Steel |
| 13 | IS 16046 (Part 2):2018 | Lithium Battery Safety | Electronics/EV |
| 14 | IS 10322 (Part 5):2012 | Luminaires (LED) | Electrical |
| 15 | IS 13428:2005 | Natural Mineral Water | Food/Water |

### Tier 3: QCO & Supporting Documents (5-10 documents)

| Type | Examples |
|---|---|
| QCO notifications | QCO for stainless steel utensils, toys, helmets, cement, steel |
| BIS FAQs | "How to get ISI Mark", "CRS registration process" |
| Product Manuals | SIT for water bottles, toys (freely available on BIS portal) |
| BIS guidelines | License application guidelines |

---

## 2. Sourcing Methods

### Method 1: BIS Official Portal (Primary)
- URL: `standardsbis.bsbedge.com` or via `bis.gov.in/standards`
- **Process**: Create free account → Search standard number → Download PDF
- **Availability**: All indigenous Indian Standards are free; ISO-adopted standards are paid
- **Quality**: High — official, well-formatted PDFs

### Method 2: Internet Archive (Backup)
- URL: `archive.org/details/in.gov.standards.bis`
- **API**: `https://archive.org/advancedsearch.php?q=collection:(in.gov.standards.bis)+AND+title:(IS 14543)&output=json`
- **Quality**: Variable — some are scanned, some are OCR'd
- **Advantage**: Programmatic access, bulk download possible

### Method 3: BIS "Know Your Standards" (Metadata Only)
- URL: `services.bis.gov.in`
- **Use**: Get standard titles, scopes, publication dates, amendment info
- **Limitation**: No full PDF download — metadata only

### Method 4: Gazette of India (QCOs)
- URL: `egazette.gov.in`
- **Use**: Download QCO notifications
- **Quality**: Official gazette PDFs

---

## 3. How Many Documents/Chunks Are Enough?

### Prototype Target

| Metric | Target | Rationale |
|---|---|---|
| Documents | 15-20 | Covers 3+ industries, enough for diverse demo queries |
| Chunks | 2,000-5,000 | ~200-300 chunks per document (varies by document length) |
| QCO entries | 10-15 | Cover the mandatory standards in Tier 1 |
| Industries covered | 4-5 | Consumer goods, Construction, Steel, Water, Electronics |
| Vector storage | ~15-50 MB | Well within Supabase 500 MB |

> [!TIP]
> **Quality over quantity**. 10 well-parsed, cleanly chunked documents with correct metadata will produce far better demo results than 100 poorly processed documents.

---

## 4. Metadata Structure Per Document

Each document requires a metadata config file (`ingestion/data/configs/`):

```json
{
  "filename": "IS_14543_2016.pdf",
  "standard_number": "IS 14543",
  "part_number": null,
  "revision_year": 2016,
  "full_designation": "IS 14543:2016",
  "title": "Stainless Steel Utensils for Domestic Purposes — Specification (Third Revision)",
  "document_type": "standard",
  "status": "current",
  "superseded_by": null,
  "publication_date": "2016-03-15",
  "effective_date": null,
  "ics_code": "97.040.60",
  "product_categories": ["water_bottles", "utensils", "food_contact_materials", "kitchenware"],
  "industries": ["consumer_goods", "food_processing", "manufacturing"],
  "language": "en",
  "source_url": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/standard_review/Standard_review/Isdetails?ID=MTk4NDk%3D",
  "is_mandatory": true,
  "mandatory_qco": {
    "qco_number": "SO 2655(E)",
    "gazette_date": "2018-07-17",
    "effective_date": "2019-01-17",
    "certification_type": "ISI",
    "issuing_ministry": "DPIIT"
  },
  "scope_summary": "Covers requirements for stainless steel utensils including plates, bowls, glasses, water bottles, tiffin boxes, storage containers. Specifies material composition, dimensional requirements, and marking requirements."
}
```

---

## 5. Document Quality Checklist

Before adding a document to the knowledge base, verify:

- [ ] PDF is readable (not corrupted)
- [ ] Text is extractable (not a pure scan without OCR layer)
- [ ] Standard number and year are identifiable
- [ ] Document structure has clear clause numbering
- [ ] Tables are extractable (not images of tables)
- [ ] Metadata config file is created
- [ ] QCO status is manually verified
- [ ] Document is the latest version (not superseded)

---

## 6. Handling Document Updates

### For Prototype
- Use snapshot approach: ingest once, don't worry about updates
- Document version is recorded in metadata

### For Production (Post-SIH)
- Check BIS portal for amendments periodically
- Re-ingest amended documents
- Mark old versions as `superseded`
- Track amendment chain in database

---

## 7. Representative Coverage Matrix

Ensure the prototype covers queries from multiple perspectives:

| Query Type | Example | Standards Needed |
|---|---|---|
| **Manufacturer — consumer goods** | "Water bottle standards" | IS 14543 |
| **Manufacturer — construction** | "Cement specifications" | IS 269, IS 456 |
| **Manufacturer — safety** | "Helmet requirements" | IS 4151 |
| **Consumer — food** | "Drinking water quality" | IS 10500, IS 14543 |
| **Consumer — safety** | "Pressure cooker safety" | IS 2347 |
| **Consumer — children** | "Toy safety" | IS 9873 |
| **Compliance check** | "Is BIS mandatory for X?" | QCO documents |
| **Hindi query** | Any of the above in Hindi | Same standards |
| **Unanswerable** | "AI software standards" | None (test abstention) |

---

## 8. Avoiding Common Mistakes

| Mistake | Why It Hurts | Prevention |
|---|---|---|
| Ingesting too many documents without quality checks | Poor retrieval, irrelevant results | Quality over quantity |
| Ingesting superseded standards without marking them | Outdated information surfaces | Verify status before ingestion |
| Missing QCO linkage | Cannot determine mandatory/voluntary | Manually research QCO status for each standard |
| Ingesting ISO-adopted standards | May violate copyright | Only ingest indigenous IS standards |
| Treating all annexures as mandatory | Informative annexures aren't binding | Tag normative vs informative |
| Not preserving page numbers | Can't provide page-level citations | Track page numbers during parsing |
| Ignoring table structure | Tables become gibberish | Extract tables as structured data |
