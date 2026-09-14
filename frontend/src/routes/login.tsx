import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Mentora" },
      {
        name: "description",
        content: "Sign in to your Mentora account to access your study-abroad consultations, messaging, and mentor bookings.",
      },
      { property: "og:title", content: "Sign In — Mentora" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" }) as { returnTo?: string };
  const { isAuthenticated, user, signIn, resolveRoute } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-redirect if already signed in
  useEffect(() => {
    if (isAuthenticated && user) {
      const target = resolveRoute(search.returnTo);
      navigate({ to: target as any });
    }
  }, [isAuthenticated, user, navigate, resolveRoute, search.returnTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    const res = await signIn(email, password, search.returnTo);
    setLoading(false);
    if (res.success && res.target) {
      navigate({ to: res.target as any });
    } else {
      setErrorMsg(res.error || "The email or password is incorrect. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Header section */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-secondary px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-primary shadow-xs">
              <ShieldCheck className="h-3.5 w-3.5 fill-primary/20 text-primary" /> Welcome Back
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Sign in to Mentora
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Access your consultations, verified mentors, and application guidance.
            </p>
          </div>

          {/* Form Card */}
          <div className="mt-6 rounded-3xl border border-border bg-card p-7 shadow-lift sm:p-8 space-y-5">
            {errorMsg && (
              <div className="rounded-xl border border-destructive/30 bg-[#fdf2f2] p-3 text-xs font-semibold text-[#ec1c24] text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 rounded-xl border-border bg-background pl-10 pr-4 text-sm"
                  />
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Password
                  </Label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-xl border-border bg-background pl-10 pr-10 text-sm"
                  />
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <Label htmlFor="remember" className="cursor-pointer text-xs font-medium text-muted-foreground">
                  Keep me signed in on this device
                </Label>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="h-12 w-full text-base font-bold shadow-lift"
              >
                {loading ? "Signing in..." : "Sign In"} <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </form>

            {/* Don't have an account link */}
            <div className="border-t border-border pt-4 text-center text-sm">
              <p className="text-muted-foreground text-xs">
                Don't have an account?{" "}
                <Link to="/register" className="font-extrabold text-primary hover:underline">
                  Register / Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
