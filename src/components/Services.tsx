"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { WhatsAppButton, WhatsAppTextLink } from "@/components/WhatsAppButton";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type Card = {
  id: string;
  name: string;
  priceLine: string;
  body: string;
  image: string;
  alt: string;
  cta: string;
  prefill: string;
  featured?: boolean;
};

const CARDS: Card[] = [
  {
    id: "recurring",
    name: "Recurring cleaning",
    priceLine: "From €36/hr · same cleaner every time",
    body: "Weekly or bi-weekly, same cleaner each time. Organic supplies included.",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1800&q=85&auto=format&fit=crop",
    alt: "Lived-in Amsterdam-feeling apartment interior with natural light",
    cta: "Start a recurring plan",
    prefill: "Hi! I'd like to set up a recurring clean.",
    featured: true,
  },
  {
    id: "oneoff",
    name: "One-off cleaning",
    priceLine: "€44/hr · no commitment",
    body: "For a single reset — before guests, after a party, when the week got away from you.",
    image:
      "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=1800&q=85&auto=format&fit=crop",
    alt: "Warm kitchen interior, morning light, no people",
    cta: "Book a one-off",
    prefill: "Hi! I'd like to book a one-off clean.",
  },
  {
    id: "deep",
    name: "Deep clean",
    priceLine: "€44/hr · min. 3 hours",
    body: "Inside appliances, skirting boards, behind the things no one ever reaches.",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1800&q=85&auto=format&fit=crop",
    alt: "Detailed interior shot — clean kitchen corner in golden-hour light",
    cta: "Book a deep clean",
    prefill: "Hi! I'd like to book a deep clean.",
  },
];

const TENANCY_PREFILL =
  "Hi! I'd like a quote for an end-of-tenancy clean.";

export function Services() {
  return (
    <section id="services" className="bg-cream py-20 md:py-32">
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-[600px]"
        >
          <p className="caption">Services</p>
          <h2
            className="mt-4 font-display text-[32px] leading-[1.08] tracking-[-0.02em] md:text-[48px]"
            style={{ fontWeight: 400 }}
          >
            What we do.
          </h2>
        </motion.div>

        <div className="mt-16 flex flex-col gap-14 md:mt-20 md:gap-24">
          {CARDS.map((card, i) => {
            const imageRight = i % 2 === 1;
            return (
              <motion.article
                key={card.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: EASE }}
                className={cn(
                  "grid grid-cols-1 items-stretch gap-6 overflow-hidden md:grid-cols-2 md:gap-0",
                  card.featured && "md:min-h-[60vh]",
                )}
              >
                <div
                  className={cn(
                    "relative aspect-[4/3] w-full md:aspect-auto md:min-h-[440px]",
                    card.featured && "md:min-h-[560px]",
                    imageRight && "md:order-2",
                  )}
                >
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    quality={85}
                    sizes="(min-width: 768px) 640px, 100vw"
                    className="editorial-img object-cover"
                  />
                </div>
                <div
                  className={cn(
                    "flex flex-col justify-center bg-cream p-8 md:p-16",
                    imageRight && "md:order-1",
                  )}
                >
                  <h3
                    className={cn(
                      "font-display leading-[1.1] tracking-[-0.02em] text-ink",
                      card.featured
                        ? "text-[32px] md:text-[44px]"
                        : "text-[28px] md:text-[36px]",
                    )}
                    style={{ fontWeight: 500 }}
                  >
                    {card.name}
                  </h3>
                  <p className="mt-3 text-[16px] text-stone md:text-[18px]">
                    {card.priceLine}
                  </p>
                  <p className="mt-5 max-w-[440px] text-[16px] leading-[1.6] text-ink md:text-[17px]">
                    {card.body}
                  </p>
                  <div className="mt-8">
                    <WhatsAppButton variant="small" message={card.prefill}>
                      {card.cta}
                    </WhatsAppButton>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-16 text-center text-[15px] text-stone md:mt-24"
        >
          Moving out? We do end-of-tenancy cleans to landlord standard.{" "}
          <WhatsAppTextLink
            message={TENANCY_PREFILL}
            trackName="whatsapp_tenancy"
            className="link-underline text-ink"
          >
            Request a quote →
          </WhatsAppTextLink>
        </motion.p>
      </div>
    </section>
  );
}
