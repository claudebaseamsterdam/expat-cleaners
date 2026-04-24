"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const ITEMS = [
  {
    label: "No Dutch required",
    body: "Every cleaner speaks English fluently. No translation app, no awkward miscommunication, no callbacks you can't follow.",
  },
  {
    label: "Organic, by default",
    body: "Bio-certified, plant-derived products from European makers. Safe for kids, pets, and the surfaces you touch every day.",
  },
  {
    label: "The same cleaner, every time",
    body: "Recurring clients get a dedicated cleaner. They learn your home, your preferences, your schedule.",
  },
  {
    label: "WhatsApp, not forms",
    body: "Booking, rescheduling, special requests — all on the chat you're already using all day.",
  },
] as const;

export function WhyUs() {
  return (
    <section className="bg-cream py-20 md:py-32">
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-[760px]"
        >
          <p className="caption">Why ExpatCleaners</p>
          <h2
            className="mt-4 font-display text-[32px] leading-[1.08] tracking-[-0.02em] md:text-[48px]"
            style={{ fontWeight: 400 }}
          >
            Built for the way you actually live in Amsterdam.
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-2 md:gap-x-20 md:gap-y-16">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.06, ease: EASE }}
              className="max-w-[400px]"
            >
              <p className="caption">{item.label}</p>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
