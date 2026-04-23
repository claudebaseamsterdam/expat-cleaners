"""Delivery channels for the weekly finance report.

All three helpers are *best-effort*: missing config → return False silently.
The report always lands on disk regardless of delivery success.
"""

from __future__ import annotations

import os
import smtplib
from email.message import EmailMessage
from typing import Callable

import requests

TELEGRAM_MAX_CHARS = 4000
DELIVERY_TIMEOUT_SECONDS = 30


def send_telegram(report: str, subject: str) -> bool:
    """Send via Telegram Bot API. Needs TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID.

    Truncates to 4000 chars (Telegram's message cap is 4096).
    """
    token = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
    chat_id = os.getenv("TELEGRAM_CHAT_ID", "").strip()
    if not token or not chat_id:
        return False

    message = f"*{subject}*\n\n{report}"
    if len(message) > TELEGRAM_MAX_CHARS:
        message = message[: TELEGRAM_MAX_CHARS - 3] + "..."

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    try:
        response = requests.post(
            url,
            data={
                "chat_id": chat_id,
                "text": message,
                "parse_mode": "Markdown",
            },
            timeout=DELIVERY_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        return True
    except requests.RequestException as e:
        print(f"[telegram] failed: {e}")
        return False


def send_slack(report: str, subject: str) -> bool:
    """Send via a Slack incoming webhook. Needs SLACK_WEBHOOK_URL."""
    webhook = os.getenv("SLACK_WEBHOOK_URL", "").strip()
    if not webhook:
        return False

    text = f"*{subject}*\n```\n{report}\n```"
    try:
        response = requests.post(
            webhook,
            json={"text": text},
            timeout=DELIVERY_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        return True
    except requests.RequestException as e:
        print(f"[slack] failed: {e}")
        return False


def send_email(report: str, subject: str) -> bool:
    """Send via SMTP with STARTTLS.

    Needs SMTP_HOST, SMTP_USER, SMTP_PASSWORD, EMAIL_TO, EMAIL_FROM.
    SMTP_PORT defaults to 587.
    """
    host = os.getenv("SMTP_HOST", "").strip()
    port_raw = os.getenv("SMTP_PORT", "587").strip() or "587"
    user = os.getenv("SMTP_USER", "").strip()
    password = os.getenv("SMTP_PASSWORD", "").strip()
    email_to = os.getenv("EMAIL_TO", "").strip()
    email_from = os.getenv("EMAIL_FROM", "").strip()

    if not all([host, user, password, email_to, email_from]):
        return False

    try:
        port = int(port_raw)
    except ValueError:
        print(f"[email] invalid SMTP_PORT={port_raw!r}")
        return False

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = email_from
    msg["To"] = email_to
    msg.set_content(report)

    try:
        with smtplib.SMTP(host, port, timeout=DELIVERY_TIMEOUT_SECONDS) as smtp:
            smtp.starttls()
            smtp.login(user, password)
            smtp.send_message(msg)
        return True
    except (smtplib.SMTPException, OSError) as e:
        print(f"[email] failed: {e}")
        return False


def deliver(report: str, subject: str) -> None:
    """Attempt all configured channels. Skipping missing config is expected."""
    channels: list[tuple[str, Callable[[str, str], bool]]] = [
        ("telegram", send_telegram),
        ("slack", send_slack),
        ("email", send_email),
    ]
    any_ok = False
    for name, fn in channels:
        ok = fn(report, subject)
        if ok:
            print(f"[{name}] delivered")
            any_ok = True
        else:
            print(f"[{name}] skipped (no config or send failed)")
    if not any_ok:
        print("[deliver] no channels delivered — report is still on disk.")
