import { useState } from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { IoMdCheckmarkCircle } from "react-icons/io";
import ugcNetLogo from "../assets/ugc-net.png";
import sscLogo from "../assets/ssc.png";
import csirLogo from "../assets/csir.png";
import ctetLogo from "../assets/ctet.png";
import AboutImage from "../assets/about_section.png";
import { LandingHeader } from "@/components/features/landing/LandingHeader";
import { LandingFeatures } from "@/components/features/landing/LandingFeatures";
import { LandingFooter } from "@/components/features/landing/LandingFooter";

const LandingPage = () => {
  const [inputValue, setInputValue] = useState("");
  const currentYear = new Date().getFullYear();
  const [showError, setShowError] = useState(false);

  const handleAskClick = () => {
    if (!inputValue.trim()) {
      setShowError(true);
      return;
    }
    if (inputValue.trim()) {
      localStorage.setItem("presetQuery", inputValue);
      window.location.href = "/chat";
    }
  };

  return (
    <div className="font-sans bg-white">
      <LandingHeader
        inputValue={inputValue}
        setInputValue={setInputValue}
        showError={showError}
        setShowError={setShowError}
        onAskClick={handleAskClick}
      />

      <LandingFeatures />

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                About Owl AI
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Owl AI is your intelligent study companion designed specifically
                for competitive exam preparation. Our advanced AI technology
                provides instant, accurate answers to your questions, helping
                you understand complex concepts and prepare more effectively.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <IoMdCheckmarkCircle className="text-green-500 text-xl" />
                  <span className="text-gray-700">
                    24/7 AI-powered assistance
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <IoMdCheckmarkCircle className="text-green-500 text-xl" />
                  <span className="text-gray-700">
                    Specialized for competitive exams
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <IoMdCheckmarkCircle className="text-green-500 text-xl" />
                  <span className="text-gray-700">Multi-language support</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src={AboutImage}
                alt="About Owl AI"
                className="rounded-lg shadow-lg max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Exam Support Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Supporting Multiple Exams
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get specialized support for various competitive examinations
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <img
                src={ugcNetLogo}
                alt="UGC-NET"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="font-semibold text-gray-900">UGC-NET</h3>
            </div>
            <div className="text-center">
              <img
                src={csirLogo}
                alt="CSIR-NET"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="font-semibold text-gray-900">CSIR-NET</h3>
            </div>
            <div className="text-center">
              <img src={sscLogo} alt="SSC" className="w-16 h-16 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900">SSC</h3>
            </div>
            <div className="text-center">
              <img
                src={ctetLogo}
                alt="CTET"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="font-semibold text-gray-900">CTET</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Students Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from students who have improved their exam preparation with
              Owl AI
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
              </div>
              <FaQuoteLeft className="text-teal-600 text-2xl mb-4" />
              <p className="text-gray-700 mb-4">
                "Owl AI helped me understand complex topics in minutes. The
                explanations are clear and easy to follow."
              </p>
              <div className="font-semibold text-gray-900">- Priya Sharma</div>
              <div className="text-sm text-gray-500">UGC-NET Aspirant</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
              </div>
              <FaQuoteLeft className="text-teal-600 text-2xl mb-4" />
              <p className="text-gray-700 mb-4">
                "The AI responses are incredibly accurate and helped me save
                hours of research time."
              </p>
              <div className="font-semibold text-gray-900">- Rajesh Kumar</div>
              <div className="text-sm text-gray-500">CSIR-NET Aspirant</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
              </div>
              <FaQuoteLeft className="text-teal-600 text-2xl mb-4" />
              <p className="text-gray-700 mb-4">
                "Perfect for last-minute doubts and quick revisions. Highly
                recommended for exam preparation!"
              </p>
              <div className="font-semibold text-gray-900">- Anjali Patel</div>
              <div className="text-sm text-gray-500">SSC Aspirant</div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter currentYear={currentYear} />
    </div>
  );
};

export default LandingPage;
