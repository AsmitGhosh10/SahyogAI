# SahyogAI

**Multilingual cooperative governance, legal assistance & grievance platform.**
Smart India Hackathon 2026 · Problem Statement 26088 · Ministry of Cooperation (NCCT)

> "SahyogAI turns a rural member's voice into verified cooperative guidance and actionable grievance support — in their own language."

Voice-first assistant for cooperative members, PACS users and farmers, in **Hindi, Bengali and English**. Answers are grounded in verified government/cooperative sources with jurisdiction awareness, and natural-language complaints become structured, trackable grievances with an authority dashboard.

Full product spec: [`docs/PRD.md`](docs/PRD.md)

## What's in this repo

Frontend prototype (Next.js 16, TypeScript, Tailwind CSS v4):

| Route | What it shows |
| --- | --- |
| `/` | Landing page: product story, modules, source-grounded pipeline, evidence levels, grievance lifecycle, Raspberry Pi kiosk, roadmap |
| `/assistant` | Voice + text assistant. Language switch (हिंदी / বাংলা / English), state and cooperative-type selection, progress states, evidence strength, source card, text-to-speech, "create grievance" hand-off |
| `/grievance` | Conversational intake: AI classification → minimal follow-up questions → evidence checklist → formal letter in 3 languages → tracking ID. Also "Track status" by ID |
| `/admin` | Authority dashboard: case counts, category trends, queue with filters, AI summary, evidence checklist, duplicate detection, status updates with notes |

### Prototype limits (by design)

- Answers come from a small keyword-based demo engine in [`src/lib/demo.ts`](src/lib/demo.ts), not the real RAG backend. Replace `answer()` with a call to `POST /api/chat` once the FastAPI service exists.
- Voice uses the browser's Web Speech API (works best in Chrome/Edge). The planned backend uses Whisper-compatible STT and multilingual TTS.
- Grievances are stored in the browser's `localStorage` only. **Nothing is sent to any government or cooperative system.**
- Legal source cards say "Demo data". No section numbers are invented.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # production build
npm run lint
```

## Planned architecture

```
Web/PWA · Raspberry Pi kiosk
        │
   STT ─┴─ Language detection → AI orchestrator
                                   ├─ Governance AI
                                   ├─ Legal RAG (jurisdiction filter → retrieval → rerank → evidence check)
                                   └─ Grievance AI → case DB → authority portal
        Response engine (explanation + sources + next steps) → TTS
```

Backend stack (planned): FastAPI, PostgreSQL, Redis, Qdrant, LLM + embeddings, OCR for Hindi/Bengali/English, Docker.

## Disclaimer

Informational assistance only. Not legal or financial advice.
