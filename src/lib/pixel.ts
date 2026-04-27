/**
 * Meta Pixel (Facebook Pixel) helper.
 *
 * Uses the hardcoded pixel ID and lazily injects the standard pixel base
 * script when needed. From that point on each tracked event proxies
 * through window.fbq("track", ...).
 *
 * Wiring overview (see app/book/page.tsx, components/PixelLoader.tsx):
 *  - PageView          → fires on every route change (PixelLoader hooks
 *                        into next/navigation usePathname).
 *  - AddToCart         → fires the moment the user has selected a service,
 *                        a (default) duration estimate, and a frequency.
 *                        The booking page fires this exactly once per
 *                        session, on the rising edge of step1Valid.
 *  - InitiateCheckout  → fires when the user lands on Step 3 (Review).
 *  - Purchase          → TODO: wire this to a Mollie payment-success
 *                        webhook callback once the Mollie integration
 *                        is added. See brief 1.7 / 1.9 — payment is
 *                        currently "pay after the clean" and there is
 *                        no online payment step. Until that lands, this
 *                        function should not be called from the UI.
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
 * Fires Lead on a "direct WhatsApp CTA" click — i.e. anywhere a user
 * taps a wa.me link that doesn't go through the booking funnel. This
 * replaces Meta's auto-collected button metadata (which surfaced as
 * messy class names in Test Events) with a clean, named event.
 *
 * Caller passes the surface so the funnel report stays legible:
 * 'whatsapp_cta' for the standard hero/pricing/services buttons,
 * 'whatsapp_sticky' for the mobile sticky bar, 'whatsapp_footer' for
 * the footer text link, 'whatsapp_tenancy' for the end-of-tenancy
 * inline link. Default category 'contact' / destination 'whatsapp'
 * apply to all current call sites.
 */
export function trackLead(params: {
  contentName: string;
  contentCategory?: string;
  destination?: string;
}): void {
  fire("Lead", {
    content_name: params.contentName,
    content_category: params.contentCategory ?? "contact",
    destination: params.destination ?? "whatsapp",
  });
}

/**
 * TODO(mollie): Fire on Mollie payment-success webhook callback once
 * online payment is wired in. The current "pay after the clean" model
 * has no online-payment moment to attach this to, so this must not be
 * called from the UI yet — leaving it defined so the call site is
 * obvious when Mollie lands.
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
