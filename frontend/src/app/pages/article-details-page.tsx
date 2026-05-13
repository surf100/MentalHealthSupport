import { Footer } from "../components/footer";
import { Header } from "../components/header";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Check,
  Heart,
  Share2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Article } from "./knowledge-base-page";

const STORAGE_KEY = "kb_articles";
const HELPFUL_KEY = "kb_helpful";

function loadArticles(): Article[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Article[];
  } catch {}
  return [];
}

function loadHelpful(): Set<number> {
  try {
    const stored = localStorage.getItem(HELPFUL_KEY);
    if (stored) return new Set(JSON.parse(stored) as number[]);
  } catch {}
  return new Set();
}

function saveHelpful(set: Set<number>) {
  try {
    localStorage.setItem(HELPFUL_KEY, JSON.stringify([...set]));
  } catch {}
}

export function ArticleDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const articleId = Number(id);

  const [articles, setArticles] = useState<Article[]>([]);
  const [helpful, setHelpful] = useState<Set<number>>(new Set());
  const [shareToast, setShareToast] = useState(false);

  useEffect(() => {
    setArticles(loadArticles());
    setHelpful(loadHelpful());
  }, []);

  const article = useMemo(
    () => articles.find((item) => item.id === articleId),
    [articleId, articles]
  );

  const relatedArticles = useMemo(
    () => articles.filter((item) => item.id !== articleId).slice(0, 3),
    [articleId, articles]
  );

  const isHelpful = helpful.has(articleId);

  function handleHelpful() {
    setHelpful((prev) => {
      const next = new Set(prev);
      if (next.has(articleId)) {
        next.delete(articleId);
      } else {
        next.add(articleId);
      }
      saveHelpful(next);
      return next;
    });
  }

  function handleShare() {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  }

  if (articles.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-8 py-16">
            <div className="border rounded-xl p-10 text-center text-gray-500 text-sm">
              Loading…
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-8 py-16">
            <div className="border rounded-xl p-10 text-center">
              <h1 className="text-3xl font-bold mb-3">Article not found</h1>
              <p className="text-gray-600 mb-6">
                The resource you are looking for does not exist or may have been removed.
              </p>
              <button
                onClick={() => navigate("/knowledge-base")}
                className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-800"
              >
                Return to Knowledge Base
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

      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border bg-emerald-50 border-emerald-200 text-emerald-800 text-sm font-medium">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          Link copied to clipboard!
        </div>
      )}

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <button
            onClick={() => navigate("/knowledge-base")}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Knowledge Base
          </button>

          <div className="grid grid-cols-12 gap-8">
            <section className="col-span-8">
              <article className="border rounded-xl p-8">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
                    {article.category}
                  </span>
                  <span className="text-sm text-gray-500">{article.readTime}</span>
                </div>

                <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

                <p className="text-lg text-gray-600 leading-8 mb-8">
                  {article.intro ?? article.description}
                </p>

                <div className="space-y-6 text-[15px] leading-8 text-gray-700">
                  {(article.content ?? []).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <div className="border-t mt-8 pt-6 flex items-center gap-4 text-sm text-gray-600">
                  <button
                    onClick={handleHelpful}
                    className={`inline-flex items-center gap-2 transition-colors ${
                      isHelpful
                        ? "text-red-500 hover:text-red-600"
                        : "hover:text-black"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isHelpful ? "fill-red-500 stroke-red-500" : ""}`}
                    />
                    {isHelpful ? "Marked as helpful" : "Helpful"}
                  </button>

                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 hover:text-black transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </article>
            </section>

            <aside className="col-span-4 space-y-6">
              <div className="border rounded-xl p-6 bg-emerald-50">
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-emerald-700 mt-0.5" />
                  <h3 className="font-semibold">Need help right now?</h3>
                </div>
                <p className="text-sm text-gray-700 leading-6 mb-4">
                  If this topic feels personal or urgent, you can submit an anonymous
                  report or reach out through the support forum.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/report")}
                    className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 text-sm font-medium"
                  >
                    Anonymous Report
                  </button>
                  <button
                    onClick={() => navigate("/forum")}
                    className="w-full border py-3 rounded-md hover:bg-white text-sm font-medium"
                  >
                    Support Forum
                  </button>
                </div>
              </div>

              {relatedArticles.length > 0 && (
                <div className="border rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <BookOpen className="w-5 h-5 text-gray-700 mt-0.5" />
                    <h4 className="font-semibold">More resources</h4>
                  </div>
                  <div className="space-y-3">
                    {relatedArticles.map((related) => (
                      <button
                        key={related.id}
                        onClick={() => navigate(`/knowledge-base/${related.id}`)}
                        className="w-full text-left border rounded-md px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-xs text-emerald-600 block mb-1">
                          {related.category}
                        </span>
                        {related.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}