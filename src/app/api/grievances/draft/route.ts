import { aiEnabled, draftLetter } from "@/lib/server/ai";
import { templateLetter } from "@/lib/server/letter";
import { GrievanceFields } from "@/lib/server/schemas";

export async function POST(req: Request) {
  const body = GrievanceFields.safeParse(await req.json().catch(() => null));
  if (!body.success) return Response.json({ error: "Missing details", issues: body.error.flatten().fieldErrors }, { status: 400 });
  const { language, ...facts } = body.data;
  if (aiEnabled()) {
    try {
      const letter = await draftLetter(facts, language);
      if (letter) return Response.json({ mode: "ai", letter });
    } catch (e) {
      console.error("[grievance/draft] AI failed, using template:", e);
    }
  }
  return Response.json({ mode: "demo", letter: templateLetter(facts, language) });
}
