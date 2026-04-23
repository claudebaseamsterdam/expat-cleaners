export const BRAND = {
  name: "ExpatCleaners",
  city: "Amsterdam",
  whatsappNumber: "31644683837",
  whatsappMessage: encodeURIComponent("Hi! I'd like to book a clean."),
  bookingUrl: "/book",
  email: "hello@expat-cleaners.com",
  instagram: "https://instagram.com/expatcleaners",
  tagline: "English-speaking cleaners in Amsterdam",
} as const;

export const WHATSAPP_URL = `https://wa.me/${BRAND.whatsappNumber}?text=${BRAND.whatsappMessage}`;

export const PRICING = {
  oneOff: 44,
  biweekly: 40,
  weekly: 36,
  deepClean: 44,
  minHours: 2,
  deepMinHours: 3,
} as const;

export const STATS = [
  { value: "200+", label: "Expats served" },
  { value: "4.9★", label: "Average rating" },
  { value: "60s", label: "Average booking time" },
  { value: "100%", label: "English-speaking" },
] as const;

export const NAV_LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#how", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#reviews", label: "Reviews" },
] as const;

export const UNSPLASH = {
  hero: "https://images.unsplash.com/photo-1616046229478-9901c5536a45",
  regular: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
  oneoff: "https://images.unsplash.com/photo-1583845112203-29329902332e",
  deep: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac",
  tenancy: "https://images.unsplash.com/photo-1558882224-dda166733046",
} as const;

export function waLink(message?: string): string {
  const text = message
    ? encodeURIComponent(message)
    : BRAND.whatsappMessage;
  return `https://wa.me/${BRAND.whatsappNumber}?text=${text}`;
}
