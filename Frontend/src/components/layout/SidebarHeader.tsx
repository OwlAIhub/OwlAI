import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/owl_AI_logo.png";

interface SidebarHeaderProps {
  onLogoClick: () => void;
  onClose: () => void;
  showCloseButton?: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  onLogoClick,
  onClose,
  showCloseButton = true,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b h-17">
      <Button
        onClick={onLogoClick}
        variant="ghost"
        className="flex items-center gap-3 h-auto p-0 hover:opacity-80 transition-opacity"
        aria-label="Go to home page"
      >
        <div className="bg-teal-600 rounded-full w-10 h-10 overflow-hidden flex-shrink-0">
          <img
            src={Logo}
            alt="OwlAI Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-bold text-lg text-foreground">Owl AI</span>
      </Button>

      {showCloseButton && (
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
