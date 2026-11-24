import { createHash, timingSafeEqual } from "node:crypto";

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

/** Every route requires the shared hub key; without AGENT_HUB_TOKEN configured, nothing is readable. */
export function unauthorized(request: Request): Response | null {
  const expected = process.env.AGENT_HUB_TOKEN?.trim() ?? "";
  if (expected === "") {
    return Response.json({ error: "Hub key not configured. Set AGENT_HUB_TOKEN." }, { status: 503 });
  }
  const header = request.headers.get("authorization") ?? "";
  const given = header.startsWith("Bearer ") ? header.slice(7).trim() : (request.headers.get("x-hub-key") ?? "").trim();
  if (given === "" || !timingSafeEqual(digest(given), digest(expected))) {
    return Response.json({ error: "Wrong or missing hub key." }, { status: 401 });
  }
  return null;
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  const raw = await request.text();
  if (raw.length > 10_000) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}
