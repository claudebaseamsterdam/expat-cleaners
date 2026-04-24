"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { WhatsAppButton } from "@/components/WhatsAppButton";

// Calmer, warmer living-room interior — the previous hero shot was too
// busy and undermined H1 legibility.
const HERO_IMG =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=2400&q=85&auto=format&fit=crop";

const REVEAL = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

export function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink">
      {/* Ken Burns background — slow scale 1 → 1.05 over 20s, mirrored. */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{
          duration: 20,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }}
      >
        <Image
          src={HERO_IMG}
          alt="Warm Amsterdam apartment interior in golden-hour morning light"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="editorial-img object-cover"
        />
      </motion.div>

      {/* Scrim 1 — full-hero base darkness so copy reads against any
          photo we swap in. bg-black/35 gives a uniform 35 % ink wash. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black/35"
      />
      {/* Scrim 2 — extra darkness where the copy sits. Covers the
          bottom two-thirds of the hero, 60 % black at the bottom fading
          to transparent at the top edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/30 to-transparent"
      />

      <div className="relative z-10 flex h-full flex-col justify-end">
        <div className="mx-auto w-full max-w-[1280px] px-6 pb-14 md:px-8 md:pb-20">
          <div className="max-w-[640px]">
            {/* Eyebrow — cream/90 over the scrim. Botanical is reserved
                for eyebrows that sit on the cream page background
                (HowItWorks, WhyUs, Services, Pricing, Reviews). */}
            <motion.p
              {...REVEAL}
              transition={{ ...REVEAL.transition, delay: 0 }}
              className="text-[12px] uppercase tracking-[0.15em] text-cream/90"
              style={{ fontWeight: 500 }}
            >
              Amsterdam · English-first · Organic
            </motion.p>
            {/* H1 — text-shadow is belt-and-suspenders: invisible as a
                shadow, but lifts contrast at character edges. */}
            <motion.h1
              {...REVEAL}
              transition={{ ...REVEAL.transition, delay: 0.08 }}
              className="mt-5 font-display text-[40px] leading-[1.05] tracking-[-0.02em] text-cream md:text-[64px]"
              style={{
                fontWeight: 500,
                textShadow: "0 2px 20px rgba(0,0,0,0.3)",
              }}
            >
              Your Amsterdam apartment, cleaned properly.
            </motion.h1>
            <motion.p
              {...REVEAL}
              transition={{ ...REVEAL.transition, delay: 0.16 }}
              className="mt-5 max-w-[520px] text-[17px] leading-[1.5] text-cream/90 md:text-[18px]"
            >
              English-speaking cleaners. Organic products. Booked on
              WhatsApp in 60 seconds. From €36/hr.
            </motion.p>

            <motion.div
              {...REVEAL}
              transition={{ ...REVEAL.transition, delay: 0.24 }}
              className="mt-8 flex flex-wrap items-center gap-5"
            >
              <WhatsAppButton variant="primary">
                Message us on WhatsApp
              </WhatsAppButton>
              <Link
                href="/book"
                className="link-underline text-[15px] font-medium text-cream"
              >
                Or book online →
              </Link>
            </motion.div>

            <motion.p
              {...REVEAL}
              transition={{ ...REVEAL.transition, delay: 0.32 }}
              className="mt-7 text-[13px] text-cream/80"
            >
              ★ 4.9 on Google · 200+ Amsterdam expats · Same cleaner,
              every time
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
