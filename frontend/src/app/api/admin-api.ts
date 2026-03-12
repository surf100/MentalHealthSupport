import { getToken } from "../lib/auth-storage";

const ADMIN_API_BASE_URL = "http://localhost:8080/api/admin";

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

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) throw new Error("Unauthorized");
    if (response.status === 403) throw new Error("Forbidden");
    await parseError(response);
  }
  return response.json();
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type AdminUserRole = "USER" | "ADMIN";
export type AdminUserStatus = "ACTIVE" | "BANNED" | "SUSPENDED";

export type AdminUserResponse = {
  id: number;
  nickname: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  createdAt: string;
};

export type AdminStatsResponse = {
  totalUsers: number;
  totalAdmins: number;
  totalBanned: number;
};

export type ChangeRoleRequest = {
  role: AdminUserRole;
};

export type AuditLogResponse = {
  id: number;
  actor: string;
  action: string;
  target: string;
  details: string;
  occurredAt: string;
};

export type DailyCount = {
  date: string;
  count: number;
};

export type CategoryCount = {
  category: string;
  count: number;
};

export type StatusCount = {
  status: string;
  count: number;
};

export type AdminAnalyticsResponse = {
  reportsByDay: DailyCount[];
  reportsByCategory: CategoryCount[];
  reportsByStatus: StatusCount[];
  registrationsByDay: DailyCount[];
  totalReports: number;
  criticalReports: number;
  pendingReports: number;
  totalUsers: number;
  totalForumPosts: number;
};

// ─── API calls ────────────────────────────────────────────────────────────────

export async function getAllUsers(): Promise<AdminUserResponse[]> {
  const response = await fetch(`${ADMIN_API_BASE_URL}/users`, {
    headers: authHeaders(),
  });
  return handleResponse<AdminUserResponse[]>(response);
}

export async function getStats(): Promise<AdminStatsResponse> {
  const response = await fetch(`${ADMIN_API_BASE_URL}/users/stats`, {
    headers: authHeaders(),
  });
  return handleResponse<AdminStatsResponse>(response);
}

export async function getAnalytics(): Promise<AdminAnalyticsResponse> {
  const response = await fetch(`${ADMIN_API_BASE_URL}/analytics`, {
    headers: authHeaders(),
  });
  return handleResponse<AdminAnalyticsResponse>(response);
}

export async function changeUserRole(
  id: number,
  role: AdminUserRole
): Promise<AdminUserResponse> {
  const response = await fetch(`${ADMIN_API_BASE_URL}/users/${id}/role`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ role } satisfies ChangeRoleRequest),
  });
  return handleResponse<AdminUserResponse>(response);
}

export async function banUser(id: number): Promise<AdminUserResponse> {
  const response = await fetch(`${ADMIN_API_BASE_URL}/users/${id}/ban`, {
    method: "PUT",
    headers: authHeaders(),
  });
  return handleResponse<AdminUserResponse>(response);
}

export async function unbanUser(id: number): Promise<AdminUserResponse> {
  const response = await fetch(`${ADMIN_API_BASE_URL}/users/${id}/unban`, {
    method: "PUT",
    headers: authHeaders(),
  });
  return handleResponse<AdminUserResponse>(response);
}

export async function getAuditLog(): Promise<AuditLogResponse[]> {
  const response = await fetch(`${ADMIN_API_BASE_URL}/audit-log`, {
    headers: authHeaders(),
  });
  return handleResponse<AuditLogResponse[]>(response);
}