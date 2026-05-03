import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions — ExpatCleaners",
  description:
    "Terms and conditions for ExpatCleaners cleaning services in Amsterdam — bookings, pricing, cancellation, complaints, liability, governing law.",
  // Legal pages don't need to be social-shared. Suppress OG image so a
  // share preview falls back to the site default rather than carrying
  // the home OG photo against legal copy.
  openGraph: {
    title: "Terms & Conditions — ExpatCleaners",
    description:
      "Terms and conditions for ExpatCleaners cleaning services in Amsterdam.",
  },
};

// Small server-component section helper. Each section renders its
// numbered heading and a vertical-rhythm container for paragraphs and
// lists. Kept in this file (not extracted) because /privacy uses an
// identical helper of its own — copying once is cheaper than a shared
// component file with one consumer per page.
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 first:mt-10">
      <h2
        className="font-display text-[22px] leading-[1.2] tracking-[-0.01em] text-ink md:text-[26px]"
        style={{ fontWeight: 500 }}
      >
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-[1.7] text-ink md:text-[16px]">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <main className="bg-cream">
      <article className="mx-auto max-w-3xl px-6 py-20 md:px-8 md:py-28">
        {/* Eyebrow / page intro — keep tight, then breathe before the
            first numbered section. */}
        <p className="caption">Legal</p>
        <h1
          className="mt-4 font-display text-[36px] leading-[1.05] tracking-[-0.02em] text-ink md:text-[48px]"
          style={{ fontWeight: 400 }}
        >
          Terms &amp; Conditions
        </h1>

        <p className="mt-6 text-[15px] leading-[1.7] text-ink md:text-[16px]">
          <strong>ExpatCleaners</strong> · Amsterdam, the Netherlands
        </p>
        <p className="mt-1 text-[14px] leading-[1.7] text-stone">
          <strong>Effective from:</strong> 3 May 2026
          <br />
          <strong>Version:</strong> 1.0
        </p>

        <p className="mt-8 text-[15px] leading-[1.7] text-ink md:text-[16px]">
          These Terms &amp; Conditions apply to every booking made with
          ExpatCleaners through our website, WhatsApp, email, or any other
          channel. By confirming a booking you agree to these terms. Please
          read them carefully.
        </p>
        <p className="mt-3 text-[15px] leading-[1.7] text-ink md:text-[16px]">
          These terms are written in English for our international clients.
          Dutch law applies to all our agreements. A Dutch translation is
          available on request; in the event of any discrepancy between the
          English and Dutch versions, the Dutch version prevails.
        </p>

        <Section title="1. Who we are">
          <p>
            ExpatCleaners is a sole proprietorship operated by Yuri Kisman,
            registered with the Dutch Chamber of Commerce (KvK) under number
            94002185, BTW NL005057342B81, based in Amsterdam, the
            Netherlands.
          </p>
          <p>
            Contact:{" "}
            <a
              href="mailto:hello@expat-cleaners.com"
              className="link-underline text-ink"
            >
              hello@expat-cleaners.com
            </a>{" "}
            · WhatsApp{" "}
            <a
              href="tel:+31644683837"
              className="link-underline text-ink"
            >
              +31 6 44 68 38 37
            </a>
          </p>
          <p>
            Throughout these terms, &ldquo;we&rdquo;, &ldquo;us&rdquo; and
            &ldquo;ExpatCleaners&rdquo; refer to the business above.
            &ldquo;You&rdquo; and &ldquo;Client&rdquo; refer to the person
            making the booking.
          </p>
        </Section>

        <Section title="2. What we do">
          <p>
            We arrange residential and small commercial cleaning services in
            Amsterdam. The actual cleaning is carried out either by cleaners
            we directly engage, or by a qualified cleaning company we
            subcontract to. In all cases ExpatCleaners is your point of
            contact and is responsible for the result.
          </p>
        </Section>

        <Section title="3. Bookings">
          <p>
            <strong>3.1</strong> A booking becomes a binding agreement once
            we confirm it in writing — by WhatsApp, email, or via our online
            booking flow with payment confirmed.
          </p>
          <p>
            <strong>3.2</strong> The price shown in our booking flow is an
            estimate based on home size, number of rooms, and the services
            you select. The final amount is calculated on the time we
            actually work, plus any agreed add-ons.
          </p>
          <p>
            <strong>3.3</strong> Before the first clean we ask you to share:
            full address, access instructions, key arrangements, household
            specifics (pets, allergies, fragile or valuable items), and any
            preferences. Incomplete information may affect the result and
            the time required.
          </p>
        </Section>

        <Section title="4. Pricing and VAT">
          <p>
            <strong>4.1</strong> All prices on our website and in our
            booking flow are in euros and include 21% Dutch VAT (BTW),
            unless explicitly stated otherwise.
          </p>
          <p>
            <strong>4.2</strong> Hourly rates apply to time worked at your
            location, rounded to the nearest 15 minutes with a minimum
            visit duration as stated for each service.
          </p>
          <p>
            <strong>4.3</strong> We may adjust our rates with at least 30
            days&rsquo; written notice. Recurring clients are not affected
            mid-cycle by adjustments — new rates apply from the next
            billing period after the notice.
          </p>
          <p>
            <strong>4.4</strong> Optional add-ons (such as inside-oven
            cleaning, balcony, ironing) are charged in addition to the
            hourly rate. Add-on prices are listed in our booking flow.
          </p>
        </Section>

        <Section title="5. Payment">
          <p>
            <strong>5.1</strong> For one-off bookings, payment is made
            online via Mollie at the time of booking, or by bank transfer
            within 14 days after the clean if agreed in advance.
          </p>
          <p>
            <strong>5.2</strong> For recurring bookings (weekly, biweekly,
            monthly), we send an invoice after each clean or monthly,
            payable within 14 days.
          </p>
          <p>
            <strong>5.3</strong> If the actual time worked differs from the
            estimate, we adjust the final invoice accordingly and inform
            you before charging. We never charge more than 25% above the
            original estimate without your explicit agreement.
          </p>
          <p>
            <strong>5.4</strong> Late payments incur statutory interest
            under Dutch law (wettelijke rente) plus collection costs in
            accordance with the Dutch Consumer Collection Costs Act (Wet
            incassokosten).
          </p>
        </Section>

        <Section title="6. Cancellation and rescheduling">
          <p>
            <strong>6.1</strong> You may cancel or reschedule a booked
            clean free of charge up to 48 hours before the agreed start
            time.
          </p>
          <p>
            <strong>6.2</strong> Cancellation or rescheduling between 48
            and 24 hours before the start time: 50% of the estimated price
            is charged.
          </p>
          <p>
            <strong>6.3</strong> Cancellation or rescheduling within 24
            hours, or inability for our cleaner to access the home at the
            agreed time: 100% of the estimated price is charged.
          </p>
          <p>
            <strong>6.4</strong> Recurring bookings can be paused or
            cancelled at any time with 14 days&rsquo; written notice
            (WhatsApp or email). No early-termination fee applies.
          </p>
          <p>
            <strong>6.5</strong> If we have to cancel — for example due to
            cleaner illness without short-term replacement, extreme
            weather, or other circumstances beyond our control — we inform
            you as soon as possible and reschedule without charge.
          </p>
        </Section>

        <Section title="7. Withdrawal right (statutory cooling-off period)">
          <p>
            <strong>7.1</strong> Under Dutch and EU consumer law, consumers
            have a 14-day right of withdrawal for services booked at a
            distance. By requesting that the cleaning is carried out within
            14 days of booking, you expressly agree that you waive this
            right of withdrawal once the service has been fully performed
            (Article 6:230p sub d Dutch Civil Code).
          </p>
          <p>
            <strong>7.2</strong> If the cleaning has not yet started, you
            may withdraw within 14 days at no cost. If the cleaning has
            started but is not complete, you owe a proportional amount for
            the work already done.
          </p>
        </Section>

        <Section title="8. Performance and quality">
          <p>
            <strong>8.1</strong> We commit to delivering high-quality
            cleaning, on time, by trained cleaners using safe, effective
            products.
          </p>
          <p>
            <strong>8.2</strong> Where requested, we use organic,
            plant-derived cleaning products. If you have specific allergies
            or product preferences, please tell us in advance.
          </p>
          <p>
            <strong>8.3</strong> We may rotate cleaners when operationally
            necessary (illness, holidays, scheduling). Recurring clients
            receive a regular cleaner wherever practical.
          </p>
          <p>
            <strong>8.4</strong> You agree to provide a safe working
            environment: working ventilation, water and electricity, no
            aggressive pets unattended in the working area, and access to
            the rooms to be cleaned.
          </p>
        </Section>

        <Section title="9. Complaints">
          <p>
            <strong>9.1</strong> If you are not satisfied, please tell us
            within 24 hours after the clean, by WhatsApp or email, with a
            brief description and (where possible) photographs.
          </p>
          <p>
            <strong>9.2</strong> We will offer a free re-clean of the
            affected areas within 48 hours of a justified complaint. While
            we are willing and able to re-clean, no other right to refund
            or discount applies.
          </p>
          <p>
            <strong>9.3</strong> Complaints made later than 24 hours are
            not accepted, except for damage that could not reasonably have
            been discovered earlier (such as concealed water leaks).
          </p>
        </Section>

        <Section title="10. Liability">
          <p>
            <strong>10.1</strong> We are liable only for direct damage
            caused by an attributable failure on our part.
          </p>
          <p>
            <strong>10.2</strong> Our liability in any case is limited to
            the amount paid out in the relevant case under our business
            liability insurance (AVB), plus the deductible. If for any
            reason no insurance payout is made, our liability is limited to
            the invoiced amount of the three months preceding the incident,
            with an absolute maximum of € 2,500.
          </p>
          <p>
            <strong>10.3</strong> We are not liable for: (a) damage to
            fragile, antique, or particularly valuable items not disclosed
            to us in writing in advance; (b) damage caused by defects in
            the home or its installations (e.g. failing taps, weak shelves,
            loose tiles); (c) indirect or consequential damage, lost
            profit, or non-material damage; (d) any damage where you have
            failed to provide a safe working environment.
          </p>
          <p>
            <strong>10.4</strong> Please disclose, before the clean, any
            items requiring special care, and store irreplaceable valuables
            securely.
          </p>
        </Section>

        <Section title="11. Keys and access">
          <p>
            <strong>11.1</strong> Where you provide us with keys, we store
            them numbered and separately from address data.
          </p>
          <p>
            <strong>11.2</strong> We are not liable for the loss or damage
            of keys, except in cases of intent or gross negligence on our
            part.
          </p>
          <p>
            <strong>11.3</strong> You are responsible for ensuring access
            at the agreed time. If access is not possible, the booking is
            treated under article 6.3.
          </p>
        </Section>

        <Section title="12. Confidentiality">
          <p>
            Our cleaners, employees and subcontractors are bound to strict
            confidentiality regarding everything they observe in and around
            your home. This obligation continues after the end of our
            agreement.
          </p>
        </Section>

        <Section title="13. Privacy">
          <p>
            Personal data is processed in accordance with the GDPR and our
            Privacy Statement, available at{" "}
            <Link href="/privacy" className="link-underline text-ink">
              expat-cleaners.com/privacy
            </Link>
            .
          </p>
        </Section>

        <Section title="14. Force majeure">
          <p>
            We are not liable for failure to perform when prevented by
            force majeure, including without limitation: cleaner illness
            without short-term replacement, extreme weather, public health
            emergencies, transport disruption, or government measures. In
            such cases we reschedule at the earliest reasonable
            opportunity, at no extra charge.
          </p>
        </Section>

        <Section title="15. Changes to these terms">
          <p>
            We may update these terms from time to time. The version
            effective on the date you make a booking applies to that
            booking. Significant changes to recurring agreements will be
            communicated to you with at least 30 days&rsquo; notice.
          </p>
        </Section>

        <Section title="16. Governing law and disputes">
          <p>
            <strong>16.1</strong> Dutch law applies exclusively to all our
            agreements.
          </p>
          <p>
            <strong>16.2</strong> Disputes that cannot be resolved between
            us are submitted exclusively to the competent court in
            Amsterdam.
          </p>
          <p>
            <strong>16.3</strong> Consumers have the right to refer
            cross-border online disputes to the European Commission&rsquo;s
            Online Dispute Resolution platform:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-ink"
            >
              ec.europa.eu/consumers/odr
            </a>
            .
          </p>
        </Section>

        <p className="mt-12 text-[15px] leading-[1.7] text-ink md:text-[16px]">
          <strong>Questions about these terms?</strong> Contact us at{" "}
          <a
            href="mailto:hello@expat-cleaners.com"
            className="link-underline text-ink"
          >
            hello@expat-cleaners.com
          </a>{" "}
          or via WhatsApp{" "}
          <a href="tel:+31644683837" className="link-underline text-ink">
            +31 6 44 68 38 37
          </a>
          .
        </p>

        {/* Spec-required footer line — single source of truth across
            both legal pages. Keep wording identical to /privacy. */}
        <p className="mt-12 border-t border-stone/20 pt-6 text-[13px] leading-[1.7] text-stone">
          Last updated: 3 May 2026. For questions, contact{" "}
          <a
            href="mailto:hello@expat-cleaners.com"
            className="underline-offset-4 hover:text-ink hover:underline"
          >
            hello@expat-cleaners.com
          </a>{" "}
          or WhatsApp{" "}
          <a
            href="tel:+31644683837"
            className="underline-offset-4 hover:text-ink hover:underline"
          >
            +31 6 44 68 38 37
          </a>
          .
        </p>
      </article>
    </main>
  );
}
