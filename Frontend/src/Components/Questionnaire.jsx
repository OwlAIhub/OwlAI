import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ugcNetLogo from '../assets/ugc-net-logo.png';
import csirNetLogo from '../assets/csir-net-logo.png';

import { db, auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const languages = ['English', 'Hinglish'];

const curricula = [
  { label: 'UGC-NET', value: 'UGC-NET', logo: '../assets/ugc-net-logo.png' },
  { label: 'CSIR-NET', value: 'CSIR-NET', logo: '../assets/csir-net-logo.png' },
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
      case 6: // Exam Cycle is skippable
        return true;
      case 7: // How Did You Hear About Us is skippable
        return true;
      default:
        return false;
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/login');
    }
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // Store form data in Firebase Firestore
        await addDoc(collection(db, 'users'), formData);
        console.log('Form data stored in Firebase:', formData);
        navigate('/main');
      } catch (error) {
        console.error('Error storing form data in Firebase:', error);
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
        {/* Steps 1–7 omitted for brevity... */}

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
            disabled={!isStepValid()}
            className={`px-6 py-2 rounded-xl font-semibold transition ${
              isStepValid()
                ? 'bg-[#009688] text-white hover:bg-[#00796B]'
                : 'bg-[#009688] text-gray-800 cursor-not-allowed'
            }`}
          >
            {currentStep === totalSteps ? 'Skip & Continue' : currentStep === 6 || currentStep === 7 ? 'Skip & Continue' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
