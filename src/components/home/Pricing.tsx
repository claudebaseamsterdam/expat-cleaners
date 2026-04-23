"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type Tier = {
  id: string;
  name: string;
  price: number;
  tagline: string;
  features: string[];
  ctaLabel: string;
  pill?: { label: string; tone: "amber" | "terracotta" };
  featured?: boolean;
  ctaTone: "filled" | "outline";
};

const TIERS: Tier[] = [
  {
    id: "oneoff",
    name: "One-off",
    price: 44,
    tagline: "Book when you need it. No strings attached.",
    features: [
      "Full clean included",
      "Bring your own supplies or add ours at checkout",
      "Flexible scheduling",
      "iDeal or card",
    ],
    ctaLabel: "Book now",
    ctaTone: "outline",
  },
  {
    id: "biweekly",
    name: "Bi-weekly",
    price: 40,
    tagline: "Every two weeks. Lock in your slot today.",
    features: [
      "Same cleaner every time",
      "Priority scheduling",
      "Bring your own supplies or add ours at checkout",
      "Cancel anytime",
    ],
    pill: { label: "Selling out fast", tone: "amber" },
    ctaLabel: "Claim your spot",
    ctaTone: "outline",
  },
  {
    id: "weekly",
    name: "Weekly",
    price: 36,
    tagline: "Best value. Locked in rate for life.",
    features: [
      "Same cleaner every time",
      "First priority scheduling",
      "Bring your own supplies or add ours at checkout",
      "Cancel anytime",
    ],
    pill: { label: "Best value", tone: "terracotta" },
    featured: true,
    ctaLabel: "Claim your spot",
    ctaTone: "filled",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-brand-linen py-24 md:py-36">
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
              Pricing
            </span>
          </div>
          <h2
            className="mt-5 font-display text-[clamp(36px,6vw,64px)] leading-[1.02] tracking-tight text-brand-ink"
            dangerouslySetInnerHTML={{
              __html: "Lock in your rate <em>before prices go up.</em>",
            }}
          />
          <p className="mt-5 max-w-xl text-base text-brand-graphite">
            Early subscribers keep their rate permanently. Book now and pay
            €36/hr forever, even as we grow.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {TIERS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              className={cn(
                "relative flex flex-col rounded-[24px] border bg-white p-7 md:p-8",
                t.featured
                  ? "border-brand-terracotta shadow-[0_30px_60px_-30px_rgba(232,92,58,0.35)] md:scale-[1.03]"
                  : "border-brand-hairline",
              )}
            >
              {t.pill && (
                <span
                  className={cn(
                    "absolute -top-3 left-7 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider",
                    t.pill.tone === "amber"
                      ? "bg-brand-amber text-brand-ink"
                      : "bg-brand-terracotta text-white",
                  )}
                >
                  {t.pill.label}
                </span>
              )}

              <div className="text-xs uppercase tracking-[0.18em] text-brand-graphite">
                {t.name}
              </div>

              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-[clamp(52px,7vw,76px)] leading-none tracking-tight text-brand-ink">
                  €{t.price}
                </span>
                <span className="font-display text-lg text-brand-sage">
                  /hr
                </span>
              </div>

              <p className="mt-3 text-sm text-brand-graphite">{t.tagline}</p>

              <ul className="mt-6 space-y-3 text-sm text-brand-ink/90">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-sage" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/book"
                className={cn(
                  "group mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full text-base font-medium transition-all",
                  t.ctaTone === "filled"
                    ? "bg-brand-terracotta text-white hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-14px_rgba(232,92,58,0.6)]"
                    : "border border-brand-hairline bg-white text-brand-ink hover:border-brand-ink/30",
                )}
              >
                {t.ctaLabel}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
