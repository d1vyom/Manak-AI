# Agent Tool Usage Rules

## MCP Usage

Use available MCP tools proactively when they are relevant.

### GitHub
Use GitHub MCP to:
- inspect repository structure
- inspect branches/issues/PRs
- review existing implementation
- avoid duplicating functionality

Always inspect existing code before creating replacement files.

### Supabase
Use Supabase MCP for:
- inspecting database schema
- PostgreSQL queries
- pgvector configuration
- migrations
- debugging database errors
- checking logs

Never modify production data/schema without explicit approval.

### Vercel
Use Vercel MCP for:
- deployment status
- build logs
- runtime logs
- deployment debugging
- environment/deployment configuration

### Playwright
Use Playwright for:
- testing UI flows
- testing forms
- testing chat
- testing citations
- testing Hindi/English switching
- verifying responsive behavior

After implementing a major UI feature, test it with Playwright.

### Context7
Use Context7 when:
- library/API behavior is uncertain
- current documentation is needed
- implementing Next.js, Prisma, Supabase, Gemini or other rapidly changing APIs

Prefer official/current documentation over assumptions.

### Google Stitch
Use Google Stitch MCP for:
- generating high-fidelity UI screens and layouts
- establishing and applying cohesive enterprise/government design systems
- prototyping complex UI components (chat interface, split citation drawer, compliance pathway, standards explorer)
- translating generated design specifications into production Next.js Tailwind components

## General Rule

Do not use an MCP simply because it exists.

Use the appropriate MCP when it materially improves accuracy or allows you to verify the result.

Before destructive operations:
1. Inspect.
2. Explain what will change.
3. Ask for approval if the operation can cause data loss or affect production.