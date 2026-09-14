import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Eye, EyeOff, GraduationCap, Lock, Mail, ShieldCheck, UserCheck, User } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account — Mentora" },
      {
        name: "description",
        content: "Join Mentora to connect with verified study-abroad mentors or offer guidance to students.",
      },
      { property: "og:title", content: "Create Account — Mentora" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, signUp, resolveRoute } = useAuth();

  const [role, setRole] = useState<"student" | "advisor">("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-redirect if already signed in
  useEffect(() => {
    if (isAuthenticated && user) {
      const target = resolveRoute();
      navigate({ to: target as any });
    }
  }, [isAuthenticated, user, navigate, resolveRoute]);

  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!isPasswordValid) {
      setErrorMsg("Password must meet all security requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setErrorMsg("Please agree to the Terms of Service.");
      return;
    }

    setErrorMsg(null);
    setLoading(true);
    const res = await signUp({ full_name: fullName, email, password, role });
    setLoading(false);
    if (res.success && res.target) {
      navigate({ to: res.target as any });
    } else {
      setErrorMsg(res.error || "Unable to create account. Please try again.");
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
              <ShieldCheck className="h-3.5 w-3.5 fill-primary/20 text-primary" /> Start Your Journey
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join Mentora to access verified study-abroad guidance.
            </p>
          </div>

          {/* Form Card */}
          <div className="mt-6 rounded-3xl border border-border bg-card p-7 shadow-lift sm:p-8 space-y-4">
            {/* Account Type Toggle - Smooth Sliding Pill */}
            <div className="relative grid grid-cols-2 rounded-2xl border border-border bg-muted/60 p-1.5 select-none">
              <div
                className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-xl bg-primary shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                  role === "student" ? "translate-x-0" : "translate-x-full"
                }`}
              />
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`relative z-10 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-colors duration-200 cursor-pointer ${
                  role === "student"
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <GraduationCap className="h-4 w-4" /> Student
              </button>
              <button
                type="button"
                onClick={() => setRole("advisor")}
                className={`relative z-10 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-colors duration-200 cursor-pointer ${
                  role === "advisor"
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <UserCheck className="h-4 w-4" /> Mentor / Adviser
              </button>
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-destructive/30 bg-[#fdf2f2] p-3 text-xs font-semibold text-[#ec1c24] text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <Label htmlFor="reg-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Full Name
                </Label>
                <div className="relative">
                  <Input
                    id="reg-name"
                    type="text"
                    required
                    placeholder="Sabbir Ahmed"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-10 rounded-xl border-border bg-background pl-9 pr-3 text-sm"
                  />
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="reg-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 rounded-xl border-border bg-background pl-9 pr-3 text-sm"
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="reg-password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 rounded-xl border-border bg-background pl-9 pr-9 text-sm"
                  />
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1 pt-1 text-[0.6875rem]">
                  <span className={`inline-flex items-center gap-1 ${hasMinLength ? "text-primary font-bold" : "text-muted-foreground"}`}>
                    <Check className="h-3 w-3" /> 8+ chars
                  </span>
                  <span className={`inline-flex items-center gap-1 ${hasLetter ? "text-primary font-bold" : "text-muted-foreground"}`}>
                    <Check className="h-3 w-3" /> 1 letter
                  </span>
                  <span className={`inline-flex items-center gap-1 ${hasNumber ? "text-primary font-bold" : "text-muted-foreground"}`}>
                    <Check className="h-3 w-3" /> 1 number
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="reg-confirm" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="reg-confirm"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-10 rounded-xl border-border bg-background pl-9 pr-3 text-sm"
                  />
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Checkbox
                  id="reg-terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(!!checked)}
                  className="mt-0.5"
                />
                <Label htmlFor="reg-terms" className="cursor-pointer text-xs font-medium text-muted-foreground leading-relaxed">
                  I agree to the Terms of Service and Privacy Policy.
                </Label>
              </div>

              <Button type="submit" size="lg" disabled={loading} className="w-full h-11 font-bold text-base shadow-lift">
                {loading ? "Creating Account..." : `Create ${role === "student" ? "Student" : "Adviser"} Account`}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </form>

            <div className="border-t border-border pt-4 text-center text-xs">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-extrabold text-primary hover:underline">
                  Sign In
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
