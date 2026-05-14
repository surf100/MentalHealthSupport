import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth-context";

const publicNavLinks = [
  { label: "Report", to: "/report" },
  { label: "Support Forum", to: "/forum" },
  { label: "Knowledge Base", to: "/knowledge-base" },
  { label: "Crisis Help", to: "/crisis-help" },
];

const adminNavLinks = [
  { label: "Analytics", to: "/admin/analytics" },
  { label: "Users", to: "/admin/users" },
  { label: "Forum Risk", to: "/admin/forum-risk" },
  { label: "Audit Log", to: "/admin/audit-log" },
];

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAdmin =
    user?.role === "ADMIN" ||
    user?.role === "MODERATOR" ||
    user?.role === "SPECIALIST";

  const navLinks = isAdmin ? adminNavLinks : publicNavLinks;

  function getInitials(name?: string | null) {
    if (!name) return "U";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  const handleLogout = () => {
    logout();
    navigate("/");
    setUserMenuOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: "rgba(233,233,233,0.96)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(36,76,90,0.14)",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <div
        className="mx-auto flex h-[68px] items-center justify-between px-6 sm:px-10 lg:px-14"
        style={{ maxWidth: "1440px" }}
      >
        {/* logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#6096BA] text-base font-black text-white">
            S
          </div>
          <span className="font-display text-[24px] font-bold leading-none tracking-[-0.03em] text-[#274C77]">
            SafeSpace
          </span>
          {/* admin badge */}
          {isAdmin && (
            <span
              className="hidden lg:inline-flex items-center rounded-full px-2.5 py-0.5 font-sans font-bold uppercase tracking-[0.14em]"
              style={{
                fontSize: 10,
                backgroundColor: "rgba(36,76,90,0.10)",
                color: "rgba(36,76,90,0.60)",
                border: "1px solid rgba(36,76,90,0.14)",
              }}
            >
              {user?.role?.toLowerCase()}
            </span>
          )}
        </Link>

        {/* desktop nav */}
        <div className="hidden items-center gap-10 lg:flex">
          <nav className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-[15px] font-medium transition-colors"
                style={{ color: "rgba(36,76,90,0.68)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#274C77")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(36,76,90,0.68)")
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="text-[14px] font-semibold px-4 py-2 transition-colors"
                style={{ color: "rgba(36,76,90,0.72)" }}
              >
                Dashboard
              </Link>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-sm px-3 py-1.5 transition-all"
                  style={{
                    backgroundColor: userMenuOpen
                      ? "rgba(136,187,214,0.35)"
                      : "rgba(153,211,223,0.30)",
                    border: "1px solid rgba(36,76,90,0.16)",
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
                    style={{ backgroundColor: "#274C77", color: "#F9F7F3" }}
                  >
                    {getInitials(user.displayName || user.nickname)}
                  </div>
                  <span
                    className="text-[13px] font-semibold max-w-[100px] truncate"
                    style={{ color: "#274C77" }}
                  >
                    {user.nickname || user.displayName || "Account"}
                  </span>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden"
                    style={{
                      backgroundColor: "#F9F7F3",
                      border: "1px solid rgba(36,76,90,0.14)",
                      boxShadow: "0 8px 32px rgba(36,76,90,0.14)",
                    }}
                  >
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-[13px] font-medium"
                      style={{ color: "#274C77" }}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-[13px] font-medium"
                      style={{ color: "#274C77" }}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-[13px] font-medium"
                      style={{ color: "#274C77" }}
                    >
                      Settings
                    </Link>
                    {/* admin shortcuts in dropdown */}
                    {isAdmin && (
                      <>
                        <div
                          className="mx-4 my-1"
                          style={{ height: 1, backgroundColor: "rgba(36,76,90,0.10)" }}
                        />
                        <Link
                          to="/admin/analytics"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-[13px] font-medium"
                          style={{ color: "rgba(36,76,90,0.60)" }}
                        >
                          Admin Panel
                        </Link>
                      </>
                    )}
                    <div
                      className="mx-4 my-1"
                      style={{ height: 1, backgroundColor: "rgba(36,76,90,0.10)" }}
                    />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-[13px] font-medium"
                      style={{ color: "#274C77" }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/sign-in"
                className="px-5 py-2.5 text-[14px] font-semibold transition-colors"
                style={{ color: "rgba(36,76,90,0.72)" }}
              >
                Sign in
              </Link>
              <Link
                to="/sign-up"
                className="rounded-sm px-5 py-2.5 text-[14px] font-semibold transition-colors"
                style={{ backgroundColor: "#274C77", color: "#F9F7F3" }}
              >
                Get started
              </Link>
            </div>
          )}
        </div>

        {/* mobile controls */}
        <div className="flex items-center gap-3 lg:hidden">
          {!user && (
            <Link
              to="/sign-up"
              className="rounded-sm px-4 py-2 text-sm font-semibold"
              style={{ backgroundColor: "#274C77", color: "#F9F7F3" }}
            >
              Sign up
            </Link>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-sm"
            style={{ color: "#274C77" }}
          >
            ☰
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div
          className="lg:hidden px-6 pb-5 pt-2"
          style={{ borderTop: "1px solid rgba(36,76,90,0.14)" }}
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[15px] font-medium"
                style={{ color: "#274C77" }}
              >
                {link.label}
              </Link>
            ))}
            {/* show dashboard link in mobile menu when logged in */}
            {user && (
              <>
                <div
                  className="my-1 mx-1"
                  style={{ height: 1, backgroundColor: "rgba(36,76,90,0.10)" }}
                />
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-[15px] font-medium"
                  style={{ color: "rgba(36,76,90,0.70)" }}
                >
                  Dashboard
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}