export type ServiceId =
  | "recurring"
  | "one-off"
  | "deep"
  | "move-in-out"
  | "airbnb";

export type FrequencyId = "one-time" | "monthly" | "biweekly" | "weekly";

export type AddonId =
  | "oven"
  | "fridge"
  | "windows"
  | "cabinets"
  | "dishwasher"
  | "microwave"
  | "laundry"
  | "ironing"
  | "balcony"
  | "blinds";

export type Service = {
  id: ServiceId;
  name: string;
  description: string;
  rate: number;
  minHours: number;
  allowsFrequency: boolean;
};

export type Addon = {
  id: AddonId;
  name: string;
  price: number;
};

export type Frequency = {
  id: FrequencyId;
  name: string;
  discount: number;
};

export const SERVICES: readonly Service[] = [
  {
    id: "recurring",
    name: "Recurring clean",
    description: "Regular upkeep on your schedule. Same cleaner when possible.",
    rate: 36,
    minHours: 2,
    allowsFrequency: true,
  },
  {
    id: "one-off",
    name: "One-off clean",
    description: "A single thorough clean, whenever you need it.",
    rate: 44,
    minHours: 2,
    allowsFrequency: false,
  },
  {
    id: "deep",
    name: "Deep clean",
    description: "Top-to-bottom reset for a truly spotless home.",
    rate: 44,
    minHours: 4,
    allowsFrequency: false,
  },
  {
    id: "move-in-out",
    name: "Move-in / move-out",
    description: "Handover-ready cleaning for landlords and tenants.",
    rate: 44,
    minHours: 4,
    allowsFrequency: false,
  },
  {
    id: "airbnb",
    name: "Airbnb turnover",
    description: "Guest-ready turnovers between stays.",
    rate: 44,
    minHours: 2,
    allowsFrequency: true,
  },
];

export const ADDONS: readonly Addon[] = [
  { id: "oven", name: "Inside oven", price: 25 },
  { id: "fridge", name: "Inside fridge", price: 20 },
  { id: "windows", name: "Inside windows", price: 20 },
  { id: "cabinets", name: "Inside cabinets", price: 15 },
  { id: "dishwasher", name: "Inside dishwasher", price: 15 },
  { id: "microwave", name: "Inside microwave", price: 10 },
  { id: "laundry", name: "Laundry", price: 15 },
  { id: "ironing", name: "Ironing", price: 30 },
  { id: "balcony", name: "Balcony", price: 25 },
  { id: "blinds", name: "Blinds", price: 15 },
];

export const FREQUENCIES: readonly Frequency[] = [
  { id: "one-time", name: "One-time", discount: 0 },
  { id: "monthly", name: "Monthly", discount: 0.05 },
  { id: "biweekly", name: "Every 2 weeks", discount: 0.1 },
  { id: "weekly", name: "Weekly", discount: 0.15 },
];

export type BookingState = {
  serviceId: ServiceId | null;
  hours: number;
  addons: Partial<Record<AddonId, number>>;
  frequencyId: FrequencyId;
  date: string;
  time: string;
  postcode: string;
  name: string;
  notes: string;
};

export const defaultBookingState: BookingState = {
  serviceId: null,
  hours: 2,
  addons: {},
  frequencyId: "one-time",
  date: "",
  time: "",
  postcode: "",
  name: "",
  notes: "",
};

export const getService = (id: ServiceId | null): Service | undefined =>
  SERVICES.find((s) => s.id === id);

export const getFrequency = (id: FrequencyId): Frequency =>
  FREQUENCIES.find((f) => f.id === id) ?? FREQUENCIES[0];

export const getAddon = (id: AddonId): Addon | undefined =>
  ADDONS.find((a) => a.id === id);

export type AddonLine = { addon: Addon; qty: number; line: number };

export type PriceBreakdown = {
  service: Service | undefined;
  frequency: Frequency;
  rate: number;
  hoursTotal: number;
  addonLines: AddonLine[];
  addonsTotal: number;
  subtotal: number;
  discount: number;
  total: number;
};

export function effectiveRate(
  service: Service | undefined,
  frequency: Frequency,
): number {
  if (!service) return 0;
  if (service.id === "recurring" && frequency.id !== "one-time") return 36;
  return service.rate;
}

export function computePrice(state: BookingState): PriceBreakdown {
  const service = getService(state.serviceId);
  const frequency = getFrequency(state.frequencyId);
  const rate = effectiveRate(service, frequency);
  const hoursTotal = rate * state.hours;

  const addonLines: AddonLine[] = (
    Object.entries(state.addons) as [AddonId, number | undefined][]
  )
    .map(([id, qty]) => {
      const addon = getAddon(id);
      if (!addon || !qty || qty <= 0) return null;
      return { addon, qty, line: addon.price * qty };
    })
    .filter((x): x is AddonLine => x !== null);

  const addonsTotal = addonLines.reduce((acc, l) => acc + l.line, 0);
  const subtotal = hoursTotal + addonsTotal;
  const applies = service?.allowsFrequency ? frequency.discount : 0;
  const discount = subtotal * applies;
  const total = Math.max(0, subtotal - discount);

  return {
    service,
    frequency,
    rate,
    hoursTotal,
    addonLines,
    addonsTotal,
    subtotal,
    discount,
    total,
  };
}

export const formatEuro = (n: number): string => {
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded) ? `€${rounded}` : `€${rounded.toFixed(2)}`;
};

export function buildWhatsAppMessage(state: BookingState): string {
  const price = computePrice(state);
  const { service, frequency, rate, addonLines, total } = price;

  if (!service) {
    return "Hi ExpatCleaners 👋 I'd like to book a cleaning.";
  }

  const lines: string[] = [];
  lines.push("Hi ExpatCleaners 👋");
  lines.push("");
  lines.push("I'd like to book a cleaning:");
  lines.push("");
  lines.push(`• Service: ${service.name}`);
  lines.push(`• Hours: ${state.hours} @ ${formatEuro(rate)}/hr`);
  if (service.allowsFrequency) {
    lines.push(`• Frequency: ${frequency.name}`);
  }
  if (addonLines.length > 0) {
    lines.push("• Add-ons:");
    for (const { addon, qty } of addonLines) {
      lines.push(`   – ${addon.name}${qty > 1 ? ` ×${qty}` : ""}`);
    }
  }
  if (state.date) lines.push(`• Date: ${state.date}`);
  if (state.time) lines.push(`• Time: ${state.time}`);
  if (state.postcode) lines.push(`• Postcode: ${state.postcode}`);
  if (state.name) lines.push(`• Name: ${state.name}`);
  if (state.notes) lines.push(`• Notes: ${state.notes}`);
  lines.push("");
  lines.push(`Estimated total: ${formatEuro(total)}`);

  return lines.join("\n");
}

export type TrackEvent =
  | "book_page_view"
  | "service_selected"
  | "addon_added"
  | "frequency_selected"
  | "whatsapp_click";

export function track(event: TrackEvent, data?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[] };
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event, ...(data ?? {}) });
  }
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[track]", event, data ?? {});
  }
}
