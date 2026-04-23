"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookSummary } from "@/components/book/BookSummary";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import {
  ADDONS,
  FREQUENCIES,
  SERVICES,
  buildWhatsAppMessage,
  computePrice,
  defaultBookingState,
  formatEuro,
  track,
  type AddonId,
  type BookingState,
  type FrequencyId,
  type ServiceId,
} from "@/lib/booking";

const HOURS_MAX = 12;

export default function BookPage() {
  const [state, setState] = useState<BookingState>(defaultBookingState);

  useEffect(() => {
    track("book_page_view");
  }, []);

  const price = useMemo(() => computePrice(state), [state]);
  const service = price.service;
  const minHours = service?.minHours ?? 1;
  const canContinue = !!service;

  const waHref = useMemo(
    () => whatsappLink(buildWhatsAppMessage(state)),
    [state],
  );

  const pickService = (id: ServiceId) => {
    setState((s) => {
      const next: BookingState = { ...s, serviceId: id };
      const chosen = SERVICES.find((x) => x.id === id);
      if (!chosen) return next;
      if (s.hours < chosen.minHours) next.hours = chosen.minHours;
      if (!chosen.allowsFrequency) {
        next.frequencyId = "one-time";
      } else if (s.frequencyId === "one-time") {
        next.frequencyId = "weekly";
      }
      return next;
    });
    track("service_selected", { id });
  };

  const setHours = (h: number) => {
    const clamped = Math.max(minHours, Math.min(HOURS_MAX, h));
    setState((s) => ({ ...s, hours: clamped }));
  };

  const setAddon = (id: AddonId, qty: number) => {
    setState((s) => {
      const was = s.addons[id] ?? 0;
      const next = { ...s.addons };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      if (was === 0 && qty > 0) track("addon_added", { id, qty });
      return { ...s, addons: next };
    });
  };

  const setFrequency = (id: FrequencyId) => {
    setState((s) => ({ ...s, frequencyId: id }));
    track("frequency_selected", { id });
  };

  const update = <K extends keyof BookingState>(
    key: K,
    value: BookingState[K],
  ) => setState((s) => ({ ...s, [key]: value }));

  const onWhatsApp = () => {
    track("whatsapp_click", {
      total: price.total,
      service: service?.id,
      frequency: price.frequency.id,
    });
  };

  const today = new Date().toISOString().slice(0, 10);
  const scheduleStep = service?.allowsFrequency ? 5 : 4;
  const detailsStep = service?.allowsFrequency ? 6 : 5;

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-6 md:pt-16">
        <h1 className="font-display text-4xl md:text-5xl tracking-tight">
          Book your cleaning
        </h1>
        <p className="mt-3 max-w-xl text-brand-ink/70">
          Pick your service, see your price, finish in WhatsApp. No sign-up.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 pb-36 lg:grid-cols-[1fr_380px] lg:gap-10 lg:pb-16">
        <div className="space-y-10">
          <Step number={1} title="Choose your service">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SERVICES.map((s) => {
                const selected = state.serviceId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => pickService(s.id)}
                    aria-pressed={selected}
                    className={cn(
                      "group rounded-xl border p-4 text-left transition-colors",
                      selected
                        ? "border-brand-ink bg-white shadow-sm"
                        : "border-brand-stone bg-white/70 hover:border-brand-ink/40 hover:bg-white",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium text-brand-ink">
                          {s.name}
                        </div>
                        <div className="mt-1 text-sm text-brand-ink/60">
                          {s.description}
                        </div>
                      </div>
                      <span
                        aria-hidden
                        className={cn(
                          "grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors",
                          selected
                            ? "border-brand-ink bg-brand-ink text-brand-cream"
                            : "border-brand-stone text-transparent",
                        )}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-brand-ink/70">
                      From {formatEuro(s.rate)}/hr · min {s.minHours}h
                    </div>
                  </button>
                );
              })}
            </div>
          </Step>

          <Step number={2} title="How many hours?">
            <div className="flex items-center gap-4">
              <StepperButton
                onClick={() => setHours(state.hours - 1)}
                disabled={!service || state.hours <= minHours}
                label="Decrease hours"
              >
                <Minus className="h-4 w-4" />
              </StepperButton>
              <div className="min-w-[84px] text-center">
                <div className="font-display text-3xl tabular-nums">
                  {state.hours}
                </div>
                <div className="text-xs text-brand-ink/50">hours</div>
              </div>
              <StepperButton
                onClick={() => setHours(state.hours + 1)}
                disabled={!service || state.hours >= HOURS_MAX}
                label="Increase hours"
              >
                <Plus className="h-4 w-4" />
              </StepperButton>
              {service && (
                <span className="ml-2 text-sm text-brand-ink/55">
                  Minimum {minHours}h for {service.name.toLowerCase()}
                </span>
              )}
            </div>
          </Step>

          <Step number={3} title="Add extras">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {ADDONS.map((a) => {
                const qty = state.addons[a.id] ?? 0;
                const active = qty > 0;
                return (
                  <div
                    key={a.id}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-lg border bg-white px-4 py-3 transition-colors",
                      active ? "border-brand-ink" : "border-brand-stone",
                    )}
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-brand-ink">
                        {a.name}
                      </div>
                      <div className="text-xs text-brand-ink/55">
                        +{formatEuro(a.price)}
                      </div>
                    </div>
                    {active ? (
                      <div className="flex items-center gap-2">
                        <StepperButton
                          small
                          onClick={() => setAddon(a.id, qty - 1)}
                          label={`Decrease ${a.name}`}
                        >
                          <Minus className="h-3 w-3" />
                        </StepperButton>
                        <span className="w-6 text-center text-sm tabular-nums">
                          {qty}
                        </span>
                        <StepperButton
                          small
                          onClick={() => setAddon(a.id, qty + 1)}
                          label={`Increase ${a.name}`}
                        >
                          <Plus className="h-3 w-3" />
                        </StepperButton>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setAddon(a.id, 1)}
                        className="text-sm font-medium text-brand-ink/70 hover:text-brand-ink"
                      >
                        Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </Step>

          {service?.allowsFrequency && (
            <Step number={4} title="How often?">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {FREQUENCIES.map((f) => {
                  const selected = state.frequencyId === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFrequency(f.id)}
                      aria-pressed={selected}
                      className={cn(
                        "rounded-lg border bg-white px-3 py-3 text-center transition-colors",
                        selected
                          ? "border-brand-ink"
                          : "border-brand-stone hover:border-brand-ink/40",
                      )}
                    >
                      <div className="text-sm font-medium text-brand-ink">
                        {f.name}
                      </div>
                      {f.discount > 0 && (
                        <div className="mt-0.5 text-xs text-brand-sage">
                          −{Math.round(f.discount * 100)}%
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </Step>
          )}

          <Step number={scheduleStep} title="When?">
            <div className="grid max-w-md grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="date"
                  className="mb-1.5 block text-sm text-brand-ink/70"
                >
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  min={today}
                  value={state.date}
                  onChange={(e) => update("date", e.target.value)}
                  className="bg-white"
                />
              </div>
              <div>
                <Label
                  htmlFor="time"
                  className="mb-1.5 block text-sm text-brand-ink/70"
                >
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={state.time}
                  onChange={(e) => update("time", e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>
          </Step>

          <Step number={detailsStep} title="Your details">
            <div className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor="name"
                  className="mb-1.5 block text-sm text-brand-ink/70"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  value={state.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your name"
                  className="bg-white"
                />
              </div>
              <div>
                <Label
                  htmlFor="postcode"
                  className="mb-1.5 block text-sm text-brand-ink/70"
                >
                  Postcode
                </Label>
                <Input
                  id="postcode"
                  value={state.postcode}
                  onChange={(e) => update("postcode", e.target.value)}
                  placeholder="1012 AB"
                  className="bg-white"
                />
              </div>
              <div className="sm:col-span-2">
                <Label
                  htmlFor="notes"
                  className="mb-1.5 block text-sm text-brand-ink/70"
                >
                  Notes (optional)
                </Label>
                <Textarea
                  id="notes"
                  value={state.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Parking, pets, access instructions…"
                  rows={3}
                  className="bg-white"
                />
              </div>
            </div>
          </Step>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-6">
            <BookSummary
              price={price}
              state={state}
              waHref={waHref}
              canContinue={canContinue}
              onContinue={onWhatsApp}
            />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-stone bg-white/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <div className="text-xs text-brand-ink/55">Estimated total</div>
            <div className="font-display text-xl tabular-nums">
              {canContinue ? formatEuro(price.total) : "—"}
            </div>
          </div>
          {canContinue ? (
            <a
              href={waHref}
              onClick={onWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand-ink px-5 text-sm font-medium text-brand-cream transition-colors hover:bg-brand-ink/90"
            >
              Continue on WhatsApp
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex h-12 cursor-not-allowed items-center justify-center rounded-full bg-brand-ink px-5 text-sm font-medium text-brand-cream opacity-50"
            >
              Pick a service
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-baseline gap-3">
        <span className="text-xs uppercase tracking-[0.18em] text-brand-ink/40">
          Step {number}
        </span>
        <h2 className="font-display text-2xl tracking-tight text-brand-ink md:text-[28px]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function StepperButton({
  onClick,
  disabled,
  label,
  small,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  small?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "grid place-items-center rounded-full border border-brand-stone bg-white transition-colors hover:border-brand-ink/40 disabled:cursor-not-allowed disabled:opacity-40",
        small ? "h-8 w-8" : "h-11 w-11",
      )}
    >
      {children}
    </button>
  );
}
