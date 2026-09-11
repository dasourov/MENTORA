import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GraduationCap, UserCheck, ArrowRight, ShieldCheck } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/onboarding/select-role")({
  head: () => ({
    meta: [
      { title: "Select Role — Mentora" },
      { name: "description", content: "Choose how you want to use Mentora: as a Student or as an Adviser." },
    ],
  }),
  component: SelectRolePage,
});

function SelectRolePage() {
  const { selectRole } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<"student" | "advisor">("student");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    const res = await selectRole(selectedRole);
    setLoading(false);
    if (res.target) {
      navigate({ to: res.target as any });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-secondary px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-primary shadow-xs">
            <ShieldCheck className="h-3.5 w-3.5 fill-primary/20 text-primary" /> Step 1 of Onboarding
          </span>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            How would you like to use Mentora?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Select your account type to personalize your guidance experience.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 text-left">
            {/* STUDENT CARD */}
            <div
              onClick={() => setSelectedRole("student")}
              className={`group cursor-pointer rounded-3xl border p-6 transition-all duration-200 ${
                selectedRole === "student"
                  ? "border-primary bg-secondary/80 ring-2 ring-primary/20 shadow-lift"
                  : "border-border bg-card hover:border-primary/40 hover:shadow-card"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${selectedRole === "student" ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"}`}>
                  <GraduationCap className="h-6 w-6" />
                </span>
                <span className={`h-5 w-5 rounded-full border-2 grid place-items-center ${selectedRole === "student" ? "border-primary bg-primary" : "border-muted-foreground/30"}`}>
                  {selectedRole === "student" && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-foreground">Student</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Find verified advisers and get guidance for your study-abroad journey.
              </p>
            </div>

            {/* ADVISER CARD */}
            <div
              onClick={() => setSelectedRole("advisor")}
              className={`group cursor-pointer rounded-3xl border p-6 transition-all duration-200 ${
                selectedRole === "advisor"
                  ? "border-primary bg-secondary/80 ring-2 ring-primary/20 shadow-lift"
                  : "border-border bg-card hover:border-primary/40 hover:shadow-card"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${selectedRole === "advisor" ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"}`}>
                  <UserCheck className="h-6 w-6" />
                </span>
                <span className={`h-5 w-5 rounded-full border-2 grid place-items-center ${selectedRole === "advisor" ? "border-primary bg-primary" : "border-muted-foreground/30"}`}>
                  {selectedRole === "advisor" && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-foreground">Adviser</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Offer consultations and support students with their university applications.
              </p>
            </div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            You can request a role change later through account support.
          </p>

          <Button
            size="lg"
            onClick={handleContinue}
            disabled={loading}
            className="mt-6 h-12 w-full sm:w-64 font-bold text-base shadow-lift"
          >
            {loading ? "Saving role..." : "Continue"} <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
