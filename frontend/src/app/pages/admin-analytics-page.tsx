import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import {
  AlertTriangle,
  BarChart3,
  Clock,
  FileText,
  Users,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getAnalytics, type AdminAnalyticsResponse } from "../api/admin-api";

// ─── chart palette ─────────────────────────────────────────────────────────────
// Maps to the SafeSpace palette: Ice/FreshWater/DeepSlate + muted tones
const CATEGORY_COLORS = [
  "#274C77",
  "#6096BA",
  "#A3CEF1",
  "#6B8E9A",
  "#D6DCE1",
];

const STATUS_COLORS: Record<string, string> = {
  Submitted: "#6096BA",
  "In Review": "#274C77",
  Resolved: "#A3CEF1",
  Closed: "#D6DCE1",
};

// ─── skeleton ──────────────────────────────────────────────────────────────────

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className ?? ""}`}
      style={{ backgroundColor: "rgba(36,76,90,0.07)" }}
    />
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-6"
            style={{
              backgroundColor: "#fff",
              border: "1px solid rgba(36,76,90,0.10)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="h-5 w-5 rounded-md" />
            </div>
            <SkeletonBlock className="h-8 w-16 mb-2" />
            <SkeletonBlock className="h-3 w-32" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-5">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-6"
            style={{
              backgroundColor: "#fff",
              border: "1px solid rgba(36,76,90,0.10)",
            }}
          >
            <SkeletonBlock className="h-5 w-40 mb-6" />
            <SkeletonBlock className="h-[220px] w-full rounded-lg" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-6"
            style={{
              backgroundColor: "#fff",
              border: "1px solid rgba(36,76,90,0.10)",
            }}
          >
            <SkeletonBlock className="h-5 w-36 mb-6" />
            <SkeletonBlock className="h-[200px] w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  accentBar,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub?: string;
  accentBar?: string;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "#fff",
        border: "1px solid rgba(36,76,90,0.10)",
        boxShadow: "0 4px 20px rgba(36,76,90,0.07)",
      }}
    >
      {accentBar && (
        <div style={{ height: 3, backgroundColor: accentBar }} />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p
            className="font-sans font-semibold uppercase tracking-[0.14em]"
            style={{ fontSize: 11, color: "rgba(36,76,90,0.50)" }}
          >
            {label}
          </p>
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: 34,
              height: 34,
              backgroundColor: accentBar
                ? `${accentBar}18`
                : "rgba(153,211,223,0.20)",
            }}
          >
            {icon}
          </div>
        </div>
        <p
          className="font-display font-bold"
          style={{
            fontSize: 34,
            letterSpacing: "-0.04em",
            color: "#274C77",
            lineHeight: 1,
          }}
        >
          {value}
        </p>
        {sub && (
          <p
            className="font-sans mt-2"
            style={{ fontSize: 12, color: "rgba(36,76,90,0.45)" }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── chart card ────────────────────────────────────────────────────────────────

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-7"
      style={{
        backgroundColor: "#fff",
        border: "1px solid rgba(36,76,90,0.10)",
        boxShadow: "0 4px 20px rgba(36,76,90,0.07)",
      }}
    >
      <p
        className="font-sans font-semibold mb-6"
        style={{ fontSize: 14, color: "#274C77", letterSpacing: "-0.01em" }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

// ─── custom tooltip ────────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 font-sans"
      style={{
        backgroundColor: "#274C77",
        border: "none",
        boxShadow: "0 8px 24px rgba(36,76,90,0.25)",
      }}
    >
      {label && (
        <p style={{ fontSize: 11, color: "rgba(233,233,233,0.60)", marginBottom: 4 }}>
          {label}
        </p>
      )}
      {payload.map((p) => (
        <p key={p.name} style={{ fontSize: 13, color: "#F9F7F3", fontWeight: 600 }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// ─── component ─────────────────────────────────────────────────────────────────

export function AdminAnalyticsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<AdminAnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const result = await getAnalytics();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: "#F9F7F3", color: "#274C77" }}
    >
      <Header />

      {/* ── hero strip ── */}
      <div
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
        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-10 flex items-end justify-between gap-6">
          <div>
            <p
              className="font-sans font-bold uppercase tracking-[0.22em] mb-2"
              style={{ fontSize: 11, color: "rgba(36,76,90,0.60)" }}
            >
              Admin
            </p>
            <h1
              className="font-display leading-[1.05] tracking-[-0.04em]"
              style={{ fontSize: "clamp(30px, 4vw, 42px)", color: "#274C77" }}
            >
              Analytics Dashboard
            </h1>
            <p
              className="font-sans mt-2"
              style={{
                fontSize: 15,
                color: "rgba(36,76,90,0.65)",
                letterSpacing: "-0.01em",
                lineHeight: 1.75,
              }}
            >
              Platform trends, report analysis, and moderation risk indicators.
            </p>
          </div>

          {/* live indicator */}
          <div
            className="hidden md:flex items-center gap-2.5 rounded-full px-4 py-2 mb-1"
            style={{
              backgroundColor: "rgba(36,76,90,0.10)",
              border: "1px solid rgba(36,76,90,0.15)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#274C77" }}
            />
            <span
              className="font-sans font-semibold"
              style={{ fontSize: 12, color: "rgba(36,76,90,0.70)" }}
            >
              Live data
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-10">

          {/* ── loading ── */}
          {isLoading && <PageSkeleton />}

          {/* ── error ── */}
          {error && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div
                className="flex items-center justify-center rounded-2xl mb-5"
                style={{ width: 64, height: 64, backgroundColor: "rgba(36,76,90,0.08)" }}
              >
                <AlertTriangle className="w-7 h-7" style={{ color: "#274C77" }} />
              </div>
              <h2
                className="font-display tracking-[-0.03em] mb-2"
                style={{ fontSize: 24, color: "#274C77" }}
              >
                Failed to load analytics
              </h2>
              <p
                className="font-sans mb-6"
                style={{ fontSize: 14, color: "rgba(36,76,90,0.55)", maxWidth: 340 }}
              >
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 font-sans font-semibold rounded-sm px-5 py-2.5"
                style={{ fontSize: 14, backgroundColor: "#274C77", color: "#F9F7F3" }}
              >
                <RefreshCw className="w-4 h-4" />
                Try again
              </button>
            </div>
          )}

          {/* ── data ── */}
          {data && (
            <div className="space-y-6">

              {/* ── KPI row ── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                  icon={<FileText className="w-4 h-4" style={{ color: "#274C77" }} />}
                  label="Total Reports"
                  value={data.totalReports}
                  sub="All time submissions"
                  accentBar="#6096BA"
                />
                <StatCard
                  icon={<AlertTriangle className="w-4 h-4" style={{ color: "#274C77" }} />}
                  label="Critical Cases"
                  value={data.criticalReports + data.criticalForumPosts}
                  sub={`${data.criticalForumPosts} flagged in forum`}
                  accentBar="#274C77"
                />
                <StatCard
                  icon={<Clock className="w-4 h-4" style={{ color: "#274C77" }} />}
                  label="Pending Review"
                  value={data.pendingReports + data.pendingForumModeration}
                  sub={`${data.pendingForumModeration} forum posts waiting`}
                  accentBar="#A3CEF1"
                />
                <StatCard
                  icon={<Users className="w-4 h-4" style={{ color: "#274C77" }} />}
                  label="Total Users"
                  value={data.totalUsers}
                  sub={`${data.totalForumPosts} forum posts`}
                  accentBar="#D6DCE1"
                />
              </div>

              {/* ── area charts ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ChartCard title="Reports Over Time">
                  {data.reportsByDay.length === 0 ? (
                    <div
                      className="flex flex-col items-center justify-center rounded-xl"
                      style={{ height: 220, backgroundColor: "rgba(36,76,90,0.04)" }}
                    >
                      <BarChart3 className="w-6 h-6 mb-2" style={{ color: "rgba(36,76,90,0.25)" }} />
                      <p
                        className="font-sans"
                        style={{ fontSize: 13, color: "rgba(36,76,90,0.40)" }}
                      >
                        No data yet
                      </p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={data.reportsByDay}>
                        <defs>
                          <linearGradient id="reportGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6096BA" stopOpacity={0.30} />
                            <stop offset="95%" stopColor="#6096BA" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,76,90,0.07)" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11, fill: "rgba(36,76,90,0.50)", fontFamily: "DM Sans" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "rgba(36,76,90,0.50)", fontFamily: "DM Sans" }}
                          axisLine={false}
                          tickLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#6096BA"
                          strokeWidth={2}
                          fill="url(#reportGrad)"
                          name="Reports"
                          dot={false}
                          activeDot={{ r: 4, fill: "#274C77", strokeWidth: 0 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>

                <ChartCard title="User Registrations Over Time">
                  {data.registrationsByDay.length === 0 ? (
                    <div
                      className="flex flex-col items-center justify-center rounded-xl"
                      style={{ height: 220, backgroundColor: "rgba(36,76,90,0.04)" }}
                    >
                      <Users className="w-6 h-6 mb-2" style={{ color: "rgba(36,76,90,0.25)" }} />
                      <p
                        className="font-sans"
                        style={{ fontSize: 13, color: "rgba(36,76,90,0.40)" }}
                      >
                        No data yet
                      </p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={data.registrationsByDay}>
                        <defs>
                          <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#A3CEF1" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#A3CEF1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,76,90,0.07)" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11, fill: "rgba(36,76,90,0.50)", fontFamily: "DM Sans" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "rgba(36,76,90,0.50)", fontFamily: "DM Sans" }}
                          axisLine={false}
                          tickLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#A3CEF1"
                          strokeWidth={2}
                          fill="url(#regGrad)"
                          name="Registrations"
                          dot={false}
                          activeDot={{ r: 4, fill: "#274C77", strokeWidth: 0 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>
              </div>

              {/* ── bottom row ── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* category bar chart */}
                <ChartCard title="Reports by Category">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data.reportsByCategory} layout="vertical">
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(36,76,90,0.07)"
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 11, fill: "rgba(36,76,90,0.50)", fontFamily: "DM Sans" }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <YAxis
                        dataKey="category"
                        type="category"
                        tick={{ fontSize: 11, fill: "rgba(36,76,90,0.60)", fontFamily: "DM Sans" }}
                        axisLine={false}
                        tickLine={false}
                        width={90}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" name="Reports" radius={[0, 4, 4, 0]}>
                        {data.reportsByCategory.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                {/* status pie chart */}
                <ChartCard title="Reports by Status">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={data.reportsByStatus.filter((s) => s.count > 0)}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={75}
                        innerRadius={32}
                        paddingAngle={2}
                        label={({ status, percent }) =>
                          `${status} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {data.reportsByStatus
                          .filter((s) => s.count > 0)
                          .map((entry) => (
                            <Cell
                              key={entry.status}
                              fill={STATUS_COLORS[entry.status] ?? "#D6DCE1"}
                            />
                          ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* legend */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    {data.reportsByStatus
                      .filter((s) => s.count > 0)
                      .map((entry) => (
                        <div key={entry.status} className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor:
                                STATUS_COLORS[entry.status] ?? "#D6DCE1",
                            }}
                          />
                          <span
                            className="font-sans"
                            style={{ fontSize: 11, color: "rgba(36,76,90,0.60)" }}
                          >
                            {entry.status}
                          </span>
                        </div>
                      ))}
                  </div>
                </ChartCard>

                {/* forum risk panel */}
                <ChartCard title="Forum Risk Indicators">
                  <div className="space-y-3">
                    {/* critical */}
                    <div
                      className="flex items-center justify-between rounded-xl px-4 py-3"
                      style={{
                        backgroundColor: "rgba(36,76,90,0.06)",
                        border: "1px solid rgba(36,76,90,0.10)",
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex items-center justify-center rounded-lg"
                          style={{
                            width: 28,
                            height: 28,
                            backgroundColor: "rgba(36,76,90,0.10)",
                          }}
                        >
                          <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#274C77" }} />
                        </div>
                        <span
                          className="font-sans font-medium"
                          style={{ fontSize: 13, color: "#274C77" }}
                        >
                          Critical posts
                        </span>
                      </div>
                      <span
                        className="font-display font-bold"
                        style={{ fontSize: 20, color: "#274C77", letterSpacing: "-0.03em" }}
                      >
                        {data.criticalForumPosts}
                      </span>
                    </div>

                    {/* pending */}
                    <div
                      className="flex items-center justify-between rounded-xl px-4 py-3"
                      style={{
                        backgroundColor: "rgba(136,187,214,0.12)",
                        border: "1px solid rgba(136,187,214,0.25)",
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex items-center justify-center rounded-lg"
                          style={{
                            width: 28,
                            height: 28,
                            backgroundColor: "rgba(136,187,214,0.20)",
                          }}
                        >
                          <Clock className="w-3.5 h-3.5" style={{ color: "#274C77" }} />
                        </div>
                        <span
                          className="font-sans font-medium"
                          style={{ fontSize: 13, color: "#274C77" }}
                        >
                          Pending moderation
                        </span>
                      </div>
                      <span
                        className="font-display font-bold"
                        style={{ fontSize: 20, color: "#274C77", letterSpacing: "-0.03em" }}
                      >
                        {data.pendingForumModeration}
                      </span>
                    </div>

                    {/* flagged */}
                    <div
                      className="flex items-center justify-between rounded-xl px-4 py-3"
                      style={{
                        backgroundColor: "rgba(153,211,223,0.18)",
                        border: "1px solid rgba(153,211,223,0.35)",
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex items-center justify-center rounded-lg"
                          style={{
                            width: 28,
                            height: 28,
                            backgroundColor: "rgba(153,211,223,0.25)",
                          }}
                        >
                          <MessageSquare className="w-3.5 h-3.5" style={{ color: "#274C77" }} />
                        </div>
                        <span
                          className="font-sans font-medium"
                          style={{ fontSize: 13, color: "#274C77" }}
                        >
                          Flagged posts
                        </span>
                      </div>
                      <span
                        className="font-display font-bold"
                        style={{ fontSize: 20, color: "#274C77", letterSpacing: "-0.03em" }}
                      >
                        {data.flaggedForumPosts}
                      </span>
                    </div>

                    {/* escalations */}
                    <div
                      className="flex items-center justify-between rounded-xl px-4 py-3"
                      style={{
                        backgroundColor: "rgba(36,76,90,0.04)",
                        border: "1px solid rgba(205,205,205,0.70)",
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex items-center justify-center rounded-lg"
                          style={{
                            width: 28,
                            height: 28,
                            backgroundColor: "rgba(205,205,205,0.40)",
                          }}
                        >
                          <Users className="w-3.5 h-3.5" style={{ color: "#274C77" }} />
                        </div>
                        <span
                          className="font-sans font-medium"
                          style={{ fontSize: 13, color: "#274C77" }}
                        >
                          Specialist escalations
                        </span>
                      </div>
                      <span
                        className="font-display font-bold"
                        style={{ fontSize: 20, color: "#274C77", letterSpacing: "-0.03em" }}
                      >
                        {data.specialistEscalations}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate("/admin/forum-risk")}
                      className="w-full mt-1 font-sans font-semibold rounded-sm py-3 flex items-center justify-center gap-2"
                      style={{
                        fontSize: 13,
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
                      Open Moderation Queue
                    </button>
                  </div>
                </ChartCard>

              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}