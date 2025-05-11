import React, { useState, useEffect } from "react";
import {
    FiSearch,
    FiX,
    FiPlus,
    FiMessageSquare,
    FiStar,
    FiClock,
} from "react-icons/fi";
import { FaKiwiBird } from "react-icons/fa"; // closest owl/bird icon

const Sidebar = ({
    isLoggedIn,
    isOpen,
    onClose,
    onNewChat,
    onSelectChat,
    onSubscribe,
    onLogout,
    darkMode, // Prop to switch between light and dark mode
}) => {
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobile, setIsMobile] = useState(false);

    const previousChats = [
        { id: 1, title: "Learning Theories", lastAccessed: "2h ago" },
        { id: 2, title: "NEP 2020 Questions", lastAccessed: "1d ago" },
        { id: 3, title: "Constructivism Examples", lastAccessed: "3d ago" },
        { id: 4, title: "Pedagogy vs Andragogy", lastAccessed: "1w ago" },
    ];

    useEffect(() => {
        const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    return (
        <div
            className={`fixed top-0 left-0 h-full transition-transform duration-300 ease-in-out transform ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            } ${
                darkMode
                    ? "bg-gray-900 text-gray-100"
                    : "bg-white text-gray-800"
            } ${!isMobile ? "border-r border-gray-800" : ""} w-64 md:w-72 z-50`}
        >
            {/* Header */}
            <div
                className={`p-4 flex items-center justify-between border-b ${
                    darkMode ? "border-gray-800" : "border-gray-200"
                } relative`}
            >
                <div className="flex items-center space-x-3">
                    <div
                        className={`${
                            darkMode ? "bg-teal-500" : "bg-teal-600"
                        } p-2 rounded-full`}
                    >
                        <FaKiwiBird className="text-white text-lg" />
                    </div>
                    <span className="font-bold text-lg">Owl AI</span>
                </div>

                <button
                    onClick={onClose}
                    className={`p-1 hover:${
                        darkMode ? "bg-gray-700" : "bg-gray-200"
                    } rounded-full`}
                >
                    <FiX className="text-xl" />
                </button>
            </div>

            {/* Search */}
            <div className="p-3">
                <div
                    className={`flex items-center ${
                        darkMode ? "bg-gray-800" : "bg-gray-100"
                    } rounded-md px-3 py-2`}
                >
                    <FiSearch
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
                    />
                    {searchOpen ? (
                        <input
                            autoFocus
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`ml-2 bg-transparent outline-none w-full text-sm ${
                                darkMode ? "text-gray-200" : "text-gray-800"
                            } placeholder:text-gray-400`}
                            placeholder="Search chats..."
                        />
                    ) : (
                        <button
                            onClick={() => setSearchOpen(true)}
                            className={`ml-2 text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                        >
                            Tap to search...
                        </button>
                    )}
                </div>
            </div>

            {/* New Chat */}
            <div className="px-3">
                <button
                    onClick={onNewChat}
                    className={`w-full flex items-center justify-center ${
                        darkMode ? "bg-teal-600" : "bg-teal-500"
                    } hover:${
                        darkMode ? "bg-teal-700" : "bg-teal-400"
                    } text-white py-2.5 rounded-md transition`}
                >
                    <FiPlus className="mr-2" />
                    New Chat
                </button>
            </div>

            {/* Chats */}
            <div className="flex-1 overflow-y-auto mt-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 px-2">
                {isLoggedIn ? (
                    <>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 flex items-center px-1">
                            <FiClock className="mr-2" /> Recent
                        </div>
                        {previousChats
                            .filter((chat) =>
                                chat.title
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase())
                            )
                            .map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => onSelectChat(chat.id)}
                                    className={`w-full text-left text-sm ${
                                        darkMode
                                            ? "text-gray-200"
                                            : "text-gray-800"
                                    } px-3 py-2 rounded hover:${
                                        darkMode ? "bg-gray-800" : "bg-gray-100"
                                    } transition flex justify-between items-center`}
                                >
                                    <div className="truncate flex items-center">
                                        <FiMessageSquare className="mr-2 text-gray-400" />
                                        {chat.title}
                                    </div>
                                    <span
                                        className={`text-xs ${
                                            darkMode
                                                ? "text-gray-500"
                                                : "text-gray-600"
                                        } ml-2`}
                                    >
                                        {chat.lastAccessed}
                                    </span>
                                </button>
                            ))}
                    </>
                ) : (
                    <div className="text-center px-4 py-8">
                        <button
                            onClick={onSubscribe}
                            className={`${
                                darkMode ? "bg-black" : "bg-gray-800"
                            } hover:${
                                darkMode ? "bg-black" : "bg-gray-800"
                            } text-white px-4 py-2 text-sm rounded-md w-full transition`}
                        >
                            Subscribe Plan
                        </button>
                    </div>
                )}
            </div>

            {/* Footer / User Info */}
            {isLoggedIn && (
                <div
                    className={`border-t ${
                        darkMode ? "border-gray-800" : "border-gray-200"
                    } p-3`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div
                                className={`${
                                    darkMode ? "bg-teal-600" : "bg-teal-500"
                                } w-9 h-9 rounded-full flex items-center justify-center`}
                            >
                                <span className="text-white">U</span>
                            </div>
                            <div>
                                <div className="text-sm font-medium">
                                    User Name
                                </div>
                                <div
                                    className={`text-xs ${
                                        darkMode
                                            ? "text-gray-400"
                                            : "text-gray-600"
                                    }`}
                                >
                                    Free Plan
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onLogout}
                            className={`hover:text-white text-gray-400 p-1.5 rounded-full hover:${
                                darkMode ? "bg-gray-700" : "bg-gray-200"
                            } transition`}
                        >
                            <FiStar />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
