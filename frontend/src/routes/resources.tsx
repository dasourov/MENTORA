import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Section, SectionHeading } from "@/components/site/Section";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources for Bangladeshi students — Mentora" },
      { name: "description", content: "Country guides, scholarship calendar, SOP templates and visa checklists." },
      { property: "og:title", content: "Resources for Bangladeshi students — Mentora" },
      { property: "og:description", content: "Free guides to plan your study-abroad application." },
    ],
  }),
  component: Resources,
});

const resources = [
  ["Germany country guide", "APS, Uni-Assist and blocked account explained step by step."],
  ["Scholarship calendar 2027", "Deadlines for Chevening, Commonwealth, Erasmus Mundus and DAAD."],
  ["SOP structure template", "A paragraph-by-paragraph outline reviewers actually read."],
  ["Visa document checklist", "What Bangladeshi applicants need for the most common destinations."],
  ["Cost of living comparison", "Monthly budgets in Taka for 12 popular student cities."],
  ["Commission policy", "How adviser commission disclosure works on Mentora."],
];

function Resources() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <Section>
        <SectionHeading eyebrow="Resources" title="Guides written for Bangladeshi applicants" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map(([t, d]) => (
            <article key={t} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-base font-bold text-foreground">{t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </article>
          ))}
        </div>
      </Section>
      <SiteFooter />
    </div>
  );
}