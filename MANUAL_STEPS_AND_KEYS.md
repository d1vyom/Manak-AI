# Manak AI — Manual Steps & API Keys Guide

This document tracks all external API keys, service credentials, and manual steps needed for **Manak AI**.

---

## 1. Required API Keys & Services

| Service | Variable Name | Purpose | How to Obtain | Status |
|---|---|---|---|---|
| **Google Gemini API** | `GEMINI_API_KEY` | LLM generation (`gemini-2.5-flash`), query understanding (`gemini-2.5-flash-lite`), and embeddings (`gemini-embedding-2`) | Added by user to `.env` | ✅ Configured |
| **Supabase URL** | `SUPABASE_URL` | Supabase project endpoint (`manak-ai`) | Auto-provisioned via Supabase MCP | ✅ Live (`ap-south-1`) |
| **Supabase Anon Key** | `SUPABASE_ANON_KEY` | Public client API key | Auto-provisioned via Supabase MCP | ✅ Configured |
| **Database URL** | `DATABASE_URL` | Transaction pooled Postgres URL (port 6543) | Auto-provisioned via Supabase MCP | ✅ Database active |
| **Direct DB URL** | `DIRECT_URL` | Direct Postgres connection (port 5432) for Prisma migrations | Auto-provisioned via Supabase MCP | ✅ Database active |

---

## 2. Where to Store Your Keys

Create a file named `.env.local` in the project root (`d:\Projects\Manak-AI\.env.local`):

```env
# Google Gemini API
GEMINI_API_KEY=AIzaSy...

# Supabase Configuration
SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
DATABASE_URL=postgresql://postgres.xxxxxxxx:yourpassword@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxxxxxxx:yourpassword@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
```

> [!NOTE]
> `.env.local` is listed in `.gitignore` and will never be committed to Git.
> During local development or if keys are not yet provided, Manak AI incorporates an **offline in-memory fallback** with pre-seeded BIS data so the entire application, RAG pipeline mock, and UI can be built, run, and tested without crashing!

---

## 3. Manual Steps Checklist for User

### Step 1: Create Supabase Project (If not already created)
1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Select your organization (`d1vyom's Org`).
3. Click **New Project**:
   - **Name**: `manak-ai`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: `ap-south-1` (Asia South - Mumbai)
   - **Pricing Plan**: Free
4. Once provisioned (approx 2 minutes):
   - Go to **Database > Extensions** and ensure `vector` (pgvector) is enabled.
   - Go to **Settings > Database** and copy the Connection String URI (both Connection Pooling URI and Direct URI).
   - Go to **Settings > API** and copy `Project URL` and `anon public` key.

### Step 2: Obtain Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com).
2. Click **Get API key** > **Create API key**.
3. Copy the key and add it as `GEMINI_API_KEY` in `.env.local`.

### Step 3: Deployment to Vercel (For Phase 10)
1. Go to [https://vercel.com](https://vercel.com).
2. Import the GitHub repository `d1vyom/Manak-AI`.
3. Add the environment variables from `.env.local` to Vercel Project Settings.
4. Deploy!
