"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.33, 1, 0.68, 1] as const;

const ROWS = [
  { label: "One-off", price: "€44 / hour" },
  { label: "Bi-weekly", price: "€40 / hour" },
  { label: "Weekly", price: "€36 / hour" },
] as const;

export function Pricing() {
  return (
    <section id="pricing" className="bg-brand-bg-alt py-24 md:py-40">
      <div className="mx-auto max-w-[1040px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-[640px]"
        >
          <p className="text-[12px] uppercase tracking-[0.1em] text-brand-terracotta">
            Pricing
          </p>
          <h2
            className="mt-6 font-display text-[clamp(2.25rem,4vw,3.75rem)] leading-[1.05] tracking-[-0.03em] text-brand-ink"
            style={{ fontWeight: 420 }}
          >
            Simple pricing.
          </h2>
          <p className="mt-6 text-[17px] leading-[1.55] text-brand-ink-soft">
            Most clients start with a one-off, then move to weekly. Same
            cleaner each time. Cancel anytime.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="mt-16 divide-y divide-brand-line border-y border-brand-line md:mt-20"
        >
          {ROWS.map((r) => (
            <div
              key={r.label}
              className="grid grid-cols-[1fr_auto_auto] items-baseline gap-6 py-6 sm:gap-12 sm:py-8 md:gap-16 md:py-10"
            >
              <div
                className="text-[1.125rem] tracking-[-0.015em] text-brand-ink md:text-[1.25rem]"
                style={{ fontWeight: 420 }}
              >
                {r.label}
              </div>
              <div
                className="text-right text-[1.125rem] tabular-nums text-brand-ink md:text-[1.25rem]"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {r.price}
              </div>
              <Link
                href="/book"
                className="editorial-link justify-self-end text-[17px] text-brand-ink"
              >
                Book <span className="text-brand-terracotta">→</span>
              </Link>
            </div>
          ))}
        </motion.div>

        <p className="mt-8 max-w-[520px] text-[14px] text-brand-ink-soft">
          Two-hour minimum. Organic supplies included in every recurring
          plan.
        </p>
      </div>
    </section>
  );
}
