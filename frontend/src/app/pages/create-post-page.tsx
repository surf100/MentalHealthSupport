import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Info } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="max-w-3xl mb-10">
            <h1 className="text-5xl font-bold mb-3">Create a Support Post</h1>
            <p className="text-lg text-gray-600">
              Share your experience, ask a question, or offer support to others
              in the community.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <section className="col-span-8">
              <div className="border rounded-xl p-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Post Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a clear title for your post"
                      className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ForumCategory)}
                      className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200 bg-white"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Post Content
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your post here..."
                      rows={10}
                      className="w-full border rounded-lg px-4 py-3 text-sm outline-none resize-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>

                  <div className="flex items-center justify-between border rounded-lg px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Post anonymously
                      </p>
                      <p className="text-sm text-gray-500">
                        Your name will be hidden from other users.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isAnonymous ? "bg-black" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isAnonymous ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handlePublish}
                      disabled={isSubmitting || !title.trim() || !content.trim()}
                      className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Publishing..." : "Publish Post"}
                    </button>
                    <button
                      onClick={() => navigate("/forum")}
                      className="border px-5 py-3 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <aside className="col-span-4 space-y-6">
              <div className="border rounded-xl p-6">
                <h3 className="font-semibold mb-3">Community Guidelines</h3>
                <p className="text-sm text-gray-600 leading-6">
                  Please be respectful and avoid sharing personal private
                  information. Posts with harmful language, threats, or personal
                  attacks may be removed by moderators.
                </p>
              </div>

              <div className="border rounded-xl p-6 bg-emerald-50">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-emerald-700 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2">Safe posting reminder</h4>
                    <p className="text-sm text-gray-700 leading-6">
                      Share only what feels comfortable. Do not post phone
                      numbers, addresses, or any sensitive personal details.
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