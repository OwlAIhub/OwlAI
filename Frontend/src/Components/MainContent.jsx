import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Link } from "react-router-dom";
import OwlLogo from "../assets/owlMascot.png"
import config from "../Config";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import OwlLoader from "./OwlLoader";
import { useLocation } from "react-router-dom";


const MainContent = ({
  currentChatTitle,
  darkMode,
  isSidebarOpen,
  toggleSidebar,
  onLogout,
  toggleDarkMode,
  sessionId,
  onUserProfileClick,
  setSesssionId,
}) => {
  const [message, setMessage] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
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
  const [chatId, setChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  
//   const [chatMessages, setChatMessages] = useState([]);

//  // In MainContent.jsx
// const [currentChat, setCurrentChat] = useState(null);
const [currentChat, setCurrentChat] = useState(() => {
  const savedChat = localStorage.getItem('selectedChat');
  return savedChat ? JSON.parse(savedChat) : null;
});

const [chatMessages, setChatMessages] = useState(() => {
  const savedMessages = localStorage.getItem(`chatMessages-${sessionId}`);
  return savedMessages ? JSON.parse(savedMessages) : [];
});

useEffect(() => {
  const savedChat = localStorage.getItem('selectedChat');
  if (savedChat) {
    setCurrentChat(JSON.parse(savedChat));
  }
}, []);

// 2. Set up event listeners
useEffect(() => {
  const handleStorageChange = (e) => {
    if (e.key === 'selectedChat') {
      setCurrentChat(e.newValue ? JSON.parse(e.newValue) : null);
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);

// useEffect(() => {
//   const loadMessages = async () => {
//     if (currentChat?.id) {
//       await fetchChatHistory(currentChat.id);
//     } else {
//       const savedChats = localStorage.getItem(`chatMessages-${sessionId}`);
//       setChatMessages(savedChats ? JSON.parse(savedChats) : []);
//     }
//   };

//   loadMessages();
// }, [currentChat, sessionId]);

// 3. Fetch chat history when currentChat changes
// useEffect(() => {
//   const loadMessages = async () => {
//     if (currentChat?.id) {
//       // If we have a current chat, fetch its history
//       await fetchChatHistory(currentChat.id);
//     } else {
//       // Otherwise check for sessionId messages
//       const savedChats = localStorage.getItem(`chatMessages-${sessionId}`);
//       setChatMessages(savedChats ? JSON.parse(savedChats) : []);
//     }
//   };

//   loadMessages();
// }, [currentChat, sessionId]);

// Debugging
// console.log('Current chat:', currentChat);

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;
  const token = localStorage.getItem("token");
  const textareaRef = useRef(null);
  const scrollRef = useRef(null);

  console.log("User Data:", user);
  // console.log("Is LIS Logged In:", isLoggedIn);
  // if (isLoggedIn && !user) {
  //     window.location.reload();
  // }

  useEffect(() => {
    localStorage.setItem(
      `chatMessages-${sessionId}`,
      JSON.stringify(chatMessages)
    );
  }, [chatMessages, sessionId]);


  //   try {
  //     const response = await fetch(`${config.apiUrl}/chat/${chatId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
      
  //     if (response.ok) {
  //       const data = await response.json();
        
  //       // Update session ID to match the chat being loaded
  //       localStorage.setItem("sessionId", chatId);
  //       setSesssionId(chatId);
        
  //       // Transform the API response into chat messages format
  //       const messages = [];
        
  //       if (data.data && Array.isArray(data.data)) {
  //         data.data.forEach((messageObj) => {
  //           if (messageObj.question_text) {
  //             messages.push({
  //               role: 'user',
  //               content: messageObj.question_text,
  //               isMarkdown: false,
  //               feedback: messageObj.feedback_rating,
  //               timestamp: messageObj.created_at
  //             });
  //           }
            
  //           if (messageObj.response_text) {
  //             messages.push({
  //               role: 'bot',
  //               content: messageObj.response_text,
  //               isMarkdown: true,
  //               feedback: messageObj.feedback_rating,
  //               timestamp: messageObj.created_at
  //             });
  //           }
  //         });
  //       }
        
  //       // Sort messages by timestamp to ensure correct order
  //       messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  //       setChatMessages(messages);
        
  //       // Store messages under the new session ID
  //       localStorage.setItem(`chatMessages-${chatId}`, JSON.stringify(messages));
  //     } else {
  //       console.error('Failed to fetch chat history');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching chat history:', error);
  //   }
  // };

  // console.log("Current session ID:", sessionId);

  const fetchChatHistory = React.useCallback(async (chatId) => {
    // Check if we already have messages for this chat in state
    if (chatMessages.some(msg => msg.chatId === chatId))
       {
      return;
    }
  
    try {
      const cacheKey = `chatHistory-${chatId}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      // Return cached data if it's fresh (less than 5 minutes old)
      if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);
        if (Date.now() - timestamp < 300000) { // 5 minutes
          processChatHistory(data);
          return;
        }
      }
  
      const response = await fetch(`${config.apiUrl}/chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Cache the response
        localStorage.setItem(cacheKey, JSON.stringify({
          timestamp: Date.now(),
          data
        }));
  
        processChatHistory(data);
      } else {
        console.error('Failed to fetch chat history');
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setIsHistoryLoaded(true);
    }
  }, [chatMessages, token]);
  
  const processChatHistory = (data) => {
    // Update session ID to match the chat being loaded
    localStorage.setItem("sessionId", data.chat_id);
    setSesssionId(data.chat_id);
    
    // Transform the API response into chat messages format
    const messages = [];
    
    if (data.data && Array.isArray(data.data)) {
      data.data.forEach((messageObj) => {
        if (messageObj.question_text) {
          messages.push({
            role: 'user',
            content: messageObj.question_text,
            isMarkdown: false,
            feedback: messageObj.feedback_rating,
            timestamp: messageObj.created_at,
            chatId: data.chat_id
          });
        }
        
        if (messageObj.response_text) {
          messages.push({
            role: 'bot',
            content: messageObj.response_text,
            isMarkdown: true,
            feedback: messageObj.feedback_rating,
            timestamp: messageObj.created_at,
            chatId: data.chat_id
          });
        }
      });
    }
    
    // Sort messages by timestamp to ensure correct order
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    setChatMessages(messages);
    
    // Store messages under the new session ID
    localStorage.setItem(`chatMessages-${data.chat_id}`, JSON.stringify(messages));
  };
  
  // Optimized useEffect for loading chat history
  useEffect(() => {
    // Only run this effect when the location pathname changes or currentChat changes
    if (!currentChat?.id || isHistoryLoaded) return;
  
    // Debounce the fetch call
    const timer = setTimeout(() => {
      fetchChatHistory(currentChat.id);
    }, 300);
  
    return () => clearTimeout(timer);
  }, [currentChat?.id, location.pathname, fetchChatHistory, isHistoryLoaded]);

  useEffect(() => {
    const handleNewSession = (event) => {
      // console.log("New session created:", event.detail?.sessionId);
      setChatMessages([]);
      setMessageCount(0);
      setResponse("");
      setDisplayedText("");
      setLoading(false);
    };
  
    window.addEventListener('newSessionCreated', handleNewSession);
    
    return () => {
      window.removeEventListener('newSessionCreated', handleNewSession);
    };
  }, []);

  useEffect(() => {
    const presetQuery = localStorage.getItem('presetQuery');
    if (presetQuery) {
      setMessage(presetQuery);
    }
  }, []);

// This loads messages when session changes
useEffect(() => {
  const savedSessionId = localStorage.getItem("sessionId");
  if (savedSessionId && savedSessionId !== sessionId) {
    // Load messages for the new session
    const savedChats = localStorage.getItem(`chatMessages-${savedSessionId}`);
    setChatMessages(savedChats ? JSON.parse(savedChats) : []);
  }
}, [sessionId]);

const messagesEndRef = useRef(null);

useEffect(() => {
  scrollToBottom();
}, [chatMessages, displayedText]);

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

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

  const [predefinedPrompts] = useState([
  "Paper 1 ka syllabus itna zyada hai... Kahaan se shuru karun?",
  "What is Teaching Aptitude?",
  "Enthnocentrism vs cultural relativism samjhao mujhe?",
  "Different types of Pollutants?"
]);

function formatMarkdown(response) {
  if (typeof response !== "string") return "";
  
  // Clean up the response but keep markdown intact
  return response
    .replace(/undefined/g, "")
    .replace(/\n{3,}/g, '\n\n') // Replace 3+ newlines with 2
    .trim();
}
const anonymousUserId = localStorage.getItem("anonymousUserId") ;
const anonymousSessionId = localStorage.getItem("anonymousSessionId") ;
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

          localStorage.removeItem('presetQuery');


    setMessage("");
    setLoading(true);

    if (isLoggedIn) {
      try {
        const Id = localStorage.getItem("sessionId");
        const res = await fetch(`${config.apiUrl}/ask`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query: message, user_id: user.uid, session_id:Id }),
        });

        const data = await res.json();
        const fullResponse = data.response || "Sorry, no response from AI.";
        const chatId = data.chat_id;
        setChatId(chatId);
        const formattedResponse = formatMarkdown(fullResponse);

        window.dispatchEvent(new CustomEvent('newChatMessage', {
          detail: {
            sessionId: Id,
            message: message // First message as potential title
          }
        }));

        setResponse(formattedResponse);
        setDisplayedText("");
        
      } catch (err) {
        const botMessage = {
          role: "bot",
          content: "Oops! Something went wrong.",
        };
        setChatMessages((prev) => [...prev, botMessage]);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        // Make API call to get AI response
        const res = await fetch(`${config.apiUrl}/ask`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            query: message, 
            user_id: anonymousUserId, 
            session_id: anonymousSessionId 
          }),
        });
    
        if (!res.ok) {
          throw new Error(`API request failed with status ${res.status}`);
        }
    
        const data = await res.json();
        const fullResponse = data.response || "Sorry, I couldn't generate a response.";
        const formattedResponse = formatMarkdown(fullResponse);
    
        const botMessage = {
          role: "bot",
          content: formattedResponse,
        };
        setChatMessages((prev) => [...prev, botMessage]);
    
      } catch (err) {
        console.error("Error fetching AI response:", err);
        
        const botMessage = {
          role: "bot",
          content: "I'm having trouble connecting to the server. Please try again later.",
        };
        setChatMessages((prev) => [...prev, botMessage]);
      } finally {
        setLoading(false);
      }
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
      setChatMessages((prev) => [
        ...prev,
        { role: "bot", content: response, isMarkdown: true },
      ]);
      
      setTimeout(() => {
        setDisplayedText("");
        setResponse("");
      }, 200);
    }
  }, 1);

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
      chat_id: chatId,
      user_id: user.uid,
      usefulness_score: score,
      content_quality_score: score,
      msg: remarks,
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
      setTimeout(() => setCopiedIndex(null), 5000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleStopTyping = () => {
    setIsInterrupted(true);
    setLoading(false);
    if (displayedText) {
      setChatMessages((prev) => [
        ...prev,
        { role: "bot", content: displayedText }
      ]);
      setDisplayedText("");
    }
  };

  const getLogoContainerStyle = () => {
    if (windowSize.width < 768) {
      return {
        // marginTop: "4.5rem",
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
  useEffect(() => {
    const hasData = sessionId || currentChat || 
                   localStorage.getItem("sessionId") || 
                   localStorage.getItem("selectedChat") || anonymousSessionId || anonymousUserId
  
    if (!hasData) {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => setIsLoading(false), 1500); 
      return () => clearTimeout(timer);
    }
  }, [sessionId, currentChat]);
  
  if (isLoading) {
    return <OwlLoader darkMode={darkMode} />;
  }

  return (
<div className="relative flex w-full h-screen overflow-hidden">
{/* Sidebar */}
      <div
        className={`fixed inset-y-0 z-20 ${darkMode ? 'bg-gray-900' : 'bg-white'} 
          ${isSidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'} 
          transition-all duration-800 ease-[cubic-bezier(0.25,0.1,0.25,1.1)]
          w-64 lg:w-72
          border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
        style={{
          willChange: 'transform',
          transitionProperty: 'transform, box-shadow',
        }}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
          darkMode={darkMode}
          currentUser={{ plan: "Free" }}
          onUserProfileClick={onUserProfileClick}
          onNewChat={() => {}}
          onSelectChat={() => {}}
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
          onUserProfileClick={onUserProfileClick}
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
      Let's prepare together and make today productive.
    </p>
  </div>
) : chatMessages.length === 0 ? (
  <>
    <div className="flex justify-center items-center" style={getLogoContainerStyle()}>
      <img src={OwlLogo} alt="logo" className="w-2/4" />
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

{chatMessages.length === 0 && (
  <div className={`max-w-3xl mx-auto mt-20 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
    <h3 className="text-lg font-medium mb-3">Try asking me:</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 cursor-pointer">
      {predefinedPrompts.map((prompt, index) => (
        <button
          key={index}
          onClick={() => setMessage(prompt)}
          className={`p-3 rounded-lg text-left transition-all hover:scale-[1.02] cursor-pointer ${
            darkMode 
              ? "bg-gray-800 hover:bg-gray-700 border border-gray-700" 
              : "bg-white hover:bg-gray-100 border border-gray-200"
          }`}
        >
          {prompt}
        </button>
      ))}
    </div>
  </div>
)}

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
  <ReactMarkdown 
    remarkPlugins={[remarkGfm]}
    components={{
      h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-4 text-blue-600 dark:text-blue-400" {...props} />,
      h2: ({node, ...props}) => <h2 className="text-xl font-bold my-3 text-blue-500 dark:text-blue-300" {...props} />,
      h3: ({node, ...props}) => <h3 className="text-lg font-semibold my-2 text-blue-400 dark:text-blue-200" {...props} />,
      p: ({node, ...props}) => <p className="my-3 leading-relaxed" {...props} />,
      strong: ({node, ...props}) => <strong className="font-bold text-yellow-600 dark:text-yellow-400" {...props} />,
      em: ({node, ...props}) => <em className="italic" {...props} />,
      ul: ({node, ...props}) => <ul className="list-disc pl-5 my-2" {...props} />,
      ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-2" {...props} />,
      li: ({node, ...props}) => <li className="my-1" {...props} />,
    }}
  >
    {msg.content}
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

      {/* ✅ Predefined feedback options */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["Not satisfied", "Too vague", "Irrelevant", "Incomplete", "Wrong answer"].map((label) => (
          <button
            key={label}
            onClick={() => setCustomRemark(label)}
            className="bg-[#37474F] text-white text-sm px-3 py-1 rounded hover:bg-[#455A64]"
          >
            {label}
          </button>
        ))}
      </div>

      <textarea
        className="w-full h-24 border rounded p-2 text-sm border-[#009688] text-white bg-gray-700"
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
            sendFeedback(
              selectedIndex,
              "dislike",
              customRemark || "Not satisfied with the response"
            );
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
          <div ref={messagesEndRef} />

                    </div>
                  </>
                ) : (
                  msg.content
                )}
              </div>
            ))}

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

{displayedText && !loading && (
  <div className={`w-fit max-w-3xl rounded-xl mb-4 px-4 py-2 text-md break-words ${
    darkMode ? "text-gray-100 self-start" : "text-gray-900 self-start"
  }`} style={{
    boxShadow: darkMode
      ? "0 2px 10px rgba(255,255,255,0.05)"
      : "0 2px 10px rgba(0,0,0,0.1)",
  }}>
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-4 text-blue-600 dark:text-blue-400" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl font-bold my-3 text-blue-500 dark:text-blue-300" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-lg font-semibold my-2 text-blue-400 dark:text-blue-200" {...props} />,
          p: ({node, ...props}) => <p className="my-3 leading-relaxed" {...props} />,
          strong: ({node, ...props}) => <strong className="font-bold text-yellow-600 dark:text-yellow-400" {...props} />,
          em: ({node, ...props}) => <em className="italic" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 my-2" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-2" {...props} />,
          li: ({node, ...props}) => <li className="my-1" {...props} />,
        }}
      >
        {displayedText}
      </ReactMarkdown>
    </div>
  </div>
)}
          </div>
        </main>
        {/* Message Input */}
        <div className={`fixed bottom-0 left-0 right-0 border-t p-4 ${
      darkMode
        ? "bg-[#0D1B2A] border-gray-700"
        : "bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 border-gray-200"
    } ${isSidebarOpen ? 'md:left-64 lg:left-72' : 'left-0'}`}
    style={{
      transition: 'left 0.7s cubic-bezier(0.25,0.1,0.25,1.1)',
      willChange: 'left'
    }}>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="relative flex items-center">
                <div className="relative flex-grow">
                  {/* <button
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
                  </button> */}

                  <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask your Owl AI anything..."
            rows={1}
            className={`w-full py-3 pl-10 pr-12 rounded-2xl shadow-sm resize-none overflow-y-auto max-h-[150px] no-scrollbar focus:outline-none focus:ring-2 ${
              darkMode
                ? "bg-[#1B263B] text-white placeholder-gray-400 focus:ring-[#009688] border border-[#0D1B2A]"
                : "bg-white text-gray-900 placeholder-gray-500 focus:ring-[#009688] border border-gray-200"
            }`}
            disabled={!isLoggedIn && messageCount >= 4}
          />

                  {loading ? (
                    <button
                      onClick={handleStopTyping}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full
                          cursor-pointer transition-all duration-300 group shadow-sm
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
                        cursor-pointer transition-all duration-300 group shadow-sm
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

        .markdown-header-1 {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 1rem 0;
  color: #3b82f6;
}

.markdown-header-2 {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0.75rem 0;
  color: #60a5fa;
}

.markdown-header-3 {
  font-size: 1.125rem;
  font-weight: bold;
  margin: 0.5rem 0;
  color: #93c5fd;
}

.dark .markdown-header-1 {
  color: #60a5fa;
}

.dark .markdown-header-2 {
  color: #93c5fd;
}

.dark .markdown-header-3 {
  color: #bfdbfe;
}

.prose p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.prose strong {
  font-weight: bold;
  color: #d97706;
}

.dark .prose strong {
  color: #f59e0b;
}
  .prompt-button {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.prompt-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark .prompt-button:hover {
  box-shadow: 0 4px 6px rgba(255, 255, 255, 0.1);
}
      `}</style>
    </div>
  );
};

export default MainContent;