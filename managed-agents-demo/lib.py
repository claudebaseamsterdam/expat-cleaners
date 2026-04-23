"""Shared runner for Managed-Agents demo scripts.

Each agent lives in `agents/<agent_id>/main.py` and is just a tiny wrapper
that imports `run_agent` from here and calls it with its own IDs. This way
adding an agent never modifies an existing agent's file.

Usage (from a wrapper):

    from lib import run_agent
    sys.exit(run_agent("agent_XXX", "env_YYY"))
"""

from __future__ import annotations

import os
import sys
from typing import Any, Iterable

from dotenv import load_dotenv
from anthropic import Anthropic

BETA_HEADERS = {"anthropic-beta": "managed-agents-2026-04-01"}


def _get_attr(obj: Any, name: str) -> Any:
    """Read `name` from either an SDK object attribute or a dict key."""
    if obj is None:
        return None
    if isinstance(obj, dict):
        return obj.get(name)
    return getattr(obj, name, None)


def _iter_text_blocks(event: Any) -> Iterable[str]:
    """Yield every `text` string from an agent.message event.

    Handles both shapes: content directly on the event, or nested under
    `message`. Block elements may be dicts or SDK objects.
    """
    content = _get_attr(event, "content")
    if content is None:
        content = _get_attr(_get_attr(event, "message"), "content")

    if isinstance(content, str):
        if content:
            yield content
        return
    if not isinstance(content, list):
        return

    for block in content:
        if _get_attr(block, "type") == "text":
            text = _get_attr(block, "text")
            if text:
                yield text


def _read_user_message(argv: list[str]) -> str | None:
    """Pull the user's message from CLI args, then fall back to stdin."""
    text = " ".join(argv[1:]).strip()
    if text:
        return text
    try:
        text = input("You: ").strip()
    except (EOFError, KeyboardInterrupt):
        print("\nAborted.", file=sys.stderr)
        return None
    return text or None


def run_agent(
    agent_id: str,
    environment_id: str,
    *,
    name: str | None = None,
) -> int:
    """Open a session with `agent_id`+`environment_id`, send a single user
    message, and stream the agent's reply to stdout.

    `name` is an optional human label printed in the session log so it's
    obvious which agent just ran.

    Returns an exit code (see README for the mapping).
    """
    load_dotenv()
    api_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
    if not api_key:
        print(
            "ANTHROPIC_API_KEY not set.\n"
            "  cp .env.example .env   and paste your key.",
            file=sys.stderr,
        )
        return 1

    user_text = _read_user_message(sys.argv)
    if not user_text:
        print("Empty message — nothing to send.", file=sys.stderr)
        return 1

    client = Anthropic(api_key=api_key)

    try:
        session = client.beta.sessions.create(
            agent_id=agent_id,
            environment_id=environment_id,
            extra_headers=BETA_HEADERS,
        )
    except Exception as e:  # noqa: BLE001
        print(f"[error] session create failed: {e}", file=sys.stderr)
        return 2

    session_id = _get_attr(session, "id")
    if not session_id:
        print(f"[error] session returned no id: {session!r}", file=sys.stderr)
        return 2

    label = f"{name} · {agent_id}" if name else agent_id
    print(f"[session] {session_id}  ({label})", file=sys.stderr)

    exit_code = 0
    try:
        with client.beta.sessions.events.stream(
            session_id=session_id,
            extra_headers=BETA_HEADERS,
        ) as stream:
            client.beta.sessions.events.send(
                session_id=session_id,
                type="user.message",
                content=[{"type": "text", "text": user_text}],
                extra_headers=BETA_HEADERS,
            )

            for event in stream:
                etype = _get_attr(event, "type")
                if etype == "agent.message":
                    for chunk in _iter_text_blocks(event):
                        print(chunk, end="", flush=True)
                elif etype == "agent.tool_use":
                    tool_name = (
                        _get_attr(event, "name")
                        or _get_attr(event, "tool_name")
                        or "tool"
                    )
                    print(f"\n[tool use] {tool_name}", file=sys.stderr, flush=True)
                elif etype == "session.status_idle":
                    print()  # trailing newline
                    break
                elif etype and (etype == "session.error" or etype.startswith("error.")):
                    err = (
                        _get_attr(event, "message")
                        or _get_attr(event, "error")
                        or str(event)
                    )
                    print(f"\n[error] {err}", file=sys.stderr)
                    exit_code = 3
                    break
                # Other event types (deltas, pings, tool_result, etc.) are
                # ignored — they don't affect the printed reply.
    except KeyboardInterrupt:
        print("\n[interrupted]", file=sys.stderr)
        exit_code = 130
    except Exception as e:  # noqa: BLE001
        print(f"\n[error] stream failed: {e}", file=sys.stderr)
        exit_code = 4

    return exit_code
