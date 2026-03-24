import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AlertTriangle, ArrowUpRight, Brain, FileText, Search, ShieldAlert, UserRound } from "lucide-react";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { useAuth } from "../auth/auth-context";
import {
  addSpecialistResponse,
  dismissFlaggedForumPost,
  dismissFlaggedReport,
  escalateFlaggedForumPost,
  escalateFlaggedReport,
  getForumModerationPosts,
  getReportModerationReports,
  reviewFlaggedForumPost,
  reviewFlaggedReport,
  type ForumModerationQueueItemResponse,
  type ForumModerationStatus,
  type ForumRiskLevel,
  type ReportModerationQueueItemResponse,
} from "../api/admin-api";

type StatusFilter = "ALL" | ForumModerationStatus;
type ModerationView = "REPORTS" | "FORUM";
type QueueMode = "MODERATOR" | "SPECIALIST";

const STATUS_FILTERS: StatusFilter[] = [
  "ALL",
  "FLAGGED",
  "ANALYSIS_FAILED",
  "PENDING_ANALYSIS",
  "CLEAR",
  "REVIEWED",
  "ESCALATED_TO_SPECIALIST",
  "DISMISSED",
];

function getRiskBadge(level: ForumRiskLevel) {
  switch (level) {
    case "CRITICAL":
      return "bg-red-100 text-red-700 border-red-200";
    case "HIGH":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "MODERATE":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }
}

function getStatusBadge(status: ForumModerationStatus) {
  switch (status) {
    case "FLAGGED":
      return "bg-red-100 text-red-700 border-red-200";
    case "ANALYSIS_FAILED":
      return "bg-rose-100 text-rose-700 border-rose-200";
    case "PENDING_ANALYSIS":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "REVIEWED":
      return "bg-sky-100 text-sky-700 border-sky-200";
    case "ESCALATED_TO_SPECIALIST":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "DISMISSED":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }
}

function formatStatusLabel(status: ForumModerationStatus) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatRiskLabel(level: ForumRiskLevel) {
  return level.charAt(0) + level.slice(1).toLowerCase();
}

function formatDateTime(value: string | null) {
  if (!value) return "Not yet";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getFailureHint(status: ForumModerationStatus) {
  if (status === "ANALYSIS_FAILED") {
    return "MentalBERT did not complete for this item. Check the sidecar service and restart the backend backfill.";
  }
  if (status === "PENDING_ANALYSIS") {
    return "This item has been submitted but the background analysis has not completed yet.";
  }
  return "This item is visible for moderator review, but it is not currently flagged for urgent action.";
}

function getReportStatusBadge(status: ReportModerationQueueItemResponse["reportStatus"]) {
  switch (status) {
    case "RESOLVED":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "UNDER_REVIEW":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-sky-100 text-sky-700 border-sky-200";
  }
}

function formatReportStatusLabel(status: ReportModerationQueueItemResponse["reportStatus"]) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getSummaryText(
  summary: string | null,
  status: ForumModerationStatus,
  notes: string | null
) {
  if (summary && summary.trim()) {
    return summary;
  }
  if (notes && notes.trim()) {
    return notes;
  }
  return getFailureHint(status);
}

export function AdminForumRiskPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const canUseSpecialistQueue = user?.role === "ADMIN" || user?.role === "SPECIALIST";
  const [queueMode, setQueueMode] = useState<QueueMode>(
    user?.role === "SPECIALIST" ? "SPECIALIST" : "MODERATOR"
  );
  const [view, setView] = useState<ModerationView>("REPORTS");
  const [forumPosts, setForumPosts] = useState<ForumModerationQueueItemResponse[]>([]);
  const [reports, setReports] = useState<ReportModerationQueueItemResponse[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [responseDrafts, setResponseDrafts] = useState<Record<number, string>>({});

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        const [forumData, reportData] = await Promise.all([
          getForumModerationPosts(),
          getReportModerationReports(),
        ]);
        setForumPosts(forumData);
        setReports(reportData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load moderation queue");
      }
    }

    load().finally(() => setLoading(false));
    const intervalId = window.setInterval(load, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (user?.role === "SPECIALIST") {
      setQueueMode("SPECIALIST");
    }
  }, [user?.role]);

  const baseItems = view === "REPORTS" ? reports : forumPosts;
  const activeItems = useMemo(() => {
    if (queueMode === "SPECIALIST") {
      return baseItems.filter((item) => item.moderationStatus === "ESCALATED_TO_SPECIALIST");
    }
    return baseItems;
  }, [baseItems, queueMode]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    return activeItems.filter((item) => {
      const matchesStatus = statusFilter === "ALL" || item.moderationStatus === statusFilter;
      const textBlob = view === "REPORTS"
        ? [
            item.reference,
            item.title,
            item.description,
            item.category,
            item.reporterEmail,
            item.riskSummary ?? "",
            item.moderationNotes ?? "",
          ].join(" ")
        : [
            item.title,
            item.content,
            item.authorNickname,
            item.authorEmail,
            item.category,
            item.riskSummary ?? "",
            item.moderationNotes ?? "",
          ].join(" ");

      return matchesStatus && textBlob.toLowerCase().includes(q);
    });
  }, [activeItems, query, statusFilter, view]);

  const criticalCount = activeItems.filter((item) => item.riskLevel === "CRITICAL").length;
  const flaggedCount = activeItems.filter((item) => item.flaggedForReview).length;
  const failedCount = activeItems.filter((item) => item.moderationStatus === "ANALYSIS_FAILED").length;

  async function runForumAction(
    postId: number,
    action: (id: number) => Promise<ForumModerationQueueItemResponse>
  ) {
    const actionKey = `forum-${postId}`;
    try {
      setActionLoading(actionKey);
      const updated = await action(postId);
      setForumPosts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update forum moderation status");
    } finally {
      setActionLoading(null);
    }
  }

  async function runReportAction(
    reportId: number,
    action: (id: number) => Promise<ReportModerationQueueItemResponse>
  ) {
    const actionKey = `report-${reportId}`;
    try {
      setActionLoading(actionKey);
      const updated = await action(reportId);
      setReports((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update report moderation status");
    } finally {
      setActionLoading(null);
    }
  }

  async function runSpecialistResponse(reportId: number) {
    const message = responseDrafts[reportId]?.trim() ?? "";
    if (!message) {
      alert("Enter a specialist response before submitting.");
      return;
    }

    const actionKey = `report-response-${reportId}`;
    try {
      setActionLoading(actionKey);
      const updated = await addSpecialistResponse(reportId, message);
      setReports((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setResponseDrafts((prev) => ({ ...prev, [reportId]: "" }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to submit specialist response");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-bold mb-3">Moderation Queue</h1>
              <p className="text-lg text-gray-600 max-w-3xl">
                {queueMode === "SPECIALIST"
                  ? "Focus on cases already escalated to specialists and send a direct response back through the report timeline."
                  : "Review AI analysis for anonymous reports and forum posts, prioritize high-risk cases, and escalate urgent situations to specialists."}
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => navigate("/admin/analytics")}
                className="border px-4 py-3 rounded-lg text-sm hover:bg-gray-50 inline-flex items-center gap-2"
              >
                View Analytics
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {canUseSpecialistQueue && (
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setQueueMode("MODERATOR")}
                className={`px-5 py-3 rounded-xl border text-sm font-medium ${
                  queueMode === "MODERATOR"
                    ? "bg-black text-white border-black"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                Moderator Queue
              </button>
              <button
                onClick={() => setQueueMode("SPECIALIST")}
                className={`px-5 py-3 rounded-xl border text-sm font-medium ${
                  queueMode === "SPECIALIST"
                    ? "bg-black text-white border-black"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                Escalated Cases
              </button>
            </div>
          )}

          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setView("REPORTS")}
              className={`px-5 py-3 rounded-xl border text-sm font-medium ${
                view === "REPORTS" ? "bg-black text-white border-black" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              Anonymous Reports
            </button>
            <button
              onClick={() => setView("FORUM")}
              className={`px-5 py-3 rounded-xl border text-sm font-medium ${
                view === "FORUM" ? "bg-black text-white border-black" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              Forum Posts
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="border rounded-xl p-6 bg-red-50 border-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600 mb-4" />
              <p className="text-sm text-red-700">Critical cases</p>
              <p className="text-3xl font-bold text-red-800 mt-1">{criticalCount}</p>
            </div>

            <div className="border rounded-xl p-6 bg-orange-50 border-orange-100">
              <ShieldAlert className="w-6 h-6 text-orange-600 mb-4" />
              <p className="text-sm text-orange-700">Flagged items</p>
              <p className="text-3xl font-bold text-orange-800 mt-1">{flaggedCount}</p>
            </div>

            <div className="border rounded-xl p-6 bg-sky-50 border-sky-100">
              <Brain className="w-6 h-6 text-sky-600 mb-4" />
              <p className="text-sm text-sky-700">Analysis failures</p>
              <p className="text-3xl font-bold text-sky-800 mt-1">{failedCount}</p>
            </div>
          </div>

          {queueMode === "MODERATOR" ? (
            <div className="flex flex-wrap gap-2 mb-6">
              {STATUS_FILTERS.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm border ${
                    statusFilter === status
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {status === "ALL" ? "All Items" : formatStatusLabel(status)}
                </button>
              ))}
            </div>
          ) : (
            <div className="mb-6 rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-sm text-purple-800">
              Showing only items with status {formatStatusLabel("ESCALATED_TO_SPECIALIST")}.
            </div>
          )}

          <div className="flex items-center gap-3 border px-4 py-3 rounded-xl mb-6">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={view === "REPORTS"
                ? queueMode === "SPECIALIST"
                  ? "Search escalated reports by reference, title, description, reporter, or specialist notes"
                  : "Search reports by reference, title, description, reporter, or analysis summary"
                : queueMode === "SPECIALIST"
                  ? "Search escalated forum posts by title, content, author, or analysis summary"
                  : "Search forum posts by title, content, author, or analysis summary"}
              className="w-full outline-none text-sm"
            />
          </div>

          {loading ? (
            <div className="border rounded-xl p-10 text-center text-gray-500 text-sm">
              Loading moderation items...
            </div>
          ) : error ? (
            <div className="border rounded-xl p-10 text-center">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="border rounded-xl p-10 text-center">
              <h2 className="text-2xl font-semibold mb-2">No items match this moderation view</h2>
              <p className="text-sm text-gray-600">
                {queueMode === "SPECIALIST"
                  ? "No escalated cases match this view right now."
                  : "Try a different filter, or wait for MentalBERT analysis to complete after submission."}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {view === "REPORTS" &&
                filteredItems.map((item) => {
                  const report = item as ReportModerationQueueItemResponse;
                  const actionKey = `report-${report.id}`;
                  return (
                    <article key={report.id} className="border rounded-2xl p-6">
                      <div className="flex items-start justify-between gap-6 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <span className={`text-xs px-3 py-1 rounded-full border ${getRiskBadge(report.riskLevel)}`}>
                              {formatRiskLabel(report.riskLevel)} risk
                            </span>
                            <span className={`text-xs px-3 py-1 rounded-full border ${getStatusBadge(report.moderationStatus)}`}>
                              {formatStatusLabel(report.moderationStatus)}
                            </span>
                            <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                              {report.reference}
                            </span>
                            <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                              {report.category.replaceAll("_", " ")}
                            </span>
                          </div>

                          <h2 className="text-2xl font-semibold text-gray-900">{report.title}</h2>
                          <p className="text-sm text-gray-500 mt-2">
                            Created {formatDateTime(report.createdAt)} | analyzed {formatDateTime(report.analyzedAt)}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-500">Report status</p>
                          <span className={`inline-flex text-xs px-3 py-1 rounded-full border mt-2 ${getReportStatusBadge(report.reportStatus)}`}>
                            {formatReportStatusLabel(report.reportStatus)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-8">
                          <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                            <p className="text-sm text-gray-700 leading-7 whitespace-pre-wrap">
                              {report.description}
                            </p>
                          </div>

                          <div className="mt-4 rounded-xl bg-red-50 border border-red-100 p-4">
                            <p className="text-xs uppercase tracking-wide text-red-700 font-semibold mb-2">
                              AI Analysis Summary
                            </p>
                            <p className="text-sm text-red-900">
                              {getSummaryText(report.riskSummary, report.moderationStatus, report.moderationNotes)}
                            </p>
                            {report.moderationNotes && (
                              <p className="text-sm text-red-800 mt-3">{report.moderationNotes}</p>
                            )}
                          </div>
                        </div>

                        <div className="col-span-4 space-y-4">
                          <div className="border rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <UserRound className="w-4 h-4 text-gray-500" />
                              <h3 className="font-semibold">Reporter</h3>
                            </div>
                            <p className="text-sm font-medium text-gray-900">{report.reporterEmail}</p>
                            <p className="text-xs text-gray-500 mt-3">
                              {report.anonymous
                                ? "Submitted anonymously to moderators"
                                : "Reporter identity is visible in the moderation workflow"}
                            </p>
                          </div>

                          <div className="border rounded-xl p-4">
                            <p className="text-sm text-gray-500">Risk metrics</p>
                            <p className="text-2xl font-bold mt-1">{report.riskScore}/100</p>
                            <p className="text-sm text-gray-600 mt-2">
                              Sentiment {report.sentimentScore.toFixed(2)}
                            </p>
                          </div>

                          <div className="grid gap-2">
                            {report.flaggedForReview && isAdmin ? (
                              <>
                                <button
                                  onClick={() => runReportAction(report.id, escalateFlaggedReport)}
                                  disabled={actionLoading === actionKey}
                                  className="w-full bg-red-600 text-white py-2.5 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                                >
                                  Escalate to Specialist
                                </button>
                                <button
                                  onClick={() => runReportAction(report.id, reviewFlaggedReport)}
                                  disabled={actionLoading === actionKey}
                                  className="w-full border py-2.5 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
                                >
                                  Mark Reviewed
                                </button>
                                <button
                                  onClick={() => runReportAction(report.id, dismissFlaggedReport)}
                                  disabled={actionLoading === actionKey}
                                  className="w-full border py-2.5 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
                                >
                                  Dismiss Flag
                                </button>
                              </>
                            ) : report.moderationStatus === "ESCALATED_TO_SPECIALIST" ? (
                              <div className="grid gap-2">
                                {report.reportStatus === "RESOLVED" && (
                                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800">
                                    Specialist response sent. The reporter has been notified and the case is now marked resolved.
                                  </div>
                                )}
                                <textarea
                                  value={responseDrafts[report.id] ?? ""}
                                  onChange={(e) =>
                                    setResponseDrafts((prev) => ({
                                      ...prev,
                                      [report.id]: e.target.value,
                                    }))
                                  }
                                  rows={4}
                                  placeholder={
                                    report.reportStatus === "RESOLVED"
                                      ? "Add a follow-up specialist response if needed."
                                      : "Add a specialist response that will appear in the report timeline."
                                  }
                                  disabled={actionLoading === `report-response-${report.id}`}
                                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none resize-none"
                                />
                                <button
                                  onClick={() => runSpecialistResponse(report.id)}
                                  disabled={actionLoading === `report-response-${report.id}`}
                                  className="w-full bg-purple-600 text-white py-2.5 rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50"
                                >
                                  {report.reportStatus === "RESOLVED"
                                    ? "Send Follow-up Response"
                                    : "Send Specialist Response"}
                                </button>
                              </div>
                            ) : (
                              <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm text-gray-600">
                                {getFailureHint(report.moderationStatus)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}

              {view === "FORUM" &&
                filteredItems.map((item) => {
                  const post = item as ForumModerationQueueItemResponse;
                  const actionKey = `forum-${post.id}`;
                  return (
                    <article key={post.id} className="border rounded-2xl p-6">
                      <div className="flex items-start justify-between gap-6 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <span className={`text-xs px-3 py-1 rounded-full border ${getRiskBadge(post.riskLevel)}`}>
                              {formatRiskLabel(post.riskLevel)} risk
                            </span>
                            <span className={`text-xs px-3 py-1 rounded-full border ${getStatusBadge(post.moderationStatus)}`}>
                              {formatStatusLabel(post.moderationStatus)}
                            </span>
                            <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                              Score {post.riskScore}/100
                            </span>
                            <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                              {post.category.replaceAll("_", " ")}
                            </span>
                          </div>

                          <h2 className="text-2xl font-semibold text-gray-900">{post.title}</h2>
                          <p className="text-sm text-gray-500 mt-2">
                            Created {formatDateTime(post.createdAt)} | analyzed {formatDateTime(post.analyzedAt)}
                          </p>
                        </div>

                        <button
                          onClick={() => navigate(`/forum/${post.id}`)}
                          className="border px-3 py-2 rounded-lg text-sm hover:bg-gray-50 whitespace-nowrap"
                        >
                          Open Post
                        </button>
                      </div>

                      <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-8">
                          <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                            <p className="text-sm text-gray-700 leading-7 whitespace-pre-wrap">
                              {post.content}
                            </p>
                          </div>

                          <div className="mt-4 rounded-xl bg-red-50 border border-red-100 p-4">
                            <p className="text-xs uppercase tracking-wide text-red-700 font-semibold mb-2">
                              AI Analysis Summary
                            </p>
                            <p className="text-sm text-red-900">
                              {getSummaryText(post.riskSummary, post.moderationStatus, post.moderationNotes)}
                            </p>
                            {post.moderationNotes && (
                              <p className="text-sm text-red-800 mt-3">{post.moderationNotes}</p>
                            )}
                          </div>
                        </div>

                        <div className="col-span-4 space-y-4">
                          <div className="border rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <UserRound className="w-4 h-4 text-gray-500" />
                              <h3 className="font-semibold">Author</h3>
                            </div>
                            <p className="text-sm font-medium text-gray-900">{post.authorNickname}</p>
                            <p className="text-sm text-gray-600 mt-1">{post.authorEmail}</p>
                            <p className="text-xs text-gray-500 mt-3">
                              {post.anonymousToCommunity
                                ? "Posted anonymously to the community"
                                : "Visible publicly under the user's profile"}
                            </p>
                          </div>

                          <div className="border rounded-xl p-4">
                            <p className="text-sm text-gray-500">Risk metrics</p>
                            <p className="text-2xl font-bold mt-1">{post.riskScore}/100</p>
                            <p className="text-sm text-gray-600 mt-2">
                              Sentiment {post.sentimentScore.toFixed(2)}
                            </p>
                          </div>

                          <div className="grid gap-2">
                            {post.flaggedForReview ? (
                              <>
                                <button
                                  onClick={() => runForumAction(post.id, escalateFlaggedForumPost)}
                                  disabled={actionLoading === actionKey}
                                  className="w-full bg-red-600 text-white py-2.5 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                                >
                                  Escalate to Specialist
                                </button>
                                <button
                                  onClick={() => runForumAction(post.id, reviewFlaggedForumPost)}
                                  disabled={actionLoading === actionKey}
                                  className="w-full border py-2.5 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
                                >
                                  Mark Reviewed
                                </button>
                                <button
                                  onClick={() => runForumAction(post.id, dismissFlaggedForumPost)}
                                  disabled={actionLoading === actionKey}
                                  className="w-full border py-2.5 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
                                >
                                  Dismiss Flag
                                </button>
                              </>
                            ) : (
                              <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm text-gray-600">
                                {getFailureHint(post.moderationStatus)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
