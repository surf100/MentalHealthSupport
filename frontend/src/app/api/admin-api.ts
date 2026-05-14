import { getToken } from "../lib/auth-storage";

import { API_BASE_URL } from "./api-config";
const ADMIN_API_BASE_URL = `${API_BASE_URL}/api/admin`;

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

export type AdminUserRole = "USER" | "ADMIN" | "SPECIALIST";
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
  flaggedForumPosts: number;
  pendingForumModeration: number;
  specialistEscalations: number;
  criticalForumPosts: number;
};

export type ForumRiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export type ForumModerationStatus =
  | "PENDING_ANALYSIS"
  | "ANALYSIS_FAILED"
  | "CLEAR"
  | "FLAGGED"
  | "REVIEWED"
  | "ESCALATED_TO_SPECIALIST"
  | "DISMISSED";

export type ForumModerationQueueItemResponse = {
  id: number;
  title: string;
  content: string;
  category: string;
  authorNickname: string;
  authorEmail: string;
  anonymousToCommunity: boolean;
  riskScore: number;
  sentimentScore: number;
  riskLevel: ForumRiskLevel;
  moderationStatus: ForumModerationStatus;
  flaggedForReview: boolean;
  riskSummary: string;
  moderationNotes: string | null;
  analyzedAt: string | null;
  reviewedAt: string | null;
  specialistReferredAt: string | null;
  createdAt: string;
   specialistNote: string | null;
};

export type ReportModerationQueueItemResponse = {
  id: number;
  reference: string;
  title: string;
  description: string;
  category: string;
  reportStatus: "SUBMITTED" | "UNDER_REVIEW" | "RESOLVED";
  reporterEmail: string | null;
  anonymous: boolean;
  identityRevealed: boolean;
  riskScore: number;
  sentimentScore: number;
  riskLevel: ForumRiskLevel;
  moderationStatus: ForumModerationStatus;
  flaggedForReview: boolean;
  riskSummary: string | null;
  moderationNotes: string | null;
  analyzedAt: string | null;
  reviewedAt: string | null;
  specialistReferredAt: string | null;
  createdAt: string;
};

export type SpecialistResponseRequest = {
  message: string;
};

// ─── API calls ────────────────────────────────────────────────────────────────

export async function getAllUsers(): Promise<AdminUserResponse[]> {
  const response = await fetch(`${ADMIN_API_BASE_URL}/users`, {
    headers: authHeaders(),
  });
  return handleResponse<AdminUserResponse[]>(response);
}

export async function addForumSpecialistNote(
  id: number,
  message: string
): Promise<ForumModerationQueueItemResponse> {
  const response = await fetch(
    `${ADMIN_API_BASE_URL}/forum-risk/posts/${id}/specialist-note`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ message } satisfies SpecialistResponseRequest),
    }
  );
  return handleResponse<ForumModerationQueueItemResponse>(response);
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

export async function getForumModerationPosts(): Promise<ForumModerationQueueItemResponse[]> {
  const response = await fetch(`${ADMIN_API_BASE_URL}/forum-risk/posts`, {
    headers: authHeaders(),
  });
  return handleResponse<ForumModerationQueueItemResponse[]>(response);
}

export async function getReportModerationReports(): Promise<ReportModerationQueueItemResponse[]> {
  const response = await fetch(`${ADMIN_API_BASE_URL}/report-risk/reports`, {
    headers: authHeaders(),
  });
  return handleResponse<ReportModerationQueueItemResponse[]>(response);
}

export async function reviewFlaggedForumPost(
  id: number
): Promise<ForumModerationQueueItemResponse> {
  const response = await fetch(`${ADMIN_API_BASE_URL}/forum-risk/posts/${id}/review`, {
    method: "PUT",
    headers: authHeaders(),
  });
  return handleResponse<ForumModerationQueueItemResponse>(response);
}

export async function dismissFlaggedForumPost(
  id: number
): Promise<ForumModerationQueueItemResponse> {
  const response = await fetch(`${ADMIN_API_BASE_URL}/forum-risk/posts/${id}/dismiss`, {
    method: "PUT",
    headers: authHeaders(),
  });
  return handleResponse<ForumModerationQueueItemResponse>(response);
}

export async function escalateFlaggedForumPost(
  id: number
): Promise<ForumModerationQueueItemResponse> {
  const response = await fetch(`${ADMIN_API_BASE_URL}/forum-risk/posts/${id}/escalate`, {
    method: "PUT",
    headers: authHeaders(),
  });
  return handleResponse<ForumModerationQueueItemResponse>(response);
}

export async function reviewFlaggedReport(
  id: number
): Promise<ReportModerationQueueItemResponse> {
  const response = await fetch(`${ADMIN_API_BASE_URL}/report-risk/reports/${id}/review`, {
    method: "PUT",
    headers: authHeaders(),
  });
  return handleResponse<ReportModerationQueueItemResponse>(response);
}

export async function dismissFlaggedReport(
  id: number
): Promise<ReportModerationQueueItemResponse> {
  const response = await fetch(`${ADMIN_API_BASE_URL}/report-risk/reports/${id}/dismiss`, {
    method: "PUT",
    headers: authHeaders(),
  });
  return handleResponse<ReportModerationQueueItemResponse>(response);
}

export async function escalateFlaggedReport(
  id: number
): Promise<ReportModerationQueueItemResponse> {
  const response = await fetch(`${ADMIN_API_BASE_URL}/report-risk/reports/${id}/escalate`, {
    method: "PUT",
    headers: authHeaders(),
  });
  return handleResponse<ReportModerationQueueItemResponse>(response);
}

export async function addSpecialistResponse(
  id: number,
  message: string
): Promise<ReportModerationQueueItemResponse> {
  const response = await fetch(`${ADMIN_API_BASE_URL}/report-risk/reports/${id}/respond`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ message } satisfies SpecialistResponseRequest),
  });
  return handleResponse<ReportModerationQueueItemResponse>(response);
}

export async function revealReportIdentity(
  id: number
): Promise<ReportModerationQueueItemResponse> {
  const response = await fetch(`${ADMIN_API_BASE_URL}/report-risk/reports/${id}/reveal-identity`, {
    method: "PUT",
    headers: authHeaders(),
  });
  return handleResponse<ReportModerationQueueItemResponse>(response);
}
