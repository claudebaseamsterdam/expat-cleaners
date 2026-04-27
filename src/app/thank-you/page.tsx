"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Home, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import {
  calcTotal,
  formatEuro,
  formatHours,
  loadConfirmed,
  type ConfirmedBooking,
} from "@/lib/booking";
import { trackPurchase } from "@/lib/pixel";

const EASE = [0.16, 1, 0.3, 1] as const;

type PaymentState =
  | { kind: "none" }
  | { kind: "checking" }
  | { kind: "paid"; amountEur: number }
  | { kind: "pending" }
  | { kind: "failed"; reason: string };

export default function ThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYouInner />
    </Suspense>
  );
}

function ThankYouInner() {
  const params = useSearchParams();
  const ref = params.get("ref") || "pending";
  const paymentParam = params.get("payment");
  const paymentId = params.get("id");
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);
  const [payment, setPayment] = useState<PaymentState>(
    paymentParam ? { kind: "checking" } : { kind: "none" },
  );
  const purchaseFiredRef = useRef(false);

  useEffect(() => {
    setConfirmed(loadConfirmed());
  }, []);

  // Poll Mollie status on mount when the user landed via Mollie's redirect
  // (?payment=pending&id=tr_xxx). We never trust the URL alone — the server
  // fetches Mollie's canonical payment record. Stop on terminal states.
  useEffect(() => {
    if (!paymentId) {
      // Came from a non-Mollie path (e.g. WhatsApp fallback): no payment
      // to confirm, no Purchase to fire.
      if (paymentParam) setPayment({ kind: "pending" });
      return;
    }
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 12; // ~30s of polling

    const tick = async () => {
      attempts += 1;
      try {
        const res = await fetch(
          `/api/mollie/status?id=${encodeURIComponent(paymentId)}`,
          { cache: "no-store" },
        );
        const data = (await res.json()) as {
          isPaid?: boolean;
          status?: string;
          amountEur?: number;
        };
        if (cancelled) return;
        if (data.isPaid) {
          const amountEur = data.amountEur ?? 0;
          setPayment({ kind: "paid", amountEur });
          if (!purchaseFiredRef.current) {
            purchaseFiredRef.current = true;
            const stateForPixel = loadConfirmed();
            trackPurchase({
              serviceId: stateForPixel?.state.serviceId ?? "unknown",
              frequencyId: stateForPixel?.state.frequencyId ?? "once",
              hours: stateForPixel ? calcTotal(stateForPixel.state).hours : 0,
              value: amountEur,
              ref,
            });
          }
          return;
        }
        if (
          data.status === "failed" ||
          data.status === "canceled" ||
          data.status === "expired"
        ) {
          setPayment({ kind: "failed", reason: data.status });
          return;
        }
        if (attempts >= maxAttempts) {
          setPayment({ kind: "pending" });
          return;
        }
        setTimeout(tick, 2500);
      } catch {
        if (cancelled) return;
        if (attempts >= maxAttempts) {
          setPayment({ kind: "pending" });
          return;
        }
        setTimeout(tick, 2500);
      }
    };

    void tick();
    return () => {
      cancelled = true;
    };
  }, [paymentId, paymentParam, ref]);

  const price = confirmed ? calcTotal(confirmed.state) : null;
  const waMessage = `Hey ExpatCleaners — following up on my booking (ref ${ref}).`;
  const waHref = whatsappLink(waMessage);

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="mx-auto max-w-3xl px-4 pt-16 pb-28 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="text-xs uppercase tracking-[0.24em] text-brand-sage">
            {payment.kind === "paid" ? "Payment received" : "Booking sent"}
          </p>
          <h1 className="mt-4 font-display text-[clamp(48px,10vw,96px)] leading-[0.95] tracking-tight text-brand-ink">
            You&apos;re set.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-brand-graphite">
            {payment.kind === "paid"
              ? "Payment confirmed. A human on our team will message you on WhatsApp within 15 minutes to lock in your slot."
              : payment.kind === "failed"
                ? "We didn't receive your payment. You can try again on WhatsApp — we'll sort it out manually."
                : payment.kind === "checking" || payment.kind === "pending"
                  ? "Payment received? We're confirming it. A human on our team will message you on WhatsApp within 15 minutes."
                  : "A human on our team will confirm your slot on WhatsApp within 15 minutes."}
          </p>
        </motion.div>

        {payment.kind !== "none" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
            className="mt-6 rounded-2xl border border-brand-hairline bg-white p-5"
          >
            {payment.kind === "paid" ? (
              <p className="text-sm text-brand-ink">
                <span className="font-medium text-brand-sage">Paid.</span>{" "}
                {`€${payment.amountEur.toFixed(2)} received via Mollie.`}
              </p>
            ) : payment.kind === "checking" ? (
              <p className="text-sm text-brand-graphite">
                Confirming your payment with Mollie…
              </p>
            ) : payment.kind === "pending" ? (
              <p className="text-sm text-brand-graphite">
                Payment received? We&apos;re confirming it. This sometimes
                takes a minute — you&apos;ll get a WhatsApp message either
                way.
              </p>
            ) : (
              <p className="text-sm text-brand-ink">
                Payment {payment.reason}. Message us on WhatsApp and
                we&apos;ll sort it out.
              </p>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="mt-8 flex items-center gap-3 rounded-2xl border border-brand-hairline bg-white px-5 py-4"
        >
          <span className="relative grid h-3 w-3 place-items-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-brand-terracotta opacity-60" />
            <span className="relative h-2 w-2 rounded-full bg-brand-terracotta" />
          </span>
          <div className="flex-1">
            <p className="text-sm text-brand-ink">
              Booking reference{" "}
              <span className="font-display tabular-nums">{ref}</span>
            </p>
            <p className="text-xs text-brand-graphite">
              Save this if you want to reference the booking later.
            </p>
          </div>
        </motion.div>

        {confirmed && price?.service && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="mt-8 rounded-2xl border border-brand-hairline bg-white p-6"
          >
            <h2 className="font-display text-lg tracking-tight text-brand-ink">
              What you booked
            </h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <Line label="Service" value={price.service.label} />
              <Line
                label="Estimate"
                value={`${formatHours(price.hours)} · ${formatEuro(price.subtotal)}`}
              />
              <Line label="Frequency" value={price.frequency.label} />
              {confirmed.state.preferredDate && (
                <Line
                  label="Preferred"
                  value={`${confirmed.state.preferredDate}${confirmed.state.preferredTime ? ` · ${confirmed.state.preferredTime}` : ""}`}
                />
              )}
              {confirmed.state.details.postalCode && (
                <Line
                  label="Postcode"
                  value={confirmed.state.details.postalCode}
                />
              )}
            </dl>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="mt-10 rounded-2xl border border-brand-hairline bg-white p-6"
        >
          <h2 className="font-display text-lg tracking-tight text-brand-ink">
            What happens next
          </h2>
          <ol className="mt-3 space-y-2 text-sm text-brand-graphite">
            <li>
              <strong className="text-brand-ink">1.</strong> We confirm
              availability on WhatsApp — usually within 15 minutes.
            </li>
            <li>
              <strong className="text-brand-ink">2.</strong> You lock in the
              slot with one message back.
            </li>
            <li>
              <strong className="text-brand-ink">3.</strong> Your cleaner
              arrives at the agreed time.
            </li>
          </ol>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-14 items-center gap-2 rounded-full bg-brand-terracotta px-7 text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-14px_rgba(26,26,26,0.6)]"
          >
            <MessageCircle className="h-4 w-4" />
            Open WhatsApp
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
          </a>
          <Link
            href="/"
            className="inline-flex h-14 items-center gap-2 rounded-full border border-brand-hairline bg-white px-7 text-base font-medium text-brand-ink transition-colors hover:border-brand-ink/30"
          >
            <Home className="h-4 w-4 text-brand-sage" />
            Back to home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <dt className="text-brand-graphite">{label}</dt>
      <dd className="min-w-0 truncate text-right text-brand-ink">{value}</dd>
    </div>
  );
}
