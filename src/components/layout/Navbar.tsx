"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BUSINESS } from "@/lib/constants";
import { whatsappLink } from "@/lib/whatsapp";

export function Navbar() {
  const pathname = usePathname();
  const onBookPage = pathname === "/book";

  return (
    <header className="border-b border-brand-stone/60 bg-brand-cream">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-display text-xl tracking-tight text-brand-ink"
        >
          {BUSINESS.name}
        </Link>
        {onBookPage ? (
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-ink/70 transition-colors hover:text-brand-ink"
          >
            WhatsApp us →
          </a>
        ) : (
          <Link
            href="/book"
            className="inline-flex h-10 items-center justify-center rounded-full bg-brand-ink px-5 text-sm font-medium text-brand-cream transition-colors hover:bg-brand-ink/90"
          >
            Book now
          </Link>
        )}
      </div>
    </header>
  );
}
