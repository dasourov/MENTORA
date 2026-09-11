import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, LogOut, LayoutDashboard, UserCheck, GraduationCap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { Avatar } from "./Badges";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Find Mentors", to: "/advisers" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Services", to: "/services" },
  { label: "Become a Mentor", to: "/become-an-adviser" },
  { label: "Resources", to: "/resources" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, signOut, resolveRoute } = useAuth();

  const dashboardTarget = user ? resolveRoute() : "/login";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md transition-shadow duration-200">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden justify-center gap-1.5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to as any}
              activeProps={{ className: "text-primary bg-secondary font-semibold" }}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* Profile Chip */}
              <Link
                to={dashboardTarget as any}
                className="hidden sm:flex items-center gap-2.5 rounded-full border border-border bg-card p-1.5 pr-4 transition-all hover:border-primary/40 hover:shadow-xs"
              >
                <Avatar initials={user.full_name?.slice(0, 2).toUpperCase() || "ME"} size="sm" />
                <div className="text-left text-xs">
                  <p className="font-extrabold text-foreground leading-tight">{user.full_name}</p>
                  <p className="text-[0.6875rem] font-semibold text-primary capitalize flex items-center gap-1">
                    {user.role === "advisor" ? (
                      <>
                        <UserCheck className="h-3 w-3 text-primary" /> Adviser
                      </>
                    ) : (
                      <>
                        <GraduationCap className="h-3 w-3 text-primary" /> Student
                      </>
                    )}
                  </p>
                </div>
              </Link>

              <Button asChild size="sm" className="hidden sm:inline-flex font-bold shadow-lift">
                <Link to={dashboardTarget as any}>
                  <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" /> Dashboard
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                title="Sign Out"
                className="hidden sm:inline-flex text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="hidden text-primary hover:text-primary sm:inline-flex font-bold"
              >
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className="hidden sm:inline-flex font-bold shadow-lift">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border text-foreground transition-colors hover:bg-secondary lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to as any}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 py-3 border-t border-border mt-2">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-secondary/50 mb-1">
                    <Avatar initials={user.full_name?.slice(0, 2).toUpperCase() || "ME"} size="sm" />
                    <div>
                      <p className="font-extrabold text-foreground text-sm">{user.full_name}</p>
                      <p className="text-xs text-primary font-bold capitalize">{user.role || "User"}</p>
                    </div>
                  </div>
                  <Button asChild className="w-full font-bold">
                    <Link to={dashboardTarget as any} onClick={() => setOpen(false)}>
                      Go to Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={signOut} className="w-full font-bold">
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1 font-bold">
                    <Link to="/login" onClick={() => setOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild className="flex-1 font-bold">
                    <Link to="/register" onClick={() => setOpen(false)}>
                      Register
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}