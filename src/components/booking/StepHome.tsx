"use client";

import { cn } from "@/lib/utils";
import {
  HOME_TYPES,
  SERVICES,
  type BookingState,
  type HomeType,
  type ServiceId,
} from "@/lib/booking";
import { ServiceCard } from "./ServiceCard";
import { Stepper } from "./Stepper";

type Props = {
  state: BookingState;
  onService: (id: ServiceId) => void;
  onHome: (patch: Partial<BookingState["home"]>) => void;
};

export function StepHome({ state, onService, onHome }: Props) {
  return (
    <div className="space-y-10">
      <div>
        <h3 className="font-display text-xl tracking-tight text-brand-ink">
          What kind of clean?
        </h3>
        <p className="mt-1 text-sm text-brand-graphite">
          Pick the service that fits your home today.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {SERVICES.map((s) => (
            <ServiceCard
              key={s.id}
              service={s}
              selected={state.serviceId === s.id}
              onSelect={() => onService(s.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl tracking-tight text-brand-ink">
          Tell us about your place
        </h3>
        <p className="mt-1 text-sm text-brand-graphite">
          We use this to estimate hours — no surprises later.
        </p>

        <div className="mt-5 rounded-2xl border border-brand-hairline bg-white p-5 sm:p-6">
          <div className="space-y-5 divide-y divide-brand-hairline [&>*+*]:pt-5">
            <Stepper
              label="Bedrooms"
              hint="Count studios as 0 and lofts as 1"
              value={state.home.beds}
              onChange={(beds) => onHome({ beds })}
              min={0}
              max={6}
            />
            <Stepper
              label="Bathrooms"
              value={state.home.baths}
              onChange={(baths) => onHome({ baths })}
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
                  onHome({ size: e.target.value.replace(/[^0-9]/g, "") })
                }
                className="h-12 w-full rounded-xl border border-brand-hairline bg-brand-linen px-4 text-sm tabular-nums text-brand-ink outline-none transition-all focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/30 sm:w-40"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {HOME_TYPES.map((t) => (
            <TypePill
              key={t.id}
              active={state.home.type === t.id}
              label={t.label}
              onClick={() => onHome({ type: t.id as HomeType })}
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
        "h-10 rounded-full border px-4 text-sm font-medium transition-all",
        active
          ? "border-brand-ink bg-brand-ink text-brand-cream"
          : "border-brand-hairline bg-white text-brand-ink hover:border-brand-ink/30",
      )}
    >
      {label}
    </button>
  );
}
