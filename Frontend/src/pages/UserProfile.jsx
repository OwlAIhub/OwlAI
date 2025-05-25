import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';

const UserProfile = () => {
  // User data state
  const [isEditing, setIsEditing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    educationLevel: 'Graduate',
    preferredLanguage: 'English',
    targetExam: 'UGC-NET',
    examAttempt: 'First Attempt',
    joinDate: 'January 2023',
    subscription: 'Premium'
  });

  // Layout state
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

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

  // Color schemes for light/dark modes
  const colors = {
    bg: darkMode ? 'bg-gray-900' : 'bg-white',
    text: darkMode ? 'text-gray-100' : 'text-gray-800',
    cardBg: darkMode ? 'bg-gray-800' : 'bg-gray-50',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    primary: darkMode ? 'bg-teal-600' : 'bg-teal-500',
    primaryHover: darkMode ? 'hover:bg-teal-700' : 'hover:bg-teal-600',
    secondary: darkMode ? 'bg-amber-500' : 'bg-amber-400',
    secondaryHover: darkMode ? 'hover:bg-amber-600' : 'hover:bg-amber-500',
    accentText: darkMode ? 'text-teal-400' : 'text-teal-600',
    inputBg: darkMode ? 'bg-gray-700' : 'bg-white',
    inputBorder: darkMode ? 'border-gray-600' : 'border-gray-300',
    overlay: darkMode ? 'bg-black bg-opacity-70' : 'bg-black bg-opacity-50'
  };

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
      />
      
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || isDesktop) && (
            <>
              <motion.div 
                className={`fixed lg:static z-30 w-64 h-full ${colors.cardBg} ${colors.border} border-r shadow-lg`}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={sidebarVariants}
              >
                <Sidebar darkMode={darkMode} />
              </motion.div>
              {!isDesktop && (
                <motion.div
                  className={`fixed inset-0 z-20 ${colors.overlay}`}
                  onClick={toggleSidebar}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.main 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className={`flex-1 w-full overflow-y-auto p-4 lg:p-8 transition-colors duration-300 ${colors.bg}`}
          style={{ 
            marginLeft: sidebarOpen && isDesktop ? '16rem' : '0',
            maxWidth: sidebarOpen && isDesktop ? 'calc(100% - 16rem)' : '100%'
          }}
        >
          <div className="max-w-6xl mx-auto w-full">
            {/* Profile Header */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col lg:flex-row gap-8 mb-8"
            >
              {/* Avatar Section */}
              <motion.div
                className="flex-shrink-0 self-center lg:self-start relative"
                whileHover="hover"
                whileTap="tap"
              >
                <motion.div
                  className={`relative w-40 h-40 lg:w-48 lg:h-48 rounded-full border-4 ${colors.primary} overflow-hidden`}
                  variants={avatarVariants}
                  initial="initial"
                >
                  <div className={`absolute inset-0 ${colors.primary} flex items-center justify-center text-5xl font-bold`}>
                    JD
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    whileHover={{ opacity: 1 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium">Update Photo</span>
                  </motion.div>
                </motion.div>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`absolute -bottom-2 -right-2 ${colors.primary} ${colors.primaryHover} rounded-full p-2 shadow-lg transition-colors duration-300`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </motion.div>

              {/* Profile Summary */}
              <div className="flex-1 w-full">
                <motion.div variants={itemVariants}>
                  <h1 className={`text-3xl lg:text-4xl font-bold ${colors.accentText} mb-2`}>
                    {userData.name}
                  </h1>
                  <motion.p 
                    className={`text-lg lg:text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}
                    variants={itemVariants}
                  >
                    {userData.educationLevel} student
                  </motion.p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 w-full"
                  variants={containerVariants}
                >
                  {[
                    { label: 'Member Since', value: userData.joinDate },
                    { label: 'Subscription', value: userData.subscription },
                    { label: 'Target Exam', value: userData.targetExam },
                    { label: 'Exam Attempt', value: userData.examAttempt }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className={`p-4 rounded-xl ${colors.cardBg} ${colors.border} border w-full`}
                      variants={itemVariants}
                      whileHover={{ y: -4 }}
                    >
                      <h3 className={`text-sm font-semibold ${colors.accentText} mb-1`}>{item.label}</h3>
                      <p className="text-lg font-medium">{item.value}</p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Additional Info Section */}
                <motion.div 
                  className={`p-6 rounded-xl mb-6 ${colors.cardBg} ${colors.border} border w-full`}
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div>
                      <h3 className={`text-lg font-semibold ${colors.accentText} mb-3`}>Personal Information</h3>
                      <div className="space-y-3">
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Email</p>
                          <p className="font-medium break-all">{userData.email}</p>
                        </div>
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Preferred Language</p>
                          <p className="font-medium">{userData.preferredLanguage}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${colors.accentText} mb-3`}>Education Details</h3>
                      <div className="space-y-3">
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Education Level</p>
                          <p className="font-medium">{userData.educationLevel}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  className="flex flex-wrap gap-4 w-full"
                  variants={itemVariants}
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-6 py-3 rounded-xl ${colors.primary} ${colors.primaryHover} transition-colors duration-300 text-white font-medium shadow-md flex items-center gap-2`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.main>
      </div>

      {/* Modal Edit Form */}
      <AnimatePresence>
        {isEditing && (
          <>
            <motion.div
              className={`fixed inset-0 z-40 ${colors.overlay}`}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsEditing(false)}
            />
            
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`rounded-2xl p-6 shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto ${colors.cardBg} ${colors.border} border`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-2xl font-bold ${colors.accentText}`}>Edit Profile</h2>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleEditSubmit}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {[
                      { label: 'Full Name', name: 'name', type: 'text', value: userData.name },
                      { label: 'Email', name: 'email', type: 'email', value: userData.email },
                    ].map((field, index) => (
                      <motion.div key={index} variants={itemVariants}>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          defaultValue={field.value}
                          className={`w-full ${colors.inputBg} ${colors.inputBorder} border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-teal-500' : 'focus:ring-teal-400'}`}
                        />
                      </motion.div>
                    ))}

                    <motion.div variants={itemVariants}>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Education Level
                      </label>
                      <select
                        name="educationLevel"
                        defaultValue={userData.educationLevel}
                        className={`w-full ${colors.inputBg} ${colors.inputBorder} border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-teal-500' : 'focus:ring-teal-400'}`}
                      >
                        {['High School', 'Undergraduate', 'Graduate', 'Post Graduate'].map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Preferred Language
                      </label>
                      <select
                        name="preferredLanguage"
                        defaultValue={userData.preferredLanguage}
                        className={`w-full ${colors.inputBg} ${colors.inputBorder} border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-teal-500' : 'focus:ring-teal-400'}`}
                      >
                        {['English', 'Hinglish', 'Hindi'].map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Target Exam
                      </label>
                      <div className="space-y-2">
                        {['UGC-NET', 'CSIR-NET'].map(exam => (
                          <label key={exam} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="targetExam"
                              value={exam}
                              defaultChecked={userData.targetExam === exam}
                              className={colors.accentText.replace('text', 'accent')}
                            />
                            <span>{exam}</span>
                          </label>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Exam Attempt
                      </label>
                      <div className="space-y-2">
                        {['First Attempt', 'Second Attempt', 'Third Attempt'].map(attempt => (
                          <label key={attempt} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="examAttempt"
                              value={attempt}
                              defaultChecked={userData.examAttempt === attempt}
                              className={colors.accentText.replace('text', 'accent')}
                            />
                            <span>{attempt}</span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  <motion.div 
                    className="flex justify-end gap-4"
                    variants={itemVariants}
                  >
                    <motion.button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-6 py-3 rounded-xl ${colors.cardBg} ${colors.border} border hover:bg-opacity-80 transition-colors duration-300 font-medium shadow-md`}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-6 py-3 rounded-xl ${colors.secondary} ${colors.secondaryHover} transition-colors duration-300 font-medium shadow-md flex items-center gap-2`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;