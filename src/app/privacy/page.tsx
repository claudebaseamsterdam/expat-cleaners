import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Statement — ExpatCleaners",
  description:
    "How ExpatCleaners handles your personal data under the GDPR — what we collect, why, who we share it with, how long we keep it, and your rights.",
  openGraph: {
    title: "Privacy Statement — ExpatCleaners",
    description:
      "How ExpatCleaners handles your personal data under the GDPR.",
  },
};

// Same Section helper shape as /terms — copied (not shared) per the
// note in app/terms/page.tsx. Two consumers, one file each, no abstract.
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

export default function PrivacyPage() {
  return (
    <main className="bg-cream">
      <article className="mx-auto max-w-3xl px-6 py-20 md:px-8 md:py-28">
        <p className="caption">Legal</p>
        <h1
          className="mt-4 font-display text-[36px] leading-[1.05] tracking-[-0.02em] text-ink md:text-[48px]"
          style={{ fontWeight: 400 }}
        >
          Privacy Statement
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
          This Privacy Statement explains how ExpatCleaners handles your
          personal data. We take privacy seriously and process personal
          data only for the purposes described here, in accordance with the
          EU General Data Protection Regulation (GDPR) and the Dutch
          Implementation Act (UAVG).
        </p>
        <p className="mt-3 text-[15px] leading-[1.7] text-ink md:text-[16px]">
          This statement is written in English for our international
          clients. Dutch law applies. A Dutch translation is available on
          request.
        </p>

        <Section title="1. Who is responsible for your data">
          <p>
            ExpatCleaners is a sole proprietorship operated by Yuri Kisman,
            registered with the Dutch Chamber of Commerce (KvK) under
            number 94002185, BTW NL005057342B81, based in Amsterdam, the
            Netherlands.
          </p>
          <p>
            ExpatCleaners is the data controller within the meaning of
            Article 4(7) GDPR for the personal data described in this
            statement.
          </p>
          <p>
            We have not appointed a Data Protection Officer because we are
            not legally required to. For privacy matters, please contact us
            directly using the details above.
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
        </Section>

        <Section title="2. What personal data we process">
          <p>
            <strong>Identification data:</strong> name, email address,
            phone number, address, postcode.
          </p>
          <p>
            <strong>Booking data:</strong> service requested, date, time,
            frequency, home characteristics (size, number of rooms,
            property type), preferences.
          </p>
          <p>
            <strong>Communication data:</strong> messages and conversation
            history via WhatsApp, email, or our website.
          </p>
          <p>
            <strong>Payment data:</strong> transaction reference, IBAN
            where you pay by bank transfer, payment status. We do NOT
            receive or store credit card details — these are handled by
            Mollie (see section 5).
          </p>
          <p>
            <strong>Specific circumstances:</strong> information you choose
            to share about pets, allergies, accessibility, fragile items,
            or special requests.
          </p>
          <p>
            <strong>Website usage data:</strong> IP address, browser type,
            device type, pages visited, and behaviour on our website.
            Collected via Meta Pixel (see section 5) and standard server
            logs.
          </p>
        </Section>

        <Section title="3. Why we process your data">
          <ul className="list-disc space-y-2 pl-6">
            <li>To prepare and perform our cleaning services for you.</li>
            <li>
              To communicate with you about bookings, scheduling, quality
              and complaints.
            </li>
            <li>
              To process payments and keep proper accounting records.
            </li>
            <li>
              To comply with legal obligations, including the Dutch fiscal
              retention duty of 7 years.
            </li>
            <li>
              To improve our services and operations based on aggregated
              insights.
            </li>
            <li>
              To measure the effectiveness of our advertising on Meta
              platforms (Facebook, Instagram), where you have given consent
              for analytical and marketing cookies.
            </li>
          </ul>
        </Section>

        <Section title="4. Legal basis for processing">
          <p>
            <strong>Performance of the contract</strong> (Art. 6(1)(b)
            GDPR) — for delivering the cleaning service you booked.
          </p>
          <p>
            <strong>Legal obligation</strong> (Art. 6(1)(c) GDPR) — for
            tax, accounting and other statutory record-keeping
            requirements.
          </p>
          <p>
            <strong>Legitimate interest</strong> (Art. 6(1)(f) GDPR) — for
            service improvement, fraud prevention, and ensuring our
            business runs effectively. We balance this against your
            interests and use minimal data.
          </p>
          <p>
            <strong>Consent</strong> (Art. 6(1)(a) GDPR) — for analytical
            and marketing cookies (including Meta Pixel) and any direct
            marketing. You can withdraw consent at any time without
            affecting the lawfulness of prior processing.
          </p>
        </Section>

        <Section title="5. Who we share your data with">
          <p>
            We share personal data only with parties who help us deliver
            our service or whom we are legally required to share it with.
            These are our processors and recipients:
          </p>
          <p>
            <strong>Cleaning subcontractor(s):</strong> the cleaning
            company that delivers your clean. They receive only your
            address, access instructions, household specifics, and
            preferences — strictly what is needed to perform the work.
          </p>
          <p>
            <strong>Mollie B.V.</strong> (payment processor, Amsterdam, the
            Netherlands) — for processing online payments. Mollie receives
            transaction data; we do not see your card details. Mollie acts
            as an independent controller for payment data under PSD2
            obligations.
          </p>
          <p>
            <strong>Meta Platforms Ireland Ltd.</strong> (WhatsApp Business
            + Meta Pixel for advertising) — for messaging and, where you
            have consented, advertising effectiveness measurement. Meta
            processes data under their own terms and may transfer data
            outside the EEA under Standard Contractual Clauses.
          </p>
          <p>
            <strong>Our accountant</strong> — for bookkeeping and tax
            filings, bound by professional confidentiality.
          </p>
          <p>
            <strong>Hosting and email providers</strong> — our website host
            and email provider, who store data on EU servers under
            processor agreements.
          </p>
          <p>
            <strong>Dutch Tax Authority (Belastingdienst) and other public
            authorities</strong> — where required by law.
          </p>
          <p>We do not sell, rent, or trade your personal data.</p>
        </Section>

        <Section title="6. International transfers">
          <p>
            Where data is transferred outside the European Economic Area
            (EEA) — for example via WhatsApp / Meta — we rely on the
            European Commission&rsquo;s Standard Contractual Clauses (SCCs)
            or an adequacy decision. We minimise data shared outside the
            EEA wherever possible.
          </p>
        </Section>

        <Section title="7. How long we keep your data">
          <p>
            <strong>Booking data and correspondence:</strong> up to 24
            months after our last contact, then deleted or anonymised.
          </p>
          <p>
            <strong>Invoices and accounting records:</strong> 7 years
            (Dutch fiscal retention obligation, Art. 52 General State Taxes
            Act).
          </p>
          <p>
            <strong>Complaint files:</strong> 5 years after closure of the
            matter.
          </p>
          <p>
            <strong>Marketing and analytics consent records:</strong> 3
            years from last consent action.
          </p>
          <p>
            <strong>Website usage and cookie data:</strong> as set out in
            our cookie banner; typically 6–24 months depending on the
            cookie.
          </p>
        </Section>

        <Section title="8. Cookies and tracking">
          <p>
            Our website uses functional cookies (necessary for the booking
            flow) and, only with your consent, analytical and marketing
            cookies — including the Meta Pixel from Meta Platforms Ireland
            Ltd.
          </p>
          <p>
            The Meta Pixel allows us to measure the effectiveness of our
            advertising and to show you relevant ads on Facebook and
            Instagram. You can manage your cookie preferences via the
            cookie banner on our website at any time, and adjust your Meta
            ad preferences at{" "}
            <a
              href="https://www.facebook.com/adpreferences"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-ink"
            >
              facebook.com/adpreferences
            </a>
            .
          </p>
          <p>
            You can also block cookies in your browser settings. Doing so
            may affect website functionality.
          </p>
        </Section>

        <Section title="9. Your rights">
          <p>
            Under the GDPR you have the following rights regarding your
            personal data:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Right of access</strong> — to ask what personal data
              we hold about you.
            </li>
            <li>
              <strong>Right to rectification</strong> — to correct
              inaccurate data.
            </li>
            <li>
              <strong>Right to erasure</strong> — to ask us to delete your
              data, where applicable.
            </li>
            <li>
              <strong>Right to restriction</strong> — to limit how we
              process your data.
            </li>
            <li>
              <strong>Right to object</strong> — to object to processing
              based on legitimate interest.
            </li>
            <li>
              <strong>Right to data portability</strong> — to receive your
              data in a structured, machine-readable format.
            </li>
            <li>
              <strong>Right to withdraw consent</strong> — at any time,
              without affecting the lawfulness of prior processing.
            </li>
            <li>
              <strong>Right to lodge a complaint</strong> with the Dutch
              Data Protection Authority (Autoriteit Persoonsgegevens,{" "}
              <a
                href="https://autoriteitpersoonsgegevens.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-ink"
              >
                autoriteitpersoonsgegevens.nl
              </a>
              ).
            </li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{" "}
            <a
              href="mailto:hello@expat-cleaners.com"
              className="link-underline text-ink"
            >
              hello@expat-cleaners.com
            </a>
            . We respond within 4 weeks. We may need to verify your
            identity before processing your request.
          </p>
        </Section>

        <Section title="10. Security">
          <p>
            We take appropriate technical and organisational measures to
            protect your data against loss, misuse, and unauthorised
            access. These include encrypted connections (HTTPS), restricted
            access to systems, separation of keys from address data,
            processor agreements with our service providers, and regular
            review of our practices.
          </p>
          <p>
            If a personal data breach occurs that poses a risk to your
            rights, we will notify you and the Dutch Data Protection
            Authority within 72 hours, in accordance with Articles 33 and
            34 GDPR.
          </p>
        </Section>

        <Section title="11. Children">
          <p>
            Our services are not directed at children under 16. We do not
            knowingly collect personal data from children. If you believe
            we have inadvertently collected such data, please contact us so
            we can remove it.
          </p>
        </Section>

        <Section title="12. Changes to this statement">
          <p>
            We may update this Privacy Statement to reflect changes in our
            service or legal requirements. The latest version is always
            available at{" "}
            <Link href="/privacy" className="link-underline text-ink">
              expat-cleaners.com/privacy
            </Link>
            . Significant changes affecting recurring clients will be
            communicated by email or WhatsApp.
          </p>
        </Section>

        <p className="mt-12 text-[15px] leading-[1.7] text-ink md:text-[16px]">
          <strong>Questions about your privacy?</strong> Contact us at{" "}
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
          . You can also lodge a complaint directly with the Autoriteit
          Persoonsgegevens at{" "}
          <a
            href="https://autoriteitpersoonsgegevens.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-ink"
          >
            autoriteitpersoonsgegevens.nl
          </a>
          .
        </p>

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
