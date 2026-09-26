import { z } from "zod";
import { aiEnabled, classifyGrievance } from "@/lib/server/ai";
import { fallbackClassify } from "@/lib/server/fallback";
import type { GrievanceAnalysis } from "@/lib/shared";

const Body = z.object({ description: z.string().trim().min(8).max(4000), language: z.enum(["hi", "bn", "en"]) });

export async function POST(req: Request) {
  const body = Body.safeParse(await req.json().catch(() => null));
  if (!body.success) return Response.json({ error: "Please describe the problem in a few words." }, { status: 400 });
  if (aiEnabled()) {
    try {
      const r = await classifyGrievance(body.data.description, body.data.language);
      if (r) return Response.json({ mode: "ai", ...r, priority: r.priority } satisfies GrievanceAnalysis);
    } catch (e) {
      console.error("[grievance/analyze] AI failed, using keyword fallback:", e);
    }
  }
  return Response.json(fallbackClassify(body.data.description));
}
