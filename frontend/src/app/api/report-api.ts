import { getToken } from "../lib/auth-storage";

const REPORT_API_BASE_URL = "http://localhost:8080/api/reports";

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
    if (response.status === 404) throw new Error("Report not found");
    await parseError(response);
  }
  return response.json();
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReportCategory =
  | "HARASSMENT"
  | "DISCRIMINATION"
  | "MENTAL_HEALTH"
  | "SAFETY"
  | "OTHER";

export type ReportStatus = "SUBMITTED" | "UNDER_REVIEW" | "RESOLVED";

export type CreateReportRequest = {
  title: string;
  description: string;
  category: ReportCategory;
  isAnonymous: boolean;
};

export type ReportResponse = {
  id: number;
  reference: string;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  isAnonymous: boolean;
  createdAt: string;
};

export type TimelineItem = {
  id: number;
  title: string;
  description: string;
  occurredAt: string;
};

export type ReportDetailResponse = ReportResponse & {
  timeline: TimelineItem[];
};

// ─── API calls ────────────────────────────────────────────────────────────────

export async function createReport(
  payload: CreateReportRequest
): Promise<ReportResponse> {
  const response = await fetch(REPORT_API_BASE_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<ReportResponse>(response);
}

export async function getMyReports(): Promise<ReportResponse[]> {
  const response = await fetch(REPORT_API_BASE_URL, {
    method: "GET",
    headers: authHeaders(),
  });
  return handleResponse<ReportResponse[]>(response);
}

export async function getReportById(id: number): Promise<ReportDetailResponse> {
  const response = await fetch(`${REPORT_API_BASE_URL}/${id}`, {
    method: "GET",
    headers: authHeaders(),
  });
  return handleResponse<ReportDetailResponse>(response);
}