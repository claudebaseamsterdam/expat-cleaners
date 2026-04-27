"use client";

import { useEffect, useState } from "react";
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

const SIZE_DEBOUNCE_MS = 300;

export function StepSpecifics({ state, onChange }: Props) {
  // Local mirror of the m² input. The input updates immediately on
  // keystroke (so the user sees what they typed) but the dispatched
  // booking state — and therefore the summary card's price — only
  // updates after 300ms of idle. This keeps the live total from
  // flickering as a user types "120" through the values 1, 12, 120.
  const [localSize, setLocalSize] = useState(state.home.size);

  // Re-sync local mirror when state.home.size changes from outside this
  // component (e.g. localStorage hydration, bundle apply, custom
  // quote round-trip). The lint rule below flags this pattern in
  // general; here it's the intentional "external→local" sync.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalSize(state.home.size);
  }, [state.home.size]);

  // Push the local value to state after the debounce window.
  useEffect(() => {
    if (localSize === state.home.size) return;
    const t = setTimeout(() => {
      onChange({ size: localSize });
    }, SIZE_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [localSize, state.home.size, onChange]);

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
              m² — drives the time estimate. Homes ≥ 156m² get a custom
              WhatsApp quote.
            </div>
          </div>
          <input
            inputMode="numeric"
            placeholder="e.g. 65"
            value={localSize}
            onChange={(e) =>
              setLocalSize(e.target.value.replace(/[^0-9]/g, ""))
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
