import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageCircle, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  customRemark: string;
  setCustomRemark: (remark: string) => void;
  onSubmit: () => void;
}

const FEEDBACK_OPTIONS = [
  { label: "Not satisfied", icon: "😞" },
  { label: "Too vague", icon: "❓" },
  { label: "Irrelevant", icon: "🔄" },
  { label: "Incomplete", icon: "📝" },
  { label: "Wrong answer", icon: "❌" },
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  customRemark,
  setCustomRemark,
  onSubmit,
}) => {
  const handleQuickFeedback = (feedback: string) => {
    setCustomRemark(customRemark ? `${customRemark}, ${feedback}` : feedback);
  };

  const handleSubmit = () => {
    if (customRemark.trim()) {
      onSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <ThumbsDown className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>

          <DialogTitle className="text-xl font-semibold">
            Help us improve
          </DialogTitle>

          <p className="text-sm text-muted-foreground">
            We appreciate your feedback. Let us know what went wrong so we can
            do better.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick feedback options */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Quick feedback</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {FEEDBACK_OPTIONS.map((option) => (
                <Button
                  key={option.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickFeedback(option.label)}
                  className={cn(
                    "h-auto py-2 px-3 text-xs gap-2 hover:bg-muted",
                    customRemark.includes(option.label) &&
                      "bg-muted border-owl-primary"
                  )}
                >
                  <span>{option.icon}</span>
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom feedback */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Additional details (optional)
            </label>

            <Textarea
              placeholder="Tell us more about what went wrong..."
              value={customRemark}
              onChange={(e) => setCustomRemark(e.target.value)}
              className="min-h-[100px] resize-none focus-visible:ring-owl-primary"
              rows={4}
            />

            <div className="text-xs text-muted-foreground">
              Your feedback helps us improve our AI responses
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Skip for now
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={!customRemark.trim()}
              className="flex-1 bg-owl-primary hover:bg-owl-primary-dark"
            >
              Submit Feedback
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
