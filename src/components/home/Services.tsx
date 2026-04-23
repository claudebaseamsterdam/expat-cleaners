"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { UNSPLASH, BRAND } from "@/lib/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

type ServiceCard = {
  title: string;
  copy: string;
  priceLine: string;
  ctaLabel: string;
  ctaHref: string;
  ctaExternal?: boolean;
  tag?: string;
  image: string;
  span: "one" | "two";
};

const tenancyMsg = encodeURIComponent(
  "Hi! I need an end of tenancy quote.",
);

const CARDS: ServiceCard[] = [
  {
    title: "Regular cleaning",
    copy: "Weekly or bi-weekly. Your home consistently clean. Set it once and forget it.",
    priceLine: "From €36/hr on subscription",
    ctaLabel: "Book now",
    ctaHref: "/book",
    tag: "Most popular",
    image: UNSPLASH.regular,
    span: "two",
  },
  {
    title: "One-off clean",
    copy: "No commitment. Guests coming over? Post-party mess? We're there.",
    priceLine: "€44/hr · no commitment",
    ctaLabel: "Book now",
    ctaHref: "/book",
    image: UNSPLASH.oneoff,
    span: "one",
  },
  {
    title: "Deep clean",
    copy: "Inside appliances, skirting boards, behind everything. Move-in or move-out ready.",
    priceLine: "€44/hr · min 3 hrs",
    ctaLabel: "Book now",
    ctaHref: "/book",
    image: UNSPLASH.deep,
    span: "one",
  },
  {
    title: "End of tenancy",
    copy: "Get your deposit back. We clean to landlord standard, top to bottom. Guaranteed.",
    priceLine: "Fixed quote · fast turnaround",
    ctaLabel: "Get a quote",
    ctaHref: `https://wa.me/${BRAND.whatsappNumber}?text=${tenancyMsg}`,
    ctaExternal: true,
    tag: "Deposit-back",
    image: UNSPLASH.tenancy,
    span: "one",
  },
];

export function Services() {
  return (
    <section id="services" className="bg-brand-cream py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-sage" />
            <span className="text-xs uppercase tracking-[0.22em] text-brand-graphite">
              What we do
            </span>
          </div>
          <h2
            className="mt-5 max-w-3xl font-display text-[clamp(36px,6vw,64px)] leading-[1.02] tracking-tight text-brand-ink"
            dangerouslySetInnerHTML={{
              __html: "Every clean, <em>covered.</em>",
            }}
          />
        </motion.div>

        <div className="mt-14 grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {CARDS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              className={
                c.span === "two" ? "lg:col-span-2" : "lg:col-span-1"
              }
            >
              <Card card={c} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ card }: { card: ServiceCard }) {
  const big = card.span === "two";
  const linkProps = card.ctaExternal
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};
  const LinkTag: React.ElementType = card.ctaExternal ? "a" : Link;
  return (
    <LinkTag
      href={card.ctaHref}
      {...linkProps}
      className={`group relative block h-full overflow-hidden rounded-[24px] ${
        big ? "min-h-[340px] md:min-h-[440px]" : "min-h-[280px] md:min-h-[320px]"
      }`}
    >
      <Image
        src={`${card.image}?w=1400&auto=format&fit=crop&q=80`}
        alt=""
        fill
        sizes={big ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
        className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/80 via-brand-ink/20 to-transparent" />

      {card.tag && (
        <span className="absolute left-5 top-5 inline-flex items-center rounded-full bg-brand-cream/95 px-3 py-1 text-xs font-medium text-brand-ink backdrop-blur">
          {card.tag}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
        <h3
          className={`font-display tracking-tight text-brand-cream ${
            big ? "text-3xl md:text-4xl" : "text-2xl"
          }`}
        >
          {card.title}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-brand-cream/85">
          {card.copy}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs text-brand-cream/75">{card.priceLine}</span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-cream">
            {card.ctaLabel}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
          </span>
        </div>
      </div>
    </LinkTag>
  );
}
