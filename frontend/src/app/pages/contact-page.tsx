import { Footer } from "../components/footer";
import { Header } from "../components/header";
import {
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

// ── Shared input style ─────────────────────────────────────────────────────

const inputBase: React.CSSProperties = {
  width: "100%",
  padding: "11px 16px",
  fontFamily: "DM Sans, sans-serif",
  fontSize: "14px",
  color: "#274C77",
  background: "#F6F8F9",
  border: "1px solid rgba(205,205,205,0.8)",
  borderRadius: "10px",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  boxSizing: "border-box" as const,
};

const labelStyle: React.CSSProperties = {
  fontFamily: "DM Sans, sans-serif",
  fontSize: "13px",
  fontWeight: 600,
  color: "#274C77",
  display: "block",
  marginBottom: "8px",
};

// ── Contact info items ─────────────────────────────────────────────────────

const contactItems = [
  {
    icon: <Mail className="w-4 h-4" style={{ color: "#274C77" }} />,
    label: "Email",
    value: "support@safespace.app",
    href: "mailto:support@safespace.app",
    iconBg: "rgba(136,187,214,0.22)",
  },
  {
    icon: <Phone className="w-4 h-4" style={{ color: "#274C77" }} />,
    label: "Phone",
    value: "+7 (700) 000-00-00",
    href: "tel:+77000000000",
    iconBg: "rgba(153,211,223,0.28)",
  },
  {
    icon: <MapPin className="w-4 h-4" style={{ color: "#274C77" }} />,
    label: "Location",
    value: "Astana, Kazakhstan",
    href: null,
    iconBg: "rgba(205,205,205,0.40)",
  },
];

// ── Page ───────────────────────────────────────────────────────────────────

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ── Submit handler — logic untouched, added submitted state for UX ──────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setTimeout(() => setSubmitted(false), 5000);
  };

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
            Get in touch
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
            }}
          >
            Contact us.
          </h1>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "17px",
              lineHeight: 1.75,
              letterSpacing: "-0.01em",
              color: "rgba(36,76,90,0.65)",
              maxWidth: "520px",
              margin: 0,
            }}
          >
            Have questions, feedback, or need platform-related support? Reach the SafeSpace team through the form below.
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 320px",
              gap: "28px",
              alignItems: "start",
            }}
          >

            {/* ── Contact form ──────────────────────────────────────────────── */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(136,187,214,0.20)",
                borderRadius: "20px",
                padding: "40px",
                boxShadow: "0 4px 24px rgba(36,76,90,0.07)",
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
                Message
              </p>
              <h2
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "26px",
                  fontWeight: 400,
                  letterSpacing: "-0.03em",
                  color: "#274C77",
                  margin: "0 0 28px",
                }}
              >
                Send a message
              </h2>

              {/* Success state */}
              {submitted && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    background: "rgba(153,211,223,0.18)",
                    border: "1px solid rgba(136,187,214,0.35)",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    marginBottom: "28px",
                  }}
                >
                  <Send className="w-4 h-4 shrink-0" style={{ color: "#274C77", marginTop: "2px" }} />
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: "rgba(36,76,90,0.75)", margin: 0, lineHeight: 1.6 }}>
                    Your message has been sent. We'll get back to you as soon as possible.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={labelStyle}>Full name</label>
                    <FocusInput
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <FocusInput
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Subject</label>
                  <FocusInput
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What is your message about?"
                  />
                </div>

                <div style={{ marginBottom: "28px" }}>
                  <label style={labelStyle}>Message</label>
                  <FocusTextarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={7}
                    placeholder="Write your message here…"
                  />
                </div>

                <SubmitButton />
              </form>
            </div>

            {/* ── Sidebar ───────────────────────────────────────────────────── */}
            <aside style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Contact info card */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(136,187,214,0.18)",
                  borderRadius: "20px",
                  padding: "32px 28px",
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
                  Details
                </p>
                <h2
                  style={{
                    fontFamily: "DM Serif Display, serif",
                    fontSize: "22px",
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    color: "#274C77",
                    margin: "0 0 22px",
                  }}
                >
                  Contact information
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  {contactItems.map((item) => (
                    <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background: item.iconBg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p
                          style={{
                            fontFamily: "DM Sans, sans-serif",
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "rgba(36,76,90,0.45)",
                            textTransform: "uppercase",
                            letterSpacing: "0.10em",
                            margin: "0 0 3px",
                          }}
                        >
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            style={{
                              fontFamily: "DM Sans, sans-serif",
                              fontSize: "14px",
                              fontWeight: 500,
                              color: "#274C77",
                              textDecoration: "none",
                              transition: "color 0.15s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#6096BA")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#274C77")}
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p
                            style={{
                              fontFamily: "DM Sans, sans-serif",
                              fontSize: "14px",
                              fontWeight: 500,
                              color: "#274C77",
                              margin: 0,
                            }}
                          >
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Urgent help card */}
              <div
                style={{
                  background: "rgba(153,211,223,0.18)",
                  border: "1px solid rgba(136,187,214,0.28)",
                  borderRadius: "20px",
                  padding: "28px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(136,187,214,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "14px",
                  }}
                >
                  <AlertCircle className="w-4 h-4" style={{ color: "#274C77" }} />
                </div>
                <h3
                  style={{
                    fontFamily: "DM Serif Display, serif",
                    fontSize: "19px",
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    color: "#274C77",
                    margin: "0 0 10px",
                  }}
                >
                  Need urgent help?
                </h3>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "13px",
                    lineHeight: 1.65,
                    color: "rgba(36,76,90,0.65)",
                    margin: 0,
                  }}
                >
                  If your issue is related to immediate safety, emotional distress, or bullying, please use the anonymous report system or visit the Crisis Help page instead of waiting for email support.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ── Input with focus ring via state ──────────────────────────────────────

function FocusInput({
  type,
  value,
  onChange,
  placeholder,
}: {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputBase,
        borderColor: focused ? "rgba(136,187,214,0.65)" : "rgba(205,205,205,0.8)",
        boxShadow: focused ? "0 0 0 3px rgba(136,187,214,0.12)" : "none",
      }}
    />
  );
}

function FocusTextarea({
  value,
  onChange,
  rows,
  placeholder,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows: number;
  placeholder: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputBase,
        resize: "vertical",
        lineHeight: 1.65,
        borderColor: focused ? "rgba(136,187,214,0.65)" : "rgba(205,205,205,0.8)",
        boxShadow: focused ? "0 0 0 3px rgba(136,187,214,0.12)" : "none",
      }}
    />
  );
}

function SubmitButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="submit"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        fontFamily: "DM Sans, sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        color: "#FFFFFF",
        background: hovered ? "#274C77" : "#6096BA",
        border: "none",
        borderRadius: "8px",
        padding: "11px 24px",
        cursor: "pointer",
        transition: "background 0.18s",
      }}
    >
      <Send className="w-4 h-4" />
      Send message
    </button>
  );
}