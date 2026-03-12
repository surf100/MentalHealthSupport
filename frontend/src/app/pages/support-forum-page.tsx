import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { AlertCircle, Flag, MessageSquare, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  getPosts,
  type ForumCategory,
  type ForumPostResponse,
} from "../api/forum-api";

type CategoryFilter = "ALL" | ForumCategory;

const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  ALL: "All Posts",
  BULLYING_SUPPORT: "Bullying Support",
  STRESS_AND_ANXIETY: "Stress & Anxiety",
  ADVICE: "Advice & Guidance",
  POSITIVE_STORIES: "Positive Stories",
  GENERAL_DISCUSSION: "General Discussion",
};

const CATEGORY_FILTERS: CategoryFilter[] = [
  "ALL",
  "BULLYING_SUPPORT",
  "STRESS_AND_ANXIETY",
  "ADVICE",
  "POSITIVE_STORIES",
  "GENERAL_DISCUSSION",
];

export function SupportForumPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ForumPostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("ALL");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    const category = selectedCategory === "ALL" ? undefined : selectedCategory;
    getPosts(category)
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.preview ?? "").toLowerCase().includes(q)
    );
  }, [query, posts]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-3">Community Support Forum</h1>
              <p className="text-lg text-gray-600">
                A safe space to share experiences, ask questions, and support others.
              </p>
            </div>
            <button
              onClick={() => navigate("/forum/create")}
              className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-800"
            >
              Create Post
            </button>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <aside className="col-span-3">
              <div className="border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Categories</h2>
                {CATEGORY_FILTERS.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left px-4 py-2 rounded-md mb-2 text-sm ${
                      selectedCategory === cat
                        ? "bg-emerald-50 text-emerald-700"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </aside>

            <section className="col-span-6">
              <div className="flex items-center gap-3 border px-4 py-3 rounded-xl mb-6">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  placeholder="Search posts"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full outline-none text-sm"
                />
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-xl p-6 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                      <div className="h-5 bg-gray-200 rounded w-48 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="border border-red-200 bg-red-50 rounded-xl p-8 text-center">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="border rounded-xl p-8 text-center">
                  <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Try another category or create the first post in this topic.
                  </p>
                  <button
                    onClick={() => navigate("/forum/create")}
                    className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-800"
                  >
                    Create Post
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => navigate(`/forum/${post.id}`)}
                      className="border rounded-xl p-6 hover:shadow-md cursor-pointer"
                    >
                      <div className="flex justify-between mb-3">
                        <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
                          {CATEGORY_LABELS[post.category] ?? post.category}
                        </span>
                        <Flag className="w-4 h-4 text-gray-400" />
                      </div>

                      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{post.preview}</p>

                      <div className="flex justify-between text-sm text-gray-500">
                        <div>{post.author}</div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {post.commentCount}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <aside className="col-span-3 space-y-6">
              <div className="border rounded-xl p-6 bg-emerald-50">
                <h3 className="font-semibold mb-2">Need immediate help?</h3>
                <p className="text-sm mb-4">
                  If you feel unsafe or need urgent support.
                </p>
                <button
                  onClick={() => navigate("/report")}
                  className="w-full bg-black text-white py-2 rounded-md"
                >
                  Anonymous Report
                </button>
              </div>

              <div className="border rounded-xl p-6">
                <div className="flex gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <h4 className="font-semibold">Moderated Space</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Harmful language or personal attacks may be reviewed and removed.
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