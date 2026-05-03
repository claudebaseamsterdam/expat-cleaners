/**
 * Local-date formatting helpers.
 *
 * The booking calendar builds a Date as `new Date(year, monthIndex, day)`
 * — i.e. midnight in the user's local timezone. Serialising with
 * `.toISOString().slice(0, 10)` then converts to UTC, which in CEST
 * (UTC+2) shifts the date back by one day:
 *
 *   new Date(2026, 4, 11).toISOString() → "2026-05-10T22:00:00.000Z"
 *
 * Real-world fallout: customer picks May 11, the summary and the
 * WhatsApp deep-link both encode May 10, the cleaner shows up on the
 * wrong day. Use `formatLocalDate(d)` everywhere a Date needs to render
 * as a calendar day in YYYY-MM-DD without timezone conversion.
 */
export function formatLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
