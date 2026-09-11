import React, { createContext, useContext, useEffect, useState } from "react";
import {
  apiCheckEmail,
  apiCreateUser,
  apiGetUserByEmail,
  apiUpdateUser,
  getCurrentUserId,
  resolveAuthenticatedRoute,
  setCurrentUserId,
  type AccountStatus,
  type AuthState,
  type OnboardingStatus,
  type UserProfile,
  type UserRole,
} from "@/lib/auth";

type AuthContextType = AuthState & {
  checkEmail: (email: string) => Promise<{ exists: boolean; verified?: boolean }>;
  signIn: (email: string, password: string, returnTo?: string) => Promise<{ success: boolean; target?: string; error?: string }>;
  quickDemoLogin: (role: "student" | "advisor") => Promise<{ success: boolean; target: string }>;
  signUp: (data: { full_name: string; email: string; password: string; role?: "student" | "advisor" }) => Promise<{ success: boolean; target?: string; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; target?: string }>;
  signOut: () => void;
  sendVerificationEmail: (email: string) => Promise<boolean>;
  verifyEmail: () => Promise<boolean>;
  selectRole: (role: "student" | "advisor") => Promise<{ success: boolean; target: string }>;
  saveOnboardingStep: (stepData: Record<string, any>, stepName: string, isLastStep?: boolean) => Promise<{ target: string }>;
  resetPassword: (email: string) => Promise<boolean>;
  resolveRoute: (returnTo?: string) => string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const currentId = getCurrentUserId();
      if (currentId) {
        try {
          const users = JSON.parse(localStorage.getItem("mentora_users_db") || "[]");
          const foundUser = users.find((u: UserProfile) => u.id === currentId) || null;
          setUser(foundUser);
        } catch (e) {
          console.error("Failed to restore session", e);
        }
      }
      setIsLoading(false);
    }
    initAuth();
  }, []);

  const checkEmail = async (email: string) => {
    return apiCheckEmail(email);
  };

  const signIn = async (email: string, _password: string, returnTo?: string) => {
    setIsLoading(true);
    let existingUser = await apiGetUserByEmail(email);

    // Auto-create or seed if not present
    if (!existingUser) {
      const isAdvisor = email.includes("advisor") || email.includes("mentor");
      existingUser = await apiCreateUser({
        full_name: email.split("@")[0]?.replace(".", " ") || "User",
        email: email,
        auth_provider: "email",
      });
      existingUser = await apiUpdateUser(existingUser.id, {
        email_verified: true,
        role: isAdvisor ? "advisor" : "student",
        onboarding_status: "completed",
        ...(isAdvisor ? { advisor_verification_status: "approved" as const } : {}),
      });
    }

    setCurrentUserId(existingUser.id);
    setUser(existingUser);
    setIsLoading(false);
    const target = resolveAuthenticatedRoute(existingUser, returnTo);
    return { success: true, target };
  };

  const quickDemoLogin = async (role: "student" | "advisor") => {
    setIsLoading(true);
    const demoEmail = role === "student" ? "student@example.com" : "advisor@example.com";
    let demoUser = await apiGetUserByEmail(demoEmail);

    if (!demoUser) {
      demoUser = await apiCreateUser({
        full_name: role === "student" ? "Rafiul Islam (Student)" : "Tanvir Ahmed (Advisor)",
        email: demoEmail,
        auth_provider: "email",
      });
      demoUser = await apiUpdateUser(demoUser.id, {
        email_verified: true,
        role,
        onboarding_status: "completed",
        ...(role === "advisor" ? { advisor_verification_status: "approved" as const } : {}),
      });
    }

    setCurrentUserId(demoUser.id);
    setUser(demoUser);
    setIsLoading(false);
    const target = resolveAuthenticatedRoute(demoUser);
    return { success: true, target };
  };

  const signUp = async (data: { full_name: string; email: string; password: string; role?: "student" | "advisor" }) => {
    setIsLoading(true);
    let newUser = await apiCreateUser({
      full_name: data.full_name,
      email: data.email,
      auth_provider: "email",
    });

    if (data.role) {
      newUser = await apiUpdateUser(newUser.id, {
        role: data.role,
        onboarding_status: data.role === "student" ? "profile" : "personal",
        email_verified: true,
      });
    }

    setCurrentUserId(newUser.id);
    setUser(newUser);
    setIsLoading(false);

    const target = newUser.role
      ? newUser.role === "student"
        ? "/student/dashboard"
        : "/advisor/dashboard"
      : newUser.email_verified
        ? "/onboarding/select-role"
        : "/verify-email";

    return { success: true, target };
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    let googleUser = await apiGetUserByEmail("student.google@mentora.com");
    if (!googleUser) {
      googleUser = await apiCreateUser({
        full_name: "Sabbir Ahmed (Google)",
        email: "student.google@mentora.com",
        auth_provider: "google",
      });
      googleUser = await apiUpdateUser(googleUser.id, {
        email_verified: true,
        role: "student",
        onboarding_status: "completed",
      });
    }

    setCurrentUserId(googleUser.id);
    setUser(googleUser);
    setIsLoading(false);

    const target = resolveAuthenticatedRoute(googleUser);
    return { success: true, target };
  };

  const signOut = () => {
    setCurrentUserId(null);
    setUser(null);
  };

  const sendVerificationEmail = async (_email: string) => {
    return true;
  };

  const verifyEmail = async () => {
    if (!user) return false;
    const updated = await apiUpdateUser(user.id, { email_verified: true });
    setUser(updated);
    return true;
  };

  const selectRole = async (role: "student" | "advisor") => {
    if (!user) throw new Error("Unauthenticated");
    const initialStatus = role === "student" ? "profile" : "personal";
    const updated = await apiUpdateUser(user.id, {
      role,
      onboarding_status: initialStatus,
      current_step: initialStatus,
    });
    setUser(updated);
    const target = role === "student" ? "/student/onboarding" : "/advisor/onboarding";
    return { success: true, target };
  };

  const saveOnboardingStep = async (stepData: Record<string, any>, stepName: string, isLastStep = false) => {
    if (!user) throw new Error("Unauthenticated");
    const nextStatus = isLastStep
      ? user.role === "advisor"
        ? "submitted"
        : "completed"
      : (stepName as OnboardingStatus);

    const updated = await apiUpdateUser(user.id, {
      ...stepData,
      onboarding_status: nextStatus,
      current_step: stepName,
      ...(isLastStep && user.role === "advisor" ? { advisor_verification_status: "pending" } : {}),
    });

    setUser(updated);
    const target = resolveAuthenticatedRoute(updated);
    return { target };
  };

  const resetPassword = async (_email: string) => {
    return true;
  };

  const resolveRoute = (returnTo?: string) => {
    return resolveAuthenticatedRoute(user, returnTo);
  };

  const authState: AuthState = {
    user,
    profile: user,
    isAuthenticated: !!user,
    isLoading,
    role: user?.role || null,
    emailVerified: user?.email_verified || false,
    onboardingStatus: user?.onboarding_status || null,
    accountStatus: user?.account_status || null,
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        checkEmail,
        signIn,
        quickDemoLogin,
        signUp,
        signInWithGoogle,
        signOut,
        sendVerificationEmail,
        verifyEmail,
        selectRole,
        saveOnboardingStep,
        resetPassword,
        resolveRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
