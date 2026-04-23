"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WHATSAPP_URL } from "@/lib/constants";

const EASE = [0.33, 1, 0.68, 1] as const;

export function FinalCTA() {
  return (
    <section className="bg-brand-bg-alt py-28 md:py-44">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mx-auto max-w-[720px] px-6 text-center"
      >
        <h2
          className="font-display text-[clamp(2.25rem,4vw,3.75rem)] leading-[1.05] tracking-[-0.03em] text-brand-ink"
          style={{ fontWeight: 420 }}
        >
          Book your first clean.
        </h2>
        <p className="mt-6 text-[17px] leading-[1.55] text-brand-ink-soft">
          Two minutes on WhatsApp, or the booking form if you prefer.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-[17px]">
          {/* Primary: ink with always-visible underline — strongest
              conversion path carries visual weight via state, not size. */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-ink underline decoration-1 underline-offset-4"
          >
            WhatsApp us
          </a>
          <span aria-hidden className="text-brand-ink-soft">
            —
          </span>
          {/* Secondary: ink-soft, no underline until hover; colour
              transitions to ink alongside the underline reveal. */}
          <Link
            href="/book"
            className="editorial-link-muted text-brand-ink-soft hover:text-brand-ink"
          >
            Book online
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
