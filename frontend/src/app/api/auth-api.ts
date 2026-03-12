import { getToken } from "../lib/auth-storage";
const API_BASE_URL = "http://localhost:8080/api/auth";

export interface SignUpRequest {
  email: string;
  nickname: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  nickname: string;
  role: string;
}

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

export async function signUp(data: SignUpRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await parseError(response);
  }

  return response.json();
}

export async function signIn(data: SignInRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await parseError(response);
  }

  return response.json();
}

export interface CurrentUserResponse {
  email: string;
  nickname: string;
  role: string;
}

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/me`, {
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