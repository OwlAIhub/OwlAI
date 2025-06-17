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
  onNewChat = () => {},
  onSelectChat = () => {},
  darkMode = false,
  currentUser = {},
  activeChatId = null,
  chats = [],
  setChats = () => {},
  onUserProfileClick = () => {},
  onNewSessionCreated,
  setSesssionId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [isMidRange, setIsMidRange] = useState(false);
  const navigate = useNavigate();
  const [chatStore, setChatStore] = useState([]);
  const userData = localStorage.getItem("userProfile");

  const user = userData ? JSON.parse(userData) : null;
  const Student = localStorage.getItem("user");
  const studentData = userData ? JSON.parse(Student) : null;
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsMidRange(width >= 750 && width <= 1000);
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

// In Sidebar.jsx
useEffect(() => {
  const fetchChats = async () => {
    if (!studentData?.uid) return;
    try {
      const response = await fetch(`${config.apiUrl}/chat/sidebar/sessions?user_id=${studentData.uid}`);
      const data = await response.json();
      if (data.status === "success") {
        const formattedChats = data.data.map(session => ({
          id: session.session_id,
          title: session.title,
          lastUpdated: session.last_updated,
          numChats: session.num_chats,
          startTime: session.start_time,
          starred: session.starred || false
        }));
        setChats(formattedChats);
        setChatStore(formattedChats);
      }
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
    }
  };

  // Add event listener for new chat messages
  const handleNewChatMessage = () => {
    fetchChats(); // Refresh the chat list
  };

  window.addEventListener('newChatMessage', handleNewChatMessage);
  
  // Initial fetch
  fetchChats();

  return () => {
    window.removeEventListener('newChatMessage', handleNewChatMessage);
  };
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
    setChatStore(prevChats => 
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, starred: !chat.starred } : chat
      )
    );
  };

  const handleChatClick = (chat) => {
    localStorage.setItem("selectedChat", JSON.stringify(chat));
    window.dispatchEvent(new CustomEvent("chatSelected", { detail: chat }));
    onSelectChat(chat.id);
    if (isMobile || isMidRange) onClose();
  };

  const handleLogoClick = () => {
    navigate("/");
    if (isMobile || isMidRange) onClose();
  };

  const handleUpgradeClick = () => {
    navigate("/subscription");
    if (isMobile || isMidRange) onClose();
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Added logout handling
    if (!user) {
      alert("Please log in to access your profile.");
      navigate("/login");
      if (isMobile || isMidRange) onClose();
      return;
    }
    
    onUserProfileClick();
    if (isMobile || isMidRange) onClose();
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
    
    // Clear any selected chat
    localStorage.removeItem("selectedChat");
    
    // Handle unauthenticated users
    if (!studentData) {
      alert("Please log in to start a new chat.");
      navigate("/login");
      if (isMobile || isMidRange) onClose();
      return;
    }
  
    try {
      // Clear existing session data
      localStorage.removeItem("sessionId");
      
      // Create new session
      const newSessionId = await createNewSession(studentData.uid);
      // console.log("New session created:", newSessionId);
      
      if (newSessionId) {
        // Update session ID in state and storage
        localStorage.setItem("sessionId", newSessionId);
        
        // IMPORTANT: Fix the typo in the prop name and call it
        if (setSesssionId) {
          setSesssionId(newSessionId);
        } else {
          console.error("setSessionId prop is missing");
        }
        
        toast.success("New chat started!");
        
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('newSessionCreated', {
          detail: { sessionId: newSessionId }
        }));
        
        // Callback if provided
        if (onNewSessionCreated) {
          onNewSessionCreated(newSessionId);
        }
        
        // Clear any existing chat messages in the UI
        window.dispatchEvent(new CustomEvent('clearChatMessages'));
      }
    } catch (err) {
      console.error("Failed to start new chat:", err);
      toast.error("Failed to start new chat");
    }
  
    if (isMobile || isMidRange) onClose();
  };

  const filteredChats = chatStore.filter(chat =>
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
    <div 
      className={`fixed inset-y-0 z-20 ${theme.bg} 
        ${isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'} 
        transition-all duration-300 ease-in-out
        w-64 lg:w-72
        border-r ${theme.border}
        flex flex-col`}
    >
      {/* Header with logo and close button */}
      <div className={`p-4 flex items-center justify-between border-b ${theme.border} h-17`}>
        <button 
          onClick={handleLogoClick}
          className="flex cursor-pointer items-center space-x-3 focus:outline-none hover:opacity-80 transition-opacity"
          aria-label="Go to home page"
        >
          <div className={`${theme.primary} p-2 rounded-full`}>
            <FaKiwiBird className="text-white text-lg" />
          </div>
          <span className={`font-bold text-lg ${theme.text}`}>Owl AI</span>
        </button>
        <button
          onClick={onClose}
          className={`p-1 rounded-full ${theme.hoverBg} transition-colors lg:hidden`}
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

      {/* Upgrade Button with logout handling */}
      {/* {user && currentUser?.plan !== "Premium" && (
        <div className="px-3 mb-2">
          <button
            onClick={() => {
              if (!user) {
                alert("Please log in to upgrade your plan.");
                navigate("/login");
                if (isMobile || isMidRange) onClose();
                return;
              }
              handleUpgradeClick();
            }}
            className={`w-full flex cursor-pointer items-center justify-center ${theme.primary} ${theme.primaryText} py-2.5 rounded-lg font-medium shadow-md transition-colors`}
          >
            <FiCreditCard className="mr-2" />
            Upgrade Plan
          </button>
        </div>
      )} */}

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
                onClick={() => handleChatClick(chat)}
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
                    onClick={(e) => toggleStar(chat.id, e)}
                    className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${theme.icon}`}
                    aria-label={chat.starred ? "Unstar chat" : "Star chat"}
                  >
                    {chat.starred ? (
                      <StarIcon className={theme.star} fontSize="small" />
                    ) : (
                      <StarBorderIcon fontSize="small" className={theme.icon} />
                    )}
                  </button>
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
                onClick={() => handleChatClick(chat)}
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
                    onClick={(e) => toggleStar(chat.id, e)}
                    className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${theme.icon}`}
                    aria-label={chat.starred ? "Unstar chat" : "Star chat"}
                  >
                    {chat.starred ? (
                      <StarIcon className={theme.star} fontSize="small" />
                    ) : (
                      <StarBorderIcon fontSize="small" className={theme.icon} />
                    )}
                  </button>
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
      <div className={`p-4 h-22 border-t ${theme.border}`}>
        <div className="w-full">
          <button
            onClick={handleProfileClick}
            className="w-full cursor-pointer flex items-center justify-between hover:opacity-80 transition-opacity focus:outline-none"
            aria-label="Open user profile"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className={`${theme.primary} w-9 h-9 rounded-full flex items-center justify-center text-white overflow-hidden`}>
                {user && currentUser?.avatar ? (
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
                  {user ? (currentUser?.plan ? `${currentUser.plan} Plan` : "Free Plan") : "Login Required"}
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