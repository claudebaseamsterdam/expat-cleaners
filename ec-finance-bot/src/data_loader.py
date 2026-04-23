"""CSV loaders and weekly summary computation for the ExpatCleaners finance bot.

Three public helpers:
  - read_bookings(path)         → list[dict]
  - read_spend(path)            → dict
  - summarize_week(...)         → dict of pre-computed metrics
  - format_data_for_agent(...)  → str ready to hand to the Managed Agent
"""

from __future__ import annotations

import csv
from pathlib import Path
from typing import Any

WEEKS_PER_MONTH = 4.33
NUMERIC_BOOKING_FIELDS = (
    "hours_billed",
    "revenue_eur",
    "cleaner_hours_paid",
    "addons_eur",
)
NUMERIC_SPEND_FIELDS = ("ad_spend_eur", "other_costs_eur")


def _to_float(value: Any, default: float = 0.0) -> float:
    """Coerce a CSV cell to float, tolerating empty strings and whitespace."""
    if value is None:
        return default
    s = str(value).strip()
    if not s:
        return default
    try:
        return float(s)
    except ValueError:
        return default


def read_bookings(path: Path) -> list[dict]:
    """Read the week's booking CSV.

    Expected header:
      date,booking_type,hours_billed,revenue_eur,cleaner_hours_paid,
      addons_eur,cleaner_id,postcode

    Numeric fields are coerced to float. Missing file raises FileNotFoundError
    with a message pointing the user at the template.
    """
    if not path.exists():
        raise FileNotFoundError(
            f"Bookings file not found at {path}.\n"
            f"Copy the template first:\n"
            f"  cp {path.parent / 'week-template.csv'} {path}\n"
            f"then fill in real rows."
        )

    rows: list[dict] = []
    with path.open("r", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            cleaned: dict[str, Any] = {k: (v.strip() if isinstance(v, str) else v) for k, v in row.items()}
            for field in NUMERIC_BOOKING_FIELDS:
                cleaned[field] = _to_float(cleaned.get(field))
            rows.append(cleaned)
    return rows


def read_spend(path: Path) -> dict:
    """Read the spend CSV and return aggregated totals.

    Expected header:
      date,ad_spend_eur,other_costs_eur,notes

    If the file is missing this is **not fatal**; zeros are returned so the
    weekly report can still run on a bookings-only dataset.
    """
    totals: dict[str, Any] = {
        "ad_spend_eur": 0.0,
        "other_costs_eur": 0.0,
        "rows": [],
    }
    if not path.exists():
        return totals

    with path.open("r", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            ad = _to_float(row.get("ad_spend_eur"))
            other = _to_float(row.get("other_costs_eur"))
            totals["ad_spend_eur"] += ad
            totals["other_costs_eur"] += other
            totals["rows"].append(
                {
                    "date": (row.get("date") or "").strip(),
                    "ad_spend_eur": ad,
                    "other_costs_eur": other,
                    "notes": (row.get("notes") or "").strip(),
                }
            )
    return totals


def summarize_week(
    bookings: list[dict],
    spend: dict,
    loaded_cost_per_hour: float,
    fixed_costs_monthly: float,
) -> dict:
    """Compute every pre-computed metric the agent will see in its prompt.

    The agent is *also* handed the raw rows, but pre-computing lets us
    enforce the definitions (contribution uses loaded cost, etc.) rather
    than trust the model to get them right.
    """
    bookings_count = len(bookings)
    recurring_count = sum(1 for b in bookings if str(b.get("booking_type", "")).lower() == "recurring")
    oneoff_count = sum(1 for b in bookings if str(b.get("booking_type", "")).lower() == "oneoff")

    hours_billed = sum(float(b.get("hours_billed", 0.0)) for b in bookings)
    hours_paid = sum(float(b.get("cleaner_hours_paid", 0.0)) for b in bookings)
    revenue = sum(float(b.get("revenue_eur", 0.0)) for b in bookings)
    addons = sum(float(b.get("addons_eur", 0.0)) for b in bookings)
    bookings_with_addons = sum(1 for b in bookings if float(b.get("addons_eur", 0.0)) > 0)

    ad_spend = float(spend.get("ad_spend_eur", 0.0))
    other_costs = float(spend.get("other_costs_eur", 0.0))

    cleaner_cost = hours_paid * float(loaded_cost_per_hour)
    weekly_fixed = float(fixed_costs_monthly) / WEEKS_PER_MONTH

    gross_contribution = revenue - cleaner_cost
    contribution_per_billed_hour = (
        gross_contribution / hours_billed if hours_billed > 0 else 0.0
    )
    contribution_margin_pct = (
        (gross_contribution / revenue * 100.0) if revenue > 0 else 0.0
    )
    net_contribution = gross_contribution - ad_spend - weekly_fixed - other_costs

    utilization_pct = (hours_billed / hours_paid * 100.0) if hours_paid > 0 else 0.0
    recurring_pct = (recurring_count / bookings_count * 100.0) if bookings_count else 0.0
    addon_attach_rate_pct = (
        (bookings_with_addons / bookings_count * 100.0) if bookings_count else 0.0
    )
    abv = (revenue / bookings_count) if bookings_count else 0.0

    if contribution_per_billed_hour > 0:
        breakeven_hours_weekly = weekly_fixed / contribution_per_billed_hour
    else:
        breakeven_hours_weekly = float("inf")

    dates = [str(b.get("date") or "").strip() for b in bookings if b.get("date")]
    dates = sorted(d for d in dates if d)
    week_start = dates[0] if dates else ""
    week_end = dates[-1] if dates else ""

    cleaners = sorted({str(b.get("cleaner_id") or "").strip() for b in bookings if b.get("cleaner_id")})

    return {
        "week_start": week_start,
        "week_end": week_end,
        "bookings_count": bookings_count,
        "recurring_count": recurring_count,
        "oneoff_count": oneoff_count,
        "hours_billed": round(hours_billed, 2),
        "hours_paid": round(hours_paid, 2),
        "revenue_eur": round(revenue, 2),
        "addons_eur": round(addons, 2),
        "ad_spend_eur": round(ad_spend, 2),
        "other_costs_eur": round(other_costs, 2),
        "cleaner_cost_eur": round(cleaner_cost, 2),
        "weekly_fixed_allocation_eur": round(weekly_fixed, 2),
        "gross_contribution_eur": round(gross_contribution, 2),
        "net_contribution_after_ads_and_fixed_eur": round(net_contribution, 2),
        "contribution_per_billed_hour_eur": round(contribution_per_billed_hour, 2),
        "contribution_margin_pct": round(contribution_margin_pct, 1),
        "utilization_pct": round(utilization_pct, 1),
        "recurring_pct": round(recurring_pct, 1),
        "addon_attach_rate_pct": round(addon_attach_rate_pct, 1),
        "abv_eur": round(abv, 2),
        "breakeven_hours_needed_weekly": (
            round(breakeven_hours_weekly, 2)
            if breakeven_hours_weekly != float("inf")
            else None
        ),
        "loaded_cost_per_hour_eur": round(float(loaded_cost_per_hour), 2),
        "fixed_costs_monthly_eur": round(float(fixed_costs_monthly), 2),
        "cleaners_active": cleaners,
    }


def format_data_for_agent(
    bookings: list[dict],
    spend: dict,
    summary: dict,
) -> str:
    """Format the week's data for the agent prompt.

    Three sections:
      PRE-COMPUTED SUMMARY — the canonical metrics (already correct)
      RAW BOOKINGS — row-by-row, in case the agent wants to cut differently
      SPEND — raw spend entries

    We send both so the agent can cite the summary AND verify against raw
    rows if anything looks off.
    """
    lines: list[str] = []

    lines.append("=== PRE-COMPUTED SUMMARY ===")
    breakeven = summary.get("breakeven_hours_needed_weekly")
    be_display = f"{breakeven:.2f}" if isinstance(breakeven, (int, float)) else "n/a (contribution/hr ≤ 0)"
    lines.append(f"Week: {summary.get('week_start', '?')} → {summary.get('week_end', '?')}")
    lines.append(f"Bookings: {summary['bookings_count']} "
                 f"(recurring {summary['recurring_count']}, one-off {summary['oneoff_count']})")
    lines.append(f"Cleaners active: {', '.join(summary['cleaners_active']) or 'n/a'}")
    lines.append("")
    lines.append(f"Hours billed: {summary['hours_billed']}")
    lines.append(f"Hours paid to cleaners: {summary['hours_paid']}")
    lines.append(f"Utilisation: {summary['utilization_pct']}%")
    lines.append("")
    lines.append(f"Revenue: €{summary['revenue_eur']}")
    lines.append(f"  Add-on revenue (included): €{summary['addons_eur']}")
    lines.append(f"  ABV (avg booking value): €{summary['abv_eur']}")
    lines.append(f"  Recurring share: {summary['recurring_pct']}%")
    lines.append(f"  Add-on attach rate: {summary['addon_attach_rate_pct']}%")
    lines.append("")
    lines.append(f"Loaded cost per hour (input): €{summary['loaded_cost_per_hour_eur']}")
    lines.append(f"Fully loaded cleaner cost: €{summary['cleaner_cost_eur']}")
    lines.append(f"Ad spend: €{summary['ad_spend_eur']}")
    lines.append(f"Other variable costs: €{summary['other_costs_eur']}")
    lines.append(f"Fixed-cost allocation (weekly, monthly/{WEEKS_PER_MONTH}): "
                 f"€{summary['weekly_fixed_allocation_eur']} "
                 f"(monthly fixed €{summary['fixed_costs_monthly_eur']})")
    lines.append("")
    lines.append(f"Gross contribution (revenue − cleaner cost): €{summary['gross_contribution_eur']}")
    lines.append(f"Contribution margin %: {summary['contribution_margin_pct']}%")
    lines.append(f"Contribution per billed hour: €{summary['contribution_per_billed_hour_eur']}")
    lines.append(f"Net contribution (gross − ads − fixed − other): "
                 f"€{summary['net_contribution_after_ads_and_fixed_eur']}")
    lines.append(f"Break-even hours needed weekly: {be_display}")

    lines.append("")
    lines.append("=== RAW BOOKINGS ===")
    if not bookings:
        lines.append("(no bookings)")
    else:
        header = "date | type | hrs_billed | revenue€ | hrs_paid | addons€ | cleaner | postcode"
        lines.append(header)
        lines.append("-" * len(header))
        for b in bookings:
            lines.append(
                " | ".join(
                    [
                        str(b.get("date", "")),
                        str(b.get("booking_type", "")),
                        f"{float(b.get('hours_billed', 0.0)):g}",
                        f"{float(b.get('revenue_eur', 0.0)):g}",
                        f"{float(b.get('cleaner_hours_paid', 0.0)):g}",
                        f"{float(b.get('addons_eur', 0.0)):g}",
                        str(b.get("cleaner_id", "")),
                        str(b.get("postcode", "")),
                    ]
                )
            )

    lines.append("")
    lines.append("=== SPEND ===")
    spend_rows = spend.get("rows", [])
    if not spend_rows:
        lines.append("(no spend rows; totals zero)")
    else:
        for r in spend_rows:
            lines.append(
                f"{r['date']} | ads €{r['ad_spend_eur']:g} | "
                f"other €{r['other_costs_eur']:g} | {r['notes']}"
            )
        lines.append(
            f"TOTAL: ads €{spend.get('ad_spend_eur', 0):g}, "
            f"other €{spend.get('other_costs_eur', 0):g}"
        )

    return "\n".join(lines)
