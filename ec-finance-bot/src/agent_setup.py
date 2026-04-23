"""Managed-Agents setup + session runner for ExpatCleaners finance bot.

Creates (or reuses) a single persistent agent + environment, cached by
model + skill_id in `.skill_cache.json`. On each weekly run we open a
session, push the user message, stream events, collect text blocks.

The beta APIs (`managed-agents-2026-04-01`) are evolving — the overall
flow (agent → environment → session → events) is stable, but some
parameter / event names may shift between SDK releases. When that
happens, adjust here rather than in `run_weekly_report.py`.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

MANAGED_AGENTS_BETA = "managed-agents-2026-04-01"
CACHE_FILENAME = ".skill_cache.json"

FINANCE_AGENT_SYSTEM_PROMPT = """You are the Finance agent for ExpatCleaners, a premium English-first cleaning service in Amsterdam.

Current pricing (proven): €44/hr one-off, €36/hr recurring, €40/hr bi-weekly, 2-hour minimum. Capacity: ~30–35 paid hours per cleaner per week, with 30-minute overhead between jobs.

You have been equipped with a custom Finance skill. USE IT. It defines:
  • the mandatory weekly snapshot template (6 sections)
  • the fully loaded cleaner-cost formula (never report gross wage as cost)
  • the required answer structure (number → math → assumptions → implication → recommendation → decision)
  • the red flags to call out

Non-negotiable rules on every report:

1. Never treat gross wage as labour cost. Always use the fully loaded cleaner cost provided in the input (the PRE-COMPUTED SUMMARY block supplies it). If it looks low, flag it as [to-validate].
2. Show the math. A number without its calculation is useless.
3. Label every non-trivial input as [proven], [assumed], or [to-validate].
4. Every report ends with 3–5 numbered DECISIONS REQUIRED — concrete owner actions for this week, each tied to a number in the report.
5. Use the PRE-COMPUTED SUMMARY as the canonical figures. The RAW rows are for sanity-checking, not for recomputing totals.
6. Keep the report under 1500 words. Dense > exhaustive.

Tone: direct, CFO-of-a-premium-brand. No filler. No hedging. Every sentence earns its place.

Output: a single markdown document, headed `# ExpatCleaners — Weekly Finance Snapshot — <week_start> → <week_end>`, with the six sections from the skill template (REVENUE, COSTS, CONTRIBUTION, CASH, KPI TRACKING, DECISIONS REQUIRED) in that order.
"""


def _load_cache(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text())
    except (OSError, json.JSONDecodeError):
        return {}


def _save_cache(path: Path, data: dict[str, Any]) -> None:
    path.write_text(json.dumps(data, indent=2, sort_keys=True))


def ensure_agent_and_environment(
    client: Any,
    project_root: Path,
    model: str,
    skill_id: str,
) -> tuple[str, str]:
    """Return `(agent_id, environment_id)`, creating them on first run.

    Cache invalidates automatically when the model changes or the skill_id
    changes (the skill uploader already drops agent cache when the zip
    content changes, but we re-check here for safety).
    """
    cache_path = project_root / CACHE_FILENAME
    cache = _load_cache(cache_path)

    existing = cache.get("agent") or {}
    if (
        existing.get("model") == model
        and existing.get("skill_id") == skill_id
        and existing.get("agent_id")
        and existing.get("environment_id")
    ):
        return str(existing["agent_id"]), str(existing["environment_id"])

    headers = {"anthropic-beta": MANAGED_AGENTS_BETA}

    agent = client.beta.agents.create(
        name="ExpatCleaners Finance Agent",
        model={"id": model},
        system=FINANCE_AGENT_SYSTEM_PROMPT,
        tools=[{"type": "agent_toolset_20260401"}],
        skills=[
            {
                "type": "custom",
                "skill_id": skill_id,
                "version": "latest",
            }
        ],
        extra_headers=headers,
    )
    agent_id = getattr(agent, "id", None) or (agent.get("id") if isinstance(agent, dict) else None)
    if not agent_id:
        raise RuntimeError(f"Agent create returned no id: {agent!r}")

    environment = client.beta.environments.create(
        name="ec-finance-env",
        config={
            "type": "cloud",
            "networking": {"type": "unrestricted"},
        },
        extra_headers=headers,
    )
    env_id = (
        getattr(environment, "id", None)
        or (environment.get("id") if isinstance(environment, dict) else None)
    )
    if not env_id:
        raise RuntimeError(f"Environment create returned no id: {environment!r}")

    cache["agent"] = {
        "model": model,
        "skill_id": skill_id,
        "agent_id": str(agent_id),
        "environment_id": str(env_id),
    }
    _save_cache(cache_path, cache)
    return str(agent_id), str(env_id)


def _text_from_block(block: Any) -> str | None:
    """Extract `text` from a content block (dict or SDK object)."""
    if isinstance(block, dict):
        return block.get("text") if block.get("type") == "text" else None
    if getattr(block, "type", None) == "text":
        return getattr(block, "text", None)
    return None


def _extract_agent_message_text(event: Any) -> list[str]:
    """Pull every `text` string out of an agent.message event.

    The event may expose `content` directly or nest it under `message`,
    depending on SDK release. Both paths are handled.
    """
    content = getattr(event, "content", None)
    if content is None:
        message = getattr(event, "message", None)
        if message is not None:
            content = getattr(message, "content", None) or (
                message.get("content") if isinstance(message, dict) else None
            )
    if content is None and isinstance(event, dict):
        content = event.get("content") or (
            (event.get("message") or {}).get("content")
            if isinstance(event.get("message"), dict)
            else None
        )

    if content is None:
        return []
    if isinstance(content, str):
        return [content]
    if isinstance(content, list):
        out: list[str] = []
        for block in content:
            t = _text_from_block(block)
            if t:
                out.append(t)
        return out
    return []


def run_session(
    client: Any,
    agent_id: str,
    environment_id: str,
    user_message: str,
) -> str:
    """Create a session, send `user_message`, stream events, return text.

    Collects every text block from `agent.message` events.
    Prints `agent.tool_use` events so cron logs show tool activity.
    Exits when `session.status_idle` is observed.
    """
    headers = {"anthropic-beta": MANAGED_AGENTS_BETA}

    session = client.beta.sessions.create(
        agent_id=agent_id,
        environment_id=environment_id,
        extra_headers=headers,
    )
    session_id = (
        getattr(session, "id", None)
        or (session.get("id") if isinstance(session, dict) else None)
    )
    if not session_id:
        raise RuntimeError(f"Session create returned no id: {session!r}")

    client.beta.sessions.messages.create(
        session_id=session_id,
        role="user",
        content=user_message,
        extra_headers=headers,
    )

    collected: list[str] = []
    stream_ctx = client.beta.sessions.events.stream(
        session_id=session_id,
        extra_headers=headers,
    )
    with stream_ctx as stream:
        for event in stream:
            etype = getattr(event, "type", None) or (
                event.get("type") if isinstance(event, dict) else None
            )
            if etype == "agent.message":
                collected.extend(_extract_agent_message_text(event))
            elif etype == "agent.tool_use":
                name = (
                    getattr(event, "name", None)
                    or getattr(event, "tool_name", None)
                    or (event.get("name") if isinstance(event, dict) else None)
                    or "tool"
                )
                print(f"[tool use] {name}")
            elif etype == "session.status_idle":
                break
            # Any other event types are ignored intentionally — the session
            # stream carries deltas, status pings, etc. that don't affect
            # the final report.

    return "".join(collected)
