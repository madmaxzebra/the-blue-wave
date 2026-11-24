import { readJson, unauthorized } from "@/lib/auth";
import { claim, clean, listClaims } from "@/lib/hub";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = unauthorized(request);
  if (denied) return denied;
  const project = clean(new URL(request.url).searchParams.get("project"), "project");
  return Response.json({ claims: await listClaims(project) });
}

export async function POST(request: Request) {
  const denied = unauthorized(request);
  if (denied) return denied;
  const result = await claim(await readJson(request));
  if (!result.ok) return Response.json({ error: result.error, claim: result.claim }, { status: result.status });
  return Response.json({ claim: result.claim }, { status: 201 });
}
