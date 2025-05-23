import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MainContent = ({
    currentChatTitle,
    darkMode,
    isSidebarOpen,
    toggleSidebar,
    isLoggedIn,
    onLogin,
    onLogout,
    toggleDarkMode,
}) => {
    return (
        <div className="flex w-full h-screen">
            <Sidebar
                isOpen={isSidebarOpen}
                isLoggedIn={isLoggedIn}
                onClose={toggleSidebar}
                onNewChat={() => {}}
                onSelectChat={() => {}}
                onLogout={onLogout}
                darkMode={darkMode}
                isMobile={false}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    currentChatTitle={currentChatTitle}
                    onToggleSidebar={toggleSidebar}
                    isLoggedIn={isLoggedIn}
                    onLogout={onLogout}
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                />

                <main
                    className={`flex-1 overflow-auto p-4 md:p-6 flex flex-col ${
                        darkMode ? "bg-gray-900" : "bg-gray-50"
                    }`}
                >
                    <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
                        <div className="flex-grow flex flex-col items-center justify-center text-center gap-4 px-4">
                            <div className="space-y-2">
                                <h1
                                    className={`text-2xl md:text-3xl lg:text-3xl font-semibold ${
                                        darkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                    }`}
                                >
                                    How may I help you?
                                </h1>
                                <p
                                    className={`text-base md:text-lg lg:text-lg ${
                                        darkMode
                                            ? "text-gray-300"
                                            : "text-gray-600"
                                    }`}
                                >
                                    Start your preparation with OwlAI and unlock
                                    your potential!
                                </p>
                            </div>
                        </div>

                        <div className="w-full max-w-xl mt-4 mb-6 px-2">
                            <div
                                className={`p-4 md:p-6 rounded-xl transition-all duration-300 transform ${
                                    darkMode
                                        ? "bg-gray-800 text-gray-100 shadow-lg hover:scale-[1.01]"
                                        : "bg-white text-gray-900 shadow-md hover:scale-[1.01]"
                                }`}
                            >
                                <h2 className="text-lg md:text-xl font-medium mb-2">
                                    {currentChatTitle || "New Chat"}
                                </h2>
                                <p
                                    className={`text-sm md:text-base ${
                                        darkMode ? "opacity-90" : "opacity-80"
                                    }`}
                                >
                                    Start chatting with Owl AI to see messages
                                    here. The magic begins when you start
                                    typing!
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* DIRECTLY ADDED Message Input */}
                <div
                    className={`border-t p-4 ${
                        darkMode
                            ? "bg-[#0D1B2A] border-gray-700"
                            : "bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 border-gray-200"
                    }`}
                >
                    <div className="max-w-3xl mx-auto">
                        <div className="relative">
                            <div className="relative flex items-center">
                                <div className="relative flex-grow">
                                    <button
                                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                                            darkMode
                                                ? "text-[#FFC107] hover:bg-[#1B263B]"
                                                : "text-[#009688] hover:bg-gray-200"
                                        }`}
                                        aria-label="Add attachments"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg>
                                    </button>

                                    <input
                                        type="text"
                                        placeholder="Ask your Owl AI anything..."
                                        className={`w-full py-3 pl-10 pr-12 rounded-2xl shadow-sm focus:outline-none focus:ring-2 ${
                                            darkMode
                                                ? "bg-[#1B263B] text-white placeholder-gray-400 focus:ring-[#009688] border border-[#0D1B2A]"
                                                : "bg-white text-gray-900 placeholder-gray-500 focus:ring-[#009688] border border-gray-200"
                                        }`}
                                    />

                                    <button
                                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                                            darkMode
                                                ? "hover:bg-[#1B263B]"
                                                : "hover:bg-gray-200"
                                        }`}
                                    >
                                        <img
                                            src="/owlimg.png"
                                            alt="Send"
                                            className={`w-6 h-8 ${
                                                darkMode
                                                    ? "filter brightness-100"
                                                    : ""
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainContent;
