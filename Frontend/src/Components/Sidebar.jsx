import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiPlus, 
  FiX, 
  FiMessageSquare, 
  FiStar, 
  FiClock, 
  FiUser,
  FiSearch,
  FiChevronRight,
  FiCreditCard,
  FiEdit2,
  FiTrash2
} from "react-icons/fi";
import { FaKiwiBird } from "react-icons/fa";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import config from "../Config"; 
import { toast } from "react-toastify";

const Sidebar = ({
  isOpen = false,
  onClose = () => {},
  onNewChat,
  darkMode = false,
  currentUser = {},
  activeChatId = null,
  chats = [],
  setChats = () => {},
  onUserProfileClick = () => {},
  onNewSessionCreated,
  onChatSelect
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const navigate = useNavigate();
  const[chatStore, setChatStore] = useState([]);
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  console.log("onChatSelect prop:", onChatSelect); // Should log a function

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      if (!user?.uid) return;
      try {
        const response = await fetch(`${config.apiUrl}/chat/sidebar/sessions?user_id=${user.uid}`);
        const data = await response.json();
        if (data.status === "success") {
          const formattedChats = data.data.map(session => ({
            id: session.session_id,
            title: session.title,
            lastUpdated: session.last_updated,
            numChats: session.num_chats,
            startTime: session.start_time
          }));
          console.log("Fetched chats:", formattedChats);
          setChats(formattedChats);
          setChatStore(formattedChats);
        }
      } catch (error) {
        console.error("Error fetching chat sessions:", error);
      }
    };
  
    fetchChats();
  }, [user?.uid]);
  
  const renameChat = async (chatId, newTitle) => {
    try {
      const response = await fetch(`${config.apiUrl}/chat/session/rename`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ session_id: chatId, new_name: newTitle })
      });
  
      if (response.ok) {
        setChats(prev => prev.map(chat => chat.id === chatId ? { ...chat, title: newTitle } : chat));
        setChatStore(prev => prev.map(chat => chat.id === chatId ? { ...chat, title: newTitle } : chat));
        setEditingChatId(null);
        toast.success("Chat renamed successfully");
      }
    } catch (err) {
      console.error("Rename failed:", err);
      toast.error("Failed to rename chat");
    }
  };

  const deleteChat = async (chatId) => {
    try {
      const response = await fetch(`${config.apiUrl}/chat/session/${chatId}`, {
        method: 'DELETE'
      });
  
      if (response.ok) {
        setChats(prev => prev.filter(chat => chat.id !== chatId));
        setChatStore(prev => prev.filter(chat => chat.id !== chatId));
        toast.success("Chat deleted successfully");
        
        // If the deleted chat was the active one, clear the selection
        if (activeChatId === chatId) {
          onSelectChat(null);
        }
      }
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete chat");
    }
  };

  const handleEditClick = (chatId, currentTitle, e) => {
    e.stopPropagation();
    setEditingChatId(chatId);
    setEditedTitle(currentTitle);
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleBlur = (chatId) => {
    if (editedTitle.trim()) {
      renameChat(chatId, editedTitle);
    } else {
      setEditingChatId(null);
    }
  };

  const handleKeyPress = (e, chatId) => {
    if (e.key === 'Enter' && editedTitle.trim()) {
      renameChat(chatId, editedTitle);
    } else if (e.key === 'Escape') {
      setEditingChatId(null);
    }
  };

  const toggleStar = (chatId, e) => {
    e.stopPropagation();
    setChats(prevChats => 
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, starred: !chat.starred } : chat
      )
    );
  };

  // const handleChatSelect = (chatId, chatTitle) => {
  //   console.log("Selected chat:", chatId, chatTitle);
  //   onSelectChat(chatId, chatTitle);
  //       if (isMobile) onClose();
  // };

  const handleLogoClick = () => {
    navigate("/");
    if (isMobile) onClose();
  };

  const handleUpgradeClick = () => {
    navigate("/subscription");
    if (isMobile) onClose();
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onUserProfileClick();
    if (isMobile) onClose();
  };

  const createNewSession = async (userId) => {
    try {
      const res = await fetch(`${config.apiUrl}/session/create?user_id=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      return data.session_id;
    } catch (err) {
      console.error("Failed to create session:", err);
      toast.error("Failed to create chat session");
      return null;
    }
  };

  const handleNewChatClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("Please log in to start a new chat");
      return;
    }
  
    try {
      localStorage.removeItem("sessionId");
      const newSessionId = await createNewSession(user.uid);
      
      if (newSessionId) {
        localStorage.setItem("sessionId", newSessionId);
        toast.success("New chat started!");
        
        window.dispatchEvent(new CustomEvent('newSessionCreated', {
          detail: { sessionId: newSessionId }
        }));
        
        if (onNewSessionCreated) {
          onNewSessionCreated(newSessionId);
        }
      }
    } catch (err) {
      console.error("Failed to start new chat:", err);
      toast.error("Failed to start new chat");
    }
  
    if (isMobile) onClose();
  };

  // In Sidebar.jsx (when a chat is clicked)
const handleChatClick = (chat) => {
  // 1. Store the full chat data in localStorage
  localStorage.setItem("selectedChat", JSON.stringify(chat));
  
  // 2. Dispatch a custom event to notify MainContent immediately
  window.dispatchEvent(new CustomEvent("chatSelected", { 
    detail: chat 
  }));
  
  // 3. Close sidebar if mobile
  if (isMobile) onClose();
};



  const filteredChats = chatStore.filter(chat =>
    chat?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const regularChats = searchQuery.trim() ? filteredChats : chatStore;

  const formatLastAccessed = (dateString) => {
    if (!dateString) return "";
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const colors = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-800',
      secondaryText: 'text-gray-600',
      border: 'border-gray-200',
      hoverBg: 'hover:bg-gray-100',
      activeBg: 'bg-gray-100',
      inputBg: 'bg-gray-50',
      primary: 'bg-teal-600 hover:bg-teal-700',
      primaryText: 'text-white',
      accent: 'text-teal-600',
      accentLight: 'text-teal-500',
      star: 'text-yellow-500',
      scrollbar: 'scrollbar-thumb-gray-300',
      icon: 'text-gray-500',
      buttonHover: 'hover:bg-teal-600',
      userPlan: 'text-teal-600'
    },
    dark: {
      bg: 'bg-gray-900',
      text: 'text-gray-100',
      secondaryText: 'text-gray-400',
      border: 'border-gray-700',
      hoverBg: 'hover:bg-gray-800',
      activeBg: 'bg-gray-800',
      inputBg: 'bg-gray-800',
      primary: 'bg-teal-700 hover:bg-teal-800',
      primaryText: 'text-white',
      accent: 'text-teal-400',
      accentLight: 'text-teal-300',
      star: 'text-yellow-400',
      scrollbar: 'scrollbar-thumb-gray-700',
      icon: 'text-gray-400',
      buttonHover: 'hover:bg-teal-800',
      userPlan: 'text-teal-400'
    }
  };

  const theme = darkMode ? colors.dark : colors.light;

  return (
    <div className={`fixed inset-y-0 z-20 ${theme.bg} 
      ${isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'} 
      transition-all duration-300 ease-in-out
      w-64 md:w-72
      border-r ${theme.border}
      flex flex-col`}>

      {/* Header with logo and close button */}
      <div className={`p-4 flex items-center justify-between border-b ${theme.border} h-17`}>
        <button 
          onClick={handleLogoClick}
          className="flex items-center space-x-3 focus:outline-none hover:opacity-80 transition-opacity"
          aria-label="Go to home page"
        >
          <div className={`${theme.primary} p-2 rounded-full`}>
            <FaKiwiBird className="text-white text-lg" />
          </div>
          <span className={`font-bold text-lg ${theme.text}`}>Owl AI</span>
        </button>
        <button
          onClick={onClose}
          className={`p-1 rounded-full ${theme.hoverBg} transition-colors`}
          aria-label="Close sidebar"
        >
          <FiX className={`text-xl ${theme.text}`} />
        </button>
      </div>

      {/* Search bar */}
      <div className="p-3">
        <div className={`flex items-center ${theme.inputBg} focus-within:ring-2 focus-within:ring-teal-500 rounded-lg px-3 py-2 transition-colors`}>
          <FiSearch className={theme.icon} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`ml-2 bg-transparent outline-none w-full text-sm ${theme.text} placeholder-${theme.secondaryText}`}
            placeholder="Search chats..."
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')} 
              className={theme.icon}
              aria-label="Clear search"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
      </div>

      {/* New Chat Button */}
      <div className="px-3 mb-2">
        <button
          onClick={handleNewChatClick}
          className={`w-full cursor-pointer flex items-center justify-center ${theme.primary} ${theme.primaryText} py-2.5 rounded-lg font-medium transition-colors shadow-md`}
        >
          <FiPlus className="mr-2" />
          New Chat
        </button>
      </div>

      {/* Upgrade Button */}
      {currentUser?.plan !== "Premium" && (
        <div className="px-3 mb-2">
          <button
            onClick={handleUpgradeClick}
            className={`w-full flex cursor-pointer items-center justify-center ${theme.primary} ${theme.primaryText} py-2.5 rounded-lg font-medium shadow-md transition-colors`}
          >
            <FiCreditCard className="mr-2" />
            Upgrade Plan
          </button>
        </div>
      )}

      {/* Chat List */}
      <div className={`flex-1 overflow-y-auto py-2 px-1 scrollbar-thin ${theme.scrollbar}`}>
        <div className="mb-4">
          <div className={`text-xs uppercase tracking-wider mb-2 flex items-center px-3 py-1 ${theme.secondaryText}`}>
            <FiClock className="mr-2" /> Recent
          </div>
          {regularChats.length > 0 ? (
            regularChats.map(chat => (
              <div
                key={chat.id}
             // In Sidebar.jsx
onClick={() => {
  // 1. Create the chat object
  const selectedChat = {
    id: chat.id,
    title: chat.title
  };

  // 2. Store in localStorage (for persistence)
  localStorage.setItem('selectedChat', JSON.stringify(selectedChat));

  // 3. Dispatch event to notify MainContent immediately
  window.dispatchEvent(new CustomEvent('chatSelected', {
    detail: selectedChat
  }));

  // 4. Close sidebar if mobile
  if (isMobile) onClose();
}}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  activeChatId === chat.id
                    ? theme.activeBg
                    : theme.hoverBg
                }`}
                aria-label={`Open chat: ${chat.title}`}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <FiMessageSquare className={`mr-2 flex-shrink-0 ${theme.icon}`} />
                  {editingChatId === chat.id ? (
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={handleTitleChange}
                      onBlur={() => handleTitleBlur(chat.id)}
                      onKeyDown={(e) => handleKeyPress(e, chat.id)}
                      autoFocus
                      className={`flex-1 bg-transparent outline-none ${theme.text}`}
                    />
                  ) : (
                    <span className={`truncate ${theme.text}`}>{chat.title}</span>
                  )}
                </div>
                <div className="flex items-center ml-2">
                  <button
                    onClick={(e) => handleEditClick(chat.id, chat.title, e)}
                    className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${theme.icon}`}
                    aria-label="Edit chat title"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Are you sure you want to delete this chat?")) {
                        deleteChat(chat.id);
                      }
                    }}
                    className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${theme.icon}`}
                    aria-label="Delete chat"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={`text-center py-4 text-sm ${theme.secondaryText}`}>
              {searchQuery ? "No matching chats" : "No recent chats"}
            </div>
          )}
        </div>
      </div>

      {/* User Profile Section */}
      <div className={`p-4  h-22 border-t ${theme.border}`}>
        <div className="w-full">
          <button
            onClick={handleProfileClick}
            className="w-full cursor-pointer flex items-center justify-between hover:opacity-80 transition-opacity focus:outline-none"
            aria-label="Open user profile"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className={`${theme.primary} w-9 h-9 rounded-full flex items-center justify-center text-white overflow-hidden`}>
                {currentUser?.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt="User" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="w-5 h-5" />
                )}
              </div>
              <div className="text-left min-w-0">
                <div className={`text-sm font-medium truncate max-w-[120px] ${theme.text}`}>
                  {user?.firstName || "Guest User"}
                </div>
                <div className={`text-xs truncate max-w-[120px] ${theme.userPlan}`}>
                  {currentUser?.plan ? `${currentUser.plan} Plan` : "Free Plan"}
                </div>
              </div>
            </div>
            <FiChevronRight className={theme.icon} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;