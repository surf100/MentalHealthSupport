import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Lock, Shield, Eye, Database } from "lucide-react";

const sections = [
  {
    icon: Shield,
    number: "01",
    title: "Purpose of data collection",
    content: (
      <p>
        SafeSpace is designed to provide a secure environment for anonymous
        reporting, peer support, and access to educational mental health
        resources. Information is collected only to support platform
        functionality, improve user safety, and enable moderation and support
        processes.
      </p>
    ),
  },
  {
    icon: Database,
    number: "02",
    title: "Information we may collect",
    content: (
      <>
        <p>We may collect the following information:</p>
        <ul>
          <li>account information such as email and display name;</li>
          <li>anonymous reports submitted through the platform;</li>
          <li>forum posts, comments, and community activity;</li>
          <li>notification and preference settings;</li>
          <li>technical usage information necessary for platform operation.</li>
        </ul>
      </>
    ),
  },
  {
    icon: Eye,
    number: "03",
    title: "How information is used",
    content: (
      <>
        <p>Information may be used to:</p>
        <ul>
          <li>process anonymous reports and route them for review;</li>
          <li>moderate harmful or unsafe content in the forum;</li>
          <li>send notifications about reports, replies, or achievements;</li>
          <li>improve user experience and platform safety;</li>
          <li>support system security, analytics, and service reliability.</li>
        </ul>
      </>
    ),
  },
  {
    icon: Lock,
    number: "04",
    title: "Privacy and anonymous reports",
    content: (
      <p>
        SafeSpace supports anonymous reporting. When a user chooses to submit a
        report anonymously, the system is designed to minimize exposure of
        personal identity. However, users should avoid placing unnecessary
        personal identifiers in free-text fields if they wish to remain fully
        anonymous.
      </p>
    ),
  },
  {
    icon: null,
    number: "05",
    title: "Data storage and security",
    content: (
      <p>
        We take reasonable technical and organizational steps to protect stored
        information from unauthorized access, misuse, or loss. Access to
        sensitive data should be limited to authorized system roles such as
        moderators or administrators where necessary for platform safety and
        operation.
      </p>
    ),
  },
  {
    icon: null,
    number: "06",
    title: "Sharing of information",
    content: (
      <p>
        SafeSpace does not share user information publicly except where users
        intentionally publish content in community areas such as the support
        forum. Information may be disclosed only where required for moderation,
        legal compliance, or urgent safety-related action.
      </p>
    ),
  },
  {
    icon: null,
    number: "07",
    title: "User choices and control",
    content: (
      <p>
        Users may manage parts of their account through profile and settings
        pages, including notification preferences and privacy controls. Users
        should also review the information they submit before posting or
        reporting.
      </p>
    ),
  },
  {
    icon: null,
    number: "08",
    title: "Policy updates",
    content: (
      <>
        <p>
          This Privacy Policy may be updated over time to reflect changes in
          platform functionality, legal requirements, or security practices.
          Continued use of the platform means acceptance of the latest version
          of this policy.
        </p>
        <p
          style={{
            fontSize: "13px",
            color: "rgba(36,76,90,0.45)",
            marginTop: "24px",
          }}
        >
          Last updated: March 2026
        </p>
      </>
    ),
    isLast: true,
  },
];

export function PrivacyPage() {
  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: "#F9F7F3", color: "#274C77" }}
    >
      <Header />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section
          className="relative overflow-hidden border-b"
          style={{
            backgroundColor: "#A3CEF1",
            borderColor: "rgba(36,76,90,0.12)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.10]"
            style={{
              backgroundImage: "radial-gradient(#274C77 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
          <div className="relative mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-14 py-16 lg:py-20">
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 border"
              style={{
                backgroundColor: "rgba(36,76,90,0.08)",
                borderColor: "rgba(36,76,90,0.15)",
              }}
            >
              <Lock className="w-3.5 h-3.5" style={{ color: "#274C77" }} />
              <span
                className="font-sans font-bold uppercase"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.20em",
                  color: "#274C77",
                }}
              >
                Privacy Policy
              </span>
            </div>

            <h1
              className="font-display leading-[1.0] tracking-[-0.04em] max-w-2xl"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(38px, 5vw, 64px)",
                color: "#274C77",
              }}
            >
              How we handle your information.
            </h1>

            <p
              className="mt-5 font-sans leading-[1.75] tracking-[-0.01em] max-w-xl"
              style={{ fontSize: "16px", color: "rgba(36,76,90,0.65)" }}
            >
              This Privacy Policy explains how SafeSpace collects, uses, stores,
              and protects information when users access the platform.
            </p>
          </div>
        </section>

        {/* ── Content ── */}
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-14 py-14">
          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">

            {/* Sticky nav */}
            <nav className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
              <p
                className="font-sans font-bold uppercase mb-4"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.20em",
                  color: "rgba(36,76,90,0.45)",
                }}
              >
                Contents
              </p>
              <ul className="space-y-1">
                {sections.map((s) => (
                  <li key={s.number}>
                    <a
                      href={`#privacy-${s.number}`}
                      className="flex items-center gap-2 font-sans rounded-sm py-1.5 px-2 transition-colors hover:bg-[#A3CEF1]/40"
                      style={{
                        fontSize: "13px",
                        color: "rgba(36,76,90,0.60)",
                        textDecoration: "none",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "rgba(36,76,90,0.35)",
                          minWidth: "20px",
                        }}
                      >
                        {s.number}
                      </span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Sections */}
            <div className="space-y-4 min-w-0">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <section
                    key={section.number}
                    id={`privacy-${section.number}`}
                    className="rounded-lg border"
                    style={{
                      backgroundColor: section.isLast
                        ? "rgba(153,211,223,0.12)"
                        : "#ffffff",
                      borderColor: section.isLast ? "#6096BA" : "#D6DCE1",
                      padding: "32px",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Number badge */}
                      <div
                        className="shrink-0 rounded-sm flex items-center justify-center font-sans font-bold mt-0.5"
                        style={{
                          width: "32px",
                          height: "32px",
                          backgroundColor: Icon
                            ? "#A3CEF1"
                            : "rgba(36,76,90,0.07)",
                          fontSize: "12px",
                          color: "#274C77",
                        }}
                      >
                        {Icon ? (
                          <Icon className="w-4 h-4" />
                        ) : (
                          section.number
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h2
                          className="font-display tracking-[-0.02em] mb-4"
                          style={{
                            fontFamily: "'DM Serif Display', serif",
                            fontSize: "22px",
                            color: "#274C77",
                          }}
                        >
                          {section.title}
                        </h2>

                        <div
                          className="font-sans leading-[1.85] tracking-[-0.01em] space-y-4"
                          style={{
                            fontSize: "15px",
                            color: "rgba(36,76,90,0.70)",
                          }}
                        >
                          {/* Render ul with custom bullets */}
                          <style>{`
                            #privacy-${section.number} ul {
                              list-style: none;
                              padding: 0;
                              margin-top: 12px;
                              display: flex;
                              flex-direction: column;
                              gap: 10px;
                            }
                            #privacy-${section.number} ul li {
                              display: flex;
                              align-items: flex-start;
                              gap: 10px;
                            }
                            #privacy-${section.number} ul li::before {
                              content: '';
                              width: 6px;
                              height: 6px;
                              border-radius: 50%;
                              background-color: #6096BA;
                              flex-shrink: 0;
                              margin-top: 8px;
                            }
                          `}</style>
                          {section.content}
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}