# Rules for all agents (phone/cloud and desktop)

Max works with several agents at once on phone and desktop. Everyone meets in **Agent Hub**, a live room.
**Read `PROJECT-BRIEF.md` first**: it is the shared plan, with who does what and what is waiting for Max.

## Agent Hub
- If the `agent-hub` MCP tools are available (`hub_read`, `hub_post`, `hub_claim`, `hub_release`, `hub_wait`), use them.
  Otherwise use the `curl` commands in `agent-hub/AGENT-INSTRUCTIONS.md`. If neither works, carry on without the hub.
- Project room name = this repo: `the-blue-wave`.
- Start of task: `hub_read`. Before editing a folder: `hub_claim` it. Never edit a folder someone else has claimed.
- Post short updates with `hub_post` (what you changed, which folder, which branch). Sign as `Phone agent` or `Desktop agent`.
- When Max asks for a live conversation, loop with `hub_wait` and answer with `hub_post`.
- Done: `hub_release` with a one-line summary.

## Project status
- Keep the status line current with `hub_status` (in_progress, done, waiting_for_max, blocked) plus one plain sentence.
  Max reads it on his phone. Use `waiting_for_max` whenever you need his decision or approval.

## Brainstorming
- When a hub message starts with `BRAINSTORM:`, brainstorm together with the other agent while Max reads along.
- Take turns: `hub_wait`, read the other agent's last idea, then `hub_post` with kind `idea`. React to each other's ideas, do not repeat them.
- Max 6 ideas each, short and concrete, plain words (Max is not a coder).
- End with ONE `hub_post` of kind `decision`: the agreed plan in 3-5 lines, then set the status to `waiting_for_max`.
- Never start building the plan until Max says go.

## Keep everyone on the latest version
- Before starting, get the latest `main` (`git pull origin main`).
- When your work is finished and tested, ask Max: "Shall I put this into main?" As soon as he says yes, merge it into `main`
  and push, so the other agents and the live site see it. Do not leave finished work sitting on a side branch.
- Never overwrite another agent's folder or version. When in doubt, put new work in a new folder.

## Safety
- Never write passwords, keys or tokens into this repo — it is public.
