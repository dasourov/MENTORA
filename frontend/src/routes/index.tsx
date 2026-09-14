import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  ClipboardList,
  Eye,
  FileText,
  GraduationCap,
  Handshake,
  Lock,
  MessagesSquare,
  Quote,
  Receipt,
  ScrollText,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Stamp,
  UserRoundSearch,
  Wallet,
  CheckCircle2,
  HeartHandshake,
} from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Section, SectionHeading } from "@/components/site/Section";
import { AdviserCard } from "@/components/site/AdviserCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { advisers, formatBDT, popularServices, testimonials } from "@/data/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mentora — Find Verified Study-Abroad Advisers in Bangladesh" },
      {
        name: "description",
        content:
          "Compare and book verified study-abroad advisers for university selection, scholarships, SOP feedback and visa preparation. Transparent pricing in BDT.",
      },
      { property: "og:title", content: "Mentora — Verified Study-Abroad Advisers" },
      {
        property: "og:description",
        content: "Match with verified advisers who know your grades, budget and destination.",
      },
    ],
  }),
  component: Index,
});

const trustIndicators = [
  { icon: ShieldCheck, title: "Verified Mentors", text: "Identity, education & certificates manually checked by our team." },
  { icon: Receipt, title: "Transparent Session Fees", text: "Every session price shown upfront in BDT. Zero package lock-ins." },
  { icon: Star, title: "Genuine Student Ratings", text: "Reviews exclusively from students with completed consultations." },
  { icon: Sparkles, title: "Personalised Matching", text: "Matches based on grades, budget and target university preferences." },
];

const steps = [
  { icon: ClipboardList, title: "Build your student profile", text: "Share your academic background, budget, destination and goals." },
  { icon: UserRoundSearch, title: "Get matched with mentors", text: "We rank verified advisers with proven admission success for your target track." },
  { icon: SlidersHorizontal, title: "Compare specialisations & fees", text: "Side-by-side expertise, student reviews and transparent per-session pricing." },
  { icon: CalendarCheck, title: "Book 1-on-1 consultation", text: "Pick a convenient video call slot, pay per session, and get clear guidance." },
];

const serviceIcons = [Eye, GraduationCap, Wallet, ScrollText, FileText, Stamp];

const whyPoints = [
  { icon: BadgeCheck, title: "Verified mentor credentials", text: "Passport, university transcripts, NID, and reference checks before listing." },
  { icon: Receipt, title: "Transparent per-session pricing", text: "Fixed prices upfront. No bundled retainers, no hidden commission cuts." },
  { icon: Handshake, title: "Full commission disclosure", text: "If an adviser receives university partner compensation, it's explicitly shown." },
  { icon: Star, title: "Authentic student reviews", text: "Only students who booked and attended a session can leave feedback." },
  { icon: Lock, title: "End-to-end privacy & security", text: "Messaging, document sharing, and payment escrow stay protected." },
  { icon: MessagesSquare, title: "Student-first unbiased advice", text: "Recommendations ranked strictly by fit for your career, never paid placement." },
];

function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pt-4 pb-14 sm:px-6 sm:pt-6 sm:pb-18 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8 lg:pt-8 lg:pb-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary px-4 py-1.5 text-xs font-bold text-primary shadow-xs">
              <ShieldCheck className="h-4 w-4 fill-primary/20 text-primary" /> 240+ Verified Mentors Active
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl tracking-tight">
              Find the right study-abroad mentor for your journey
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Connect with verified mentors who truly understand your academic profile, target destination, financial plan, and scholarship ambitions.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12.5 px-8 text-base shadow-lift">
                <Link to="/onboarding">
                  Find My Mentor <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12.5 px-7 text-base">
                <Link to="/become-an-adviser">Become a Mentor</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                ["12,400+", "Students guided"],
                ["4.8 / 5", "Average mentor rating"],
                ["28", "Destination countries"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="text-2xl font-extrabold text-primary">{v}</dt>
                  <dd className="mt-1 text-xs font-medium text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Matching panel */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-secondary/60"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--primary) 22%, transparent) 1px, transparent 0)",
                backgroundSize: "22px 22px",
              }}
            />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/advisers" });
              }}
              className="rounded-3xl border border-border bg-card p-6.5 shadow-lift sm:p-8"
            >
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-secondary text-primary">
                  <HeartHandshake className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-lg font-extrabold text-foreground">Match with a mentor</h2>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Answer 4 quick questions to unlock a personalized shortlist of verified mentors.
              </p>

              <div className="mt-6 space-y-4">
                <Field label="Study destination" id="destination" placeholder="Select a country"
                  options={["Germany", "United Kingdom", "Canada", "Australia", "Sweden", "United States"]} />
                <Field label="Study level" id="level" placeholder="Select a level"
                  options={["Bachelor's", "Master's", "PhD", "Diploma / College"]} />
                <Field label="Field of study" id="field" placeholder="Select a field"
                  options={["Computer Science", "Engineering", "Business", "Public Health", "Social Sciences"]} />
                <Field label="Type of support needed" id="support" placeholder="Select support"
                  options={["Profile evaluation", "University shortlisting", "Scholarship guidance", "SOP feedback", "Visa guidance"]} />
              </div>

              <Button type="submit" size="lg" className="mt-6 h-12 w-full text-base font-bold shadow-lift">
                <Search className="mr-2 h-4 w-4" /> Find Mentors Now
              </Button>
              <p className="mt-3.5 text-center text-xs text-muted-foreground">
                <CheckCircle2 className="inline h-3.5 w-3.5 text-primary mr-1" /> Free to browse. Pay only when you book a session.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Trust */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {trustIndicators.map((t) => (
            <div key={t.title} className="flex items-start gap-3.5 rounded-2xl border border-border bg-background p-4 shadow-xs">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                <t.icon className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground">{t.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <Section>
        <SectionHeading
          eyebrow="How it works"
          title="From confusion to a booked consultation in four simple steps"
          description="No chaotic consultancy queues, no multi-lakh package trap. Transparent advice tailored to your budget."
        />
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="inline-flex items-center rounded-full border border-primary/20 bg-secondary px-2.5 py-0.5 text-[0.6875rem] font-extrabold uppercase tracking-wider text-primary">
                  Step 0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-base font-bold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Featured advisers */}
      <Section muted>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Top Verified Mentors" title="Mentors students booked most this month" />
          <Button asChild variant="outline" className="font-semibold">
            <Link to="/advisers">Browse all mentors <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {advisers.slice(0, 4).map((a) => (
            <AdviserCard key={a.id} adviser={a} />
          ))}
        </div>
      </Section>

      {/* Popular services */}
      <Section>
        <SectionHeading
          eyebrow="Popular services"
          title="Pay for the exact support you need"
          description="Every service is a single, fixed-price session — book one specific review or build your own guidance plan."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularServices.map((s, i) => {
            const Icon = serviceIcons[i] ?? Eye;
            return (
              <div
                key={s.name}
                className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-bold text-foreground group-hover:text-primary transition-colors">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">Starting from</span>
                    <p className="text-base font-extrabold text-primary">{formatBDT(s.price)}</p>
                  </div>
                  <Link
                    to="/advisers"
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary transition-transform group-hover:translate-x-1"
                  >
                    Find mentors <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Why */}
      <Section muted>
        <SectionHeading
          eyebrow="Why Mentora"
          title="Built to eliminate guesswork from study-abroad advice"
          description="Bangladeshi students lose lakhs of Taka to opaque agencies every year. We make every service, price, and credential transparent."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyPoints.map((p) => (
            <div key={p.title} className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:border-primary/20">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary">
                <p.icon className="h-4.5 w-4.5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section>
        <SectionHeading eyebrow="Student stories" title="Real Bangladeshi students who achieved their dream" />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-2xl border border-border bg-card p-6.5 shadow-card transition-all duration-200 hover:shadow-lift">
              <Quote className="h-7 w-7 text-[var(--brand-teal)]/40" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/85 font-medium italic">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-4 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-primary font-bold text-xs">
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.detail}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* Mentor CTA */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-16 sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-white">
              Mentor Partner Program
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl leading-tight">
              Turn your study-abroad success into rewarding 1-on-1 guidance
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/85">
              Set your own session fees, choose your availability, and mentor students matching your university expertise.
            </p>
          </div>
          <Button asChild size="lg" className="h-12.5 px-8 text-base font-bold bg-primary text-primary-foreground shadow-lg">
            <Link to="/become-an-adviser">Join as a Mentor</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  id,
  placeholder,
  options,
}: {
  label: string;
  id: string;
  placeholder: string;
  options: string[];
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="label-caps text-muted-foreground font-semibold">
        {label}
      </Label>
      <Select>
        <SelectTrigger id={id} className="h-11 w-full rounded-xl border-border bg-card">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
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
