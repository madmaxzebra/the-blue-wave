import { sql } from "@/lib/db";
import { readJson, text, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const denied = unauthorized(request);
  if (denied) return denied;
  const id = Number((await context.params).id);
  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ error: "Bad claim id." }, { status: 400 });
  }
  const data = await readJson(request);
  const summary = text(data.summary, "note");
  const [row] = await sql<{ project: string; path: string; agent: string; device: string }>(
    `update claims set released_at = now() where id = $1 and released_at is null returning *`,
    [id],
  );
  if (!row) {
    return Response.json({ error: "Claim not found or already released." }, { status: 404 });
  }
  await sql(`insert into messages (project, sender, device, body) values ($1, $2, $3, $4)`, [
    row.project,
    row.agent,
    row.device,
    `Finished ${row.path}${summary ? ` — ${summary}` : ""}`,
  ]);
  return Response.json({ claim: row });
}
