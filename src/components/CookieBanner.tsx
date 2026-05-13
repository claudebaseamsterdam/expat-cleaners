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
          className="fixed inset-x-0 bottom-0 z-50 border-t border-stone/25 bg-cream/95 shadow-[0_-12px_40px_-16px_rgba(26,26,26,0.18)] backdrop-blur-md"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom) + 10px)",
          }}
        >
          <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:gap-8 md:px-8 md:py-6">
            <p className="flex-1 text-[12.5px] leading-[1.45] text-ink md:text-[14px] md:leading-[1.55]">
              Functional cookies keep the site working. With your
              permission, Meta also learns which ads bring expats here —
              so we can keep the good ones running.{" "}
              <Link
                href="/privacy"
                className="link-underline text-ink"
              >
                Privacy
              </Link>
              .
            </p>
            <div className="flex flex-row items-center gap-2 md:gap-3">
              <button
                type="button"
                onClick={() => decide("necessary")}
                className="h-10 flex-1 rounded-full border border-stone/30 bg-cream px-4 text-[13px] font-medium text-ink transition-colors hover:border-ink/40 md:h-11 md:flex-none md:px-5 md:text-[14px]"
              >
                Necessary only
              </button>
              <button
                type="button"
                onClick={() => decide("all")}
                className="h-10 flex-1 rounded-full bg-ink px-5 text-[13px] font-medium text-cream transition-colors hover:bg-ink/90 md:h-11 md:flex-none md:px-6 md:text-[14px]"
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
