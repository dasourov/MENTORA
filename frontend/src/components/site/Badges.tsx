import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifiedBadge({ className, label = "Verified Mentor" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-primary/20 bg-secondary px-2.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wider text-primary shadow-xs",
        className,
      )}
    >
      <BadgeCheck className="h-3.5 w-3.5 fill-primary/20 text-primary" /> {label}
    </span>
  );
}

export function MatchBadge({ value, className }: { value: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-primary/20 bg-secondary px-3 py-1 text-xs font-bold text-primary shadow-xs",
        className,
      )}
    >
      {value}% match
    </span>
  );
}

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/30",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Avatar({ initials, src, size = "md" }: { initials: string; src?: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = {
    sm: "h-10 w-10 text-sm rounded-xl",
    md: "h-14 w-14 text-base rounded-2xl",
    lg: "h-20 w-20 text-xl rounded-2xl",
    xl: "h-28 w-28 text-3xl rounded-3xl",
  } as const;

  const imageSrc = src || (initials?.startsWith("/") ? initials : null);

  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt="Mentor portrait"
        className={cn(
          "shrink-0 object-cover border border-primary/20 shadow-xs ring-2 ring-primary/10 transition-transform duration-200 hover:scale-105",
          sizes[size],
        )}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center border border-primary/20 bg-secondary font-extrabold text-primary shadow-xs ring-2 ring-primary/10 transition-transform duration-200 hover:scale-105",
        sizes[size],
      )}
    >
      {initials}
    </div>
  );
}