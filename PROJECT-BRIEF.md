# Project brief: how Max, the phone agent and the desktop agent work together

Written on 24 Nov 2026 from the chat between Max and the phone (cloud) agent.
**Every agent reads this file at the start of a task.** Max is not a coder: keep every message short and in plain words.

## 1. The goal
Max, his phone (cloud) agent and his desktop agent talk in one live room, like a WhatsApp group,
with a delay of 2-3 seconds. Max follows how every project proceeds from his phone, reads the agents
brainstorming, and gives them instructions from anywhere.

## 2. The three of us
| Who | Where it runs | Good at | Limit |
|---|---|---|---|
| **Max** | Phone and desktop | Decides what we build | Not a coder. Reads in plain words |
| **Phone agent** (cloud) | Cursor's servers, reached at cursor.com/agents | Works while Max is away, builds and tests in the cloud | Only sees the project through GitHub. Cannot reach Max's PC |
| **Desktop agent** | Max's PC | Works on Max's real files and tools | Only reacts while the PC is on and Cursor is open with an agent running |

Agents cannot wake each other up. They meet in **Agent Hub** and check it when they start and finish a step.

## 3. What already exists (in `main`)
- **Agent Hub** (`agent-hub/` folder): a live room per project with chat, a project status board
  (In progress / Done / Waiting for Max / Blocked), "Working on now" folder claims, and a Brainstorm button.
- **Agent plug-in** (`.cursor/mcp.json`): gives every Cursor agent the tools `hub_read`, `hub_post`, `hub_status`,
  `hub_claim`, `hub_release`, `hub_wait`.
- **Doorbell** (`.cursor/hooks.json`): each time an agent finishes a step it checks the hub and picks up new messages from Max.
- **Rules** in `AGENTS.md`: claim before editing, never overwrite another agent's folder, brainstorm rules, ask Max before merging into `main`.
- **Desktop setup**: `agent-hub/CONNECT-DESKTOP-AGENT.bat` and `agent-hub/DESKTOP-AGENT-MESSAGE.txt`.

## 4. What is NOT done yet (blocked on Max)
1. Max confirms **Publish** of `agent-hub` in Cursor (public, accepts terms) and adds the secret `AGENT_HUB_TOKEN`.
2. Max adds `AGENT_HUB_URL` and `AGENT_HUB_TOKEN` as secrets for cloud agents (Cursor Dashboard > Cloud Agents > Secrets).
3. Max runs `agent-hub/CONNECT-DESKTOP-AGENT.bat` on his PC and restarts Cursor.
Until then the hub is not reachable and nobody can use it. Carry on without it.

## 5. Who does what next
**Desktop agent**
1. `git pull origin main`, then read `AGENTS.md`, this file and `agent-hub/AGENT-INSTRUCTIONS.md`.
2. When the hub is online: say hello with `hub_post` (project `the-blue-wave`, sign as "Desktop agent").
3. Check that the `.bat` file and the doorbell hook work on Windows. Fix problems in a new branch and tell the hub.
4. Report on the hub which folders on Max's PC hold the newest version of each project.

**Phone agent**
1. Keep Agent Hub healthy and fix what the desktop agent reports.
2. Seed the status board for each project once the hub is online.
3. Run the first brainstorm together with the desktop agent (see 6).

**Both**: claim a folder before editing, post short updates, set the project status, release when done.

## 6. First brainstorm (once the hub is online)
Max starts it with the Brainstorm button. Topic: **"What should Agent Hub get next, and in what order?"**
Starting ideas: phone alerts (Telegram or push), a "morning summary" of all projects, a button to hand a task from one agent to the other.

## 7. Decisions waiting for Max
- Phone alerts: Telegram group, or push notifications on the Agent Hub page?
- Hub key: make Max type it in a secure form (safer), or let the first person who opens the hub set it (easier, small risk)?
- The pending update for `blue-holiday-wave` in Cursor: dismiss it if it would replace the desktop version of the app.
- Publish the cloud copy `the-blue-holiday-wave-cloud`? It is a separate app with the real Curacao partners.
- Upload a fresh build of the holiday app to Bluehost (`/holidayseason/`)? Needs a new build with `BLUEHOST_BUILD=1`.

## 8. House rules
- **Never overwrite another agent's folder.** Put new work in a new folder.
  `the-blue-holiday-wave` = the desktop agent's version. `the-blue-holiday-wave-cloud` = the phone agent's version.
- Work on a side branch. When finished and tested, ask Max "Shall I put this into main?" and merge when he says yes.
  Work that is only on a side branch is not live.
- Never put passwords, keys or tokens in the repo: it is public.
- Mark yourself in the hub as "Waiting for Max" when you need a decision, and say what you need in one sentence.
