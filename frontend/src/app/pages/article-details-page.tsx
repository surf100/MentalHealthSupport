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

// ── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className}`}
      style={{ backgroundColor: "rgba(36,76,90,0.07)" }}
    />
  );
}

function ArticleLoadingSkeleton() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F9F7F3", fontFamily: "DM Sans, sans-serif" }}
    >
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-10">
          <Skeleton className="h-5 w-40 mb-10" />
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8 space-y-5">
              <div
                className="rounded-2xl border p-8 space-y-5"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#D6DCE1" }}
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <div className="space-y-3 pt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-5 w-full" />
                  ))}
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <div
                className="rounded-2xl border p-6 space-y-4"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#D6DCE1" }}
              >
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-11 w-full rounded-lg" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function ArticleDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const articleId = Number(id);

  const [articles, setArticles] = useState<Article[]>([]);
  const [helpful, setHelpful] = useState<Set<number>>(new Set());
  const [shareToast, setShareToast] = useState(false);
  const [helpfulHovered, setHelpfulHovered] = useState(false);
  const [shareHovered, setShareHovered] = useState(false);

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

  // ── Loading state ─────────────────────────────────────────────────────────
  if (articles.length === 0) {
    return <ArticleLoadingSkeleton />;
  }

  // ── Not found state ───────────────────────────────────────────────────────
  if (!article) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "#F9F7F3", fontFamily: "DM Sans, sans-serif", color: "#274C77" }}
      >
        <Header />
        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <div
            className="w-full max-w-lg rounded-2xl border p-12 text-center"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#D6DCE1" }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: "#E8F4F8" }}
            >
              <BookOpen className="w-5 h-5" style={{ color: "#6096BA" }} />
            </div>
            <h1
              className="text-[28px] leading-tight tracking-[-0.03em] mb-3"
              style={{ fontFamily: "DM Serif Display, serif", color: "#274C77" }}
            >
              Article not found
            </h1>
            <p
              className="text-sm leading-[1.75] mb-7"
              style={{ color: "#274C77", opacity: 0.6, fontFamily: "DM Sans, sans-serif" }}
            >
              The resource you are looking for does not exist or may have been removed.
            </p>
            <button
              onClick={() => navigate("/knowledge-base")}
              className="rounded-sm px-6 py-3 text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "#274C77", fontFamily: "DM Sans, sans-serif" }}
            >
              Return to Knowledge Base
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F9F7F3", fontFamily: "DM Sans, sans-serif", color: "#274C77" }}
    >
      <Header />

      {/* ── Share toast ───────────────────────────────────────────────────── */}
      {shareToast && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border text-sm font-semibold"
          style={{
            backgroundColor: "#E8F4F8",
            borderColor: "#6096BA",
            color: "#274C77",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          <Check className="w-4 h-4 shrink-0" style={{ color: "#6096BA" }} />
          Link copied to clipboard!
        </div>
      )}

      {/* ── Hero strip ────────────────────────────────────────────────────── */}
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
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-8">
          <button
            onClick={() => navigate("/knowledge-base")}
            className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity mb-4 hover:opacity-70"
            style={{ color: "#274C77", fontFamily: "DM Sans, sans-serif" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Knowledge Base
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full border text-[12px] font-semibold tracking-wide"
              style={{
                backgroundColor: "rgba(255,255,255,0.55)",
                borderColor: "rgba(36,76,90,0.15)",
                color: "#274C77",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              {article.category}
            </span>
            <span
              className="text-[13px]"
              style={{ color: "#274C77", opacity: 0.55, fontFamily: "DM Sans, sans-serif" }}
            >
              {article.readTime}
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-10">
          <div className="grid grid-cols-12 gap-8">

            {/* ── Article body ─────────────────────────────────────────────── */}
            <section className="col-span-12 lg:col-span-8">
              <article
                className="rounded-2xl border p-8"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#D6DCE1" }}
              >
                <h1
                  className="text-[34px] sm:text-[40px] leading-[1.1] tracking-[-0.04em] mb-5"
                  style={{ fontFamily: "DM Serif Display, serif", color: "#274C77" }}
                >
                  {article.title}
                </h1>

                <p
                  className="text-[17px] leading-[1.8] mb-8 pb-8 border-b"
                  style={{
                    color: "#274C77",
                    opacity: 0.7,
                    fontFamily: "DM Sans, sans-serif",
                    borderColor: "#D6DCE1",
                  }}
                >
                  {article.intro ?? article.description}
                </p>

                <div className="space-y-5">
                  {(article.content ?? []).map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-[15px] leading-[1.85]"
                      style={{ color: "#274C77", opacity: 0.72, fontFamily: "DM Sans, sans-serif" }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Footer actions */}
                <div
                  className="mt-10 pt-6 border-t flex items-center gap-5"
                  style={{ borderColor: "#D6DCE1" }}
                >
                  <button
                    onClick={handleHelpful}
                    onMouseEnter={() => setHelpfulHovered(true)}
                    onMouseLeave={() => setHelpfulHovered(false)}
                    className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity"
                    style={{
                      color: isHelpful ? "#E2445C" : "#274C77",
                      opacity: isHelpful ? 1 : helpfulHovered ? 0.9 : 0.55,
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    <Heart
                      className="w-4 h-4"
                      style={
                        isHelpful
                          ? { fill: "#E2445C", stroke: "#E2445C" }
                          : { fill: "none", stroke: "currentColor" }
                      }
                    />
                    {isHelpful ? "Marked as helpful" : "Helpful"}
                  </button>

                  <button
                    onClick={handleShare}
                    onMouseEnter={() => setShareHovered(true)}
                    onMouseLeave={() => setShareHovered(false)}
                    className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity"
                    style={{
                      color: "#274C77",
                      opacity: shareHovered ? 0.9 : 0.55,
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </article>
            </section>

            {/* ── Sidebar ───────────────────────────────────────────────────── */}
            <aside className="col-span-12 lg:col-span-4 space-y-5">

              {/* Need help card */}
              <div
                className="rounded-2xl border p-6"
                style={{ backgroundColor: "#A3CEF1", borderColor: "rgba(36,76,90,0.12)" }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#274C77", opacity: 0.7 }} />
                  <h3
                    className="text-[16px] font-semibold leading-tight tracking-[-0.02em]"
                    style={{ fontFamily: "DM Serif Display, serif", color: "#274C77" }}
                  >
                    Need help right now?
                  </h3>
                </div>
                <p
                  className="text-sm leading-[1.75] mb-5"
                  style={{ color: "#274C77", opacity: 0.65, fontFamily: "DM Sans, sans-serif" }}
                >
                  If this topic feels personal or urgent, you can submit an anonymous
                  report or reach out through the support forum.
                </p>
                <div className="space-y-2.5">
                  <button
                    onClick={() => navigate("/report")}
                    className="w-full py-3 rounded-sm text-sm font-semibold text-white transition-colors"
                    style={{ backgroundColor: "#274C77", fontFamily: "DM Sans, sans-serif" }}
                  >
                    Anonymous Report
                  </button>
                  <button
                    onClick={() => navigate("/forum")}
                    className="w-full py-3 rounded-sm text-sm font-semibold border transition-colors"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.55)",
                      borderColor: "rgba(36,76,90,0.2)",
                      color: "#274C77",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    Support Forum
                  </button>
                </div>
              </div>

              {/* Related articles */}
              {relatedArticles.length > 0 && (
                <div
                  className="rounded-2xl border p-6"
                  style={{ backgroundColor: "#FFFFFF", borderColor: "#D6DCE1" }}
                >
                  <div className="flex items-center gap-2.5 mb-5">
                    <BookOpen className="w-4 h-4 shrink-0" style={{ color: "#274C77", opacity: 0.5 }} />
                    <h4
                      className="text-[14px] font-semibold"
                      style={{ color: "#274C77", fontFamily: "DM Sans, sans-serif" }}
                    >
                      More resources
                    </h4>
                  </div>
                  <div className="space-y-2.5">
                    {relatedArticles.map((related) => (
                      <RelatedArticleButton
                        key={related.id}
                        related={related}
                        onClick={() => navigate(`/knowledge-base/${related.id}`)}
                      />
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

function RelatedArticleButton({
  related,
  onClick,
}: {
  related: Article;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full text-left rounded-xl px-4 py-3.5 border transition-colors"
      style={{
        backgroundColor: hovered ? "#F0F8FA" : "#FAFAFA",
        borderColor: hovered ? "#6096BA" : "#D6DCE1",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <span
        className="text-[11px] font-bold uppercase tracking-[0.16em] block mb-1"
        style={{ color: "#6096BA", fontFamily: "DM Sans, sans-serif" }}
      >
        {related.category}
      </span>
      <span
        className="text-sm font-medium leading-snug"
        style={{ color: "#274C77", fontFamily: "DM Sans, sans-serif" }}
      >
        {related.title}
      </span>
    </button>
  );
}