import { Footer } from "../components/footer";
import { Header } from "../components/header";
import {
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";
import { useState } from "react";

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="mb-12 max-w-4xl">
            <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600 leading-8">
              If you have questions, feedback, or need platform-related support,
              you can contact the SafeSpace team through the form below.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <section className="col-span-7">
              <div className="border rounded-xl p-8">
                <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="What is your message about?"
                      className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={7}
                      placeholder="Write your message here..."
                      className="w-full border rounded-lg px-4 py-3 text-sm outline-none resize-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-800 inline-flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              </div>
            </section>

            <aside className="col-span-5 space-y-6">
              <div className="border rounded-xl p-8">
                <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600 mt-1">
                        support@safespace.app
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-sm text-gray-600 mt-1">
                        +7 (700) 000-00-00
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Astana, Kazakhstan
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-xl p-8 bg-gray-50">
                <div className="flex items-start gap-3 mb-4">
                  <MessageSquare className="w-5 h-5 text-emerald-700 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold">Need urgent help?</h3>
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-6">
                  If your issue is related to immediate safety, emotional
                  distress, or bullying, please use the anonymous report system
                  or visit the Crisis Help page instead of waiting for email support.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}