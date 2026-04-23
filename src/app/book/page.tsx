"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { StepDetails } from "@/components/booking/StepDetails";
import { StepService } from "@/components/booking/StepService";
import { StepSpecifics } from "@/components/booking/StepSpecifics";
import { StepExtras } from "@/components/booking/StepExtras";
import { StepFrequency } from "@/components/booking/StepFrequency";
import { StepDateTime } from "@/components/booking/StepDateTime";
import { StepNotes } from "@/components/booking/StepNotes";
import { SummaryCard } from "@/components/booking/SummaryCard";
import { WHATSAPP_URL } from "@/lib/constants";
import { whatsappLink } from "@/lib/whatsapp";
import {
  buildBookingMessage,
  calcTotal,
  clearDraft,
  defaultBookingState,
  isBookingReady,
  loadDraft,
  saveConfirmed,
  saveDraft,
  validateDetails,
  type BookingState,
  type FrequencyId,
  type ServiceId,
} from "@/lib/booking";

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

const sectionReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
};

export default function BookPage() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, defaultBookingState);
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const refs = {
    1: useRef<HTMLDivElement>(null),
    2: useRef<HTMLDivElement>(null),
    3: useRef<HTMLDivElement>(null),
    4: useRef<HTMLDivElement>(null),
    5: useRef<HTMLDivElement>(null),
    6: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    const draft = loadDraft();
    if (draft) dispatch({ type: "hydrate", payload: draft });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveDraft(state);
  }, [state, hydrated]);

  const price = useMemo(() => calcTotal(state), [state]);
  const ready = isBookingReady(state);
  const v = validateDetails(state.details);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    (Object.entries(refs) as [string, React.RefObject<HTMLDivElement | null>][]).forEach(
      ([k, r]) => {
        if (!r.current) return;
        const id = Number(k);
        const obs = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) setActiveStep(id);
            });
          },
          { rootMargin: "-40% 0px -40% 0px" },
        );
        obs.observe(r.current);
        observers.push(obs);
      },
    );
    return () => observers.forEach((o) => o.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollTo = useCallback((id: number) => {
    const node = refs[id as 1 | 2 | 3 | 4 | 5 | 6]?.current;
    if (!node) return;
    const top = node.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onService = useCallback(
    (id: ServiceId) => {
      dispatch({ type: "service", id });
      setTimeout(() => scrollTo(3), 400);
    },
    [scrollTo],
  );
  const onFrequency = useCallback(
    (id: FrequencyId) => {
      dispatch({ type: "frequency", id });
      setTimeout(() => scrollTo(6), 400);
    },
    [scrollTo],
  );

  const waHref = useMemo(
    () => whatsappLink(buildBookingMessage(state)),
    [state],
  );

  const handleConfirm = useCallback(async () => {
    if (!ready || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const data: { success: boolean; ref?: string } = await res.json();
      if (!res.ok || !data.success || !data.ref) {
        throw new Error("Submit failed");
      }
      saveConfirmed({
        ref: data.ref,
        state,
        at: new Date().toISOString(),
      });
      clearDraft();
      router.push(`/book/confirmed?ref=${encodeURIComponent(data.ref)}`);
    } catch {
      // Fallback: hand off to WhatsApp
      window.open(waHref, "_blank", "noopener,noreferrer");
      setSubmitting(false);
    }
  }, [ready, submitting, state, router, waHref]);

  const progressSteps = [
    {
      id: 1,
      label: "Your Details",
      complete: v.allRequired,
    },
    { id: 2, label: "Service", complete: !!state.serviceId },
    { id: 3, label: "Specifics", complete: !!state.serviceId },
    {
      id: 4,
      label: "Extras",
      complete: Object.values(state.extras).some((q) => q > 0),
    },
    { id: 5, label: "Frequency", complete: !!state.frequencyId },
    {
      id: 6,
      label: "Date & Time",
      complete:
        !!state.preferredDate &&
        (!!state.preferredTime || state.waitingListJoined),
    },
  ];

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-6 md:pt-20">
        <p className="text-xs uppercase tracking-[0.22em] text-brand-graphite">
          Book a clean
        </p>
        <h1 className="mt-3 font-display text-[clamp(40px,7vw,68px)] leading-[1.02] tracking-tight text-brand-ink">
          A clean home, three minutes from here.
        </h1>
        <p className="mt-4 max-w-xl text-base text-brand-graphite md:text-lg">
          Tell us about your place, pick a time, confirm. We&apos;ll reply on
          WhatsApp within 15 minutes.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pb-40 lg:grid-cols-[220px_1fr_380px] lg:gap-12 lg:pb-16">
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <StepIndicator
              steps={progressSteps}
              active={activeStep}
              onJump={scrollTo}
            />
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-sm text-brand-graphite transition-colors hover:text-brand-ink"
            >
              <MessageCircle className="h-4 w-4 text-brand-sage" />
              Rather just chat?
            </a>
          </div>
        </div>

        <div className="space-y-14 md:space-y-20">
          <StepSection
            sectionRef={refs[1]}
            number={1}
            title="Your details"
            kicker="Who are we cleaning for"
          >
            <StepDetails
              state={state}
              onChange={(patch) => dispatch({ type: "details", patch })}
            />
          </StepSection>

          <StepSection
            sectionRef={refs[2]}
            number={2}
            title="Choose your service"
            kicker="Pick what fits today"
          >
            <StepService state={state} onSelect={onService} />
          </StepSection>

          <StepSection
            sectionRef={refs[3]}
            number={3}
            title="Home specifics"
            kicker="Helps us estimate hours"
          >
            <StepSpecifics
              state={state}
              onChange={(patch) => dispatch({ type: "home", patch })}
            />
          </StepSection>

          <StepSection
            sectionRef={refs[4]}
            number={4}
            title="Extras"
            kicker="Supplies & add-ons"
          >
            <StepExtras
              state={state}
              onExtra={(id, qty) => dispatch({ type: "extra", id, qty })}
            />
          </StepSection>

          <StepSection
            sectionRef={refs[5]}
            number={5}
            title="Frequency"
            kicker="Commit and save"
          >
            <StepFrequency state={state} onSelect={onFrequency} />
          </StepSection>

          <StepSection
            sectionRef={refs[6]}
            number={6}
            title="Date & time"
            kicker="When works for you"
          >
            <StepDateTime
              state={state}
              onDate={(date) => dispatch({ type: "date", date })}
              onTime={(time) => dispatch({ type: "time", time })}
              onWaitingList={(patch) =>
                dispatch({ type: "waitingList", patch })
              }
            />
            <StepNotes
              state={state}
              onNotes={(field, value) =>
                dispatch({ type: "notes", field, value })
              }
              onConsent={(value) => dispatch({ type: "consent", value })}
            />
          </StepSection>

          <div className="pt-2 text-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-brand-graphite transition-colors hover:text-brand-ink"
            >
              <MessageCircle className="h-4 w-4 text-brand-sage" />
              Rather just chat? WhatsApp us
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24">
            <SummaryCard
              price={price}
              state={state}
              ready={ready}
              submitting={submitting}
              waHref={waHref}
              onConfirm={handleConfirm}
              onWhatsApp={() => saveDraft(state)}
              onCoupon={(code) => dispatch({ type: "coupon", code })}
            />
          </div>
        </div>
      </div>

      <MobileSummaryBar
        price={price}
        state={state}
        ready={ready}
        submitting={submitting}
        waHref={waHref}
        onConfirm={handleConfirm}
        onWhatsApp={() => saveDraft(state)}
        onCoupon={(code) => dispatch({ type: "coupon", code })}
      />
    </div>
  );
}

function StepSection({
  sectionRef,
  number,
  title,
  kicker,
  children,
}: {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  number: number;
  title: string;
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      ref={sectionRef}
      {...sectionReveal}
      className="scroll-mt-24"
    >
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.22em] text-brand-sage">
          {String(number).padStart(2, "0")} · {kicker}
        </div>
        <h2 className="mt-2 font-display text-3xl tracking-tight text-brand-ink md:text-4xl">
          {title}
        </h2>
      </div>
      {children}
    </motion.section>
  );
}

function MobileSummaryBar(props: {
  price: ReturnType<typeof calcTotal>;
  state: BookingState;
  ready: boolean;
  submitting: boolean;
  waHref: string;
  onConfirm: () => void;
  onWhatsApp: () => void;
  onCoupon: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-hairline bg-brand-cream/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex flex-col items-start"
          >
            <span className="text-xs text-brand-graphite">
              Estimated total
            </span>
            <motion.span
              key={props.price.subtotal}
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-xl tabular-nums text-brand-ink"
            >
              {props.price.service
                ? `€${Math.round(props.price.subtotal)}`
                : "—"}
            </motion.span>
          </button>

          {props.ready ? (
            <button
              type="button"
              onClick={props.onConfirm}
              disabled={props.submitting}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-terracotta px-5 text-sm font-medium text-white shadow-[0_6px_20px_-10px_rgba(232,92,58,0.6)] disabled:opacity-70"
            >
              {props.submitting ? "Confirming…" : "Confirm booking"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand-ink px-5 text-sm font-medium text-brand-cream"
            >
              Review & book
            </button>
          )}
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-brand-ink/40 lg:hidden"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-brand-cream p-4 pb-8"
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-brand-hairline" />
            <SummaryCard compact {...props} />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
