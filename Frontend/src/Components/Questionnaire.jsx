import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ugcNetLogo from '../assets/ugc-net-logo.png';
import csirNetLogo from '../assets/csir-net-logo.png';

import { db, auth } from '../firebase';
import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';

const languages = ['English', 'Hinglish'];

const curricula = [
  { label: 'UGC-NET', value: 'UGC-NET', logo: ugcNetLogo },
  { label: 'CSIR-NET', value: 'CSIR-NET', logo: csirNetLogo },
];

const ugcNetSubjects = [
  'Computer Science and Applications',
  'Economics',
  'History',
  'Law',
  'Commerce',
  'Political Science',
  'Psychology',
  'Management',
  'Education',
  'Other',
];

const csirNetSubjects = [
  'Chemical Sciences',
  'Earth Sciences',
  'Life Sciences',
  'Mathematical Sciences',
  'Physical Sciences',
];

const attemptsEnglish = [
  { label: '1st attempt (newbie 🚀)', value: '1st' },
  { label: '2nd attempt (returning 🔄)', value: '2nd' },
  { label: '3rd + attempt (pro grinder 💪)', value: '3rd+' },
];

const attemptsHinglish = [
  { label: '1st attempt 🤞', value: '1st' },
  { label: '2nd attempt 🔄', value: '2nd' },
  { label: '3rd + attempt 💪', value: '3rd+' },
];

const sources = [
  'Google Search',
  'Instagram Reel',
  'YouTube',
  'Friend / Senior',
  'Teacher / Coaching',
  'Telegram',
  'Other',
];

const examCyclesEnglish = ['June 2025', 'Dec 2025', 'Jan 2026', 'June 2026', 'Not sure yet'];
const examCyclesHinglish = ['June 2025', 'Dec 2025', 'Jan 2026', 'June 2026', 'Not sure yet'];

export default function Questionnaire() {
  const navigate = useNavigate();
  const totalSteps = 7;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    language: '',
    curriculum: '',
    selectedSubjects: [],
    otherSubject: '',
    attempt: '',
    heardFrom: '',
    examCycle: '',
  });

  // Track auth state
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthReady(true);
      if (!user) {
        navigate('/login');
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line
  }, [navigate]);

  // Prevent reload and ask user
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // If user confirms reload, redirect to login
  useEffect(() => {
    const handleReload = (e) => {
      if (window.confirm('Are you sure you want to reload? You will be redirected to login.')) {
        navigate('/login');
      }
    };
    window.onpopstate = handleReload;
    return () => {
      window.onpopstate = null;
    };
    // eslint-disable-next-line
  }, [navigate]);

  // On mount, check if questionnaire is already filled
  useEffect(() => {
    const checkQuestionnaire = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().questionnaireFilled) {
          navigate('/chat');
        }
      }
    };
    if (authReady) checkQuestionnaire();
    // eslint-disable-next-line
  }, [navigate, authReady]);

  // Save formData to localStorage in real time
  useEffect(() => {
    if (auth.currentUser) {
      const userInfo = {
        ...formData,
        uid: auth.currentUser.uid,
        questionnaireFilled: false // Will be set to true on final submit
      };
      localStorage.setItem('user', JSON.stringify(userInfo));
    }
  }, [formData, auth.currentUser]);

  // Validation logic for mandatory fields
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName.trim() !== '' && formData.lastName.trim() !== '';
      case 2:
        return formData.language !== '';
      case 3:
        return formData.curriculum !== '';
      case 4:
        return formData.selectedSubjects.length > 0 &&
          (formData.selectedSubjects.includes('Other') ? formData.otherSubject.trim() !== '' : true);
      case 5:
        return formData.attempt !== '';
      case 6:
        return !!formData.examCycle;
      case 7:
        return !!formData.heardFrom;
      default:
        return false;
    }
  };

  // Button label logic for skippable steps
  const getButtonLabel = () => {
    if (currentStep === 6 && !formData.examCycle) return 'Skip & Continue';
    if (currentStep === 6 && formData.examCycle) return 'Continue';
    if (currentStep === 7 && !formData.heardFrom) return 'Skip & Continue';
    if (currentStep === 7 && formData.heardFrom) return 'Continue';
    if (currentStep === totalSteps) return 'Continue';
    return 'Continue';
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/login');
    }
  };

  // Only navigate to /chat with NO toast state after questionnaire
  const handleNext = async () => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userRef, {
          ...formData,
          questionnaireFilled: true
        }, { merge: true });

        await addDoc(collection(db, 'questionnaireResponses'), {
          ...formData,
          uid: auth.currentUser.uid,
          submittedAt: new Date().toISOString(),
        });

        // Go to chat WITHOUT toast state
        navigate('/chat');
      } catch (error) {
        console.error('Error storing form data in Firebase:', error);
        alert('There was an error saving your answers. Please try again.');
      }
    }
  };

  const handleSubjectToggle = (subject) => {
    setFormData((prevData) => {
      const isSelected = prevData.selectedSubjects.includes(subject);
      const updatedSubjects = isSelected
        ? prevData.selectedSubjects.filter((s) => s !== subject)
        : [...prevData.selectedSubjects, subject];
      return { ...prevData, selectedSubjects: updatedSubjects };
    });
  };

  if (!authReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-lg text-gray-700 dark:text-white">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-[#0D1B2A]">
      {/* Header */}
      <div className="p-4 flex items-center bg-gray-50 dark:bg-[#0D1B2A]">
        {currentStep > 1 && (
          <button
            onClick={handleBack}
            className="mr-4 p-2 rounded-full bg-[#009688] text-white hover:bg-[#00796B]"
          >
            {'<'}
          </button>
        )}
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#009688]"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Step 1: Name */}
        {currentStep === 1 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">What is your name?</h2>
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full max-w-md p-3 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-[#1A2A3A] text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#009688]"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full max-w-md p-3 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-[#1A2A3A] text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#009688]"
            />
          </>
        )}

        {/* Step 2: Language Selection */}
        {currentStep === 2 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Choose your language</h2>
            <div className="grid grid-cols-2 gap-4 max-w-md w-full">
              {languages.map((lang) => (
                <div
                  key={lang}
                  onClick={() => setFormData({ ...formData, language: lang })}
                  className={`cursor-pointer p-4 border rounded-xl transition shadow-sm ${
                    formData.language === lang
                      ? 'bg-[#009688] text-white border-[#009688]'
                      : 'bg-white dark:bg-[#1A2A3A] text-gray-800 dark:text-white border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {lang}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 3: Curriculum Selection */}
        {currentStep === 3 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {formData.language === 'English'
                ? 'Which curriculum / test are you taking?'
                : 'Kaunsa Govt. exam clear karna hai?'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
              {curricula.map((item) => (
                <div
                  key={item.value}
                  onClick={() => setFormData({ ...formData, curriculum: item.value })}
                  className={`cursor-pointer p-4 border rounded-xl transition shadow-sm ${
                    formData.curriculum === item.value
                      ? 'bg-[#009688] text-white border-[#009688]'
                      : 'bg-white dark:bg-[#1A2A3A] text-gray-800 dark:text-white border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center">
                    <img src={item.logo} alt={item.label} className="w-8 h-8 rounded-full mr-2" />
                    <h3 className="font-bold">{item.label}</h3>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 4: Subject Selection */}
        {currentStep === 4 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {formData.language === 'English' ? 'Select your Paper-2 subjects' : 'Paper-2 ka subject chuniye'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
              {(formData.curriculum === 'UGC-NET' ? ugcNetSubjects : csirNetSubjects).map((subject) => (
                <div
                  key={subject}
                  onClick={() => handleSubjectToggle(subject)}
                  className={`cursor-pointer p-4 border rounded-xl transition shadow-sm ${
                    formData.selectedSubjects.includes(subject)
                      ? 'bg-[#009688] text-white border-[#009688]'
                      : 'bg-white dark:bg-[#1A2A3A] text-gray-800 dark:text-white border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {subject}
                </div>
              ))}
            </div>
            {formData.curriculum === 'UGC-NET' && formData.selectedSubjects.includes('Other') && (
              <input
                type="text"
                placeholder="Please specify"
                value={formData.otherSubject}
                onChange={(e) => setFormData({ ...formData, otherSubject: e.target.value })}
                className="w-full max-w-md p-3 mt-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-[#1A2A3A] text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#009688]"
              />
            )}
          </>
        )}

        {/* Step 5: Attempt Selection */}
        {currentStep === 5 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {formData.language === 'English' ? 'Which attempt is this for you?' : 'Yeh aapka konsa attempt hai?'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
              {(formData.language === 'English' ? attemptsEnglish : attemptsHinglish).map((attempt) => (
                <div
                  key={attempt.value}
                  onClick={() => setFormData({ ...formData, attempt: attempt.value })}
                  className={`cursor-pointer p-4 border rounded-xl transition shadow-sm ${
                    formData.attempt === attempt.value
                      ? 'bg-[#009688] text-white border-[#009688]'
                      : 'bg-white dark:bg-[#1A2A3A] text-gray-800 dark:text-white border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {attempt.label}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 6: Exam Cycle Selection (Skippable) */}
        {currentStep === 6 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {formData.language === 'English'
                ? 'Choose your Exam cycle (optional)'
                : 'Kaun-si exam cycle aapki target hai? (Skip kar sakte ho)'}
            </h2>
            <div className="grid grid-cols-2 gap-3 max-w-md w-full">
              {(formData.language === 'English' ? examCyclesEnglish : examCyclesHinglish).map((cycle) => (
                <div
                  key={cycle}
                  onClick={() => setFormData({ ...formData, examCycle: cycle })}
                  className={`cursor-pointer px-4 py-2 border rounded-xl text-left transition ${
                    formData.examCycle === cycle
                      ? 'bg-[#009688] text-white border-[#009688]'
                      : 'bg-white dark:bg-[#1A2A3A] text-gray-800 dark:text-white border-gray-300 dark:border-gray-700'
                  }`}
                >
                  {cycle}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 7: How did you hear about us? (Skippable) */}
        {currentStep === 7 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {formData.language === 'English' ? 'How did you hear about us?' : 'OwlAI ke barein mein kahan se pata chala?'}
            </h2>
            <div className="grid grid-cols-2 gap-3 max-w-md w-full">
              {sources.map((source) => (
                <div
                  key={source}
                  onClick={() => setFormData({ ...formData, heardFrom: source })}
                  className={`cursor-pointer px-4 py-2 border rounded-xl text-left transition ${
                    formData.heardFrom === source
                      ? 'bg-[#009688] text-white border-[#009688]'
                      : 'bg-white dark:bg-[#1A2A3A] text-gray-800 dark:text-white border-gray-300 dark:border-gray-700'
                  }`}
                >
                  {source}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className={`flex ${currentStep === 1 ? 'justify-end' : 'justify-between'} mt-6 w-full max-w-md`}>
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-2 rounded-xl font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={
              (currentStep === 6 && !formData.examCycle) ||
              (currentStep === 7 && !formData.heardFrom)
                ? false
                : !isStepValid()
            }
            className={`px-6 py-2 rounded-xl font-semibold transition ${
              (currentStep === 6 && !formData.examCycle) ||
              (currentStep === 7 && !formData.heardFrom)
                ? 'bg-[#009688] text-white hover:bg-[#00796B]'
                : isStepValid()
                ? 'bg-[#009688] text-white hover:bg-[#00796B]'
                : 'bg-[#009688] text-gray-800 cursor-not-allowed'
            }`}
          >
            {getButtonLabel()}
          </button>
        </div>
      </div>
    </div>
  );
}