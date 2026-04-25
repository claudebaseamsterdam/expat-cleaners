"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/Wordmark";

const LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#reviews", label: "Reviews" },
] as const;

const THRESHOLD = 80;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rafId = useRef<number | null>(null);
  const overHero = pathname === "/" && !scrolled;

  // rAF-throttled scroll listener.
  useEffect(() => {
    const update = () => {
      rafId.current = null;
      setScrolled((prev) => {
        const next = window.scrollY > THRESHOLD;
        return prev === next ? prev : next;
      });
    };
    const onScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Close mobile menu on route change.
  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll while the mobile overlay menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Triple-layered colour: (1) a `.nav-cream` / `.nav-ink` class with
  // `!important`, (2) the Tailwind `text-cream` / `text-ink` utility,
  // and (3) an inline `style={{ color }}`. At least one wins in every
  // cascade / hydration scenario we've seen in QA.
  const navColor = overHero ? "#F7F4EE" : "#1A1A1A";
  const textClass = overHero ? "nav-cream text-cream" : "nav-ink text-ink";

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-[background-color,border-color] duration-300",
        scrolled
          ? "border-b border-stone/20 bg-cream"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-6 md:px-8">
        <Link
          href="/"
          aria-label="expatcleaners — home"
          className={cn(
            "rounded-sm transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4",
            overHero
              ? "focus-visible:outline-cream"
              : "focus-visible:outline-botanical",
            textClass,
          )}
          style={{ color: navColor }}
        >
          <Wordmark className={textClass} style={{ color: navColor }} />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-sm text-[14px] font-medium transition-colors duration-300 hover:text-botanical focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4",
                overHero
                  ? "focus-visible:outline-cream"
                  : "focus-visible:outline-botanical",
                textClass,
              )}
              style={{ color: navColor }}
            >
              {l.label}
            </Link>
          ))}
          {/* Ghost pill — secondary on purpose. The single saturated CTA
              on screen is the WhatsApp button in the hero / final CTA;
              the nav Book link is a quiet alternative that doesn't
              compete with it for visual primacy. Inline style/textClass
              override is intentionally NOT applied here — the pill needs
              hover utilities to swap text colour. */}
          <Link
            href="/book"
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-full border px-5 text-[14px] font-medium transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
              overHero
                ? "border-cream/60 text-cream hover:border-cream hover:bg-cream/10 focus-visible:outline-cream"
                : "border-botanical/40 text-botanical hover:border-botanical hover:bg-botanical hover:text-cream focus-visible:outline-botanical",
            )}
          >
            Book
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className={cn(
            "grid h-10 w-10 place-items-center rounded-sm transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 md:hidden",
            overHero
              ? "focus-visible:outline-cream"
              : "focus-visible:outline-botanical",
            textClass,
          )}
          style={{ color: navColor }}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 top-[72px] z-40 bg-cream md:hidden">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-6 pt-10 pb-12">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 font-display text-[32px] leading-tight tracking-[-0.01em] text-ink"
                style={{ fontWeight: 400 }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex h-12 w-fit items-center justify-center rounded-full bg-botanical px-7 text-[15px] font-medium text-cream"
            >
              Book
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
