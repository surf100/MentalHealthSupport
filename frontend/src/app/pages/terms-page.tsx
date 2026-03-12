import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { FileText, Shield, Users, AlertTriangle } from "lucide-react";

export function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-8 py-12">
          <div className="mb-10">
            <h1 className="text-5xl font-bold mb-3">Terms of Service</h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              These Terms of Service define the rules and guidelines for using
              the SafeSpace platform. By accessing or using the platform, users
              agree to comply with these terms.
            </p>
          </div>

          <div className="space-y-6">

            <section className="border rounded-xl p-8">
              <div className="flex items-start gap-3 mb-4">
                <FileText className="w-5 h-5 text-gray-700 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">
                    1. Use of the platform
                  </h2>
                  <p className="text-[15px] text-gray-700 leading-8">
                    SafeSpace provides a digital environment where users can
                    share concerns, submit reports, participate in community
                    discussions, and access educational resources related to
                    well-being and safety. Users agree to use the platform in a
                    respectful and responsible manner.
                  </p>
                </div>
              </div>
            </section>

            <section className="border rounded-xl p-8">
              <div className="flex items-start gap-3 mb-4">
                <Users className="w-5 h-5 text-gray-700 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">
                    2. Community behavior
                  </h2>
                  <div className="text-[15px] text-gray-700 leading-8 space-y-4">
                    <p>Users are expected to follow respectful communication rules.</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>do not harass, threaten, or attack other users;</li>
                      <li>do not post harmful or illegal content;</li>
                      <li>avoid spreading misinformation;</li>
                      <li>respect anonymity and privacy of other members.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="border rounded-xl p-8">
              <div className="flex items-start gap-3 mb-4">
                <Shield className="w-5 h-5 text-gray-700 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">
                    3. Moderation and safety
                  </h2>
                  <p className="text-[15px] text-gray-700 leading-8">
                    To maintain a safe environment, moderators may review,
                    remove, or restrict content that violates platform rules.
                    Moderators may also temporarily or permanently restrict
                    accounts that repeatedly violate community standards.
                  </p>
                </div>
              </div>
            </section>

            <section className="border rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-3">
                4. Anonymous reporting
              </h2>
              <p className="text-[15px] text-gray-700 leading-8">
                The platform supports anonymous reporting. Users should submit
                information responsibly and truthfully. False reports or misuse
                of the reporting system may undermine platform safety and may
                lead to restrictions on platform access.
              </p>
            </section>

            <section className="border rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-3">
                5. Intellectual property
              </h2>
              <p className="text-[15px] text-gray-700 leading-8">
                Content published on SafeSpace such as articles, guides, and
                educational materials may be protected by intellectual property
                rights. Users should not copy, redistribute, or reuse platform
                materials without proper permission.
              </p>
            </section>

            <section className="border rounded-xl p-8">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-gray-700 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">
                    6. Limitation of responsibility
                  </h2>
                  <p className="text-[15px] text-gray-700 leading-8">
                    SafeSpace provides informational and community support tools.
                    The platform does not replace professional legal, medical,
                    or psychological assistance. Users should seek qualified
                    professionals when dealing with serious or urgent situations.
                  </p>
                </div>
              </div>
            </section>

            <section className="border rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-3">
                7. Changes to the terms
              </h2>
              <p className="text-[15px] text-gray-700 leading-8">
                SafeSpace may update these Terms of Service as the platform
                evolves. Continued use of the platform indicates acceptance
                of the updated terms.
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