import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import MainContent from "./Components/MainContent";
import MessageInput from "./Components/MessageInput";
import { FiMenu } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubscriptionPlans from "./pages/SubscriptionPlans";

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [currentChatTitle, setCurrentChatTitle] = useState("Learning Theories");

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

    const handleNewChat = () => {
        setCurrentChatTitle("New Chat");
        if (isMobile) setIsSidebarOpen(false);
    };

    const handleSelectChat = (chatId) => {
        const chatList = [
            { id: 1, title: "Learning Theories" },
            { id: 2, title: "NEP 2020 Questions" },
            { id: 3, title: "Constructivism Examples" },
            { id: 4, title: "Pedagogy vs Andragogy" },
        ];
        const selected = chatList.find((chat) => chat.id === chatId);
        if (selected) setCurrentChatTitle(selected.title);
        if (isMobile) setIsSidebarOpen(false);
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
        toast.success("Signed in successfully! 🚀");
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        toast.info("You've been signed out.");
    };

    const MainAppContent = () => (
        <>
            <Sidebar
                isOpen={isSidebarOpen}
                isLoggedIn={isLoggedIn}
                onClose={toggleSidebar}
                onNewChat={handleNewChat}
                onSelectChat={handleSelectChat}
                onSubscribe={handleLogin} // if login = subscribe for now
                onLogout={handleLogout}
                darkMode={darkMode}
                isMobile={isMobile}
            />

            {!isSidebarOpen && !isMobile && (
                <button
                    onClick={toggleSidebar}
                    className="absolute top-5 left-2 z-40 p-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-md"
                    title="Open Sidebar"
                >
                    <FiMenu size={20} />
                </button>
            )}

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    currentChatTitle={currentChatTitle}
                    onToggleSidebar={toggleSidebar}
                    isLoggedIn={isLoggedIn}
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                />

                <MainContent
                    currentChatTitle={currentChatTitle}
                    darkMode={darkMode}
                />

                <MessageInput darkMode={darkMode} />
            </div>
        </>
    );

    return (
        <Router>
            <div className={`${darkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"} flex h-screen`}>
                <Routes>
                    <Route path="/" element={<MainAppContent />} />
                    <Route path="/subscription-plans" element={
                        <div className="flex w-full">
                            <Sidebar
                                isOpen={isSidebarOpen}
                                isLoggedIn={isLoggedIn}
                                onClose={toggleSidebar}
                                onNewChat={handleNewChat}
                                onSelectChat={handleSelectChat}
                                onSubscribe={handleLogin}
                                onLogout={handleLogout}
                                darkMode={darkMode}
                                isMobile={isMobile}
                            />
                            <SubscriptionPlans 
                                darkMode={darkMode} 
                                currentPlan={isLoggedIn ? "free" : null}
                                onBack={() => window.history.back()}
                            />
                        </div>
                    } />
                </Routes>

                {/* ToastContainer with Tailwind classes */}
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
    );
}

export default App;