import { aiEnabled, analyzeDocument } from "@/lib/server/ai";
import { search } from "@/lib/server/kb";
import type { DocumentAnalysis, Lang } from "@/lib/shared";

const TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(req: Request) {
  if (!aiEnabled()) return Response.json({ error: "Document reading needs the AI service. Set ANTHROPIC_API_KEY on the server." }, { status: 503 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const lang = (["hi", "bn", "en"].includes(String(form?.get("language"))) ? form!.get("language") : "hi") as Lang;
  if (!(file instanceof File)) return Response.json({ error: "Attach a photo or PDF." }, { status: 400 });
  if (!TYPES.includes(file.type)) return Response.json({ error: "Use a JPG, PNG, WEBP photo or a PDF." }, { status: 415 });
  if (file.size > MAX_BYTES) return Response.json({ error: "File is larger than 10 MB." }, { status: 413 });

  // Privacy (PRD §34): the file is processed in memory and never stored.
  const b64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  try {
    const a = await analyzeDocument(b64, file.type, lang);
    if (!a) return Response.json({ error: "This document could not be analysed." }, { status: 422 });
    const { search_terms, ...rest } = a;
    const sources = search(search_terms, "", "", 3).map((c) => ({
      title: c.doc.title, authority: c.doc.authority, section: c.section, page: c.page,
      jurisdiction: c.doc.jurisdiction === "state" ? `State — ${c.doc.state}` : c.doc.jurisdiction,
      applies_to: c.doc.coop_type || "All cooperative types", source_url: c.doc.source_url,
      last_verified: c.doc.last_verified, excerpt: c.content.slice(0, 420),
    }));
    return Response.json({ mode: "ai", ...rest, sources } satisfies DocumentAnalysis);
  } catch (e) {
    console.error("[documents/analyze]", e);
    return Response.json({ error: "The AI service is unavailable right now. Please try again." }, { status: 502 });
  }
}
