import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatBDT } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Build your student profile — Mentora" },
      {
        name: "description",
        content:
          "Tell us your target destination, budget and grades to get matched with verified advisers.",
      },
      { property: "og:title", content: "Build your student profile — Mentora" },
      { property: "og:description", content: "Five quick steps to your adviser matches." },
    ],
  }),
  component: Onboarding,
});

const countries = ["Germany", "United Kingdom", "Canada", "Australia", "Sweden", "United States", "Netherlands", "Japan"];
const supports = [
  "Profile evaluation",
  "University shortlisting",
  "Scholarship guidance",
  "SOP feedback",
  "Application support",
  "Visa guidance",
];

const stepTitles = [
  "Personal information",
  "Education & results",
  "Destination & degree",
  "Budget & English test",
  "Support required",
];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [matching, setMatching] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["Germany"]);
  const [selectedSupport, setSelectedSupport] = useState<string[]>(["University shortlisting"]);
  const [budget, setBudget] = useState([2500]);

  useEffect(() => {
    if (!matching) return;
    const t = setTimeout(() => navigate({ to: "/advisers" }), 2200);
    return () => clearTimeout(t);
  }, [matching, navigate]);

  const toggle = (list: string[], setList: (v: string[]) => void, value: string) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  if (matching) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-10 text-center shadow-card">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <h1 className="mt-6 text-xl font-extrabold text-foreground">
            Finding your best adviser matches
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Comparing 240+ verified advisers against your results, budget and destinations…
          </p>
          <div className="mt-6 space-y-2 text-left">
            {["Reading your academic profile", "Ranking destination expertise", "Checking availability"].map(
              (t) => (
                <p key={t} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-success" /> {t}
                </p>
              ),
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Logo />
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary">
            Save & exit
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <p className="label-caps text-primary">
              Step {step + 1} of {stepTitles.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.round(((step + 1) / stepTitles.length) * 100)}% complete
            </p>
          </div>
          <Progress value={((step + 1) / stepTitles.length) * 100} className="mt-3 h-1.5" />
          <h1 className="mt-6 text-2xl font-extrabold text-foreground sm:text-3xl">
            {stepTitles[step]}
          </h1>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          {step === 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField id="fullName" label="Full name" placeholder="Nafisa Tabassum" />
              <TextField id="email" label="Email address" type="email" placeholder="nafisa@example.com" />
              <TextField id="phone" label="Mobile number" placeholder="+880 17xx xxx xxx" />
              <TextField id="city" label="City" placeholder="Dhaka" />
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                id="education"
                label="Current education"
                placeholder="Select level"
                options={["HSC / A Levels", "Bachelor's (ongoing)", "Bachelor's (completed)", "Master's"]}
              />
              <TextField id="institution" label="Institution" placeholder="North South University" />
              <TextField id="cgpa" label="Latest CGPA / GPA" placeholder="3.62 out of 4.00" />
              <TextField id="graduation" label="Graduation year" placeholder="2025" />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-7">
              <div>
                <Label className="label-caps text-muted-foreground">Preferred countries</Label>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {countries.map((c) => (
                    <SelectableCard
                      key={c}
                      label={c}
                      selected={selectedCountries.includes(c)}
                      onClick={() => toggle(selectedCountries, setSelectedCountries, c)}
                    />
                  ))}
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField
                  id="degree"
                  label="Intended degree"
                  placeholder="Select degree"
                  options={["Bachelor's", "Master's", "PhD", "Diploma / College"]}
                />
                <SelectField
                  id="field"
                  label="Field of study"
                  placeholder="Select field"
                  options={["Computer Science", "Engineering", "Business", "Public Health", "Social Sciences", "Design"]}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div>
                <Label className="label-caps text-muted-foreground">
                  Estimated budget per consultation
                </Label>
                <p className="mt-3 text-2xl font-extrabold text-foreground">{formatBDT(budget[0] ?? 0)}</p>
                <Slider
                  value={budget}
                  onValueChange={setBudget}
                  min={500}
                  max={5000}
                  step={100}
                  className="mt-4"
                  aria-label="Budget per consultation"
                />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>৳500</span>
                  <span>৳5,000</span>
                </div>
              </div>
              <div>
                <Label className="label-caps text-muted-foreground">English-language test status</Label>
                <RadioGroup defaultValue="planned" className="mt-3 grid gap-3 sm:grid-cols-2">
                  {[
                    ["taken", "Already taken (IELTS / TOEFL)"],
                    ["booked", "Test booked"],
                    ["planned", "Planning to take"],
                    ["none", "Not required for my plan"],
                  ].map(([value, label]) => (
                    <label
                      key={value}
                      htmlFor={value}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4 text-sm font-medium transition-colors hover:border-primary/40 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                    >
                      <RadioGroupItem value={value!} id={value} />
                      {label}
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <Label className="label-caps text-muted-foreground">Support required</Label>
              <p className="mt-1 text-sm text-muted-foreground">Choose everything you might need.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {supports.map((s) => (
                  <SelectableCard
                    key={s}
                    label={s}
                    selected={selectedSupport.includes(s)}
                    onClick={() => toggle(selectedSupport, setSelectedSupport, s)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="min-w-28"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <Button
            className="min-w-36"
            onClick={() => (step === stepTitles.length - 1 ? setMatching(true) : setStep((s) => s + 1))}
          >
            {step === stepTitles.length - 1 ? "See my matches" : "Continue"}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}

function TextField({
  id,
  label,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="label-caps text-muted-foreground">
        {label}
      </Label>
      <Input id={id} type={type} placeholder={placeholder} className="h-11" />
    </div>
  );
}

function SelectField({
  id,
  label,
  placeholder,
  options,
}: {
  id: string;
  label: string;
  placeholder: string;
  options: string[];
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="label-caps text-muted-foreground">
        {label}
      </Label>
      <Select>
        <SelectTrigger id={id} className="h-11 w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function SelectableCard({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex items-center justify-between gap-2 rounded-xl border p-4 text-left text-sm font-medium transition-all",
        selected
          ? "border-primary bg-primary/5 text-primary"
          : "border-border text-foreground hover:border-primary/40",
      )}
    >
      {label}
      {selected && <Check className="h-4 w-4 shrink-0" />}
    </button>
  );
}