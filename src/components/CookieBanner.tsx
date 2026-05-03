"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CONSENT_EVENTS,
  loadConsent,
  saveConsent,
  type ConsentDecision,
} from "@/lib/consent";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Bottom-of-viewport cookie consent banner. Two-button design per the
 * Phase 6 spec:
 *   - "Accept all"      → marks decision "all" → unblocks Meta Pixel.
 *   - "Necessary only"  → marks decision "necessary" → Meta Pixel never
 *                         loads. Only functional cookies (the booking-
 *                         flow draft + this consent record itself) are
 *                         used.
 *
 * State machine:
 *   - First visit (no localStorage record)       → banner visible.
 *   - Returning visit (any decision recorded)    → banner hidden.
 *   - User clicks footer "Cookie preferences"    → banner re-shows so
 *                                                  the user can change
 *                                                  their mind.
 *
 * Render is deferred until after `useEffect` runs so SSR doesn't emit
 * markup that the client immediately hides — avoids the consent-banner
 * flash on returning visits.
 */
export function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Mount-only client sync: defer banner render until after hydration
    // and seed the open-state from localStorage. Both setStates are
    // intentionally synchronous — they're guarded by the empty deps
    // array and cannot loop. Same exception used in app/book/page.tsx
    // for the booking-draft hydrate.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (!loadConsent()) setOpen(true);

    const onForceOpen = () => setOpen(true);
    window.addEventListener(CONSENT_EVENTS.open, onForceOpen);
    return () => window.removeEventListener(CONSENT_EVENTS.open, onForceOpen);
  }, []);

  const decide = (decision: ConsentDecision) => {
    saveConsent(decision);
    setOpen(false);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          role="dialog"
          aria-label="Cookie preferences"
          aria-modal="false"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-stone/25 bg-cream shadow-[0_-12px_40px_-16px_rgba(26,26,26,0.18)]"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
          }}
        >
          <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:gap-8 md:px-8">
            <p className="flex-1 text-[14px] leading-[1.55] text-ink">
              We use functional cookies to make the site work, and — only
              if you accept — Meta Pixel to measure our ads. See our{" "}
              <Link
                href="/privacy"
                className="link-underline text-ink"
              >
                Privacy Statement
              </Link>
              .
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <button
                type="button"
                onClick={() => decide("necessary")}
                className="h-11 rounded-full border border-stone/30 bg-cream px-5 text-[14px] font-medium text-ink transition-colors hover:border-ink/40"
              >
                Necessary only
              </button>
              <button
                type="button"
                onClick={() => decide("all")}
                className="h-11 rounded-full bg-ink px-6 text-[14px] font-medium text-cream transition-colors hover:bg-ink/90"
              >
                Accept all
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
