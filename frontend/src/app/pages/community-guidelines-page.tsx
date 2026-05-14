import { Footer } from "../components/footer";
import { Header } from "../components/header";
import {
  AlertTriangle,
  HeartHandshake,
  MessageSquareHeart,
  Shield,
  UserCheck,
} from "lucide-react";

const allowedBehaviors = [
  "Speak respectfully and supportively to others.",
  "Share experiences honestly without attacking other people.",
  "Encourage users to seek help from trusted adults, mentors, or professionals when needed.",
  "Report harmful or unsafe content through the platform tools.",
];

const prohibitedBehaviors = [
  "Bullying, harassment, threats, or intimidation.",
  "Hate speech, discrimination, or personal attacks.",
  "Sharing private personal information about yourself or others.",
  "Posting harmful, misleading, or intentionally triggering content.",
];

const moderationPrinciples = [
  "Posts and comments may be reviewed if they are reported by users or detected as unsafe.",
  "Content that violates platform rules may be hidden or removed.",
  "Repeated violations may lead to account restrictions or bans.",
  "Urgent safety-related situations may be escalated for faster review.",
];

export function CommunityGuidelinesPage() {
  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: "#F9F7F3", color: "#274C77" }}
    >
      <Header />

      {/* ── Hero strip ─────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden border-b"
        style={{ backgroundColor: "#A3CEF1", borderColor: "rgba(36,76,90,0.12)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage: "radial-gradient(#274C77 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-12">
          <p
            className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] mb-3"
            style={{ color: "rgba(36,76,90,0.60)" }}
          >
            SafeSpace · Community
          </p>
          <h1
            className="font-display text-[40px] sm:text-[52px] leading-[1.05] tracking-[-0.04em]"
            style={{ color: "#274C77" }}
          >
            Community Guidelines
          </h1>
          <p
            className="mt-3 font-sans text-[16px] leading-[1.75] tracking-[-0.01em] max-w-2xl"
            style={{ color: "rgba(36,76,90,0.65)" }}
          >
            SafeSpace is built to be a respectful, supportive, and protected environment. These guidelines explain how community members should interact and what content is not allowed.
          </p>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-10">
          <div className="grid grid-cols-12 gap-8 items-start">

            {/* ── Sidebar ──────────────────────────────────────────────────── */}
            <aside className="col-span-12 lg:col-span-4 space-y-4">

              {/* Our goal */}
              <div
                className="rounded-2xl p-6 border"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "rgba(136,187,214,0.18)",
                  boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="rounded-xl p-2.5"
                    style={{ backgroundColor: "rgba(153,211,223,0.35)" }}
                  >
                    <HeartHandshake className="w-4 h-4" style={{ color: "#274C77" }} />
                  </div>
                  <p
                    className="font-sans text-[11px] font-bold uppercase tracking-[0.20em]"
                    style={{ color: "#6096BA" }}
                  >
                    Our goal
                  </p>
                </div>
                <p
                  className="font-sans text-[14px] leading-[1.75] tracking-[-0.01em]"
                  style={{ color: "rgba(36,76,90,0.70)" }}
                >
                  We want every user to feel heard, respected, and safe while using the platform for support, reporting, and learning.
                </p>
              </div>

              {/* Safety first */}
              <div
                className="rounded-2xl p-6 border"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "rgba(136,187,214,0.18)",
                  boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="rounded-xl p-2.5"
                    style={{ backgroundColor: "rgba(136,187,214,0.20)" }}
                  >
                    <Shield className="w-4 h-4" style={{ color: "#274C77" }} />
                  </div>
                  <p
                    className="font-sans text-[11px] font-bold uppercase tracking-[0.20em]"
                    style={{ color: "#6096BA" }}
                  >
                    Safety first
                  </p>
                </div>
                <p
                  className="font-sans text-[14px] leading-[1.75] tracking-[-0.01em]"
                  style={{ color: "rgba(36,76,90,0.70)" }}
                >
                  If a situation appears urgent, threatening, or harmful, users should move to safety and use crisis support or the anonymous report system immediately.
                </p>
              </div>

              {/* Quick nav */}
              <div
                className="rounded-2xl p-6 border"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "rgba(136,187,214,0.18)",
                  boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                }}
              >
                <p
                  className="font-sans text-[11px] font-bold uppercase tracking-[0.20em] mb-4"
                  style={{ color: "#6096BA" }}
                >
                  On this page
                </p>
                <div className="space-y-1">
                  {[
                    "1. Respectful communication",
                    "2. What is encouraged",
                    "3. What is not allowed",
                    "4. Moderation & enforcement",
                    "5. Privacy reminder",
                  ].map((item) => (
                    <p
                      key={item}
                      className="font-sans text-[13px] leading-[1.75] tracking-[-0.01em] py-1"
                      style={{ color: "rgba(36,76,90,0.60)" }}
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </aside>

            {/* ── Content ──────────────────────────────────────────────────── */}
            <section className="col-span-12 lg:col-span-8 space-y-5">

              {/* 1. Respectful communication */}
              <div
                className="rounded-2xl p-8 border"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "rgba(136,187,214,0.18)",
                  boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="rounded-xl p-2.5"
                    style={{ backgroundColor: "rgba(153,211,223,0.30)" }}
                  >
                    <MessageSquareHeart className="w-4 h-4" style={{ color: "#274C77" }} />
                  </div>
                  <p
                    className="font-sans text-[11px] font-bold uppercase tracking-[0.20em]"
                    style={{ color: "#6096BA" }}
                  >
                    Section 01
                  </p>
                </div>
                <h2
                  className="font-display text-[28px] sm:text-[32px] leading-[1.1] tracking-[-0.03em] mb-4"
                  style={{ color: "#274C77" }}
                >
                  Respectful communication
                </h2>
                <p
                  className="font-sans text-[15px] leading-[1.8] tracking-[-0.01em]"
                  style={{ color: "rgba(36,76,90,0.68)" }}
                >
                  Community members should communicate with empathy and care. The platform exists to support people facing bullying, stress, or emotional difficulty, so language should always remain respectful and constructive.
                </p>
              </div>

              {/* 2. What is encouraged */}
              <div
                className="rounded-2xl p-8 border"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "rgba(136,187,214,0.18)",
                  boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="rounded-xl p-2.5"
                    style={{ backgroundColor: "rgba(136,187,214,0.22)" }}
                  >
                    <UserCheck className="w-4 h-4" style={{ color: "#274C77" }} />
                  </div>
                  <p
                    className="font-sans text-[11px] font-bold uppercase tracking-[0.20em]"
                    style={{ color: "#6096BA" }}
                  >
                    Section 02
                  </p>
                </div>
                <h2
                  className="font-display text-[28px] sm:text-[32px] leading-[1.1] tracking-[-0.03em] mb-6"
                  style={{ color: "#274C77" }}
                >
                  What is encouraged
                </h2>
                <div className="space-y-3">
                  {allowedBehaviors.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 rounded-xl p-4 border"
                      style={{
                        backgroundColor: "rgba(153,211,223,0.10)",
                        borderColor: "rgba(153,211,223,0.30)",
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-sans text-[11px] font-bold"
                        style={{
                          backgroundColor: "rgba(136,187,214,0.25)",
                          color: "#274C77",
                        }}
                      >
                        {index + 1}
                      </div>
                      <p
                        className="font-sans text-[14px] leading-[1.75] tracking-[-0.01em] pt-0.5"
                        style={{ color: "rgba(36,76,90,0.70)" }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. What is not allowed */}
              <div
                className="rounded-2xl p-8 border"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "rgba(136,187,214,0.18)",
                  boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="rounded-xl p-2.5"
                    style={{ backgroundColor: "rgba(36,76,90,0.08)" }}
                  >
                    <AlertTriangle className="w-4 h-4" style={{ color: "#274C77" }} />
                  </div>
                  <p
                    className="font-sans text-[11px] font-bold uppercase tracking-[0.20em]"
                    style={{ color: "#6096BA" }}
                  >
                    Section 03
                  </p>
                </div>
                <h2
                  className="font-display text-[28px] sm:text-[32px] leading-[1.1] tracking-[-0.03em] mb-6"
                  style={{ color: "#274C77" }}
                >
                  What is not allowed
                </h2>
                <div className="space-y-3">
                  {prohibitedBehaviors.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 rounded-xl p-4 border"
                      style={{
                        backgroundColor: "rgba(36,76,90,0.04)",
                        borderColor: "rgba(36,76,90,0.10)",
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-sans text-[11px] font-bold"
                        style={{
                          backgroundColor: "rgba(36,76,90,0.10)",
                          color: "#274C77",
                        }}
                      >
                        {index + 1}
                      </div>
                      <p
                        className="font-sans text-[14px] leading-[1.75] tracking-[-0.01em] pt-0.5"
                        style={{ color: "rgba(36,76,90,0.70)" }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Moderation */}
              <div
                className="rounded-2xl p-8 border"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "rgba(136,187,214,0.18)",
                  boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                }}
              >
                <p
                  className="font-sans text-[11px] font-bold uppercase tracking-[0.20em] mb-5"
                  style={{ color: "#6096BA" }}
                >
                  Section 04
                </p>
                <h2
                  className="font-display text-[28px] sm:text-[32px] leading-[1.1] tracking-[-0.03em] mb-6"
                  style={{ color: "#274C77" }}
                >
                  Moderation and enforcement
                </h2>
                <div className="space-y-3">
                  {moderationPrinciples.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 rounded-xl p-4 border"
                      style={{
                        backgroundColor: "rgba(205,205,205,0.18)",
                        borderColor: "rgba(205,205,205,0.50)",
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-sans text-[11px] font-bold"
                        style={{
                          backgroundColor: "rgba(205,205,205,0.55)",
                          color: "#274C77",
                        }}
                      >
                        {index + 1}
                      </div>
                      <p
                        className="font-sans text-[14px] leading-[1.75] tracking-[-0.01em] pt-0.5"
                        style={{ color: "rgba(36,76,90,0.70)" }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Privacy reminder */}
              <div
                className="rounded-2xl p-8 border"
                style={{
                  backgroundColor: "rgba(153,211,223,0.18)",
                  borderColor: "rgba(153,211,223,0.35)",
                  boxShadow: "0 8px 40px rgba(36,76,90,0.06)",
                }}
              >
                <p
                  className="font-sans text-[11px] font-bold uppercase tracking-[0.20em] mb-5"
                  style={{ color: "#6096BA" }}
                >
                  Section 05
                </p>
                <h2
                  className="font-display text-[28px] sm:text-[32px] leading-[1.1] tracking-[-0.03em] mb-4"
                  style={{ color: "#274C77" }}
                >
                  Privacy reminder
                </h2>
                <p
                  className="font-sans text-[15px] leading-[1.8] tracking-[-0.01em]"
                  style={{ color: "rgba(36,76,90,0.68)" }}
                >
                  Even in a supportive environment, users should avoid posting phone numbers, addresses, passwords, personal identifiers, or any private information that could put them or others at risk. If you want to stay anonymous, be careful not to reveal your identity in posts, comments, or report descriptions.
                </p>
              </div>

            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}