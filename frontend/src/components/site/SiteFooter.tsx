import { Link } from "@tanstack/react-router";
import { Facebook, Linkedin, Mail, MapPin, Phone, Youtube, Heart } from "lucide-react";
import { Logo } from "./Logo";

const columns: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Platform",
    links: [
      { label: "Find Mentors", to: "/advisers" },
      { label: "How It Works", to: "/how-it-works" },
      { label: "Services", to: "/services" },
      { label: "Admin Console", to: "/admin" },
    ],
  },
  {
    title: "For Students",
    links: [
      { label: "Build profile", to: "/onboarding" },
      { label: "Student dashboard", to: "/dashboard" },
      { label: "Booking flow", to: "/advisers" },
      { label: "Resources", to: "/resources" },
    ],
  },
  {
    title: "For Mentors",
    links: [
      { label: "Become a Mentor", to: "/become-an-adviser" },
      { label: "Mentor dashboard", to: "/adviser-dashboard" },
      { label: "Verification process", to: "/become-an-adviser" },
      { label: "Earnings", to: "/adviser-dashboard" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Country guides", to: "/resources" },
      { label: "Scholarship calendar", to: "/resources" },
      { label: "SOP templates", to: "/resources" },
      { label: "Visa checklists", to: "/resources" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of service", to: "/resources" },
      { label: "Privacy policy", to: "/resources" },
      { label: "Commission policy", to: "/resources" },
      { label: "Refund policy", to: "/resources" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_3fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Mentora connects Bangladeshi students with verified study-abroad mentors —
              transparent session pricing, verified reviews, no agency margins.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-primary" /> Level 6, Gulshan Avenue, Dhaka 1212
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" /> +880 1700 000 000
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" /> hello@mentora.com
              </li>
            </ul>
            <div className="mt-5 flex gap-2">
              {[Facebook, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="grid h-9.5 w-9.5 place-items-center rounded-xl border border-border bg-background text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:bg-secondary hover:text-primary hover:scale-105"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="label-caps text-muted-foreground font-bold">{col.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Mentora. Built with <Heart className="inline h-3.5 w-3.5 fill-[var(--accent-red)] text-[var(--accent-red)] mx-0.5" /> for students in Bangladesh.</p>
          <p>Mentors disclose all university commissions before booking.</p>
        </div>
      </div>
    </footer>
  );
}