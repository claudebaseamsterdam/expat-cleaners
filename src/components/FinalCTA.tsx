"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const EASE = [0.16, 1, 0.3, 1] as const;

// No min-h-[80vh] / flex-center: the previous layout pushed the
// headline into the vertical middle of an 80vh-tall box, leaving
// ~400px of dead space above it on desktop. Asymmetric padding so
// this CTA reads as the close of the Pricing composition above —
// Pricing.pb (md:80) + FinalCTA.pt (md:16) ≈ 96px desktop gap, which
// lands inside the brief's 80–120px target.
export function FinalCTA() {
  return (
    <section className="bg-cream px-6 pt-4 pb-20 md:pt-4 md:pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mx-auto max-w-[720px] text-center"
      >
        <h2
          className="font-display text-[40px] leading-[1.05] tracking-[-0.02em] text-ink md:text-[64px]"
          style={{ fontWeight: 400 }}
        >
          Two minutes on WhatsApp. Your Sundays back.
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          <WhatsAppButton variant="primary">
            Message us on WhatsApp
          </WhatsAppButton>
          <Link
            href="/book"
            className="link-underline text-[15px] font-medium text-ink"
          >
            Or book online →
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
