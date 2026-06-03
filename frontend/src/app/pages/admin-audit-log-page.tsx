import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Activity, AlertCircle, Search, ShieldCheck, UserCog } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAuditLog, type AuditLogResponse } from "../api/admin-api";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getActionBadge(action: string): { bg: string; color: string } {
  switch (action) {
    case "USER_BANNED":
      return { bg: "rgba(36,76,90,0.10)", color: "#274C77" };

    case "USER_UNBANNED":
      return { bg: "rgba(136,187,214,0.25)", color: "#274C77" };

    case "ROLE_CHANGED":
      return { bg: "rgba(153,211,223,0.40)", color: "#274C77" };

    case "FORUM_POST_REVIEWED":
    case "REPORT_REVIEWED":
      return { bg: "rgba(136,187,214,0.18)", color: "#274C77" };

    case "FORUM_POST_DISMISSED":
    case "REPORT_DISMISSED":
      return { bg: "rgba(205,205,205,0.55)", color: "#274C77" };

    case "FORUM_POST_ESCALATED_TO_SPECIALIST":
    case "FORUM_POST_SPECIALIST_NOTE_ADDED":
    case "REPORT_ESCALATED_TO_SPECIALIST":
      return { bg: "rgba(36,76,90,0.15)", color: "#274C77" };

    default:
      return { bg: "rgba(205,205,205,0.40)", color: "#274C77" };
  }
}

function getActionLabel(action: string): string {
  switch (action) {
    case "USER_BANNED":
      return "User Banned";

    case "USER_UNBANNED":
      return "User Unbanned";

    case "ROLE_CHANGED":
      return "Role Changed";

    case "FORUM_POST_REVIEWED":
      return "Post Reviewed";

    case "FORUM_POST_DISMISSED":
      return "Post Dismissed";

    case "FORUM_POST_ESCALATED_TO_SPECIALIST":
      return "Escalated";

    case "FORUM_POST_SPECIALIST_NOTE_ADDED":
      return "Specialist Note";

    case "REPORT_REVIEWED":
      return "Report Reviewed";

    case "REPORT_DISMISSED":
      return "Report Dismissed";

    case "REPORT_ESCALATED_TO_SPECIALIST":
      return "Report Escalated";

    default:
      return action;
  }
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center border-b border-[#D6DCE1]/40 last:border-0">
      <div className="col-span-3">
        <div
          className="h-3.5 w-28 rounded animate-pulse"
          style={{ backgroundColor: "rgba(36,76,90,0.08)" }}
        />
      </div>

      <div className="col-span-3">
        <div
          className="h-6 w-24 rounded-full animate-pulse"
          style={{ backgroundColor: "rgba(136,187,214,0.18)" }}
        />
      </div>

      <div className="col-span-2">
        <div
          className="h-3.5 w-20 rounded animate-pulse"
          style={{ backgroundColor: "rgba(36,76,90,0.06)" }}
        />
      </div>

      <div className="col-span-2">
        <div
          className="h-3.5 w-24 rounded animate-pulse"
          style={{ backgroundColor: "rgba(36,76,90,0.06)" }}
        />
      </div>

      <div className="col-span-2">
        <div
          className="h-3.5 w-32 rounded animate-pulse"
          style={{ backgroundColor: "rgba(36,76,90,0.06)" }}
        />
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function AdminAuditLogPage() {
  const [logs, setLogs] = useState<AuditLogResponse[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

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
        (log.actor ?? "").toLowerCase().includes(q) ||
        (log.action ?? "").toLowerCase().includes(q) ||
        (log.target ?? "").toLowerCase().includes(q) ||
        (log.details ?? "").toLowerCase().includes(q)
    );
  }, [query, logs]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));

  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredLogs.slice(startIndex, startIndex + pageSize);
  }, [filteredLogs, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const accountActions = logs.filter((l) =>
    [
      "USER_BANNED",
      "USER_UNBANNED",
      "ROLE_CHANGED",
      "FORUM_POST_REVIEWED",
      "FORUM_POST_DISMISSED",
      "FORUM_POST_ESCALATED_TO_SPECIALIST",
      "FORUM_POST_SPECIALIST_NOTE_ADDED",
      "REPORT_REVIEWED",
      "REPORT_DISMISSED",
      "REPORT_ESCALATED_TO_SPECIALIST",
    ].includes(l.action)
  ).length;

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: "#F9F7F3", color: "#274C77" }}
    >
      <Header />

      {/* ── Hero strip ─────────────────────────────────────────────────────── */}
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

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-12">
          <p
            className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] mb-3"
            style={{ color: "rgba(36,76,90,0.60)" }}
          >
            Admin · Audit Log
          </p>

          <h1
            className="font-display text-[40px] sm:text-[52px] leading-[1.05] tracking-[-0.04em]"
            style={{ color: "#274C77" }}
          >
            Admin Audit Log
          </h1>

          <p
            className="mt-3 font-sans text-[16px] leading-[1.75] tracking-[-0.01em] max-w-2xl"
            style={{ color: "rgba(36,76,90,0.65)" }}
          >
            Review every moderation and administrative action across the SafeSpace platform.
            All entries are immutable and timestamped.
          </p>
        </div>
      </div>

      {/* ── Main layout ────────────────────────────────────────────────────── */}
      <main className="flex-1">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-10">
          <div className="grid grid-cols-12 gap-8 items-start">
            {/* ── Sidebar ──────────────────────────────────────────────────── */}
            <aside className="col-span-12 lg:col-span-3">
              <div
                className="rounded-2xl p-6 sticky top-24 border"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "rgba(136,187,214,0.18)",
                  boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                }}
              >
                <p
                  className="font-sans text-[11px] font-bold uppercase tracking-[0.20em] mb-5"
                  style={{ color: "#6096BA" }}
                >
                  Overview
                </p>

                <div className="space-y-3">
                  <div
                    className="rounded-xl p-4 border"
                    style={{
                      backgroundColor: "#F9F7F3",
                      borderColor: "rgba(36,76,90,0.07)",
                    }}
                  >
                    <p
                      className="font-sans text-[12px] tracking-[-0.01em]"
                      style={{ color: "rgba(36,76,90,0.55)" }}
                    >
                      Total entries
                    </p>

                    <p
                      className="font-display text-[32px] leading-none mt-1 tracking-[-0.03em]"
                      style={{ color: "#274C77" }}
                    >
                      {loading ? (
                        <span
                          className="inline-block h-8 w-12 rounded animate-pulse"
                          style={{ backgroundColor: "rgba(36,76,90,0.08)" }}
                        />
                      ) : (
                        logs.length
                      )}
                    </p>
                  </div>

                  <div
                    className="rounded-xl p-4 border"
                    style={{
                      backgroundColor: "#F9F7F3",
                      borderColor: "rgba(36,76,90,0.07)",
                    }}
                  >
                    <p
                      className="font-sans text-[12px] tracking-[-0.01em]"
                      style={{ color: "rgba(36,76,90,0.55)" }}
                    >
                      Account actions
                    </p>

                    <p
                      className="font-display text-[32px] leading-none mt-1 tracking-[-0.03em]"
                      style={{ color: "#274C77" }}
                    >
                      {loading ? (
                        <span
                          className="inline-block h-8 w-10 rounded animate-pulse"
                          style={{ backgroundColor: "rgba(36,76,90,0.08)" }}
                        />
                      ) : (
                        accountActions
                      )}
                    </p>
                  </div>
                </div>

                <div
                  className="mt-6 pt-6 border-t"
                  style={{ borderColor: "rgba(36,76,90,0.08)" }}
                >
                  <div className="space-y-3">
                    {[
                      {
                        icon: Activity,
                        label: "Action tracking",
                        desc: "Moderation and admin activity",
                      },
                      {
                        icon: UserCog,
                        label: "User management",
                        desc: "Role changes & restrictions",
                      },
                      {
                        icon: ShieldCheck,
                        label: "Moderation visibility",
                        desc: "Transparent internal records",
                      },
                    ].map(({ icon: Icon, label, desc }) => (
                      <div key={label} className="flex items-start gap-3">
                        <div
                          className="mt-0.5 rounded-lg p-2 flex-shrink-0"
                          style={{ backgroundColor: "rgba(153,211,223,0.35)" }}
                        >
                          <Icon className="w-3.5 h-3.5" style={{ color: "#274C77" }} />
                        </div>

                        <div>
                          <p
                            className="font-sans text-[13px] font-semibold leading-tight"
                            style={{ color: "#274C77" }}
                          >
                            {label}
                          </p>

                          <p
                            className="font-sans text-[12px] mt-0.5 leading-[1.5]"
                            style={{ color: "rgba(36,76,90,0.55)" }}
                          >
                            {desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* ── Table section ────────────────────────────────────────────── */}
            <section className="col-span-12 lg:col-span-9">
              {/* Search bar */}
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 mb-5 border"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "rgba(136,187,214,0.25)",
                  boxShadow: "0 2px 12px rgba(36,76,90,0.06)",
                }}
              >
                <Search
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "rgba(36,76,90,0.40)" }}
                />

                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by actor, action, target, or details…"
                  className="w-full outline-none bg-transparent font-sans text-[14px] tracking-[-0.01em] placeholder:opacity-40"
                  style={{ color: "#274C77" }}
                />

                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="font-sans text-[12px] px-2 py-0.5 rounded"
                    style={{ color: "rgba(36,76,90,0.50)" }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Table card */}
              {loading ? (
                <div
                  className="rounded-2xl border overflow-hidden"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "rgba(136,187,214,0.18)",
                    boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                  }}
                >
                  <div
                    className="grid grid-cols-12 gap-4 px-6 py-4 border-b"
                    style={{
                      backgroundColor: "rgba(153,211,223,0.15)",
                      borderColor: "rgba(36,76,90,0.08)",
                    }}
                  >
                    {["Actor", "Action", "Target", "Date", "Details"].map((h, i) => (
                      <div
                        key={h}
                        className={`font-sans text-[11px] font-bold uppercase tracking-[0.14em] ${
                          i === 0
                            ? "col-span-3"
                            : i === 1
                            ? "col-span-3"
                            : i === 2
                            ? "col-span-2"
                            : i === 3
                            ? "col-span-2"
                            : "col-span-2"
                        }`}
                        style={{ color: "rgba(36,76,90,0.50)" }}
                      >
                        {h}
                      </div>
                    ))}
                  </div>

                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </div>
              ) : error ? (
                <div
                  className="rounded-2xl border p-16 flex flex-col items-center text-center"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "rgba(136,187,214,0.18)",
                    boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                  }}
                >
                  <div
                    className="rounded-2xl p-4 mb-5"
                    style={{ backgroundColor: "rgba(36,76,90,0.06)" }}
                  >
                    <AlertCircle className="w-7 h-7" style={{ color: "#274C77" }} />
                  </div>

                  <h3
                    className="font-display text-[22px] tracking-[-0.03em] mb-2"
                    style={{ color: "#274C77" }}
                  >
                    Failed to load audit log
                  </h3>

                  <p
                    className="font-sans text-[14px] leading-[1.75] mb-6 max-w-xs"
                    style={{ color: "rgba(36,76,90,0.60)" }}
                  >
                    {error}
                  </p>

                  <button
                    onClick={() => window.location.reload()}
                    className="font-sans text-[14px] font-semibold px-5 py-2.5 rounded-sm transition"
                    style={{ backgroundColor: "#6096BA", color: "#FFFFFF" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#274C77")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6096BA")}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div
                  className="rounded-2xl border overflow-hidden"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "rgba(136,187,214,0.18)",
                    boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                  }}
                >
                  {/* Table header */}
                  <div
                    className="grid grid-cols-12 gap-4 px-6 py-4 border-b"
                    style={{
                      backgroundColor: "rgba(153,211,223,0.15)",
                      borderColor: "rgba(36,76,90,0.08)",
                    }}
                  >
                    {[
                      { label: "Actor", span: "col-span-3" },
                      { label: "Action", span: "col-span-3" },
                      { label: "Target", span: "col-span-2" },
                      { label: "Date", span: "col-span-2" },
                      { label: "Details", span: "col-span-2" },
                    ].map(({ label, span }) => (
                      <div
                        key={label}
                        className={`font-sans text-[11px] font-bold uppercase tracking-[0.14em] ${span}`}
                        style={{ color: "rgba(36,76,90,0.50)" }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>

                  {filteredLogs.length === 0 ? (
                    <div className="py-20 flex flex-col items-center text-center">
                      <div
                        className="rounded-2xl p-4 mb-5"
                        style={{ backgroundColor: "rgba(153,211,223,0.20)" }}
                      >
                        <Search className="w-7 h-7" style={{ color: "rgba(36,76,90,0.40)" }} />
                      </div>

                      <h3
                        className="font-display text-[22px] tracking-[-0.03em] mb-2"
                        style={{ color: "#274C77" }}
                      >
                        No entries found
                      </h3>

                      <p
                        className="font-sans text-[14px] leading-[1.75] max-w-xs"
                        style={{ color: "rgba(36,76,90,0.55)" }}
                      >
                        No audit log entries match your search. Try different keywords.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {paginatedLogs.map((log, idx) => {
                        const badge = getActionBadge(log.action);

                        return (
                          <div
                            key={log.id}
                            className="grid grid-cols-12 gap-4 px-6 py-5 items-start transition-colors"
                            style={{
                              borderBottom:
                                idx < paginatedLogs.length - 1
                                  ? "1px solid rgba(36,76,90,0.07)"
                                  : "none",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = "rgba(153,211,223,0.06)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = "transparent")
                            }
                          >
                            {/* Actor */}
                            <div className="col-span-3">
                              <p
                                className="font-sans text-[13px] font-semibold leading-snug tracking-[-0.01em]"
                                style={{ color: "#274C77" }}
                              >
                                {log.actor}
                              </p>
                            </div>

                            {/* Action badge */}
                            <div className="col-span-3 min-w-0">
                              <span
                                className="inline-block max-w-full truncate font-sans text-[10px] font-bold uppercase tracking-[0.10em] px-3 py-1 rounded-full"
                                title={getActionLabel(log.action)}
                                style={{
                                  backgroundColor: badge.bg,
                                  color: badge.color,
                                }}
                              >
                                {getActionLabel(log.action)}
                              </span>
                            </div>

                            {/* Target */}
                            <div className="col-span-2 min-w-0">
                              <p
                                className="font-sans text-[13px] leading-snug tracking-[-0.01em] truncate"
                                title={log.target}
                                style={{ color: "rgba(36,76,90,0.70)" }}
                              >
                                {log.target}
                              </p>
                            </div>

                            {/* Date */}
                            <div className="col-span-2">
                              <p
                                className="font-sans text-[12px] tracking-[-0.01em]"
                                style={{ color: "rgba(36,76,90,0.50)" }}
                              >
                                {formatDate(log.occurredAt)}
                              </p>
                            </div>

                            {/* Details */}
                            <div className="col-span-2 min-w-0">
                              <p
                                className="font-sans text-[12px] leading-[1.6] tracking-[-0.01em]"
                                style={{ color: "rgba(36,76,90,0.60)" }}
                              >
                                {log.details}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              {!loading && !error && filteredLogs.length > 0 && totalPages > 1 && (
                <div
                  className="mt-5 flex items-center justify-between gap-4 rounded-xl border px-4 py-3"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "rgba(136,187,214,0.18)",
                    boxShadow: "0 2px 12px rgba(36,76,90,0.05)",
                  }}
                >
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="font-sans text-[13px] font-semibold px-4 py-2 rounded-md transition disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor:
                        currentPage === 1 ? "rgba(36,76,90,0.06)" : "#274C77",
                      color:
                        currentPage === 1 ? "rgba(36,76,90,0.45)" : "#FFFFFF",
                    }}
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    {Array.from({ length: totalPages }).map((_, index) => {
                      const page = index + 1;
                      const isActive = currentPage === page;

                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className="font-sans text-[13px] font-semibold w-9 h-9 rounded-md transition"
                          style={{
                            backgroundColor: isActive
                              ? "#274C77"
                              : "rgba(153,211,223,0.20)",
                            color: isActive ? "#FFFFFF" : "#274C77",
                          }}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="font-sans text-[13px] font-semibold px-4 py-2 rounded-md transition disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor:
                        currentPage === totalPages ? "rgba(36,76,90,0.06)" : "#274C77",
                      color:
                        currentPage === totalPages ? "rgba(36,76,90,0.45)" : "#FFFFFF",
                    }}
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Entry count note */}
              {!loading && !error && filteredLogs.length > 0 && (
                <p
                  className="mt-4 font-sans text-[12px] tracking-[-0.01em]"
                  style={{ color: "rgba(36,76,90,0.45)" }}
                >
                  Showing {(currentPage - 1) * pageSize + 1}–
                  {Math.min(currentPage * pageSize, filteredLogs.length)} of{" "}
                  {filteredLogs.length} {filteredLogs.length === 1 ? "entry" : "entries"}
                  {query ? ` matching "${query}"` : ""}
                </p>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}