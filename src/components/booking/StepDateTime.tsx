"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  TIME_SLOTS,
  isDateFullyBooked,
  type BookingState,
} from "@/lib/booking";
import { formatLocalDate } from "@/lib/date";

type Props = {
  state: BookingState;
  onDate: (date: string) => void;
  onTime: (time: string) => void;
  onWaitingList: (patch: {
    joined?: boolean;
    note?: string;
  }) => void;
};

type CalCell =
  | { kind: "spacer" }
  | { kind: "day"; date: string; day: number; past: boolean; fullyBooked: boolean };

function getMonthGrid(ref: Date): {
  label: string;
  cells: CalCell[];
  year: number;
  monthIndex: number;
} {
  const year = ref.getFullYear();
  const monthIndex = ref.getMonth();
  const first = new Date(year, monthIndex, 1);
  const startDow = (first.getDay() + 6) % 7; // Monday-first: Mon=0, Sun=6
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const cells: CalCell[] = [];
  for (let i = 0; i < startDow; i++) cells.push({ kind: "spacer" });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, monthIndex, d);
    // Local Y-M-D — never .toISOString().slice(0,10), which shifts CEST
    // midnight back to the previous UTC day. See lib/date.ts.
    const iso = formatLocalDate(dt);
    cells.push({
      kind: "day",
      date: iso,
      day: d,
      past: dt < today,
      fullyBooked: isDateFullyBooked(iso),
    });
  }

  const label = ref.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
  return { label, cells, year, monthIndex };
}

const WEEK = ["M", "T", "W", "T", "F", "S", "S"];

export function StepDateTime({
  state,
  onDate,
  onTime,
  onWaitingList,
}: Props) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const { label, cells } = useMemo(() => getMonthGrid(cursor), [cursor]);

  const prevMonth = () => {
    const next = new Date(cursor);
    next.setMonth(cursor.getMonth() - 1);
    setCursor(next);
  };
  const nextMonth = () => {
    const next = new Date(cursor);
    next.setMonth(cursor.getMonth() + 1);
    setCursor(next);
  };

  const dateFullyBooked =
    !!state.preferredDate && isDateFullyBooked(state.preferredDate);

  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  const canGoBack =
    cursor.getFullYear() > thisMonth.getFullYear() ||
    (cursor.getFullYear() === thisMonth.getFullYear() &&
      cursor.getMonth() > thisMonth.getMonth());

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-brand-hairline bg-white p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={prevMonth}
            disabled={!canGoBack}
            aria-label="Previous month"
            className="grid h-10 w-10 place-items-center rounded-full border border-brand-hairline bg-white transition-colors hover:border-brand-ink/30 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4 text-brand-ink" />
          </button>
          <div className="font-display text-lg tracking-tight text-brand-ink">
            {label}
          </div>
          <button
            type="button"
            onClick={nextMonth}
            aria-label="Next month"
            className="grid h-10 w-10 place-items-center rounded-full border border-brand-hairline bg-white transition-colors hover:border-brand-ink/30"
          >
            <ChevronRight className="h-4 w-4 text-brand-ink" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-wider text-brand-graphite">
          {WEEK.map((w, i) => (
            <div key={i} className="py-1">
              {w}
            </div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((c, i) => {
            if (c.kind === "spacer")
              return <div key={i} aria-hidden className="h-10 sm:h-11" />;

            const selected = state.preferredDate === c.date;
            const disabled = c.past;
            return (
              <button
                key={c.date}
                type="button"
                onClick={() => !disabled && onDate(c.date)}
                disabled={disabled}
                aria-pressed={selected}
                className={cn(
                  "h-10 rounded-lg text-sm font-medium tabular-nums transition-all sm:h-11",
                  disabled
                    ? "cursor-not-allowed text-brand-graphite/40"
                    : selected
                      ? "bg-brand-ink text-brand-cream"
                      : c.fullyBooked
                        ? "bg-brand-linen text-brand-graphite hover:ring-1 hover:ring-brand-hairline"
                        : "text-brand-ink hover:bg-brand-linen",
                )}
              >
                {c.day}
                {c.fullyBooked && !selected && (
                  <span className="ml-0.5 text-[8px] align-top text-brand-terracotta">
                    ●
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-2 text-[11px] text-brand-graphite">
          <span className="inline-block h-2 w-2 rounded-full bg-brand-terracotta" />
          Fully booked — join the waiting list
        </div>
      </div>

      {state.preferredDate && !dateFullyBooked && (
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-brand-ink">
            <Clock className="h-4 w-4 text-brand-sage" />
            Preferred time
            <span className="text-brand-terracotta">*</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TIME_SLOTS.map((t) => {
              const selected = state.preferredTime === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => onTime(t)}
                  aria-pressed={selected}
                  className={cn(
                    "h-14 rounded-xl border text-sm font-medium tabular-nums transition-all",
                    selected
                      ? "border-brand-ink bg-brand-ink text-brand-cream"
                      : "border-brand-hairline bg-white text-brand-ink hover:border-brand-ink/30",
                  )}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {dateFullyBooked && (
        <div className="rounded-2xl border border-brand-terracotta/30 bg-brand-terracotta/[0.06] p-5 sm:p-6">
          <h4 className="font-display text-lg tracking-tight text-brand-ink">
            That day&apos;s fully booked.
          </h4>
          <p className="mt-1 text-sm text-brand-graphite">
            Join the waiting list — we&apos;ll message you the moment a slot
            opens.
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <div className="mb-1.5 text-sm font-medium text-brand-ink">
                Preferred time
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {TIME_SLOTS.map((t) => {
                  const selected = state.preferredTime === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => onTime(t)}
                      aria-pressed={selected}
                      className={cn(
                        "h-12 rounded-xl border text-sm font-medium tabular-nums transition-all",
                        selected
                          ? "border-brand-ink bg-brand-ink text-brand-cream"
                          : "border-brand-hairline bg-white text-brand-ink hover:border-brand-ink/30",
                      )}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor="wlNote"
                className="mb-1.5 block text-sm font-medium text-brand-ink"
              >
                Anything else we should know? (optional)
              </label>
              <textarea
                id="wlNote"
                value={state.waitingListNote}
                onChange={(e) => onWaitingList({ note: e.target.value })}
                rows={2}
                placeholder="Flexibility on time, specific cleaner request, etc."
                className="w-full rounded-xl border border-brand-hairline bg-white p-4 text-sm text-brand-ink outline-none transition-all focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/30"
              />
            </div>

            {state.waitingListJoined ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-sage/15 px-4 py-2 text-sm font-medium text-brand-sage">
                ✓ You&apos;re on the waiting list.
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onWaitingList({ joined: true })}
                disabled={!state.preferredTime}
                className="inline-flex h-12 items-center justify-center rounded-full bg-brand-terracotta px-6 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-12px_rgba(26,26,26,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Join waiting list
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
