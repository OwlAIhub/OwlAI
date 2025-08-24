import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  customRemark: string;
  setCustomRemark: (remark: string) => void;
  onSubmit: () => void;
  darkMode: boolean;
}

const FEEDBACK_OPTIONS = [
  "Not satisfied", 
  "Too vague", 
  "Irrelevant", 
  "Incomplete", 
  "Wrong answer"
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  customRemark,
  setCustomRemark,
  onSubmit,
  darkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <Card className={`w-96 relative shadow-lg ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <CardHeader className="relative">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <CardTitle className={`text-lg font-semibold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}>
            Tell us what went wrong
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Predefined feedback options */}
          <div className="flex flex-wrap gap-2">
            {FEEDBACK_OPTIONS.map((label) => (
              <Button
                key={label}
                variant="outline"
                size="sm"
                onClick={() => setCustomRemark(label)}
                className={`text-sm ${
                  darkMode 
                    ? "bg-gray-700 text-white hover:bg-gray-600 border-gray-600" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
                }`}
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Custom feedback textarea */}
          <Textarea
            placeholder="Write your feedback..."
            value={customRemark}
            onChange={(e) => setCustomRemark(e.target.value)}
            className={`resize-none ${
              darkMode 
                ? "bg-gray-700 text-white border-owl-primary focus:border-owl-primary" 
                : "bg-white text-gray-900 border-gray-300 focus:border-owl-primary"
            }`}
            rows={3}
          />

          {/* Action buttons */}
          <div className="flex justify-end gap-2">
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>

            <Button
              onClick={onSubmit}
              size="sm"
              className="bg-owl-primary hover:bg-owl-primary-dark text-white"
            >
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
