import Link from "next/link";
import { BRAND, WHATSAPP_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-brand-hairline bg-brand-cream">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="group">
              <span className="font-display text-2xl leading-none tracking-tight text-brand-ink">
                <span className="font-light italic">expat</span>
                <span className="font-normal">cleaners</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-brand-graphite">
              Amsterdam expats love coming home.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid h-9 w-9 place-items-center rounded-full border border-brand-hairline bg-white transition-colors hover:border-brand-ink/30"
              >
                <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-brand-ink"
                aria-hidden
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
              </svg>
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="grid h-9 w-9 place-items-center rounded-full border border-brand-hairline bg-white transition-colors hover:border-brand-ink/30"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 text-brand-ink"
                  aria-hidden
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.172-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
              </a>
            </div>
          </div>

          <FooterColumn
            title="Services"
            links={[
              { label: "Regular cleaning", href: "/book" },
              { label: "One-off clean", href: "/book" },
              { label: "Deep clean", href: "/book" },
              { label: "End of tenancy", href: "/book" },
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              { label: "About", href: "/#how" },
              { label: "Contact", href: `mailto:${BRAND.email}` },
              { label: "Reviews", href: "/#reviews" },
              { label: "Pricing", href: "/#pricing" },
            ]}
          />
          <FooterColumn
            title="Legal"
            links={[
              { label: "Terms", href: "#" },
              { label: "Privacy", href: "#" },
              { label: "KvK — pending", href: "#" },
            ]}
          />
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-brand-hairline pt-6 text-xs text-brand-graphite md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {BRAND.name} · {BRAND.city} ·{" "}
            <a
              href={`mailto:${BRAND.email}`}
              className="hairline-link text-brand-ink"
            >
              {BRAND.email}
            </a>
          </p>
          <p className="text-brand-graphite/80">
            Built in Amsterdam.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-[0.18em] text-brand-graphite">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-brand-ink/90 transition-colors hover:text-brand-terracotta"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
