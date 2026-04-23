# Managed Agents — minimal clients

Collection of minimal runners for Anthropic Managed Agents. Each agent lives in its own folder under `agents/` and has its own `main.py`. The shared streaming logic lives in `lib.py`, so adding an agent never touches an existing agent's file.

Beta header: `managed-agents-2026-04-01`.

## Agents

| # | Name | Folder | Agent ID |
|---|---|---|---|
| 1 | Ads & Growth | `agents/01-ads-growth/` | `agent_011CaLyk3aqxUDnXSf5GfzV6` |
| 2 | Admin & Finance | `agents/02-admin-finance/` | `agent_011CaLzNKM8pw8QKEPot2Mua` |
| 3 | Legal | `agents/03-legal-structure/` | `agent_011CaM2QRQYWkvNKz71h33vP` |
| 4 | WhatsApp Closing | `agents/04-support-sales/` | `agent_011CaM2RvY2XuhGyNbcyWgbb` |
| 5 | Operational Manager | `agents/05-ops-cleaners/` | `agent_011CaM2T84MVqxqckHqt9Va9` |

All agents currently share `ENVIRONMENT_ID = env_01UHsXjHhTNyvxgzRG7QEMm7`. Each agent file has its own constant so you can swap it per-agent without touching the others.

## Structure

```
managed-agents-demo/
├── README.md
├── requirements.txt
├── .env.example
├── .gitignore
├── lib.py                           ← shared run_agent(agent_id, env_id, name=...)
└── agents/
    ├── 01-ads-growth/
    │   └── main.py
    ├── 02-admin-finance/
    │   └── main.py
    ├── 03-legal-structure/
    │   └── main.py
    ├── 04-support-sales/
    │   └── main.py
    └── 05-ops-cleaners/
        └── main.py
```

Each `agents/<slug>/main.py` is ~17 lines: name + IDs + one call into `lib.run_agent`. **No agent overrides another.** Uploading a new agent = a new folder.

## Setup (once)

```bash
cd managed-agents-demo
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env         # paste your ANTHROPIC_API_KEY
```

## Run an agent

```bash
python agents/01-ads-growth/main.py "which channels are underperforming?"
python agents/02-admin-finance/main.py "give me last week's snapshot"
```

Omit the argument and it prompts interactively.

## What the runner does

1. `client.beta.sessions.create(agent_id, environment_id)` — opens a session
2. `client.beta.sessions.events.stream(session_id)` — subscribes to the event stream
3. `client.beta.sessions.events.send(session_id, type="user.message", content=[...])` — pushes the user message
4. Iterates events:
   - `agent.message` → prints text blocks to stdout as they stream
   - `agent.tool_use` → `[tool use] <name>` to stderr
   - `session.status_idle` → clean exit
   - `session.error` / `error.*` → logs to stderr, exit 3

## Add a new agent

Name it, pick a slug with a number prefix for ordering, then:

```bash
SLUG=03-ops-scheduling
NAME="Ops & Scheduling"
ID=agent_01XXXXXXXXXXXXXXXXXX

mkdir -p agents/$SLUG
cat > agents/$SLUG/main.py <<PY
"""Agent 3 — $NAME."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from lib import run_agent  # noqa: E402

NAME = "$NAME"
AGENT_ID = "$ID"
ENVIRONMENT_ID = "env_01UHsXjHhTNyvxgzRG7QEMm7"

if __name__ == "__main__":
    sys.exit(run_agent(AGENT_ID, ENVIRONMENT_ID, name=NAME))
PY
```

Then add a row to the Agents table in this README.

## Exit codes

| code | meaning |
|---|---|
| 0 | success |
| 1 | missing API key or empty user message |
| 2 | session create failed |
| 3 | session returned an error event |
| 4 | stream raised an exception |
| 130 | Ctrl-C |
