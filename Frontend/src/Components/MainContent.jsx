import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Link } from "react-router-dom";


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

    const [message, setMessage] = useState("");
    const [messageCount, setMessageCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);

    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            const newHeight = Math.min(textareaRef.current.scrollHeight, 150); // max 150px
            textareaRef.current.style.height = `${newHeight}px`;
        }
    }, [message]);
    const scrollRef = useRef(null);

    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [chatMessages]);


    const handleSendMessage = () => {
        if (!message.trim()) return;

        const nextCount = messageCount + 1;
        console.log("Message Count:", nextCount);

        if (!isLoggedIn && nextCount > 3) {
            setShowModal(true);
            return;
        }

        if (!isLoggedIn) {
            setMessageCount(nextCount);
        }

        const userMessage = { role: "user", content: message };
        const dummyAnswers = [
            "Sure! Here's a simple explanation.",
            "Of course! Let me help you with that.",
            "Absolutely, that's a great question!"
        ];
        const botMessage = {
            role: "bot",
            content: dummyAnswers[chatMessages.length / 2 % 3 | 0]
        };

        setChatMessages(prev => [...prev, userMessage, botMessage]);
        setMessage("");
    };

    return (
        <div className="relative flex w-full h-screen overflow-hidden">
            {/* Enhanced Sidebar with luxurious animation */}
            <div
                className={`fixed inset-y-0 z-20 ${darkMode ? 'bg-gray-900' : 'bg-white'} 
                    ${isSidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'} 
                    transition-all duration-800 ease-[cubic-bezier(0.25,0.1,0.25,1.1)]
                    w-64 md:w-72
                    border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                style={{
                    willChange: 'transform',
                    transitionProperty: 'transform, box-shadow',
                }}
            >
                <Sidebar
                    isOpen={isSidebarOpen}
                    isLoggedIn={isLoggedIn}
                    onClose={toggleSidebar}
                    onNewChat={() => { }}
                    onSelectChat={() => { }}
                    onLogout={onLogout}
                    darkMode={darkMode}
                    isMobile={false}
                />
            </div>

            {/* Enhanced Overlay with matching animation */}
            {isSidebarOpen && (
                <div
                    className={`fixed inset-0 z-10 bg-black transition-opacity duration-600 ease-in-out ${isSidebarOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
                        } md:hidden`}
                    onClick={toggleSidebar}
                    style={{
                        willChange: 'opacity',
                    }}
                />
            )}

            {/* Main content with coordinated animation */}
            <div
                className={`flex-1 flex flex-col overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.1)]
                    ${isSidebarOpen ? 'md:ml-64 lg:ml-72' : 'ml-0'}`}
                style={{
                    willChange: 'margin',
                }}
            >
                <Header
                    currentChatTitle={currentChatTitle}
                    onToggleSidebar={toggleSidebar}
                    isLoggedIn={isLoggedIn}
                    onLogout={onLogout}
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                />

                <main
                    className={`flex-1 overflow-auto p-4 md:p-6 flex flex-col ${darkMode ? "bg-gray-900" : "bg-gray-50"
                        }`}
                >
                    <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">


                        {chatMessages.length === 0 && (
                            <div className="flex-grow flex flex-col items-center justify-center text-center gap-4 px-4">
                                <div className="space-y-2">
                                    <h1
                                        className={`text-2xl md:text-3xl lg:text-3xl font-semibold ${darkMode ? "text-white" : "text-gray-900"
                                            }`}
                                    >
                                        How may I help you?
                                    </h1>
                                    <p
                                        className={`text-base md:text-lg lg:text-lg ${darkMode ? "text-gray-300" : "text-gray-600"
                                            }`}
                                    >
                                        Start your preparation with OwlAI and unlock your potential!
                                    </p>
                                </div>
                            </div>
                        )}

                        {chatMessages.length === 0 && (

                            <div className="w-full max-w-xl mt-4 mb-6 px-2">
                                <div
                                    className={`p-4 md:p-6 rounded-xl transition-all duration-300 transform ${darkMode
                                        ? "bg-gray-800 text-gray-100 shadow-lg hover:scale-[1.01]"
                                        : "bg-white text-gray-900 shadow-md hover:scale-[1.01]"
                                        }`}
                                >
                                    <h2 className="text-lg md:text-xl font-medium mb-2">
                                        {currentChatTitle || "New Chat"}
                                    </h2>
                                    <p
                                        className={`text-sm md:text-base ${darkMode ? "opacity-90" : "opacity-80"
                                            }`}
                                    >
                                        Start chatting with Owl AI to see messages
                                        here. The magic begins when you start
                                        typing!
                                    </p>
                                </div>
                            </div>
                        )}
                     <div className="w-full max-w-2xl mx-auto mb-64 px-4">
  <div className="space-y-2">
    {chatMessages.length > 0 && (
      <div
        className="w-full max-w-2xl mx-auto mb-4 px-4 space-y-6"
        style={{ maxHeight: '500px', overflowY: 'auto', scrollBehavior: 'smooth' }}
        ref={scrollRef}
      >
        {chatMessages.reduce((acc, msg, index, arr) => {
          if (msg.role === "user") {
            const botMsg = arr[index + 1];
            acc.push(
              <div key={`pair-${index}`} className="flex flex-col space-y-2">
                {/* User Message */}
                <div className="self-end max-w-[80%] p-3 rounded-xl break-words whitespace-pre-wrap bg-[#009688] text-white text-left">
                  {msg.content}
                </div>
                {/* Bot Message */}
                {botMsg && botMsg.role === "bot" && (
                  <div
                    key={`bot-${index}`}
                    className={`self-start max-w-[80%] p-3 rounded-xl break-words whitespace-pre-wrap${darkMode ? "text-white-90" : "text-gray-800"
                    }`}
                  >
                    {botMsg.content}
                  </div>
                )}
              </div>
            );
          }
          return acc;
        }, [])}
      </div>
    )}
  </div>
</div>

                    </div>
                </main>

                {/* DIRECTLY ADDED Message Input */}
                <div
                    className={`border-t p-4 ${darkMode
                        ? "bg-[#0D1B2A] border-gray-700"
                        : "bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 border-gray-200"
                        }`}
                >
                    <div className="max-w-3xl mx-auto">
                        <div className="relative">
                            <div className="relative flex items-center">
                                <div className="relative flex-grow">
                                    <button
                                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${darkMode
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

                                    <textarea
                                        ref={textareaRef}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Ask your Owl AI anything..."
                                        rows={1}
                                        className={`w-full py-3 pl-10 pr-12 rounded-2xl shadow-sm resize-none overflow-y-auto max-h-[150px] no-scrollbar focus:outline-none focus:ring-2 ${darkMode
                                            ? "bg-[#1B263B] text-white placeholder-gray-400 focus:ring-[#009688] border border-[#0D1B2A]"
                                            : "bg-white text-gray-900 placeholder-gray-500 focus:ring-[#009688] border border-gray-200"
                                            }`}
                                        disabled={!isLoggedIn && messageCount >= 4}
                                    />




                                    <button
                                        onClick={handleSendMessage}
                                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full cursor-pointer transition-all duration-300
         group
        ${darkMode ? " hover:bg-[#1B263B]" : " hover:bg-gray-100"}
    `}
                                    >
                                        <img
                                            src="/owlimg.png"
                                            alt="Send"
                                            className={`w-8 h-8 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-105
            ${darkMode ? "filter brightness-110" : "filter brightness-95"}
        `}
                                        />
                                    </button>

                                </div>
                            </div>
                            {showModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-sm">
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl text-center animate-fade-in-up max-w-md mx-auto">
                                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                            Hey buddy!
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                                            Thanks for choosing <span className="text-[#009688] font-semibold">Owl AI</span>. Let’s prepare together.
                                        </p>
                                        <Link to="/login">
                                            <button
                                                className="mt-2 px-6 py-2 rounded-full text-white bg-[#009688] hover:bg-[#00796B] transition"
                                            >
                                                Login to Continue
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainContent;
