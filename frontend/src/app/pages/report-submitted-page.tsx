import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, AlertCircle, ExternalLink } from "lucide-react";

export function ReportSubmittedPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const reportId: number | undefined = location.state?.reportId;
  const referenceId = reportId
    ? `RS-${reportId}`
    : `RS-${Math.floor(10000 + Math.random() * 90000)}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#E7ECEF] text-[#274C77]">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-[#274C77]/10 bg-[#E7ECEF]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(#A3CEF1_1px,transparent_1px)] [background-size:30px_30px]" />

          <div className="relative mx-auto max-w-4xl px-8 py-14">
            <div className="rounded-2xl border border-[#274C77]/10 bg-white p-10 text-center shadow-[0_8px_32px_rgba(39,76,119,0.08)] sm:p-12">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#A3CEF1]/45">
                  <CheckCircle className="h-12 w-12 text-[#274C77]" />
                </div>
              </div>

              <p className="mb-4 font-sans text-[12px] font-bold uppercase tracking-[0.22em] text-[#6096BA]">
                Report submitted
              </p>

              <h1 className="mb-4 font-display text-[42px] leading-[1.05] tracking-[-0.04em] text-[#274C77] sm:text-[56px]">
                Your report has been submitted
              </h1>

              <p className="mx-auto mb-8 max-w-2xl font-sans text-[17px] leading-[1.75] tracking-[-0.01em] text-[#274C77]/60">
                Thank you for speaking up. Our moderation team will review your
                report and determine the safest way to respond.
              </p>

              <div className="mx-auto mb-8 max-w-md rounded-2xl border border-[#274C77]/10 bg-[#F8FBFD] p-6">
                <p className="mb-2 font-sans text-sm text-[#274C77]/55">
                  Report Reference ID
                </p>
                <p className="font-display text-3xl tracking-[-0.03em] text-[#274C77]">
                  {referenceId}
                </p>
                <p className="mt-2 font-sans text-xs text-[#274C77]/45">
                  Save this ID to track your report
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/")}
                  className="rounded-sm bg-[#274C77] px-6 py-3 font-sans text-sm font-semibold text-white transition hover:bg-[#1F3C5F]"
                >
                  Return to Home
                </button>
                <button
                  onClick={() => navigate("/report")}
                  className="rounded-sm border border-[#274C77]/20 bg-white px-6 py-3 font-sans text-sm font-semibold text-[#274C77] transition hover:border-[#274C77]/40 hover:bg-[#F8FBFD]"
                >
                  Submit Another Report
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-8 py-10">
          <div className="rounded-2xl border border-[#274C77]/10 bg-white p-8 shadow-[0_8px_32px_rgba(39,76,119,0.08)]">
            <h2 className="mb-6 font-display text-3xl tracking-[-0.03em] text-[#274C77]">
              What happens next?
            </h2>

            <div className="space-y-5">
              {[
                {
                  title: "Our moderators will review the report",
                  text: "A trained team member will carefully assess the situation and context.",
                },
                {
                  title: "Urgent cases are prioritized",
                  text: "If you marked this as urgent, it will be reviewed as quickly as possible.",
                },
                {
                  title: "You may be contacted if you provided optional contact details",
                  text: "If you included your email, we may reach out for additional information or to provide support resources.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#A3CEF1]/45">
                    <div className="h-2 w-2 rounded-full bg-[#6096BA]" />
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-[#274C77]">
                      {item.title}
                    </p>
                    <p className="mt-1 font-sans text-sm leading-6 text-[#274C77]/60">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-6">
            <AlertCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-red-600" />
            <div>
              <p className="mb-2 font-sans font-semibold text-red-900">
                Need immediate help?
              </p>
              <p className="mb-3 font-sans text-sm leading-6 text-red-800">
                If you need immediate help or feel unsafe right now, please
                visit the Crisis Help page.
              </p>
              <button
                onClick={() => navigate("/crisis-help")}
                className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-red-700 transition hover:text-red-900"
              >
                Go to Crisis Help <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[#274C77]/10 bg-white p-8 shadow-[0_8px_32px_rgba(39,76,119,0.08)]">
            <h2 className="mb-6 font-display text-3xl tracking-[-0.03em] text-[#274C77]">
              Additional resources
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                {
                  title: "Knowledge Base",
                  text: "Learn more about bullying prevention, safety planning, and mental health support.",
                  label: "Visit Knowledge Base",
                  action: () => navigate("/knowledge-base"),
                },
                {
                  title: "Support Forum",
                  text: "Connect with peers who understand what you're going through.",
                  label: "Join the Forum",
                  action: () => navigate("/forum"),
                },
                {
                  title: "Chat Support",
                  text: "Talk to a trained counselor anonymously, available 24/7.",
                  label: "Start Chat",
                  action: () => {},
                },
                {
                  title: "Safety Guide",
                  text: "Create a personalized safety plan for yourself or someone you care about.",
                  label: "Learn More",
                  action: () => navigate("/knowledge-base"),
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#274C77]/10 bg-[#F8FBFD] p-6 transition hover:border-[#6096BA]/50 hover:bg-white"
                >
                  <h3 className="mb-2 font-display text-xl tracking-[-0.03em] text-[#274C77]">
                    {item.title}
                  </h3>
                  <p className="mb-4 font-sans text-sm leading-6 text-[#274C77]/60">
                    {item.text}
                  </p>
                  <button
                    onClick={item.action}
                    className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-[#6096BA] transition hover:text-[#274C77]"
                  >
                    {item.label} <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}