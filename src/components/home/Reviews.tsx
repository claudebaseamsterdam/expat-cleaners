"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const REVIEWS = [
  {
    initial: "S",
    name: "Sarah M.",
    hood: "Oud-West",
    quote:
      "Finally found a cleaner I can actually trust. Booked on WhatsApp in 5 minutes. They showed up on time, did an incredible job. Subscribed immediately.",
  },
  {
    initial: "A",
    name: "Ananya R.",
    hood: "Jordaan",
    quote:
      "Three months in Amsterdam and already sorted. English-speaking, reliable, zero hassle. I don't know why I waited so long.",
  },
  {
    initial: "M",
    name: "Marcus D.",
    hood: "Watergraafsmeer",
    quote:
      "Sorted my monthly clean in 90 seconds on the tram. If you're an expat in Amsterdam and you don't have ExpatCleaners yet, what are you doing?",
  },
];

export function Reviews() {
  return (
    <section id="reviews" className="bg-brand-cream py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-sage" />
            <span className="text-xs uppercase tracking-[0.22em] text-brand-graphite">
              Reviews
            </span>
          </div>
          <h2
            className="mt-5 font-display text-[clamp(36px,6vw,64px)] leading-[1.02] tracking-tight text-brand-ink"
            dangerouslySetInnerHTML={{
              __html:
                "Expats across Amsterdam <em>already switched.</em>",
            }}
          />
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {REVIEWS.map((r, i) => (
            <motion.figure
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              className="flex h-full flex-col rounded-[22px] border border-brand-hairline bg-brand-linen p-8"
            >
              <div className="flex items-center gap-1 text-brand-sage">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="h-3.5 w-3.5"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                ))}
              </div>
              <blockquote className="mt-5 font-display text-[20px] italic leading-snug text-brand-ink">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-6">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-sage font-display text-sm font-medium text-white">
                  {r.initial}
                </div>
                <div>
                  <div className="text-sm font-medium text-brand-ink">
                    {r.name}
                  </div>
                  <div className="text-xs text-brand-graphite">{r.hood}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
