import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Lock, Shield, Eye, Database } from "lucide-react";

export function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-8 py-12">
          <div className="mb-10">
            <h1 className="text-5xl font-bold mb-3">Privacy Policy</h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              This Privacy Policy explains how SafeSpace collects, uses, stores,
              and protects information when users access the platform.
            </p>
          </div>

          <div className="space-y-6">
            <section className="border rounded-xl p-8">
              <div className="flex items-start gap-3 mb-4">
                <Shield className="w-5 h-5 text-gray-700 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">
                    1. Purpose of data collection
                  </h2>
                  <p className="text-[15px] text-gray-700 leading-8">
                    SafeSpace is designed to provide a secure environment for
                    anonymous reporting, peer support, and access to educational
                    mental health resources. Information is collected only to
                    support platform functionality, improve user safety, and
                    enable moderation and support processes.
                  </p>
                </div>
              </div>
            </section>

            <section className="border rounded-xl p-8">
              <div className="flex items-start gap-3 mb-4">
                <Database className="w-5 h-5 text-gray-700 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">
                    2. Information we may collect
                  </h2>
                  <div className="text-[15px] text-gray-700 leading-8 space-y-4">
                    <p>We may collect the following information:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>account information such as email and display name;</li>
                      <li>anonymous reports submitted through the platform;</li>
                      <li>forum posts, comments, and community activity;</li>
                      <li>notification and preference settings;</li>
                      <li>technical usage information necessary for platform operation.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="border rounded-xl p-8">
              <div className="flex items-start gap-3 mb-4">
                <Eye className="w-5 h-5 text-gray-700 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">
                    3. How information is used
                  </h2>
                  <div className="text-[15px] text-gray-700 leading-8 space-y-4">
                    <p>Information may be used to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>process anonymous reports and route them for review;</li>
                      <li>moderate harmful or unsafe content in the forum;</li>
                      <li>send notifications about reports, replies, or achievements;</li>
                      <li>improve user experience and platform safety;</li>
                      <li>support system security, analytics, and service reliability.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="border rounded-xl p-8">
              <div className="flex items-start gap-3 mb-4">
                <Lock className="w-5 h-5 text-gray-700 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">
                    4. Privacy and anonymous reports
                  </h2>
                  <p className="text-[15px] text-gray-700 leading-8">
                    SafeSpace supports anonymous reporting. When a user chooses
                    to submit a report anonymously, the system is designed to
                    minimize exposure of personal identity. However, users should
                    avoid placing unnecessary personal identifiers in free-text
                    fields if they wish to remain fully anonymous.
                  </p>
                </div>
              </div>
            </section>

            <section className="border rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-3">
                5. Data storage and security
              </h2>
              <p className="text-[15px] text-gray-700 leading-8">
                We take reasonable technical and organizational steps to protect
                stored information from unauthorized access, misuse, or loss.
                Access to sensitive data should be limited to authorized system
                roles such as moderators or administrators where necessary for
                platform safety and operation.
              </p>
            </section>

            <section className="border rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-3">
                6. Sharing of information
              </h2>
              <p className="text-[15px] text-gray-700 leading-8">
                SafeSpace does not share user information publicly except where
                users intentionally publish content in community areas such as the
                support forum. Information may be disclosed only where required
                for moderation, legal compliance, or urgent safety-related action.
              </p>
            </section>

            <section className="border rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-3">
                7. User choices and control
              </h2>
              <p className="text-[15px] text-gray-700 leading-8">
                Users may manage parts of their account through profile and
                settings pages, including notification preferences and privacy
                controls. Users should also review the information they submit
                before posting or reporting.
              </p>
            </section>

            <section className="border rounded-xl p-8 bg-gray-50">
              <h2 className="text-2xl font-semibold mb-3">
                8. Policy updates
              </h2>
              <p className="text-[15px] text-gray-700 leading-8">
                This Privacy Policy may be updated over time to reflect changes
                in platform functionality, legal requirements, or security
                practices. Continued use of the platform means acceptance of the
                latest version of this policy.
              </p>

              <p className="text-sm text-gray-500 mt-6">
                Last updated: March 2026
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}