import { Footer } from "../components/footer";
import { Header } from "../components/header";
import {
  AlertTriangle,
  ArrowRight,
  Heart,
  Phone,
  Shield,
  ShieldAlert,
  Users,
  BookOpen,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─── data ─────────────────────────────────────────────────────────────────────

const hotlines = [
  {
    name: "National Crisis Helpline",
    number: "8-800-2000-122",
    description:
      "Free 24/7 psychological support for children and adolescents",
    available: "24/7 · Free",
  },
  {
    name: "Emergency Services",
    number: "112",
    description:
      "For immediate physical danger or emergencies requiring urgent response",
    available: "24/7 · Emergency",
  },
  {
    name: "Psychological Support Line",
    number: "8-800-2000-12",
    description:
      "Confidential support for emotional distress, anxiety, and crisis situations",
    available: "24/7 · Confidential",
  },
];

const steps = [
  {
    step: "01",
    icon: Shield,
    title: "Get to a safe place",
    description:
      "If you feel physically unsafe, move to a public area or a place with trusted people present. Your physical safety comes first.",
  },
  {
    step: "02",
    icon: Phone,
    title: "Contact someone you trust",
    description:
      "Reach out to a parent, teacher, counselor, or another adult who can help you. You do not need to handle this alone.",
  },
  {
    step: "03",
    icon: ShieldAlert,
    title: "Report anonymously if needed",
    description:
      "If you are not ready to speak to someone directly, use the anonymous report form. Your identity will remain protected.",
  },
  {
    step: "04",
    icon: Heart,
    title: "Take care of yourself",
    description:
      "After a crisis, focus on rest, safety, and speaking with a professional. Recovery is a process — it takes time and support.",
  },
];

const warningSignsList = [
  "Feeling completely hopeless or like nothing will get better",
  "Withdrawing from everyone and everything",
  "Thinking about harming yourself or someone else",
  "Feeling trapped with no way out",
  "Severe panic, inability to breathe or think clearly",
  "Experiencing something dangerous or threatening right now",
];

// ─── component ────────────────────────────────────────────────────────────────

export function CrisisHelpPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: "#F9F7F3", color: "#274C77" }}>
      <Header />

      <main className="flex-1">

        {/* ── hero ── */}
        <section className="relative overflow-hidden border-b" style={{ backgroundColor: "#A3CEF1", borderColor: "rgba(36,76,90,0.12)" }}>
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.10]"
            style={{
              backgroundImage: "radial-gradient(#274C77 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
          <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-20 lg:py-28">
            <div className="max-w-3xl">
              <div
                className="mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2"
                style={{
                  backgroundColor: "rgba(36,76,90,0.10)",
                  border: "1px solid rgba(36,76,90,0.15)",
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "#274C77" }}
                />
                <span
                  className="font-sans text-[13px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "rgba(36,76,90,0.70)" }}
                >
                  Crisis Support
                </span>
              </div>

              <h1
                className="font-display leading-[1.05] tracking-[-0.04em]"
                style={{ fontSize: "clamp(42px, 6vw, 72px)", color: "#274C77" }}
              >
                Help is available right now.
              </h1>

              <p
                className="mt-6 font-sans text-[17px] leading-[1.75] tracking-[-0.01em]"
                style={{ color: "rgba(36,76,90,0.70)", maxWidth: 560 }}
              >
                If you or someone you know is in immediate danger or experiencing
                a mental health crisis, you are not alone. Reach out using the
                resources on this page.
              </p>

              {/* emergency CTA */}
              <div
                className="mt-10 flex items-center gap-5 rounded-lg px-7 py-5"
                style={{
                  backgroundColor: "rgba(36,76,90,0.10)",
                  border: "1px solid rgba(36,76,90,0.18)",
                  maxWidth: 520,
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{ width: 44, height: 44, backgroundColor: "#274C77" }}
                >
                  <AlertTriangle className="w-5 h-5" style={{ color: "#F9F7F3" }} />
                </div>
                <div>
                  <p className="font-sans font-semibold" style={{ fontSize: 14, color: "#274C77" }}>
                    Immediate danger?
                  </p>
                  <p className="font-sans mt-0.5" style={{ fontSize: 13, color: "rgba(36,76,90,0.65)", lineHeight: 1.6 }}>
                    Call emergency services immediately at{" "}
                    <strong style={{ color: "#274C77" }}>112</strong>. Do not wait.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── main content ── */}
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-20 lg:py-28">
          <div className="grid grid-cols-12 gap-10">

            {/* ── left column ── */}
            <section className="col-span-12 lg:col-span-8 space-y-20">

              {/* ── warning signs ── */}
              <div>
                <p
                  className="font-sans font-bold uppercase tracking-[0.22em] mb-4"
                  style={{ fontSize: 12, color: "#274C77" }}
                >
                  Warning signs
                </p>
                <h2
                  className="font-display leading-[1.05] tracking-[-0.04em] mb-8"
                  style={{ fontSize: "clamp(30px, 4vw, 44px)", color: "#274C77" }}
                >
                  Signs that you need help now
                </h2>

                <div
                  className="rounded-lg overflow-hidden"
                  style={{
                    border: "1px solid rgba(36,76,90,0.12)",
                    backgroundColor: "#fff",
                  }}
                >
                  {warningSignsList.map((sign, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 px-7 py-4"
                      style={{
                        borderBottom:
                          index < warningSignsList.length - 1
                            ? "1px solid rgba(36,76,90,0.08)"
                            : "none",
                      }}
                    >
                      <span
                        className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: "#6096BA" }}
                      />
                      <p
                        className="font-sans leading-[1.75] tracking-[-0.01em]"
                        style={{ fontSize: 15, color: "rgba(36,76,90,0.75)" }}
                      >
                        {sign}
                      </p>
                    </div>
                  ))}
                </div>

                <p
                  className="font-sans mt-4 px-1"
                  style={{ fontSize: 13, color: "rgba(36,76,90,0.50)", lineHeight: 1.65 }}
                >
                  If any of these describe what you are experiencing right now, please
                  reach out immediately using the resources below.
                </p>
              </div>

              {/* ── what to do steps ── */}
              <div>
                <p
                  className="font-sans font-bold uppercase tracking-[0.22em] mb-4"
                  style={{ fontSize: 12, color: "#274C77" }}
                >
                  Step by step
                </p>
                <h2
                  className="font-display leading-[1.05] tracking-[-0.04em] mb-8"
                  style={{ fontSize: "clamp(30px, 4vw, 44px)", color: "#274C77" }}
                >
                  What to do in a crisis
                </h2>

                {/* steps — same grid pattern as home journey */}
                <div
                  className="grid gap-px md:grid-cols-2"
                  style={{
                    border: "1px solid rgba(36,76,90,0.12)",
                    backgroundColor: "rgba(36,76,90,0.08)",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  {steps.map((step) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.step}
                        className="p-8"
                        style={{ backgroundColor: "#F9F7F3" }}
                      >
                        <p
                          className="font-sans font-bold uppercase tracking-[0.20em] mb-5"
                          style={{ fontSize: 11, color: "#6096BA" }}
                        >
                          Step {step.step}
                        </p>
                        <div
                          className="flex items-center justify-center rounded-xl mb-5"
                          style={{
                            width: 44,
                            height: 44,
                            backgroundColor: "rgba(136,187,214,0.18)",
                          }}
                        >
                          <Icon className="w-5 h-5" style={{ color: "#274C77" }} />
                        </div>
                        <h3
                          className="font-display leading-tight tracking-[-0.03em] mb-3"
                          style={{ fontSize: 22, color: "#274C77" }}
                        >
                          {step.title}
                        </h3>
                        <p
                          className="font-sans leading-[1.70] tracking-[-0.01em]"
                          style={{ fontSize: 14, color: "rgba(36,76,90,0.65)" }}
                        >
                          {step.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── crisis hotlines ── */}
              <div>
                <p
                  className="font-sans font-bold uppercase tracking-[0.22em] mb-4"
                  style={{ fontSize: 12, color: "#274C77" }}
                >
                  Get help
                </p>
                <h2
                  className="font-display leading-[1.05] tracking-[-0.04em] mb-8"
                  style={{ fontSize: "clamp(30px, 4vw, 44px)", color: "#274C77" }}
                >
                  Crisis hotlines
                </h2>

                <div className="space-y-4">
                  {hotlines.map((hotline, index) => (
                    <div
                      key={index}
                      className="rounded-lg flex items-start gap-5 px-7 py-6"
                      style={{
                        backgroundColor: "#fff",
                        border: "1px solid rgba(36,76,90,0.12)",
                      }}
                    >
                      <div
                        className="flex items-center justify-center rounded-xl flex-shrink-0"
                        style={{
                          width: 44,
                          height: 44,
                          backgroundColor: "rgba(153,211,223,0.30)",
                        }}
                      >
                        <Phone className="w-5 h-5" style={{ color: "#274C77" }} />
                      </div>
                      <div className="flex-1 flex items-start justify-between gap-6 flex-wrap">
                        <div>
                          <p
                            className="font-sans font-semibold mb-1"
                            style={{ fontSize: 15, color: "#274C77" }}
                          >
                            {hotline.name}
                          </p>
                          <p
                            className="font-sans"
                            style={{ fontSize: 13, color: "rgba(36,76,90,0.55)", lineHeight: 1.65 }}
                          >
                            {hotline.description}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p
                            className="font-display font-bold"
                            style={{ fontSize: 22, color: "#274C77", letterSpacing: "-0.03em" }}
                          >
                            {hotline.number}
                          </p>
                          <p
                            className="font-sans font-semibold mt-0.5"
                            style={{ fontSize: 11, color: "#6096BA" }}
                          >
                            {hotline.available}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </section>

            {/* ── sidebar ── */}
            <aside className="col-span-12 lg:col-span-4 space-y-5 lg:sticky lg:top-8 lg:self-start">

              {/* anonymous report */}
              <div
                className="rounded-lg p-7"
                style={{ backgroundColor: "#274C77" }}
              >
                <div
                  className="flex items-center justify-center rounded-xl mb-5"
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor: "rgba(153,211,223,0.18)",
                  }}
                >
                  <ShieldAlert className="w-5 h-5" style={{ color: "#A3CEF1" }} />
                </div>
                <h3
                  className="font-display tracking-[-0.03em] mb-3"
                  style={{ fontSize: 22, color: "#F9F7F3" }}
                >
                  Anonymous Report
                </h3>
                <p
                  className="font-sans mb-6 leading-[1.70]"
                  style={{ fontSize: 14, color: "rgba(233,233,233,0.65)" }}
                >
                  Not ready to speak to someone? Submit an anonymous report and
                  get support without revealing your identity.
                </p>
                <button
                  onClick={() => navigate("/report")}
                  className="w-full rounded-sm font-sans font-semibold flex items-center justify-center gap-2 py-3"
                  style={{
                    fontSize: 14,
                    backgroundColor: "#6096BA",
                    color: "#274C77",
                  }}
                >
                  Submit Report
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* support forum */}
              <div
                className="rounded-lg p-7"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid rgba(36,76,90,0.12)",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-xl mb-5"
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor: "rgba(153,211,223,0.25)",
                  }}
                >
                  <Users className="w-5 h-5" style={{ color: "#274C77" }} />
                </div>
                <h3
                  className="font-display tracking-[-0.03em] mb-3"
                  style={{ fontSize: 20, color: "#274C77" }}
                >
                  Support Forum
                </h3>
                <p
                  className="font-sans mb-6 leading-[1.70]"
                  style={{ fontSize: 14, color: "rgba(36,76,90,0.60)" }}
                >
                  Connect with others who understand. Share your experience or
                  read stories from the community.
                </p>
                <button
                  onClick={() => navigate("/forum")}
                  className="w-full rounded-sm font-sans font-semibold py-3"
                  style={{
                    fontSize: 14,
                    color: "#274C77",
                    border: "1px solid rgba(36,76,90,0.22)",
                    backgroundColor: "transparent",
                  }}
                >
                  Open Forum
                </button>
              </div>

              {/* you are not alone */}
              <div
                className="rounded-lg p-7"
                style={{
                  backgroundColor: "rgba(153,211,223,0.25)",
                  border: "1px solid rgba(36,76,90,0.10)",
                }}
              >
                <Heart className="w-5 h-5 mb-4" style={{ color: "#274C77" }} />
                <h3
                  className="font-display tracking-[-0.03em] mb-3"
                  style={{ fontSize: 20, color: "#274C77" }}
                >
                  You are not alone
                </h3>
                <p
                  className="font-sans leading-[1.75]"
                  style={{ fontSize: 14, color: "rgba(36,76,90,0.65)" }}
                >
                  Many people go through difficult moments and find their way
                  through with the right support. Asking for help is one of the
                  strongest things you can do.
                </p>
              </div>

              {/* quick access */}
              <div
                className="rounded-lg p-6"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid rgba(36,76,90,0.12)",
                }}
              >
                <p
                  className="font-sans font-bold uppercase tracking-[0.20em] mb-4"
                  style={{ fontSize: 11, color: "#6096BA" }}
                >
                  Quick access
                </p>
                <div className="space-y-1">
                  {[
                    { label: "Knowledge Base", route: "/knowledge-base", icon: BookOpen },
                    { label: "My Dashboard", route: "/dashboard", icon: LayoutDashboard },
                    { label: "Support Forum", route: "/forum", icon: MessageSquare },
                  ].map(({ label, route, icon: Icon }) => (
                    <button
                      key={route}
                      onClick={() => navigate(route)}
                      className="w-full text-left flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors"
                      style={{ color: "rgba(36,76,90,0.70)" }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "rgba(153,211,223,0.20)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "transparent")
                      }
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: "#6096BA" }} />
                      <span className="font-sans" style={{ fontSize: 13 }}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </aside>
          </div>
        </div>

        {/* ── bottom CTA strip ── same pattern as home ── */}
        <section style={{ backgroundColor: "#6096BA" }}>
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-20 lg:py-28">
            <div
              className="rounded-lg px-10 py-14 sm:px-14 lg:px-20"
              style={{
                backgroundColor: "#F9F7F3",
                border: "1px solid rgba(36,76,90,0.12)",
              }}
            >
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p
                    className="font-sans font-bold uppercase tracking-[0.22em] mb-4"
                    style={{ fontSize: 12, color: "#274C77" }}
                  >
                    You're not alone
                  </p>
                  <h2
                    className="font-display leading-[1.05] tracking-[-0.04em]"
                    style={{
                      fontSize: "clamp(34px, 5vw, 60px)",
                      color: "#274C77",
                      maxWidth: 680,
                    }}
                  >
                    Ready to take the first step toward safety?
                  </h2>
                  <p
                    className="mt-5 font-sans leading-[1.75] tracking-[-0.01em]"
                    style={{
                      fontSize: 17,
                      color: "rgba(36,76,90,0.65)",
                      maxWidth: 560,
                    }}
                  >
                    Whether you need to report something, talk to someone, or simply
                    find resources — SafeSpace is here, always anonymously and safely.
                  </p>
                </div>

                <div className="flex flex-col gap-3 flex-shrink-0">
                  <button
                    onClick={() => navigate("/report")}
                    className="rounded-sm font-sans font-semibold text-center px-8 py-4 transition-colors"
                    style={{
                      fontSize: 15,
                      backgroundColor: "#274C77",
                      color: "#F9F7F3",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "#6096BA")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "#274C77")
                    }
                  >
                    Submit a report
                  </button>
                  <button
                    onClick={() => navigate("/knowledge-base")}
                    className="rounded-sm font-sans font-semibold text-center px-8 py-4 transition-colors"
                    style={{
                      fontSize: 15,
                      color: "#274C77",
                      border: "1px solid rgba(36,76,90,0.25)",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "rgba(36,76,90,0.50)";
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "rgba(153,211,223,0.35)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "rgba(36,76,90,0.25)";
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "transparent";
                    }}
                  >
                    Browse resources
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}