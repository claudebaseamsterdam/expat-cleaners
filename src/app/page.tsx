import { Hero } from "@/components/Hero";
import { ProofBar } from "@/components/ProofBar";
import { TrustBar } from "@/components/TrustBar";
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
      <TrustBar />
      <HowItWorks />
      <Services />
      <WhyUs />
      <Pricing />
      <Reviews />
      <FinalCTA />
    </>
  );
}
