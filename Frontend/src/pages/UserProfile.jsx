import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, Fragment } from 'react';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import { FiEdit, FiCamera, FiX, FiCheck, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { RiGraduationCapLine, RiMailLine, RiGlobalLine, RiMedalLine } from 'react-icons/ri';
import { Dialog, Transition } from '@headlessui/react';

const UserProfile = ({ currentUser }) => {
  // User data state
  const [isEditing, setIsEditing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [userData, setUserData] = useState({
    name: currentUser?.name || 'John Doe',
    email: currentUser?.email || 'john.doe@example.com',
    educationLevel: 'Graduate',
    preferredLanguage: 'English',
    targetExam: 'UGC-NET',
    examAttempt: 'First Attempt',
    joinDate: 'January 2023',
    subscription: currentUser?.plan || 'Premium'
  });

  // Layout state
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSection, setExpandedSection] = useState(null);

  // Check screen size and set initial sidebar state
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setSidebarOpen(desktop);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle functions
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Animation variants
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

  const sidebarVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: { x: '-100%', opacity: 0 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setUserData({
      ...userData,
      name: formData.get('name'),
      email: formData.get('email'),
      educationLevel: formData.get('educationLevel'),
      preferredLanguage: formData.get('preferredLanguage'),
      targetExam: formData.get('targetExam'),
      examAttempt: formData.get('examAttempt')
    });
    setIsEditing(false);
  };

  // Color schemes for light/dark modes with glassmorphism
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
    shadow: darkMode ? 'shadow-lg shadow-black/30' : 'shadow-lg shadow-gray-400/20'
  };

  // Stats data
  const stats = [
    { label: 'Member Since', value: userData.joinDate, icon: <RiMedalLine className="text-lg" /> },
    { label: 'Subscription', value: userData.subscription, icon: <RiMedalLine className="text-lg" /> },
    { label: 'Target Exam', value: userData.targetExam, icon: <RiGraduationCapLine className="text-lg" /> },
    { label: 'Exam Attempt', value: userData.examAttempt, icon: <RiGraduationCapLine className="text-lg" /> }
  ];

  return (
    <div className={`flex flex-col min-h-screen w-full ${colors.bg} ${colors.text}`}>
      {/* Header */}
      <Header 
        onToggleSidebar={toggleSidebar}
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        currentUser={currentUser}
      />
      
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          isLoggedIn={isLoggedIn}
          isOpen={sidebarOpen}
          onClose={toggleSidebar}
          darkMode={darkMode}
          currentUser={{ ...userData, plan: userData.subscription }}
        />

        {/* Main Content */}
        <motion.main 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className={`flex-1 w-full overflow-y-auto p-4 lg:p-8 transition-all duration-300 ${colors.bg}`}
          style={{
            marginLeft: sidebarOpen && isDesktop ? '16rem' : '0',
            transition: 'margin-left 0.3s ease'
          }}
        >
          <div className="max-w-6xl mx-auto w-full">
            {/* Profile Header */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col lg:flex-row gap-6 mb-8"
            >
              {/* Avatar Section */}
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
                    <FiCamera className="h-6 w-6 mb-1 text-white" />
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

              {/* Profile Summary */}
              <div className="flex-1 w-full">
                <motion.div variants={itemVariants}>
                  <h1 className={`text-2xl lg:text-3xl font-bold ${colors.accentText} mb-2`}>
                    {userData.name}
                  </h1>
                  <motion.p 
                    className={`text-base lg:text-lg ${colors.subtleText} mb-4 flex items-center gap-1`}
                    variants={itemVariants}
                  >
                    <RiGraduationCapLine />
                    {userData.educationLevel} student
                  </motion.p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 w-full"
                  variants={containerVariants}
                >
                  {stats.map((item, index) => (
                    <motion.div 
                      key={index}
                      className={`p-4 rounded-lg ${colors.cardBg} ${colors.border} border ${colors.shadow} w-full transition-all duration-200 hover:shadow-xl`}
                      variants={itemVariants}
                      whileHover={{ y: -4 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-2 rounded-full ${colors.primary} bg-opacity-20 text-${colors.accentText}`}>
                          {item.icon}
                        </div>
                        <h3 className={`text-xs font-semibold ${colors.accentText}`}>{item.label}</h3>
                      </div>
                      <p className="text-sm font-medium ml-10">{item.value}</p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Tabs */}
                <motion.div 
                  className="flex border-b mb-6"
                  variants={itemVariants}
                >
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'overview' ? `${colors.accentText} border-b-2 ${darkMode ? 'border-teal-400' : 'border-teal-600'}` : `${colors.subtleText} hover:${colors.accentText}`}`}
                  >
                    Overview
                  </button>
                </motion.div>

                {/* Collapsible Sections */}
                <motion.div className="space-y-4" variants={containerVariants}>
                  {/* Personal Information Section */}
                  <motion.div 
                    className={`rounded-lg overflow-hidden ${colors.cardBg} ${colors.border} border ${colors.shadow}`}
                    variants={itemVariants}
                  >
                    <div 
                      className={`p-4 flex justify-between items-center cursor-pointer ${expandedSection === 'personal' ? `${colors.primary} bg-opacity-10` : ''}`}
                      onClick={() => toggleSection('personal')}
                    >
                      <h3 className={`text-base font-semibold ${colors.accentText} flex items-center gap-2`}>
                        <RiMailLine />
                        Personal Information
                      </h3>
                      {expandedSection === 'personal' ? <FiChevronUp /> : <FiChevronDown />}
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
                              <p className="text-sm font-medium break-all">{userData.email}</p>
                            </div>
                            <div>
                              <p className={`text-xs ${colors.subtleText}`}>Preferred Language</p>
                              <p className="text-sm font-medium">{userData.preferredLanguage}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Education Details Section */}
                  <motion.div 
                    className={`rounded-lg overflow-hidden ${colors.cardBg} ${colors.border} border ${colors.shadow}`}
                    variants={itemVariants}
                  >
                    <div 
                      className={`p-4 flex justify-between items-center cursor-pointer ${expandedSection === 'education' ? `${colors.primary} bg-opacity-10` : ''}`}
                      onClick={() => toggleSection('education')}
                    >
                      <h3 className={`text-base font-semibold ${colors.accentText} flex items-center gap-2`}>
                        <RiGraduationCapLine />
                        Education Details
                      </h3>
                      {expandedSection === 'education' ? <FiChevronUp /> : <FiChevronDown />}
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
                              <p className="text-sm font-medium">{userData.educationLevel}</p>
                            </div>
                            <div>
                              <p className={`text-xs ${colors.subtleText}`}>Target Exam</p>
                              <p className="text-sm font-medium">{userData.targetExam}</p>
                            </div>
                            <div>
                              <p className={`text-xs ${colors.subtleText}`}>Exam Attempt</p>
                              <p className="text-sm font-medium">{userData.examAttempt}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  className="flex flex-wrap gap-3 w-full mt-6"
                  variants={itemVariants}
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-4 py-2 rounded-lg ${colors.primary} ${colors.primaryHover} transition-colors duration-300 text-white font-medium ${colors.shadow} flex items-center gap-2 text-sm`}
                  >
                    <FiEdit className="h-4 w-4" />
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.main>
      </div>

      {/* Modal Edit Form */}
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
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle ${colors.cardBg} ${colors.border} border ${colors.shadow} backdrop-blur-lg`}>
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title
                      as="h3"
                      className={`text-xl font-bold ${colors.accentText}`}
                    >
                      Edit Profile
                    </Dialog.Title>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700 hover:bg-opacity-30' : 'hover:bg-gray-200 hover:bg-opacity-50'}`}
                    >
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleEditSubmit}>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      {[
                        { label: 'Full Name', name: 'name', type: 'text', value: userData.name, icon: <RiMailLine className="text-lg" /> },
                        { label: 'Email', name: 'email', type: 'email', value: userData.email, icon: <RiMailLine className="text-lg" /> },
                      ].map((field, index) => (
                        <motion.div key={index} variants={itemVariants}>
                          <label className={`block text-sm font-medium ${colors.subtleText} mb-1`}>
                            {field.label}
                          </label>
                          <div className="relative">
                            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${colors.accentText}`}>
                              {field.icon}
                            </div>
                            <input
                              type={field.type}
                              name={field.name}
                              defaultValue={field.value}
                              className={`w-full ${colors.inputBg} ${colors.inputBorder} border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-teal-500' : 'focus:ring-teal-400'}`}
                            />
                          </div>
                        </motion.div>
                      ))}

                      <motion.div variants={itemVariants}>
                        <label className={`block text-sm font-medium ${colors.subtleText} mb-1`}>
                          Education Level
                        </label>
                        <div className="relative">
                          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${colors.accentText}`}>
                            <RiGraduationCapLine className="text-lg" />
                          </div>
                          <select
                            name="educationLevel"
                            defaultValue={userData.educationLevel}
                            className={`w-full ${colors.inputBg} ${colors.inputBorder} border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-teal-500' : 'focus:ring-teal-400'} appearance-none`}
                          >
                            {['High School', 'Undergraduate', 'Graduate', 'Post Graduate'].map(level => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <label className={`block text-sm font-medium ${colors.subtleText} mb-1`}>
                          Preferred Language
                        </label>
                        <div className="relative">
                          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${colors.accentText}`}>
                            <RiGlobalLine className="text-lg" />
                          </div>
                          <select
                            name="preferredLanguage"
                            defaultValue={userData.preferredLanguage}
                            className={`w-full ${colors.inputBg} ${colors.inputBorder} border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-teal-500' : 'focus:ring-teal-400'} appearance-none`}
                          >
                            {['English', 'Hinglish', 'Hindi'].map(lang => (
                              <option key={lang} value={lang}>{lang}</option>
                            ))}
                          </select>
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <label className={`block text-sm font-medium ${colors.subtleText} mb-2`}>
                          Target Exam
                        </label>
                        <div className="space-y-2">
                          {['UGC-NET', 'CSIR-NET'].map(exam => (
                            <label key={exam} className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name="targetExam"
                                value={exam}
                                defaultChecked={userData.targetExam === exam}
                                className={`h-4 w-4 ${colors.accentText.replace('text', 'accent')} focus:ring-0`}
                              />
                              <span className="text-sm">{exam}</span>
                            </label>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <label className={`block text-sm font-medium ${colors.subtleText} mb-2`}>
                          Exam Attempt
                        </label>
                        <div className="space-y-2">
                          {['First Attempt', 'Second Attempt', 'Third Attempt'].map(attempt => (
                            <label key={attempt} className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name="examAttempt"
                                value={attempt}
                                defaultChecked={userData.examAttempt === attempt}
                                className={`h-4 w-4 ${colors.accentText.replace('text', 'accent')} focus:ring-0`}
                              />
                              <span className="text-sm">{attempt}</span>
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    </div>

                    <motion.div 
                      className="flex justify-end gap-3"
                      variants={itemVariants}
                    >
                      <motion.button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-4 py-2 rounded-lg ${colors.cardBg} ${colors.border} border hover:bg-opacity-80 transition-colors duration-300 font-medium text-sm ${colors.shadow}`}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-4 py-2 rounded-lg ${colors.secondary} ${colors.secondaryHover} transition-colors duration-300 font-medium text-sm ${colors.shadow} flex items-center gap-2`}
                      >
                        <FiCheck className="h-4 w-4" />
                        Save Changes
                      </motion.button>
                    </motion.div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default UserProfile;