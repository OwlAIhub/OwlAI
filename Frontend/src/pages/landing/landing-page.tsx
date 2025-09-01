import React from "react";
import { LandingHeader } from "./landing-header";
import { AboutSection } from "./about-section";
import { FeatureCardsSection } from "./feature-cards-section";
import { WhyChooseSection } from "./why-choose-section";
import { ExamSupportSection } from "./exam-support-section";
import { FAQSection } from "./faq-section";
import { ContactUsSection } from "./contact-us-section";
import { LandingFooter } from "./landing-footer";

const LandingPage: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <main>
        {/* About Section */}
        <AboutSection />

        {/* Why Choose Us Section */}
        <WhyChooseSection />

        {/* Exams Section */}
        <ExamSupportSection />

        {/* Features Section */}
        <FeatureCardsSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* Contact Us Section */}
        <ContactUsSection />
      </main>
      <LandingFooter currentYear={currentYear} />
    </div>
  );
};

export default LandingPage;
