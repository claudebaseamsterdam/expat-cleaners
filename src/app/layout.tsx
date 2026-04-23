import type { Metadata } from "next";
import { Instrument_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { UrgencyBar } from "@/components/UrgencyBar";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  title: "ExpatCleaners — Premium cleaning for expats in Amsterdam",
  description:
    "English-speaking cleaners, booking in 60 seconds via WhatsApp. 200+ expats served. From €36/hr.",
  openGraph: {
    type: "website",
    locale: "en_NL",
    title: "ExpatCleaners — Premium cleaning for expats in Amsterdam",
    description:
      "English-speaking cleaners, booking in 60 seconds via WhatsApp. From €36/hr.",
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
      className={`${instrumentSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-brand-cream text-brand-ink flex flex-col">
        <UrgencyBar />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
