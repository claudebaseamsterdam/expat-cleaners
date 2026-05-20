import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Algemene Voorwaarden — ExpatCleaners",
  description:
    "Algemene Voorwaarden van Expat Cleaning Amsterdam — boekingen, tarieven, annulering, klachten, aansprakelijkheid, toepasselijk recht. General Terms (NL/EN) for ExpatCleaners cleaning services in Amsterdam.",
  // Legal pages don't need to be social-shared. Suppress OG image so a
  // share preview falls back to the site default rather than carrying
  // the home OG photo against legal copy.
  openGraph: {
    title: "Algemene Voorwaarden — ExpatCleaners",
    description:
      "Algemene Voorwaarden van Expat Cleaning Amsterdam (NL/EN).",
  },
};

// Small server-component section helper. Each article renders its
// bilingual heading (NL — EN) and a vertical-rhythm container for the
// paired Dutch + English paragraphs. Kept in this file (not extracted)
// because /privacy uses an identical helper of its own — copying once
// is cheaper than a shared component file with one consumer per page.
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

// Two helpers to mark paragraph language for accessibility and to
// visually distinguish the supportive English text from the leading
// Dutch text. Per the opening clause, the Dutch version prevails in
// any discrepancy.
function NL({ children }: { children: React.ReactNode }) {
  return <p lang="nl">{children}</p>;
}

function EN({ children }: { children: React.ReactNode }) {
  return (
    <p lang="en" className="text-stone">
      {children}
    </p>
  );
}

export default function TermsPage() {
  return (
    <main className="bg-cream">
      <article className="mx-auto max-w-3xl px-6 py-20 md:px-8 md:py-28">
        {/* Eyebrow / page intro — keep tight, then breathe before the
            first numbered article. */}
        <p className="caption">Legal</p>
        <h1
          className="mt-4 font-display text-[36px] leading-[1.05] tracking-[-0.02em] text-ink md:text-[48px]"
          style={{ fontWeight: 400 }}
        >
          Algemene Voorwaarden
        </h1>
        <p className="mt-3 font-display text-[20px] leading-[1.2] tracking-[-0.01em] text-stone md:text-[22px]">
          General Terms &amp; Conditions
        </p>

        <p className="mt-6 text-[15px] leading-[1.7] text-ink md:text-[16px]">
          <strong>Expat Cleaning Amsterdam</strong> · Amsterdam, the
          Netherlands
        </p>
        <p className="mt-1 text-[14px] leading-[1.7] text-stone">
          <strong>Versie / Version:</strong> mei 2026
        </p>

        <NL>
          Deze Algemene Voorwaarden zijn van toepassing op alle
          overeenkomsten waarbij Expat Cleaning Amsterdam (handelsnaam
          van een eenmanszaak ingeschreven in het Handelsregister onder
          nummer 94002185) schoonmaakdiensten levert aan een Klant. Bij
          strijdigheid tussen de Nederlandse en Engelse tekst prevaleert
          de Nederlandse tekst.
        </NL>
        <EN>
          These General Terms apply to all agreements under which Expat
          Cleaning Amsterdam (trade name of a sole proprietorship
          registered in the Dutch Trade Register under no. 94002185)
          provides cleaning services to a Customer. In case of
          discrepancy between the Dutch and English text, the Dutch
          text prevails.
        </EN>

        <Section title="Artikel 1 — Definities / Article 1 — Definitions">
          <NL>
            Opdrachtgever: Expat Cleaning Amsterdam. Klant: de
            natuurlijke of rechtspersoon met wie Opdrachtgever een
            Overeenkomst sluit. Overeenkomst: iedere overeenkomst tussen
            Opdrachtgever en Klant betreffende de levering van
            schoonmaakdiensten. Diensten: alle door Opdrachtgever te
            leveren schoonmaak- en aanverwante diensten.
          </NL>
          <EN>
            Service Provider: Expat Cleaning Amsterdam. Customer: the
            natural or legal person with whom the Service Provider
            enters into an Agreement. Agreement: any agreement between
            the Service Provider and the Customer for cleaning services.
            Services: all cleaning and related services to be provided
            by the Service Provider.
          </EN>
        </Section>

        <Section title="Artikel 2 — Toepasselijkheid / Applicability">
          <NL>
            Deze voorwaarden zijn van toepassing op alle aanbiedingen,
            offertes, opdrachten en Overeenkomsten van Opdrachtgever,
            met uitsluiting van eventuele algemene voorwaarden van
            Klant. Afwijkingen zijn alleen geldig indien schriftelijk
            overeengekomen.
          </NL>
          <EN>
            These terms apply to all offers, quotes, assignments and
            Agreements of the Service Provider, to the exclusion of any
            general terms of the Customer. Deviations are only valid
            when agreed in writing.
          </EN>
        </Section>

        <Section title="Artikel 3 — Totstandkoming Overeenkomst / Formation of Agreement">
          <NL>
            Een Overeenkomst komt tot stand wanneer Klant via WhatsApp,
            e-mail, het boekingsformulier op de website of een ander
            door Opdrachtgever aangewezen kanaal een boekingsbevestiging
            ontvangt van Opdrachtgever. Aanbiedingen van Opdrachtgever
            zijn vrijblijvend en kunnen binnen drie (3) werkdagen na
            aanvaarding worden herroepen.
          </NL>
          <EN>
            An Agreement is formed when the Customer receives a booking
            confirmation from the Service Provider via WhatsApp, e-mail,
            the website booking form or another channel designated by
            the Service Provider. Offers from the Service Provider are
            without obligation and may be revoked within three (3)
            business days after acceptance.
          </EN>
        </Section>

        <Section title="Artikel 4 — Herroepingsrecht consumenten / Right of withdrawal (consumers)">
          <NL>
            Een Klant die handelt als consument heeft het wettelijke
            recht de Overeenkomst binnen veertien (14) dagen na
            totstandkoming kosteloos te herroepen, behalve in twee
            gevallen: (a) als de Dienst met instemming van de consument
            volledig is uitgevoerd binnen die termijn, of (b) als de
            consument bij het sluiten uitdrukkelijk heeft afgezien van
            het herroepingsrecht (artikel 6:230o e.v. BW). Bij
            boekingen die binnen veertien dagen na aanvaarding worden
            uitgevoerd, wordt de Klant geacht uitdrukkelijk afstand te
            doen van het herroepingsrecht.
          </NL>
          <EN>
            A Customer acting as a consumer has the statutory right to
            withdraw from the Agreement free of charge within fourteen
            (14) days of formation, except (a) where the Service has
            been fully performed within that period with the
            consumer&rsquo;s consent, or (b) where the consumer has
            expressly waived the right of withdrawal at the time of
            conclusion (Article 6:230o et seq. Dutch Civil Code). For
            bookings executed within fourteen days of acceptance, the
            Customer is deemed to expressly waive the right of
            withdrawal.
          </EN>
        </Section>

        <Section title="Artikel 5 — Tarieven en betaling / Rates and payment">
          <ul
            lang="nl"
            className="list-disc space-y-2 pl-5 marker:text-stone"
          >
            <li>
              Tarieven schoonmaak particuliere woningen: € 38/uur
              (recurring wekelijks), € 40/uur (recurring tweewekelijks),
              € 44/uur (one-off / deep clean), allen inclusief 9% BTW.
            </li>
            <li>
              Eventuele aanvullende werkzaamheden (zoals balkonschoonmaak
              of glasbewassing) worden afzonderlijk geoffreerd onder
              hetzelfde 9% tarief, voor zover de fiscale kwalificatie
              als schoonmaak van een woning dat toelaat.
            </li>
            <li>
              Tarieven zijn vermeld inclusief BTW tenzij anders
              aangegeven. Tarieven kunnen jaarlijks worden aangepast;
              aangepaste tarieven gelden voor nieuwe boekingen vanaf de
              aanpassingsdatum.
            </li>
            <li>
              Betaling per factuur binnen veertien (14) dagen of, bij
              one-off, vooraf via Tikkie/iDEAL. Bij niet-tijdige betaling
              is Klant van rechtswege in verzuim en is wettelijke
              (handels)rente verschuldigd, alsmede incassokosten conform
              de WIK / Besluit vergoeding buitengerechtelijke
              incassokosten.
            </li>
          </ul>
          <EN>
            Pricing for residential cleaning: € 38/hour (weekly
            recurring), € 40/hour (biweekly recurring), € 44/hour
            (one-off / deep clean), all including 9% Dutch VAT. Any
            additional work (e.g. balcony, window cleaning) is quoted
            separately under the same 9% rate, to the extent its VAT
            qualification as residential cleaning permits. Payment by
            invoice within 14 days, or in advance for one-off jobs. Late
            payment triggers statutory interest and collection costs.
          </EN>
        </Section>

        <Section title="Artikel 6 — Annulering en wijziging / Cancellation and rescheduling">
          <ul
            lang="nl"
            className="list-disc space-y-2 pl-5 marker:text-stone"
          >
            <li>
              Annulering of verplaatsing van een geplande Dienst kan
              kosteloos tot vierentwintig (24) uur vóór het afgesproken
              tijdstip.
            </li>
            <li>
              Bij annulering of verplaatsing binnen 24 uur is Klant 50%
              van het geoffreerde bedrag verschuldigd, met een minimum
              van € 30.
            </li>
            <li>
              Bij no-show (Klant niet aanwezig, geen toegang, geen
              instructie) op het afgesproken tijdstip is het volledige
              bedrag verschuldigd.
            </li>
            <li>
              Bij recurring abonnementen kan de Klant zonder reden de
              overeenkomst tussentijds opzeggen met inachtneming van een
              opzegtermijn van veertien (14) dagen.
            </li>
          </ul>
          <EN>
            Cancellation or rescheduling free of charge up to 24 hours
            before the scheduled time. Within 24 hours: 50% of the
            quoted amount, minimum € 30. No-show: full amount due.
            Recurring subscriptions can be terminated by the Customer
            with 14 days&rsquo; notice.
          </EN>
        </Section>

        <Section title="Artikel 7 — Uitvoering van de Dienst / Execution">
          <NL>
            Opdrachtgever spant zich in om de Dienst naar beste vermogen
            en met inachtneming van de in de schoonmaakbranche
            gebruikelijke zorgvuldigheid uit te voeren. Opdrachtgever
            schakelt daarvoor eigen medewerkers in, of een
            gekwalificeerde onderaannemer waarmee Opdrachtgever een
            schriftelijke overeenkomst heeft gesloten.
          </NL>
          <NL>
            Klant zorgt voor toegang tot de woning op het afgesproken
            tijdstip, een veilige werkomgeving, stromend water, en
            elektriciteit. Indien specifieke schoonmaakmiddelen of
            -methoden zijn afgesproken (bijvoorbeeld bio-cleaning), zal
            Opdrachtgever deze gebruiken; in andere gevallen kiest
            Opdrachtgever in redelijkheid.
          </NL>
          <EN>
            The Service Provider performs the Service with reasonable
            care and customary diligence, using its own personnel or a
            contractually engaged subcontractor. The Customer provides
            access at the agreed time, a safe working environment,
            running water and electricity. Agreed materials (e.g.
            bio-cleaning) will be used; otherwise the Service Provider
            chooses reasonably.
          </EN>
        </Section>

        <Section title="Artikel 8 — Aansprakelijkheid / Liability">
          <ul
            lang="nl"
            className="list-disc space-y-2 pl-5 marker:text-stone"
          >
            <li>
              Opdrachtgever is uitsluitend aansprakelijk voor directe
              schade die het rechtstreekse gevolg is van een
              toerekenbare tekortkoming bij de uitvoering van een
              Dienst.
            </li>
            <li>
              De aansprakelijkheid van Opdrachtgever is per gebeurtenis
              of samenhangende gebeurtenissen beperkt tot het bedrag dat
              door de aansprakelijkheidsverzekering van Opdrachtgever
              ter zake wordt uitgekeerd. Indien om welke reden dan ook
              geen uitkering plaatsvindt, is de aansprakelijkheid
              beperkt tot vijf (5) maal het factuurbedrag van de Dienst
              waarop de aansprakelijkheid betrekking heeft, met een
              absoluut maximum van € 5.000.
            </li>
            <li>
              Indirecte schade, gevolgschade, gederfde winst,
              vertragingsschade, immateriële schade of schade door
              verlies van zaken die Klant op een zichtbare plaats heeft
              achtergelaten (bijvoorbeeld contant geld, sieraden in het
              zicht), is uitgesloten.
            </li>
            <li>
              Iedere aanspraak op vergoeding van schade vervalt indien
              Klant deze niet binnen achtenveertig (48) uur na afloop
              van de Dienst schriftelijk (e-mail of WhatsApp aan het
              door Opdrachtgever opgegeven adres) heeft gemeld, voorzien
              van een redelijke beschrijving en, waar mogelijk,
              fotomateriaal.
            </li>
            <li>
              De beperkingen in dit artikel gelden niet bij opzet of
              bewuste roekeloosheid van Opdrachtgever of haar
              leidinggevende ondergeschikten.
            </li>
          </ul>
          <EN>
            Liability is limited to (i) the amount paid out by the
            Service Provider&rsquo;s liability insurance, or (ii) if no
            payout, five times the invoice amount with an absolute
            maximum of € 5,000. Indirect, consequential and immaterial
            damage, lost profit, and loss of valuables left in plain
            sight is excluded. Claims must be reported in writing
            within 48 hours.
          </EN>
        </Section>

        <Section title="Artikel 9 — Klachten en herstel / Complaints and remediation">
          <NL>
            Klachten over de Dienst worden binnen vierentwintig (24) uur
            na uitvoering schriftelijk gemeld via WhatsApp of e-mail.
            Bij een gegronde klacht zal Opdrachtgever binnen
            tweeënzeventig (72) uur kosteloos hercleaning aanbieden, dan
            wel een redelijke creditering verstrekken, naar keuze van
            Opdrachtgever.
          </NL>
          <EN>
            Complaints about the Service must be reported in writing via
            WhatsApp or e-mail within 24 hours of execution. Where the
            complaint is justified, the Service Provider will offer free
            re-cleaning within 72 hours or a reasonable credit, at the
            Service Provider&rsquo;s choice.
          </EN>
        </Section>

        <Section title="Artikel 10 — Privacy / Privacy">
          <NL>
            Opdrachtgever verwerkt persoonsgegevens conform de Algemene
            Verordening Gegevensbescherming (AVG). Voor details verwijst
            Opdrachtgever naar haar{" "}
            <Link href="/privacy" className="link-underline text-ink">
              privacyverklaring
            </Link>{" "}
            op de website. Persoonsgegevens worden uitsluitend gebruikt
            voor uitvoering van de Overeenkomst, klantadministratie,
            betaling, en — uitsluitend na toestemming — voor
            marketingdoeleinden.
          </NL>
          <EN>
            The Service Provider processes personal data in accordance
            with the GDPR. For details, see the{" "}
            <Link href="/privacy" className="link-underline text-stone">
              privacy statement
            </Link>{" "}
            on the website. Personal data is used solely for performance
            of the Agreement, customer administration, payment, and —
            only with consent — for marketing.
          </EN>
        </Section>

        <Section title="Artikel 11 — Toegang tot de woning / Access to the property">
          <NL>
            Indien Klant Opdrachtgever sleutels of toegangscodes ter
            beschikking stelt, gaat dat onder de uitdrukkelijke
            voorwaarde dat Opdrachtgever deze zal bewaren in een
            afgesloten ruimte zonder vermelding van het adres en bij
            beëindiging van de Overeenkomst zonder uitstel zal
            retourneren.
          </NL>
          <NL>
            Bij verlies van een door Klant ter beschikking gestelde
            sleutel is de aansprakelijkheid van Opdrachtgever beperkt
            tot de kosten van vervanging van de sleutel en, indien
            redelijkerwijs noodzakelijk, het vervangen van één
            cilinderslot, met een absoluut maximum van € 250.
          </NL>
          <EN>
            Keys and access codes are stored securely without address
            reference and returned promptly upon termination. Liability
            for lost keys is limited to replacement cost and, if
            reasonably necessary, replacement of one cylinder lock, max
            € 250.
          </EN>
        </Section>

        <Section title="Artikel 12 — Overmacht / Force majeure">
          <NL>
            Indien Opdrachtgever door overmacht (waaronder ziekte van
            personeel zonder vervanging op redelijke termijn, extreme
            weersomstandigheden, brand, overstroming, pandemie,
            overheidsmaatregelen) een Dienst niet kan uitvoeren, wordt
            de Dienst kosteloos verplaatst naar het eerstvolgende
            beschikbare moment. Annulering door Klant in dat geval geeft
            geen recht op schadevergoeding.
          </NL>
        </Section>

        <Section title="Artikel 13 — Geen rechtstreekse inhuur / No direct hire">
          <NL>
            Klant zal gedurende de looptijd van een Overeenkomst en
            twaalf (12) maanden na het einde daarvan, niet rechtstreeks
            of via een derde, schoonmaakdiensten afnemen van een
            medewerker of onderaannemer van Opdrachtgever met wie Klant
            via Opdrachtgever in contact is gekomen, zonder voorafgaande
            schriftelijke toestemming van Opdrachtgever. Bij overtreding
            is Klant aan Opdrachtgever een direct opeisbare boete van
            € 1.500 verschuldigd, onverminderd het recht van
            Opdrachtgever op aanvullende schadevergoeding.
          </NL>
          <EN>
            The Customer will not, directly or indirectly, engage
            cleaning services from a Service Provider employee or
            subcontractor introduced via the Service Provider, during
            the Agreement and for 12 months after, without prior written
            consent. Breach: € 1,500 contractual penalty plus damages.
          </EN>
        </Section>

        <Section title="Artikel 14 — Wijziging voorwaarden / Amendment of terms">
          <NL>
            Opdrachtgever is gerechtigd deze voorwaarden te wijzigen.
            Voor lopende Overeenkomsten worden wijzigingen ten minste
            dertig (30) dagen vóór inwerkingtreding schriftelijk
            aangekondigd; Klant heeft het recht de Overeenkomst tegen
            die datum kosteloos te beëindigen.
          </NL>
        </Section>

        <Section title="Artikel 15 — Toepasselijk recht en geschillen / Governing law and disputes">
          <NL>
            Op deze Overeenkomst is uitsluitend Nederlands recht van
            toepassing. Geschillen worden voorgelegd aan de bevoegde
            rechter van de Rechtbank Amsterdam, onverminderd de
            mogelijkheid voor een Klant-consument om binnen één maand
            nadat Opdrachtgever schriftelijk een beroep op dit beding
            heeft gedaan, te kiezen voor de wettelijk bevoegde rechter.
          </NL>
          <EN>
            This Agreement is governed by Dutch law. Disputes are
            submitted to the Amsterdam District Court, without prejudice
            to a consumer&rsquo;s right to opt for the legally competent
            court within one month after the Service Provider invokes
            this clause.
          </EN>
        </Section>

        <p className="mt-12 text-[15px] leading-[1.7] text-ink md:text-[16px]">
          Vastgesteld te Amsterdam, mei 2026. — Yuri Kisman, handelend
          onder de naam Expat Cleaning Amsterdam.
        </p>

        <p className="mt-8 text-[15px] leading-[1.7] text-ink md:text-[16px]">
          <strong>Vragen over deze voorwaarden? / Questions?</strong>{" "}
          Contact{" "}
          <a
            href="mailto:hello@expat-cleaners.com"
            className="link-underline text-ink"
          >
            hello@expat-cleaners.com
          </a>{" "}
          · WhatsApp{" "}
          <a href="tel:+31644683837" className="link-underline text-ink">
            +31 6 44 68 38 37
          </a>
          .
        </p>

        {/* Spec-required footer line — single source of truth across
            both legal pages. Keep wording identical to /privacy. */}
        <p className="mt-12 border-t border-stone/20 pt-6 text-[13px] leading-[1.7] text-stone">
          Last updated: 20 May 2026. For questions, contact{" "}
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
