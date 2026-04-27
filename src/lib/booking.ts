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
  calculateDuration,
  parseSqm,
  type DurationResult,
} from "@/lib/pricing";

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
  max?: number;
};

export type Frequency = {
  id: FrequencyId;
  label: string;
  discount: number;
  subLabel: string;
  effectiveRate: number;
};

export const BASE_RATE = 44;

export const SERVICES: readonly Service[] = [
  {
    id: "regular",
    label: "Regular cleaning",
    baseRate: BASE_RATE,
    minHours: 2,
    desc: "Standard home maintenance",
    Icon: Sparkles,
    tier: "popular",
  },
  {
    id: "deep",
    label: "Deep cleaning",
    baseRate: BASE_RATE,
    minHours: 3,
    desc: "Every corner, every crevice",
    Icon: Wind,
    tier: "popular",
  },
  {
    id: "moveout",
    label: "Move-out cleaning",
    baseRate: BASE_RATE,
    minHours: 3,
    desc: "Deposit-back standard",
    Icon: KeyRound,
    tier: "popular",
  },
  {
    id: "movein",
    label: "Move-in cleaning",
    baseRate: BASE_RATE,
    minHours: 3,
    desc: "Fresh-start ready",
    Icon: Package,
    tier: "more",
  },
  {
    id: "airbnb",
    label: "Airbnb turnover",
    baseRate: BASE_RATE,
    minHours: 2,
    desc: "Guest-ready reset",
    Icon: BedDouble,
    tier: "more",
  },
  {
    id: "office",
    label: "Office cleaning",
    baseRate: BASE_RATE,
    minHours: 2,
    desc: "Workspace hygiene",
    Icon: Briefcase,
    tier: "more",
  },
  {
    id: "builders",
    label: "After-builders",
    baseRate: BASE_RATE,
    minHours: 4,
    desc: "Post-renovation reset",
    Icon: Hammer,
    tier: "more",
  },
];

/**
 * Extras catalog. The old `no_products` extra was removed: organic bio
 * cleaning products are now included in every clean at no extra charge.
 * `no_vacuum` remains as the only supplies add-on.
 */
export const EXTRAS: readonly Extra[] = [
  { id: "no_vacuum", label: "Bring our vacuum", Icon: Plug, price: 50, max: 1 },
  { id: "oven", label: "Inside oven", Icon: Flame, price: 30 },
  { id: "fridge", label: "Inside fridge", Icon: Snowflake, price: 20 },
  { id: "dishwasher", label: "Inside dishwasher", Icon: Droplets, price: 20 },
  { id: "microwave", label: "Inside microwave", Icon: Microwave, price: 20 },
  { id: "cabinets", label: "Inside cabinets", Icon: DoorOpen, price: 10 },
  { id: "windows", label: "Inside windows", Icon: Square, price: 10 },
  { id: "blinds", label: "Blinds", Icon: Blinds, price: 20 },
  { id: "balcony", label: "Balcony", Icon: TreePine, price: 40 },
  { id: "laundry", label: "In-house laundry", Icon: WashingMachine, price: 30 },
  { id: "ironing", label: "Ironing", Icon: Shirt, price: 25 },
  { id: "walls", label: "Wall wipe-down", Icon: PaintBucket, price: 30 },
  { id: "stairs", label: "Stairs", Icon: ArrowUpDown, price: 20 },
  { id: "mold", label: "Bathroom mould treatment", Icon: ShieldAlert, price: 50 },
  { id: "organise", label: "Organisation", Icon: FolderOpen, price: 30 },
];

export const FREQUENCIES: readonly Frequency[] = [
  {
    id: "once",
    label: "One-time",
    discount: 0,
    subLabel: "No commitment",
    effectiveRate: 44,
  },
  {
    id: "biweekly",
    label: "Bi-weekly",
    discount: 0.1,
    subLabel: "Save 10% · €40/hr",
    effectiveRate: 40,
  },
  {
    id: "weekly",
    label: "Weekly",
    discount: 0.15,
    subLabel: "Save 15% · €36/hr · Best value",
    effectiveRate: 36,
  },
];

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
  new Date(Date.now() + 2 * 86400_000).toISOString().slice(0, 10),
  new Date(Date.now() + 6 * 86400_000).toISOString().slice(0, 10),
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
   * True when the home is ≥ CUSTOM_QUOTE_THRESHOLD_SQM and we route the
   * user to a WhatsApp custom quote. Numeric fields (hours/labor/etc)
   * are still set to 0 in this case so consumers don't accidentally
   * render garbage; UI surfaces should branch on this flag and show the
   * custom-quote panel instead of the price block.
   */
  isCustomQuote: boolean;
};

export function calcTotal(state: BookingState): PriceBreakdown {
  const service = getService(state.serviceId);
  const frequency = getFrequency(state.frequencyId);

  const duration = service
    ? bookingDuration(state)
    : ({ kind: "estimate", hours: 0 } as DurationResult);

  const isCustomQuote = duration.kind === "custom-quote";
  const hours = duration.kind === "estimate" ? duration.hours : 0;

  const baseRate = service?.baseRate ?? BASE_RATE;
  const labor = isCustomQuote ? 0 : baseRate * hours;
  const laborDiscounted = labor * (1 - frequency.discount);
  const laborSaved = labor - laborDiscounted;

  const addonLines: AddonLine[] = Object.entries(state.extras)
    .map(([id, qty]) => {
      const extra = getExtra(id);
      if (!extra || !qty || qty <= 0) return null;
      return { extra, qty, line: extra.price * qty };
    })
    .filter((l): l is AddonLine => l !== null);

  const extrasTotal = addonLines.reduce((acc, l) => acc + l.line, 0);
  // For a custom quote the extras line items still display in the
  // breakdown, but we don't roll them into a subtotal — the quote is
  // negotiated on WhatsApp.
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
  };
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

export function buildBookingMessage(state: BookingState): string {
  const price = calcTotal(state);
  const { service, frequency, hours, addonLines, subtotal, isCustomQuote } =
    price;

  if (isCustomQuote) {
    return buildCustomQuoteMessage(parseSqm(state.home.size));
  }

  if (!service) {
    return "Hey ExpatCleaners — I'd like to book a clean.";
  }

  const lines: string[] = [];
  lines.push("Hey ExpatCleaners — I'd like to book:");
  lines.push(
    `- ${service.label} · ${formatHours(hours)} · ${frequency.label}`,
  );
  if (state.details.address) {
    lines.push(
      `- ${state.details.address}${state.details.postalCode ? `, ${state.details.postalCode}` : ""}`,
    );
  }
  if (addonLines.length > 0) {
    const list = addonLines
      .map((l) => `${l.extra.label}${l.qty > 1 ? ` ×${l.qty}` : ""}`)
      .join(", ");
    lines.push(`- Extras: ${list}`);
  }
  if (state.preferredDate || state.preferredTime) {
    lines.push(
      `- Preferred: ${state.preferredDate || "—"} ${state.preferredTime || ""}`.trim(),
    );
  }
  if (state.waitingListJoined) {
    lines.push("- On waiting list for earliest opening");
  }
  lines.push(`Total estimate: ${formatEuro(subtotal)}`);
  if (state.details.name) lines.push(`— ${state.details.name}`);

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
  indicativePrice: number;
};

export const BUNDLES: readonly Bundle[] = [
  {
    id: "first_time",
    name: "First-time reset",
    serviceId: "deep",
    frequencyId: "once",
    extraIds: ["oven", "fridge"],
    bullets: [
      "Deep clean — every corner",
      "Inside oven",
      "Inside fridge",
    ],
    indicativePrice: 182,
  },
  {
    id: "recurring_essentials",
    name: "Recurring essentials",
    serviceId: "regular",
    frequencyId: "weekly",
    extraIds: ["windows", "mold"],
    bullets: [
      "Weekly regular clean",
      "Inside windows",
      "Bathroom mould treatment",
    ],
    indicativePrice: 132,
  },
  {
    id: "moveout",
    name: "Move-out package",
    serviceId: "moveout",
    frequencyId: "once",
    extraIds: ["windows", "cabinets", "walls"],
    bullets: [
      "Move-out clean — deposit-back standard",
      "Inside windows + cabinets",
      "Wall wipe-down",
    ],
    indicativePrice: 226,
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
