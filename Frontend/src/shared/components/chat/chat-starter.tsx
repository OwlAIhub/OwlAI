import React from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  GraduationCap,
  BookOpen,
  Brain,
  Lightbulb,
} from "lucide-react";
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
    id: "teaching-aptitude",
    title: "Teaching Aptitude",
    description: "Teaching methods & pedagogy",
    prompt: "Explain the key principles of effective teaching methods for UGC NET Paper 1",
    icon: <GraduationCap className="h-5 w-5" />,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    id: "research-aptitude",
    title: "Research Aptitude", 
    description: "Research methodology concepts",
    prompt: "Help me understand research methodology and design for UGC NET Paper 1",
    icon: <BookOpen className="h-5 w-5" />,
    gradient: "from-green-500 to-green-600",
  },
  {
    id: "logical-reasoning",
    title: "Logical Reasoning",
    description: "Logic & analytical thinking",
    prompt: "Give me practice questions on logical reasoning for UGC NET Paper 1",
    icon: <Brain className="h-5 w-5" />,
    gradient: "from-purple-500 to-purple-600",
  },
  {
    id: "general-awareness",
    title: "General Awareness",
    description: "Current affairs & GK",
    prompt: "Test my knowledge on current affairs and general awareness for UGC NET",
    icon: <Lightbulb className="h-5 w-5" />,
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

      {/* Compact Starter Prompts */}
      <div className="w-full max-w-2xl">
        <div className="grid grid-cols-2 gap-3">
          {starterPrompts.map((prompt, index) => (
            <Card
              key={prompt.id}
              className="group cursor-pointer border border-border/40 hover:border-teal-400/60 transition-all duration-200 hover:shadow-sm animate-in fade-in slide-in-from-bottom-2"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "both",
              }}
              onClick={() => onPromptSelect(prompt.prompt)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${prompt.gradient} text-white shadow-sm group-hover:scale-105 transition-transform duration-200`}
                  >
                    <div className="w-4 h-4">{prompt.icon}</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-foreground group-hover:text-teal-600 transition-colors duration-200">
                      {prompt.title}
                    </h3>
                    <p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-1">
                      {prompt.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
