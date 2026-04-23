"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  hint?: string;
  formatValue?: (v: number) => string;
};

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  label,
  hint,
  formatValue,
}: Props) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="text-sm font-medium text-brand-ink">{label}</div>
        {hint && (
          <div className="mt-0.5 text-xs text-brand-graphite">{hint}</div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={dec}
          disabled={atMin}
          aria-label={`Decrease ${label}`}
          className={cn(
            "grid h-10 w-10 place-items-center rounded-full border border-brand-hairline bg-white transition-all",
            "hover:border-brand-ink/30 active:scale-95",
            "disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-brand-hairline",
          )}
        >
          <Minus className="h-4 w-4 text-brand-ink" />
        </button>
        <span className="min-w-[48px] text-center font-display text-xl tabular-nums text-brand-ink">
          {formatValue ? formatValue(value) : value}
        </span>
        <button
          type="button"
          onClick={inc}
          disabled={atMax}
          aria-label={`Increase ${label}`}
          className={cn(
            "grid h-10 w-10 place-items-center rounded-full border border-brand-hairline bg-white transition-all",
            "hover:border-brand-ink/30 active:scale-95",
            "disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-brand-hairline",
          )}
        >
          <Plus className="h-4 w-4 text-brand-ink" />
        </button>
      </div>
    </div>
  );
}
