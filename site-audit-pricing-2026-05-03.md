# Site audit — expat-cleaners.com — 2026-05-03

Read-only audit of all pricing and pricing-adjacent content. No edits made, no forms submitted.

**Scope of site (verified):** Only two pages exist publicly — `/` (homepage) and `/book` (booking flow). Header links labelled "Services / Pricing / Reviews" are anchor scrolls on the homepage (`/#services`, `/#pricing`, `/#reviews`), not separate pages. There is no `/pricing`, `/faq`, `/about`, `/why-us`, `/terms`, `/algemene-voorwaarden`, `/sitemap.xml`, or `/robots.txt` (all return the Next.js 404). No Dutch language version exists — site is English only, `<html lang="en">`, no `hreflang` tags.

---

## Section 1 — Page-by-page inventory

### Page: `/` (Homepage) — Hero

- **Trust strip (uppercase, above the H1)**
  - Type: small uppercase paragraph / kicker
  - Location: top of hero, above the H1
  - Current text: `"AMSTERDAM · ENGLISH-FIRST · ORGANIC"`
  - Notes: not pricing, but framing the offer.

- **Hero subhead — contains a price**
  - Type: paragraph under H1
  - Location: hero, directly under "Your Amsterdam apartment, cleaned properly."
  - Current text: `"English-speaking cleaners. Organic products. Booked on WhatsApp in 60 seconds. From €36/hr."`
  - Surrounding context: Sits between the H1 ("Your Amsterdam apartment, cleaned properly.") and the WhatsApp / "Or book online →" CTAs.
  - Notes: Anchors the entire pricing promise to **€36/hr** — which is the *lowest* (weekly recurring) rate, not the entry rate a one-off customer actually pays.

- **Social-proof line (no price, but pricing-adjacent trust)**
  - Type: small paragraph
  - Location: directly under the CTAs in the hero
  - Current text: `"4.9 on Google · 200+ Amsterdam expats · Same cleaner, every time"`

- **Trust-bar strip below hero**
  - Type: 4-column trust strip (icons + label + sub-label)
  - Location: just under the hero
  - Verbatim items:
    - `"Trusted by 200+ expats in Oud-West, Jordaan, De Pijp & Watergraafsmeer · ★ 4.9 on Google"`
    - `"Fully insured" / "Every clean covered"`
    - `"KvK 94002185" / "Registered in NL"`
    - `"Bio-certified" / "Plant-derived products"`
    - `"4.9 on Google" / "200+ Amsterdam reviews"`
  - Notes: Trust signals near (but above) the pricing block. No mention of VOG screening, no mention of insurance amount, no satisfaction / re-clean / money-back guarantee anywhere on site.

### Page: `/` — `SERVICES` section (`#services`)

Contains three service cards, each with a price phrase **and** a WhatsApp CTA. These are the first prices the eye lands on after the hero.

- **Service card 1 — Recurring cleaning**
  - Type: card with H3 + price line + paragraph + button
  - Location: services grid, card 1 of 3
  - Current text:
    - H3: `"Recurring cleaning"`
    - Price line: `"From €36/hr · same cleaner every time"`
    - Body: `"Weekly or bi-weekly, same cleaner each time. Organic supplies included."`
    - Button: `"Start a recurring plan"` → `wa.me/31644683837?text=Hi!%20I'd%20like%20to%20set%20up%20a%20recurring%20clean.`
  - Notes: Price is "From €36/hr" — implies the cheapest band (weekly). Bi-weekly is actually €40/hr; that nuance is invisible here.

- **Service card 2 — One-off cleaning**
  - Type: card with H3 + price line + paragraph + button
  - Location: services grid, card 2 of 3
  - Current text:
    - H3: `"One-off cleaning"`
    - Price line: `"€44/hr · no commitment"`
    - Body: `"For a single reset — before guests, after a party, when the week got away from you."`
    - Button: `"Book a one-off"` → WhatsApp deep link
  - Notes: Note inconsistent prefix style — this card uses bare `"€44/hr"` while card 1 uses `"From €36/hr"` and card 3 uses `"€44/hr · min. 3 hours"`. Recommend picking one pattern.

- **Service card 3 — Deep clean**
  - Type: card with H3 + price line + paragraph + button
  - Location: services grid, card 3 of 3
  - Current text:
    - H3: `"Deep clean"`
    - Price line: `"€44/hr · min. 3 hours"`
    - Body: `"Inside appliances, skirting boards, behind the things no one ever reaches."`
    - Button: `"Book a deep clean"` → WhatsApp deep link
  - Notes: Only place on the *homepage* where minimum visit duration is explicitly stated as "min. 3 hours". The 2-hour minimum on Regular / One-off is mentioned only inside the Pricing block, not the Services block.

- **End-of-tenancy footnote (no posted price)**
  - Type: paragraph under the services grid with inline link
  - Current text: `"Moving out? We do end-of-tenancy cleans to landlord standard. Request a quote →"`
  - CTA href: `wa.me/31644683837?text=Hi!%20I'd%20like%20a%20quote%20for%20an%20end-of-tenancy%20clean.`
  - Notes: No price shown. Contradicts the booking flow, which lists Move-out cleaning at "From €44/hr · min 3h" with a *Move-out package estimate of €226* on the bundle picker. This is a **conflict**: homepage says "request a quote", booking page actually shows a number.

### Page: `/` — `WHY EXPATCLEANERS` section

No prices. Four-column copy block. Captured for trust-signal context near pricing:

- `"NO DUTCH REQUIRED"` — "Every cleaner speaks English fluently. No translation app, no awkward miscommunication, no callbacks you can't follow."
- `"ORGANIC, BY DEFAULT"` — "Bio-certified, plant-derived products from European makers. Safe for kids, pets, and the surfaces you touch every day."
- `"THE SAME CLEANER, EVERY TIME"` — "Recurring clients get a dedicated cleaner. They learn your home, your preferences, your schedule."
- `"WHATSAPP, NOT FORMS"` — "Booking, rescheduling, special requests — all on the chat you're already using all day."

Notes: No VOG mention, no insurance amount, no money-back / deposit-back / satisfaction guarantee, no eco-certification body named.

### Page: `/` — `PRICING` section (`#pricing`)

This is the canonical pricing block on the public site. It uses three vertical cards.

- **Pricing-section eyebrow + H2 + sub-paragraph**
  - Eyebrow: `"PRICING"`
  - H2: `"Simple pricing. No surprises."`
  - Sub: `"Organic bio cleaning products included in every clean — no extra charge."`
  - Notes: The "No surprises" promise is undermined by the booking-flow math (see Section 3) and by all the un-priced add-ons (see booking-flow add-on list).

- **Pricing card 1 of 3 — One-off**
  - Heading: `"One-off"`
  - Price: `"€44 /hr"`
  - Sub-line: `"From €88 per clean · 2-hour minimum"`
  - Body: `"Book when you need it. No commitment."`
  - CTA: green WhatsApp pill `"Book a one-off"`

- **Pricing card 2 of 3 — Bi-weekly**
  - Heading: `"Bi-weekly"`
  - Price: `"€40 /hr"`
  - Sub-line: `"From €80 per clean · 2-hour minimum"`
  - Body: `"Every two weeks. Same cleaner."`
  - CTA: green WhatsApp pill `"Start bi-weekly"`

- **Pricing card 3 of 3 — Weekly (badge: "MOST CHOSEN")**
  - Badge above card: `"MOST CHOSEN"`
  - Heading: `"Weekly"`
  - Price: `"€36 /hr"`
  - Sub-line: `"From €72 per clean · 2-hour minimum"`
  - Body: `"Best value. Same cleaner. Organic supplies included."`
  - CTA: green WhatsApp pill `"Start weekly"`

- **Cancellation footnote under cards**
  - Type: small centred paragraph below the three cards
  - Current text: `"Cancel any recurring plan anytime."`
  - Notes: This is **the only cancellation statement on the entire public site**. There is no fee, no notice period, no "cancel by X hours before" language anywhere — not in the booking flow, not in a T&Cs page (none exists), not in the footer.

- **Closing CTA block (under pricing)**
  - H2: `"Two minutes on WhatsApp. Your Sundays back."`
  - Buttons: `"Message us on WhatsApp"` and `"Or book online →"`

### Page: `/` — Footer

- **Footer description**
  - Current text: `"English-speaking cleaners. Organic products. Booked on WhatsApp. Amsterdam."`
  - Notes: No price mentioned in the footer copy itself.

- **Footer SERVICES column** — four links, **all of them point to the same `/book` URL**
  - `"Recurring"` → `/book`
  - `"One-off"` → `/book`
  - `"Deep clean"` → `/book`
  - `"End of tenancy"` → `/book`
  - Notes: There are no service-specific landing pages. The links don't deep-link into pre-selected services on `/book` either — they all open the bundle picker on Step 1 with nothing chosen.

- **Footer CONTACT column**
  - `"WhatsApp"` (links to `wa.me/31644683837`)
  - `"hello@expat-cleaners.com"` (mailto)
  - `"Amsterdam, Netherlands"`

- **Footer legal line**
  - Current text: `"© 2026 ExpatCleaners"` and `"KvK 94002185 · BTW NL005057342B81"`
  - Notes: This is the only place "BTW" appears on the entire site. There is no statement anywhere about whether prices are inclusive or exclusive of BTW. For Dutch consumer cleaning of private homes the rate is 21% (huishoudelijke schoonmaak is not in the 9% list), so "incl. BTW" must be made explicit if the displayed prices are gross — which they should be for B2C. Currently ambiguous and a legal exposure.

### Page: `/book` — pricing & pricing-adjacent

The booking flow is a 3-step form. Captured below as an inventory; full step-by-step walkthrough is in Section 2.

- **Page H1 + sub**
  - Eyebrow: `"BOOK A CLEAN"`
  - H1: `"Three steps. Then WhatsApp."`
  - Sub: `"Tell us about your home, pick a time, confirm. A human will reply on WhatsApp within 15 minutes."`

- **Step indicator**
  - `01 Home & service`, `02 Timing`, `03 Review`

- **Bundle picker (Step 1, top)**
  - H3: `"Pick a bundle to get started."`
  - Sub: `"Most clients fit one of these. You can adjust anything once selected."`

- **Bundle 1 — First-time reset**
  - Includes (verbatim): `"Deep clean — every corner / Inside oven / Inside fridge"`
  - Price line: `"From €182 est."`
  - Sub-text: `"Live total updates after you select."`
  - Buttons: `Select` / `Customize`
  - Notes: €182 is *not* derivable from the visible hourly grid (€44/hr × 3h = €132 + €30 oven + €20 fridge = €182). So the bundle is essentially "Deep clean 3h + oven + fridge" — but that derivation is not shown to the user. Looks expensive next to the headline "From €36/hr".

- **Bundle 2 — Recurring essentials**
  - Includes: `"Weekly regular clean / Inside windows / Bathroom mould treatment"`
  - Price: `"From €132 est."`
  - Notes: 2h Regular @ €36/hr weekly = €74.80 (per booking flow math — see Section 3) + windows (€10 each, count unspecified) + bathroom mould (€50). Math doesn't reconcile cleanly — €132 ≠ 74.80 + 10 + 50 = €134.80. Off by €2.80. Likely a stale hardcoded estimate.

- **Bundle 3 — Move-out package**
  - Includes: `"Move-out clean — deposit-back standard / Inside windows + cabinets / Wall wipe-down"`
  - Price: `"From €226 est."`
  - Notes: First and only mention of the phrase **"deposit-back standard"** anywhere on the site outside the bundle's Step-1 alt text. There is no separate page or proof point for what "deposit-back" actually guarantees.

- **All-services list (revealed by clicking "I know what I need — show all services")**
  - **MOST POPULAR** row (3 cards):
    - `"Regular cleaning / Standard home maintenance / From €44/hr · min 2h"`
    - `"Deep cleaning / Every corner, every crevice / From €44/hr · min 3h"`
    - `"Move-out cleaning / Deposit-back standard / From €44/hr · min 3h"`
  - **More services** row (revealed by tap, 4 cards):
    - `"Move-in cleaning / Fresh-start ready / From €44/hr · min 3h"`
    - `"Airbnb turnover / Guest-ready reset / From €44/hr · min 2h"`
    - `"Office cleaning / Workspace hygiene / From €44/hr · min 2h"`
    - `"After-builders / Post-renovation reset / From €44/hr · min 4h"`
  - Notes: **Every** service starts at €44/hr in the booking flow — even the ones that look like recurring candidates (Regular, Office). The €36 / €40 prices only appear after the customer also picks a frequency (Bi-weekly / Weekly) further down. So a first-time visitor coming straight to `/book` sees only "From €44/hr" everywhere — directly contradicting the homepage's headline of **"From €36/hr."**

- **"Not sure which to pick?" expandable**
  - Body verbatim:
    - `"Regular — your home is mostly tidy and you just want someone to keep on top of it."`
    - `"Deep clean— skirting boards, inside appliances, things nobody's touched in a while. Once or twice a year."` (note: missing space between "clean" and the em-dash)
    - `"Move-in / move-out — either picking up the keys or handing them back. Deposit-back standard."`

- **Home specifics**
  - Postcode field, helper: `"4 digits + 2 letters. Example: 1012 AB."`
  - `"Bedrooms"` stepper, helper: `"Count studios as 0 and lofts as 1"`
  - `"Bathrooms"` stepper
  - `"Approximate size"` field, helper: `"m² — drives the time estimate. Homes ≥ 156m² get a custom WhatsApp quote."` — this is a **soft cap** that defines a price boundary; it deserves to be mentioned somewhere on the homepage too.
  - Property-type pills: `"Apartment / House / Studio"`

- **Extras → Supplies**
  - Tag: `"INCLUDED"`
  - Body: `"Organic bio cleaning products included in every clean — no extra charge."`
  - Body: `"We estimate hours based on your home size. You only pay for the time we work — final price confirmed on arrival."` ← **important undisclosed-elsewhere policy**: the price shown on screen is only an estimate, the *actual* charge is "time we work". This is a material consumer-pricing disclosure that should also appear on the homepage and in T&Cs.
  - Note: `"No vacuum at home? Add ours below."` followed by `"Bring our vacuum +€50"` toggle.

- **Extras → Add-ons grid (14 add-ons, prices visible only inside the booking flow)**
  - `Inside oven +€30 each`
  - `Inside fridge +€20 each`
  - `Inside dishwasher +€20 each`
  - `Inside microwave +€20 each`
  - `Inside cabinets +€10 each`
  - `Inside windows +€10 each`
  - `Blinds +€20 each`
  - `Balcony +€40 each`
  - `In-house laundry +€30 each`
  - `Ironing +€25 each`
  - `Wall wipe-down +€30 each`
  - `Stairs +€20 each`
  - `Bathroom mould treatment +€50 each`
  - `Organisation +€30 each`
  - Notes: None of these appear on the homepage. Buyers can't compare without entering the flow, which damages the "Simple pricing. No surprises." promise.

- **Frequency picker — `"How often?"`**
  - `One-time / No commitment / €44/hr`
  - `Bi-weekly / −10% / Save 10% · €40/hr / €40/hr`
  - `Weekly / BEST VALUE badge / −15% / Save 15% · €36/hr · Best value / €36/hr`
  - Notes: The **discount logic in the running summary** doesn't match the rate shown on the card — see Section 3.

- **Right-rail booking summary (persistent on Steps 1 & 2)**
  - `"Your booking"`
  - `"Select a service to see your estimate."` (initial state)
  - Then: `"Regular cleaning / 2h estimate · 1 bed / 1 bath / €88"` then below `"Estimated total / €88"`
  - On bi-weekly: shows strikethrough €88, new €79.20, line item `"Bi-weekly discount −€8.80"`, `"Estimated total €79.20"`
  - On weekly: shows strikethrough €88, new €74.80, line item `"Weekly discount −€13.20"`, `"Estimated total €74.80"`
  - Footnote: `"✓ Organic bio cleaning products included in every clean — no extra charge."`
  - Footnote: `"Estimate confirmed before the clean. Secure online checkout via Mollie."`
  - Link: `"Prefer WhatsApp? Message us instead"`

### Page: `/book` — Step 2 (Timing)

- **Header**
  - H2: `"When works for you?"`
  - Sub: `"Pick a preferred date and time window. We'll confirm exact availability on WhatsApp."`

- **Calendar (May 2026 in test)**
  - Inline legend: `"● Fully booked — join the waiting list"`
  - Some dates marked with a dot indicating fully booked.

- **Selected fully-booked-day inline panel**
  - Heading: `"That day's fully booked."`
  - Body: `"Join the waiting list — we'll message you the moment a slot opens."`
  - Field: `"Preferred time"` with chips `09:00 / 12:00 / 14:00 / 16:00`
  - Field: `"Anything else we should know? (optional)"`
  - Button: `"Join waiting list"`

- **Preferred-time chips (on an available day)**: `09:00 / 12:00 / 14:00 / 16:00` — only 4 windows; no late-afternoon / evening / weekend distinction. Pricing is *not* time-dependent (no surcharge for evenings/weekends mentioned anywhere).

- **Notes block**
  - H3: `"Anything we should know?"`
  - Sub: `"Split what the cleaner needs to know from how to get in. Both optional."`
  - Field: `"Notes for your cleaner"` (placeholder: "Allergies, pets, preferences, anything worth knowing…")
  - Field: `"Access instructions"` (placeholder: "Buzzer, key lockbox, doorman, entry code…")

### Page: `/book` — Step 3 (Review)

- **Heading**: `"Your slot is available."`
- **Sub**: `"We'll confirm the exact cleaner on WhatsApp."`

- **Contact form**
  - H3: `"Your contact"`
  - Sub: `"So we can confirm on WhatsApp. We never call unprompted."`
  - Fields: `"Full name *"` and `"Phone *"` with helper `"Enter a valid phone number"`
  - Notes: **No email field.** Whole booking is confirmed by phone/WhatsApp only. There is no order-confirmation email, no receipt path, no privacy-policy checkbox, no terms-acceptance checkbox.

- **Summary table** (all displayed values from my test session)
  - Service: Regular cleaning
  - Frequency: Bi-weekly
  - Home: 1 bed · 1 bath · apartment
  - Estimated hours: 2h
  - Estimated price: **€79.20**
  - Preferred date: **2026-05-10** (I clicked **May 11** — see timezone bug in Section 5)
  - Preferred time: 09:00
  - Postcode: 1012 AB

- **Conversion strip (above the buttons)**
  - Verbatim: `"Estimate confirmed before the clean. Pay securely online to lock in your slot."`
  - Notes: This *contradicts* the right-rail copy on Steps 1 & 2 which says `"Estimate confirmed before the clean. Secure online checkout via Mollie."` Same intent, two different wordings — pick one and use it everywhere.

- **Two CTAs**
  - Primary: `"Send booking on WhatsApp ↗"` — opens WhatsApp with a pre-filled message:
    `"Hey ExpatCleaners — I'd like to book: - Regular cleaning · 2h · Bi-weekly - Preferred: 2026-05-10 09:00 Total estimate: €79.20"`
  - Secondary: `"Pay now & reserve"` (with a card icon)
  - Below: `"We confirm availability on WhatsApp first. Your slot is reserved after secure payment."`
  - Notes: Both CTAs require Name + Phone before activating. I did not click "Pay now & reserve" — flagging that the actual Mollie checkout state is *not verified* in this audit.

- **Back link**: `"← Back to timing"`

---

## Section 2 — Booking flow walkthrough

Visited `/book` and clicked through without submitting. URL never changes — the whole flow is a single-page React state machine (no `?step=2` query, no `/book/step-2` route).

**Step 1 — Home & service** (initial state):
1. Customer sees H1 "Three steps. Then WhatsApp." and a 3-bundle quick picker (First-time reset €182, Recurring essentials €132, Move-out package €226). Right rail: empty estimate panel.
2. Below the bundle picker, a link `"I know what I need — show all services"` reveals: Postcode field, Service grid (3 most-popular + 4 hidden under "More services"), Home specifics (bedrooms, bathrooms, m², property type), Extras (vacuum +€50, then 14 add-ons), then Frequency.
3. Selecting a service immediately populates the right-rail estimate. Example: Regular cleaning + 1 bed + 1 bath + 2h default → "Regular cleaning · 2h estimate · 1 bed / 1 bath · €88. Estimated total €88."
4. Selecting Bi-weekly shows: strikethrough €88, new €79.20, line item "Bi-weekly discount −€8.80", "Estimated total €79.20".
5. Selecting Weekly shows: strikethrough €88, new €74.80, line item "Weekly discount −€13.20", "Estimated total €74.80".
6. Postcode is required to proceed. Bottom bar: `"Back"` (greyed) and `"Next →"`.

**Step 2 — Timing**:
1. H2 "When works for you?" + month-grid calendar (defaults to current month).
2. Dotted dates are "fully booked"; clicking one swaps the right column to a "That day's fully booked. Join the waiting list" panel with `"Preferred time"` chips and a notes textarea, plus a `"Join waiting list"` button. (This is a parallel flow — no payment here.)
3. Available dates expose `"Preferred time"` chips: `09:00 / 12:00 / 14:00 / 16:00`. No surcharge logic visible.
4. Optional `"Notes for your cleaner"` and `"Access instructions"` textareas.
5. Bottom bar: `"← Back"` and `"Review →"`.

**Step 3 — Review**:
1. Heading: "Your slot is available." with summary table (see Section 1).
2. Contact form — Name + Phone only. No email, no T&Cs checkbox.
3. Two CTAs side-by-side: WhatsApp (deep-links pre-filled message) and `"Pay now & reserve"`. The Mollie hand-off was not exercised.
4. Bottom: `"← Back to timing"`.

**Final price calculation logic visible to the customer**:
- The right rail shows: `<service base hourly × estimated hours> = subtotal` → if frequency is Bi-weekly or Weekly, a single discount line item is subtracted (10% or 15% respectively) → `Estimated total`.
- The hourly-rate cards in the frequency picker advertise €40 (bi-weekly) and €36 (weekly), but the discount is applied to the **€44 subtotal**, not to the displayed effective rate. So the actual effective rates are €39.60 and €37.40, *not* €40 and €36. See Section 3.

---

## Section 3 — Cross-page inconsistencies

1. **The "From €36/hr" headline is unreachable on a 2-hour weekly clean.**
   - Homepage Pricing card: `"Weekly · €36/hr · From €72 per clean · 2-hour minimum"` — implies 2 × €36 = €72.
   - Booking flow on the same selection: `"Estimated total €74.80"` (€88 × 0.85). Effective rate €37.40/hr.
   - Same problem on Bi-weekly: card says `"€40/hr · From €80 per clean"`; booking flow charges €79.20 (€88 × 0.90). Effective rate €39.60/hr.
   - Either change the cards to `"From €74.80 per clean"` / `"From €79.20 per clean"`, or change the discount math to `floor 2h subtotal at displayed effective rate × 2`. Right now the marketing and the calculator disagree.

2. **The hero says "From €36/hr"; the booking page says "From €44/hr" everywhere until you also pick a frequency.** A first-time visitor who lands on `/book` directly sees seven services all priced at "From €44/hr". The €36 only appears after they configure recurring frequency — which the homepage doesn't telegraph.

3. **End-of-tenancy is "request a quote" on the homepage but a real number in the booking flow.**
   - Homepage: `"Moving out? We do end-of-tenancy cleans to landlord standard. Request a quote →"`
   - Booking: `"Move-out cleaning · From €44/hr · min 3h"` and a `"Move-out package · From €226 est."` bundle.
   - Pick one stance.

4. **The phrase used for "deposit-back" appears in two places with no supporting detail.** Move-out package promises `"deposit-back standard"`; "Not sure which to pick?" expander says `"Deposit-back standard."` Nowhere is the standard defined, nor any guarantee terms. If this is a marketing claim it needs a backing statement; if it's a guarantee it needs T&Cs.

5. **Add-on prices are invisible outside the booking flow.** 14 add-ons (€10 to €50) only surface inside Step 1. The homepage promises "Simple pricing. No surprises" but adds a hidden price layer for anyone who needs an oven, windows, balcony, ironing, etc.

6. **"€44/hr · no commitment"** (homepage Services card) vs **"€44 /hr — From €88 per clean · 2-hour minimum"** (homepage Pricing card). Both refer to the one-off rate; only one of them states the 2-hour minimum. Promote the minimum to the Services card too (or accept it as the "no commitment" implication and standardise).

7. **Two different conversion-comfort lines on `/book`:**
   - Right rail: `"Estimate confirmed before the clean. Secure online checkout via Mollie."`
   - Step 3 conversion strip: `"Estimate confirmed before the clean. Pay securely online to lock in your slot."`
   - Same idea, different copy. Pick one.

8. **"Cancel any recurring plan anytime"** is the only cancellation statement on the entire site. There is no T&Cs page, no notice period, no late-cancel / lockout policy, no rescheduling rule. For a service that's booked into a cleaner's calendar, the absence of a cancellation/late-cancel fee policy is a real exposure.

9. **VAT/BTW handling is absent.** Site shows BTW number in the footer but never states whether the displayed rates are inclusive (gross) or exclusive (net) of BTW. For B2C cleaning of a private home in NL the rate is 21%; consumer law expects gross display. Add `"incl. BTW"` next to every price, or add a one-line note in the Pricing block.

10. **Bundle math doesn't quite add up for "Recurring essentials"** (€132 vs. derived ≈ €134.80). Likely a stale hardcoded number — verify and bring into sync with the calculator.

---

## Section 4 — NL vs EN inconsistencies

Not applicable. **There is no Dutch version.** `<html lang="en">`, no `hreflang` tags, no `/nl` route, no language switcher. If a Dutch version is on the roadmap, every pricing string in this audit will need a parallel NL copy.

---

## Section 5 — Technical observations

- **Platform / framework:** Custom build on **Next.js** (visible from `/_next/static/chunks/...` script paths and the absence of a CMS generator meta). Styling appears to be **Tailwind** (body classes `flex min-h-full flex-col bg-cream text-ink`). No WordPress, no Webflow, no Wix, no Squarespace, no Shopify. Booking calendar and add-on grid are React state, not a 3rd-party widget.
- **CMS:** None visible. **All pricing is hardcoded in the React/JSX source** (no `<meta name="generator">`, no `/admin`, no `/wp-admin`, no Webflow data attributes). Editing prices = editing component source and redeploying — there is no settings panel pulling these numbers from a database. Implication for your VS Code edits: every price is a string literal you'll search-and-replace; expect ~15 occurrences across the homepage `pricing` and `services` sections plus the `/book` service array, frequency-discount config, and add-on list. Centralising into a `pricing.ts` config object would eliminate 90% of future drift.
- **Image text:** None of the five hero/section images contain pricing or other promo copy as raster text. All prices are live HTML — no design-tool round-trip required.
- **Sitemap / robots:** `/sitemap.xml` and `/robots.txt` both 404. No SEO sitemap means Google has to discover `/book` via the homepage — fine for a 2-page site, but worth fixing.
- **i18n:** No `hreflang`, no `lang` switcher, no `/nl` namespace.
- **Analytics:** Meta Pixel installed (`facebook.net/signals/config/1941364749829024` and `fbevents.js`). No Google Analytics, GTM, Plausible, Fathom, or Mixpanel detected on the homepage. No conversion event firing visible at the WhatsApp / Pay step (could not verify without submitting).
- **Booking flow date bug:** I clicked **May 11** in the calendar; the Step 3 summary and the WhatsApp deep-link both encoded **2026-05-10**. Looks like the calendar is constructing the date as `new Date(year, month, day)` and then passing it through `toISOString()`, which UTC-shifts a CEST midnight back by one day. **Real customer impact:** wrong day on the cleaner's WhatsApp message and on the summary the customer reads. Fix this before any other pricing edit ships.
- **No email field in the contact form.** Step 3 captures only Name + Phone. There is no transactional email path, no order confirmation email, no GDPR-style "you can also reach us at" line. For a paid Mollie checkout this will leave you without a receipt-by-email and may cause issues for chargebacks/refund evidence.
- **No T&Cs or privacy checkbox** at checkout. There is no T&Cs page on the site. For a paid checkout (Mollie), Dutch consumer law (Boek 6 BW, herroepingsrecht / consumer rights, plus required service T&Cs for distance contracts) effectively requires you to make T&Cs available and obtain consent. Currently neither exists.
- **Footer SERVICES links all point to `/book`** with no `?service=...` deep link. The four labels (Recurring / One-off / Deep clean / End of tenancy) all open the same neutral bundle picker. Cheap improvement: pre-select the service in the URL.
- **`/sitemap.xml` and `/robots.txt`** both return the Next.js 404 boilerplate.
- **No 404 path was found broken** in this audit beyond the missing sitemap/robots — every linked page loaded.
- **Booking-flow CTA states are correctly disabled** until prerequisites are met (postcode required to advance Step 1; date+time required to advance Step 2; name+phone required to enable both Step 3 CTAs). This is the bright spot — UX of disabled-state validation is clean.

---

## Section 6 — Summary count

- **Total pricing elements found:** 47 distinct strings across the two pages (3 hero/meta, 6 service-card lines, 12 pricing-card lines, 3 service-page bundle prices, 7 booking-flow service rows, 3 frequency rows, 14 add-on rows, 1 vacuum extra, plus the booking-flow summary line).
- **Hourly rate mentions on user-facing copy:** 7 distinct surfaces — Hero subhead (€36), Recurring services card (€36), One-off services card (€44), Deep clean services card (€44), Pricing card €44 / €40 / €36, all `/book` service tiles (€44 × 7), frequency picker (€44 / €40 / €36), meta description and OG description (€36).
- **Fixed-package mentions:** 3 — First-time reset €182, Recurring essentials €132, Move-out package €226 (bundle picker only — never shown on the homepage).
- **Pages requiring edits:** 2 of 2 — `/` (homepage) and `/book`. Plus a *missing-page* recommendation: `/terms` (or at least an `Algemene Voorwaarden` linked from the footer) and a `/cancellation-policy` snippet.
- **Image-text edits needed:** 0 — all pricing is live HTML.
- **Booking-form edits needed:** ≥ 5 — (1) date timezone bug, (2) bundle math reconciliation for Recurring essentials, (3) add the email field at checkout, (4) add T&Cs / privacy consent checkbox, (5) reconcile rate-card-vs-discount-math on the frequency picker (or relabel cards to match the engine).
- **Cross-page inconsistencies:** 10 (Section 3, items 1–10).
- **NL vs EN inconsistencies:** 0 (no NL exists yet).
- **Footnote / policy gaps:** 4 — no cancellation policy beyond "anytime", no BTW disclosure, no satisfaction/deposit-back guarantee details, no T&Cs page.

---

## Quick-list of every verbatim price string on the public site

For your VS Code search-and-replace pass:

- `"From €36/hr"` — hero subhead, meta description, OG description, Recurring services card, Weekly pricing card price line.
- `"€44/hr · no commitment"` — One-off services card.
- `"€44/hr · min. 3 hours"` — Deep clean services card.
- `"€44 /hr"` — Pricing card 1 (One-off).
- `"€40 /hr"` — Pricing card 2 (Bi-weekly).
- `"€36 /hr"` — Pricing card 3 (Weekly).
- `"From €88 per clean · 2-hour minimum"` — Pricing card 1.
- `"From €80 per clean · 2-hour minimum"` — Pricing card 2.
- `"From €72 per clean · 2-hour minimum"` — Pricing card 3.
- `"From €182 est."` — `/book` First-time reset bundle.
- `"From €132 est."` — `/book` Recurring essentials bundle.
- `"From €226 est."` — `/book` Move-out package bundle.
- `"From €44/hr · min 2h"` — Regular, Airbnb, Office.
- `"From €44/hr · min 3h"` — Deep cleaning, Move-out, Move-in.
- `"From €44/hr · min 4h"` — After-builders.
- `"€44/hr"` / `"€40/hr"` / `"€36/hr"` — frequency picker.
- `"+€50"` — Bring our vacuum.
- `"+€30 each"` — oven, in-house laundry, wall wipe-down, organisation.
- `"+€20 each"` — fridge, dishwasher, microwave, blinds, stairs.
- `"+€10 each"` — inside cabinets, inside windows.
- `"+€40 each"` — balcony.
- `"+€25 each"` — ironing.
- `"+€50 each"` — bathroom mould treatment.
- `"Estimated total"` / `"Estimated price"` — both phrasings exist; consider unifying.

---

End of audit.
