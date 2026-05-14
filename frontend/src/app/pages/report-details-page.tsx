import { Footer } from "../components/footer";
import { Header } from "../components/header";
import {
  ArrowLeft,
  CalendarDays,
  CircleCheckBig,
  Clock3,
  Download,
  FileText,
  ImageIcon,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getReportById,
  ReportDetailResponse,
  ReportStatus,
} from "../api/report-api";

const STATUS_LABELS: Record<ReportStatus, string> = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  RESOLVED: "Resolved",
};

function getStatusClasses(status: ReportStatus) {
  switch (status) {
    case "SUBMITTED":
      return "bg-[#A3CEF1]/45 text-[#274C77] border-[#6096BA]/40";
    case "UNDER_REVIEW":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "RESOLVED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-[#D6DCE1]/40 text-[#274C77] border-[#D6DCE1]";
  }
}

function formatCategory(raw: string) {
  return raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

type Attachment = {
  name: string;
  type: string;
  size: number;
  url: string;
};

function parseAttachments(description: string): {
  text: string;
  attachments: Attachment[];
} {
  const match = description.match(/<!--ATTACHMENTS:([\s\S]*?)-->/);
  if (!match) return { text: description, attachments: [] };

  try {
    const attachments: Attachment[] = JSON.parse(match[1]);
    const text = description
      .replace(/\n\n<!--ATTACHMENTS:[\s\S]*?-->/, "")
      .trim();
    return { text, attachments };
  } catch {
    return { text: description, attachments: [] };
  }
}

function AttachmentCard({ attachment }: { attachment: Attachment }) {
  const isImage = attachment.type.startsWith("image/");
  const sizeKb = (attachment.size / 1024).toFixed(0);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = attachment.url;
    a.download = attachment.name;
    a.target = "_blank";
    a.click();
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#D6DCE1] bg-[#F6F8F9] p-3 transition hover:border-[#6096BA]/60 hover:bg-white">
      {isImage ? (
        <img
          src={attachment.url}
          alt={attachment.name}
          className="h-12 w-12 shrink-0 rounded-lg border border-[#D6DCE1] object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#D6DCE1] bg-white">
          <FileText className="h-5 w-5 text-[#274C77]/60" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-sm font-semibold text-[#274C77]">
          {attachment.name}
        </p>
        <p className="font-sans text-xs text-[#274C77]/50">
          {sizeKb} KB · {isImage ? "Image" : "Document"}
        </p>
      </div>

      <button
        onClick={handleDownload}
        title="Download file"
        className="shrink-0 rounded-lg border border-[#D6DCE1] p-2 text-[#274C77]/60 transition hover:border-[#6096BA] hover:bg-[#A3CEF1]/30 hover:text-[#274C77]"
      >
        <Download className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ReportDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const reportId = Number(id);

  const [report, setReport] = useState<ReportDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) {
      setError("Invalid report ID");
      setIsLoading(false);
      return;
    }

    getReportById(reportId)
      .then(setReport)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [reportId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F9F7F3] font-sans text-[#274C77]">
        <Header />
        <main className="flex-1">
          <section className="relative overflow-hidden bg-[#A3CEF1]">
            <div className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:radial-gradient(#274C77_1px,transparent_1px)] [background-size:30px_30px]" />
            <div className="relative mx-auto max-w-7xl px-8 py-10">
              <div className="h-4 w-32 animate-pulse rounded bg-[#274C77]/10" />
              <div className="mt-5 h-12 w-80 animate-pulse rounded bg-[#274C77]/10" />
            </div>
          </section>

          <div className="mx-auto max-w-7xl px-8 py-10">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-8">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[#6096BA]/10 bg-white p-8 shadow-[0_8px_40px_rgba(36,76,90,0.08)]"
                  >
                    <div className="h-5 w-40 animate-pulse rounded bg-[#274C77]/10" />
                    <div className="mt-5 h-4 w-full animate-pulse rounded bg-[#274C77]/10" />
                    <div className="mt-3 h-4 w-5/6 animate-pulse rounded bg-[#274C77]/10" />
                  </div>
                ))}
              </div>
              <div className="space-y-6 lg:col-span-4">
                <div className="rounded-2xl border border-[#6096BA]/10 bg-white p-6 shadow-[0_8px_40px_rgba(36,76,90,0.08)]">
                  <div className="h-5 w-32 animate-pulse rounded bg-[#274C77]/10" />
                  <div className="mt-5 h-10 w-full animate-pulse rounded bg-[#274C77]/10" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F9F7F3] font-sans text-[#274C77]">
        <Header />
        <main className="flex flex-1 items-center justify-center px-8 py-16">
          <div className="w-full max-w-2xl rounded-2xl border border-[#6096BA]/10 bg-white p-10 text-center shadow-[0_8px_40px_rgba(36,76,90,0.10)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#A3CEF1]/45 text-[#274C77]">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h1 className="mt-6 font-display text-4xl leading-tight tracking-[-0.04em] text-[#274C77]">
              Report not found
            </h1>
            <p className="mt-3 font-sans text-[15px] leading-7 text-[#274C77]/60">
              {error ??
                "The report you are looking for does not exist or may no longer be available."}
            </p>
            <button
              onClick={() => navigate("/my-reports")}
              className="mt-7 rounded-sm bg-[#6096BA] px-6 py-3 font-sans text-sm font-semibold text-white transition hover:bg-[#274C77]"
            >
              Return to My Reports
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { text: descriptionText, attachments } = parseAttachments(
    report.description
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#F9F7F3] font-sans text-[#274C77]">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-[#274C77]/10 bg-[#A3CEF1]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:radial-gradient(#274C77_1px,transparent_1px)] [background-size:30px_30px]" />

          <div className="relative mx-auto max-w-7xl px-8 py-10">
            <button
              onClick={() => navigate("/my-reports")}
              className="mb-7 inline-flex items-center gap-2 rounded-sm border border-[#274C77]/20 bg-white/50 px-4 py-2 font-sans text-sm font-semibold text-[#274C77]/70 transition hover:border-[#274C77]/35 hover:bg-white hover:text-[#274C77]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to My Reports
            </button>

            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#274C77]/15 bg-white/55 px-4 py-2 font-sans text-sm font-semibold text-[#274C77]">
                    <FileText className="h-4 w-4" />
                    {report.reference}
                  </span>

                  <span
                    className={`inline-flex rounded-full border px-4 py-2 font-sans text-xs font-bold uppercase tracking-[0.14em] ${getStatusClasses(
                      report.status
                    )}`}
                  >
                    {STATUS_LABELS[report.status]}
                  </span>
                </div>

                <p className="font-sans text-[12px] font-bold uppercase tracking-[0.22em] text-[#274C77]/65">
                  Report details
                </p>
                <h1 className="mt-3 font-display text-[44px] leading-[1.05] tracking-[-0.04em] text-[#274C77] sm:text-[60px]">
                  {formatCategory(report.category)}
                </h1>
                <p className="mt-5 max-w-3xl font-sans text-[17px] leading-[1.75] tracking-[-0.01em] text-[#274C77]/65">
                  {report.title}
                </p>
              </div>

              <div className="rounded-2xl border border-[#274C77]/10 bg-white/65 p-5 backdrop-blur-sm">
                <p className="font-sans text-[12px] font-bold uppercase tracking-[0.18em] text-[#274C77]/55">
                  Current status
                </p>
                <p className="mt-2 font-display text-3xl tracking-[-0.04em] text-[#274C77]">
                  {STATUS_LABELS[report.status]}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-8 py-10">
          <div className="grid gap-8 lg:grid-cols-12">
            <section className="space-y-6 lg:col-span-8">
              <article className="rounded-2xl border border-[#6096BA]/10 bg-white p-8 shadow-[0_8px_40px_rgba(36,76,90,0.08)]">
                <div className="grid gap-4 border-b border-[#D6DCE1]/70 pb-6 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl bg-[#F6F8F9] p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A3CEF1]/55">
                      <CalendarDays className="h-4 w-4 text-[#274C77]" />
                    </div>
                    <div>
                      <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-[#274C77]/45">
                        Submitted
                      </p>
                      <p className="font-sans text-sm font-semibold text-[#274C77]">
                        {report.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-[#F6F8F9] p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A3CEF1]/55">
                      <Clock3 className="h-4 w-4 text-[#274C77]" />
                    </div>
                    <div>
                      <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-[#274C77]/45">
                        Status
                      </p>
                      <p className="font-sans text-sm font-semibold text-[#274C77]">
                        {STATUS_LABELS[report.status]}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-[#6096BA]/15 bg-[#A3CEF1]/20 p-5">
                  <p className="font-sans text-[13px] font-semibold text-[#274C77]">
                    Anonymous report protection
                  </p>
                  <p className="mt-1 font-sans text-sm leading-6 text-[#274C77]/60">
                    This report is shown without personal identity details to
                    keep the reporting process safe and privacy-first.
                  </p>
                </div>
              </article>

              <div className="rounded-2xl border border-[#6096BA]/10 bg-white p-8 shadow-[0_8px_40px_rgba(36,76,90,0.08)]">
                <h2 className="font-display text-3xl leading-tight tracking-[-0.03em] text-[#274C77]">
                  Report description
                </h2>
                <p className="mt-5 whitespace-pre-wrap font-sans text-[15px] leading-8 tracking-[-0.01em] text-[#274C77]/70">
                  {descriptionText}
                </p>
              </div>

              {attachments.length > 0 && (
                <div className="rounded-2xl border border-[#6096BA]/10 bg-white p-8 shadow-[0_8px_40px_rgba(36,76,90,0.08)]">
                  <div className="mb-5 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-[#274C77]/55" />
                    <h2 className="font-display text-3xl leading-tight tracking-[-0.03em] text-[#274C77]">
                      Attachments
                    </h2>
                    <span className="font-sans text-sm text-[#274C77]/45">
                      ({attachments.length} file
                      {attachments.length !== 1 ? "s" : ""})
                    </span>
                  </div>

                  <div className="space-y-3">
                    {attachments.map((att, i) => (
                      <AttachmentCard key={i} attachment={att} />
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-[#6096BA]/10 bg-white p-8 shadow-[0_8px_40px_rgba(36,76,90,0.08)]">
                <h2 className="font-display text-3xl leading-tight tracking-[-0.03em] text-[#274C77]">
                  Status timeline
                </h2>

                {report.timeline.length === 0 ? (
                  <div className="mt-6 rounded-xl border border-[#D6DCE1] bg-[#F6F8F9] p-6">
                    <p className="font-sans text-sm font-semibold text-[#274C77]">
                      No updates yet
                    </p>
                    <p className="mt-1 font-sans text-sm leading-6 text-[#274C77]/55">
                      Status updates will appear here when the report is
                      reviewed or resolved.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-5">
                    {report.timeline.map((item) => (
                      <div key={item.id} className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#A3CEF1]/55 text-[#274C77]">
                          <CircleCheckBig className="h-5 w-5" />
                        </div>

                        <div className="w-full rounded-xl border border-[#D6DCE1] bg-[#F6F8F9] p-5">
                          <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="font-sans font-semibold text-[#274C77]">
                              {item.title}
                            </h3>
                            <span className="font-sans text-sm text-[#274C77]/50">
                              {item.occurredAt}
                            </span>
                          </div>
                          <p className="font-sans text-sm leading-6 text-[#274C77]/60">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <aside className="space-y-6 lg:col-span-4">
              <div className="rounded-2xl border border-[#6096BA]/15 bg-[#A3CEF1]/35 p-6 shadow-[0_8px_40px_rgba(36,76,90,0.08)]">
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70">
                    <ShieldAlert className="h-5 w-5 text-[#274C77]" />
                  </div>
                  <h3 className="font-display text-2xl leading-tight tracking-[-0.03em] text-[#274C77]">
                    Need more help?
                  </h3>
                </div>

                <p className="mb-5 font-sans text-sm leading-6 text-[#274C77]/65">
                  If the situation becomes urgent or unsafe, use crisis support
                  resources immediately.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/crisis-help")}
                    className="w-full rounded-sm bg-[#6096BA] py-3 font-sans text-sm font-semibold text-white transition hover:bg-[#274C77]"
                  >
                    Crisis Help
                  </button>
                  <button
                    onClick={() => navigate("/report")}
                    className="w-full rounded-sm border border-[#274C77]/20 bg-white/50 py-3 font-sans text-sm font-semibold text-[#274C77] transition hover:border-[#274C77]/35 hover:bg-white"
                  >
                    Submit Another Report
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-[#6096BA]/10 bg-white p-6 shadow-[0_8px_40px_rgba(36,76,90,0.08)]">
                <h4 className="font-display text-2xl leading-tight tracking-[-0.03em] text-[#274C77]">
                  Quick actions
                </h4>

                <div className="mt-5 space-y-3">
                  <button
                    onClick={() => navigate("/my-reports")}
                    className="w-full rounded-sm border border-[#274C77]/20 bg-transparent py-3 font-sans text-sm font-semibold text-[#274C77] transition hover:border-[#274C77]/35 hover:bg-[#A3CEF1]/25"
                  >
                    Back to My Reports
                  </button>
                  <button
                    onClick={() => navigate("/knowledge-base")}
                    className="w-full rounded-sm border border-[#274C77]/20 bg-transparent py-3 font-sans text-sm font-semibold text-[#274C77] transition hover:border-[#274C77]/35 hover:bg-[#A3CEF1]/25"
                  >
                    Open Knowledge Base
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}