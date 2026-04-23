"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Home, MessageCircle } from "lucide-react";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { whatsappLink } from "@/lib/whatsapp";
import {
  buildConfirmedMessage,
  calcTotal,
  formatEuro,
  formatHours,
  loadConfirmed,
  type ConfirmedBooking,
} from "@/lib/booking";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ConfirmedPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmedInner />
    </Suspense>
  );
}

function ConfirmedInner() {
  const params = useSearchParams();
  const refParam = params.get("ref");
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);

  useEffect(() => {
    setConfirmed(loadConfirmed());
  }, []);

  const ref = refParam || confirmed?.ref || "EC-PENDING";
  const price = confirmed ? calcTotal(confirmed.state) : null;
  const waMessage = buildConfirmedMessage(ref);

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="mx-auto max-w-3xl px-4 pt-16 pb-28 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-xs uppercase tracking-[0.24em] text-brand-sage"
        >
          Booking confirmed
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
          className="mt-4 font-display text-[clamp(48px,10vw,96px)] leading-[0.95] tracking-tight text-brand-ink"
        >
          You&apos;re booked.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-hairline bg-white px-4 py-2 text-sm"
        >
          <span className="text-brand-graphite">Booking ref</span>
          <span className="font-display tabular-nums text-brand-ink">
            {ref}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
          className="mt-8 flex items-center gap-3 rounded-2xl border border-brand-hairline bg-white px-5 py-4"
        >
          <span className="relative grid h-3 w-3 place-items-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-brand-terracotta opacity-60" />
            <span className="relative h-2 w-2 rounded-full bg-brand-terracotta" />
          </span>
          <p className="text-sm text-brand-ink">
            We&apos;ll confirm on WhatsApp within 15 minutes.
          </p>
        </motion.div>

        {confirmed && price?.service && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            className="mt-10 rounded-2xl border border-brand-hairline bg-white p-6"
          >
            <h3 className="font-display text-lg tracking-tight text-brand-ink">
              Recap
            </h3>
            <dl className="mt-4 space-y-2.5 text-sm">
              <Line label="Service" value={price.service.label} />
              <Line
                label="Estimate"
                value={`${formatHours(price.hours)} · ${formatEuro(price.subtotal)}`}
              />
              <Line
                label="Frequency"
                value={price.frequency.label}
              />
              {confirmed.state.preferredDate && (
                <Line
                  label="Preferred"
                  value={`${confirmed.state.preferredDate}${confirmed.state.preferredTime ? ` · ${confirmed.state.preferredTime}` : ""}`}
                />
              )}
              {confirmed.state.details.address && (
                <Line
                  label="Address"
                  value={`${confirmed.state.details.address}${confirmed.state.details.postalCode ? `, ${confirmed.state.details.postalCode}` : ""}`}
                />
              )}
              {confirmed.state.waitingListJoined && (
                <Line label="Waiting list" value="Yes — we'll text when a slot opens" />
              )}
            </dl>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href={whatsappLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-14 items-center gap-2 rounded-full bg-brand-terracotta px-7 text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-14px_rgba(232,92,58,0.6)]"
          >
            <MessageCircle className="h-4 w-4" />
            Open WhatsApp now
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
      <WhatsAppFloat />
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
