import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowUpRight, Brain, Download, FileText, Search, ShieldAlert, UserRound } from "lucide-react";
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
  revealReportIdentity,
  reviewFlaggedForumPost,
  reviewFlaggedReport,
  type ForumModerationQueueItemResponse,
  type ForumModerationStatus,
  type ForumRiskLevel,
  type ReportModerationQueueItemResponse,
} from "../api/admin-api";

// ── Attachment helpers ─────────────────────────────────────────────────────────

type Attachment = {
  name: string;
  type: string;
  size: number;
  url: string;
};

function parseAttachments(description: string): { text: string; attachments: Attachment[] } {
  const match = description.match(/<!--ATTACHMENTS:([\s\S]*?)-->/);
  if (!match) return { text: description, attachments: [] };
  try {
    const attachments: Attachment[] = JSON.parse(match[1]);
    const text = description.replace(/\n\n<!--ATTACHMENTS:[\s\S]*?-->/, "").trim();
    return { text, attachments };
  } catch {
    return { text: description, attachments: [] };
  }
}

function AttachmentCard({ attachment }: { attachment: Attachment }) {
  const isImage = attachment.type.startsWith("image/");
  const sizeKb = (attachment.size / 1024).toFixed(0);
  const [hovered, setHovered] = useState(false);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = attachment.url;
    a.download = attachment.name;
    a.target = "_blank";
    a.click();
  };

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl border transition-colors"
      style={{
        backgroundColor: hovered ? "#F0F8FA" : "#FAFAFA",
        borderColor: "#D6DCE1",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isImage ? (
        <img
          src={attachment.url}
          alt={attachment.name}
          className="w-11 h-11 rounded-lg object-cover shrink-0 border"
          style={{ borderColor: "#D6DCE1" }}
        />
      ) : (
        <div
          className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border"
          style={{ backgroundColor: "#FEF2F2", borderColor: "#FECACA" }}
        >
          <FileText className="w-4 h-4" style={{ color: "#EF4444" }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: "#274C77", fontFamily: "DM Sans, sans-serif" }}>
          {attachment.name}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#274C77", opacity: 0.55, fontFamily: "DM Sans, sans-serif" }}>
          {sizeKb} KB · {isImage ? "Image" : "Document"}
        </p>
      </div>
      <button
        onClick={handleDownload}
        title="Download file"
        className="shrink-0 p-2 rounded-lg border transition-colors"
        style={{
          borderColor: hovered ? "#6096BA" : "#D6DCE1",
          backgroundColor: hovered ? "#E8F4F8" : "transparent",
          color: hovered ? "#274C77" : "#274C77",
        }}
      >
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
}

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

function getRiskBadgeStyle(level: ForumRiskLevel): React.CSSProperties {
  switch (level) {
    case "CRITICAL":
      return { backgroundColor: "#FEE2E2", color: "#B91C1C", borderColor: "#FECACA" };
    case "HIGH":
      return { backgroundColor: "#FFEDD5", color: "#C2410C", borderColor: "#FED7AA" };
    case "MODERATE":
      return { backgroundColor: "#FEF9C3", color: "#A16207", borderColor: "#FDE68A" };
    default:
      return { backgroundColor: "#DBEAFE", color: "#1D4ED8", borderColor: "#BFDBFE" };
  }
}

function getStatusBadgeStyle(status: ForumModerationStatus): React.CSSProperties {
  switch (status) {
    case "FLAGGED":
      return { backgroundColor: "#FEE2E2", color: "#B91C1C", borderColor: "#FECACA" };
    case "ANALYSIS_FAILED":
      return { backgroundColor: "#FFE4E6", color: "#BE123C", borderColor: "#FECDD3" };
    case "PENDING_ANALYSIS":
      return { backgroundColor: "#FEF9C3", color: "#A16207", borderColor: "#FDE68A" };
    case "REVIEWED":
      return { backgroundColor: "#E0F2FE", color: "#0369A1", borderColor: "#BAE6FD" };
    case "ESCALATED_TO_SPECIALIST":
      return { backgroundColor: "#F3E8FF", color: "#7E22CE", borderColor: "#E9D5FF" };
    case "DISMISSED":
      return { backgroundColor: "#F1F5F9", color: "#475569", borderColor: "#E2E8F0" };
    default:
      return { backgroundColor: "#D1FAE5", color: "#065F46", borderColor: "#A7F3D0" };
  }
}

function getReportStatusBadgeStyle(status: ReportModerationQueueItemResponse["reportStatus"]): React.CSSProperties {
  switch (status) {
    case "RESOLVED":
      return { backgroundColor: "#D1FAE5", color: "#065F46", borderColor: "#A7F3D0" };
    case "UNDER_REVIEW":
      return { backgroundColor: "#FEF9C3", color: "#A16207", borderColor: "#FDE68A" };
    default:
      return { backgroundColor: "#E0F2FE", color: "#0369A1", borderColor: "#BAE6FD" };
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
  if (summary && summary.trim()) return summary;
  if (notes && notes.trim()) return notes;
  return getFailureHint(status);
}

// ── Badge component ────────────────────────────────────────────────────────────

function Badge({ style, children }: { style: React.CSSProperties; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-semibold tracking-wide"
      style={{ fontFamily: "DM Sans, sans-serif", ...style }}
    >
      {children}
    </span>
  );
}

// ── Loading skeleton ───────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className}`}
      style={{ backgroundColor: "rgba(36,76,90,0.07)" }}
    />
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-2xl border p-6"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#D6DCE1" }}
        >
          <div className="flex items-start justify-between gap-6 mb-5">
            <div className="flex-1 space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 space-y-3">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="col-span-4 space-y-3">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminForumRiskPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const isSpecialist = user?.role === "SPECIALIST";
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
  const [pendingRevealReport, setPendingRevealReport] =
    useState<ReportModerationQueueItemResponse | null>(null);

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

  async function runRevealIdentity(reportId: number) {
    const actionKey = `report-reveal-${reportId}`;
    try {
      setActionLoading(actionKey);
      const updated = await revealReportIdentity(reportId);
      setReports((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setPendingRevealReport(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reveal reporter identity");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F9F7F3", fontFamily: "DM Sans, sans-serif", color: "#274C77" }}
    >
      <Header />

      {/* ── Identity Reveal Modal ─────────────────────────────────────────────── */}
      {pendingRevealReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(36,76,90,0.45)" }}>
          <div
            className="w-full max-w-xl rounded-2xl p-8 shadow-2xl"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #D6DCE1" }}
          >
            <p
              className="text-[11px] font-bold uppercase tracking-[0.22em] mb-3"
              style={{ color: "#DC2626", fontFamily: "DM Sans, sans-serif" }}
            >
              Sensitive action · Confirm identity reveal
            </p>
            <h2
              className="text-2xl leading-tight tracking-[-0.03em] mb-3"
              style={{ fontFamily: "DM Serif Display, serif", color: "#274C77" }}
            >
              Reveal anonymous reporter identity?
            </h2>
            <p
              className="text-sm leading-[1.75] mb-5"
              style={{ color: "#274C77", opacity: 0.65, fontFamily: "DM Sans, sans-serif" }}
            >
              This action exposes the reporter email for case{" "}
              <span className="font-semibold" style={{ opacity: 1, color: "#274C77" }}>
                {pendingRevealReport.reference}
              </span>
              . Only continue if identity access is necessary for specialist intervention on an escalated safety case.
            </p>
            <div
              className="rounded-xl p-4 text-sm leading-[1.7] mb-6"
              style={{ backgroundColor: "#FEF2F2", borderColor: "#FECACA", border: "1px solid #FECACA", color: "#B91C1C", fontFamily: "DM Sans, sans-serif" }}
            >
              This action is sensitive and should only be used when anonymous handling is no longer sufficient for protecting the user.
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPendingRevealReport(null)}
                disabled={actionLoading === `report-reveal-${pendingRevealReport.id}`}
                className="rounded-sm px-5 py-2.5 text-sm font-semibold border transition-colors disabled:opacity-50"
                style={{
                  borderColor: "rgba(36,76,90,0.2)",
                  color: "#274C77",
                  backgroundColor: "transparent",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => runRevealIdentity(pendingRevealReport.id)}
                disabled={actionLoading === `report-reveal-${pendingRevealReport.id}`}
                className="rounded-sm px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: "#DC2626", fontFamily: "DM Sans, sans-serif" }}
              >
                Confirm Reveal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero strip ───────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b" style={{ backgroundColor: "#A3CEF1", borderColor: "rgba(36,76,90,0.12)" }}>
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.10]"
          style={{
            backgroundImage: "radial-gradient(#274C77 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-10 flex items-end justify-between gap-6">
          <div>
            <p
              className="text-[11px] font-bold uppercase tracking-[0.22em] mb-3"
              style={{ color: "#274C77", opacity: 0.6, fontFamily: "DM Sans, sans-serif" }}
            >
              Admin · Moderation
            </p>
            <h1
              className="text-[38px] sm:text-[48px] leading-[1.05] tracking-[-0.04em]"
              style={{ fontFamily: "DM Serif Display, serif", color: "#274C77" }}
            >
              {queueMode === "SPECIALIST" ? "Specialist Queue" : "Moderation Queue"}
            </h1>
            <p
              className="mt-2 text-[15px] leading-[1.7] max-w-2xl"
              style={{ color: "#274C77", opacity: 0.65, fontFamily: "DM Sans, sans-serif" }}
            >
              {queueMode === "SPECIALIST"
                ? "Focus on cases already escalated to specialists and send a direct response back through the report timeline."
                : "Review AI analysis for anonymous reports and forum posts, prioritize high-risk cases, and escalate urgent situations to specialists."}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => navigate("/admin/analytics")}
              className="inline-flex items-center gap-2 rounded-sm border px-5 py-3 text-sm font-semibold transition-colors shrink-0"
              style={{
                borderColor: "rgba(36,76,90,0.25)",
                color: "#274C77",
                backgroundColor: "rgba(255,255,255,0.45)",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              View Analytics
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-10">

          {/* ── Queue mode tabs ───────────────────────────────────────────────── */}
          {canUseSpecialistQueue && (
            <div
              className="inline-flex rounded-xl p-1 gap-1 mb-7 border"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#D6DCE1" }}
            >
              {(["MODERATOR", "SPECIALIST"] as QueueMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setQueueMode(mode)}
                  className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    backgroundColor: queueMode === mode ? "#274C77" : "transparent",
                    color: queueMode === mode ? "#F9F7F3" : "#274C77",
                    opacity: queueMode !== mode ? 0.65 : 1,
                  }}
                >
                  {mode === "MODERATOR" ? "Moderator Queue" : "Escalated Cases"}
                </button>
              ))}
            </div>
          )}

          {/* ── View tabs (Reports / Forum) ───────────────────────────────────── */}
          <div
            className="inline-flex rounded-xl p-1 gap-1 mb-8 border"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#D6DCE1" }}
          >
            {(["REPORTS", "FORUM"] as ModerationView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  backgroundColor: view === v ? "#6096BA" : "transparent",
                  color: view === v ? "#FFFFFF" : "#274C77",
                  opacity: view !== v ? 0.65 : 1,
                }}
              >
                {v === "REPORTS" ? "Anonymous Reports" : "Forum Posts"}
              </button>
            ))}
          </div>

          {/* ── Summary cards ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div
              className="rounded-2xl border p-6"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#D6DCE1" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "#FEE2E2" }}
              >
                <AlertTriangle className="w-4 h-4" style={{ color: "#DC2626" }} />
              </div>
              <p
                className="text-[13px] font-semibold mb-1"
                style={{ color: "#274C77", opacity: 0.55, fontFamily: "DM Sans, sans-serif" }}
              >
                Critical cases
              </p>
              <p
                className="text-[32px] leading-none tracking-[-0.03em]"
                style={{ fontFamily: "DM Serif Display, serif", color: "#274C77" }}
              >
                {criticalCount}
              </p>
            </div>

            <div
              className="rounded-2xl border p-6"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#D6DCE1" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "#FEF9C3" }}
              >
                <ShieldAlert className="w-4 h-4" style={{ color: "#CA8A04" }} />
              </div>
              <p
                className="text-[13px] font-semibold mb-1"
                style={{ color: "#274C77", opacity: 0.55, fontFamily: "DM Sans, sans-serif" }}
              >
                Flagged items
              </p>
              <p
                className="text-[32px] leading-none tracking-[-0.03em]"
                style={{ fontFamily: "DM Serif Display, serif", color: "#274C77" }}
              >
                {flaggedCount}
              </p>
            </div>

            <div
              className="rounded-2xl border p-6"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#D6DCE1" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "#DBEAFE" }}
              >
                <Brain className="w-4 h-4" style={{ color: "#2563EB" }} />
              </div>
              <p
                className="text-[13px] font-semibold mb-1"
                style={{ color: "#274C77", opacity: 0.55, fontFamily: "DM Sans, sans-serif" }}
              >
                Analysis failures
              </p>
              <p
                className="text-[32px] leading-none tracking-[-0.03em]"
                style={{ fontFamily: "DM Serif Display, serif", color: "#274C77" }}
              >
                {failedCount}
              </p>
            </div>
          </div>

          {/* ── Status filter chips ───────────────────────────────────────────── */}
          {queueMode === "MODERATOR" ? (
            <div className="flex flex-wrap gap-2 mb-5">
              {STATUS_FILTERS.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className="px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-colors"
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    backgroundColor: statusFilter === status ? "#274C77" : "#FFFFFF",
                    color: statusFilter === status ? "#F9F7F3" : "#274C77",
                    borderColor: statusFilter === status ? "#274C77" : "#D6DCE1",
                    opacity: statusFilter !== status ? 0.7 : 1,
                  }}
                >
                  {status === "ALL" ? "All Items" : formatStatusLabel(status)}
                </button>
              ))}
            </div>
          ) : (
            <div
              className="mb-5 rounded-xl px-5 py-3 text-sm border"
              style={{
                backgroundColor: "#F3E8FF",
                borderColor: "#E9D5FF",
                color: "#7E22CE",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Showing only items with status <span className="font-semibold">{formatStatusLabel("ESCALATED_TO_SPECIALIST")}</span>.
            </div>
          )}

          {/* ── Search bar ───────────────────────────────────────────────────── */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl border mb-7"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#D6DCE1" }}
          >
            <Search className="w-4 h-4 shrink-0" style={{ color: "#274C77", opacity: 0.4 }} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                view === "REPORTS"
                  ? queueMode === "SPECIALIST"
                    ? "Search escalated reports by reference, title, description, reporter, or specialist notes"
                    : "Search reports by reference, title, description, reporter, or analysis summary"
                  : queueMode === "SPECIALIST"
                  ? "Search escalated forum posts by title, content, author, or analysis summary"
                  : "Search forum posts by title, content, author, or analysis summary"
              }
              className="w-full outline-none bg-transparent text-sm"
              style={{ color: "#274C77", fontFamily: "DM Sans, sans-serif" }}
            />
          </div>

          {/* ── Content states ────────────────────────────────────────────────── */}
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div
              className="rounded-2xl border p-14 text-center"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#D6DCE1" }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#FEE2E2" }}
              >
                <AlertTriangle className="w-5 h-5" style={{ color: "#DC2626" }} />
              </div>
              <h3
                className="text-[20px] tracking-[-0.03em] mb-2"
                style={{ fontFamily: "DM Serif Display, serif", color: "#274C77" }}
              >
                Failed to load queue
              </h3>
              <p
                className="text-sm mb-5"
                style={{ color: "#274C77", opacity: 0.6, fontFamily: "DM Sans, sans-serif" }}
              >
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-sm px-5 py-2.5 text-sm font-semibold text-white"
                style={{ backgroundColor: "#6096BA", fontFamily: "DM Sans, sans-serif" }}
              >
                Retry
              </button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div
              className="rounded-2xl border p-14 text-center"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#D6DCE1" }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#E8F4F8" }}
              >
                <ShieldAlert className="w-5 h-5" style={{ color: "#6096BA" }} />
              </div>
              <h3
                className="text-[22px] tracking-[-0.03em] mb-2"
                style={{ fontFamily: "DM Serif Display, serif", color: "#274C77" }}
              >
                No items match this view
              </h3>
              <p
                className="text-sm max-w-md mx-auto"
                style={{ color: "#274C77", opacity: 0.6, fontFamily: "DM Sans, sans-serif" }}
              >
                {queueMode === "SPECIALIST"
                  ? "No escalated cases match this view right now."
                  : "Try a different filter, or wait for MentalBERT analysis to complete after submission."}
              </p>
            </div>
          ) : (
            <div className="space-y-5">

              {/* ── REPORTS ──────────────────────────────────────────────────── */}
              {view === "REPORTS" &&
                filteredItems.map((item) => {
                  const report = item as ReportModerationQueueItemResponse;
                  const actionKey = `report-${report.id}`;
                  const revealActionKey = `report-reveal-${report.id}`;
                  const canRevealIdentity =
                    isSpecialist &&
                    report.anonymous &&
                    !report.identityRevealed &&
                    report.moderationStatus === "ESCALATED_TO_SPECIALIST";

                  return (
                    <article
                      key={report.id}
                      className="rounded-2xl border p-6"
                      style={{ backgroundColor: "#FFFFFF", borderColor: "#D6DCE1" }}
                    >
                      {/* Card header */}
                      <div className="flex items-start justify-between gap-6 mb-5">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge style={getRiskBadgeStyle(report.riskLevel)}>
                              {formatRiskLabel(report.riskLevel)} risk
                            </Badge>
                            <Badge style={getStatusBadgeStyle(report.moderationStatus)}>
                              {formatStatusLabel(report.moderationStatus)}
                            </Badge>
                            <span
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border"
                              style={{
                                backgroundColor: "#F1F5F9",
                                color: "#475569",
                                borderColor: "#E2E8F0",
                                fontFamily: "DM Sans, sans-serif",
                              }}
                            >
                              {report.reference}
                            </span>
                            <span
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border"
                              style={{
                                backgroundColor: "#F8FAFC",
                                color: "#64748B",
                                borderColor: "#E2E8F0",
                                fontFamily: "DM Sans, sans-serif",
                              }}
                            >
                              {report.category.replaceAll("_", " ")}
                            </span>
                          </div>
                          <h2
                            className="text-[22px] leading-tight tracking-[-0.03em] mb-1"
                            style={{ fontFamily: "DM Serif Display, serif", color: "#274C77" }}
                          >
                            {report.title}
                          </h2>
                          <p
                            className="text-[13px]"
                            style={{ color: "#274C77", opacity: 0.5, fontFamily: "DM Sans, sans-serif" }}
                          >
                            Created {formatDateTime(report.createdAt)} · analyzed {formatDateTime(report.analyzedAt)}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p
                            className="text-[12px] font-semibold mb-2"
                            style={{ color: "#274C77", opacity: 0.5, fontFamily: "DM Sans, sans-serif" }}
                          >
                            Report status
                          </p>
                          <Badge style={getReportStatusBadgeStyle(report.reportStatus)}>
                            {formatReportStatusLabel(report.reportStatus)}
                          </Badge>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 lg:col-span-8 space-y-4">
                          {(() => {
                            const { text: descText, attachments } = parseAttachments(report.description);
                            return (
                              <>
                                <div
                                  className="rounded-xl p-4 border"
                                  style={{ backgroundColor: "#F8FAFB", borderColor: "#D6DCE1" }}
                                >
                                  <p
                                    className="text-sm leading-[1.8] whitespace-pre-wrap"
                                    style={{ color: "#274C77", opacity: 0.75, fontFamily: "DM Sans, sans-serif" }}
                                  >
                                    {descText}
                                  </p>
                                </div>
                                {attachments.length > 0 && (
                                  <div>
                                    <p
                                      className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2"
                                      style={{ color: "#274C77", opacity: 0.5, fontFamily: "DM Sans, sans-serif" }}
                                    >
                                      Attachments ({attachments.length})
                                    </p>
                                    <div className="space-y-2">
                                      {attachments.map((att, i) => (
                                        <AttachmentCard key={i} attachment={att} />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </>
                            );
                          })()}

                          {/* AI Analysis */}
                          <div
                            className="rounded-xl p-4 border"
                            style={{ backgroundColor: "#FFFBEB", borderColor: "#FDE68A" }}
                          >
                            <p
                              className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2"
                              style={{ color: "#92400E", fontFamily: "DM Sans, sans-serif" }}
                            >
                              AI Analysis Summary
                            </p>
                            <p
                              className="text-sm leading-[1.75]"
                              style={{ color: "#78350F", fontFamily: "DM Sans, sans-serif" }}
                            >
                              {getSummaryText(report.riskSummary, report.moderationStatus, report.moderationNotes)}
                            </p>
                            {report.moderationNotes && (
                              <p
                                className="text-sm leading-[1.75] mt-3 pt-3 border-t"
                                style={{ color: "#92400E", borderColor: "#FDE68A", fontFamily: "DM Sans, sans-serif" }}
                              >
                                {report.moderationNotes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="col-span-12 lg:col-span-4 space-y-4">
                          {/* Reporter card */}
                          <div
                            className="rounded-xl p-4 border"
                            style={{ backgroundColor: "#FAFAFA", borderColor: "#D6DCE1" }}
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <UserRound className="w-4 h-4" style={{ color: "#274C77", opacity: 0.5 }} />
                              <h3
                                className="text-[13px] font-semibold"
                                style={{ color: "#274C77", fontFamily: "DM Sans, sans-serif" }}
                              >
                                Reporter
                              </h3>
                            </div>
                            <p
                              className="text-sm font-semibold mb-1"
                              style={{ color: "#274C77", fontFamily: "DM Sans, sans-serif" }}
                            >
                              {report.reporterEmail ?? "Identity hidden"}
                            </p>
                            <p
                              className="text-[12px] leading-[1.6]"
                              style={{ color: "#274C77", opacity: 0.5, fontFamily: "DM Sans, sans-serif" }}
                            >
                              {report.anonymous
                                ? report.identityRevealed
                                  ? "Anonymous reporter revealed to specialist for this escalated case."
                                  : "Stays anonymous unless a specialist reveals identity during escalated review."
                                : "Reporter identity is visible in the moderation workflow."}
                            </p>
                            {canRevealIdentity && (
                              <button
                                onClick={() => setPendingRevealReport(report)}
                                disabled={actionLoading === revealActionKey}
                                className="mt-4 w-full py-2.5 rounded-lg text-sm font-semibold border transition-colors disabled:opacity-50"
                                style={{
                                  backgroundColor: "#F3E8FF",
                                  borderColor: "#E9D5FF",
                                  color: "#7E22CE",
                                  fontFamily: "DM Sans, sans-serif",
                                }}
                              >
                                Reveal Identity to Specialist
                              </button>
                            )}
                            {!isSpecialist &&
                              report.anonymous &&
                              report.moderationStatus === "ESCALATED_TO_SPECIALIST" &&
                              !report.identityRevealed && (
                                <p
                                  className="text-[12px] mt-3"
                                  style={{ color: "#274C77", opacity: 0.5, fontFamily: "DM Sans, sans-serif" }}
                                >
                                  Only specialists can reveal anonymous identity at this stage.
                                </p>
                              )}
                          </div>

                          {/* Risk metrics card */}
                          <div
                            className="rounded-xl p-4 border"
                            style={{ backgroundColor: "#FAFAFA", borderColor: "#D6DCE1" }}
                          >
                            <p
                              className="text-[12px] font-semibold mb-2"
                              style={{ color: "#274C77", opacity: 0.5, fontFamily: "DM Sans, sans-serif" }}
                            >
                              Risk metrics
                            </p>
                            <p
                              className="text-[30px] leading-none tracking-[-0.03em] mb-1"
                              style={{ fontFamily: "DM Serif Display, serif", color: "#274C77" }}
                            >
                              {report.riskScore}
                              <span
                                className="text-[18px] ml-1"
                                style={{ opacity: 0.4, fontFamily: "DM Sans, sans-serif" }}
                              >
                                /100
                              </span>
                            </p>
                            <p
                              className="text-sm"
                              style={{ color: "#274C77", opacity: 0.55, fontFamily: "DM Sans, sans-serif" }}
                            >
                              Sentiment {report.sentimentScore.toFixed(2)}
                            </p>
                          </div>

                          {/* Moderation actions */}
                          <div className="space-y-2">
                            {report.flaggedForReview && isAdmin ? (
                              <>
                                <button
                                  onClick={() => runReportAction(report.id, escalateFlaggedReport)}
                                  disabled={actionLoading === actionKey}
                                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50"
                                  style={{ backgroundColor: "#DC2626", fontFamily: "DM Sans, sans-serif" }}
                                >
                                  Escalate to Specialist
                                </button>
                                <button
                                  onClick={() => runReportAction(report.id, reviewFlaggedReport)}
                                  disabled={actionLoading === actionKey}
                                  className="w-full py-2.5 rounded-lg text-sm font-semibold border transition-colors disabled:opacity-50"
                                  style={{
                                    backgroundColor: "transparent",
                                    borderColor: "#D6DCE1",
                                    color: "#274C77",
                                    fontFamily: "DM Sans, sans-serif",
                                  }}
                                >
                                  Mark Reviewed
                                </button>
                                <button
                                  onClick={() => runReportAction(report.id, dismissFlaggedReport)}
                                  disabled={actionLoading === actionKey}
                                  className="w-full py-2.5 rounded-lg text-sm font-semibold border transition-colors disabled:opacity-50"
                                  style={{
                                    backgroundColor: "transparent",
                                    borderColor: "#D6DCE1",
                                    color: "#274C77",
                                    fontFamily: "DM Sans, sans-serif",
                                  }}
                                >
                                  Dismiss Flag
                                </button>
                              </>
                            ) : report.moderationStatus === "ESCALATED_TO_SPECIALIST" ? (
                              <div className="space-y-2">
                                {report.reportStatus === "RESOLVED" && (
                                  <div
                                    className="rounded-xl p-3 text-sm border"
                                    style={{
                                      backgroundColor: "#D1FAE5",
                                      borderColor: "#A7F3D0",
                                      color: "#065F46",
                                      fontFamily: "DM Sans, sans-serif",
                                    }}
                                  >
                                    Specialist response sent. The reporter has been notified and the case is marked resolved.
                                  </div>
                                )}
                                <textarea
                                  value={responseDrafts[report.id] ?? ""}
                                  onChange={(e) =>
                                    setResponseDrafts((prev) => ({ ...prev, [report.id]: e.target.value }))
                                  }
                                  rows={4}
                                  placeholder={
                                    report.reportStatus === "RESOLVED"
                                      ? "Add a follow-up specialist response if needed."
                                      : "Add a specialist response that will appear in the report timeline."
                                  }
                                  disabled={actionLoading === `report-response-${report.id}`}
                                  className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none border"
                                  style={{
                                    backgroundColor: "#F8FAFB",
                                    borderColor: "#D6DCE1",
                                    color: "#274C77",
                                    fontFamily: "DM Sans, sans-serif",
                                  }}
                                />
                                <button
                                  onClick={() => runSpecialistResponse(report.id)}
                                  disabled={actionLoading === `report-response-${report.id}`}
                                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50"
                                  style={{ backgroundColor: "#6096BA", fontFamily: "DM Sans, sans-serif" }}
                                >
                                  {report.reportStatus === "RESOLVED"
                                    ? "Send Follow-up Response"
                                    : "Send Specialist Response"}
                                </button>
                              </div>
                            ) : (
                              <div
                                className="rounded-xl p-3 text-sm border"
                                style={{
                                  backgroundColor: "#F8FAFB",
                                  borderColor: "#D6DCE1",
                                  color: "#274C77",
                                  opacity: 0.7,
                                  fontFamily: "DM Sans, sans-serif",
                                }}
                              >
                                {getFailureHint(report.moderationStatus)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}

              {/* ── FORUM POSTS ───────────────────────────────────────────────── */}
              {view === "FORUM" &&
                filteredItems.map((item) => {
                  const post = item as ForumModerationQueueItemResponse;
                  const actionKey = `forum-${post.id}`;

                  return (
                    <article
                      key={post.id}
                      className="rounded-2xl border p-6"
                      style={{ backgroundColor: "#FFFFFF", borderColor: "#D6DCE1" }}
                    >
                      {/* Card header */}
                      <div className="flex items-start justify-between gap-6 mb-5">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge style={getRiskBadgeStyle(post.riskLevel)}>
                              {formatRiskLabel(post.riskLevel)} risk
                            </Badge>
                            <Badge style={getStatusBadgeStyle(post.moderationStatus)}>
                              {formatStatusLabel(post.moderationStatus)}
                            </Badge>
                            <span
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border"
                              style={{
                                backgroundColor: "#F1F5F9",
                                color: "#475569",
                                borderColor: "#E2E8F0",
                                fontFamily: "DM Sans, sans-serif",
                              }}
                            >
                              Score {post.riskScore}/100
                            </span>
                            <span
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border"
                              style={{
                                backgroundColor: "#F8FAFC",
                                color: "#64748B",
                                borderColor: "#E2E8F0",
                                fontFamily: "DM Sans, sans-serif",
                              }}
                            >
                              {post.category.replaceAll("_", " ")}
                            </span>
                          </div>
                          <h2
                            className="text-[22px] leading-tight tracking-[-0.03em] mb-1"
                            style={{ fontFamily: "DM Serif Display, serif", color: "#274C77" }}
                          >
                            {post.title}
                          </h2>
                          <p
                            className="text-[13px]"
                            style={{ color: "#274C77", opacity: 0.5, fontFamily: "DM Sans, sans-serif" }}
                          >
                            Created {formatDateTime(post.createdAt)} · analyzed {formatDateTime(post.analyzedAt)}
                          </p>
                        </div>
                        <button
                          onClick={() => navigate(`/forum/${post.id}`)}
                          className="rounded-sm border px-4 py-2 text-sm font-semibold transition-colors shrink-0"
                          style={{
                            borderColor: "#D6DCE1",
                            color: "#274C77",
                            backgroundColor: "transparent",
                            fontFamily: "DM Sans, sans-serif",
                          }}
                        >
                          Open Post
                        </button>
                      </div>

                      {/* Card body */}
                      <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 lg:col-span-8 space-y-4">
                          <div
                            className="rounded-xl p-4 border"
                            style={{ backgroundColor: "#F8FAFB", borderColor: "#D6DCE1" }}
                          >
                            <p
                              className="text-sm leading-[1.8] whitespace-pre-wrap"
                              style={{ color: "#274C77", opacity: 0.75, fontFamily: "DM Sans, sans-serif" }}
                            >
                              {post.content}
                            </p>
                          </div>

                          {/* AI Analysis */}
                          <div
                            className="rounded-xl p-4 border"
                            style={{ backgroundColor: "#FFFBEB", borderColor: "#FDE68A" }}
                          >
                            <p
                              className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2"
                              style={{ color: "#92400E", fontFamily: "DM Sans, sans-serif" }}
                            >
                              AI Analysis Summary
                            </p>
                            <p
                              className="text-sm leading-[1.75]"
                              style={{ color: "#78350F", fontFamily: "DM Sans, sans-serif" }}
                            >
                              {getSummaryText(post.riskSummary, post.moderationStatus, post.moderationNotes)}
                            </p>
                            {post.moderationNotes && (
                              <p
                                className="text-sm leading-[1.75] mt-3 pt-3 border-t"
                                style={{ color: "#92400E", borderColor: "#FDE68A", fontFamily: "DM Sans, sans-serif" }}
                              >
                                {post.moderationNotes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="col-span-12 lg:col-span-4 space-y-4">
                          {/* Author card */}
                          <div
                            className="rounded-xl p-4 border"
                            style={{ backgroundColor: "#FAFAFA", borderColor: "#D6DCE1" }}
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <UserRound className="w-4 h-4" style={{ color: "#274C77", opacity: 0.5 }} />
                              <h3
                                className="text-[13px] font-semibold"
                                style={{ color: "#274C77", fontFamily: "DM Sans, sans-serif" }}
                              >
                                Author
                              </h3>
                            </div>
                            <p
                              className="text-sm font-semibold mb-0.5"
                              style={{ color: "#274C77", fontFamily: "DM Sans, sans-serif" }}
                            >
                              {post.authorNickname}
                            </p>
                            <p
                              className="text-sm mb-3"
                              style={{ color: "#274C77", opacity: 0.55, fontFamily: "DM Sans, sans-serif" }}
                            >
                              {post.authorEmail}
                            </p>
                            <p
                              className="text-[12px] leading-[1.6]"
                              style={{ color: "#274C77", opacity: 0.5, fontFamily: "DM Sans, sans-serif" }}
                            >
                              {post.anonymousToCommunity
                                ? "Posted anonymously to the community"
                                : "Visible publicly under the user's profile"}
                            </p>
                          </div>

                          {/* Risk metrics card */}
                          <div
                            className="rounded-xl p-4 border"
                            style={{ backgroundColor: "#FAFAFA", borderColor: "#D6DCE1" }}
                          >
                            <p
                              className="text-[12px] font-semibold mb-2"
                              style={{ color: "#274C77", opacity: 0.5, fontFamily: "DM Sans, sans-serif" }}
                            >
                              Risk metrics
                            </p>
                            <p
                              className="text-[30px] leading-none tracking-[-0.03em] mb-1"
                              style={{ fontFamily: "DM Serif Display, serif", color: "#274C77" }}
                            >
                              {post.riskScore}
                              <span
                                className="text-[18px] ml-1"
                                style={{ opacity: 0.4, fontFamily: "DM Sans, sans-serif" }}
                              >
                                /100
                              </span>
                            </p>
                            <p
                              className="text-sm"
                              style={{ color: "#274C77", opacity: 0.55, fontFamily: "DM Sans, sans-serif" }}
                            >
                              Sentiment {post.sentimentScore.toFixed(2)}
                            </p>
                          </div>

                          {/* Moderation actions */}
                          <div className="space-y-2">
                            {post.flaggedForReview ? (
                              <>
                                <button
                                  onClick={() => runForumAction(post.id, escalateFlaggedForumPost)}
                                  disabled={actionLoading === actionKey}
                                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50"
                                  style={{ backgroundColor: "#DC2626", fontFamily: "DM Sans, sans-serif" }}
                                >
                                  Escalate to Specialist
                                </button>
                                <button
                                  onClick={() => runForumAction(post.id, reviewFlaggedForumPost)}
                                  disabled={actionLoading === actionKey}
                                  className="w-full py-2.5 rounded-lg text-sm font-semibold border transition-colors disabled:opacity-50"
                                  style={{
                                    backgroundColor: "transparent",
                                    borderColor: "#D6DCE1",
                                    color: "#274C77",
                                    fontFamily: "DM Sans, sans-serif",
                                  }}
                                >
                                  Mark Reviewed
                                </button>
                                <button
                                  onClick={() => runForumAction(post.id, dismissFlaggedForumPost)}
                                  disabled={actionLoading === actionKey}
                                  className="w-full py-2.5 rounded-lg text-sm font-semibold border transition-colors disabled:opacity-50"
                                  style={{
                                    backgroundColor: "transparent",
                                    borderColor: "#D6DCE1",
                                    color: "#274C77",
                                    fontFamily: "DM Sans, sans-serif",
                                  }}
                                >
                                  Dismiss Flag
                                </button>
                              </>
                            ) : (
                              <div
                                className="rounded-xl p-3 text-sm border"
                                style={{
                                  backgroundColor: "#F8FAFB",
                                  borderColor: "#D6DCE1",
                                  color: "#274C77",
                                  opacity: 0.7,
                                  fontFamily: "DM Sans, sans-serif",
                                }}
                              >
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