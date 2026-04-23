import {
  formatEuro,
  type BookingState,
  type PriceBreakdown,
} from "@/lib/booking";
import { cn } from "@/lib/utils";

type Props = {
  price: PriceBreakdown;
  state: BookingState;
  waHref: string;
  canContinue: boolean;
  onContinue: () => void;
};

const ctaBase =
  "mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-ink text-base font-medium text-brand-cream transition-colors";

export function BookSummary({
  price,
  state,
  waHref,
  canContinue,
  onContinue,
}: Props) {
  const {
    service,
    frequency,
    rate,
    hoursTotal,
    addonLines,
    discount,
    total,
  } = price;

  return (
    <aside
      aria-label="Booking summary"
      className="rounded-xl border border-brand-stone bg-white p-6 shadow-[0_1px_0_rgba(15,26,28,0.02)]"
    >
      <h3 className="font-display text-xl tracking-tight text-brand-ink">
        Your booking
      </h3>

      {!service ? (
        <p className="mt-4 text-sm text-brand-ink/60">
          Pick a service to see your estimate.
        </p>
      ) : (
        <div className="mt-5 space-y-3 text-sm">
          <div className="flex items-baseline justify-between">
            <div className="min-w-0">
              <div className="font-medium text-brand-ink">{service.name}</div>
              <div className="mt-0.5 text-xs text-brand-ink/55">
                {state.hours}h × {formatEuro(rate)}/hr
              </div>
            </div>
            <div className="tabular-nums text-brand-ink">
              {formatEuro(hoursTotal)}
            </div>
          </div>

          {addonLines.length > 0 && (
            <>
              <hr className="border-brand-stone/70" />
              <div className="space-y-1.5">
                {addonLines.map(({ addon, qty, line }) => (
                  <div
                    key={addon.id}
                    className="flex items-baseline justify-between text-brand-ink/80"
                  >
                    <span className="truncate">
                      {addon.name}
                      {qty > 1 ? ` ×${qty}` : ""}
                    </span>
                    <span className="tabular-nums">{formatEuro(line)}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {discount > 0 && (
            <>
              <hr className="border-brand-stone/70" />
              <div className="flex items-baseline justify-between text-brand-sage">
                <span>{frequency.name} discount</span>
                <span className="tabular-nums">−{formatEuro(discount)}</span>
              </div>
            </>
          )}

          <hr className="border-brand-stone/70" />
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-brand-ink/60">Estimated total</span>
            <span className="font-display text-2xl tabular-nums text-brand-ink">
              {formatEuro(total)}
            </span>
          </div>
        </div>
      )}

      {canContinue ? (
        <a
          href={waHref}
          onClick={onContinue}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(ctaBase, "hover:bg-brand-ink/90")}
        >
          Continue on WhatsApp
        </a>
      ) : (
        <button
          type="button"
          disabled
          className={cn(ctaBase, "cursor-not-allowed opacity-50")}
        >
          Continue on WhatsApp
        </button>
      )}

      <p className="mt-3 text-center text-xs text-brand-ink/50">
        You&apos;ll finalise in WhatsApp. No sign-up, no card.
      </p>
    </aside>
  );
}
