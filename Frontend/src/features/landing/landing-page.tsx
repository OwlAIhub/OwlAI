import { useState } from "react";
import { LandingHeader } from "../../shared/components/landing/landing-header";
import { AboutSection } from "../../shared/components/landing/about-section";
import { WhyChooseSection } from "../../shared/components/landing/why-choose-section";
import { ExamSupportSection } from "../../shared/components/landing/exam-support-section";
// import { TestimonialsSection } from "../../shared/components/landing/testimonials-section";
import { FeatureCardsSection } from "../../shared/components/landing/feature-cards-section";
import { FAQSection } from "../../shared/components/landing/faq-section";
// import { PricingSection } from "../../shared/components/landing/pricing-section";
import { ContactUsSection } from "../../shared/components/landing/contact-us-section";
import { LandingFooter } from "../../shared/components/landing/landing-footer";
import { SEOHead, SEOConfigs } from "../../shared/components/seo/SEOHead";

const LandingPage = () => {
  const [inputValue, setInputValue] = useState("");
  const currentYear = new Date().getFullYear();
  const [showError, setShowError] = useState(false);

  const handleAskClick = () => {
    if (!inputValue.trim()) {
      setShowError(true);
      return;
    }
    if (inputValue.trim()) {
      localStorage.setItem("presetQuery", inputValue);
      window.location.href = "/chat";
    }
  };

  return (
    <div className="font-sans bg-white">
      <SEOHead {...SEOConfigs.home} />
      <LandingHeader
        inputValue={inputValue}
        setInputValue={setInputValue}
        showError={showError}
        setShowError={setShowError}
        onAskClick={handleAskClick}
      />

      <AboutSection />
      <WhyChooseSection />
      <ExamSupportSection />
      {/* <TestimonialsSection /> */}
      <FeatureCardsSection />
      <FAQSection />
      {/* <PricingSection /> */}
      <ContactUsSection />

      <LandingFooter currentYear={currentYear} />
    </div>
  );
};

export default LandingPage;
