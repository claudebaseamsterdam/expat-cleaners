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
  // Phase 7 — canonical site URL used by app/sitemap.ts and
  // app/robots.ts. No trailing slash; routes are appended as `${siteUrl}/path`.
  siteUrl: "https://expat-cleaners.com",
} as const;

export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=ExpatCleaners+Amsterdam+reviews";

export const WHATSAPP_URL = `https://wa.me/${BRAND.whatsappNumber}?text=${BRAND.whatsappMessage}`;

// Removed in Phase 2: PRICING was a parallel rate config that nothing
// imported. The single source of truth for every price now lives in
// `lib/pricing.ts` (RECURRING_RATES, ONE_OFF_RATE, ADD_ONS, etc.).

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
