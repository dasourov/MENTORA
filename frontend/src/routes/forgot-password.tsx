import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — Mentora" },
      { name: "description", content: "Reset your Mentora password safely." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await resetPassword(email);
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-secondary px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-primary shadow-xs">
            <ShieldCheck className="h-3.5 w-3.5 fill-primary/20 text-primary" /> Password Recovery
          </span>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your account email to receive reset instructions.
          </p>

          <div className="mt-8 rounded-3xl border border-border bg-card p-7 text-left shadow-lift sm:p-8">
            {submitted ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="text-sm leading-relaxed text-foreground font-medium">
                  If an account exists for <strong className="text-primary">{email}</strong>, we have sent password-reset instructions.
                </p>
                <Button asChild className="w-full h-11 font-bold text-sm mt-4">
                  <Link to="/login">Back to Sign In</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="forgot-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="forgot-email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 rounded-xl border-border bg-background pl-10 pr-4 text-sm"
                    />
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <Button type="submit" size="lg" disabled={loading} className="w-full h-11 font-bold text-base shadow-lift">
                  {loading ? "Sending link..." : "Send Reset Link"} <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>

                <div className="pt-2 text-center">
                  <Link to="/login" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
