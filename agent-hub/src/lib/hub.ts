import { sql } from "@/lib/db";

export type Message = {
  id: number;
  project: string;
  sender: string;
  device: string;
  kind: string;
  body: string;
  created_at: string;
};

export type Claim = {
  id: number;
  project: string;
  path: string;
  agent: string;
  device: string;
  note: string;
  created_at: string;
  released_at: string | null;
};

const LIMITS = { project: 80, sender: 80, device: 40, path: 300, note: 500, body: 4000 } as const;

export function clean(value: unknown, field: keyof typeof LIMITS, fallback = ""): string {
  const s = typeof value === "string" ? value.trim() : fallback;
  return s.slice(0, LIMITS[field]);
}

export async function listMessages(project: string, since: number): Promise<Message[]> {
  return project
    ? sql<Message>(
        `select * from (select * from messages where project = $1 and id > $2 order by id desc limit 200) m order by id`,
        [project, since],
      )
    : sql<Message>(`select * from (select * from messages where id > $1 order by id desc limit 200) m order by id`, [
        since,
      ]);
}

export async function postMessage(input: Record<string, unknown>): Promise<Message | string> {
  const project = clean(input.project, "project", "general") || "general";
  const sender = clean(input.sender, "sender");
  const body = clean(input.body, "body");
  const device = clean(input.device, "device", "unknown") || "unknown";
  const kind = input.kind === "human" ? "human" : "agent";
  if (!sender || !body) return "sender and body are required.";
  const [row] = await sql<Message>(
    `insert into messages (project, sender, device, kind, body) values ($1, $2, $3, $4, $5) returning *`,
    [project, sender, device, kind, body],
  );
  return row;
}

export async function listClaims(project: string): Promise<Claim[]> {
  return project
    ? sql<Claim>(`select * from claims where released_at is null and project = $1 order by id limit 200`, [project])
    : sql<Claim>(`select * from claims where released_at is null order by id limit 200`);
}

export async function claim(
  input: Record<string, unknown>,
): Promise<{ ok: true; claim: Claim } | { ok: false; status: number; error: string; claim?: Claim }> {
  const project = clean(input.project, "project", "general") || "general";
  const path = clean(input.path, "path");
  const agent = clean(input.agent, "sender");
  const device = clean(input.device, "device", "unknown") || "unknown";
  const note = clean(input.note, "note");
  if (!path || !agent) return { ok: false, status: 400, error: "path and agent are required." };
  const [taken] = await sql<Claim>(
    `select * from claims where released_at is null and project = $1 and path = $2 limit 1`,
    [project, path],
  );
  if (taken) return { ok: false, status: 409, error: "Someone is already working on this.", claim: taken };
  const [row] = await sql<Claim>(
    `insert into claims (project, path, agent, device, note) values ($1, $2, $3, $4, $5) returning *`,
    [project, path, agent, device, note],
  );
  await sql(`insert into messages (project, sender, device, body) values ($1, $2, $3, $4)`, [
    project,
    agent,
    device,
    `Started working on ${path}${note ? ` — ${note}` : ""}`,
  ]);
  return { ok: true, claim: row };
}

export async function release(id: number, summary: string): Promise<Claim | null> {
  if (!Number.isInteger(id) || id <= 0) return null;
  const [row] = await sql<Claim>(
    `update claims set released_at = now() where id = $1 and released_at is null returning *`,
    [id],
  );
  if (!row) return null;
  await sql(`insert into messages (project, sender, device, body) values ($1, $2, $3, $4)`, [
    row.project,
    row.agent,
    row.device,
    `Finished ${row.path}${summary ? ` — ${summary}` : ""}`,
  ]);
  return row;
}

/** Long-poll: returns as soon as a newer message exists, or empty after `seconds`. */
export async function waitForMessages(project: string, since: number, seconds: number): Promise<Message[]> {
  const deadline = Date.now() + Math.min(Math.max(seconds, 1), 25) * 1000;
  for (;;) {
    const rows = await listMessages(project, since);
    if (rows.length || Date.now() >= deadline) return rows;
    await new Promise((r) => setTimeout(r, 1500));
  }
}
