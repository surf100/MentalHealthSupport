import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { HeartHandshake, Shield, Users, Lightbulb } from "lucide-react";

// ── Values data ────────────────────────────────────────────────────────────

const values = [
  {
    title: "Safety",
    description:
      "We design every part of the platform to help users feel protected when reporting, reading, or participating in discussions.",
    icon: <Shield className="w-5 h-5" style={{ color: "#274C77" }} />,
    iconBg: "rgba(136,187,214,0.25)",
  },
  {
    title: "Empathy",
    description:
      "SafeSpace is built around respectful communication, emotional support, and understanding for people facing difficult situations.",
    icon: <HeartHandshake className="w-5 h-5" style={{ color: "#274C77" }} />,
    iconBg: "rgba(153,211,223,0.30)",
  },
  {
    title: "Community",
    description:
      "We believe that peer support, trusted guidance, and shared experiences can help users feel less isolated.",
    icon: <Users className="w-5 h-5" style={{ color: "#274C77" }} />,
    iconBg: "rgba(136,187,214,0.20)",
  },
  {
    title: "Awareness",
    description:
      "The platform promotes prevention through educational resources, practical guidance, and early recognition of harmful situations.",
    icon: <Lightbulb className="w-5 h-5" style={{ color: "#274C77" }} />,
    iconBg: "rgba(153,211,223,0.22)",
  },
];

const offerings = [
  {
    title: "Anonymous reporting",
    text: "Users can safely submit reports about bullying, harassment, or emotional harm.",
  },
  {
    title: "Support forum",
    text: "A moderated community space where users can share experiences and support one another.",
  },
  {
    title: "Knowledge base",
    text: "Articles and guidance about bullying, stress, self-help, and supporting others.",
  },
  {
    title: "Safety-first design",
    text: "Clear crisis support pathways, privacy controls, and community rules.",
  },
];

// ── Page ───────────────────────────────────────────────────────────────────

export function AboutPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F9F7F3", fontFamily: "DM Sans, sans-serif", color: "#274C77" }}
    >
      <Header />

      {/* ── Hero strip ────────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: "#A3CEF1",
          borderBottom: "1px solid rgba(36,76,90,0.12)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.10,
            backgroundImage: "radial-gradient(#274C77 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "52px 56px 48px",
          }}
        >
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(36,76,90,0.60)",
              marginBottom: "14px",
            }}
          >
            Who we are
          </p>
          <h1
            style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "clamp(38px, 5vw, 62px)",
              fontWeight: 400,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "#274C77",
              margin: "0 0 16px",
              maxWidth: "700px",
            }}
          >
            About SafeSpace.
          </h1>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "17px",
              lineHeight: 1.75,
              letterSpacing: "-0.01em",
              color: "rgba(36,76,90,0.65)",
              maxWidth: "580px",
              margin: 0,
            }}
          >
            A digital platform created to support anonymous reporting, peer communication, and early prevention of bullying, harassment, and emotional distress in educational communities.
          </p>
        </div>
      </div>

      <main style={{ flex: 1 }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "44px 56px 72px",
          }}
        >

          {/* ── Main content + sidebar ─────────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 320px",
              gap: "28px",
              marginBottom: "44px",
            }}
          >
            {/* Left: mission blocks */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Mission */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(136,187,214,0.20)",
                  borderRadius: "20px",
                  padding: "36px 40px",
                  boxShadow: "0 4px 24px rgba(36,76,90,0.06)",
                }}
              >
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(36,76,90,0.40)",
                    marginBottom: "14px",
                  }}
                >
                  Mission
                </p>
                <h2
                  style={{
                    fontFamily: "DM Serif Display, serif",
                    fontSize: "26px",
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    color: "#274C77",
                    margin: "0 0 14px",
                  }}
                >
                  Our mission
                </h2>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "15px",
                    lineHeight: 1.75,
                    letterSpacing: "-0.01em",
                    color: "rgba(36,76,90,0.65)",
                    margin: 0,
                  }}
                >
                  Our mission is to create a safe digital environment where students feel heard, supported, and protected. We want to make it easier for users to speak up about bullying, seek help in stressful situations, and access trustworthy guidance without fear of judgment.
                </p>
              </div>

              {/* Why it matters */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(136,187,214,0.20)",
                  borderRadius: "20px",
                  padding: "36px 40px",
                  boxShadow: "0 4px 24px rgba(36,76,90,0.06)",
                }}
              >
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(36,76,90,0.40)",
                    marginBottom: "14px",
                  }}
                >
                  Purpose
                </p>
                <h2
                  style={{
                    fontFamily: "DM Serif Display, serif",
                    fontSize: "26px",
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    color: "#274C77",
                    margin: "0 0 14px",
                  }}
                >
                  Why this platform matters
                </h2>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "15px",
                    lineHeight: 1.75,
                    letterSpacing: "-0.01em",
                    color: "rgba(36,76,90,0.65)",
                    margin: 0,
                  }}
                >
                  Many people experience bullying, anxiety, or emotional pressure but hesitate to talk about it openly. Some do not know where to go for help, while others fear being ignored or misunderstood. SafeSpace addresses this gap by combining anonymous reporting, support-oriented community features, and accessible mental health resources in one place.
                </p>
              </div>

              {/* Who it's for — accent bg */}
              <div
                style={{
                  background: "rgba(153,211,223,0.18)",
                  border: "1px solid rgba(136,187,214,0.28)",
                  borderRadius: "20px",
                  padding: "36px 40px",
                }}
              >
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(36,76,90,0.45)",
                    marginBottom: "14px",
                  }}
                >
                  Audience
                </p>
                <h2
                  style={{
                    fontFamily: "DM Serif Display, serif",
                    fontSize: "26px",
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    color: "#274C77",
                    margin: "0 0 14px",
                  }}
                >
                  Who SafeSpace is for
                </h2>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "15px",
                    lineHeight: 1.75,
                    letterSpacing: "-0.01em",
                    color: "rgba(36,76,90,0.68)",
                    margin: 0,
                  }}
                >
                  SafeSpace is designed primarily for students, but it also supports mentors, moderators, specialists, and educational staff who want to build a safer and more supportive environment. The platform can help both those who need immediate support and those who want to help others responsibly.
                </p>
              </div>
            </div>

            {/* Right: what SafeSpace offers */}
            <aside>
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(136,187,214,0.18)",
                  borderRadius: "20px",
                  padding: "32px 28px",
                  position: "sticky",
                  top: "88px",
                  boxShadow: "0 4px 24px rgba(36,76,90,0.06)",
                }}
              >
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(36,76,90,0.40)",
                    marginBottom: "14px",
                  }}
                >
                  Platform
                </p>
                <h2
                  style={{
                    fontFamily: "DM Serif Display, serif",
                    fontSize: "22px",
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    color: "#274C77",
                    margin: "0 0 20px",
                  }}
                >
                  What SafeSpace offers
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {offerings.map((item, i) => (
                    <div
                      key={item.title}
                      style={{
                        background: i % 2 === 0 ? "rgba(233,233,233,0.55)" : "rgba(153,211,223,0.10)",
                        border: "1px solid rgba(205,205,205,0.55)",
                        borderRadius: "12px",
                        padding: "16px 18px",
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#274C77",
                          margin: "0 0 6px",
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "13px",
                          lineHeight: 1.65,
                          color: "rgba(36,76,90,0.60)",
                          margin: 0,
                        }}
                      >
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {/* ── Values section ─────────────────────────────────────────────── */}
          <div>
            <div style={{ marginBottom: "28px" }}>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(36,76,90,0.40)",
                  marginBottom: "10px",
                }}
              >
                What drives us
              </p>
              <h2
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "clamp(28px, 3vw, 40px)",
                  fontWeight: 400,
                  letterSpacing: "-0.04em",
                  color: "#274C77",
                  margin: 0,
                }}
              >
                Our values
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
              }}
            >
              {values.map((value) => (
                <ValueCard key={value.title} value={value} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ── ValueCard with hover ───────────────────────────────────────────────────

function ValueCard({
  value,
}: {
  value: {
    title: string;
    description: string;
    icon: React.ReactNode;
    iconBg: string;
  };
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#274C77" : "#FFFFFF",
        border: `1px solid ${hovered ? "transparent" : "rgba(136,187,214,0.22)"}`,
        borderRadius: "18px",
        padding: "28px 24px",
        transition: "all 0.22s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 16px 48px rgba(36,76,90,0.18)"
          : "0 2px 12px rgba(36,76,90,0.06)",
        cursor: "default",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          background: hovered ? "rgba(255,255,255,0.12)" : value.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "18px",
        }}
      >
        <span style={{ filter: hovered ? "brightness(0) invert(1)" : "none" }}>
          {value.icon}
        </span>
      </div>

      <h3
        style={{
          fontFamily: "DM Serif Display, serif",
          fontSize: "20px",
          fontWeight: 400,
          letterSpacing: "-0.03em",
          color: hovered ? "#F9F7F3" : "#274C77",
          margin: "0 0 10px",
        }}
      >
        {value.title}
      </h3>
      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "13px",
          lineHeight: 1.70,
          color: hovered ? "rgba(233,233,233,0.72)" : "rgba(36,76,90,0.60)",
          margin: 0,
        }}
      >
        {value.description}
      </p>
    </div>
  );
}

import { useState } from "react";