import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { ChatLayout } from "@/components/layout/ChatLayout";

// Keep old imports for now
import SubscriptionPlans from "@/pages/SubscriptionPlans";
import Login from "@/Components/Login";
import Questionnaire from "@/Components/Questionnaire";
import LandingPage from "@/Components/LandingPage";

interface AppRoutesProps {
  // Auth state
  isLoggedIn: boolean;
  authReady: boolean;

  // Theme & UI
  darkMode: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;

  // Chat state
  currentChatTitle: string;
  sessionId: string | null;
  setSessionId: (id: string | null) => void;

  // Actions
  onLogout: () => void;
  onUserProfileClick: () => void;
  onNewChat: () => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({
  isLoggedIn,
  authReady,
  darkMode,
  isSidebarOpen,
  toggleSidebar,
  toggleDarkMode,
  currentChatTitle,
  sessionId,
  setSessionId,
  onLogout,
  onUserProfileClick,
  onNewChat,
}) => {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/OwlAi" element={<LandingPage />} />
      <Route path="/" element={<Navigate to="/OwlAi" replace />} />

      {/* Login */}
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/chat" replace /> : <Login />}
      />

      {/* Questionnaire */}
      <Route
        path="/questionnaire"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn} authReady={authReady}>
            <Questionnaire />
          </ProtectedRoute>
        }
      />

      {/* Chat Interface */}
      <Route
        path="/chat"
        element={
          <ChatLayout
            darkMode={darkMode}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            currentChatTitle={currentChatTitle}
            isLoggedIn={isLoggedIn}
            sessionId={sessionId}
            setSessionId={setSessionId}
            onLogout={onLogout}
            toggleDarkMode={toggleDarkMode}
            onUserProfileClick={onUserProfileClick}
            onNewChat={onNewChat}
          />
        }
      />

      {/* Subscription */}
      <Route
        path="/subscription"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn} authReady={authReady}>
            <SubscriptionPlans
              darkMode={darkMode}
              onClose={() => window.history.back()}
            />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/OwlAi" replace />} />
    </Routes>
  );
};
