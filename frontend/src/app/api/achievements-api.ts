import { getToken } from "../lib/auth-storage";

const ACHIEVEMENTS_API_BASE_URL = "http://localhost:8080/api/achievements";

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

export type AchievementResponse = {
  id: string;
  earned: boolean;
  earnedAt: string | null;
};

export async function getAchievements(): Promise<AchievementResponse[]> {
  const token = getToken();
  const response = await fetch(ACHIEVEMENTS_API_BASE_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("Unauthorized");
    await parseError(response);
  }

  return response.json();
}