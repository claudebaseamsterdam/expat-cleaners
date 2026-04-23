import { BRAND, WHATSAPP_URL } from "./constants";

export { WHATSAPP_URL };

export function whatsappLink(message?: string): string {
  if (!message) return WHATSAPP_URL;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${BRAND.whatsappNumber}?text=${encoded}`;
}
