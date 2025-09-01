// Questionnaire Data for User Onboarding
// This file contains all the static data needed for the questionnaire steps

export const languages = [
  "English",
  "Hindi",
  "Hinglish (Hindi + English)",
  "Regional Languages",
];

export const curricula = [
  {
    id: "UGC-NET",
    name: "UGC-NET",
    description: "National Eligibility Test for Assistant Professor & JRF",
  },
  {
    id: "CSIR-NET",
    name: "CSIR-NET",
    description:
      "Council of Scientific & Industrial Research National Eligibility Test",
  },
  {
    id: "SSC",
    name: "SSC CGL",
    description: "Staff Selection Commission Combined Graduate Level",
  },
  {
    id: "CTET",
    name: "CTET",
    description: "Central Teacher Eligibility Test",
  },
];

export const ugcNetSubjects = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Life Sciences",
  "Economics",
  "Commerce",
  "Management",
  "English Literature",
  "Hindi Literature",
  "History",
  "Political Science",
  "Sociology",
  "Psychology",
  "Geography",
  "Other",
];

export const csirNetSubjects = [
  "Life Sciences",
  "Physical Sciences",
  "Chemical Sciences",
  "Mathematical Sciences",
  "Earth Sciences",
  "Other",
];

export const attemptsEnglish = [
  "First Attempt",
  "Second Attempt",
  "Third Attempt",
  "Fourth Attempt",
  "Fifth or More Attempts",
];

export const attemptsHinglish = [
  "पहली बार",
  "दूसरी बार",
  "तीसरी बार",
  "चौथी बार",
  "पांचवीं या उससे ज्यादा बार",
];

export const sources = [
  "Social Media (Facebook, Instagram, Twitter)",
  "Search Engine (Google, Bing)",
  "Friend/Family Recommendation",
  "Online Advertisement",
  "Educational Website",
  "YouTube/Video Content",
  "Newspaper/Magazine",
  "College/University",
  "Other",
];

export const examCyclesEnglish = [
  "June 2024",
  "December 2024",
  "June 2025",
  "December 2025",
  "Not Sure Yet",
];

export const examCyclesHinglish = [
  "जून 2024",
  "दिसंबर 2024",
  "जून 2025",
  "दिसंबर 2025",
  "अभी तय नहीं",
];

export const steps = [
  {
    id: 1,
    title: "Personal Information",
    description: "Tell us about yourself",
  },
  {
    id: 2,
    title: "Language Preference",
    description: "Choose your preferred language",
  },
  {
    id: 3,
    title: "Target Exam",
    description: "Select your target examination",
  },
  {
    id: 4,
    title: "Subject Selection",
    description: "Choose your subjects",
  },
  {
    id: 5,
    title: "Attempt Number",
    description: "How many times have you attempted?",
  },
  {
    id: 6,
    title: "How did you hear about us?",
    description: "Help us understand your source",
  },
  {
    id: 7,
    title: "Exam Cycle",
    description: "When are you planning to appear?",
  },
];
