import React from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="min-h-screen flex items-center bg-white">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Students Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from students who have improved their exam preparation with Owl
            AI
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
              "The AI responses are incredibly accurate and helped me save hours
              of research time."
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
  );
};
