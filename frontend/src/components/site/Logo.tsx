import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center py-0.5" aria-label="Mentora home">
      <img
        src="/images/MENTORA.png"
        alt="Mentora Logo"
        className="h-11 sm:h-14 lg:h-16 w-auto object-contain max-w-[220px] sm:max-w-[280px] transition-transform duration-200 hover:scale-[1.02]"
      />
    </Link>
  );
}