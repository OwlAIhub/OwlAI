import React from "react";
import { motion } from "framer-motion";
import {
  IconBrain,
  IconClock,
  IconTarget,
  IconBolt,
  IconBook,
} from "@tabler/icons-react";
import FeatureImage1 from "@/assets/image1.avif";
import FeatureImage2 from "@/assets/image2.avif";
import FeatureImage3 from "@/assets/image3.avif";
import FeatureImage4 from "@/assets/image4.avif";

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
            className="text-base text-gray-600 max-w-2xl mx-auto"
          >
            Everything you need for effective exam preparation with cutting-edge
            AI technology
          </motion.p>
        </div>

        {/* Main Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-7xl mx-auto">
          {featureCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative h-full"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-500 hover:border-gray-200 relative h-full flex flex-col">
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>

                {/* Image Section */}
                <div className="relative overflow-hidden flex-shrink-0">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  {/* Icon Badge */}
                  <div
                    className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-r ${card.gradient} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {card.icon}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 relative z-10 flex-grow flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
