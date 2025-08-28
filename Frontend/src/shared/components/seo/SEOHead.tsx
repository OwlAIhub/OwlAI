import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  structuredData?: object;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Owl AI - Your AI Learning Assistant for UGC NET, CSIR-NET & Competitive Exams",
  description = "Get instant answers to your study questions with Owl AI. Powered by advanced AI to help you excel in UGC NET, CSIR-NET, SSC, CTET and other competitive exams.",
  keywords = "UGC NET, CSIR-NET, SSC, CTET, competitive exams, AI learning assistant, study help, exam preparation",
  image = "https://owlai.com/og-image.png",
  url = "https://owlai.com",
  type = "website",
  publishedTime,
  modifiedTime,
  author = "Owl AI",
  section,
  tags = [],
  structuredData,
}) => {
  const fullTitle = title.includes("Owl AI") ? title : `${title} | Owl AI`;
  const fullUrl = url.startsWith("http") ? url : `https://owlai.com${url}`;
  const fullImage = image.startsWith("http")
    ? image
    : `https://owlai.com${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Owl AI" />
      <meta property="og:locale" content="en_US" />

      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {section && <meta property="article:section" content={section} />}
      {tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

// Predefined SEO configurations for different pages
export const SEOConfigs = {
  home: {
    title:
      "Owl AI - Your AI Learning Assistant for UGC NET, CSIR-NET & Competitive Exams",
    description:
      "Get instant answers to your study questions with Owl AI. Powered by advanced AI to help you excel in UGC NET, CSIR-NET, SSC, CTET and other competitive exams. 24/7 AI support with expert-curated content.",
    keywords:
      "UGC NET, CSIR-NET, SSC, CTET, competitive exams, AI learning assistant, study help, exam preparation, teaching aptitude, research methodology, logical reasoning, Paper 1 syllabus",
    url: "https://owlai.com",
  },
  chat: {
    title: "AI Chat - Get Instant Study Help | Owl AI",
    description:
      "Chat with our AI assistant to get instant help with UGC NET, CSIR-NET, SSC, CTET and other competitive exam questions. 24/7 support available.",
    keywords:
      "AI chat, study help, UGC NET help, CSIR-NET assistance, exam preparation chat, instant answers",
    url: "https://owlai.com/chat",
  },
  auth: {
    title: "Sign In - Owl AI",
    description:
      "Sign in to Owl AI to access your personalized learning experience and AI-powered study assistance.",
    keywords: "sign in, login, Owl AI account, user authentication",
    url: "https://owlai.com/auth",
  },
  questionnaire: {
    title: "Personalized Setup - Owl AI",
    description:
      "Complete our quick questionnaire to personalize your learning experience with Owl AI for your specific exam preparation needs.",
    keywords: "personalization, exam setup, learning preferences, study plan",
    url: "https://owlai.com/questionnaire",
  },
  subscription: {
    title: "Subscription Plans - Owl AI",
    description:
      "Choose the perfect subscription plan for your exam preparation needs. Get unlimited access to AI-powered study assistance.",
    keywords: "subscription plans, pricing, premium features, unlimited access",
    url: "https://owlai.com/subscription",
  },
  ugcNet: {
    title: "UGC NET Preparation - Complete Guide & AI Assistance | Owl AI",
    description:
      "Comprehensive UGC NET preparation with AI-powered assistance. Cover Paper 1, Computer Science, Mathematics, Physics, Chemistry and more with expert-curated content.",
    keywords:
      "UGC NET, Paper 1, Computer Science, Mathematics, Physics, Chemistry, Assistant Professor, JRF, university exam",
    url: "https://owlai.com/ugc-net",
  },
  csirNet: {
    title: "CSIR-NET Preparation - Scientific Research Exam Guide | Owl AI",
    description:
      "Specialized CSIR-NET preparation for Life Sciences, Physical Sciences, and Chemical Sciences. Get AI-powered assistance for scientific research positions.",
    keywords:
      "CSIR-NET, Life Sciences, Physical Sciences, Chemical Sciences, scientific research, research positions",
    url: "https://owlai.com/csir-net",
  },
  ssc: {
    title: "SSC CGL Preparation - Government Services Exam | Owl AI",
    description:
      "Complete SSC CGL preparation with AI assistance. Cover General Studies, Quantitative Aptitude, and English for government job opportunities.",
    keywords:
      "SSC CGL, government services, General Studies, Quantitative Aptitude, English, government jobs",
    url: "https://owlai.com/ssc-cgl",
  },
  ctet: {
    title: "CTET Preparation - Teaching Certification Exam | Owl AI",
    description:
      "Professional CTET preparation with teaching-specific content. Cover Child Development, Pedagogy, Language, and Mathematics for teaching positions.",
    keywords:
      "CTET, teaching certification, Child Development, Pedagogy, Language, Mathematics, teaching positions",
    url: "https://owlai.com/ctet",
  },
};
