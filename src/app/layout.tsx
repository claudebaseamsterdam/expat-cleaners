import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { MotionProvider } from "@/components/MotionProvider";

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

export const metadata: Metadata = {
  title: "ExpatCleaners — Premium home cleaning for expats in Amsterdam",
  description:
    "English-speaking cleaners, organic products, booked on WhatsApp. From €36/hr. Trusted by 200+ Amsterdam expats.",
  openGraph: {
    type: "website",
    locale: "en_NL",
    title:
      "ExpatCleaners — Premium home cleaning for expats in Amsterdam",
    description:
      "English-speaking cleaners, organic products, booked on WhatsApp. From €36/hr. Trusted by 200+ Amsterdam expats.",
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
        <MotionProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <StickyWhatsApp />
        </MotionProvider>
      </body>
    </html>
  );
}
