"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SERVICES, type BookingState, type ServiceId } from "@/lib/booking";
import { ServiceCard } from "./ServiceCard";

type Props = {
  state: BookingState;
  onSelect: (id: ServiceId) => void;
};

export function StepService({ state, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {SERVICES.map((s) => (
          <ServiceCard
            key={s.id}
            service={s}
            selected={state.serviceId === s.id}
            onSelect={() => onSelect(s.id)}
          />
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-brand-hairline bg-white">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
        >
          <span className="text-sm font-medium text-brand-ink">
            Not sure which to pick?
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-brand-graphite transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
        {open && (
          <div className="space-y-3 border-t border-brand-hairline px-5 py-5 text-sm text-brand-graphite">
            <p>
              <strong className="text-brand-ink">Regular</strong> — your home
              is mostly tidy and you just want someone to keep on top of it.
            </p>
            <p>
              <strong className="text-brand-ink">Deep clean</strong> — skirting
              boards, inside appliances, things nobody&apos;s touched in a
              while. Once or twice a year.
            </p>
            <p>
              <strong className="text-brand-ink">Move-in / move-out</strong> —
              either picking up the keys or handing them back. Deposit-back
              standard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
