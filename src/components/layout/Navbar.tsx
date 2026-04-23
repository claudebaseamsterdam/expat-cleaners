"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BUSINESS } from "@/lib/constants";
import { whatsappLink } from "@/lib/whatsapp";

export function Navbar() {
  const pathname = usePathname();
  const onBookPage = pathname === "/book";

  return (
    <header className="border-b border-brand-hairline bg-brand-cream">
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
            className="text-sm text-brand-graphite transition-colors hover:text-brand-ink"
          >
            WhatsApp us →
          </a>
        ) : (
          <Link
            href="/book"
            className="inline-flex h-10 items-center justify-center rounded-full bg-brand-terracotta px-5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-10px_rgba(232,92,58,0.55)]"
          >
            Book now
          </Link>
        )}
      </div>
    </header>
  );
}
