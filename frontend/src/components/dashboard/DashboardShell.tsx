import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type NavItem = { label: string; icon: LucideIcon; to?: string };

export function DashboardShell({
  items,
  title,
  subtitle,
  active,
  onSelect,
  actions,
  children,
}: {
  items: NavItem[];
  title: string;
  subtitle?: string;
  active: string;
  onSelect: (label: string) => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const nav = (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const isActive = item.to ? pathname === item.to : item.label === active;
        const cls = cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        );
        return item.to ? (
          <Link key={item.label} to={item.to} className={cls} onClick={() => setOpen(false)}>
            <item.icon className="h-4 w-4 shrink-0" /> {item.label}
          </Link>
        ) : (
          <button
            key={item.label}
            type="button"
            className={cls}
            onClick={() => {
              onSelect(item.label);
              setOpen(false);
            }}
          >
            <item.icon className="h-4 w-4 shrink-0" /> {item.label}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto flex max-w-[100rem] gap-0">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-background p-4 lg:flex">
          <div className="px-2 py-2">
            <Logo />
          </div>
          <div className="mt-6 flex-1 overflow-y-auto">{nav}</div>
          <Button asChild variant="ghost" className="justify-start text-muted-foreground">
            <Link to="/">Back to site</Link>
          </Button>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 sm:px-6">
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-border lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-extrabold text-foreground sm:text-xl">{title}</h1>
                {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
              </div>
              <div className="flex items-center gap-2">{actions}</div>
            </div>
          </header>

          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-background p-4">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-border"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-6">{nav}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <p className="label-caps text-muted-foreground">{label}</p>
        {Icon && <Icon className="h-4 w-4 shrink-0 text-primary" />}
      </div>
      <p className="mt-3 text-2xl font-extrabold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}