import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How Mentora works — from profile to booked consultation" },
      { name: "description", content: "Learn how we verify advisers, display transparent fees, and protect student bookings." },
      { property: "og:title", content: "How Mentora works" },
      { property: "og:description", content: "Four steps from confusion to a booked consultation." },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  ["Build your student profile", "Share results, budget, destination and the support you need — it takes five minutes."],
  ["Get adviser matches", "We rank verified advisers by real experience with profiles like yours."],
  ["Compare expertise and pricing", "Every price, review and commission disclosure is visible before you pay."],
  ["Book a consultation", "Pick a slot, pay per session and meet online. Reschedule free up to 12 hours before."],
];

function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <Section>
        <SectionHeading eyebrow="How it works" title="A clear path, priced per session" />
        <ol className="mt-12 grid gap-6 sm:grid-cols-2">
          {steps.map(([t, d], i) => (
            <li key={t} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <span className="label-caps text-primary">Step {i + 1}</span>
              <h2 className="mt-3 text-lg font-bold text-foreground">{t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </li>
          ))}
        </ol>
        <Button asChild size="lg" className="mt-10 h-12 px-7">
          <Link to="/onboarding">Start your profile</Link>
        </Button>
      </Section>
      <SiteFooter />
    </div>
  );
}