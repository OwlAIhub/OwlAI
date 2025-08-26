import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import UserProfile from "./pages/UserProfile.jsx";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Questionnaire from "./Components/Questionnaire";
import { ChatLayout } from "./Components/ChatLayout";
import { AnimatePresence, motion } from "framer-motion";
import config from "./config";
import LandingPage from "./Components/LandingPage.jsx";
import { NotFoundPage } from "@/components/features/error";
import { logger } from "./utils/logger";
import { LenisProvider } from "./components/providers/LenisProvider";
import { StoreProvider } from "./stores/StoreProvider";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : true;
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentChatTitle, setCurrentChatTitle] = useState("Learning Theories");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const sessionCreatedRef = useRef(false);

  useEffect(() => {
    // Apply dark mode class on initial load
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save to localStorage whenever darkMode changes
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Function to create new session
  const createNewSession = async (userId: string) => {
    if (sessionCreatedRef.current) return;
    try {
      sessionCreatedRef.current = true;
      const res = await fetch(
        `${config.apiUrl}/session/create?user_id=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      // console.log("Session created:", data.session_id);
      setSessionId(data.session_id);
      localStorage.setItem("sessionId", data.session_id);
      return data.session_id;
    } catch (err) {
      logger.error("Failed to create session", "App", err);
      toast.error("Failed to create chat session");
      return null;
    }
  };

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user && user.uid) {
          setIsLoggedIn(true);
          setAuthReady(true);
          return;
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // If no valid user found, set as not logged in
    setIsLoggedIn(false);
    setAuthReady(true);
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const handleAuthChange = () => {
      const userString = localStorage.getItem("user");
      if (userString) {
        try {
          const user = JSON.parse(userString);
          if (user && user.uid) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } catch (error) {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    // Listen for custom auth events
    window.addEventListener("authStateChanged", handleAuthChange);
    return () =>
      window.removeEventListener("authStateChanged", handleAuthChange);
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsSidebarOpen(!mobile);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev: boolean) => !prev);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev: any) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return newMode;
    });
  };

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("user");
    localStorage.removeItem("sessionId");
    localStorage.removeItem("selectedChat");

    // Reset state
    setIsLoggedIn(false);
    setCurrentChatTitle("Learning Theories");
    setSessionId(null);

    // Dispatch auth state change event
    window.dispatchEvent(new CustomEvent("authStateChanged"));

    toast.info("You've been signed out.");

    // Redirect to landing page
    window.location.href = "/OwlAi";
  };

  const handleNewChat = async () => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      toast.error("Please log in to start a new chat");
      return;
    }
    const user = JSON.parse(userString);
    if (!user) {
      toast.error("Please log in to start a new chat");
      return;
    }

    try {
      // Clear previous session data
      localStorage.removeItem("sessionId");
      localStorage.removeItem("selectedChat");
      setSessionId(null);

      // Create new session
      const newSessionId = await createNewSession(user.uid || "");

      if (newSessionId) {
        setSessionId(newSessionId);
        setCurrentChatTitle("New Chat");
        toast.success("New chat started!");

        // Dispatch both events to ensure all components catch it
        window.dispatchEvent(new CustomEvent("newSessionCreated"));
        window.dispatchEvent(new CustomEvent("sessionChanged"));
      }
    } catch (err) {
      logger.error("Failed to create new session", "App", err);
      toast.error("Failed to start new chat");
    }
  };

  // Wrapper function to match Sidebar component's expected type
  const handleSetSessionId = (id: string | null) => {
    setSessionId(id);
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!authReady) return null;
    return isLoggedIn ? children : <Navigate to="/login" replace />;
  };

  useEffect(() => {
    // Check if we already have an anonymous session and if no logged-in session exists
    if (
      !localStorage.getItem("anonymousSessionId") &&
      !localStorage.getItem("anonymousSessionInitialized")
    ) {
      const initAnonymousSession = async () => {
        try {
          const res = await fetch(`${config.apiUrl}/session/init-anon`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();
          logger.info("Anonymous session initialized", "App", data);

          // Store session data
          localStorage.setItem("anonymousSessionId", data.session_id);
          localStorage.setItem("anonymousUserId", data.user_id);

          localStorage.setItem("anonymousSessionInitialized", "true");
        } catch (err) {
          logger.error("Failed to initialize anonymous session", "App", err);
        }
      };

      initAnonymousSession();
    }
  }, [sessionId]); // Only runs when sessionId changes

  const MainAppContent = () => {
    return (
      <ChatLayout
        darkMode={darkMode}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        currentChatTitle={currentChatTitle}
        isLoggedIn={isLoggedIn}
        sessionId={sessionId}
        setSessionId={handleSetSessionId}
        onLogout={handleLogout}
        toggleDarkMode={toggleDarkMode}
        onUserProfileClick={() => setShowProfileModal(true)}
        onNewChat={handleNewChat}
      />
    );
  };

  return (
    <StoreProvider>
      <LenisProvider>
        <Router>
          <div
            className={`${
              darkMode ? "dark bg-gray-900" : "bg-gray-50"
            } min-h-screen`}
          >
            <div className="dark:bg-gray-900 dark:text-white">
              <Routes>
                <Route path="/OwlAi" element={<LandingPage />} />
                <Route path="/" element={<Navigate to="/OwlAi" replace />} />
                <Route
                  path="/login"
                  element={
                    isLoggedIn ? <Navigate to="/chat" replace /> : <Login />
                  }
                />
                <Route
                  path="/signup"
                  element={
                    isLoggedIn ? <Navigate to="/chat" replace /> : <Signup />
                  }
                />
                <Route
                  path="/questionnaire"
                  element={
                    <ProtectedRoute>
                      <Questionnaire />
                    </ProtectedRoute>
                  }
                />
                <Route path="/chat" element={<MainAppContent />} />
                <Route
                  path="/subscription"
                  element={
                    <ProtectedRoute>
                      <SubscriptionPlans
                        darkMode={darkMode}
                        onClose={() => window.history.back()}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>

            {/* User Profile Modal */}
            <AnimatePresence>
              {showProfileModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                  onClick={() => setShowProfileModal(false)}
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ type: "spring", damping: 25 }}
                    className="w-full max-w-2xl"
                    onClick={e => e.stopPropagation()}
                  >
                    <UserProfile
                      darkMode={darkMode}
                      onClose={() => setShowProfileModal(false)}
                      onLogout={handleLogout}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme={darkMode ? "dark" : "light"}
              toastClassName={() =>
                `rounded-xl px-4 py-3 border-l-4 shadow-md ${
                  darkMode
                    ? "bg-gray-800 text-white border-emerald-400"
                    : "bg-white text-gray-900 border-[#52B788]"
                }`
              }
              className="text-sm font-medium"
              progressClassName={`${
                darkMode ? "bg-emerald-400" : "bg-[#52B788]"
              } h-1 rounded-b`}
              closeButton={false}
            />
          </div>
        </Router>
      </LenisProvider>
    </StoreProvider>
  );
}

export default App;
