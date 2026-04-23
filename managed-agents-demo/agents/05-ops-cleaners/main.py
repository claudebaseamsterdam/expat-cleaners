"""Agent 5 — Operational Manager.

Runs agent_011CaM2T84MVqxqckHqt9Va9 through the shared lib.run_agent helper.
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from lib import run_agent  # noqa: E402

NAME = "Operational Manager"
AGENT_ID = "agent_011CaM2T84MVqxqckHqt9Va9"
ENVIRONMENT_ID = "env_01UHsXjHhTNyvxgzRG7QEMm7"

if __name__ == "__main__":
    sys.exit(run_agent(AGENT_ID, ENVIRONMENT_ID, name=NAME))
