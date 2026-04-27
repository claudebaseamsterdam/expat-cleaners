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
  const [moreOpen, setMoreOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const popular = SERVICES.filter((s) => s.tier === "popular");
  const more = SERVICES.filter((s) => s.tier === "more");

  // If the current selection is a "more" service, auto-expand the
  // overflow group so the selected card is visible.
  const selectedIsMore =
    !!state.serviceId && more.some((s) => s.id === state.serviceId);
  const showMore = moreOpen || selectedIsMore;

  return (
    <div>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-graphite">
          Most popular
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {popular.map((s) => (
            <ServiceCard
              key={s.id}
              service={s}
              selected={state.serviceId === s.id}
              onSelect={() => onSelect(s.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          aria-expanded={showMore}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-graphite transition-colors hover:text-brand-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-terracotta"
        >
          More services
          <ChevronDown
            aria-hidden
            className={cn(
              "h-4 w-4 transition-transform",
              showMore && "rotate-180",
            )}
          />
        </button>
        {showMore && (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {more.map((s) => (
              <ServiceCard
                key={s.id}
                service={s}
                selected={state.serviceId === s.id}
                onSelect={() => onSelect(s.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-brand-hairline bg-white">
        <button
          type="button"
          onClick={() => setHelpOpen((v) => !v)}
          aria-expanded={helpOpen}
          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
        >
          <span className="text-sm font-medium text-brand-ink">
            Not sure which to pick?
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-brand-graphite transition-transform",
              helpOpen && "rotate-180",
            )}
          />
        </button>
        {helpOpen && (
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
