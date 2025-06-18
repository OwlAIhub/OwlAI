import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ugcNetLogo from "../assets/ugc-net.png";
import csirNetLogo from "../assets/csir.png";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const languages = ["English", "Hinglish"];

const curricula = [
    { label: "UGC-NET", value: "UGC-NET", logo: ugcNetLogo },
    { label: "CSIR-NET", value: "CSIR-NET", logo: csirNetLogo },
];

const ugcNetSubjects = [
    "Paper 1",
    "Computer Science and Applications",
    "Economics",
    "History",
    "Law",
    "Commerce",
    "Political Science",
    "Psychology",
    "Management",
    "Education",
    "Other",
];

const csirNetSubjects = [
    "Chemical Sciences",
    "Earth Sciences",
    "Life Sciences",
    "Mathematical Sciences",
    "Physical Sciences",
];

const attemptsEnglish = [
    { label: "1st attempt (newbie 🚀)", value: "1st" },
    { label: "2nd attempt (returning 🔄)", value: "2nd" },
    { label: "3rd + attempt (pro grinder 💪)", value: "3rd+" },
];

const attemptsHinglish = [
    { label: "1st attempt 🤞", value: "1st" },
    { label: "2nd attempt 🔄", value: "2nd" },
    { label: "3rd + attempt 💪", value: "3rd+" },
];

const sources = [
    "Google Search",
    "Instagram Reel",
    "YouTube",
    "Friend / Senior",
    "Teacher / Coaching",
    "Telegram",
    "Other",
];

const examCyclesEnglish = [
    "June 2025",
    "Dec 2025",
    "Jan 2026",
    "June 2026",
    "Not sure yet",
];
const examCyclesHinglish = [
    "June 2025",
    "Dec 2025",
    "Jan 2026",
    "June 2026",
    "Not sure yet",
];

export default function Questionnaire() {
    const navigate = useNavigate();
    const location = useLocation();
    const totalSteps = 7;
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
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

    // Popup state
    const [showPopup, setShowPopup] = useState(false);
    const [showCSIRPopup, setShowCSIRPopup] = useState(false);

    // Track auth state
    const [authReady, setAuthReady] = useState(false);

    // Loading state for popup actions: null | 'continue' | 'logout' | 'changeExam'
    const [popupLoading, setPopupLoading] = useState(null);

    // Prefill and step logic for login "change exam" flow
    useEffect(() => {
        if (location.state && location.state.step) {
            setCurrentStep(location.state.step);
            if (location.state.prefill) {
                setFormData((prev) => ({
                    ...prev,
                    ...location.state.prefill,
                }));
            }
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setAuthReady(true);
            if (!user) {
                navigate("/login");
            }
        });
        return () => unsubscribe();
        // eslint-disable-next-line
    }, [navigate]);

    // Prevent reload and ask user
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    // If user confirms reload, redirect to login
    useEffect(() => {
        const handleReload = (e) => {
            if (
                window.confirm(
                    "Are you sure you want to reload? You will be redirected to login."
                )
            ) {
                navigate("/login");
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
                const userRef = doc(db, "users", auth.currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists() && userSnap.data().questionnaireFilled) {
                    navigate("/chat");
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
                questionnaireFilled: false, // Will be set to true on final submit
            };
            localStorage.setItem("user", JSON.stringify(userInfo));
        }
    }, [formData, auth.currentUser]);

    // Always preselect Paper 1 for UGC-NET
    useEffect(() => {
        if (
            formData.curriculum === "UGC-NET" &&
            !formData.selectedSubjects.includes("Paper 1")
        ) {
            setFormData((prev) => ({
                ...prev,
                selectedSubjects: ["Paper 1", ...prev.selectedSubjects],
            }));
        }
        // eslint-disable-next-line
    }, [formData.curriculum]);

    // Validation logic for mandatory fields
    const isStepValid = () => {
        switch (currentStep) {
            case 1:
                return (
                    formData.firstName.trim() !== "" &&
                    formData.lastName.trim() !== ""
                );
            case 2:
                return formData.language !== "";
            case 3:
                return formData.curriculum !== "";
            case 4:
                if (formData.curriculum === "UGC-NET") {
                    // Must have Paper 1 always selected
                    return (
                        formData.selectedSubjects.includes("Paper 1") &&
                        (formData.selectedSubjects.includes("Other")
                            ? formData.otherSubject.trim() !== ""
                            : true)
                    );
                } else {
                    return (
                        formData.selectedSubjects.length > 0 &&
                        (formData.selectedSubjects.includes("Other")
                            ? formData.otherSubject.trim() !== ""
                            : true)
                    );
                }
            case 5:
                return formData.attempt !== "";
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
        if (currentStep === 6 && !formData.examCycle) return "Skip & Continue";
        if (currentStep === 6 && formData.examCycle) return "Continue";
        if (currentStep === 7 && !formData.heardFrom) return "Skip & Continue";
        if (currentStep === 7 && formData.heardFrom) return "Continue";
        if (currentStep === totalSteps) return "Continue";
        return "Continue";
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate("/login");
        }
    };

    // Subject toggle with Paper 1 always selected for UGC-NET
    const handleSubjectToggle = (subject) => {
        setFormData((prevData) => {
            if (formData.curriculum === "UGC-NET") {
                if (subject === "Paper 1") {
                    // Paper 1 cannot be deselected
                    return prevData;
                }
                const isSelected = prevData.selectedSubjects.includes(subject);
                let updatedSubjects;
                if (isSelected) {
                    updatedSubjects = prevData.selectedSubjects.filter(
                        (s) => s !== subject
                    );
                } else {
                    updatedSubjects = [...prevData.selectedSubjects, subject];
                }
                // Always ensure Paper 1 is present
                if (!updatedSubjects.includes("Paper 1")) {
                    updatedSubjects = ["Paper 1", ...updatedSubjects];
                }
                return { ...prevData, selectedSubjects: updatedSubjects };
            } else {
                // CSIR-NET: normal toggle
                const isSelected = prevData.selectedSubjects.includes(subject);
                const updatedSubjects = isSelected
                    ? prevData.selectedSubjects.filter((s) => s !== subject)
                    : [...prevData.selectedSubjects, subject];
                return { ...prevData, selectedSubjects: updatedSubjects };
            }
        });
    };

    // Show popup if UGC-NET and any subject other than Paper 1 is selected
    const shouldShowSubjectPopup = () => {
        if (formData.curriculum === "UGC-NET") {
            return formData.selectedSubjects.some(
                (s) => s !== "Paper 1" && s !== "Other"
            );
        }
        return false;
    };

    // Helper to get non-Paper 1, non-Other subjects
    const getOtherSubjects = () =>
        formData.selectedSubjects.filter(
            (s) => s !== "Paper 1" && s !== "Other"
        );

    // Helper to format subject list with commas and "&"
    const formatSubjectList = (subjects) => {
        if (subjects.length === 1) return subjects[0];
        if (subjects.length === 2) return `${subjects[0]} & ${subjects[1]}`;
        return `${subjects.slice(0, -1).join(", ")}, & ${
            subjects[subjects.length - 1]
        }`;
    };

    // Only navigate to /chat with NO toast state after questionnaire
    const handleNext = async () => {
        if (!auth.currentUser) {
            navigate("/login");
            return;
        }
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            // If CSIR-NET, show CSIR popup
            if (formData.curriculum === "CSIR-NET") {
                setShowCSIRPopup(true);
                return;
            }
            // If UGC-NET with unsupported subjects, show subject popup
            if (shouldShowSubjectPopup()) {
                setShowPopup(true);
                return;
            }
            try {
                const userRef = doc(db, "users", auth.currentUser.uid);
                await setDoc(
                    userRef,
                    {
                        ...formData,
                        questionnaireFilled: true,
                    },
                    { merge: true }
                );

                // Removed addDoc to questionnaireResponses

                // Go to chat WITHOUT toast state
                navigate("/chat");
            } catch (error) {
                console.error("Error storing form data in Firebase:", error);
                alert(
                    "There was an error saving your answers. Please try again."
                );
            }
        }
    };

    // Continue for Paper 1 (but keep all selected subjects)
    const handleContinuePaper1 = async () => {
        setPopupLoading("continue");
        try {
            const userRef = doc(db, "users", auth.currentUser.uid);
            await setDoc(
                userRef,
                {
                    ...formData,
                    questionnaireFilled: true,
                },
                { merge: true }
            );

            // Removed addDoc to questionnaireResponses

            navigate("/chat");
        } catch (error) {
            setPopupLoading(null);
            console.error("Error storing form data in Firebase:", error);
            alert("There was an error saving your answers. Please try again.");
        }
    };

    // Log out (always submit data before logging out)
    const handleLogout = async () => {
        setPopupLoading("logout");
        try {
            const userRef = doc(db, "users", auth.currentUser.uid);
            await setDoc(
                userRef,
                {
                    ...formData,
                    questionnaireFilled: true,
                    // Mark as CSIR blocked if user chose CSIR-NET
                    ...(formData.curriculum === "CSIR-NET"
                        ? { csirBlocked: true }
                        : {}),
                },
                { merge: true }
            );

            // Removed addDoc to questionnaireResponses

            // Also set in localStorage for immediate effect
            if (formData.curriculum === "CSIR-NET") {
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                user.csirBlocked = true;
                localStorage.setItem("user", JSON.stringify(user));
            }
        } catch (error) {
            setPopupLoading(null);
            console.error("Error storing form data in Firebase:", error);
            alert("There was an error saving your answers. Please try again.");
            return;
        }
        await auth.signOut();
        navigate("/login");
    };

    // Change exam to UGC-NET (reset curriculum and selectedSubjects, go to curriculum step)
    const handleChangeExamToUGCNet = () => {
        setPopupLoading("changeExam");
        setTimeout(() => {
            setFormData((prev) => ({
                ...prev,
                curriculum: "",
                selectedSubjects: [],
            }));
            setCurrentStep(3); // Go to curriculum selection
            setShowCSIRPopup(false);
            setPopupLoading(null);
        }, 300); // Small delay for UX
    };

    if (!authReady) {
        return (
            <div className="flex items-center justify-center h-screen">
                <span className="text-lg text-gray-700 dark:text-white">
                    Loading...
                </span>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-[#0D1B2A] relative">
            {/* Blur overlay */}
            {(showPopup || showCSIRPopup) && (
                <div className="fixed inset-0 z-40 bg-black bg-opacity-40 backdrop-blur-sm"></div>
            )}

            {/* Header */}
            <div
                className={`p-4 flex items-center bg-gray-50 dark:bg-[#0D1B2A] ${
                    showPopup || showCSIRPopup
                        ? "blur-sm pointer-events-none select-none"
                        : ""
                }`}
            >
                {currentStep > 1 && (
                    <button
                        onClick={handleBack}
                        className="mr-4 p-2 rounded-full bg-[#009688] text-white hover:bg-[#00796B]"
                    >
                        {"<"}
                    </button>
                )}
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#009688]"
                        style={{
                            width: `${(currentStep / totalSteps) * 100}%`,
                        }}
                    ></div>
                </div>
            </div>

            {/* Main Content */}
            <div
                className={`flex-1 flex flex-col items-center justify-center p-4 ${
                    showPopup || showCSIRPopup
                        ? "blur-sm pointer-events-none select-none"
                        : ""
                }`}
            >
                {/* Step 1: Name */}
                {currentStep === 1 && (
                    <>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                            What is your name?
                        </h2>
                        <input
                            type="text"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    firstName: e.target.value,
                                })
                            }
                            className="w-full max-w-md p-3 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-[#1A2A3A] text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#009688]"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    lastName: e.target.value,
                                })
                            }
                            className="w-full max-w-md p-3 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-[#1A2A3A] text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#009688]"
                        />
                    </>
                )}

                {/* Step 2: Language Selection */}
                {currentStep === 2 && (
                    <>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                            Choose your language
                        </h2>
                        <div className="grid grid-cols-2 gap-4 max-w-md w-full">
                            {languages.map((lang) => (
                                <div
                                    key={lang}
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            language: lang,
                                        })
                                    }
                                    className={`cursor-pointer p-4 border rounded-xl transition shadow-sm ${
                                        formData.language === lang
                                            ? "bg-[#009688] text-white border-[#009688]"
                                            : "bg-white dark:bg-[#1A2A3A] text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
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
                            {formData.language === "English"
                                ? "Which curriculum / test are you taking?"
                                : "Kaunsa Govt. exam clear karna hai?"}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
                            {curricula.map((item) => (
                                <div
                                    key={item.value}
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            curriculum: item.value,
                                            selectedSubjects: [],
                                        })
                                    }
                                    className={`cursor-pointer p-4 border rounded-xl transition shadow-sm ${
                                        formData.curriculum === item.value
                                            ? "bg-[#009688] text-white border-[#009688]"
                                            : "bg-white dark:bg-[#1A2A3A] text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <img
                                            src={item.logo}
                                            alt={item.label}
                                            className="w-8 h-8 rounded-full mr-2"
                                        />
                                        <h3 className="font-bold">
                                            {item.label}
                                        </h3>
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
                            {formData.language === "English"
                                ? "Select your subjects"
                                : "Apne subjects chuniye"}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
                            {/* For UGC-NET, Paper 1 always first and preselected */}
                            {formData.curriculum === "UGC-NET" && (
                                <div
                                    key="Paper 1"
                                    className="cursor-not-allowed p-4 border rounded-xl bg-[#009688] text-white border-[#009688] opacity-80"
                                >
                                    Paper 1
                                </div>
                            )}
                            {(formData.curriculum === "UGC-NET"
                                ? ugcNetSubjects
                                : csirNetSubjects
                            )
                                .filter(
                                    (s) =>
                                        formData.curriculum !== "UGC-NET" ||
                                        s !== "Paper 1"
                                )
                                .map((subject) => (
                                    <div
                                        key={subject}
                                        onClick={() =>
                                            handleSubjectToggle(subject)
                                        }
                                        className={`cursor-pointer p-4 border rounded-xl transition shadow-sm ${
                                            formData.selectedSubjects.includes(
                                                subject
                                            )
                                                ? "bg-[#009688] text-white border-[#009688]"
                                                : "bg-white dark:bg-[#1A2A3A] text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                                        }`}
                                    >
                                        {subject}
                                    </div>
                                ))}
                        </div>
                        {formData.curriculum === "UGC-NET" &&
                            formData.selectedSubjects.includes("Other") && (
                                <input
                                    type="text"
                                    placeholder="Please specify"
                                    value={formData.otherSubject}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            otherSubject: e.target.value,
                                        })
                                    }
                                    className="w-full max-w-md p-3 mt-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-[#1A2A3A] text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#009688]"
                                />
                            )}
                    </>
                )}

                {/* Step 5: Attempt Selection */}
                {currentStep === 5 && (
                    <>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                            {formData.language === "English"
                                ? "Which attempt is this for you?"
                                : "Yeh aapka konsa attempt hai?"}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
                            {(formData.language === "English"
                                ? attemptsEnglish
                                : attemptsHinglish
                            ).map((attempt) => (
                                <div
                                    key={attempt.value}
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            attempt: attempt.value,
                                        })
                                    }
                                    className={`cursor-pointer p-4 border rounded-xl transition shadow-sm ${
                                        formData.attempt === attempt.value
                                            ? "bg-[#009688] text-white border-[#009688]"
                                            : "bg-white dark:bg-[#1A2A3A] text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
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
                            {formData.language === "English"
                                ? "Choose your Exam cycle (optional)"
                                : "Kaun-si exam cycle aapki target hai? (Skip kar sakte ho)"}
                        </h2>
                        <div className="grid grid-cols-2 gap-3 max-w-md w-full">
                            {(formData.language === "English"
                                ? examCyclesEnglish
                                : examCyclesHinglish
                            ).map((cycle) => (
                                <div
                                    key={cycle}
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            examCycle: cycle,
                                        })
                                    }
                                    className={`cursor-pointer px-4 py-2 border rounded-xl text-left transition ${
                                        formData.examCycle === cycle
                                            ? "bg-[#009688] text-white border-[#009688]"
                                            : "bg-white dark:bg-[#1A2A3A] text-gray-800 dark:text-white border-gray-300 dark:border-gray-700"
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
                            {formData.language === "English"
                                ? "How did you hear about us?"
                                : "OwlAI ke barein mein kahan se pata chala?"}
                        </h2>
                        <div className="grid grid-cols-2 gap-3 max-w-md w-full">
                            {sources.map((source) => (
                                <div
                                    key={source}
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            heardFrom: source,
                                        })
                                    }
                                    className={`cursor-pointer px-4 py-2 border rounded-xl text-left transition ${
                                        formData.heardFrom === source
                                            ? "bg-[#009688] text-white border-[#009688]"
                                            : "bg-white dark:bg-[#1A2A3A] text-gray-800 dark:text-white border-gray-300 dark:border-gray-700"
                                    }`}
                                >
                                    {source}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Navigation Buttons */}
                <div
                    className={`flex ${
                        currentStep === 1 ? "justify-end" : "justify-between"
                    } mt-6 w-full max-w-md`}
                >
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
                                ? "bg-[#009688] text-white hover:bg-[#00796B]"
                                : isStepValid()
                                ? "bg-[#009688] text-white hover:bg-[#00796B]"
                                : "bg-[#009688] text-gray-800 cursor-not-allowed"
                        }`}
                    >
                        {getButtonLabel()}
                    </button>
                </div>
            </div>

            {/* UGC-NET Subject Popup */}
            {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-[#1A2A3A] rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                            Hey Aspirant,
                        </h3>
                        <p className="mb-6 text-gray-700 dark:text-gray-200">
                            {(() => {
                                const otherSubjects = getOtherSubjects();
                                if (otherSubjects.length === 1) {
                                    return (
                                        <>
                                            OwlAI is not yet trained for this
                                            subject you chose:{" "}
                                            <b>{otherSubjects[0]}</b>.<br />
                                            We are actively working to expand
                                            into more exams very soon.
                                            <br />
                                            Stay tuned - your prep buddy is on
                                            the way!
                                        </>
                                    );
                                } else if (otherSubjects.length > 1) {
                                    return (
                                        <>
                                            OwlAI is not yet trained for these
                                            subjects you chose:{" "}
                                            <b>
                                                {formatSubjectList(
                                                    otherSubjects
                                                )}
                                            </b>
                                            .<br />
                                            We are actively working to expand
                                            into more exams very soon.
                                            <br />
                                            Stay tuned - your prep buddy is on
                                            the way!
                                        </>
                                    );
                                } else {
                                    return (
                                        <>
                                            OwlAI is not yet trained for the
                                            selected subject(s).
                                            <br />
                                            We are actively working to expand
                                            into more exams very soon.
                                            <br />
                                            Stay tuned - your prep buddy is on
                                            the way!
                                        </>
                                    );
                                }
                            })()}
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={
                                    popupLoading
                                        ? undefined
                                        : handleContinuePaper1
                                }
                                disabled={
                                    popupLoading === "continue" ||
                                    popupLoading === "logout"
                                }
                                className={`px-6 py-2 rounded-xl font-semibold transition ${
                                    popupLoading === "continue"
                                        ? "bg-[#009688] text-white opacity-60 cursor-not-allowed"
                                        : "bg-[#009688] text-white hover:bg-[#00796B]"
                                }`}
                            >
                                {popupLoading === "continue"
                                    ? "Processing..."
                                    : "Continue for Paper 1"}
                            </button>
                            {/* <button
                                onClick={
                                    popupLoading ? undefined : handleLogout
                                }
                                disabled={
                                    popupLoading === "continue" ||
                                    popupLoading === "logout"
                                }
                                className={`px-6 py-2 rounded-xl font-semibold transition ${
                                    popupLoading === "logout"
                                        ? "bg-gray-200 text-gray-800 opacity-60 cursor-not-allowed"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                }`}
                            >
                                {popupLoading === "logout"
                                    ? "Processing..."
                                    : "Log out"}
                            </button> */}
                        </div>
                    </div>
                </div>
            )}

            {/* CSIR-NET Category Popup */}
            {showCSIRPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-[#1A2A3A] rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                            Hey Aspirant,
                        </h3>
                        <p className="mb-6 text-gray-700 dark:text-gray-200">
                            Our AI is not yet trained for this exam category:{" "}
                            <b>{formData.curriculum}</b>.<br />
                            We are actively working to expand into more exams
                            very soon.
                            <br />
                            Stay tuned - your prep buddy is on the way!
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={
                                    popupLoading
                                        ? undefined
                                        : handleChangeExamToUGCNet
                                }
                                disabled={
                                    popupLoading === "changeExam" ||
                                    popupLoading === "logout"
                                }
                                className={`px-6 py-2 rounded-xl font-semibold transition ${
                                    popupLoading === "changeExam"
                                        ? "bg-[#009688] text-white opacity-60 cursor-not-allowed"
                                        : "bg-[#009688] text-white hover:bg-[#00796B]"
                                }`}
                            >
                                {popupLoading === "changeExam"
                                    ? "Processing..."
                                    : "Change your exam to UGC-NET"}
                            </button>
                            <button
                                onClick={
                                    popupLoading ? undefined : handleLogout
                                }
                                disabled={
                                    popupLoading === "changeExam" ||
                                    popupLoading === "logout"
                                }
                                className={`px-6 py-2 rounded-xl font-semibold transition ${
                                    popupLoading === "logout"
                                        ? "bg-gray-200 text-gray-800 opacity-60 cursor-not-allowed"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                }`}
                            >
                                {popupLoading === "logout"
                                    ? "Processing..."
                                    : "Log out"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}