import { Hero } from "@/components/home/Hero";
import { Proof } from "@/components/home/Proof";
import { Approach } from "@/components/home/Approach";
import { Services } from "@/components/home/Services";
import { Pricing } from "@/components/home/Pricing";
import { Reviews } from "@/components/home/Reviews";
import { FinalCTA } from "@/components/home/FinalCTA";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <Hero />
      <Proof />
      <Approach />
      <Services />
      <Pricing />
      <Reviews />
      <FinalCTA />
      <WhatsAppFloat />
    </>
  );
}
