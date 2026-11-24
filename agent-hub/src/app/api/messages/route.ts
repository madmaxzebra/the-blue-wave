import { sql } from "@/lib/db";
import { readJson, text, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = unauthorized(request);
  if (denied) return denied;
  const url = new URL(request.url);
  const project = text(url.searchParams.get("project"), "project");
  const since = Number(url.searchParams.get("since") ?? 0) || 0;
  const rows = project
    ? await sql(
        `select * from (select * from messages where project = $1 and id > $2 order by id desc limit 200) m order by id`,
        [project, since],
      )
    : await sql(`select * from (select * from messages where id > $1 order by id desc limit 200) m order by id`, [
        since,
      ]);
  return Response.json({ messages: rows });
}

export async function POST(request: Request) {
  const denied = unauthorized(request);
  if (denied) return denied;
  const data = await readJson(request);
  const project = text(data.project, "project", "general") || "general";
  const sender = text(data.sender, "sender");
  const body = text(data.body, "body");
  const device = text(data.device, "device", "unknown") || "unknown";
  if (!sender || !body) {
    return Response.json({ error: "sender and body are required." }, { status: 400 });
  }
  const [row] = await sql(
    `insert into messages (project, sender, device, body) values ($1, $2, $3, $4) returning *`,
    [project, sender, device, body],
  );
  return Response.json({ message: row }, { status: 201 });
}
