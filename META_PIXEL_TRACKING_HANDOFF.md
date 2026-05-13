# Meta Pixel Tracking — State of Play

**Status as of 13 May 2026** — after auditing the actual codebase.

> **Big correction to my earlier draft of this doc:** the pixel infrastructure is **already fully built**. Every Meta standard event is wired and firing at the right places. The reason Supermetrics shows zero conversions is **not** missing code — it's that every event is correctly **consent-gated for GDPR**, and most visitors don't accept marketing cookies.

---

## 1. What's already implemented (no changes needed)

`src/lib/pixel.ts` is the single source of truth. It exposes:

| Function | Standard event | Fires when |
|---|---|---|
| `trackPageView()` | `PageView` | On every route change (`PixelLoader.tsx`, watches `usePathname`) |
| `trackViewContent({ contentName })` | `ViewContent` | Every WhatsApp CTA click — hero, services, pricing, sticky bar, footer |
| `trackAddToCart()` | `AddToCart` | Rising edge of Step 1 being valid (postcode + service + frequency) — `app/book/page.tsx` |
| `trackInitiateCheckout()` | `InitiateCheckout` | Once when user reaches Step 3 (Review) — single-fire guarded |
| `trackCompleteRegistration({ contentName })` | `CompleteRegistration` | Step 3 confirm button (`Step3Review.tsx` + `MobileSummaryBar.tsx`) and the >155m² custom-quote WhatsApp link |
| `trackPurchase()` | `Purchase` | Only on `/thank-you` after Mollie confirms `isPaid === true` |

Every event funnels through one `fire()` function which contains the consent gate:

```ts
if (!hasMarketingConsent()) {
  // silent no-op — promise from /privacy §8
  return;
}
```

The Privacy Statement at `/privacy` (§8) explicitly promises *"Meta Pixel only with consent."* That gate is correct and legally required. **Do not remove it.**

---

## 2. The actual bottleneck

Pixel base script `fbevents.js` does not download until `hasMarketingConsent()` returns true. That's only true after a visitor clicks **"Accept all"** on the cookie banner (`CookieBanner.tsx`).

In NL/EU, typical "Accept all" rates on a balanced two-button banner are **30–45%**. For ExpatCleaners specifically that means: even if 100 expats click your WhatsApp ad, Meta will only see 30–45 of them fire any conversion event. **The other 55–70% are invisible to Meta's optimizer.**

That's exactly what Supermetrics showed:
- €483 spent over 30 days
- 50 add-to-carts tracked on the €299 "Stories - Feed – Copy" ad set
- Zero CompleteRegistrations on the four "Sales \| CompleteRegistration" ad sets
- Zero ViewContent so far on the new "Sales \| View content" campaign (created yesterday — very few users in there yet AND consent gate)

---

## 3. Changes just made (13 May 2026)

Surgical edits to add **per-surface `trackName` values** so when consenting users do click, Meta Events Manager can differentiate which CTA they came from. Before this, every CTA fired `content_name: "whatsapp_cta"` and we couldn't tell which ad-driven landing point converts.

| File | Change |
|---|---|
| `src/components/Hero.tsx` | Pass `trackName="whatsapp_hero"` to the hero `<WhatsAppButton>` |
| `src/components/FinalCTA.tsx` | Pass `trackName="whatsapp_final_cta"` |
| `src/components/Pricing.tsx` | Pass `trackName={`whatsapp_pricing_${plan.id}`}` → emits `whatsapp_pricing_oneoff` / `_biweekly` / `_weekly` |
| `src/components/Services.tsx` | Pass `trackName={`whatsapp_services_${card.id}`}` → emits `whatsapp_services_recurring` / `_oneoff` / `_deep` |

Already correctly tagged (no change needed):
- `Footer.tsx` → `whatsapp_footer`
- `StickyWhatsApp.tsx` → `whatsapp_sticky`
- `Step3Review.tsx` → `whatsapp_booking_confirmed`, `online_booking_confirmed`
- `MobileSummaryBar.tsx` → `whatsapp_booking_mobile`

Effect once these reach production: per-surface CPR breakdowns in Meta Events Manager → Custom Conversions, so Yuri can see *"hero WhatsApp clicks are €6 each but pricing WhatsApp clicks are €18"* and reallocate ad spend accordingly.

---

## 4. What's NOT being changed — and why

**The consent gate stays.** The Privacy Statement promise + GDPR Article 6/7 + the ePrivacy Directive together require it. Removing the gate would be a breach of statement and law — both meaningful exposure for a Dutch business.

**The cookie banner copy stays balanced.** Current copy:
> *"We use functional cookies to make the site work, and — only if you accept — Meta Pixel to measure our ads."*

The two-button design (Necessary only / Accept all) is GDPR-correct. We are **not** going to dark-pattern this — pre-checking, hiding the reject option, or using disabled-look styling on "Necessary only" all create regulator exposure that's larger than any tracking lift.

---

## 5. Real ways to actually move the needle (recommended next steps)

These are the legitimate paths that will give Meta more signal **without** breaking GDPR or the privacy statement.

### 5.1 Meta Conversions API (CAPI) — server-side path

The Pixel only fires browser-side, gated on consent. Meta also accepts the **same events server-side** via CAPI. CAPI for *consented* users gives Meta a redundant signal that survives ad-blockers, Safari ITP, and pixel timeouts. CAPI for *non-consented* users is still off-limits (GDPR applies to server-side too), but the lift from CAPI on consented users is usually 15–25% more matched conversions.

Implementation:
- Add `src/lib/pixel-server.ts` with the CAPI base call (POST to `https://graph.facebook.com/v18.0/{pixel_id}/events`)
- For each existing browser-side event, also call CAPI from the server when the user has consent
- Set `event_id` to a UUID and pass it on BOTH sides so Meta deduplicates (so we don't double-count)

Effort: ~4–6 hours of work. Highest-leverage item.

### 5.2 Offline conversion uploads — for the WhatsApp-only path

Most ExpatCleaners bookings end in WhatsApp without touching `/thank-you` (no Mollie payment). So `Purchase` never fires for them. But Meta accepts **Offline Conversions** — once Yuri confirms a booking, his backend can upload that conversion to Meta with the user's hashed phone number / email, and Meta matches it back to the original ad click.

This is legitimate-interest legal under GDPR (with hashed PII and proper disclosure). It's what Meta's own docs recommend for messaging-led funnels.

Implementation:
- New endpoint `src/app/api/meta-offline-conversion/route.ts`
- Triggered from whatever workflow Yuri uses to confirm bookings (WhatsApp manual reply → CRM → webhook)
- Sends `event_name: "Purchase"` or `"Lead"` with hashed `ph` / `em` matching keys

Effort: ~3 hours plus a manual or webhook trigger from booking confirmation.

### 5.3 Click-to-WhatsApp (CTWA) ads — pivot one campaign

Skip the pixel entirely for one test campaign. Meta tracks `messaging_conversation_started_7d` natively when users tap a CTWA ad. No consent, no pixel, no code — Meta sees the conversation directly from its own platform.

Implementation: Zero code. Meta Ads Manager → new campaign → Engagement / Messages objective → WhatsApp destination.

Effort: 20 minutes in Ads Manager. Lowest effort, highest immediate-signal payoff, but only for new campaigns.

### 5.4 Soft consent UX polish (optional, GDPR-safe)

The current cookie banner copy is correct but flat. A clearer "what's in it for you" line might lift consent by a few percentage points without crossing into dark-pattern territory. Suggested revision:

```diff
- We use functional cookies to make the site work, and — only if you
- accept — Meta Pixel to measure our ads. See our Privacy Statement.
+ We use functional cookies to keep the site working. With your
+ permission, we also let Meta know which ads bring expats to us so
+ we can keep the good ones running. No third-party resale.
+ See our Privacy Statement.
```

Effort: 5 minutes. Marginal but cheap.

---

## 6. Validation steps for Claude Code after deploying the trackName edits

1. Run `pnpm build` (or `npm run build`) — confirm no TS errors.
2. Open localhost, accept all cookies, open DevTools → Network → filter `facebook.com/tr`.
3. Click the hero WhatsApp button — should see one `ev=ViewContent` request with `content_name=whatsapp_hero`.
4. Repeat for the services card "Start a recurring plan" — should see `content_name=whatsapp_services_recurring`.
5. Same for pricing "Start weekly" — `whatsapp_pricing_weekly`.
6. Deploy. Wait 24h.
7. Open Meta Events Manager → ExpatCleaners pixel → Test Events. The new `content_name` values should appear in the right column. Spot-check 3 of them.
8. Once visible, create **Custom Conversions** in Meta Ads Manager keyed on each `content_name` — that's how Yuri sees per-surface CPR going forward.

---

## 7. Priority order for follow-up work

| Priority | Task | Effort | Lift |
|---|---|---|---|
| **P0 — ship now** | Today's `trackName` edits (already in code) | Done | Differentiated signal per surface |
| **P1 — this week** | Spin up one CTWA campaign in Ads Manager | 20 min | Native conversion signal, no consent gate |
| **P2 — this sprint** | Server-side CAPI for consented users (§5.1) | 4–6 hrs | +15–25% matched conversions |
| **P3 — this sprint** | Offline conversion uploads from WhatsApp confirmations (§5.2) | 3 hrs | Captures the unpaid bookings Meta otherwise can't see |
| **P4 — anytime** | Soft consent UX polish (§5.4) | 5 min | Small but real |

---

## 8. What was wrong in the earlier draft of this doc

The first draft of this file proposed building `lib/analytics/meta-pixel.ts` from scratch with `trackWhatsAppClick`, `trackBookingViewContent`, `trackBookingStep2`, etc. None of that was needed — those functions already exist under slightly different names in `lib/pixel.ts`. The draft was based on the live-site DOM inspection, not the actual codebase, so it missed the existing implementation. This version is correct.
