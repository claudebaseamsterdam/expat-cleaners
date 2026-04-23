"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EXTRAS,
  FREQUENCIES,
  type BookingState,
  type FrequencyId,
} from "@/lib/booking";
import { ExtraCard } from "./ExtraCard";

type Props = {
  state: BookingState;
  onExtra: (id: string, qty: number) => void;
  onFrequency: (id: FrequencyId) => void;
};

export function StepExtrasFrequency({ state, onExtra, onFrequency }: Props) {
  const supplies = EXTRAS.filter((e) => e.group === "supplies");
  const addons = EXTRAS.filter((e) => e.group === "addons");

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-display text-xl tracking-tight text-brand-ink">
            Supplies
          </h3>
          <span className="rounded-full bg-brand-sage/15 px-2 py-0.5 text-xs font-medium text-brand-sage">
            We&apos;ll bring them
          </span>
        </div>
        <p className="mt-1 text-sm text-brand-graphite">
          Don&apos;t have these at home? We&apos;ll pack them in.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {supplies.map((e) => (
            <ExtraCard
              key={e.id}
              extra={e}
              qty={state.extras[e.id] ?? 0}
              onChange={(qty) => onExtra(e.id, qty)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl tracking-tight text-brand-ink">
          Add-ons
        </h3>
        <p className="mt-1 text-sm text-brand-graphite">
          Tap a card to add. Use the steppers to adjust quantity.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
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

      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-display text-xl tracking-tight text-brand-ink">
            How often?
          </h3>
          <Sparkles className="h-4 w-4 text-brand-amber" />
        </div>
        <p className="mt-1 text-sm text-brand-graphite">
          Commit to a rhythm, get a better rate.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FREQUENCIES.map((f) => {
            const selected = state.frequencyId === f.id;
            const isBest = f.id === "weekly";
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onFrequency(f.id)}
                aria-pressed={selected}
                className={cn(
                  "group relative flex h-full flex-col items-start gap-2 rounded-2xl border bg-white p-5 text-left transition-all",
                  "hover:-translate-y-0.5 hover:shadow-[0_6px_24px_-12px_rgba(42,42,40,0.18)]",
                  selected
                    ? "border-brand-terracotta bg-gradient-to-b from-white to-brand-linen/60 shadow-[0_6px_24px_-12px_rgba(232,92,58,0.3)]"
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
                  {f.discount > 0 && (
                    <span className="rounded-full bg-brand-sage/15 px-2 py-0.5 text-xs font-medium text-brand-sage">
                      −{Math.round(f.discount * 100)}%
                    </span>
                  )}
                </div>
                <span className="text-xs text-brand-graphite">
                  {f.subLabel}
                </span>
                <span className="mt-auto pt-3 font-display text-lg tabular-nums text-brand-ink">
                  €{f.effectiveRate}
                  <span className="text-sm text-brand-graphite">/hr</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
