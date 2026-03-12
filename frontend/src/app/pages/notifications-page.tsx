import { Footer } from "../components/footer";
import { Header } from "../components/header";
import {
  Bell,
  FileText,
  MessageSquare,
  ShieldAlert,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getNotifications,
  markAllNotificationsAsRead,
  type BackendNotificationType,
  type NotificationResponse,
} from "../api/notifications-api";

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

const filters: NotificationFilter[] = [
  "All",
  "Reports",
  "Forum",
  "Achievements",
  "Safety",
];

function mapBackendTypeToFilter(
  type: BackendNotificationType
): Exclude<NotificationFilter, "All"> {
  switch (type) {
    case "REPORT_UPDATE":
      return "Reports";
    case "FORUM_REPLY":
      return "Forum";
    case "ACHIEVEMENT":
      return "Achievements";
    case "WARNING":
    case "SYSTEM":
    default:
      return "Safety";
  }
}

function formatRelativeTime(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

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

function getTypeIcon(type: BackendNotificationType) {
  switch (type) {
    case "REPORT_UPDATE":
      return <FileText className="w-5 h-5 text-blue-600" />;
    case "FORUM_REPLY":
      return <MessageSquare className="w-5 h-5 text-emerald-600" />;
    case "ACHIEVEMENT":
      return <Trophy className="w-5 h-5 text-amber-600" />;
    case "WARNING":
      return <ShieldAlert className="w-5 h-5 text-red-600" />;
    case "SYSTEM":
    default:
      return <Bell className="w-5 h-5 text-gray-600" />;
  }
}

export function NotificationsPage() {
  const [selectedFilter, setSelectedFilter] =
    useState<NotificationFilter>("All");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

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

        const message =
          err instanceof Error ? err.message : "Failed to load notifications";
        setError(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleMarkAllAsRead() {
  try {
    setIsMarkingAllAsRead(true);
    setActionError(null);

    await markAllNotificationsAsRead();

    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        isRead: true,
      }))
    );
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to mark notifications as read";

    setActionError(message);
  } finally {
    setIsMarkingAllAsRead(false);
  }
}

  const filteredNotifications = useMemo(() => {
    if (selectedFilter === "All") return notifications;
    return notifications.filter((item) => item.filterType === selectedFilter);
  }, [notifications, selectedFilter]);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-bold mb-3">Notifications</h1>
              <p className="text-lg text-gray-600 max-w-3xl">
                Stay updated on report activity, forum replies, safety alerts,
                and community achievements.
              </p>
            </div>

            <button
  onClick={handleMarkAllAsRead}
  disabled={isMarkingAllAsRead || unreadCount === 0}
  className={`border px-5 py-3 rounded-md inline-flex items-center gap-2 text-sm ${
    isMarkingAllAsRead || unreadCount === 0
      ? "text-gray-400 cursor-not-allowed"
      : "hover:bg-gray-50 text-gray-700"
  }`}
>
  {isMarkingAllAsRead ? "Marking..." : "Mark all as read"}
</button>
{actionError && (
  <p className="mt-3 text-sm text-red-600">{actionError}</p>
)}
          </div>

          <div className="grid grid-cols-12 gap-8">
            <aside className="col-span-3">
              <div className="border rounded-xl p-6 sticky top-8">
                <h2 className="font-semibold mb-4">Filter</h2>

                <div className="space-y-2">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`block w-full text-left px-4 py-3 rounded-md text-sm ${
                        selectedFilter === filter
                          ? "bg-emerald-50 text-emerald-700"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Unread notifications</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {unreadCount}
                  </p>
                </div>
              </div>
            </aside>

            <section className="col-span-9">
              {isLoading ? (
                <div className="border rounded-xl p-10 text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    Loading notifications...
                  </h3>
                  <p className="text-sm text-gray-600">
                    Please wait while we load your updates.
                  </p>
                </div>
              ) : error ? (
                <div className="border rounded-xl p-10 text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    Failed to load notifications
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="border px-5 py-3 rounded-md hover:bg-gray-50 text-sm"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="border rounded-xl p-10 text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    No notifications found
                  </h3>
                  <p className="text-sm text-gray-600">
                    There are no notifications for this category yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <article
                      key={notification.id}
                      className={`border rounded-xl p-6 transition-all ${
                        notification.isRead ? "bg-white" : "bg-emerald-50/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-11 h-11 rounded-full bg-white border flex items-center justify-center shrink-0">
                            {getTypeIcon(notification.type)}
                          </div>

                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {notification.title}
                              </h3>

                              {!notification.isRead && (
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                              )}
                            </div>

                            <p className="text-sm text-gray-600 leading-6 mb-3">
                              {notification.description}
                            </p>

                            <div className="text-sm text-gray-500">
                              {notification.time}
                            </div>
                          </div>
                        </div>

                        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 shrink-0">
                          {notification.filterType}
                        </span>
                      </div>
                    </article>
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