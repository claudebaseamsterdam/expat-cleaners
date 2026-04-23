"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = { id: number; label: string; complete: boolean };

type Props = {
  steps: Step[];
  active: number;
  onJump?: (id: number) => void;
};

export function ProgressSteps({ steps, active, onJump }: Props) {
  return (
    <ol className="flex flex-col gap-4">
      {steps.map((s) => {
        const isActive = s.id === active;
        const isDone = s.complete && !isActive;
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onJump?.(s.id)}
              className="group flex w-full items-center gap-3 text-left"
            >
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs font-semibold tabular-nums transition-colors",
                  isActive &&
                    "border-brand-sage bg-brand-sage text-white",
                  isDone &&
                    "border-brand-terracotta bg-brand-terracotta text-white",
                  !isActive &&
                    !isDone &&
                    "border-brand-hairline text-brand-graphite",
                )}
              >
                {isDone ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  String(s.id).padStart(2, "0")
                )}
              </span>
              <span
                className={cn(
                  "text-sm transition-colors",
                  isActive && "font-medium text-brand-ink",
                  isDone && "text-brand-ink/80",
                  !isActive && !isDone && "text-brand-graphite",
                )}
              >
                {s.label}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
