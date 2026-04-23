"""Skill upload helpers for the ExpatCleaners finance bot.

The SDK's `client.beta.skills.create` signature has moved around between
releases, so we upload over raw HTTP. This keeps the contract stable
regardless of which `anthropic` pin we're on.

Caches the returned skill_id by `{filename}::{mtime_ns}`, so:
  - first run uploads the zip
  - subsequent runs skip upload unless the zip changed
  - zip changing invalidates the cached skill AND invalidates any
    cached agent that was built against the old skill_id.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import requests

SKILLS_ENDPOINT = "https://api.anthropic.com/v1/skills"
SKILLS_BETA = "skills-2025-10-02"
ANTHROPIC_VERSION = "2023-06-01"
CACHE_FILENAME = ".skill_cache.json"
UPLOAD_TIMEOUT_SECONDS = 120


def _load_cache(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text())
    except (OSError, json.JSONDecodeError):
        return {}


def _save_cache(path: Path, data: dict[str, Any]) -> None:
    path.write_text(json.dumps(data, indent=2, sort_keys=True))


def upload_skill_via_http(
    zip_path: Path,
    display_title: str,
    api_key: str,
) -> str:
    """Upload a zipped skill and return the Anthropic skill_id.

    Raises requests.HTTPError with the response body appended for easier
    debugging if Anthropic returns a 4xx/5xx.
    """
    if not zip_path.exists():
        raise FileNotFoundError(
            f"Skill zip not found at {zip_path}.\n"
            f"Build it from the project root:\n"
            f"  zip -r {zip_path.name} expatcleaners-finance/"
        )

    headers = {
        "x-api-key": api_key,
        "anthropic-version": ANTHROPIC_VERSION,
        "anthropic-beta": SKILLS_BETA,
    }

    with zip_path.open("rb") as fh:
        files = {"file": (zip_path.name, fh, "application/zip")}
        data = {"display_title": display_title}
        response = requests.post(
            SKILLS_ENDPOINT,
            headers=headers,
            files=files,
            data=data,
            timeout=UPLOAD_TIMEOUT_SECONDS,
        )

    if not response.ok:
        raise requests.HTTPError(
            f"Skill upload failed: {response.status_code} {response.reason}\n"
            f"Body: {response.text}",
            response=response,
        )

    payload = response.json()
    skill_id = payload.get("id") or payload.get("skill_id")
    if not skill_id:
        raise RuntimeError(f"Skill upload returned no id: {payload!r}")
    return str(skill_id)


def ensure_skill_uploaded(
    project_root: Path,
    zip_path: Path,
    display_title: str,
    api_key: str,
) -> str:
    """Upload the skill on first run (or on zip change); reuse otherwise.

    Returns the skill_id — either from cache or freshly uploaded.
    """
    cache_path = project_root / CACHE_FILENAME
    cache = _load_cache(cache_path)

    mtime_ns = zip_path.stat().st_mtime_ns
    key = f"{zip_path.name}::{mtime_ns}"

    existing = cache.get("skill") or {}
    if existing.get("key") == key and existing.get("skill_id"):
        return str(existing["skill_id"])

    skill_id = upload_skill_via_http(zip_path, display_title, api_key)

    # If the skill changed, any agent we cached was built against the old
    # skill_id — drop it so it gets recreated against the new one.
    prior_skill_id = existing.get("skill_id")
    cache["skill"] = {"key": key, "skill_id": skill_id}
    if prior_skill_id and prior_skill_id != skill_id:
        cache.pop("agent", None)

    _save_cache(cache_path, cache)
    return skill_id
