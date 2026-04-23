"""Weekly finance report entrypoint — intended to be run by cron.

Pipeline:
  1. Load .env
  2. Validate API key
  3. Read week.csv + spend.csv
  4. Pre-compute summary
  5. Ensure skill uploaded (cached by zip mtime)
  6. Ensure Managed Agent + environment (cached by model + skill_id)
  7. Open a session, send the data, stream the response
  8. Save markdown report to data/output/YYYY-MM-DD-finance-snapshot.md
  9. Deliver via Telegram / Slack / email (best-effort)

Exit codes:
  0 = success
  1 = user config / data problem (missing key, missing csv, empty csv)
  2 = agent returned no text
"""

from __future__ import annotations

import os
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv  # noqa: E402
from anthropic import Anthropic  # noqa: E402

from data_loader import (  # noqa: E402
    read_bookings,
    read_spend,
    summarize_week,
    format_data_for_agent,
)
from skill_upload import ensure_skill_uploaded  # noqa: E402
from agent_setup import ensure_agent_and_environment, run_session  # noqa: E402
from notify import deliver  # noqa: E402


def _resolve_zip_path(project_root: Path, raw: str) -> Path:
    """Resolve SKILL_ZIP_PATH against the project root, supporting './x' form."""
    cleaned = raw.strip()
    p = Path(cleaned)
    if p.is_absolute():
        return p
    return (project_root / p).resolve()


def _build_user_prompt(data_block: str, summary: dict, loaded_cost: float) -> str:
    """Compose the user message sent into the session."""
    week_range = (
        f"{summary.get('week_start', '?')} → {summary.get('week_end', '?')}"
        if summary.get("week_start")
        else "this past week"
    )
    return f"""Produce this week's ExpatCleaners finance snapshot.

Week: {week_range}

Use the skill. All six sections are required (REVENUE, COSTS, CONTRIBUTION, CASH, KPI TRACKING, DECISIONS REQUIRED). End with 3–5 numbered DECISIONS REQUIRED.

Pricing reminder (proven): €44/hr one-off, €40/hr bi-weekly, €36/hr recurring weekly, 2-hour minimum.

Assumptions statement — use these tags on every non-trivial input:
  • loaded cleaner cost €{loaded_cost:.2f}/hr → [to-validate] unless the user confirms
  • revenue, bookings, hours, spend rows → [proven] (they come from the source data)
  • week-over-week comparisons if no prior data in this prompt → [assumed]
  • any forward projection beyond the current week → [assumed]

If the PRE-COMPUTED SUMMARY and the RAW rows disagree, trust the summary and note the discrepancy.

Keep the report under 1500 words. Dense beats exhaustive. Markdown only — no code fences around the whole document.

--- DATA ---

{data_block}
"""


def main() -> int:
    project_root = Path(__file__).resolve().parent.parent
    load_dotenv(project_root / ".env")

    api_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
    if not api_key:
        print(
            "ANTHROPIC_API_KEY is not set.\n"
            "  1. cp .env.example .env\n"
            "  2. open .env and paste your key from https://console.anthropic.com\n"
            "Note: a Claude Max/Pro chat plan does not include API credits — "
            "you need API billing enabled separately.",
            file=sys.stderr,
        )
        return 1

    model = os.getenv("AGENT_MODEL", "claude-opus-4-7").strip() or "claude-opus-4-7"
    zip_path = _resolve_zip_path(
        project_root,
        os.getenv("SKILL_ZIP_PATH", "./expatcleaners-finance.zip"),
    )

    bookings_path = project_root / "data" / "input" / "week.csv"
    spend_path = project_root / "data" / "input" / "spend.csv"
    output_dir = project_root / "data" / "output"
    output_dir.mkdir(parents=True, exist_ok=True)

    try:
        bookings = read_bookings(bookings_path)
    except FileNotFoundError as e:
        print(str(e), file=sys.stderr)
        return 1

    if not bookings:
        print(
            f"No bookings found in {bookings_path}.\n"
            "Add at least one row below the header, then re-run.",
            file=sys.stderr,
        )
        return 1

    spend = read_spend(spend_path)

    try:
        loaded_cost = float(os.getenv("LOADED_COST_PER_HOUR", "30.00"))
    except ValueError:
        print("LOADED_COST_PER_HOUR must be a number (e.g. 30.00).", file=sys.stderr)
        return 1

    try:
        fixed_costs = float(os.getenv("FIXED_COSTS_MONTHLY", "2500.00"))
    except ValueError:
        print("FIXED_COSTS_MONTHLY must be a number (e.g. 2500.00).", file=sys.stderr)
        return 1

    summary = summarize_week(bookings, spend, loaded_cost, fixed_costs)
    data_block = format_data_for_agent(bookings, spend, summary)

    client = Anthropic(api_key=api_key)

    print(f"[1/4] Ensuring skill uploaded from {zip_path.name} …")
    skill_id = ensure_skill_uploaded(
        project_root=project_root,
        zip_path=zip_path,
        display_title="ExpatCleaners Finance",
        api_key=api_key,
    )
    print(f"       skill_id = {skill_id}")

    print(f"[2/4] Ensuring agent + environment (model={model}) …")
    agent_id, env_id = ensure_agent_and_environment(
        client=client,
        project_root=project_root,
        model=model,
        skill_id=skill_id,
    )
    print(f"       agent_id={agent_id}  env_id={env_id}")

    print("[3/4] Running session …")
    user_prompt = _build_user_prompt(data_block, summary, loaded_cost)
    report = run_session(
        client=client,
        agent_id=agent_id,
        environment_id=env_id,
        user_message=user_prompt,
    )
    if not report.strip():
        print(
            "Agent returned no text.\n"
            "Common causes: beta headers rejected, skill upload failed silently, "
            "or the model produced tool calls but no final message.",
            file=sys.stderr,
        )
        return 2

    date_tag = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    report_path = output_dir / f"{date_tag}-finance-snapshot.md"
    report_path.write_text(report, encoding="utf-8")
    print(f"[4/4] Saved report → {report_path}")

    subject = f"ExpatCleaners Finance — {date_tag}"
    deliver(report, subject)
    return 0


if __name__ == "__main__":
    sys.exit(main())
