import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/logo";
import signUpImage from "../../assets/auth.jpg";
import { signUp } from "../api/auth-api";
import { useAuth } from "../auth/auth-context";

export function SignUpPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValid =
    email.trim().length > 0 &&
    nickname.trim().length >= 3 &&
    password.trim().length >= 6;

  const handleContinue = async () => {
    if (!isValid || isLoading) return;

    try {
      setIsLoading(true);
      setError("");

      const response = await signUp({
        email: email.trim(),
        nickname: nickname.trim(),
        password: password.trim(),
      });

      login(response.token, {
        email: response.email,
        nickname: response.nickname,
        displayName: response.displayName ?? null,
        role: response.role,
      });
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Sign up failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleContinue = () => {
    setError("Google sign-in is not connected yet");
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 flex flex-col items-center justify-center px-20 py-12 bg-white">
        <div className="w-full max-w-md">
          <button onClick={() => navigate("/")} className="mb-16 cursor-pointer">
            <Logo />
          </button>

          <h1 className="text-4xl font-bold mb-3">Get Started with SafeSpace</h1>
          <p className="text-gray-600 mb-10">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/sign-in")}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Sign in →
            </button>
          </p>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-2.5 text-gray-900">
              Enter your email
            </label>
            <div className="relative">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M3 6L10 11L17 6M3 6V14C3 14.5523 3.44772 15 4 15H16C16.5523 15 17 14.5523 17 14V6M3 6C3 5.44772 3.44772 5 4 5H16C16.5523 5 17 5.44772 17 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>

              <input
                type="email"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-2.5 text-gray-900">
              Choose a nickname
            </label>
            <input
              type="text"
              placeholder="your nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-2.5 text-gray-900">
              Create a password
            </label>
            <input
              type="password"
              placeholder="minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            onClick={handleContinue}
            disabled={!isValid || isLoading}
            className={`w-full py-3 rounded-lg mb-8 font-medium transition-colors ${
              isValid && !isLoading
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Creating account..." : "Continue"}
          </button>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500 font-medium">OR</span>
            </div>
          </div>

          <button
            onClick={handleGoogleContinue}
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path
                d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"
                fill="#4285F4"
              />
              <path
                d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"
                fill="#34A853"
              />
              <path
                d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"
                fill="#FBBC05"
              />
              <path
                d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-gray-700">Continue with Google</span>
          </button>

          <p className="text-sm text-gray-500 mt-10 leading-relaxed">
            By signing up, you agree to the{" "}
            <button
              onClick={() => navigate("/terms")}
              className="text-gray-900 underline hover:text-gray-700"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              onClick={() => navigate("/privacy")}
              className="text-gray-900 underline hover:text-gray-700"
            >
              Privacy Policy
            </button>
            .
          </p>

          <p className="text-sm text-gray-600 mt-10">
            Need help?{" "}
            <button
              onClick={() => navigate("/contact")}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Contact support
            </button>
          </p>
        </div>
      </div>

      <div className="w-1/2 relative overflow-hidden flex items-center justify-center p-12">
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={signUpImage}
            alt="SafeSpace platform preview"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
