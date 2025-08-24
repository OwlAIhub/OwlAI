import { useNavigate } from "react-router-dom";

export default function Login() {
  // FIREBASE AUTH TEMPORARILY DISABLED FOR DESIGN WORK
  const navigate = useNavigate();

  // Mock login for design work
  const handleMockLogin = () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        uid: "mock-user-id",
        firstName: "Guest",
        lastName: "User",
        email: "guest@example.com",
        plan: "Free",
      })
    );
    navigate("/chat", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome to OWL AI
          </h2>
          <p className="text-gray-400">Your AI Learning Assistant</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <button
            onClick={handleMockLogin}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105"
          >
            Continue as Guest
          </button>

          <p className="text-center text-gray-400 text-sm mt-4">
            Firebase auth temporarily disabled for design work
          </p>
        </div>
      </div>
    </div>
  );
}
