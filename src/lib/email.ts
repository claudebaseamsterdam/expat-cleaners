import "server-only";
import { Resend } from "resend";
import type { BookingPayload, BookingResponse } from "@/services/agents";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_TO = process.env.BOOKING_NOTIFY_TO ?? "hello@expat-cleaners.com";
// Default to the verified custom domain. If the domain isn't verified yet
// in Resend, set BOOKING_NOTIFY_FROM=onboarding@resend.dev (Resend's
// always-allowed sandbox sender) so notifications still arrive.
const NOTIFY_FROM =
  process.env.BOOKING_NOTIFY_FROM ?? "ExpatCleaners <bookings@expat-cleaners.com>";

type SendArgs = {
  payload: BookingPayload;
  result: BookingResponse;
  sourcePage?: string | null;
};

/**
 * Send the internal booking notification to the inbox. Fire-and-forget from
 * the route's perspective: the caller awaits this for ordering but never
 * lets failure escape — the booking response to the user is independent.
 */
export async function sendBookingNotification(
  args: SendArgs,
): Promise<{ ok: true; id?: string } | { ok: false; error: string }> {
  if (!RESEND_API_KEY) {
    return { ok: false, error: "RESEND_API_KEY not set" };
  }

  const { payload, result, sourcePage } = args;
  const ref = result.ref ?? "—";
  const total = result.summary?.estimated_price_eur;
  const hours = result.summary?.hours_estimate ?? payload.hours_estimate;
  const serviceLabel = formatService(payload);
  const subject = `New booking — ${serviceLabel} — ${formatEuro(total)}`;

  const resend = new Resend(RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: NOTIFY_FROM,
    to: NOTIFY_TO,
    replyTo: payload.phone ? undefined : NOTIFY_TO,
    subject,
    html: renderHtml({ payload, ref, total, hours, serviceLabel, sourcePage }),
    text: renderText({ payload, ref, total, hours, serviceLabel, sourcePage }),
  });

  if (error) {
    return { ok: false, error: error.message ?? String(error) };
  }
  return { ok: true, id: data?.id };
}

// ---------- Formatting helpers ----------

function formatEuro(value: number | undefined): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "€—";
  return `€${Math.round(value)}`;
}

function formatService(p: BookingPayload): string {
  const base = p.service_type === "recurring" ? "Recurring" : "One-off";
  return p.frequency && p.frequency !== "once" ? `${base} · ${p.frequency}` : base;
}

function formatDateTime(date: string, time: string): string {
  const parts = [date, time].filter(Boolean);
  return parts.length ? parts.join(" · ") : "—";
}

// ---------- Brand tokens (kept inline so the email is self-contained) ----------

const COLOR_CREAM = "#F7F2EA";
const COLOR_INK = "#1A1815";
const COLOR_SAGE = "#6E7A5C";
const COLOR_SAND = "#EFE6D6";
const COLOR_GRAPHITE = "#5C5852";

const FONT_SERIF =
  "Georgia, 'Times New Roman', 'Iowan Old Style', 'Apple Garamond', serif";
const FONT_SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

// ---------- Renderers ----------

type RenderArgs = {
  payload: BookingPayload;
  ref: string;
  total: number | undefined;
  hours: number;
  serviceLabel: string;
  sourcePage?: string | null;
};

function renderHtml({
  payload,
  ref,
  total,
  hours,
  serviceLabel,
  sourcePage,
}: RenderArgs): string {
  const rows: Array<[string, string]> = [
    ["Reference", ref],
    ["Service", serviceLabel],
    ["Hours", `${hours}h`],
    ["Estimate", formatEuro(total)],
    ["Name", payload.name || "—"],
    ["Phone", payload.phone || "—"],
    ["Home", payload.home_size || "—"],
    ["Postcode", payload.postcode || "—"],
    ["Preferred", formatDateTime(payload.preferred_date, payload.preferred_time)],
  ];
  if (payload.addons?.length) rows.push(["Extras", payload.addons.join(", ")]);
  if (payload.access_instructions)
    rows.push(["Access", payload.access_instructions]);
  if (payload.notes) rows.push(["Notes", payload.notes]);
  if (sourcePage) rows.push(["Source", sourcePage]);

  const rowsHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid ${COLOR_SAND};color:${COLOR_GRAPHITE};font-family:${FONT_SANS};font-size:13px;letter-spacing:0.04em;text-transform:uppercase;width:140px;vertical-align:top;">${escape(label)}</td>
          <td style="padding:14px 0;border-bottom:1px solid ${COLOR_SAND};color:${COLOR_INK};font-family:${FONT_SANS};font-size:15px;line-height:1.5;vertical-align:top;">${escape(value)}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New booking — ${escape(ref)}</title>
  </head>
  <body style="margin:0;padding:0;background:${COLOR_CREAM};color:${COLOR_INK};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLOR_CREAM};">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#FFFFFF;border:1px solid ${COLOR_SAND};border-radius:16px;">
            <tr>
              <td style="padding:32px 36px 8px;">
                <div style="font-family:${FONT_SANS};font-size:20px;letter-spacing:-0.01em;color:${COLOR_INK};">
                  expatcleaners<span style="color:${COLOR_SAGE};">.</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 36px 0;">
                <p style="margin:0;font-family:${FONT_SANS};font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:${COLOR_SAGE};">New booking</p>
                <h1 style="margin:8px 0 4px;font-family:${FONT_SERIF};font-weight:400;font-size:32px;line-height:1.1;letter-spacing:-0.01em;color:${COLOR_INK};">${escape(serviceLabel)}</h1>
                <p style="margin:0;font-family:${FONT_SANS};font-size:15px;color:${COLOR_GRAPHITE};">Estimated ${escape(formatEuro(total))} · ${escape(String(hours))}h · ref ${escape(ref)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 36px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${rowsHtml}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 36px 32px;">
                <p style="margin:0;font-family:${FONT_SANS};font-size:13px;line-height:1.55;color:${COLOR_GRAPHITE};">Reply to the customer on WhatsApp within 15 minutes to confirm the slot. The customer has already been handed off to the WhatsApp thread.</p>
              </td>
            </tr>
          </table>
          <p style="margin:16px 0 0;font-family:${FONT_SANS};font-size:12px;color:${COLOR_GRAPHITE};">Sent automatically by the booking flow.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function renderText(args: RenderArgs): string {
  const { payload, ref, total, hours, serviceLabel, sourcePage } = args;
  const lines: string[] = [
    "New booking",
    "",
    `Reference: ${ref}`,
    `Service:   ${serviceLabel}`,
    `Estimate:  ${formatEuro(total)} (${hours}h)`,
    "",
    `Name:      ${payload.name || "—"}`,
    `Phone:     ${payload.phone || "—"}`,
    `Home:      ${payload.home_size || "—"}`,
    `Postcode:  ${payload.postcode || "—"}`,
    `Preferred: ${formatDateTime(payload.preferred_date, payload.preferred_time)}`,
  ];
  if (payload.addons?.length) lines.push(`Extras:    ${payload.addons.join(", ")}`);
  if (payload.access_instructions)
    lines.push(`Access:    ${payload.access_instructions}`);
  if (payload.notes) lines.push(`Notes:     ${payload.notes}`);
  if (sourcePage) lines.push(`Source:    ${sourcePage}`);
  lines.push("");
  lines.push("Reply on WhatsApp within 15 minutes.");
  return lines.join("\n");
}

function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
