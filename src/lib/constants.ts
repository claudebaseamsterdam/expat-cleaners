export const BUSINESS = {
  name: "ExpatCleaners",
  tagline: "Premium cleaning for expats in Amsterdam",
  email: "hello@expatcleaners.nl",
  phone: "+31XXXXXXXXX", // TODO: fill in
  whatsappNumber: "31XXXXXXXXX", // TODO: fill in — no + or spaces
  address: "Amsterdam, NL",
  instagram: "https://instagram.com/expatcleaners",
} as const;

export const PRICING = {
  oneOff: 44, // €/hour
  recurring: 36, // €/hour
  minHours: 2,
  addons: [
    { id: "inside-oven", name: "Inside oven", price: 25 },
    { id: "inside-fridge", name: "Inside fridge", price: 20 },
    { id: "windows-inside", name: "Inside windows", price: 20 },
    { id: "ironing-hour", name: "Ironing (per hour)", price: 30 },
  ],
} as const;

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hi ExpatCleaners 👋 I'd like to book a cleaning. My postcode is ___ and I'd like ___ hours on ___.";
