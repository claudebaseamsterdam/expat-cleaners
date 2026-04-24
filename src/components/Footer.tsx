import Link from "next/link";
import { whatsappHref } from "@/components/WhatsAppButton";
import { Wordmark } from "@/components/Wordmark";

// KvK / BTW placeholders live here as code comments until registered.
// KvK — [insert once registered]
// BTW — [insert once registered]

const SERVICES = [
  { label: "Recurring", href: "/book" },
  { label: "One-off", href: "/book" },
  { label: "Deep clean", href: "/book" },
  { label: "End of tenancy", href: "/book" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-cream pt-20 pb-10 md:pt-24">
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
          <div>
            <Link href="/" aria-label="expatcleaners — home">
              <Wordmark className="text-ink" />
            </Link>
            <p className="mt-4 max-w-xs text-[14px] leading-[1.55] text-stone">
              Built in Amsterdam for people who&apos;d rather be elsewhere.
            </p>
          </div>

          <FooterColumn title="Services" items={SERVICES} />

          <div>
            <h4 className="caption">Contact</h4>
            <ul className="mt-5 space-y-2.5">
              <li>
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-ink transition-colors hover:text-botanical"
                >
                  WhatsApp
                </a>
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

        <div className="mt-16 border-t border-stone/25 pt-6 text-[13px] text-stone">
          © {year} ExpatCleaners
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
