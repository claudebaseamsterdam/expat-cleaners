"use client";

import { motion } from "framer-motion";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const MIN_HOURS = 2;

type Plan = {
  id: string;
  name: string;
  price: number;
  body: string;
  prefill: string;
  cta: string;
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "oneoff",
    name: "One-off",
    price: 44,
    body: "Book when you need it. No commitment.",
    prefill: "Hi! I'd like to book a one-off clean.",
    cta: "Book a one-off",
  },
  {
    id: "biweekly",
    name: "Bi-weekly",
    price: 40,
    body: "Every two weeks. Same cleaner.",
    prefill: "Hi! I'd like to set up a bi-weekly clean.",
    cta: "Start bi-weekly",
  },
  {
    id: "weekly",
    name: "Weekly",
    price: 36,
    body: "Best value. Same cleaner. Organic supplies included.",
    prefill: "Hi! I'd like to set up a weekly clean.",
    cta: "Start weekly",
    featured: true,
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
          {PLANS.map((plan, i) => {
            const minPrice = plan.price * MIN_HOURS;
            return (
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
                    chosen" text. No border / no badge — pure
                    typographic mark per the brief. */}
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
                  From €{minPrice} per clean · {MIN_HOURS}-hour minimum
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
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-14 text-center text-[14px] text-stone md:mt-20"
        >
          Cancel any recurring plan anytime.
        </motion.p>
      </div>
    </section>
  );
}
