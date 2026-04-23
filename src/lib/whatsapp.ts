import { BUSINESS, WHATSAPP_DEFAULT_MESSAGE } from "./constants";

export function whatsappLink(message: string = WHATSAPP_DEFAULT_MESSAGE) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encoded}`;
}
