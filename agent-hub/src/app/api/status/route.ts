import { readJson, unauthorized } from "@/lib/auth";
import { clean, listStatuses, setStatus } from "@/lib/hub";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = unauthorized(request);
  if (denied) return denied;
  const project = clean(new URL(request.url).searchParams.get("project"), "project");
  return Response.json({ statuses: await listStatuses(project) });
}

export async function POST(request: Request) {
  const denied = unauthorized(request);
  if (denied) return denied;
  const result = await setStatus(await readJson(request));
  if (typeof result === "string") return Response.json({ error: result }, { status: 400 });
  return Response.json({ status: result });
}
