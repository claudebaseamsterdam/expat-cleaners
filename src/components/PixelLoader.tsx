"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/pixel";
import { CONSENT_EVENTS, hasMarketingConsent } from "@/lib/consent";

/**
 * Mounted once at the layout level. Single source for every Meta Pixel
 * PageView fire after Phase 6:
 *
 *  1. INITIAL pathname-effect mount → trackPageView() runs. The call
 *     is consent-gated inside lib/pixel.ts, so visitors without
 *     "Accept all" get a silent no-op (no fbevents.js download).
 *  2. ROUTE CHANGES → the same effect re-runs with the new pathname,
 *     fires PageView (still consent-gated).
 *  3. MID-SESSION CONSENT GRANT → the consent-changed listener fires
 *     PageView for the page the user is currently on. The pathname
 *     effect can't re-fire because the path didn't change.
 *
 * This component used to skip the first mount because layout.tsx had
 * an inline base-script that pre-fired the initial PageView. Phase 6
 * removed that inline script (it ran ungated); now this component is
 * the only path that ever calls trackPageView().
 */
export function PixelLoader() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView();
  }, [pathname]);

  useEffect(() => {
    const handler = () => {
      // Only fire when the new state IS marketing-consented. A
      // revocation event ("all" → "necessary") arrives here too —
      // we just want to no-op in that case. The lib/pixel.ts gate
      // would no-op anyway, but the explicit check spares the call.
      if (hasMarketingConsent()) trackPageView();
    };
    window.addEventListener(CONSENT_EVENTS.changed, handler);
    return () => window.removeEventListener(CONSENT_EVENTS.changed, handler);
  }, []);

  return null;
}
