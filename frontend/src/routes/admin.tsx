import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  CreditCard,
  Flag,
  LayoutDashboard,
  MessageSquareWarning,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { DashboardShell, StatCard, type NavItem } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { verificationQueue } from "@/data/mock";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin console — Mentora" },
      { name: "description", content: "Review adviser verification, bookings, disputes and platform analytics." },
      { property: "og:title", content: "Admin console — Mentora" },
      { property: "og:description", content: "Operations console for the Mentora marketplace." },
    ],
  }),
  component: Admin,
});

const items: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Adviser Verification", icon: ShieldCheck },
  { label: "Students", icon: Users },
  { label: "Bookings", icon: CreditCard },
  { label: "Reported Profiles", icon: Flag },
  { label: "Reviews", icon: Star },
  { label: "Disputes", icon: MessageSquareWarning },
  { label: "Analytics", icon: BarChart3 },
];

const statusStyle = (s: string) =>
  s === "Approved"
    ? "bg-success/10 text-success"
    : s === "Rejected"
      ? "bg-destructive/10 text-destructive"
      : "bg-warning/15 text-warning";

function Admin() {
  const [active, setActive] = useState("Adviser Verification");

  return (
    <DashboardShell
      items={items}
      active={active}
      onSelect={setActive}
      title={active}
      subtitle="Mentora operations console"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Pending verifications" value="18" hint="4 older than 3 days" />
          <StatCard label="Active students" value="12,417" hint="+862 this month" />
          <StatCard label="Bookings this week" value="1,284" hint="৳1.42M processed" />
          <StatCard label="Open disputes" value="6" hint="2 awaiting adviser reply" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="border-b border-border p-5">
            <h2 className="label-caps text-muted-foreground">Adviser verification applications</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-surface text-left">
                <tr>
                  {["Name", "Country expertise", "Submitted", "Documents", "Status", ""].map((h) => (
                    <th key={h} className="p-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {verificationQueue.map((v) => (
                  <tr key={v.name} className="transition-colors hover:bg-surface/60">
                    <td className="p-4 font-semibold text-foreground">{v.name}</td>
                    <td className="p-4 text-muted-foreground">{v.expertise}</td>
                    <td className="p-4 text-muted-foreground">{v.submitted}</td>
                    <td className="p-4 text-muted-foreground">{v.docs} files</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyle(v.status)}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button size="sm" variant="outline">Review application</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}