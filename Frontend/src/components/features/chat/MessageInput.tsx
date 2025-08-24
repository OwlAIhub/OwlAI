import React, { useRef, useEffect } from 'react';
import { ArrowUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  onStopTyping: () => void;
  darkMode: boolean;
  isSidebarOpen: boolean;
  loading: boolean;
  isLoggedIn: boolean;
  messageCount: number;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  onSendMessage,
  onStopTyping,
  darkMode,
  isSidebarOpen,
  loading,
  isLoggedIn,
  messageCount,
  showModal,
  setShowModal,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 150);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <>
      {/* Fixed input area */}
      <div 
        className={`fixed bottom-0 left-0 right-0 border-t p-4 ${
          darkMode
            ? "bg-owl-base-dark border-gray-700"
            : "bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 border-gray-200"
        } ${isSidebarOpen ? 'md:left-64 lg:left-72' : 'left-0'}`}
        style={{
          transition: 'left 0.7s cubic-bezier(0.25,0.1,0.25,1.1)',
          willChange: 'left'
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="relative flex items-center">
              <div className="relative flex-grow">
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask your Owl AI anything..."
                  disabled={!isLoggedIn && messageCount >= 4}
                  className={`resize-none overflow-y-auto max-h-[150px] no-scrollbar focus:outline-none focus:ring-2 pr-12 ${
                    darkMode
                      ? "bg-owl-card-dark text-white placeholder-gray-400 focus:ring-owl-primary border border-owl-base-dark"
                      : "bg-white text-gray-900 placeholder-gray-500 focus:ring-owl-primary border border-gray-200"
                  }`}
                  rows={1}
                />

                {/* Send/Stop button */}
                {loading ? (
                  <Button
                    onClick={onStopTyping}
                    size="sm"
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full
                      cursor-pointer transition-all duration-300 group shadow-sm
                      ${darkMode ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-300 text-black hover:bg-gray-400"}
                    `}
                    aria-label="Stop"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={onSendMessage}
                    size="sm"
                    disabled={!message.trim()}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full
                      cursor-pointer transition-all duration-300 group shadow-sm
                      ${darkMode ? "bg-owl-base-dark text-white hover:bg-owl-card-dark" : "bg-white text-black hover:bg-gray-100"}
                    `}
                  >
                    <ArrowUp
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110 w-4 h-4"
                    />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl text-center animate-fade-in-up max-w-md mx-auto">
            <Button
              onClick={() => setShowModal(false)}
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-400"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Hey buddy!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Thanks for choosing <span className="text-owl-primary font-semibold">Owl AI</span>. Let's prepare together.
            </p>
            <Link to="/login">
              <Button className="mt-2 bg-owl-primary hover:bg-owl-primary-dark text-white">
                Login to Continue
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
