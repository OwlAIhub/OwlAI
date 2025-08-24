import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom Hooks
import { useAuth, useTheme, useDevice, useChatSession } from '@/hooks';

// Components
import { AppRoutes } from '@/components/common';
import UserProfile from '@/pages/UserProfile.jsx'; // Keep old import for now

// Constants
import { TOAST_CONFIG } from '@/constants';

function App() {
  // Custom Hooks
  const { 
    isLoggedIn, 
    authReady, 
    sessionId, 
    user,
    setSessionId, 
    createNewSession, 
    handleLogout 
  } = useAuth();
  
  const { darkMode, toggleDarkMode } = useTheme();
  const { isMobile } = useDevice();
  const { 
    currentChatTitle, 
    setCurrentChatTitle, 
    handleNewChat 
  } = useChatSession();

  // Local UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // UI Actions
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleUserProfileClick = () => {
    setShowProfileModal(true);
  };

  const handleNewChatClick = async () => {
    if (user?.uid) {
      await handleNewChat(createNewSession, user.uid);
    }
  };

  // Auto-close sidebar on mobile
  React.useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <Router>
      <div className={`${darkMode ? "dark bg-gray-900" : "bg-gray-50"} min-h-screen`}>
        <div className="dark:bg-gray-900 dark:text-white">
          {/* Main App Routes */}
          <AppRoutes
            isLoggedIn={isLoggedIn}
            authReady={authReady}
            darkMode={darkMode}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            toggleDarkMode={toggleDarkMode}
            currentChatTitle={currentChatTitle}
            sessionId={sessionId}
            setSessionId={setSessionId}
            onLogout={handleLogout}
            onUserProfileClick={handleUserProfileClick}
            onNewChat={handleNewChatClick}
          />

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

          {/* Toast Notifications */}
          <ToastContainer
            position={TOAST_CONFIG.POSITION as any}
            autoClose={TOAST_CONFIG.AUTO_CLOSE}
            hideProgressBar={TOAST_CONFIG.HIDE_PROGRESS_BAR}
            newestOnTop={TOAST_CONFIG.NEWEST_ON_TOP}
            closeOnClick={TOAST_CONFIG.CLOSE_ON_CLICK}
            rtl={false}
            pauseOnFocusLoss
            draggable={TOAST_CONFIG.DRAGGABLE}
            pauseOnHover={TOAST_CONFIG.PAUSEON_HOVER}
            theme={darkMode ? "dark" : "light"}
            toastClassName={() =>
              `rounded-xl px-4 py-3 border-l-4 shadow-md ${darkMode
                ? "bg-gray-800 text-white border-owl-primary"
                : "bg-white text-gray-900 border-owl-primary"
              }`
            }
            bodyClassName="text-sm font-medium"
            progressClassName={`${darkMode ? "bg-owl-primary" : "bg-owl-primary"} h-1 rounded-b`}
            closeButton={false}
          />
        </div>
      </div>
    </Router>
  );
}

export default App;
