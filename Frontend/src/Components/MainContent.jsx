import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Link } from "react-router-dom";
import OwlLogo from "./OwlLogo";
import config from "../Config";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // for tables, strikethrough, task lists
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";


const MainContent = ({
    currentChatTitle,
    darkMode,
    isSidebarOpen,
    toggleSidebar,
    onLogout,
    toggleDarkMode,
}) => {
    const [message, setMessage] = useState("");
    const [messageCount, setMessageCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [loading, setLoading] = useState(false);
const [response, setResponse] = useState("");
const [displayedText, setDisplayedText] = useState("");
const [copiedIndex, setCopiedIndex] = useState(null);

const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedIndex, setSelectedIndex] = useState(null);
const [customRemark, setCustomRemark] = useState("");
const [isInterrupted, setIsInterrupted] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const isLoggedIn = !!user;
    const token = localStorage.getItem("token");
    const textareaRef = useRef(null);
    const scrollRef = useRef(null);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };


    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            const newHeight = Math.min(textareaRef.current.scrollHeight, 150);
            textareaRef.current.style.height = `${newHeight}px`;
        }
    }, [message]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatMessages]);
    function formatMarkdown(response) {
        if (typeof response !== "string") return "";
      
        // Just clean up stray undefined or weird chars, do NOT add asterisks or escape bold markdown
        return response.replace(/undefined/g, "").trim();
      }
      
      

    const handleSendMessage = async () => {
        setIsInterrupted(false);
        if (!message.trim()) return;
    
        const nextCount = messageCount + 1;
    
        if (!isLoggedIn && nextCount > 3) {
          setShowModal(true);
          return;
        }
    
        if (!isLoggedIn) {
          setMessageCount(nextCount);
        }
    
        const userMessage = { role: "user", content: message, isMarkdown: true, feedback: null };
        setChatMessages((prev) => [...prev, userMessage]);
    
        setMessage("");
        setLoading(true); // Start loading animation
    
        if (isLoggedIn) {

          try {
            const res = await fetch(`${config.apiUrl}/ask`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ query: message, user_id: user.uid }),
            });
    
            const data = await res.json();
            const fullResponse = data.response || "Sorry, no response from AI.";
            const formattedResponse = formatMarkdown(fullResponse);

            setResponse(formattedResponse); // still animate with typing
            setDisplayedText(""); // prepare typing
            
          } catch (err) {
            const botMessage = {
              role: "bot",
              content: "Oops! Something went wrong.",
            };
            setChatMessages((prev) => [...prev, botMessage]);
          } finally {
            setLoading(false); // End loading
          }
        } else {
          // For not logged in users, use dummy answers with no loading animation
          setLoading(false);
          const dummyAnswers = [
            "Sure! Here's a simple explanation.",
            "Of course! Let me help you with that.",
            "Absolutely, that's a great question!",
          ];
          const botMessage = {
            role: "bot",
            content: dummyAnswers[(chatMessages.length / 2) % 3 | 0],
          };
          setChatMessages((prev) => [...prev, botMessage]);
        }
      };
    
      useEffect(() => {
        if (!response) return;
      
        let i = 0;
        setDisplayedText("");
        const interval = setInterval(() => {
          if (i < response.length) {
            setDisplayedText((prev) => prev + response[i]);
            i++;
          } else {
            clearInterval(interval);
            // Add full message to chatMessages
            setChatMessages((prev) => [
              ...prev,
              { role: "bot", content: response, isMarkdown: true },
            ]);
            
            // Small delay before clearing displayedText, so React updates cleanly
            setTimeout(() => {
              setDisplayedText("");
              setResponse(""); // clear response to stop typing effect
            }, 200);
          }
        }, 10); // Adjust speed here
      
        return () => clearInterval(interval);
      }, [response]);
      
      const handleFeedback = (index, type) => {
        if (type === "dislike") {
          setSelectedIndex(index);
          setIsModalOpen(true);
        } else {
          sendFeedback(index, type, "Satisfied with the response");
        }
      };
      
      
      const sendFeedback = async (index, type, remarks) => {
        const score = type === "like" ? 1 : 0;
      
        const feedbackData = {
          chat_id: "abc-123",
          user_id: user.uid,
          usefulness_score: score,
          content_quality_score: score,
          remarks: remarks,
          flagged_reason: null,
        };
      
        try {
          await fetch(`${config.apiUrl}/feedback/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(feedbackData),
          });
      
          const updatedMessages = [...chatMessages];
          updatedMessages[index].feedback = type;
          setChatMessages(updatedMessages);
        } catch (error) {
          console.error("Feedback error:", error);
        }
      };
      
      
      
      const handleCopy = async (text, index) => {
        try {
          await navigator.clipboard.writeText(text);
          setCopiedIndex(index);
          setTimeout(() => setCopiedIndex(null), 5000); // reset after 2s
        } catch (err) {
          console.error("Copy failed:", err);
        }
      };
      
      const handleStopTyping = () => {
        setIsInterrupted(true);
        setLoading(false); // this stops the animation
        if (displayedText) {
          // push whatever is typed till now into chat
          setChatMessages((prev) => [
            ...prev,
            { role: "bot", content: displayedText }
          ]);
          setDisplayedText("");
        }
      };
      
      // Calculate dynamic padding based on window size
      const getLogoContainerStyle = () => {
        if (windowSize.width < 768) {
          return {
            marginTop: "4.5rem", // mt-18 equivalent
            marginBottom: "1rem",
            maxWidth: "90%",
          };
        } else {
          return {
            marginTop: "2rem",
            marginBottom: "0.5rem",
            maxWidth: "28rem",
          };
        }
      };

    return (
        <div className="relative flex w-full h-screen overflow-hidden">
            {/* Sidebar */}
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

            {/* Overlay */}
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

            {/* Main content */}
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
                    <div className="max-w-4xl mx-auto w-full flex-1 mb-48 flex flex-col items-center justify-center">
                        {chatMessages.length === 0 && isLoggedIn ? (
                            <div className="text-center space-y-6 px-4">
                                <h1 className={`text-3xl md:text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                                    {getGreeting()}, {user.firstName || "there"}!
                                </h1>
                                <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                    Let’s prepare together and make today productive.
                                </p>
                            </div>
                        ) : chatMessages.length === 0 ? (
                            <>
                                <div
                                    className="flex justify-center items-center"
                                    style={getLogoContainerStyle()}
                                >
                                    <OwlLogo />
                                </div>

                                <div className="text-center space-y-4 px-4 mt-2 md:mt-0">
                                    <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                                        How may I help you?
                                    </h1>
                                    <p className={`text-base md:text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                        Start your preparation with OwlAI and unlock your potential!
                                    </p>
                                </div>
                            </>
                        ) : null}
{chatMessages.map((msg, index) => (
  <div
    key={index}
    className={`w-fit max-w-3xl rounded-xl mb-4 px-4 py-2 text-md break-words
        ${
        msg.role === "user"
          ? darkMode
            ? "bg-gradient-to-r from-indigo-600 to-purple-700 text-white self-end"
            : "bg-gray-200 text-gray-800 self-end"
          : darkMode
          ? "text-gray-100 self-start"
          : "text-gray-900 self-start"
    }`}
    style={{
      boxShadow: darkMode
        ? "0 2px 10px rgba(255,255,255,0.05)"
        : "0 2px 10px rgba(0,0,0,0.1)",
    }}
  >
    {msg.role === "bot" ? (
        <>
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {formatMarkdown(msg.content)}
        </ReactMarkdown>
      </div>
      <div className="flex gap-4 mt-2 text-sm text-gray-500">
      <button
    onClick={() => handleFeedback(index, "like")}
    className={`hover:text-green-500 transition cursor-pointer ${
      msg.feedback === "like" ? "text-green-600 font-semibold" : ""
    }`}
  >
    👍 {msg.feedback === "like" && "Thanks!"}
  </button>

  <button
    onClick={() => handleFeedback(index, "dislike")}
    className={`hover:text-red-500 transition cursor-pointer ${
      msg.feedback === "dislike" ? "text-red-600 font-semibold" : ""
    }`}
  >
    👎 {msg.feedback === "dislike" && "Noted"}
  </button>

      <button
  onClick={() => handleCopy(msg.content, index)}
  className="hover:text-blue-500 transition flex items-center gap-1 cursor-pointer"
>
  {copiedIndex === index ? (
    <>
      ✔️ <span className="text-sm">Copied</span>
    </>
  ) : (
    <>
      📋 <span className="text-sm">Copy</span>
    </>
  )}
</button>
{isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
    <div className="bg-gray-800 rounded-lg p-6 w-96 relative shadow-lg">
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-2 right-2 text-white hover:text-black text-xl font-bold"
      >
        ×
      </button>

      <h2 className="text-lg font-semibold mb-4 text-white">Tell us what went wrong</h2>

      <textarea
        className="w-full h-24 border rounded p-2 text-sm border-[#009688] text-white"
        placeholder="Write your feedback..."
        value={customRemark}
        onChange={(e) => setCustomRemark(e.target.value)}
      />

      <div className="mt-4 flex justify-end gap-2">  
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-1 text-sm rounded bg-[#009688] text-white hover:bg-[#00796B]"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            sendFeedback(selectedIndex, "dislike", customRemark || "Not satisfied with the response");
            setIsModalOpen(false);
            setCustomRemark("");
          }}
          className="px-4 py-1 text-sm rounded bg-[#009688] text-white hover:bg-[#00796B]"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}


    </div>
    </>
    ) : (
      msg.content
    )}
  </div>
))}

{/* Show loading while waiting for response */}
{loading && !isInterrupted && (

  <div
    className={`w-full max-w-3xl rounded-lg p-4 ${
      darkMode ? "text-gray-100 self-start" : "text-gray-900 self-start"
    }`}
    style={{
      fontStyle: "italic",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    }}
  >
    Thinking
    <div className="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
)}


{/* Show typing text only if it exists (during typing) */}
{displayedText && !loading && (
  <div
    className={`w-full max-w-3xl rounded-lg p-4 ${
      darkMode ? " text-gray-100 self-start" : " text-gray-900 self-start"
    }`}
    style={{ whiteSpace: "pre-wrap" }}
  >
    {displayedText}
  </div>
)}


                    </div>

                </main>

                {/* Message Input */}
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

{loading ? (
  <button
    onClick={handleStopTyping}
    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full
        rounded-full p-1 cursor-pointer transition-all duration-300 group shadow-sm
      ${darkMode ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-300 text-black hover:bg-gray-400"}
    `}
    aria-label="Stop"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
) : (
  <button
    onClick={handleSendMessage}
    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full
      rounded-full p-1 cursor-pointer transition-all duration-300 group shadow-sm
      ${darkMode ? "bg-[#0f172a] text-white hover:bg-[#1B263B]" : "bg-white text-black hover:bg-gray-100"}
    `}
  >
    <ArrowUpwardIcon
      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110"
      fontSize="medium"
    />
  </button>
)}


                                </div>
                            </div>
                            {showModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-sm">
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl text-center animate-fade-in-up max-w-md mx-auto">
                                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                            Hey buddy!
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                                            Thanks for choosing <span className="text-[#009688] font-semibold">Owl AI</span>. Let's prepare together.
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
            <style>{`
       .typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background-color: currentColor;
  border-radius: 50%;
  animation: bounce 1.2s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}
.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}
.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

      `}</style>
        </div>
    );
};

export default MainContent;