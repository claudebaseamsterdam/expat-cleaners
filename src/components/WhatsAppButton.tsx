"use client";

import { cn } from "@/lib/utils";
import { trackViewContent } from "@/lib/pixel";

export const WHATSAPP_PHONE = "31644683837";
export const WHATSAPP_DEFAULT_MESSAGE = "Hi! I'd like to book a clean.";

/** Build the wa.me deep link with a prefilled message. */
export function whatsappHref(message: string = WHATSAPP_DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

type Variant = "primary" | "small";

type Props = {
  /** Override the prefilled message. Defaults to the generic booking ask. */
  message?: string;
  /** Visible button copy. */
  children: React.ReactNode;
  /** primary = hero-scale pill; small = inline-card-scale pill. */
  variant?: Variant;
  className?: string;
  ariaLabel?: string;
  /**
   * Surface tag for the ViewContent event (Test Events readability).
   * Defaults to 'whatsapp_cta' — the standard pill on hero/pricing/services.
   */
  trackName?: string;
};

const BASE_PRIMARY = [
  "group inline-flex items-center justify-center gap-2.5",
  "h-[52px] px-6 rounded-full",
  "bg-whatsapp text-white",
  "text-[15px] font-medium leading-none tracking-[0.01em]",
  "transition-[transform,box-shadow,background-color] duration-300 ease-out",
  "hover:-translate-y-0.5 hover:bg-whatsapp-hover hover:shadow-[0_8px_24px_-8px_rgba(37,211,102,0.45)]",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[4px] focus-visible:outline-botanical",
].join(" ");

const BASE_SMALL = [
  "group inline-flex items-center justify-center gap-2",
  "h-11 px-4 rounded-full",
  "bg-whatsapp text-white",
  "text-[14px] font-medium leading-none tracking-[0.01em]",
  "transition-[transform,box-shadow,background-color] duration-300 ease-out",
  "hover:-translate-y-0.5 hover:bg-whatsapp-hover hover:shadow-[0_6px_18px_-8px_rgba(37,211,102,0.45)]",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[4px] focus-visible:outline-botanical",
].join(" ");

/**
 * WhatsApp CTA — the only WhatsApp-green surface on the site. Two sizes
 * (primary for hero / final CTA, small for inline cards and pricing).
 * Always opens wa.me with a prefilled message; pass `message` to override.
 */
export function WhatsAppButton({
  message,
  children,
  variant = "primary",
  className = "",
  ariaLabel,
  trackName = "whatsapp_cta",
}: Props) {
  const classes = cn(
    variant === "primary" ? BASE_PRIMARY : BASE_SMALL,
    className,
  );
  const href = whatsappHref(message);
  const iconSize = variant === "primary" ? 18 : 16;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={classes}
      aria-label={ariaLabel}
      onClick={() => trackViewContent({ contentName: trackName })}
    >
      <WhatsAppIcon size={iconSize} />
      <span>{children}</span>
    </a>
  );
}

/**
 * Plain-text WhatsApp link (no pill). Used in the Footer contact block
 * and the end-of-tenancy "request a quote" inline link. Behaves like
 * an `<a>` but fires the ViewContent event on click.
 */
export function WhatsAppTextLink({
  message,
  className = "",
  ariaLabel,
  trackName,
  children,
}: {
  message?: string;
  className?: string;
  ariaLabel?: string;
  trackName: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={whatsappHref(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
      onClick={() => trackViewContent({ contentName: trackName })}
    >
      {children}
    </a>
  );
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
