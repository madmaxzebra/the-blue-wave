import { sql } from "@/lib/db";
import { readJson, text, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = unauthorized(request);
  if (denied) return denied;
  const project = text(new URL(request.url).searchParams.get("project"), "project");
  const rows = project
    ? await sql(`select * from claims where released_at is null and project = $1 order by id limit 200`, [project])
    : await sql(`select * from claims where released_at is null order by id limit 200`);
  return Response.json({ claims: rows });
}

export async function POST(request: Request) {
  const denied = unauthorized(request);
  if (denied) return denied;
  const data = await readJson(request);
  const project = text(data.project, "project", "general") || "general";
  const path = text(data.path, "path");
  const agent = text(data.agent, "sender");
  const device = text(data.device, "device", "unknown") || "unknown";
  const note = text(data.note, "note");
  if (!path || !agent) {
    return Response.json({ error: "path and agent are required." }, { status: 400 });
  }
  const [taken] = await sql(
    `select * from claims where released_at is null and project = $1 and path = $2 limit 1`,
    [project, path],
  );
  if (taken) {
    return Response.json({ error: "Someone is already working on this.", claim: taken }, { status: 409 });
  }
  const [row] = await sql(
    `insert into claims (project, path, agent, device, note) values ($1, $2, $3, $4, $5) returning *`,
    [project, path, agent, device, note],
  );
  await sql(`insert into messages (project, sender, device, body) values ($1, $2, $3, $4)`, [
    project,
    agent,
    device,
    `Started working on ${path}${note ? ` — ${note}` : ""}`,
  ]);
  return Response.json({ claim: row }, { status: 201 });
}
