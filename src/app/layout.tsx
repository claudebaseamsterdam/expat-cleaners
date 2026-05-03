import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { MotionProvider } from "@/components/MotionProvider";
import { PixelLoader } from "@/components/PixelLoader";
import { CookieBanner } from "@/components/CookieBanner";
import { formatHourly, RECURRING_RATES, VAT_LABEL } from "@/lib/pricing";

// Fraunces as a variable font — opsz axis for optical sizing; wght is
// the default axis. Individual weights (400/500) applied via CSS on
// headlines and display utility.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
  preload: true,
});

// Inter as a variable font — wght used via CSS.
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const HERO_OG =
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=85&auto=format&fit=crop";

// Phase 7.4 — BTW-explicit meta description. `VAT_LABEL.mixed` is the
// generic "incl. BTW" used here intentionally (the spec asks for the
// generic label in metadata even though most line items are at the 9%
// reduced rate — keeps the description short and accurate for ads
// that span multiple service categories).
const META_DESCRIPTION = `Premium cleaning for Amsterdam expats. English-speaking, organic, on WhatsApp. From ${formatHourly(RECURRING_RATES.weekly.hourly)} ${VAT_LABEL.mixed}.`;

export const metadata: Metadata = {
  title: "ExpatCleaners — Premium home cleaning for expats in Amsterdam",
  description: META_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_NL",
    title:
      "ExpatCleaners — Premium home cleaning for expats in Amsterdam",
    description: META_DESCRIPTION,
    images: [{ url: HERO_OG, width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream text-ink">
        {/* Phase 6 — both the inline Meta Pixel base <Script> and the
            <noscript> Pixel pingback <img> were removed from this
            layout. They fired unconditionally on every page load, in
            direct contradiction of the /privacy page's "Meta Pixel
            only with consent" promise.
            The PixelLoader below now invokes trackPageView() through
            lib/pixel.ts's consent gate; the base script downloads only
            after the user clicks "Accept all" in the CookieBanner.
            (The no-JS Pixel pingback is intentionally not replaced —
            users without JS can't grant consent, so any noscript
            tracking would be ungated.) */}
        <MotionProvider>
          <PixelLoader />
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <StickyWhatsApp />
          <CookieBanner />
        </MotionProvider>
      </body>
    </html>
  );
}
