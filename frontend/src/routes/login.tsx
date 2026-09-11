import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, GraduationCap, UserCheck } from "lucide-react";
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
  const search = useSearch({ strict: false }) as { returnTo?: string };
  const { isAuthenticated, user, signIn, quickDemoLogin, signInWithGoogle, resolveRoute } = useAuth();

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

  const handleDemo = async (role: "student" | "advisor") => {
    setLoading(true);
    const res = await quickDemoLogin(role);
    setLoading(false);
    if (res.success && res.target) {
      navigate({ to: res.target as any });
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const res = await signInWithGoogle();
    setLoading(false);
    if (res.success && res.target) {
      navigate({ to: res.target as any });
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

          {/* Quick Demo Login Shortcut */}
          <div className="mt-6 rounded-2xl border border-primary/20 bg-secondary/50 p-4 text-center">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2.5">
              ⚡ Quick Demo One-Click Sign In
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDemo("student")}
                disabled={loading}
                className="h-9 text-xs font-bold border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <GraduationCap className="mr-1 h-3.5 w-3.5" /> As Student
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDemo("advisor")}
                disabled={loading}
                className="h-9 text-xs font-bold border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <UserCheck className="mr-1 h-3.5 w-3.5" /> As Adviser
              </Button>
            </div>
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

            <div className="relative my-4 text-center text-xs">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative bg-card px-3 font-bold uppercase tracking-wider text-muted-foreground">
                Or continue with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogle}
                disabled={loading}
                className="h-10 text-xs font-semibold border-border"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogle}
                disabled={loading}
                className="h-10 text-xs font-semibold border-border"
              >
                <svg className="mr-2 h-4 w-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
                LinkedIn
              </Button>
            </div>

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
