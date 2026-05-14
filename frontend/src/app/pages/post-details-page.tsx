import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { AlertCircle, ArrowLeft, Flag, Heart, MessageSquare, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPostById,
  addComment,
  toggleLike,
  type ForumPostDetailResponse,
  type ForumCommentResponse,
} from "../api/forum-api";

const CATEGORY_LABELS: Record<string, string> = {
  BULLYING_SUPPORT: "Bullying Support",
  STRESS_AND_ANXIETY: "Stress & Anxiety",
  ADVICE: "Advice & Guidance",
  POSITIVE_STORIES: "Positive Stories",
  GENERAL_DISCUSSION: "General Discussion",
};

function formatDate(isoString: string) {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Skeleton loading state ──────────────────────────────────────────────────

function PostSkeleton() {
  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: "#F9F7F3", color: "#274C77" }}
    >
      <Header />
      <main className="flex-1">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-10">
          <div className="h-4 w-28 rounded animate-pulse mb-8" style={{ backgroundColor: "rgba(36,76,90,0.08)" }} />
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 space-y-5">
              <div className="rounded-2xl p-8 border" style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(136,187,214,0.18)" }}>
                <div className="h-5 w-24 rounded-full animate-pulse mb-6" style={{ backgroundColor: "rgba(153,211,223,0.30)" }} />
                <div className="h-9 w-3/4 rounded animate-pulse mb-3" style={{ backgroundColor: "rgba(36,76,90,0.08)" }} />
                <div className="h-3.5 w-36 rounded animate-pulse mb-8" style={{ backgroundColor: "rgba(36,76,90,0.05)" }} />
                <div className="space-y-2">
                  {[1, 0.9, 0.7].map((w, i) => (
                    <div key={i} className="h-4 rounded animate-pulse" style={{ backgroundColor: "rgba(36,76,90,0.06)", width: `${w * 100}%` }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="col-span-4 space-y-4">
              <div className="rounded-2xl p-6 border h-40 animate-pulse" style={{ backgroundColor: "rgba(153,211,223,0.15)", borderColor: "rgba(136,187,214,0.18)" }} />
              <div className="rounded-2xl p-6 border h-32 animate-pulse" style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(136,187,214,0.18)" }} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Error / not found state ─────────────────────────────────────────────────

function PostError({ error, onBack }: { error: string | null; onBack: () => void }) {
  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: "#F9F7F3", color: "#274C77" }}
    >
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-sm px-6 py-16">
          <div className="flex justify-center mb-6">
            <div className="rounded-2xl p-4" style={{ backgroundColor: "rgba(36,76,90,0.07)" }}>
              <AlertCircle className="w-7 h-7" style={{ color: "#274C77" }} />
            </div>
          </div>
          <h1 className="font-display text-[32px] tracking-[-0.03em] mb-3" style={{ color: "#274C77" }}>
            Post not found
          </h1>
          <p className="font-sans text-[14px] leading-[1.75] mb-8" style={{ color: "rgba(36,76,90,0.60)" }}>
            {error ?? "The discussion you are looking for does not exist or may have been removed."}
          </p>
          <button
            onClick={onBack}
            className="font-sans text-[14px] font-semibold px-5 py-2.5 rounded-sm transition"
            style={{ backgroundColor: "#6096BA", color: "#FFFFFF" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#274C77")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6096BA")}
          >
            Return to Forum
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function PostDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const postId = Number(id);

  const [post, setPost] = useState<ForumPostDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [commentText, setCommentText] = useState("");
  const [isAnonymousComment, setIsAnonymousComment] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    getPostById(postId)
      .then(setPost)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [postId]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !post) return;
    try {
      setIsSubmittingComment(true);
      setCommentError(null);
      const newComment: ForumCommentResponse = await addComment(post.id, {
        content: commentText.trim(),
        anonymous: isAnonymousComment,
      });
      setPost((prev) =>
        prev ? { ...prev, comments: [...prev.comments, newComment] } : prev
      );
      setCommentText("");
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLike = async () => {
    if (!post || likeLoading) return;
    try {
      setLikeLoading(true);
      const result = await toggleLike(post.id);
      setPost((prev) =>
        prev ? { ...prev, likedByMe: result.liked, likeCount: result.likeCount } : prev
      );
    } catch {
      // silent
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading) return <PostSkeleton />;
  if (error || !post) return <PostError error={error} onBack={() => navigate("/forum")} />;

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: "#F9F7F3", color: "#274C77" }}
    >
      <Header />

      <main className="flex-1">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-10">

          {/* Back link */}
          <button
            onClick={() => navigate("/forum")}
            className="inline-flex items-center gap-2 font-sans text-[13px] font-semibold tracking-[-0.01em] mb-8 transition"
            style={{ color: "rgba(36,76,90,0.55)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#274C77")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(36,76,90,0.55)")}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Forum
          </button>

          <div className="grid grid-cols-12 gap-8 items-start">

            {/* ── Main column ──────────────────────────────────────────────── */}
            <section className="col-span-12 lg:col-span-8 space-y-5">

              {/* Post card */}
              <article
                className="rounded-2xl p-8 border"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "rgba(136,187,214,0.18)",
                  boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                }}
              >
                <div className="flex items-start justify-between mb-6">
                  <span
                    className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] px-3 py-1 rounded-full"
                    style={{ backgroundColor: "rgba(153,211,223,0.30)", color: "#274C77" }}
                  >
                    {CATEGORY_LABELS[post.category] ?? post.category}
                  </span>
                  <button
                    className="transition"
                    style={{ color: "rgba(36,76,90,0.30)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(36,76,90,0.65)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(36,76,90,0.30)")}
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>

                <h1
                  className="font-display text-[32px] sm:text-[38px] leading-[1.1] tracking-[-0.03em] mb-3"
                  style={{ color: "#274C77" }}
                >
                  {post.title}
                </h1>

                <p
                  className="font-sans text-[13px] tracking-[-0.01em] mb-8"
                  style={{ color: "rgba(36,76,90,0.45)" }}
                >
                  {post.author} · {formatDate(post.createdAt)}
                </p>

                <p
                  className="font-sans text-[15px] leading-[1.8] tracking-[-0.01em]"
                  style={{ color: "rgba(36,76,90,0.70)" }}
                >
                  {post.content}
                </p>

                {/* Reactions bar */}
                <div
                  className="flex items-center gap-6 mt-8 pt-6 border-t"
                  style={{ borderColor: "rgba(36,76,90,0.08)" }}
                >
                  <button
                    onClick={handleLike}
                    disabled={likeLoading}
                    className="inline-flex items-center gap-2 font-sans text-[13px] font-semibold transition disabled:opacity-50"
                    style={{ color: post.likedByMe ? "#6096BA" : "rgba(36,76,90,0.50)" }}
                    onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.color = "#6096BA"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = post.likedByMe ? "#6096BA" : "rgba(36,76,90,0.50)"; }}
                  >
                    <Heart className={`w-4 h-4 ${post.likedByMe ? "fill-current" : ""}`} />
                    Support{post.likeCount > 0 ? ` (${post.likeCount})` : ""}
                  </button>

                  <div
                    className="inline-flex items-center gap-2 font-sans text-[13px]"
                    style={{ color: "rgba(36,76,90,0.45)" }}
                  >
                    <MessageSquare className="w-4 h-4" />
                    {post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}
                  </div>
                </div>
              </article>

              {/* Add comment */}
              <div
                className="rounded-2xl p-8 border"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "rgba(136,187,214,0.18)",
                  boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                }}
              >
                <h2
                  className="font-display text-[24px] tracking-[-0.03em] mb-6"
                  style={{ color: "#274C77" }}
                >
                  Add a comment
                </h2>

                {commentError && (
                  <div
                    className="flex items-start gap-3 rounded-xl px-4 py-3 mb-5 border"
                    style={{ backgroundColor: "rgba(36,76,90,0.05)", borderColor: "rgba(36,76,90,0.12)" }}
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#274C77" }} />
                    <p className="font-sans text-[13px] leading-[1.6]" style={{ color: "#274C77" }}>
                      {commentError}
                    </p>
                  </div>
                )}

                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a supportive comment…"
                  rows={5}
                  className="w-full rounded-xl px-4 py-3 font-sans text-[14px] leading-[1.75] tracking-[-0.01em] outline-none resize-none border transition"
                  style={{
                    backgroundColor: "#F6F8F9",
                    borderColor: "rgba(36,76,90,0.12)",
                    color: "#274C77",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(136,187,214,0.50)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(136,187,214,0.12)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(36,76,90,0.12)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />

                <div className="flex items-center justify-between mt-4">
                  <label
                    className="inline-flex items-center gap-2.5 font-sans text-[13px] tracking-[-0.01em] cursor-pointer select-none"
                    style={{ color: "rgba(36,76,90,0.60)" }}
                  >
                    <input
                      type="checkbox"
                      checked={isAnonymousComment}
                      onChange={(e) => setIsAnonymousComment(e.target.checked)}
                      className="rounded"
                      style={{ accentColor: "#6096BA" }}
                    />
                    Post anonymously
                  </label>

                  <button
                    onClick={handleCommentSubmit}
                    disabled={isSubmittingComment || !commentText.trim()}
                    className="inline-flex items-center gap-2 font-sans text-[14px] font-semibold px-5 py-2.5 rounded-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#6096BA", color: "#FFFFFF" }}
                    onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#274C77"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#6096BA"; }}
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmittingComment ? "Posting…" : "Post comment"}
                  </button>
                </div>
              </div>

              {/* Comments list */}
              <div
                className="rounded-2xl p-8 border"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "rgba(136,187,214,0.18)",
                  boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                }}
              >
                <h2
                  className="font-display text-[24px] tracking-[-0.03em] mb-6"
                  style={{ color: "#274C77" }}
                >
                  Comments
                  {post.comments.length > 0 && (
                    <span
                      className="ml-3 font-sans text-[13px] font-normal"
                      style={{ color: "rgba(36,76,90,0.40)" }}
                    >
                      {post.comments.length}
                    </span>
                  )}
                </h2>

                {post.comments.length === 0 ? (
                  <div className="py-10 text-center">
                    <div
                      className="inline-flex items-center justify-center rounded-2xl p-4 mb-4"
                      style={{ backgroundColor: "rgba(153,211,223,0.20)" }}
                    >
                      <MessageSquare className="w-6 h-6" style={{ color: "rgba(36,76,90,0.40)" }} />
                    </div>
                    <p className="font-sans text-[14px] leading-[1.75]" style={{ color: "rgba(36,76,90,0.50)" }}>
                      No comments yet. Be the first to offer support.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="rounded-xl p-5 border"
                        style={{
                          backgroundColor: "rgba(153,211,223,0.07)",
                          borderColor: "rgba(153,211,223,0.22)",
                        }}
                      >
                        <p
                          className="font-sans text-[12px] tracking-[-0.01em] mb-2"
                          style={{ color: "rgba(36,76,90,0.45)" }}
                        >
                          {comment.author} · {formatDate(comment.createdAt)}
                        </p>
                        <p
                          className="font-sans text-[14px] leading-[1.75] tracking-[-0.01em]"
                          style={{ color: "rgba(36,76,90,0.72)" }}
                        >
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* ── Sidebar ──────────────────────────────────────────────────── */}
            <aside className="col-span-12 lg:col-span-4 space-y-4">

              {/* Crisis CTA */}
              <div
                className="rounded-2xl p-6 border"
                style={{
                  backgroundColor: "rgba(153,211,223,0.25)",
                  borderColor: "rgba(136,187,214,0.30)",
                  boxShadow: "0 8px 40px rgba(36,76,90,0.06)",
                }}
              >
                <p
                  className="font-sans text-[11px] font-bold uppercase tracking-[0.20em] mb-3"
                  style={{ color: "#6096BA" }}
                >
                  Need help?
                </p>
                <h3
                  className="font-display text-[20px] leading-[1.2] tracking-[-0.03em] mb-3"
                  style={{ color: "#274C77" }}
                >
                  Need immediate help?
                </h3>
                <p
                  className="font-sans text-[13px] leading-[1.75] tracking-[-0.01em] mb-5"
                  style={{ color: "rgba(36,76,90,0.65)" }}
                >
                  If this discussion reflects something urgent or unsafe, use the report form now.
                </p>
                <button
                  onClick={() => navigate("/report")}
                  className="w-full font-sans text-[14px] font-semibold py-2.5 rounded-sm transition"
                  style={{ backgroundColor: "#274C77", color: "#F9F7F3" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#6096BA")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#274C77")}
                >
                  Anonymous Report
                </button>
              </div>

              {/* Safe discussion reminder */}
              <div
                className="rounded-2xl p-6 border"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "rgba(136,187,214,0.18)",
                  boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="rounded-lg p-2"
                    style={{ backgroundColor: "rgba(36,76,90,0.07)" }}
                  >
                    <AlertCircle className="w-4 h-4" style={{ color: "#274C77" }} />
                  </div>
                  <p className="font-sans text-[13px] font-semibold tracking-[-0.01em]" style={{ color: "#274C77" }}>
                    Safe discussion reminder
                  </p>
                </div>
                <p
                  className="font-sans text-[13px] leading-[1.75] tracking-[-0.01em]"
                  style={{ color: "rgba(36,76,90,0.60)" }}
                >
                  Please stay respectful and avoid sharing private personal information. Harmful language or threats may be reviewed by moderators.
                </p>
              </div>

              {/* Helpful links */}
              <div
                className="rounded-2xl p-6 border"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "rgba(136,187,214,0.18)",
                  boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                }}
              >
                <p
                  className="font-sans text-[11px] font-bold uppercase tracking-[0.20em] mb-4"
                  style={{ color: "#6096BA" }}
                >
                  Helpful links
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate("/forum")}
                    className="w-full font-sans text-[13px] font-semibold py-2 rounded-sm border transition text-left px-3"
                    style={{ borderColor: "rgba(36,76,90,0.18)", color: "#274C77", backgroundColor: "transparent" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(153,211,223,0.12)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    ← Back to Forum
                  </button>
                  <button
                    onClick={() => navigate("/forum/create")}
                    className="w-full font-sans text-[13px] font-semibold py-2 rounded-sm border transition text-left px-3"
                    style={{ borderColor: "rgba(36,76,90,0.18)", color: "#274C77", backgroundColor: "transparent" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(153,211,223,0.12)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    + Create post
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