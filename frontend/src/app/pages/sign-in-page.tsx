import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/logo";
import { signIn } from "../api/auth-api";
import { useAuth } from "../auth/auth-context";

export function SignInPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        displayName: response.displayName ?? null,
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
    <div className="min-h-screen bg-[#F9F7F3]">
      {/* Dot grid background — как у Carrot */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.10] [background-image:radial-gradient(#6096BA_1px,transparent_1px)] [background-size:30px_30px]" />

      <div className="relative flex min-h-screen">

        {/* ── LEFT PANEL — branded, не просто фото ── */}
        <div className="hidden lg:flex lg:w-[52%] flex-col justify-between p-14">
          {/* Logo */}
          <button onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#6096BA] text-base font-black text-white">
              S
            </div>
            <span className="font-display text-[20px] font-bold text-[#274C77]">
              SafeSpace
            </span>
          </button>

          {/* Center content */}
          <div>
            <h2 className="font-display text-[52px] font-bold leading-[1.05] tracking-[-0.04em] text-[#274C77]">
              A safer campus starts with one report.
            </h2>
            <p className="mt-5 max-w-md font-sans text-[17px] leading-[1.75] tracking-[-0.01em] text-[#274C77]/60">
              Thousands of students use SafeSpace to speak up, find support, and
              help build healthier campus communities.
            </p>

            {/* Stats row */}
            <div className="mt-10 flex gap-8">
              {[
                { v: "100%", l: "Anonymous" },
                { v: "24/7", l: "Available" },
                { v: "AI", l: "Risk review" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-[32px] font-bold text-[#6096BA]">{s.v}</p>
                  <p className="font-sans text-[13px] text-[#274C77]/50">{s.l}</p>
                </div>
              ))}
            </div>

            {/* Floating trust card */}
            <div className="mt-12 inline-flex items-start gap-4 rounded-lg border border-[#6096BA]/10 bg-white/60 p-5 backdrop-blur-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6096BA] text-sm font-black text-white">
                ✓
              </div>
              <div>
                <p className="font-sans text-[14px] font-semibold text-[#274C77]">
                  Your identity is never stored
                </p>
                <p className="mt-0.5 font-sans text-[13px] text-[#274C77]/50">
                  Reports are fully anonymised before reaching any moderator.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom quote */}
          <p className="font-sans text-[13px] text-[#274C77]/40">
            © {new Date().getFullYear()} SafeSpace. Built for safer student communities.
          </p>
        </div>

        {/* ── RIGHT PANEL — форма ── */}
        <div className="flex w-full flex-col items-center justify-center px-6 py-16 lg:w-[48%] lg:px-0">

          {/* Mobile logo */}
          <button
            onClick={() => navigate("/")}
            className="mb-10 flex items-center gap-3 cursor-pointer lg:hidden"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#6096BA] text-sm font-black text-white">
              S
            </div>
            <span className="font-display text-[18px] font-bold text-[#274C77]">SafeSpace</span>
          </button>

          {/* Form card */}
          <div className="w-full max-w-[420px] rounded-2xl border border-[#6096BA]/10 bg-white p-8 shadow-[0_8px_40px_rgba(36,76,90,0.10)] sm:p-10">

            <div className="mb-8">
              <h1 className="font-display text-[30px] font-bold leading-tight tracking-[-0.03em] text-[#274C77]">
                Welcome back
              </h1>
              <p className="mt-2 font-sans text-[15px] text-[#274C77]/50">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/sign-up")}
                  className="font-semibold text-[#6096BA] transition hover:text-[#274C77]"
                >
                  Sign up →
                </button>
              </p>
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="mb-2 block font-sans text-[13px] font-semibold text-[#274C77]">
                Email
              </label>
              <input
                type="email"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#274C77]/15 bg-[#F6F8F9] px-4 py-3 font-sans text-[15px] text-[#274C77] placeholder-[#274C77]/30 outline-none transition focus:border-[#6096BA]/50 focus:bg-white focus:ring-2 focus:ring-[#6096BA]/15"
              />
            </div>

            {/* Password */}
            <div className="mb-2">
              <div className="mb-2 flex items-center justify-between">
                <label className="font-sans text-[13px] font-semibold text-[#274C77]">
                  Password
                </label>
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="font-sans text-[13px] text-[#274C77]/45 transition hover:text-[#6096BA]"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#274C77]/15 bg-[#F6F8F9] px-4 py-3 pr-11 font-sans text-[15px] text-[#274C77] placeholder-[#274C77]/30 outline-none transition focus:border-[#6096BA]/50 focus:bg-white focus:ring-2 focus:ring-[#6096BA]/15"
                />
                {/* Show/hide password toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#274C77]/35 transition hover:text-[#274C77]/70"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="font-sans text-[13px] text-red-700">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSignIn}
              disabled={!isValid || isLoading}
              className={`mt-6 w-full rounded-lg py-3.5 font-sans text-[15px] font-semibold transition ${
                isValid && !isLoading
                  ? "bg-[#6096BA] text-white hover:bg-[#274C77]"
                  : "cursor-not-allowed bg-[#274C77]/8 text-[#274C77]/30"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>

            {/* Trust note */}
            <p className="mt-6 text-center font-sans text-[12px] text-[#274C77]/35">
              Your data is encrypted and never shared with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}