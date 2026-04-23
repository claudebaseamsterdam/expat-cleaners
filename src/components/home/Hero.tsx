"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { UNSPLASH, WHATSAPP_URL } from "@/lib/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

const features = [
  "English-speaking cleaners",
  "From €36/hr",
  "Book in 60 seconds",
  "Cancel anytime",
];

export function Hero() {
  return (
    <section className="noise relative overflow-hidden bg-gradient-to-b from-brand-cream via-brand-linen to-brand-cream">
      <div className="mx-auto grid min-h-[100svh] max-w-6xl grid-cols-1 items-center gap-12 px-4 pb-16 pt-10 md:pb-24 md:pt-14 lg:grid-cols-[7fr_5fr] lg:gap-16">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-sage" />
            <span className="text-xs uppercase tracking-[0.22em] text-brand-graphite">
              Amsterdam · English-first
            </span>
          </motion.div>

          <h1 className="mt-6 font-display text-[clamp(44px,9vw,104px)] leading-[0.95] tracking-[-0.02em] text-brand-ink">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
              className="block"
            >
              Stop wasting
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
              className="block font-light italic text-brand-sage"
            >
              your weekends
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
              className="block"
            >
              cleaning.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-brand-graphite"
          >
            English-speaking cleaners in Amsterdam. Book in 60 seconds via
            WhatsApp.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/book"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-brand-terracotta px-7 text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-14px_rgba(232,92,58,0.6)]"
            >
              Book a clean now
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-brand-hairline bg-white px-7 text-base font-medium text-brand-ink transition-colors hover:border-brand-ink/30"
            >
              <MessageCircle className="h-4 w-4 text-brand-sage" />
              Chat on WhatsApp
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
            className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:flex-wrap"
          >
            {features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-sm text-brand-graphite"
              >
                <Check className="h-4 w-4 text-brand-sage" />
                {f}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          className="relative"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-brand-linen shadow-[0_30px_80px_-30px_rgba(42,42,40,0.35)]">
            <Image
              src={`${UNSPLASH.hero}?w=1200&auto=format&fit=crop&q=80`}
              alt="Bright Amsterdam apartment"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
            className="absolute -bottom-6 left-4 w-[min(320px,90%)] rounded-2xl border border-brand-hairline bg-white p-5 shadow-[0_20px_40px_-20px_rgba(42,42,40,0.25)] sm:left-6"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-sage font-display text-sm font-medium text-white">
                S
              </div>
              <div>
                <div className="text-sm font-medium text-brand-ink">
                  Sarah M.
                </div>
                <div className="text-xs text-brand-graphite">Oud-West</div>
              </div>
            </div>
            <p className="mt-3 font-display text-sm italic leading-snug text-brand-ink">
              &ldquo;Booked on WhatsApp in 5 minutes. Subscribed after the
              first clean.&rdquo;
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
