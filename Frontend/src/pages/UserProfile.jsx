import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, Fragment } from 'react';
import { 
  FiEdit, 
  FiCamera, 
  FiX, 
  FiCheck, 
  FiChevronDown, 
  FiChevronUp, 
  FiUser,
  FiMail,
  FiGlobe,
  FiAward,
  FiBook,
  FiCalendar
} from 'react-icons/fi';
import { 
  RiGraduationCapLine, 
  RiMailLine, 
  RiGlobalLine, 
  RiMedalLine, 
  RiBookLine,
  RiUserLine,
  RiCalendarLine,
  RiShieldUserLine
} from 'react-icons/ri';
import { Dialog, Transition } from '@headlessui/react';
import { auth, db } from '../firebase.js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const UserProfile = ({ darkMode, toggleDarkMode, onClose }) => {
  // User data state
  const [isEditing, setIsEditing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    educationLevel: '',
    preferredLanguage: 'English',
    targetExam: 'UGC-NET',
    examAttempt: 'First Attempt',
    joinDate: '',
    subscription: ''
  });

  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData({
            name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'User',
            email: data.email || '',
            educationLevel: data.educationLevel || '',
            preferredLanguage: data.language || 'English',
            targetExam: data.targetExam || 'UGC-NET',
            examAttempt: data.attempt || 'First Attempt',
            joinDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2023',
            subscription: data.plan || 'Premium'
          });
        } else {
          setUserData({
            name: user.displayName || 'User',
            email: '',
            educationLevel: '',
            preferredLanguage: 'English',
            targetExam: 'UGC-NET',
            examAttempt: 'First Attempt',
            joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            subscription: 'Premium'
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const avatarVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.03,
      transition: { duration: 0.4 }
    },
    tap: { scale: 0.98 }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) return;

      const formData = new FormData(e.target);
      const updatedData = {
        firstName: formData.get('name').split(' ')[0] || '',
        lastName: formData.get('name').split(' ').slice(1).join(' ') || '',
        ...(formData.get('email') && { email: formData.get('email') }),
        ...(formData.get('educationLevel') && { educationLevel: formData.get('educationLevel') }),
        language: formData.get('preferredLanguage'),
        targetExam: formData.get('targetExam'),
        attempt: formData.get('examAttempt')
      };

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, updatedData);

      setUserData({
        ...userData,
        name: formData.get('name'),
        ...(formData.get('email') && { email: formData.get('email') }),
        ...(formData.get('educationLevel') && { educationLevel: formData.get('educationLevel') }),
        preferredLanguage: formData.get('preferredLanguage'),
        targetExam: formData.get('targetExam'),
        examAttempt: formData.get('examAttempt')
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const colors = {
    bg: darkMode ? 'bg-gray-900' : 'bg-gray-100',
    text: darkMode ? 'text-gray-100' : 'text-gray-800',
    cardBg: darkMode ? 'bg-gray-800 bg-opacity-60 backdrop-blur-lg' : 'bg-white bg-opacity-70 backdrop-blur-lg',
    border: darkMode ? 'border-gray-700 border-opacity-30' : 'border-gray-200 border-opacity-50',
    primary: darkMode ? 'bg-teal-600' : 'bg-teal-500',
    primaryHover: darkMode ? 'hover:bg-teal-700' : 'hover:bg-teal-600',
    secondary: darkMode ? 'bg-amber-500' : 'bg-amber-400',
    secondaryHover: darkMode ? 'hover:bg-amber-600' : 'hover:bg-amber-500',
    accentText: darkMode ? 'text-teal-400' : 'text-teal-600',
    inputBg: darkMode ? 'bg-gray-700 bg-opacity-50 backdrop-blur-sm' : 'bg-white bg-opacity-80 backdrop-blur-sm',
    inputBorder: darkMode ? 'border-gray-600 border-opacity-30' : 'border-gray-300 border-opacity-50',
    overlay: darkMode ? 'bg-black bg-opacity-70' : 'bg-black bg-opacity-50',
    subtleText: darkMode ? 'text-gray-400' : 'text-gray-500',
    divider: darkMode ? 'border-gray-700 border-opacity-30' : 'border-gray-200 border-opacity-50',
    shadow: darkMode ? 'shadow-lg shadow-black/30' : 'shadow-lg shadow-gray-400/20',
    placeholder: darkMode ? 'placeholder-gray-400' : 'placeholder-gray-500',
    statText: darkMode ? 'text-gray-100' : 'text-gray-800',
    iconColor: darkMode ? 'text-gray-100' : 'text-gray-800',
    iconAccentColor: darkMode ? 'text-teal-400' : 'text-teal-600',
    iconContainer: darkMode ? 'bg-gray-700 bg-opacity-50' : 'bg-gray-100 bg-opacity-80',
    iconInputColor: darkMode ? 'text-teal-400' : 'text-teal-600'
  };

  const stats = [
    { label: 'Member Since', value: userData.joinDate, icon: <RiCalendarLine className={`text-lg ${colors.iconColor}`} /> },
    { label: 'Subscription', value: userData.subscription, icon: <RiShieldUserLine className={`text-lg ${colors.iconColor}`} /> },
    { label: 'Target Exam', value: userData.targetExam, icon: <RiGraduationCapLine className={`text-lg ${colors.iconColor}`} /> },
    { label: 'Exam Attempt', value: userData.examAttempt, icon: <RiMedalLine className={`text-lg ${colors.iconColor}`} /> }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Main profile modal */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className={`w-full mx-auto ${isDesktop ? 'max-w-2xl' : 'max-w-4xl'} ${colors.cardBg} rounded-xl ${colors.border} border ${colors.shadow} overflow-hidden`}
        >
          {/* Header with close button only */}
          <div className="flex text-black justify-end items-center p-4">
            <button
              onClick={onClose}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
            >
              <FiX className={`h-6 w-6 ${colors.iconColor}`} />
            </button>
          </div>

          {/* Main content */}
          <div className="p-6 pt-0">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Avatar section */}
              <motion.div
                className="flex-shrink-0 self-center lg:self-start relative"
                whileHover="hover"
                whileTap="tap"
              >
                <motion.div
                  className={`relative w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 ${colors.primary} overflow-hidden ${colors.shadow}`}
                  variants={avatarVariants}
                  initial="initial"
                >
                  <div className={`absolute inset-0 ${colors.primary} flex items-center justify-center text-4xl font-bold text-white`}>
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    whileHover={{ opacity: 1 }}
                  >
                    <FiCamera className={`h-6 w-6 mb-1 text-white`} />
                    <span className="text-sm font-medium text-white">Update Photo</span>
                  </motion.div>
                </motion.div>
                <motion.button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`absolute -bottom-2 -right-2 ${colors.primary} ${colors.primaryHover} rounded-full p-2 ${colors.shadow} transition-colors duration-300 flex items-center justify-center`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiEdit className="h-5 w-5 text-white" />
                </motion.button>
              </motion.div>

              {/* Profile details */}
              <div className="flex-1">
                <motion.div variants={itemVariants}>
                  <h1 className={`text-2xl font-bold ${colors.accentText} mb-2`}>
                    {userData.name}
                  </h1>
                  {userData.educationLevel ? (
                    <motion.p
                      className={`text-base ${colors.subtleText} mb-4 flex items-center gap-1`}
                      variants={itemVariants}
                    >
                      <RiGraduationCapLine className={colors.iconColor} />
                      {userData.educationLevel} student
                    </motion.p>
                  ) : (
                    <motion.p
                      className={`text-base italic ${colors.subtleText} mb-4`}
                      variants={itemVariants}
                    >
                      Education level not specified
                    </motion.p>
                  )}
                </motion.div>

                {/* Stats grid */}
                <motion.div
                  className="grid grid-cols-2 gap-4 mb-6"
                  variants={containerVariants}
                >
                  {stats.map((item, index) => (
                    <motion.div
                      key={index}
                      className={`p-3 rounded-lg ${colors.cardBg} ${colors.border} border ${colors.shadow} transition-all duration-200 hover:shadow-xl`}
                      variants={itemVariants}
                      whileHover={{ y: -4 }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`p-2 rounded-full ${colors.iconContainer} ${colors.iconAccentColor}`}>
                          {item.icon}
                        </div>
                        <h3 className={`text-xs font-semibold ${colors.accentText}`}>{item.label}</h3>
                      </div>
                      <p className={`text-sm font-medium ml-10 ${colors.statText}`}>{item.value}</p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Expandable sections */}
                <motion.div className="space-y-4" variants={containerVariants}>
                  <motion.div
                    className={`rounded-lg overflow-hidden ${colors.cardBg} ${colors.border} border ${colors.shadow}`}
                    variants={itemVariants}
                  >
                    <div
                      className={`p-4 flex justify-between items-center cursor-pointer ${expandedSection === 'personal' ? `${colors.primary} bg-opacity-10` : ''}`}
                      onClick={() => toggleSection('personal')}
                    >
                      <h3 className={`text-base font-semibold ${colors.accentText} flex items-center gap-2`}>
                        <RiUserLine className={colors.iconColor} />
                        Personal Information
                      </h3>
                      {expandedSection === 'personal' ? 
                        <FiChevronUp className={colors.iconColor} /> : 
                        <FiChevronDown className={colors.iconColor} />
                      }
                    </div>
                    <AnimatePresence>
                      {expandedSection === 'personal' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-4 pb-4"
                        >
                          <div className="space-y-4">
                            <div>
                              <p className={`text-xs ${colors.subtleText}`}>Email</p>
                              <p className={`text-sm font-medium break-all ${colors.statText}`}>
                                {userData.email || <span className={`italic ${colors.subtleText}`}>Not provided yet</span>}
                              </p>
                            </div>
                            <div>
                              <p className={`text-xs ${colors.subtleText}`}>Preferred Language</p>
                              <p className={`text-sm font-medium ${colors.statText}`}>{userData.preferredLanguage}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div
                    className={`rounded-lg overflow-hidden ${colors.cardBg} ${colors.border} border ${colors.shadow}`}
                    variants={itemVariants}
                  >
                    <div
                      className={`p-4 flex justify-between items-center cursor-pointer ${expandedSection === 'education' ? `${colors.primary} bg-opacity-10` : ''}`}
                      onClick={() => toggleSection('education')}
                    >
                      <h3 className={`text-base font-semibold ${colors.accentText} flex items-center gap-2`}>
                        <RiGraduationCapLine className={colors.iconColor} />
                        Education Details
                      </h3>
                      {expandedSection === 'education' ? 
                        <FiChevronUp className={colors.iconColor} /> : 
                        <FiChevronDown className={colors.iconColor} />
                      }
                    </div>
                    <AnimatePresence>
                      {expandedSection === 'education' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-4 pb-4"
                        >
                          <div className="space-y-4">
                            <div>
                              <p className={`text-xs ${colors.subtleText}`}>Education Level</p>
                              <p className={`text-sm font-medium ${colors.statText}`}>
                                {userData.educationLevel || <span className={`italic ${colors.subtleText}`}>Not provided yet</span>}
                              </p>
                            </div>
                            <div>
                              <p className={`text-xs ${colors.subtleText}`}>Target Exam</p>
                              <p className={`text-sm font-medium ${colors.statText}`}>{userData.targetExam}</p>
                            </div>
                            <div>
                              <p className={`text-xs ${colors.subtleText}`}>Exam Attempt</p>
                              <p className={`text-sm font-medium ${colors.statText}`}>{userData.examAttempt}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>

                {/* Action buttons */}
                <motion.div
                  className="flex flex-wrap gap-3 mt-6"
                  variants={itemVariants}
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-4 py-2 cursor-pointer rounded-lg ${colors.primary} ${colors.primaryHover} transition-colors duration-300 text-white font-medium ${colors.shadow} flex items-center gap-2 text-sm`}
                  >
                    <FiEdit className="h-4 w-4 text-white" />
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className={`px-4 py-2 cursor-pointer rounded-lg ${darkMode ? 'text-white' : 'text-black'} ${colors.cardBg} ${colors.border} border hover:bg-opacity-80 transition-colors duration-300 font-medium text-sm ${colors.shadow}`}
                  >
                    Close Profile
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Edit Profile Modal */}
        <Transition appear show={isEditing} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setIsEditing(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className={`fixed inset-0 ${colors.overlay} backdrop-blur-sm`} />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel
                    className={`w-full transform overflow-hidden rounded-2xl p-0 text-left align-middle ${colors.cardBg} ${colors.border} border ${colors.shadow} backdrop-blur-lg transition-all ${isDesktop ? 'max-w-md' : 'max-w-lg'}`}
                  >
                    <div className="flex justify-between items-center px-6 pt-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                      <Dialog.Title className={`text-xl font-bold ${colors.accentText} flex items-center gap-2`}>
                        <FiEdit className={`text-lg ${colors.iconInputColor}`} />
                        Edit Profile
                      </Dialog.Title>
                      <button
                        onClick={() => setIsEditing(false)}
                        className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
                      >
                        <FiX className={`h-6 w-6 ${colors.iconColor}`} />
                      </button>
                    </div>

                    <form onSubmit={handleEditSubmit} className="px-6 py-4">
                      <div className="grid grid-cols-1 gap-4 mb-4">
                        {/* Personal Information Section */}
                        <div>
                          <h3 className={`text-lg font-semibold ${colors.accentText} mb-3 flex items-center gap-2`}>
                            <FiUser className={`text-lg ${colors.iconInputColor}`} />
                            Personal Information
                          </h3>
                          <div className="grid grid-cols-1 gap-4">
                            {/* Name Field */}
                            <div>
                              <label className={`block text-sm font-medium ${colors.subtleText} mb-1`}>
                                Full Name
                              </label>
                              <div className="relative">
                                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}>
                                  <FiUser className={`text-lg ${colors.iconInputColor}`} />
                                </div>
                                <input
                                  type="text"
                                  name="name"
                                  defaultValue={userData.name}
                                  className={`w-full ${colors.inputBg} ${colors.inputBorder} border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-teal-500' : 'focus:ring-teal-400'} ${colors.statText}`}
                                  placeholder="John Doe"
                                />
                              </div>
                            </div>

                            {/* Email Field */}
                            <div>
                              <label className={`block text-sm font-medium ${colors.subtleText} mb-1`}>
                                Email Address
                              </label>
                              <div className="relative">
                                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}>
                                  <FiMail className={`text-lg ${colors.iconInputColor}`} />
                                </div>
                                <input
                                  type="email"
                                  name="email"
                                  defaultValue={userData.email}
                                  className={`w-full ${colors.inputBg} ${colors.inputBorder} border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-teal-500' : 'focus:ring-teal-400'} ${colors.statText}`}
                                  placeholder="john@example.com"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Education Section */}
                        <div>
                          <h3 className={`text-lg font-semibold ${colors.accentText} mb-3 flex items-center gap-2`}>
                            <RiGraduationCapLine className={`text-lg ${colors.iconInputColor}`} />
                            Education Details
                          </h3>
                          <div className="grid grid-cols-1 gap-4">
                            {/* Education Level */}
                            <div>
                              <label className={`block text-sm font-medium ${colors.subtleText} mb-1`}>
                                Education Level
                              </label>
                              <div className="relative">
                                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}>
                                  <FiBook className={`text-lg ${colors.iconInputColor}`} />
                                </div>
                                <select
                                  name="educationLevel"
                                  defaultValue={userData.educationLevel}
                                  className={`w-full ${colors.inputBg} ${colors.inputBorder} border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-teal-500' : 'focus:ring-teal-400'} ${colors.statText}`}
                                >
                                  <option value="">Select education level</option>
                                  {['High School', 'Undergraduate', 'Graduate', 'Post Graduate'].map(level => (
                                    <option key={level} value={level}>{level}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Preferred Language */}
                            <div>
                              <label className={`block text-sm font-medium ${colors.subtleText} mb-1`}>
                                Preferred Language
                              </label>
                              <div className="relative">
                                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}>
                                  <FiGlobe className={`text-lg ${colors.iconInputColor}`} />
                                </div>
                                <select
                                  name="preferredLanguage"
                                  defaultValue={userData.preferredLanguage}
                                  className={`w-full ${colors.inputBg} ${colors.inputBorder} border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-teal-500' : 'focus:ring-teal-400'} ${colors.statText}`}
                                >
                                  {['English', 'Hinglish', 'Hindi'].map(lang => (
                                    <option key={lang} value={lang}>{lang}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Target Exam */}
                            <div>
                              <label className={`block text-sm font-medium ${colors.subtleText} mb-1 flex items-center gap-2`}>
                                <FiAward className={`text-lg ${colors.iconInputColor}`} />
                                Target Exam
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {['UGC-NET', 'CSIR-NET'].map(exam => (
                                  <label key={exam} className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name="targetExam"
                                      value={exam}
                                      defaultChecked={userData.targetExam === exam}
                                      className={`h-4 w-4 ${colors.accentText.replace('text', 'accent')}`}
                                    />
                                    <span className={`text-sm ${colors.statText}`}>{exam}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Exam Attempt Section */}
                        <div>
                          <h3 className={`text-lg font-semibold ${colors.accentText} mb-3 flex items-center gap-2`}>
                            <RiMedalLine className={`text-lg ${colors.iconInputColor}`} />
                            Exam Attempt
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {['First Attempt', 'Second Attempt', 'Third Attempt'].map(attempt => (
                              <label key={attempt} className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="examAttempt"
                                  value={attempt}
                                  defaultChecked={userData.examAttempt === attempt}
                                  className={`h-4 w-4 ${colors.accentText.replace('text', 'accent')}`}
                                />
                                <span className={`text-sm ${colors.statText}`}>{attempt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className={`py-4 border-t ${colors.border} mt-4 flex justify-end gap-3`}>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className={`px-4 py-2 rounded-lg ${colors.cardBg} ${colors.border} border hover:bg-opacity-80 transition-colors duration-300 font-medium text-sm ${colors.shadow} flex items-center gap-2`}
                        >
                          <FiX className={`h-4 w-4 ${colors.iconColor}`} />
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className={`px-4 py-2 rounded-lg ${colors.secondary} ${colors.secondaryHover} transition-colors duration-300 font-medium text-sm ${colors.shadow} flex items-center gap-2`}
                        >
                          <FiCheck className={`h-4 w-4 ${darkMode ? 'text-white' : 'text-gray-800'}`} />
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default UserProfile;