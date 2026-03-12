import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Trophy, MessageSquare, ShieldCheck, Medal, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getAchievements, type AchievementResponse } from "../api/achievements-api";

type AchievementId =
  | "FIRST_VOICE"
  | "COMMUNITY_HELPER"
  | "SAFETY_ADVOCATE"
  | "TRUSTED_MEMBER"
  | "COMMUNITY_CHAMPION"
  | "TOP_CONTRIBUTOR";

type AchievementMeta = {
  id: AchievementId;
  title: string;
  description: string;
  icon: JSX.Element;
};

const ACHIEVEMENT_META: AchievementMeta[] = [
  {
    id: "FIRST_VOICE",
    title: "First Voice",
    description: "Created your first discussion post in the support forum.",
    icon: <MessageSquare className="w-6 h-6 text-emerald-600" />,
  },
  {
    id: "COMMUNITY_HELPER",
    title: "Community Helper",
    description: "Posted supportive replies that helped other users.",
    icon: <Users className="w-6 h-6 text-blue-600" />,
  },
  {
    id: "SAFETY_ADVOCATE",
    title: "Safety Advocate",
    description: "Submitted a report that helped improve community safety.",
    icon: <ShieldCheck className="w-6 h-6 text-red-600" />,
  },
  {
    id: "TRUSTED_MEMBER",
    title: "Trusted Member",
    description: "Consistent positive participation in the platform.",
    icon: <Medal className="w-6 h-6 text-amber-600" />,
  },
  {
    id: "COMMUNITY_CHAMPION",
    title: "Community Champion",
    description: "Highly active member supporting multiple discussions.",
    icon: <Star className="w-6 h-6 text-purple-600" />,
  },
  {
    id: "TOP_CONTRIBUTOR",
    title: "Top Contributor",
    description: "Recognized for outstanding participation and support.",
    icon: <Trophy className="w-6 h-6 text-yellow-600" />,
  },
];

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

  useEffect(() => {
    getAchievements()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // merge API data with static meta
  const achievements = ACHIEVEMENT_META.map((meta) => {
    const apiData = data.find((d) => d.id === meta.id);
    return {
      ...meta,
      earned: apiData?.earned ?? false,
      earnedAt: apiData?.earnedAt ?? null,
    };
  });

  const earnedCount = achievements.filter((a) => a.earned).length;
  const total = achievements.length;

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
            <h2 className="text-xl font-semibold mb-3">Your progress</h2>

            {loading ? (
              <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mb-4" />
            ) : error ? (
              <p className="text-red-600 text-sm mb-4">{error}</p>
            ) : (
              <p className="text-gray-600 mb-4">
                You unlocked <span className="font-semibold">{earnedCount}</span>{" "}
                out of <span className="font-semibold">{total}</span> achievements.
              </p>
            )}

            <div className="w-full bg-gray-200 h-3 rounded-full">
              <div
                className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                style={{ width: loading ? "0%" : `${(earnedCount / total) * 100}%` }}
              />
            </div>
          </div>

          {/* Achievements grid */}
          {loading ? (
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border rounded-xl p-6 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mb-4" />
                  <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`border rounded-xl p-6 transition-all ${
                    achievement.earned ? "bg-white hover:shadow-md" : "bg-gray-50 opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      {achievement.icon}
                    </div>
                    {achievement.earned && (
                      <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
                        Earned
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{achievement.title}</h3>

                  <p className="text-sm text-gray-600 leading-6 mb-3">
                    {achievement.description}
                  </p>

                  {achievement.earned && achievement.earnedAt && (
                    <div className="text-xs text-gray-500">
                      Earned on {formatDate(achievement.earnedAt)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}