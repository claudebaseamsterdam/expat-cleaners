"use client";

import { StepService } from "@/components/booking/StepService";
import { StepSpecifics } from "@/components/booking/StepSpecifics";
import { StepExtras } from "@/components/booking/StepExtras";
import { StepFrequency } from "@/components/booking/StepFrequency";
import { cn } from "@/lib/utils";
import type {
  BookingState,
  FrequencyId,
  ServiceId,
} from "@/lib/booking";

type Props = {
  state: BookingState;
  onService: (id: ServiceId) => void;
  onHome: (patch: Partial<BookingState["home"]>) => void;
  onExtra: (id: string, qty: number) => void;
  onFrequency: (id: FrequencyId) => void;
  onPostcode: (postcode: string) => void;
};

const POSTCODE_RE = /^\s*\d{4}\s?[A-Z]{2}\s*$/i;

export function Step1HomeService({
  state,
  onService,
  onHome,
  onExtra,
  onFrequency,
  onPostcode,
}: Props) {
  const postcodeValid =
    !state.details.postalCode || POSTCODE_RE.test(state.details.postalCode);

  return (
    <div className="space-y-10">
      <PostcodeField
        value={state.details.postalCode}
        onChange={onPostcode}
        valid={postcodeValid}
      />

      <Subsection title="Choose your service">
        <StepService state={state} onSelect={onService} />
      </Subsection>

      <Subsection title="Home specifics">
        <StepSpecifics state={state} onChange={onHome} />
      </Subsection>

      <Subsection title="Extras">
        <StepExtras state={state} onExtra={onExtra} />
      </Subsection>

      <Subsection title="How often?">
        <StepFrequency state={state} onSelect={onFrequency} />
      </Subsection>
    </div>
  );
}

function Subsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-display text-xl tracking-tight text-brand-ink">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function PostcodeField({
  value,
  onChange,
  valid,
}: {
  value: string;
  onChange: (v: string) => void;
  valid: boolean;
}) {
  return (
    <div className="rounded-2xl border border-brand-hairline bg-white p-5 sm:p-6">
      <label
        htmlFor="postcode"
        className="mb-1.5 block text-sm font-medium text-brand-ink"
      >
        Postcode <span className="text-brand-terracotta">*</span>
      </label>
      <input
        id="postcode"
        inputMode="text"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase().slice(0, 7))}
        placeholder="1012 AB"
        className={cn(
          "h-14 w-full rounded-xl border bg-brand-linen px-4 text-sm text-brand-ink outline-none transition-all focus:ring-2",
          valid
            ? "border-brand-hairline focus:border-brand-sage focus:ring-brand-sage/30"
            : "border-brand-terracotta/60 focus:border-brand-terracotta focus:ring-brand-terracotta/20",
        )}
      />
      <p
        className={cn(
          "mt-1.5 text-xs",
          valid ? "text-brand-graphite" : "text-brand-terracotta",
        )}
      >
        {valid
          ? "4 digits + 2 letters. Example: 1012 AB."
          : "Enter a valid Dutch postcode (e.g. 1012 AB)."}
      </p>
    </div>
  );
}
