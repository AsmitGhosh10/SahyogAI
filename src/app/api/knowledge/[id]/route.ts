import { isAdmin } from "@/lib/server/auth";
import { deleteDocument } from "@/lib/server/kb";

export async function DELETE(_req: Request, ctx: RouteContext<"/api/knowledge/[id]">) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  deleteDocument(Number((await ctx.params).id));
  return Response.json({ ok: true });
}
