import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, FileText, GraduationCap, MapPin, Search, Star, User } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { advisers } from "@/data/mock";

export const Route = createFileRoute("/student/dashboard")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — Mentora" },
      { name: "description", content: "Your Mentora student dashboard for tracking mentor consultations and university applications." },
    ],
  }),
  component: StudentDashboardPage,
});

function StudentDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentDashboardContent />
    </ProtectedRoute>
  );
}

function StudentDashboardContent() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Welcome Banner */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-secondary px-3 py-1 text-xs font-bold text-primary">
                <GraduationCap className="h-3.5 w-3.5" /> Student Workspace
              </span>
              <h1 className="mt-3 text-2xl font-extrabold text-foreground sm:text-3xl">
                Welcome back, {user?.full_name || "Student"}!
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Targeting: <strong className="text-foreground">{user?.intended_country || "Germany"}</strong> • {user?.subject_field || "Computer Science"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button asChild variant="outline" size="lg" className="font-bold">
                <Link to={`/student/${user?.username || user?.id || "me"}` as any}>
                  <User className="mr-1.5 h-4 w-4" /> My Profile
                </Link>
              </Button>
              <Button asChild size="lg" className="font-bold shadow-lift">
                <Link to="/advisers">
                  <Search className="mr-1.5 h-4 w-4" /> Find Mentors
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Booked Consultations</p>
              <p className="mt-2 text-3xl font-extrabold text-primary">2</p>
              <p className="mt-1 text-xs text-muted-foreground">Next session tomorrow, 7:00 PM</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Shortlisted Mentors</p>
              <p className="mt-2 text-3xl font-extrabold text-primary">4</p>
              <p className="mt-1 text-xs text-muted-foreground">Matched by grades & target country</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Application Status</p>
              <p className="mt-2 text-3xl font-extrabold text-primary">On Track</p>
              <p className="mt-1 text-xs text-muted-foreground">SOP Review pending</p>
            </div>
          </div>

          {/* Recommended Mentors */}
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-foreground">Matched Mentors for You</h2>
              <Link to="/advisers" className="text-xs font-bold text-primary hover:underline">
                View all mentors →
              </Link>
            </div>

            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {advisers.slice(0, 3).map((a) => (
                <div key={a.id} className="rounded-2xl border border-border bg-card p-5 shadow-card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <img src={a.photo} alt={a.name} className="h-12 w-12 rounded-xl object-cover border border-border" />
                      <div>
                        <h3 className="font-bold text-foreground text-sm">{a.name}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {a.location}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-foreground/80 font-medium line-clamp-2">{a.headline}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-xs font-extrabold text-primary">৳{a.price} / session</span>
                    <Button asChild size="sm" variant="outline">
                      <Link to="/advisers/$adviserId" params={{ adviserId: a.id }}>
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
