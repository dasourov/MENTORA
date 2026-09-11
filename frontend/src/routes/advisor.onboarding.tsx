import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ShieldCheck, User, Award, FileText, Upload, Briefcase } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const Route = createFileRoute("/advisor/onboarding")({
  head: () => ({
    meta: [
      { title: "Adviser Profile & Verification — Mentora" },
      { name: "description", content: "Submit your adviser profile, expertise, and verification documents to guide Bangladeshi students." },
    ],
  }),
  component: AdviserOnboardingPage,
});

function AdviserOnboardingPage() {
  return (
    <ProtectedRoute allowedRoles={["advisor"]} requireOnboarding={false}>
      <AdviserOnboardingFlow />
    </ProtectedRoute>
  );
}

function AdviserOnboardingFlow() {
  const { user, saveOnboardingStep } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form states
  const [headline, setHeadline] = useState(user?.headline || "Germany Master's & Public University Adviser");
  const [location, setLocation] = useState("Dhaka, Bangladesh");
  const [countries, setCountries] = useState("Germany, Austria, Netherlands");
  const [bio, setBio] = useState(user?.bio || "Guiding students through Uni-Assist, APS, and blocked accounts.");
  const [hourlyPrice, setHourlyPrice] = useState("1000");
  const [nidUploaded, setNidUploaded] = useState(true);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (step === 1) {
      await saveOnboardingStep({ headline, country: location }, "expertise");
      setStep(2);
    } else if (step === 2) {
      await saveOnboardingStep({ intended_country: countries }, "background");
      setStep(3);
    } else if (step === 3) {
      await saveOnboardingStep({ bio }, "pricing");
      setStep(4);
    } else if (step === 4) {
      await saveOnboardingStep({ budget: hourlyPrice }, "verification");
      setStep(5);
    } else if (step === 5) {
      const res = await saveOnboardingStep({}, "submitted", true);
      setLoading(false);
      navigate({ to: res.target as any });
      return;
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              <span>Step {step} of 5</span>
              <span>{Math.round((step / 5) * 100)}% Completed</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-border bg-card p-7 shadow-lift sm:p-9">
            <form onSubmit={handleNext}>
              {/* STEP 1: PERSONAL PROFILE */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary text-primary">
                      <User className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-xl font-extrabold text-foreground">Personal Profile</h2>
                      <p className="text-xs text-muted-foreground">Your professional identity and location.</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Full Name
                    </Label>
                    <Input value={user?.full_name || ""} disabled className="h-11 rounded-xl bg-secondary/50 font-medium" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="hl" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Professional Headline
                    </Label>
                    <Input
                      id="hl"
                      required
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="h-11 rounded-xl border-border bg-background"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="loc" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Current Location
                    </Label>
                    <Input
                      id="loc"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-11 rounded-xl border-border bg-background"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: EXPERTISE */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary text-primary">
                      <Award className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-xl font-extrabold text-foreground">Destination & Expertise</h2>
                      <p className="text-xs text-muted-foreground">Countries and admission paths you specialize in.</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="coun" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Supported Destination Countries
                    </Label>
                    <Input
                      id="coun"
                      required
                      value={countries}
                      onChange={(e) => setCountries(e.target.value)}
                      className="h-11 rounded-xl border-border bg-background"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: BIO & BACKGROUND */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary text-primary">
                      <Briefcase className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-xl font-extrabold text-foreground">Background & Biography</h2>
                      <p className="text-xs text-muted-foreground">Share your educational journey and advising approach.</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="biotext" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Short Bio
                    </Label>
                    <Textarea
                      id="biotext"
                      required
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="rounded-xl border-border bg-background text-sm"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: PRICING */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary text-primary">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-xl font-extrabold text-foreground">Services & Session Pricing</h2>
                      <p className="text-xs text-muted-foreground">Set your baseline session price in BDT.</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="prc" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Base Session Fee (BDT ৳)
                    </Label>
                    <Input
                      id="prc"
                      type="number"
                      required
                      value={hourlyPrice}
                      onChange={(e) => setHourlyPrice(e.target.value)}
                      className="h-11 rounded-xl border-border bg-background"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: VERIFICATION SUBMISSION */}
              {step === 5 && (
                <div className="space-y-4 text-center py-2">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-primary">
                    <Upload className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-foreground">Identity & Reference Verification</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Upload your NID, passport, or degree transcript to complete verification. Verification takes up to 3 working days.
                  </p>
                  <div className="rounded-2xl border border-dashed border-primary/40 bg-secondary/30 p-6 text-center">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-primary mb-2" />
                    <p className="text-xs font-bold text-foreground">Verification Documents Uploaded</p>
                    <p className="text-[0.6875rem] text-muted-foreground">NID_Front_Back.pdf (Verified format)</p>
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-3">
                {step > 1 && step < 5 && (
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="h-11 flex-1 font-bold">
                    Back
                  </Button>
                )}
                <Button type="submit" disabled={loading} className="h-11 flex-1 font-bold text-base shadow-lift">
                  {loading ? "Submitting..." : step === 5 ? "Submit Profile for Review" : "Continue"}{" "}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
