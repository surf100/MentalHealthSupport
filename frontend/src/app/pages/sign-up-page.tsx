import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/logo";
import { signUp } from "../api/auth-api";
import { useAuth } from "../auth/auth-context";

// Password strength helpers
function getPasswordStrength(password: string): {
  score: number; // 0–4
  label: string;
  color: string;
} {
  if (password.length === 0) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9!@#$%^&*]/.test(password)) score++;

  const levels = [
    { label: "Too short", color: "#ef4444" },
    { label: "Weak", color: "#f97316" },
    { label: "Fair", color: "#eab308" },
    { label: "Good", color: "#84cc16" },
    { label: "Strong", color: "#6096BA" },
  ];
  return { score, ...levels[score] };
}

export function SignUpPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const passwordStrength = getPasswordStrength(password);

  const isValid =
    email.trim().length > 0 &&
    nickname.trim().length >= 3 &&
    password.trim().length >= 6 &&
    agreedToTerms;

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
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "#F9F7F3", fontFamily: "DM Sans, sans-serif" }}
    >
      {/* Dot grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          opacity: 0.10,
          backgroundImage: "radial-gradient(#6096BA 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* ─── Left: Brand panel ─── */}
      <div className="hidden lg:flex w-[52%] flex-col justify-between px-16 py-12 relative z-10">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="self-start cursor-pointer">
          <div className="flex items-center gap-3">
  <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#6096BA] text-base font-black text-white">
    S
  </div>
  <span className="font-display text-[20px] font-bold text-[#274C77]">
    SafeSpace
  </span>
</div>
        </button>

        {/* Main copy */}
        <div className="max-w-[480px]">
          <p
            className="text-[12px] font-bold uppercase tracking-[0.22em] mb-6"
            style={{ color: "#6096BA" }}
          >
            Join SafeSpace
          </p>
          <h1
            className="text-[52px] leading-[1.08] tracking-[-0.04em] mb-6"
            style={{
              fontFamily: "DM Serif Display, serif",
              color: "#274C77",
            }}
          >
            Your voice
            <br />
            deserves to
            <br />
            be heard.
          </h1>
          <p
            className="text-[17px] leading-[1.75] tracking-[-0.01em] mb-12"
            style={{ color: "#274C77", opacity: 0.60 }}
          >
            Join thousands of students using SafeSpace to speak up
            safely, access mental health resources, and build
            healthier campus communities.
          </p>

          {/* Stats row */}
          <div className="flex gap-8 mb-12">
            {[
              { value: "12k+", label: "Students" },
              { value: "100%", label: "Anonymous" },
              { value: "24/7", label: "Available" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p
                  className="text-[28px] font-bold tracking-[-0.03em]"
                  style={{ fontFamily: "DM Serif Display, serif", color: "#6096BA" }}
                >
                  {value}
                </p>
                <p
                  className="text-[13px] tracking-[-0.01em]"
                  style={{ color: "#274C77", opacity: 0.55 }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Trust card */}
          <div
            className="flex items-start gap-4 rounded-xl px-5 py-4"
            style={{
              backgroundColor: "rgba(255,255,255,0.45)",
              border: "1px solid rgba(136,187,214,0.18)",
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: "#6096BA" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2.5 7.5L5.5 10.5L11.5 4"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p
                className="text-[13px] font-semibold mb-0.5"
                style={{ color: "#274C77" }}
              >
                Your identity is never stored
              </p>
              <p
                className="text-[13px] leading-[1.6]"
                style={{ color: "#274C77", opacity: 0.55 }}
              >
                Reports are fully anonymised before reaching any
                moderator. We never link your account to your
                submissions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-[13px]" style={{ color: "#274C77", opacity: 0.40 }}>
          © 2026 SafeSpace. Built for safer student communities.
        </p>
      </div>

      {/* ─── Right: Form card ─── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div
          className="w-full max-w-[440px] rounded-2xl p-8"
          style={{
            backgroundColor: "#FFFFFF",
            boxShadow: "0 8px 40px rgba(36,76,90,0.13)",
            border: "1px solid rgba(136,187,214,0.08)",
          }}
        >
          {/* Mobile logo */}
          <button
            onClick={() => navigate("/")}
            className="lg:hidden mb-8 cursor-pointer"
          >
            <div className="flex items-center gap-3">
  <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#6096BA] text-base font-black text-white">
    S
  </div>
  <span className="font-display text-[20px] font-bold text-[#274C77]">
    SafeSpace
  </span>
</div>
          </button>

          {/* Heading */}
          <h2
            className="text-[28px] leading-[1.15] tracking-[-0.03em] mb-1"
            style={{ fontFamily: "DM Serif Display, serif", color: "#274C77" }}
          >
            Create your account
          </h2>
          <p
            className="text-[14px] leading-[1.6] mb-7"
            style={{ color: "#274C77", opacity: 0.55 }}
          >
            Already have an account?{" "}
            <button
              onClick={() => navigate("/sign-in")}
              className="font-semibold transition-opacity hover:opacity-80"
              style={{ color: "#6096BA" }}
            >
              Sign in →
            </button>
          </p>

          {/* Email */}
          <div className="mb-4">
            <label
              className="block text-[13px] font-semibold mb-2"
              style={{ color: "#274C77" }}
            >
              Email
            </label>
            <div className="relative">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                style={{ color: "#274C77", opacity: 0.35 }}
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
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-[14px] outline-none transition-all"
                style={{
                  backgroundColor: "#F6F8F9",
                  border: "1px solid rgba(36,76,90,0.15)",
                  color: "#274C77",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(136,187,214,0.50)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(136,187,214,0.10)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(36,76,90,0.15)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Nickname */}
          <div className="mb-4">
            <label
              className="block text-[13px] font-semibold mb-2"
              style={{ color: "#274C77" }}
            >
              Nickname
            </label>
            <div className="relative">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                style={{ color: "#274C77", opacity: 0.35 }}
              >
                <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                placeholder="your_nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-[14px] outline-none transition-all"
                style={{
                  backgroundColor: "#F6F8F9",
                  border: "1px solid rgba(36,76,90,0.15)",
                  color: "#274C77",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(136,187,214,0.50)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(136,187,214,0.10)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(36,76,90,0.15)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
            {nickname.length > 0 && nickname.trim().length < 3 && (
              <p
                className="text-[12px] mt-1.5"
                style={{ color: "#f97316" }}
              >
                Minimum 3 characters required
              </p>
            )}
            {nickname.trim().length >= 3 && (
              <p className="text-[12px] mt-1.5" style={{ color: "#6096BA" }}>
                ✓ Looks good
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-2">
            <label
              className="block text-[13px] font-semibold mb-2"
              style={{ color: "#274C77" }}
            >
              Password
            </label>
            <div className="relative">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                style={{ color: "#274C77", opacity: 0.35 }}
              >
                <rect
                  x="4"
                  y="9"
                  width="12"
                  height="8"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M7 9V6.5a3 3 0 016 0V9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg text-[14px] outline-none transition-all"
                style={{
                  backgroundColor: "#F6F8F9",
                  border: "1px solid rgba(36,76,90,0.15)",
                  color: "#274C77",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(136,187,214,0.50)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(136,187,214,0.10)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(36,76,90,0.15)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                style={{ color: "#274C77", opacity: 0.40 }}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M3 3l14 14M8.46 8.54A3 3 0 0011.5 13M6.12 6.17C4.4 7.17 3 8.9 3 10c0 2 3.13 5 7 5a8.3 8.3 0 003.88-.96M10.27 5.04C10.18 5.02 10.09 5 10 5c-3.87 0-7 3-7 5 0 .41.1.83.28 1.24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M13 10c0 .35-.06.68-.17 1M17 10c0-2-3.13-5-7-5-.4 0-.8.04-1.18.11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M3 10c0-2 3.13-5 7-5s7 3 7 5-3.13 5-7 5-7-3-7-5z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Password strength bar */}
          {password.length > 0 && (
            <div className="mb-4">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor:
                        i <= passwordStrength.score
                          ? passwordStrength.color
                          : "rgba(36,76,90,0.10)",
                    }}
                  />
                ))}
              </div>
              <p
                className="text-[12px] transition-colors"
                style={{ color: passwordStrength.color }}
              >
                {passwordStrength.label}
              </p>
            </div>
          )}

          {/* Terms checkbox */}
          <div className="mb-5 mt-1">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className="w-4 h-4 rounded flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: agreedToTerms ? "#6096BA" : "transparent",
                    border: agreedToTerms
                      ? "1.5px solid #6096BA"
                      : "1.5px solid rgba(36,76,90,0.30)",
                  }}
                >
                  {agreedToTerms && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M1.5 5.5L4 8L8.5 2.5"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span
                className="text-[13px] leading-[1.55]"
                style={{ color: "#274C77", opacity: 0.65 }}
              >
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => navigate("/terms")}
                  className="font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
                  style={{ color: "#274C77", opacity: 1 }}
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={() => navigate("/privacy")}
                  className="font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
                  style={{ color: "#274C77", opacity: 1 }}
                >
                  Privacy Policy
                </button>
              </span>
            </label>
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-4 px-4 py-3 rounded-lg text-[13px] leading-[1.5]"
              style={{
                backgroundColor: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.20)",
                color: "#dc2626",
              }}
            >
              {error}
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleContinue}
            disabled={!isValid || isLoading}
            className="w-full py-2.5 rounded-sm text-[14px] font-semibold transition-all mb-4"
            style={{
              backgroundColor:
                isValid && !isLoading ? "#6096BA" : "rgba(36,76,90,0.10)",
              color:
                isValid && !isLoading ? "#ffffff" : "rgba(36,76,90,0.35)",
              cursor: isValid && !isLoading ? "pointer" : "not-allowed",
            }}
            onMouseEnter={(e) => {
              if (isValid && !isLoading)
                e.currentTarget.style.backgroundColor = "#274C77";
            }}
            onMouseLeave={(e) => {
              if (isValid && !isLoading)
                e.currentTarget.style.backgroundColor = "#6096BA";
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="31.4"
                    strokeDashoffset="10"
                  />
                </svg>
                Creating account…
              </span>
            ) : (
              "Create account"
            )}
          </button>

          {/* Divider */}
          <div className="relative mb-4">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div
                className="w-full"
                style={{ borderTop: "1px solid rgba(36,76,90,0.10)" }}
              />
            </div>
            <div className="relative flex justify-center">
              <span
                className="bg-white px-3 text-[12px] font-semibold uppercase tracking-[0.12em]"
                style={{ color: "rgba(36,76,90,0.35)" }}
              >
                or
              </span>
            </div>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleContinue}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-sm text-[14px] font-semibold transition-all"
            style={{
              border: "1px solid rgba(36,76,90,0.18)",
              color: "#274C77",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.50)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <svg width="17" height="17" viewBox="0 0 20 20">
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
            Continue with Google
          </button>

          {/* Trust note */}
          <p
            className="text-center text-[12px] mt-5 leading-[1.5]"
            style={{ color: "rgba(36,76,90,0.40)" }}
          >
            🔒 Your data is encrypted and never shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}