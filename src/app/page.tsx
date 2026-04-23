import { Hero } from "@/components/home/Hero";
import { StatsBar } from "@/components/home/StatsBar";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Services } from "@/components/home/Services";
import { Pricing } from "@/components/home/Pricing";
import { Reviews } from "@/components/home/Reviews";
import { FinalCTA } from "@/components/home/FinalCTA";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <HowItWorks />
      <Services />
      <Pricing />
      <Reviews />
      <FinalCTA />
      <WhatsAppFloat />
    </>
  );
}
