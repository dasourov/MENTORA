import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  BookOpen,
  UserCheck,
  Scale,
  Video,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How Mentora Works — A Classic, Transparent Pathway to Global Admissions" },
      {
        name: "description",
        content:
          "Explore the Mentora methodology: from building your academic profile to precision matching, transparent pricing, and 1-on-1 strategic consultations.",
      },
      { property: "og:title", content: "How Mentora Works — Structured Admissions Advisory" },
      {
        property: "og:description",
        content:
          "A refined, four-stage approach connecting ambitious students with verified Ivy League & Oxbridge mentors.",
      },
    ],
  }),
  component: HowItWorks,
});

interface StepData {
  step: string;
  roman: string;
  phase: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: typeof BookOpen;
  highlights: string[];
}

const stepsData: StepData[] = [
  {
    step: "Step 01",
    roman: "I",
    phase: "Phase 01 · Academic Dossier",
    title: "Build Your Academic Profile",
    description:
      "Map your academic milestones, standardized test credentials, target disciplines, and prospective study destinations into a refined student dossier. Our structured framework pinpoints your unique strengths and defines your optimal advisory focus in minutes.",
    image: "/images/how-it-works/step-1-profile.jpg",
    imageAlt: "Student preparing university admissions profile at a classic collegiate study desk",
    icon: BookOpen,
    highlights: [
      "Standardized test (IELTS, TOEFL, GRE, GMAT) & GPA mapping",
      "Curated discipline and institutional target selection",
      "Explicit budget range & scholarship ambition alignment",
    ],
  },
  {
    step: "Step 02",
    roman: "II",
    phase: "Phase 02 · Scholarly Pairing",
    title: "Precision Advisor Matching",
    description:
      "We pair you with vetted alumni, subject specialists, and admissions mentors from world-leading universities—including Oxford, Cambridge, Harvard, and MIT—who have achieved proven success across your target discipline and country.",
    image: "/images/how-it-works/step-2-matching.jpg",
    imageAlt: "Faculty and alumni advisors reviewing candidate academic dossiers",
    icon: UserCheck,
    highlights: [
      "100% verified degrees and institutional affiliations",
      "Discipline-specific mentors matched by academic specialization",
      "Zero agency quotas or biased institutional recruitment incentives",
    ],
  },
  {
    step: "Step 03",
    roman: "III",
    phase: "Phase 03 · Ethical Governance",
    title: "Compare Expertise & Transparent Pricing",
    description:
      "Evaluate verified mentor biographies, alumni track records, and authentic student reviews with absolute fiscal clarity. Every consultation fee is published upfront per session, ensuring complete independence from traditional agent kickbacks.",
    image: "/images/how-it-works/step-3-pricing.jpg",
    imageAlt: "Comparative evaluation folio with transparent criteria and credentials",
    icon: Scale,
    highlights: [
      "Explicit per-session pricing without long-term contract lock-ins",
      "Uncensored student ratings and verified admission milestones",
      "Full disclosure of advisory credentials and professional background",
    ],
  },
  {
    step: "Step 04",
    roman: "IV",
    phase: "Phase 04 · Strategic Engagement",
    title: "Book & Conduct 1-on-1 Consultations",
    description:
      "Select your preferred session slot and engage in interactive, face-to-face video mentorship. Work through Statement of Purpose (SOP) critiques, scholarship proposal defense, and university interview preparation with dedicated undivided focus.",
    image: "/images/how-it-works/step-4-consultation.jpg",
    imageAlt: "One-on-one collegiate mentorship consultation in session",
    icon: Video,
    highlights: [
      "High-definition video consultations with live screen & document review",
      "Structured session summaries and actionable post-meeting milestones",
      "Complimentary rescheduling guarantee up to 12 hours before meeting",
    ],
  },
];

function HowItWorks() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/15 selection:text-primary">
      <SiteNav />

      {/* Hero Header - compact spacing */}
      <header className="relative overflow-hidden bg-gradient-to-b from-muted/30 via-background to-background pt-10 pb-4 sm:pt-14 sm:pb-6">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl font-serif">
            A Structured, Classic Pathway to Global Higher Education
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            From drafting your admissions dossier to 1-on-1 strategic counsel with verified Ivy League and Oxbridge
            alumni—experience clear, independent guidance every step of the journey.
          </p>
        </div>
      </header>

      {/* Main 4 Steps Process - pulled up tight */}
      <main className="pt-2 pb-16 sm:pt-4 sm:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-10 sm:space-y-14">
            {stepsData.map((step, index) => {
              const isEven = index % 2 === 1;

              return (
                <article
                  key={step.step}
                  aria-labelledby={`step-title-${index}`}
                  className="group relative rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md sm:p-8"
                >
                  <div className={`grid items-center gap-6 lg:grid-cols-12 lg:gap-10 ${isEven ? "lg:flex-row-reverse" : ""}`}>
                    {/* Visual Media Column (No image caption or overlays) */}
                    <div className={`lg:col-span-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted/40 shadow-inner">
                        <div className="aspect-16/10 w-full overflow-hidden">
                          <img
                            src={step.image}
                            alt={step.imageAlt}
                            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-102"
                            loading={index === 0 ? "eager" : "lazy"}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className={`space-y-4 lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                      {/* Step Identification */}
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-serif font-bold text-primary ring-1 ring-primary/20">
                          {step.roman}
                        </span>
                        <div className="h-px w-5 bg-border" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                          {step.phase}
                        </span>
                      </div>

                      {/* Header */}
                      <div>
                        <h2
                          id={`step-title-${index}`}
                          className="text-xl font-bold tracking-tight text-foreground sm:text-2xl font-serif"
                        >
                          {step.title}
                        </h2>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                          {step.description}
                        </p>
                      </div>

                      {/* Professional Highlights Checklist */}
                      <ul className="space-y-2 pt-2 border-t border-border/60">
                        {step.highlights.map((highlight) => (
                          <li key={highlight} className="flex items-start gap-2.5 text-xs text-foreground/90 sm:text-sm">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}