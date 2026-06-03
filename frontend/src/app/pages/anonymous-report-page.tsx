import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AlertCircle,
  Upload,
  X,
  FileText,
  ImageIcon,
  ShieldCheck,
  Lock,
  Phone,
  BookOpen,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { createReport, ReportCategory } from "../api/report-api";

// ── All business logic preserved exactly ──────────────────────────────────

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY as string;

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg"];

const CATEGORY_MAP: Record<string, ReportCategory> = {
  bullying: "HARASSMENT",
  cyberbullying: "HARASSMENT",
  harassment: "HARASSMENT",
  "emotional-stress": "MENTAL_HEALTH",
  other: "OTHER",
};

type UploadedFile = {
  file: File;
  preview: string | null;
  uploading: boolean;
  url: string | null;
  error: string | null;
};

async function uploadToImgbb(file: File): Promise<string> {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
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

async function readAsDataUrl(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function FileIcon({ file }: { file: File }) {
  if (file.type.startsWith("image/"))
    return <ImageIcon className="w-5 h-5" style={{ color: "#6096BA" }} />;
  return <FileText className="w-5 h-5" style={{ color: "rgba(36,76,90,0.50)" }} />;
}

// ── Shared input style helpers ─────────────────────────────────────────────

const inputBase: React.CSSProperties = {
  width: "100%",
  padding: "11px 16px",
  fontFamily: "DM Sans, sans-serif",
  fontSize: "14px",
  color: "#274C77",
  background: "#F6F8F9",
  border: "1px solid rgba(205,205,205,0.8)",
  borderRadius: "10px",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  boxSizing: "border-box" as const,
};

const inputError: React.CSSProperties = {
  ...inputBase,
  border: "1px solid rgba(192,57,43,0.45)",
  background: "rgba(192,57,43,0.03)",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "DM Sans, sans-serif",
  fontSize: "13px",
  fontWeight: 600,
  color: "#274C77",
  display: "block",
  marginBottom: "8px",
};

const errorStyle: React.CSSProperties = {
  fontFamily: "DM Sans, sans-serif",
  fontSize: "12px",
  color: "rgba(192,57,43,0.85)",
  marginTop: "6px",
};

const sectionDivider: React.CSSProperties = {
  borderTop: "1px solid rgba(205,205,205,0.55)",
  margin: "28px 0",
};

// ── Component ──────────────────────────────────────────────────────────────

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
  const [dropHover, setDropHover] = useState(false);

  // ── File handlers — logic untouched ──────────────────────────────────────

  function processFile(file: File, idx: number) {
    const isImage = IMAGE_TYPES.includes(file.type);
    if (isImage) {
      uploadToImgbb(file)
        .then((url) =>
          setUploadedFiles((prev) =>
            prev.map((f, fi) => (fi === idx ? { ...f, uploading: false, url } : f))
          )
        )
        .catch((err: Error) =>
          setUploadedFiles((prev) =>
            prev.map((f, fi) =>
              fi === idx ? { ...f, uploading: false, error: err.message } : f
            )
          )
        );
    } else {
      readAsDataUrl(file)
        .then((dataUrl) =>
          setUploadedFiles((prev) =>
            prev.map((f, fi) =>
              fi === idx ? { ...f, uploading: false, url: dataUrl } : f
            )
          )
        )
        .catch(() =>
          setUploadedFiles((prev) =>
            prev.map((f, fi) =>
              fi === idx ? { ...f, uploading: false, error: "Failed to read file" } : f
            )
          )
        );
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploadedFiles((prev) => {
      const startIdx = prev.length;
      const newEntries: UploadedFile[] = files.map((file) => ({
        file,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
        uploading: true,
        url: null,
        error: null,
      }));
      files.forEach((file, i) => setTimeout(() => processFile(file, startIdx + i), 0));
      return [...prev, ...newEntries];
    });
    e.target.value = "";
  }

  function removeFile(index: number) {
    setUploadedFiles((prev) => {
      const entry = prev[index];
      if (entry.preview) URL.revokeObjectURL(entry.preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  // ── Submit handler — logic untouched ─────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.description.trim()) newErrors.description = "Please describe the incident";
    if (!formData.date) newErrors.date = "Please select a date";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    if (uploadedFiles.some((f) => f.uploading)) {
      setSubmitError("Please wait for all files to finish uploading.");
      return;
    }

    setErrors({});
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const categoryLabel = formData.category ? formData.category.replace("-", " ") : "General report";
      const urgencyPrefix = formData.urgency ? "[URGENT] " : "";
      const locationSuffix = formData.location.trim() ? ` — ${formData.location.trim()}` : "";

      const attachments = uploadedFiles
        .filter((f) => f.url && !f.error)
        .map((f) => ({
          name: f.file.name,
          type: f.file.type,
          size: f.file.size,
          url: f.url!,
        }));

      const attachmentBlock =
        attachments.length > 0
          ? `\n\n<!--ATTACHMENTS:${JSON.stringify(attachments)}-->`
          : "";

      const report = await createReport({
        title: `${urgencyPrefix}${categoryLabel}${locationSuffix}`,
        description: formData.description.trim() + attachmentBlock,
        category: CATEGORY_MAP[formData.category] ?? "OTHER",
        isAnonymous: true,
      });

      navigate("/report-submitted", { state: { reportId: report.id } });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit report. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F9F7F3", fontFamily: "DM Sans, sans-serif", color: "#274C77" }}
    >
      <Header />

      {/* ── Hero strip ────────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: "#A3CEF1",
          borderBottom: "1px solid rgba(36,76,90,0.12)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.10,
            backgroundImage: "radial-gradient(#274C77 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "48px 56px 44px",
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(36,76,90,0.60)",
              marginBottom: "14px",
            }}
          >
            Your voice, protected
          </p>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
            <div>
              <h1
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "clamp(36px, 4.5vw, 58px)",
                  fontWeight: 400,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  color: "#274C77",
                  margin: 0,
                  marginBottom: "14px",
                }}
              >
                Submit an anonymous report.
              </h1>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "16px",
                  lineHeight: 1.75,
                  letterSpacing: "-0.01em",
                  color: "rgba(36,76,90,0.65)",
                  maxWidth: "540px",
                  margin: 0,
                }}
              >
                If you're experiencing bullying, harassment, or emotional distress — you can safely report it here. Your identity stays protected.
              </p>
            </div>

            {/* Trust pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(36,76,90,0.12)",
                borderRadius: "14px",
                padding: "14px 20px",
                backdropFilter: "blur(4px)",
                flexShrink: 0,
              }}
            >
              <ShieldCheck className="w-5 h-5" style={{ color: "#274C77" }} />
              <div>
                <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", fontWeight: 700, color: "#274C77", margin: 0 }}>
                  100% anonymous
                </p>
                <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: "rgba(36,76,90,0.55)", margin: 0 }}>
                  No identity stored
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main style={{ flex: 1, padding: "40px 0 64px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 56px" }}>

          {/* ── Immediate danger notice (calm, not alarming) ───────────────── */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              background: "rgba(136,187,214,0.15)",
              border: "1px solid rgba(136,187,214,0.35)",
              borderRadius: "12px",
              padding: "14px 18px",
              marginBottom: "28px",
            }}
          >
            <AlertCircle className="w-4 h-4 shrink-0" style={{ color: "#274C77", marginTop: "2px" }} />
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: "rgba(36,76,90,0.75)", margin: 0, lineHeight: 1.6 }}>
              If you're in immediate danger, please visit the{" "}
              <Link
                to="/crisis-help"
                style={{ color: "#274C77", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}
              >
                Crisis Help
              </Link>{" "}
              page for urgent support.
            </p>
          </div>

          {/* ── Two-column layout ─────────────────────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "28px", alignItems: "start" }}>

            {/* ── Main form card ──────────────────────────────────────────── */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(136,187,214,0.20)",
                borderRadius: "20px",
                padding: "40px",
                boxShadow: "0 4px 24px rgba(36,76,90,0.07)",
              }}
            >
              {/* Submit error */}
              {submitError && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    background: "rgba(192,57,43,0.06)",
                    border: "1px solid rgba(192,57,43,0.25)",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    marginBottom: "28px",
                  }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" style={{ color: "rgba(192,57,43,0.85)", marginTop: "2px" }} />
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: "rgba(192,57,43,0.85)", margin: 0 }}>
                    {submitError}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>

                {/* Section: Incident details */}
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(36,76,90,0.40)",
                    marginBottom: "20px",
                  }}
                >
                  Incident details
                </p>

                {/* Category */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={labelStyle}>
  Report category{" "}
  <span style={{ fontWeight: 400, color: "rgba(36,76,90,0.45)" }}>(optional)</span>
</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      ...(errors.category ? inputError : inputBase),
                      appearance: "none" as const,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23244C5A' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                      paddingRight: "36px",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">Select a category</option>
                    <option value="bullying">Bullying</option>
                    <option value="cyberbullying">Cyberbullying</option>
                    <option value="harassment">Harassment</option>
                    <option value="emotional-stress">Emotional stress</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.category && <p style={errorStyle}>{errors.category}</p>}
                </div>

                {/* Description */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={labelStyle}>
                    Incident description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what happened in as much detail as you're comfortable sharing. Everything is confidential."
                    rows={6}
                    style={{
                      ...(errors.description ? inputError : inputBase),
                      resize: "vertical",
                      lineHeight: 1.65,
                    }}
                  />
                  {errors.description && <p style={errorStyle}>{errors.description}</p>}
                </div>

                {/* Location + Date in a row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <div>
                    <label style={labelStyle}>
                      Location{" "}
                      <span style={{ fontWeight: 400, color: "rgba(36,76,90,0.45)" }}>(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Where did this happen?"
                      style={inputBase}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Date of incident</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      style={errors.date ? inputError : inputBase}
                    />
                    {errors.date && <p style={errorStyle}>{errors.date}</p>}
                  </div>
                </div>

                <div style={sectionDivider} />

                {/* Section: Evidence */}
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(36,76,90,0.40)",
                    marginBottom: "20px",
                  }}
                >
                  Evidence{" "}
                  <span style={{ fontWeight: 400, textTransform: "none" as const, letterSpacing: 0, fontSize: "12px", color: "rgba(36,76,90,0.40)" }}>
                    — optional
                  </span>
                </p>

                {/* Upload zone */}
                <div style={{ marginBottom: "20px" }}>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDropHover(true); }}
                    onDragLeave={() => setDropHover(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDropHover(false);
                      if (e.dataTransfer.files.length > 0) {
                        handleFileSelect({
                          target: { files: e.dataTransfer.files, value: "" },
                        } as unknown as React.ChangeEvent<HTMLInputElement>);
                      }
                    }}
                    style={{
                      border: `2px dashed ${dropHover ? "#6096BA" : "rgba(205,205,205,0.8)"}`,
                      borderRadius: "12px",
                      padding: "32px 24px",
                      textAlign: "center",
                      cursor: "pointer",
                      background: dropHover ? "rgba(136,187,214,0.06)" : "rgba(246,248,249,0.6)",
                      transition: "border-color 0.15s, background 0.15s",
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      style={{ display: "none" }}
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleFileSelect}
                    />
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        background: "rgba(153,211,223,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px",
                      }}
                    >
                      <Upload className="w-5 h-5" style={{ color: "#274C77" }} />
                    </div>
                    <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", fontWeight: 500, color: "#274C77", margin: "0 0 4px" }}>
                      Click to upload or drag and drop
                    </p>
                    <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: "rgba(36,76,90,0.45)", margin: 0 }}>
                      PNG, JPG, PDF, DOC — up to 10 MB each
                    </p>
                  </div>

                  {/* File list */}
                  {uploadedFiles.length > 0 && (
                    <ul style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px", listStyle: "none", padding: 0, margin: "12px 0 0" }}>
                      {uploadedFiles.map((f, i) => (
                        <li
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "10px 14px",
                            border: "1px solid rgba(205,205,205,0.55)",
                            borderRadius: "10px",
                            background: "#F6F8F9",
                          }}
                        >
                          {f.preview ? (
                            <img
                              src={f.preview}
                              alt="preview"
                              style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "8px",
                                background: "rgba(205,205,205,0.35)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <FileIcon file={f.file} />
                            </div>
                          )}

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", fontWeight: 500, color: "#274C77", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {f.file.name}
                            </p>
                            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: "rgba(36,76,90,0.45)", margin: 0 }}>
                              {(f.file.size / 1024).toFixed(0)} KB
                            </p>
                          </div>

                          {f.uploading && (
                            <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: "#6096BA", flexShrink: 0 }}>
                              {IMAGE_TYPES.includes(f.file.type) ? "Uploading…" : "Reading…"}
                            </span>
                          )}
                          {!f.uploading && f.url && !f.error && (
                            <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: "#274C77", flexShrink: 0, display: "flex", alignItems: "center", gap: "4px" }}>
                              <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#6096BA" }} />
                              Ready
                            </span>
                          )}
                          {f.error && (
                            <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: "rgba(192,57,43,0.8)", flexShrink: 0 }}>
                              {f.error}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "4px",
                              color: "rgba(36,76,90,0.35)",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              transition: "color 0.15s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(192,57,43,0.7)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(36,76,90,0.35)")}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div style={sectionDivider} />

                {/* Urgency checkbox */}
                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.urgency}
                      onChange={(e) => setFormData({ ...formData, urgency: e.target.checked })}
                      style={{
                        width: "18px",
                        height: "18px",
                        accentColor: "#6096BA",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", fontWeight: 600, color: "#274C77" }}>
                        This situation feels urgent
                      </span>
                      <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: "rgba(36,76,90,0.50)", margin: "2px 0 0" }}>
                        Marking as urgent will prioritize your report for moderator review.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Anonymous assurance block */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    background: "rgba(153,211,223,0.15)",
                    border: "1px solid rgba(136,187,214,0.28)",
                    borderRadius: "12px",
                    padding: "16px 18px",
                    marginBottom: "28px",
                  }}
                >
                  <Lock className="w-4 h-4 shrink-0" style={{ color: "#274C77", marginTop: "2px" }} />
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: "rgba(36,76,90,0.70)", margin: 0, lineHeight: 1.65 }}>
                    This report is submitted anonymously. Our moderators will review it to provide appropriate support. We never share your information without permission.
                  </p>
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <SubmitButton isSubmitting={isSubmitting} isUploading={uploadedFiles.some((f) => f.uploading)} />

                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    disabled={isSubmitting}
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: isSubmitting ? "rgba(36,76,90,0.35)" : "#274C77",
                      background: "transparent",
                      border: "1px solid rgba(36,76,90,0.18)",
                      borderRadius: "8px",
                      padding: "11px 22px",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      transition: "border-color 0.15s, background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.background = "rgba(205,205,205,0.25)";
                        e.currentTarget.style.borderColor = "rgba(36,76,90,0.30)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "rgba(36,76,90,0.18)";
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            {/* ── Sidebar ─────────────────────────────────────────────────── */}
            <aside>
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(136,187,214,0.18)",
                  borderRadius: "20px",
                  padding: "28px",
                  position: "sticky",
                  top: "88px",
                  boxShadow: "0 4px 24px rgba(36,76,90,0.06)",
                }}
              >
                {/* Crisis support */}
                <div style={{ marginBottom: "24px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "rgba(153,211,223,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <Phone className="w-4 h-4" style={{ color: "#274C77" }} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "DM Serif Display, serif",
                      fontSize: "17px",
                      fontWeight: 400,
                      letterSpacing: "-0.03em",
                      color: "#274C77",
                      margin: "0 0 6px",
                    }}
                  >
                    Crisis support
                  </h3>
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: "rgba(36,76,90,0.60)", margin: "0 0 10px", lineHeight: 1.6 }}>
                    If you need immediate help, contact our crisis line.
                  </p>
                  <a
                    href="tel:18002747461"
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#274C77",
                      textDecoration: "none",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    1-800-CRISIS-1
                  </a>
                </div>

                <div style={{ borderTop: "1px solid rgba(205,205,205,0.55)", marginBottom: "24px" }} />

                

                {/* Resources */}
                <div style={{ marginBottom: "24px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "rgba(136,187,214,0.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <BookOpen className="w-4 h-4" style={{ color: "#274C77" }} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "DM Serif Display, serif",
                      fontSize: "17px",
                      fontWeight: 400,
                      letterSpacing: "-0.03em",
                      color: "#274C77",
                      margin: "0 0 12px",
                    }}
                  >
                    Resources
                  </h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      { to: "/crisis-help", label: "How to report bullying" },
                      { to: "/crisis-help", label: "Safety planning guide" },
                      { to: "/forum", label: "Support community" },
                    ].map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.to}
                          style={{
                            fontFamily: "DM Sans, sans-serif",
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#274C77",
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#6096BA")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#274C77")}
                        >
                          {item.label} →
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ borderTop: "1px solid rgba(205,205,205,0.55)", marginBottom: "0" }} />

                {/* Privacy note */}
                <div style={{ marginTop: "20px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <Lock className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(36,76,90,0.40)", marginTop: "3px" }} />
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: "rgba(36,76,90,0.50)", margin: 0, lineHeight: 1.65 }}>
                    Reports are encrypted and submitted anonymously. We never share your information without permission.
                  </p>
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

// ── Submit button with hover state ────────────────────────────────────────

function SubmitButton({ isSubmitting, isUploading }: { isSubmitting: boolean; isUploading: boolean }) {
  const [hovered, setHovered] = useState(false);
  const disabled = isSubmitting || isUploading;

  return (
    <button
      type="submit"
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "DM Sans, sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        color: disabled ? "rgba(36,76,90,0.40)" : "#FFFFFF",
        background: disabled
          ? "rgba(205,205,205,0.45)"
          : hovered
          ? "#274C77"
          : "#6096BA",
        border: "none",
        borderRadius: "8px",
        padding: "11px 28px",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.18s",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {isSubmitting ? (
        <>
          <span
            style={{
              width: "14px",
              height: "14px",
              border: "2px solid rgba(255,255,255,0.35)",
              borderTopColor: "#fff",
              borderRadius: "50%",
              display: "inline-block",
              animation: "spin 0.7s linear infinite",
            }}
          />
          Submitting…
        </>
      ) : (
        "Submit report"
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}