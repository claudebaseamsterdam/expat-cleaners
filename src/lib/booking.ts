import {
  Sparkles,
  Wind,
  Package,
  KeyRound,
  BedDouble,
  Briefcase,
  Hammer,
  Plug,
  Flame,
  Snowflake,
  Droplets,
  Microwave,
  DoorOpen,
  Square,
  Blinds,
  TreePine,
  Shirt,
  WashingMachine,
  PaintBucket,
  ArrowUpDown,
  ShieldAlert,
  FolderOpen,
  type LucideIcon,
} from "lucide-react";
import {
  APARTMENT_DEEP_PRICE,
  APARTMENT_MOVE_PRICE,
  calculateDuration,
  findAddon,
  formatEur,
  ONE_OFF_RATE,
  parseSqm,
  RECURRING_RATES,
  SERVICE_MINIMUMS,
  SERVICE_VAT,
  VACUUM_RENTAL,
  selectDeepCleanPackage,
  selectMovePackage,
  vatLabelForBooking,
  type DurationResult,
} from "@/lib/pricing";
import { formatLocalDate } from "@/lib/date";

export type ServiceId =
  | "regular"
  | "deep"
  | "movein"
  | "moveout"
  | "airbnb"
  | "office"
  | "builders";

/**
 * Frequency tiers — three only.
 * Monthly was dropped during the QA round 6 cleanup because it diluted
 * the recurring-vs-one-off decision; existing monthly customers keep
 * their rate, this just removes it from the booking flow.
 */
export type FrequencyId = "once" | "biweekly" | "weekly";

export type HomeType = "apartment" | "house" | "studio";

/** "popular" services land in the prominent top row of the picker;
 *  "more" services collapse under a "More services ↓" toggle. */
export type ServiceTier = "popular" | "more";

export type Service = {
  id: ServiceId;
  label: string;
  baseRate: number;
  minHours: number;
  desc: string;
  Icon: LucideIcon;
  tier: ServiceTier;
};

export type Extra = {
  id: string;
  label: string;
  Icon: LucideIcon;
  price: number;
  /**
   * VAT rate applied to this add-on. 0.21 for outdoor / specialist
   * (e.g. balcony, exterior windows); 0.09 for everything inside the
   * home. Sourced from pricing.ts ADD_ONS / VACUUM_RENTAL — never
   * hand-rolled.
   */
  vat: number;
  max?: number;
};

export type Frequency = {
  id: FrequencyId;
  label: string;
  discount: number;
  subLabel: string;
  effectiveRate: number;
};

/**
 * Per-service `baseRate` is currently the one-off hourly rate for every
 * service. Phase 1.3 stopped using it for labour calc (the frequency
 * rate is the rate now); it remains in the breakdown surface for
 * downstream consumers and will be replaced with fixed-package pricing
 * for deep / move-out in Phase 4. `minHours` is sourced from pricing.ts
 * SERVICE_MINIMUMS so the booking flow and the homepage agree.
 */
export const BASE_RATE = ONE_OFF_RATE.hourly;

export const SERVICES: readonly Service[] = [
  {
    id: "regular",
    label: "Regular cleaning",
    baseRate: BASE_RATE,
    minHours: SERVICE_MINIMUMS.regular,
    desc: "Standard home maintenance",
    Icon: Sparkles,
    tier: "popular",
  },
  {
    id: "deep",
    label: "Deep cleaning",
    baseRate: BASE_RATE,
    minHours: SERVICE_MINIMUMS.deep,
    desc: "Every corner, every crevice",
    Icon: Wind,
    tier: "popular",
  },
  {
    id: "moveout",
    label: "Move-out cleaning",
    baseRate: BASE_RATE,
    minHours: SERVICE_MINIMUMS.moveout,
    desc: "Deposit-back standard",
    Icon: KeyRound,
    tier: "popular",
  },
  {
    id: "movein",
    label: "Move-in cleaning",
    baseRate: BASE_RATE,
    minHours: SERVICE_MINIMUMS.movein,
    desc: "Fresh-start ready",
    Icon: Package,
    tier: "more",
  },
  {
    id: "airbnb",
    label: "Airbnb turnover",
    baseRate: BASE_RATE,
    minHours: SERVICE_MINIMUMS.airbnb,
    desc: "Guest-ready reset",
    Icon: BedDouble,
    tier: "more",
  },
  {
    id: "office",
    label: "Office cleaning",
    baseRate: BASE_RATE,
    minHours: SERVICE_MINIMUMS.office,
    desc: "Workspace hygiene",
    Icon: Briefcase,
    tier: "more",
  },
  {
    id: "builders",
    label: "After-builders",
    baseRate: BASE_RATE,
    minHours: SERVICE_MINIMUMS.builders,
    desc: "Post-renovation reset",
    Icon: Hammer,
    tier: "more",
  },
];

/**
 * Extras catalog. The old `no_products` extra was removed: organic bio
 * cleaning products are now included in every clean at no extra charge.
 * `no_vacuum` remains as the only supplies add-on (rental).
 *
 * Phase 2: every `price` is sourced from `lib/pricing.ts`. Booking-
 * internal IDs (e.g. `windows`, `mold`, `organise`) map to canonical
 * pricing.ts ADD_ONS IDs (e.g. `windows_in`, `mould`, `organisation`)
 * via the second arg to findAddon(). The EXTRAS shape (with Icon) is
 * kept; only the numbers are now derived. Phase 4 will likely rename
 * the booking-internal IDs to match the canonical ones.
 */
// Helper so each row is a one-liner that pulls both price AND vat from
// pricing.ts. Booking-internal id (used for state.extras keys, BUNDLES,
// and existing UI logic) maps to the canonical pricing.ts ADD_ONS id.
const a = (id: string) => {
  const ax = findAddon(id);
  return { price: ax.price, vat: ax.vat };
};

export const EXTRAS: readonly Extra[] = [
  { id: "no_vacuum", label: VACUUM_RENTAL.label, Icon: Plug, price: VACUUM_RENTAL.price, vat: VACUUM_RENTAL.vat, max: 1 },
  { id: "oven", label: "Inside oven", Icon: Flame, ...a("oven") },
  { id: "fridge", label: "Inside fridge", Icon: Snowflake, ...a("fridge") },
  { id: "dishwasher", label: "Inside dishwasher", Icon: Droplets, ...a("dishwasher") },
  { id: "microwave", label: "Inside microwave", Icon: Microwave, ...a("microwave") },
  { id: "cabinets", label: "Inside cabinets", Icon: DoorOpen, ...a("cabinets") },
  { id: "windows", label: "Inside windows", Icon: Square, ...a("windows_in") },
  { id: "blinds", label: "Blinds", Icon: Blinds, ...a("blinds") },
  { id: "balcony", label: "Balcony", Icon: TreePine, ...a("balcony") },
  { id: "laundry", label: "In-house laundry", Icon: WashingMachine, ...a("laundry") },
  { id: "ironing", label: "Ironing", Icon: Shirt, ...a("ironing") },
  { id: "walls", label: "Wall wipe-down", Icon: PaintBucket, ...a("walls") },
  { id: "stairs", label: "Stairs", Icon: ArrowUpDown, ...a("stairs") },
  { id: "mold", label: "Bathroom mould treatment", Icon: ShieldAlert, ...a("mould") },
  { id: "organise", label: "Organisation", Icon: FolderOpen, ...a("organisation") },
];

/**
 * Frequency picker — per-frequency hourly rates, no discount math.
 *
 * Rates come from pricing.ts (ONE_OFF_RATE for one-time, RECURRING_RATES
 * for bi-weekly / weekly). Edit there, never here.
 *
 * `discount` stays on the type for backwards-compat with the
 * SummaryCard / MobileSummaryBar guards (`hasDiscount = laborSaved >
 * 0.01`); always 0 here, so those guards naturally hide the discount
 * row. `effectiveRate` is the sole source of truth for labour pricing.
 */
export const FREQUENCIES: readonly Frequency[] = [
  {
    id: "once",
    label: ONE_OFF_RATE.label,
    discount: 0,
    subLabel: "No commitment",
    effectiveRate: ONE_OFF_RATE.hourly,
  },
  {
    id: "biweekly",
    label: RECURRING_RATES.biweekly.label,
    discount: 0,
    subLabel: "Same cleaner",
    effectiveRate: RECURRING_RATES.biweekly.hourly,
  },
  {
    id: "weekly",
    label: RECURRING_RATES.weekly.label,
    discount: 0,
    subLabel: "Best value",
    effectiveRate: RECURRING_RATES.weekly.hourly,
  },
];

/**
 * Phase 7.3 — `/book?service=…` deep-link mapping. Each query value
 * pre-selects a service tile and a frequency. Recurring → weekly
 * (cheapest cadence); other params fall back to one-time which matches
 * `defaultBookingState.frequencyId`. The booking page applies this on
 * mount and then strips the param so a refresh doesn't override later
 * manual choices.
 */
const SERVICE_QUERY_MAP: Record<
  string,
  { serviceId: ServiceId; frequencyId: FrequencyId }
> = {
  recurring: { serviceId: "regular", frequencyId: "weekly" },
  oneoff: { serviceId: "regular", frequencyId: "once" },
  deep: { serviceId: "deep", frequencyId: "once" },
  moveout: { serviceId: "moveout", frequencyId: "once" },
  movein: { serviceId: "movein", frequencyId: "once" },
};

export function parseServiceQueryParam(
  value: string | null | undefined,
): { serviceId: ServiceId; frequencyId: FrequencyId } | null {
  if (!value) return null;
  return SERVICE_QUERY_MAP[value] ?? null;
}

export const TIME_SLOTS = ["09:00", "12:00", "14:00", "16:00"] as const;
export type TimeSlot = (typeof TIME_SLOTS)[number];

export const HOME_TYPES: { id: HomeType; label: string }[] = [
  { id: "apartment", label: "Apartment" },
  { id: "house", label: "House" },
  { id: "studio", label: "Studio" },
];

export const FULLY_BOOKED_DATES: readonly string[] = [
  // Mock fully-booked dates (will be replaced by real availability API later)
  // Dates relative to the "today" in dev so the waiting-list flow is visible.
  // Use formatLocalDate so these match the calendar's local-date keys —
  // toISOString().slice(0,10) would shift CEST midnight back a UTC day.
  formatLocalDate(new Date(Date.now() + 2 * 86400_000)),
  formatLocalDate(new Date(Date.now() + 6 * 86400_000)),
];

export function isDateFullyBooked(date: string): boolean {
  if (!date) return false;
  return FULLY_BOOKED_DATES.includes(date);
}

export type BookingState = {
  details: {
    name: string;
    email: string;
    phone: string;
    address: string;
    postalCode: string;
  };
  serviceId: ServiceId | null;
  home: {
    beds: number;
    baths: number;
    size: string;
    type: HomeType;
  };
  extras: Record<string, number>;
  frequencyId: FrequencyId;
  preferredDate: string;
  preferredTime: string;
  waitingListJoined: boolean;
  waitingListNote: string;
  notesCleaner: string;
  notesOffice: string;
  consent: boolean;
  couponCode: string;
};

export const defaultBookingState: BookingState = {
  details: {
    name: "",
    email: "",
    phone: "+31 ",
    address: "",
    postalCode: "",
  },
  serviceId: null,
  home: { beds: 1, baths: 1, size: "", type: "apartment" },
  extras: {},
  frequencyId: "once",
  preferredDate: "",
  preferredTime: "",
  waitingListJoined: false,
  waitingListNote: "",
  notesCleaner: "",
  notesOffice: "",
  consent: false,
  couponCode: "",
};

export const getService = (id: ServiceId | null): Service | undefined =>
  SERVICES.find((s) => s.id === id);

export const getFrequency = (id: FrequencyId): Frequency =>
  FREQUENCIES.find((f) => f.id === id) ?? FREQUENCIES[0];

export const getExtra = (id: string): Extra | undefined =>
  EXTRAS.find((e) => e.id === id);

/**
 * Compute the duration result for a booking state.
 * Thin adapter: parses the m² string field, looks up the service min,
 * delegates to lib/pricing.calculateDuration. All pricing math lives
 * in lib/pricing.ts (single source of truth) — never duplicate it.
 */
export function bookingDuration(state: BookingState): DurationResult {
  const service = getService(state.serviceId);
  return calculateDuration({
    sqm: parseSqm(state.home.size),
    bedrooms: state.home.beds,
    bathrooms: state.home.baths,
    homeType: state.home.type,
    serviceMinHours: service?.minHours,
  });
}

export type AddonLine = { extra: Extra; qty: number; line: number };

/**
 * Phase 4.7 — discriminator for the three pricing modes the booking
 * surface can be in:
 *  - "hourly"        → frequency.effectiveRate × estimated hours
 *                       (regular, airbnb, office, after-builders)
 *  - "fixed"         → DEEP_CLEAN_PACKAGES / MOVE_PACKAGES tier price
 *                       (deep, move-in, move-out under the large tier)
 *  - "custom-quote"  → home is too big to price in-flow; user is sent
 *                       to WhatsApp with a pre-filled message. Triggered
 *                       by either the hourly threshold (≥156 m²) or
 *                       a fixed-price service landing on the "large"
 *                       tier (120 m²+ / 4+ bed).
 */
export type PricingMode = "hourly" | "fixed" | "custom-quote";

const FIXED_PRICE_SERVICES: ReadonlySet<ServiceId> = new Set([
  "deep",
  "movein",
  "moveout",
]);

/** True when the service is priced as a fixed package, not hourly.
 *  Single source of truth shared by calcTotal (engine) and the UI
 *  layer (frequency-picker hide / WhatsApp template branch). */
export function isFixedPriceService(
  serviceId: ServiceId | null | undefined,
): boolean {
  if (!serviceId) return false;
  return FIXED_PRICE_SERVICES.has(serviceId);
}

export type PriceBreakdown = {
  service: Service | undefined;
  frequency: Frequency;
  hours: number;
  baseRate: number;
  labor: number;
  laborDiscounted: number;
  laborSaved: number;
  addonLines: AddonLine[];
  extrasTotal: number;
  subtotal: number;
  discount: number;
  /**
   * True when the home is ≥ CUSTOM_QUOTE_THRESHOLD_SQM (hourly path) or
   * lands on the "large" tier of a fixed-price package. UI surfaces
   * should branch on this flag and show the custom-quote panel instead
   * of the price block.
   */
  isCustomQuote: boolean;
  /** See PricingMode docs above. */
  pricingMode: PricingMode;
  /** "Apartment · 50–80 m² · 4h" — only set in fixed mode (and the
   *  fixed-large custom-quote case so the WhatsApp panel can name the
   *  tier the customer ended up on). Null in hourly mode. */
  selectedPackageLabel: string | null;
  /** "studio" | "apartment" | "family" | "large" — only set in fixed
   *  / fixed-custom-quote modes; null in hourly. */
  selectedPackageId: string | null;
};

export function calcTotal(state: BookingState): PriceBreakdown {
  const service = getService(state.serviceId);
  const frequency = getFrequency(state.frequencyId);
  const sqm = parseSqm(state.home.size);
  const beds = state.home.beds;

  // Defaults — overwritten by whichever branch we land in below.
  let pricingMode: PricingMode = "hourly";
  let isCustomQuote = false;
  let labor = 0;
  let hours = 0;
  let selectedPackageLabel: string | null = null;
  let selectedPackageId: string | null = null;

  if (!service) {
    // No service yet — empty estimate. Mode stays "hourly" so the
    // SummaryCard renders its initial "Select a service…" copy.
    pricingMode = "hourly";
  } else if (FIXED_PRICE_SERVICES.has(service.id)) {
    // Phase 4.7 — fixed-price flow. Tier picked from the home's
    // (sqm, beds) via selectPackageId in pricing.ts. The bedroom +
    // bathroom + size controls now move the customer between tiers
    // (each tier is a single fixed price); they no longer drift the
    // hourly subtotal.
    const pkg =
      service.id === "deep"
        ? selectDeepCleanPackage(sqm, beds)
        : selectMovePackage(sqm, beds);
    selectedPackageId = pkg.id;

    if ("customQuote" in pkg && pkg.customQuote) {
      // Large tier (120 m²+ / 4+ bed) → routed to WhatsApp custom
      // quote. The tier label still gets surfaced so the WhatsApp
      // pre-filled message can name it.
      pricingMode = "custom-quote";
      isCustomQuote = true;
      selectedPackageLabel = `${pkg.label} · ${pkg.sizeRange}`;
    } else {
      pricingMode = "fixed";
      labor = pkg.price as number;
      // DEEP_CLEAN_PACKAGES carry estimatedHours; MOVE_PACKAGES don't.
      const estHours =
        "estimatedHours" in pkg && typeof pkg.estimatedHours === "number"
          ? pkg.estimatedHours
          : 0;
      hours = estHours;
      selectedPackageLabel =
        estHours > 0
          ? `${pkg.label} · ${pkg.sizeRange} · ${estHours}h`
          : `${pkg.label} · ${pkg.sizeRange}`;
    }
  } else {
    // Hourly flow — regular, airbnb, office, after-builders. Existing
    // calculator: bookingDuration → hours, frequency rate → labor.
    pricingMode = "hourly";
    const duration = bookingDuration(state);
    isCustomQuote = duration.kind === "custom-quote";
    hours = duration.kind === "estimate" ? duration.hours : 0;
    labor = isCustomQuote ? 0 : frequency.effectiveRate * hours;
  }

  // Phase 1.3 leftovers: discount math is no-op'd. Keep the fields so
  // older consumers (SummaryCard's hasDiscount guard) keep their
  // self-hiding behaviour.
  const baseRate = service?.baseRate ?? BASE_RATE;
  const laborDiscounted = labor;
  const laborSaved = 0;

  const addonLines: AddonLine[] = Object.entries(state.extras)
    .map(([id, qty]) => {
      const extra = getExtra(id);
      if (!extra || !qty || qty <= 0) return null;
      return { extra, qty, line: extra.price * qty };
    })
    .filter((l): l is AddonLine => l !== null);

  const extrasTotal = addonLines.reduce((acc, l) => acc + l.line, 0);
  // Custom-quote skips the subtotal (price is negotiated on WhatsApp).
  // Fixed and hourly both sum labour + add-ons.
  const subtotal = isCustomQuote ? 0 : laborDiscounted + extrasTotal;

  return {
    service,
    frequency,
    hours,
    baseRate,
    labor,
    laborDiscounted,
    laborSaved,
    addonLines,
    extrasTotal,
    subtotal,
    discount: frequency.discount,
    isCustomQuote,
    pricingMode,
    selectedPackageLabel,
    selectedPackageId,
  };
}

/**
 * Per-booking VAT items list — service rate + each selected add-on's
 * VAT rate. Feed to pricing.ts `vatLabelForBooking` / `vatFootnoteText`
 * to choose between the single-rate ("9%" / "21%") and mixed-rate
 * ("Interior 9%, exterior 21%") labels.
 */
export function vatItemsForBooking(
  state: BookingState,
): Array<{ vat: number }> {
  const items: Array<{ vat: number }> = [];
  if (state.serviceId) {
    items.push({ vat: SERVICE_VAT[state.serviceId] });
  }
  for (const [id, qty] of Object.entries(state.extras)) {
    if (qty <= 0) continue;
    const extra = getExtra(id);
    if (extra) items.push({ vat: extra.vat });
  }
  return items;
}

export const formatEuro = (n: number): string => {
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded) ? `€${rounded}` : `€${rounded.toFixed(2)}`;
};

export const formatHours = (h: number): string =>
  Number.isInteger(h) ? `${h}h` : `${h.toFixed(1)}h`;

/**
 * Build the WhatsApp deep-link message for a custom-quote home. The
 * sticky summary panels and the booking flow both fall back to this
 * when the home is ≥ CUSTOM_QUOTE_THRESHOLD_SQM.
 */
export function buildCustomQuoteMessage(sqm: number | null): string {
  const sizeLabel =
    typeof sqm === "number" && sqm > 0 ? `${sqm}m²` : "large";
  return `Hi! I'd like a quote for a ${sizeLabel} home.`;
}

/**
 * Phase 4.6 — WhatsApp deep-link message body. Per the brief:
 *
 *   Hey ExpatCleaners — I'd like to book:
 *
 *   * <service> · <hours>h · <frequency>
 *   * Preferred: <YYYY-MM-DD> <HH:MM>
 *   * <address>, <postcode>
 *
 *   Total estimate: €<total> (<vatLabel>)
 *   Reach me on: <phone> <email>
 *
 * Notes:
 *  - Address bullet is its own line (the spec line accidentally
 *    smushed it onto the same line as the total — split here for
 *    legibility on WhatsApp).
 *  - Extras and waiting-list are still emitted as their own bullets
 *    when present.
 *  - vatLabel is whichever of "incl. 9% BTW" / "incl. 21% BTW" /
 *    "incl. BTW" applies to the booking (interior + exterior add-ons
 *    yield the mixed label).
 *  - Date is `state.preferredDate` which is already YYYY-MM-DD in the
 *    user's local timezone (Phase 1.1 fixed the toISOString bug).
 */
export function buildBookingMessage(state: BookingState): string {
  const price = calcTotal(state);
  const {
    service,
    frequency,
    hours,
    addonLines,
    subtotal,
    isCustomQuote,
    pricingMode,
    selectedPackageLabel,
  } = price;

  if (isCustomQuote) {
    return buildCustomQuoteMessage(parseSqm(state.home.size));
  }

  if (!service) {
    return "Hey ExpatCleaners — I'd like to book a clean.";
  }

  const isFixed = pricingMode === "fixed";

  const lines: string[] = [];
  lines.push("Hey ExpatCleaners — I'd like to book:");
  lines.push("");
  // Phase 4.7 — fixed-price services emit the package label and skip
  // the frequency clause (frequency doesn't apply to a one-time
  // fixed-price package). Hourly services keep the Phase 4.6 shape.
  if (isFixed) {
    const label = selectedPackageLabel ?? service.label;
    lines.push(`* ${service.label} · ${label}`);
  } else {
    lines.push(
      `* ${service.label} · ${formatHours(hours)} · ${frequency.label}`,
    );
  }
  if (state.preferredDate || state.preferredTime) {
    const datePart = state.preferredDate || "—";
    const timePart = state.preferredTime ? ` ${state.preferredTime}` : "";
    lines.push(`* Preferred: ${datePart}${timePart}`);
  }
  if (state.details.address || state.details.postalCode) {
    const parts = [state.details.address, state.details.postalCode]
      .map((s) => (s ?? "").trim())
      .filter(Boolean);
    lines.push(`* ${parts.join(", ")}`);
  }
  if (addonLines.length > 0) {
    const list = addonLines
      .map((l) => `${l.extra.label}${l.qty > 1 ? ` ×${l.qty}` : ""}`)
      .join(", ");
    lines.push(`* Extras: ${list}`);
  }
  if (state.waitingListJoined) {
    lines.push("* On waiting list for earliest opening");
  }
  lines.push("");
  // Phase 4.7 — fixed-price packages get a hard "Total:" not "Total
  // estimate:" so the customer reads it as a commitment, not a guess.
  // Hourly stays as "Total estimate" because the actual charge depends
  // on time worked.
  const vatLabel = vatLabelForBooking(vatItemsForBooking(state));
  const totalPrefix = isFixed ? "Total" : "Total estimate";
  lines.push(`${totalPrefix}: ${formatEuro(subtotal)} (${vatLabel})`);

  // "Reach me on:" — only emit when at least one contact field is set.
  // Phone and email are space-separated per spec.
  const reach = [state.details.phone, state.details.email]
    .map((s) => (s ?? "").trim())
    .filter(Boolean)
    .join(" ");
  if (reach) {
    lines.push(`Reach me on: ${reach}`);
  }

  return lines.join("\n");
}

export function buildConfirmedMessage(ref: string): string {
  return `Hey ExpatCleaners — I just confirmed my booking (ref ${ref}). Looking forward to hearing from you 🙌`;
}

/**
 * localStorage draft key. Bumped to v1 (and the namespaced
 * "expatcleaners_" prefix) so old `ec_booking_draft` payloads don't
 * leak in with stale fields after the schema changes (frequency tier
 * removal, supplies extra removal).
 *
 * Stored payload is wrapped in { state, savedAt } so we can expire
 * stale drafts after 7 days — see loadDraft.
 */
const DRAFT_KEY = "expatcleaners_booking_state_v1";
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const CONFIRMED_KEY = "expatcleaners_booking_confirmed_v1";

type DraftEnvelope = {
  state: BookingState;
  savedAt: number;
};

export function loadDraft(): BookingState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const env = JSON.parse(raw) as Partial<DraftEnvelope>;
    if (!env || typeof env.savedAt !== "number" || !env.state) return null;
    if (Date.now() - env.savedAt > DRAFT_TTL_MS) {
      window.localStorage.removeItem(DRAFT_KEY);
      return null;
    }
    const parsed = env.state;
    return {
      ...defaultBookingState,
      ...parsed,
      details: { ...defaultBookingState.details, ...(parsed.details ?? {}) },
      home: { ...defaultBookingState.home, ...(parsed.home ?? {}) },
      extras: parsed.extras ?? {},
    };
  } catch {
    return null;
  }
}

export function saveDraft(state: BookingState): void {
  if (typeof window === "undefined") return;
  try {
    const envelope: DraftEnvelope = { state, savedAt: Date.now() };
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(envelope));
  } catch {
    /* ignore quota errors */
  }
}

export type ConfirmedBooking = {
  ref: string;
  state: BookingState;
  at: string;
};

export function saveConfirmed(c: ConfirmedBooking): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONFIRMED_KEY, JSON.stringify(c));
  } catch {
    /* ignore */
  }
}

export function loadConfirmed(): ConfirmedBooking | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONFIRMED_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConfirmedBooking;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateDetails(d: BookingState["details"]): {
  name: boolean;
  email: boolean;
  phone: boolean;
  address: boolean;
  postalCode: boolean;
  allRequired: boolean;
} {
  const name = d.name.trim().length >= 2;
  const email = EMAIL_RE.test(d.email);
  const phoneDigits = d.phone.replace(/\D/g, "");
  const phone = phoneDigits.length >= 9;
  const address = d.address.trim().length >= 4;
  const postalCode = /^\s*\d{4}\s?[A-Z]{0,2}\s*$/i.test(d.postalCode);
  return {
    name,
    email,
    phone,
    address,
    postalCode,
    allRequired: name && email && phone && address && postalCode,
  };
}

export function isBookingReady(state: BookingState): boolean {
  const v = validateDetails(state.details);
  if (!v.allRequired) return false;
  if (!state.serviceId) return false;
  if (state.home.beds < 0 || state.home.baths < 1) return false;
  if (!state.frequencyId) return false;
  const hasSlot = !!state.preferredDate && !!state.preferredTime;
  const hasWaitingList =
    !!state.preferredDate && state.waitingListJoined;
  if (!hasSlot && !hasWaitingList) return false;
  return true;
}

// ---------- Bundles ----------

/**
 * Pre-built bundles displayed above the granular service grid.
 * Each bundle pre-fills a service, frequency, and a set of add-ons
 * when the user clicks "Select" or "Customize".
 *
 * Indicative prices are computed for a default 1-bed / 1-bath
 * apartment using the same calcTotal pipeline. They're shown to give
 * the user a starting figure; the live total updates as soon as the
 * bundle is applied.
 */
export type Bundle = {
  id: "first_time" | "recurring_essentials" | "moveout";
  name: string;
  serviceId: ServiceId;
  frequencyId: FrequencyId;
  extraIds: string[];
  bullets: [string, string, string];
  /**
   * Price line shown under the bundle's bullets. Two patterns:
   *  - Anchor + add-ons   → e.g. "€295 + add-ons" (First-time reset,
   *    Move-out package). The anchor is the apartment-tier fixed
   *    package price; add-ons accumulate on top in the live total.
   *  - Live-total-only    → "Live total updates after you select"
   *    (Recurring essentials — hourly product, no fixed anchor).
   */
  priceLine: string;
};

export const BUNDLES: readonly Bundle[] = [
  {
    id: "first_time",
    name: "First-time reset",
    serviceId: "deep",
    frequencyId: "once",
    extraIds: ["oven", "fridge"],
    bullets: [
      "Apartment Deep Clean",
      "Inside oven",
      "Inside fridge",
    ],
    priceLine: `${formatEur(APARTMENT_DEEP_PRICE)} + add-ons`,
  },
  {
    id: "recurring_essentials",
    name: "Recurring essentials",
    serviceId: "regular",
    frequencyId: "weekly",
    extraIds: ["windows", "mold"],
    bullets: [
      "Weekly clean",
      "Inside windows",
      "Bathroom mould",
    ],
    priceLine: "Live total updates after you select",
  },
  {
    id: "moveout",
    name: "Move-out package",
    serviceId: "moveout",
    frequencyId: "once",
    extraIds: ["windows", "cabinets", "walls"],
    bullets: [
      "Apartment Move Clean",
      "Inside windows + cabinets",
      "Wall wipe-down",
    ],
    priceLine: `${formatEur(APARTMENT_MOVE_PRICE)} + add-ons`,
  },
];

export const getBundle = (id: Bundle["id"]): Bundle | undefined =>
  BUNDLES.find((b) => b.id === id);

/**
 * Apply a bundle to a booking state — sets service + frequency and
 * adds each extra at qty 1 (without removing other extras the user
 * may have already toggled, since the brief calls this a "starting
 * point").
 */
export function applyBundle(state: BookingState, bundle: Bundle): BookingState {
  const extras: Record<string, number> = { ...state.extras };
  for (const id of bundle.extraIds) {
    extras[id] = Math.max(extras[id] ?? 0, 1);
  }
  return {
    ...state,
    serviceId: bundle.serviceId,
    frequencyId: bundle.frequencyId,
    extras,
  };
}
