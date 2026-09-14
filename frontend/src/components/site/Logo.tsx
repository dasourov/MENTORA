import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center py-0.5" aria-label="Mentora home">
      <img
        src="/images/MENTORA.jpg"
        alt="Mentora Logo"
        className="h-7 sm:h-8 lg:h-9 w-auto object-contain transition-transform duration-200 hover:scale-[1.02] mix-blend-multiply"
      />
    </Link>
  );
}