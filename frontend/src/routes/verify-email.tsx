import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, CheckCircle2, RefreshCw, ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Verify Your Email — Mentora" },
      { name: "description", content: "Please verify your email address to continue to Mentora." },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { user, verifyEmail, sendVerificationEmail } = useAuth();
  const navigate = useNavigate();

  const [cooldown, setCooldown] = useState(0);
  const [resent, setResent] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || !user) return;
    await sendVerificationEmail(user.email);
    setResent(true);
    setCooldown(30);
  };

  const handleVerify = async () => {
    setVerifying(true);
    await verifyEmail();
    setVerifying(false);
    navigate({ to: "/onboarding/select-role" as any });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-secondary text-primary shadow-xs">
            <Mail className="h-8 w-8" />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Verify your email
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            We sent a verification link to <strong className="text-foreground">{user?.email || "your email"}</strong>.
          </p>

          <div className="mt-8 rounded-3xl border border-border bg-card p-6.5 shadow-lift space-y-4">
            {resent && (
              <div className="rounded-xl border border-primary/20 bg-secondary p-3 text-xs font-semibold text-primary flex items-center justify-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Verification link sent! Please check your inbox.
              </div>
            )}

            <Button
              size="lg"
              onClick={handleVerify}
              disabled={verifying}
              className="w-full h-12 font-bold text-base shadow-lift"
            >
              {verifying ? "Checking verification..." : "I have verified my email"}{" "}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={cooldown > 0}
                className="h-10 text-xs font-semibold border-border"
              >
                <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${cooldown > 0 ? "animate-spin" : ""}`} />
                {cooldown > 0 ? `Resend (${cooldown}s)` : "Resend email"}
              </Button>

              <Button
                variant="outline"
                onClick={() => window.open("https://mail.google.com", "_blank")}
                className="h-10 text-xs font-semibold border-border"
              >
                Open email app
              </Button>
            </div>

            <p className="pt-2 text-xs text-muted-foreground">
              Wrong email address?{" "}
              <button
                onClick={() => navigate({ to: "/login" as any })}
                className="font-bold text-primary underline"
              >
                Change email
              </button>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
