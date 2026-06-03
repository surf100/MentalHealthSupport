import { Footer } from "../components/footer";
import { Header } from "../components/header";
import {
  AlertCircle,
  CheckCircle,
  Flag,
  MessageSquare,
  Search,
  Shield,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPosts,
  type ForumCategory,
  type ForumPostResponse,
} from "../api/forum-api";

// ── All business logic preserved exactly ──────────────────────────────────

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

// Category accent stripe colors — new blue palette
const CATEGORY_ACCENTS: Record<CategoryFilter, string> = {
  ALL:                "#6096BA",
  BULLYING_SUPPORT:   "#274C77",
  STRESS_AND_ANXIETY: "#6096BA",
  ADVICE:             "#A3CEF1",
  POSITIVE_STORIES:   "#274C77",
  GENERAL_DISCUSSION: "#6096BA",
};

// Category pill backgrounds
const CATEGORY_PILL_BG: Record<CategoryFilter, string> = {
  ALL:                "rgba(96,150,186,0.15)",
  BULLYING_SUPPORT:   "rgba(39,76,119,0.10)",
  STRESS_AND_ANXIETY: "rgba(96,150,186,0.15)",
  ADVICE:             "rgba(163,206,241,0.35)",
  POSITIVE_STORIES:   "rgba(39,76,119,0.10)",
  GENERAL_DISCUSSION: "rgba(96,150,186,0.15)",
};

export function SupportForumPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ForumPostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("ALL");
  const [query, setQuery] = useState("");
  const [flaggedPosts, setFlaggedPosts] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const [createHovered, setCreateHovered] = useState(false);
  const [reportHovered, setReportHovered] = useState(false);
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<CategoryFilter | null>(null);

  // ── Handlers — logic untouched ────────────────────────────────────────

  function handleFlag(e: React.MouseEvent, postId: number) {
    e.stopPropagation();
    if (flaggedPosts.has(postId)) {
      setToast({ message: "You have already reported this post.", type: "info" });
    } else {
      setFlaggedPosts((prev) => new Set(prev).add(postId));
      setToast({ message: "Post reported. Our moderators will review it.", type: "success" });
    }
    setTimeout(() => setToast(null), 3500);
  }

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

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#E7ECEF", fontFamily: "DM Sans, sans-serif", color: "#274C77" }}
    >
      <Header />

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 20px",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(39,76,119,0.18)",
            backgroundColor: toast.type === "success" ? "#A3CEF1" : "#FFFFFF",
            border: `1px solid ${toast.type === "success" ? "rgba(39,76,119,0.18)" : "rgba(39,76,119,0.10)"}`,
            color: "#274C77",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "#274C77" }} />
          ) : (
            <X className="w-4 h-4 shrink-0" style={{ color: "#274C77" }} />
          )}
          {toast.message}
        </div>
      )}

      <main style={{ flex: 1 }}>

        {/* ── Hero strip ────────────────────────────────────────────────────── */}
        <section
          style={{
            backgroundColor: "#A3CEF1",
            borderBottom: "1px solid rgba(39,76,119,0.13)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Dot grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: 0.12,
              backgroundImage: "radial-gradient(#274C77 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "1440px",
              margin: "0 auto",
              padding: "52px 56px 44px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "32px",
              }}
            >
              <div style={{ maxWidth: "680px" }}>
                {/* Eyebrow badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "99px",
                    border: "1px solid rgba(39,76,119,0.15)",
                    background: "rgba(163,206,241,0.70)",
                    padding: "6px 16px",
                    marginBottom: "20px",
                  }}
                >
                  <Users className="w-3.5 h-3.5" style={{ color: "#274C77" }} />
                  <span
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.20em",
                      textTransform: "uppercase",
                      color: "rgba(39,76,119,0.70)",
                    }}
                  >
                    Student community
                  </span>
                </div>

                <h1
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "clamp(40px, 6vw, 72px)",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.00,
                    color: "#274C77",
                    margin: "0 0 16px",
                  }}
                >
                  A space to share, support, and listen.
                </h1>

                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "17px",
                    lineHeight: 1.75,
                    letterSpacing: "-0.01em",
                    color: "rgba(39,76,119,0.68)",
                    margin: 0,
                  }}
                >
                  Ask questions, share experiences, and support peers. All discussions are moderated to keep this a safe and constructive environment.
                </p>
              </div>

              {/* Bottom row: trust bar + CTA */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "20px",
                  paddingTop: "28px",
                  borderTop: "1px solid rgba(39,76,119,0.12)",
                }}
              >
                {/* Trust signals */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
                  {[
                    { icon: Shield, text: "All posts are moderated" },
                    { icon: Users, text: "Peer-led support community" },
                    { icon: AlertCircle, text: "Crisis resources always available" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Icon className="w-4 h-4" style={{ color: "rgba(39,76,119,0.55)" }} />
                      <span
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "13px",
                          color: "rgba(39,76,119,0.65)",
                        }}
                      >
                        {text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Create post CTA */}
                <button
                  onClick={() => navigate("/forum/create")}
                  onMouseEnter={() => setCreateHovered(true)}
                  onMouseLeave={() => setCreateHovered(false)}
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#E7ECEF",
                    backgroundColor: createHovered ? "#6096BA" : "#274C77",
                    border: "none",
                    borderRadius: "4px",
                    padding: "13px 26px",
                    cursor: "pointer",
                    transition: "background-color 0.18s",
                    flexShrink: 0,
                  }}
                >
                  Start a discussion →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Three-column layout ───────────────────────────────────────────── */}
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            padding: "40px 56px 72px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "220px 1fr 240px",
              gap: "28px",
              alignItems: "start",
            }}
          >

            {/* ── Left sidebar: Categories ────────────────────────────────── */}
            <aside style={{ position: "sticky", top: "88px" }}>
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(39,76,119,0.10)",
                  borderRadius: "16px",
                  padding: "20px",
                  boxShadow: "0 2px 12px rgba(39,76,119,0.06)",
                }}
              >
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.20em",
                    textTransform: "uppercase",
                    color: "rgba(39,76,119,0.40)",
                    marginBottom: "12px",
                    paddingLeft: "10px",
                  }}
                >
                  Categories
                </p>

                <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {CATEGORY_FILTERS.map((cat) => {
                    const isActive = selectedCategory === cat;
                    const isHovered = hoveredCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        onMouseEnter={() => setHoveredCategory(cat)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "13px",
                          fontWeight: isActive ? 600 : 400,
                          padding: "9px 12px",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          transition: "background-color 0.15s, color 0.15s",
                          backgroundColor: isActive
                            ? "#274C77"
                            : isHovered
                            ? "rgba(163,206,241,0.28)"
                            : "transparent",
                          color: isActive ? "#E7ECEF" : "rgba(39,76,119,0.75)",
                        }}
                      >
                        {CATEGORY_LABELS[cat]}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* ── Center: Posts ───────────────────────────────────────────── */}
            <section style={{ minWidth: 0 }}>
              {/* Search bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: "#F8FBFD",
                  border: "1px solid rgba(39,76,119,0.12)",
                  borderRadius: "12px",
                  padding: "11px 16px",
                  marginBottom: "24px",
                }}
              >
                <Search className="w-4 h-4 shrink-0" style={{ color: "rgba(39,76,119,0.38)" }} />
                <input
                  placeholder="Search discussions…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{
                    flex: 1,
                    outline: "none",
                    background: "transparent",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "14px",
                    color: "#274C77",
                    border: "none",
                  }}
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex" }}
                  >
                    <X className="w-4 h-4" style={{ color: "rgba(39,76,119,0.40)" }} />
                  </button>
                )}
              </div>

              {/* Result count */}
              {!loading && !error && (
                <div style={{ marginBottom: "18px" }}>
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "13px",
                      color: "rgba(39,76,119,0.50)",
                    }}
                  >
                    {filteredPosts.length === 0
                      ? "No posts found"
                      : `${filteredPosts.length} discussion${filteredPosts.length !== 1 ? "s" : ""}`}
                    {selectedCategory !== "ALL" && (
                      <span> in {CATEGORY_LABELS[selectedCategory]}</span>
                    )}
                  </p>
                </div>
              )}

              {/* ── Loading skeleton ─────────────────────────────────────── */}
              {loading && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse"
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid rgba(39,76,119,0.09)",
                        borderRadius: "16px",
                        padding: "24px 28px",
                      }}
                    >
                      <div style={{ height: "11px", borderRadius: "6px", background: "rgba(39,76,119,0.07)", width: "80px", marginBottom: "16px" }} />
                      <div style={{ height: "18px", borderRadius: "6px", background: "rgba(39,76,119,0.07)", width: "60%", marginBottom: "12px" }} />
                      <div style={{ height: "13px", borderRadius: "6px", background: "rgba(39,76,119,0.05)", width: "100%", marginBottom: "7px" }} />
                      <div style={{ height: "13px", borderRadius: "6px", background: "rgba(39,76,119,0.05)", width: "75%" }} />
                    </div>
                  ))}
                </div>
              )}

              {/* ── Error state ──────────────────────────────────────────── */}
              {!loading && error && (
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(39,76,119,0.09)",
                    borderRadius: "20px",
                    padding: "64px 40px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "14px",
                      background: "rgba(163,206,241,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                    }}
                  >
                    <AlertCircle className="w-6 h-6" style={{ color: "rgba(39,76,119,0.45)" }} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "20px",
                      fontWeight: 700,
                      letterSpacing: "-0.03em",
                      color: "#274C77",
                      margin: "0 0 8px",
                    }}
                  >
                    Couldn't load posts
                  </h3>
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", color: "rgba(39,76,119,0.55)", marginBottom: "24px" }}>
                    {error}
                  </p>
                  <RetryButton
                    onClick={() => {
                      setLoading(true);
                      setError(null);
                      const category = selectedCategory === "ALL" ? undefined : selectedCategory;
                      getPosts(category)
                        .then(setPosts)
                        .catch((err) => setError(err.message))
                        .finally(() => setLoading(false));
                    }}
                  />
                </div>
              )}

              {/* ── Empty state ──────────────────────────────────────────── */}
              {!loading && !error && filteredPosts.length === 0 && (
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(39,76,119,0.09)",
                    borderRadius: "20px",
                    padding: "64px 40px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "14px",
                      background: "#A3CEF1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                    }}
                  >
                    <MessageSquare className="w-6 h-6" style={{ color: "#274C77" }} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "22px",
                      fontWeight: 700,
                      letterSpacing: "-0.03em",
                      color: "#274C77",
                      margin: "0 0 8px",
                    }}
                  >
                    No discussions yet
                  </h3>
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "14px",
                      color: "rgba(39,76,119,0.55)",
                      lineHeight: 1.70,
                      maxWidth: "320px",
                      margin: "0 auto 24px",
                    }}
                  >
                    {query
                      ? "No posts match your search. Try different keywords."
                      : "Be the first to start a conversation in this space."}
                  </p>
                  <StartButton onClick={() => navigate("/forum/create")} />
                </div>
              )}

              {/* ── Post list ────────────────────────────────────────────── */}
              {!loading && !error && filteredPosts.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {filteredPosts.map((post) => {
                    const accentColor = CATEGORY_ACCENTS[post.category as CategoryFilter] ?? "#6096BA";
                    const pillBg = CATEGORY_PILL_BG[post.category as CategoryFilter] ?? "rgba(96,150,186,0.15)";
                    const isHovered = hoveredPost === post.id;

                    return (
                      <PostCard
                        key={post.id}
                        post={post}
                        accentColor={accentColor}
                        pillBg={pillBg}
                        isHovered={isHovered}
                        isFlagged={flaggedPosts.has(post.id)}
                        onMouseEnter={() => setHoveredPost(post.id)}
                        onMouseLeave={() => setHoveredPost(null)}
                        onClick={() => navigate(`/forum/${post.id}`)}
                        onFlag={(e) => handleFlag(e, post.id)}
                      />
                    );
                  })}
                </div>
              )}
            </section>

            {/* ── Right sidebar ───────────────────────────────────────────── */}
            <aside style={{ position: "sticky", top: "88px", display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Anonymous report CTA — dark card */}
              <div
                style={{
                  background: "#274C77",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "18px",
                  padding: "24px",
                }}
              >
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(231,236,239,0.50)",
                    margin: "0 0 6px",
                  }}
                >
                  Need urgent help?
                </p>
                <h3
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.25,
                    color: "#E7ECEF",
                    margin: "0 0 12px",
                  }}
                >
                  Submit an anonymous report
                </h3>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "13px",
                    lineHeight: 1.65,
                    color: "rgba(231,236,239,0.58)",
                    margin: "0 0 20px",
                  }}
                >
                  If you feel unsafe or need urgent support, a confidential report goes directly to trained counselors.
                </p>
                <button
                  onClick={() => navigate("/report")}
                  onMouseEnter={() => setReportHovered(true)}
                  onMouseLeave={() => setReportHovered(false)}
                  style={{
                    width: "100%",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#274C77",
                    backgroundColor: reportHovered ? "#A3CEF1" : "#6096BA",
                    border: "none",
                    borderRadius: "6px",
                    padding: "11px 0",
                    cursor: "pointer",
                    transition: "background-color 0.18s",
                  }}
                >
                  Report anonymously
                </button>
              </div>

              {/* Community guidelines */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(39,76,119,0.10)",
                  borderRadius: "18px",
                  padding: "24px",
                  boxShadow: "0 2px 12px rgba(39,76,119,0.05)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <Shield className="w-4 h-4" style={{ color: "#6096BA" }} />
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#274C77",
                      margin: 0,
                    }}
                  >
                    Community guidelines
                  </p>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    "Be respectful and kind",
                    "No personal attacks",
                    "Protect your identity",
                    "Flag harmful content",
                  ].map((rule) => (
                    <li
                      key={rule}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "13px",
                        color: "rgba(39,76,119,0.65)",
                        lineHeight: 1.60,
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          marginTop: "7px",
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "#6096BA",
                          display: "inline-block",
                        }}
                      />
                      {rule}
                    </li>
                  ))}
                </ul>

                <div
                  style={{
                    marginTop: "18px",
                    paddingTop: "16px",
                    borderTop: "1px solid rgba(39,76,119,0.08)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "12px",
                      color: "rgba(39,76,119,0.42)",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    Harmful language or personal attacks are reviewed and removed by our moderation team.
                  </p>
                </div>
              </div>

              {/* Anonymity note */}
              <div
                style={{
                  background: "rgba(163,206,241,0.18)",
                  border: "1px solid rgba(96,150,186,0.25)",
                  borderRadius: "14px",
                  padding: "16px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <AlertCircle className="w-4 h-4 shrink-0" style={{ color: "#6096BA", marginTop: "2px" }} />
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "12px",
                    lineHeight: 1.65,
                    color: "rgba(39,76,119,0.62)",
                    margin: 0,
                  }}
                >
                  You can post under a nickname. Your real identity is never shared with other students.
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

// ── Post card component ────────────────────────────────────────────────────

function PostCard({
  post,
  accentColor,
  pillBg,
  isHovered,
  isFlagged,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onFlag,
}: {
  post: ForumPostResponse;
  accentColor: string;
  pillBg: string;
  isHovered: boolean;
  isFlagged: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onFlag: (e: React.MouseEvent) => void;
}) {
  const [flagHovered, setFlagHovered] = useState(false);

  return (
    <article
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        background: "#FFFFFF",
        border: `1px solid ${isHovered ? "#6096BA" : "rgba(39,76,119,0.09)"}`,
        borderRadius: "16px",
        cursor: "pointer",
        transition: "all 0.18s ease",
        overflow: "hidden",
        position: "relative",
        boxShadow: isHovered
          ? "0 8px 32px rgba(39,76,119,0.12)"
          : "0 1px 4px rgba(39,76,119,0.04)",
        transform: isHovered ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      {/* Left accent stripe */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "3px",
          backgroundColor: accentColor,
        }}
      />

      <div style={{ padding: "20px 24px 20px 28px" }}>
        {/* Top row: category pill + flag */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <span
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              padding: "3px 9px",
              borderRadius: "4px",
              backgroundColor: pillBg,
              color: "#274C77",
            }}
          >
            {(CATEGORY_LABELS[post.category as CategoryFilter] ?? post.category)}
          </span>

          <button
            onClick={onFlag}
            title="Report this post"
            onMouseEnter={() => setFlagHovered(true)}
            onMouseLeave={() => setFlagHovered(false)}
            style={{
              padding: "6px",
              borderRadius: "6px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: isFlagged
                ? "#6096BA"
                : flagHovered
                ? "rgba(39,76,119,0.55)"
                : "rgba(39,76,119,0.22)",
              transition: "color 0.15s",
            }}
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.30,
            color: "#274C77",
            margin: "0 0 8px",
          }}
        >
          {post.title}
        </h3>

        {/* Preview */}
        {post.preview && (
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "14px",
              lineHeight: 1.65,
              color: "rgba(39,76,119,0.58)",
              margin: "0 0 16px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as const,
              overflow: "hidden",
            }}
          >
            {post.preview}
          </p>
        )}

        {/* Footer: author + comment count */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "14px",
            borderTop: "1px solid rgba(39,76,119,0.07)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
  <span
    style={{
      fontFamily: "DM Sans, sans-serif",
      fontSize: "13px",
      color: "rgba(39,76,119,0.52)",
    }}
  >
    {post.author ?? "Anonymous"}
  </span>
</div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: "rgba(39,76,119,0.42)" }}>
            <MessageSquare className="w-3.5 h-3.5" />
            {post.commentCount}
          </div>
        </div>
      </div>
    </article>
  );
}

// ── Small button helpers ───────────────────────────────────────────────────

function RetryButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "DM Sans, sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        color: "#E7ECEF",
        background: hovered ? "#6096BA" : "#274C77",
        border: "none",
        borderRadius: "6px",
        padding: "10px 22px",
        cursor: "pointer",
        transition: "background 0.18s",
      }}
    >
      Try again
    </button>
  );
}

function StartButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "DM Sans, sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        color: "#E7ECEF",
        background: hovered ? "#6096BA" : "#274C77",
        border: "none",
        borderRadius: "6px",
        padding: "11px 24px",
        cursor: "pointer",
        transition: "background 0.18s",
      }}
    >
      Start a discussion →
    </button>
  );
}