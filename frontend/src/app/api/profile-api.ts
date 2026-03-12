import { getToken } from "../lib/auth-storage";

import { API_BASE_URL } from "./api-config";
const PROFILE_API_BASE_URL = `${API_BASE_URL}/api/profile`;

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

export interface ProfileResponse {
  email: string;
  nickname: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  privacyModeEnabled: boolean;
  notificationsEnabled: boolean;
  themePreference: string;
  languagePreference: string;
  memberSince: string;
}

export interface UpdateProfileRequest {
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  privacyModeEnabled: boolean;
  notificationsEnabled: boolean;
  themePreference: string;
  languagePreference: string;
}

export async function getMyProfile(): Promise<ProfileResponse> {
  const token = getToken();

  const response = await fetch(`${PROFILE_API_BASE_URL}/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    await parseError(response);
  }

  return response.json();
}

export async function updateMyProfile(
  data: UpdateProfileRequest
): Promise<ProfileResponse> {
  const token = getToken();

  const response = await fetch(`${PROFILE_API_BASE_URL}/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await parseError(response);
  }

  return response.json();
}