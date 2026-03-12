import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { HeartHandshake, Shield, Users, Lightbulb } from "lucide-react";

const values = [
  {
    title: "Safety",
    description:
      "We design every part of the platform to help users feel protected when reporting, reading, or participating in discussions.",
    icon: <Shield className="w-6 h-6 text-emerald-600" />,
  },
  {
    title: "Empathy",
    description:
      "SafeSpace is built around respectful communication, emotional support, and understanding for people facing difficult situations.",
    icon: <HeartHandshake className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Community",
    description:
      "We believe that peer support, trusted guidance, and shared experiences can help users feel less isolated.",
    icon: <Users className="w-6 h-6 text-amber-600" />,
  },
  {
    title: "Awareness",
    description:
      "The platform also promotes prevention through educational resources, practical guidance, and early recognition of harmful situations.",
    icon: <Lightbulb className="w-6 h-6 text-purple-600" />,
  },
];

export function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="mb-12 max-w-4xl">
            <h1 className="text-5xl font-bold mb-4">About SafeSpace</h1>
            <p className="text-lg text-gray-600 leading-8">
              SafeSpace is a digital platform created to support anonymous
              reporting, peer communication, and early prevention of bullying,
              harassment, and emotional distress in educational communities.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-8 mb-10">
            <section className="col-span-7 space-y-6">
              <section className="border rounded-xl p-8">
                <h2 className="text-2xl font-semibold mb-4">Our mission</h2>
                <p className="text-[15px] text-gray-700 leading-8">
                  Our mission is to create a safe digital environment where
                  students feel heard, supported, and protected. We want to make
                  it easier for users to speak up about bullying, seek help in
                  stressful situations, and access trustworthy guidance without
                  fear of judgment.
                </p>
              </section>

              <section className="border rounded-xl p-8">
                <h2 className="text-2xl font-semibold mb-4">Why this platform matters</h2>
                <p className="text-[15px] text-gray-700 leading-8">
                  Many people experience bullying, anxiety, or emotional pressure
                  but hesitate to talk about it openly. Some do not know where to
                  go for help, while others fear being ignored or misunderstood.
                  SafeSpace addresses this gap by combining anonymous reporting,
                  support-oriented community features, and accessible mental
                  health resources in one place.
                </p>
              </section>

              <section className="border rounded-xl p-8 bg-gray-50">
                <h2 className="text-2xl font-semibold mb-4">Who SafeSpace is for</h2>
                <p className="text-[15px] text-gray-700 leading-8">
                  SafeSpace is designed primarily for students, but it also
                  supports mentors, moderators, specialists, and educational
                  staff who want to build a safer and more supportive environment.
                  The platform can help both those who need immediate support and
                  those who want to help others responsibly.
                </p>
              </section>
            </section>

            <aside className="col-span-5">
              <div className="border rounded-xl p-8 h-full">
                <h2 className="text-2xl font-semibold mb-6">What SafeSpace offers</h2>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Anonymous reporting</h3>
                    <p className="text-sm text-gray-600 leading-6">
                      Users can safely submit reports about bullying, harassment,
                      or emotional harm.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Support forum</h3>
                    <p className="text-sm text-gray-600 leading-6">
                      A moderated community space where users can share
                      experiences and support one another.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Knowledge base</h3>
                    <p className="text-sm text-gray-600 leading-6">
                      Articles and guidance about bullying, stress, self-help,
                      and supporting others.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Safety-first design</h3>
                    <p className="text-sm text-gray-600 leading-6">
                      Clear crisis support pathways, privacy controls, and
                      community rules.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <section>
            <h2 className="text-3xl font-semibold mb-6">Our values</h2>

            <div className="grid grid-cols-2 gap-6">
              {values.map((value) => (
                <div key={value.title} className="border rounded-xl p-6">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    {value.icon}
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600 leading-6">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}