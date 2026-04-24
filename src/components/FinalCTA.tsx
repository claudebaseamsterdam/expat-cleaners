"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const EASE = [0.16, 1, 0.3, 1] as const;

export function FinalCTA() {
  return (
    <section className="flex min-h-[80vh] items-center bg-cream px-6 py-20 md:py-32">
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
