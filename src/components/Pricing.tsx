"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cn } from "@/lib/utils";
import {
  ADD_ON_MIN_PRICE,
  DEEP_CLEAN_FROM_PRICE,
  DEEP_CLEAN_PACKAGES,
  MOVE_FROM_PRICE,
  MOVE_PACKAGES,
  ONE_OFF_RATE,
  RECURRING_RATES,
  formatEur,
} from "@/lib/pricing";

const EASE = [0.16, 1, 0.3, 1] as const;

type Plan = {
  id: string;
  name: string;
  price: number;
  sub: string;
  body: string;
  prefill: string;
  cta: string;
  featured?: boolean;
};

// Three hourly plans. Order is fixed (one-off → bi-weekly → weekly) to
// match the brief's left-to-right "commitment ladder"; the weekly card
// carries the MOST CHOSEN caption via `featured`.
const PLANS: Plan[] = [
  {
    id: "oneoff",
    name: ONE_OFF_RATE.label,
    price: ONE_OFF_RATE.hourly,
    sub: `${ONE_OFF_RATE.minimumHours}-hour minimum`,
    body: "Book when you need it. No commitment.",
    prefill: "Hi! I'd like to book a one-off clean.",
    cta: "Book a one-off",
  },
  {
    id: "biweekly",
    name: RECURRING_RATES.biweekly.label,
    price: RECURRING_RATES.biweekly.hourly,
    sub: "Same cleaner every visit",
    body: "Every two weeks. Same cleaner.",
    prefill: "Hi! I'd like to set up a bi-weekly clean.",
    cta: "Start bi-weekly",
  },
  {
    id: "weekly",
    name: RECURRING_RATES.weekly.label,
    price: RECURRING_RATES.weekly.hourly,
    sub: "Best value · same cleaner",
    body: "Best value. Same cleaner. Organic supplies included.",
    prefill: "Hi! I'd like to set up a weekly clean.",
    cta: "Start weekly",
    featured: true,
  },
];

// Fourth-row blocks under the hourly cards. These are the secondary
// CTAs into the booking flow's deep-linked ?service= states (Phase 7.3
// will wire the query-param pre-selection on /book; the links work
// regardless and just open the bundle picker until then).
type SecondaryBlock = {
  id: string;
  heading: string;
  price: string;
  sub: string;
  cta: string;
  href: string;
};

// Build the deep-clean sub-line from the package data so the homepage
// stays in sync if a tier price changes.
const DEEP_TIER_LABELS = DEEP_CLEAN_PACKAGES.filter(
  (p): p is typeof p & { price: number } => typeof p.price === "number",
)
  .slice(0, 3)
  .map((p) => `${p.label} ${formatEur(p.price)}`)
  .join(" · ");

const MOVE_TIER_LABELS = MOVE_PACKAGES.filter(
  (p): p is typeof p & { price: number } => typeof p.price === "number",
)
  .slice(0, 3)
  .map((p) => `${p.label} ${formatEur(p.price)}`)
  .join(" · ");

const SECONDARY_BLOCKS: SecondaryBlock[] = [
  {
    id: "deep",
    heading: "Deep cleaning",
    price: `From ${formatEur(DEEP_CLEAN_FROM_PRICE)} · fixed price`,
    sub: DEEP_TIER_LABELS,
    cta: "Book a deep clean →",
    href: "/book?service=deep",
  },
  {
    id: "move",
    heading: "Move-in / move-out",
    price: `From ${formatEur(MOVE_FROM_PRICE)} · fixed price`,
    sub: `Deposit-back guarantee. ${MOVE_TIER_LABELS}`,
    cta: "Book a move clean →",
    href: "/book?service=moveout",
  },
  {
    id: "addons",
    heading: "Optional add-ons",
    price: `From ${formatEur(ADD_ON_MIN_PRICE)}`,
    sub: "Inside oven, fridge, windows, ironing, balcony — see all in booking flow",
    cta: "See add-ons →",
    href: "/book",
  },
];

// Asymmetric section padding: full top (matches every other section)
// but tightened bottom so this section reads as one composition with
// the FinalCTA that follows. Pricing.pb (md:80) + FinalCTA.pt (md:16)
// ≈ 96px combined gap on desktop — within the brief's 80–120px target.
export function Pricing() {
  return (
    <section
      id="pricing"
      className="bg-cream pt-20 pb-12 md:pt-32 md:pb-20"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-[640px]"
        >
          <p className="caption">Pricing</p>
          <h2
            className="mt-4 font-display text-[32px] leading-[1.08] tracking-[-0.02em] md:text-[48px]"
            style={{ fontWeight: 400 }}
          >
            Simple pricing. No surprises.
          </h2>
          <p className="mt-5 max-w-[480px] text-[15px] leading-[1.55] text-stone">
            Organic bio cleaning products included in every clean — no extra
            charge.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-3 md:gap-10">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
              className="flex flex-col"
            >
              {/* Reserve the same vertical slot on every card so the
                  title row aligns across all three. The non-featured
                  cards render an invisible placeholder of identical
                  height; only the Weekly card has visible "Most
                  chosen" text. */}
              <p
                className={cn("caption mb-4", !plan.featured && "invisible")}
                aria-hidden={!plan.featured}
              >
                Most chosen
              </p>
              <h3
                className="font-display text-[22px] leading-[1.2] tracking-[-0.01em] text-ink"
                style={{ fontWeight: 500 }}
              >
                {plan.name}
              </h3>
              <div className="mt-5 flex items-baseline gap-2">
                <span
                  className="font-display text-[48px] leading-none tracking-[-0.02em] tabular-nums text-ink"
                  style={{ fontWeight: 400 }}
                >
                  €{plan.price}
                </span>
                <span className="text-[18px] text-stone">/hr</span>
              </div>
              <p className="mt-3 text-[14px] tabular-nums text-stone">
                {plan.sub}
              </p>
              <p className="mt-5 max-w-[300px] text-[16px] leading-[1.55] text-stone">
                {plan.body}
              </p>
              <div className="mt-7">
                <WhatsAppButton variant="small" message={plan.prefill}>
                  {plan.cta}
                </WhatsAppButton>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Phase 3.3 — fourth row: Deep / Move / Add-ons. Three blocks
            full-width with deep-links into /book?service=…. Lower
            visual weight than the hourly cards (no Most-chosen slot,
            smaller heading) so the eye still lands on Weekly first. */}
        <div className="mt-16 grid grid-cols-1 gap-8 border-t border-stone/20 pt-14 md:mt-24 md:grid-cols-3 md:gap-10 md:pt-20">
          {SECONDARY_BLOCKS.map((block, i) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
              className="flex flex-col"
            >
              <h3
                className="font-display text-[20px] leading-[1.2] tracking-[-0.01em] text-ink"
                style={{ fontWeight: 500 }}
              >
                {block.heading}
              </h3>
              <p className="mt-3 text-[18px] tabular-nums text-ink">
                {block.price}
              </p>
              <p className="mt-3 max-w-[320px] text-[14px] leading-[1.55] text-stone">
                {block.sub}
              </p>
              <div className="mt-5">
                <Link
                  href={block.href}
                  className="link-underline text-[15px] font-medium text-ink"
                >
                  {block.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-14 text-center text-[14px] leading-[1.6] text-stone md:mt-20"
        >
          Prices include 9% BTW for cleaning inside your home. Outdoor work
          (balcony, exterior windows) and post-construction work include 21%
          BTW. Cancel any recurring plan with 14 days&apos; notice.{" "}
          <Link href="/terms" className="link-underline text-ink">
            See full terms ↗
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
