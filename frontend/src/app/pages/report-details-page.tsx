import { Footer } from "../components/footer";
import { Header } from "../components/header";
import {
  ArrowLeft,
  CalendarDays,
  CircleCheckBig,
  Clock3,
  FileText,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReportById, ReportDetailResponse, ReportStatus } from "../api/report-api";

const STATUS_LABELS: Record<ReportStatus, string> = {
  SUBMITTED:    "Submitted",
  UNDER_REVIEW: "Under Review",
  RESOLVED:     "Resolved",
};

function getStatusClasses(status: ReportStatus) {
  switch (status) {
    case "SUBMITTED":    return "bg-blue-50 text-blue-700";
    case "UNDER_REVIEW": return "bg-amber-50 text-amber-700";
    case "RESOLVED":     return "bg-emerald-50 text-emerald-700";
    default:             return "bg-gray-50 text-gray-700";
  }
}

function formatCategory(raw: string) {
  return raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
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

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-8 py-12 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-8" />
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-8 space-y-6">
                <div className="border rounded-xl p-8">
                  <div className="h-6 bg-gray-200 rounded w-24 mb-4" />
                  <div className="h-8 bg-gray-200 rounded w-48 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
                <div className="border rounded-xl p-8">
                  <div className="h-5 bg-gray-200 rounded w-40 mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 rounded w-4/6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not found / error
  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-8 py-16">
            <div className="border rounded-xl p-10 text-center">
              <h1 className="text-3xl font-bold mb-3">Report not found</h1>
              <p className="text-gray-600 mb-6">
                {error ?? "The report you are looking for does not exist or may no longer be available."}
              </p>
              <button
                onClick={() => navigate("/my-reports")}
                className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-800"
              >
                Return to My Reports
              </button>
            </div>
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
          <button
            onClick={() => navigate("/my-reports")}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Reports
          </button>

          <div className="grid grid-cols-12 gap-8">
            <section className="col-span-8 space-y-6">
              {/* Header card */}
              <article className="border rounded-xl p-8">
                <div className="flex items-start justify-between gap-4 mb-5">
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

                    <h1 className="text-4xl font-bold mb-3">
                      {formatCategory(report.category)}
                    </h1>
                    <p className="text-lg text-gray-600 leading-8">{report.title}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-6 mt-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CalendarDays className="w-4 h-4" />
                    Submitted on {report.createdAt}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Clock3 className="w-4 h-4" />
                    Current status: {STATUS_LABELS[report.status]}
                  </div>
                </div>
              </article>

              {/* Description */}
              <div className="border rounded-xl p-8">
                <h2 className="text-2xl font-semibold mb-5">Report Description</h2>
                <p className="text-[15px] text-gray-700 leading-8">{report.description}</p>
              </div>

              {/* Timeline */}
              <div className="border rounded-xl p-8">
                <h2 className="text-2xl font-semibold mb-6">Status Timeline</h2>

                {report.timeline.length === 0 ? (
                  <p className="text-sm text-gray-600">
                    No status updates are available yet.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {report.timeline.map((item) => (
                      <div key={item.id} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                          <CircleCheckBig className="w-5 h-5" />
                        </div>
                        <div className="border rounded-xl p-5 w-full">
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <h3 className="font-semibold">{item.title}</h3>
                            <span className="text-sm text-gray-500">{item.occurredAt}</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-6">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Sidebar */}
            <aside className="col-span-4 space-y-6">
              <div className="border rounded-xl p-6 bg-emerald-50">
                <div className="flex items-start gap-3 mb-3">
                  <ShieldAlert className="w-5 h-5 text-emerald-700 mt-0.5" />
                  <h3 className="font-semibold">Need more help?</h3>
                </div>
                <p className="text-sm text-gray-700 leading-6 mb-4">
                  If the situation becomes urgent or unsafe, use crisis support resources immediately.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/crisis-help")}
                    className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800"
                  >
                    Crisis Help
                  </button>
                  <button
                    onClick={() => navigate("/report")}
                    className="w-full border py-3 rounded-md hover:bg-gray-50"
                  >
                    Submit Another Report
                  </button>
                </div>
              </div>

              <div className="border rounded-xl p-6">
                <h4 className="font-semibold mb-4">Quick actions</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/my-reports")}
                    className="w-full border rounded-md py-3 text-sm hover:bg-gray-50"
                  >
                    Back to My Reports
                  </button>
                  <button
                    onClick={() => navigate("/knowledge-base")}
                    className="w-full border rounded-md py-3 text-sm hover:bg-gray-50"
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