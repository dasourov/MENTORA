import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
  User,
  KeyRound,
  RefreshCw,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

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
  const { isAuthenticated, user, signUp, sendPasscode, verifyPasscode, resolveRoute } = useAuth();

  // Wizard steps: 1 = Fill info, 2 = Enter passcode
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"student" | "advisor">("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Passcode verification state
  const [passcode, setPasscode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(30);
  const [resending, setResending] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-redirect if already signed in and verified
  useEffect(() => {
    if (isAuthenticated && user && user.email_verified) {
      const target = resolveRoute();
      navigate({ to: target as any });
    }
  }, [isAuthenticated, user, navigate, resolveRoute]);

  // Resend cooldown timer for Step 2
  useEffect(() => {
    if (step === 2 && resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [step, resendCooldown]);

  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber;

  // Step 1: Submit account details & trigger Resend passcode
  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setErrorMsg("Please enter a valid email address.");
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

    const res = await signUp({ full_name: fullName, email: email.trim(), password, role });
    setLoading(false);

    if (res.success) {
      if (res.requires_verification) {
        setStep(2);
        setResendCooldown(30);
        toast.success(`Verification passcode sent to ${email.trim()}!`);
      } else if (res.target) {
        navigate({ to: res.target as any });
      }
    } else {
      setErrorMsg(res.error || "Unable to create account. Please try again.");
    }
  };

  // Step 2: Verify passcode
  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = passcode.trim();
    if (cleanCode.length < 4) {
      setErrorMsg("Please enter the complete 6-digit passcode.");
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    const res = await verifyPasscode(email.trim(), cleanCode);
    setLoading(false);

    if (res.success && res.target) {
      toast.success("Email verified successfully! Starting profile setup...");
      navigate({ to: res.target as any });
    } else {
      setErrorMsg(res.error || "Invalid or expired passcode. Please try again.");
    }
  };

  // Resend passcode handler
  const handleResendPasscode = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setErrorMsg(null);

    const res = await sendPasscode(email.trim(), "registration");
    setResending(false);

    if (res.success) {
      setResendCooldown(30);
      toast.success("A new passcode has been dispatched to your email!");
    } else {
      setErrorMsg(res.error || "Failed to resend passcode. Please try again.");
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
              {step === 1 ? "Create your account" : "Enter Email Passcode"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {step === 1
                ? "Join Mentora to access verified study-abroad guidance."
                : `We sent a 6-digit passcode via Resend to ${email || "your email"}.`}
            </p>
          </div>

          {/* Form Card */}
          <div className="mt-6 rounded-3xl border border-border bg-card p-7 shadow-lift sm:p-8 space-y-4">
            {errorMsg && (
              <div className="rounded-xl border border-destructive/30 bg-[#fdf2f2] p-3 text-xs font-semibold text-[#ec1c24] text-center">
                {errorMsg}
              </div>
            )}

            {/* STEP 1: INITIAL DATA ENTRY */}
            {step === 1 && (
              <>
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

                <form onSubmit={handleAccountSubmit} className="space-y-3.5 pt-1">
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
                    <p className="text-[0.6875rem] text-muted-foreground">
                      A verification passcode will be delivered to this address.
                    </p>
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
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating & Sending Passcode...
                      </>
                    ) : (
                      <>
                        Continue to Verification <ArrowRight className="ml-1.5 h-4 w-4" />
                      </>
                    )}
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
              </>
            )}

            {/* STEP 2: RESEND PASSCODE VERIFICATION */}
            {step === 2 && (
              <form onSubmit={handlePasscodeSubmit} className="space-y-4 pt-2">
                <div className="rounded-2xl bg-secondary/50 border border-primary/20 p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    <span className="font-bold text-foreground truncate">{email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-primary font-bold hover:underline shrink-0 ml-2"
                  >
                    Edit
                  </button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passcode-input" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                    <span>Enter 6-Digit Passcode</span>
                    <span className="text-[0.6875rem] text-primary font-semibold">Sent via Resend</span>
                  </Label>

                  <div className="relative">
                    <Input
                      id="passcode-input"
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      placeholder="• • • • • •"
                      value={passcode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setPasscode(val);
                      }}
                      className="h-14 text-center font-mono text-2xl tracking-[0.5em] font-extrabold rounded-2xl border-2 border-primary/30 focus:border-primary bg-background"
                    />
                    <KeyRound className="absolute left-4 top-4 h-6 w-6 text-muted-foreground/50 pointer-events-none" />
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Check your email inbox or spam folder for the one-time code.
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading || passcode.trim().length < 4}
                  className="w-full h-12 font-bold text-base shadow-lift"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying Passcode...
                    </>
                  ) : (
                    <>
                      Verify & Start Profile Setup <ArrowRight className="ml-1.5 h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1 font-bold text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>

                  <button
                    type="button"
                    onClick={handleResendPasscode}
                    disabled={resendCooldown > 0 || resending}
                    className={`inline-flex items-center gap-1.5 font-bold ${
                      resendCooldown > 0 ? "text-muted-foreground cursor-not-allowed" : "text-primary hover:underline"
                    }`}
                  >
                    <RefreshCw className={`h-3 w-3 ${resending ? "animate-spin" : ""}`} />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Passcode"}
                  </button>
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
