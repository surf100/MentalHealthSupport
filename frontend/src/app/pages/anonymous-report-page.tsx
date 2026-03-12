import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useState } from "react";
import { useNavigate } from "react-router";
import { AlertCircle } from "lucide-react";
import { createReport, ReportCategory } from "../api/report-api";

// Maps UI select values → backend ReportCategory enum
const CATEGORY_MAP: Record<string, ReportCategory> = {
  bullying: "HARASSMENT",
  cyberbullying: "HARASSMENT",
  harassment: "HARASSMENT",
  "emotional-stress": "MENTAL_HEALTH",
  other: "OTHER",
};

export function AnonymousReportPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    location: "",
    date: "",
    urgency: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const newErrors: Record<string, string> = {};
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.description.trim()) newErrors.description = "Please describe the incident";
    if (!formData.date) newErrors.date = "Please select a date";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      // Build title from category + optional urgency flag
      const categoryLabel = formData.category.replace("-", " ");
      const urgencyPrefix = formData.urgency ? "[URGENT] " : "";
      const locationSuffix = formData.location.trim()
        ? ` — ${formData.location.trim()}`
        : "";

      const report = await createReport({
        title: `${urgencyPrefix}${categoryLabel}${locationSuffix}`,
        description: formData.description.trim(),
        category: CATEGORY_MAP[formData.category] ?? "OTHER",
        isAnonymous: true,
      });

      navigate("/report-submitted", { state: { reportId: report.id } });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit report. Please try again.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Crisis Banner */}
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-800">
              If you are in immediate danger, please visit the{" "}
              <a href="#" className="font-medium underline hover:text-red-900">
                Crisis Help
              </a>{" "}
              page.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="col-span-2">
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-3">Submit an Anonymous Report</h1>
                <p className="text-lg text-gray-600">
                  If you are experiencing bullying, harassment, or emotional distress, you can
                  safely report it here. Your identity can remain anonymous.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-8">
                {/* API-level error banner */}
                {submitError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-800">{submitError}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Report Category */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2.5 text-gray-900">
                      Report Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                        errors.category ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select a category</option>
                      <option value="bullying">Bullying</option>
                      <option value="cyberbullying">Cyberbullying</option>
                      <option value="harassment">Harassment</option>
                      <option value="emotional-stress">Emotional stress</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.category && (
                      <p className="mt-2 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>

                  {/* Incident Description */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2.5 text-gray-900">
                      Incident Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Please describe what happened in as much detail as you're comfortable sharing..."
                      rows={6}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none ${
                        errors.description ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2.5 text-gray-900">
                      Location{" "}
                      <span className="text-gray-500 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="Where did this incident occur?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  {/* Date of Incident */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2.5 text-gray-900">
                      Date of Incident
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                        errors.date ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.date && (
                      <p className="mt-2 text-sm text-red-600">{errors.date}</p>
                    )}
                  </div>

                  {/* Upload Evidence */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2.5 text-gray-900">
                      Upload Evidence{" "}
                      <span className="text-gray-500 font-normal">(optional)</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        id="file-upload"
                        accept="image/*,.pdf,.doc,.docx"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                      </label>
                    </div>
                  </div>

                  {/* Urgency Checkbox */}
                  <div className="mb-8">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.urgency}
                        onChange={(e) =>
                          setFormData({ ...formData, urgency: e.target.checked })
                        }
                        className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        This situation feels urgent
                      </span>
                    </label>
                  </div>

                  {/* Anonymous Notice */}
                  <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-sm text-emerald-800">
                      This report can be submitted anonymously. Our moderators will review it
                      to provide support.
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Report"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      className="bg-white text-black px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Help Sidebar */}
            <div className="col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-8">
                <h3 className="text-lg font-semibold mb-4">Need Help?</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Crisis Support</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      If you need immediate help, contact our crisis line:
                    </p>
                    <a
                      href="#"
                      className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                    >
                      1-800-CRISIS-1
                    </a>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Chat Support</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Talk to a trained counselor anonymously.
                    </p>
                    <button className="w-full bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors">
                      Start Chat
                    </button>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Resources</h4>
                    <ul className="space-y-2">
                      <li>
                        <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700">
                          How to report bullying →
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700">
                          Safety planning guide →
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700">
                          Support community →
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Your Privacy</h4>
                    <p className="text-sm text-gray-600">
                      Reports are encrypted and can be submitted anonymously. We never share
                      your information without permission.
                    </p>
                  </div>
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
