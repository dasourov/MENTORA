import type { UserProfile, UserRole } from "./auth";

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || "http://127.0.0.1:8000/api/v1";
const TOKEN_KEY = "mentora_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthApiResponse {
  success: boolean;
  user: UserProfile;
  access_token: string;
  token_type: string;
  target: string;
}

export interface RegisterApiResponse {
  success: boolean;
  requires_verification?: boolean;
  email: string;
  message?: string;
  access_token?: string;
  token_type?: string;
  target?: string;
  user?: UserProfile;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMsg =
      (isJson && data?.detail) ||
      (typeof data === "string" && data) ||
      `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export async function apiCheckEmail(
  email: string
): Promise<{ exists: boolean; verified: boolean }> {
  return apiRequest("/auth/check-email", {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });
}

export async function apiLogin(
  email: string,
  password: string,
  returnTo?: string
): Promise<AuthApiResponse> {
  return apiRequest<AuthApiResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
      return_to: returnTo,
    }),
  });
}

export async function apiRegister(data: {
  full_name: string;
  email: string;
  password: string;
  role?: "student" | "advisor";
}): Promise<RegisterApiResponse> {
  return apiRequest<RegisterApiResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      full_name: data.full_name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      role: data.role,
    }),
  });
}

export async function apiSendPasscode(
  email: string,
  purpose: string = "registration"
): Promise<{ success: boolean; message: string; email: string; expires_in_seconds: number }> {
  return apiRequest("/auth/send-passcode", {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase(), purpose }),
  });
}

export async function apiVerifyPasscode(
  email: string,
  code: string
): Promise<AuthApiResponse> {
  return apiRequest<AuthApiResponse>("/auth/verify-passcode", {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase(), code: code.trim() }),
  });
}

export async function apiGetMe(): Promise<UserProfile> {
  return apiRequest<UserProfile>("/auth/me", {
    method: "GET",
  });
}

export async function apiSelectRole(
  role: "student" | "advisor"
): Promise<AuthApiResponse> {
  return apiRequest<AuthApiResponse>("/auth/select-role", {
    method: "POST",
    body: JSON.stringify({ role }),
  });
}

export async function apiSaveOnboarding(
  stepData: Record<string, any>,
  stepName: string,
  isLastStep: boolean = false
): Promise<AuthApiResponse> {
  return apiRequest<AuthApiResponse>("/auth/onboarding", {
    method: "PUT",
    body: JSON.stringify({
      step_name: stepName,
      is_last_step: isLastStep,
      step_data: stepData,
    }),
  });
}

export async function apiLogout(): Promise<{ success: boolean; message: string }> {
  try {
    return await apiRequest("/auth/logout", { method: "POST" });
  } finally {
    setToken(null);
  }
}

export async function apiGetUser(identifier: string): Promise<UserProfile> {
  return apiRequest<UserProfile>(`/users/${encodeURIComponent(identifier)}`, {
    method: "GET",
  });
}

export async function apiUpdateProfile(
  payload: Partial<UserProfile>,
  identifier?: string
): Promise<UserProfile> {
  const endpoint = identifier
    ? `/users/${encodeURIComponent(identifier)}`
    : "/users/me";
  return apiRequest<UserProfile>(endpoint, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

