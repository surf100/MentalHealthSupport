import { useEffect, useMemo, useRef, useState } from "react";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import {
  Bell,
  FileText,
  Mail,
  Pencil,
  Shield,
  Trophy,
  User,
  X,
  Check,
  Camera,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getMyProfile,
  updateMyProfile,
  type ProfileResponse,
} from "../api/profile-api";
import { useAuth } from "../auth/auth-context";
import { applyThemePreference } from "../lib/theme";
import { getToken } from "../lib/auth-storage";
import { API_BASE_URL } from "../api/api-config";

// ─── types ────────────────────────────────────────────────────────────────────

interface ActivityItem {
  type: string;
  title: string;
  description: string;
  timestampLabel: string;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatMemberSince(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * Applies languagePreference to the HTML element so that browser-level
 * language-sensitive features (spell-check, screen-readers, etc.) pick it up.
 * You can extend this with i18next / your own i18n solution later.
 */
function applyLanguagePreference(lang: string) {
  if (lang) {
    document.documentElement.lang = lang;
  }
}

// ─── activity fetch ───────────────────────────────────────────────────────────

async function getRecentActivity(): Promise<ActivityItem[]> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/api/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to load activity");
  const data = await res.json();
  return (data.recentActivity ?? []) as ActivityItem[];
}

// ─── avatar upload (imgbb) ────────────────────────────────────────────────────
// Get a free API key at https://api.imgbb.com/
// Put it in your .env as VITE_IMGBB_API_KEY=your_key_here
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY as string | undefined;

async function uploadAvatarToImgbb(file: File): Promise<string> {
  if (!IMGBB_API_KEY) {
    throw new Error(
      "VITE_IMGBB_API_KEY is not set. Add it to your .env file."
    );
  }
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    { method: "POST", body: form }
  );
  if (!res.ok) throw new Error("Image upload failed");
  const json = await res.json();
  return json.data.url as string;
}

// ─── component ────────────────────────────────────────────────────────────────

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [privacyModeEnabled, setPrivacyModeEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [themePreference, setThemePreference] = useState("light");
  const [languagePreference, setLanguagePreference] = useState("en");

  // avatar
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // activity
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);

  // ── load profile ────────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        setError("");
        const data = await getMyProfile();
        setProfile(data);
        setDisplayName(data.displayName ?? "");
        setBio(data.bio ?? "");
        setPrivacyModeEnabled(data.privacyModeEnabled);
        setNotificationsEnabled(data.notificationsEnabled);
        setThemePreference(data.themePreference);
        setLanguagePreference(data.languagePreference);
        setAvatarUrl(data.avatarUrl ?? null);
        applyThemePreference(data.themePreference);
        applyLanguagePreference(data.languagePreference);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  // ── load activity ───────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadActivity() {
      try {
        setActivityLoading(true);
        const items = await getRecentActivity();
        setRecentActivity(items);
      } catch {
        // non-critical — silently ignore
      } finally {
        setActivityLoading(false);
      }
    }
    loadActivity();
  }, []);

  const displayTitle = useMemo(() => {
    if (!profile) return "";
    return profile.displayName?.trim() || profile.nickname;
  }, [profile]);

  // ── avatar file pick ────────────────────────────────────────────────────────
  const handleAvatarFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);

    try {
      setIsUploadingAvatar(true);
      setError("");
      const url = await uploadAvatarToImgbb(file);
      setAvatarUrl(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload avatar"
      );
      setAvatarPreview(null);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // ── edit toggle ─────────────────────────────────────────────────────────────
  const handleEditToggle = () => {
    if (!profile) return;
    if (isEditing) {
      setDisplayName(profile.displayName ?? "");
      setBio(profile.bio ?? "");
      setPrivacyModeEnabled(profile.privacyModeEnabled);
      setNotificationsEnabled(profile.notificationsEnabled);
      setThemePreference(profile.themePreference);
      setLanguagePreference(profile.languagePreference);
      setAvatarUrl(profile.avatarUrl ?? null);
      setAvatarPreview(null);
      setSuccessMessage("");
    }
    setError("");
    setIsEditing(!isEditing);
  };

  // ── save ────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!profile || isSaving) return;
    try {
      setIsSaving(true);
      setError("");
      setSuccessMessage("");

      const updated = await updateMyProfile({
        displayName: displayName.trim() || null,
        bio: bio.trim() || null,
        avatarUrl: avatarUrl ?? null,
        privacyModeEnabled,
        notificationsEnabled,
        themePreference,
        languagePreference,
      });

      setProfile(updated);
      setDisplayName(updated.displayName ?? "");
      setBio(updated.bio ?? "");
      setPrivacyModeEnabled(updated.privacyModeEnabled);
      setNotificationsEnabled(updated.notificationsEnabled);
      setThemePreference(updated.themePreference);
      setLanguagePreference(updated.languagePreference);
      setAvatarUrl(updated.avatarUrl ?? null);
      setAvatarPreview(null);

      applyThemePreference(updated.themePreference);
      applyLanguagePreference(updated.languagePreference);

      if (user) {
        setUser({ ...user, displayName: updated.displayName });
      }
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // ── activity icon ───────────────────────────────────────────────────────────
  const activityIconClass = (type: string) => {
    switch (type) {
      case "REPORT_UPDATE":
        return "text-blue-500";
      case "FORUM_REPLY":
        return "text-emerald-500";
      case "ACHIEVEMENT":
        return "text-amber-500";
      default:
        return "text-gray-400";
    }
  };

  // ── current avatar to display ───────────────────────────────────────────────
  const displayAvatar = avatarPreview ?? avatarUrl;

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-10">
            <h1 className="text-5xl font-bold mb-3">Profile</h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Manage your account, review your activity, and access your
              personal SafeSpace features.
            </p>
          </div>

          {isLoading ? (
            <div className="border rounded-xl p-8 text-gray-600">
              Loading profile...
            </div>
          ) : error && !profile ? (
            <div className="border border-red-200 bg-red-50 rounded-xl p-6 text-red-700">
              {error}
            </div>
          ) : profile ? (
            <>
              {successMessage && (
                <div className="mb-6 border border-green-200 bg-green-50 rounded-xl p-4 text-green-700 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {successMessage}
                </div>
              )}

              {error && (
                <div className="mb-6 border border-red-200 bg-red-50 rounded-xl p-4 text-red-700 flex items-center gap-2">
                  <X className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-12 gap-8">
                {/* ── left column ── */}
                <section className="col-span-4">
                  <div className="border rounded-xl p-8">
                    <div className="flex flex-col items-center text-center">

                      {/* avatar */}
                      <div className="relative mb-5">
                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                          {displayAvatar ? (
                            <img
                              src={displayAvatar}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-10 h-10 text-gray-500" />
                          )}
                        </div>

                        {/* upload overlay — only when editing */}
                        {isEditing && (
                          <>
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isUploadingAvatar}
                              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 disabled:opacity-60"
                              title="Change photo"
                            >
                              {isUploadingAvatar ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Camera className="w-4 h-4" />
                              )}
                            </button>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleAvatarFileChange}
                            />
                          </>
                        )}
                      </div>

                      {isUploadingAvatar && (
                        <p className="text-xs text-gray-500 mb-2">
                          Uploading photo…
                        </p>
                      )}

                      <h2 className="text-2xl font-semibold mb-2">
                        {displayTitle}
                      </h2>
                      <p className="text-sm text-gray-500 mb-6">
                        Member since {formatMemberSince(profile.memberSince)}
                      </p>

                      <button
                        onClick={handleEditToggle}
                        className="border px-4 py-2 rounded-md text-sm hover:bg-gray-50 inline-flex items-center gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        {isEditing ? "Cancel Editing" : "Edit Profile"}
                      </button>
                    </div>

                    <div className="border-t mt-8 pt-6 space-y-4">
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <Mail className="w-4 h-4" />
                        {profile.email}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <Shield className="w-4 h-4" />
                        {profile.privacyModeEnabled
                          ? "Privacy mode enabled"
                          : "Privacy mode disabled"}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <Bell className="w-4 h-4" />
                        {profile.notificationsEnabled
                          ? "Notifications enabled"
                          : "Notifications disabled"}
                      </div>
                    </div>
                  </div>

                  {/* ── editable profile info ── */}
                  <div className="border rounded-xl p-8 mt-6">
                    <h3 className="text-xl font-semibold mb-5">
                      Editable Profile Info
                    </h3>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Display name
                        </label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Bio
                        </label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          disabled={!isEditing}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                        />
                      </div>

                      <div className="flex items-center justify-between border rounded-lg px-4 py-3">
                        <span className="text-sm font-medium">Privacy mode</span>
                        <input
                          type="checkbox"
                          checked={privacyModeEnabled}
                          onChange={(e) =>
                            setPrivacyModeEnabled(e.target.checked)
                          }
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="flex items-center justify-between border rounded-lg px-4 py-3">
                        <span className="text-sm font-medium">Notifications</span>
                        <input
                          type="checkbox"
                          checked={notificationsEnabled}
                          onChange={(e) =>
                            setNotificationsEnabled(e.target.checked)
                          }
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Theme preference
                        </label>
                        <select
                          value={themePreference}
                          onChange={(e) => setThemePreference(e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Language preference
                        </label>
                        <select
                          value={languagePreference}
                          onChange={(e) => {
                            setLanguagePreference(e.target.value);
                            // apply immediately for live preview while editing
                            applyLanguagePreference(e.target.value);
                          }}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="en">English</option>
                          <option value="ru">Русский</option>
                          <option value="kz">Қазақша</option>
                        </select>
                      </div>

                      {isEditing && (
                        <button
                          onClick={handleSave}
                          disabled={isSaving || isUploadingAvatar}
                          className="w-full bg-black text-white px-5 py-3 rounded-md hover:bg-gray-800 disabled:opacity-60"
                        >
                          {isSaving ? "Saving..." : "Save Profile"}
                        </button>
                      )}
                    </div>
                  </div>
                </section>

                {/* ── right column ── */}
                <section className="col-span-8 space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    <button
                      onClick={() => navigate("/my-reports")}
                      className="border rounded-xl p-6 text-left hover:shadow-md transition-all"
                    >
                      <FileText className="w-6 h-6 text-blue-600 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">My Reports</h3>
                      <p className="text-sm text-gray-600 leading-6">
                        Track your submitted reports and their review status.
                      </p>
                    </button>

                    <button
                      onClick={() => navigate("/notifications")}
                      className="border rounded-xl p-6 text-left hover:shadow-md transition-all"
                    >
                      <Bell className="w-6 h-6 text-emerald-600 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Notifications
                      </h3>
                      <p className="text-sm text-gray-600 leading-6">
                        Stay updated with report activity, replies, and alerts.
                      </p>
                    </button>

                    <button
                      onClick={() => navigate("/achievements")}
                      className="border rounded-xl p-6 text-left hover:shadow-md transition-all"
                    >
                      <Trophy className="w-6 h-6 text-amber-600 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Achievements
                      </h3>
                      <p className="text-sm text-gray-600 leading-6">
                        See your earned badges and participation milestones.
                      </p>
                    </button>
                  </div>

                  {/* ── recent activity ── */}
                  <div className="border rounded-xl p-8">
                    <h2 className="text-2xl font-semibold mb-5">
                      Recent Activity
                    </h2>

                    {activityLoading ? (
                      <div className="text-sm text-gray-500">
                        Loading activity…
                      </div>
                    ) : recentActivity.length === 0 ? (
                      <div className="text-sm text-gray-500">
                        No recent activity yet.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentActivity.map((item, idx) => (
                          <div key={idx} className="border rounded-lg p-5">
                            <div
                              className={`text-sm font-medium mb-1 ${activityIconClass(item.type)}`}
                            >
                              {item.title}
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                              {item.timestampLabel}
                            </div>
                            <p className="text-sm text-gray-700 leading-6">
                              {item.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ── quick actions ── */}
                  <div className="border rounded-xl p-8 bg-gray-50">
                    <h2 className="text-2xl font-semibold mb-4">
                      Quick Actions
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => navigate("/report")}
                        className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-800"
                      >
                        Submit Report
                      </button>
                      <button
                        onClick={() => navigate("/forum")}
                        className="border px-5 py-3 rounded-md hover:bg-gray-50"
                      >
                        Open Forum
                      </button>
                      <button
                        onClick={() => navigate("/knowledge-base")}
                        className="border px-5 py-3 rounded-md hover:bg-gray-50"
                      >
                        Browse Resources
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}