import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Star, Users, MessageCircleHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, MatchBadge, Pill, VerifiedBadge } from "./Badges";
import { formatBDT, type Adviser } from "@/data/mock";

export function AdviserCard({ adviser, detailed = false }: { adviser: Adviser; detailed?: boolean }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border/80 bg-card p-5.5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift">
      <div className="flex items-start gap-4">
        <Avatar initials={adviser.photo} size={detailed ? "lg" : "md"} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-bold text-foreground group-hover:text-primary transition-colors">
              {adviser.name}
            </h3>
            {adviser.verified && <VerifiedBadge />}
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{adviser.headline}</p>
          {detailed && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" /> {adviser.location}
            </p>
          )}
        </div>
        {detailed && <MatchBadge value={adviser.match} className="shrink-0" />}
      </div>

      {detailed ? (
        <>
          <div className="mt-3.5 rounded-xl border border-primary/15 bg-primary/5 p-3 text-xs leading-relaxed text-muted-foreground">
            <span className="font-extrabold text-primary">{adviser.match}% match</span> — {adviser.matchReason}
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-foreground/80">{adviser.bio}</p>
        </>
      ) : (
        <p className="mt-3.5 text-sm font-medium text-foreground/85 line-clamp-2">{adviser.specialisation}</p>
      )}

      <div className="mt-3.5 flex flex-wrap gap-1.5">
        {adviser.countries.slice(0, 3).map((c) => (
          <Pill key={c}>{c}</Pill>
        ))}
        {detailed &&
          adviser.expertise.slice(0, 3).map((e) => (
            <Pill key={e} className="border-primary/20 bg-primary/8 font-semibold text-primary">
              {e}
            </Pill>
          ))}
      </div>

      {detailed && (
        <p className="mt-3 text-xs text-muted-foreground">Languages: {adviser.languages.join(", ")}</p>
      )}

      <dl className="mt-4 grid grid-cols-3 gap-2.5 rounded-xl border border-border/60 bg-surface/60 p-3 text-xs">
        <div>
          <dt className="text-muted-foreground font-medium">Rating</dt>
          <dd className="mt-0.5 flex items-center gap-1 font-bold text-foreground">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            {adviser.rating} <span className="font-normal text-muted-foreground">({adviser.reviews})</span>
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground font-medium">Students</dt>
          <dd className="mt-0.5 flex items-center gap-1 font-bold text-foreground">
            <Users className="h-3.5 w-3.5 text-primary" /> {adviser.students}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground font-medium">Experience</dt>
          <dd className="mt-0.5 font-bold text-foreground">{adviser.years} yrs</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-end justify-between gap-3 pt-1">
        <div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">Session Fee</p>
          <p className="text-xl font-extrabold tracking-tight text-primary">{formatBDT(adviser.price)}</p>
        </div>
        {detailed ? (
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-success" /> {adviser.nextAvailable}
          </p>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
            <MessageCircleHeart className="h-3.5 w-3.5" /> Direct Consultation
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button asChild variant="outline" className="flex-1">
          <Link to="/advisers/$adviserId" params={{ adviserId: adviser.id }}>
            View Profile
          </Link>
        </Button>
        {detailed && (
          <Button asChild className="flex-1">
            <Link to="/book/$adviserId" params={{ adviserId: adviser.id }}>
              Book Consultation
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}