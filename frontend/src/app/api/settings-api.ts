import { getToken } from "../lib/auth-storage";

import { API_BASE_URL } from "./api-config";
const BASE_URL = `${API_BASE_URL}/api`;

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export interface SettingsResponse {
  email: string;
  nickname: string;
  notificationsEnabled: boolean;
  privacyModeEnabled: boolean;
  themePreference: string;
  languagePreference: string;
  token?: string;
}

export interface UpdateAccountRequest {
  nickname?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface UpdatePreferencesRequest {
  notificationsEnabled?: boolean;
  privacyModeEnabled?: boolean;
  themePreference?: string;
  languagePreference?: string;
}

export async function getSettings(): Promise<SettingsResponse> {
  const res = await fetch(`${BASE_URL}/profile/me`, {
    headers: authHeaders(),
  });
  return handleResponse<SettingsResponse>(res);
}

export async function updateAccountSettings(
  payload: UpdateAccountRequest
): Promise<SettingsResponse> {
  const res = await fetch(`${BASE_URL}/auth/update-account`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<SettingsResponse>(res);
}

export async function updatePreferences(
  payload: UpdatePreferencesRequest
): Promise<SettingsResponse> {
  const res = await fetch(`${BASE_URL}/profile/me`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<SettingsResponse>(res);
}