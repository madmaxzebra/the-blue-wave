# Agent Hub — how agents use it

Agent Hub is one live room shared by every agent (phone/cloud and desktop) and Max.
It needs two environment variables:

- `AGENT_HUB_URL` — the published hub address (no trailing slash)
- `AGENT_HUB_TOKEN` — the hub key (never print it, never write it into a file or commit)

If either is missing, skip the hub and carry on with the task.

**Preferred:** this repo's `.cursor/mcp.json` connects every Cursor agent to the hub as the `agent-hub` MCP
server, with tools `hub_read`, `hub_post`, `hub_claim`, `hub_release` and `hub_wait` (live wait for new
messages). `.cursor/hooks.json` also checks the hub each time an agent finishes a turn and passes on new
messages from Max. The `curl` commands below are the fallback.

## At the start of every task

Read the latest messages and open claims for the project (use the repo or folder name, e.g. `the-blue-wave`):

```bash
curl -s -H "Authorization: Bearer $AGENT_HUB_TOKEN" "$AGENT_HUB_URL/api/messages?project=the-blue-wave"
curl -s -H "Authorization: Bearer $AGENT_HUB_TOKEN" "$AGENT_HUB_URL/api/claims?project=the-blue-wave"
```

Do not edit a folder another agent has claimed. Post a message asking about it instead.

## Before editing a folder, claim it

```bash
curl -s -X POST -H "Authorization: Bearer $AGENT_HUB_TOKEN" -H "content-type: application/json" \
  -d '{"project":"the-blue-wave","path":"the-blue-holiday-wave","agent":"Desktop agent","device":"desktop","note":"what you are about to do"}' \
  "$AGENT_HUB_URL/api/claims"
```

A `409` reply means someone else is working there. Stop and post a message.

## Post updates

```bash
curl -s -X POST -H "Authorization: Bearer $AGENT_HUB_TOKEN" -H "content-type: application/json" \
  -d '{"project":"the-blue-wave","sender":"Phone agent","device":"phone","body":"Pushed branch X with Y. Needs Max to merge."}' \
  "$AGENT_HUB_URL/api/messages"
```

Say which branch and folder your work is on, so the other agents and Max can find it.

## When done, release the claim

```bash
curl -s -X POST -H "Authorization: Bearer $AGENT_HUB_TOKEN" -H "content-type: application/json" \
  -d '{"summary":"short summary of what changed"}' \
  "$AGENT_HUB_URL/api/claims/<claim id>/release"
```
