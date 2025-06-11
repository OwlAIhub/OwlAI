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
  FiCreditCard
} from "react-icons/fi";
import { FaKiwiBird } from "react-icons/fa";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import config from "../Config";

const Sidebar = ({
  isOpen = false,
  onClose = () => {},
  onNewChat = () => {},
  onSelectChat = () => {},
  darkMode = false,
  currentUser = {},
  activeChatId = null,
  chats = [],
  setChats = () => {},
  onUserProfileClick = () => {},
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

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
        console.log("Fetched chat sessions:", data);
        setChats(data?.sessions || []);
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
        body: JSON.stringify({ session_id: chatId, name: newTitle })
      });
  
      if (response.ok) {
        setChats(prev => prev.map(chat => chat.id === chatId ? { ...chat, title: newTitle } : chat));
      }
    } catch (err) {
      console.error("Rename failed:", err);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      const response = await fetch(`${config.apiUrl}/chat/session/${chatId}`, {
        method: 'DELETE'
      });
  
      if (response.ok) {
        setChats(prev => prev.filter(chat => chat.id !== chatId));
      }
    } catch (err) {
      console.error("Delete failed:", err);
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

  const handleChatSelect = (chatId) => {
    onSelectChat(chatId);
    if (isMobile) onClose();
  };

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
    onUserProfileClick();
    if (isMobile) onClose();
  };

  const filteredChats = chats.filter(chat =>
    chat?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const starredChats = filteredChats.filter(chat => chat?.starred);
  const regularChats = filteredChats.filter(chat => !chat?.starred);

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

  // Enhanced color definitions with better light mode visibility
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
      <div className={`p-4 flex items-center justify-between border-b ${theme.border}`}>
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
            autoFocus
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
          onClick={onNewChat}
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
        {starredChats.length > 0 && (
          <div className="mb-4">
            <div className={`text-xs uppercase tracking-wider mb-2 flex items-center px-3 py-1 ${theme.accent}`}>
              <FiStar className="mr-2" /> Starred
            </div>
            {starredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  activeChatId === chat.id
                    ? theme.activeBg
                    : theme.hoverBg
                }`}
                aria-label={`Open chat: ${chat.title}`}
              >
                <div className="flex items-center min-w-0">
                  <FiMessageSquare className={`mr-2 flex-shrink-0 ${theme.icon}`} />
                  <span className={`truncate ${theme.text}`}>{chat.title}</span>
                </div>
                <button
                  onClick={(e) => toggleStar(chat.id, e)}
                  className="ml-2 hover:text-yellow-500"
                  aria-label={chat.starred ? "Unstar chat" : "Star chat"}
                >
                  {chat.starred ? (
                    <StarIcon className={theme.star} fontSize="small" />
                  ) : (
                    <StarBorderIcon fontSize="small" className={theme.icon} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mb-4">
          <div className={`text-xs uppercase tracking-wider mb-2 flex items-center px-3 py-1 ${theme.secondaryText}`}>
            <FiClock className="mr-2" /> Recent
          </div>
          {regularChats.length > 0 ? (
            regularChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  activeChatId === chat.id
                    ? theme.activeBg
                    : theme.hoverBg
                }`}
                aria-label={`Open chat: ${chat.title}`}
              >
                <div className="flex items-center min-w-0">
                  <FiMessageSquare className={`mr-2 flex-shrink-0 ${theme.icon}`} />
                  <span className={`truncate ${theme.text}`}>{chat.title}</span>
                </div>
                <button
                  onClick={(e) => toggleStar(chat.id, e)}
                  className="ml-2 hover:text-yellow-500"
                  aria-label={chat.starred ? "Unstar chat" : "Star chat"}
                >
                  {chat.starred ? (
                    <StarIcon className={theme.star} fontSize="small" />
                  ) : (
                    <StarBorderIcon fontSize="small" className={theme.icon} />
                  )}
                </button>
              </div>
            ))
          ) : (
            <div className={`text-center py-4 text-sm ${theme.secondaryText}`}>
              {searchQuery ? "No matching chats" : "No recent chats"}
            </div>
          )}
        </div>
      </div>

      {/* User Profile Section - Fixed */}
      <div className={`p-4 border-t ${theme.border}`}>
        <div className="w-full">
          <button
            onClick={handleProfileClick}
            className="w-full flex items-center justify-between hover:opacity-80 transition-opacity focus:outline-none"
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
                  {(user?.firstName || "") + " " + (user?.lastName || "Guest User")}
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