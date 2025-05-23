import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    location: 'New York, USA',
    joinDate: 'January 2023',
    bio: 'Senior UX Designer with 5+ years of experience creating beautiful digital experiences.',
    skills: ['UI/UX Design', 'Figma', 'User Research', 'Prototyping', 'Frontend Basics']
  });

  // Check screen size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    initial: { 
      scale: 1,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    hover: {
      scale: 1.03,
      boxShadow: '0 10px 25px rgba(0, 150, 136, 0.3)',
      transition: { 
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    tap: { 
      scale: 0.98,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }
  };

  const editFormVariants = {
    hidden: { 
      opacity: 0,
      height: 0,
      marginTop: 0
    },
    visible: {
      opacity: 1,
      height: 'auto',
      marginTop: '2rem',
      transition: { 
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0,
      height: 0,
      marginTop: 0,
      transition: {
        duration: 0.3,
        ease: 'easeIn'
      }
    }
  };

  const skillChipVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'backOut'
      }
    })
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // Form handling logic would go here
    setIsEditing(false);
  };

  return (
    <div className="flex min-h-screen bg-[#0D1B2A] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-x-hidden">
        <Header />

        <motion.main 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="p-4 lg:p-8"
        >
          <div className="max-w-7xl mx-auto">
            {/* Profile Header */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col lg:flex-row gap-8 mb-8"
            >
              {/* Avatar Section */}
              <motion.div
                className="flex-shrink-0 self-center lg:self-start"
                whileHover="hover"
                whileTap="tap"
              >
                <motion.div
                  className="relative w-40 h-40 lg:w-48 lg:h-48 rounded-full border-4 border-[#009688] overflow-hidden"
                  variants={avatarVariants}
                  initial="initial"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#009688] to-[#00796B] flex items-center justify-center text-5xl font-bold">
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
              </motion.div>

              {/* Profile Summary */}
              <div className="flex-1">
                <motion.div variants={itemVariants}>
                  <h1 className="text-3xl lg:text-4xl font-bold text-[#FFC107] mb-2">
                    {userData.name}
                  </h1>
                  <motion.p 
                    className="text-lg lg:text-xl text-gray-300 mb-6"
                    variants={itemVariants}
                  >
                   
                  </motion.p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
                  variants={containerVariants}
                >
                  <motion.div 
                    className="bg-[#1A3A5F] p-4 rounded-xl"
                    variants={itemVariants}
                    whileHover={{ y: -4, transition: { duration: 0.3 } }}
                  >
                    <h3 className="text-sm font-semibold text-[#009688] mb-1">Member Since</h3>
                    <p className="text-lg font-medium">{userData.joinDate}</p>
                  </motion.div>

                  <motion.div 
                    className="bg-[#1A3A5F] p-4 rounded-xl"
                    variants={itemVariants}
                    whileHover={{ y: -4, transition: { duration: 0.3 } }}
                  >
                    <h3 className="text-sm font-semibold text-[#009688] mb-1">Location</h3>
                    <p className="text-lg font-medium">{userData.location}</p>
                  </motion.div>

                  <motion.div 
                    className="bg-[#1A3A5F] p-4 rounded-xl"
                    variants={itemVariants}
                    whileHover={{ y: -4, transition: { duration: 0.3 } }}
                  >
                    <h3 className="text-sm font-semibold text-[#009688] mb-1">Last Active</h3>
                    <p className="text-lg font-medium">2 hours ago</p>
                  </motion.div>

                  <motion.div 
                    className="bg-[#1A3A5F] p-4 rounded-xl"
                    variants={itemVariants}
                    whileHover={{ y: -4, transition: { duration: 0.3 } }}
                  >
                    <h3 className="text-sm font-semibold text-[#009688] mb-1">Email</h3>
                    <p className="text-lg font-medium truncate">{userData.email}</p>
                  </motion.div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  className="flex flex-wrap gap-4"
                  variants={itemVariants}
                >
                  <motion.button
                    whileHover={{ 
                      scale: 1.03, 
                      boxShadow: '0px 5px 15px rgba(0, 150, 136, 0.4)',
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-3 rounded-xl bg-[#009688] hover:bg-[#00796B] transition-colors duration-300 text-white font-medium shadow-md flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                    </motion.button>
                </motion.div>
              </div>
            </motion.div>

            {/* Skills Section */}
            <motion.div 
              className="bg-[#112D45] rounded-2xl p-6 mb-8 shadow-lg"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-bold text-[#FFC107] mb-6">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-3">
                {userData.skills.map((skill, i) => (
                  <motion.div
                    key={skill}
                    custom={i}
                    variants={skillChipVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-[#1A3A5F] rounded-full text-sm font-medium"
                  >
                    {skill}
                  </motion.div>
                ))}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-[#009688] rounded-full text-sm font-medium flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Skill
                </motion.button>
              </div>
            </motion.div>

            {/* Edit Form */}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  variants={editFormVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-[#112D45] rounded-2xl p-6 shadow-lg"
                >
                  <h2 className="text-2xl font-bold text-[#FFC107] mb-6">Edit Profile</h2>
                  <form onSubmit={handleEditSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={userData.name}
                          className="w-full bg-[#1A3A5F] border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#009688]"
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue={userData.email}
                          className="w-full bg-[#1A3A5F] border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#009688]"
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          defaultValue={userData.location}
                          className="w-full bg-[#1A3A5F] border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#009688]"
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Join Date
                        </label>
                        <input
                          type="text"
                          defaultValue={userData.joinDate}
                          className="w-full bg-[#1A3A5F] border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#009688]"
                          disabled
                        />
                      </motion.div>

                      <motion.div variants={itemVariants} className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Bio
                        </label>
                        <textarea
                          defaultValue={userData.bio}
                          rows="4"
                          className="w-full bg-[#1A3A5F] border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#009688]"
                        />
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
                        className="px-6 py-3 rounded-xl bg-[#1A3A5F] hover:bg-[#2A4A6F] transition-colors duration-300 text-white font-medium shadow-md"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        whileHover={{ 
                          scale: 1.03,
                          boxShadow: '0px 5px 15px rgba(255, 193, 7, 0.3)'
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 rounded-xl bg-[#FFC107] hover:bg-[#FFA000] transition-colors duration-300 text-[#0D1B2A] font-medium shadow-md flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </motion.button>
                    </motion.div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default UserProfile;