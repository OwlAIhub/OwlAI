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
import UserProfile from "./pages/UserProfile";
import Login from "./Components/Login.jsx";
import Questionnaire from "./Components/Questionnaire";
import { auth } from "./firebase.js";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentChatTitle, setCurrentChatTitle] = useState("Learning Theories");
  const [loading, setLoading] = useState(true);

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Toggle sidebar (you can re-add mobile‐detection logic if needed)
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Protect any route that requires auth
  const ProtectedRoute = ({ children }) => {
    if (loading) return null; // wait until auth status is known
    return isLoggedIn ? children : <Navigate to="/login" replace />;
  };

  // MainAppContent lives inside the /chat route
  const MainAppContent = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
      if (location.state?.showSignInToast) {
        toast.success("Signed in successfully! 🚀");
        // clear that state so toast doesn’t reappear
        navigate(location.pathname, { replace: true, state: {} });
      }
    }, [location, navigate]);

    const handleLogout = () => {
      auth
        .signOut()
        .then(() => {
          toast.info("You've been signed out.");
          setCurrentChatTitle("Learning Theories");
          navigate("/login", { replace: true });
        })
        .catch(() => {
          toast.error("Failed to sign out.");
        });
    };

    return (
      <MainContent
        currentChatTitle={currentChatTitle}
        darkMode={darkMode}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isLoggedIn={isLoggedIn}
        onLogin={() => {}}
        onLogout={handleLogout}
        toggleDarkMode={toggleDarkMode}
      />
    );
  };

  // While Firebase tells us whether user is logged in or not
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <div
        className={`${
          darkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"
        } flex h-screen`}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/chat" replace />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/questionnaire"
            element={
              <ProtectedRoute>
                <Questionnaire />
              </ProtectedRoute>
            }
          />

          {/* Chat page is always accessible */}
          <Route path="/chat" element={<MainAppContent />} />

          <Route
            path="/userProfile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
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
          progressClassName={`
            ${darkMode ? "bg-emerald-400" : "bg-[#52B788]"} h-1 rounded-b
          `}
          closeButton={false}
        />
      </div>
    </Router>
  );
}

export default App;
