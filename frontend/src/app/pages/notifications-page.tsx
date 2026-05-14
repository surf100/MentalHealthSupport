import { Footer } from "../components/footer";
import { Header } from "../components/header";
import {
  Bell,
  FileText,
  MessageSquare,
  ShieldAlert,
  Trophy,
  AlertCircle,
  RefreshCw,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationsAsReadByType,
  type BackendNotificationType,
  type NotificationResponse,
} from "../api/notifications-api";

// ─── types ────────────────────────────────────────────────────────────────────

type NotificationFilter =
  | "All"
  | "Reports"
  | "Forum"
  | "Achievements"
  | "Safety";

type NotificationItem = {
  id: number;
  title: string;
  description: string;
  time: string;
  type: BackendNotificationType;
  filterType: Exclude<NotificationFilter, "All">;
  isRead: boolean;
  createdAt: string;
};

// ─── constants ────────────────────────────────────────────────────────────────

const filters: NotificationFilter[] = [
  "All",
  "Reports",
  "Forum",
  "Achievements",
  "Safety",
];

const FILTER_TO_TYPES: Partial<
  Record<NotificationFilter, BackendNotificationType[]>
> = {
  Reports: ["REPORT_UPDATE"],
  Forum: ["FORUM_REPLY"],
  Achievements: ["ACHIEVEMENT"],
  Safety: ["WARNING", "SYSTEM"],
};

// filter → icon + colors
const FILTER_META: Record<
  NotificationFilter,
  { icon: React.ReactNode; accentColor: string; bgColor: string }
> = {
  All: {
    icon: <Bell className="w-4 h-4" />,
    accentColor: "#6096BA",
    bgColor: "rgba(136,187,214,0.10)",
  },
  Reports: {
    icon: <FileText className="w-4 h-4" />,
    accentColor: "#6096BA",
    bgColor: "rgba(136,187,214,0.10)",
  },
  Forum: {
    icon: <MessageSquare className="w-4 h-4" />,
    accentColor: "#4a7fa5",
    bgColor: "rgba(74,127,165,0.10)",
  },
  Achievements: {
    icon: <Trophy className="w-4 h-4" />,
    accentColor: "#e8a020",
    bgColor: "rgba(232,160,32,0.12)",
  },
  Safety: {
    icon: <ShieldAlert className="w-4 h-4" />,
    accentColor: "#dc2626",
    bgColor: "rgba(220,38,38,0.08)",
  },
};

// ─── helpers ──────────────────────────────────────────────────────────────────

function mapBackendTypeToFilter(
  type: BackendNotificationType
): Exclude<NotificationFilter, "All"> {
  switch (type) {
    case "REPORT_UPDATE":  return "Reports";
    case "FORUM_REPLY":    return "Forum";
    case "ACHIEVEMENT":    return "Achievements";
    case "WARNING":
    case "SYSTEM":
    default:               return "Safety";
  }
}

function formatRelativeTime(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function mapNotification(item: NotificationResponse): NotificationItem {
  return {
    id: item.id,
    title: item.title,
    description: item.message,
    time: formatRelativeTime(item.createdAt),
    type: item.type,
    filterType: mapBackendTypeToFilter(item.type),
    isRead: item.isRead,
    createdAt: item.createdAt,
  };
}

// ─── skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded ${className ?? ""}`}
      style={{ backgroundColor: "rgba(36,76,90,0.07)" }}
    />
  );
}

// ─── component ────────────────────────────────────────────────────────────────

export function NotificationsPage() {
  const [selectedFilter, setSelectedFilter] = useState<NotificationFilter>("All");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // hover states
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const [hoveredMarkAll, setHoveredMarkAll] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadNotifications() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getNotifications();
        if (!isMounted) return;
        setNotifications(data.map(mapNotification));
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load notifications");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadNotifications();
    return () => { isMounted = false; };
  }, []);

  // Auto-mark as read when switching to a specific filter tab
  useEffect(() => {
    if (selectedFilter === "All" || isLoading) return;

    const types = FILTER_TO_TYPES[selectedFilter];
    if (!types) return;

    const hasUnread = notifications.some((n) => !n.isRead && types.includes(n.type));
    if (!hasUnread) return;

    Promise.all(types.map((type) => markNotificationsAsReadByType(type))).catch(() => {});

    setNotifications((prev) =>
      prev.map((n) => (types.includes(n.type) ? { ...n, isRead: true } : n))
    );
  }, [selectedFilter, isLoading]);

  async function handleMarkAllAsRead() {
    try {
      setIsMarkingAllAsRead(true);
      setActionError(null);
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to mark notifications as read");
    } finally {
      setIsMarkingAllAsRead(false);
    }
  }

  const filteredNotifications = useMemo(() => {
    if (selectedFilter === "All") return notifications;
    return notifications.filter((item) => item.filterType === selectedFilter);
  }, [notifications, selectedFilter]);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

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
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-10 flex items-end justify-between gap-6">
          <div>
            <p
              className="font-sans font-bold uppercase tracking-[0.20em] mb-2"
              style={{ fontSize: 11, color: "#6096BA" }}
            >
              Updates
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
              Notifications
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
              Stay updated on report activity, forum replies, safety alerts, and achievements.
            </p>
          </div>

          {/* mark all as read button */}
          <div className="flex flex-col items-end gap-2 pb-1">
            <button
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAllAsRead || unreadCount === 0}
              onMouseEnter={() => setHoveredMarkAll(true)}
              onMouseLeave={() => setHoveredMarkAll(false)}
              className="inline-flex items-center gap-2 font-sans font-semibold rounded-sm px-4 py-2.5"
              style={{
                fontSize: 13,
                color: unreadCount === 0 ? "rgba(36,76,90,0.35)" : "#274C77",
                border: "1px solid rgba(36,76,90,0.20)",
                backgroundColor:
                  unreadCount === 0
                    ? "transparent"
                    : hoveredMarkAll
                    ? "rgba(255,255,255,0.60)"
                    : "rgba(255,255,255,0.40)",
                cursor: isMarkingAllAsRead || unreadCount === 0 ? "not-allowed" : "pointer",
                backdropFilter: "blur(4px)",
                transition: "background 0.15s",
              }}
            >
              {isMarkingAllAsRead ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCheck className="w-3.5 h-3.5" />
              )}
              {isMarkingAllAsRead ? "Marking…" : "Mark all as read"}
            </button>
            {actionError && (
              <p className="font-sans" style={{ fontSize: 12, color: "#dc2626" }}>
                {actionError}
              </p>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="grid grid-cols-12 gap-8">

            {/* ── sidebar ── */}
            <aside className="col-span-3">
              <div
                className="rounded-2xl p-6 sticky top-8"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid rgba(136,187,214,0.10)",
                  boxShadow: "0 8px 40px rgba(36,76,90,0.10)",
                }}
              >
                <p
                  className="font-sans font-bold uppercase tracking-[0.20em] mb-4"
                  style={{ fontSize: 11, color: "#6096BA" }}
                >
                  Filter
                </p>

                <div className="space-y-1">
                  {filters.map((filter) => {
                    const isActive = selectedFilter === filter;
                    const types = FILTER_TO_TYPES[filter];
                    const unreadInFilter = types
                      ? notifications.filter((n) => !n.isRead && types.includes(n.type)).length
                      : unreadCount;
                    const meta = FILTER_META[filter];

                    return (
                      <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        onMouseEnter={() => setHoveredFilter(filter)}
                        onMouseLeave={() => setHoveredFilter(null)}
                        className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all"
                        style={{
                          backgroundColor: isActive
                            ? meta.bgColor
                            : hoveredFilter === filter
                            ? "rgba(36,76,90,0.04)"
                            : "transparent",
                          cursor: "pointer",
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <span style={{ color: isActive ? meta.accentColor : "rgba(36,76,90,0.40)" }}>
                            {meta.icon}
                          </span>
                          <span
                            className="font-sans"
                            style={{
                              fontSize: 13,
                              fontWeight: isActive ? 600 : 400,
                              color: isActive ? meta.accentColor : "rgba(36,76,90,0.70)",
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {filter}
                          </span>
                        </div>
                        {unreadInFilter > 0 && (
                          <span
                            className="font-sans font-semibold rounded-full px-2 py-0.5 min-w-[20px] text-center"
                            style={{
                              fontSize: 11,
                              backgroundColor: isActive ? meta.accentColor : "rgba(36,76,90,0.10)",
                              color: isActive ? "#fff" : "rgba(36,76,90,0.60)",
                            }}
                          >
                            {unreadInFilter}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* unread count summary */}
                <div
                  className="mt-5 rounded-xl p-4"
                  style={{ backgroundColor: "rgba(198,209,102,0.18)", border: "1px solid rgba(198,209,102,0.35)" }}
                >
                  <p
                    className="font-sans"
                    style={{ fontSize: 12, color: "rgba(36,76,90,0.60)" }}
                  >
                    Unread
                  </p>
                  <p
                    className="font-serif mt-0.5"
                    style={{
                      fontSize: 28,
                      letterSpacing: "-0.04em",
                      color: "#274C77",
                      fontFamily: "DM Serif Display, serif",
                      lineHeight: 1.1,
                    }}
                  >
                    {unreadCount}
                  </p>
                </div>
              </div>
            </aside>

            {/* ── main ── */}
            <section className="col-span-9">

              {/* ── loading ── */}
              {isLoading && (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="rounded-2xl p-6"
                      style={{
                        backgroundColor: "#fff",
                        border: "1px solid rgba(136,187,214,0.10)",
                        boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                      }}
                    >
                      <div className="flex gap-4">
                        <Skeleton className="w-11 h-11 rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-2.5">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-16 rounded-full" />
                          </div>
                          <Skeleton className="h-3.5 w-full" />
                          <Skeleton className="h-3.5 w-3/4" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="w-20 h-6 rounded-full flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── error ── */}
              {!isLoading && error && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div
                    className="flex items-center justify-center rounded-2xl mb-5"
                    style={{ width: 64, height: 64, backgroundColor: "rgba(220,38,38,0.08)" }}
                  >
                    <AlertCircle className="w-7 h-7" style={{ color: "#dc2626" }} />
                  </div>
                  <h3
                    className="font-serif mb-2"
                    style={{
                      fontSize: 22,
                      letterSpacing: "-0.03em",
                      color: "#274C77",
                      fontFamily: "DM Serif Display, serif",
                    }}
                  >
                    Failed to load notifications
                  </h3>
                  <p
                    className="font-sans mb-6"
                    style={{ fontSize: 14, color: "rgba(36,76,90,0.55)", maxWidth: 320 }}
                  >
                    {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 font-sans font-semibold text-white rounded-sm px-5 py-2.5"
                    style={{ fontSize: 14, backgroundColor: "#6096BA", cursor: "pointer" }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try again
                  </button>
                </div>
              )}

              {/* ── empty ── */}
              {!isLoading && !error && filteredNotifications.length === 0 && (
                <div
                  className="flex flex-col items-center justify-center rounded-2xl py-20 text-center"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid rgba(136,187,214,0.10)",
                    boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-2xl mb-4"
                    style={{ width: 56, height: 56, backgroundColor: "rgba(198,209,102,0.25)" }}
                  >
                    <Bell className="w-6 h-6" style={{ color: "#6096BA" }} />
                  </div>
                  <h3
                    className="font-serif mb-2"
                    style={{
                      fontSize: 22,
                      letterSpacing: "-0.03em",
                      color: "#274C77",
                      fontFamily: "DM Serif Display, serif",
                    }}
                  >
                    All caught up
                  </h3>
                  <p
                    className="font-sans"
                    style={{
                      fontSize: 14,
                      color: "rgba(36,76,90,0.55)",
                      maxWidth: 280,
                      lineHeight: 1.65,
                    }}
                  >
                    {selectedFilter === "All"
                      ? "No notifications yet. We'll let you know when something happens."
                      : `No ${selectedFilter.toLowerCase()} notifications yet.`}
                  </p>
                </div>
              )}

              {/* ── notification list ── */}
              {!isLoading && !error && filteredNotifications.length > 0 && (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => {
                    const meta = FILTER_META[notification.filterType];

                    return (
                      <article
                        key={notification.id}
                        className="rounded-2xl overflow-hidden transition-all"
                        style={{
                          backgroundColor: "#fff",
                          border: notification.isRead
                            ? "1px solid rgba(136,187,214,0.10)"
                            : `1px solid ${meta.accentColor}28`,
                          boxShadow: "0 4px 20px rgba(36,76,90,0.07)",
                        }}
                      >
                        {/* unread accent bar */}
                        {!notification.isRead && (
                          <div style={{ height: 3, backgroundColor: meta.accentColor }} />
                        )}

                        <div className="px-6 py-5">
                          <div className="flex items-start gap-4">
                            {/* icon */}
                            <div
                              className="flex items-center justify-center rounded-xl flex-shrink-0"
                              style={{
                                width: 40,
                                height: 40,
                                backgroundColor: notification.isRead
                                  ? "rgba(36,76,90,0.05)"
                                  : meta.bgColor,
                                color: notification.isRead
                                  ? "rgba(36,76,90,0.40)"
                                  : meta.accentColor,
                              }}
                            >
                              {/* re-render icons with correct sizing */}
                              {notification.type === "REPORT_UPDATE" && <FileText className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />}
                              {notification.type === "FORUM_REPLY" && <MessageSquare style={{ width: 18, height: 18 }} />}
                              {notification.type === "ACHIEVEMENT" && <Trophy style={{ width: 18, height: 18 }} />}
                              {notification.type === "WARNING" && <ShieldAlert style={{ width: 18, height: 18 }} />}
                              {notification.type === "SYSTEM" && <Bell style={{ width: 18, height: 18 }} />}
                            </div>

                            {/* content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                                <h3
                                  className="font-sans font-semibold"
                                  style={{
                                    fontSize: 14,
                                    color: "#274C77",
                                    letterSpacing: "-0.01em",
                                  }}
                                >
                                  {notification.title}
                                </h3>
                                {!notification.isRead && (
                                  <span
                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: meta.accentColor }}
                                  />
                                )}
                              </div>

                              <p
                                className="font-sans mb-2"
                                style={{
                                  fontSize: 13,
                                  color: "rgba(36,76,90,0.60)",
                                  letterSpacing: "-0.01em",
                                  lineHeight: 1.65,
                                }}
                              >
                                {notification.description}
                              </p>

                              <span
                                className="font-sans"
                                style={{ fontSize: 12, color: "rgba(36,76,90,0.40)" }}
                              >
                                {notification.time}
                              </span>
                            </div>

                            {/* type badge */}
                            <span
                              className="font-sans font-semibold rounded-full px-3 py-1 flex-shrink-0"
                              style={{
                                fontSize: 11,
                                backgroundColor: meta.bgColor,
                                color: meta.accentColor,
                              }}
                            >
                              {notification.filterType}
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
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