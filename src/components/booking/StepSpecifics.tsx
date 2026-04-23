"use client";

import { cn } from "@/lib/utils";
import {
  HOME_TYPES,
  type BookingState,
  type HomeType,
} from "@/lib/booking";
import { Stepper } from "./Stepper";

type Props = {
  state: BookingState;
  onChange: (patch: Partial<BookingState["home"]>) => void;
};

export function StepSpecifics({ state, onChange }: Props) {
  return (
    <div className="rounded-2xl border border-brand-hairline bg-white p-5 sm:p-6">
      <div className="space-y-5 divide-y divide-brand-hairline [&>*+*]:pt-5">
        <Stepper
          label="Bedrooms"
          hint="Count studios as 0 and lofts as 1"
          value={state.home.beds}
          onChange={(beds) => onChange({ beds })}
          min={0}
          max={6}
        />
        <Stepper
          label="Bathrooms"
          value={state.home.baths}
          onChange={(baths) => onChange({ baths })}
          min={1}
          max={4}
        />
        <div className="flex flex-col gap-2 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-medium text-brand-ink">
              Approximate size
            </div>
            <div className="mt-0.5 text-xs text-brand-graphite">
              Optional — m²
            </div>
          </div>
          <input
            inputMode="numeric"
            placeholder="e.g. 65"
            value={state.home.size}
            onChange={(e) =>
              onChange({ size: e.target.value.replace(/[^0-9]/g, "") })
            }
            className="h-14 w-full rounded-xl border border-brand-hairline bg-brand-linen px-4 text-sm tabular-nums text-brand-ink outline-none transition-all focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/30 sm:w-40"
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-5">
          {HOME_TYPES.map((t) => (
            <TypePill
              key={t.id}
              active={state.home.type === t.id}
              label={t.label}
              onClick={() => onChange({ type: t.id as HomeType })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TypePill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-11 rounded-full border px-5 text-sm font-medium transition-all",
        active
          ? "border-brand-ink bg-brand-ink text-brand-cream"
          : "border-brand-hairline bg-white text-brand-ink hover:border-brand-ink/30",
      )}
    >
      {label}
    </button>
  );
}
