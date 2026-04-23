import Link from "next/link";
import { BUSINESS } from "@/lib/constants";
import { whatsappLink } from "@/lib/whatsapp";

const primaryCta =
  "inline-flex h-12 items-center justify-center rounded-full bg-brand-terracotta px-6 text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(232,92,58,0.5)]";

const outlineCta =
  "inline-flex h-12 items-center justify-center rounded-full border border-brand-hairline bg-white px-6 text-base font-medium text-brand-ink transition-colors hover:border-brand-ink/30";

export default function Home() {
  return (
    <section className="bg-brand-cream">
      <div className="mx-auto max-w-4xl px-4 py-24 text-center md:py-36">
        <p className="mb-5 text-xs uppercase tracking-[0.22em] text-brand-graphite">
          English-speaking · Amsterdam
        </p>
        <h1 className="font-display text-4xl tracking-tight text-brand-ink md:text-6xl">
          Premium cleaning for expats, one message away.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-brand-graphite">
          {BUSINESS.tagline}. Book in under a minute — no sign-up, no card,
          everything finalised over WhatsApp.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/book" className={primaryCta}>
            Book now
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={outlineCta}
          >
            WhatsApp us
          </a>
        </div>
      </div>
    </section>
  );
}
