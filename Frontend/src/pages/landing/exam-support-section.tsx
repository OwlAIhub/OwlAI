import React from "react";
import { BookOpen, Clock, Shield, Zap, Target, Globe } from "lucide-react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
import ugcNetLogo from "../../assets/ugc-net_exam.webp";
import csirNetLogo from "../../assets/csir_exam.webp";
import sscLogo from "../../assets/ssc_exam.webp";
import ctetLogo from "../../assets/ctet_exam.webp";

export const ExamSupportSection: React.FC = () => {
  const examCards = [
    {
      quote:
        "Comprehensive UGC-NET preparation with expert-curated materials, practice questions, and AI-powered doubt resolution for Computer Science, Mathematics, Physics, and Chemistry.",
      name: "UGC-NET",
      title: "Assistant Professor & JRF",
    },
    {
      quote:
        "Specialized CSIR-NET support with advanced AI assistance covering Life Sciences, Physical Sciences, and Chemical Sciences with detailed explanations and mock tests.",
      name: "CSIR-NET",
      title: "Scientific Research",
    },
    {
      quote:
        "Complete SSC CGL preparation with comprehensive study materials for General Studies, Quantitative Aptitude, and English with practice questions and performance tracking.",
      name: "SSC CGL",
      title: "Government Services",
    },
    {
      quote:
        "Professional CTET preparation with teaching-specific content covering Child Development, Pedagogy, Language, and Mathematics with practical teaching scenarios.",
      name: "CTET",
      title: "Teaching Certification",
    },
    {
      quote:
        "State PSC exam preparation with regional language support and tailored content for state-level competitive examinations with local context and current affairs.",
      name: "State PSC",
      title: "State Government",
    },
    {
      quote:
        "Banking sector exam preparation with financial expertise covering IBPS, SBI, and other banking examinations with banking-specific content and current affairs.",
      name: "Banking Exams",
      title: "Financial Sector",
    },
  ];

  const features = [
    {
      icon: <BookOpen className="w-4 h-4 text-teal-600" />,
      title: "Expert-curated content",
    },
    {
      icon: <Clock className="w-4 h-4 text-teal-600" />,
      title: "Latest syllabus coverage",
    },
    {
      icon: <Target className="w-4 h-4 text-teal-600" />,
      title: "Practice questions",
    },
    {
      icon: <Shield className="w-4 h-4 text-teal-600" />,
      title: "Mock tests",
    },
    {
      icon: <Zap className="w-4 h-4 text-teal-600" />,
      title: "Instant doubt resolution",
    },
  ];

  const examDetails = [
    {
      name: "UGC-NET",
      category: "Assistant Professor & JRF",
      image: ugcNetLogo,
      subjects: ["Computer Science", "Mathematics", "Physics", "Chemistry"],
      description:
        "National Eligibility Test for Assistant Professor and JRF positions in universities and colleges.",
    },
    {
      name: "CSIR-NET",
      category: "Scientific Research",
      image: csirNetLogo,
      subjects: ["Life Sciences", "Physical Sciences", "Chemical Sciences"],
      description:
        "Council of Scientific & Industrial Research National Eligibility Test for research positions.",
    },
    {
      name: "SSC CGL",
      category: "Government Services",
      image: sscLogo,
      subjects: ["General Studies", "Quantitative Aptitude", "English"],
      description:
        "Staff Selection Commission Combined Graduate Level for government job opportunities.",
    },
    {
      name: "CTET",
      category: "Teaching Certification",
      image: ctetLogo,
      subjects: ["Child Development", "Pedagogy", "Language", "Mathematics"],
      description:
        "Central Teacher Eligibility Test for teaching positions in schools.",
    },
  ];

  return (
    <section id="exams" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Supporting Multiple{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-teal-500 to-teal-700 bg-clip-text text-transparent">
                Exams
              </span>
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"></div>
            </span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Get specialized support for various competitive examinations with
            comprehensive study materials and AI-powered assistance.
          </p>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-white px-3 py-2 rounded-full border border-gray-200"
              >
                {feature.icon}
                <span className="text-xs text-gray-600">{feature.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Infinite Moving Cards */}
        <div className="mb-16">
          <InfiniteMovingCards
            items={examCards}
            direction="left"
            className="py-8"
          />
        </div>

        {/* Clean Exam Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
          {examDetails.map((exam, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300 hover:border-teal-300"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                  <img
                    src={exam.image}
                    alt={exam.name}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {exam.name}
                  </h3>
                  <p className="text-teal-600 text-sm font-medium mb-3">
                    {exam.category}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {exam.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exam.subjects.map((subject, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-50 rounded-md text-xs font-medium text-gray-700 border border-gray-200"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-teal-50 px-4 py-2 rounded-full border border-teal-200">
            <Globe className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-800">
              More exams coming soon! Stay tuned for updates.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
