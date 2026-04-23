"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingState } from "@/lib/booking";

type Props = {
  state: BookingState;
  onNotes: (field: "cleaner" | "office", value: string) => void;
  onConsent: (next: boolean) => void;
};

export function StepNotes({ state, onNotes, onConsent }: Props) {
  return (
    <div className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="notesCleaner"
          className="mb-1.5 block text-sm font-medium text-brand-ink"
        >
          Notes for your cleaner
        </label>
        <textarea
          id="notesCleaner"
          value={state.notesCleaner}
          onChange={(e) => onNotes("cleaner", e.target.value)}
          placeholder="Buzzer code, where to find the key, allergies, pets…"
          rows={3}
          className="w-full rounded-xl border border-brand-hairline bg-brand-linen p-4 text-sm text-brand-ink outline-none transition-all focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/30"
        />
      </div>
      <div>
        <label
          htmlFor="notesOffice"
          className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-brand-ink"
        >
          Notes for our team
          <span className="inline-flex items-center gap-1 text-xs font-normal text-brand-sage">
            <Lock className="h-3 w-3" /> Private · internal only
          </span>
        </label>
        <textarea
          id="notesOffice"
          value={state.notesOffice}
          onChange={(e) => onNotes("office", e.target.value)}
          placeholder="Billing contact, preferred cleaner, schedule quirks…"
          rows={3}
          className="w-full rounded-xl border border-brand-hairline bg-brand-linen p-4 text-sm text-brand-ink outline-none transition-all focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/30"
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-brand-hairline bg-white p-4 text-sm text-brand-ink/90">
        <input
          type="checkbox"
          checked={state.consent}
          onChange={(e) => onConsent(e.target.checked)}
          className="peer sr-only"
        />
        <span
          className={cn(
            "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors",
            state.consent
              ? "border-brand-ink bg-brand-ink text-brand-cream"
              : "border-brand-hairline bg-white",
          )}
          aria-hidden
        >
          {state.consent && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="h-3 w-3"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
        <span>
          Send me seasonal tips and offers. Low frequency, easy to opt out.
        </span>
      </label>
    </div>
  );
}
