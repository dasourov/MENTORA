import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";

type AuthStep = "email" | "signin" | "signup";

export function AuthModal({
  open,
  onOpenChange,
  initialMode = "email",
  returnTo,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: "email" | "signin" | "signup";
  returnTo?: string;
}) {
  const { checkEmail, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<AuthStep>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password requirements calculation
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber;

  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await checkEmail(email);
      setLoading(false);
      if (res.exists) {
        setStep("signin");
      } else {
        setStep("signup");
      }
    } catch {
      setLoading(false);
      setErrorMsg("Unable to verify email right now. Please try again.");
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    const res = await signIn(email, password, returnTo);
    setLoading(false);
    if (res.success && res.target) {
      onOpenChange(false);
      navigate({ to: res.target as any });
    } else {
      setErrorMsg(res.error || "The email or password is incorrect. Please try again.");
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!isPasswordValid) {
      setErrorMsg("Password must meet all requirements.");
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
    const res = await signUp({ full_name: fullName, email, password });
    setLoading(false);
    if (res.success && res.target) {
      onOpenChange(false);
      navigate({ to: res.target as any });
    } else {
      setErrorMsg(res.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-lift">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-extrabold text-foreground tracking-tight">
            {step === "email" && "Welcome to Mentora"}
            {step === "signin" && "Welcome back"}
            {step === "signup" && "Create your account"}
          </DialogTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {step === "email" && "Sign in or create an account to continue."}
            {step === "signin" && (
              <span className="inline-flex items-center gap-1">
                Signing in as <strong className="text-foreground">{email}</strong>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-xs font-bold text-primary underline ml-1"
                >
                  Edit
                </button>
              </span>
            )}
            {step === "signup" && "Join Mentora to connect with verified study-abroad mentors."}
          </p>
        </DialogHeader>

        {errorMsg && (
          <div className="rounded-xl border border-destructive/30 bg-[#fdf2f2] p-3 text-xs font-semibold text-[#ec1c24] text-center">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: ENTER EMAIL */}
        {step === "email" && (
          <div className="space-y-4 mt-2">
            <form onSubmit={handleEmailCheck} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="auth-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="auth-email"
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

              <Button type="submit" size="lg" disabled={loading} className="w-full h-11 font-bold text-base">
                {loading ? "Checking..." : "Continue"} <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </form>

            <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
              By continuing, you agree to Mentora's{" "}
              <a href="#" className="font-semibold text-primary underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="font-semibold text-primary underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        )}

        {/* STEP 2A: EXISTING USER SIGN IN */}
        {step === "signin" && (
          <form onSubmit={handleSignInSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="signin-password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    navigate({ to: "/forgot-password" });
                  }}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="signin-password"
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
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" disabled={loading} className="w-full h-11 font-bold text-base">
              {loading ? "Signing in..." : "Sign In"} <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep("email")}
              className="w-full h-9 text-xs font-semibold text-muted-foreground"
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to email
            </Button>
          </form>
        )}

        {/* STEP 2B: NEW USER REGISTRATION */}
        {step === "signup" && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5 mt-2">
            <div className="space-y-1">
              <Label htmlFor="signup-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Full Name
              </Label>
              <div className="relative">
                <Input
                  id="signup-name"
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
              <Label htmlFor="signup-password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="signup-password"
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

              {/* Password strength checks */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 text-[0.6875rem]">
                <span className={`inline-flex items-center gap-1 font-medium ${hasMinLength ? "text-primary font-bold" : "text-muted-foreground"}`}>
                  <Check className="h-3 w-3" /> 8+ chars
                </span>
                <span className={`inline-flex items-center gap-1 font-medium ${hasLetter ? "text-primary font-bold" : "text-muted-foreground"}`}>
                  <Check className="h-3 w-3" /> 1 letter
                </span>
                <span className={`inline-flex items-center gap-1 font-medium ${hasNumber ? "text-primary font-bold" : "text-muted-foreground"}`}>
                  <Check className="h-3 w-3" /> 1 number
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="signup-confirm" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="signup-confirm"
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
                id="signup-terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(!!checked)}
                className="mt-0.5"
              />
              <Label htmlFor="signup-terms" className="cursor-pointer text-xs font-medium text-muted-foreground leading-relaxed">
                I agree to the Terms of Service and Privacy Policy.
              </Label>
            </div>

            <Button type="submit" size="lg" disabled={loading} className="w-full h-11 font-bold text-base">
              {loading ? "Creating Account..." : "Create Account"} <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep("email")}
              className="w-full h-8 text-xs font-semibold text-muted-foreground"
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to email
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
