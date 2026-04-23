"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.33, 1, 0.68, 1] as const;

// TODO: replace with licensed Stocksy/Unsplash+ asset — brief calls for a
// calm Amsterdam interior, late morning light, empty of people, one plant,
// parquet floor visible, minimal styling, warm but not staged.
const HERO_IMG =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=2200&q=85&auto=format&fit=crop";

export function Hero() {
  return (
    <section className="relative isolate h-[75vh] min-h-[560px] w-full overflow-hidden md:h-[90vh]">
      <Image
        src={HERO_IMG}
        alt=""
        fill
        priority
        quality={85}
        sizes="100vw"
        className="object-cover"
        placeholder="empty"
      />
      {/* Bottom gradient so copy in ink / ink-soft reads over the image. */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/70 to-transparent" />

      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto w-full max-w-[1280px] px-6 pb-16 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="max-w-[640px]"
          >
            <p className="text-[12px] uppercase tracking-[0.1em] text-brand-ink-soft">
              Amsterdam · Since 2026
            </p>
            <h1
              className="mt-6 font-display text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.035em] text-brand-ink"
              style={{ fontWeight: 420 }}
            >
              A quieter kind of clean.
            </h1>
            <p className="mt-6 max-w-[480px] text-[18px] leading-[1.55] text-brand-ink-soft">
              Organic products. English-speaking cleaners. Booked over
              WhatsApp, the way it should be.
            </p>
            <Link
              href="/book"
              className="editorial-link mt-10 inline-block text-[17px] text-brand-ink"
            >
              Book a clean →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
