/**
 * Cookie / Meta Pixel consent storage and pub-sub.
 *
 * Pure browser-side module. Server-rendered code that imports from
 * here gets safe no-ops when `window` is undefined.
 *
 * The Privacy Statement (lib/privacy/page.tsx, §8) promises:
 *   "Our website uses functional cookies (necessary for the booking
 *    flow) and, only with your consent, analytical and marketing
 *    cookies — including the Meta Pixel from Meta Platforms Ireland."
 *
 * For that promise to be technically true, the Meta Pixel base script
 * MUST NOT load until `hasMarketingConsent()` returns true. The actual
 * gate lives in `lib/pixel.ts`'s `fire()`; this module is just the
 * persistence + signalling layer.
 *
 * Storage:
 *   - Key: "expatcleaners_cookie_consent_v1" (versioned so a future
 *     schema change — e.g. adding granular toggles — can invalidate
 *     stale records cleanly).
 *   - Value: JSON envelope `{ decision, decidedAt }`.
 *
 * Events:
 *   - "expatcleaners:consent-changed" — dispatched on save/clear so
 *     PixelLoader can fire the initial PageView the moment a user
 *     accepts mid-session.
 *   - "expatcleaners:open-cookie-banner" — dispatched by the footer
 *     "Cookie preferences" link to re-open the banner so the user can
 *     change their mind.
 */

const STORAGE_KEY = "expatcleaners_cookie_consent_v1";

export type ConsentDecision = "all" | "necessary";

export type ConsentRecord = {
  decision: ConsentDecision;
  decidedAt: number;
};

export const CONSENT_EVENTS = {
  changed: "expatcleaners:consent-changed",
  open: "expatcleaners:open-cookie-banner",
} as const;

export function loadConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
    if (parsed.decision !== "all" && parsed.decision !== "necessary") {
      return null;
    }
    if (typeof parsed.decidedAt !== "number") return null;
    return { decision: parsed.decision, decidedAt: parsed.decidedAt };
  } catch {
    return null;
  }
}

export function saveConsent(decision: ConsentDecision): void {
  if (typeof window === "undefined") return;
  const record: ConsentRecord = { decision, decidedAt: Date.now() };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* quota / disabled storage — ignore */
  }
  // Notify listeners (PixelLoader subscribes to fire the initial
  // PageView the moment "Accept all" is clicked).
  window.dispatchEvent(
    new CustomEvent<ConsentRecord>(CONSENT_EVENTS.changed, {
      detail: record,
    }),
  );
}

/** Check whether the user has accepted analytical / marketing cookies. */
export function hasMarketingConsent(): boolean {
  return loadConsent()?.decision === "all";
}

/** Wipe consent state (used internally; no UI for this currently). */
export function clearConsent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENTS.changed, { detail: null }));
}

/**
 * Force the cookie banner to re-open. Wired to the footer "Cookie
 * preferences" link so users can change their mind after their first
 * decision. The banner listens via the matching event below.
 */
export function openCookieBanner(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CONSENT_EVENTS.open));
}
