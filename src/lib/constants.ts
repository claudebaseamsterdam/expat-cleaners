export const BRAND = {
  name: "ExpatCleaners",
  city: "Amsterdam",
  whatsappNumber: "31644683837",
  whatsappMessage: encodeURIComponent("Hi! I'd like to book a clean."),
  bookingUrl: "/book",
  email: "hello@expat-cleaners.com",
  instagram: "https://instagram.com/expatcleaners",
  tagline: "English-speaking cleaners in Amsterdam",
  kvk: "94002185",
  btw: "NL005057342B81",
} as const;

export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=ExpatCleaners+Amsterdam+reviews";

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

export function waLink(message?: string): string {
  const text = message
    ? encodeURIComponent(message)
    : BRAND.whatsappMessage;
  return `https://wa.me/${BRAND.whatsappNumber}?text=${text}`;
}
