import React from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import AboutImage from "../../assets/aboutus_section.webp";

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="min-h-screen bg-white flex items-center justify-center"
    >
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-teal-500 to-teal-700 bg-clip-text text-transparent">
                Owl AI
              </span>
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"></div>
            </span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Discover how Owl AI revolutionizes your exam preparation with
            cutting-edge technology and personalized learning experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              About Owl AI
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Owl AI is your intelligent study companion designed specifically
              for competitive exam preparation. Our advanced AI technology
              provides instant, accurate answers to your questions, helping you
              understand complex concepts and prepare more effectively for exams
              like UGC-NET, CSIR-NET, SSC, and CTET.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              With years of research in educational technology and natural
              language processing, we&apos;ve created a platform that
              understands your learning needs and adapts to your study patterns,
              making exam preparation more efficient and enjoyable.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <IoMdCheckmarkCircle className="text-teal-600 text-xl flex-shrink-0" />
                <span className="text-gray-700">
                  24/7 AI-powered assistance for uninterrupted learning
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <IoMdCheckmarkCircle className="text-teal-600 text-xl flex-shrink-0" />
                <span className="text-gray-700">
                  Specialized content for competitive exams with expert-curated
                  materials
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <IoMdCheckmarkCircle className="text-teal-600 text-xl flex-shrink-0" />
                <span className="text-gray-700">
                  Multi-language support for diverse learning preferences
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <IoMdCheckmarkCircle className="text-teal-600 text-xl flex-shrink-0" />
                <span className="text-gray-700">
                  Personalized learning paths based on your progress
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <img src={AboutImage} alt="About Owl AI" className="max-w-md" />
          </div>
        </div>
      </div>
    </section>
  );
};
