import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
// FIREBASE AUTH TEMPORARILY DISABLED FOR DESIGN WORK
// import { auth, db } from "../firebase";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ProfileHeader } from "../../shared/components/profile/profile-header";
import { ProfileSection } from "../../shared/components/profile/profile-section";
import { ProfileStats } from "../../shared/components/profile/profile-stats";
import {
  RiUserLine,
  RiGraduationCapLine,
  RiShieldUserLine,
} from "react-icons/ri";

interface UserProfileProps {
  darkMode: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

const UserProfile = ({ darkMode, onClose, onLogout }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    educationLevel: "",
    preferredLanguage: "English",
    targetExam: "UGC-NET",
    examAttempt: "First Attempt",
    joinDate: "",
    subscription: "",
  });

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // FIREBASE AUTH TEMPORARILY DISABLED FOR DESIGN WORK
  useEffect(() => {
    // Mock user data for design work
    const mockUserData = {
      name: "Guest User",
      email: "guest@example.com",
      educationLevel: "Post Graduate",
      preferredLanguage: "English",
      targetExam: "UGC-NET",
      examAttempt: "First Attempt",
      joinDate: "January 2024",
      subscription: "Free",
    };
    setUserData(mockUserData);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    // FIREBASE AUTH TEMPORARILY DISABLED FOR DESIGN WORK
    try {
      // Mock save for design work
      setIsEditing(false);
    } catch {
      // Error saving user data
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const stats = {
    totalSessions: 24,
    totalQuestions: 156,
    joinDate: userData.joinDate,
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className={`inline-block w-full max-w-2xl p-6 my-8 text-left align-middle transition-all transform ${
                darkMode ? "bg-gray-900" : "bg-white"
              } shadow-xl rounded-2xl`}
            >
              <ProfileHeader
                userData={userData}
                isEditing={isEditing}
                onEditToggle={handleEditToggle}
                onSave={handleSave}
                onCancel={handleCancel}
                darkMode={darkMode}
              />

              <div className="mt-6 space-y-4">
                <ProfileStats stats={stats} darkMode={darkMode} />

                <ProfileSection
                  title="Personal Information"
                  icon={RiUserLine}
                  isExpanded={expandedSection === "personal"}
                  onToggle={() => toggleSection("personal")}
                  darkMode={darkMode}
                >
                  <div className="space-y-4">
                    <div>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Email
                      </p>
                      <p
                        className={`text-sm font-medium break-all ${
                          darkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {userData.email || (
                          <span
                            className={`italic ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Not provided yet
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Preferred Language
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {userData.preferredLanguage}
                      </p>
                    </div>
                  </div>
                </ProfileSection>

                <ProfileSection
                  title="Academic Information"
                  icon={RiGraduationCapLine}
                  isExpanded={expandedSection === "academic"}
                  onToggle={() => toggleSection("academic")}
                  darkMode={darkMode}
                >
                  <div className="space-y-4">
                    <div>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Education Level
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {userData.educationLevel || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Target Exam
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {userData.targetExam}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Exam Attempt
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {userData.examAttempt}
                      </p>
                    </div>
                  </div>
                </ProfileSection>

                <ProfileSection
                  title="Account Information"
                  icon={RiShieldUserLine}
                  isExpanded={expandedSection === "account"}
                  onToggle={() => toggleSection("account")}
                  darkMode={darkMode}
                >
                  <div className="space-y-4">
                    <div>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Member Since
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {userData.joinDate}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Subscription
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {userData.subscription}
                      </p>
                    </div>
                  </div>
                </ProfileSection>

                {/* Logout Button */}
                {onLogout && (
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        onLogout();
                        onClose();
                      }}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        darkMode
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UserProfile;
