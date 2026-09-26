import { z } from "zod";
import { extractText, getDocumentProxy } from "unpdf";
import { isAdmin } from "@/lib/server/auth";
import { addDocument, listDocuments } from "@/lib/server/kb";

const MAX_BYTES = 25 * 1024 * 1024;

const Meta = z.object({
  title: z.string().trim().min(3).max(200),
  authority: z.string().trim().min(2).max(200),
  source_url: z.union([z.literal(""), z.url({ protocol: /^https?$/ })]).default(""),
  jurisdiction: z.enum(["central", "state", "multi-state"]),
  state: z.string().trim().max(60).default(""),
  coop_type: z.string().trim().max(60).default(""),
  doc_type: z.string().trim().min(2).max(60),
  language: z.enum(["en", "hi", "bn"]).default("en"),
  effective_date: z.string().trim().max(20).default(""),
  last_verified: z.string().trim().min(8).max(20),
}).refine((m) => m.jurisdiction !== "state" || m.state, { message: "State documents need a state", path: ["state"] });

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json(listDocuments());
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData().catch(() => null);
  if (!form) return Response.json({ error: "Invalid form" }, { status: 400 });
  const meta = Meta.safeParse(Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === "string")));
  if (!meta.success) return Response.json({ error: meta.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }, { status: 400 });

  const file = form.get("file");
  let pages: string[];
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_BYTES) return Response.json({ error: "File is larger than 25 MB." }, { status: 413 });
    const buf = new Uint8Array(await file.arrayBuffer());
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      try {
        pages = (await extractText(await getDocumentProxy(buf), { mergePages: false })).text;
      } catch {
        return Response.json({ error: "Could not read this PDF." }, { status: 422 });
      }
    } else {
      pages = [new TextDecoder().decode(buf)];
    }
  } else {
    const text = String(form.get("text") ?? "");
    if (text.trim().length < 50) return Response.json({ error: "Attach a PDF/TXT file or paste the document text." }, { status: 400 });
    pages = [text];
  }
  try {
    return Response.json(addDocument(meta.data, pages), { status: 201 });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 422 });
  }
}
