import { useState } from "react";
import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  Clock,
  FileCheck2,
  GraduationCap,
  Info,
  Languages,
  MapPin,
  MessageSquare,
  Star,
  Users,
} from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Avatar, Pill, VerifiedBadge } from "@/components/site/Badges";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { advisers, formatBDT, getAdviser, reviewsData } from "@/data/mock";

export const Route = createFileRoute("/advisers/$adviserId")({
  loader: ({ params }) => {
    const adviser = getAdviser(params.adviserId);
    if (!adviser) throw notFound();
    return { name: adviser.name, headline: adviser.headline };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Adviser not found — Mentora" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${loaderData.name} — Study-abroad adviser on Mentora` },
        { name: "description", content: loaderData.headline },
        { property: "og:title", content: `${loaderData.name} — Mentora adviser` },
        { property: "og:description", content: loaderData.headline },
      ],
    };
  },
  component: AdviserProfile,
});

const verificationItems = [
  { label: "Identity verified", detail: "NID and passport matched" },
  { label: "Education verified", detail: "Degree certificate checked" },
  { label: "Experience verified", detail: "Employment history confirmed" },
  { label: "References checked", detail: "2 professional references" },
];

const timeSlots = ["6:00 PM", "7:00 PM", "8:30 PM", "9:30 PM"];

function AdviserProfile() {
  const { adviserId } = useParams({ from: "/advisers/$adviserId" });
  const adviser = getAdviser(adviserId) ?? advisers[0]!;
  const [service, setService] = useState(adviser.services[0]!.id);
  const [slot, setSlot] = useState(timeSlots[1]!);

  const selected = adviser.services.find((s) => s.id === service) ?? adviser.services[0]!;

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <SiteNav />

      {/* Header */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <Avatar initials={adviser.photo} size="xl" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{adviser.name}</h1>
                {adviser.verified && <VerifiedBadge />}
              </div>
              <p className="mt-2 max-w-2xl text-base text-muted-foreground">{adviser.headline}</p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" /> {adviser.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Languages className="h-4 w-4 text-primary" /> {adviser.languages.join(", ")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-warning text-warning" /> {adviser.rating} ({adviser.reviews} reviews)
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-primary" /> {adviser.students} students helped
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-success" /> Responds {adviser.responseTime.toLowerCase()}
                </span>
              </div>
            </div>
            <Button asChild size="lg" className="hidden h-12 px-7 lg:inline-flex">
              <Link to="/book/$adviserId" params={{ adviserId: adviser.id }}>
                Book Consultation
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="min-w-0">
          <Tabs defaultValue="overview">
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-surface p-1">
              {["Overview", "Services", "Experience", "Success Stories", "Reviews", "Availability"].map((t) => (
                <TabsTrigger key={t} value={t.toLowerCase().replace(/\s/g, "-")} className="text-sm">
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <Panel title="About the adviser">
                <p className="text-sm leading-relaxed text-foreground/85">{adviser.bio}</p>
              </Panel>
              <div className="grid gap-6 sm:grid-cols-2">
                <Panel title="Countries supported">
                  <div className="flex flex-wrap gap-2">
                    {adviser.countries.map((c) => (
                      <Pill key={c}>{c}</Pill>
                    ))}
                  </div>
                </Panel>
                <Panel title="Study levels">
                  <div className="flex flex-wrap gap-2">
                    {adviser.levels.map((c) => (
                      <Pill key={c}>{c}</Pill>
                    ))}
                  </div>
                </Panel>
                <Panel title="Subject expertise">
                  <div className="flex flex-wrap gap-2">
                    {adviser.expertise.map((c) => (
                      <Pill key={c} className="border-primary/20 bg-primary/5 text-primary">
                        {c}
                      </Pill>
                    ))}
                  </div>
                </Panel>
                <Panel title="Languages">
                  <div className="flex flex-wrap gap-2">
                    {adviser.languages.map((c) => (
                      <Pill key={c}>{c}</Pill>
                    ))}
                  </div>
                </Panel>
              </div>
              <Panel title="Advising approach">
                <p className="text-sm leading-relaxed text-foreground/85">{adviser.approach}</p>
              </Panel>

              {/* Verification */}
              <Panel title="Verification">
                <div className="grid gap-3 sm:grid-cols-2">
                  {verificationItems.map((v) => (
                    <div key={v.label} className="flex items-start gap-3 rounded-xl border border-border p-4">
                      <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                      <div>
                        <p className="text-sm font-bold text-foreground">{v.label}</p>
                        <p className="text-xs text-muted-foreground">{v.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
                  <div>
                    <p className="text-sm font-bold text-foreground">Commission disclosure</p>
                    <p className="mt-1 text-sm text-foreground/80">{adviser.commission}</p>
                  </div>
                </div>
              </Panel>
            </TabsContent>

            <TabsContent value="services" className="mt-6 grid gap-5 sm:grid-cols-2">
              {adviser.services.map((s) => (
                <div key={s.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-bold text-foreground">{s.name}</h3>
                    <span className="shrink-0 text-base font-extrabold text-primary">{formatBDT(s.price)}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {s.duration}
                  </p>
                  <ul className="mt-4 flex-1 space-y-1.5">
                    {s.includes.map((i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {i}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-5">
                    <Link to="/book/$adviserId" params={{ adviserId: adviser.id }}>
                      Book
                    </Link>
                  </Button>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="experience" className="mt-6 space-y-6">
              <Panel title="Professional experience">
                <ol className="space-y-5">
                  {[
                    ["2022 — Present", "Independent study-abroad adviser, Mentora"],
                    ["2019 — 2022", "Admissions support officer, international student office"],
                    ["2016 — 2019", `MSc graduate and student mentor, ${adviser.countries[0]}`],
                  ].map(([period, role]) => (
                    <li key={period} className="border-l-2 border-primary/25 pl-4">
                      <p className="label-caps text-primary">{period}</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{role}</p>
                    </li>
                  ))}
                </ol>
              </Panel>
              <Panel title="Education">
                <div className="flex items-start gap-3">
                  <GraduationCap className="mt-0.5 h-5 w-5 text-primary" />
                  <p className="text-sm text-foreground/85">
                    MSc, {adviser.countries[0]} · BSc, Bangladesh · {adviser.years} years advising experience
                  </p>
                </div>
              </Panel>
            </TabsContent>

            <TabsContent value="success-stories" className="mt-6 grid gap-5 sm:grid-cols-2">
              {[
                ["Rafiul, BUET", "Two fully tuition-free offers in Germany for Winter 2025."],
                ["Sadia, DU", "Commonwealth shortlist after two SOP rebuilds."],
                ["Mahin, NSU", "Study permit approved on first attempt."],
                ["Tanjina, BRACU", "৳0 tuition MSc with a €934/month stipend."],
              ].map(([who, what]) => (
                <div key={who} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                  <FileCheck2 className="h-5 w-5 text-success" />
                  <p className="mt-3 text-sm font-bold text-foreground">{who}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{what}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="reviews" className="mt-6 space-y-5">
              <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-border bg-card p-5 shadow-card">
                <div>
                  <p className="text-4xl font-extrabold text-foreground">{adviser.rating}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{adviser.reviews} verified reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star, i) => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="w-4 text-xs text-muted-foreground">{star}</span>
                      <div className="h-1.5 flex-1 rounded-full bg-surface">
                        <div
                          className="h-1.5 rounded-full bg-primary"
                          style={{ width: `${[86, 10, 3, 1, 0][i]}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {reviewsData.map((r) => (
                <div key={r.name} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Avatar initials={r.name.slice(0, 2).toUpperCase()} size="sm" />
                      <div>
                        <p className="text-sm font-bold text-foreground">{r.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.service} · {r.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={
                            i < r.rating ? "h-4 w-4 fill-warning text-warning" : "h-4 w-4 text-border"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/85">{r.text}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="availability" className="mt-6">
              <Panel title="Next 5 days">
                <div className="grid gap-3 sm:grid-cols-5">
                  {["Sun 2", "Mon 3", "Tue 4", "Wed 5", "Thu 6"].map((d, i) => (
                    <div key={d} className="rounded-xl border border-border p-3 text-center">
                      <p className="text-sm font-bold text-foreground">{d}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{[4, 2, 0, 3, 5][i]} slots</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="h-4 w-4 text-primary" /> Timezone: Asia/Dhaka (GMT+6)
                </p>
              </Panel>
            </TabsContent>
          </Tabs>
        </div>

        {/* Booking panel */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-lift">
            <p className="label-caps text-muted-foreground">Book a consultation</p>
            <div className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="service" className="text-xs font-semibold text-muted-foreground">
                  Select service
                </Label>
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger id="service" className="h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {adviser.services.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Choose date</Label>
                <div className="grid grid-cols-5 gap-1.5">
                  {["Sun", "Mon", "Tue", "Wed", "Thu"].map((d, i) => (
                    <button
                      key={d}
                      type="button"
                      className="rounded-xl border border-border py-2 text-center text-xs font-semibold transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="block text-muted-foreground">{d}</span>
                      {2 + i}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Choose time</Label>
                <div className="grid grid-cols-2 gap-1.5">
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSlot(t)}
                      aria-pressed={slot === t}
                      className={
                        slot === t
                          ? "rounded-xl border border-primary bg-primary/5 py-2 text-xs font-semibold text-primary"
                          : "rounded-xl border border-border py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/40"
                      }
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Session</dt>
                <dd className="font-medium text-foreground">{selected.duration}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Platform fee</dt>
                <dd className="font-medium text-foreground">{formatBDT(50)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base">
                <dt className="font-bold text-foreground">Total</dt>
                <dd className="font-extrabold text-foreground">{formatBDT(selected.price + 50)}</dd>
              </div>
            </dl>

            <Button asChild className="mt-5 h-11 w-full">
              <Link to="/book/$adviserId" params={{ adviserId: adviser.id }}>
                Continue to booking
              </Link>
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" /> Free rescheduling up to 12 hours before
            </p>
          </div>
        </aside>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">From</p>
            <p className="truncate text-base font-extrabold text-foreground">{formatBDT(adviser.price)}</p>
          </div>
          <Button asChild className="h-11 flex-1">
            <Link to="/book/$adviserId" params={{ adviserId: adviser.id }}>
              Book Consultation
            </Link>
          </Button>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h2 className="label-caps text-muted-foreground">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}