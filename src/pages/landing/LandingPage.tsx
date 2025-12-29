import { Navbar } from "@/components/layout/navbar";
import { BenefitsSection } from "@/components/layout/sections/benefits";
import { CommunitySection } from "@/components/layout/sections/community";
import { ContactSection } from "@/components/layout/sections/contact";
import { DownloadAppSection } from "@/components/layout/sections/download-app";
import { FAQSection } from "@/components/layout/sections/faq";
import { FeaturesSection } from "@/components/layout/sections/features";
import { FooterSection } from "@/components/layout/sections/footer";
import { HeroSection } from "@/components/layout/sections/hero";
import { HowItWorksSection } from "@/components/layout/sections/how-it-works";
import { PricingSection } from "@/components/layout/sections/pricing";
import { ServicesSection } from "@/components/layout/sections/services";
import { SponsorsSection } from "@/components/layout/sections/sponsors";
import { TestimonialSection } from "@/components/layout/sections/testimonial";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <DownloadAppSection />
      <SponsorsSection />
      <BenefitsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ServicesSection />
      <PricingSection />
      <TestimonialSection />
      <CommunitySection />
      <ContactSection />
      <FAQSection />
      <FooterSection />
    </>
  );
};

export default LandingPage;
