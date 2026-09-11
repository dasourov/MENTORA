import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { AdviserCard } from "@/components/site/AdviserCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { advisers, formatBDT } from "@/data/mock";

export const Route = createFileRoute("/advisers/")({
  head: () => ({
    meta: [
      { title: "Browse verified study-abroad advisers — Mentora" },
      {
        name: "description",
        content:
          "Filter verified advisers by destination, study level, service, language, price and rating.",
      },
      { property: "og:title", content: "Browse verified study-abroad advisers — Mentora" },
      { property: "og:description", content: "Compare adviser expertise, reviews and pricing." },
    ],
  }),
  component: AdviserDiscovery,
});

const filterGroups: { title: string; options: string[] }[] = [
  { title: "Destination country", options: ["Germany", "United Kingdom", "Canada", "Australia", "Sweden", "United States"] },
  { title: "Study level", options: ["Bachelor's", "Master's", "PhD", "Diploma"] },
  { title: "Field of study", options: ["Computer Science", "Engineering", "Business", "Public Health"] },
  { title: "Service", options: ["Profile evaluation", "Shortlisting", "Scholarships", "SOP feedback", "Visa guidance"] },
  { title: "Language", options: ["Bangla", "English", "German"] },
  { title: "Availability", options: ["Today", "This week", "Weekends"] },
];

function AdviserDiscovery() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("match");
  const [maxPrice, setMaxPrice] = useState([3000]);
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [minRating, setMinRating] = useState("any");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = advisers.filter((a) => {
      const matchesQuery =
        !q ||
        [a.name, a.headline, a.specialisation, ...a.countries, ...a.expertise]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const matchesPrice = a.price <= (maxPrice[0] ?? 5000);
      const matchesVerified = !verifiedOnly || a.verified;
      const matchesRating = minRating === "any" || a.rating >= Number(minRating);
      return matchesQuery && matchesPrice && matchesVerified && matchesRating;
    });
    return [...list].sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "experience") return b.years - a.years;
      return b.match - a.match;
    });
  }, [query, sort, maxPrice, verifiedOnly, minRating]);

  const filters = (
    <div className="space-y-7">
      <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-3">
        <Label htmlFor="verified" className="text-sm font-semibold">
          Verified advisers only
        </Label>
        <Switch id="verified" checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
      </div>

      <div>
        <h3 className="label-caps text-muted-foreground">Price range</h3>
        <p className="mt-3 text-sm font-bold text-foreground">Up to {formatBDT(maxPrice[0] ?? 0)}</p>
        <Slider
          value={maxPrice}
          onValueChange={setMaxPrice}
          min={500}
          max={5000}
          step={100}
          className="mt-3"
          aria-label="Maximum price"
        />
      </div>

      <div>
        <h3 className="label-caps text-muted-foreground">Rating</h3>
        <Select value={minRating} onValueChange={setMinRating}>
          <SelectTrigger className="mt-3 h-10 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any rating</SelectItem>
            <SelectItem value="4.5">4.5 and above</SelectItem>
            <SelectItem value="4.8">4.8 and above</SelectItem>
            <SelectItem value="4.9">4.9 only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filterGroups.map((group) => (
        <div key={group.title}>
          <h3 className="label-caps text-muted-foreground">{group.title}</h3>
          <div className="mt-3 space-y-2.5">
            {group.options.map((o) => (
              <label key={o} className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground/85">
                <Checkbox id={`${group.title}-${o}`} />
                {o}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">Your adviser matches</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Ranked against your profile: Master's in Computer Science, Germany focus, budget up to ৳2,500.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, country or expertise"
              aria-label="Search advisers"
              className="h-11 bg-background"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="h-11 lg:hidden"
                onClick={() => setDrawerOpen(true)}
              >
                <SlidersHorizontal className="mr-1 h-4 w-4" /> Filters
              </Button>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-11 w-full bg-background sm:w-56" aria-label="Sort advisers">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best match</SelectItem>
                  <SelectItem value="rating">Highest rated</SelectItem>
                  <SelectItem value="price">Lowest price</SelectItem>
                  <SelectItem value="experience">Most experienced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="mt-4 text-sm font-semibold text-foreground">
            {results.length} matching advisers
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:px-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 shadow-card">{filters}</div>
        </aside>

        <div>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
              <h2 className="text-lg font-bold text-foreground">No advisers match these filters</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Try widening your price range or turning off some filters.
              </p>
              <Button
                className="mt-6"
                onClick={() => {
                  setQuery("");
                  setMaxPrice([5000]);
                  setMinRating("any");
                }}
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 xl:grid-cols-2">
              {results.map((a) => (
                <AdviserCard key={a.id} adviser={a} detailed />
              ))}
            </div>
          )}
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setDrawerOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col bg-background">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-base font-extrabold">Filters</h2>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setDrawerOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-border"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{filters}</div>
            <div className="border-t border-border p-4">
              <Button className="h-11 w-full" onClick={() => setDrawerOpen(false)}>
                Show {results.length} advisers
              </Button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}