# Manak AI — Frontend Architecture

> UI design, component structure, page layouts, and design system

---

## 1. Design Philosophy

| Principle | Implementation |
|---|---|
| **Government/Enterprise aesthetic** | Navy blue primary, saffron accents, professional typography |
| **Not a ChatGPT clone** | Split-panel layout with citations, compliance pathway, and evidence indicators |
| **Information density** | Show metadata, confidence, citations alongside the answer |
| **Accessibility** | shadcn/ui provides accessible components out of the box |
| **Responsive** | Desktop-first (SIH demo is typically on laptop), mobile-compatible |

---

## 2. Color System

```css
/* Tailwind CSS custom colors */
:root {
  --primary: 222 47% 20%;       /* Deep navy blue (#1B2A4A) */
  --primary-foreground: 0 0% 98%;
  --accent: 24 95% 53%;         /* Saffron/BIS orange (#F28C28) */
  --accent-foreground: 0 0% 98%;
  --secondary: 210 40% 96%;     /* Light blue-gray */
  --muted: 210 40% 96%;
  --destructive: 0 84% 60%;     /* Red for errors */
  --success: 142 76% 36%;       /* Green for HIGH confidence */
  --warning: 38 92% 50%;        /* Amber for MEDIUM confidence */
}
```

**Rationale**: Navy blue + saffron mirrors the Indian government visual language (similar to government portals). Feels authoritative and professional.

---

## 3. Page Structure

### Pages

| Route | Page | Purpose |
|---|---|---|
| `/` | Landing Page | Product introduction, features, CTA |
| `/chat` | AI Chat Interface | Main interaction page |
| `/explore` | Standards Explorer | Browse/search indexed standards |
| `/compliance` | Compliance Gap Analysis | Input form + gap analysis results |

---

## 4. Component Hierarchy

```
app/
├── layout.tsx
│   ├── Header
│   │   ├── Logo + "Manak AI"
│   │   ├── Navigation (Chat, Explore, Compliance)
│   │   └── LanguageToggle (Hindi/English)
│   └── Footer (Disclaimer)
│
├── page.tsx (Landing)
│   ├── HeroSection
│   ├── FeatureCards (4 cards)
│   ├── ExampleQueries (clickable)
│   └── CTAButton → /chat
│
├── chat/page.tsx
│   └── ChatLayout (split panel)
│       ├── ChatPanel (left, 60%)
│       │   ├── ChatMessages
│       │   │   ├── UserMessage
│       │   │   └── AssistantMessage
│       │   │       ├── MarkdownRenderer
│       │   │       ├── InlineCitationBadge [1] [2]
│       │   │       ├── ConfidenceBadge (HIGH/MEDIUM/LOW)
│       │   │       ├── MandatoryBadge (Mandatory/Voluntary)
│       │   │       └── CompliancePathway (collapsible)
│       │   │           └── ComplianceStep (× N)
│       │   ├── ExampleQueries (shown when empty)
│       │   └── ChatInput
│       │       ├── TextArea
│       │       └── SendButton
│       │
│       └── CitationPanel (right, 40%)
│           ├── PanelHeader ("Sources & Citations")
│           ├── CitationCard (× N)
│           │   ├── Standard number badge
│           │   ├── Clause + Page
│           │   ├── Content preview
│           │   ├── Source URL link
│           │   └── MandatoryBadge
│           └── RelatedStandards
│
├── explore/page.tsx
│   ├── SearchBar
│   ├── FilterBar (type, mandatory, industry)
│   └── StandardsTable
│       └── StandardRow → StandardDetailModal
│
└── compliance/page.tsx
    ├── GapAnalysisForm
    │   ├── ProductInput
    │   ├── MaterialInput
    │   ├── CurrentTestsChecklist
    │   ├── CurrentCertificationsInput
    │   └── SubmitButton
    └── GapAnalysisResults
        ├── SummaryCards (Satisfied/Not/Unknown)
        ├── RequirementsTable
        │   └── RequirementRow (status badge + recommendation)
        ├── CriticalGaps
        ├── NextSteps
        └── Disclaimer
```

---

## 5. Key Component Specifications

### 5.1 ChatMessage (Assistant)

```
┌─────────────────────────────────────────────────┐
│ 🤖 Manak AI                    ⬤ HIGH Confidence │
│                                                   │
│ Based on IS 14543:2016 [1], stainless steel       │
│ water bottles must comply with the following       │
│ requirements:                                      │
│                                                   │
│ **Material Requirements** [1]                      │
│ The stainless steel must be of grade AISI 304      │
│ or equivalent, with chromium content ≥ 18% ...     │
│                                                   │
│ **Testing Requirements** [2]                       │
│ Overall migration test as per IS 9845 [2]...       │
│                                                   │
│ ┌───────────────────────────────────────────────┐ │
│ │ 🏛️ MANDATORY — QCO SO 2655(E)               │ │
│ │ BIS certification (ISI Mark) is required      │ │
│ └───────────────────────────────────────────────┘ │
│                                                   │
│ ▼ Compliance Pathway (click to expand)            │
│ ┌───────────────────────────────────────────────┐ │
│ │ ① Identify Standards                          │ │
│ │ ② Verify Mandatory Status ✓                   │ │
│ │ ③ Meet Material Requirements                  │ │
│ │ ④ Complete Required Testing                   │ │
│ │ ⑤ Apply for ISI Mark                          │ │
│ └───────────────────────────────────────────────┘ │
│                                                   │
│ ⚠️ Disclaimer: For informational purposes only.   │
└─────────────────────────────────────────────────┘
```

### 5.2 CitationBadge (Inline)

Small superscript badge inside the answer text:
```
[1] — Clickable, highlights corresponding citation in side panel
```

Colors:
- Blue border: standard citation
- Green background: mandatory
- Gray background: voluntary

### 5.3 ConfidenceBadge

```
⬤ HIGH    → Green badge, solid
⬤ MEDIUM  → Amber badge, outline
⬤ LOW     → Red badge, outline
```

With tooltip showing the confidence explanation.

### 5.4 MandatoryBadge

```
🟢 MANDATORY   → Green, with QCO reference
🔵 VOLUNTARY   → Blue
🟡 CONDITIONAL → Amber, with effective date
⚪ INSUFFICIENT → Gray, with explanation
```

### 5.5 CitationCard (Side Panel)

```
┌──────────────────────────────────────┐
│ [1]  IS 14543:2016                   │
│                                      │
│ 📄 Stainless Steel Utensils for      │
│    Domestic Purposes                  │
│                                      │
│ 📌 Clause: 4.2 — Chemical Req.      │
│ 📄 Page: 12                          │
│                                      │
│ "Chromium content shall not be       │
│  less than 18 percent..."            │
│                                      │
│ 🔗 View Source  │  🟢 Mandatory      │
└──────────────────────────────────────┘
```

### 5.6 CompliancePathway (Stepper)

Vertical timeline/stepper with:
- Step number in a circle
- Title
- Description
- Status badge (mandatory/voluntary/recommended)
- Expandable details
- Citation references

### 5.7 LoadingState

```
┌─────────────────────────────────────────┐
│                                         │
│   🔍 Searching BIS knowledge base...   │
│   ━━━━━━━━━━━━━━━━━━━━░░░░░░░          │
│                                         │
│   Steps:                                │
│   ✓ Understanding your query            │
│   ✓ Extracting key entities             │
│   → Searching relevant standards...     │
│   ○ Analyzing evidence                  │
│   ○ Generating response                 │
│                                         │
└─────────────────────────────────────────┘
```

### 5.8 ExampleQueries

```
┌──────────────────────────────────────────────────┐
│  Try asking:                                      │
│                                                    │
│  🏭 "Which BIS standards apply to stainless       │
│     steel water bottles?"                          │
│                                                    │
│  🛡️ "Is BIS certification mandatory for toys?"    │
│                                                    │
│  🏗️ "What are the cement quality requirements     │
│     under IS 269?"                                 │
│                                                    │
│  🇮🇳 "पीने के पानी के लिए BIS मानक क्या है?"      │
│                                                    │
└──────────────────────────────────────────────────┘
```

---

## 6. Landing Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Header: [Logo] Manak AI          [Chat] [Explore]  [🇮🇳/EN]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│               🇮🇳 Manak AI                                 │
│                                                             │
│     AI-Powered BIS Standards &                              │
│     Compliance Intelligence Platform                        │
│                                                             │
│     Instantly find which Indian Standards, certifications,  │
│     and regulatory requirements apply to your product.      │
│                                                             │
│              [ Try Manak AI → ]                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ 📋       │  │ ✅       │  │ 📊       │  │ 🌐       │   │
│  │ Standard │  │ Mandatory│  │ Compliance│  │ Hindi +  │   │
│  │ Retrieval│  │ vs Vol.  │  │ Pathway  │  │ English  │   │
│  │          │  │ Detection│  │ Generator│  │ Support  │   │
│  │ Find     │  │ Know if  │  │ Step-by  │  │ Ask in   │   │
│  │ standards│  │ BIS cert │  │ -step    │  │ Hindi or │   │
│  │ for any  │  │ is needed│  │ guide    │  │ English  │   │
│  │ product  │  │          │  │          │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Example Queries:                                           │
│  [Clickable query cards that navigate to /chat]             │
├─────────────────────────────────────────────────────────────┤
│  Footer: Built for SIH 2026 | Disclaimer | Team Name       │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Chat Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Header                                                      │
├────────────────────────────┬────────────────────────────────┤
│                            │                                 │
│     Chat Panel (60%)       │     Citation Panel (40%)        │
│                            │                                 │
│  ┌──────────────────────┐  │  ┌───────────────────────────┐ │
│  │ [Example Queries]    │  │  │ Sources & Citations       │ │
│  │ or                   │  │  │                           │ │
│  │ [User Message]       │  │  │ [CitationCard 1]         │ │
│  │ [Assistant Message   │  │  │ [CitationCard 2]         │ │
│  │  with inline [1][2]  │  │  │ [CitationCard 3]         │ │
│  │  badges]             │  │  │                           │ │
│  │                      │  │  │ Related Standards:        │ │
│  │                      │  │  │ - IS 9845:2019           │ │
│  │                      │  │  │ - IS 7790:1975           │ │
│  └──────────────────────┘  │  └───────────────────────────┘ │
│                            │                                 │
│  ┌──────────────────────┐  │                                 │
│  │ [Text Input]   [Send]│  │                                 │
│  └──────────────────────┘  │                                 │
├────────────────────────────┴────────────────────────────────┤
│  Disclaimer bar                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Mobile Responsive Behavior

On mobile/tablet:
- Citation panel collapses to a bottom sheet or tab
- Chat takes full width
- Navigation becomes hamburger menu
- Example queries become horizontal scroll
- Landing page stacks vertically

---

## 9. shadcn/ui Components to Install

```bash
npx shadcn@latest add button card input textarea badge
npx shadcn@latest add sheet dialog tabs accordion
npx shadcn@latest add select separator skeleton
npx shadcn@latest add tooltip scroll-area
```

| Component | Use |
|---|---|
| `Button` | Send, CTA, navigation |
| `Card` | Citation cards, feature cards, standard cards |
| `Input` / `Textarea` | Chat input, search, form fields |
| `Badge` | Confidence, mandatory status, citation number |
| `Sheet` | Mobile citation panel |
| `Dialog` | Standard detail modal |
| `Tabs` | Gap analysis sections |
| `Accordion` | Compliance pathway steps, expandable details |
| `Select` | Language toggle, filters |
| `Skeleton` | Loading states |
| `Tooltip` | Confidence explanation, citation preview |
| `ScrollArea` | Chat message area, citation panel |

---

## 10. State Management

Use **Zustand** for minimal client state:

```typescript
interface AppState {
  // Language
  language: "en" | "hi";
  setLanguage: (lang: "en" | "hi") => void;

  // Chat
  messages: Message[];
  addMessage: (msg: Message) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Citations
  activeCitations: Citation[];
  setActiveCitations: (citations: Citation[]) => void;
  highlightedCitation: string | null;
  setHighlightedCitation: (refId: string | null) => void;
}
```

**Why Zustand**: Lighter than Redux, no boilerplate, works with React Server Components, sufficient for prototype.
