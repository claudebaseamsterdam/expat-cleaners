"use client";

import { EXTRAS, type BookingState } from "@/lib/booking";
import { ExtraCard } from "./ExtraCard";

type Props = {
  state: BookingState;
  onExtra: (id: string, qty: number) => void;
};

export function StepExtras({ state, onExtra }: Props) {
  const supplies = EXTRAS.filter((e) => e.max === 1);
  const addons = EXTRAS.filter((e) => e.max !== 1);

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-brand-hairline bg-brand-sage/[0.08] p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <h4 className="font-display text-lg tracking-tight text-brand-ink">
            Supplies
          </h4>
          <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-brand-sage">
            Included
          </span>
        </div>
        <p className="mt-1 text-sm text-brand-ink">
          Organic bio cleaning products included in every clean — no extra
          charge.
        </p>
        <p className="mt-1 text-sm text-brand-graphite">
          We estimate hours based on your home size. You only pay for the
          time we work — final price confirmed on arrival.
        </p>
        <p className="mt-1 text-sm text-brand-graphite">
          No vacuum at home? Add ours below.
        </p>

        {supplies.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {supplies.map((e) => (
              <ExtraCard
                key={e.id}
                extra={e}
                qty={state.extras[e.id] ?? 0}
                onChange={(qty) => onExtra(e.id, qty)}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h4 className="font-display text-lg tracking-tight text-brand-ink">
          Add-ons
        </h4>
        <p className="mt-1 text-sm text-brand-graphite">
          Tap a card to add. Use the steppers to adjust quantity.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {addons.map((e) => (
            <ExtraCard
              key={e.id}
              extra={e}
              qty={state.extras[e.id] ?? 0}
              onChange={(qty) => onExtra(e.id, qty)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
