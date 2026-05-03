"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/booking";
import { formatServiceTilePrice } from "@/lib/pricing";

type Props = {
  service: Service;
  selected: boolean;
  onSelect: () => void;
};

export function ServiceCard({ service, selected, onSelect }: Props) {
  // Phase 4.1: tile price line is per-service from pricing.ts. Inside-
  // home services show "From €X per visit · Yh · incl. 9% BTW";
  // fixed-price services (deep / move-in / move-out) show "From €X ·
  // fixed price · incl. 9% BTW"; commercial / specialist services
  // (office / after-builders) carry the 21% BTW label.
  const tilePrice = formatServiceTilePrice(service.id);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group relative flex h-full flex-col items-start gap-2 rounded-2xl border bg-white p-5 text-left transition-all",
        "hover:-translate-y-0.5 hover:shadow-[0_6px_24px_-12px_rgba(42,42,40,0.18)]",
        selected
          ? "border-brand-terracotta bg-gradient-to-b from-white to-brand-linen/60 shadow-[0_6px_24px_-12px_rgba(26,26,26,0.3)]"
          : "border-brand-hairline",
      )}
    >
      <div className="flex w-full items-start justify-between">
        <service.Icon
          aria-hidden
          className="h-6 w-6 text-brand-ink"
          strokeWidth={1.5}
        />
        <span
          aria-hidden
          className={cn(
            "grid h-6 w-6 place-items-center rounded-full border transition-all",
            selected
              ? "border-brand-terracotta bg-brand-terracotta text-white"
              : "border-brand-hairline text-transparent",
          )}
        >
          <Check className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="mt-2 font-display text-lg leading-tight tracking-tight text-brand-ink">
        {service.label}
      </div>
      <div className="text-sm text-brand-graphite">{service.desc}</div>
      <div className="mt-auto pt-3 text-xs font-medium text-brand-ink/70">
        {tilePrice}
      </div>
    </button>
  );
}
