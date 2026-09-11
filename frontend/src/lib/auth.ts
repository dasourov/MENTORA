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

export type UserProfile = {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  auth_provider: "email" | "google";
  email_verified: boolean;
  role: UserRole;
  onboarding_status: OnboardingStatus;
  current_step?: string;
  account_status: AccountStatus;
  advisor_verification_status?: "pending" | "approved" | "rejected";
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
  created_at: string;
  updated_at: string;
};

export type AuthState = {
  user: UserProfile | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole;
  emailVerified: boolean;
  onboardingStatus: OnboardingStatus;
  accountStatus: AccountStatus;
};

const STORAGE_KEY_USERS = "mentora_users_db";
const STORAGE_KEY_CURRENT = "mentora_current_user_id";

// Initial seed mock users
const initialUsers: UserProfile[] = [
  {
    id: "user-student-demo",
    auth_user_id: "auth-student-1",
    full_name: "Rafiul Islam",
    email: "student@example.com",
    auth_provider: "email",
    email_verified: true,
    role: "student",
    onboarding_status: "completed",
    account_status: "active",
    country: "Bangladesh",
    intended_country: "Germany",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "user-advisor-demo",
    auth_user_id: "auth-advisor-1",
    full_name: "Tanvir Ahmed",
    email: "advisor@example.com",
    auth_provider: "email",
    email_verified: true,
    role: "advisor",
    onboarding_status: "completed",
    advisor_verification_status: "approved",
    account_status: "active",
    country: "Bangladesh",
    headline: "Germany Master's Adviser",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "user-admin-demo",
    auth_user_id: "auth-admin-1",
    full_name: "Mentora Admin",
    email: "admin@example.com",
    auth_provider: "email",
    email_verified: true,
    role: "admin",
    onboarding_status: "completed",
    account_status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

function getUsersDB(): UserProfile[] {
  if (typeof window === "undefined") return initialUsers;
  const stored = localStorage.getItem(STORAGE_KEY_USERS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(initialUsers));
    return initialUsers;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return initialUsers;
  }
}

function saveUsersDB(users: UserProfile[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }
}

export function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY_CURRENT);
}

export function setCurrentUserId(id: string | null) {
  if (typeof window !== "undefined") {
    if (id) {
      localStorage.setItem(STORAGE_KEY_CURRENT, id);
    } else {
      localStorage.removeItem(STORAGE_KEY_CURRENT);
    }
  }
}

export async function apiCheckEmail(email: string): Promise<{ exists: boolean; verified?: boolean }> {
  const users = getUsersDB();
  const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  return { exists: !!found, verified: found ? found.email_verified : false };
}

export async function apiGetUserByEmail(email: string): Promise<UserProfile | null> {
  const users = getUsersDB();
  return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
}

export async function apiCreateUser(data: {
  full_name: string;
  email: string;
  auth_provider?: "email" | "google";
}): Promise<UserProfile> {
  const users = getUsersDB();
  const existing = users.find((u) => u.email.toLowerCase() === data.email.trim().toLowerCase());
  if (existing) return existing;

  const newUser: UserProfile = {
    id: `user-${Date.now()}`,
    auth_user_id: `auth-${Date.now()}`,
    full_name: data.full_name,
    email: data.email.trim().toLowerCase(),
    auth_provider: data.auth_provider || "email",
    email_verified: data.auth_provider === "google",
    role: null,
    onboarding_status: "role_selection",
    account_status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsersDB(users);
  return newUser;
}

export async function apiUpdateUser(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  const users = getUsersDB();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) throw new Error("User not found");

  const updated: UserProfile = {
    ...users[index]!,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  users[index] = updated;
  saveUsersDB(users);
  return updated;
}

export function resolveAuthenticatedRoute(profile: UserProfile | null, returnTo?: string): string {
  if (!profile) return "/login";
  if (profile.account_status !== "active") return "/";
  if (!profile.email_verified) return "/verify-email";
  if (!profile.role) return "/onboarding/select-role";

  if (profile.role === "student") {
    if (profile.onboarding_status !== "completed") {
      return `/student/onboarding`;
    }
    return returnTo || "/student/dashboard";
  }

  if (profile.role === "advisor") {
    if (profile.onboarding_status !== "completed" && profile.onboarding_status !== "submitted") {
      return `/advisor/onboarding`;
    }
    return returnTo || "/advisor/dashboard";
  }

  if (profile.role === "admin") {
    return "/admin";
  }

  return "/";
}
