import { unauthorized } from "@/lib/auth";
import {
  claim,
  clean,
  listClaims,
  listMessages,
  listStatuses,
  postMessage,
  release,
  setStatus,
  waitForMessages,
} from "@/lib/hub";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SUPPORTED_VERSIONS = ["2025-06-18", "2025-03-26", "2024-11-05"];

const deviceProp = { type: "string", description: "phone (cloud agent) or desktop" };
const projectProp = { type: "string", description: "Project room, usually the repo name, e.g. the-blue-wave" };

const TOOLS = [
  {
    name: "hub_read",
    description:
      "Read the Agent Hub room for a project: recent messages from Max and other agents, plus who is working on which folder right now. Call this at the start of every task.",
    inputSchema: {
      type: "object",
      properties: { project: projectProp, since: { type: "number", description: "Only messages with id above this" } },
      required: ["project"],
    },
  },
  {
    name: "hub_post",
    description: "Post a message to the project room so Max and the other agents see it within seconds.",
    inputSchema: {
      type: "object",
      properties: {
        project: projectProp,
        sender: { type: "string", description: "Your name, e.g. Phone agent or Desktop agent" },
        device: deviceProp,
        body: { type: "string" },
        kind: {
          type: "string",
          enum: ["agent", "idea", "decision"],
          description: "Use idea for brainstorm suggestions and decision for the final agreed conclusion",
        },
      },
      required: ["project", "sender", "body"],
    },
  },
  {
    name: "hub_status",
    description:
      "Set the project's status line that Max sees on his phone: in_progress, done, waiting_for_max or blocked, plus a one-line summary. Update it when a project moves forward or needs Max.",
    inputSchema: {
      type: "object",
      properties: {
        project: projectProp,
        status: { type: "string", enum: ["in_progress", "done", "waiting_for_max", "blocked"] },
        summary: { type: "string", description: "One short line in plain words" },
        updated_by: { type: "string", description: "Your name" },
        device: deviceProp,
      },
      required: ["project", "status", "updated_by"],
    },
  },
  {
    name: "hub_claim",
    description:
      "Claim a folder or file before editing it, so no other agent overwrites it. Fails if someone else holds it; then do not edit it and post a message instead.",
    inputSchema: {
      type: "object",
      properties: {
        project: projectProp,
        path: { type: "string", description: "Folder or file you will edit" },
        agent: { type: "string", description: "Your name" },
        device: deviceProp,
        note: { type: "string", description: "What you are about to do" },
      },
      required: ["project", "path", "agent"],
    },
  },
  {
    name: "hub_release",
    description: "Release your claim when you are done, with a one-line summary and the branch your work is on.",
    inputSchema: {
      type: "object",
      properties: { claim_id: { type: "number" }, summary: { type: "string" } },
      required: ["claim_id"],
    },
  },
  {
    name: "hub_wait",
    description:
      "Wait up to 25 seconds for new messages in the project room and return them as soon as one arrives. Use it to have a live back-and-forth with Max or another agent.",
    inputSchema: {
      type: "object",
      properties: {
        project: projectProp,
        since: { type: "number", description: "Last message id you have seen" },
        seconds: { type: "number", description: "Max seconds to wait (1-25)" },
      },
      required: ["project", "since"],
    },
  },
];

type RpcRequest = { jsonrpc?: string; id?: string | number | null; method?: string; params?: Record<string, unknown> };

function result(id: RpcRequest["id"], value: unknown) {
  return { jsonrpc: "2.0", id: id ?? null, result: value };
}

function rpcError(id: RpcRequest["id"], code: number, message: string) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}

function toolText(value: unknown, isError = false) {
  return { content: [{ type: "text", text: JSON.stringify(value, null, 2) }], isError };
}

async function callTool(name: string, args: Record<string, unknown>) {
  const project = clean(args.project, "project");
  const since = Number(args.since ?? 0) || 0;
  switch (name) {
    case "hub_read":
      return toolText({
        status: (await listStatuses(project))[0] ?? null,
        messages: await listMessages(project, since),
        working_on_now: await listClaims(project),
      });
    case "hub_post": {
      const row = await postMessage({ ...args, kind: args.kind === "idea" || args.kind === "decision" ? args.kind : "agent" });
      return typeof row === "string" ? toolText({ error: row }, true) : toolText({ posted: row });
    }
    case "hub_status": {
      const row = await setStatus(args);
      return typeof row === "string" ? toolText({ error: row }, true) : toolText({ status: row });
    }
    case "hub_claim": {
      const r = await claim(args);
      return r.ok ? toolText({ claimed: r.claim }) : toolText({ error: r.error, held_by: r.claim }, true);
    }
    case "hub_release": {
      const row = await release(Number(args.claim_id), clean(args.summary, "note"));
      return row ? toolText({ released: row }) : toolText({ error: "Claim not found or already released." }, true);
    }
    case "hub_wait":
      return toolText({ messages: await waitForMessages(project, since, Number(args.seconds ?? 20) || 20) });
    default:
      return null;
  }
}

async function handle(msg: RpcRequest) {
  const id = msg.id;
  switch (msg.method) {
    case "initialize": {
      const asked = String(msg.params?.protocolVersion ?? "");
      return result(id, {
        protocolVersion: SUPPORTED_VERSIONS.includes(asked) ? asked : SUPPORTED_VERSIONS[0],
        capabilities: { tools: {} },
        serverInfo: { name: "agent-hub", version: "1.0.0" },
        instructions:
          "Agent Hub is Max's live room shared by all his phone and desktop agents. Read it at the start of a task, claim folders before editing, post updates, release when done.",
      });
    }
    case "ping":
      return result(id, {});
    case "tools/list":
      return result(id, { tools: TOOLS });
    case "tools/call": {
      const name = String(msg.params?.name ?? "");
      const args = (msg.params?.arguments ?? {}) as Record<string, unknown>;
      const out = await callTool(name, args && typeof args === "object" ? args : {});
      return out ? result(id, out) : rpcError(id, -32602, `Unknown tool: ${name}`);
    }
    default:
      return rpcError(id, -32601, `Method not found: ${msg.method}`);
  }
}

export async function POST(request: Request) {
  const denied = unauthorized(request);
  if (denied) return denied;
  const raw = await request.text();
  if (raw.length > 20_000) return Response.json(rpcError(null, -32600, "Request too large"), { status: 413 });
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return Response.json(rpcError(null, -32700, "Parse error"), { status: 400 });
  }
  const batch = Array.isArray(parsed) ? (parsed as RpcRequest[]).slice(0, 20) : [parsed as RpcRequest];
  const replies = [];
  for (const msg of batch) {
    if (!msg || typeof msg !== "object" || msg.id === undefined) continue;
    replies.push(await handle(msg));
  }
  if (replies.length === 0) return new Response(null, { status: 202 });
  return Response.json(Array.isArray(parsed) ? replies : replies[0]);
}

export async function GET() {
  return new Response("Method Not Allowed", { status: 405, headers: { allow: "POST" } });
}

export async function DELETE() {
  return new Response(null, { status: 405 });
}
