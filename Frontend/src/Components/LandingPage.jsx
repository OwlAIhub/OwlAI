import { FaBookOpen, FaQuoteLeft, FaStar } from "react-icons/fa";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { Link } from "react-router-dom";

import { CheckCircle, BrainCog, Languages } from "lucide-react";

import ugcNetLogo from "../assets/ugc-net.png";
import sscLogo from "../assets/ssc.png";
import csirLogo from "../assets/csir.png";
import ctetLogo from "../assets/ctet.png";
import Logo from "../assets/owl_AI_logo.png";
import owlMascot from "../assets/owlMascot.png";
import AboutImage from "../assets/about_section.png";

import FeatureImage1 from "../assets/image1.avif";
import FeatureImage2 from "../assets/image2.avif";
import FeatureImage3 from "../assets/image3.avif";
import FeatureImage4 from "../assets/image4.avif";
import { useState } from "react";

const prompts = [
    {
        label: "Paper 1 ka syllabus itna zyada hai... Kahaan se shuru karun?",
        query: "Paper 1 ka syllabus itna zyada hai... Kahaan se shuru karun?",
    },
    {
        label: "What is Teaching Aptitude?",
        query: "What is Teaching Aptitude?",
    },
    {
        label: "Enthnocentrism vs cultural relativism samjhao mujhe?",
        query: "Enthnocentrism vs cultural relativism samjhao mujhe?",
    },
];
const features = [
    {
        icon: <CheckCircle className="w-6 h-6 text-black" />,
        title: "Thousands of solutions",
    },
    {
        icon: <BrainCog className="w-6 h-6 text-black" />,
        title: "AI-Powered Doubt Resolution",
    },
    {
        icon: <Languages className="w-6 h-6 text-black" />,
        title: "Language Flexibility",
    },
];
const LandingPage = () => {
    const [inputValue, setInputValue] = useState("");
    const currentYear = new Date().getFullYear();
    
    const handlePromptClick = (query) => {
        setInputValue(query);
    };

    const handleAskClick = () => {
        if (inputValue.trim()) {
            localStorage.setItem('presetQuery', inputValue);
            window.location.href = '/chat';
        }
    };

    return (
        <div className="font-sans bg-white">
            {/* Navigation */}
            <nav className="bg-white shadow-sm py-4 sticky top-0 z-50">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                            {/* <FaKiwiBird className="text-white text-lg" /> */}
                            <img src={Logo} alt="logo" />
                        </div>
                        <span className="text-xl font-bold text-teal-800">
                            Owl AI
                        </span>
                    </div>

                    <div className="hidden md:flex space-x-8">
                        <a
                            href="#"
                            className="text-gray-700 hover:text-teal-600 font-medium"
                        >
                            Home
                        </a>
                        <a
                            href="#owl_AI"
                            className="text-gray-700 hover:text-teal-600 font-medium"
                        >
                            Owl AI
                        </a>
                        <a
                            href="#exams"
                            className="text-gray-700 hover:text-teal-600 font-medium"
                        >
                            Exams
                        </a>
                        <a
                            href="#about"
                            className="text-gray-700 hover:text-teal-600 font-medium"
                        >
                            About Us
                        </a>
                    </div>

                    <Link to="/chat">
                        <button className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white px-6 py-2 rounded-full font-medium transition-colors">
                            Get Started
                        </button>
                    </Link>
                </div>
            </nav>
            {/* Hero Section */}
            <section className="bg-white py-12 px-4 text-center relative">
                <div className="container mx-auto flex flex-col items-center justify-center max-w-4xl">
                    {/* Mascot & Heading */}
                    <div className="flex flex-col items-center justify-center gap-4 mb-6">
                        <img
                            src={owlMascot}
                            alt="Owl AI Mascot"
                            className="w-40 h-40  mb-10"
                        />
                        <h1 className="text-2xl md:text-5xl font-bold text-gray-900">
                            Exam Prep
                            <span className="relative inline-block ml-3">
                                <span className="absolute inset-0 bg-yellow-400 shadow-md transform -skew-x-24 scale-x-100 scale-y-140 origin-left"></span>
                                <span className="relative z-10 px-4 py-1">
                                    Made Easy!
                                </span>
                            </span>
                        </h1>
                    </div>

                    {/* Subtext */}
                    <p className="text-lg text-gray-600 mb-10">
                        Owl AI, your own Govt Exam AI buddy 🦉 — available 24/7
                        for doubts, concepts, and more.
                    </p>

                    {/* Search Bar */}
                    <div className="relative w-full max-w-2xl mb-6">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Aaj konsa topic cover karna chahte ho? 🤔"
                    className="w-full py-4 px-6 pr-16 rounded-full border border-gray-300 text-gray-800 shadow-sm placeholder-gray-500 placeholder:text-xs md:placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleAskClick();
                        }
                    }}
                />
                <button 
                    onClick={handleAskClick}
                    className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 bg-[#FFC107] text-black px-6 py-1 rounded-full font-semibold"
                >
                    Ask
                </button>
                    </div>

                    {/* Prompt Buttons */}
                    <div className="flex flex-wrap justify-center gap-3 cursor-pointer">
                {prompts.map((prompt, i) => (
                    <button
                        key={i}
                        onClick={() => handlePromptClick(prompt.query)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full border border-gray-300 text-sm font-medium transition"
                    >
                        {prompt.label}
                    </button>
                ))}
            </div>
                </div>
            </section>

            {/* About Section */}
            <section id="owl_AI" className="bg-white relative">
                {/* Blue Bar with Text */}
                <div className="relative ">
                    {/* Main content block */}
                    <div className="relative bg-teal-600 z-10 py-10 px-4 text-center mx-1">
                        <h2 className="text-4xl font-bold text-white  mb-4 tracking-wide">
                            ABOUT OWL AI
                        </h2>
                        <p className="max-w-2xl md:max-w-4xl mx-auto text-white text-[15px] md:text-base font-medium leading-relaxed">
                            Har Govt exam aspirant ki khwahish—koi ho jo doubts
                            clear kare, upcoming vacancies bataye, aur interview
                            ki tayyari karvaye. Isliye aaya{" "}
                            <span className="font-semibold">OwlAI</span>—Your
                            24/7 Govt Exam Study Buddy. Instant doubt solving,
                            real-time job alerts, topper-guided interview
                            practice, aur peer study strategies ke saath, OwlAI
                            hai aapka reliable exam partner.
                        </p>
                    </div>
                    <div className="relative bg-teal-600 mx-8 h-6 z-20"></div>
                </div>

                {/* Main Content Grid */}
                <div className="container mx-auto px-6 py-6 grid md:grid-cols-2 gap-12 items-center">
                    {/* Left - Illustration */}
                    <div>
                        <img
                            src={AboutImage}
                            alt="Owl AI Chat Doodle"
                            className="w-full py-6 mx-4"
                        />
                    </div>

                    {/* Right - Text Content */}
                    <div>
                        <h2 className="text-3xl text-center justify-center font-bold text-gray-900 mb-12">
                            Built by Govt Exam Toppers, for Future Toppers
                        </h2>
                        <p className="text-base  md:text-lg text-gray-700 mb-8">
                            At Owl AI, we understand your challenges—because
                            we’ve been there ourselves. Designed by students
                            who’ve already cleared Govt exams, OwlAI blends
                            real-world exam experience with powerful AI
                            technology to simplify your preparation. From
                            instant doubt resolution to personalized study
                            plans, we empower you to achieve what we have— and
                            even more.
                        </p>

                        {/* Feature Icons */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3 bg-gray-200 rounded-2xl px-6 py-4"
                                >
                                    {feature.icon}
                                    <span className="text-sm font-medium text-gray-800">
                                        {feature.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Yellow Band */}
                <div className="bg-[#FFC107] h-4  rounded-full m-10" />
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            What You Can Do With Owl AI
                        </h2>
                        <p className="text-lg text-gray-600">
                            OwlAI brings together expert insights and advanced
                            AI to simplify your Govt exam prep journey. Here's
                            how we support your success.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4 max-w-screen mx-auto">
                        {[
                            {
                                icon: (
                                    <FaBookOpen className="text-teal-600 text-2xl" />
                                ),
                                image: FeatureImage1,
                                title: "AI-Powered Study Plans",
                                desc: "Personalized and dynamic study plans tailored by AI—perfectly matching your learning style and progress.",
                            },
                            {
                                icon: (
                                    <IoMdCheckmarkCircle className="text-teal-600 text-2xl" />
                                ),
                                image: FeatureImage2,
                                title: "Multi-language Support",
                                desc: "Clear your doubts and study seamlessly in English, Hindi, or Hinglish—choose your comfort!",
                            },
                            {
                                icon: (
                                    <FaBookOpen className="text-teal-600 text-2xl" />
                                ),
                                image: FeatureImage3,
                                title: "Interactive MCQs & PYQs",
                                desc: "Practice with 1000+ carefully selected MCQs and previous year questions, ensuring complete concept clarity.",
                            },
                            {
                                icon: (
                                    <IoMdCheckmarkCircle className="text-teal-600 text-2xl" />
                                ),
                                image: FeatureImage4,
                                title: "Upcoming Features",
                                desc: "Get instant alerts on newly announced Govt vacancies and learn from fellow aspirants' preparation strategies.",
                            },
                        ].map((feature, idx) => (
                            <div
                                key={idx}
                                className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col items-center mb-4">
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="w-full min-h-full object-cover rounded-lg mb-4"
                                    />
                                    <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-center">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-16 bg-teal-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-12">
                        What Our Users Say
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                text: "Late-night study mein doubts clear karne wala koi mentor hota tha. Owl AI ab mera permanent 24/7 mentor ban gaya hai, instant solutions ke saath. Sabse helpful cheez hai iska Hinglish model.",
                                name: "Anjali Sharma",
                                role: "UGC-NET Aspirant",
                            },
                            {
                                text: "Pehle poora syllabus cover karna bahut overwhelming lagta tha. Owl AI meri study pattern ko samajhkar personalized study plan banaya hai, jisse meri preparation bilkul structured aur stress-free ho gayi hai.",
                                name: "Rahul Verma",
                                role: "SSC CGL Aspirant",
                            },
                            {
                                text: "Mera interview round weakest tha, par Owl AI ke saath interview practice kar ke confidence bahut boost hua hai. Qualified mentors ki tips aur PYQ quizzes se ab main pehle se zyada confident hoon.",
                                name: "Pooja Singh",
                                role: "CSIR-NET Aspirant",
                            },
                        ].map((review, idx) => (
                            <div
                                key={idx}
                                className="bg-teal-700 p-8 rounded-xl text-left"
                            >
                                <div className="flex mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className="text-yellow-400"
                                        />
                                    ))}
                                </div>
                                <FaQuoteLeft className="text-teal-300 text-2xl mb-4" />
                                <p className="italic mb-6">{`"${review.text}"`}</p>
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-teal-800 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-white"
                                        >
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle
                                                cx="12"
                                                cy="7"
                                                r="4"
                                            ></circle>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold">
                                            {review.name}
                                        </p>
                                        <p className="text-sm text-teal-200">
                                            {review.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="exams" className="py-16 bg-white text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Your Govt Exam Buddy Is Finally Here
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                        Join thousands of aspirants who are transforming their
                        exam preparation with Owl AI.
                    </p>
                    <Link to="/login">
                        <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full font-semibold text-lg">
                            Start Studying - It's Free
                        </button>
                    </Link>
                </div>
            </section>

            {/* Trusted Exams Section */}
            <section className="py-16 bg-yellow-50">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-10">
                        Trusted Among Govt Exam Aspirants
                    </h2>
                    <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8 items-center justify-center">
                        {/* UGC NET */}
                        <div className="flex flex-col items-center">
                            <img
                                src={ugcNetLogo}
                                alt="UGC NET"
                                className="h-32 mb-4"
                            />
                            <p className="text-lg font-semibold text-gray-800">
                                UGC NET Exam
                            </p>
                            <p className="text-sm text-teal-600 font-bold">
                                Owl AI ACTIVE
                            </p>
                        </div>
                        {/* SSC */}
                        <div className="flex flex-col items-center">
                            <img
                                src={sscLogo}
                                alt="SSC"
                                className="h-32 mb-4"
                            />
                            <p className="text-lg font-semibold text-gray-800">
                                SSC Exam
                            </p>
                            <p className="text-sm text-orange-500">Upcoming</p>
                        </div>
                        {/* CSIR */}
                        <div className="flex flex-col items-center">
                            <img
                                src={csirLogo}
                                alt="CSIR"
                                className="h-32 mb-4"
                            />
                            <p className="text-lg font-semibold text-gray-800">
                                CSIR Exam
                            </p>
                            <p className="text-sm text-orange-500">Upcoming</p>
                        </div>
                        {/* CTET */}
                        <div className="flex flex-col items-center">
                            <img
                                src={ctetLogo}
                                alt="CTET"
                                className="h-32 mb-4"
                            />
                            <p className="text-lg font-semibold text-gray-800">
                                CTET Exam
                            </p>
                            <p className="text-sm text-orange-500">Upcoming</p>
                            <span className="text-xs text-red-500 mt-1">
                                + 50 more exams coming soon
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="about" className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-5 sm:grid-cols-2 gap-8">
                        {/* Brand */}
                        <div className="col-span-1">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                                    {/* <FaKiwiBird className="text-white text-lg" /> */}
                                    <img src={Logo} alt="logo" />
                                </div>
                                <span className="text-xl font-bold">
                                    Owl AI
                                </span>
                            </div>
                            <p className="text-sm text-gray-400">
                                Your 24/7 Govt Exam Study Partner powered by AI.
                            </p>
                            <div className="flex items-center mt-4 space-x-4">
                                <a
                                    href="mailto:Hello@owlai.bot"
                                    className="text-teal-400 hover:text-teal-300 text-sm"
                                >
                                    Hello@owlai.bot
                                </a>
                            </div>
                        </div>

                        {/* Compare */}
                        <div>
                            <h3 className="text-lg font-bold mb-4">Compare</h3>
                            <ul className="space-y-2 text-sm">
                                <li className="text-gray-400 hover:text-white cursor-pointer">
                                    Owl AI vs Chat GPT
                                </li>
                                <li className="text-gray-400 hover:text-white cursor-pointer">
                                    Owl AI vs Google
                                </li>
                                <li className="text-gray-400 hover:text-white cursor-pointer">
                                    Owl AI vs Bard
                                </li>
                            </ul>
                        </div>

                        {/* Navigate */}
                        <div>
                            <h3 className="text-lg font-bold mb-4">Navigate</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white"
                                    >
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#owl_AI"
                                        className="text-gray-400 hover:text-white"
                                    >
                                        Owl AI
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#exams"
                                        className="text-gray-400 hover:text-white"
                                    >
                                        Exams
                                    </a>
                                </li>
                                <li>
                                    <Link to="/login">
                                        <span className="text-gray-400 hover:text-white cursor-pointer">
                                            Get Started
                                        </span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className="text-lg font-bold mb-4">Legal</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white"
                                    >
                                        Terms & Conditions
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white"
                                    >
                                        Privacy Policy
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* General */}
                        <div>
                            <h3 className="text-lg font-bold mb-4">General</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a
                                        href="mailto:Hello@owlai.bot"
                                        className="text-gray-400 hover:text-white"
                                    >
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="mailto:Hello@owlai.bot"
                                        className="text-gray-400 hover:text-white"
                                    >
                                        Request a Feature
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-400">
                        <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                            <div>
                                © {currentYear} Owl AI. All rights reserved.
                            </div>
                            <div>
                                <span className="hidden md:inline">|</span>{" "}
                                Designed & Managed by{" "}
                                <a
                                    href="https://www.webcrafticx.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-teal-400 hover:text-teal-300 hover:underline"
                                >
                                    WebCrafticX
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
