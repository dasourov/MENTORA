import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BadgeCheck, Upload } from "lucide-react";
import { toast } from "sonner";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/become-an-adviser")({
  head: () => ({
    meta: [
      { title: "Become a verified adviser — Mentora" },
      { name: "description", content: "Apply to list as an adviser on Mentora. Set your prices and advise Bangladeshi students." },
      { property: "og:title", content: "Become a verified adviser — Mentora" },
      { property: "og:description", content: "Verification usually takes three working days." },
    ],
  }),
  component: BecomeAdviser,
});

const steps = ["About you", "Expertise", "Documents"];

function BecomeAdviser() {
  const [step, setStep] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">Adviser application</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Tell us about your background. Every adviser is verified before their profile goes live.
          </p>
          <div className="mt-6">
            <p className="label-caps text-primary">Step {step + 1} of {steps.length} · {steps[step]}</p>
            <Progress value={((step + 1) / steps.length) * 100} className="mt-3 h-1.5" />
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
            {step === 0 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label="Full name" placeholder="Tanvir Ahmed" />
                <Field id="headline" label="Professional headline" placeholder="Germany Master's application adviser" />
                <Field id="country" label="Current country" placeholder="Bangladesh" />
                <Field id="languages" label="Languages" placeholder="Bangla, English, German" />
                <Field id="linkedin" label="LinkedIn profile" placeholder="linkedin.com/in/…" />
                <Field id="years" label="Years of experience" placeholder="7" />
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea id="bio" rows={5} placeholder="Describe your background and how you help students." />
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="education" label="Education" placeholder="MSc Informatics, TU München" />
                <Field id="work" label="Work experience" placeholder="Admissions officer, 2019–2022" />
                <Field id="countries" label="Countries supported" placeholder="Germany, Austria" />
                <Field id="levels" label="Study levels" placeholder="Master's, MBA" />
                <Field id="subjects" label="Subject expertise" placeholder="Computer Science, Engineering" />
                <Field id="students" label="Previous students helped" placeholder="400+" />
                <div className="space-y-2 sm:col-span-2">
                  <Label>Services offered</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {["Profile evaluation", "University shortlisting", "Scholarship guidance", "SOP feedback", "Application support", "Visa guidance"].map((s) => (
                      <label key={s} className="flex items-center gap-2.5 text-sm text-foreground/85">
                        <Checkbox id={s} /> {s}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-5">
                {["Identity document", "Education certificate", "Professional reference"].map((d) => (
                  <div key={d} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-border p-5">
                    <div className="flex items-center gap-3">
                      <Upload className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-bold text-foreground">{d}</p>
                        <p className="text-xs text-muted-foreground">PDF or JPG, up to 10 MB</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Choose file</Button>
                  </div>
                ))}
                <div className="space-y-1.5">
                  <Label htmlFor="commission">Commission disclosure</Label>
                  <Textarea id="commission" rows={3} placeholder="List any universities or agencies that pay you a commission." />
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <Button
              onClick={() =>
                step === steps.length - 1
                  ? toast.success("Application submitted", { description: "We review applications within 3 working days." })
                  : setStep((s) => s + 1)
              }
            >
              {step === steps.length - 1 ? "Submit application" : "Continue"} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        <aside>
          <div className="sticky top-24 rounded-2xl border border-border bg-surface p-5">
            <h2 className="label-caps text-muted-foreground">How verification works</h2>
            <ul className="mt-4 space-y-3 text-sm text-foreground/85">
              {[
                "We check your identity documents against your profile.",
                "Degree certificates are confirmed with the issuing institution.",
                "We contact one professional reference.",
                "Commission relationships are published on your profile.",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({ id, label, placeholder }: { id: string; label: string; placeholder: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} placeholder={placeholder} className="h-11" />
    </div>
  );
}