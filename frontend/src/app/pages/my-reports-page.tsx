import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Clock3, Eye, FileText, Search, AlertCircle, RefreshCw, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyReports, ReportResponse, ReportStatus } from "../api/report-api";

// ─── constants ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<ReportStatus, string> = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  RESOLVED: "Resolved",
};

const STATUS_FILTER_VALUES = ["All", "SUBMITTED", "UNDER_REVIEW", "RESOLVED"] as const;
type StatusFilter = (typeof STATUS_FILTER_VALUES)[number];

// ─── helpers ──────────────────────────────────────────────────────────────────

function getStatusStyle(status: ReportStatus): { bg: string; color: string; dot: string } {
  switch (status) {
    case "SUBMITTED":
      return { bg: "rgba(136,187,214,0.10)", color: "#6096BA", dot: "#6096BA" };
    case "UNDER_REVIEW":
      return { bg: "rgba(232,160,32,0.12)", color: "#b97a0a", dot: "#e8a020" };
    case "RESOLVED":
      return { bg: "rgba(36,76,90,0.08)", color: "rgba(36,76,90,0.60)", dot: "rgba(36,76,90,0.40)" };
    default:
      return { bg: "rgba(36,76,90,0.06)", color: "rgba(36,76,90,0.50)", dot: "rgba(36,76,90,0.30)" };
  }
}

function formatCategory(raw: string) {
  return raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded ${className ?? ""}`}
      style={{ backgroundColor: "rgba(36,76,90,0.07)" }}
    />
  );
}

// ─── component ────────────────────────────────────────────────────────────────

export function MyReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("All");
  const [query, setQuery] = useState("");

  // hover states
  const [hoveredReport, setHoveredReport] = useState<string | null>(null);
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);

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

  // counts per status for sidebar badges
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { All: reports.length };
    for (const r of reports) {
      counts[r.status] = (counts[r.status] ?? 0) + 1;
    }
    return counts;
  }, [reports]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F6F8F9" }}>
      <Header />

      {/* ── hero strip ── */}
      <div className="relative overflow-hidden" style={{ backgroundColor: "#F9F7F3" }}>
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.10]"
          style={{
            backgroundImage: "radial-gradient(#6096BA 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-10 flex items-end justify-between">
          <div>
            <p
              className="font-sans font-bold uppercase tracking-[0.20em] mb-2"
              style={{ fontSize: 11, color: "#6096BA" }}
            >
              Reports
            </p>
            <h1
              className="font-serif"
              style={{
                fontSize: 38,
                letterSpacing: "-0.04em",
                color: "#274C77",
                lineHeight: 1.15,
                fontFamily: "DM Serif Display, serif",
              }}
            >
              My Reports
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
              Track the status of your submitted reports and review their details.
            </p>
          </div>

          {/* summary pill */}
          {!isLoading && !error && reports.length > 0 && (
            <div
              className="hidden md:flex items-center gap-3 rounded-xl px-5 py-3 mb-1"
              style={{
                backgroundColor: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(136,187,214,0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              <FileText className="w-4 h-4" style={{ color: "#6096BA" }} />
              <span
                className="font-sans font-semibold"
                style={{ fontSize: 13, color: "#274C77" }}
              >
                {reports.length} {reports.length === 1 ? "report" : "reports"} total
              </span>
            </div>
          )}
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="grid grid-cols-12 gap-8">

            {/* ── sidebar ── */}
            <aside className="col-span-3">
              <div
                className="rounded-2xl p-6 sticky top-8"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid rgba(136,187,214,0.10)",
                  boxShadow: "0 8px 40px rgba(36,76,90,0.10)",
                }}
              >
                <p
                  className="font-sans font-bold uppercase tracking-[0.20em] mb-4"
                  style={{ fontSize: 11, color: "#6096BA" }}
                >
                  Filter
                </p>

                <div className="space-y-1">
                  {STATUS_FILTER_VALUES.map((status) => {
                    const isActive = selectedStatus === status;
                    const label = status === "All" ? "All Reports" : STATUS_LABELS[status as ReportStatus];
                    const count = statusCounts[status] ?? 0;

                    return (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        onMouseEnter={() => setHoveredFilter(status)}
                        onMouseLeave={() => setHoveredFilter(null)}
                        className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all"
                        style={{
                          backgroundColor: isActive
                            ? "rgba(136,187,214,0.10)"
                            : hoveredFilter === status
                            ? "rgba(36,76,90,0.04)"
                            : "transparent",
                          cursor: "pointer",
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          {/* status dot */}
                          {status !== "All" && (
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor: getStatusStyle(status as ReportStatus).dot,
                              }}
                            />
                          )}
                          <span
                            className="font-sans"
                            style={{
                              fontSize: 13,
                              fontWeight: isActive ? 600 : 400,
                              color: isActive ? "#6096BA" : "rgba(36,76,90,0.70)",
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {label}
                          </span>
                        </div>
                        {count > 0 && (
                          <span
                            className="font-sans font-semibold rounded-full px-2 py-0.5"
                            style={{
                              fontSize: 11,
                              backgroundColor: isActive ? "rgba(136,187,214,0.15)" : "rgba(36,76,90,0.07)",
                              color: isActive ? "#6096BA" : "rgba(36,76,90,0.50)",
                            }}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* submit CTA */}
                <div
                  className="mt-6 pt-5"
                  style={{ borderTop: "1px solid rgba(36,76,90,0.07)" }}
                >
                  <button
                    onClick={() => navigate("/report")}
                    className="w-full flex items-center justify-center gap-2 font-sans font-semibold text-white rounded-sm py-2.5"
                    style={{ fontSize: 13, backgroundColor: "#6096BA", cursor: "pointer" }}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Submit New Report
                  </button>
                </div>
              </div>
            </aside>

            {/* ── main content ── */}
            <section className="col-span-9 space-y-5">

              {/* search bar */}
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid rgba(36,76,90,0.15)",
                  boxShadow: "0 2px 12px rgba(36,76,90,0.06)",
                }}
              >
                <Search className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(36,76,90,0.35)" }} />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by reference, category, or title…"
                  className="w-full outline-none font-sans bg-transparent"
                  style={{
                    fontSize: 14,
                    color: "#274C77",
                    letterSpacing: "-0.01em",
                  }}
                />
              </div>

              {/* ── loading ── */}
              {isLoading && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-2xl p-6"
                      style={{
                        backgroundColor: "#fff",
                        border: "1px solid rgba(136,187,214,0.10)",
                        boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                      }}
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex gap-3">
                            <Skeleton className="h-5 w-28" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                          </div>
                          <Skeleton className="h-5 w-40" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                        <Skeleton className="h-9 w-28 rounded-sm flex-shrink-0" />
                      </div>
                      <Skeleton className="h-4 w-36 mt-2" />
                    </div>
                  ))}
                </div>
              )}

              {/* ── error ── */}
              {!isLoading && error && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div
                    className="flex items-center justify-center rounded-2xl mb-5"
                    style={{ width: 64, height: 64, backgroundColor: "rgba(220,38,38,0.08)" }}
                  >
                    <AlertCircle className="w-7 h-7" style={{ color: "#dc2626" }} />
                  </div>
                  <h3
                    className="font-serif mb-2"
                    style={{
                      fontSize: 22,
                      letterSpacing: "-0.03em",
                      color: "#274C77",
                      fontFamily: "DM Serif Display, serif",
                    }}
                  >
                    Failed to load reports
                  </h3>
                  <p
                    className="font-sans mb-6"
                    style={{ fontSize: 14, color: "rgba(36,76,90,0.55)", maxWidth: 320 }}
                  >
                    {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 font-sans font-semibold text-white rounded-sm px-5 py-2.5"
                    style={{ fontSize: 14, backgroundColor: "#6096BA", cursor: "pointer" }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try again
                  </button>
                </div>
              )}

              {/* ── empty state ── */}
              {!isLoading && !error && filteredReports.length === 0 && (
                <div
                  className="flex flex-col items-center justify-center rounded-2xl py-20 text-center"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid rgba(136,187,214,0.10)",
                    boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-2xl mb-4"
                    style={{ width: 56, height: 56, backgroundColor: "rgba(198,209,102,0.25)" }}
                  >
                    <FileText className="w-6 h-6" style={{ color: "#6096BA" }} />
                  </div>
                  <h3
                    className="font-serif mb-2"
                    style={{
                      fontSize: 22,
                      letterSpacing: "-0.03em",
                      color: "#274C77",
                      fontFamily: "DM Serif Display, serif",
                    }}
                  >
                    {reports.length === 0 ? "No reports yet" : "No results found"}
                  </h3>
                  <p
                    className="font-sans mb-6"
                    style={{
                      fontSize: 14,
                      color: "rgba(36,76,90,0.55)",
                      maxWidth: 300,
                      lineHeight: 1.65,
                    }}
                  >
                    {reports.length === 0
                      ? "Your submitted reports will appear here. Everything is anonymous and encrypted."
                      : "Try a different filter or search term."}
                  </p>
                  {reports.length === 0 && (
                    <button
                      onClick={() => navigate("/report")}
                      className="inline-flex items-center gap-2 font-sans font-semibold text-white rounded-sm px-5 py-2.5"
                      style={{ fontSize: 14, backgroundColor: "#6096BA", cursor: "pointer" }}
                    >
                      <FileText className="w-4 h-4" />
                      Submit a Report
                    </button>
                  )}
                </div>
              )}

              {/* ── report list ── */}
              {!isLoading && !error && filteredReports.length > 0 && (
                <div className="space-y-4">
                  {filteredReports.map((report) => {
                    const statusStyle = getStatusStyle(report.status);
                    const isHovered = hoveredReport === report.id;

                    return (
                      <article
                        key={report.id}
                        onMouseEnter={() => setHoveredReport(report.id)}
                        onMouseLeave={() => setHoveredReport(null)}
                        className="rounded-2xl overflow-hidden transition-all"
                        style={{
                          backgroundColor: "#fff",
                          border: "1px solid rgba(136,187,214,0.10)",
                          boxShadow: isHovered
                            ? "0 12px 40px rgba(36,76,90,0.13)"
                            : "0 8px 40px rgba(36,76,90,0.08)",
                          transform: isHovered ? "translateY(-1px)" : "translateY(0)",
                        }}
                      >
                        {/* status accent bar */}
                        <div style={{ height: 3, backgroundColor: statusStyle.dot }} />

                        <div className="p-6">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1 min-w-0">

                              {/* reference + status badge */}
                              <div className="flex items-center gap-3 mb-2.5 flex-wrap">
                                <span
                                  className="inline-flex items-center gap-1.5 font-sans font-semibold"
                                  style={{ fontSize: 12, color: "rgba(36,76,90,0.50)" }}
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  {report.reference}
                                </span>
                                <span
                                  className="inline-flex items-center gap-1.5 font-sans font-semibold rounded-full px-3 py-1"
                                  style={{
                                    fontSize: 11,
                                    backgroundColor: statusStyle.bg,
                                    color: statusStyle.color,
                                  }}
                                >
                                  <span
                                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: statusStyle.dot }}
                                  />
                                  {STATUS_LABELS[report.status]}
                                </span>
                              </div>

                              {/* category */}
                              <h3
                                className="font-serif mb-1.5"
                                style={{
                                  fontSize: 19,
                                  letterSpacing: "-0.03em",
                                  color: "#274C77",
                                  fontFamily: "DM Serif Display, serif",
                                  lineHeight: 1.25,
                                }}
                              >
                                {formatCategory(report.category)}
                              </h3>

                              {/* title */}
                              <p
                                className="font-sans"
                                style={{
                                  fontSize: 14,
                                  color: "rgba(36,76,90,0.60)",
                                  letterSpacing: "-0.01em",
                                  lineHeight: 1.65,
                                }}
                              >
                                {report.title}
                              </p>
                            </div>

                            {/* view button */}
                            <button
                              onClick={() => navigate(`/my-reports/${report.id}`)}
                              className="shrink-0 inline-flex items-center gap-2 font-sans font-semibold rounded-sm px-4 py-2"
                              style={{
                                fontSize: 13,
                                color: "#274C77",
                                border: "1px solid rgba(36,76,90,0.20)",
                                backgroundColor: "transparent",
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View Details
                              <ChevronRight className="w-3 h-3 opacity-40" />
                            </button>
                          </div>

                          {/* footer */}
                          <div
                            className="flex items-center gap-2 pt-4"
                            style={{ borderTop: "1px solid rgba(36,76,90,0.07)" }}
                          >
                            <Clock3 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(36,76,90,0.35)" }} />
                            <span
                              className="font-sans"
                              style={{ fontSize: 12, color: "rgba(36,76,90,0.45)", letterSpacing: "-0.01em" }}
                            >
                              Submitted on {report.createdAt}
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
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