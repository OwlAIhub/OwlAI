import React from "react";
import { CheckCircle, BookOpen, Users, TrendingUp } from "lucide-react";
import ugcNetLogo from "@/assets/ugc-net.png";
import sscLogo from "@/assets/ssc.png";
import csirLogo from "@/assets/csir.png";
import ctetLogo from "@/assets/ctet.png";

export const ExamSupportSection: React.FC = () => {
  const exams = [
    {
      logo: ugcNetLogo,
      name: "UGC-NET",
      description: "National Eligibility Test for Assistant Professor and JRF",
      subjects: ["Computer Science", "Mathematics", "Physics", "Chemistry"],
      icon: <BookOpen className="w-5 h-5 text-teal-600" />,
    },
    {
      logo: csirLogo,
      name: "CSIR-NET",
      description:
        "Council of Scientific & Industrial Research National Eligibility Test",
      subjects: ["Life Sciences", "Physical Sciences", "Chemical Sciences"],
      icon: <Users className="w-5 h-5 text-teal-600" />,
    },
    {
      logo: sscLogo,
      name: "SSC",
      description: "Staff Selection Commission Combined Graduate Level",
      subjects: ["General Studies", "Quantitative Aptitude", "English"],
      icon: <TrendingUp className="w-5 h-5 text-teal-600" />,
    },
    {
      logo: ctetLogo,
      name: "CTET",
      description: "Central Teacher Eligibility Test for Teaching Positions",
      subjects: ["Child Development", "Pedagogy", "Language", "Mathematics"],
      icon: <CheckCircle className="w-5 h-5 text-teal-600" />,
    },
  ];

  return (
    <section id="exams" className="min-h-screen flex items-center bg-gray-50">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Supporting Multiple{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-teal-500 to-teal-700 bg-clip-text text-transparent">
                Exams
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"></div>
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-200 rounded-full opacity-60"></div>
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Get specialized support for various competitive examinations with
            comprehensive study materials and AI-powered assistance.
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-teal-600" />
              <span>Expert-curated content</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-teal-600" />
              <span>Latest syllabus coverage</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-teal-600" />
              <span>Practice questions</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {exams.map((exam, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 mx-auto mb-4 p-2 bg-gray-50 rounded-full">
                <img
                  src={exam.logo}
                  alt={exam.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{exam.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{exam.description}</p>

              <div className="text-left">
                <div className="flex items-center space-x-2 mb-3">
                  {exam.icon}
                  <span className="text-xs font-medium text-gray-700">
                    Key Subjects:
                  </span>
                </div>
                <div className="space-y-1">
                  {exam.subjects.slice(0, 3).map((subject, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-gray-600 flex items-center space-x-1"
                    >
                      <div className="w-1 h-1 bg-teal-400 rounded-full"></div>
                      <span>{subject}</span>
                    </div>
                  ))}
                  {exam.subjects.length > 3 && (
                    <div className="text-xs text-teal-600 font-medium">
                      +{exam.subjects.length - 3} more subjects
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-teal-50 px-6 py-3 rounded-full">
            <CheckCircle className="w-5 h-5 text-teal-600" />
            <span className="text-sm font-medium text-teal-800">
              More exams coming soon! Stay tuned for updates.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
