import { Footer } from "../components/footer";
import { Header } from "../components/header";
import {
  Trophy,
  MessageSquare,
  ShieldCheck,
  Medal,
  Star,
  Users,
  Heart,
  Flame,
  Clock,
  UserCheck,
  BookOpen,
  Layers,
  TrendingUp,
  Award,
  Zap,
  ThumbsUp,
  BadgeCheck,
  BarChart2,
  Calendar,
  Crown,
  Lock,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getAchievements,
  type AchievementResponse,
} from "../api/achievements-api";

type AchievementCategory =
  | "Forum Posts"
  | "Comments"
  | "Contributions"
  | "Likes"
  | "Reports"
  | "Tenure"
  | "Profile"
  | "Combo";

type AchievementMeta = {
  id: string;
  title: string;
  description: string;
  requirement: string;
  category: AchievementCategory;
  icon: JSX.Element;
};

// ── Category accent colors using the new SafeSpace palette ─────────────────
const CATEGORY_ACCENT: Record<AchievementCategory, { bg: string; text: string; iconBg: string }> = {
  "Forum Posts":  { bg: "rgba(136,187,214,0.18)", text: "#274C77",       iconBg: "rgba(136,187,214,0.30)" },
  Comments:       { bg: "rgba(153,211,223,0.18)", text: "#274C77",       iconBg: "rgba(153,211,223,0.35)" },
  Contributions:  { bg: "rgba(136,187,214,0.22)", text: "#274C77",       iconBg: "rgba(136,187,214,0.35)" },
  Likes:          { bg: "rgba(153,211,223,0.22)", text: "#274C77",       iconBg: "rgba(153,211,223,0.40)" },
  Reports:        { bg: "rgba(205,205,205,0.30)", text: "#274C77",       iconBg: "rgba(205,205,205,0.50)" },
  Tenure:         { bg: "rgba(205,205,205,0.25)", text: "#274C77",       iconBg: "rgba(205,205,205,0.45)" },
  Profile:        { bg: "rgba(153,211,223,0.15)", text: "#274C77",       iconBg: "rgba(153,211,223,0.28)" },
  Combo:          { bg: "rgba(136,187,214,0.15)", text: "#274C77",       iconBg: "rgba(136,187,214,0.28)" },
};

const ACHIEVEMENT_META: AchievementMeta[] = [
  // ── Forum Posts ────────────────────────────────────────────────────────────
  {
    id: "FIRST_VOICE",
    title: "First Voice",
    description: "Published your first forum post.",
    requirement: "1 post",
    category: "Forum Posts",
    icon: <MessageSquare className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "RISING_VOICE",
    title: "Rising Voice",
    description: "Growing presence in the forum.",
    requirement: "5 posts",
    category: "Forum Posts",
    icon: <TrendingUp className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "ACTIVE_VOICE",
    title: "Active Voice",
    description: "A regular contributor to forum discussions.",
    requirement: "10 posts",
    category: "Forum Posts",
    icon: <Flame className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "FORUM_REGULAR",
    title: "Forum Regular",
    description: "A familiar face in the community forum.",
    requirement: "25 posts",
    category: "Forum Posts",
    icon: <BookOpen className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "PROLIFIC_POSTER",
    title: "Prolific Poster",
    description: "Your posts shape the conversations here.",
    requirement: "50 posts",
    category: "Forum Posts",
    icon: <Crown className="w-5 h-5" style={{ color: "#274C77" }} />,
  },

  // ── Comments ───────────────────────────────────────────────────────────────
  {
    id: "FIRST_REPLY",
    title: "First Reply",
    description: "Left your first supportive comment.",
    requirement: "1 comment",
    category: "Comments",
    icon: <MessageSquare className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "SUPPORTIVE_FRIEND",
    title: "Supportive Friend",
    description: "Actively supporting others in the forum.",
    requirement: "5 comments",
    category: "Comments",
    icon: <Heart className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "COMMUNITY_HELPER",
    title: "Community Helper",
    description: "Consistently helping members through comments.",
    requirement: "10 comments",
    category: "Comments",
    icon: <Users className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "COMMUNITY_CHAMPION",
    title: "Community Champion",
    description: "A champion of peer support in discussions.",
    requirement: "25 comments",
    category: "Comments",
    icon: <Star className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "REPLY_MASTER",
    title: "Reply Master",
    description: "Mastered the art of thoughtful replies.",
    requirement: "50 comments",
    category: "Comments",
    icon: <Award className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "COMMENT_LEGEND",
    title: "Comment Legend",
    description: "A legendary voice of support in the community.",
    requirement: "100 comments",
    category: "Comments",
    icon: <Trophy className="w-5 h-5" style={{ color: "#274C77" }} />,
  },

  // ── Combined contributions ─────────────────────────────────────────────────
  {
    id: "TRUSTED_MEMBER",
    title: "Trusted Member",
    description: "Consistent participation across posts and comments.",
    requirement: "5 total contributions",
    category: "Contributions",
    icon: <BadgeCheck className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "DEDICATED_MEMBER",
    title: "Dedicated Member",
    description: "Your dedication to this community is clear.",
    requirement: "20 total contributions",
    category: "Contributions",
    icon: <Medal className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "PLATFORM_PILLAR",
    title: "Platform Pillar",
    description: "A pillar that holds this community together.",
    requirement: "50 total contributions",
    category: "Contributions",
    icon: <Layers className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "COMMUNITY_LEGEND",
    title: "Community Legend",
    description: "A true legend of this platform.",
    requirement: "100 total contributions",
    category: "Contributions",
    icon: <Crown className="w-5 h-5" style={{ color: "#274C77" }} />,
  },

  // ── Likes given ────────────────────────────────────────────────────────────
  {
    id: "FIRST_LIKE",
    title: "First Like",
    description: "Liked your first post — spreading positivity!",
    requirement: "1 like given",
    category: "Likes",
    icon: <ThumbsUp className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "SPREADING_SUPPORT",
    title: "Spreading Support",
    description: "Generously supporting posts you find helpful.",
    requirement: "10 likes given",
    category: "Likes",
    icon: <Heart className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "LIKE_ENTHUSIAST",
    title: "Like Enthusiast",
    description: "An enthusiast for positive reinforcement.",
    requirement: "25 likes given",
    category: "Likes",
    icon: <Zap className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "POSITIVITY_ENGINE",
    title: "Positivity Engine",
    description: "You fuel this community with positivity.",
    requirement: "50 likes given",
    category: "Likes",
    icon: <Star className="w-5 h-5" style={{ color: "#274C77" }} />,
  },

  // ── Reports ────────────────────────────────────────────────────────────────
  {
    id: "SAFETY_ADVOCATE",
    title: "Safety Advocate",
    description: "Helping keep this space safe for everyone.",
    requirement: "1 report submitted",
    category: "Reports",
    icon: <ShieldCheck className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "GUARDIAN",
    title: "Guardian",
    description: "A guardian of community wellbeing.",
    requirement: "3 reports submitted",
    category: "Reports",
    icon: <ShieldCheck className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "COMMUNITY_GUARDIAN",
    title: "Community Guardian",
    description: "Dedicated to making this platform a safe place.",
    requirement: "10 reports submitted",
    category: "Reports",
    icon: <BadgeCheck className="w-5 h-5" style={{ color: "#274C77" }} />,
  },

  // ── Tenure ─────────────────────────────────────────────────────────────────
  {
    id: "NEWCOMER",
    title: "Newcomer",
    description: "Your journey on this platform has begun.",
    requirement: "Account created",
    category: "Tenure",
    icon: <UserCheck className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "ONE_WEEK_STRONG",
    title: "One Week Strong",
    description: "You've been here a full week — great start!",
    requirement: "7 days as a member",
    category: "Tenure",
    icon: <Calendar className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "ONE_MONTH_MEMBER",
    title: "One Month Member",
    description: "A whole month — you're here to stay.",
    requirement: "30 days as a member",
    category: "Tenure",
    icon: <Clock className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "QUARTER_YEAR",
    title: "Quarter Year",
    description: "Three months of commitment to this community.",
    requirement: "90 days as a member",
    category: "Tenure",
    icon: <BarChart2 className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "HALF_YEAR",
    title: "Half Year",
    description: "Six months — halfway to your first anniversary!",
    requirement: "180 days as a member",
    category: "Tenure",
    icon: <TrendingUp className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "ONE_YEAR_ANNIVERSARY",
    title: "One Year Anniversary",
    description: "One full year on the platform. Happy anniversary!",
    requirement: "365 days as a member",
    category: "Tenure",
    icon: <Trophy className="w-5 h-5" style={{ color: "#6096BA" }} />,
  },

  // ── Profile ────────────────────────────────────────────────────────────────
  {
    id: "PROFILE_STARTER",
    title: "Profile Starter",
    description: "Set up your display name to be known in the community.",
    requirement: "Display name set",
    category: "Profile",
    icon: <UserCheck className="w-5 h-5" style={{ color: "#274C77" }} />,
  },

  // ── Combo ──────────────────────────────────────────────────────────────────
  {
    id: "FULLY_PRESENT",
    title: "Fully Present",
    description: "You've posted, commented, and reported. Fully engaged!",
    requirement: "1 post + 1 comment + 1 report",
    category: "Combo",
    icon: <Layers className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "CONVERSATION_STARTER",
    title: "Conversation Starter",
    description: "You start and join conversations with ease.",
    requirement: "3 posts + 3 comments",
    category: "Combo",
    icon: <MessageSquare className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "TRIPLE_THREAT",
    title: "Triple Threat",
    description: "Active in posts, comments, and safety reports.",
    requirement: "5 posts + 5 comments + 1 report",
    category: "Combo",
    icon: <Zap className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "VOICE_OF_REASON",
    title: "Voice of Reason",
    description: "A thoughtful presence across discussions.",
    requirement: "10 posts + 20 comments",
    category: "Combo",
    icon: <BookOpen className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "ALL_ROUNDER",
    title: "All-Rounder",
    description: "Mastery across every area of the platform.",
    requirement: "10 posts + 10 comments + 3 reports + 10 likes",
    category: "Combo",
    icon: <Award className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "SUPER_CONTRIBUTOR",
    title: "Super Contributor",
    description: "A super contributor in both posts and comments.",
    requirement: "25 posts + 25 comments",
    category: "Combo",
    icon: <Star className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
  {
    id: "TOP_CONTRIBUTOR",
    title: "Top Contributor",
    description: "At the very top of this community.",
    requirement: "50 posts + 50 comments",
    category: "Combo",
    icon: <Crown className="w-5 h-5" style={{ color: "#274C77" }} />,
  },
];

const CATEGORY_ORDER: AchievementCategory[] = [
  "Forum Posts",
  "Comments",
  "Contributions",
  "Likes",
  "Reports",
  "Tenure",
  "Profile",
  "Combo",
];

function formatDate(isoString: string) {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ── AchievementCard component ──────────────────────────────────────────────
function AchievementCard({
  achievement,
}: {
  achievement: AchievementMeta & { earned: boolean; earnedAt: string | null };
}) {
  const [hovered, setHovered] = useState(false);
  const accent = CATEGORY_ACCENT[achievement.category];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: achievement.earned ? "#FFFFFF" : "rgba(233,233,233,0.6)",
        border: `1px solid ${achievement.earned ? "rgba(136,187,214,0.25)" : "rgba(205,205,205,0.5)"}`,
        borderRadius: "16px",
        padding: "24px",
        transition: "all 0.2s ease",
        opacity: achievement.earned ? 1 : 0.65,
        transform: hovered && achievement.earned ? "translateY(-2px)" : "translateY(0)",
        boxShadow:
          hovered && achievement.earned
            ? "0 12px 40px rgba(36,76,90,0.10)"
            : achievement.earned
            ? "0 2px 12px rgba(36,76,90,0.06)"
            : "none",
        position: "relative" as const,
        overflow: "hidden" as const,
      }}
    >
      {/* Top accent strip for earned */}
      {achievement.earned && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #A3CEF1, #6096BA)",
          }}
        />
      )}

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
        {/* Icon */}
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: achievement.earned ? accent.iconBg : "rgba(205,205,205,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {achievement.earned ? (
            achievement.icon
          ) : (
            <Lock className="w-4 h-4" style={{ color: "rgba(36,76,90,0.35)" }} />
          )}
        </div>

        {/* Earned badge */}
        {achievement.earned ? (
          <span
            style={{
              fontSize: "11px",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: "#274C77",
              background: "rgba(153,211,223,0.35)",
              border: "1px solid rgba(136,187,214,0.3)",
              borderRadius: "20px",
              padding: "3px 10px",
            }}
          >
            Earned
          </span>
        ) : (
          <span
            style={{
              fontSize: "11px",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 600,
              color: "rgba(36,76,90,0.40)",
              background: "rgba(205,205,205,0.35)",
              border: "1px solid rgba(205,205,205,0.5)",
              borderRadius: "20px",
              padding: "3px 10px",
            }}
          >
            Locked
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "DM Serif Display, serif",
          fontSize: "18px",
          fontWeight: 400,
          letterSpacing: "-0.03em",
          color: achievement.earned ? "#274C77" : "rgba(36,76,90,0.50)",
          marginBottom: "6px",
          lineHeight: 1.2,
        }}
      >
        {achievement.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "13px",
          lineHeight: 1.65,
          color: achievement.earned ? "rgba(36,76,90,0.65)" : "rgba(36,76,90,0.38)",
          marginBottom: "16px",
        }}
      >
        {achievement.description}
      </p>

      {/* Footer row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Category pill */}
        <span
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            color: achievement.earned ? "#274C77" : "rgba(36,76,90,0.40)",
            background: achievement.earned ? accent.bg : "rgba(205,205,205,0.25)",
            borderRadius: "6px",
            padding: "3px 8px",
          }}
        >
          {achievement.category}
        </span>

        {/* Requirement */}
        <span
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "12px",
            color: "rgba(36,76,90,0.40)",
          }}
        >
          {achievement.requirement}
        </span>
      </div>

      {/* Earned date */}
      {achievement.earned && achievement.earnedAt && (
        <div
          style={{
            marginTop: "14px",
            paddingTop: "14px",
            borderTop: "1px solid rgba(205,205,205,0.6)",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "12px",
            color: "rgba(36,76,90,0.45)",
          }}
        >
          Earned {formatDate(achievement.earnedAt)}
        </div>
      )}
    </div>
  );
}

export function AchievementsPage() {
  const [data, setData] = useState<AchievementResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | "All">("All");

  useEffect(() => {
    getAchievements()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Merge API data with static meta — logic untouched
  const achievements = ACHIEVEMENT_META.map((meta) => {
    const apiData = data.find((d) => d.id === meta.id);
    return {
      ...meta,
      earned: apiData?.earned ?? false,
      earnedAt: apiData?.earnedAt ?? null,
    };
  });

  const filtered =
    selectedCategory === "All"
      ? achievements
      : achievements.filter((a) => a.category === selectedCategory);

  const earnedCount = achievements.filter((a) => a.earned).length;
  const total = achievements.length;
  const progressPct = total > 0 ? (earnedCount / total) * 100 : 0;

  const categoryCounts = CATEGORY_ORDER.reduce(
    (acc, cat) => {
      acc[cat] = achievements.filter((a) => a.category === cat && a.earned).length;
      return acc;
    },
    {} as Record<AchievementCategory, number>
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F9F7F3", fontFamily: "DM Sans, sans-serif", color: "#274C77" }}
    >
      <Header />

      {/* ── Hero strip ──────────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: "#A3CEF1",
          borderBottom: "1px solid rgba(36,76,90,0.12)",
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
            padding: "52px 56px 48px",
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
              color: "rgba(36,76,90,0.65)",
              marginBottom: "14px",
            }}
          >
            Your journey
          </p>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
            <div>
              <h1
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "clamp(40px, 5vw, 64px)",
                  fontWeight: 400,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  color: "#274C77",
                  margin: 0,
                  marginBottom: "14px",
                }}
              >
                Achievements
              </h1>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "16px",
                  lineHeight: 1.75,
                  letterSpacing: "-0.01em",
                  color: "rgba(36,76,90,0.68)",
                  maxWidth: "520px",
                  margin: 0,
                }}
              >
                Your positive actions and community participation are recognized through badges and milestones.
              </p>
            </div>

            {/* Quick stat pill */}
            {!loading && !error && (
              <div
                style={{
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(36,76,90,0.12)",
                  borderRadius: "16px",
                  padding: "18px 28px",
                  textAlign: "center",
                  backdropFilter: "blur(4px)",
                  flexShrink: 0,
                }}
              >
                <p
                  style={{
                    fontFamily: "DM Serif Display, serif",
                    fontSize: "42px",
                    fontWeight: 400,
                    letterSpacing: "-0.04em",
                    color: "#274C77",
                    lineHeight: 1,
                    margin: 0,
                  }}
                >
                  {earnedCount}
                  <span style={{ fontSize: "22px", color: "rgba(36,76,90,0.40)" }}>/{total}</span>
                </p>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "12px",
                    color: "rgba(36,76,90,0.55)",
                    marginTop: "4px",
                  }}
                >
                  badges unlocked
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <main style={{ flex: 1 }}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "40px 56px 64px",
          }}
        >
          {/* ── Progress card ──────────────────────────────────────────────── */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(136,187,214,0.20)",
              borderRadius: "20px",
              padding: "32px 36px",
              marginBottom: "32px",
              boxShadow: "0 4px 24px rgba(36,76,90,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <p
                  style={{
                    fontFamily: "DM Serif Display, serif",
                    fontSize: "22px",
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    color: "#274C77",
                    margin: 0,
                    marginBottom: "4px",
                  }}
                >
                  Overall progress
                </p>
                {!loading && !error && (
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", color: "rgba(36,76,90,0.55)", margin: 0 }}>
                    You've unlocked{" "}
                    <strong style={{ color: "#274C77" }}>{earnedCount}</strong>{" "}
                    out of <strong style={{ color: "#274C77" }}>{total}</strong> achievements
                  </p>
                )}
                {loading && (
                  <div style={{ height: "16px", width: "200px", background: "rgba(36,76,90,0.08)", borderRadius: "8px", marginTop: "4px" }} className="animate-pulse" />
                )}
                {error && (
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", color: "#c0392b", margin: 0 }}>{error}</p>
                )}
              </div>
              {!loading && !error && (
                <p
                  style={{
                    fontFamily: "DM Serif Display, serif",
                    fontSize: "28px",
                    fontWeight: 400,
                    letterSpacing: "-0.04em",
                    color: "#6096BA",
                    margin: 0,
                  }}
                >
                  {Math.round(progressPct)}%
                </p>
              )}
            </div>

            {/* Progress bar */}
            <div
              style={{
                width: "100%",
                height: "8px",
                background: "rgba(205,205,205,0.5)",
                borderRadius: "99px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: loading ? "0%" : `${progressPct}%`,
                  background: "linear-gradient(90deg, #A3CEF1, #6096BA)",
                  borderRadius: "99px",
                  transition: "width 0.6s ease",
                }}
              />
            </div>
          </div>

          {/* ── Main layout: sidebar + grid ────────────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "28px", alignItems: "start" }}>

            {/* ── Category sidebar ─────────────────────────────────────────── */}
            <aside>
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(136,187,214,0.18)",
                  borderRadius: "20px",
                  padding: "20px",
                  position: "sticky",
                  top: "88px",
                  boxShadow: "0 4px 24px rgba(36,76,90,0.06)",
                }}
              >
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(36,76,90,0.45)",
                    marginBottom: "12px",
                    paddingLeft: "12px",
                  }}
                >
                  Filter
                </p>

                {/* All button */}
                <SidebarButton
                  label="All"
                  count={`${earnedCount}/${total}`}
                  active={selectedCategory === "All"}
                  onClick={() => setSelectedCategory("All")}
                />

                <div style={{ height: "1px", background: "rgba(205,205,205,0.5)", margin: "10px 0" }} />

                {CATEGORY_ORDER.map((cat) => {
                  const totalInCat = achievements.filter((a) => a.category === cat).length;
                  const earnedInCat = categoryCounts[cat];
                  return (
                    <SidebarButton
                      key={cat}
                      label={cat}
                      count={`${earnedInCat}/${totalInCat}`}
                      active={selectedCategory === cat}
                      onClick={() => setSelectedCategory(cat)}
                    />
                  );
                })}
              </div>
            </aside>

            {/* ── Achievement grid ─────────────────────────────────────────── */}
            <section>
              {loading ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                  }}
                >
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse"
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid rgba(205,205,205,0.4)",
                        borderRadius: "16px",
                        padding: "24px",
                      }}
                    >
                      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(36,76,90,0.07)", marginBottom: "16px" }} />
                      <div style={{ height: "18px", background: "rgba(36,76,90,0.07)", borderRadius: "6px", width: "60%", marginBottom: "10px" }} />
                      <div style={{ height: "13px", background: "rgba(36,76,90,0.07)", borderRadius: "6px", width: "100%", marginBottom: "6px" }} />
                      <div style={{ height: "13px", background: "rgba(36,76,90,0.07)", borderRadius: "6px", width: "75%" }} />
                    </div>
                  ))}
                </div>
              ) : error ? (
                /* Error state */
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(205,205,205,0.5)",
                    borderRadius: "20px",
                    padding: "64px 40px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "16px",
                      background: "rgba(205,205,205,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                    }}
                  >
                    <Trophy className="w-6 h-6" style={{ color: "rgba(36,76,90,0.35)" }} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "DM Serif Display, serif",
                      fontSize: "22px",
                      fontWeight: 400,
                      color: "#274C77",
                      letterSpacing: "-0.03em",
                      marginBottom: "8px",
                    }}
                  >
                    Couldn't load achievements
                  </h3>
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", color: "rgba(36,76,90,0.55)", marginBottom: "24px" }}>
                    {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#FFFFFF",
                      background: "#6096BA",
                      border: "none",
                      borderRadius: "6px",
                      padding: "10px 24px",
                      cursor: "pointer",
                    }}
                  >
                    Try again
                  </button>
                </div>
              ) : filtered.length === 0 ? (
                /* Empty state */
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(205,205,205,0.5)",
                    borderRadius: "20px",
                    padding: "64px 40px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "16px",
                      background: "rgba(153,211,223,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                    }}
                  >
                    <Trophy className="w-6 h-6" style={{ color: "#6096BA" }} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "DM Serif Display, serif",
                      fontSize: "22px",
                      fontWeight: 400,
                      color: "#274C77",
                      letterSpacing: "-0.03em",
                      marginBottom: "8px",
                    }}
                  >
                    Nothing here yet
                  </h3>
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", color: "rgba(36,76,90,0.55)" }}>
                    Start participating in this category to earn your first badge.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                  }}
                >
                  {filtered.map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ── Small helper: sidebar filter button ───────────────────────────────────
function SidebarButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: string;
  active: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "9px 12px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        fontFamily: "DM Sans, sans-serif",
        fontSize: "13px",
        fontWeight: active ? 600 : 400,
        color: active ? "#274C77" : hovered ? "#274C77" : "rgba(36,76,90,0.60)",
        background: active
          ? "rgba(153,211,223,0.30)"
          : hovered
          ? "rgba(233,233,233,0.8)"
          : "transparent",
        transition: "all 0.15s ease",
        textAlign: "left" as const,
      }}
    >
      <span>{label}</span>
      <span
        style={{
          fontSize: "11px",
          color: active ? "rgba(36,76,90,0.65)" : "rgba(36,76,90,0.35)",
          fontWeight: 500,
        }}
      >
        {count}
      </span>
    </button>
  );
}