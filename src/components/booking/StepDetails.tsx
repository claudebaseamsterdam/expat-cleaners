"use client";

import { cn } from "@/lib/utils";
import { validateDetails, type BookingState } from "@/lib/booking";

type Props = {
  state: BookingState;
  onChange: (patch: Partial<BookingState["details"]>) => void;
};

export function StepDetails({ state, onChange }: Props) {
  const v = validateDetails(state.details);

  return (
    <div className="rounded-2xl border border-brand-hairline bg-white p-5 sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Full name"
          required
          value={state.details.name}
          onChange={(name) => onChange({ name })}
          placeholder="Sam Janssen"
          showError={state.details.name.length > 0 && !v.name}
          errorMsg="Enter at least 2 characters"
        />
        <Field
          label="Phone"
          required
          type="tel"
          value={state.details.phone}
          onChange={(phone) => onChange({ phone })}
          placeholder="+31 6 1234 5678"
          showError={state.details.phone.replace(/\D/g, "").length > 0 && !v.phone}
          errorMsg="Enter a valid phone number"
        />
        <Field
          label="Email"
          required
          type="email"
          value={state.details.email}
          onChange={(email) => onChange({ email })}
          placeholder="sam@example.com"
          showError={state.details.email.length > 0 && !v.email}
          errorMsg="Enter a valid email"
        />
        <Field
          label="Postal code"
          required
          value={state.details.postalCode}
          onChange={(postalCode) =>
            onChange({ postalCode: postalCode.toUpperCase().slice(0, 7) })
          }
          placeholder="1012 AB"
          showError={
            state.details.postalCode.length > 0 && !v.postalCode
          }
          errorMsg="Format 1012 AB"
        />
        <div className="sm:col-span-2">
          <Field
            label="Full address"
            required
            value={state.details.address}
            onChange={(address) => onChange({ address })}
            placeholder="Prinsengracht 263, Amsterdam"
            showError={state.details.address.length > 0 && !v.address}
            errorMsg="Add your street and number"
          />
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
  showError,
  errorMsg,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  showError?: boolean;
  errorMsg?: string;
}) {
  const id = `d-${label.toLowerCase().replace(/\s+/g, "-")}`;
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
          showError
            ? "border-brand-terracotta/60 focus:border-brand-terracotta focus:ring-brand-terracotta/20"
            : "border-brand-hairline focus:border-brand-sage focus:ring-brand-sage/30",
        )}
      />
      {showError && errorMsg && (
        <div className="mt-1 text-xs text-brand-terracotta">{errorMsg}</div>
      )}
    </div>
  );
}
