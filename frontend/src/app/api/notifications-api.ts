import { getToken } from "../lib/auth-storage";

const NOTIFICATION_API_BASE_URL = "http://localhost:8080/api/notifications";

interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

async function parseError(response: Response): Promise<never> {
  let errorMessage = "Something went wrong";

  try {
    const errorBody: ApiErrorResponse = await response.json();
    errorMessage = errorBody.message || errorMessage;
  } catch {
    errorMessage = "Unexpected server response";
  }

  throw new Error(errorMessage);
}

export type BackendNotificationType =
  | "REPORT_UPDATE"
  | "FORUM_REPLY"
  | "SYSTEM"
  | "WARNING"
  | "ACHIEVEMENT";

export type NotificationResponse = {
  id: number;
  title: string;
  message: string;
  type: BackendNotificationType;
  isRead: boolean;
  createdAt: string;
};

export async function getNotifications(): Promise<NotificationResponse[]> {
  const token = getToken();

  const response = await fetch(`${NOTIFICATION_API_BASE_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    if (response.status === 403) {
      throw new Error("Forbidden");
    }
    if (response.status === 404) {
      throw new Error("Notifications user was not found");
    }

    await parseError(response);
  }

  return response.json();
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const token = getToken();

  const response = await fetch(`${NOTIFICATION_API_BASE_URL}/read-all`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    if (response.status === 403) {
      throw new Error("Forbidden");
    }
    if (response.status === 404) {
      throw new Error("Notifications user was not found");
    }

    await parseError(response);
  }
}