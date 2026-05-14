import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Info, PenLine } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, type ForumCategory } from "../api/forum-api";

const CATEGORIES: { value: ForumCategory; label: string }[] = [
  { value: "BULLYING_SUPPORT", label: "Bullying Support" },
  { value: "STRESS_AND_ANXIETY", label: "Stress & Anxiety" },
  { value: "ADVICE", label: "Advice & Guidance" },
  { value: "POSITIVE_STORIES", label: "Positive Stories" },
  { value: "GENERAL_DISCUSSION", label: "General Discussion" },
];

export function CreatePostPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ForumCategory>("BULLYING_SUPPORT");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelHovered, setCancelHovered] = useState(false);

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);
      const post = await createPost({ title, content, category, anonymous: isAnonymous });
      navigate(`/forum/${post.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = !isSubmitting && title.trim().length > 0 && content.trim().length > 0;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F9F7F3", fontFamily: "DM Sans, sans-serif", color: "#274C77" }}
    >
      <Header />

      {/* ── Hero strip ───────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden border-b"
        style={{ backgroundColor: "#A3CEF1", borderColor: "rgba(36,76,90,0.12)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.10]"
          style={{
            backgroundImage: "radial-gradient(#274C77 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-10">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-4"
            style={{
              backgroundColor: "rgba(255,255,255,0.45)",
              borderColor: "rgba(36,76,90,0.15)",
            }}
          >
            <PenLine className="w-3.5 h-3.5" style={{ color: "#274C77", opacity: 0.6 }} />
            <span
              className="text-[12px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "#274C77", opacity: 0.6, fontFamily: "DM Sans, sans-serif" }}
            >
              Forum · New Post
            </span>
          </div>
          <h1
            className="text-[38px] sm:text-[48px] leading-[1.05] tracking-[-0.04em] mb-2"
            style={{ fontFamily: "DM Serif Display, serif", color: "#274C77" }}
          >
            Create a Support Post
          </h1>
          <p
            className="text-[15px] leading-[1.7] max-w-xl"
            style={{ color: "#274C77", opacity: 0.65, fontFamily: "DM Sans, sans-serif" }}
          >
            Share your experience, ask a question, or offer support to others in the community.
          </p>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-10">
          <div className="grid grid-cols-12 gap-8">

            {/* ── Form ─────────────────────────────────────────────────────── */}
            <section className="col-span-12 lg:col-span-8">
              <div
                className="rounded-2xl border p-8"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#D6DCE1" }}
              >
                {error && (
                  <div
                    className="rounded-xl px-4 py-3 text-sm border mb-6"
                    style={{
                      backgroundColor: "#FEF2F2",
                      borderColor: "#FECACA",
                      color: "#B91C1C",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label
                      className="block text-[13px] font-semibold mb-2"
                      style={{ color: "#274C77", fontFamily: "DM Sans, sans-serif" }}
                    >
                      Post Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a clear title for your post"
                      className="w-full rounded-lg px-4 py-3 text-sm outline-none border transition-colors"
                      style={{
                        backgroundColor: "#F6F8F9",
                        borderColor: "rgba(36,76,90,0.15)",
                        color: "#274C77",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "rgba(136,187,214,0.5)";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(136,187,214,0.15)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(36,76,90,0.15)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      className="block text-[13px] font-semibold mb-2"
                      style={{ color: "#274C77", fontFamily: "DM Sans, sans-serif" }}
                    >
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ForumCategory)}
                      className="w-full rounded-lg px-4 py-3 text-sm outline-none border transition-colors appearance-none"
                      style={{
                        backgroundColor: "#F6F8F9",
                        borderColor: "rgba(36,76,90,0.15)",
                        color: "#274C77",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "rgba(136,187,214,0.5)";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(136,187,214,0.15)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(36,76,90,0.15)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Content */}
                  <div>
                    <label
                      className="block text-[13px] font-semibold mb-2"
                      style={{ color: "#274C77", fontFamily: "DM Sans, sans-serif" }}
                    >
                      Post Content
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your post here..."
                      rows={10}
                      className="w-full rounded-lg px-4 py-3 text-sm outline-none resize-none border transition-colors"
                      style={{
                        backgroundColor: "#F6F8F9",
                        borderColor: "rgba(36,76,90,0.15)",
                        color: "#274C77",
                        fontFamily: "DM Sans, sans-serif",
                        lineHeight: "1.75",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "rgba(136,187,214,0.5)";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(136,187,214,0.15)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(36,76,90,0.15)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  {/* Anonymous toggle */}
                  <div
                    className="flex items-center justify-between rounded-xl border px-5 py-4"
                    style={{ backgroundColor: "#F8FAFB", borderColor: "#D6DCE1" }}
                  >
                    <div>
                      <p
                        className="text-sm font-semibold mb-0.5"
                        style={{ color: "#274C77", fontFamily: "DM Sans, sans-serif" }}
                      >
                        Post anonymously
                      </p>
                      <p
                        className="text-[13px]"
                        style={{ color: "#274C77", opacity: 0.55, fontFamily: "DM Sans, sans-serif" }}
                      >
                        Your name will be hidden from other users.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0"
                      style={{ backgroundColor: isAnonymous ? "#274C77" : "#D6DCE1" }}
                    >
                      <span
                        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        style={{ transform: isAnonymous ? "translateX(22px)" : "translateX(4px)" }}
                      />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={handlePublish}
                      disabled={!canSubmit}
                      className="rounded-sm px-6 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "#274C77", fontFamily: "DM Sans, sans-serif" }}
                    >
                      {isSubmitting ? "Publishing…" : "Publish Post"}
                    </button>
                    <button
                      onClick={() => navigate("/forum")}
                      onMouseEnter={() => setCancelHovered(true)}
                      onMouseLeave={() => setCancelHovered(false)}
                      className="rounded-sm px-6 py-3 text-sm font-semibold border transition-colors"
                      style={{
                        borderColor: cancelHovered ? "rgba(36,76,90,0.35)" : "#D6DCE1",
                        color: "#274C77",
                        backgroundColor: cancelHovered ? "rgba(255,255,255,0.6)" : "transparent",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Sidebar ───────────────────────────────────────────────────── */}
            <aside className="col-span-12 lg:col-span-4 space-y-5">

              {/* Community guidelines */}
              <div
                className="rounded-2xl border p-6"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#D6DCE1" }}
              >
                <h3
                  className="text-[15px] font-semibold mb-3"
                  style={{ fontFamily: "DM Sans, sans-serif", color: "#274C77" }}
                >
                  Community Guidelines
                </h3>
                <p
                  className="text-sm leading-[1.75]"
                  style={{ color: "#274C77", opacity: 0.6, fontFamily: "DM Sans, sans-serif" }}
                >
                  Please be respectful and avoid sharing personal private information.
                  Posts with harmful language, threats, or personal attacks may be
                  removed by moderators.
                </p>
              </div>

              {/* Safe posting reminder */}
              <div
                className="rounded-2xl border p-6"
                style={{ backgroundColor: "#A3CEF1", borderColor: "rgba(36,76,90,0.12)" }}
              >
                <div className="flex items-start gap-3">
                  <Info
                    className="w-5 h-5 mt-0.5 shrink-0"
                    style={{ color: "#274C77", opacity: 0.65 }}
                  />
                  <div>
                    <h4
                      className="text-[15px] font-semibold mb-2"
                      style={{ fontFamily: "DM Sans, sans-serif", color: "#274C77" }}
                    >
                      Safe posting reminder
                    </h4>
                    <p
                      className="text-sm leading-[1.75]"
                      style={{ color: "#274C77", opacity: 0.65, fontFamily: "DM Sans, sans-serif" }}
                    >
                      Share only what feels comfortable. Do not post phone numbers,
                      addresses, or any sensitive personal details.
                    </p>
                  </div>
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