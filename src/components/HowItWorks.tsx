"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  {
    n: "01",
    title: "Message us",
    body: "Tell us your address and when. Two minutes on WhatsApp.",
  },
  {
    n: "02",
    title: "We arrive",
    body: "Same English-speaking cleaner each time. Organic products included.",
  },
  {
    n: "03",
    title: "Walk into a clean apartment",
    body: "Most clients switch to weekly after the first clean.",
  },
] as const;

const BANNER =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=2400&q=85&auto=format&fit=crop";

export function HowItWorks() {
  return (
    <section className="bg-cream py-20 md:py-32">
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto max-w-[600px] text-center"
        >
          <p className="caption">How it works</p>
          <h2
            className="mt-4 font-display text-[32px] leading-[1.08] tracking-[-0.02em] md:text-[48px]"
            style={{ fontWeight: 400 }}
          >
            Three steps. No phone calls.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
          className="relative mt-14 aspect-[16/9] w-full overflow-hidden md:mt-20"
        >
          <Image
            src={BANNER}
            alt="Sunlit living-room interior, morning light through large windows"
            fill
            quality={85}
            sizes="(min-width: 1024px) 1280px, 100vw"
            className="editorial-img object-cover"
          />
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-3 md:gap-10">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              className="flex flex-col"
            >
              <div
                className="font-display text-[64px] leading-none tracking-[-0.02em] text-botanical"
                style={{ fontWeight: 400 }}
              >
                {step.n}
              </div>
              <h3
                className="mt-6 font-display text-[22px] leading-[1.2] tracking-[-0.01em] text-ink"
                style={{ fontWeight: 500 }}
              >
                {step.title}
              </h3>
              <p className="mt-3 max-w-[280px] text-[16px] leading-[1.6] text-stone">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
