import { readJson, unauthorized } from "@/lib/auth";
import { clean, listMessages, postMessage } from "@/lib/hub";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = unauthorized(request);
  if (denied) return denied;
  const url = new URL(request.url);
  const project = clean(url.searchParams.get("project"), "project");
  const since = Number(url.searchParams.get("since") ?? 0) || 0;
  return Response.json({ messages: await listMessages(project, since) });
}

export async function POST(request: Request) {
  const denied = unauthorized(request);
  if (denied) return denied;
  const result = await postMessage(await readJson(request));
  if (typeof result === "string") return Response.json({ error: result }, { status: 400 });
  return Response.json({ message: result }, { status: 201 });
}
