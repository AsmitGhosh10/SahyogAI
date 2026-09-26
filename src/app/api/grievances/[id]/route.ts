import { z } from "zod";
import { isAdmin } from "@/lib/server/auth";
import { getGrievance, toPublic, updateGrievance } from "@/lib/server/grievances";
import { StatusSchema } from "@/lib/server/schemas";
import type { Status } from "@/lib/shared";

export async function GET(_req: Request, ctx: RouteContext<"/api/grievances/[id]">) {
  const { id } = await ctx.params;
  const g = getGrievance(id.trim().toUpperCase());
  if (!g) return Response.json({ error: "Not found" }, { status: 404 });
  // Members tracking by ID get the public view; authorities get the full case.
  return Response.json((await isAdmin()) ? g : toPublic(g));
}

const Patch = z.object({
  status: StatusSchema.optional(),
  note: z.string().trim().max(1000).optional(),
  category: z.string().trim().min(1).max(60).optional(),
  subcategory: z.string().trim().min(1).max(120).optional(),
});

export async function PATCH(req: Request, ctx: RouteContext<"/api/grievances/[id]">) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = Patch.safeParse(await req.json().catch(() => null));
  if (!body.success) return Response.json({ error: "Invalid update" }, { status: 400 });
  const { id } = await ctx.params;
  const g = updateGrievance(id, { ...body.data, status: body.data.status as Status | undefined });
  return g ? Response.json(g) : Response.json({ error: "Not found" }, { status: 404 });
}
