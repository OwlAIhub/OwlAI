import React from "react";
import FeatureImage1 from "@/assets/image1.avif";
import FeatureImage2 from "@/assets/image2.avif";
import FeatureImage3 from "@/assets/image3.avif";
import FeatureImage4 from "@/assets/image4.avif";

const featureCards = [
  {
    image: FeatureImage1,
    title: "Instant Answers",
    description:
      "Get immediate responses to your study questions with our advanced AI technology.",
  },
  {
    image: FeatureImage2,
    title: "24/7 Availability",
    description:
      "Study anytime, anywhere. Our AI assistant is always ready to help you learn.",
  },
  {
    image: FeatureImage3,
    title: "Personalized Learning",
    description: "Adaptive responses that match your learning style and pace.",
  },
  {
    image: FeatureImage4,
    title: "Exam Preparation",
    description:
      "Specialized support for competitive exams like UGC-NET, CSIR-NET, and more.",
  },
];

export const FeatureCardsSection: React.FC = () => {
  return (
    <section id="features" className="min-h-screen flex items-center bg-gray-50">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Core Features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need for effective exam preparation
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
