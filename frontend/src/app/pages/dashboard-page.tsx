import { Footer } from "../components/footer";
import { Header } from "../components/header";
import {
  Bell,
  BookOpen,
  FileText,
  HeartHandshake,
  ShieldAlert,
  Trophy,
  User,
  Settings,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getDashboard, type DashboardResponse } from "../api/dashboard-api";

// ─── Helpers (unchanged) ───────────────────────────────────────────────────

function formatMemberSince(createdAt?: string) {
  if (!createdAt) return "Not available";
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
}

function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// ─── Skeleton loader ──────────────────────────────────────────────────────

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className ?? ""}`}
      style={{ backgroundColor: "rgba(36,76,90,0.07)" }}
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F6F8F9" }}>
      <Header />
      <main className="flex-1">
        {/* greeting strip */}
        <div style={{ backgroundColor: "#F9F7F3" }} className="px-8 py-10">
          <div className="max-w-7xl mx-auto">
            <SkeletonBlock className="h-4 w-32 mb-3" />
            <SkeletonBlock className="h-10 w-72 mb-2" />
            <SkeletonBlock className="h-4 w-96" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-12 gap-8">
          <div className="col-span-3 space-y-3">
            {[...Array(5)].map((_, i) => <SkeletonBlock key={i} className="h-10" />)}
          </div>
          <div className="col-span-9 space-y-6">
            <div className="grid grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => <SkeletonBlock key={i} className="h-32" />)}
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[...Array(2)].map((_, i) => <SkeletonBlock key={i} className="h-48" />)}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Nav item ─────────────────────────────────────────────────────────────

function NavItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all"
      style={{
        backgroundColor: hovered ? "rgba(136,187,214,0.10)" : "transparent",
        color: hovered ? "#6096BA" : "#274C77",
      }}
    >
      <Icon size={15} strokeWidth={1.8} />
      <span className="text-[13px] font-medium tracking-[-0.01em]">{label}</span>
    </button>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  accent,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  description: string;
  accent: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="text-left rounded-xl overflow-hidden transition-all"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid rgba(36,76,90,0.08)",
        boxShadow: hovered
          ? "0 8px 32px rgba(36,76,90,0.12)"
          : "0 2px 8px rgba(36,76,90,0.06)",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      {/* accent bar */}
      <div className="h-1" style={{ backgroundColor: accent }} />
      <div className="p-5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
          style={{ backgroundColor: `${accent}18` }}
        >
          <Icon size={17} style={{ color: accent }} strokeWidth={1.8} />
        </div>
        <p
          className="text-[11px] font-bold uppercase tracking-[0.18em] mb-1"
          style={{ color: "rgba(36,76,90,0.45)" }}
        >
          {label}
        </p>
        <p
          className="text-[32px] font-bold tracking-[-0.04em] mb-1"
          style={{ fontFamily: "DM Serif Display, serif", color: "#274C77" }}
        >
          {value}
        </p>
        <p className="text-[13px] leading-[1.55]" style={{ color: "rgba(36,76,90,0.55)" }}>
          {description}
        </p>
      </div>
    </button>
  );
}

// ─── Quick action button ──────────────────────────────────────────────────

function QuickAction({
  icon: Icon,
  label,
  description,
  onClick,
  primary,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  onClick: () => void;
  primary?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-start gap-3 p-4 rounded-xl text-left transition-all w-full"
      style={{
        backgroundColor: primary
          ? hovered ? "#274C77" : "#6096BA"
          : hovered ? "rgba(136,187,214,0.07)" : "rgba(36,76,90,0.03)",
        border: primary ? "none" : "1px solid rgba(36,76,90,0.08)",
        color: primary ? "#ffffff" : "#274C77",
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{
          backgroundColor: primary ? "rgba(255,255,255,0.15)" : "rgba(136,187,214,0.12)",
        }}
      >
        <Icon size={15} style={{ color: primary ? "#ffffff" : "#6096BA" }} strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-[13px] font-semibold mb-0.5">{label}</p>
        <p
          className="text-[12px] leading-[1.5]"
          style={{ color: primary ? "rgba(255,255,255,0.70)" : "rgba(36,76,90,0.50)" }}
        >
          {description}
        </p>
      </div>
    </button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getDashboard();
        if (!isMounted) return;
        setDashboard(data);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadDashboard();
    return () => { isMounted = false; };
  }, []);

  const profile = dashboard?.profile;
  const stats = dashboard?.stats;

  const welcomeName = useMemo(() => {
    if (dashboard?.welcomeName?.trim()) return dashboard.welcomeName;
    if (profile?.nickname?.trim()) return profile.nickname;
    return "User";
  }, [dashboard?.welcomeName, profile?.nickname]);

  const memberSince = formatMemberSince(profile?.createdAt);
  const avatarInitials = getInitials(profile?.nickname || dashboard?.welcomeName);

  // ── Loading ──
  if (isLoading) return <DashboardSkeleton />;

  // ── Error ──
  if (error) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F6F8F9" }}>
        <Header />
        <main className="flex-1 flex items-center justify-center px-8">
          <div
            className="max-w-md w-full rounded-2xl p-10 text-center"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(36,76,90,0.08)",
              boxShadow: "0 8px 40px rgba(36,76,90,0.10)",
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: "rgba(239,68,68,0.08)" }}
            >
              <ShieldAlert size={22} style={{ color: "#dc2626" }} />
            </div>
            <h1
              className="text-[22px] tracking-[-0.03em] mb-2"
              style={{ fontFamily: "DM Serif Display, serif", color: "#274C77" }}
            >
              Failed to load dashboard
            </h1>
            <p className="text-[14px] mb-6" style={{ color: "rgba(36,76,90,0.55)" }}>
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-sm text-[13px] font-semibold text-white transition-colors"
              style={{ backgroundColor: "#6096BA" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#274C77")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6096BA")}
            >
              Try again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F6F8F9", fontFamily: "DM Sans, sans-serif" }}>
      <Header />

      {/* ── Hero greeting strip ── */}
      <div
        className="relative overflow-hidden"
        style={{ backgroundColor: "#F9F7F3" }}
      >
        {/* dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.10,
            backgroundImage: "radial-gradient(#6096BA 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-10 flex items-center justify-between">
          <div>
            <p
              className="text-[11px] font-bold uppercase tracking-[0.22em] mb-2"
              style={{ color: "#6096BA" }}
            >
              SafeSpace Dashboard
            </p>
            <h1
              className="text-[38px] leading-[1.1] tracking-[-0.04em] mb-2"
              style={{ fontFamily: "DM Serif Display, serif", color: "#274C77" }}
            >
              Welcome back, {welcomeName}
            </h1>
            <p className="text-[15px] leading-[1.6]" style={{ color: "rgba(36,76,90,0.60)" }}>
              Here's a summary of your activity and quick access to all tools.
            </p>
          </div>

          {/* Avatar + meta */}
          <div
            className="hidden lg:flex items-center gap-4 rounded-xl px-5 py-4 shrink-0"
            style={{
              backgroundColor: "rgba(255,255,255,0.50)",
              border: "1px solid rgba(136,187,214,0.18)",
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-[16px] font-bold shrink-0"
              style={{ backgroundColor: "#6096BA", color: "#ffffff" }}
            >
              {avatarInitials}
            </div>
            <div>
              <p className="text-[14px] font-semibold" style={{ color: "#274C77" }}>
                {profile?.nickname || "User"}
              </p>
              <p className="text-[12px]" style={{ color: "rgba(36,76,90,0.50)" }}>
                Member since {memberSince}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="grid grid-cols-12 gap-8">

            {/* ── Sidebar ── */}
            <aside className="col-span-3">
              <div
                className="rounded-2xl p-4 sticky top-6"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(36,76,90,0.08)",
                  boxShadow: "0 2px 8px rgba(36,76,90,0.06)",
                }}
              >
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.18em] px-3 mb-3"
                  style={{ color: "rgba(36,76,90,0.35)" }}
                >
                  Navigation
                </p>
                <nav className="space-y-0.5">
                  <NavItem icon={User} label="Profile" onClick={() => navigate("/profile")} />
                  <NavItem icon={FileText} label="My Reports" onClick={() => navigate("/my-reports")} />
                  <NavItem icon={Bell} label="Notifications" onClick={() => navigate("/notifications")} />
                  <NavItem icon={Trophy} label="Achievements" onClick={() => navigate("/achievements")} />
                  <NavItem icon={HeartHandshake} label="Forum" onClick={() => navigate("/forum")} />
                  <NavItem icon={BookOpen} label="Knowledge Base" onClick={() => navigate("/knowledge-base")} />
                  <NavItem icon={Settings} label="Settings" onClick={() => navigate("/settings")} />
                </nav>

                {/* Crisis help — always visible in sidebar */}
                <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(36,76,90,0.08)" }}>
                  <button
                    onClick={() => navigate("/crisis-help")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all"
                    style={{ backgroundColor: "rgba(239,68,68,0.07)", color: "#dc2626" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.12)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.07)")}
                  >
                    <ShieldAlert size={15} strokeWidth={1.8} />
                    <span className="text-[13px] font-semibold">Crisis Help</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* ── Main content ── */}
            <section className="col-span-9 space-y-6">

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-5">
                <StatCard
                  icon={FileText}
                  label="My Reports"
                  value={stats?.reportsCount ?? 0}
                  description="Submitted anonymous reports in your account."
                  accent="#6096BA"
                  onClick={() => navigate("/my-reports")}
                />
                <StatCard
                  icon={Bell}
                  label="Notifications"
                  value={stats?.notificationsCount ?? 0}
                  description="Unread updates and system alerts."
                  accent="#F9F7F3"
                  onClick={() => navigate("/notifications")}
                />
                <StatCard
                  icon={Trophy}
                  label="Achievements"
                  value={stats?.achievementsCount ?? 0}
                  description="Earned for positive community activity."
                  accent="#f59e0b"
                  onClick={() => navigate("/achievements")}
                />
              </div>

              {/* Anonymity banner */}
              <div
                className="flex items-center gap-4 rounded-xl px-5 py-4"
                style={{
                  backgroundColor: "rgba(198,209,102,0.25)",
                  border: "1px solid rgba(136,187,214,0.18)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#6096BA" }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7.5L5.5 10.5L11.5 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-[13px] leading-[1.55]" style={{ color: "#274C77" }}>
                  <span className="font-semibold">Your identity is always protected.</span>{" "}
                  <span style={{ opacity: 0.65 }}>All reports are fully anonymised before reaching any moderator. We never link your account to your submissions.</span>
                </p>
              </div>

              {/* Quick actions + Recent activity */}
              <div className="grid grid-cols-2 gap-6">

                {/* Quick actions */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid rgba(36,76,90,0.08)",
                    boxShadow: "0 2px 8px rgba(36,76,90,0.06)",
                  }}
                >
                  <h2
                    className="text-[17px] tracking-[-0.02em] font-semibold mb-5"
                    style={{ color: "#274C77" }}
                  >
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-2 gap-2.5">
                    <QuickAction
                      icon={FileText}
                      label="Submit Report"
                      description="Anonymous & encrypted"
                      onClick={() => navigate("/report")}
                      primary
                    />
                    <QuickAction
                      icon={HeartHandshake}
                      label="Support Forum"
                      description="Join peer discussions"
                      onClick={() => navigate("/forum")}
                    />
                    <QuickAction
                      icon={BookOpen}
                      label="Knowledge Base"
                      description="Guides & resources"
                      onClick={() => navigate("/knowledge-base")}
                    />
                    <QuickAction
                      icon={ShieldAlert}
                      label="Crisis Help"
                      description="Immediate support"
                      onClick={() => navigate("/crisis-help")}
                    />
                  </div>
                </div>

                {/* Recent activity */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid rgba(36,76,90,0.08)",
                    boxShadow: "0 2px 8px rgba(36,76,90,0.06)",
                  }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <h2
                      className="text-[17px] tracking-[-0.02em] font-semibold"
                      style={{ color: "#274C77" }}
                    >
                      Recent Activity
                    </h2>
                    {(dashboard?.recentActivity?.length ?? 0) > 0 && (
                      <button
                        onClick={() => navigate("/my-reports")}
                        className="text-[12px] font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
                        style={{ color: "#6096BA" }}
                      >
                        View all <ChevronRight size={12} />
                      </button>
                    )}
                  </div>

                  {dashboard?.recentActivity?.length ? (
                    <div className="space-y-3">
                      {dashboard.recentActivity.slice(0, 3).map((activity, index) => (
                        <div
                          key={`${activity.type}-${activity.createdAt}-${index}`}
                          className="flex gap-3 p-3 rounded-xl"
                          style={{ backgroundColor: "#F6F8F9" }}
                        >
                          <div
                            className="w-1.5 rounded-full shrink-0 self-stretch"
                            style={{ backgroundColor: "#F9F7F3" }}
                          />
                          <div>
                            <p
                              className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-0.5"
                              style={{ color: "rgba(36,76,90,0.40)" }}
                            >
                              {activity.timestampLabel || "Recent"}
                            </p>
                            <p className="text-[13px] font-semibold mb-0.5" style={{ color: "#274C77" }}>
                              {activity.title}
                            </p>
                            <p className="text-[12px] leading-[1.5]" style={{ color: "rgba(36,76,90,0.55)" }}>
                              {activity.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                        style={{ backgroundColor: "rgba(198,209,102,0.30)" }}
                      >
                        <Sparkles size={20} style={{ color: "#6096BA" }} strokeWidth={1.5} />
                      </div>
                      <p className="text-[14px] font-semibold mb-1" style={{ color: "#274C77" }}>
                        No activity yet
                      </p>
                      <p className="text-[12px] leading-[1.6] max-w-[180px]" style={{ color: "rgba(36,76,90,0.50)" }}>
                        Your updates will appear here once you start using reports or the forum.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Community stats + Profile summary */}
              <div className="grid grid-cols-3 gap-5">

                {/* Community stats */}
                <div
                  className="col-span-2 rounded-2xl p-6"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid rgba(36,76,90,0.08)",
                    boxShadow: "0 2px 8px rgba(36,76,90,0.06)",
                  }}
                >
                  <h2
                    className="text-[17px] tracking-[-0.02em] font-semibold mb-5"
                    style={{ color: "#274C77" }}
                  >
                    Your Contributions
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Forum Posts", value: stats?.postsCount ?? 0, accent: "#6096BA" },
                      { label: "Reports", value: stats?.reportsCount ?? 0, accent: "#F9F7F3" },
                      { label: "Notifications", value: stats?.notificationsCount ?? 0, accent: "#f59e0b" },
                    ].map(({ label, value, accent }) => (
                      <div
                        key={label}
                        className="rounded-xl p-4 text-center"
                        style={{ backgroundColor: "#F6F8F9" }}
                      >
                        <p
                          className="text-[26px] font-bold tracking-[-0.04em]"
                          style={{ fontFamily: "DM Serif Display, serif", color: accent }}
                        >
                          {value}
                        </p>
                        <p className="text-[12px] mt-0.5" style={{ color: "rgba(36,76,90,0.50)" }}>
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Profile summary */}
                <div
                  className="rounded-2xl p-6 flex flex-col justify-between"
                  style={{
                    backgroundColor: "#274C77",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold mb-4"
                      style={{ backgroundColor: "#6096BA", color: "#ffffff" }}
                    >
                      {avatarInitials}
                    </div>
                    <p className="text-[15px] font-semibold mb-0.5" style={{ color: "#ffffff" }}>
                      {profile?.nickname || "Not set"}
                    </p>
                    <p className="text-[12px] mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {profile?.email || "No email"}
                    </p>
                    <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                      Since {memberSince}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/profile")}
                    className="mt-5 w-full flex items-center justify-center gap-1.5 py-2 rounded-sm text-[12px] font-semibold transition-all"
                    style={{
                      backgroundColor: "rgba(198,209,102,0.15)",
                      color: "#F9F7F3",
                      border: "1px solid rgba(198,209,102,0.20)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(198,209,102,0.22)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(198,209,102,0.15)")}
                  >
                    Edit Profile <ChevronRight size={11} />
                  </button>
                </div>
              </div>

            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}