import { Footer } from "../components/footer";
import { Header } from "../components/header";
import {
  AlertTriangle,
  HeartHandshake,
  MessageSquareHeart,
  Shield,
  UserCheck,
} from "lucide-react";

const allowedBehaviors = [
  "Speak respectfully and supportively to others.",
  "Share experiences honestly without attacking other people.",
  "Encourage users to seek help from trusted adults, mentors, or professionals when needed.",
  "Report harmful or unsafe content through the platform tools.",
];

const prohibitedBehaviors = [
  "Bullying, harassment, threats, or intimidation.",
  "Hate speech, discrimination, or personal attacks.",
  "Sharing private personal information about yourself or others.",
  "Posting harmful, misleading, or intentionally triggering content.",
];

const moderationPrinciples = [
  "Posts and comments may be reviewed if they are reported by users or detected as unsafe.",
  "Content that violates platform rules may be hidden or removed.",
  "Repeated violations may lead to account restrictions or bans.",
  "Urgent safety-related situations may be escalated for faster review.",
];

export function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="mb-10">
            <h1 className="text-5xl font-bold mb-3">Community Guidelines</h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              SafeSpace is built to be a respectful, supportive, and protected
              environment. These guidelines explain how community members should
              interact and what content is not allowed.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <aside className="col-span-4 space-y-6">
              <div className="border rounded-xl p-6 bg-emerald-50">
                <div className="flex items-start gap-3 mb-3">
                  <HeartHandshake className="w-5 h-5 text-emerald-700 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Our goal</h3>
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-6">
                  We want every user to feel heard, respected, and safe while
                  using the platform for support, reporting, and learning.
                </p>
              </div>

              <div className="border rounded-xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Shield className="w-5 h-5 text-gray-700 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Safety first</h3>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-6">
                  If a situation appears urgent, threatening, or harmful, users
                  should move to safety and use crisis support or the anonymous
                  report system immediately.
                </p>
              </div>
            </aside>

            <section className="col-span-8 space-y-6">
              <section className="border rounded-xl p-8">
                <div className="flex items-start gap-3 mb-4">
                  <MessageSquareHeart className="w-5 h-5 text-emerald-700 mt-1" />
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">
                      1. Respectful communication
                    </h2>
                    <p className="text-[15px] text-gray-700 leading-8">
                      Community members should communicate with empathy and care.
                      The platform exists to support people facing bullying,
                      stress, or emotional difficulty, so language should always
                      remain respectful and constructive.
                    </p>
                  </div>
                </div>
              </section>

              <section className="border rounded-xl p-8">
                <div className="flex items-start gap-3 mb-4">
                  <UserCheck className="w-5 h-5 text-blue-700 mt-1" />
                  <div className="w-full">
                    <h2 className="text-2xl font-semibold mb-4">
                      2. What is encouraged
                    </h2>

                    <div className="space-y-3">
                      {allowedBehaviors.map((item, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 flex items-start gap-4"
                        >
                          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-semibold shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-sm text-gray-700 leading-6">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="border rounded-xl p-8">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-1" />
                  <div className="w-full">
                    <h2 className="text-2xl font-semibold mb-4">
                      3. What is not allowed
                    </h2>

                    <div className="space-y-3">
                      {prohibitedBehaviors.map((item, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 flex items-start gap-4"
                        >
                          <div className="w-8 h-8 rounded-full bg-red-50 text-red-700 flex items-center justify-center text-sm font-semibold shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-sm text-gray-700 leading-6">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="border rounded-xl p-8">
                <h2 className="text-2xl font-semibold mb-4">
                  4. Moderation and enforcement
                </h2>

                <div className="space-y-3">
                  {moderationPrinciples.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 flex items-start gap-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center text-sm font-semibold shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-700 leading-6">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="border rounded-xl p-8 bg-gray-50">
                <h2 className="text-2xl font-semibold mb-3">
                  5. Privacy reminder
                </h2>
                <p className="text-[15px] text-gray-700 leading-8">
                  Even in a supportive environment, users should avoid posting
                  phone numbers, addresses, passwords, personal identifiers, or
                  any private information that could put them or others at risk.
                  If you want to stay anonymous, be careful not to reveal your
                  identity in posts, comments, or report descriptions.
                </p>
              </section>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}