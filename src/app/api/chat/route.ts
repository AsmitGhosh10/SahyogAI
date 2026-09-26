import { z } from "zod";
import { aiEnabled, analyze, compose } from "@/lib/server/ai";
import { fallbackAnswer, NO_SOURCE } from "@/lib/server/fallback";
import { search, type Chunk } from "@/lib/server/kb";
import type { ChatResponse, Source } from "@/lib/shared";

const Body = z.object({
  message: z.string().trim().min(1).max(2000),
  language: z.enum(["hi", "bn", "en"]),
  state: z.string().max(60).default(""),
  cooperative_type: z.string().max(60).default(""),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), text: z.string().max(2000) })).max(12).default([]),
});

const toSource = (c: Chunk): Source => ({
  title: c.doc.title,
  authority: c.doc.authority,
  section: c.section,
  page: c.page,
  jurisdiction: c.doc.jurisdiction === "state" ? `State — ${c.doc.state}` : c.doc.jurisdiction === "central" ? "Central" : "Multi-State",
  applies_to: c.doc.coop_type || "All cooperative types",
  source_url: c.doc.source_url,
  last_verified: c.doc.last_verified,
  excerpt: c.content.slice(0, 420),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });
  const { message, language, history } = parsed.data;
  let { state, cooperative_type: coop } = parsed.data;

  if (aiEnabled()) {
    try {
      const a = await analyze(message, history);
      if (a) {
        state ||= a.state ?? "";
        coop ||= a.cooperative_type ?? "";
        const confirmed = Boolean(state) || /multi/i.test(coop);
        const jurisdiction = confirmed ? [state, coop].filter(Boolean).join(" · ") : "Not confirmed";
        const chunks = search([...a.search_terms, a.topic], state, coop);
        const c = await compose(message, history, a.language, a, chunks, jurisdiction);
        if (c) {
          const cited = chunks.filter((ch) => c.cited_source_ids.includes(ch.chunk_id));
          // Enforce the evidence rules in code, not only in the prompt (PRD §10, §33).
          let evidence = c.evidence;
          if (a.is_legal && cited.length === 0) evidence = "insufficient";
          if (evidence === "strong" && (!confirmed || cited.length === 0)) evidence = "limited";
          const res: ChatResponse = {
            mode: "ai",
            kind: a.is_legal ? "legal" : "general",
            language: a.language,
            intent: a.intent.replace(/_/g, " "),
            topic: a.topic,
            answer: c.answer,
            steps: c.steps,
            evidence,
            sources: cited.map(toSource),
            clarifying_question: c.clarifying_question,
            offer_grievance: c.offer_grievance,
            safety_warning: c.safety_warning,
            jurisdiction,
          };
          return Response.json(res);
        }
      }
    } catch (e) {
      console.error("[chat] AI pipeline failed, using keyword fallback:", e);
    }
  }

  const f = fallbackAnswer(message, language);
  const chunks = f.legal ? search(message.split(/\s+/), state, coop, 3) : [];
  const { legal, ...rest } = f;
  const res: ChatResponse = {
    ...rest,
    kind: legal ? "legal" : "general",
    // Keyword mode cannot verify that a retrieved passage actually answers the question.
    evidence: legal ? (chunks.length ? "limited" : "insufficient") : f.evidence,
    sources: chunks.map(toSource),
    clarifying_question: !legal ? null : !state ? rest.clarifying_question : chunks.length ? null : NO_SOURCE[f.language],
    jurisdiction: state ? [state, coop].filter(Boolean).join(" · ") : "Not confirmed",
  };
  return Response.json(res);
}
