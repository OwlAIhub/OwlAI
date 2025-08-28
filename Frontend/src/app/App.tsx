import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Auth } from "../core/auth";
import Questionnaire from "../shared/components/questionnaire/questionnaire";
import { ChatLayout } from "../shared/components/layout/chat-layout";
import LandingPage from "../features/landing/landing-page";
import SubscriptionPlans from "../features/subscription/subscription-plans";
import UserProfile from "../features/profile/user-profile";
import { AnimatePresence, motion } from "framer-motion";
import { NotFoundPage } from "../shared/components/error/not-found-page";
import { LenisProvider } from "../shared/components/providers/LenisProvider";
import { StoreProvider } from "../core/stores/StoreProvider";
import { useAuth } from "../core/auth";
import { useUserStore } from "../core/auth/UserStore";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { isAuthenticated, isLoading: authLoading } = useAuth();

  return (
    <StoreProvider>
      <AppContent
        isAuthenticated={isAuthenticated}
        authLoading={authLoading}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
      />
    </StoreProvider>
  );
}

function AppContent({
  isAuthenticated,
  authLoading,
  isSidebarOpen,
  setIsSidebarOpen,
  showProfileModal,
  setShowProfileModal,
}: {
  isAuthenticated: boolean;
  authLoading: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  showProfileModal: boolean;
  setShowProfileModal: (show: boolean) => void;
}) {
  const { state, toggleDarkMode, setCurrentChatTitle, clearUserData } =
    useUserStore();
  const { darkMode, sessionId, currentChatTitle } = state;

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
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      clearUserData();
      setCurrentChatTitle("Learning Theories");
      window.location.href = "/OwlAi";
    } catch (_error) {
      // Error handling for logout
    }
  };

  const handleNewChat = () => {
    setCurrentChatTitle("New Chat");
    window.dispatchEvent(new CustomEvent("newSessionCreated"));
    window.dispatchEvent(new CustomEvent("sessionChanged"));
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (authLoading) return null;
    return isAuthenticated ? children : <Navigate to="/auth" replace />;
  };

  const MainAppContent = () => (
    <ChatLayout
      darkMode={darkMode}
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={toggleSidebar}
      currentChatTitle={currentChatTitle}
      isLoggedIn={isAuthenticated}
      sessionId={sessionId}
      setSessionId={(_id: string | null) => {
        // Session ID setter (currently unused)
      }}
      onLogout={handleLogout}
      toggleDarkMode={toggleDarkMode}
      onUserProfileClick={() => setShowProfileModal(true)}
      onNewChat={handleNewChat}
    />
  );

  return (
    <LenisProvider>
      <Router>
        <div
          className={`${darkMode ? "dark bg-gray-900" : "bg-gray-50"} min-h-screen`}
        >
          <div className="dark:bg-gray-900 dark:text-white">
            <Routes>
              <Route path="/OwlAi" element={<LandingPage />} />
              <Route path="/" element={<Navigate to="/OwlAi" replace />} />
              <Route
                path="/auth"
                element={
                  isAuthenticated ? <Navigate to="/chat" replace /> : <Auth />
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
  );
}

export default App;
