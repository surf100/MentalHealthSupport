import { getToken } from "../lib/auth-storage";

const FORUM_API_BASE_URL = "http://localhost:8080/api/forum";

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
    if (response.status === 404) throw new Error("Not found");
    await parseError(response);
  }
  return response.json();
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type ForumCategory =
  | "BULLYING_SUPPORT"
  | "STRESS_AND_ANXIETY"
  | "ADVICE"
  | "POSITIVE_STORIES"
  | "GENERAL_DISCUSSION";

export type ForumPostResponse = {
  id: number;
  title: string;
  preview: string;
  category: ForumCategory;
  author: string;
  commentCount: number;
  likeCount: number;
  likedByMe: boolean;
  createdAt: string;
};

export type ForumCommentResponse = {
  id: number;
  author: string;
  content: string;
  createdAt: string;
};

export type ForumPostDetailResponse = {
  id: number;
  title: string;
  content: string;
  category: ForumCategory;
  author: string;
  likeCount: number;
  likedByMe: boolean;
  createdAt: string;
  comments: ForumCommentResponse[];
};

export type CreatePostRequest = {
  title: string;
  content: string;
  category: ForumCategory;
  anonymous: boolean;
};

export type CreateCommentRequest = {
  content: string;
  anonymous: boolean;
};

export type LikeResponse = {
  liked: boolean;
  likeCount: number;
};

// ─── API calls ────────────────────────────────────────────────────────────────

export async function getPosts(category?: ForumCategory): Promise<ForumPostResponse[]> {
  const url = category
    ? `${FORUM_API_BASE_URL}/posts?category=${category}`
    : `${FORUM_API_BASE_URL}/posts`;
  const response = await fetch(url, {
    method: "GET",
    headers: authHeaders(),
  });
  return handleResponse<ForumPostResponse[]>(response);
}

export async function getPostById(id: number): Promise<ForumPostDetailResponse> {
  const response = await fetch(`${FORUM_API_BASE_URL}/posts/${id}`, {
    method: "GET",
    headers: authHeaders(),
  });
  return handleResponse<ForumPostDetailResponse>(response);
}

export async function createPost(payload: CreatePostRequest): Promise<ForumPostResponse> {
  const response = await fetch(`${FORUM_API_BASE_URL}/posts`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<ForumPostResponse>(response);
}

export async function addComment(
  postId: number,
  payload: CreateCommentRequest
): Promise<ForumCommentResponse> {
  const response = await fetch(`${FORUM_API_BASE_URL}/posts/${postId}/comments`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<ForumCommentResponse>(response);
}

export async function toggleLike(postId: number): Promise<LikeResponse> {
  const response = await fetch(`${FORUM_API_BASE_URL}/posts/${postId}/like`, {
    method: "POST",
    headers: authHeaders(),
  });
  return handleResponse<LikeResponse>(response);
}