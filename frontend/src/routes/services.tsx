import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { formatBDT, popularServices } from "@/data/mock";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Study-abroad services and prices — Mentora" },
      { name: "description", content: "Profile evaluation, shortlisting, scholarships, SOP feedback, application support and visa prep." },
      { property: "og:title", content: "Study-abroad services and prices — Mentora" },
      { property: "og:description", content: "Fixed-price sessions starting from ৳500." },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <Section>
        <SectionHeading
          eyebrow="Services"
          title="Fixed-price sessions, no bundled packages"
          description="Book one session or sequence several as your application progresses."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularServices.map((s) => (
            <div key={s.name} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-base font-bold text-foreground">{s.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              <p className="mt-5 border-t border-border pt-4 text-sm font-bold text-foreground">
                From {formatBDT(s.price)}
              </p>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link to="/advisers">Find advisers</Link>
              </Button>
            </div>
          ))}
        </div>
      </Section>
      <SiteFooter />
    </div>
  );
}