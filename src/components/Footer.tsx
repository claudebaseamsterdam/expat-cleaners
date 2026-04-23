import Link from "next/link";
import { BRAND, WHATSAPP_URL } from "@/lib/constants";

// Legal identifiers are not yet registered. Keep them out of the rendered
// footer until they are — ship placeholders as code comments only.
//
// KvK — [insert once registered]
// BTW — [insert once registered]

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-line bg-brand-bg">
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:py-24">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="text-[15px] lowercase tracking-[0.02em] text-brand-ink transition-colors duration-200 hover:text-brand-terracotta"
              style={{ fontWeight: 420 }}
            >
              expatcleaners
            </Link>
            <p className="mt-4 max-w-xs text-[14px] leading-[1.55] text-brand-ink-soft">
              Built in Amsterdam for people who&apos;d rather be elsewhere.
            </p>
          </div>

          <FooterColumn
            title="Services"
            links={[
              { label: "Recurring", href: "/book" },
              { label: "One-off", href: "/book" },
              { label: "Deep clean", href: "/book" },
              { label: "End of tenancy", href: "/book" },
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              { label: "Approach", href: "/#approach" },
              { label: "Pricing", href: "/#pricing" },
              { label: "Reviews", href: "/#reviews" },
            ]}
          />
          <FooterColumn
            title="Contact"
            links={[
              { label: "WhatsApp", href: WHATSAPP_URL, external: true },
              { label: "Email", href: `mailto:${BRAND.email}` },
              { label: "Amsterdam, Netherlands", href: null },
            ]}
          />
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-2 border-t border-brand-line pt-6 text-[12px] text-brand-ink-soft md:flex-row md:items-center">
          <p>© {year} ExpatCleaners</p>
          <p>Amsterdam, Netherlands</p>
        </div>
      </div>
    </footer>
  );
}

type LinkItem = {
  label: string;
  href: string | null;
  external?: boolean;
};

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: LinkItem[];
}) {
  return (
    <div>
      <h4 className="text-[12px] uppercase tracking-[0.1em] text-brand-ink-soft">
        {title}
      </h4>
      <ul className="mt-5 space-y-2.5">
        {links.map((l) =>
          l.href ? (
            <li key={l.label}>
              {l.external ? (
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-brand-ink/90 transition-colors hover:text-brand-terracotta"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  href={l.href}
                  className="text-[14px] text-brand-ink/90 transition-colors hover:text-brand-terracotta"
                >
                  {l.label}
                </Link>
              )}
            </li>
          ) : (
            <li key={l.label} className="text-[14px] text-brand-ink-soft">
              {l.label}
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
