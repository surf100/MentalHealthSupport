import { useState } from "react";
import { useNavigate } from "react-router";
import { Logo } from "../components/logo";
import signUpImage from "../../assets/b5f233cfc8ac110d15bad0f17fc6d160b955919a.png";
import { signIn } from "../api/auth-api";
import { useAuth } from "../auth/auth-context";

export function SignInPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValid = email.trim() !== "" && password.trim() !== "";

  const handleSignIn = async () => {
    if (!isValid || isLoading) return;

    try {
      setIsLoading(true);
      setError("");

      const response = await signIn({
        email: email.trim(),
        password: password.trim(),
      });

      login(response.token, {
      email: response.email,
      nickname: response.nickname,
      role: response.role,
    });

navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Sign in failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 flex flex-col items-center justify-center px-20 py-12 bg-white">
        <div className="w-full max-w-md">
          <button onClick={() => navigate("/")} className="mb-16 cursor-pointer">
            <Logo />
          </button>

          <h1 className="text-4xl font-bold mb-3">Sign in to SafeSpace</h1>

          <p className="text-gray-600 mb-10">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/sign-up")}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Sign up →
            </button>
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2.5">Email</label>

            <input
              type="email"
              placeholder="name@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2.5">Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            onClick={handleSignIn}
            disabled={!isValid || isLoading}
            className={`w-full py-3 rounded-lg font-medium transition ${
              isValid && !isLoading
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </div>

      <div className="w-1/2 relative overflow-hidden flex items-center justify-center p-12">
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={signUpImage}
            alt="SafeSpace preview"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}