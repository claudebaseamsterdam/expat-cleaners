/**
 * Meta Pixel (Facebook Pixel) helper.
 *
 * Uses the hardcoded pixel ID and lazily injects the standard pixel base
 * script when needed. From that point on each tracked event proxies
 * through window.fbq("track", ...).
 *
 * Wiring overview (see app/book/page.tsx, app/thank-you/page.tsx,
 * components/PixelLoader.tsx, components/WhatsAppButton.tsx):
 *  - PageView             → initial fire from the layout's inline base
 *                           script + subsequent client navigations from
 *                           PixelLoader (usePathname effect, first-mount
 *                           guarded so the initial load isn't double-fired).
 *  - ViewContent          → fires on direct WhatsApp CTAs that signal
 *                           soft engagement (homepage hero / pricing /
 *                           services / footer / sticky bar). These are
 *                           top-of-funnel touches, not conversions.
 *  - AddToCart            → fires once per session on the rising edge of
 *                           step1Valid (postcode + service + frequency).
 *  - InitiateCheckout     → fires once when the user lands on Step 3
 *                           (Review). Single-fire guarded by
 *                           initiateFiredRef. Fires *before* the Mollie
 *                           redirect; the booking-funnel WhatsApp button
 *                           itself does not re-fire it.
 *  - CompleteRegistration → fires on the booking-intent click — the
 *                           "Send booking on WhatsApp" / "Pay now &
 *                           reserve" buttons on Step 3, the desktop
 *                           sidebar WhatsApp link, and the >155m²
 *                           custom-quote WhatsApp link. The Meta-side
 *                           conversion event for this WhatsApp-first
 *                           campaign.
 *  - Purchase             → fires only on /thank-you after
 *                           /api/mollie/status confirms isPaid === true.
 *                           Single-fire guarded by purchaseFiredRef. The
 *                           redirect URL alone is never trusted. Kept
 *                           for the online-payment path; WhatsApp-only
 *                           bookings convert via CompleteRegistration.
 *
 * NOTE on "noisy button events" in Meta Test Events:
 * Events that show up tagged with raw button text (Book, Next, Select,
 * Use this slot, Review, Continue on WhatsApp, Or book online) come
 * from Meta's server-side Automatic Event Detection, not from this
 * file. They cannot be disabled in code — turn them off in Meta Events
 * Manager → Data Sources → [pixel] → Settings → Detected Events
 * (or Automatic Advanced Matching, depending on the surface).
 */

declare global {
  // The fbq function is injected by the Pixel base script. Loose typing is
  // intentional — the third party's own typings are the source of truth.
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

const PIXEL_ID = "1941364749829024";

const IS_DEV =
  typeof process !== "undefined" && process.env.NODE_ENV !== "production";

let scriptInjected = false;

/**
 * Idempotently load the Pixel base script and register the Pixel ID.
 * Safe to call repeatedly — only the first call performs work.
 */
export function ensurePixel(): void {
  if (typeof window === "undefined") return;
  if (!PIXEL_ID) return;
  if (scriptInjected) return;
  if (window.fbq) {
    scriptInjected = true;
    return;
  }
  scriptInjected = true;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  // Standard Meta Pixel base snippet, transcribed into TypeScript and
  // marked as injected so we don't double-load.
  ((f: any, b: Document, e: string, v: string) => {
    if (f.fbq) return;
    const n: any = function (...args: unknown[]) {
      if (n.callMethod) {
        n.callMethod(...args);
      } else {
        n.queue.push(args);
      }
    };
    f.fbq = n;
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s?.parentNode?.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const fbq = window.fbq as unknown as ((...args: unknown[]) => void) | undefined;
  fbq?.("init", PIXEL_ID);
}

function fire(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (!PIXEL_ID) {
    if (IS_DEV) {
      // Visibility into "what would have fired" while the Pixel ID is
      // unprovisioned. Silent in production.
      console.log(`[pixel] ${event}`, params ?? {});
    }
    return;
  }
  ensurePixel();
  const fbq = window.fbq as unknown as ((...args: unknown[]) => void) | undefined;
  fbq?.("track", event, params ?? {});
}

/**
 * Fires PageView on the current route. Call from a client effect that
 * watches usePathname so route changes also fire (App Router doesn't do
 * this automatically).
 */
export function trackPageView(): void {
  fire("PageView");
}

/**
 * Fires ViewContent on a soft-engagement WhatsApp CTA — the
 * homepage hero / pricing / services / footer / sticky bar buttons.
 * These are top-of-funnel touches, not conversions. The booking-flow
 * WhatsApp clicks fire CompleteRegistration instead.
 */
export function trackViewContent(params: {
  contentName?: string;
  contentCategory?: string;
}): void {
  fire("ViewContent", {
    content_name: params.contentName ?? "whatsapp_enquiry",
    content_category: params.contentCategory ?? "enquiry",
  });
}

/**
 * Fires AddToCart when the user has chosen a service, has a duration
 * estimate, and has picked a frequency — i.e. step 1 is complete.
 * Call this exactly once per session on the rising edge of step1Valid.
 */
export function trackAddToCart(params: {
  serviceId: string;
  frequencyId: string;
  hours: number;
  value: number;
  currency?: string;
}): void {
  fire("AddToCart", {
    content_type: "product",
    content_ids: [params.serviceId],
    currency: params.currency ?? "EUR",
    value: params.value,
    num_items: 1,
    custom_data: {
      service_id: params.serviceId,
      frequency_id: params.frequencyId,
      hours: params.hours,
    },
  });
}

/**
 * Fires InitiateCheckout when the user lands on Step 3 (Review).
 * Once per Step 3 mount.
 */
export function trackInitiateCheckout(params: {
  serviceId: string;
  frequencyId: string;
  hours: number;
  value: number;
  currency?: string;
}): void {
  fire("InitiateCheckout", {
    content_type: "product",
    content_ids: [params.serviceId],
    currency: params.currency ?? "EUR",
    value: params.value,
    num_items: 1,
    custom_data: {
      service_id: params.serviceId,
      frequency_id: params.frequencyId,
      hours: params.hours,
    },
  });
}

/**
 * Fires CompleteRegistration on a booking-intent click — the
 * "Send booking on WhatsApp" / "Pay now & reserve" buttons on Step 3,
 * the desktop sidebar WhatsApp link, and the >155m² custom-quote
 * WhatsApp link.
 *
 * This is the Meta-side conversion event for the WhatsApp-first
 * campaign: most customers convert via WhatsApp without ever paying
 * online, so Purchase alone undercounts conversions. Caller passes
 * `contentName` to differentiate surfaces in reporting:
 * 'whatsapp_booking_confirmed', 'online_booking_confirmed',
 * 'whatsapp_booking_sidebar', 'whatsapp_custom_quote'.
 *
 * `value` is the booking subtotal in EUR; pass 0 for surfaces with
 * no estimable price (e.g. the >155m² custom quote).
 */
export function trackCompleteRegistration(params: {
  value?: number;
  currency?: string;
  contentName?: string;
}): void {
  fire("CompleteRegistration", {
    value: params.value ?? 0,
    currency: params.currency ?? "EUR",
    content_name: params.contentName ?? "whatsapp_booking",
  });
}

/**
 * Fires Purchase on /thank-you after /api/mollie/status confirms the
 * Mollie payment is paid. Online-payment path only — WhatsApp-only
 * bookings convert via CompleteRegistration.
 */
export function trackPurchase(params: {
  serviceId: string;
  frequencyId: string;
  hours: number;
  value: number;
  currency?: string;
  ref?: string;
}): void {
  fire("Purchase", {
    content_type: "product",
    content_ids: [params.serviceId],
    currency: params.currency ?? "EUR",
    value: params.value,
    num_items: 1,
    custom_data: {
      service_id: params.serviceId,
      frequency_id: params.frequencyId,
      hours: params.hours,
      booking_ref: params.ref,
    },
  });
}
