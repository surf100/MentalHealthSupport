import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import {
  AlertTriangle,
  BarChart3,
  Clock,
  FileText,
  Users,
  MessageSquare,
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

const CATEGORY_COLORS = ["#ef4444", "#f97316", "#3b82f6", "#8b5cf6", "#6b7280"];
const STATUS_COLORS: Record<string, string> = {
  Submitted: "#f59e0b",
  "In Review": "#3b82f6",
  Resolved: "#10b981",
  Closed: "#6b7280",
};

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className={`border rounded-xl p-6 ${accent ?? ""}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">{label}</p>
        {icon}
      </div>
      <p className="text-3xl font-bold">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-xl p-6">
      <h3 className="font-semibold mb-5">{title}</h3>
      {children}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border rounded-xl p-6 h-28 animate-pulse bg-gray-50" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="border rounded-xl p-6 h-64 animate-pulse bg-gray-50" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-xl p-6 h-56 animate-pulse bg-gray-50" />
        ))}
      </div>
    </div>
  );
}

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
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-6 h-6" />
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            </div>
            <p className="text-gray-500 text-sm">
              Platform trends, report analysis, and moderator risk indicators.
            </p>
          </div>

          {isLoading && <Skeleton />}

          {error && (
            <div className="border border-red-200 bg-red-50 rounded-xl p-8 text-center">
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-black text-white px-5 py-2.5 rounded-md text-sm hover:bg-gray-800"
              >
                Retry
              </button>
            </div>
          )}

          {data && (
            <div className="space-y-8">
              <div className="grid grid-cols-4 gap-6">
                <StatCard
                  icon={<FileText className="w-5 h-5 text-blue-500" />}
                  label="Total Reports"
                  value={data.totalReports}
                  sub="All time submissions"
                />
                <StatCard
                  icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
                  label="Critical Cases"
                  value={data.criticalReports + data.criticalForumPosts}
                  sub={`${data.criticalForumPosts} flagged in forum`}
                  accent="border-red-200 bg-red-50"
                />
                <StatCard
                  icon={<Clock className="w-5 h-5 text-amber-500" />}
                  label="Pending Review"
                  value={data.pendingReports + data.pendingForumModeration}
                  sub={`${data.pendingForumModeration} forum posts waiting`}
                />
                <StatCard
                  icon={<Users className="w-5 h-5 text-emerald-500" />}
                  label="Total Users"
                  value={data.totalUsers}
                  sub={`${data.totalForumPosts} forum posts`}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <ChartCard title="Reports Over Time">
                  {data.reportsByDay.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-10">No data yet</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={data.reportsByDay}>
                        <defs>
                          <linearGradient id="reportGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          fill="url(#reportGrad)"
                          name="Reports"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>

                <ChartCard title="User Registrations Over Time">
                  {data.registrationsByDay.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-10">No data yet</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={data.registrationsByDay}>
                        <defs>
                          <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#10b981"
                          strokeWidth={2}
                          fill="url(#regGrad)"
                          name="Registrations"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <ChartCard title="Reports by Category">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data.reportsByCategory} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                      <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={90} />
                      <Tooltip />
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
                              fill={STATUS_COLORS[entry.status] ?? "#6b7280"}
                            />
                          ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Forum Risk Indicators">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-100">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="text-sm font-medium">Critical forum posts</span>
                      </div>
                      <span className="text-lg font-bold text-red-600">
                        {data.criticalForumPosts}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-100">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="text-sm font-medium">Pending moderation</span>
                      </div>
                      <span className="text-lg font-bold text-amber-600">
                        {data.pendingForumModeration}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-100">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="text-sm font-medium">Open flagged posts</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        {data.flaggedForumPosts}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-sm font-medium">Specialist escalations</span>
                      </div>
                      <span className="text-lg font-bold text-emerald-600">
                        {data.specialistEscalations}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate("/admin/forum-risk")}
                      className="w-full mt-2 bg-black text-white py-2.5 rounded-lg text-sm hover:bg-gray-800"
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
