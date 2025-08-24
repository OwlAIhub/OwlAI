import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProps, ChatSession, User } from "@/types";
import { api } from "@/services/api";
import { storage, deviceUtils } from "@/utils";
import { STORAGE_KEYS } from "@/constants";
import { toast } from "react-toastify";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  SidebarHeader,
  SearchBar,
  NewChatButton,
  ChatList,
  UserProfileSection,
} from "./";

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose = () => {},
  onSelectChat = () => {},
  currentUser = {},
  activeChatId = null,
  setChats = () => {},
  onUserProfileClick = () => {},
  setSesssionId,
}) => {
  // State Management
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [isMidRange, setIsMidRange] = useState(false);
  const [chatStore, setChatStore] = useState<ChatSession[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [, setLoading] = useState(true);

  const navigate = useNavigate();
  const studentData = storage.get<User>(STORAGE_KEYS.USER);

  // Firebase Auth Effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data() as User;
            storage.set(STORAGE_KEYS.USER_PROFILE, userData);
            setUser(userData);
          } else {
            console.log("No user data found");
            storage.remove(STORAGE_KEYS.USER_PROFILE);
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
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
      const response = await api.chat.getChatSessions(studentData.uid);

      if (response.status === "success" && response.data) {
        const formattedChats: ChatSession[] = response.data.map(
          (session: any) => ({
            id: session.session_id || session.id,
            title: session.title,
            lastUpdated: session.last_updated || session.lastUpdated,
            numChats: session.num_chats || session.numChats,
            startTime: session.start_time || session.startTime,
            starred: session.starred || false,
          })
        );

        setChats(formattedChats);
        setChatStore(formattedChats);
      }
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
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
      const response = await api.session.renameSession(chatId, newTitle);

      if (response.status === "success") {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId ? { ...chat, title: newTitle } : chat
          )
        );
        setChatStore((prev) =>
          prev.map((chat) =>
            chat.id === chatId ? { ...chat, title: newTitle } : chat
          )
        );
        setEditingChatId(null);
        toast.success("Chat renamed successfully");
      }
    } catch (err) {
      console.error("Rename failed:", err);
      toast.error("Failed to rename chat");
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      const response = await api.session.deleteSession(chatId);

      if (response.status === "success") {
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
        setChatStore((prev) => prev.filter((chat) => chat.id !== chatId));
        toast.success("Chat deleted successfully");

        if (activeChatId === chatId) {
          onSelectChat(null);
        }
      }
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete chat");
    }
  };

  const createNewSession = async (userId: string) => {
    try {
      const response = await api.session.createSession(userId);
      return response.data?.session_id || null;
    } catch (err) {
      console.error("Failed to create session:", err);
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
    } catch (err) {
      console.error("Failed to start new chat:", err);
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

  const handleStarToggle = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, starred: !chat.starred } : chat
      )
    );
    setChatStore((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, starred: !chat.starred } : chat
      )
    );
  };

  const handleEditStart = (
    chatId: string,
    currentTitle: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setEditingChatId(chatId);
    setEditedTitle(currentTitle);
  };

  const handleEditSubmit = (chatId: string) => {
    if (editedTitle.trim()) {
      renameChat(chatId, editedTitle);
    } else {
      setEditingChatId(null);
    }
  };

  const handleEditCancel = () => {
    setEditingChatId(null);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div
      className={`fixed inset-y-0 z-20 bg-background border-r transition-all duration-300 ease-in-out w-64 lg:w-72 flex flex-col ${
        isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <SidebarHeader onLogoClick={handleLogoClick} onClose={onClose} />

      {/* Search */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
      />

      {/* New Chat Button */}
      <NewChatButton
        onNewChat={() => handleNewChatClick({} as React.MouseEvent)}
      />

      {/* Chat List */}
      <ChatList
        chats={chatStore}
        activeChatId={activeChatId}
        searchQuery={searchQuery}
        editingChatId={editingChatId}
        editedTitle={editedTitle}
        onChatClick={handleChatClick}
        onStarToggle={handleStarToggle}
        onEditStart={handleEditStart}
        onEditChange={setEditedTitle}
        onEditSubmit={handleEditSubmit}
        onEditCancel={handleEditCancel}
        onDelete={deleteChat}
      />

      {/* User Profile */}
      <UserProfileSection
        user={user}
        currentUser={currentUser}
        onProfileClick={() => handleProfileClick({} as React.MouseEvent)}
      />
    </div>
  );
};
