import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { FileText, Shield, Users, AlertTriangle } from "lucide-react";
import { useState } from "react";

// ── Section data ───────────────────────────────────────────────────────────

const sections = [
  {
    id: "use",
    number: "01",
    title: "Use of the platform",
    icon: <FileText className="w-4 h-4" style={{ color: "#274C77" }} />,
    iconBg: "rgba(163,206,241,0.40)",
    content: (
      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "15px",
          lineHeight: 1.80,
          letterSpacing: "-0.01em",
          color: "rgba(39,76,119,0.70)",
          margin: 0,
        }}
      >
        SafeSpace provides a digital environment where users can share concerns, submit reports, participate in community discussions, and access educational resources related to well-being and safety. Users agree to use the platform in a respectful and responsible manner.
      </p>
    ),
  },
  {
    id: "behavior",
    number: "02",
    title: "Community behavior",
    icon: <Users className="w-4 h-4" style={{ color: "#274C77" }} />,
    iconBg: "rgba(96,150,186,0.20)",
    content: (
      <div>
        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "15px",
            lineHeight: 1.80,
            letterSpacing: "-0.01em",
            color: "rgba(39,76,119,0.70)",
            margin: "0 0 16px",
          }}
        >
          Users are expected to follow respectful communication rules.
        </p>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            "Do not harass, threaten, or attack other users.",
            "Do not post harmful or illegal content.",
            "Avoid spreading misinformation.",
            "Respect anonymity and privacy of other members.",
          ].map((item) => (
            <li
              key={item}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "15px",
                lineHeight: 1.70,
                color: "rgba(39,76,119,0.70)",
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  marginTop: "7px",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#6096BA",
                  display: "inline-block",
                }}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "moderation",
    number: "03",
    title: "Moderation and safety",
    icon: <Shield className="w-4 h-4" style={{ color: "#274C77" }} />,
    iconBg: "rgba(163,206,241,0.35)",
    content: (
      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "15px",
          lineHeight: 1.80,
          letterSpacing: "-0.01em",
          color: "rgba(39,76,119,0.70)",
          margin: 0,
        }}
      >
        To maintain a safe environment, moderators may review, remove, or restrict content that violates platform rules. Moderators may also temporarily or permanently restrict accounts that repeatedly violate community standards.
      </p>
    ),
  },
  {
    id: "reporting",
    number: "04",
    title: "Anonymous reporting",
    icon: <FileText className="w-4 h-4" style={{ color: "#274C77" }} />,
    iconBg: "rgba(96,150,186,0.18)",
    content: (
      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "15px",
          lineHeight: 1.80,
          letterSpacing: "-0.01em",
          color: "rgba(39,76,119,0.70)",
          margin: 0,
        }}
      >
        The platform supports anonymous reporting. Users should submit information responsibly and truthfully. False reports or misuse of the reporting system may undermine platform safety and may lead to restrictions on platform access.
      </p>
    ),
  },
  {
    id: "ip",
    number: "05",
    title: "Intellectual property",
    icon: <FileText className="w-4 h-4" style={{ color: "#274C77" }} />,
    iconBg: "rgba(163,206,241,0.28)",
    content: (
      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "15px",
          lineHeight: 1.80,
          letterSpacing: "-0.01em",
          color: "rgba(39,76,119,0.70)",
          margin: 0,
        }}
      >
        Content published on SafeSpace such as articles, guides, and educational materials may be protected by intellectual property rights. Users should not copy, redistribute, or reuse platform materials without proper permission.
      </p>
    ),
  },
  {
    id: "liability",
    number: "06",
    title: "Limitation of responsibility",
    icon: <AlertTriangle className="w-4 h-4" style={{ color: "#274C77" }} />,
    iconBg: "rgba(96,150,186,0.22)",
    content: (
      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "15px",
          lineHeight: 1.80,
          letterSpacing: "-0.01em",
          color: "rgba(39,76,119,0.70)",
          margin: 0,
        }}
      >
        SafeSpace provides informational and community support tools. The platform does not replace professional legal, medical, or psychological assistance. Users should seek qualified professionals when dealing with serious or urgent situations.
      </p>
    ),
  },
  {
    id: "changes",
    number: "07",
    title: "Changes to the terms",
    icon: <FileText className="w-4 h-4" style={{ color: "#274C77" }} />,
    iconBg: "rgba(163,206,241,0.30)",
    content: (
      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "15px",
          lineHeight: 1.80,
          letterSpacing: "-0.01em",
          color: "rgba(39,76,119,0.70)",
          margin: 0,
        }}
      >
        SafeSpace may update these Terms of Service as the platform evolves. Continued use of the platform indicates acceptance of the updated terms.
      </p>
    ),
  },
];

// ── Page ───────────────────────────────────────────────────────────────────

export function TermsPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#E7ECEF", fontFamily: "DM Sans, sans-serif", color: "#274C77" }}
    >
      <Header />

      {/* ── Hero strip ────────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: "#A3CEF1",
          borderBottom: "1px solid rgba(39,76,119,0.13)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot grid — matching home-page pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.12,
            backgroundImage: "radial-gradient(#274C77 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1440px",
            margin: "0 auto",
            padding: "52px 56px 48px",
          }}
        >
          {/* Eyebrow badge — same pattern as home */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              borderRadius: "99px",
              border: "1px solid rgba(39,76,119,0.15)",
              background: "rgba(163,206,241,0.70)",
              padding: "6px 16px",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#274C77",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(39,76,119,0.70)",
              }}
            >
              Legal
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "24px",
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "clamp(40px, 5.5vw, 72px)",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.00,
                  color: "#274C77",
                  margin: "0 0 16px",
                }}
              >
                Terms of Service.
              </h1>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "17px",
                  lineHeight: 1.75,
                  letterSpacing: "-0.01em",
                  color: "rgba(39,76,119,0.70)",
                  maxWidth: "560px",
                  margin: 0,
                }}
              >
                These Terms define the rules and guidelines for using the SafeSpace platform. By accessing or using the platform, users agree to comply with these terms.
              </p>
            </div>

            {/* Last updated pill */}
            <div
              style={{
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(39,76,119,0.13)",
                borderRadius: "12px",
                padding: "14px 22px",
                backdropFilter: "blur(4px)",
                flexShrink: 0,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(39,76,119,0.50)",
                  margin: "0 0 4px",
                }}
              >
                Last updated
              </p>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#274C77",
                  margin: 0,
                }}
              >
                March 2026
              </p>
            </div>
          </div>
        </div>
      </div>

      <main style={{ flex: 1 }}>
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            padding: "44px 56px 80px",
          }}
        >
          {/* ── Two-column layout ─────────────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              gap: "40px",
              alignItems: "start",
            }}
          >

            {/* ── Sticky TOC sidebar ───────────────────────────────────────── */}
            <aside
              style={{
                position: "sticky",
                top: "88px",
              }}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(39,76,119,0.10)",
                  borderRadius: "16px",
                  padding: "20px",
                  boxShadow: "0 2px 12px rgba(39,76,119,0.06)",
                }}
              >
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(39,76,119,0.40)",
                    marginBottom: "12px",
                    paddingLeft: "10px",
                  }}
                >
                  Contents
                </p>
                <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {sections.map((s) => (
                    <TocLink key={s.id} id={s.id} label={s.title} number={s.number} />
                  ))}
                </nav>
              </div>
            </aside>

            {/* ── Sections ─────────────────────────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {sections.map((section, i) => (
                <TermsCard key={section.id} section={section} accent={i === 5} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ── TOC link ──────────────────────────────────────────────────────────────

function TocLink({ id, label, number }: { id: string; label: string; number: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={`#${id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 10px",
        borderRadius: "8px",
        textDecoration: "none",
        background: hovered ? "rgba(163,206,241,0.25)" : "transparent",
        transition: "background 0.15s",
      }}
    >
      <span
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "10px",
          fontWeight: 700,
          color: hovered ? "#6096BA" : "rgba(39,76,119,0.35)",
          flexShrink: 0,
          transition: "color 0.15s",
          letterSpacing: "0.06em",
        }}
      >
        {number}
      </span>
      <span
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "12px",
          fontWeight: 500,
          color: hovered ? "#274C77" : "rgba(39,76,119,0.60)",
          lineHeight: 1.3,
          transition: "color 0.15s",
        }}
      >
        {label}
      </span>
    </a>
  );
}

// ── Terms card ────────────────────────────────────────────────────────────

function TermsCard({
  section,
  accent,
}: {
  section: (typeof sections)[0];
  accent?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <section
      id={section.id}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: accent ? "rgba(163,206,241,0.18)" : "#FFFFFF",
        border: `1px solid ${hovered ? "rgba(39,76,119,0.18)" : "rgba(39,76,119,0.09)"}`,
        borderRadius: "18px",
        padding: "36px 40px",
        transition: "border-color 0.18s, box-shadow 0.18s",
        boxShadow: hovered
          ? "0 8px 32px rgba(39,76,119,0.09)"
          : "0 2px 8px rgba(39,76,119,0.04)",
        scrollMarginTop: "104px",
      }}
    >
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "14px",
          marginBottom: "22px",
        }}
      >
        {/* Icon box */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: section.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: "2px",
          }}
        >
          {section.icon}
        </div>

        <div>
          {/* Number */}
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(39,76,119,0.38)",
              margin: "0 0 5px",
            }}
          >
            {section.number}
          </p>
          {/* Title */}
          <h2
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: "#274C77",
              margin: 0,
            }}
          >
            {section.title}
          </h2>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "rgba(39,76,119,0.08)",
          marginBottom: "22px",
        }}
      />

      {/* Content */}
      {section.content}
    </section>
  );
}