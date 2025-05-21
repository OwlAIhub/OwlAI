import React from "react";

const MessageInput = ({ darkMode }) => {
    return (
        <div className={`border-t p-4 ${darkMode ? "bg-[#0D1B2A] border-gray-700" : "bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 border-gray-200"}`}>
            <div className="max-w-3xl mx-auto">
                <div className="relative">
                    {/* Main input container */}
                    <div className="relative flex items-center">
                        {/* Input field with inset plus button */}
                        <div className="relative flex-grow">
                            {/* Plus button inside input */}
                            <button
                                className={`absolute left-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${darkMode ? "text-[#FFC107] hover:bg-[#1B263B]" : "text-[#009688] hover:bg-gray-200"}`}
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
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </button>

                            {/* Input field */}
                            <input
                                type="text"
                                placeholder="Ask your Owl AI anything..."
                                className={`w-full py-3 pl-10 pr-12 rounded-2xl shadow-sm focus:outline-none focus:ring-2 ${darkMode ? "bg-[#1B263B] text-white placeholder-gray-400 focus:ring-[#009688] border border-[#0D1B2A]" : "bg-white text-gray-900 placeholder-gray-500 focus:ring-[#009688] border border-gray-200"}`}
                            />

                            {/* Send button with owl icon */}
                            <button
                                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${darkMode ? "hover:bg-[#1B263B]" : "hover:bg-gray-200"}`}
                            >
                                <img
                                    src="/owlimg2.png"
                                    alt="Send"
                                    className={`w-6 h-8 ${darkMode ? "filter brightness-100" : ""}`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageInput;