"use client";

import { openCookieBanner } from "@/lib/consent";

/**
 * Tiny client island used only inside the otherwise-server Footer.
 * Triggers the CookieBanner to re-show so users can change their
 * marketing-cookie decision after the initial accept/decline.
 */
export function CookiePreferencesLink() {
  return (
    <button
      type="button"
      onClick={openCookieBanner}
      className="text-stone underline-offset-4 transition-colors hover:text-ink hover:underline"
    >
      Cookie preferences
    </button>
  );
}
