import { useState } from "react";
import { LandingHeader } from "@/components/features/landing/LandingHeader";
import { AboutSection } from "@/components/features/landing/AboutSection";
import { WhyChooseSection } from "@/components/features/landing/WhyChooseSection";
import { ExamSupportSection } from "@/components/features/landing/ExamSupportSection";
// import { TestimonialsSection } from "@/components/features/landing/TestimonialsSection";
import { FeatureCardsSection } from "@/components/features/landing/FeatureCardsSection";
import { FAQSection } from "@/components/features/landing/FAQSection";
// import { PricingSection } from "@/components/features/landing/PricingSection";
import { ContactUsSection } from "@/components/features/landing/ContactUsSection";
import { LandingFooter } from "@/components/features/landing/LandingFooter";

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
