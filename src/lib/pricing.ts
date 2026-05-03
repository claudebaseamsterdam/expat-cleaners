/**
 * Single source of truth for all customer-facing pricing AND for the
 * duration ladder used to translate a home into estimated hours.
 *
 * All prices are in euros, INCLUDING Dutch VAT (BTW) at the rate
 * indicated on each item.
 *
 * VAT rates per Belastingdienst (Dutch Tax Authority):
 *   9%  = cleaning INSIDE the home (huishoudelijke schoonmaak —
 *         recurring, deep, move-in/out, kitchen, bathroom, inside
 *         windows, inside oven/fridge/cabinets, ironing, laundry).
 *   21% = exterior cleaning, specialist work with specialised
 *         equipment (exterior windows, balcony, façade, terrace,
 *         post-construction / after-builders, fire/water-damage).
 *
 * UI labels are pulled from `VAT_LABEL`. Helpers like
 * `formatHourlyVat()` render a price together with the right BTW
 * label so no caller has to know which rate applies — they pass the
 * item's `vat` field and get a string back.
 *
 * When changing a price, change it here only.
 */

// =============================================================
// VAT
// =============================================================

export const VAT_RATES = {
  reduced: 0.09, // inside the home
  standard: 0.21, // outdoor / specialist
} as const;

export const VAT_LABEL = {
  reduced: "incl. 9% BTW",
  standard: "incl. 21% BTW",
  mixed: "incl. BTW",
} as const;

// =============================================================
// Recurring cleaning (inside-home, 9% BTW)
// =============================================================

export const RECURRING_RATES = {
  weekly: {
    hourly: 42,
    label: "Weekly",
    badge: "MOST CHOSEN" as const,
    vat: VAT_RATES.reduced,
  },
  biweekly: {
    hourly: 46,
    label: "Bi-weekly",
    badge: null,
    vat: VAT_RATES.reduced,
  },
  monthly: {
    hourly: 52,
    label: "Monthly",
    badge: null,
    vat: VAT_RATES.reduced,
  },
} as const;

// =============================================================
// One-off cleaning (inside-home, 9% BTW)
// =============================================================

export const ONE_OFF_RATE = {
  hourly: 58,
  label: "One-off",
  minimumHours: 2,
  vat: VAT_RATES.reduced,
} as const;

// =============================================================
// Fixed-price packages — Deep Clean (inside-home, 9% BTW)
// =============================================================

export const DEEP_CLEAN_PACKAGES = [
  {
    id: "studio",
    label: "Studio",
    sizeRange: "up to 50 m² / 1 bedroom",
    estimatedHours: 3,
    price: 225,
    vat: VAT_RATES.reduced,
  },
  {
    id: "apartment",
    label: "Apartment",
    sizeRange: "50–80 m² / 2 bedrooms",
    estimatedHours: 4,
    price: 295,
    vat: VAT_RATES.reduced,
  },
  {
    id: "family",
    label: "Family home",
    sizeRange: "80–120 m² / 3 bedrooms",
    estimatedHours: 5,
    price: 395,
    vat: VAT_RATES.reduced,
  },
  {
    id: "large",
    label: "Large home",
    sizeRange: "120 m²+ / 4+ bedrooms",
    estimatedHours: 6,
    price: null,
    fromPrice: 495,
    customQuote: true,
    vat: VAT_RATES.reduced,
  },
] as const;

// =============================================================
// Fixed-price packages — Move-In / Move-Out (inside-home, 9% BTW)
// =============================================================

export const MOVE_PACKAGES = [
  {
    id: "studio",
    label: "Studio",
    sizeRange: "up to 50 m²",
    price: 395,
    vat: VAT_RATES.reduced,
  },
  {
    id: "apartment",
    label: "Apartment",
    sizeRange: "50–80 m²",
    price: 495,
    vat: VAT_RATES.reduced,
  },
  {
    id: "family",
    label: "Family home",
    sizeRange: "80–120 m²",
    price: 625,
    vat: VAT_RATES.reduced,
  },
  {
    id: "large",
    label: "Large home",
    sizeRange: "120 m²+",
    price: null,
    fromPrice: 750,
    customQuote: true,
    vat: VAT_RATES.reduced,
  },
] as const;

// =============================================================
// Service catalog VAT + minimum-duration rules
// =============================================================

/** Default visit duration for showing "From €X per visit". */
export const DEFAULT_VISIT_HOURS = 3;

/** Minimum visit hours per service id. */
export const SERVICE_MINIMUMS = {
  regular: 2,
  airbnb: 2,
  office: 2,
  deep: 3,
  movein: 3,
  moveout: 3,
  builders: 4,
} as const;

/** VAT rate per service id. Office and after-builders are commercial /
 *  specialist work and fall under the 21% standard rate. */
export const SERVICE_VAT = {
  regular: VAT_RATES.reduced,
  airbnb: VAT_RATES.reduced,
  office: VAT_RATES.standard,
  deep: VAT_RATES.reduced,
  movein: VAT_RATES.reduced,
  moveout: VAT_RATES.reduced,
  builders: VAT_RATES.standard,
} as const;

// =============================================================
// Add-ons (each carries its own VAT rate)
// =============================================================

export const ADD_ONS = [
  { id: "oven", label: "Inside oven", price: 30, vat: VAT_RATES.reduced },
  { id: "fridge", label: "Inside fridge", price: 20, vat: VAT_RATES.reduced },
  { id: "dishwasher", label: "Inside dishwasher", price: 20, vat: VAT_RATES.reduced },
  { id: "microwave", label: "Inside microwave", price: 20, vat: VAT_RATES.reduced },
  { id: "cabinets", label: "Inside cabinets", price: 10, vat: VAT_RATES.reduced },
  { id: "windows_in", label: "Inside windows", price: 10, vat: VAT_RATES.reduced },
  { id: "blinds", label: "Blinds", price: 20, vat: VAT_RATES.reduced },
  { id: "balcony", label: "Balcony", price: 40, vat: VAT_RATES.standard, badge: "21% BTW" },
  { id: "windows_out", label: "Exterior windows", price: 30, vat: VAT_RATES.standard, badge: "21% BTW" },
  { id: "laundry", label: "In-house laundry", price: 30, vat: VAT_RATES.reduced },
  { id: "ironing", label: "Ironing (per hour)", price: 25, vat: VAT_RATES.reduced },
  { id: "walls", label: "Wall wipe-down", price: 30, vat: VAT_RATES.reduced },
  { id: "stairs", label: "Stairs", price: 20, vat: VAT_RATES.reduced },
  { id: "mould", label: "Bathroom mould treatment", price: 50, vat: VAT_RATES.reduced },
  { id: "organisation", label: "Organisation", price: 30, vat: VAT_RATES.reduced },
] as const;

export const VACUUM_RENTAL = {
  label: "Bring our vacuum",
  price: 50,
  vat: VAT_RATES.reduced,
} as const;

/**
 * Cheapest concrete prices for "From €X" copy on the homepage. Studios
 * are always the entry tier for both package families today; if that
 * ever changes, swap the index or compute a min over `.price ?? .fromPrice`.
 */
export const DEEP_CLEAN_FROM_PRICE = DEEP_CLEAN_PACKAGES[0].price; // studio
export const MOVE_FROM_PRICE = MOVE_PACKAGES[0].price; // studio
export const ADD_ON_MIN_PRICE = Math.min(...ADD_ONS.map((a) => a.price));

/**
 * "Apartment" tier prices — the bundle picker on /book uses these as
 * its anchor numbers ("€295 + add-ons" for First-time reset, "€495 +
 * add-ons" for Move-out package). Cast through `as number` because the
 * `as const` array union widens to `number | null` thanks to the
 * "Large home" custom-quote tier.
 */
export const APARTMENT_DEEP_PRICE = DEEP_CLEAN_PACKAGES[1].price as number;
export const APARTMENT_MOVE_PRICE = MOVE_PACKAGES[1].price as number;

// =============================================================
// Package tier selection (for fixed-price services)
// =============================================================

/**
 * Phase 4.7 — every fixed-price service (deep, move-in, move-out)
 * picks ONE of these four tiers from the home's size + bedrooms. m²
 * wins when present; the bedroom ladder is a fallback for users who
 * skipped the size field. Boundaries match the `sizeRange` strings on
 * each package so the spoken-words and the math agree.
 *
 *   ≤ 49 m² (or 0–1 bed)    → studio
 *   50–79 m² (or 2 bed)     → apartment
 *   80–119 m² (or 3 bed)    → family
 *   120+ m² (or 4+ bed)     → large (custom quote)
 */
export type PackageTierId = "studio" | "apartment" | "family" | "large";

export function selectPackageId(
  sqm: number | null | undefined,
  bedrooms: number,
): PackageTierId {
  if (typeof sqm === "number" && sqm > 0) {
    if (sqm >= 120) return "large";
    if (sqm >= 80) return "family";
    if (sqm >= 50) return "apartment";
    return "studio";
  }
  if (bedrooms >= 4) return "large";
  if (bedrooms === 3) return "family";
  if (bedrooms >= 2) return "apartment";
  return "studio";
}

/**
 * Pick the right tier from `DEEP_CLEAN_PACKAGES` for a given home.
 * Throws if a tier is missing — fail loud at boot rather than render
 * a silent €0 in the summary card.
 */
export function selectDeepCleanPackage(
  sqm: number | null | undefined,
  bedrooms: number,
): (typeof DEEP_CLEAN_PACKAGES)[number] {
  const id = selectPackageId(sqm, bedrooms);
  const pkg = DEEP_CLEAN_PACKAGES.find((p) => p.id === id);
  if (!pkg) throw new Error(`Missing deep-clean package tier: ${id}`);
  return pkg;
}

/** Pick the right tier from `MOVE_PACKAGES` for a given home. */
export function selectMovePackage(
  sqm: number | null | undefined,
  bedrooms: number,
): (typeof MOVE_PACKAGES)[number] {
  const id = selectPackageId(sqm, bedrooms);
  const pkg = MOVE_PACKAGES.find((p) => p.id === id);
  if (!pkg) throw new Error(`Missing move package tier: ${id}`);
  return pkg;
}

/**
 * Hours used to compute "From €X per visit" on each booking-flow tile.
 * Per the brief: Regular and Office advertise the 3-hour DEFAULT_VISIT
 * estimate; Airbnb advertises its 2-hour minimum (small jobs); After-
 * builders advertises its 4-hour minimum (specialist). Deep / Move-in
 * / Move-out are fixed-price packages and don't use this map.
 */
export const SERVICE_TILE_HOURS = {
  regular: DEFAULT_VISIT_HOURS,
  airbnb: SERVICE_MINIMUMS.airbnb,
  office: DEFAULT_VISIT_HOURS,
  builders: SERVICE_MINIMUMS.builders,
} as const;

type HourlyTileService = keyof typeof SERVICE_TILE_HOURS;
type ServiceVatId = keyof typeof SERVICE_VAT;

const FIXED_PRICE_SERVICES = new Set<ServiceVatId>(["deep", "movein", "moveout"]);

/**
 * Render the "From €X · …" string shown on each /book service tile.
 * Pulls VAT label from SERVICE_VAT and visit hours from
 * SERVICE_TILE_HOURS so the spec's per-service quirks (Airbnb at min,
 * Office at default) stay encoded in pricing.ts and never leak into
 * the React layer.
 */
export function formatServiceTilePrice(serviceId: ServiceVatId): string {
  const vat = SERVICE_VAT[serviceId];
  const vatLabel =
    vat === VAT_RATES.standard ? VAT_LABEL.standard : VAT_LABEL.reduced;

  if (FIXED_PRICE_SERVICES.has(serviceId)) {
    const fromPrice =
      serviceId === "deep" ? DEEP_CLEAN_FROM_PRICE : MOVE_FROM_PRICE;
    return `From ${formatEur(fromPrice)} · fixed price · ${vatLabel}`;
  }

  const id = serviceId as HourlyTileService;
  const hours = SERVICE_TILE_HOURS[id];
  const hourly =
    id === "regular" ? RECURRING_RATES.weekly.hourly : ONE_OFF_RATE.hourly;
  const total = hours * hourly;
  // Spec wording: only Regular gets "estimate" qualifier.
  const hourLabel = id === "regular" ? `${hours}h estimate` : `${hours}h`;
  return `From ${formatEur(total)} per visit · ${hourLabel} · ${vatLabel}`;
}

/**
 * Footnote shown beneath the right-rail booking total. Picks the right
 * BTW disclosure based on which VAT rates are present in the booking
 * (single-rate vs mixed). Pass the service VAT plus each selected
 * add-on's VAT.
 */
export function vatFootnoteText(items: Array<{ vat: number }>): string {
  const rates = new Set(items.map((i) => i.vat));
  if (rates.size > 1) {
    return "All prices include BTW. Interior items at 9%, exterior items at 21%.";
  }
  if (rates.has(VAT_RATES.standard)) {
    return "All prices include 21% BTW.";
  }
  return "All prices include 9% BTW.";
}

/** O(1) lookup so consumers don't repeat ADD_ONS.find(...). */
const ADDON_BY_ID: Record<string, (typeof ADD_ONS)[number]> = Object.fromEntries(
  ADD_ONS.map((a) => [a.id, a]),
);

/**
 * Look up an add-on by id. Throws when the id isn't in `ADD_ONS` —
 * better to fail loudly at boot than silently render €0.
 */
export function findAddon(id: string): (typeof ADD_ONS)[number] {
  const found = ADDON_BY_ID[id];
  if (!found) throw new Error(`Unknown add-on id: ${id}`);
  return found;
}

// =============================================================
// Helpers — use these so formatting is consistent everywhere.
// =============================================================

export const formatEur = (n: number): string => `€${n}`;

export const formatHourly = (n: number): string => `${formatEur(n)}/hr`;

export const formatHourlyVat = (n: number, vat: number): string =>
  `${formatHourly(n)} ${vat === VAT_RATES.standard ? VAT_LABEL.standard : VAT_LABEL.reduced}`;

export const formatFixedPrice = (n: number, vat: number): string =>
  `${formatEur(n)} ${vat === VAT_RATES.standard ? VAT_LABEL.standard : VAT_LABEL.reduced}`;

export const formatFromPrice = (n: number): string => `From ${formatEur(n)}`;

export function visitEstimate(
  hourlyRate: number,
  hours: number = DEFAULT_VISIT_HOURS,
): number {
  return hourlyRate * hours;
}

/**
 * Picks the right BTW label for a booking with one or more priced
 * items. Mixed bookings (e.g. interior cleaning + exterior windows
 * add-on) get the generic "incl. BTW" label; the per-line breakdown
 * carries the specific rate.
 */
export function vatLabelForBooking(items: Array<{ vat: number }>): string {
  const rates = new Set(items.map((i) => i.vat));
  if (rates.size > 1) return VAT_LABEL.mixed;
  if (rates.has(VAT_RATES.standard)) return VAT_LABEL.standard;
  return VAT_LABEL.reduced;
}

// =============================================================
// Duration calculation — m² ladder + bed/bath floor.
// =============================================================

/**
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
