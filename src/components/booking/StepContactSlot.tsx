"use client";

import { useMemo } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { TIME_SLOTS, type BookingState } from "@/lib/booking";

type Props = {
  state: BookingState;
  onContact: (patch: Partial<BookingState["contact"]>) => void;
  onDate: (date: string) => void;
  onTime: (time: string) => void;
  onNotes: (field: "cleaner" | "office", value: string) => void;
};

export function StepContactSlot({
  state,
  onContact,
  onDate,
  onTime,
  onNotes,
}: Props) {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const emailValid =
    !state.contact.email ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.contact.email);
  const phoneDigits = state.contact.phone.replace(/\D/g, "");
  const phoneValid = phoneDigits.length === 0 || phoneDigits.length >= 9;

  return (
    <div className="space-y-10">
      <div>
        <h3 className="font-display text-xl tracking-tight text-brand-ink">
          Where and who
        </h3>
        <p className="mt-1 text-sm text-brand-graphite">
          We&apos;ll confirm the details over WhatsApp in under 15 minutes.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Full name"
            required
            value={state.contact.name}
            onChange={(v) => onContact({ name: v })}
            placeholder="Sam Janssen"
          />
          <Field
            label="Phone"
            required
            value={state.contact.phone}
            onChange={(v) => onContact({ phone: v })}
            placeholder="+31 6 1234 5678"
            invalid={!phoneValid}
            hint={!phoneValid ? "Enter a valid phone number" : undefined}
            type="tel"
          />
          <Field
            label="Email"
            value={state.contact.email}
            onChange={(v) => onContact({ email: v })}
            placeholder="sam@example.com"
            invalid={!emailValid}
            hint={!emailValid ? "Enter a valid email" : "Optional"}
            type="email"
          />
          <Field
            label="Postal code"
            required
            value={state.contact.postalCode}
            onChange={(v) =>
              onContact({ postalCode: v.toUpperCase().slice(0, 7) })
            }
            placeholder="1012 AB"
          />
          <div className="sm:col-span-2">
            <Field
              label="Address"
              required
              value={state.contact.address}
              onChange={(v) => onContact({ address: v })}
              placeholder="Prinsengracht 263, Amsterdam"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl tracking-tight text-brand-ink">
          When would you like us?
        </h3>
        <p className="mt-1 text-sm text-brand-graphite">
          We&apos;ll confirm exact availability when we reply.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr]">
          <div>
            <label
              htmlFor="date"
              className="mb-1.5 block text-sm font-medium text-brand-ink"
            >
              Preferred date <span className="text-brand-terracotta">*</span>
            </label>
            <input
              id="date"
              type="date"
              min={today}
              value={state.preferredDate}
              onChange={(e) => onDate(e.target.value)}
              className="h-14 w-full rounded-xl border border-brand-hairline bg-brand-linen px-4 text-sm text-brand-ink outline-none transition-all focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/30"
            />
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-brand-ink">
              Preferred time <span className="text-brand-terracotta">*</span>
            </span>
            <div className="grid grid-cols-4 gap-2">
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
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl tracking-tight text-brand-ink">
          Anything we should know?
        </h3>
        <p className="mt-1 text-sm text-brand-graphite">
          Access, pets, allergies — whatever makes our visit smoother.
        </p>

        <div className="mt-5 space-y-5">
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
              placeholder="Parking, buzzer code, where to find the key…"
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
                <Lock className="h-3 w-3" /> Private
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
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  invalid,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  invalid?: boolean;
  hint?: string;
}) {
  const id = `f-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-brand-ink">
        {label}
        {required && <span className="ml-0.5 text-brand-terracotta">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-14 w-full rounded-xl border bg-brand-linen px-4 text-sm text-brand-ink outline-none transition-all focus:ring-2",
          invalid
            ? "border-brand-terracotta/50 focus:border-brand-terracotta focus:ring-brand-terracotta/20"
            : "border-brand-hairline focus:border-brand-sage focus:ring-brand-sage/30",
        )}
      />
      {hint && (
        <div
          className={cn(
            "mt-1 text-xs",
            invalid ? "text-brand-terracotta" : "text-brand-graphite",
          )}
        >
          {hint}
        </div>
      )}
    </div>
  );
}
