import { Footer } from "../components/footer";
import { Header } from "../components/header";
import {
  AlertTriangle,
  ArrowRight,
  Heart,
  Phone,
  Shield,
  ShieldAlert,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const hotlines = [
  {
    name: "National Crisis Helpline",
    number: "8-800-2000-122",
    description: "Free 24/7 psychological support for children and adolescents",
    available: "24/7 · Free",
  },
  {
    name: "Emergency Services",
    number: "112",
    description: "For immediate physical danger or emergencies requiring urgent response",
    available: "24/7 · Emergency",
  },
  {
    name: "Psychological Support Line",
    number: "8-800-2000-12",
    description: "Confidential support for emotional distress, anxiety, and crisis situations",
    available: "24/7 · Confidential",
  },
];

const steps = [
  {
    icon: Shield,
    title: "Get to a safe place",
    description:
      "If you feel physically unsafe, move to a public area or a place with trusted people present. Your physical safety comes first.",
  },
  {
    icon: Phone,
    title: "Contact someone you trust",
    description:
      "Reach out to a parent, teacher, counselor, or another adult who can help you. You do not need to handle this alone.",
  },
  {
    icon: ShieldAlert,
    title: "Report anonymously if needed",
    description:
      "If you are not ready to speak to someone directly, use the anonymous report form. Your identity will remain protected.",
  },
  {
    icon: Heart,
    title: "Take care of yourself",
    description:
      "After a crisis, focus on rest, safety, and speaking with a professional. Recovery is a process — it takes time and support.",
  },
];

const warningSignsList = [
  "Feeling completely hopeless or like nothing will get better",
  "Withdrawing from everyone and everything",
  "Thinking about harming yourself or someone else",
  "Feeling trapped with no way out",
  "Severe panic, inability to breathe or think clearly",
  "Experiencing something dangerous or threatening right now",
];

export function CrisisHelpPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-12">

          {/* Page header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h1 className="text-4xl font-bold">Crisis Help</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl">
              If you or someone you know is in immediate danger or experiencing a
              mental health crisis, help is available right now.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <section className="col-span-8 space-y-10">

              {/* Emergency banner */}
              <div className="border border-red-200 bg-red-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-red-800 mb-1">
                      If someone is in immediate danger
                    </h2>
                    <p className="text-sm text-red-700 leading-6">
                      Call emergency services immediately at <strong>112</strong>.
                      Do not wait. Your call could save a life.
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning signs */}
              <div>
                <h2 className="text-2xl font-bold mb-5">Signs that you need help now</h2>
                <div className="border rounded-xl divide-y">
                  {warningSignsList.map((sign, index) => (
                    <div key={index} className="flex items-start gap-4 px-6 py-4">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                      <p className="text-sm text-gray-700 leading-6">{sign}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-3 px-1">
                  If any of these describe what you are experiencing right now, please
                  reach out immediately using the resources below.
                </p>
              </div>

              {/* What to do steps */}
              <div>
                <h2 className="text-2xl font-bold mb-5">What to do in a crisis</h2>
                <div className="grid grid-cols-2 gap-4">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="border rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-gray-700" />
                          </div>
                          <span className="text-xs text-gray-400 font-medium">
                            Step {index + 1}
                          </span>
                        </div>
                        <h3 className="font-semibold mb-2">{step.title}</h3>
                        <p className="text-sm text-gray-600 leading-6">
                          {step.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hotlines */}
              <div>
                <h2 className="text-2xl font-bold mb-5">Crisis hotlines</h2>
                <div className="space-y-4">
                  {hotlines.map((hotline, index) => (
                    <div key={index} className="border rounded-xl p-6 flex items-start gap-5">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold">{hotline.name}</h3>
                            <p className="text-sm text-gray-500 mt-0.5">{hotline.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-lg font-bold">{hotline.number}</p>
                            <p className="text-xs text-emerald-600 mt-0.5">{hotline.available}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </section>

            {/* Sidebar */}
            <aside className="col-span-4 space-y-6">

              <div className="border rounded-xl p-6 bg-black text-white">
                <ShieldAlert className="w-6 h-6 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Anonymous Report</h3>
                <p className="text-sm text-gray-300 leading-6 mb-4">
                  Not ready to speak to someone? Submit an anonymous report and
                  get support without revealing your identity.
                </p>
                <button
                  onClick={() => navigate("/report")}
                  className="w-full bg-white text-black py-3 rounded-md hover:bg-gray-100 text-sm font-medium flex items-center justify-center gap-2"
                >
                  Submit Report
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="border rounded-xl p-6">
                <Users className="w-5 h-5 text-gray-700 mb-3" />
                <h3 className="font-semibold mb-2">Support Forum</h3>
                <p className="text-sm text-gray-600 leading-6 mb-4">
                  Connect with others who understand. Share your experience or
                  read stories from the community.
                </p>
                <button
                  onClick={() => navigate("/forum")}
                  className="w-full border py-3 rounded-md hover:bg-gray-50 text-sm font-medium"
                >
                  Open Forum
                </button>
              </div>

              <div className="border rounded-xl p-6">
                <Heart className="w-5 h-5 text-gray-700 mb-3" />
                <h3 className="font-semibold mb-2">You are not alone</h3>
                <p className="text-sm text-gray-600 leading-6">
                  Many people go through difficult moments and find their way
                  through with the right support. Asking for help is one of the
                  strongest things you can do.
                </p>
              </div>

              <div className="border rounded-xl p-6 bg-gray-50">
                <h4 className="font-semibold text-sm mb-3">Quick access</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate("/knowledge-base")}
                    className="w-full text-left text-sm px-3 py-2 rounded hover:bg-white transition-colors text-gray-700"
                  >
                    → Knowledge Base
                  </button>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full text-left text-sm px-3 py-2 rounded hover:bg-white transition-colors text-gray-700"
                  >
                    → My Dashboard
                  </button>
                  <button
                    onClick={() => navigate("/forum")}
                    className="w-full text-left text-sm px-3 py-2 rounded hover:bg-white transition-colors text-gray-700"
                  >
                    → Support Forum
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