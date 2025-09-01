import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Page imports
import LandingPage from "../pages/landing/landing-page";
import AuthPage from "../pages/auth/auth-page";
import ChatPage from "../pages/chat/chat-page";
import ProfilePage from "../pages/profile/user-profile";

// Simple placeholder components
import { NotFoundPage } from "../components/error/not-found-page";

/**
 * Main App component - UI only, no backend dependencies
 */
function App() {
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />

            {/* Auth route */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Chat route */}
            <Route path="/chat" element={<ChatPage />} />

            {/* Fallback route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>

        {/* User Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
              <ProfilePage
                onClose={() => setShowProfileModal(false)}
                onLogout={() => {
                  setShowProfileModal(false);
                  // Simple logout - just close modal
                }}
              />
            </div>
          </div>
        )}

        {/* Global toast notifications */}
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
          theme="light"
          toastClassName="rounded-xl px-4 py-3 border-l-4 shadow-md bg-white text-gray-900 border-[#52B788]"
          className="text-sm font-medium"
          progressClassName="bg-[#52B788] h-1 rounded-b"
          closeButton={false}
        />
      </div>
    </Router>
  );
}

export default App;
