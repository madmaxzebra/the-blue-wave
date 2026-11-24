// Cursor "stop" hook: when an agent finishes a turn, check Agent Hub for new
// messages from Max in this project and hand them to the agent as a follow-up.
// Silent no-op when AGENT_HUB_URL / AGENT_HUB_TOKEN are not set or the hub is unreachable.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_LOOPS = 3;
const FIRST_LOOK_MINUTES = 15;
const STATE_FILE = join(dirname(fileURLToPath(import.meta.url)), ".hub-state.json");

function done(output = {}) {
  process.stdout.write(JSON.stringify(output));
  process.exit(0);
}

function readStdin() {
  try {
    return JSON.parse(readFileSync(0, "utf8") || "{}");
  } catch {
    return {};
  }
}

function projectName(root) {
  if (process.env.AGENT_HUB_PROJECT) return process.env.AGENT_HUB_PROJECT;
  try {
    const remote = execFileSync("git", ["config", "--get", "remote.origin.url"], { cwd: root, encoding: "utf8" }).trim();
    if (remote) return basename(remote).replace(/\.git$/, "");
  } catch {}
  return basename(root);
}

function loadState() {
  try {
    return JSON.parse(readFileSync(STATE_FILE, "utf8"));
  } catch {
    return {};
  }
}

const input = readStdin();
const url = (process.env.AGENT_HUB_URL ?? "").replace(/\/+$/, "");
const token = process.env.AGENT_HUB_TOKEN ?? "";
if (!url || !token) done();
if (input.status && input.status !== "completed") done();
if (Number(input.loop_count ?? 0) >= MAX_LOOPS) done();

const root = (input.workspace_roots ?? [])[0] ?? process.cwd();
const project = projectName(root);
const conversation = String(input.conversation_id ?? "default");
const state = loadState();
const since = Number(state[conversation] ?? 0);

let messages = [];
try {
  const res = await fetch(`${url}/api/messages?project=${encodeURIComponent(project)}&since=${since}`, {
    headers: { authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) done();
  messages = (await res.json()).messages ?? [];
} catch {
  done();
}

if (messages.length) state[conversation] = messages[messages.length - 1].id;
try {
  writeFileSync(STATE_FILE, JSON.stringify(state));
} catch {}

const cutoff = since ? 0 : Date.now() - FIRST_LOOK_MINUTES * 60_000;
const fromMax = messages.filter((m) => m.kind === "human" && new Date(m.created_at).getTime() >= cutoff);
if (fromMax.length === 0) done();

const lines = fromMax.map((m) => `- ${m.sender} (${m.device}): ${m.body}`).join("\n");
done({
  followup_message: `New message(s) for you in Agent Hub (project "${project}"):\n${lines}\n\nHandle them now if they are about your task, then reply in the hub with hub_post.`,
});
