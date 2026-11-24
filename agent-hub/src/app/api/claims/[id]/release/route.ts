import { readJson, unauthorized } from "@/lib/auth";
import { clean, release } from "@/lib/hub";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const denied = unauthorized(request);
  if (denied) return denied;
  const id = Number((await context.params).id);
  const summary = clean((await readJson(request)).summary, "note");
  const row = await release(id, summary);
  if (!row) return Response.json({ error: "Claim not found or already released." }, { status: 404 });
  return Response.json({ claim: row });
}
