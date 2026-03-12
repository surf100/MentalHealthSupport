import { getToken } from "../lib/auth-storage";

import { API_BASE_URL } from "./api-config";
const DASHBOARD_API_BASE_URL = `${API_BASE_URL}/api/dashboard`;

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

export type DashboardProfile = {
  id: number;
  nickname: string;
  email: string;
  avatar: string | null;
  createdAt: string;
};

export type DashboardStats = {
  reportsCount: number;
  notificationsCount: number;
  postsCount: number;
  achievementsCount: number;
};

export type DashboardActivity = {
  type: string;
  title: string;
  description: string;
  timestampLabel: string;
  createdAt: string;
};

export type DashboardResponse = {
  welcomeName: string;
  profile: DashboardProfile;
  stats: DashboardStats;
  recentActivity: DashboardActivity[];
};

export async function getDashboard(): Promise<DashboardResponse> {
  const token = getToken();

  const response = await fetch(`${DASHBOARD_API_BASE_URL}`, {
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

    await parseError(response);
  }

  return response.json();
}