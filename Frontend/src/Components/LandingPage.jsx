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
    {
        label: "Different types of Pollutants?",
        query: "Different types of Pollutants?",
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
    const [showError, setShowError] = useState(false);

    const handlePromptClick = (query) => {
        setInputValue(query);
        setShowError(false);
    };

    const handleAskClick = () => {
        if (!inputValue.trim()) {
            setShowError(true);
            return;
        }
        if (inputValue.trim()) {
            localStorage.setItem("presetQuery", inputValue);
            window.location.href = "/chat";
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
                            href="#features"
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
                            href="#owl_AI"
                            className="text-gray-700 hover:text-teal-600 font-medium"
                        >
                            About Us
                        </a>
                        <a
                            href="#contact"
                            className="text-gray-700 hover:text-teal-600 font-medium"
                        >
                            Contact Us
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
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setShowError(false);
                            }}
                            placeholder="Aaj konsa topic cover karna chahte ho? 🤔"
                            className="w-full py-4 px-6 pr-16 rounded-full border border-gray-300 text-gray-800 shadow-sm placeholder-gray-500 placeholder:text-xs md:placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
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
                    {showError && (
                        <div className="text-red-500 text-sm mb-4 animate-fade-in">
                            Please ask something to continue !!
                        </div>
                    )}

                    {/* Prompt Buttons */}
                    <div className="flex flex-wrap justify-center gap-3 cursor-pointer">
                        {prompts.map((prompt, i) => (
                            <button
                                key={i}
                                onClick={() => handlePromptClick(prompt.query)}
                                className="bg-gray-100 hover:bg-gray-200 cursor-pointer text-gray-800 px-4 py-2 rounded-full border border-gray-300 text-sm font-medium transition"
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
            {/* Contact Us Section - Add this before the Footer section */}
            <section id="contact" className="py-12 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Have Questions? Get in Touch!
                        </h2>
                        <p className="text-lg text-gray-600">
                            Our team is here to help you with any questions
                            about Owl AI and your exam preparation journey.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 md:mx-10 gap-12 items-start">
                        {/* Left - Contact Form */}
                        <div className="bg-gray-50 p-8 rounded-xl shadow-sm ">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Send us a message
                            </h3>
                            <form className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="exam"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Which exam are you preparing for?
                                    </label>
                                    <select
                                        id="exam"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    >
                                        <option value="">Select an exam</option>
                                        <option value="ugc-net">UGC NET</option>
                                        <option value="ssc">SSC</option>
                                        <option value="csir">CSIR</option>
                                        <option value="ctet">CTET</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Your Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows="4"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                        placeholder="How can we help you?"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Right - Contact Information */}
                        <div className="space-y-12 p-2 ">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    Contact Information
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Reach out to us through any of these
                                    channels. We typically respond within 24
                                    hours.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-teal-100 p-3 rounded-full">
                                            <svg
                                                className="w-5 h-5 text-teal-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                ></path>
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-sm font-medium text-gray-900">
                                                Email
                                            </h4>
                                            <a
                                                href="mailto:hello@owlai.bot"
                                                className="text-teal-600 hover:text-teal-700 text-sm"
                                            >
                                                hello@owlai.bot
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-teal-100 p-3 rounded-full">
                                            <svg
                                                className="w-5 h-5 text-teal-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                ></path>
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-sm font-medium text-gray-900">
                                                Phone
                                            </h4>
                                            <a
                                                href="tel:+911234567890"
                                                className="text-teal-600 hover:text-teal-700 text-sm"
                                            >
                                                +91 12345 67890
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-teal-100 p-3 rounded-full">
                                            <svg
                                                className="w-5 h-5 text-teal-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                ></path>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                ></path>
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-sm font-medium text-gray-900">
                                                Office
                                            </h4>
                                            <p className="text-gray-600 text-sm">
                                                123 AI Street, Tech Park
                                                <br />
                                                New Delhi 201XXX
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    Follow Us
                                </h3>
                                <div className="flex space-x-4">
                                    <a
                                        href="#"
                                        className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-700"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                                        </svg>
                                    </a>
                                    <a
                                        href="#"
                                        className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-700"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                                        </svg>
                                    </a>
                                    <a
                                        href="#"
                                        className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-700"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
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
