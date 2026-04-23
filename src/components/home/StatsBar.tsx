"use client";

import { motion } from "framer-motion";
import { STATS } from "@/lib/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

export function StatsBar() {
  return (
    <section className="border-y border-brand-hairline bg-brand-linen">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-brand-hairline md:grid-cols-4 md:divide-x">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="flex flex-col items-center px-4 py-10 text-center md:py-14"
          >
            <div className="font-display text-[clamp(36px,6vw,60px)] leading-none tracking-tight text-brand-ink">
              {s.value}
            </div>
            <div className="mt-3 text-xs uppercase tracking-[0.18em] text-brand-sage">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
