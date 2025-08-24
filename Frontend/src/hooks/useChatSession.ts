import { useState } from "react";
import { storage } from "@/utils";
import { STORAGE_KEYS } from "@/constants";
import { toast } from "react-toastify";

interface UseChatSessionReturn {
  currentChatTitle: string;
  setCurrentChatTitle: (title: string) => void;
  selectedChatId: string | null;
  setSelectedChatId: (id: string | null) => void;
  handleNewChat: (
    createSession: (userId: string) => Promise<string | null>,
    userId?: string
  ) => Promise<void>;
}

export const useChatSession = (): UseChatSessionReturn => {
  const [currentChatTitle, setCurrentChatTitle] = useState("Learning Theories");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const handleNewChat = async (
    createSession: (userId: string) => Promise<string | null>,
    userId?: string
  ) => {
    const user = storage.get(STORAGE_KEYS.USER);

    if (!user || !userId) {
      toast.error("Please log in to start a new chat");
      return;
    }

    try {
      // Clear previous session data
      storage.remove(STORAGE_KEYS.SESSION_ID);
      storage.remove(STORAGE_KEYS.SELECTED_CHAT);

      // Create new session
      const newSessionId = await createSession(userId);

      if (newSessionId) {
        setCurrentChatTitle("New Chat");
        toast.success("New chat started!");

        // Dispatch events to notify other components
        window.dispatchEvent(new CustomEvent("newSessionCreated"));
        window.dispatchEvent(new CustomEvent("sessionChanged"));
      }
    } catch (err) {
      console.error("Failed to create new session:", err);
      toast.error("Failed to start new chat");
    }
  };

  return {
    currentChatTitle,
    setCurrentChatTitle,
    selectedChatId,
    setSelectedChatId,
    handleNewChat,
  };
};
