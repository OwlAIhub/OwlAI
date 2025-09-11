"use client";

import {
  ResponsiveContainer,
  ResponsiveImage,
  ResponsiveText,
} from "@/components/ui/responsive-container";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Target, Users } from "lucide-react";

const featureTiles = [
  "Expert-curated content",
  "Latest syllabus coverage",
  "Practice questions",
  "Mock tests",
  "Instant doubt resolution",
];

const exams = [
  {
    title: "UGC-NET",
    description:
      "Comprehensive preparation for University Grants Commission National Eligibility Test with specialized content for Assistant Professor and JRF positions.",
    icon: <GraduationCap className="w-6 h-6 text-primary" />,
    image: "/UGC.webp",
    subjects: [
      "Paper I",
      "Paper II",
      "Teaching Aptitude",
      "Research Methodology",
    ],
  },
  {
    title: "CSIR-NET",
    description:
      "Expert guidance for Council of Scientific and Industrial Research National Eligibility Test covering all science subjects with detailed explanations.",
    icon: <BookOpen className="w-6 h-6 text-primary" />,
    image: "/CSIR.webp",
    subjects: [
      "Chemical Sciences",
      "Physical Sciences",
      "Life Sciences",
      "Mathematical Sciences",
    ],
  },
  {
    title: "SSC",
    description:
      "Complete preparation for Staff Selection Commission exams including CGL, CHSL, MTS with practice tests and performance analytics.",
    icon: <Target className="w-6 h-6 text-primary" />,
    image: "/SSC.webp",
    subjects: [
      "General Intelligence",
      "General Knowledge",
      "Quantitative Aptitude",
      "English Language",
    ],
  },
  {
    title: "CTET",
    description:
      "Specialized content for Central Teacher Eligibility Test with child development pedagogy and subject-specific teaching methods.",
    icon: <Users className="w-6 h-6 text-primary" />,
    image: "/CTET.webp",
    subjects: [
      "Child Development",
      "Pedagogy",
      "Language I & II",
      "Mathematics & Science",
    ],
  },
];

export function ExamsSection() {
  return (
    <section
      id="exams"
      className="min-h-screen flex items-start justify-center px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 lg:pb-16 bg-white"
    >
      <ResponsiveContainer maxWidth="7xl" padding="none">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary/10 rounded-2xl mb-3 sm:mb-4 md:mb-5"
          >
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary" />
          </motion.div>
          <ResponsiveText
            as="h2"
            fluid={true}
            clamp={{
              min: "1.5rem",
              preferred: "0.875rem + 3vw",
              max: "2.25rem",
            }}
            className="font-bold text-foreground mb-3 sm:mb-4 md:mb-5 leading-tight px-4"
          >
            <span className="text-foreground">Supported </span>
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent relative">
              Exams
              {/* Elegant decorative underline */}
              <div className="absolute -bottom-2 left-0 right-0">
                {/* Main underline with gradient */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"></div>
                {/* Subtle accent line */}
                <div className="w-3/4 h-0.5 bg-gradient-to-r from-primary/40 to-accent/40 mx-auto mt-1 rounded-full"></div>
                {/* Decorative dot */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
              </div>
            </span>
          </ResponsiveText>
          <ResponsiveText
            as="p"
            size="lg"
            className="text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4"
          >
            Comprehensive preparation for all major competitive exams with
            AI-powered personalized learning
          </ResponsiveText>
        </motion.div>

        {/* Feature Tiles */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-12 px-4">
          {featureTiles.map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <div className="w-2 h-2 bg-primary rounded-full" />
              <ResponsiveText
                as="p"
                className="text-xs sm:text-sm font-medium text-foreground"
              >
                {feature}
              </ResponsiveText>
            </motion.div>
          ))}
        </div>

        {/* Exam Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 px-4">
          {exams.map((exam, index) => (
            <motion.div
              key={exam.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-lg p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 hover:border-primary/30"
            >
              {/* Exam Header */}
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">{exam.icon}</div>
                <ResponsiveImage
                  src={exam.image}
                  alt={exam.title}
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
              </div>

              {/* Exam Title */}
              <ResponsiveText
                as="h3"
                className="text-base sm:text-lg font-bold text-foreground mb-2 sm:mb-3"
              >
                {exam.title}
              </ResponsiveText>

              {/* Exam Description */}
              <ResponsiveText
                as="p"
                className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed"
              >
                {exam.description}
              </ResponsiveText>

              {/* Subjects */}
              <div className="space-y-2 sm:space-y-3">
                <ResponsiveText
                  as="p"
                  className="text-xs font-semibold text-foreground uppercase tracking-wide"
                >
                  Key Subjects:
                </ResponsiveText>
                <div className="space-y-1.5 sm:space-y-2">
                  {exam.subjects.slice(0, 3).map((subject) => (
                    <div key={subject} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span className="text-xs text-muted-foreground">
                        {subject}
                      </span>
                    </div>
                  ))}
                  {exam.subjects.length > 3 && (
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                      <span className="text-xs text-muted-foreground">
                        +{exam.subjects.length - 3} more
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subtle CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-6 sm:mt-8"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
            <div className="w-1 h-1 bg-primary rounded-full" />
            <span>Choose your exam to begin</span>
            <div className="w-1 h-1 bg-primary rounded-full" />
          </div>
        </motion.div>
      </ResponsiveContainer>
    </section>
  );
}
