import React from "react";
import owlLogo from "@/assets/owl-ai-logo.png";

interface StarterPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: React.ReactNode;
  gradient: string;
}

interface ChatStarterProps {
  onPromptSelect: (prompt: string) => void;
}

const starterPrompts: StarterPrompt[] = [
  {
    id: "teaching-levels",
    title: "",
    description: "",
    prompt: "What are the levels of teaching? Who are their main proponents?",
    icon: <></>,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    id: "research-types",
    title: "",
    description: "",
    prompt:
      "Differentiate between Basic and Applied research with one example.",
    icon: <></>,
    gradient: "from-green-500 to-green-600",
  },
  {
    id: "communication-rule",
    title: "",
    description: "",
    prompt: "What is Mehrabian's 7-38-55 rule of communication?",
    icon: <></>,
    gradient: "from-purple-500 to-purple-600",
  },
  {
    id: "intercultural-barriers",
    title: "",
    description: "",
    prompt: "What does LENS stand for in intercultural barriers?",
    icon: <></>,
    gradient: "from-orange-500 to-orange-600",
  },
];

export const ChatStarter: React.FC<ChatStarterProps> = ({ onPromptSelect }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-3xl mx-auto">
      {/* Minimal Logo and Welcome */}
      <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-teal-500/90 to-teal-600/90 flex items-center justify-center rounded-2xl shadow-sm border border-white/10">
          <img
            src={owlLogo}
            alt="OwlAI Logo"
            className="w-7 h-7 object-contain filter brightness-110"
          />
        </div>

        <h1 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
            OwlAI
          </span>
        </h1>

        <p className="text-sm text-muted-foreground/80 max-w-md mx-auto">
          Choose a starting point or ask me anything
        </p>
      </div>

      {/* Modern Starter Prompts */}
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {starterPrompts.map((prompt, index) => (
            <div
              key={prompt.id}
              className="group cursor-pointer relative overflow-hidden rounded-lg border border-gray-200 bg-white hover:border-teal-300 hover:bg-white transition-all duration-200 shadow-sm hover:shadow-sm hover:shadow-teal-500/5 animate-in fade-in slide-in-from-bottom-2 hover:-translate-y-0.5"
              style={{
                animationDelay: `${index * 80}ms`,
                animationFillMode: "both",
              }}
              onClick={() => onPromptSelect(prompt.prompt)}
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              <div className="relative px-4 py-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-teal-600 transition-colors duration-200 leading-normal text-left">
                  {prompt.prompt}
                </p>
              </div>

              {/* Subtle accent line */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-teal-400/0 via-teal-400 to-teal-400/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Subtle hint */}
      <div className="mt-6 text-center animate-in fade-in duration-700 delay-300">
        <p className="text-xs text-muted-foreground/50">
          Click a card or type below
        </p>
      </div>
    </div>
  );
};
