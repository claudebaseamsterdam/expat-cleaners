"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  {
    n: "01",
    title: "Book in 60 seconds",
    body: "Pick your service, choose a date, pay online. Or message us on WhatsApp and we'll sort it on the spot.",
  },
  {
    n: "02",
    title: "We show up on time",
    body: "Your cleaner arrives ready to go. No briefing, no stress. Let them in and get on with your day.",
  },
  {
    n: "03",
    title: "Walk into a spotless home",
    body: "Come back to a clean apartment every single time. Most customers subscribe after their first clean.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-brand-cream py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-4">
        <Header />

        <div className="relative mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-10 hidden h-px bg-brand-sage/25 md:block"
          />
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              className="relative"
            >
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-brand-cream font-display text-[40px] leading-none tracking-tight text-brand-sage ring-1 ring-brand-hairline md:h-20 md:w-20">
                {s.n}
              </div>
              <h3 className="font-display text-2xl tracking-tight text-brand-ink md:text-[28px]">
                {s.title}
              </h3>
              <p className="mt-3 max-w-sm text-base leading-relaxed text-brand-graphite">
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="inline-flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-sage" />
        <span className="text-xs uppercase tracking-[0.22em] text-brand-graphite">
          How it works
        </span>
      </div>
      <h2
        className="mt-5 max-w-3xl font-display text-[clamp(36px,6vw,64px)] leading-[1.02] tracking-tight text-brand-ink"
        dangerouslySetInnerHTML={{
          __html: "Up and running in <em>3 steps.</em>",
        }}
      />
    </motion.div>
  );
}
