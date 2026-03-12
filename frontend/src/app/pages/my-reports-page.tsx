import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Clock3, Eye, FileText, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { getMyReports, ReportResponse, ReportStatus } from "../api/report-api";

const STATUS_LABELS: Record<ReportStatus, string> = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  RESOLVED: "Resolved",
};

const STATUS_FILTER_VALUES = ["All", "SUBMITTED", "UNDER_REVIEW", "RESOLVED"] as const;
type StatusFilter = (typeof STATUS_FILTER_VALUES)[number];

function getStatusClasses(status: ReportStatus) {
  switch (status) {
    case "SUBMITTED":    return "bg-blue-50 text-blue-700";
    case "UNDER_REVIEW": return "bg-amber-50 text-amber-700";
    case "RESOLVED":     return "bg-emerald-50 text-emerald-700";
    default:             return "bg-gray-50 text-gray-700";
  }
}

// "MENTAL_HEALTH" → "Mental Health"
function formatCategory(raw: string) {
  return raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function MyReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    getMyReports()
      .then(setReports)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesStatus =
        selectedStatus === "All" || report.status === selectedStatus;

      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 ||
        report.reference.toLowerCase().includes(normalizedQuery) ||
        report.category.toLowerCase().includes(normalizedQuery) ||
        report.title.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [query, selectedStatus, reports]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-10">
            <h1 className="text-5xl font-bold mb-3">My Reports</h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Track the status of your submitted reports and review their details.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar filter */}
            <aside className="col-span-3">
              <div className="border rounded-xl p-6 sticky top-8">
                <h2 className="font-semibold mb-4">Filter by Status</h2>
                <div className="space-y-2">
                  {STATUS_FILTER_VALUES.map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`block w-full text-left px-4 py-3 rounded-md text-sm ${
                        selectedStatus === status
                          ? "bg-emerald-50 text-emerald-700"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {status === "All" ? "All" : STATUS_LABELS[status as ReportStatus]}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main content */}
            <section className="col-span-9">
              <div className="flex items-center gap-3 border px-4 py-3 rounded-xl mb-6">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by reference, category, or title"
                  className="w-full outline-none text-sm"
                />
              </div>

              {/* Loading */}
              {isLoading && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-xl p-6 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-3" />
                      <div className="h-5 bg-gray-200 rounded w-48 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </div>
                  ))}
                </div>
              )}

              {/* Error */}
              {!isLoading && error && (
                <div className="border border-red-200 bg-red-50 rounded-xl p-8 text-center">
                  <p className="text-red-700 font-medium mb-2">Failed to load reports</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Empty state */}
              {!isLoading && !error && filteredReports.length === 0 && (
                <div className="border rounded-xl p-10 text-center">
                  <h3 className="text-xl font-semibold mb-2">No reports found</h3>
                  <p className="text-sm text-gray-600 mb-5">
                    {reports.length === 0
                      ? "You haven't submitted any reports yet."
                      : "Try another filter or search term."}
                  </p>
                  <button
                    onClick={() => navigate("/report")}
                    className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-800"
                  >
                    Submit Report
                  </button>
                </div>
              )}

              {/* Report list */}
              {!isLoading && !error && filteredReports.length > 0 && (
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <article
                      key={report.id}
                      className="border rounded-xl p-6 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-900">
                              <FileText className="w-4 h-4" />
                              {report.reference}
                            </span>
                            <span
                              className={`text-xs px-3 py-1 rounded-full ${getStatusClasses(report.status)}`}
                            >
                              {STATUS_LABELS[report.status]}
                            </span>
                          </div>

                          <h3 className="text-xl font-semibold mb-2">
                            {formatCategory(report.category)}
                          </h3>

                          <p className="text-sm text-gray-600 leading-6 max-w-3xl">
                            {report.title}
                          </p>
                        </div>

                        <button
                          onClick={() => navigate(`/my-reports/${report.id}`)}
                          className="shrink-0 border px-4 py-2 rounded-md text-sm hover:bg-gray-50 inline-flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500 pt-4 border-t">
                        <Clock3 className="w-4 h-4" />
                        Submitted on {report.createdAt}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}