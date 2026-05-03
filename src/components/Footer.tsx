import Link from "next/link";
import { WhatsAppTextLink } from "@/components/WhatsAppButton";
import { Wordmark } from "@/components/Wordmark";
import { CookiePreferencesLink } from "@/components/CookiePreferencesLink";
import { BRAND } from "@/lib/constants";

// Phase 3.4 — service column items now deep-link with ?service= query
// params. Phase 7.3 wires the booking flow to read those params and
// pre-select the matching tile / frequency.
const SERVICES = [
  { label: "Recurring", href: "/book?service=recurring" },
  { label: "One-off", href: "/book?service=oneoff" },
  { label: "Deep clean", href: "/book?service=deep" },
  { label: "Move in/out", href: "/book?service=moveout" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-cream pt-20 pb-10 md:pt-24">
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
          <div>
            <Link
              href="/"
              aria-label="expatcleaners — home"
              style={{ color: "#1A1A1A" }}
            >
              {/* Explicit 20 px size — matches the nav wordmark register
                  and overrides any device-side text inflation. */}
              <Wordmark className="text-[20px]" />
            </Link>
            <p className="mt-4 max-w-xs text-[14px] leading-[1.55] text-stone">
              English-speaking cleaners. Organic products. Booked on
              WhatsApp. Amsterdam.
            </p>
          </div>

          <FooterColumn title="Services" items={SERVICES} />

          <div>
            <h4 className="caption">Contact</h4>
            <ul className="mt-5 space-y-2.5">
              <li>
                <WhatsAppTextLink
                  trackName="whatsapp_footer"
                  className="text-[14px] text-ink transition-colors hover:text-botanical"
                >
                  WhatsApp
                </WhatsAppTextLink>
              </li>
              <li>
                <a
                  href="mailto:hello@expat-cleaners.com"
                  className="text-[14px] text-ink transition-colors hover:text-botanical"
                >
                  hello@expat-cleaners.com
                </a>
              </li>
              <li className="text-[14px] text-stone">
                Amsterdam, Netherlands
              </li>
            </ul>
          </div>
        </div>

        {/* Phase 3.4 — single legal line with Terms / Privacy links.
            On mobile it wraps naturally; on desktop the · separators
            keep it readable across the full width. */}
        <div className="mt-16 border-t border-stone/25 pt-6 text-[13px] leading-[1.6] text-stone">
          <p className="tabular-nums">
            © {year} ExpatCleaners · KvK {BRAND.kvk} · BTW {BRAND.btw} ·{" "}
            <Link
              href="/terms"
              className="text-stone underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              Terms
            </Link>{" "}
            ·{" "}
            <Link
              href="/privacy"
              className="text-stone underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              Privacy
            </Link>{" "}
            · <CookiePreferencesLink />
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="caption">{title}</h4>
      <ul className="mt-5 space-y-2.5">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-[14px] text-ink transition-colors hover:text-botanical"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
