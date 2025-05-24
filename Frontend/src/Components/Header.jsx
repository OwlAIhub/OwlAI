import React, { useState } from "react";
import { FaChevronDown, FaKiwiBird } from "react-icons/fa";
import { FiMenu, FiSearch, FiUser, FiLogOut } from "react-icons/fi";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { Link } from "react-router-dom";

const Header = ({
    currentChatTitle,
    onToggleSidebar,
    isLoggedIn,
    onLogin,
    onLogout,
    darkMode,
    toggleDarkMode,
}) => {
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    return (
        <header
            className={`sticky top-0 z-40 ${
                darkMode ? "bg-gray-900" : "bg-white"
            } border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
            } shadow-sm`}
        >
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Left Section - Logo and Menu */}
                <div className="flex items-center space-x-3">
                    {/* Mobile menu button */}
                    <button
                        onClick={onToggleSidebar}
                        className="md:hidden p-2 rounded-md text-teal-600 hover:bg-teal-100 focus:outline-none"
                        aria-label="Toggle sidebar"
                    >
                        <FiMenu size={20} />
                    </button>

                    {/* Logo */}
                    <div
                        onClick={onToggleSidebar}
                        className="flex items-center cursor-pointer"
                    >
                        <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                            <FaKiwiBird className="text-white text-lg" />
                        </div>
                        <span className="ml-2 text-xl font-bold text-teal-700 hidden sm:inline">
                            Owl AI
                        </span>
                    </div>
                </div>

                {/* Center - Chat Title or Search Prompt */}
                <div className="flex-1 mx-4 max-w-xl hidden md:flex items-center justify-center">
                    {currentChatTitle ? (
                        <h1 className="text-lg font-semibold truncate text-center text-gray-700 dark:text-gray-200">
                            {currentChatTitle}
                        </h1>
                    ) : (
                        <div className="flex items-center space-x-2 text-gray-400">
                            <FiSearch />
                            <span className="text-sm">
                                Search or start a new chat
                            </span>
                        </div>
                    )}
                </div>

                {/* Right - Actions */}
                <div className="flex items-center space-x-3">
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full text-teal-600 hover:bg-teal-100 focus:outline-none"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? (
                            <MdLightMode size={20} />
                        ) : (
                            <MdDarkMode size={20} />
                        )}
                    </button>

                    {/* User Section */}
                    {isLoggedIn ? (
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setShowProfileDropdown((prev) => !prev)
                                }
                                className="flex items-center space-x-2 focus:outline-none"
                            >
                                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                                    <FiUser className="text-white" />
                                </div>
                                <FaChevronDown
                                    className={`text-teal-500 transition-transform duration-200 ${
                                        showProfileDropdown ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {showProfileDropdown && (
                                <div
                                    className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-2 border ${
                                        darkMode
                                            ? "bg-gray-800 border-gray-700"
                                            : "bg-white border-gray-200"
                                    }`}
                                >
                                    <div className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Signed in as
                                        </p>
                                        <p className="text-sm font-medium text-teal-500 truncate">
                                            user@example.com
                                        </p>
                                    </div>
                                    <button
                                        onClick={onLogout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <FiLogOut className="mr-2" /> Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login">
                        <button
                            className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-full text-sm font-medium"
                        >
                            Sign In
                        </button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
