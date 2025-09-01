import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

import { ProfileHeader } from "./profile-header";
import { ProfileSection } from "./profile-section";
import { ProfileStats } from "./profile-stats";
import {
  RiUserLine,
  RiGraduationCapLine,
  RiShieldUserLine,
} from "react-icons/ri";

interface UserProfileProps {
  onClose: () => void;
  onLogout?: () => void;
}

const UserProfile = ({ onClose, onLogout }: UserProfileProps) => {
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const stats = [
    {
      label: "Total Sessions",
      value: 24,
      color: "text-teal-600",
    },
    {
      label: "Total Questions",
      value: 156,
      color: "text-blue-600",
    },
    {
      label: "Member Since",
      value: userData.joinDate,
      color: "text-purple-600",
    },
  ];

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
            <div className="inline-block w-full max-w-2xl p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <ProfileHeader
                name={userData.name}
                email={userData.email}
                onEdit={handleEditToggle}
                isEditing={isEditing}
              />

              <div className="mt-6 space-y-4">
                <ProfileStats stats={stats} />

                <ProfileSection
                  title="Personal Information"
                  icon={<RiUserLine />}
                  fields={[
                    {
                      id: "email",
                      label: "Email",
                      value: userData.email || "Not provided yet",
                    },
                    {
                      id: "language",
                      label: "Preferred Language",
                      value: userData.preferredLanguage,
                    },
                  ]}
                  isEditing={isEditing}
                />

                <ProfileSection
                  title="Academic Information"
                  icon={<RiGraduationCapLine />}
                  fields={[
                    {
                      id: "education",
                      label: "Education Level",
                      value: userData.educationLevel || "Not specified",
                    },
                    {
                      id: "exam",
                      label: "Target Exam",
                      value: userData.targetExam,
                    },
                    {
                      id: "attempt",
                      label: "Exam Attempt",
                      value: userData.examAttempt,
                    },
                  ]}
                  isEditing={isEditing}
                />

                <ProfileSection
                  title="Account Information"
                  icon={<RiShieldUserLine />}
                  fields={[
                    {
                      id: "joinDate",
                      label: "Member Since",
                      value: userData.joinDate,
                    },
                    {
                      id: "subscription",
                      label: "Subscription",
                      value: userData.subscription,
                    },
                  ]}
                  isEditing={isEditing}
                />

                {/* Logout Button */}
                {onLogout && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        onLogout();
                        onClose();
                      }}
                      className="w-full py-3 px-4 rounded-lg font-medium transition-colors bg-red-600 hover:bg-red-700 text-white"
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
