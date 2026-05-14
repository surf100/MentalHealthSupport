import { Link } from "react-router-dom";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

const features = [
  {
    number: "01",
    title: "Anonymous reporting",
    text: "Students can safely report bullying, harassment, emotional pressure, or unsafe situations without exposing their identity.",
    to: "/report",
    stat: "100% private",
    statLabel: "No identity stored",
  },
  {
    number: "02",
    title: "Support community",
    text: "A moderated student forum for peer support, shared experiences, and safe conversations around mental health.",
    to: "/forum",
    stat: "Moderated",
    statLabel: "Human + AI review",
  },
  {
    number: "03",
    title: "Mental health resources",
    text: "Clear guidance, educational materials, and crisis support resources collected in one student-first space.",
    to: "/knowledge-base",
    stat: "24/7",
    statLabel: "Always available",
  },
];

const journeySteps = [
  {
    step: "01",
    title: "Anonymous report intake",
    text: "Students submit reports without any identifying data. No login required.",
  },
  {
    step: "02",
    title: "AI-supported risk awareness",
    text: "Machine learning flags high-priority cases for faster moderator response.",
  },
  {
    step: "03",
    title: "Moderated community forum",
    text: "Peer conversations are reviewed to ensure safety and constructive support.",
  },
  {
    step: "04",
    title: "Admin safety tools",
    text: "Campus administrators get dashboards, trend data, and actionable insights.",
  },
];

const stats = [
  { value: "100%", label: "Anonymous by design" },
  { value: "24/7", label: "Always accessible" },
  { value: "AI", label: "Risk-aware routing" },
  { value: "∞", label: "Forum conversations" },
];

export function HomePage() {
  return (
    <div className="min-h-screen bg-[#F9F7F3] font-sans text-[#274C77]">
      <Header />

      <main>
        <section className="relative overflow-hidden border-b border-[#274C77]/15 bg-[#F9F7F3]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#274C77_1px,transparent_1px)] [background-size:30px_30px]" />

          <div className="relative mx-auto grid max-w-[1440px] gap-16 px-6 py-24 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-14 lg:py-32">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#274C77]/15 bg-[#A3CEF1]/70 px-4 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#274C77]" />
                <span className="font-sans text-[13px] font-semibold uppercase tracking-[0.18em] text-[#274C77]/70">
                  Student safety platform
                </span>
              </div>

              <h1 className="font-display text-[52px] font-bold leading-[1.0] tracking-[-0.04em] text-[#274C77] sm:text-[72px] lg:text-[96px]">
                A safer way for students to speak up.
              </h1>

              <p className="mt-7 max-w-xl font-sans text-[17px] font-normal leading-[1.75] tracking-[-0.01em] text-[#274C77]/70 sm:text-[19px]">
                SafeSpace helps students report incidents anonymously, access
                mental health resources, and connect with a moderated support
                community — all inside one calm, secure digital ecosystem.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/report"
                  className="rounded-sm bg-[#274C77] px-7 py-4 text-center font-sans text-[15px] font-semibold text-[#F9F7F3] transition hover:bg-[#6096BA]"
                >
                  Report anonymously
                </Link>
                <Link
                  to="/forum"
                  className="rounded-sm border border-[#274C77]/25 bg-transparent px-7 py-4 text-center font-sans text-[15px] font-semibold text-[#274C77] transition hover:border-[#274C77]/45 hover:bg-[#A3CEF1]/45"
                >
                  Explore support forum
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 -top-6 z-10 rounded-md border border-[#274C77]/10 bg-[#A3CEF1] shadow-xl lg:-left-10">
                <div className="px-5 py-4">
                  <p className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#274C77]">
                    Reports this week
                  </p>
                  <p className="mt-1 font-display text-3xl font-bold text-[#274C77]">
                    148
                  </p>
                  <p className="mt-0.5 font-sans text-[12px] text-[#274C77]/55">
                    ↑ 12% from last week
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-[#274C77]/20 bg-[#274C77] p-3 shadow-[16px_16px_0_#6096BA]">
                <div className="overflow-hidden rounded bg-[#F9F7F3]">
                  <div className="flex items-center justify-between border-b border-[#274C77]/10 bg-[#6096BA]/55 px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#274C77]/20" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#274C77]/20" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#274C77]/20" />
                    </div>
                    <span className="font-sans text-[11px] font-semibold text-[#274C77]/55">
                      SafeSpace Dashboard
                    </span>
                    <span className="rounded-full bg-[#274C77] px-2 py-0.5 font-sans text-[10px] font-bold text-[#F9F7F3]">
                      Live
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { v: "24/7", l: "Access" },
                        { v: "AI", l: "Risk review" },
                        { v: "100%", l: "Anonymous" },
                      ].map((s) => (
                        <div
                          key={s.l}
                          className="rounded bg-[#A3CEF1]/65 px-3 py-4 text-center"
                        >
                          <p className="font-display text-2xl font-bold text-[#274C77]">
                            {s.v}
                          </p>
                          <p className="mt-1 font-sans text-[11px] text-[#274C77]/60">
                            {s.l}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 rounded border border-[#274C77]/10 bg-[#A3CEF1]/50 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#274C77]">
                            New anonymous report
                          </p>
                          <p className="mt-1.5 font-display text-lg font-bold leading-tight text-[#274C77]">
                            Risk-aware support request
                          </p>
                        </div>
                        <span className="rounded bg-[#6096BA] px-2 py-1 font-sans text-[10px] font-bold text-[#274C77]">
                          In review
                        </span>
                      </div>
                      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#F9F7F3]/70">
                        <div className="h-1.5 w-2/3 rounded-full bg-[#274C77]" />
                      </div>
                      <p className="mt-1.5 font-sans text-[11px] text-[#274C77]/55">
                        Routed to counseling team
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between rounded bg-[#6096BA]/60 px-4 py-3">
                      <span className="font-sans text-[13px] font-semibold text-[#274C77]">
                        Community moderation
                      </span>
                      <span className="font-sans text-[13px] text-[#274C77]/60">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 rounded-md border border-[#274C77]/15 bg-[#A3CEF1] px-5 py-4 shadow-lg lg:-right-8">
                <p className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#274C77]/70">
                  Forum activity
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-[#274C77]">
                  Active
                </p>
                <p className="mt-0.5 font-sans text-[12px] text-[#274C77]/55">
                  34 threads this week
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#274C77]/10 bg-[#A3CEF1]/45">
          <div className="mx-auto max-w-[1440px] px-6 py-10 sm:px-10 lg:px-14">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-display text-[40px] font-bold leading-none text-[#274C77] sm:text-[52px]">
                    {s.value}
                  </p>
                  <p className="mt-2 font-sans text-[14px] text-[#274C77]/60">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#274C77]/10 bg-[#F9F7F3]">
          <div className="mx-auto max-w-[1440px] px-6 py-24 sm:px-10 lg:px-14 lg:py-32">
            <div className="grid gap-16 lg:grid-cols-[0.75fr_1.25fr]">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className="font-sans text-[12px] font-bold uppercase tracking-[0.22em] text-[#274C77]">
                  What SafeSpace does
                </p>
                <h2 className="mt-4 font-display text-[44px] font-bold leading-[1.05] tracking-[-0.04em] text-[#274C77] sm:text-[60px]">
                  From silent problems to visible support.
                </h2>
                <p className="mt-5 font-sans text-[16px] leading-[1.75] tracking-[-0.01em] text-[#274C77]/65">
                  Three interconnected tools built around what students actually
                  need when things get difficult.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {features.map((feature) => (
                  <Link
                    key={feature.title}
                    to={feature.to}
                    className="group flex min-h-[340px] flex-col justify-between rounded-lg border border-[#274C77]/12 bg-[#A3CEF1] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#274C77]/25 hover:bg-[#274C77] hover:text-[#F9F7F3]"
                  >
                    <div>
                      <p className="font-sans text-[12px] font-bold text-[#274C77]/45 group-hover:text-[#F9F7F3]/55">
                        {feature.number}
                      </p>
                      <div className="mt-8 inline-block rounded bg-[#F9F7F3]/60 px-3 py-2 group-hover:bg-[#F9F7F3]/15">
                        <p className="font-display text-xl font-bold text-[#274C77] group-hover:text-[#F9F7F3]">
                          {feature.stat}
                        </p>
                        <p className="font-sans text-[11px] text-[#274C77]/60 group-hover:text-[#F9F7F3]/70">
                          {feature.statLabel}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-display text-[22px] font-bold leading-tight tracking-[-0.03em] text-[#274C77] group-hover:text-[#F9F7F3]">
                        {feature.title}
                      </h3>
                      <p className="mt-3 font-sans text-[14px] leading-[1.7] tracking-[-0.01em] text-[#274C77]/65 group-hover:text-[#F9F7F3]/75">
                        {feature.text}
                      </p>
                      <p className="mt-6 font-sans text-[13px] font-semibold text-[#274C77] group-hover:text-[#F9F7F3]">
                        Open →
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#F9F7F3]/10 bg-[#274C77] text-[#F9F7F3]">
          <div className="mx-auto max-w-[1440px] px-6 py-24 sm:px-10 lg:px-14 lg:py-32">
            <div className="max-w-3xl">
              <p className="font-sans text-[12px] font-bold uppercase tracking-[0.22em] text-[#A3CEF1]">
                Support ecosystem
              </p>
              <h2 className="mt-4 font-display text-[44px] font-bold leading-[1.05] tracking-[-0.04em] sm:text-[60px]">
                One platform. Students, moderators, and admins.
              </h2>
              <p className="mt-5 font-sans text-[16px] leading-[1.75] tracking-[-0.01em] text-[#F9F7F3]/65">
                Every report travels through a transparent, safety-first
                journey — from anonymous submission to resolution.
              </p>
            </div>

            <div className="mt-16 grid gap-px border border-[#F9F7F3]/10 bg-[#F9F7F3]/10 md:grid-cols-2 lg:grid-cols-4">
              {journeySteps.map((step) => (
                <div
                  key={step.step}
                  className="group bg-[#274C77] p-8 transition duration-300 hover:bg-[#6096BA]"
                >
                  <p className="font-sans text-[12px] font-bold uppercase tracking-[0.2em] text-[#A3CEF1]">
                    Step {step.step}
                  </p>
                  <h3 className="mt-4 font-display text-[22px] font-bold leading-tight tracking-[-0.03em]">
                    {step.title}
                  </h3>
                  <p className="mt-3 font-sans text-[14px] leading-[1.7] tracking-[-0.01em] text-[#F9F7F3]/62">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#6096BA]">
          <div className="mx-auto max-w-[1440px] px-6 py-24 sm:px-10 lg:px-14 lg:py-32">
            <div className="rounded-lg border border-[#274C77]/15 bg-[#F9F7F3] p-10 sm:p-14 lg:p-20">
              <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="font-sans text-[12px] font-bold uppercase tracking-[0.22em] text-[#274C77]">
                    Start safely
                  </p>
                  <h2 className="mt-4 max-w-3xl font-display text-[44px] font-bold leading-[1.05] tracking-[-0.04em] text-[#274C77] sm:text-[60px] lg:text-[72px]">
                    Need help, support, or a place to speak?
                  </h2>
                  <p className="mt-5 max-w-2xl font-sans text-[17px] leading-[1.75] tracking-[-0.01em] text-[#274C77]/65">
                    SafeSpace makes asking for help easier, safer, and more
                    accessible for every student — no judgment, no exposure.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    to="/report"
                    className="rounded-sm bg-[#274C77] px-8 py-4 text-center font-sans text-[15px] font-semibold text-[#F9F7F3] transition hover:bg-[#6096BA]"
                  >
                    Submit a report
                  </Link>
                  <Link
                    to="/crisis-help"
                    className="rounded-sm border border-[#274C77]/25 bg-transparent px-8 py-4 text-center font-sans text-[15px] font-semibold text-[#274C77] transition hover:border-[#274C77]/50 hover:bg-[#A3CEF1]/45"
                  >
                    Crisis help
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}