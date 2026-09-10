import { LandingNavbar } from "@/components/landing/landing-navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { CapabilityAgent } from "@/components/landing/capability-agent";
import { CapabilityWorkspace } from "@/components/landing/capability-workspace";
import { StackCarousel } from "@/components/landing/stack-carousel";
import { PricingTeaser } from "@/components/landing/pricing-teaser";
import { CtaSection } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingPage() {
  return (
    <>
      <LandingNavbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <FeatureGrid />
        <CapabilityAgent />
        <CapabilityWorkspace />
        <StackCarousel />
        <PricingTeaser />
        <CtaSection />
      </main>
      <LandingFooter />
    </>
  );
}
