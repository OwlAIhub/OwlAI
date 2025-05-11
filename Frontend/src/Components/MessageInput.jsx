import React from "react";

const MessageInput = ({ darkMode }) => {
    return (
        <div
            className={`border-t p-4 bg-opacity-60 backdrop-blur-lg transition-all duration-300 ease-in-out ${
                darkMode
                    ? "bg-gradient-to-r from-gray-800 to-gray-900 text-white"
                    : "bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 text-gray-900"
            }`}
        >
            <div className="max-w-3xl mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Ask your Owl AI anything..."
                        className={`w-full py-3 pl-4 pr-12 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-teal-500 transition-all duration-200 ${
                            darkMode
                                ? "bg-gray-700 text-white placeholder-gray-400"
                                : "bg-white text-gray-900 placeholder-gray-500"
                        }`}
                    />
                    <button
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-3 rounded-full ${
                            darkMode
                                ? "bg-teal-600 hover:bg-teal-700 text-white shadow-xl"
                                : "bg-teal-500 hover:bg-teal-600 text-white shadow-md"
                        } transition-all duration-300 ease-in-out`}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageInput;
