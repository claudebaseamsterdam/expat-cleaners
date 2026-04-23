# ExpatCleaners — Finance Bot

Autonomous weekly finance agent for **ExpatCleaners** (Amsterdam). Every Monday morning it reads last week's bookings and spend, runs them through an Anthropic Managed Agent wearing a custom Finance Skill, and produces a decision-ready markdown report.

---

## What it does

- Reads two CSVs (`data/input/week.csv`, `data/input/spend.csv`)
- Pre-computes revenue, cost, contribution margin, utilization, break-even
- Uploads the **ExpatCleaners Finance** skill (once; cached by content hash)
- Reuses a persistent Managed Agent + cloud environment (cached)
- Streams the agent's response
- Saves to `data/output/YYYY-MM-DD-finance-snapshot.md`
- Delivers via Telegram / Slack / email (any configured channel)

Every report ends with 3–5 numbered decisions the owner can action that day.

---

## Prerequisites

- Python 3.10+
- An **Anthropic API key** — [console.anthropic.com](https://console.anthropic.com).  
  ⚠️ A Claude Max (chat) plan does **not** include API credits. You need API billing enabled separately.
- The Managed Agents beta (`managed-agents-2026-04-01`) and Skills beta (`skills-2025-10-02`) enabled on your account.

---

## Setup

```bash
cd ec-finance-bot
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# open .env and fill in ANTHROPIC_API_KEY, LOADED_COST_PER_HOUR, FIXED_COSTS_MONTHLY
```

Build the skill zip (do this once; re-zip whenever `SKILL.md` changes):

```bash
zip -r expatcleaners-finance.zip expatcleaners-finance/
```

The zip must have `expatcleaners-finance/` as the top-level entry (not a loose `SKILL.md`).

---

## Prepare input CSVs

Copy the templates, then fill with real weekly data:

```bash
cp data/input/week-template.csv data/input/week.csv
cp data/input/spend-template.csv data/input/spend.csv
```

### `data/input/week.csv` — one row per booking
| column | description |
|---|---|
| `date` | `YYYY-MM-DD` |
| `booking_type` | `recurring` or `oneoff` |
| `hours_billed` | hours invoiced to the client |
| `revenue_eur` | total revenue for this booking |
| `cleaner_hours_paid` | hours actually paid to the cleaner (includes overhead) |
| `addons_eur` | add-on revenue included in `revenue_eur` |
| `cleaner_id` | cleaner identifier |
| `postcode` | 4-digit Amsterdam postcode |

### `data/input/spend.csv` — one row per spend entry (weekly aggregates fine)
| column | description |
|---|---|
| `date` | `YYYY-MM-DD` |
| `ad_spend_eur` | Meta / Google / etc. |
| `other_costs_eur` | supplies, travel, tools |
| `notes` | freeform |

Missing `spend.csv` is not fatal — totals default to zero.

---

## Run manually

```bash
source .venv/bin/activate
python src/run_weekly_report.py
```

First run uploads the skill and creates the agent + environment (~30s). Subsequent runs reuse both via `.skill_cache.json`.

---

## Schedule (Monday 09:00 Amsterdam)

Open your crontab:

```bash
crontab -e
```

Add:

```cron
# ExpatCleaners weekly finance report — every Monday at 09:00
0 9 * * 1 cd /absolute/path/to/ec-finance-bot && /absolute/path/to/ec-finance-bot/.venv/bin/python src/run_weekly_report.py >> logs/weekly.log 2>&1
```

Set `TZ=Europe/Amsterdam` in your crontab header if your server is UTC.

---

## Output

- Saved report: `data/output/YYYY-MM-DD-finance-snapshot.md`
- Log of the run: `logs/weekly.log`
- Delivered to any channel whose config is filled in `.env` (channels with empty config are silently skipped)

---

## Estimated cost

Roughly **€0.50 – €1.50 per run** with Opus 4.7, depending on how much the agent calls tools and how long the report runs. Budget ~€2–6 per month for a weekly cadence.

---

## Project structure

```
ec-finance-bot/
├── README.md
├── requirements.txt
├── .env.example
├── .gitignore
├── expatcleaners-finance/        ← skill source (zipped by you)
│   └── SKILL.md
├── expatcleaners-finance.zip     ← built by `zip -r ...`
├── data/
│   ├── input/
│   │   ├── week-template.csv
│   │   ├── spend-template.csv
│   │   ├── week.csv              ← you create (gitignored)
│   │   └── spend.csv             ← you create (gitignored)
│   └── output/                   ← reports land here (gitignored)
├── logs/                         ← cron log destination (gitignored)
└── src/
    ├── __init__.py
    ├── run_weekly_report.py      ← entrypoint
    ├── agent_setup.py            ← create/reuse agent + environment
    ├── skill_upload.py           ← upload skill, cache skill_id
    ├── data_loader.py            ← CSV → summary stats
    └── notify.py                 ← Telegram / Slack / email
```

---

## Troubleshooting

**`ANTHROPIC_API_KEY not set`** — copy `.env.example` to `.env` and add your key. A Max/Pro chat plan does *not* include API credits.

**`anthropic-beta` rejected** — make sure the betas `managed-agents-2026-04-01` and `skills-2025-10-02` are enabled on your account.

**Skill upload fails** — verify `expatcleaners-finance.zip` exists at `SKILL_ZIP_PATH` and that `expatcleaners-finance/` is the top-level entry inside the zip (not a loose `SKILL.md`). Re-zip from the project root.

**Agent produces generic output** — the pre-computed summary is likely empty. Check that `data/input/week.csv` has real rows beyond the header.

**All zero numbers in the report** — `LOADED_COST_PER_HOUR` or `FIXED_COSTS_MONTHLY` may be unset or zero. Fill them in `.env`. Also confirm `cleaner_hours_paid` has non-zero values.

**Duplicate agents / skills in the console** — delete `.skill_cache.json` and the old entries from the Anthropic console, then re-run.

**Cron silent failure** — always redirect output (`>> logs/weekly.log 2>&1`) and check the log. Common causes: wrong Python path in the venv or non-absolute `SKILL_ZIP_PATH`.
