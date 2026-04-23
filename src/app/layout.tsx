import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

// Neo-grotesk display + body from one family.
// TODO: swap to licensed ABC Diatype / Söhne when available — this is a
// drop-in import change; the rest of the stylesheet is variable-weight aware.
const interTight = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "ExpatCleaners — A quieter kind of clean.",
  description:
    "Premium home cleaning in Amsterdam. Organic products, English-speaking cleaners, booked over WhatsApp.",
  openGraph: {
    type: "website",
    locale: "en_NL",
    title: "ExpatCleaners — A quieter kind of clean.",
    description:
      "Premium home cleaning in Amsterdam. Organic products, English-speaking cleaners, booked over WhatsApp.",
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
      className={`${interTight.variable} h-full antialiased`}
      style={{ ["--font-display" as string]: "var(--font-sans)" }}
    >
      <body className="min-h-full bg-brand-bg text-brand-ink flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
