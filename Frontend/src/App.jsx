import { useState, useEffect } from "react";
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

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentChatTitle, setCurrentChatTitle] = useState("Learning Theories");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      setAuthReady(true);
    });
    return () => unsubscribe();
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

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        localStorage.clear();
        toast.info("You've been signed out.");
        setCurrentChatTitle("Learning Theories");
      })
      .catch(() => {
        toast.error("Failed to sign out.");
      });
  };

  const ProtectedRoute = ({ children }) => {
    if (!authReady) return null;
    return isLoggedIn ? children : <Navigate to="/login" replace />;
  };
  const user = JSON.parse(localStorage.getItem("user"));

  const [sessionId, setSessionId] = useState(null);

  const createNewSession = async () => {
    const existing = localStorage.getItem("sessionId");

    if (existing) {
      setSessionId(existing);
    } else {
      try {
        const res = await fetch(`${config.apiUrl}/session/create?user_id=${user.uid}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
        }); const data = await res.json();
        console.log("Session created:", data.session_id);
        setSessionId(data.session_id);
        localStorage.setItem("sessionId", data.session_id);
      } catch (err) {
        console.error("Failed to get session ID:", err);
      }
    }
  };

  useEffect(() => {
    createNewSession();
  }, []);

  const handleNewChat = async () => {
    try {
      // Optional: Remove old sessionId
      localStorage.removeItem("sessionId");

      const res = await fetch(`${config.apiUrl}/session/create?user_id=${user.uid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
      }); const data = await res.json();

      console.log("New chat session created:", data);
      setSessionId(data.session_id);
      localStorage.setItem("sessionId", data.session_id);

      // Reset current chat title if needed
      setCurrentChatTitle("New Chat");
    } catch (err) {
      console.error("Failed to create new session:", err);
    }
  };


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
          onUserProfileClick={() => setShowProfileModal(true)}
        />
      </div>
    );
  };

  return (
    <Router>
      <div className={`${darkMode ? "dark bg-gray-900" : "bg-gray-50"} min-h-screen`}>
        <div className="dark:bg-gray-900 dark:text-white">
          <Routes>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route
              path="/login"
              element={
                isLoggedIn ? <Navigate to="/chat" replace /> : <Login />
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
            <Route
              path="/chat"
              element={
                <MainAppContent />
              }
            />
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
            <Route path="*" element={<Navigate to="/chat" replace />} />
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
              `rounded-xl px-4 py-3 border-l-4 shadow-md ${darkMode
                ? "bg-gray-800 text-white border-emerald-400"
                : "bg-white text-gray-900 border-[#52B788]"
              }`
            }
            bodyClassName="text-sm font-medium"
            progressClassName={`${darkMode ? "bg-emerald-400" : "bg-[#52B788]"} h-1 rounded-b`}
            closeButton={false}
          />
        </div>
      </div>
    </Router>
  );
}

export default App;