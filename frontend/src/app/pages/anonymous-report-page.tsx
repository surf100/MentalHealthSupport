import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AlertCircle, Upload, X, FileText, ImageIcon } from "lucide-react";
import { createReport, ReportCategory } from "../api/report-api";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY as string;

const CATEGORY_MAP: Record<string, ReportCategory> = {
  bullying: "HARASSMENT",
  cyberbullying: "HARASSMENT",
  harassment: "HARASSMENT",
  "emotional-stress": "MENTAL_HEALTH",
  other: "OTHER",
};

type UploadedFile = {
  file: File;
  preview: string | null; // object URL for images, null for docs
  uploading: boolean;
  url: string | null;
  error: string | null;
};

async function uploadToImgbb(file: File): Promise<string> {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

  const form = new FormData();
  form.append("image", base64);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  return data.data.url as string;
}

function FileIcon({ file }: { file: File }) {
  if (file.type.startsWith("image/"))
    return <ImageIcon className="w-5 h-5 text-blue-500" />;
  return <FileText className="w-5 h-5 text-gray-500" />;
}

export function AnonymousReportPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // ── File handling ──────────────────────────────────────────────────────────

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const newEntries: UploadedFile[] = files.map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      uploading: true,
      url: null,
      error: null,
    }));

    setUploadedFiles((prev) => [...prev, ...newEntries]);

    // Upload each file
    newEntries.forEach((entry, i) => {
      const idx = uploadedFiles.length + i;

      if (!file.type.startsWith("image/") && !entry.file.type.startsWith("image/")) {
        // Non-image: store as data URL via FileReader for description append
        const reader = new FileReader();
        reader.onload = () => {
          setUploadedFiles((prev) =>
            prev.map((f, fi) =>
              fi === idx ? { ...f, uploading: false, url: reader.result as string } : f
            )
          );
        };
        reader.onerror = () => {
          setUploadedFiles((prev) =>
            prev.map((f, fi) =>
              fi === idx ? { ...f, uploading: false, error: "Failed to read file" } : f
            )
          );
        };
        reader.readAsDataURL(entry.file);
        return;
      }

      uploadToImgbb(entry.file)
        .then((url) => {
          setUploadedFiles((prev) =>
            prev.map((f, fi) => (fi === idx ? { ...f, uploading: false, url } : f))
          );
        })
        .catch((err: Error) => {
          setUploadedFiles((prev) =>
            prev.map((f, fi) =>
              fi === idx ? { ...f, uploading: false, error: err.message } : f
            )
          );
        });
    });

    // Reset input so same file can be re-selected
    e.target.value = "";
  }

  function removeFile(index: number) {
    setUploadedFiles((prev) => {
      const entry = prev[index];
      if (entry.preview) URL.revokeObjectURL(entry.preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.description.trim()) newErrors.description = "Please describe the incident";
    if (!formData.date) newErrors.date = "Please select a date";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const stillUploading = uploadedFiles.some((f) => f.uploading);
    if (stillUploading) {
      setSubmitError("Please wait for all files to finish uploading.");
      return;
    }

    setErrors({});
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const categoryLabel = formData.category.replace("-", " ");
      const urgencyPrefix = formData.urgency ? "[URGENT] " : "";
      const locationSuffix = formData.location.trim()
        ? ` — ${formData.location.trim()}`
        : "";

      // Append uploaded file URLs to description
      const fileUrls = uploadedFiles
        .filter((f) => f.url && !f.error)
        .map((f, i) => `[Attachment ${i + 1}]: ${f.url}`)
        .join("\n");

      const fullDescription = fileUrls
        ? `${formData.description.trim()}\n\n--- Attachments ---\n${fileUrls}`
        : formData.description.trim();

      const report = await createReport({
        title: `${urgencyPrefix}${categoryLabel}${locationSuffix}`,
        description: fullDescription,
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
              <Link
                to="/crisis-help"
                className="font-medium underline hover:text-red-900"
              >
                Crisis Help
              </Link>{" "}
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
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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

                    {/* Drop zone */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const dt = e.dataTransfer;
                        if (dt.files.length > 0) {
                          const syntheticEvent = {
                            target: { files: dt.files, value: "" },
                          } as unknown as React.ChangeEvent<HTMLInputElement>;
                          handleFileSelect(syntheticEvent);
                        }
                      }}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors cursor-pointer"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileSelect}
                      />
                      <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, PDF, DOC up to 10MB each
                      </p>
                    </div>

                    {/* File list */}
                    {uploadedFiles.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {uploadedFiles.map((f, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50"
                          >
                            {/* Preview thumbnail or file icon */}
                            {f.preview ? (
                              <img
                                src={f.preview}
                                alt="preview"
                                className="w-10 h-10 rounded object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center shrink-0">
                                <FileIcon file={f.file} />
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {f.file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(f.file.size / 1024).toFixed(0)} KB
                              </p>
                            </div>

                            {/* Status */}
                            {f.uploading && (
                              <span className="text-xs text-blue-600 shrink-0">
                                Uploading…
                              </span>
                            )}
                            {!f.uploading && f.url && !f.error && (
                              <span className="text-xs text-emerald-600 shrink-0">
                                ✓ Ready
                              </span>
                            )}
                            {f.error && (
                              <span className="text-xs text-red-600 shrink-0">
                                {f.error}
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => removeFile(i)}
                              className="ml-1 p-1 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Urgency Checkbox */}
                  <div className="mb-8">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.urgency}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.checked })}
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
                      disabled={isSubmitting || uploadedFiles.some((f) => f.uploading)}
                      className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Report"}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/")}
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
                      href="tel:18002747461"
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
                    <button
                      disabled
                      className="w-full bg-gray-100 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                      title="Coming soon"
                    >
                      Coming soon
                    </button>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Resources</h4>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          to="/crisis-help"
                          className="text-sm text-emerald-600 hover:text-emerald-700"
                        >
                          How to report bullying →
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/crisis-help"
                          className="text-sm text-emerald-600 hover:text-emerald-700"
                        >
                          Safety planning guide →
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/forum"
                          className="text-sm text-emerald-600 hover:text-emerald-700"
                        >
                          Support community →
                        </Link>
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