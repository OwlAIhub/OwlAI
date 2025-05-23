import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiX,
  FiPlus,
  FiMessageSquare,
  FiStar,
  FiClock,
  FiUser,
  FiChevronRight,
  FiCreditCard
} from "react-icons/fi";
import { FaKiwiBird } from "react-icons/fa";
import UserProfile from "../pages/UserProfile";
import SubscriptionPlans from "../pages/SubscriptionPlans"; // ✅ Import added

const Sidebar = ({
  isLoggedIn = false,
  isOpen = false,
  onClose = () => {},
  onNewChat = () => {},
  onSelectChat = () => {},
  darkMode = false,
  currentUser = {},
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(false); // State for subscription modal
  const navigate = useNavigate();

  const previousChats = [
    { id: 1, title: "Learning Theories", lastAccessed: "2h ago", starred: true },
    { id: 2, title: "NEP 2020 Questions", lastAccessed: "1d ago", starred: false },
    { id: 3, title: "Constructivism Examples", lastAccessed: "3d ago", starred: true },
    { id: 4, title: "Pedagogy vs Andragogy", lastAccessed: "1w ago", starred: false },
  ];

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleChatSelect = (chatId) => {
    setActiveChat(chatId);
    onSelectChat(chatId);
  };

  const filteredChats = previousChats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const starredChats = filteredChats.filter(chat => chat.starred);
  const regularChats = filteredChats.filter(chat => !chat.starred);

  const handleUpgradeClick = () => {
    if (isMobile) {
      navigate("/subscription");
    } else {
      setShowSubscriptionPlans(true);
    }
  };

  const closeSubscriptionModal = () => {
    setShowSubscriptionPlans(false);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
        } w-64 md:w-72 z-40 flex flex-col shadow-xl`}
      >
        {/* Header */}
        <div className={`p-4 flex items-center justify-between border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`${
              darkMode ? "bg-teal-500" : "bg-teal-600"
            } p-2 rounded-full`}>
              <FaKiwiBird className="text-white text-lg" />
            </div>
            <span className="font-bold text-lg">Owl AI</span>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"} transition`}
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className={`flex items-center ${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          } rounded-lg px-3 py-2`}>
            <FiSearch className={darkMode ? "text-gray-400" : "text-gray-500"} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`ml-2 bg-transparent outline-none w-full text-sm ${
                darkMode ? "text-gray-200 placeholder:text-gray-500" : "text-gray-800 placeholder:text-gray-400"
              }`}
              placeholder="Search chats..."
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600">
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>

        {/* New Chat Button */}
        <div className="px-3 mb-2">
          <button
            onClick={onNewChat}
            className={`w-full flex items-center justify-center ${
              darkMode ? "bg-teal-600 hover:bg-teal-700" : "bg-teal-500 hover:bg-teal-600"
            } text-white py-2.5 rounded-lg transition font-medium`}
          >
            <FiPlus className="mr-2" />
            New Chat
          </button>
        </div>

        {/* Upgrade Button (only shown if not on premium plan) */}
        {isLoggedIn && currentUser?.plan !== "Premium" && (
          <div className="px-3 mb-2">
            <button
              onClick={handleUpgradeClick}
              className={`w-full flex items-center justify-center bg-[#009688] text-white py-2.5 rounded-lg transition font-medium`}
            >
              <FiCreditCard className="mr-2" />
              Upgrade Plan
            </button>
          </div>
        )}

        {/* Chat List */}
        <div className={`flex-1 overflow-y-auto py-2 px-1 scrollbar-thin ${
          darkMode ? "scrollbar-thumb-gray-700" : "scrollbar-thumb-gray-300"
        }`}>
          {isLoggedIn ? (
            <>
              {/* Starred */}
              {starredChats.length > 0 && (
                <div className="mb-4">
                  <div className={`text-xs uppercase tracking-wider mb-2 flex items-center px-3 py-1 ${
                    darkMode ? "text-teal-400" : "text-teal-600"
                  }`}>
                    <FiStar className="mr-2" /> Starred
                  </div>
                  {starredChats.map(chat => (
                    <ChatItem
                      key={chat.id}
                      chat={chat}
                      darkMode={darkMode}
                      active={activeChat === chat.id}
                      onClick={() => handleChatSelect(chat.id)}
                    />
                  ))}
                </div>
              )}

              {/* Recent */}
              <div className="mb-4">
                <div className={`text-xs uppercase tracking-wider mb-2 flex items-center px-3 py-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  <FiClock className="mr-2" /> Recent
                </div>
                {regularChats.length > 0 ? (
                  regularChats.map(chat => (
                    <ChatItem
                      key={chat.id}
                      chat={chat}
                      darkMode={darkMode}
                      active={activeChat === chat.id}
                      onClick={() => handleChatSelect(chat.id)}
                    />
                  ))
                ) : (
                  <div className={`text-center py-4 text-sm ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}>
                    No recent chats
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center px-4 py-8">
              <p className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Please log in to view your chats.
              </p>
            </div>
          )}
        </div>

        {/* User Info Section */}
        {isLoggedIn && (
          <div className={`border-t ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } p-3`}>
            <button
              className="w-full flex items-center justify-between"
              onClick={() => navigate("/userProfile")}
            >
              <div className="flex items-center space-x-3">
                <div className={`${
                  darkMode ? "bg-teal-600" : "bg-teal-500"
                } w-9 h-9 rounded-full flex items-center justify-center text-white`}>
                  {currentUser?.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt="User" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FiUser />
                  )}
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium truncate max-w-[120px]">
                    {currentUser?.name || "User"}
                  </div>
                  <div className={`text-xs ${
                    darkMode ? "text-teal-400" : "text-teal-600"
                  }`}>
                    {currentUser?.plan ? `${currentUser.plan} Plan` : "Free Plan"}
                  </div>
                </div>
              </div>
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Subscription Plan Modal */}
      {showSubscriptionPlans && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${
          darkMode ? "bg-black bg-opacity-70" : "bg-black bg-opacity-50"
        }`}>
          <div className={`relative rounded-lg shadow-xl max-w-md w-full mx-4 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <button
              onClick={closeSubscriptionModal}
              className={`absolute top-4 right-4 p-1 rounded-full ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
            >
              <FiX className="text-xl" />
            </button>
            <SubscriptionPlans 
              darkMode={darkMode} 
              currentPlan={currentUser?.plan || "Free"} 
              onClose={closeSubscriptionModal}
            />
          </div>
        </div>
      )}
    </>
  );
};

const ChatItem = ({ chat, darkMode, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left text-sm px-3 py-2.5 rounded-md flex justify-between items-center transition ${
        active
          ? darkMode
            ? "bg-gray-700 text-white"
            : "bg-gray-200 text-gray-900"
          : darkMode
            ? "hover:bg-gray-800 text-gray-200"
            : "hover:bg-gray-100 text-gray-800"
      }`}
    >
      <div className="truncate flex items-center">
        <FiMessageSquare className={`mr-2 flex-shrink-0 ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`} />
        <span className="truncate">{chat.title}</span>
      </div>
      <div className="flex items-center">
        {chat.starred && (
          <FiStar className={`mr-2 text-xs ${
            darkMode ? "text-yellow-400" : "text-yellow-500"
          }`} />
        )}
        <span className={`text-xs ${
          darkMode ? "text-gray-500" : "text-gray-600"
        }`}>
          {chat.lastAccessed}
        </span>
      </div>
    </button>
  );
};

export default Sidebar;