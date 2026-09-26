import { aiEnabled } from "@/lib/server/ai";
import { getDb } from "@/lib/server/db";

export function GET() {
  const { n } = getDb().prepare("SELECT COUNT(*) AS n FROM kb_documents").get() as { n: number };
  return Response.json({ ok: true, ai: aiEnabled(), knowledge_documents: n });
}
