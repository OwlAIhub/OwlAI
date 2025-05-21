import React from "react";
import OwlLogo from "./owlLogo";

const MainContent = ({ currentChatTitle, darkMode }) => {
    return (
        <main
            className={`flex-1 overflow-auto p-4 md:p-6 flex flex-col ${
                darkMode ? "bg-gray-900" : "bg-gray-50"
            }`}
        >
            <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
                {/* Owl Animation Section */}
                <div className="flex-grow flex flex-col items-center justify-center text-center gap-4 px-4">
                    <div className="flex justify-center">
                        <OwlLogo className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36" />
                    </div>
                    <div className="space-y-2">
                        <h1
                            className={`text-2xl md:text-3xl lg:text-3xl font-semibold ${
                                darkMode ? "text-white" : "text-gray-900"
                            }`}
                        >
                            How may I help you?
                        </h1>
                        <p
                            className={`text-base md:text-lg lg:text-lg ${
                                darkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                        >
                            Start your preparation with OwlAI and unlock your potential!
                        </p>
                    </div>
                </div>

                {/* Chat Info Box */}
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
                            Start chatting with Owl AI to see messages here. The magic begins when you start typing!
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default MainContent;
