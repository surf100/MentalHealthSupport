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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getDashboard, type DashboardResponse } from "../api/dashboard-api";

function formatMemberSince(createdAt?: string) {
  if (!createdAt) return "Not available";

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getInitials(name?: string) {
  if (!name) return "U";

  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 0) return "U";

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  return (parts[0][0] + parts[1][0]).toUpperCase();
}

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

        const message =
          err instanceof Error ? err.message : "Failed to load dashboard";
        setError(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center px-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-3">Loading dashboard...</h1>
            <p className="text-gray-600">
              Please wait while we load your account summary.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center px-8">
          <div className="max-w-md w-full border rounded-xl p-8 text-center">
            <h1 className="text-2xl font-semibold mb-3">Failed to load dashboard</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-800 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-10">
            <p className="text-sm text-gray-500 mb-3">SafeSpace Dashboard</p>
            <h1 className="text-5xl font-bold mb-3">Welcome back, {welcomeName}</h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Access your reports, community activity, knowledge resources, and
              account tools from one place.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <aside className="col-span-3">
              <div className="border rounded-xl p-6 sticky top-8">
                <h2 className="font-semibold mb-4">Quick Navigation</h2>

                <div className="space-y-2">
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full text-left px-4 py-3 rounded-md text-sm hover:bg-gray-50"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => navigate("/my-reports")}
                    className="w-full text-left px-4 py-3 rounded-md text-sm hover:bg-gray-50"
                  >
                    My Reports
                  </button>

                  <button
                    onClick={() => navigate("/notifications")}
                    className="w-full text-left px-4 py-3 rounded-md text-sm hover:bg-gray-50"
                  >
                    Notifications
                  </button>

                  <button
                    onClick={() => navigate("/achievements")}
                    className="w-full text-left px-4 py-3 rounded-md text-sm hover:bg-gray-50"
                  >
                    Achievements
                  </button>

                  <button
                    onClick={() => navigate("/settings")}
                    className="w-full text-left px-4 py-3 rounded-md text-sm hover:bg-gray-50"
                  >
                    Settings
                  </button>
                </div>
              </div>
            </aside>

            <section className="col-span-9 space-y-8">
              <div className="grid grid-cols-3 gap-6">
                <button
                  onClick={() => navigate("/my-reports")}
                  className="border rounded-xl p-6 text-left hover:shadow-md transition-all"
                >
                  <FileText className="w-6 h-6 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">My Reports</h3>
                  <p className="text-3xl font-bold mb-2">
                    {stats?.reportsCount ?? 0}
                  </p>
                  <p className="text-sm text-gray-600 leading-6">
                    Submitted reports visible in your personal dashboard space.
                  </p>
                </button>

                <button
                  onClick={() => navigate("/notifications")}
                  className="border rounded-xl p-6 text-left hover:shadow-md transition-all"
                >
                  <Bell className="w-6 h-6 text-emerald-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                  <p className="text-3xl font-bold mb-2">
                    {stats?.notificationsCount ?? 0}
                  </p>
                  <p className="text-sm text-gray-600 leading-6">
                    Replies, updates, and system alerts connected to your account.
                  </p>
                </button>

                <button
                  onClick={() => navigate("/achievements")}
                  className="border rounded-xl p-6 text-left hover:shadow-md transition-all"
                >
                  <Trophy className="w-6 h-6 text-amber-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Achievements</h3>
                  <p className="text-3xl font-bold mb-2">
                    {stats?.achievementsCount ?? 0}
                  </p>
                  <p className="text-sm text-gray-600 leading-6">
                    Recognition for positive participation and community activity.
                  </p>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="border rounded-xl p-8">
                  <h2 className="text-2xl font-semibold mb-5">Main Actions</h2>

                  <div className="space-y-4">
                    <button
                      onClick={() => navigate("/report")}
                      className="w-full bg-black text-white px-5 py-3 rounded-md hover:bg-gray-800 text-sm font-medium"
                    >
                      Submit Anonymous Report
                    </button>

                    <button
                      onClick={() => navigate("/forum")}
                      className="w-full border px-5 py-3 rounded-md hover:bg-gray-50 text-sm font-medium"
                    >
                      Open Support Forum
                    </button>

                    <button
                      onClick={() => navigate("/knowledge-base")}
                      className="w-full border px-5 py-3 rounded-md hover:bg-gray-50 text-sm font-medium"
                    >
                      Browse Knowledge Base
                    </button>

                    <button
                      onClick={() => navigate("/crisis-help")}
                      className="w-full border px-5 py-3 rounded-md hover:bg-gray-50 text-sm font-medium"
                    >
                      Crisis Help
                    </button>
                  </div>
                </div>

                <div className="border rounded-xl p-8 bg-gray-50">
                  <h2 className="text-2xl font-semibold mb-5">Recent Activity</h2>

                  {dashboard?.recentActivity?.length ? (
                    <div className="space-y-4">
                      {dashboard.recentActivity.map((activity, index) => (
                        <div
                          key={`${activity.type}-${activity.createdAt}-${index}`}
                          className="border rounded-lg p-4 bg-white"
                        >
                          <p className="text-sm text-gray-500 mb-1">
                            {activity.timestampLabel || "Recent"}
                          </p>
                          <p className="text-base font-medium text-gray-900 mb-1">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-700 leading-6">
                            {activity.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 bg-white">
                      <p className="text-sm text-gray-500 mb-1">No activity yet</p>
                      <p className="text-sm text-gray-700 leading-6">
                        Your recent updates will appear here once you start using
                        reports, notifications, or the forum.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-6">
                <div className="border rounded-xl p-6">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold mb-4">
                    {avatarInitials}
                  </div>
                  <h3 className="text-base font-semibold mb-2">Profile Summary</h3>
                  <p className="text-sm text-gray-700 leading-6">
                    <span className="font-medium">Nickname:</span>{" "}
                    {profile?.nickname || "Not set"}
                  </p>
                  <p className="text-sm text-gray-700 leading-6">
                    <span className="font-medium">Email:</span>{" "}
                    {profile?.email || "Not set"}
                  </p>
                  <p className="text-sm text-gray-700 leading-6">
                    <span className="font-medium">Member since:</span> {memberSince}
                  </p>
                </div>

                <button
                  onClick={() => navigate("/profile")}
                  className="border rounded-xl p-6 text-left hover:shadow-md transition-all"
                >
                  <User className="w-6 h-6 text-gray-700 mb-4" />
                  <h3 className="text-base font-semibold mb-2">Profile</h3>
                  <p className="text-sm text-gray-600 leading-6">
                    Manage your personal account space.
                  </p>
                </button>

                <button
                  onClick={() => navigate("/forum")}
                  className="border rounded-xl p-6 text-left hover:shadow-md transition-all"
                >
                  <HeartHandshake className="w-6 h-6 text-emerald-600 mb-4" />
                  <h3 className="text-base font-semibold mb-2">Forum</h3>
                  <p className="text-sm text-gray-600 leading-6">
                    Join moderated support discussions.
                  </p>
                </button>

                <button
                  onClick={() => navigate("/knowledge-base")}
                  className="border rounded-xl p-6 text-left hover:shadow-md transition-all"
                >
                  <BookOpen className="w-6 h-6 text-blue-600 mb-4" />
                  <h3 className="text-base font-semibold mb-2">Resources</h3>
                  <p className="text-sm text-gray-600 leading-6">
                    Read guides and educational articles.
                  </p>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-3">Community Summary</h3>
                  <p className="text-sm text-gray-700 leading-6">
                    <span className="font-medium">Posts:</span>{" "}
                    {stats?.postsCount ?? 0}
                  </p>
                  <p className="text-sm text-gray-700 leading-6">
                    <span className="font-medium">Notifications:</span>{" "}
                    {stats?.notificationsCount ?? 0}
                  </p>
                  <p className="text-sm text-gray-700 leading-6">
                    <span className="font-medium">Reports:</span>{" "}
                    {stats?.reportsCount ?? 0}
                  </p>
                </div>

                <button
                  onClick={() => navigate("/crisis-help")}
                  className="border rounded-xl p-6 text-left hover:shadow-md transition-all"
                >
                  <ShieldAlert className="w-6 h-6 text-red-600 mb-4" />
                  <h3 className="text-base font-semibold mb-2">Urgent Help</h3>
                  <p className="text-sm text-gray-600 leading-6">
                    Get immediate safety guidance and support.
                  </p>
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}