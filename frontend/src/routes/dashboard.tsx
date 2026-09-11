import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookMarked,
  CalendarCheck,
  FileText,
  Heart,
  LayoutDashboard,
  MessagesSquare,
  Route as RouteIcon,
  Settings,
  Users,
} from "lucide-react";
import { DashboardShell, StatCard, type NavItem } from "@/components/dashboard/DashboardShell";
import { Avatar, Pill } from "@/components/site/Badges";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { advisers, formatBDT, popularServices, roadmapStages } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Student dashboard — Mentora" },
      {
        name: "description",
        content: "Track your study-abroad profile, upcoming consultations, messages and documents.",
      },
      { property: "og:title", content: "Student dashboard — Mentora" },
      { property: "og:description", content: "Your study-abroad application command centre." },
    ],
  }),
  component: StudentDashboard,
});

const items: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "My Advisers", icon: Users },
  { label: "Bookings", icon: CalendarCheck },
  { label: "Messages", icon: MessagesSquare },
  { label: "Application Roadmap", icon: RouteIcon },
  { label: "Documents", icon: FileText },
  { label: "Saved Advisers", icon: Heart },
  { label: "Settings", icon: Settings },
];

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function StudentDashboard() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentDashboardContent />
    </ProtectedRoute>
  );
}

function StudentDashboardContent() {
  const [active, setActive] = useState("Overview");

  return (
    <DashboardShell
      items={items}
      active={active}
      onSelect={setActive}
      title={active}
      subtitle="Nafisa Tabassum · Master's, Germany intake Winter 2027"
      actions={
        <Button asChild size="sm">
          <Link to="/advisers">Find advisers</Link>
        </Button>
      }
    >
      {active === "Application Roadmap" ? (
        <Roadmap />
      ) : active === "Overview" ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Profile completion" value="78%" hint="Add IELTS score to reach 100%" />
            <StatCard label="Adviser matches" value="14" hint="6 available this week" icon={Users} />
            <StatCard label="Upcoming consultation" value="Mon, 7:00 PM" hint="Tanvir Ahmed · Shortlist review" icon={CalendarCheck} />
            <StatCard label="Current stage" value="Shortlisting" hint="Stage 3 of 8" icon={RouteIcon} />
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-6">
              <Card title="Next task">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Upload transcripts for APS verification
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Due in 4 days · Requested by Tanvir Ahmed</p>
                  </div>
                  <Button size="sm">Upload documents</Button>
                </div>
              </Card>

              <Card title="Recently viewed advisers">
                <ul className="divide-y divide-border">
                  {advisers.slice(0, 3).map((a) => (
                    <li key={a.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <Avatar initials={a.photo} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-foreground">{a.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{a.specialisation}</p>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link to="/advisers/$adviserId" params={{ adviserId: a.id }}>
                          View
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="space-y-6">
              <Card title="Profile completion">
                <Progress value={78} className="h-2" />
                <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <li>✓ Academic results added</li>
                  <li>✓ Destination preferences set</li>
                  <li>• IELTS score pending</li>
                </ul>
              </Card>
              <Card title="Recommended services">
                <ul className="space-y-3">
                  {popularServices.slice(0, 3).map((s) => (
                    <li key={s.name} className="flex items-center justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-foreground">{s.name}</span>
                        <span className="text-xs text-muted-foreground">From {formatBDT(s.price)}</span>
                      </span>
                      <Button asChild size="sm" variant="ghost" className="text-primary">
                        <Link to="/advisers">Book</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState label={active} />
      )}
    </DashboardShell>
  );
}

function Roadmap() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Stages complete" value="2 of 8" />
        <StatCard label="Current stage" value="University shortlisting" />
        <StatCard label="Target intake" value="Winter 2027" />
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="label-caps text-muted-foreground">Application roadmap</h2>
        <ol className="mt-6 space-y-0">
          {roadmapStages.map((s, i) => (
            <li key={s.name} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold",
                    s.status === "done"
                      ? "bg-success text-success-foreground"
                      : s.status === "current"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-surface text-muted-foreground",
                  )}
                >
                  {i + 1}
                </span>
                {i < roadmapStages.length - 1 && <span className="my-1 w-px flex-1 bg-border" />}
              </div>
              <div className="pb-7">
                <p className="text-sm font-bold text-foreground">{s.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {s.status === "done" ? "Completed" : s.status === "current" ? "In progress" : "Not started"}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <h2 className="label-caps text-muted-foreground">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-14 text-center">
      <BookMarked className="mx-auto h-8 w-8 text-primary" />
      <h2 className="mt-4 text-lg font-bold text-foreground">Nothing in {label} yet</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Once you book your first consultation, everything related to {label.toLowerCase()} appears here.
      </p>
      <Button asChild className="mt-6">
        <Link to="/advisers">Browse advisers</Link>
      </Button>
      <div className="mt-6 flex justify-center gap-2">
        <Pill>Verified advisers</Pill>
        <Pill>From ৳500</Pill>
      </div>
    </div>
  );
}