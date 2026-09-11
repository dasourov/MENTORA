import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock, ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set New Password — Mentora" },
      { name: "description", content: "Create a new secure password for your Mentora account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setSubmitted(true);
    setTimeout(() => {
      navigate({ to: "/login" });
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Set new password
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please enter your new password below.
          </p>

          <div className="mt-8 rounded-3xl border border-border bg-card p-7 text-left shadow-lift sm:p-8">
            {submitted ? (
              <div className="space-y-3 text-center py-4">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">Password updated successfully!</h3>
                <p className="text-xs text-muted-foreground">Redirecting to sign in...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-xl border border-destructive/30 bg-[#fdf2f2] p-3 text-xs font-semibold text-[#ec1c24] text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="new-password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 rounded-xl border-border bg-background pl-10 pr-10 text-sm"
                    />
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirm-new-password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-new-password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11 rounded-xl border-border bg-background pl-10 pr-4 text-sm"
                    />
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full h-11 font-bold text-base shadow-lift mt-2">
                  Update Password <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
