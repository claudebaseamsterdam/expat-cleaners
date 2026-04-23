"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#approach", label: "Approach" },
  { href: "/#pricing", label: "Pricing" },
  { href: "#", label: "Journal" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-brand-bg/95 backdrop-blur-[6px] transition-[border-color] duration-300",
        scrolled
          ? "border-b border-brand-line"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 md:h-20">
        <Link
          href="/"
          className="text-[15px] lowercase tracking-[0.02em] text-brand-ink"
          style={{ fontWeight: 420 }}
        >
          expatcleaners
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              className="text-[14px] text-brand-ink-soft transition-colors hover:text-brand-ink"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="editorial-link text-[14px] text-brand-ink"
          >
            Book
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="grid h-10 w-10 place-items-center text-brand-ink md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-brand-line bg-brand-bg md:hidden">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-1 px-6 py-6">
            {LINKS.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                className="py-3 text-[17px] text-brand-ink"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/book"
              className="editorial-link mt-2 py-3 text-[17px] text-brand-ink"
            >
              Book →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
