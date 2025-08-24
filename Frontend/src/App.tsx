import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainContent from "./Components/MainContent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import UserProfile from "./pages/UserProfile.jsx";
import Login from "./Components/Login";
import Questionnaire from "./Components/Questionnaire";
import Sidebar from "./Components/Sidebar";
import { AnimatePresence, motion } from "framer-motion";
import config from "./config";
import LandingPage from "./Components/LandingPage.jsx";
import { logger } from "./utils/logger";

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
    // Temporarily disable Firebase auth to prevent errors
    // TODO: Re-enable when Firebase is properly configured
    setIsLoggedIn(false);
    setAuthReady(true);

    // Mock auth state for development
    // const unsubscribe = auth.onAuthStateChanged((user) => {
    //   const wasLoggedIn = isLoggedIn;
    //   setIsLoggedIn(!!user);
    //   setAuthReady(true);

    //   if (user && !wasLoggedIn) {
    //     // Just create session, don't navigate
    //     createNewSession(user.uid);
    //   } else if (!user && wasLoggedIn) {
    //     // Handle logout cleanup
    //     localStorage.removeItem("sessionId");
    //     localStorage.removeItem("user");
    //     setSessionId(null);
    //   }
    // });
    // return () => unsubscribe();
  }, [isLoggedIn]); // Remove navigate from dependencies

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
    // Temporarily disable Firebase auth to prevent errors
    // TODO: Re-enable when Firebase is properly configured
    localStorage.clear();
    setDarkMode(true);
    document.documentElement.classList.add("dark");
    //clear all local storage items
    localStorage.removeItem("user");
    localStorage.clear();
    toast.info("You've been signed out.");
    setCurrentChatTitle("Learning Theories");
    setSessionId(null);

    // Mock logout for development
    // auth
    //   .signOut()
    //   .then(() => {
    //     localStorage.clear();
    //     setDarkMode(true);
    //     document.documentElement.classList.add("dark");
    //     //clear all local storage items
    //     localStorage.removeItem("user");
    //     localStorage.clear();
    //     toast.info("You've been signed out.");
    //     setCurrentChatTitle("Learning Theories");
    //     setSessionId(null);
    //   })
    //   .catch(() => {
    //     toast.error("Failed to sign out.");
    //   });
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
  const handleSetSessionId = (id: string) => {
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
    // useEffect(() => {
    //   if (location.state?.showSignInToast) {
    //     toast.success("Signed in successfully! 🚀");
    //     navigate(location.pathname, { replace: true, state: {} });
    //     window.location.reload(); // Reload to apply changes
    //     console.log("User signed in, reloading page...");
    //   }
    // }, [location, navigate]);

    return (
      <div className="flex h-full">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={toggleSidebar}
              darkMode={darkMode}
              currentUser={{ plan: "Free" }}
              onUserProfileClick={() => setShowProfileModal(true)}
              onNewChat={handleNewChat}
              setSesssionId={handleSetSessionId}
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <MainContent
          currentChatTitle={currentChatTitle}
          darkMode={darkMode}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          onLogout={handleLogout}
          toggleDarkMode={toggleDarkMode}
          sessionId={sessionId}
          setSesssionId={handleSetSessionId}
          onUserProfileClick={() => setShowProfileModal(true)}
        />
      </div>
    );
  };

  return (
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
              element={isLoggedIn ? <Navigate to="/chat" replace /> : <Login />}
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
            <Route path="*" element={<Navigate to="/OwlAi" replace />} />
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
                onClick={(e) => e.stopPropagation()}
              >
                <UserProfile
                  darkMode={darkMode}
                  onClose={() => setShowProfileModal(false)}
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
  );
}

export default App;
