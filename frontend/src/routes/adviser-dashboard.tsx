import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BadgeCheck,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  MessagesSquare,
  Settings,
  Star,
  UserRound,
  Wallet,
  Wrench,
} from "lucide-react";
import { DashboardShell, StatCard, type NavItem } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { advisers, earnings, formatBDT, studentRequests } from "@/data/mock";

export const Route = createFileRoute("/adviser-dashboard")({
  head: () => ({
    meta: [
      { title: "Adviser dashboard — Mentora" },
      { name: "description", content: "Manage student requests, bookings, services, earnings and verification." },
      { property: "og:title", content: "Adviser dashboard — Mentora" },
      { property: "og:description", content: "Run your advising practice on Mentora." },
    ],
  }),
  component: AdviserDashboard,
});

const items: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Student Requests", icon: ClipboardList },
  { label: "Bookings", icon: CalendarDays },
  { label: "Calendar", icon: CalendarDays },
  { label: "Messages", icon: MessagesSquare },
  { label: "Services", icon: Wrench },
  { label: "Reviews", icon: Star },
  { label: "Earnings", icon: Wallet },
  { label: "Profile", icon: UserRound },
  { label: "Verification", icon: BadgeCheck },
  { label: "Settings", icon: Settings },
];

const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const slots = ["6 PM", "7 PM", "8 PM", "9 PM"];
const booked = new Set(["Mon-7 PM", "Mon-9 PM", "Wed-6 PM", "Thu-8 PM", "Sat-7 PM"]);
const maxEarn = Math.max(...earnings.map((e) => e.amount));

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function AdviserDashboard() {
  return (
    <ProtectedRoute allowedRoles={["advisor"]}>
      <AdviserDashboardContent />
    </ProtectedRoute>
  );
}

function AdviserDashboardContent() {
  const [active, setActive] = useState("Overview");
  const adviser = advisers[0]!;

  return (
    <DashboardShell
      items={items}
      active={active}
      onSelect={setActive}
      title={active}
      subtitle={`${adviser.name} · ${adviser.specialisation}`}
      actions={<Button size="sm" variant="outline">Set availability</Button>}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Monthly earnings" value={formatBDT(84600)} hint="+19% vs last month" icon={Wallet} />
          <StatCard label="Average rating" value={`${adviser.rating} / 5`} hint={`${adviser.reviews} reviews`} icon={Star} />
          <StatCard label="Response rate" value="98%" hint="Median reply 1h 20m" icon={MessagesSquare} />
          <StatCard label="Students helped" value={String(adviser.students)} hint="Since 2019" icon={UserRound} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <Panel title="Weekly calendar">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-center text-xs">
                  <thead>
                    <tr>
                      <th className="p-2 text-left text-muted-foreground">Time</th>
                      {week.map((d) => (
                        <th key={d} className="p-2 font-bold text-foreground">{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map((t) => (
                      <tr key={t}>
                        <td className="p-2 text-left text-muted-foreground">{t}</td>
                        {week.map((d) => {
                          const isBooked = booked.has(`${d}-${t}`);
                          return (
                            <td key={d} className="p-1">
                              <div
                                className={
                                  isBooked
                                    ? "rounded-lg bg-primary/10 py-2 font-semibold text-primary"
                                    : "rounded-lg border border-dashed border-border py-2 text-muted-foreground"
                                }
                              >
                                {isBooked ? "Booked" : "Open"}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title="New student requests">
              <ul className="divide-y divide-border">
                {studentRequests.map((r) => (
                  <li key={r.name} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.topic} · budget {formatBDT(r.budget)} · {r.when}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Decline</Button>
                      <Button size="sm">Accept</Button>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Consultation history">
              <ul className="divide-y divide-border text-sm">
                {[
                  ["Rafiul Islam", "SOP feedback session", "28 Jul", 1000],
                  ["Sadia Kabir", "University shortlist review", "26 Jul", 1500],
                  ["Naimul Hoque", "Profile evaluation", "24 Jul", 500],
                ].map(([n, s, d, p]) => (
                  <li key={String(n)} className="flex items-center justify-between gap-3 py-3 first:pt-0">
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-foreground">{n}</span>
                      <span className="text-xs text-muted-foreground">{s} · {d}</span>
                    </span>
                    <span className="font-bold text-foreground">{formatBDT(Number(p))}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel title="Profile completion">
              <Progress value={92} className="h-2" />
              <p className="mt-3 text-xs text-muted-foreground">92% — add two success stories to finish.</p>
            </Panel>
            <Panel title="Verification status">
              <ul className="space-y-2 text-sm">
                {["Identity", "Education", "Experience", "References"].map((v) => (
                  <li key={v} className="flex items-center gap-2 text-foreground/85">
                    <BadgeCheck className="h-4 w-4 text-success" /> {v} verified
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Earnings (6 months)">
              <div className="flex h-32 items-end gap-2">
                {earnings.map((e) => (
                  <div key={e.month} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-md bg-primary/80"
                      style={{ height: `${(e.amount / maxEarn) * 100}%` }}
                      title={formatBDT(e.amount)}
                    />
                    <span className="text-[0.65rem] text-muted-foreground">{e.month}</span>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Service management">
              <ul className="space-y-2 text-sm">
                {adviser.services.slice(0, 4).map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate text-foreground/85">{s.name}</span>
                    <span className="shrink-0 font-bold text-foreground">{formatBDT(s.price)}</span>
                  </li>
                ))}
              </ul>
              <Button size="sm" variant="outline" className="mt-4 w-full">Manage services</Button>
            </Panel>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <h2 className="label-caps text-muted-foreground">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}