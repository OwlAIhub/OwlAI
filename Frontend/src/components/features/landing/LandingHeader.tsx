import React from "react";
import { Link } from "react-router-dom";
import Logo from "@/assets/owl_AI_logo.png";
import owlMascot from "@/assets/owlMascot.png";

interface LandingHeaderProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  showError: boolean;
  setShowError: (show: boolean) => void;
  onAskClick: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  inputValue,
  setInputValue,
  showError,
  setShowError,
  onAskClick,
}) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center">
              <img src={Logo} alt="logo" className="w-5 h-5" />
            </div>
            <span className="text-lg font-medium text-gray-900">Owl AI</span>
          </div>

          <div className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Contact
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-20">
            <div className="flex justify-center mb-12">
              <img src={owlMascot} alt="Owl AI" className="w-16 h-16" />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Your AI Learning{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-teal-500 to-teal-700 bg-clip-text text-transparent">
                  Assistant
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"></div>
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-200 rounded-full opacity-60"></div>
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto leading-relaxed">
              Get instant answers to your study questions. Powered by advanced
              AI to help you excel in your UGC NET and competitive exams.
            </p>

            {/* Search Input */}
            <div className="max-w-2xl mx-auto mb-20">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setShowError(false);
                  }}
                  placeholder="Ask your question here..."
                  className="w-full px-8 py-5 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm pr-20"
                />
                <button
                  onClick={onAskClick}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl text-sm font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Ask AI
                </button>
              </div>
              {showError && (
                <p className="text-red-500 text-sm mt-3 text-left ml-4">
                  Please enter a question
                </p>
              )}
            </div>
          </div>

          {/* Popular Questions */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Popular Questions
            </h2>
            <p className="text-gray-500 mb-12 text-base">
              Get started with these commonly asked UGC NET questions
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                {
                  label: "Paper 1 Syllabus",
                  query:
                    "Paper 1 ka syllabus itna zyada hai... Kahaan se shuru karun?",
                  description:
                    "Understanding the complete UGC NET Paper 1 structure and topics",
                },
                {
                  label: "Teaching Aptitude",
                  query: "What is Teaching Aptitude?",
                  description:
                    "Core concepts and principles of effective teaching",
                },
                {
                  label: "Research Methods",
                  query: "Explain Research Methodology",
                  description:
                    "Essential research techniques and methodologies",
                },
                {
                  label: "Logical Reasoning",
                  query: "What is Logical Reasoning?",
                  description:
                    "Developing critical thinking and analytical skills",
                },
              ].map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputValue(prompt.query);
                    setShowError(false);
                  }}
                  className="group p-5 bg-white rounded-xl text-left hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:border-gray-200"
                >
                  <div className="space-y-2">
                    <p className="text-gray-900 font-medium text-base group-hover:text-teal-600 transition-colors">
                      {prompt.label}
                    </p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {prompt.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
