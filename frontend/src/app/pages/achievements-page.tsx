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

const ACHIEVEMENT_META: AchievementMeta[] = [
  // ── Forum Posts ────────────────────────────────────────────────────────────
  {
    id: "FIRST_VOICE",
    title: "First Voice",
    description: "Published your first forum post.",
    requirement: "1 post",
    category: "Forum Posts",
    icon: <MessageSquare className="w-5 h-5 text-emerald-600" />,
  },
  {
    id: "RISING_VOICE",
    title: "Rising Voice",
    description: "Growing presence in the forum.",
    requirement: "5 posts",
    category: "Forum Posts",
    icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
  },
  {
    id: "ACTIVE_VOICE",
    title: "Active Voice",
    description: "A regular contributor to forum discussions.",
    requirement: "10 posts",
    category: "Forum Posts",
    icon: <Flame className="w-5 h-5 text-emerald-600" />,
  },
  {
    id: "FORUM_REGULAR",
    title: "Forum Regular",
    description: "A familiar face in the community forum.",
    requirement: "25 posts",
    category: "Forum Posts",
    icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
  },
  {
    id: "PROLIFIC_POSTER",
    title: "Prolific Poster",
    description: "Your posts shape the conversations here.",
    requirement: "50 posts",
    category: "Forum Posts",
    icon: <Crown className="w-5 h-5 text-emerald-600" />,
  },

  // ── Comments ───────────────────────────────────────────────────────────────
  {
    id: "FIRST_REPLY",
    title: "First Reply",
    description: "Left your first supportive comment.",
    requirement: "1 comment",
    category: "Comments",
    icon: <MessageSquare className="w-5 h-5 text-blue-600" />,
  },
  {
    id: "SUPPORTIVE_FRIEND",
    title: "Supportive Friend",
    description: "Actively supporting others in the forum.",
    requirement: "5 comments",
    category: "Comments",
    icon: <Heart className="w-5 h-5 text-blue-600" />,
  },
  {
    id: "COMMUNITY_HELPER",
    title: "Community Helper",
    description: "Consistently helping members through comments.",
    requirement: "10 comments",
    category: "Comments",
    icon: <Users className="w-5 h-5 text-blue-600" />,
  },
  {
    id: "COMMUNITY_CHAMPION",
    title: "Community Champion",
    description: "A champion of peer support in discussions.",
    requirement: "25 comments",
    category: "Comments",
    icon: <Star className="w-5 h-5 text-blue-600" />,
  },
  {
    id: "REPLY_MASTER",
    title: "Reply Master",
    description: "Mastered the art of thoughtful replies.",
    requirement: "50 comments",
    category: "Comments",
    icon: <Award className="w-5 h-5 text-blue-600" />,
  },
  {
    id: "COMMENT_LEGEND",
    title: "Comment Legend",
    description: "A legendary voice of support in the community.",
    requirement: "100 comments",
    category: "Comments",
    icon: <Trophy className="w-5 h-5 text-blue-600" />,
  },

  // ── Combined contributions ─────────────────────────────────────────────────
  {
    id: "TRUSTED_MEMBER",
    title: "Trusted Member",
    description: "Consistent participation across posts and comments.",
    requirement: "5 total contributions",
    category: "Contributions",
    icon: <BadgeCheck className="w-5 h-5 text-violet-600" />,
  },
  {
    id: "DEDICATED_MEMBER",
    title: "Dedicated Member",
    description: "Your dedication to this community is clear.",
    requirement: "20 total contributions",
    category: "Contributions",
    icon: <Medal className="w-5 h-5 text-violet-600" />,
  },
  {
    id: "PLATFORM_PILLAR",
    title: "Platform Pillar",
    description: "A pillar that holds this community together.",
    requirement: "50 total contributions",
    category: "Contributions",
    icon: <Layers className="w-5 h-5 text-violet-600" />,
  },
  {
    id: "COMMUNITY_LEGEND",
    title: "Community Legend",
    description: "A true legend of this platform.",
    requirement: "100 total contributions",
    category: "Contributions",
    icon: <Crown className="w-5 h-5 text-violet-600" />,
  },

  // ── Likes given ────────────────────────────────────────────────────────────
  {
    id: "FIRST_LIKE",
    title: "First Like",
    description: "Liked your first post — spreading positivity!",
    requirement: "1 like given",
    category: "Likes",
    icon: <ThumbsUp className="w-5 h-5 text-amber-600" />,
  },
  {
    id: "SPREADING_SUPPORT",
    title: "Spreading Support",
    description: "Generously supporting posts you find helpful.",
    requirement: "10 likes given",
    category: "Likes",
    icon: <Heart className="w-5 h-5 text-amber-600" />,
  },
  {
    id: "LIKE_ENTHUSIAST",
    title: "Like Enthusiast",
    description: "An enthusiast for positive reinforcement.",
    requirement: "25 likes given",
    category: "Likes",
    icon: <Zap className="w-5 h-5 text-amber-600" />,
  },
  {
    id: "POSITIVITY_ENGINE",
    title: "Positivity Engine",
    description: "You fuel this community with positivity.",
    requirement: "50 likes given",
    category: "Likes",
    icon: <Star className="w-5 h-5 text-amber-600" />,
  },

  // ── Reports ────────────────────────────────────────────────────────────────
  {
    id: "SAFETY_ADVOCATE",
    title: "Safety Advocate",
    description: "Helping keep this space safe for everyone.",
    requirement: "1 report submitted",
    category: "Reports",
    icon: <ShieldCheck className="w-5 h-5 text-red-600" />,
  },
  {
    id: "GUARDIAN",
    title: "Guardian",
    description: "A guardian of community wellbeing.",
    requirement: "3 reports submitted",
    category: "Reports",
    icon: <ShieldCheck className="w-5 h-5 text-red-600" />,
  },
  {
    id: "COMMUNITY_GUARDIAN",
    title: "Community Guardian",
    description: "Dedicated to making this platform a safe place.",
    requirement: "10 reports submitted",
    category: "Reports",
    icon: <BadgeCheck className="w-5 h-5 text-red-600" />,
  },

  // ── Tenure ─────────────────────────────────────────────────────────────────
  {
    id: "NEWCOMER",
    title: "Newcomer",
    description: "Your journey on this platform has begun.",
    requirement: "Account created",
    category: "Tenure",
    icon: <UserCheck className="w-5 h-5 text-gray-600" />,
  },
  {
    id: "ONE_WEEK_STRONG",
    title: "One Week Strong",
    description: "You've been here a full week — great start!",
    requirement: "7 days as a member",
    category: "Tenure",
    icon: <Calendar className="w-5 h-5 text-gray-600" />,
  },
  {
    id: "ONE_MONTH_MEMBER",
    title: "One Month Member",
    description: "A whole month — you're here to stay.",
    requirement: "30 days as a member",
    category: "Tenure",
    icon: <Clock className="w-5 h-5 text-gray-600" />,
  },
  {
    id: "QUARTER_YEAR",
    title: "Quarter Year",
    description: "Three months of commitment to this community.",
    requirement: "90 days as a member",
    category: "Tenure",
    icon: <BarChart2 className="w-5 h-5 text-gray-600" />,
  },
  {
    id: "HALF_YEAR",
    title: "Half Year",
    description: "Six months — halfway to your first anniversary!",
    requirement: "180 days as a member",
    category: "Tenure",
    icon: <TrendingUp className="w-5 h-5 text-gray-600" />,
  },
  {
    id: "ONE_YEAR_ANNIVERSARY",
    title: "One Year Anniversary",
    description: "One full year on the platform. Happy anniversary!",
    requirement: "365 days as a member",
    category: "Tenure",
    icon: <Trophy className="w-5 h-5 text-yellow-600" />,
  },

  // ── Profile ────────────────────────────────────────────────────────────────
  {
    id: "PROFILE_STARTER",
    title: "Profile Starter",
    description: "Set up your display name to be known in the community.",
    requirement: "Display name set",
    category: "Profile",
    icon: <UserCheck className="w-5 h-5 text-teal-600" />,
  },

  // ── Combo ──────────────────────────────────────────────────────────────────
  {
    id: "FULLY_PRESENT",
    title: "Fully Present",
    description: "You've posted, commented, and reported. Fully engaged!",
    requirement: "1 post + 1 comment + 1 report",
    category: "Combo",
    icon: <Layers className="w-5 h-5 text-indigo-600" />,
  },
  {
    id: "CONVERSATION_STARTER",
    title: "Conversation Starter",
    description: "You start and join conversations with ease.",
    requirement: "3 posts + 3 comments",
    category: "Combo",
    icon: <MessageSquare className="w-5 h-5 text-indigo-600" />,
  },
  {
    id: "TRIPLE_THREAT",
    title: "Triple Threat",
    description: "Active in posts, comments, and safety reports.",
    requirement: "5 posts + 5 comments + 1 report",
    category: "Combo",
    icon: <Zap className="w-5 h-5 text-indigo-600" />,
  },
  {
    id: "VOICE_OF_REASON",
    title: "Voice of Reason",
    description: "A thoughtful presence across discussions.",
    requirement: "10 posts + 20 comments",
    category: "Combo",
    icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
  },
  {
    id: "ALL_ROUNDER",
    title: "All-Rounder",
    description: "Mastery across every area of the platform.",
    requirement: "10 posts + 10 comments + 3 reports + 10 likes",
    category: "Combo",
    icon: <Award className="w-5 h-5 text-indigo-600" />,
  },
  {
    id: "SUPER_CONTRIBUTOR",
    title: "Super Contributor",
    description: "A super contributor in both posts and comments.",
    requirement: "25 posts + 25 comments",
    category: "Combo",
    icon: <Star className="w-5 h-5 text-indigo-600" />,
  },
  {
    id: "TOP_CONTRIBUTOR",
    title: "Top Contributor",
    description: "At the very top of this community.",
    requirement: "50 posts + 50 comments",
    category: "Combo",
    icon: <Crown className="w-5 h-5 text-indigo-600" />,
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

const CATEGORY_COLORS: Record<AchievementCategory, string> = {
  "Forum Posts": "bg-emerald-50 text-emerald-700",
  Comments: "bg-blue-50 text-blue-700",
  Contributions: "bg-violet-50 text-violet-700",
  Likes: "bg-amber-50 text-amber-700",
  Reports: "bg-red-50 text-red-700",
  Tenure: "bg-gray-100 text-gray-700",
  Profile: "bg-teal-50 text-teal-700",
  Combo: "bg-indigo-50 text-indigo-700",
};

function formatDate(isoString: string) {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function AchievementsPage() {
  const [data, setData] = useState<AchievementResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    AchievementCategory | "All"
  >("All");

  useEffect(() => {
    getAchievements()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Merge API data with static meta
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

  const categoryCounts = CATEGORY_ORDER.reduce(
    (acc, cat) => {
      acc[cat] = achievements.filter(
        (a) => a.category === cat && a.earned
      ).length;
      return acc;
    },
    {} as Record<AchievementCategory, number>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-3">Achievements</h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Your positive actions and community participation are recognized
              through achievements and badges.
            </p>
          </div>

          {/* Progress section */}
          <div className="border rounded-xl p-8 mb-10 bg-gray-50">
            <div className="flex items-end justify-between mb-3">
              <h2 className="text-xl font-semibold">Your progress</h2>
              {!loading && !error && (
                <span className="text-sm text-gray-500">
                  {earnedCount} / {total} unlocked
                </span>
              )}
            </div>

            {loading ? (
              <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mb-4" />
            ) : error ? (
              <p className="text-red-600 text-sm mb-4">{error}</p>
            ) : (
              <p className="text-gray-600 mb-4">
                You unlocked{" "}
                <span className="font-semibold">{earnedCount}</span> out of{" "}
                <span className="font-semibold">{total}</span> achievements.
              </p>
            )}

            <div className="w-full bg-gray-200 h-3 rounded-full">
              <div
                className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: loading ? "0%" : `${(earnedCount / total) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Category sidebar */}
            <aside className="col-span-3">
              <div className="border rounded-xl p-6 sticky top-8">
                <h2 className="font-semibold mb-4">Category</h2>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className={`flex w-full items-center justify-between px-4 py-3 rounded-md text-sm ${
                      selectedCategory === "All"
                        ? "bg-emerald-50 text-emerald-700"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span>All</span>
                    <span className="text-xs text-gray-500">
                      {earnedCount}/{total}
                    </span>
                  </button>

                  {CATEGORY_ORDER.map((cat) => {
                    const total_in_cat = achievements.filter(
                      (a) => a.category === cat
                    ).length;
                    const earned_in_cat = categoryCounts[cat];
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`flex w-full items-center justify-between px-4 py-3 rounded-md text-sm ${
                          selectedCategory === cat
                            ? "bg-emerald-50 text-emerald-700"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span>{cat}</span>
                        <span className="text-xs text-gray-500">
                          {earned_in_cat}/{total_in_cat}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Achievements grid */}
            <section className="col-span-9">
              {loading ? (
                <div className="grid grid-cols-3 gap-6">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border rounded-xl p-6 animate-pulse">
                      <div className="w-12 h-12 rounded-full bg-gray-200 mb-4" />
                      <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-full mb-1" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6">
                  {filtered.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`border rounded-xl p-6 transition-all ${
                        achievement.earned
                          ? "bg-white hover:shadow-md"
                          : "bg-gray-50 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            achievement.earned ? "bg-gray-100" : "bg-gray-200"
                          }`}
                        >
                          {achievement.icon}
                        </div>
                        {achievement.earned && (
                          <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
                            Earned
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-semibold mb-1">
                        {achievement.title}
                      </h3>

                      <p className="text-sm text-gray-600 leading-5 mb-3">
                        {achievement.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            CATEGORY_COLORS[achievement.category]
                          }`}
                        >
                          {achievement.category}
                        </span>

                        <span className="text-xs text-gray-400">
                          {achievement.requirement}
                        </span>
                      </div>

                      {achievement.earned && achievement.earnedAt && (
                        <div className="mt-3 pt-3 border-t text-xs text-gray-400">
                          Earned {formatDate(achievement.earnedAt)}
                        </div>
                      )}
                    </div>
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