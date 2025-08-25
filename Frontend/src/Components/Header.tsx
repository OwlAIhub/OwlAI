import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FiMenu, FiLogOut, FiSearch } from "react-icons/fi";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { Link } from "react-router-dom";
// FIREBASE AUTH TEMPORARILY DISABLED FOR DESIGN WORK
// import { auth, db } from "../firebase";
// import { doc, getDoc } from "firebase/firestore";
import Logo from "../assets/owl_AI_logo.png";
// import { onAuthStateChanged } from "firebase/auth";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  [key: string]: any;
}

interface HeaderProps {
  onToggleSidebar: () => void;
  onLogout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isLoggedIn: boolean;
  currentChatTitle?: string;
}

const Header = ({
  onToggleSidebar,
  onLogout,
  darkMode,
  toggleDarkMode,
  isLoggedIn,
  currentChatTitle,
}: HeaderProps) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // FIREBASE AUTH TEMPORARILY DISABLED FOR DESIGN WORK
  useEffect(() => {
    // Mock user for design work
    const mockUser = {
      firstName: "Guest",
      lastName: "User",
      email: "guest@example.com",
    };
    localStorage.setItem("userProfile", JSON.stringify(mockUser));
    setUser(mockUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    const cachedUser = localStorage.getItem("userProfile");
    if (cachedUser) {
      setUser(JSON.parse(cachedUser) as UserData);
    }
  }, []);

  const firstLetter = user?.firstName?.[0]?.toUpperCase() || "G";

  if (loading && isLoggedIn) {
    return (
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm h-17">
        <div className="flex items-center justify-between h-full px-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
      </header>
    );
  }
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between h-17 px-4 sm:px-6 lg:px-8">
        {/* Left - Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-md text-teal-600 hover:bg-teal-100 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <FiMenu size={20} />
          </button>

          <div
            onClick={onToggleSidebar}
            className="flex items-center cursor-pointer"
          >
            <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
              <img src={Logo} alt="" />
            </div>
            <span className="ml-2 text-xl font-bold text-teal-700 hidden sm:inline">
              Owl AI
            </span>
          </div>
        </div>

        {/* Center - Title or Search */}
        <div className="flex-1 mx-4 max-w-xl hidden md:flex items-center justify-center">
          {currentChatTitle ? (
            <h1 className="text-lg font-semibold truncate text-center text-black">
              {currentChatTitle}
            </h1>
          ) : (
            <div className="flex items-center space-x-2 text-gray-400">
              <FiSearch />
              <span className="text-sm">Search or start a new chat</span>
            </div>
          )}
        </div>

        {/* Right - Dark mode + Profile */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleDarkMode}
            className="p-2 cursor-pointer rounded-full text-teal-600 hover:bg-teal-100 focus:outline-none"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown((prev) => !prev)}
                className="flex cursor-pointer items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {firstLetter}
                </div>
                <FaChevronDown
                  className={`text-teal-500 transition-transform duration-200 ${
                    showProfileDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-2 border bg-white border-gray-100">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium text-black truncate">
                      {user.firstName + " " + user.lastName}
                    </p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-black hover:bg-gray-50 cursor-pointer"
                  >
                    <FiLogOut className="mr-2" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="px-4 py-1.5 bg-teal-600 cursor-pointer hover:bg-teal-700 text-white rounded-full text-sm font-medium">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
