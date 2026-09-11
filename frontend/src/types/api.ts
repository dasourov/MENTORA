/**
 * AUTO-GENERATED FILE - DO NOT MODIFY DIRECTLY
 * Generated from Mentora FastAPI Pydantic Schemas
 */

export type UserRole = "student" | "advisor" | "admin" | null;

export type OnboardingStatus =
  | "role_selection"
  | "profile"
  | "education"
  | "goals"
  | "support"
  | "personal"
  | "expertise"
  | "background"
  | "pricing"
  | "verification"
  | "submitted"
  | "completed"
  | null;

export type AccountStatus = "active" | "suspended" | "deleted" | null;

export type AdvisorVerificationStatus = "pending" | "approved" | "rejected" | null;

export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface TokenPayload {
  sub?: string;
  exp?: number;
  email?: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  return_to?: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  role?: "student" | "advisor";
}

export interface QuickDemoLoginRequest {
  role: "student" | "advisor" | "admin";
}

export interface CheckEmailRequest {
  email: string;
}

export interface CheckEmailResponse {
  exists: boolean;
  verified: boolean;
}

export interface GoogleAuthRequest {
  email: string;
  full_name: string;
  id_token?: string;
}

export interface SelectRoleRequest {
  role: "student" | "advisor";
}

export interface VerifyEmailRequest {
  code?: string;
}

export interface UserProfile {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  auth_provider: "email" | "google";
  email_verified: boolean;
  role: UserRole;
  onboarding_status: OnboardingStatus;
  current_step?: string | null;
  account_status: AccountStatus;
  advisor_verification_status?: AdvisorVerificationStatus;

  phone_number?: string | null;
  country?: string | null;
  headline?: string | null;
  bio?: string | null;
  education_level?: string | null;
  institution?: string | null;
  subject_field?: string | null;
  intended_country?: string | null;
  budget?: string | null;
  services_needed?: string[] | null;

  created_at?: string | null;
  updated_at?: string | null;
}

export interface UserUpdate {
  full_name?: string;
  role?: UserRole;
  email_verified?: boolean;
  onboarding_status?: string;
  current_step?: string;
  advisor_verification_status?: AdvisorVerificationStatus;
  phone_number?: string;
  country?: string;
  headline?: string;
  bio?: string;
  education_level?: string;
  institution?: string;
  subject_field?: string;
  intended_country?: string;
  budget?: string;
  services_needed?: string[];
}

export interface OnboardingStepRequest {
  step_name: string;
  is_last_step: boolean;
  step_data: Record<string, any>;
}

export interface AuthResponse {
  success: boolean;
  user: UserProfile;
  access_token: string;
  token_type: string;
  target: string;
}
