"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-brand-cream py-32 md:py-48">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-terracotta/15 blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-xs uppercase tracking-[0.24em] text-brand-sage"
        >
          · Limited weekly availability ·
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
          className="mt-6 font-display text-[clamp(44px,10vw,120px)] leading-[0.95] tracking-[-0.02em] text-brand-ink"
          dangerouslySetInnerHTML={{
            __html: "Slots are filling up <em>fast.</em>",
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-brand-graphite"
        >
          We only take on a limited number of new clients each week.
          Don&apos;t come back tomorrow and find your slot is gone.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/book"
            className="group inline-flex h-14 items-center gap-2 rounded-full bg-brand-terracotta px-7 text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-14px_rgba(232,92,58,0.6)]"
          >
            Book my clean now
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center gap-2 rounded-full border border-brand-hairline bg-white px-7 text-base font-medium text-brand-ink transition-colors hover:border-brand-ink/30"
          >
            <MessageCircle className="h-4 w-4 text-brand-sage" />
            Chat on WhatsApp
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
          className="mt-6 text-sm text-brand-sage"
        >
          No commitment needed. Cancel anytime. Takes 60 seconds.
        </motion.p>
      </div>
    </section>
  );
}
