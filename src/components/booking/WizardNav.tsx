"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  canBack: boolean;
  canNext: boolean;
  onBack: () => void;
  onNext: () => void;
  loading?: boolean;
  nextLabel?: string;
};

export function WizardNav({
  canBack,
  canNext,
  onBack,
  onNext,
  loading,
  nextLabel = "Next",
}: Props) {
  return (
    <div className="mt-10 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onBack}
        disabled={!canBack || loading}
        className={cn(
          "inline-flex h-12 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-all",
          canBack
            ? "border-brand-hairline bg-white text-brand-ink hover:border-brand-ink/30"
            : "cursor-not-allowed border-transparent bg-transparent text-brand-graphite/40",
        )}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext || loading}
        className="group inline-flex h-12 items-center gap-2 rounded-full bg-brand-ink px-6 text-sm font-medium text-brand-cream transition-all hover:bg-brand-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking…
          </>
        ) : (
          <>
            {nextLabel}
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </div>
  );
}
