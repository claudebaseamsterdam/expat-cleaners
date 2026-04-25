"use client";

import { motion } from "framer-motion";
import { ShieldCheck, BadgeCheck, Leaf, Star } from "lucide-react";
import { BRAND, GOOGLE_REVIEWS_URL } from "@/lib/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

type Item = {
  icon: typeof ShieldCheck;
  label: string;
  sub: string;
  href?: string;
};

const ITEMS: Item[] = [
  {
    icon: ShieldCheck,
    label: "Fully insured",
    sub: "Every clean covered",
  },
  {
    icon: BadgeCheck,
    label: `KvK ${BRAND.kvk}`,
    sub: "Registered in NL",
  },
  {
    icon: Leaf,
    label: "Bio-certified",
    sub: "Plant-derived products",
  },
  {
    icon: Star,
    label: "4.9 on Google",
    sub: "200+ Amsterdam reviews",
    href: GOOGLE_REVIEWS_URL,
  },
];

export function TrustBar() {
  return (
    <section
      aria-label="Trust signals"
      className="border-y border-stone/20 bg-cream py-8 md:py-10"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4 md:gap-x-8">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            const inner = (
              <>
                <Icon
                  aria-hidden
                  className="h-5 w-5 shrink-0 text-botanical"
                  strokeWidth={1.5}
                />
                <div className="min-w-0">
                  <p className="text-[14px] font-medium leading-tight text-ink md:text-[15px]">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-tight text-stone md:text-[13px]">
                    {item.sub}
                  </p>
                </div>
              </>
            );
            return (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                className="flex items-start gap-3"
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 rounded-sm transition-colors hover:text-botanical focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-botanical"
                  >
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
