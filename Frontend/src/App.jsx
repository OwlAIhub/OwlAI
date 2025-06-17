import { useState, useEffect, use } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
    useNavigate,
} from "react-router-dom";
import MainContent from "./Components/MainContent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import UserProfile from "./pages/UserProfile.jsx";
import Login from "./Components/Login.jsx";
import Questionnaire from "./Components/Questionnaire";
import { auth } from "./firebase.js";
import Sidebar from "./Components/Sidebar";
import { AnimatePresence, motion } from "framer-motion";
import config from "./Config.js";
import LandingPage from "./Components/LandingPage.jsx";

function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true;
  });  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentChatTitle, setCurrentChatTitle] = useState("Learning Theories");
  const [sessionId, setSessionId] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null); // State to store clicked chat ID

  useEffect(() => {
    // Apply dark mode class on initial load
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to localStorage whenever darkMode changes
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Function to create new session
  const createNewSession = async (userId) => {
    try {
      const res = await fetch(`${config.apiUrl}/session/create?user_id=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
      });
      
      const data = await res.json();
      // console.log("Session created:", data.session_id);
      setSessionId(data.session_id);
      localStorage.setItem("sessionId", data.session_id);
      return data.session_id;
    } catch (err) {
      console.error("Failed to create session:", err);
      toast.error("Failed to create chat session");
      return null;
    }
  };

  // Authentication state change handler
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      const wasLoggedIn = isLoggedIn;
      setIsLoggedIn(!!user);
      setAuthReady(true);

      if (user && !wasLoggedIn) {
        // User just logged in - create new session
        // console.log("User logged in, creating new session...");
        
        // Clear any existing session data
        localStorage.removeItem("sessionId");
        setSessionId(null);
        
        // Create new session for the logged-in user
        await createNewSession(user.uid);
        
        // Store user data
        localStorage.setItem("user", JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        }));
        
        setCurrentChatTitle("Learning Theories");
      } else if (!user && wasLoggedIn) {
        // User logged out - clear session data
        // console.log("User logged out, clearing session data...");
        localStorage.removeItem("sessionId");
        localStorage.removeItem("user");
        setSessionId(null);
        setCurrentChatTitle("Learning Theories");
      } else if (user && wasLoggedIn) {
        // User was already logged in - check if session exists
        const existingSessionId = localStorage.getItem("sessionId");
        if (!existingSessionId) {
          // console.log("Existing user without session, creating new session...");
          await createNewSession(user.uid);
        } else {
          setSessionId(existingSessionId);
        }
      }
    });
    
    return () => unsubscribe();
  }, [isLoggedIn]); // Add isLoggedIn as dependency to track login state changes

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);


    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setIsSidebarOpen(!mobile);
        };
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);


  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  };

const handleLogout = () => {
  auth
    .signOut()
    .then(() => {
      localStorage.clear();
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      //clear all local storage items
      localStorage.removeItem("user");
      localStorage.clear();
      toast.info("You've been signed out.");
      setCurrentChatTitle("Learning Theories");
      setSessionId(null);
    })
    .catch(() => {
      toast.error("Failed to sign out.");
    });
};

  const handleNewChat = async () => {
    // console.log("Starting new chat...");
    const user = JSON.parse(localStorage.getItem("user"));
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
      const newSessionId = await createNewSession(user.uid);
      
      if (newSessionId) {
        setSessionId(newSessionId);
        setCurrentChatTitle("New Chat");
        toast.success("New chat started!");
        
        // Dispatch both events to ensure all components catch it
        window.dispatchEvent(new CustomEvent('newSessionCreated'));
        window.dispatchEvent(new CustomEvent('sessionChanged'));
      }
    } catch (err) {
      console.error("Failed to create new session:", err);
      toast.error("Failed to start new chat");
    }
  };

  const ProtectedRoute = ({ children }) => {
    if (!authReady) return null;
    return isLoggedIn ? children : <Navigate to="/login" replace />;
  };

  useEffect(() => {
    if (!sessionId) {
  
      const initAnonymousSession = async () => {
        try {
          const res = await fetch(`${config.apiUrl}/session/init-anon`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();
          console.log("Anonymous session initialized:", data);
          localStorage.setItem("anonymousSessionId", data.session_id);
          localStorage.setItem("anonymousUserId", data.user_id);
        } catch (err) {
            console.error("Failed to initialize anonymous session:", err);
        }
      };
      initAnonymousSession();
  
    }
  }, [sessionId]); 

    const MainAppContent = () => {
        const location = useLocation();
        const navigate = useNavigate();

        useEffect(() => {
            if (location.state?.showSignInToast) {
                toast.success("Signed in successfully! 🚀");
                navigate(location.pathname, { replace: true, state: {} });
            }
        }, [location, navigate]);


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
              sessionId={sessionId}
              setSesssionId={setSessionId}
                          />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <MainContent
          currentChatTitle={currentChatTitle}
          darkMode={darkMode}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isLoggedIn={isLoggedIn}
          onLogin={() => { }}
          onLogout={handleLogout}
          toggleDarkMode={toggleDarkMode}
          sessionId={sessionId}
          setSesssionId={setSessionId}
          onUserProfileClick={() => setShowProfileModal(true)}
        />
      </div>
    );
  };

                        <Route path="/Home" element={<LandingPage />} />
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
                                        currentPlan={isLoggedIn ? "free" : null}
                                        onBack={() => window.history.back()}
                                    />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="*"
                            element={<Navigate to="/chat" replace />}
                        />
                    </Routes>

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
                                        toggleDarkMode={toggleDarkMode}
                                        onClose={() =>
                                            setShowProfileModal(false)
                                        }
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
                        bodyClassName="text-sm font-medium"
                        progressClassName={`${
                            darkMode ? "bg-emerald-400" : "bg-[#52B788]"
                        } h-1 rounded-b`}
                        closeButton={false}
                    />
                </div>
            </div>
        </Router>
    );
}

export default App;
