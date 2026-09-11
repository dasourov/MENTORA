import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Calendar, CheckCircle2, Clock, DollarSign, Star, Users } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const Route = createFileRoute("/advisor/dashboard")({
  head: () => ({
    meta: [
      { title: "Adviser Dashboard — Mentora" },
      { name: "description", content: "Manage student consultations, bookings, and services on Mentora." },
    ],
  }),
  component: AdviserDashboardPage,
});

function AdviserDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["advisor"]}>
      <AdviserDashboardContent />
    </ProtectedRoute>
  );
}

function AdviserDashboardContent() {
  const { user } = useAuth();
  const isPending = user?.advisor_verification_status === "pending" || user?.onboarding_status === "submitted";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Verification Status Banner */}
          {isPending ? (
            <div className="mb-6 rounded-2xl border border-[#ec1c24]/30 bg-[#fdf2f2] p-5 flex items-start gap-3.5">
              <Clock className="h-5 w-5 text-[#ec1c24] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-bold text-[#ec1c24]">Your adviser profile is currently under review.</h2>
                <p className="mt-1 text-xs text-foreground/80 leading-relaxed">
                  Our verification team is checking your identity document and university transcripts. Verification usually takes up to 3 working days. You can edit your profile while waiting.
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-6 rounded-2xl border border-primary/20 bg-secondary p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <p className="text-sm font-bold text-primary">Verified Adviser Profile Active</p>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">Publicly visible on Mentora</span>
            </div>
          )}

          {/* Header */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
                Welcome, {user?.full_name || "Adviser"}!
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Headline: <strong className="text-foreground">{user?.headline || "Germany Master's & Public University Adviser"}</strong>
              </p>
            </div>
            <Button asChild variant="outline" className="font-bold">
              <Link to="/advisor/onboarding">Edit Profile</Link>
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Upcoming Sessions</p>
              <p className="mt-2 text-3xl font-extrabold text-primary">3</p>
              <p className="mt-1 text-xs text-muted-foreground">This week</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Earnings</p>
              <p className="mt-2 text-3xl font-extrabold text-primary">৳42,500</p>
              <p className="mt-1 text-xs text-muted-foreground">34 completed sessions</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Students Guided</p>
              <p className="mt-2 text-3xl font-extrabold text-primary">86</p>
              <p className="mt-1 text-xs text-muted-foreground">In 2026</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rating</p>
              <p className="mt-2 text-3xl font-extrabold text-primary flex items-center gap-1">
                4.9 <Star className="h-5 w-5 fill-warning text-warning" />
              </p>
              <p className="mt-1 text-xs text-muted-foreground">From 48 reviews</p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
