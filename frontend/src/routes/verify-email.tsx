import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, CheckCircle2, RefreshCw, ArrowRight, KeyRound, Loader2 } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Verify Your Email — Mentora" },
      { name: "description", content: "Please enter your verification passcode to continue to Mentora." },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { user, verifyPasscode, sendPasscode, resolveRoute } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(user?.email || "");
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user?.email, email]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || !email.trim() || resending) return;
    setResending(true);
    setErrorMsg(null);

    const res = await sendPasscode(email.trim(), "registration");
    setResending(false);

    if (res.success) {
      setCooldown(30);
      toast.success("A fresh passcode has been sent to your email!");
    } else {
      setErrorMsg(res.error || "Failed to send passcode. Please try again.");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim();
    if (cleanCode.length < 4) {
      setErrorMsg("Please enter the complete 6-digit passcode.");
      return;
    }
    if (!email.trim()) {
      setErrorMsg("Please provide your email address.");
      return;
    }

    setVerifying(true);
    setErrorMsg(null);

    const res = await verifyPasscode(email.trim(), cleanCode);
    setVerifying(false);

    if (res.success && res.target) {
      toast.success("Email verified successfully! Starting profile setup...");
      navigate({ to: res.target as any });
    } else {
      setErrorMsg(res.error || "Invalid or expired passcode. Please try again.");
    }
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
            We sent a 6-digit verification passcode via Resend to{" "}
            <strong className="text-foreground">{email || "your email address"}</strong>.
          </p>

          <div className="mt-8 rounded-3xl border border-border bg-card p-6.5 shadow-lift space-y-4 text-left">
            {errorMsg && (
              <div className="rounded-xl border border-destructive/30 bg-[#fdf2f2] p-3 text-xs font-semibold text-[#ec1c24] text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              {!user && (
                <div className="space-y-1">
                  <Label htmlFor="verify-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="verify-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="h-10 rounded-xl"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="verify-passcode" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Enter 6-Digit Passcode</span>
                  <span className="text-[0.6875rem] text-primary font-semibold">Sent via Resend</span>
                </Label>
                <div className="relative">
                  <Input
                    id="verify-passcode"
                    type="text"
                    maxLength={6}
                    autoFocus
                    required
                    placeholder="• • • • • •"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                    className="h-14 text-center font-mono text-2xl tracking-[0.5em] font-extrabold rounded-2xl border-2 border-primary/30 focus:border-primary bg-background"
                  />
                  <KeyRound className="absolute left-4 top-4 h-6 w-6 text-muted-foreground/50 pointer-events-none" />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={verifying || code.trim().length < 4}
                className="w-full h-12 font-bold text-base shadow-lift"
              >
                {verifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying Passcode...
                  </>
                ) : (
                  <>
                    Verify & Continue <ArrowRight className="ml-1.5 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResend}
                  disabled={cooldown > 0 || resending}
                  className="h-10 text-xs font-semibold border-border"
                >
                  <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${resending || cooldown > 0 ? "animate-spin" : ""}`} />
                  {cooldown > 0 ? `Resend (${cooldown}s)` : "Resend code"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.open("https://mail.google.com", "_blank")}
                  className="h-10 text-xs font-semibold border-border"
                >
                  Open email app
                </Button>
              </div>

              <p className="pt-2 text-xs text-muted-foreground text-center">
                Need to change your account?{" "}
                <button
                  type="button"
                  onClick={() => navigate({ to: "/register" as any })}
                  className="font-bold text-primary underline"
                >
                  Register again
                </button>
              </p>
            </form>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
