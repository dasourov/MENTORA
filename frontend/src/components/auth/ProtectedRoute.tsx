import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { type UserRole } from "@/lib/auth";

export function ProtectedRoute({
  children,
  allowedRoles,
  requireOnboarding = true,
}: {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireOnboarding?: boolean;
}) {
  const { isAuthenticated, isLoading, user, resolveRoute } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        navigate({ to: "/login" });
        return;
      }

      if (user.account_status !== "active") {
        navigate({ to: "/" });
        return;
      }

      if (!user.email_verified) {
        navigate({ to: "/verify-email" });
        return;
      }

      if (!user.role) {
        navigate({ to: "/onboarding/select-role" });
        return;
      }

      if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
        const correctTarget = resolveRoute();
        navigate({ to: correctTarget as any });
        return;
      }

      if (requireOnboarding && user.onboarding_status !== "completed" && user.onboarding_status !== "submitted") {
        const correctTarget = resolveRoute();
        navigate({ to: correctTarget as any });
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, requireOnboarding, navigate, resolveRoute]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Loading Mentora...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return <>{children}</>;
}
