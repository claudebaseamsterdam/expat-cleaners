/**
 * Agent service layer — the single seam between the Next.js UI/API and
 * the ExpatCleaners multi-agent backend.
 *
 * V1 ships with deterministic mocks so the site runs end-to-end without a
 * live Managed Agents integration. To flip on live agents later, set
 * `USE_MOCK_AGENTS=false` and replace each mock body with a real call into
 * the Anthropic Managed Agents beta (see TODO markers below).
 *
 * Agent → function mapping:
 *   Ads & Growth           agent_011CaLyk3aqxUDnXSf5GfzV6  → captureLead       (stub)
 *   Admin & Finance        agent_011CaLzNKM8pw8QKEPot2Mua  → financeReport     (stub)
 *   Legal                  agent_011CaM2QRQYWkvNKz71h33vP  → legalCheck        (stub)
 *   WhatsApp Closing       agent_011CaM2RvY2XuhGyNbcyWgbb  → submitBooking     (live booking path)
 *   Operational Manager    agent_011CaM2T84MVqxqckHqt9Va9  → opsCheck          (live booking path)
 *
 * All agents share environment_id = env_01UHsXjHhTNyvxgzRG7QEMm7.
 */

export const AGENT_IDS = {
  adsGrowth: "agent_011CaLyk3aqxUDnXSf5GfzV6",
  adminFinance: "agent_011CaLzNKM8pw8QKEPot2Mua",
  legal: "agent_011CaM2QRQYWkvNKz71h33vP",
  whatsappClosing: "agent_011CaM2RvY2XuhGyNbcyWgbb",
  operationalManager: "agent_011CaM2T84MVqxqckHqt9Va9",
} as const;

export const ENVIRONMENT_ID = "env_01UHsXjHhTNyvxgzRG7QEMm7";
export const MANAGED_AGENTS_BETA = "managed-agents-2026-04-01";

/** Default true. Flip to false (or set env USE_MOCK_AGENTS=false) to use live agents. */
const USE_MOCK = process.env.USE_MOCK_AGENTS !== "false";

// ---------- Public types (shared with UI and API routes) ----------

export type ServiceType = "one-time" | "recurring";

export type BookingPayload = {
  name: string;
  phone: string;
  postcode: string;
  home_size: string;
  service_type: ServiceType;
  frequency: string;
  hours_estimate: number;
  addons: string[];
  preferred_date: string;
  preferred_time: string;
  notes: string;
  access_instructions: string;
};

export type OpsCheckRequest = {
  postcode: string;
  preferred_date: string;
  preferred_time: string;
  hours_estimate: number;
};

export type OpsAlternative = {
  date: string;
  time: string;
  note: string;
};

export type OpsCheckResponse = {
  feasible: boolean;
  reason?: string;
  alternative?: OpsAlternative;
};

export type BookingSummary = {
  service_type: ServiceType;
  frequency: string;
  hours_estimate: number;
  estimated_price_eur: number;
  preferred_date: string;
  preferred_time: string;
};

export type BookingResponse = {
  success: boolean;
  ref?: string;
  whatsappMessage?: string;
  summary?: BookingSummary;
  /** Mollie hosted-checkout URL — set when payment was successfully created. */
  checkoutUrl?: string;
  /** Mollie payment id (tr_xxx) — set when payment was successfully created. */
  paymentId?: string;
  /** Soft warning when booking succeeded but payment creation failed. */
  paymentWarning?: string;
  error?: string;
};

// ---------- Pricing source of truth ----------

const RATE_ONE_OFF = 44;
const RATE_RECURRING = 36;
const MIN_HOURS = 2;
const ADDON_FLAT_ESTIMATE = 20; // rough average — client-side has per-addon precision

// ---------- Live booking paths (currently delegate to mocks) ----------

export async function opsCheck(req: OpsCheckRequest): Promise<OpsCheckResponse> {
  if (USE_MOCK) return mockOpsCheck(req);

  // TODO: live integration — Operational Manager
  //
  // import Anthropic from "@anthropic-ai/sdk";
  // const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  //
  // const session = await client.beta.sessions.create({
  //   agent_id: AGENT_IDS.operationalManager,
  //   environment_id: ENVIRONMENT_ID,
  // }, { headers: { "anthropic-beta": MANAGED_AGENTS_BETA } });
  //
  // Open event stream, send user.message with JSON.stringify(req),
  // collect agent.message text, parse into OpsCheckResponse, close on
  // session.status_idle. See managed-agents-demo/lib.py for the flow.
  //
  // For now the mock is authoritative.

  throw new Error("Live Operational Manager integration is not wired yet. Set USE_MOCK_AGENTS=true or implement the call.");
}

export async function submitBooking(payload: BookingPayload): Promise<BookingResponse> {
  if (USE_MOCK) return mockSubmitBooking(payload);

  // TODO: live integration — WhatsApp Closing agent
  // Same pattern as opsCheck(), with agent_id = AGENT_IDS.whatsappClosing.
  // Expected agent output shape: JSON matching BookingResponse, including
  // a WhatsApp-ready message string in `whatsappMessage`.

  throw new Error("Live WhatsApp Closing integration is not wired yet. Set USE_MOCK_AGENTS=true or implement the call.");
}

// ---------- Placeholder paths for the other three agents ----------

export async function captureLead(
  lead: Record<string, unknown>,
): Promise<{ ok: boolean; ref?: string; note?: string }> {
  if (USE_MOCK) {
    return {
      ok: true,
      ref: `LEAD-${Date.now().toString(36).toUpperCase()}`,
      note: "Mock lead capture — not yet wired to Ads & Growth agent.",
    };
  }
  // TODO: live integration — Ads & Growth (AGENT_IDS.adsGrowth)
  void lead;
  throw new Error("Live Ads & Growth integration is not wired yet.");
}

export async function financeReport(
  input: Record<string, unknown>,
): Promise<{ ok: boolean; report?: string }> {
  if (USE_MOCK) {
    return {
      ok: true,
      report: "Mock finance report — not yet wired to Admin & Finance agent.",
    };
  }
  // TODO: live integration — Admin & Finance (AGENT_IDS.adminFinance)
  void input;
  throw new Error("Live Admin & Finance integration is not wired yet.");
}

export async function legalCheck(
  input: Record<string, unknown>,
): Promise<{ ok: boolean; risk?: "low" | "medium" | "high"; notes?: string }> {
  if (USE_MOCK) {
    return {
      ok: true,
      risk: "low",
      notes: "Mock legal check — not yet wired to Legal agent.",
    };
  }
  // TODO: live integration — Legal (AGENT_IDS.legal)
  void input;
  throw new Error("Live Legal integration is not wired yet.");
}

// ---------- Mock implementations ----------

function mockOpsCheck(req: OpsCheckRequest): OpsCheckResponse {
  const postcodeShort = (req.postcode || "").replace(/\s+/g, "").slice(0, 4);
  const CENTRAL_POSTCODES = new Set(["1011", "1012", "1013", "1015", "1017"]);

  let dow = -1;
  if (req.preferred_date) {
    const d = new Date(req.preferred_date);
    if (!Number.isNaN(d.getTime())) dow = d.getDay(); // 0=Sun, 2=Tue
  }

  // Mock heuristic: Tuesdays and Saturdays in central postcodes are "at capacity"
  const congested =
    CENTRAL_POSTCODES.has(postcodeShort) && (dow === 2 || dow === 6);

  if (congested) {
    const altDate = new Date(req.preferred_date);
    altDate.setDate(altDate.getDate() + 1);
    return {
      feasible: false,
      reason: `${postcodeShort} is at capacity for that day — we're tight in that area.`,
      alternative: {
        date: altDate.toISOString().slice(0, 10),
        time: req.preferred_time || "10:00",
        note: "Next available in your area — same time, one day later.",
      },
    };
  }

  return { feasible: true };
}

function mockSubmitBooking(payload: BookingPayload): BookingResponse {
  const hours = Math.max(MIN_HOURS, payload.hours_estimate || MIN_HOURS);
  const rate = payload.service_type === "recurring" ? RATE_RECURRING : RATE_ONE_OFF;
  const addonEstimate = (payload.addons?.length ?? 0) * ADDON_FLAT_ESTIMATE;
  const price = Math.round(hours * rate + addonEstimate);
  const ref = `EC-${Date.now().toString(36).toUpperCase()}`;

  const whatsappMessage = buildWhatsappMessage(payload, hours, price, ref);

  return {
    success: true,
    ref,
    whatsappMessage,
    summary: {
      service_type: payload.service_type,
      frequency: payload.frequency,
      hours_estimate: hours,
      estimated_price_eur: price,
      preferred_date: payload.preferred_date,
      preferred_time: payload.preferred_time,
    },
  };
}

function buildWhatsappMessage(
  p: BookingPayload,
  hours: number,
  price: number,
  ref: string,
): string {
  const freq = p.frequency && p.frequency !== "once" ? ` · ${p.frequency}` : "";
  const addons = p.addons?.length ? p.addons.join(", ") : null;
  const lines: string[] = [
    `Hey ExpatCleaners — I'd like to book a clean (ref ${ref}):`,
    "",
    `• Service: ${p.service_type}${freq}`,
    `• Home: ${p.home_size || "—"}${p.postcode ? ` · ${p.postcode}` : ""}`,
    `• Estimate: ${hours}h · €${price}`,
    `• Preferred: ${p.preferred_date} ${p.preferred_time}`.trim(),
  ];
  if (addons) lines.push(`• Extras: ${addons}`);
  if (p.access_instructions) lines.push(`• Access: ${p.access_instructions}`);
  if (p.notes) lines.push(`• Notes: ${p.notes}`);
  lines.push("");
  lines.push(`— ${p.name}${p.phone ? ` · ${p.phone}` : ""}`);
  return lines.join("\n");
}
