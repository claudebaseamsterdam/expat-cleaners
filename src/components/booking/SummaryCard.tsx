"use client";

import { useState } from "react";
import { ArrowUpRight, Loader2, MessageCircle, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  buildCustomQuoteMessage,
  formatEuro,
  type BookingState,
  type PriceBreakdown,
} from "@/lib/booking";
import { whatsappLink } from "@/lib/whatsapp";
import { formatDurationBreakdown, parseSqm } from "@/lib/pricing";

type Props = {
  price: PriceBreakdown;
  state: BookingState;
  ready: boolean;
  waHref: string;
  submitting: boolean;
  onConfirm: () => void;
  onWhatsApp: () => void;
  onCoupon: (code: string) => void;
  compact?: boolean;
  /**
   * When true, hide the CTA and coupon — use when the card is purely an
   * estimate display (e.g. sticky sidebar next to a wizard whose own CTA
   * lives elsewhere).
   */
  readOnly?: boolean;
};

export function SummaryCard({
  price,
  state,
  ready,
  waHref,
  submitting,
  onConfirm,
  onWhatsApp,
  onCoupon,
  compact,
  readOnly,
}: Props) {
  const [couponOpen, setCouponOpen] = useState(!!state.couponCode);
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
  } = price;
  const hasDiscount = laborSaved > 0.01;
  const sqm = parseSqm(state.home.size);
  const breakdown = formatDurationBreakdown({
    hours,
    sqm,
    bedrooms: state.home.beds,
    bathrooms: state.home.baths,
    homeType: state.home.type,
  });
  const customQuoteHref = whatsappLink(buildCustomQuoteMessage(sqm));

  return (
    <aside
      aria-label="Booking summary"
      className={cn(
        "rounded-2xl border border-brand-hairline bg-white",
        compact ? "p-5" : "p-6",
      )}
    >
      <h3 className="font-display text-xl tracking-tight text-brand-ink">
        Your booking
      </h3>

      {isCustomQuote ? (
        <div className="mt-4">
          <p className="text-sm font-medium text-brand-ink">
            Custom quote — message us on WhatsApp.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-brand-graphite">
            For homes over 155m² we quote on WhatsApp so we can size the
            team and the time properly.
          </p>
          {!readOnly && (
            <a
              href={customQuoteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-terracotta px-5 text-sm font-medium text-white transition-colors hover:bg-brand-terracotta-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-terracotta"
            >
              <MessageCircle className="h-4 w-4" />
              Get a custom quote
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </a>
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
        </div>
      ) : !service ? (
        <p className="mt-3 text-sm text-brand-graphite">
          Select a service to see your estimate.
        </p>
      ) : (
        <div className="mt-5 space-y-3 text-sm">
          <div className="flex items-baseline justify-between gap-4">
            <div className="min-w-0">
              <div className="font-medium text-brand-ink">{service.label}</div>
              <div className="mt-0.5 text-xs text-brand-graphite">
                {breakdown}
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
              <span className="tabular-nums">−{formatEuro(laborSaved)}</span>
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
                    <span className="tabular-nums">{formatEuro(line)}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <hr className="border-brand-hairline" />
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-brand-graphite">Estimated total</span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={subtotal}
                initial={{ scale: 1.06, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-2xl tabular-nums text-brand-ink"
              >
                {formatEuro(subtotal)}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      )}

      {!isCustomQuote && (
        <>
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
            Estimate confirmed before the clean. Secure online checkout via Mollie.
          </p>
        </>
      )}

      {!readOnly && !isCustomQuote && (
      <div className="mt-4">
        {!couponOpen ? (
          <button
            type="button"
            onClick={() => setCouponOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-graphite hover:text-brand-ink"
          >
            <Tag className="h-3 w-3" />
            Have a code?
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              value={state.couponCode}
              onChange={(e) => onCoupon(e.target.value.toUpperCase())}
              placeholder="Enter code"
              className="h-11 flex-1 rounded-xl border border-brand-hairline bg-brand-linen px-3 text-sm uppercase tracking-wider text-brand-ink outline-none focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/30"
            />
            <button
              type="button"
              onClick={() => {
                if (!state.couponCode) setCouponOpen(false);
              }}
              className="h-11 rounded-xl border border-brand-hairline bg-white px-3 text-xs font-medium text-brand-ink hover:border-brand-ink/30"
            >
              {state.couponCode ? "Apply" : "Close"}
            </button>
          </div>
        )}
      </div>
      )}

      {!readOnly && !isCustomQuote && (ready ? (
        <button
          type="button"
          onClick={onConfirm}
          disabled={submitting}
          className="group mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-terracotta px-6 text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-14px_rgba(26,26,26,0.6)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Confirming…
            </>
          ) : (
            <>
              Confirm booking
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          disabled
          className="mt-5 inline-flex h-14 w-full cursor-not-allowed items-center justify-center rounded-full bg-brand-ink/80 px-6 text-base font-medium text-brand-cream opacity-60"
        >
          Complete the form to continue
        </button>
      ))}

      {/* WhatsApp CTA is a contact/booking action, not an editable field —
          it must render in readOnly mode (the booking page sidebar) too.
          Custom-quote homes get a different CTA above, so we still skip
          this one when isCustomQuote. */}
      {!isCustomQuote && (
      <a
        href={waHref}
        onClick={onWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex h-11 w-full items-center justify-center gap-1.5 text-sm font-medium text-brand-graphite transition-colors hover:text-brand-ink"
      >
        Prefer WhatsApp? Message us instead
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-45" />
      </a>
      )}
    </aside>
  );
}
