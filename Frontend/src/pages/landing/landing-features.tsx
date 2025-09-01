import React from "react";
import { CheckCircle, BrainCog, Languages } from "lucide-react";
import FeatureImage1 from "@/assets/feature_1.avif";
import FeatureImage2 from "@/assets/feature_2.avif";
import FeatureImage3 from "@/assets/feature_3.avif";
import FeatureImage4 from "@/assets/feature_4.avif";

const features = [
  {
    icon: <CheckCircle className="w-6 h-6 text-black" />,
    title: "Thousands of solutions",
  },
  {
    icon: <BrainCog className="w-6 h-6 text-black" />,
    title: "AI-Powered Doubt Resolution",
  },
  {
    icon: <Languages className="w-6 h-6 text-black" />,
    title: "Language Flexibility",
  },
];

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

export const LandingFeatures: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Features List */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Why Choose Owl AI?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
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
                <p className="text-gray-600">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
