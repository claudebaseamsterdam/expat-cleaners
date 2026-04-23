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
  group: "supplies" | "addons";
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
    desc: "Standard home upkeep, on repeat.",
    icon: "🧽",
  },
  {
    id: "deep",
    label: "Deep cleaning",
    baseRate: BASE_RATE,
    minHours: 3,
    desc: "Every corner, every crevice.",
    icon: "✨",
  },
  {
    id: "movein",
    label: "Move-in cleaning",
    baseRate: BASE_RATE,
    minHours: 3,
    desc: "Fresh-start ready before the keys are yours.",
    icon: "📦",
  },
  {
    id: "moveout",
    label: "Move-out cleaning",
    baseRate: BASE_RATE,
    minHours: 3,
    desc: "Deposit-back standard for handover day.",
    icon: "🔑",
  },
  {
    id: "airbnb",
    label: "Airbnb turnover",
    baseRate: BASE_RATE,
    minHours: 2,
    desc: "Guest-ready reset between stays.",
    icon: "🛏️",
  },
  {
    id: "office",
    label: "Office cleaning",
    baseRate: BASE_RATE,
    minHours: 2,
    desc: "Workspace hygiene, Mon–Fri or weekly.",
    icon: "💼",
  },
  {
    id: "builders",
    label: "After-builders",
    baseRate: BASE_RATE,
    minHours: 4,
    desc: "Post-renovation dust-to-gleam reset.",
    icon: "🔨",
  },
];

export const EXTRAS: readonly Extra[] = [
  {
    id: "no_vacuum",
    label: "No vacuum at home",
    icon: "🧹",
    price: 50,
    max: 1,
    group: "supplies",
  },
  {
    id: "no_products",
    label: "No cleaning products at home",
    icon: "🧴",
    price: 30,
    max: 1,
    group: "supplies",
  },
  { id: "oven", label: "Inside oven", icon: "🔥", price: 30, group: "addons" },
  {
    id: "fridge",
    label: "Inside fridge",
    icon: "🌬️",
    price: 20,
    group: "addons",
  },
  {
    id: "dishwasher",
    label: "Inside dishwasher",
    icon: "🧼",
    price: 20,
    group: "addons",
  },
  {
    id: "microwave",
    label: "Inside microwave",
    icon: "🍽️",
    price: 20,
    group: "addons",
  },
  {
    id: "cabinets",
    label: "Inside cabinets",
    icon: "🚪",
    price: 10,
    group: "addons",
  },
  {
    id: "windows",
    label: "Inside windows",
    icon: "🪟",
    price: 10,
    group: "addons",
  },
  { id: "blinds", label: "Blinds", icon: "✨", price: 20, group: "addons" },
  { id: "balcony", label: "Balcony", icon: "🌿", price: 40, group: "addons" },
  {
    id: "laundry",
    label: "In-house laundry",
    icon: "👕",
    price: 30,
    group: "addons",
  },
  { id: "ironing", label: "Ironing", icon: "👔", price: 25, group: "addons" },
  {
    id: "walls",
    label: "Wall wipe-down",
    icon: "🧱",
    price: 30,
    group: "addons",
  },
  { id: "stairs", label: "Stairs", icon: "🪜", price: 20, group: "addons" },
  {
    id: "mold",
    label: "Bathroom mould treatment",
    icon: "🦠",
    price: 50,
    group: "addons",
  },
  {
    id: "organise",
    label: "Organisation",
    icon: "📦",
    price: 30,
    group: "addons",
  },
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

export type BookingState = {
  serviceId: ServiceId | null;
  home: {
    beds: number;
    baths: number;
    size: string;
    type: HomeType;
  };
  extras: Record<string, number>;
  frequencyId: FrequencyId;
  contact: {
    name: string;
    phone: string;
    email: string;
    address: string;
    postalCode: string;
  };
  preferredDate: string;
  preferredTime: string;
  notesCleaner: string;
  notesOffice: string;
};

export const defaultBookingState: BookingState = {
  serviceId: null,
  home: { beds: 1, baths: 1, size: "", type: "apartment" },
  extras: {},
  frequencyId: "once",
  contact: {
    name: "",
    phone: "+31 ",
    email: "",
    address: "",
    postalCode: "",
  },
  preferredDate: "",
  preferredTime: "",
  notesCleaner: "",
  notesOffice: "",
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
  const base =
    serviceId === "builders"
      ? 4
      : serviceId === "deep" ||
          serviceId === "movein" ||
          serviceId === "moveout"
        ? 3
        : 2;

  const multiplier =
    serviceId === "builders"
      ? 1.6
      : serviceId === "movein" || serviceId === "moveout"
        ? 1.4
        : serviceId === "deep"
          ? 1.3
          : 1.0;

  const extra =
    Math.max(0, beds - 1) * 0.5 + Math.max(0, baths - 1) * 0.5;

  const raw = (base + extra) * multiplier;
  const rounded = Math.round(raw * 2) / 2;
  return Math.max(base, rounded);
}

export type AddonLine = { extra: Extra; qty: number; line: number };

export type PriceBreakdown = {
  service: Service | undefined;
  frequency: Frequency;
  hours: number;
  baseRate: number;
  labor: number;
  laborAfterDiscount: number;
  laborSaved: number;
  addonLines: AddonLine[];
  extrasTotal: number;
  subtotal: number;
};

export function calcTotal(state: BookingState): PriceBreakdown {
  const service = getService(state.serviceId);
  const frequency = getFrequency(state.frequencyId);
  const hours = service
    ? estimateHours(state.home.beds, state.home.baths, state.serviceId)
    : 0;
  const baseRate = service?.baseRate ?? BASE_RATE;
  const labor = baseRate * hours;
  const laborAfterDiscount = labor * (1 - frequency.discount);
  const laborSaved = labor - laborAfterDiscount;

  const addonLines: AddonLine[] = Object.entries(state.extras)
    .map(([id, qty]) => {
      const extra = getExtra(id);
      if (!extra || !qty || qty <= 0) return null;
      return { extra, qty, line: extra.price * qty };
    })
    .filter((l): l is AddonLine => l !== null);

  const extrasTotal = addonLines.reduce((acc, l) => acc + l.line, 0);
  const subtotal = laborAfterDiscount + extrasTotal;

  return {
    service,
    frequency,
    hours,
    baseRate,
    labor,
    laborAfterDiscount,
    laborSaved,
    addonLines,
    extrasTotal,
    subtotal,
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
    return "Hey ExpatCleaners 👋 I'd like to book a clean.";
  }

  const lines: string[] = [];
  lines.push("Hey ExpatCleaners — I'd like to book a clean.");
  lines.push("");
  lines.push(`• Service: ${service.label}`);
  lines.push(
    `• Home: ${state.home.beds} bed / ${state.home.baths} bath / ${state.home.type}`,
  );
  if (state.home.size) lines.push(`• Size: ${state.home.size}m²`);
  lines.push(`• Estimated hours: ${formatHours(hours)}`);
  lines.push(`• Frequency: ${frequency.label}`);
  if (addonLines.length > 0) {
    lines.push("• Extras:");
    for (const { extra, qty } of addonLines) {
      lines.push(`   – ${extra.label}${qty > 1 ? ` ×${qty}` : ""}`);
    }
  }
  if (state.preferredDate)
    lines.push(`• Preferred date: ${state.preferredDate}`);
  if (state.preferredTime)
    lines.push(`• Preferred time: ${state.preferredTime}`);
  if (state.contact.address)
    lines.push(
      `• Address: ${state.contact.address}${state.contact.postalCode ? `, ${state.contact.postalCode}` : ""}`,
    );
  if (state.contact.name) lines.push(`• Name: ${state.contact.name}`);
  if (state.contact.phone && state.contact.phone.trim() !== "+31")
    lines.push(`• Phone: ${state.contact.phone}`);
  if (state.contact.email) lines.push(`• Email: ${state.contact.email}`);
  if (state.notesCleaner)
    lines.push(`• Notes for cleaner: ${state.notesCleaner}`);
  if (state.notesOffice)
    lines.push(`• Notes for office: ${state.notesOffice}`);
  lines.push("");
  lines.push(`Estimated total: ${formatEuro(subtotal)}`);
  lines.push("");
  lines.push("Please let me know availability 🙏");

  return lines.join("\n");
}

const DRAFT_KEY = "ec_booking_draft";

export function loadDraft(): BookingState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<BookingState>;
    return {
      ...defaultBookingState,
      ...parsed,
      home: { ...defaultBookingState.home, ...(parsed.home ?? {}) },
      contact: { ...defaultBookingState.contact, ...(parsed.contact ?? {}) },
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

export function isBookingReady(state: BookingState): boolean {
  if (!state.serviceId) return false;
  if (state.home.beds < 0 || state.home.baths < 1) return false;
  if (!state.frequencyId) return false;
  if (!state.contact.name.trim()) return false;
  const phoneDigits = state.contact.phone.replace(/\D/g, "");
  if (phoneDigits.length < 9) return false;
  if (!state.contact.address.trim()) return false;
  if (!state.contact.postalCode.trim()) return false;
  if (!state.preferredDate) return false;
  if (!state.preferredTime) return false;
  return true;
}

export const TIME_SLOTS = ["09:00", "12:00", "14:00", "16:00"] as const;

export const HOME_TYPES: { id: HomeType; label: string }[] = [
  { id: "apartment", label: "Apartment" },
  { id: "house", label: "House" },
  { id: "studio", label: "Studio" },
];
