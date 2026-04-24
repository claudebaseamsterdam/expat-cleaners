import { Hero } from "@/components/Hero";
import { ProofBar } from "@/components/ProofBar";
import { HowItWorks } from "@/components/HowItWorks";
import { Services } from "@/components/Services";
import { WhyUs } from "@/components/WhyUs";
import { Pricing } from "@/components/Pricing";
import { Reviews } from "@/components/Reviews";
import { FinalCTA } from "@/components/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <ProofBar />
      <HowItWorks />
      <Services />
      <WhyUs />
      <Pricing />
      <Reviews />
      <FinalCTA />
    </>
  );
}
