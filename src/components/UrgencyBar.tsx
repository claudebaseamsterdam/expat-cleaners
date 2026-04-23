"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "ec_urgency_dismissed";

export function UrgencyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = window.sessionStorage.getItem(STORAGE_KEY) === "1";
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (!visible) return null;

  return (
    <div className="relative z-50 bg-brand-terracotta text-brand-cream">
      <div className="mx-auto flex h-10 max-w-6xl items-center justify-center gap-3 px-12 text-center text-xs sm:text-sm">
        <Link
          href="/book"
          className="inline-flex items-center gap-2 font-medium tracking-wide"
        >
          <span aria-hidden>🔥</span>
          Only 3 slots left this week in Amsterdam.{" "}
          <span className="underline underline-offset-4">Book now →</span>
        </Link>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-brand-cream/80 transition-colors hover:bg-white/10 hover:text-brand-cream"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
