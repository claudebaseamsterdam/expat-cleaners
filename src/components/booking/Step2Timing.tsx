"use client";

import { StepDateTime } from "@/components/booking/StepDateTime";
import type { BookingState } from "@/lib/booking";

type Props = {
  state: BookingState;
  onDate: (date: string) => void;
  onTime: (time: string) => void;
  onWaitingList: (patch: { joined?: boolean; note?: string }) => void;
  onNotes: (field: "cleaner" | "office", value: string) => void;
};

export function Step2Timing({
  state,
  onDate,
  onTime,
  onWaitingList,
  onNotes,
}: Props) {
  return (
    <div className="space-y-10">
      <div>
        <h3 className="font-display text-xl tracking-tight text-brand-ink">
          When works for you?
        </h3>
        <p className="mt-1 text-sm text-brand-graphite">
          Pick a preferred date and time window. We&apos;ll confirm exact
          availability on WhatsApp.
        </p>
        <div className="mt-4">
          <StepDateTime
            state={state}
            onDate={onDate}
            onTime={onTime}
            onWaitingList={onWaitingList}
          />
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl tracking-tight text-brand-ink">
          Anything we should know?
        </h3>
        <p className="mt-1 text-sm text-brand-graphite">
          Split what the cleaner needs to know from how to get in. Both
          optional.
        </p>
        <div className="mt-4 space-y-5">
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
              placeholder="Allergies, pets, preferences, anything worth knowing…"
              rows={3}
              className="w-full rounded-xl border border-brand-hairline bg-brand-linen p-4 text-sm text-brand-ink outline-none transition-all focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/30"
            />
          </div>
          <div>
            <label
              htmlFor="accessInstructions"
              className="mb-1.5 block text-sm font-medium text-brand-ink"
            >
              Access instructions
            </label>
            <textarea
              id="accessInstructions"
              value={state.notesOffice}
              onChange={(e) => onNotes("office", e.target.value)}
              placeholder="Buzzer, key lockbox, doorman, entry code…"
              rows={3}
              className="w-full rounded-xl border border-brand-hairline bg-brand-linen p-4 text-sm text-brand-ink outline-none transition-all focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
