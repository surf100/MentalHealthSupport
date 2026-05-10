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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="border rounded-xl p-10 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
              <div className="h-8 bg-gray-200 rounded w-96 mb-6" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-8 py-16">
            <div className="border rounded-xl p-10 text-center">
              <h1 className="text-3xl font-bold mb-3">Post not found</h1>
              <p className="text-gray-600 mb-6">
                {error ?? "The discussion you are looking for does not exist or may have been removed."}
              </p>
              <button
                onClick={() => navigate("/forum")}
                className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-800"
              >
                Return to Forum
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <button
            onClick={() => navigate("/forum")}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Forum
          </button>

          <div className="grid grid-cols-12 gap-8">
            <section className="col-span-8">
              <article className="border rounded-xl p-8 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
                    {CATEGORY_LABELS[post.category] ?? post.category}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Flag className="w-4 h-4" />
                  </button>
                </div>

                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

                <div className="text-sm text-gray-500 mb-6">
                  {post.author} • {formatDate(post.createdAt)}
                </div>

                <p className="text-gray-700 leading-8 text-[15px] mb-8">
                  {post.content}
                </p>

                <div className="flex items-center gap-6 text-sm text-gray-600 border-t pt-5">
                  <button
                    onClick={handleLike}
                    disabled={likeLoading}
                    className={`inline-flex items-center gap-2 hover:text-black disabled:opacity-50 ${
                      post.likedByMe ? "text-red-500" : ""
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.likedByMe ? "fill-current" : ""}`} />
                    Support {post.likeCount > 0 && `(${post.likeCount})`}
                  </button>

                  <div className="inline-flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    {post.comments.length} comments
                  </div>
                </div>
              </article>

              {/* Add comment */}
              <div className="border rounded-xl p-8 mb-6">
                <h2 className="text-2xl font-semibold mb-5">Add a Comment</h2>

                {commentError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                    {commentError}
                  </div>
                )}

                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a supportive comment..."
                  rows={5}
                  className="w-full border rounded-lg px-4 py-3 text-sm outline-none resize-none focus:ring-2 focus:ring-emerald-200 mb-4"
                />

                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymousComment}
                      onChange={(e) => setIsAnonymousComment(e.target.checked)}
                      className="rounded"
                    />
                    Post anonymously
                  </label>
                </div>

                <button
                  onClick={handleCommentSubmit}
                  disabled={isSubmittingComment || !commentText.trim()}
                  className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-800 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {isSubmittingComment ? "Posting..." : "Post Comment"}
                </button>
              </div>

              {/* Comments list */}
              <div className="border rounded-xl p-8">
                <h2 className="text-2xl font-semibold mb-6">Comments</h2>

                {post.comments.length === 0 ? (
                  <p className="text-sm text-gray-600">
                    No comments yet. Be the first to offer support.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="border rounded-lg p-5">
                        <div className="text-sm text-gray-500 mb-2">
                          {comment.author} • {formatDate(comment.createdAt)}
                        </div>
                        <p className="text-sm text-gray-700 leading-6">
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <aside className="col-span-4 space-y-6">
              <div className="border rounded-xl p-6 bg-emerald-50">
                <h3 className="font-semibold mb-2">Need immediate help?</h3>
                <p className="text-sm text-gray-700 mb-4 leading-6">
                  If this discussion reflects something urgent or unsafe, use the report form now.
                </p>
                <button
                  onClick={() => navigate("/report")}
                  className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800"
                >
                  Anonymous Report
                </button>
              </div>

              <div className="border rounded-xl p-6">
                <div className="flex gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <h4 className="font-semibold">Safe discussion reminder</h4>
                </div>
                <p className="text-sm text-gray-600 leading-6">
                  Please stay respectful and avoid sharing private personal information.
                  Harmful language or threats may be reviewed by moderators.
                </p>
              </div>

              <div className="border rounded-xl p-6">
                <h4 className="font-semibold mb-3">Helpful links</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/forum")}
                    className="w-full border rounded-md py-2 text-sm hover:bg-gray-50"
                  >
                    Back to Forum
                  </button>
                  <button
                    onClick={() => navigate("/forum/create")}
                    className="w-full border rounded-md py-2 text-sm hover:bg-gray-50"
                  >
                    Create Post
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