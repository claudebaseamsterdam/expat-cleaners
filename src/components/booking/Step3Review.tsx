"use client";

import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatEuro,
  formatHours,
  type BookingState,
  type PriceBreakdown,
} from "@/lib/booking";
import type { OpsCheckResponse } from "@/services/agents";

type Props = {
  state: BookingState;
  price: PriceBreakdown;
  opsCheck: OpsCheckResponse | null;
  opsCheckLoading: boolean;
  onContact: (patch: Partial<BookingState["details"]>) => void;
  onUseAlternative: () => void;
  onSubmit: () => void;
  submitting: boolean;
  submitError: string | null;
};

export function Step3Review({
  state,
  price,
  opsCheck,
  opsCheckLoading,
  onContact,
  onUseAlternative,
  onSubmit,
  submitting,
  submitError,
}: Props) {
  const phoneDigits = state.details.phone.replace(/\D/g, "");
  const nameValid = state.details.name.trim().length >= 2;
  const phoneValid = phoneDigits.length >= 9;
  const canSubmit =
    nameValid &&
    phoneValid &&
    (!opsCheck || opsCheck.feasible) &&
    !opsCheckLoading &&
    !submitting;

  return (
    <div className="space-y-8">
      {/* Ops check status */}
      <div
        className={cn(
          "rounded-2xl border p-5 sm:p-6",
          opsCheckLoading && "border-brand-hairline bg-white",
          !opsCheckLoading &&
            opsCheck?.feasible &&
            "border-brand-sage/40 bg-brand-sage/[0.06]",
          !opsCheckLoading &&
            opsCheck &&
            !opsCheck.feasible &&
            "border-brand-amber/60 bg-brand-amber/[0.08]",
        )}
      >
        {opsCheckLoading ? (
          <div className="flex items-center gap-3 text-sm text-brand-ink">
            <Loader2 className="h-4 w-4 animate-spin text-brand-sage" />
            Checking availability in your area…
          </div>
        ) : opsCheck?.feasible ? (
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-sage" />
            <div>
              <p className="text-sm font-medium text-brand-ink">
                Your slot is available.
              </p>
              <p className="mt-0.5 text-xs text-brand-graphite">
                We&apos;ll confirm the exact cleaner on WhatsApp.
              </p>
            </div>
          </div>
        ) : opsCheck ? (
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-brand-amber" />
            <div className="flex-1">
              <p className="text-sm font-medium text-brand-ink">
                {opsCheck.reason || "That slot is at capacity."}
              </p>
              {opsCheck.alternative ? (
                <>
                  <p className="mt-0.5 text-xs text-brand-graphite">
                    {opsCheck.alternative.note}
                  </p>
                  <p className="mt-3 text-sm text-brand-ink">
                    Next available:{" "}
                    <strong>{opsCheck.alternative.date}</strong> at{" "}
                    <strong>{opsCheck.alternative.time}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={onUseAlternative}
                    className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-brand-ink px-4 text-sm font-medium text-brand-cream hover:bg-brand-ink/90"
                  >
                    Use this slot
                  </button>
                </>
              ) : (
                <p className="mt-1 text-xs text-brand-graphite">
                  Head back a step and pick a different time.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Contact capture */}
      <div className="rounded-2xl border border-brand-hairline bg-white p-5 sm:p-6">
        <h3 className="font-display text-xl tracking-tight text-brand-ink">
          Your contact
        </h3>
        <p className="mt-1 text-sm text-brand-graphite">
          So we can confirm on WhatsApp. We never call unprompted.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Full name"
            required
            value={state.details.name}
            onChange={(v) => onContact({ name: v })}
            placeholder="Sam Janssen"
            invalid={state.details.name.length > 0 && !nameValid}
            errorMsg="At least 2 characters"
          />
          <Field
            label="Phone"
            required
            type="tel"
            value={state.details.phone}
            onChange={(v) => onContact({ phone: v })}
            placeholder="+31 6 1234 5678"
            invalid={phoneDigits.length > 0 && !phoneValid}
            errorMsg="Enter a valid phone number"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-brand-hairline bg-white p-5 sm:p-6">
        <h3 className="font-display text-xl tracking-tight text-brand-ink">
          Summary
        </h3>
        <dl className="mt-4 space-y-2.5 text-sm">
          <Row label="Service" value={price.service?.label ?? "—"} />
          <Row label="Frequency" value={price.frequency.label} />
          <Row
            label="Home"
            value={`${state.home.beds} bed · ${state.home.baths} bath · ${state.home.type}${
              state.home.size ? ` · ${state.home.size}m²` : ""
            }`}
          />
          <Row label="Estimated hours" value={formatHours(price.hours)} />
          <Row
            label="Estimated price"
            value={formatEuro(price.subtotal)}
            highlight
          />
          <Row label="Preferred date" value={state.preferredDate || "—"} />
          <Row label="Preferred time" value={state.preferredTime || "—"} />
          {state.details.postalCode && (
            <Row label="Postcode" value={state.details.postalCode} />
          )}
        </dl>
        <p className="mt-4 text-xs text-brand-graphite">
          Final price confirmed before the clean. No payment online.
        </p>
      </div>

      {/* Confirm CTA */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-terracotta text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-14px_rgba(232,92,58,0.6)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Opening WhatsApp…
          </>
        ) : (
          <>
            Continue on WhatsApp
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
          </>
        )}
      </button>
      {submitError && (
        <p className="text-sm text-brand-terracotta">{submitError}</p>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <dt className="text-brand-graphite">{label}</dt>
      <dd
        className={cn(
          "text-right",
          highlight
            ? "font-display text-xl tabular-nums text-brand-ink"
            : "text-brand-ink",
        )}
      >
        {value}
      </dd>
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
  errorMsg,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  invalid?: boolean;
  errorMsg?: string;
}) {
  const id = `c-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-brand-ink"
      >
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
            ? "border-brand-terracotta/60 focus:border-brand-terracotta focus:ring-brand-terracotta/20"
            : "border-brand-hairline focus:border-brand-sage focus:ring-brand-sage/30",
        )}
      />
      {invalid && errorMsg && (
        <p className="mt-1 text-xs text-brand-terracotta">{errorMsg}</p>
      )}
    </div>
  );
}
