import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  muted = false,
}: {
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
}) {
  return (
    <section className={cn(muted ? "bg-surface border-y border-border/60" : "bg-background", "py-16 sm:py-20 lg:py-24")}>
      <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-primary shadow-xs">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3.5 text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight leading-[1.15]">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}