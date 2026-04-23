"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { ProgressSteps } from "@/components/booking/ProgressSteps";
import { StepHome } from "@/components/booking/StepHome";
import { StepExtrasFrequency } from "@/components/booking/StepExtrasFrequency";
import { StepContactSlot } from "@/components/booking/StepContactSlot";
import { SummaryCard } from "@/components/booking/SummaryCard";
import { whatsappLink } from "@/lib/whatsapp";
import {
  buildBookingMessage,
  calcTotal,
  defaultBookingState,
  isBookingReady,
  loadDraft,
  saveDraft,
  type BookingState,
  type FrequencyId,
  type ServiceId,
} from "@/lib/booking";

type Action =
  | { type: "hydrate"; payload: BookingState }
  | { type: "setService"; id: ServiceId }
  | { type: "setHome"; patch: Partial<BookingState["home"]> }
  | { type: "setExtra"; id: string; qty: number }
  | { type: "setFrequency"; id: FrequencyId }
  | { type: "setContact"; patch: Partial<BookingState["contact"]> }
  | { type: "setDate"; date: string }
  | { type: "setTime"; time: string }
  | { type: "setNotes"; field: "cleaner" | "office"; value: string };

function reducer(state: BookingState, action: Action): BookingState {
  switch (action.type) {
    case "hydrate":
      return action.payload;
    case "setService":
      return { ...state, serviceId: action.id };
    case "setHome":
      return { ...state, home: { ...state.home, ...action.patch } };
    case "setExtra": {
      const next = { ...state.extras };
      if (action.qty <= 0) delete next[action.id];
      else next[action.id] = action.qty;
      return { ...state, extras: next };
    }
    case "setFrequency":
      return { ...state, frequencyId: action.id };
    case "setContact":
      return { ...state, contact: { ...state.contact, ...action.patch } };
    case "setDate":
      return { ...state, preferredDate: action.date };
    case "setTime":
      return { ...state, preferredTime: action.time };
    case "setNotes":
      return action.field === "cleaner"
        ? { ...state, notesCleaner: action.value }
        : { ...state, notesOffice: action.value };
  }
}

const sectionMotion = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

export default function BookPage() {
  const [state, dispatch] = useReducer(reducer, defaultBookingState);
  const [hydrated, setHydrated] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);

  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

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

  const step1Done = !!state.serviceId;
  const step2Done = step1Done && !!state.frequencyId;
  const step3Done = ready;

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const sections: [HTMLDivElement | null, number][] = [
      [step1Ref.current, 1],
      [step2Ref.current, 2],
      [step3Ref.current, 3],
    ];
    sections.forEach(([node, id]) => {
      if (!node) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActiveStep(id);
          });
        },
        { rootMargin: "-40% 0px -40% 0px" },
      );
      obs.observe(node);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToStep = useCallback((id: number) => {
    const map: Record<number, React.RefObject<HTMLDivElement | null>> = {
      1: step1Ref,
      2: step2Ref,
      3: step3Ref,
    };
    const node = map[id]?.current;
    if (!node) return;
    const top = node.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  const onService = useCallback(
    (id: ServiceId) => {
      dispatch({ type: "setService", id });
      setTimeout(() => scrollToStep(2), 450);
    },
    [scrollToStep],
  );

  const onHome = useCallback(
    (patch: Partial<BookingState["home"]>) =>
      dispatch({ type: "setHome", patch }),
    [],
  );
  const onExtra = useCallback(
    (id: string, qty: number) => dispatch({ type: "setExtra", id, qty }),
    [],
  );
  const onFrequency = useCallback(
    (id: FrequencyId) => dispatch({ type: "setFrequency", id }),
    [],
  );
  const onContact = useCallback(
    (patch: Partial<BookingState["contact"]>) =>
      dispatch({ type: "setContact", patch }),
    [],
  );
  const onDate = useCallback(
    (date: string) => dispatch({ type: "setDate", date }),
    [],
  );
  const onTime = useCallback(
    (time: string) => dispatch({ type: "setTime", time }),
    [],
  );
  const onNotes = useCallback(
    (field: "cleaner" | "office", value: string) =>
      dispatch({ type: "setNotes", field, value }),
    [],
  );

  const waHref = useMemo(
    () => whatsappLink(buildBookingMessage(state)),
    [state],
  );

  const handleWhatsApp = useCallback(() => {
    saveDraft(state);
  }, [state]);

  const handleSendRequest = useCallback(async () => {
    if (!ready || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (!res.ok) throw new Error("Request failed");
      setToast("Request sent. We'll reply shortly.");
    } catch {
      setToast("Couldn't send — please try WhatsApp.");
    } finally {
      setSending(false);
      setTimeout(() => setToast(null), 4000);
    }
  }, [ready, sending, state]);

  const progressSteps = [
    { id: 1, label: "Home details", complete: step1Done },
    { id: 2, label: "Extras & frequency", complete: step2Done },
    { id: 3, label: "Contact & slot", complete: step3Done },
  ];

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-6 md:pt-20">
        <p className="text-xs uppercase tracking-[0.22em] text-brand-graphite">
          Book a clean
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight md:text-6xl">
          A clean home, three minutes from here.
        </h1>
        <p className="mt-4 max-w-xl text-base text-brand-graphite md:text-lg">
          Tell us about your place, pick a time, finish on WhatsApp. No
          sign-up. No card. Pay after the clean.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pb-40 lg:grid-cols-[220px_1fr_380px] lg:gap-12 lg:pb-16">
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <ProgressSteps
              steps={progressSteps}
              active={activeStep}
              onJump={scrollToStep}
            />
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-sm text-brand-graphite transition-colors hover:text-brand-ink"
            >
              <MessageCircle className="h-4 w-4" />
              Rather just chat?
            </a>
          </div>
        </div>

        <div className="space-y-16 md:space-y-20">
          <motion.section
            id="step-1"
            ref={step1Ref}
            {...sectionMotion}
            className="scroll-mt-24"
          >
            <StepHeader number={1} title="Home details" />
            <StepHome
              state={state}
              onService={onService}
              onHome={onHome}
            />
          </motion.section>

          <motion.section
            id="step-2"
            ref={step2Ref}
            {...sectionMotion}
            className="scroll-mt-24"
          >
            <StepHeader number={2} title="Extras & frequency" />
            <StepExtrasFrequency
              state={state}
              onExtra={onExtra}
              onFrequency={onFrequency}
            />
          </motion.section>

          <motion.section
            id="step-3"
            ref={step3Ref}
            {...sectionMotion}
            className="scroll-mt-24"
          >
            <StepHeader number={3} title="Contact & preferred slot" />
            <StepContactSlot
              state={state}
              onContact={onContact}
              onDate={onDate}
              onTime={onTime}
              onNotes={onNotes}
            />
          </motion.section>

          <div className="pt-4 text-center">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-brand-graphite transition-colors hover:text-brand-ink"
            >
              <MessageCircle className="h-4 w-4" />
              Rather just chat? WhatsApp us →
            </a>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24">
            <SummaryCard
              price={price}
              state={state}
              ready={ready}
              waHref={waHref}
              onWhatsApp={handleWhatsApp}
              onSendRequest={handleSendRequest}
              sending={sending}
            />
          </div>
        </div>
      </div>

      <MobileSummaryBar
        price={price}
        state={state}
        ready={ready}
        waHref={waHref}
        onWhatsApp={handleWhatsApp}
        onSendRequest={handleSendRequest}
        sending={sending}
      />

      {toast && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          className="pointer-events-none fixed inset-x-0 bottom-24 z-40 mx-auto w-max max-w-[calc(100vw-2rem)] rounded-full bg-brand-ink px-5 py-3 text-sm text-brand-cream shadow-lg lg:bottom-6"
        >
          {toast}
        </motion.div>
      )}
    </div>
  );
}

function StepHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="mb-6 flex items-baseline gap-3">
      <span className="font-display text-sm tabular-nums text-brand-terracotta">
        {String(number).padStart(2, "0")}
      </span>
      <h2 className="font-display text-3xl tracking-tight text-brand-ink md:text-4xl">
        {title}
      </h2>
    </div>
  );
}

function MobileSummaryBar({
  price,
  state,
  ready,
  waHref,
  onWhatsApp,
  onSendRequest,
  sending,
}: {
  price: ReturnType<typeof calcTotal>;
  state: BookingState;
  ready: boolean;
  waHref: string;
  onWhatsApp: () => void;
  onSendRequest: () => void;
  sending: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-hairline bg-white/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex flex-col items-start"
          >
            <span className="text-xs text-brand-graphite">Estimated total</span>
            <motion.span
              key={price.subtotal}
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.25 }}
              className="font-display text-xl tabular-nums text-brand-ink"
            >
              {price.service
                ? `€${Math.round(price.subtotal)}`
                : "—"}
            </motion.span>
          </button>
          {ready ? (
            <a
              href={waHref}
              onClick={onWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand-terracotta px-5 text-sm font-medium text-white shadow-[0_6px_20px_-10px_rgba(232,92,58,0.6)]"
            >
              Continue on WhatsApp
            </a>
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
          className="fixed inset-0 z-40 bg-brand-ink/40 lg:hidden"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-brand-cream p-4 pb-6"
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-brand-hairline" />
            <SummaryCard
              compact
              price={price}
              state={state}
              ready={ready}
              waHref={waHref}
              onWhatsApp={() => {
                onWhatsApp();
                setOpen(false);
              }}
              onSendRequest={() => {
                onSendRequest();
                setOpen(false);
              }}
              sending={sending}
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
