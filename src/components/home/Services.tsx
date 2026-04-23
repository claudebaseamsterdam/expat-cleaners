"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/constants";

const EASE = [0.33, 1, 0.68, 1] as const;

type Row = {
  id: string;
  name: string;
  body: string;
  priceLine: string;
  image: string;
};

// TODO: verify each asset and swap to licensed Stocksy / Unsplash+ in
// production. Round 2 brief: the three images should read as a sequence
// (wide → medium → tight), not three interchangeable interior photos —
// different rooms, different crops, different intimacy levels.
const ROWS: Row[] = [
  {
    id: "recurring",
    name: "Recurring cleaning",
    body: "Weekly or bi-weekly, same cleaner each time. The home stays even, the bar stays high.",
    priceLine: "From €36/hr on subscription",
    // Wide / warm / lived-in — tidy kitchen or living room moment, domestic.
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1800&q=80&auto=format&fit=crop",
  },
  {
    id: "oneoff",
    name: "One-off cleaning",
    body: "For a single reset — before guests, after a party, when the week got away from you.",
    priceLine: "€44/hr · no commitment",
    // Medium / mid-reset — a hand arranging a counter, morning light.
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1800&q=80&auto=format&fit=crop",
  },
  {
    id: "deep",
    name: "Deep clean",
    body: "Inside appliances, skirting boards, behind the things no one ever reaches. Move-in or move-out ready.",
    priceLine: "€44/hr · min. 3 hours",
    // Tight / texture-led — bathroom tile or surface detail, no wide room.
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1800&q=80&auto=format&fit=crop",
  },
];

const TENANCY_WHATSAPP = `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(
  "Hi — I'd like a quote for an end-of-tenancy clean.",
)}`;

export function Services() {
  return (
    <section id="services" className="bg-brand-bg py-24 md:py-44">
      <div className="mx-auto max-w-[1280px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-16 md:mb-24 max-w-[900px]"
        >
          <p className="text-[12px] uppercase tracking-[0.1em] text-brand-ink-soft">
            Services
          </p>
          <h2
            className="mt-6 font-display text-[clamp(2.25rem,4vw,3.75rem)] leading-[1.05] tracking-[-0.03em] text-brand-ink"
            style={{ fontWeight: 420 }}
          >
            What we do.
          </h2>
        </motion.div>

        <div className="space-y-20 md:space-y-28">
          {ROWS.map((r, i) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="grid grid-cols-1 items-center gap-10 md:gap-16 lg:grid-cols-2"
            >
              <div
                className={cn(
                  "relative aspect-[4/5] w-full overflow-hidden",
                  i % 2 === 1 && "lg:order-2",
                )}
              >
                <Image
                  src={r.image}
                  alt=""
                  fill
                  quality={80}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="lg:max-w-[480px]">
                <h3
                  className="font-display text-[clamp(2rem,3vw,3rem)] leading-[1.05] tracking-[-0.025em] text-brand-ink"
                  style={{ fontWeight: 420 }}
                >
                  {r.name}
                </h3>
                <p className="mt-6 text-[17px] leading-[1.55] text-brand-ink-soft">
                  {r.body}
                </p>
                <p className="mt-5 text-[14px] text-brand-ink-soft">
                  {r.priceLine}
                </p>
                <Link
                  href="/book"
                  className="editorial-link mt-6 inline-block text-[17px] text-brand-ink"
                >
                  Book →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-24 border-t border-brand-line pt-10 md:mt-32 md:pt-14"
        >
          <p className="max-w-[760px] text-[17px] leading-[1.55] text-brand-ink">
            Moving out? We do end-of-tenancy cleans to landlord standard.{" "}
            <a
              href={TENANCY_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link text-brand-ink"
            >
              Request a quote →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
