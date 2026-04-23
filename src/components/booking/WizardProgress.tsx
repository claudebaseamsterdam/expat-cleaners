"use client";

import { cn } from "@/lib/utils";

const STEPS = [
  { num: 1, label: "Home & service" },
  { num: 2, label: "Timing" },
  { num: 3, label: "Review" },
] as const;

type Props = {
  current: 1 | 2 | 3;
};

export function WizardProgress({ current }: Props) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3">
      {STEPS.map((s, i) => {
        const active = s.num === current;
        const done = s.num < current;
        return (
          <li key={s.num} className="flex items-center gap-2 sm:gap-3">
            <span
              className={cn(
                "inline-flex h-8 items-center gap-2 rounded-full px-3 text-xs font-medium transition-colors",
                active && "bg-brand-ink text-brand-cream",
                done && "bg-brand-sage text-white",
                !active &&
                  !done &&
                  "border border-brand-hairline bg-white text-brand-graphite",
              )}
            >
              <span className="font-display tabular-nums">
                {String(s.num).padStart(2, "0")}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </span>
            {i < STEPS.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "h-px w-6 transition-colors sm:w-10",
                  s.num < current ? "bg-brand-sage" : "bg-brand-hairline",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
