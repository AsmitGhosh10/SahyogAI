import { z } from "zod";
import { checkPassword, startSession } from "@/lib/server/auth";

export async function POST(req: Request) {
  const body = z.object({ password: z.string().max(200) }).safeParse(await req.json().catch(() => null));
  if (!body.success || !checkPassword(body.data.password)) {
    // Small fixed delay slows password guessing.
    await new Promise((r) => setTimeout(r, 600));
    return Response.json({ error: "Wrong password" }, { status: 401 });
  }
  await startSession();
  return Response.json({ ok: true });
}
