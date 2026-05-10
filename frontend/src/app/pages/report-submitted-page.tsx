import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, AlertCircle, ExternalLink } from "lucide-react";

export function ReportSubmittedPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Use real report ID from navigation state; fallback for direct URL access
  const reportId: number | undefined = location.state?.reportId;
  const referenceId = reportId
    ? `RS-${reportId}`
    : `RS-${Math.floor(10000 + Math.random() * 90000)}`;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {/* Main Confirmation Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center mb-8">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-emerald-600" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl font-bold mb-4">Your report has been submitted</h1>

            {/* Supporting Text */}
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Thank you for speaking up. Our moderation team will review your report and
              determine the best way to respond.
            </p>

            {/* Reference Number */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 max-w-md mx-auto">
              <p className="text-sm text-gray-600 mb-2">Report Reference ID</p>
              <p className="text-2xl font-bold text-gray-900">{referenceId}</p>
              <p className="text-xs text-gray-500 mt-2">Save this ID to track your report</p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Return to Home
              </button>
              <button
                onClick={() => navigate("/report")}
                className="bg-white text-black px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Submit Another Report
              </button>
            </div>
          </div>

          {/* What Happens Next Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">What happens next?</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Our moderators will review the report</p>
                  <p className="text-sm text-gray-600 mt-1">
                    A trained team member will carefully assess the situation and context.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Urgent cases are prioritized</p>
                  <p className="text-sm text-gray-600 mt-1">
                    If you marked this as urgent, it will be reviewed within 24 hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-gray-900 font-medium">
                    You may be contacted if you provided optional contact details
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    If you included your email, we may reach out for additional information or
                    to provide support resources.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Reminder Section */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-900 font-medium mb-2">Need immediate help?</p>
              <p className="text-sm text-red-800 mb-3">
                If you need immediate help or feel unsafe right now, please visit the Crisis
                Help page.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-800"
              >
                Go to Crisis Help <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Support Resources Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Knowledge Base</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Learn more about bullying prevention, safety planning, and mental health
                  support.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Visit Knowledge Base <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Support Forum</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Connect with peers who understand what you're going through.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Join the Forum <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Chat Support</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Talk to a trained counselor anonymously, available 24/7.
                </p>
                <button className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700">
                  Start Chat <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Safety Guide</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Create a personalized safety plan for yourself or someone you care about.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                  Learn More <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
