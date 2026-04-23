"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND, NAV_LINKS, WHATSAPP_URL } from "@/lib/constants";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "border-b border-brand-hairline bg-brand-cream/80 backdrop-blur-xl"
          : "border-b border-transparent bg-brand-cream/0",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20">
        <Link href="/" aria-label={BRAND.name} className="group">
          <span className="font-display text-[22px] leading-none tracking-tight text-brand-ink md:text-2xl">
            <span className="font-light italic">expat</span>
            <span className="font-normal">cleaners</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-brand-graphite transition-colors hover:text-brand-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-brand-hairline bg-white px-4 text-sm font-medium text-brand-ink transition-colors hover:border-brand-ink/30"
          >
            <MessageCircle className="h-4 w-4 text-brand-sage" />
            WhatsApp
          </a>
          <Link
            href="/book"
            className="inline-flex h-10 items-center justify-center rounded-full bg-brand-terracotta px-5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-10px_rgba(232,92,58,0.55)]"
          >
            Book a clean
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="grid h-10 w-10 place-items-center rounded-full border border-brand-hairline bg-white md:hidden"
        >
          {open ? (
            <X className="h-4 w-4 text-brand-ink" />
          ) : (
            <Menu className="h-4 w-4 text-brand-ink" />
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-brand-hairline bg-brand-cream md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-3 text-base text-brand-ink transition-colors hover:bg-brand-linen"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full border border-brand-hairline bg-white text-sm font-medium text-brand-ink"
              >
                <MessageCircle className="h-4 w-4 text-brand-sage" />
                WhatsApp
              </a>
              <Link
                href="/book"
                className="inline-flex h-12 items-center justify-center rounded-full bg-brand-terracotta text-sm font-medium text-white"
              >
                Book a clean
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
