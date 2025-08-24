import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ProfileHeader } from "@/components/features/profile/ProfileHeader";
import { ProfileSection } from "@/components/features/profile/ProfileSection";
import { ProfileStats } from "@/components/features/profile/ProfileStats";
import {
  RiUserLine,
  RiGraduationCapLine,
  RiShieldUserLine,
} from "react-icons/ri";

interface UserProfileProps {
  darkMode: boolean;
  onClose: () => void;
}

const UserProfile = ({ darkMode, onClose }: UserProfileProps) => {
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData({
            name:
              `${data.firstName || ""} ${data.lastName || ""}`.trim() || "User",
            email: data.email || "",
            educationLevel: data.educationLevel || "",
            preferredLanguage: data.language || "English",
            targetExam: data.targetExam || "UGC-NET",
            examAttempt: data.attempt || "First Attempt",
            joinDate: data.createdAt
              ? new Date(data.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              : "January 2023",
            subscription: data.plan || "Premium",
          });
        } else {
          setUserData({
            name: user.displayName || "User",
            email: "",
            educationLevel: "",
            preferredLanguage: "English",
            targetExam: "UGC-NET",
            examAttempt: "First Attempt",
            joinDate: new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            }),
            subscription: "Premium",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        firstName: userData.name.split(" ")[0] || "",
        lastName: userData.name.split(" ").slice(1).join(" ") || "",
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const stats = {
    totalSessions: 12,
    totalQuestions: 45,
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
                  title="Education Details"
                  icon={RiGraduationCapLine}
                  isExpanded={expandedSection === "education"}
                  onToggle={() => toggleSection("education")}
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
                        {userData.educationLevel || (
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
                        Subscription Plan
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {userData.subscription}
                      </p>
                    </div>
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
                  </div>
                </ProfileSection>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UserProfile;
