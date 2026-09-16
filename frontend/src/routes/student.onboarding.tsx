import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, GraduationCap, ShieldCheck, User, BookOpen, Target, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const Route = createFileRoute("/student/onboarding")({
  head: () => ({
    meta: [
      { title: "Student Profile Setup — Mentora" },
      { name: "description", content: "Complete your student profile to get matched with verified study-abroad mentors." },
    ],
  }),
  component: StudentOnboardingPage,
});

function StudentOnboardingPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]} requireOnboarding={false}>
      <StudentOnboardingFlow />
    </ProtectedRoute>
  );
}

function StudentOnboardingFlow() {
  const { user, saveOnboardingStep } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form states
  const [phone, setPhone] = useState(user?.phone_number || "");
  const [country, setCountry] = useState(user?.country || "Bangladesh");
  const [educationLevel, setEducationLevel] = useState(user?.education_level || "Undergraduate / Bachelor's");
  const [institution, setInstitution] = useState(user?.institution || "");
  const [subjectField, setSubjectField] = useState(user?.subject_field || "");
  const [intendedCountry, setIntendedCountry] = useState(user?.intended_country || "Germany");
  const [budget, setBudget] = useState(user?.budget || "BDT 15–20 Lakhs / Year");
  const [servicesNeeded, setServicesNeeded] = useState<string[]>(user?.services_needed || ["University Shortlisting", "SOP Feedback"]);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (step === 1) {
      await saveOnboardingStep({ phone_number: phone, country }, "education");
      setStep(2);
    } else if (step === 2) {
      await saveOnboardingStep({ education_level: educationLevel, institution, subject_field: subjectField }, "goals");
      setStep(3);
    } else if (step === 3) {
      await saveOnboardingStep({ intended_country: intendedCountry, budget }, "support");
      setStep(4);
    } else if (step === 4) {
      await saveOnboardingStep({ services_needed: servicesNeeded }, "completion");
      setStep(5);
    } else if (step === 5) {
      const res = await saveOnboardingStep({}, "completed", true);
      setLoading(false);
      navigate({ to: res.target as any });
      return;
    }
    setLoading(false);
  };

  const toggleService = (svc: string) => {
    if (servicesNeeded.includes(svc)) {
      setServicesNeeded(servicesNeeded.filter((s) => s !== svc));
    } else {
      setServicesNeeded([...servicesNeeded, svc]);
    }
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
              {/* STEP 1: BASIC PROFILE */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary text-primary">
                      <User className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-xl font-extrabold text-foreground">Basic Profile</h2>
                      <p className="text-xs text-muted-foreground">Tell us a bit about yourself.</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Full Name
                    </Label>
                    <Input value={user?.full_name || ""} disabled className="h-11 rounded-xl bg-secondary/50 font-medium" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      required
                      placeholder="+880 1700-000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-11 rounded-xl border-border bg-background"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="country" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Current Country of Residence
                    </Label>
                    <Input
                      id="country"
                      required
                      placeholder="Bangladesh"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="h-11 rounded-xl border-border bg-background"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: EDUCATION */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary text-primary">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-xl font-extrabold text-foreground">Current Education</h2>
                      <p className="text-xs text-muted-foreground">Your academic background and qualifications.</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edLevel" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Current Education Level
                    </Label>
                    <Select value={educationLevel} onValueChange={setEducationLevel}>
                      <SelectTrigger id="edLevel" className="h-11 rounded-xl border-border bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {["HSC / A-Levels", "Undergraduate / Bachelor's", "Graduate / Master's", "Diploma", "PhD / Post-Graduate"].map((l) => (
                          <SelectItem key={l} value={l}>
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="inst" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Institution / University
                    </Label>
                    <Input
                      id="inst"
                      required
                      placeholder="e.g. BUET, Dhaka University, NSU"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="h-11 rounded-xl border-border bg-background"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Subject / Field of Study
                    </Label>
                    <Input
                      id="subject"
                      required
                      placeholder="e.g. Computer Science, Mechanical Engineering, BBA"
                      value={subjectField}
                      onChange={(e) => setSubjectField(e.target.value)}
                      className="h-11 rounded-xl border-border bg-background"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: STUDY GOALS */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary text-primary">
                      <Target className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-xl font-extrabold text-foreground">Study Goals</h2>
                      <p className="text-xs text-muted-foreground">Target destination and budget planning.</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="targetC" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Preferred Study Country
                    </Label>
                    <Select value={intendedCountry} onValueChange={setIntendedCountry}>
                      <SelectTrigger id="targetC" className="h-11 rounded-xl border-border bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {["Germany", "United Kingdom", "Canada", "Australia", "Sweden", "United States"].map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="bg" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Estimated Monthly Budget
                    </Label>
                    <Input
                      id="bg"
                      required
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="h-11 rounded-xl border-border bg-background"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: REQUIRED SUPPORT */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary text-primary">
                      <Sparkles className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-xl font-extrabold text-foreground">Required Support</h2>
                      <p className="text-xs text-muted-foreground">Select the services you need guidance on.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      "Profile evaluation",
                      "University shortlisting",
                      "Scholarship guidance",
                      "SOP feedback",
                      "Application support",
                      "Visa guidance",
                    ].map((svc) => (
                      <div
                        key={svc}
                        onClick={() => toggleService(svc)}
                        className={`flex items-center gap-3 cursor-pointer rounded-2xl border p-3.5 transition-all ${
                          servicesNeeded.includes(svc)
                            ? "border-primary bg-secondary/80 font-bold text-primary"
                            : "border-border bg-background text-foreground hover:border-primary/40"
                        }`}
                      >
                        <Checkbox checked={servicesNeeded.includes(svc)} />
                        <span className="text-xs">{svc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: COMPLETION */}
              {step === 5 && (
                <div className="text-center space-y-4 py-2">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-primary">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-foreground">All Set!</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your student profile is complete. You can now match with verified mentors tailored to your goals.
                  </p>
                  <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-left text-xs space-y-1.5">
                    <p><strong>Target Country:</strong> {intendedCountry}</p>
                    <p><strong>Field:</strong> {subjectField}</p>
                    <p><strong>Services Needed:</strong> {servicesNeeded.join(", ")}</p>
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
                  {loading ? "Saving..." : step === 5 ? "Go to Dashboard" : "Continue"} <ArrowRight className="ml-1.5 h-4 w-4" />
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
