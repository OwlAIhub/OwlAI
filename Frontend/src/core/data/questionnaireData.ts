import ugcNetLogo from "@/assets/ugc-net.png";
import csirNetLogo from "@/assets/csir.webp";

export const languages = ["English", "Hinglish"];

export const curricula = [
  { label: "UGC-NET", value: "UGC-NET", logo: ugcNetLogo },
  { label: "CSIR-NET", value: "CSIR-NET", logo: csirNetLogo },
];

export const ugcNetSubjects = [
  "Paper 1",
  "Computer Science and Applications",
  "Economics",
  "History",
  "Law",
  "Commerce",
  "Political Science",
  "Psychology",
  "Management",
  "Education",
  "Other",
];

export const csirNetSubjects = [
  "Chemical Sciences",
  "Earth Sciences",
  "Life Sciences",
  "Mathematical Sciences",
  "Physical Sciences",
];

export const attemptsEnglish = [
  { label: "1st attempt (newbie 🚀)", value: "1st" },
  { label: "2nd attempt (returning 🔄)", value: "2nd" },
  { label: "3rd + attempt (pro grinder 💪)", value: "3rd+" },
];

export const attemptsHinglish = [
  { label: "1st attempt 🤞", value: "1st" },
  { label: "2nd attempt 🔄", value: "2nd" },
  { label: "3rd + attempt 💪", value: "3rd+" },
];

export const sources = [
  "Google Search",
  "Instagram Reel",
  "YouTube",
  "Friend / Senior",
  "Teacher / Coaching",
  "Telegram",
  "Other",
];

export const examCyclesEnglish = [
  "June 2025",
  "Dec 2025",
  "Jan 2026",
  "June 2026",
  "Not sure yet",
];

export const examCyclesHinglish = [
  "June 2025",
  "Dec 2025",
  "Jan 2026",
  "June 2026",
  "Not sure yet",
];

export const steps = [
  {
    step: 1,
    title: "What's your name?",
    description: "Let's start with the basics. What should we call you?",
  },
  {
    step: 2,
    title: "Choose your language",
    description: "Select your preferred language for our interactions.",
  },
  {
    step: 3,
    title: "Select your curriculum",
    description: "Which exam are you preparing for?",
  },
  {
    step: 4,
    title: "Choose your subjects",
    description: "Select the subjects you want to focus on.",
  },
  {
    step: 5,
    title: "How many attempts?",
    description: "This helps us personalize your experience.",
  },
  {
    step: 6,
    title: "How did you find us?",
    description: "We'd love to know how you discovered OwlAI!",
  },
  {
    step: 7,
    title: "When's your exam?",
    description: "This helps us create a personalized study plan.",
  },
];
