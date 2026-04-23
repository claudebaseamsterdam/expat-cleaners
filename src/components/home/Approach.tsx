"use client";

import { motion } from "framer-motion";

const EASE = [0.33, 1, 0.68, 1] as const;

const BLOCKS = [
  {
    title: "Organic, by default.",
    body: "Every clean uses bio-certified products. We can tell you what's in them.",
  },
  {
    title: "The same cleaner, every time.",
    body: "Recurring clients get a dedicated cleaner. No revolving door.",
  },
  {
    title: "English, properly.",
    body: "Every cleaner speaks English. Briefs are clear, questions get answered.",
  },
] as const;

export function Approach() {
  return (
    <section
      id="approach"
      className="bg-brand-bg-alt py-24 md:py-40"
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[2fr_3fr] lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <p className="text-[12px] uppercase tracking-[0.1em] text-brand-ink-soft">
              Our approach
            </p>
            <h2
              className="mt-6 font-display text-[clamp(2.25rem,4vw,3.75rem)] leading-[1.05] tracking-[-0.03em] text-brand-ink"
              style={{ fontWeight: 420 }}
            >
              Cleaner homes, cleaner ingredients.
            </h2>
            <p className="mt-8 max-w-md text-[17px] leading-[1.55] text-brand-ink-soft">
              We use organic, plant-derived cleaning products from European
              makers. No synthetic fragrances, no harsh solvents, no residue
              on the surfaces your kids and pets touch. The home you come
              back to is actually clean — and actually safe.
            </p>
          </motion.div>

          <div className="divide-y divide-brand-line border-y border-brand-line">
            {BLOCKS.map((b, i) => (
              <motion.article
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                className="py-10 md:py-12"
              >
                <h3
                  className="font-display text-[clamp(1.25rem,1.8vw,1.5rem)] leading-[1.3] tracking-[-0.015em] text-brand-ink"
                  style={{ fontWeight: 420 }}
                >
                  {b.title}
                </h3>
                <p className="mt-3 max-w-[540px] text-[17px] leading-[1.55] text-brand-ink-soft">
                  {b.body}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
