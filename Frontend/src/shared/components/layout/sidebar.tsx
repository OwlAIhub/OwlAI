import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProps, ChatSession, User } from "../../types";
import { api } from "@/services/api";
import { storage, deviceUtils } from "../../utils";
import { STORAGE_KEYS } from "../../constants";
import { toast } from "react-toastify";
import { auth } from "../../../core/firebase";
import { db } from "../../../core/database/firestore.config";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { SidebarHeader } from "./sidebar-header";
import { NewChatButton } from "./new-chat-button";
import { SidebarSearch as SearchBar } from "../sidebar/sidebar-search";
import { SidebarChatList as ChatList } from "./sidebar-chat-list";
import { SidebarUserProfile as UserProfileSection } from "../sidebar/sidebar-user-profile";

// Interface for ChatList component
interface Chat {
  id: string;
  title: string;
  lastUpdated: string;
  numChats: number;
  startTime: string;
  starred: boolean;
}

// Convert ChatSession to Chat for ChatList component
const convertChatSessionToChat = (chatSession: ChatSession): Chat => ({
  id: chatSession.id,
  title: chatSession.title,
  lastUpdated: chatSession.updated_at,
  numChats: chatSession.message_count,
  startTime: chatSession.created_at,
  starred: false, // ChatSession doesn't have starred property
});

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose = () => {},
  onSelectChat = () => {},
  activeChatId = null,
  setChats = () => {},
  onUserProfileClick = () => {},
  setSesssionId,
}) => {
  // State Management
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [_editingChatId, setEditingChatId] = useState<string | null>(null);
  const [isMidRange, setIsMidRange] = useState(false);
  const [chatStore, setChatStore] = useState<ChatSession[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [, setLoading] = useState(true);

  const navigate = useNavigate();
  const studentData = storage.get<User>(STORAGE_KEYS.USER);

  // Firebase Auth Effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data() as User;
            storage.set(STORAGE_KEYS.USER_PROFILE, userData);
            setUser(userData);
          } else {
            // No user data found
            storage.remove(STORAGE_KEYS.USER_PROFILE);
            setUser(null);
          }
        } catch {
          // Error fetching user data
          storage.remove(STORAGE_KEYS.USER_PROFILE);
          setUser(null);
        }
      } else {
        storage.remove(STORAGE_KEYS.USER_PROFILE);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const cachedUser = storage.get<User>(STORAGE_KEYS.USER_PROFILE);
    if (cachedUser) {
      setUser(cachedUser);
    }
  }, []);

  // Screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(deviceUtils.isMobile());
      setIsMidRange(deviceUtils.isMidRange());
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Chat fetching
  const fetchChats = useCallback(async () => {
    if (!studentData?.uid) return;

    try {
      const response = (await api.chat.getConversations(1, 50)) as {
        data?: Array<{
          id: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          message_count?: number;
          last_message?: string;
        }>;
      };

      if (response && response.data) {
        const formattedChats: ChatSession[] = response.data.map(c => ({
          id: c.id,
          title: c.title || "Untitled Chat",
          created_at: c.created_at || new Date().toISOString(),
          updated_at: c.updated_at || new Date().toISOString(),
          user_id: c.user_id || studentData.uid,
          message_count: c.message_count || 0,
          last_message: c.last_message || "",
        }));

        setChats(formattedChats);
        setChatStore(formattedChats);
      }
    } catch {
      // ignore fetch errors
    }
  }, [studentData?.uid, setChats]);

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchChats();
    }, 300);

    const handleNewChatMessage = () => {
      clearTimeout(debounceFetch);
      fetchChats();
    };

    window.addEventListener("newChatMessage", handleNewChatMessage);

    return () => {
      clearTimeout(debounceFetch);
      window.removeEventListener("newChatMessage", handleNewChatMessage);
    };
  }, [fetchChats]);

  // Chat actions
  const renameChat = async (chatId: string, newTitle: string) => {
    try {
      const response = await api.chat.updateConversation(chatId, {
        title: newTitle,
      });

      if (response && (response as any).data) {
        const updatedChats = chatStore.map(chat =>
          chat.id === chatId ? { ...chat, title: newTitle } : chat
        );
        setChats(updatedChats);
        setChatStore(updatedChats);
        setEditingChatId(null);
        toast.success("Chat renamed successfully");
      }
    } catch {
      toast.error("Failed to rename chat");
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      const response = await api.chat.deleteConversation(chatId);

      if (response) {
        const filteredChats = chatStore.filter(chat => chat.id !== chatId);
        setChats(filteredChats);
        setChatStore(filteredChats);
        toast.success("Chat deleted successfully");

        if (activeChatId === chatId) {
          onSelectChat("");
        }
      }
    } catch {
      toast.error("Failed to delete chat");
    }
  };

  const createNewSession = async (userId: string) => {
    try {
      const response = await api.session.createUserSession(userId);
      return response.data?.session_id || null;
    } catch {
      toast.error("Failed to create chat session");
      return null;
    }
  };

  // Event handlers
  const handleLogoClick = () => {
    navigate("/");
    if (isMobile || isMidRange) onClose();
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Please log in to access your profile.");
      navigate("/login");
      if (isMobile || isMidRange) onClose();
      return;
    }

    onUserProfileClick();
    if (isMobile || isMidRange) onClose();
  };

  const handleNewChatClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    storage.remove(STORAGE_KEYS.SELECTED_CHAT);

    if (!studentData) {
      alert("Please log in to start a new chat.");
      navigate("/login");
      if (isMobile || isMidRange) onClose();
      return;
    }

    try {
      storage.remove(STORAGE_KEYS.SESSION_ID);

      const newSessionId = await createNewSession(studentData.uid);

      if (newSessionId) {
        storage.set(STORAGE_KEYS.SESSION_ID, newSessionId);

        if (setSesssionId) {
          setSesssionId(newSessionId);
        }

        toast.success("New chat started!");

        window.dispatchEvent(
          new CustomEvent("newSessionCreated", {
            detail: { sessionId: newSessionId },
          })
        );

        window.dispatchEvent(new CustomEvent("clearChatMessages"));
      }
    } catch {
      toast.error("Failed to start new chat");
    }

    if (isMobile || isMidRange) onClose();
  };

  const handleChatClick = (chat: ChatSession) => {
    storage.set(STORAGE_KEYS.SELECTED_CHAT, chat);
    window.dispatchEvent(new CustomEvent("chatSelected", { detail: chat }));
    onSelectChat(chat.id);
    if (isMobile || isMidRange) onClose();
  };

  const handleStarToggle = (chatId: string) => {
    // ChatSession doesn't have starred property, so we'll just update the store
    const updatedChats = chatStore.map(chat =>
      chat.id === chatId ? { ...chat } : chat
    );
    setChats(updatedChats);
    setChatStore(updatedChats);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Convert ChatSession[] to Chat[] for ChatList component
  const chatListData: Chat[] = chatStore.map(convertChatSessionToChat);

  return (
    <div
      className={`fixed inset-y-0 z-20 bg-white border-r border-gray-100 transition-all duration-300 ease-in-out w-64 lg:w-72 flex flex-col ${
        isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <SidebarHeader onLogoClick={handleLogoClick} onClose={onClose} />

      {/* Search */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        darkMode={false}
      />

      {/* New Chat Button */}
      <NewChatButton
        onNewChat={() => handleNewChatClick({} as React.MouseEvent)}
      />

      {/* Chat List */}
      <ChatList
        chats={chatListData}
        activeChatId={activeChatId}
        searchQuery={searchQuery}
        onSelectChat={(chatId: string) => {
          const chat = chatStore.find(c => c.id === chatId);
          if (chat) handleChatClick(chat);
        }}
        onStarToggle={handleStarToggle}
        onRenameChat={renameChat}
        onDeleteChat={deleteChat}
        darkMode={false}
      />

      {/* User Profile */}
      <UserProfileSection
        user={user}
        onUserProfileClick={() => handleProfileClick({} as React.MouseEvent)}
        darkMode={false}
      />
    </div>
  );
};
