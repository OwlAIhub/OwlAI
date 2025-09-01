import React from "react";
import { motion } from "framer-motion";
import {
  IconBrain,
  IconClock,
  IconTarget,
  IconBolt,
  IconBook,
} from "@tabler/icons-react";
import FeatureImage1 from "@/assets/feature_1.avif";
import FeatureImage2 from "@/assets/feature_2.avif";
import FeatureImage3 from "@/assets/feature_3.avif";
import FeatureImage4 from "@/assets/feature_4.avif";

const featureCards = [
  {
    image: FeatureImage1,
    title: "AI-Powered Learning",
    description:
      "Advanced artificial intelligence that understands your learning style and provides personalized explanations for complex topics.",
    icon: <IconBrain className="w-6 h-6" />,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
  },
  {
    image: FeatureImage2,
    title: "24/7 Availability",
    description:
      "Study anytime, anywhere. Our AI assistant is always ready to help you learn, even during late-night study sessions.",
    icon: <IconClock className="w-6 h-6" />,
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
  },
  {
    image: FeatureImage3,
    title: "Personalized Learning",
    description:
      "Adaptive responses that match your learning style and pace, creating a customized study experience just for you.",
    icon: <IconTarget className="w-6 h-6" />,
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
  },
  {
    image: FeatureImage4,
    title: "Exam Preparation",
    description:
      "Specialized support for competitive exams like UGC-NET, CSIR-NET, SSC, and CTET with expert-curated content.",
    icon: <IconBook className="w-6 h-6" />,
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 to-red-50",
  },
];

export const FeatureCardsSection: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200 mb-4"
          >
            <IconBolt className="text-teal-600 w-3 h-3" />
            <span className="text-teal-700 text-xs font-medium">
              Powerful Features
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Our Core{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-teal-500 to-teal-700 bg-clip-text text-transparent">
                Features
              </span>
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"></div>
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Unlock your learning potential with our intelligent AI ecosystem
            designed to revolutionize your study experience
          </motion.p>
        </div>

        {/* Modern Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {featureCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative h-full cursor-pointer"
            >
              {/* Glassmorphism Card */}
              <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden h-full">
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity duration-500`}
                />

                {/* Floating Gradient Orb */}
                <div
                  className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${card.gradient} rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl`}
                />

                {/* Image with Overlay */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Floating Icon */}
                  <div className="absolute top-6 left-6">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                    >
                      {card.icon}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-6 right-6 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                    <span className="text-xs font-medium text-white">
                      Active
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-8 flex flex-col h-[calc(100%-12rem)]">
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {card.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto">
                    <button
                      className={`w-full py-3 px-6 bg-gradient-to-r ${card.gradient} text-white rounded-xl font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-lg hover:shadow-xl`}
                    >
                      Explore Feature
                    </button>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-white/40 rounded-full animate-pulse" />
                <div className="absolute top-1/2 left-4 w-1 h-1 bg-white/30 rounded-full animate-ping" />
              </div>

              {/* Hover Glow Effect */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl -z-10`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
