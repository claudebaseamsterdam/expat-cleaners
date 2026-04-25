"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { GOOGLE_REVIEWS_URL } from "@/lib/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

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
    <section id="reviews" className="bg-cream py-20 md:py-32">
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-[760px]"
        >
          <p className="caption">Reviews</p>
          <h2
            className="mt-4 font-display text-[32px] leading-[1.08] tracking-[-0.02em] md:text-[48px]"
            style={{ fontWeight: 400 }}
          >
            Expats across Amsterdam already switched.
          </h2>
        </motion.div>

        {/* Desktop: 3-column grid. Mobile: native horizontal scroll-snap carousel. */}
        <div
          className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 md:mt-20 md:grid md:snap-none md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0"
          style={{ scrollbarWidth: "none" }}
        >
          {REVIEWS.map((review, i) => (
            <motion.figure
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
              className="flex min-w-[85%] shrink-0 snap-center flex-col border border-stone/25 bg-white p-8 shadow-[0_1px_0_rgba(0,0,0,0.04)] md:min-w-0 md:shrink md:snap-none md:p-10"
            >
              <div className="flex items-center gap-1 text-[#C8A64B]" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    aria-hidden
                    className="h-4 w-4"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                ))}
              </div>
              <blockquote
                className="mt-5 flex-1 font-display text-[20px] leading-[1.4] tracking-[-0.01em] text-ink md:text-[22px]"
                style={{ fontWeight: 400 }}
              >
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-baseline gap-2">
                <span className="text-[14px] font-medium text-ink">
                  {review.name}
                </span>
                <span className="text-[14px] text-stone">{review.hood}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-10 text-center md:mt-16"
        >
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-[15px] text-ink"
          >
            Read more reviews on Google →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
