import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/assets/owl-ai-logo.png";
import owlMascot from "@/assets/owl-mascot.png";
import { useLenis } from "@/shared/hooks/useLenis";

export const LandingHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lenis } = useLenis();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element && lenis) {
      lenis.scrollTo(element, {
        offset: -68, // Account for fixed navbar height with extra padding
        duration: 1.5,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else if (element) {
      // Fallback to native smooth scroll if Lenis is not available
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 1.5,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      // Fallback to native smooth scroll if Lenis is not available
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Navigation */}
      <nav className="bg-gray-100/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <img
                  src={Logo}
                  alt="logo"
                  className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="text-lg font-medium text-gray-900 group-hover:text-teal-600 transition-colors duration-300">
                Owl AI
              </span>
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  scrollToTop();
                }}
                className="text-gray-900 text-sm font-medium transition-colors relative group"
              >
                Home
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a
                href="#about"
                onClick={e => {
                  e.preventDefault();
                  scrollToSection("about");
                }}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors relative group"
              >
                About
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a
                href="#why-choose"
                onClick={e => {
                  e.preventDefault();
                  scrollToSection("why-choose");
                }}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors relative group"
              >
                Why Choose Us
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a
                href="#exams"
                onClick={e => {
                  e.preventDefault();
                  scrollToSection("exams");
                }}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors relative group"
              >
                Exams
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a
                href="#features"
                onClick={e => {
                  e.preventDefault();
                  scrollToSection("features");
                }}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors relative group"
              >
                Features
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a
                href="#faq"
                onClick={e => {
                  e.preventDefault();
                  scrollToSection("faq");
                }}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors relative group"
              >
                FAQ
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a
                href="#contact"
                onClick={e => {
                  e.preventDefault();
                  scrollToSection("contact");
                }}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors relative group"
              >
                Contact Us
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full"></div>
              </a>
            </div>



            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors relative z-10"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
                <div
                  className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
                    isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></div>
                <div
                  className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
                    isMobileMenuOpen ? "opacity-0" : ""
                  }`}
                ></div>
                <div
                  className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
                    isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></div>
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="py-4 space-y-3 border-t border-gray-100 mt-4">
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  scrollToTop();
                }}
                className="block text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors py-2"
              >
                Home
              </a>
              <a
                href="#about"
                onClick={e => {
                  e.preventDefault();
                  scrollToSection("about");
                }}
                className="block text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors py-2"
              >
                About
              </a>
              <a
                href="#why-choose"
                onClick={e => {
                  e.preventDefault();
                  scrollToSection("why-choose");
                }}
                className="block text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors py-2"
              >
                Why Choose Us
              </a>
              <a
                href="#exams"
                onClick={e => {
                  e.preventDefault();
                  scrollToSection("exams");
                }}
                className="block text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors py-2"
              >
                Exams
              </a>
              <a
                href="#features"
                onClick={e => {
                  e.preventDefault();
                  scrollToSection("features");
                }}
                className="block text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors py-2"
              >
                Features
              </a>
              <a
                href="#contact"
                onClick={e => {
                  e.preventDefault();
                  scrollToSection("contact");
                }}
                className="block text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors py-2"
              >
                Contact Us
              </a>

            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 min-h-screen flex items-center bg-gray-100">
        <div className="max-w-6xl mx-auto text-center w-full">
          {/* Floating Mascot */}
          <div className="flex justify-center mb-10">
            <div className="relative">
              <div className="absolute inset-0 bg-teal-100 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <img
                src={owlMascot}
                alt="Owl AI"
                className="w-16 h-16 relative z-10"
                style={{
                  animation: "float 3s ease-in-out infinite",
                }}
              />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
            Your AI Learning{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-teal-500 to-teal-700 bg-clip-text text-transparent">
                Assistant
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"></div>
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-200 rounded-full opacity-60"></div>
            </span>
          </h1>

          <p className="text-lg text-black mb-10 max-w-2xl mx-auto leading-relaxed">
            Get instant answers to your study questions. Powered by advanced AI
            to help you excel in your UGC NET and competitive exams.
          </p>

          {/* Primary CTA Button */}
          <div className="mb-10">
            <Link
              to="/auth"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-base font-semibold rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Start Learning Now
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-10">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-black text-sm font-medium">
                10,000+ Students Helped
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-black text-sm font-medium">
                24/7 AI Support
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-black text-sm font-medium">
                95% Success Rate
              </span>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mb-10">
            <p className="text-black text-sm mb-4">Trusted by students from</p>
            <div className="flex flex-wrap justify-center items-center gap-6 opacity-60">
              <div className="text-black font-semibold text-base">
                Delhi University
              </div>
              <div className="text-black font-semibold text-base">JNU</div>
              <div className="text-black font-semibold text-base">BHU</div>
              <div className="text-black font-semibold text-base">AMU</div>
              <div className="text-black font-semibold text-base">+50 More</div>
            </div>
          </div>

          {/* Popular Questions */}
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">
              Popular Questions
            </h2>
            <p className="text-black mb-6 text-sm">
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
                <Link
                  key={index}
                  to="/chat"
                  onClick={() => {
                    localStorage.setItem("presetQuery", prompt.query);
                  }}
                  className="group p-4 bg-gray-100 rounded-xl text-left hover:bg-gray-200 transition-all duration-300 border border-gray-200 hover:border-teal-300 hover:shadow-md"
                >
                  <div className="space-y-2">
                    <p className="text-black font-semibold text-sm group-hover:text-teal-600 transition-colors">
                      {prompt.label}
                    </p>
                    <p className="text-gray-700 text-xs leading-relaxed group-hover:text-gray-800">
                      {prompt.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
