"use client";

import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { BUNDLES, type Bundle } from "@/lib/booking";

type Props = {
  selectedId: Bundle["id"] | null;
  onSelect: (bundle: Bundle, mode: "select" | "customize") => void;
  /** Called when the user clicks "I know what I need — show all services". */
  onSkip: () => void;
};

/**
 * Three pre-built bundles displayed above the granular service grid.
 * Solves the cognitive overload of the seven-service flat grid for
 * users who don't yet know what they need.
 *
 * Behavior:
 *  - "Select" pre-fills the booking state and dismisses bundles, leaving
 *    the user on Step 1 with the bundle's selections active so they can
 *    review and continue.
 *  - "Customize" does the same pre-fill but the parent's onSelect handler
 *    is expected to scroll to the granular grid so the user can adjust.
 *  - "I know what I need" (onSkip) collapses bundles and reveals the
 *    granular grid without applying any pre-fill.
 */
export function BundlePicker({ selectedId, onSelect, onSkip }: Props) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {BUNDLES.map((bundle) => (
          <BundleCard
            key={bundle.id}
            bundle={bundle}
            selected={selectedId === bundle.id}
            onSelect={(mode) => onSelect(bundle, mode)}
          />
        ))}
      </div>
      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={onSkip}
          className="text-sm font-medium text-brand-graphite underline-offset-4 transition-colors hover:text-brand-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-terracotta"
        >
          I know what I need — show all services
        </button>
      </div>
    </div>
  );
}

function BundleCard({
  bundle,
  selected,
  onSelect,
}: {
  bundle: Bundle;
  selected: boolean;
  onSelect: (mode: "select" | "customize") => void;
}) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-white p-5 transition-all sm:p-6",
        "hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-14px_rgba(42,42,40,0.22)]",
        selected
          ? "border-brand-terracotta bg-gradient-to-b from-white to-brand-linen/60 shadow-[0_8px_28px_-14px_rgba(26,26,26,0.32)]"
          : "border-brand-hairline",
      )}
    >
      <h3 className="font-display text-xl tracking-tight text-brand-ink">
        {bundle.name}
      </h3>
      <ul className="mt-4 space-y-2 text-sm text-brand-ink/85">
        {bundle.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <Check
              aria-hidden
              className="mt-0.5 h-4 w-4 shrink-0 text-brand-sage"
              strokeWidth={2}
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      {/* Phase 4.2 — bundle anchor price (e.g. "€295 + add-ons") for
          fixed-package bundles, "Live total updates after you select"
          for the recurring-hourly bundle. The full live total is
          always shown in the right rail / mobile bar; this slot is
          just the marketing anchor. */}
      <p className="mt-5 text-sm font-medium text-brand-ink">
        {bundle.priceLine}
      </p>
      <div className="mt-5 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onSelect("select")}
          className="inline-flex h-11 items-center justify-center rounded-full bg-brand-terracotta px-5 text-sm font-medium text-white transition-colors hover:bg-brand-terracotta-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-terracotta"
        >
          {selected ? "Selected" : "Select"}
        </button>
        <button
          type="button"
          onClick={() => onSelect("customize")}
          className="inline-flex h-9 items-center justify-center text-sm text-brand-graphite underline-offset-4 transition-colors hover:text-brand-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-terracotta"
        >
          Customize
          <ChevronDown aria-hidden className="ml-1 h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );
}
