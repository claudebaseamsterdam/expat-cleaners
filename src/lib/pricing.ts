/**
 * Duration calculation — single source of truth.
 *
 * Closes a margin leak that quoted a 50m² studio and a 500m² mansion
 * the same 2-hour minimum. Every price-displaying component must read
 * its hours from this function; do not duplicate the math.
 *
 * Customer-facing framing (do not violate):
 *   "We estimate hours based on your home size. You only pay for the
 *    time we work — final price confirmed on arrival."
 *
 * Never use the words "extra fee", "size surcharge", or "additional
 * charge" in UI copy. The model is honest hours for honest work.
 *
 * Pure module: no React / lucide / DOM — safe to import from tests
 * and from server-side code.
 */

export type PricingHomeType = "apartment" | "house" | "studio";

export type DurationInput = {
  /** Square meters; null/undefined when the user hasn't entered a size. */
  sqm: number | null | undefined;
  /** Bedroom count. For studios, the value is overridden to 1 internally. */
  bedrooms: number;
  bathrooms: number;
  homeType: PricingHomeType;
  /**
   * Service-specific minimum hours (e.g. 3 for deep clean, 4 for
   * after-builders). Defaults to 2 — the global floor. The brief calls
   * out the deep-clean 3hr override explicitly; this is the general
   * mechanism behind it.
   */
  serviceMinHours?: number;
};

export type DurationResult =
  | { kind: "estimate"; hours: number }
  | { kind: "custom-quote" };

/**
 * Homes ≥ this size are routed to a custom WhatsApp quote — we don't
 * try to fit them into the m² ladder.
 */
export const CUSTOM_QUOTE_THRESHOLD_SQM = 156;

/**
 * m² → hours ladder. Below 65m² is the floor (2.0h); each additional
 * 15m² adds 0.5h up to 155m². Anything ≥156 falls outside the ladder.
 */
function sqmToHours(sqm: number): number {
  if (sqm <= 65) return 2.0;
  if (sqm <= 80) return 2.5;
  if (sqm <= 95) return 3.0;
  if (sqm <= 110) return 3.5;
  if (sqm <= 125) return 4.0;
  if (sqm <= 140) return 4.5;
  return 5.0; // 141..155
}

/**
 * Round up to the nearest 0.5 hour. The two component formulas
 * already emit half-hour values, but rounding belt-and-braces protects
 * against later changes (e.g. introducing 0.25h increments).
 */
function roundUpHalf(hours: number): number {
  return Math.ceil(hours * 2) / 2;
}

/**
 * Calculate the estimated cleaning duration.
 *
 * Returns:
 *  - `{ kind: "estimate", hours }` for normal estimates,
 *  - `{ kind: "custom-quote" }` when sqm ≥ 156 — UI must swap the
 *    price panel for a WhatsApp deep-link pre-filled with the size.
 *
 * Rules:
 *  1. m² duration is looked up on the ladder (2.0..5.0h).
 *  2. Bed/bath duration = 2 + 0.5 × (extra_bedrooms + extra_bathrooms).
 *     Studios are treated as 1 bedroom for this calc, so an empty
 *     studio still gets the 2h floor and not a fractional value.
 *  3. The estimate is the LARGER of the two (never the sum).
 *  4. The service-specific minimum (e.g. 3h for deep clean) is then
 *     applied as a floor — so a 50m² studio booked as deep clean
 *     still gets 3h.
 *  5. Result is rounded up to the nearest 0.5h.
 *  6. Floor of 2h is always honored.
 */
export function calculateDuration(input: DurationInput): DurationResult {
  const sqm = typeof input.sqm === "number" && input.sqm > 0 ? input.sqm : null;

  if (sqm !== null && sqm >= CUSTOM_QUOTE_THRESHOLD_SQM) {
    return { kind: "custom-quote" };
  }

  const effectiveBedrooms =
    input.homeType === "studio"
      ? Math.max(1, input.bedrooms)
      : input.bedrooms;
  const extraBedrooms = Math.max(0, effectiveBedrooms - 1);
  const extraBathrooms = Math.max(0, input.bathrooms - 1);
  const bedbathHours = 2 + 0.5 * (extraBedrooms + extraBathrooms);

  // When the user hasn't given a size, fall back to bed/bath alone.
  const sqmHours = sqm !== null ? sqmToHours(sqm) : bedbathHours;

  const calculated = Math.max(sqmHours, bedbathHours);
  const serviceMin = input.serviceMinHours ?? 2;
  const finalHours = Math.max(2, serviceMin, calculated);

  return { kind: "estimate", hours: roundUpHalf(finalHours) };
}

/**
 * Format the duration breakdown for display under a service name in
 * the summary card:
 *   "2.5h estimate · 80m² · 1 bed / 1 bath"
 *
 * If size is missing the m² segment is dropped:
 *   "2.5h estimate · 1 bed / 1 bath"
 *
 * Studios render "studio" instead of "0 bed":
 *   "2h estimate · 30m² · studio · 1 bath"
 */
export function formatDurationBreakdown(opts: {
  hours: number;
  sqm: number | null | undefined;
  bedrooms: number;
  bathrooms: number;
  homeType: PricingHomeType;
}): string {
  const hoursLabel = Number.isInteger(opts.hours)
    ? `${opts.hours}h`
    : `${opts.hours.toFixed(1)}h`;
  const parts: string[] = [`${hoursLabel} estimate`];
  const sqmNum =
    typeof opts.sqm === "number" && opts.sqm > 0 ? opts.sqm : null;
  if (sqmNum !== null) parts.push(`${sqmNum}m²`);
  if (opts.homeType === "studio") {
    parts.push("studio");
    parts.push(`${opts.bathrooms} bath`);
  } else {
    parts.push(
      `${opts.bedrooms} bed / ${opts.bathrooms} bath`,
    );
  }
  return parts.join(" · ");
}

/**
 * Parse a size string (the form input is a string) into a number,
 * returning null for empty / non-numeric values. Centralized so every
 * caller treats a missing m² the same way.
 */
export function parseSqm(raw: string | null | undefined): number | null {
  if (raw == null) return null;
  const trimmed = String(raw).trim();
  if (trimmed === "") return null;
  const n = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}
