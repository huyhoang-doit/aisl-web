import { Navbar } from "@/features/landing/components/navbar";
import { BenefitsSection } from "@/features/landing/components/sections/benefits";
import { CommunitySection } from "@/features/landing/components/sections/community";
import { ContactSection } from "@/features/landing/components/sections/contact";
import { FAQSection } from "@/features/landing/components/sections/faq";
import { FeaturesSection } from "@/features/landing/components/sections/features";
import { FooterSection } from "@/features/landing/components/sections/footer";
import { HeroSection } from "@/features/landing/components/sections/hero";
import { HowItWorksSection } from "@/features/landing/components/sections/how-it-works";
import { PricingSection } from "@/features/landing/components/sections/pricing";
import { ServicesSection } from "@/features/landing/components/sections/services";
import { TestimonialSection } from "@/features/landing/components/sections/testimonial";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      {/* <DownloadAppSection /> */}
      {/* <SponsorsSection /> */}
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
