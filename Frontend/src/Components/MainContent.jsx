import React from "react";

const MainContent = ({ currentChatTitle, darkMode }) => {
    return (
        <main className="flex-1 overflow-auto p-4">
            <div className="max-w-3xl mx-auto">
                <div
                    className={`p-6 rounded-xl mb-6 transition-all duration-300 ease-in-out transform ${
                        darkMode
                            ? " bg-gray-900 text-white shadow-lg hover:scale-105"
                            : " bg-white text-gray-900 shadow-xl hover:scale-105"
                    }`}
                >
                    <h2 className="text-2xl font-semibold mb-3">
                        {currentChatTitle}
                    </h2>
                    <p className="text-sm leading-relaxed">
                        Start chatting with Owl AI to see messages here. The
                        magic begins once you begin!
                    </p>
                </div>
            </div>
        </main>
    );
};

export default MainContent;
