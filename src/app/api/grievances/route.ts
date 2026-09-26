import { z } from "zod";
import { isAdmin } from "@/lib/server/auth";
import { createGrievance, listGrievances } from "@/lib/server/grievances";
import { GrievanceFields } from "@/lib/server/schemas";

const Body = GrievanceFields.extend({
  summary: z.string().trim().max(600).default(""),
  priority: z.enum(["normal", "high"]).default("normal"),
  letter: z.string().trim().min(20).max(8000),
});

export async function POST(req: Request) {
  const body = Body.safeParse(await req.json().catch(() => null));
  if (!body.success) return Response.json({ error: "Missing details", issues: body.error.flatten().fieldErrors }, { status: 400 });
  const g = body.data;
  const id = createGrievance({ ...g, summary: g.summary || g.description.slice(0, 280) });
  return Response.json({ id, status: "Submitted" }, { status: 201 });
}

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json(listGrievances());
}
