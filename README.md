# SahyogAI

**Multilingual cooperative governance, legal assistance & grievance platform.**
Smart India Hackathon 2026 · Problem Statement 26088 · Ministry of Cooperation (NCCT)

> "SahyogAI turns a rural member's voice into verified cooperative guidance and actionable grievance support — in their own language."

Voice-first assistant for cooperative members, PACS users and farmers in **Hindi, Bengali and English**. Legal answers come from a jurisdiction-filtered knowledge base of official documents with citations. Natural-language complaints become structured grievances with formal letters, tracking IDs and an authority dashboard.

Full product spec: [`docs/PRD.md`](docs/PRD.md)

## Features

| Route | What it does |
| --- | --- |
| `/` | Landing page |
| `/assistant` | Voice or text chat. Claude analyses language, intent and jurisdiction, searches the verified knowledge base (filtered by state and cooperative type), then answers in the user's language with evidence strength (strong / limited / insufficient), cited sources, next steps, text-to-speech and a hand-off to grievances. Mixed Hindi/Bengali/English input works. |
| `/grievance` | Describe a problem by voice or text → AI classification, extracted details and a missing-evidence checklist → editable formal letter in Hindi / Bengali / English → tracking ID (`GRV-2026-XXXXXX`). "Track status" shows authority updates and notes. |
| `/documents` | Photograph or upload a notice, receipt or form. Claude reads it (OCR + explanation in one step) and explains key points, meaning, things to verify and a next step, plus related rules from the knowledge base. Files are not stored. |
| `/finance` | Loan calculator (reducing-balance EMI vs flat interest), fixed-deposit maturity calculator, and fraud-safety tips. |
| `/kiosk` | Full-screen, large-target mode for the Raspberry Pi kiosk. Answers are always spoken. See [`kiosk/`](kiosk/). |
| `/admin` | Password-protected authority dashboard: case queue with search and filters, AI summaries, category correction, duplicate detection, evidence checklist, status updates with notes to the member (full audit trail), category trends, and **knowledge-base management** (upload official PDFs/text with authority, jurisdiction, state, cooperative type and verification date). |

### Safety rules built into the code

- Legal answers are rated **strong** only when a cited source matches the user's confirmed jurisdiction. Answers without a cited source are downgraded to **insufficient**, whatever the model says.
- Knowledge text, uploaded documents and chat history are passed to the model as data, never as instructions.
- Grievances are never described as filed with a government portal. The app records them for the SahyogAI reviewing authority.
- Uploaded documents for explanation are processed in memory and not stored. No voice recordings are stored.
- Grievance IDs are random, so no one can guess another member's ID. The public tracking view shows status and authority notes only, not the member's statement.

## Setup

```bash
npm install
cp .env.example .env.local   # add ANTHROPIC_API_KEY and ADMIN_PASSWORD
npm run dev
```

Open http://localhost:3000. In development the admin password defaults to `admin`.

**Without `ANTHROPIC_API_KEY`** the app still runs in *offline keyword mode*: chat uses canned guidance plus keyword search, and grievances use keyword classification and template letters. Document reading is disabled in this mode.

### Load the knowledge base

Legal answers need official documents. Sign in at `/admin`, open **Knowledge base**, and upload the Acts, Rules and bye-laws that apply. For example:

- Multi-State Cooperative Societies Act, 2002 (as amended) and its Rules. Set jurisdiction to *Multi-State*.
- Your state's Cooperative Societies Act and Rules. Set jurisdiction to *State* and choose the state.
- Model Bye-laws for PACS (Ministry of Cooperation). Set jurisdiction to *Central* and set *Applies to* to *PACS*.

Use PDFs that have a text layer (for example from indiacode.nic.in). Scanned PDFs must go through OCR first.

### Tests

```bash
npm test      # loan/deposit maths, knowledge-base chunking, search-query safety
npm run lint
npm run build
```

## Deploy

```bash
docker build -t sahyog-ai .
docker run -p 3000:3000 -v sahyog-data:/app/data \
  -e ANTHROPIC_API_KEY=... -e ADMIN_PASSWORD=... sahyog-ai
```

Serve it over HTTPS. Browsers only allow microphone access on HTTPS or localhost. Data is stored in one SQLite file (`/app/data/sahyog.db`), using Node's built-in `node:sqlite` with FTS5 search, so keep the volume. Serverless hosts such as Vercel do not persist that file, so use a container host or a VM.

## Architecture

```
Web / PWA · Raspberry Pi kiosk (Chromium --kiosk → /kiosk)
        │  Web Speech API: speech-to-text + text-to-speech in the browser
        ▼
Next.js 16 route handlers
  /api/chat ─ analyse (Claude: language, intent, state, search terms)
            ─ jurisdiction-filtered FTS5 retrieval (SQLite)
            ─ compose (Claude: grounded answer + citations) → evidence rules enforced in code
  /api/grievances ─ classify · draft letter · store · track · authority updates (audit log)
  /api/documents/analyze ─ Claude vision (OCR + explanation) + related-rule lookup
  /api/knowledge ─ PDF/text ingestion → section-aware chunks with metadata
```

Model: `claude-opus-5`, with server-side refusal fallback enabled (`fallbacks: "default"`). Override it with `SAHYOG_MODEL`.

### Known limits / next steps

- SQLite with a single app instance. Move to PostgreSQL + a vector store (the PRD suggests Qdrant) when running several instances.
- Speech runs in the browser. Firefox has no speech recognition, and Bengali text-to-speech needs an installed system voice. Add server-side Whisper-compatible STT/TTS for full kiosk coverage.
- Search is keyword-based (BM25) over English legal text. Claude translates the user's question into search terms first. Add embeddings for better recall.
- There is one shared admin password. Add per-official accounts and role-based access before a real deployment.

## Disclaimer

Informational assistance only. Not legal or financial advice.
