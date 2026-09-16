import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Section, SectionHeading } from "@/components/site/Section";
import {
  BookOpen,
  UserCheck,
  Scale,
  Video,
  CheckCircle2,
  ShieldCheck,
  Award,
  Sparkles,
  GraduationCap,
  Clock,
  FileText,
  BadgeCheck,
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
  imageCaption: string;
  icon: typeof BookOpen;
  highlights: string[];
  metrics: { label: string; value: string };
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
    imageCaption: "Curated intake tailored for international study",
    icon: BookOpen,
    highlights: [
      "Standardized test (IELTS, TOEFL, GRE, GMAT) & GPA mapping",
      "Curated discipline and institutional target selection",
      "Explicit budget range & scholarship ambition alignment",
    ],
    metrics: { label: "Average intake duration", value: "4–5 mins" },
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
    imageCaption: "Rigorous credential verification and background checks",
    icon: UserCheck,
    highlights: [
      "100% verified degrees and institutional affiliations",
      "Discipline-specific mentors matched by academic specialization",
      "Zero agency quotas or biased institutional recruitment incentives",
    ],
    metrics: { label: "Verified mentors", value: "Global Alumni" },
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
    imageCaption: "Zero hidden fees or opaque commission structures",
    icon: Scale,
    highlights: [
      "Explicit per-session pricing without long-term contract lock-ins",
      "Uncensored student ratings and verified admission milestones",
      "Full disclosure of advisory credentials and professional background",
    ],
    metrics: { label: "Price transparency", value: "100% Upfront" },
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
    imageCaption: "Direct strategic guidance with flexible rescheduling",
    icon: Video,
    highlights: [
      "High-definition video consultations with live screen & document review",
      "Structured session summaries and actionable post-meeting milestones",
      "Complimentary rescheduling guarantee up to 12 hours before meeting",
    ],
    metrics: { label: "Reschedule flexibility", value: "12h Prior" },
  },
];

const qualityStandards = [
  {
    icon: ShieldCheck,
    title: "Verified Credentials",
    description:
      "Every advisor undergoes rigorous background checks and document authentication before being accredited on Mentora.",
  },
  {
    icon: Award,
    title: "Independent Counsel",
    description:
      "Advisors are compensated solely for their expertise, ensuring advice is unbiased and always aligned with your best interests.",
  },
  {
    icon: Clock,
    title: "Protected Escrow",
    description:
      "Your session fee is held securely in escrow and released only after your consultation has been successfully conducted.",
  },
];

function HowItWorks() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/15 selection:text-primary">
      <SiteNav />

      {/* Hero Header */}
      <header className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-muted/30 via-background to-background py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>The Mentora Methodology</span>
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-5xl font-serif">
            A Structured, Classic Pathway to Global Higher Education
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            From drafting your admissions dossier to 1-on-1 strategic counsel with verified Ivy League and Oxbridge
            alumni—experience clear, independent guidance every step of the journey.
          </p>
        </div>
      </header>

      {/* Main 4 Steps Process */}
      <main className="py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 sm:space-y-24">
            {stepsData.map((step, index) => {
              const isEven = index % 2 === 1;
              const StepIcon = step.icon;

              return (
                <article
                  key={step.step}
                  aria-labelledby={`step-title-${index}`}
                  className="group relative rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md sm:p-10"
                >
                  <div className={`grid items-center gap-8 lg:grid-cols-12 lg:gap-12 ${isEven ? "lg:flex-row-reverse" : ""}`}>
                    {/* Visual Media Column */}
                    <div className={`lg:col-span-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted/40 shadow-inner group-hover:shadow-sm">
                        <div className="aspect-16/10 w-full overflow-hidden">
                          <img
                            src={step.image}
                            alt={step.imageAlt}
                            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
                            loading={index === 0 ? "eager" : "lazy"}
                          />
                        </div>

                        {/* Classic Ornamental Overlay Ribbon */}
                        <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full border border-border/80 bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-md shadow-xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>{step.imageCaption}</span>
                        </div>

                        {/* Metric Chip */}
                        <div className="absolute right-3 bottom-3 rounded-xl border border-border/80 bg-card/95 px-3 py-1.5 text-right backdrop-blur-md shadow-sm">
                          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            {step.metrics.label}
                          </p>
                          <p className="text-xs font-bold text-foreground">{step.metrics.value}</p>
                        </div>
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className={`space-y-5 lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                      {/* Step Identification */}
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-serif font-bold text-primary ring-1 ring-primary/20">
                          {step.roman}
                        </span>
                        <div className="h-px w-6 bg-border" />
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">
                          {step.phase}
                        </span>
                      </div>

                      {/* Header */}
                      <div>
                        <h2
                          id={`step-title-${index}`}
                          className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-serif"
                        >
                          {step.title}
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {step.description}
                        </p>
                      </div>

                      {/* Professional Highlights Checklist */}
                      <ul className="space-y-2.5 pt-2 border-t border-border/60">
                        {step.highlights.map((highlight) => (
                          <li key={highlight} className="flex items-start gap-2.5 text-xs text-foreground/90 sm:text-sm">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
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

      {/* Classic Trust & Quality Standards Section */}
      <section className="border-t border-border/60 bg-muted/20 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-primary shadow-xs">
              <BadgeCheck className="h-3.5 w-3.5" />
              <span>The Mentora Standard</span>
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-serif">
              Built on Transparency, Academic Rigor, & Integrity
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Unlike traditional study abroad agencies that operate on undisclosed university commissions, Mentora adheres to institutional independence.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {qualityStandards.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-shadow duration-200 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-foreground font-serif">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}