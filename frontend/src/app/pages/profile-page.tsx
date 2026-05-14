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
  AlertCircle,
  RefreshCw,
  Globe,
  Palette,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getMyProfile,
  updateMyProfile,
  type ProfileResponse,
} from "../api/profile-api";
import { useAuth } from "../auth/auth-context";
import { applyThemePreference } from "../lib/theme";
import { getDashboard, type DashboardStats } from "../api/dashboard-api";
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

// ─── toggle switch ────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        backgroundColor: checked ? "#6096BA" : "rgba(36,76,90,0.15)",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 21 : 3,
          width: 16,
          height: 16,
          borderRadius: "50%",
          backgroundColor: "#fff",
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.20)",
        }}
      />
    </button>
  );
}

// ─── activity accent color ────────────────────────────────────────────────────

function activityAccentColor(type: string): string {
  switch (type) {
    case "REPORT_UPDATE":
      return "#6096BA";
    case "FORUM_REPLY":
      return "#F9F7F3";
    case "ACHIEVEMENT":
      return "#e8a020";
    default:
      return "rgba(36,76,90,0.15)";
  }
}

// ─── skeleton block ───────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded ${className ?? ""}`}
      style={{ backgroundColor: "rgba(36,76,90,0.07)" }}
    />
  );
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

  // stats
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // hover states
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

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

  // ── load activity + stats ───────────────────────────────────────────────────
  useEffect(() => {
    async function loadActivity() {
      try {
        setActivityLoading(true);
        const [items, dashboard] = await Promise.all([
          getRecentActivity(),
          getDashboard(),
        ]);
        setRecentActivity(items);
        setStats(dashboard.stats);
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

  const displayAvatar = avatarPreview ?? avatarUrl;

  // ── initials fallback ────────────────────────────────────────────────────────
  const initials = displayTitle
    ? displayTitle
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F6F8F9" }}>
      <Header />

      {/* ── hero strip ── */}
      <div className="relative overflow-hidden" style={{ backgroundColor: "#F9F7F3" }}>
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.10]"
          style={{
            backgroundImage: "radial-gradient(#6096BA 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-10 flex items-center justify-between">
          <div>
            <p
              className="font-sans font-bold uppercase tracking-[0.20em] mb-2"
              style={{ fontSize: 11, color: "#6096BA" }}
            >
              Account
            </p>
            <h1
              className="font-serif"
              style={{
                fontSize: 38,
                letterSpacing: "-0.04em",
                color: "#274C77",
                lineHeight: 1.15,
                fontFamily: "DM Serif Display, serif",
              }}
            >
              Your Profile
            </h1>
            <p
              className="font-sans mt-2"
              style={{
                fontSize: 15,
                color: "rgba(36,76,90,0.65)",
                letterSpacing: "-0.01em",
                lineHeight: 1.75,
              }}
            >
              Manage your identity, preferences, and account settings.
            </p>
          </div>

          {/* avatar preview in hero */}
          {!isLoading && profile && (
            <div
              className="hidden md:flex items-center justify-center rounded-full overflow-hidden flex-shrink-0"
              style={{
                width: 72,
                height: 72,
                backgroundColor: "#6096BA",
                boxShadow: "0 4px 20px rgba(36,76,90,0.20)",
              }}
            >
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="font-sans font-semibold text-white"
                  style={{ fontSize: 22, letterSpacing: "-0.02em" }}
                >
                  {initials}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-10">

          {/* ── toast messages ── */}
          {successMessage && (
            <div
              className="mb-6 rounded-xl px-5 py-4 flex items-center gap-3"
              style={{
                backgroundColor: "rgba(136,187,214,0.08)",
                border: "1px solid rgba(136,187,214,0.20)",
              }}
            >
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{ width: 28, height: 28, backgroundColor: "#6096BA" }}
              >
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
              <span
                className="font-sans text-[14px]"
                style={{ color: "#274C77", letterSpacing: "-0.01em" }}
              >
                {successMessage}
              </span>
            </div>
          )}

          {error && profile && (
            <div
              className="mb-6 rounded-xl px-5 py-4 flex items-center gap-3"
              style={{
                backgroundColor: "rgba(220,38,38,0.06)",
                border: "1px solid rgba(220,38,38,0.20)",
              }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#dc2626" }} />
              <span className="font-sans text-[14px]" style={{ color: "#274C77" }}>
                {error}
              </span>
            </div>
          )}

          {/* ── loading state ── */}
          {isLoading ? (
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-4">
                <div
                  className="rounded-2xl p-8"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid rgba(136,187,214,0.10)",
                    boxShadow: "0 8px 40px rgba(36,76,90,0.10)",
                  }}
                >
                  <div className="flex flex-col items-center gap-4">
                    <Skeleton className="w-24 h-24 rounded-full" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-28" />
                  </div>
                  <div className="mt-8 space-y-4 border-t pt-6" style={{ borderColor: "rgba(36,76,90,0.08)" }}>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              </div>
              <div className="col-span-8 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-2xl p-6"
                      style={{
                        backgroundColor: "#fff",
                        border: "1px solid rgba(136,187,214,0.10)",
                        boxShadow: "0 8px 40px rgba(36,76,90,0.10)",
                      }}
                    >
                      <Skeleton className="h-5 w-5 mb-4 rounded" />
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-8 w-1/2 mb-2" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))}
                </div>
                <div
                  className="rounded-2xl p-8"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid rgba(136,187,214,0.10)",
                    boxShadow: "0 8px 40px rgba(36,76,90,0.10)",
                  }}
                >
                  <Skeleton className="h-6 w-40 mb-6" />
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="mb-4 flex gap-4">
                      <Skeleton className="w-1 h-16 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/4" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          ) : error && !profile ? (
            /* ── error state ── */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div
                className="flex items-center justify-center rounded-2xl mb-5"
                style={{ width: 64, height: 64, backgroundColor: "rgba(220,38,38,0.08)" }}
              >
                <AlertCircle className="w-7 h-7" style={{ color: "#dc2626" }} />
              </div>
              <h2
                className="font-serif mb-2"
                style={{
                  fontSize: 24,
                  letterSpacing: "-0.03em",
                  color: "#274C77",
                  fontFamily: "DM Serif Display, serif",
                }}
              >
                Couldn't load your profile
              </h2>
              <p
                className="font-sans mb-6"
                style={{ fontSize: 15, color: "rgba(36,76,90,0.60)", maxWidth: 360 }}
              >
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 font-sans font-semibold text-white rounded-sm px-5 py-2.5"
                style={{ backgroundColor: "#6096BA", fontSize: 14 }}
              >
                <RefreshCw className="w-4 h-4" />
                Try again
              </button>
            </div>

          ) : profile ? (
            <div className="grid grid-cols-12 gap-8">

              {/* ── left column ── */}
              <section className="col-span-4 space-y-5">

                {/* profile card */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid rgba(136,187,214,0.10)",
                    boxShadow: "0 8px 40px rgba(36,76,90,0.10)",
                  }}
                >
                  {/* card top: avatar + name */}
                  <div className="flex flex-col items-center text-center px-8 pt-8 pb-6">
                    {/* avatar */}
                    <div className="relative mb-5">
                      <div
                        className="flex items-center justify-center rounded-full overflow-hidden"
                        style={{
                          width: 96,
                          height: 96,
                          backgroundColor: "#F9F7F3",
                          boxShadow: "0 4px 20px rgba(36,76,90,0.15)",
                        }}
                      >
                        {displayAvatar ? (
                          <img
                            src={displayAvatar}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span
                            className="font-sans font-semibold"
                            style={{ fontSize: 26, color: "#274C77", letterSpacing: "-0.02em" }}
                          >
                            {initials}
                          </span>
                        )}
                      </div>

                      {/* upload button — edit mode only */}
                      {isEditing && (
                        <>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingAvatar}
                            className="absolute bottom-0 right-0 flex items-center justify-center rounded-full text-white"
                            style={{
                              width: 30,
                              height: 30,
                              backgroundColor: "#6096BA",
                              border: "2px solid #fff",
                              cursor: isUploadingAvatar ? "not-allowed" : "pointer",
                              opacity: isUploadingAvatar ? 0.7 : 1,
                            }}
                            title="Change photo"
                          >
                            {isUploadingAvatar ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Camera className="w-3.5 h-3.5" />
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
                      <p
                        className="font-sans mb-2"
                        style={{ fontSize: 12, color: "rgba(36,76,90,0.50)" }}
                      >
                        Uploading photo…
                      </p>
                    )}

                    <h2
                      className="font-serif mb-1"
                      style={{
                        fontSize: 22,
                        letterSpacing: "-0.03em",
                        color: "#274C77",
                        fontFamily: "DM Serif Display, serif",
                      }}
                    >
                      {displayTitle}
                    </h2>
                    <p
                      className="font-sans mb-5"
                      style={{ fontSize: 13, color: "rgba(36,76,90,0.50)", letterSpacing: "-0.01em" }}
                    >
                      Member since {formatMemberSince(profile.memberSince)}
                    </p>

                    <button
                      onClick={handleEditToggle}
                      className="inline-flex items-center gap-2 font-sans font-semibold rounded-sm px-5 py-2"
                      style={{
                        fontSize: 13,
                        color: isEditing ? "rgba(36,76,90,0.70)" : "#274C77",
                        border: "1px solid rgba(36,76,90,0.20)",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      {isEditing ? (
                        <>
                          <X className="w-3.5 h-3.5" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Pencil className="w-3.5 h-3.5" />
                          Edit Profile
                        </>
                      )}
                    </button>
                  </div>

                  {/* meta info */}
                  <div
                    className="px-8 py-5 space-y-3"
                    style={{ borderTop: "1px solid rgba(36,76,90,0.07)" }}
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 flex-shrink-0" style={{ color: "#6096BA" }} />
                      <span
                        className="font-sans truncate"
                        style={{ fontSize: 13, color: "rgba(36,76,90,0.65)", letterSpacing: "-0.01em" }}
                      >
                        {profile.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 flex-shrink-0" style={{ color: "#6096BA" }} />
                      <span
                        className="font-sans"
                        style={{ fontSize: 13, color: "rgba(36,76,90,0.65)", letterSpacing: "-0.01em" }}
                      >
                        {profile.privacyModeEnabled ? "Privacy mode on" : "Privacy mode off"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 flex-shrink-0" style={{ color: "#6096BA" }} />
                      <span
                        className="font-sans"
                        style={{ fontSize: 13, color: "rgba(36,76,90,0.65)", letterSpacing: "-0.01em" }}
                      >
                        {profile.notificationsEnabled ? "Notifications on" : "Notifications off"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── profile settings card ── */}
                <div
                  className="rounded-2xl p-7"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid rgba(136,187,214,0.10)",
                    boxShadow: "0 8px 40px rgba(36,76,90,0.10)",
                  }}
                >
                  <p
                    className="font-sans font-bold uppercase tracking-[0.20em] mb-5"
                    style={{ fontSize: 11, color: "#6096BA" }}
                  >
                    Profile Settings
                  </p>

                  <div className="space-y-5">
                    {/* display name */}
                    <div>
                      <label
                        className="block font-sans font-semibold mb-1.5"
                        style={{ fontSize: 13, color: "#274C77" }}
                      >
                        Display name
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        disabled={!isEditing}
                        placeholder="Your name"
                        className="w-full font-sans rounded-lg outline-none transition-all"
                        style={{
                          fontSize: 14,
                          padding: "10px 14px",
                          backgroundColor: "#F6F8F9",
                          border: "1px solid rgba(36,76,90,0.15)",
                          color: isEditing ? "#274C77" : "rgba(36,76,90,0.50)",
                          letterSpacing: "-0.01em",
                        }}
                      />
                    </div>

                    {/* bio */}
                    <div>
                      <label
                        className="block font-sans font-semibold mb-1.5"
                        style={{ fontSize: 13, color: "#274C77" }}
                      >
                        Bio
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                        placeholder="A few words about yourself"
                        className="w-full font-sans rounded-lg outline-none resize-none transition-all"
                        style={{
                          fontSize: 14,
                          padding: "10px 14px",
                          backgroundColor: "#F6F8F9",
                          border: "1px solid rgba(36,76,90,0.15)",
                          color: isEditing ? "#274C77" : "rgba(36,76,90,0.50)",
                          letterSpacing: "-0.01em",
                          lineHeight: 1.6,
                        }}
                      />
                    </div>

                    {/* divider */}
                    <div style={{ borderTop: "1px solid rgba(36,76,90,0.07)", paddingTop: 4 }} />

                    {/* privacy mode */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="font-sans font-semibold"
                          style={{ fontSize: 13, color: "#274C77" }}
                        >
                          Privacy mode
                        </p>
                        <p
                          className="font-sans mt-0.5"
                          style={{ fontSize: 12, color: "rgba(36,76,90,0.50)" }}
                        >
                          Hide identifying details
                        </p>
                      </div>
                      <Toggle
                        checked={privacyModeEnabled}
                        onChange={setPrivacyModeEnabled}
                        disabled={!isEditing}
                      />
                    </div>

                    {/* notifications */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="font-sans font-semibold"
                          style={{ fontSize: 13, color: "#274C77" }}
                        >
                          Notifications
                        </p>
                        <p
                          className="font-sans mt-0.5"
                          style={{ fontSize: 12, color: "rgba(36,76,90,0.50)" }}
                        >
                          Report & activity alerts
                        </p>
                      </div>
                      <Toggle
                        checked={notificationsEnabled}
                        onChange={setNotificationsEnabled}
                        disabled={!isEditing}
                      />
                    </div>

                    {/* divider */}
                    <div style={{ borderTop: "1px solid rgba(36,76,90,0.07)", paddingTop: 4 }} />

                    {/* theme */}
                    <div>
                      <label
                        className="flex items-center gap-2 font-sans font-semibold mb-1.5"
                        style={{ fontSize: 13, color: "#274C77" }}
                      >
                        <Palette className="w-3.5 h-3.5" style={{ color: "#6096BA" }} />
                        Theme
                      </label>
                      <select
                        value={themePreference}
                        onChange={(e) => setThemePreference(e.target.value)}
                        disabled={!isEditing}
                        className="w-full font-sans rounded-lg outline-none"
                        style={{
                          fontSize: 14,
                          padding: "10px 14px",
                          backgroundColor: "#F6F8F9",
                          border: "1px solid rgba(36,76,90,0.15)",
                          color: isEditing ? "#274C77" : "rgba(36,76,90,0.50)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>

                    {/* language */}
                    <div>
                      <label
                        className="flex items-center gap-2 font-sans font-semibold mb-1.5"
                        style={{ fontSize: 13, color: "#274C77" }}
                      >
                        <Globe className="w-3.5 h-3.5" style={{ color: "#6096BA" }} />
                        Language
                      </label>
                      <select
                        value={languagePreference}
                        onChange={(e) => {
                          setLanguagePreference(e.target.value);
                          applyLanguagePreference(e.target.value);
                        }}
                        disabled={!isEditing}
                        className="w-full font-sans rounded-lg outline-none"
                        style={{
                          fontSize: 14,
                          padding: "10px 14px",
                          backgroundColor: "#F6F8F9",
                          border: "1px solid rgba(36,76,90,0.15)",
                          color: isEditing ? "#274C77" : "rgba(36,76,90,0.50)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        <option value="en">English</option>
                        <option value="ru">Русский</option>
                        <option value="kz">Қазақша</option>
                      </select>
                    </div>

                    {/* save button */}
                    {isEditing && (
                      <button
                        onClick={handleSave}
                        disabled={isSaving || isUploadingAvatar}
                        className="w-full flex items-center justify-center gap-2 font-sans font-semibold text-white rounded-sm"
                        style={{
                          fontSize: 14,
                          padding: "10px 20px",
                          backgroundColor: isSaving ? "#274C77" : "#6096BA",
                          opacity: isSaving || isUploadingAvatar ? 0.75 : 1,
                          cursor: isSaving || isUploadingAvatar ? "not-allowed" : "pointer",
                        }}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving…
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            Save Profile
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* ── right column ── */}
              <section className="col-span-8 space-y-6">

                {/* ── stat cards ── */}
                <div className="grid grid-cols-3 gap-4">
                  {/* My Reports */}
                  {(
                    [
                      {
                        id: "reports",
                        icon: FileText,
                        label: "My Reports",
                        count: stats?.reportsCount ?? null,
                        description: "Track submitted reports and their review status.",
                        route: "/my-reports",
                        accentColor: "#6096BA",
                      },
                      {
                        id: "notifications",
                        icon: Bell,
                        label: "Notifications",
                        count: null,
                        description: "Stay updated on report activity and alerts.",
                        route: "/notifications",
                        accentColor: "#F9F7F3",
                      },
                      {
                        id: "achievements",
                        icon: Trophy,
                        label: "Achievements",
                        count: stats?.achievementsCount ?? null,
                        description: "Earned badges and participation milestones.",
                        route: "/achievements",
                        accentColor: "#e8a020",
                      },
                    ] as const
                  ).map(({ id, icon: Icon, label, count, description, route, accentColor }) => (
                    <button
                      key={id}
                      onClick={() => navigate(route)}
                      onMouseEnter={() => setHoveredStat(id)}
                      onMouseLeave={() => setHoveredStat(null)}
                      className="text-left rounded-2xl overflow-hidden transition-all"
                      style={{
                        backgroundColor: "#fff",
                        border: "1px solid rgba(136,187,214,0.10)",
                        boxShadow: hoveredStat === id
                          ? "0 12px 40px rgba(36,76,90,0.14)"
                          : "0 8px 40px rgba(36,76,90,0.10)",
                        transform: hoveredStat === id ? "translateY(-2px)" : "translateY(0)",
                      }}
                    >
                      {/* accent bar */}
                      <div style={{ height: 4, backgroundColor: accentColor }} />
                      <div className="p-6">
                        <div
                          className="flex items-center justify-center rounded-xl mb-4"
                          style={{
                            width: 38,
                            height: 38,
                            backgroundColor: `${accentColor}18`,
                          }}
                        >
                          <Icon className="w-5 h-5" style={{ color: accentColor }} />
                        </div>
                        <p
                          className="font-sans font-semibold mb-1"
                          style={{ fontSize: 13, color: "#274C77" }}
                        >
                          {label}
                        </p>
                        {count !== null && (
                          <p
                            className="font-serif mb-1"
                            style={{
                              fontSize: 28,
                              letterSpacing: "-0.04em",
                              color: accentColor,
                              fontFamily: "DM Serif Display, serif",
                              lineHeight: 1.1,
                            }}
                          >
                            {count}
                          </p>
                        )}
                        <p
                          className="font-sans"
                          style={{ fontSize: 12, color: "rgba(36,76,90,0.55)", lineHeight: 1.6 }}
                        >
                          {description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* ── recent activity ── */}
                <div
                  className="rounded-2xl p-8"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid rgba(136,187,214,0.10)",
                    boxShadow: "0 8px 40px rgba(36,76,90,0.10)",
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p
                        className="font-sans font-bold uppercase tracking-[0.20em] mb-1"
                        style={{ fontSize: 11, color: "#6096BA" }}
                      >
                        Activity
                      </p>
                      <h2
                        className="font-serif"
                        style={{
                          fontSize: 22,
                          letterSpacing: "-0.03em",
                          color: "#274C77",
                          fontFamily: "DM Serif Display, serif",
                        }}
                      >
                        Recent Activity
                      </h2>
                    </div>
                  </div>

                  {activityLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4">
                          <Skeleton className="w-1 h-16 rounded-full flex-shrink-0" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-1/4" />
                            <Skeleton className="h-3 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentActivity.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div
                        className="flex items-center justify-center rounded-2xl mb-4"
                        style={{ width: 52, height: 52, backgroundColor: "rgba(198,209,102,0.25)" }}
                      >
                        <FileText className="w-6 h-6" style={{ color: "#6096BA" }} />
                      </div>
                      <p
                        className="font-sans font-semibold mb-1"
                        style={{ fontSize: 15, color: "#274C77" }}
                      >
                        No activity yet
                      </p>
                      <p
                        className="font-sans"
                        style={{ fontSize: 13, color: "rgba(36,76,90,0.50)", maxWidth: 260, lineHeight: 1.65 }}
                      >
                        Your submitted reports, forum replies, and achievements will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentActivity.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex gap-4 rounded-xl px-5 py-4"
                          style={{ backgroundColor: "#F6F8F9" }}
                        >
                          {/* colored left bar */}
                          <div
                            className="w-1 rounded-full flex-shrink-0 self-stretch"
                            style={{ backgroundColor: activityAccentColor(item.type), minHeight: 40 }}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className="font-sans font-semibold mb-0.5"
                              style={{ fontSize: 13, color: "#274C77" }}
                            >
                              {item.title}
                            </p>
                            <p
                              className="font-sans mb-1.5"
                              style={{ fontSize: 12, color: "rgba(36,76,90,0.45)" }}
                            >
                              {item.timestampLabel}
                            </p>
                            <p
                              className="font-sans"
                              style={{ fontSize: 13, color: "rgba(36,76,90,0.65)", lineHeight: 1.65 }}
                            >
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── quick actions ── */}
                <div
                  className="rounded-2xl px-8 py-7"
                  style={{
                    backgroundColor: "rgba(198,209,102,0.18)",
                    border: "1px solid rgba(198,209,102,0.40)",
                  }}
                >
                  <p
                    className="font-sans font-bold uppercase tracking-[0.20em] mb-1"
                    style={{ fontSize: 11, color: "#6096BA" }}
                  >
                    Jump to
                  </p>
                  <h2
                    className="font-serif mb-5"
                    style={{
                      fontSize: 20,
                      letterSpacing: "-0.03em",
                      color: "#274C77",
                      fontFamily: "DM Serif Display, serif",
                    }}
                  >
                    Quick Actions
                  </h2>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate("/report")}
                      onMouseEnter={() => setHoveredAction("report")}
                      onMouseLeave={() => setHoveredAction(null)}
                      className="inline-flex items-center gap-2 font-sans font-semibold text-white rounded-sm"
                      style={{
                        fontSize: 14,
                        padding: "10px 20px",
                        backgroundColor: hoveredAction === "report" ? "#274C77" : "#6096BA",
                        transition: "background 0.15s",
                        cursor: "pointer",
                      }}
                    >
                      <FileText className="w-4 h-4" />
                      Submit Report
                    </button>

                    {[
                      { id: "forum", label: "Open Forum", route: "/forum" },
                      { id: "resources", label: "Browse Resources", route: "/knowledge-base" },
                    ].map(({ id, label, route }) => (
                      <button
                        key={id}
                        onClick={() => navigate(route)}
                        onMouseEnter={() => setHoveredAction(id)}
                        onMouseLeave={() => setHoveredAction(null)}
                        className="inline-flex items-center gap-2 font-sans font-semibold rounded-sm"
                        style={{
                          fontSize: 14,
                          padding: "10px 20px",
                          color: "#274C77",
                          border: "1px solid rgba(36,76,90,0.20)",
                          backgroundColor: hoveredAction === id ? "rgba(255,255,255,0.6)" : "transparent",
                          transition: "background 0.15s",
                          cursor: "pointer",
                        }}
                      >
                        {label}
                        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                      </button>
                    ))}
                  </div>
                </div>

              </section>
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}