export type ServiceId =
  | "regular"
  | "deep"
  | "movein"
  | "moveout"
  | "airbnb"
  | "office"
  | "builders";

export type FrequencyId = "once" | "monthly" | "biweekly" | "weekly";

export type HomeType = "apartment" | "house" | "studio";

export type Service = {
  id: ServiceId;
  label: string;
  baseRate: number;
  minHours: number;
  desc: string;
  icon: string;
};

export type Extra = {
  id: string;
  label: string;
  icon: string;
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
    icon: "🧽",
  },
  {
    id: "deep",
    label: "Deep cleaning",
    baseRate: BASE_RATE,
    minHours: 3,
    desc: "Every corner, every crevice",
    icon: "✨",
  },
  {
    id: "movein",
    label: "Move-in cleaning",
    baseRate: BASE_RATE,
    minHours: 3,
    desc: "Fresh-start ready",
    icon: "📦",
  },
  {
    id: "moveout",
    label: "Move-out cleaning",
    baseRate: BASE_RATE,
    minHours: 3,
    desc: "Deposit-back guarantee",
    icon: "🔑",
  },
  {
    id: "airbnb",
    label: "Airbnb turnover",
    baseRate: BASE_RATE,
    minHours: 2,
    desc: "Guest-ready reset",
    icon: "🛏️",
  },
  {
    id: "office",
    label: "Office cleaning",
    baseRate: BASE_RATE,
    minHours: 2,
    desc: "Workspace hygiene",
    icon: "💼",
  },
  {
    id: "builders",
    label: "After-builders",
    baseRate: BASE_RATE,
    minHours: 4,
    desc: "Post-renovation reset",
    icon: "🔨",
  },
];

export const EXTRAS: readonly Extra[] = [
  { id: "no_vacuum", label: "No vacuum at home", icon: "🧹", price: 50, max: 1 },
  { id: "no_products", label: "No cleaning products", icon: "🧴", price: 30, max: 1 },
  { id: "oven", label: "Inside oven", icon: "🔥", price: 30 },
  { id: "fridge", label: "Inside fridge", icon: "🌬️", price: 20 },
  { id: "dishwasher", label: "Inside dishwasher", icon: "🧼", price: 20 },
  { id: "microwave", label: "Inside microwave", icon: "🍽️", price: 20 },
  { id: "cabinets", label: "Inside cabinets", icon: "🚪", price: 10 },
  { id: "windows", label: "Inside windows", icon: "🪟", price: 10 },
  { id: "blinds", label: "Blinds", icon: "✨", price: 20 },
  { id: "balcony", label: "Balcony", icon: "🌿", price: 40 },
  { id: "laundry", label: "In-house laundry", icon: "👕", price: 30 },
  { id: "ironing", label: "Ironing", icon: "👔", price: 25 },
  { id: "walls", label: "Wall wipe-down", icon: "🧱", price: 30 },
  { id: "stairs", label: "Stairs", icon: "🪜", price: 20 },
  { id: "mold", label: "Bathroom mould treatment", icon: "🦠", price: 50 },
  { id: "organise", label: "Organisation", icon: "📦", price: 30 },
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
    id: "monthly",
    label: "Monthly",
    discount: 0.05,
    subLabel: "Save 5%",
    effectiveRate: 42,
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

export function estimateHours(
  beds: number,
  baths: number,
  serviceId: ServiceId | null,
): number {
  if (!serviceId) return 2;
  const base = ["deep", "moveout", "movein"].includes(serviceId) ? 3 : 2;
  const extra =
    Math.max(0, beds - 1) * 0.5 + Math.max(0, baths - 1) * 0.5;
  const mult =
    serviceId === "deep"
      ? 1.4
      : ["moveout", "movein"].includes(serviceId)
        ? 1.5
        : serviceId === "builders"
          ? 2
          : 1;
  return Math.max(2, Math.ceil((base + extra) * mult * 2) / 2);
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
};

export function calcTotal(state: BookingState): PriceBreakdown {
  const service = getService(state.serviceId);
  const frequency = getFrequency(state.frequencyId);
  const hours = service
    ? estimateHours(state.home.beds, state.home.baths, state.serviceId)
    : 0;
  const baseRate = service?.baseRate ?? BASE_RATE;
  const labor = baseRate * hours;
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
  const subtotal = laborDiscounted + extrasTotal;

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
  };
}

export const formatEuro = (n: number): string => {
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded) ? `€${rounded}` : `€${rounded.toFixed(2)}`;
};

export const formatHours = (h: number): string =>
  Number.isInteger(h) ? `${h}h` : `${h.toFixed(1)}h`;

export function buildBookingMessage(state: BookingState): string {
  const price = calcTotal(state);
  const { service, frequency, hours, addonLines, subtotal } = price;

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

const DRAFT_KEY = "ec_booking_draft";
const CONFIRMED_KEY = "ec_booking_confirmed";

export function loadDraft(): BookingState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<BookingState>;
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
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
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
