import { useState, useEffect } from "react";
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
import UserProfile from "./pages/UserProfile";
import Login from "./components/Login.jsx";
import Questionnaire from "./components/Questionnaire";
import { Toaster } from "react-hot-toast";
import { auth } from "./firebase.js";

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [currentChatTitle, setCurrentChatTitle] =
        useState("Learning Theories");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsLoggedIn(!!user);
            if (user) {
                toast.success("Signed in successfully! 🚀");
            }
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

    const MainAppContent = () => (
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

    const AuthContent = ({ Component }) => (
        <MainContent
            currentChatTitle={currentChatTitle}
            darkMode={darkMode}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            isLoggedIn={isLoggedIn}
            onLogin={() => {}}
            onLogout={handleLogout}
            toggleDarkMode={toggleDarkMode}
        >
            <Component />
        </MainContent>
    );

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
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
                            element={<AuthContent Component={Questionnaire} />}
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
                        progressClassName={`${
                            darkMode ? "bg-emerald-400" : "bg-[#52B788]"
                        } h-1 rounded-b`}
                        closeButton={false}
                    />
                </div>
            </Router>
        </>
    );
}

export default App;
