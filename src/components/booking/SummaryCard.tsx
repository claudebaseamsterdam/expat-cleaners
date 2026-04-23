"use client";

import { ArrowUpRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  formatEuro,
  formatHours,
  type BookingState,
  type PriceBreakdown,
} from "@/lib/booking";

type Props = {
  price: PriceBreakdown;
  state: BookingState;
  ready: boolean;
  waHref: string;
  onWhatsApp: () => void;
  onSendRequest: () => void;
  sending: boolean;
  compact?: boolean;
};

export function SummaryCard({
  price,
  state,
  ready,
  waHref,
  onWhatsApp,
  onSendRequest,
  sending,
  compact,
}: Props) {
  const {
    service,
    frequency,
    hours,
    labor,
    laborAfterDiscount,
    laborSaved,
    addonLines,
    subtotal,
  } = price;
  const hasDiscount = laborSaved > 0.01;

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

      {!service ? (
        <p className="mt-3 text-sm text-brand-graphite">
          Pick a service to see your estimate.
        </p>
      ) : (
        <div className="mt-5 space-y-3 text-sm">
          <Row
            left={
              <>
                <div className="font-medium text-brand-ink">
                  {service.label}
                </div>
                <div className="mt-0.5 text-xs text-brand-graphite">
                  {formatHours(hours)} est. · {state.home.beds} bed /{" "}
                  {state.home.baths} bath
                </div>
              </>
            }
            right={
              hasDiscount ? (
                <div className="text-right">
                  <div className="text-xs text-brand-graphite line-through tabular-nums">
                    {formatEuro(labor)}
                  </div>
                  <div className="tabular-nums text-brand-ink">
                    {formatEuro(laborAfterDiscount)}
                  </div>
                </div>
              ) : (
                <span className="tabular-nums text-brand-ink">
                  {formatEuro(labor)}
                </span>
              )
            }
          />

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
                    <span className="truncate">
                      <span className="mr-1" aria-hidden>
                        {extra.icon}
                      </span>
                      {extra.label}
                      {qty > 1 ? ` ×${qty}` : ""}
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
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-2xl tabular-nums text-brand-ink"
              >
                {formatEuro(subtotal)}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-brand-graphite">
        Final price confirmed before the clean. No payment online.
      </p>

      {ready ? (
        <a
          href={waHref}
          onClick={onWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-terracotta px-6 text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(232,92,58,0.5)]"
        >
          Continue on WhatsApp
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="mt-5 inline-flex h-14 w-full cursor-not-allowed items-center justify-center rounded-full bg-brand-ink/80 px-6 text-base font-medium text-brand-cream opacity-60"
        >
          Complete the form to continue
        </button>
      )}

      <button
        type="button"
        onClick={onSendRequest}
        disabled={!ready || sending}
        className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 text-sm font-medium text-brand-graphite transition-colors hover:text-brand-ink disabled:cursor-not-allowed disabled:opacity-40"
      >
        {sending ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending…
          </>
        ) : (
          "Rather send a request instead?"
        )}
      </button>
    </aside>
  );
}

function Row({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div className="min-w-0">{left}</div>
      <div className="shrink-0">{right}</div>
    </div>
  );
}
