import { Link } from "react-router-dom";

const platformLinks = [
  { label: "Submit Report", to: "/report" },
  { label: "Support Forum", to: "/forum" },
  { label: "Knowledge Base", to: "/knowledge-base" },
  { label: "Crisis Help", to: "/crisis-help" },
];

const accountLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Profile", to: "/profile" },
  { label: "Achievements", to: "/achievements" },
  { label: "Settings", to: "/settings" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Community Guidelines", to: "/community-guidelines" },
  { label: "Contact", to: "/contact" },
];

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#274C77",
        borderTop: "1px solid rgba(244,235,219,0.18)",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <div
        className="mx-auto px-6 py-16 sm:px-10 lg:px-14"
        style={{ maxWidth: "1440px" }}
      >
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-sm text-sm font-black"
                style={{ backgroundColor: "#A3CEF1", color: "#274C77" }}
              >
                S
              </div>
              <span
                className="text-[22px] leading-none tracking-[-0.03em]"
                style={{
                  fontFamily: "DM Serif Display, serif",
                  color: "#F9F7F3",
                }}
              >
                SafeSpace
              </span>
            </Link>

            <p
              className="mt-5 max-w-xs text-[15px] leading-7 tracking-[-0.01em]"
              style={{ color: "rgba(244,235,219,0.70)" }}
            >
              A calm, student-first platform for speaking up, finding support,
              and building safer campus communities.
            </p>

            <div
              className="mt-6 inline-flex items-center gap-2 rounded-lg px-3 py-2"
              style={{
                backgroundColor: "rgba(244,235,219,0.16)",
                border: "1px solid rgba(244,235,219,0.25)",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                style={{ color: "#A3CEF1", flexShrink: 0 }}
              >
                <path
                  d="M1.5 6.5L5 10L11.5 3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="text-[12px] font-semibold"
                style={{ color: "#A3CEF1" }}
              >
                100% anonymous by design
              </span>
            </div>
          </div>

          <div>
            <h4
              className="text-[11px] font-bold uppercase tracking-[0.20em]"
              style={{ color: "rgba(244,235,219,0.85)" }}
            >
              Platform
            </h4>
            <ul className="mt-5 grid gap-3">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[15px] transition-colors"
                    style={{ color: "rgba(244,235,219,0.70)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#F9F7F3")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color =
                        "rgba(244,235,219,0.70)")
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-[11px] font-bold uppercase tracking-[0.20em]"
              style={{ color: "rgba(244,235,219,0.85)" }}
            >
              Account
            </h4>
            <ul className="mt-5 grid gap-3">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[15px] transition-colors"
                    style={{ color: "rgba(244,235,219,0.70)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#F9F7F3")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color =
                        "rgba(244,235,219,0.70)")
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-[11px] font-bold uppercase tracking-[0.20em]"
              style={{ color: "rgba(244,235,219,0.85)" }}
            >
              Legal
            </h4>
            <ul className="mt-5 grid gap-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[15px] transition-colors"
                    style={{ color: "rgba(244,235,219,0.70)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#F9F7F3")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color =
                        "rgba(244,235,219,0.70)")
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div
        className="px-6 py-5 sm:px-10 lg:px-14"
        style={{ borderTop: "1px solid rgba(244,235,219,0.14)" }}
      >
        <div
          className="mx-auto flex flex-col items-center justify-between gap-3 sm:flex-row"
          style={{ maxWidth: "1440px" }}
        >
          <p
            className="text-[13px]"
            style={{ color: "rgba(244,235,219,0.45)" }}
          >
            © {new Date().getFullYear()} SafeSpace. Built for safer student
            communities.
          </p>
          <div className="flex items-center gap-1">
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "#A3CEF1" }}
            />
            <p
              className="text-[13px]"
              style={{ color: "rgba(244,235,219,0.45)" }}
            >
              All reports are anonymous and encrypted
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}