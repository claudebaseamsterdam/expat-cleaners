"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Sticky proof bar — fades in as the hero scrolls past, then sticks
 * below the nav (top-[72px]) as the user reads the rest of the page.
 * Transparent at the very top of the page; opacity is driven by
 * window scroll position.
 */
export function ProofBar() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [200, 600], [0, 1]);
  const pointerEvents = useTransform(scrollY, (v) => (v > 400 ? "auto" : "none"));

  return (
    <motion.div
      style={{ opacity, pointerEvents }}
      className="sticky top-[72px] z-40 hidden h-12 w-full items-center justify-center border-b border-stone/20 bg-cream md:flex"
    >
      {/* Replaces the previous "Trusted by 200+ expats · ★ 4.9 on
          Google" line. We lead with the neighborhoods we serve (which
          is honest and converts via specificity) and the operational
          differentiators expats actually search for. */}
      <p className="px-6 text-center text-[13px] text-stone">
        Cleaning Oud-West · Jordaan · De Pijp · Watergraafsmeer &amp;
        across Amsterdam · English-first · Organic
      </p>
    </motion.div>
  );
}
