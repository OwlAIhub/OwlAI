import React from "react";
import {
  BrainCog,
  Languages,
  BookOpen,
  Zap,
  Shield,
  Target,
  Clock,
  Users,
  Award,
  Sparkles,
} from "lucide-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";

export const WhyChooseSection: React.FC = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-teal-600" />,
      title: "Thousands of Solutions",
      description:
        "Access a vast database of solved problems, explanations, and study materials covering all major competitive exam topics with detailed step-by-step solutions.",
      color: "#0d9488",
    },
    {
      icon: <BrainCog className="w-8 h-8 text-teal-600" />,
      title: "AI-Powered Doubt Resolution",
      description:
        "Get instant, accurate answers to your questions with our advanced AI that understands context and provides comprehensive explanations tailored to your level.",
      color: "#059669",
    },
    {
      icon: <Languages className="w-8 h-8 text-teal-600" />,
      title: "Language Flexibility",
      description:
        "Study in your preferred language with our multi-language support system. Get explanations and answers in English, Hindi, and other regional languages.",
      color: "#7c3aed",
    },
    {
      icon: <Zap className="w-8 h-8 text-teal-600" />,
      title: "Lightning Fast Responses",
      description:
        "Get answers in seconds, not minutes. Our optimized AI delivers instant responses to keep your study momentum going.",
      color: "#dc2626",
    },
    {
      icon: <Shield className="w-8 h-8 text-teal-600" />,
      title: "100% Secure & Private",
      description:
        "Your data is protected with enterprise-grade security. Your study sessions and questions remain completely private and secure.",
      color: "#2563eb",
    },
    {
      icon: <Target className="w-8 h-8 text-teal-600" />,
      title: "Exam-Focused Content",
      description:
        "Content specifically curated for competitive exams like UGC-NET, CSIR-NET, SSC, and CTET with latest syllabus coverage.",
      color: "#ea580c",
    },
    {
      icon: <Clock className="w-8 h-8 text-teal-600" />,
      title: "24/7 Availability",
      description:
        "Study anytime, anywhere. Our AI assistant is always ready to help you learn, even during late-night study sessions.",
      color: "#0891b2",
    },
    {
      icon: <Users className="w-8 h-8 text-teal-600" />,
      title: "Community Learning",
      description:
        "Join thousands of students preparing for the same exams. Share insights and learn from the collective knowledge.",
      color: "#be185d",
    },
    {
      icon: <Award className="w-8 h-8 text-teal-600" />,
      title: "Proven Success Rate",
      description:
        "Join thousands of successful students who have cleared their competitive exams with the help of Owl AI.",
      color: "#16a34a",
    },
  ];

  return (
    <section id="why-choose" className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-teal-500 to-teal-700 bg-clip-text text-transparent">
                Owl AI
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"></div>
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-200 rounded-full opacity-60"></div>
            </span>
            ?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience the power of AI-driven learning with our comprehensive
            features designed for competitive exam success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <CardSpotlight
              key={index}
              className="bg-white border-gray-200 hover:border-teal-300 transition-colors duration-300"
              color={feature.color}
              radius={300}
            >
              <div className="relative z-10">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </CardSpotlight>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-teal-50 px-8 py-4 rounded-full border border-teal-200">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <span className="text-sm font-medium text-teal-800">
              Ready to transform your exam preparation? Start learning with Owl
              AI today!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
