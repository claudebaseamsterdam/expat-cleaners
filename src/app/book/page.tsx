"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { WizardProgress } from "@/components/booking/WizardProgress";
import { WizardNav } from "@/components/booking/WizardNav";
import { Step1HomeService } from "@/components/booking/Step1HomeService";
import { Step2Timing } from "@/components/booking/Step2Timing";
import { Step3Review } from "@/components/booking/Step3Review";
import { SummaryCard } from "@/components/booking/SummaryCard";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { whatsappLink } from "@/lib/whatsapp";
import {
  buildBookingMessage,
  calcTotal,
  clearDraft,
  defaultBookingState,
  loadDraft,
  saveConfirmed,
  saveDraft,
  type BookingState,
  type FrequencyId,
  type ServiceId,
} from "@/lib/booking";
import type {
  BookingPayload,
  BookingResponse,
  OpsCheckResponse,
} from "@/services/agents";

// ---------- Reducer ----------

type Action =
  | { type: "hydrate"; payload: BookingState }
  | { type: "details"; patch: Partial<BookingState["details"]> }
  | { type: "service"; id: ServiceId }
  | { type: "home"; patch: Partial<BookingState["home"]> }
  | { type: "extra"; id: string; qty: number }
  | { type: "frequency"; id: FrequencyId }
  | { type: "date"; date: string }
  | { type: "time"; time: string }
  | { type: "waitingList"; patch: { joined?: boolean; note?: string } }
  | { type: "notes"; field: "cleaner" | "office"; value: string }
  | { type: "consent"; value: boolean }
  | { type: "coupon"; code: string };

function reducer(state: BookingState, action: Action): BookingState {
  switch (action.type) {
    case "hydrate":
      return action.payload;
    case "details":
      return { ...state, details: { ...state.details, ...action.patch } };
    case "service":
      return { ...state, serviceId: action.id };
    case "home":
      return { ...state, home: { ...state.home, ...action.patch } };
    case "extra": {
      const next = { ...state.extras };
      if (action.qty <= 0) delete next[action.id];
      else next[action.id] = action.qty;
      return { ...state, extras: next };
    }
    case "frequency":
      return { ...state, frequencyId: action.id };
    case "date":
      return { ...state, preferredDate: action.date, waitingListJoined: false };
    case "time":
      return { ...state, preferredTime: action.time };
    case "waitingList":
      return {
        ...state,
        waitingListJoined: action.patch.joined ?? state.waitingListJoined,
        waitingListNote: action.patch.note ?? state.waitingListNote,
      };
    case "notes":
      return action.field === "cleaner"
        ? { ...state, notesCleaner: action.value }
        : { ...state, notesOffice: action.value };
    case "consent":
      return { ...state, consent: action.value };
    case "coupon":
      return { ...state, couponCode: action.code };
  }
}

const POSTCODE_RE = /^\s*\d{4}\s?[A-Z]{2}\s*$/i;
const EASE = [0.16, 1, 0.3, 1] as const;

type WizardStep = 1 | 2 | 3;

// ---------- Page ----------

export default function BookPage() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, defaultBookingState);
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<WizardStep>(1);
  const [opsCheck, setOpsCheck] = useState<OpsCheckResponse | null>(null);
  const [opsCheckLoading, setOpsCheckLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const draft = loadDraft();
    if (draft) dispatch({ type: "hydrate", payload: draft });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveDraft(state);
  }, [state, hydrated]);

  const price = useMemo(() => calcTotal(state), [state]);

  const step1Valid =
    POSTCODE_RE.test(state.details.postalCode) &&
    !!state.serviceId &&
    !!state.frequencyId;

  const step2Valid =
    !!state.preferredDate &&
    (!!state.preferredTime || state.waitingListJoined);

  // ---------- Handlers ----------

  const onPostcode = useCallback(
    (postcode: string) =>
      dispatch({ type: "details", patch: { postalCode: postcode } }),
    [],
  );
  const onService = useCallback(
    (id: ServiceId) => dispatch({ type: "service", id }),
    [],
  );
  const onHome = useCallback(
    (patch: Partial<BookingState["home"]>) => dispatch({ type: "home", patch }),
    [],
  );
  const onExtra = useCallback(
    (id: string, qty: number) => dispatch({ type: "extra", id, qty }),
    [],
  );
  const onFrequency = useCallback(
    (id: FrequencyId) => dispatch({ type: "frequency", id }),
    [],
  );
  const onDate = useCallback(
    (date: string) => dispatch({ type: "date", date }),
    [],
  );
  const onTime = useCallback(
    (time: string) => dispatch({ type: "time", time }),
    [],
  );
  const onWaitingList = useCallback(
    (patch: { joined?: boolean; note?: string }) =>
      dispatch({ type: "waitingList", patch }),
    [],
  );
  const onNotes = useCallback(
    (field: "cleaner" | "office", value: string) =>
      dispatch({ type: "notes", field, value }),
    [],
  );
  const onContact = useCallback(
    (patch: Partial<BookingState["details"]>) =>
      dispatch({ type: "details", patch }),
    [],
  );

  // Step 2 → 3 transition: run ops-check before rendering review
  const goToReview = useCallback(async () => {
    setOpsCheckLoading(true);
    setOpsCheck(null);
    setStep(3);
    try {
      const res = await fetch("/api/ops-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postcode: state.details.postalCode,
          preferred_date: state.preferredDate,
          preferred_time: state.preferredTime,
          hours_estimate: price.hours,
        }),
      });
      const data = (await res.json()) as OpsCheckResponse;
      setOpsCheck(data);
    } catch {
      // Fail-soft: assume feasible so the user can still continue via WhatsApp.
      setOpsCheck({
        feasible: true,
        reason:
          "Availability check unavailable — we'll confirm on WhatsApp.",
      });
    } finally {
      setOpsCheckLoading(false);
    }
  }, [
    state.details.postalCode,
    state.preferredDate,
    state.preferredTime,
    price.hours,
  ]);

  const useAlternative = useCallback(() => {
    if (!opsCheck?.alternative) return;
    dispatch({ type: "date", date: opsCheck.alternative.date });
    dispatch({ type: "time", time: opsCheck.alternative.time });
    setOpsCheck({ feasible: true });
  }, [opsCheck]);

  const goNext = useCallback(() => {
    if (step === 1 && step1Valid) setStep(2);
    else if (step === 2 && step2Valid) void goToReview();
  }, [step, step1Valid, step2Valid, goToReview]);

  const goBack = useCallback(() => {
    setStep((s) => (s > 1 ? ((s - 1) as WizardStep) : s));
    setOpsCheck(null);
    setOpsCheckLoading(false);
    setSubmitError(null);
  }, []);

  // Step 3 submit → call /api/booking, open WhatsApp, navigate to /thank-you
  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    setSubmitError(null);

    const payload: BookingPayload = {
      name: state.details.name,
      phone: state.details.phone,
      postcode: state.details.postalCode,
      home_size: `${state.home.beds}b/${state.home.baths}ba · ${state.home.type}${
        state.home.size ? ` · ${state.home.size}m²` : ""
      }`,
      service_type: state.frequencyId === "once" ? "one-time" : "recurring",
      frequency: state.frequencyId,
      hours_estimate: price.hours,
      addons: Object.entries(state.extras)
        .filter(([, qty]) => qty > 0)
        .map(([id]) => id),
      preferred_date: state.preferredDate,
      preferred_time: state.preferredTime,
      notes: state.notesCleaner,
      access_instructions: state.notesOffice,
    };

    let ref: string | undefined;
    let waMessage = buildBookingMessage(state);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as BookingResponse;
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Booking submission failed");
      }
      ref = data.ref;
      if (data.whatsappMessage) waMessage = data.whatsappMessage;
    } catch (err) {
      // Surface the error briefly but still hand off to WhatsApp so the user
      // can finish the booking manually.
      setSubmitError(
        err instanceof Error
          ? `${err.message} — opening WhatsApp anyway.`
          : "Something went wrong — opening WhatsApp anyway.",
      );
    }

    if (ref) {
      saveConfirmed({ ref, state, at: new Date().toISOString() });
    }
    clearDraft();

    // Open WhatsApp in a new tab
    window.open(whatsappLink(waMessage), "_blank", "noopener,noreferrer");

    // Navigate to thank-you
    const query = ref ? `?ref=${encodeURIComponent(ref)}` : "";
    router.push(`/thank-you${query}`);
  }, [state, price.hours, router]);

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-32 md:pt-20 lg:pb-20">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.22em] text-brand-graphite">
            Book a clean
          </p>
          <h1 className="mt-3 font-display text-[clamp(36px,6vw,56px)] leading-[1.02] tracking-tight">
            Three steps. Then WhatsApp.
          </h1>
          <p className="mt-4 max-w-xl text-base text-brand-graphite">
            Tell us about your home, pick a time, confirm. A human will reply
            on WhatsApp within 15 minutes.
          </p>
        </div>

        <div className="mb-8">
          <WizardProgress current={step} />
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {step === 1 && (
                  <Step1HomeService
                    state={state}
                    onService={onService}
                    onHome={onHome}
                    onExtra={onExtra}
                    onFrequency={onFrequency}
                    onPostcode={onPostcode}
                  />
                )}
                {step === 2 && (
                  <Step2Timing
                    state={state}
                    onDate={onDate}
                    onTime={onTime}
                    onWaitingList={onWaitingList}
                    onNotes={onNotes}
                  />
                )}
                {step === 3 && (
                  <Step3Review
                    state={state}
                    price={price}
                    opsCheck={opsCheck}
                    opsCheckLoading={opsCheckLoading}
                    onContact={onContact}
                    onUseAlternative={useAlternative}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                    submitError={submitError}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {step < 3 ? (
              <WizardNav
                canBack={step > 1}
                canNext={step === 1 ? step1Valid : step2Valid}
                onBack={goBack}
                onNext={goNext}
                loading={step === 2 && opsCheckLoading}
                nextLabel={step === 2 ? "Review" : "Next"}
              />
            ) : (
              <div className="mt-8">
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex h-11 items-center gap-2 text-sm text-brand-graphite hover:text-brand-ink"
                >
                  ← Back to timing
                </button>
              </div>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <SummaryCard
                price={price}
                state={state}
                ready={false}
                submitting={false}
                waHref={whatsappLink(buildBookingMessage(state))}
                onConfirm={() => {}}
                onWhatsApp={() => {}}
                onCoupon={(code) => dispatch({ type: "coupon", code })}
                readOnly
              />
            </div>
          </aside>
        </div>
      </div>
      <WhatsAppFloat variant="booking" />
    </div>
  );
}
