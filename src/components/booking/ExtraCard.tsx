"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Extra } from "@/lib/booking";

type Props = {
  extra: Extra;
  qty: number;
  onChange: (next: number) => void;
};

export function ExtraCard({ extra, qty, onChange }: Props) {
  const active = qty > 0;
  const max = extra.max ?? 9;
  const isToggle = extra.max === 1;

  const onCardTap = () => {
    if (isToggle) {
      onChange(active ? 0 : 1);
    } else if (qty < max) {
      onChange(qty + 1);
    }
  };

  return (
    <div
      onClick={onCardTap}
      role="button"
      tabIndex={0}
      aria-pressed={active}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCardTap();
        }
      }}
      className={cn(
        "group relative flex cursor-pointer flex-col items-start gap-2 rounded-2xl border bg-white p-4 text-left transition-all",
        "hover:-translate-y-0.5 hover:shadow-[0_6px_24px_-12px_rgba(42,42,40,0.18)]",
        active
          ? "border-brand-terracotta bg-gradient-to-b from-white to-brand-linen/50"
          : "border-brand-hairline",
      )}
    >
      <div className="flex w-full items-start justify-between">
        <extra.Icon
          aria-hidden
          className="h-5 w-5 text-brand-ink"
          strokeWidth={1.5}
        />
        {active && !isToggle && (
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-brand-terracotta px-2 text-xs font-semibold text-white tabular-nums">
            {qty}
          </span>
        )}
      </div>
      <div className="mt-1 text-sm font-medium leading-tight text-brand-ink">
        {extra.label}
      </div>
      <div className="text-xs text-brand-graphite">
        +€{extra.price}
        {isToggle ? "" : " each"}
      </div>

      {!isToggle && active && (
        <div
          className="mt-2 flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onChange(Math.max(0, qty - 1))}
            aria-label={`Decrease ${extra.label}`}
            className="grid h-7 w-7 place-items-center rounded-full border border-brand-hairline bg-white transition-colors hover:border-brand-ink/30"
          >
            <Minus className="h-3 w-3 text-brand-ink" />
          </button>
          <button
            type="button"
            onClick={() => onChange(Math.min(max, qty + 1))}
            aria-label={`Increase ${extra.label}`}
            className="grid h-7 w-7 place-items-center rounded-full border border-brand-hairline bg-white transition-colors hover:border-brand-ink/30"
          >
            <Plus className="h-3 w-3 text-brand-ink" />
          </button>
        </div>
      )}

      {isToggle && active && (
        <div
          className="mt-2"
          onClick={(e) => {
            e.stopPropagation();
            onChange(0);
          }}
        >
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-terracotta/10 px-2.5 py-1 text-xs font-medium text-brand-terracotta">
            Added · tap to remove
          </span>
        </div>
      )}
    </div>
  );
}
