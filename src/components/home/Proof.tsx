"use client";

import { motion } from "framer-motion";

const EASE = [0.33, 1, 0.68, 1] as const;

export function Proof() {
  return (
    <section className="bg-brand-bg py-24 md:py-36">
      <div className="mx-auto max-w-[760px] px-6 text-center">
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p
            className="font-display text-[clamp(1.75rem,2.5vw,2.25rem)] leading-[1.35] tracking-[-0.02em] text-brand-ink"
            style={{ fontWeight: 420 }}
          >
            &ldquo;Three months in Amsterdam and this is the only service
            I&apos;ve set and forgotten. They show up, it&apos;s done, my
            weekend is mine again.&rdquo;
          </p>
          <footer className="mt-8 text-[14px] text-brand-ink-soft">
            Sarah M. — Oud-West ·{" "}
            {/* TODO: swap # for the real Google Business review URL */}
            <a href="#" className="editorial-link text-brand-ink">
              Read on Google{" "}
              <span className="text-brand-terracotta">→</span>
            </a>
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
