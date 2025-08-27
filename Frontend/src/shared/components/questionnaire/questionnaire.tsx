import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/core/firebase";
import { QuestionnaireStep } from "@/shared/components/questionnaire/questionnaire-step";
import { QuestionnaireNavigation } from "@/shared/components/questionnaire/questionnaire-navigation";
import {
  languages,
  curricula,
  ugcNetSubjects,
  csirNetSubjects,
  attemptsEnglish,
  attemptsHinglish,
  sources,
  examCyclesEnglish,
  examCyclesHinglish,
  steps,
} from "@/core/data/questionnaireData";

interface FormData {
  firstName: string;
  lastName: string;
  language: string;
  curriculum: string;
  selectedSubjects: string[];
  otherSubject: string;
  attempt: string;
  heardFrom: string;
  examCycle: string;
}

export default function Questionnaire() {
  const navigate = useNavigate();
  const totalSteps = 7;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    language: "",
    curriculum: "",
    selectedSubjects: [],
    otherSubject: "",
    attempt: "",
    heardFrom: "",
    examCycle: "",
  });

  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const checkExistingProfile = (uid: string) => {
      try {
        const userData = localStorage.getItem(`user_${uid}_questionnaire`);
        if (userData) {
          const parsedData = JSON.parse(userData);
          if (parsedData.questionnaireFilled) {
            navigate("/chat");
          }
        }
      } catch {
        // Error checking profile - user likely not logged in
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      setAuthReady(true);
      if (user) {
        checkExistingProfile(user.uid);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(formData.firstName.trim() && formData.lastName.trim());
      case 2:
        return !!formData.language;
      case 3:
        return !!formData.curriculum;
      case 4:
        return formData.selectedSubjects.length > 0;
      case 5:
        return !!formData.attempt;
      case 6:
        return !!formData.heardFrom;
      case 7:
        return !!formData.examCycle;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep === totalSteps) {
      await handleSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        language: formData.language,
        targetExam: formData.curriculum,
        selectedSubjects: formData.selectedSubjects,
        otherSubject: formData.otherSubject,
        attempt: formData.attempt,
        heardFrom: formData.heardFrom,
        examCycle: formData.examCycle,
        questionnaireFilled: true,
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage instead of Firestore
      localStorage.setItem(
        `user_${user.uid}_questionnaire`,
        JSON.stringify(userData)
      );

      // Also save to the main user data
      const existingUserData = localStorage.getItem("user");
      if (existingUserData) {
        const parsedUserData = JSON.parse(existingUserData);
        const updatedUserData = { ...parsedUserData, ...userData };
        localStorage.setItem("user", JSON.stringify(updatedUserData));
      }

      navigate("/chat");
    } catch {
      // Error saving questionnaire
    }
  };

  const renderStepContent = () => {
    const currentStepData = steps[currentStep - 1];
    const isActive = true as const;

    switch (currentStep) {
      case 1:
        return (
          <QuestionnaireStep
            step={currentStep}
            totalSteps={totalSteps}
            title={currentStepData.title}
            description={currentStepData.description}
            isActive={isActive}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={e => updateFormData("firstName", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009688] focus:border-transparent"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={e => updateFormData("lastName", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009688] focus:border-transparent"
                  placeholder="Enter your last name"
                />
              </div>
            </div>
          </QuestionnaireStep>
        );

      case 2:
        return (
          <QuestionnaireStep
            step={currentStep}
            totalSteps={totalSteps}
            title={currentStepData.title}
            description={currentStepData.description}
            isActive={isActive}
          >
            <div className="grid grid-cols-1 gap-4">
              {languages.map((language: string) => (
                <button
                  key={language}
                  onClick={() => updateFormData("language", language)}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    formData.language === language
                      ? "border-[#009688] bg-[#009688] bg-opacity-10"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="font-medium text-gray-900">{language}</div>
                </button>
              ))}
            </div>
          </QuestionnaireStep>
        );

      case 3:
        return (
          <QuestionnaireStep
            step={currentStep}
            totalSteps={totalSteps}
            title={currentStepData.title}
            description={currentStepData.description}
            isActive={isActive}
          >
            <div className="grid grid-cols-1 gap-4">
              {curricula.map((curriculum: any) => (
                <button
                  key={curriculum.value}
                  onClick={() => updateFormData("curriculum", curriculum.value)}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    formData.curriculum === curriculum.value
                      ? "border-[#009688] bg-[#009688] bg-opacity-10"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={curriculum.logo}
                      alt={curriculum.label}
                      className="w-12 h-12 object-contain"
                    />
                    <div className="font-medium text-gray-900">
                      {curriculum.label}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </QuestionnaireStep>
        );

      case 4: {
        const subjects =
          formData.curriculum === "UGC-NET" ? ugcNetSubjects : csirNetSubjects;
        return (
          <QuestionnaireStep
            step={currentStep}
            totalSteps={totalSteps}
            title={currentStepData.title}
            description={currentStepData.description}
            isActive={isActive}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {subjects.map((subject: string) => (
                  <label key={subject} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.selectedSubjects.includes(subject)}
                      onChange={e => {
                        if (e.target.checked) {
                          updateFormData("selectedSubjects", [
                            ...formData.selectedSubjects,
                            subject,
                          ]);
                        } else {
                          updateFormData(
                            "selectedSubjects",
                            formData.selectedSubjects.filter(s => s !== subject)
                          );
                        }
                      }}
                      className="w-4 h-4 text-[#009688] border-gray-300 rounded focus:ring-[#009688]"
                    />
                    <span className="text-gray-900">{subject}</span>
                  </label>
                ))}
              </div>
              {formData.selectedSubjects.includes("Other") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specify Other Subject
                  </label>
                  <input
                    type="text"
                    value={formData.otherSubject}
                    onChange={e =>
                      updateFormData("otherSubject", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009688] focus:border-transparent"
                    placeholder="Enter your subject"
                  />
                </div>
              )}
            </div>
          </QuestionnaireStep>
        );
      }

      case 5: {
        const attempts =
          formData.language === "Hinglish" ? attemptsHinglish : attemptsEnglish;
        return (
          <QuestionnaireStep
            step={currentStep}
            totalSteps={totalSteps}
            title={currentStepData.title}
            description={currentStepData.description}
            isActive={isActive}
          >
            <div className="grid grid-cols-1 gap-4">
              {attempts.map((attempt: any) => (
                <button
                  key={attempt.value}
                  onClick={() => updateFormData("attempt", attempt.value)}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    formData.attempt === attempt.value
                      ? "border-[#009688] bg-[#009688] bg-opacity-10"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="font-medium text-gray-900">
                    {attempt.label}
                  </div>
                </button>
              ))}
            </div>
          </QuestionnaireStep>
        );
      }

      case 6:
        return (
          <QuestionnaireStep
            step={currentStep}
            totalSteps={totalSteps}
            title={currentStepData.title}
            description={currentStepData.description}
            isActive={isActive}
          >
            <div className="grid grid-cols-1 gap-4">
              {sources.map((source: string) => (
                <button
                  key={source}
                  onClick={() => updateFormData("heardFrom", source)}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    formData.heardFrom === source
                      ? "border-[#009688] bg-[#009688] bg-opacity-10"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="font-medium text-gray-900">{source}</div>
                </button>
              ))}
            </div>
          </QuestionnaireStep>
        );

      case 7: {
        const examCycles =
          formData.language === "Hinglish"
            ? examCyclesHinglish
            : examCyclesEnglish;
        return (
          <QuestionnaireStep
            step={currentStep}
            totalSteps={totalSteps}
            title={currentStepData.title}
            description={currentStepData.description}
            isActive={isActive}
          >
            <div className="grid grid-cols-1 gap-4">
              {examCycles.map((cycle: string) => (
                <button
                  key={cycle}
                  onClick={() => updateFormData("examCycle", cycle)}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    formData.examCycle === cycle
                      ? "border-[#009688] bg-[#009688] bg-opacity-10"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="font-medium text-gray-900">{cycle}</div>
                </button>
              ))}
            </div>
          </QuestionnaireStep>
        );
      }

      default:
        return null;
    }
  };

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009688]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {renderStepContent()}
        <QuestionnaireNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canProceed={canProceed()}
        />
      </div>
    </div>
  );
}
