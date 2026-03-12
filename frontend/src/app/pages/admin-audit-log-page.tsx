import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Activity, Search, ShieldCheck, UserCog } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAuditLog, type AuditLogResponse } from "../api/admin-api";

function getActionBadge(action: string) {
  switch (action) {
    case "USER_BANNED":
      return "bg-red-50 text-red-700";
    case "USER_UNBANNED":
      return "bg-emerald-50 text-emerald-700";
    case "ROLE_CHANGED":
      return "bg-blue-50 text-blue-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
}

function getActionLabel(action: string) {
  switch (action) {
    case "USER_BANNED":
      return "User Banned";
    case "USER_UNBANNED":
      return "User Unbanned";
    case "ROLE_CHANGED":
      return "Role Changed";
    default:
      return action;
  }
}

function formatDate(isoString: string) {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function AdminAuditLogPage() {
  const [logs, setLogs] = useState<AuditLogResponse[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getAuditLog();
        setLogs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load audit log");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredLogs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter(
      (log) =>
        (log.actorEmail ?? "").toLowerCase().includes(q) ||
        (log.action ?? "").toLowerCase().includes(q) ||
        (log.target ?? "").toLowerCase().includes(q) ||
        (log.details ?? "").toLowerCase().includes(q)
    );
  }, [query, logs]);

  const accountActions = logs.filter((l) =>
    ["USER_BANNED", "USER_UNBANNED", "ROLE_CHANGED"].includes(l.action)
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-10">
            <h1 className="text-5xl font-bold mb-3">Admin Audit Log</h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Review important admin and moderation actions across the SafeSpace
              platform.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <aside className="col-span-3">
              <div className="border rounded-xl p-6 sticky top-8">
                <h2 className="font-semibold mb-4">Overview</h2>

                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Total log entries</p>
                    <p className="text-2xl font-bold mt-1">
                      {loading ? "—" : logs.length}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Account actions</p>
                    <p className="text-2xl font-bold mt-1">
                      {loading ? "—" : accountActions}
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            <section className="col-span-9">
              <div className="flex items-center gap-3 border px-4 py-3 rounded-xl mb-6">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by actor, action, target, or details"
                  className="w-full outline-none text-sm"
                />
              </div>

              {loading ? (
                <div className="border rounded-xl p-10 text-center text-gray-500 text-sm">
                  Loading audit log...
                </div>
              ) : error ? (
                <div className="border rounded-xl p-10 text-center">
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              ) : (
                <div className="border rounded-xl overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b text-sm font-medium text-gray-600">
                    <div className="col-span-3">Actor</div>
                    <div className="col-span-3">Action</div>
                    <div className="col-span-2">Target</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Details</div>
                  </div>

                  {filteredLogs.length === 0 ? (
                    <div className="p-10 text-center">
                      <h3 className="text-xl font-semibold mb-2">No log entries found</h3>
                      <p className="text-sm text-gray-600">
                        Try searching with different keywords.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredLogs.map((log) => (
                        <div
                          key={log.id}
                          className="grid grid-cols-12 gap-4 px-6 py-5 items-start"
                        >
                          <div className="col-span-3">
                            <p className="font-medium text-gray-900 text-sm">{log.actorEmail}</p>
                          </div>

                          <div className="col-span-3">
                            <span className={`text-xs px-3 py-1 rounded-full ${getActionBadge(log.action)}`}>
                              {getActionLabel(log.action)}
                            </span>
                          </div>

                          <div className="col-span-2">
                            <p className="text-sm text-gray-700">{log.target}</p>
                          </div>

                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">{formatDate(log.occurredAt)}</p>
                          </div>

                          <div className="col-span-2">
                            <p className="text-sm text-gray-600 leading-6">{log.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="border rounded-xl p-6">
                  <Activity className="w-6 h-6 text-emerald-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Action tracking</h3>
                  <p className="text-sm text-gray-600 leading-6">
                    Monitor major moderation and administrative activity.
                  </p>
                </div>

                <div className="border rounded-xl p-6">
                  <UserCog className="w-6 h-6 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">User management history</h3>
                  <p className="text-sm text-gray-600 leading-6">
                    Keep a history of role changes and account restrictions.
                  </p>
                </div>

                <div className="border rounded-xl p-6">
                  <ShieldCheck className="w-6 h-6 text-amber-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Moderation visibility</h3>
                  <p className="text-sm text-gray-600 leading-6">
                    Improve trust through clear internal action records.
                  </p>
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