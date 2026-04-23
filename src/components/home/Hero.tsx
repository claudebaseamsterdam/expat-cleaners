"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.33, 1, 0.68, 1] as const;

// TODO: verify this asset and swap to a licensed Stocksy/Unsplash+
// equivalent in production. Brief (round 2): common-area shot — living
// room, kitchen, or dining — with morning light and European cues (tall
// ceilings, visible window, parquet). Not a bedroom, not a hotel-lobby
// interior, no cleaning products/gloves/people visible.
const HERO_IMG =
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=2200&q=85&auto=format&fit=crop";

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
      {/* Bottom gradient — fades the image into bg for copy legibility. */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/70 to-transparent" />
      {/* Left-third gradient — protects copy when the image has a bright
          area behind the headline region. 25% darkening → transparent at 50%. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.25) 0%, transparent 50%)",
        }}
      />

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
