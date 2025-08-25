import React from "react";
import {
  FaQuoteLeft,
  FaStar,
  FaGraduationCap,
  FaUserGraduate,
  FaBookOpen,
} from "react-icons/fa";
import { motion } from "framer-motion";

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "UGC-NET Aspirant",
      exam: "UGC-NET",
      avatar: "PS",
      quote:
        "Owl AI helped me understand complex topics in minutes. The explanations are clear and easy to follow. I cleared my UGC-NET exam in my first attempt!",
      rating: 5,
      achievement: "Cleared UGC-NET 2024",
      icon: <FaGraduationCap className="w-4 h-4" />,
    },
    {
      name: "Rajesh Kumar",
      role: "CSIR-NET Aspirant",
      exam: "CSIR-NET",
      avatar: "RK",
      quote:
        "The AI responses are incredibly accurate and helped me save hours of research time. The personalized study plans made all the difference.",
      rating: 5,
      achievement: "JRF Qualified",
      icon: <FaUserGraduate className="w-4 h-4" />,
    },
    {
      name: "Anjali Patel",
      role: "SSC Aspirant",
      exam: "SSC CGL",
      avatar: "AP",
      quote:
        "Perfect for last-minute doubts and quick revisions. The practice questions and mock tests are exactly what I needed. Highly recommended!",
      rating: 5,
      achievement: "SSC CGL Selected",
      icon: <FaBookOpen className="w-4 h-4" />,
    },
    {
      name: "Dr. Meera Singh",
      role: "Assistant Professor",
      exam: "UGC-NET",
      avatar: "MS",
      quote:
        "As a teacher, I'm impressed by how well Owl AI explains concepts. It's like having a personal tutor available 24/7. My students love it!",
      rating: 5,
      achievement: "Teaching at DU",
      icon: <FaGraduationCap className="w-4 h-4" />,
    },
    {
      name: "Amit Verma",
      role: "Research Scholar",
      exam: "CSIR-NET",
      avatar: "AV",
      quote:
        "The research methodology explanations are top-notch. Owl AI helped me understand complex statistical concepts that I struggled with for months.",
      rating: 5,
      achievement: "PhD Candidate",
      icon: <FaUserGraduate className="w-4 h-4" />,
    },
    {
      name: "Kavya Reddy",
      role: "Banking Aspirant",
      exam: "IBPS",
      avatar: "KR",
      quote:
        "The banking-specific content and current affairs updates are excellent. I got selected in SBI PO thanks to Owl AI's comprehensive preparation.",
      rating: 5,
      achievement: "SBI PO Selected",
      icon: <FaBookOpen className="w-4 h-4" />,
    },
  ];

  const stats = [
    { number: "10,000+", label: "Students Helped" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "AI Support" },
    { number: "50+", label: "Exam Categories" },
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200 mb-4"
          >
            <FaQuoteLeft className="text-teal-600 w-3 h-3" />
            <span className="text-teal-700 text-xs font-medium">
              Student Success Stories
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            What Students{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-teal-500 to-teal-700 bg-clip-text text-transparent">
                Say
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
            Hear from thousands of students who have transformed their exam
            preparation with Owl AI. Real success stories from real students.
          </motion.p>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all duration-300">
                <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent mb-1">
                  {stat.number}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative h-full"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-teal-50/50 transition-all duration-300 hover:border-teal-200 relative overflow-hidden h-full flex flex-col">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 text-teal-100 group-hover:text-teal-200 transition-colors duration-300">
                  <FaQuoteLeft className="w-6 h-6" />
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 w-4 h-4" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 mb-4 leading-relaxed text-sm flex-grow">
                  "{testimonial.quote}"
                </p>

                {/* Achievement Badge */}
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-50 to-teal-100/50 px-3 py-1.5 rounded-full border border-teal-200/50 mb-4">
                  <div className="text-teal-600">{testimonial.icon}</div>
                  <span className="text-teal-700 text-xs font-medium">
                    {testimonial.achievement}
                  </span>
                </div>

                {/* Author Info */}
                <div className="flex items-center space-x-3 mt-auto">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm mb-0.5">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-gray-600 mb-0.5">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-teal-600 font-semibold tracking-wide uppercase">
                      {testimonial.exam}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-4xl mx-auto relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Join Our Success Stories?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-base">
                Start your journey with Owl AI today and become the next success
                story. Join thousands of students who have already achieved
                their dreams.
              </p>
              <button className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                Start Your Success Story
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
