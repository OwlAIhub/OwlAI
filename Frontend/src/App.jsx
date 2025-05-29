import { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
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
    const [isMobile, setIsMobile] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [currentChatTitle, setCurrentChatTitle] = useState("Learning Theories");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsLoggedIn(!!user);
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

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const toggleDarkMode = () => setDarkMode((prev) => !prev);

    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                toast.info("You've been signed out.");
                setCurrentChatTitle("Learning Theories");
            })
            .catch(() => {
                toast.error("Failed to sign out.");
            });
    };

    const ProtectedRoute = ({ children }) => {
        return isLoggedIn ? children : <Navigate to="/login" replace />;
    };

    // Show toast only when redirected with state
    const MainAppContent = () => {
        const location = useLocation();
        useEffect(() => {
            if (location.state?.showSignInToast) {
                toast.success("Signed in successfully! 🚀");
                // Remove the state so it doesn't show again
                window.history.replaceState({}, document.title);
            }
        }, [location.state]);
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

    return (
        <>
            <Router>
                <div
                    className={`${
                        darkMode
                            ? "bg-gray-800 text-white"
                            : "bg-gray-50 text-gray-900"
                    } flex h-screen`}
                >
                    <Routes>
                        <Route path="/" element={<MainAppContent />} />
                        <Route path="/login" element={<Login />} />

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
                                <ProtectedRoute>
                                    <MainAppContent />
                                </ProtectedRoute>
                            }
                        />
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
                        <Route
                            path="*"
                            element={
                                <Navigate
                                    to={isLoggedIn ? "/chat" : "/login"}
                                    replace
                                />
                            }
                        />
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
                            ${darkMode ? "bg-emerald-400" : "bg-[#52B788]"}
                        h-1 rounded-b`}
                        closeButton={false}
                    />
                </div>
            </Router>
        </>
    );
}

export default App;