"use client";

import { cn } from "@/lib/utils";
import {
  FREQUENCIES,
  type BookingState,
  type FrequencyId,
} from "@/lib/booking";

type Props = {
  state: BookingState;
  onSelect: (id: FrequencyId) => void;
};

export function StepFrequency({ state, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {FREQUENCIES.map((f) => {
        const selected = state.frequencyId === f.id;
        const isBest = f.id === "weekly";
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onSelect(f.id)}
            aria-pressed={selected}
            className={cn(
              "group relative flex h-full flex-col items-start gap-2 rounded-2xl border bg-white p-5 text-left transition-all",
              "hover:-translate-y-0.5 hover:shadow-[0_6px_24px_-12px_rgba(42,42,40,0.18)]",
              selected
                ? "border-brand-terracotta bg-gradient-to-b from-white to-brand-linen/60 shadow-[0_6px_24px_-12px_rgba(26,26,26,0.3)]"
                : "border-brand-hairline",
            )}
          >
            {isBest && (
              <span className="absolute -top-2.5 right-4 inline-flex items-center gap-1 rounded-full bg-brand-amber px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-ink">
                Best value
              </span>
            )}
            <div className="flex w-full items-baseline justify-between">
              <span className="font-display text-lg tracking-tight text-brand-ink">
                {f.label}
              </span>
              {/* Phase 1.3: dropped the −10% / −15% chip. Frequencies
                  now have their own hourly rate (no discount math), so
                  there's nothing to render in the savings slot. The
                  "Best value" amber pill above still calls out weekly. */}
            </div>
            <span className="text-xs text-brand-graphite">{f.subLabel}</span>
            <span className="mt-auto pt-3 font-display text-lg tabular-nums text-brand-ink">
              €{f.effectiveRate}
              <span className="text-sm text-brand-graphite">/hr</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
