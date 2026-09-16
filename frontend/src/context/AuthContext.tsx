import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getToken,
  setToken,
  apiLogin,
  apiRegister,
  apiGetMe,
  apiSelectRole,
  apiSaveOnboarding,
  apiCheckEmail,
  apiLogout,
  apiUpdateProfile,
  apiSendPasscode,
  apiVerifyPasscode,
} from "@/lib/api";
import {
  resolveAuthenticatedRoute,
  type AccountStatus,
  type AuthState,
  type OnboardingStatus,
  type UserProfile,
  type UserRole,
} from "@/lib/auth";

type AuthContextType = AuthState & {
  checkEmail: (email: string) => Promise<{ exists: boolean; verified?: boolean }>;
  signIn: (email: string, password: string, returnTo?: string) => Promise<{ success: boolean; target?: string; error?: string }>;
  signUp: (data: { full_name: string; email: string; password: string; role?: "student" | "advisor" }) => Promise<{ success: boolean; requires_verification?: boolean; email?: string; target?: string; error?: string }>;
  signOut: () => void;
  sendPasscode: (email: string, purpose?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyPasscode: (email: string, code: string) => Promise<{ success: boolean; target?: string; error?: string }>;
  sendVerificationEmail: (email: string) => Promise<boolean>;
  verifyEmail: () => Promise<boolean>;
  selectRole: (role: "student" | "advisor") => Promise<{ success: boolean; target: string }>;
  saveOnboardingStep: (stepData: Record<string, any>, stepName: string, isLastStep?: boolean) => Promise<{ target: string }>;
  resetPassword: (email: string) => Promise<boolean>;
  resolveRoute: (returnTo?: string) => string;
  updateProfile: (updates: Partial<UserProfile>, identifier?: string) => Promise<UserProfile>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const token = getToken();
      if (token) {
        try {
          const profile = await apiGetMe();
          setUser(profile);
        } catch (err) {
          console.warn("Stored token is invalid or expired; resetting session.", err);
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    }
    initAuth();
  }, []);

  const checkEmail = async (email: string) => {
    try {
      return await apiCheckEmail(email);
    } catch {
      return { exists: false, verified: false };
    }
  };

  const signIn = async (email: string, password: string, returnTo?: string) => {
    setIsLoading(true);
    try {
      const res = await apiLogin(email, password, returnTo);
      setToken(res.access_token);
      setUser(res.user);
      setIsLoading(false);
      return { success: true, target: res.target };
    } catch (err: any) {
      setIsLoading(false);
      return {
        success: false,
        error: err?.message || "Invalid email or password. Please try again.",
      };
    }
  };

  const signUp = async (data: {
    full_name: string;
    email: string;
    password: string;
    role?: "student" | "advisor";
  }) => {
    setIsLoading(true);
    try {
      const res = await apiRegister(data);
      setIsLoading(false);
      if (res.requires_verification) {
        return {
          success: true,
          requires_verification: true,
          email: res.email,
          target: res.target || "/verify-email",
        };
      }
      if (res.access_token && res.user) {
        setToken(res.access_token);
        setUser(res.user);
      }
      return { success: true, target: res.target };
    } catch (err: any) {
      setIsLoading(false);
      return {
        success: false,
        error: err?.message || "Unable to create account. Please try again.",
      };
    }
  };

  const sendPasscode = async (email: string, purpose = "registration") => {
    try {
      const res = await apiSendPasscode(email, purpose);
      return { success: true, message: res.message };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Failed to send passcode. Please try again.",
      };
    }
  };

  const verifyPasscode = async (email: string, code: string) => {
    setIsLoading(true);
    try {
      const res = await apiVerifyPasscode(email, code);
      setToken(res.access_token);
      setUser(res.user);
      setIsLoading(false);
      return { success: true, target: res.target };
    } catch (err: any) {
      setIsLoading(false);
      return {
        success: false,
        error: err?.message || "Invalid or expired passcode. Please try again.",
      };
    }
  };

  const signOut = async () => {
    try {
      await apiLogout();
    } catch {
      // Ignore network errors on logout
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const sendVerificationEmail = async (_email: string) => {
    return true;
  };

  const verifyEmail = async () => {
    if (!user) return false;
    setUser({ ...user, email_verified: true });
    return true;
  };

  const selectRole = async (role: "student" | "advisor") => {
    try {
      const res = await apiSelectRole(role);
      setToken(res.access_token);
      setUser(res.user);
      return { success: true, target: res.target };
    } catch (err: any) {
      throw new Error(err?.message || "Failed to select role.");
    }
  };

  const saveOnboardingStep = async (
    stepData: Record<string, any>,
    stepName: string,
    isLastStep = false
  ) => {
    try {
      const res = await apiSaveOnboarding(stepData, stepName, isLastStep);
      setToken(res.access_token);
      setUser(res.user);
      return { target: res.target };
    } catch (err: any) {
      throw new Error(err?.message || "Failed to save onboarding step.");
    }
  };

  const resetPassword = async (_email: string) => {
    return true;
  };

  const resolveRoute = (returnTo?: string) => {
    return resolveAuthenticatedRoute(user, returnTo);
  };

  const updateProfile = async (updates: Partial<UserProfile>, identifier?: string) => {
    try {
      const updated = await apiUpdateProfile(updates, identifier);
      setUser(updated);
      return updated;
    } catch (err: any) {
      throw new Error(err?.message || "Failed to update profile.");
    }
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
        signUp,
        signOut,
        sendVerificationEmail,
        verifyEmail,
        sendPasscode,
        verifyPasscode,
        selectRole,
        saveOnboardingStep,
        resetPassword,
        resolveRoute,
        updateProfile,
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
