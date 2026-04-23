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
      "I book a monthly clean from the tram on the way to work. It's the one bit of adult admin I've actually solved since moving here.",
  },
] as const;

export function Reviews() {
  return (
    <section id="reviews" className="bg-brand-bg py-24 md:py-40">
      <div className="mx-auto max-w-[840px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center"
        >
          <p className="text-[12px] uppercase tracking-[0.1em] text-brand-ink-soft">
            From clients
          </p>
          <h2
            className="mt-6 font-display text-[clamp(2.25rem,4vw,3.75rem)] leading-[1.05] tracking-[-0.03em] text-brand-ink"
            style={{ fontWeight: 420 }}
          >
            In their words.
          </h2>
        </motion.div>

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
