"use client";

import { motion } from "framer-motion";

const EASE = [0.33, 1, 0.68, 1] as const;

const REVIEWS = [
  {
    name: "Sarah M.",
    hood: "Oud-West",
    quote:
      "Finally found a cleaner I can actually trust. Booked on WhatsApp in five minutes. They showed up on time and did an incredible job. I subscribed the next day.",
  },
  {
    name: "Ananya R.",
    hood: "Jordaan",
    quote:
      "Three months in Amsterdam and already sorted. English-speaking, reliable, zero hassle. I don't know why I waited so long.",
  },
  {
    name: "Marcus D.",
    hood: "Watergraafsmeer",
    quote:
      "Sorted my monthly clean in under two minutes on the tram. If you're an expat in Amsterdam without ExpatCleaners yet, you're doing the wrong thing on a Sunday.",
  },
] as const;

export function Reviews() {
  return (
    <section id="reviews" className="bg-brand-bg py-24 md:py-40">
      <div className="mx-auto max-w-[840px] px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center text-[12px] uppercase tracking-[0.1em] text-brand-ink-soft"
        >
          Reviews
        </motion.p>

        <div className="mt-16 divide-y divide-brand-line">
          {REVIEWS.map((r, i) => (
            <motion.figure
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
              className="py-12 md:py-16"
            >
              <blockquote
                className="font-display text-[clamp(1.25rem,1.75vw,1.5rem)] leading-[1.5] tracking-[-0.015em] text-brand-ink"
                style={{ fontWeight: 420 }}
              >
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-[14px] text-brand-ink-soft">
                {r.name} — {r.hood}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
