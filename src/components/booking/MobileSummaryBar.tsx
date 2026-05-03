"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronUp, MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  buildCustomQuoteMessage,
  formatEuro,
  vatItemsForBooking,
  type BookingState,
  type PriceBreakdown,
} from "@/lib/booking";
import { whatsappLink } from "@/lib/whatsapp";
import { trackCompleteRegistration } from "@/lib/pixel";
import {
  formatDurationBreakdown,
  formatHourly,
  parseSqm,
  vatFootnoteText,
} from "@/lib/pricing";

type Props = {
  price: PriceBreakdown;
  state: BookingState;
};

/**
 * Mobile-only sticky booking total.
 *
 * - Fixed to the bottom of the viewport on screens narrower than `lg`.
 * - Compact strip (~80px) showing the live total + a chevron to expand.
 * - When expanded, slides up a sheet with the full line breakdown
 *   (mirrors what the desktop SummaryCard shows in the right rail).
 * - Until a service is selected, shows the brief's required string —
 *   "Select a service to see your estimate" — never €0.
 * - Respects iOS bottom safe-area via env(safe-area-inset-bottom).
 */
export function MobileSummaryBar({ price, state }: Props) {
  const [open, setOpen] = useState(false);
  const {
    service,
    frequency,
    hours,
    labor,
    laborDiscounted,
    laborSaved,
    addonLines,
    subtotal,
    isCustomQuote,
    pricingMode,
    selectedPackageLabel,
  } = price;
  const hasService = !!service;
  const hasDiscount = laborSaved > 0.01;
  const isFixedPrice = pricingMode === "fixed";
  const sqm = parseSqm(state.home.size);
  const hourlyBreakdown = formatDurationBreakdown({
    hours,
    sqm,
    bedrooms: state.home.beds,
    bathrooms: state.home.baths,
    homeType: state.home.type,
  });
  const customQuoteHref = whatsappLink(buildCustomQuoteMessage(sqm));
  // Phase 4.4 + 4.7 — VAT footnote, plus a breakdown line that swaps
  // between the package label (fixed) and the hourly rate (hourly).
  const vatLine = hasService
    ? vatFootnoteText(vatItemsForBooking(state))
    : null;
  const breakdownLine = !hasService
    ? hourlyBreakdown
    : isFixedPrice
      ? selectedPackageLabel ?? hourlyBreakdown
      : `${hourlyBreakdown} · ${frequency.label} · ${formatHourly(frequency.effectiveRate)}`;
  const totalLabel = isFixedPrice ? "Fixed price" : "Estimated total";
  // Custom-quote (>155m²) WhatsApp clicks have no estimable price, so
  // value is 0 — the conversion still counts in CompleteRegistration.
  const onCustomQuoteClick = () =>
    trackCompleteRegistration({
      contentName: "whatsapp_custom_quote",
      value: 0,
      currency: "EUR",
    });

  // Lock body scroll while the expanded sheet is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-brand-ink/40 lg:hidden"
            aria-hidden
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="sheet"
            role="dialog"
            aria-label="Booking summary"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-brand-hairline bg-white shadow-[0_-12px_40px_-16px_rgba(26,26,26,0.25)] lg:hidden"
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
            }}
          >
            <div className="sticky top-0 flex items-center justify-between rounded-t-3xl bg-white/95 px-5 pt-3 pb-3 backdrop-blur">
              <span aria-hidden className="mx-auto h-1 w-10 rounded-full bg-brand-hairline" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close summary"
                className="absolute right-4 top-3 grid h-9 w-9 place-items-center rounded-full border border-brand-hairline bg-white text-brand-ink hover:border-brand-ink/30"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 pb-6">
              <h3 className="font-display text-xl tracking-tight text-brand-ink">
                Your booking
              </h3>
              {isCustomQuote ? (
                <div className="mt-4">
                  <p className="text-sm font-medium text-brand-ink">
                    Custom quote — message us on WhatsApp.
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-brand-graphite">
                    For homes over 155m² we quote on WhatsApp so we can size
                    the team and the time properly.
                  </p>
                  <a
                    href={customQuoteHref}
                    onClick={onCustomQuoteClick}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-terracotta px-5 text-sm font-medium text-white transition-colors hover:bg-brand-terracotta-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-terracotta"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Get a custom quote
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                  </a>
                </div>
              ) : !hasService ? (
                <p className="mt-3 text-sm text-brand-graphite">
                  Select a service to see your estimate.
                </p>
              ) : (
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-medium text-brand-ink">
                        {service.label}
                      </div>
                      <div className="mt-0.5 text-xs text-brand-graphite">
                        {breakdownLine}
                      </div>
                    </div>
                    {hasDiscount ? (
                      <div className="shrink-0 text-right">
                        <div className="text-xs text-brand-graphite line-through tabular-nums">
                          {formatEuro(labor)}
                        </div>
                        <div className="tabular-nums text-brand-ink">
                          {formatEuro(laborDiscounted)}
                        </div>
                      </div>
                    ) : (
                      <span className="shrink-0 tabular-nums text-brand-ink">
                        {formatEuro(labor)}
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <div className="flex items-baseline justify-between text-brand-sage">
                      <span>{frequency.label} discount</span>
                      <span className="tabular-nums">
                        −{formatEuro(laborSaved)}
                      </span>
                    </div>
                  )}
                  {addonLines.length > 0 && (
                    <>
                      <hr className="border-brand-hairline" />
                      <div className="space-y-1.5">
                        {addonLines.map(({ extra, qty, line }) => (
                          <div
                            key={extra.id}
                            className="flex items-baseline justify-between text-brand-ink/80"
                          >
                            <span className="flex min-w-0 items-center gap-2 truncate">
                              <extra.Icon
                                aria-hidden
                                className="h-3.5 w-3.5 shrink-0 text-brand-graphite"
                                strokeWidth={1.5}
                              />
                              <span className="truncate">
                                {extra.label}
                                {qty > 1 ? ` ×${qty}` : ""}
                              </span>
                            </span>
                            <span className="tabular-nums">
                              {formatEuro(line)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  <hr className="border-brand-hairline" />
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-brand-graphite">{totalLabel}</span>
                    <span className="font-display text-2xl tabular-nums text-brand-ink">
                      {formatEuro(subtotal)}
                    </span>
                  </div>
                </div>
              )}
              <p className="mt-4 flex items-start gap-1.5 text-xs leading-relaxed text-brand-graphite">
                <span className="text-brand-sage" aria-hidden>
                  ✓
                </span>
                <span>
                  Organic bio cleaning products included in every clean — no
                  extra charge.
                </span>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-brand-graphite">
                Estimate confirmed before the clean. Secure online checkout
                via Mollie.
              </p>
              {vatLine && (
                <p className="mt-2 text-xs leading-relaxed text-brand-graphite">
                  {vatLine}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t border-brand-hairline bg-white shadow-[0_-8px_24px_-16px_rgba(26,26,26,0.18)] lg:hidden",
        )}
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)",
        }}
      >
        {isCustomQuote ? (
          <a
            href={customQuoteHref}
            onClick={onCustomQuoteClick}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get a custom quote on WhatsApp"
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-brand-terracotta"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-brand-ink">
                Custom quote
              </div>
              <div className="mt-0.5 truncate text-xs text-brand-graphite">
                Message us on WhatsApp
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-brand-terracotta">
              <MessageCircle className="h-4 w-4" />
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </a>
        ) : (
          <button
            type="button"
            onClick={() => hasService && setOpen(true)}
            disabled={!hasService}
            aria-label={
              hasService
                ? "Open booking summary"
                : "Select a service to see your estimate"
            }
            className={cn(
              "flex w-full items-center justify-between gap-3 px-5 py-4 text-left",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-brand-terracotta",
              !hasService && "cursor-default",
            )}
          >
            {hasService ? (
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-brand-ink">
                  {service.label}
                </div>
                <div className="mt-0.5 truncate text-xs text-brand-graphite">
                  {isFixedPrice
                    ? selectedPackageLabel ?? hourlyBreakdown
                    : `${hourlyBreakdown} · ${frequency.label}`}
                </div>
              </div>
            ) : (
              <div className="min-w-0 flex-1 text-sm text-brand-graphite">
                Select a service to see your estimate
              </div>
            )}
            <div className="flex shrink-0 items-center gap-3">
              {hasService && (
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={subtotal}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display text-xl tabular-nums text-brand-ink"
                  >
                    {formatEuro(subtotal)}
                  </motion.span>
                </AnimatePresence>
              )}
              <ChevronUp
                aria-hidden
                className={cn(
                  "h-4 w-4 transition-colors",
                  hasService ? "text-brand-ink" : "text-brand-hairline",
                )}
              />
            </div>
          </button>
        )}
      </div>
    </>
  );
}
