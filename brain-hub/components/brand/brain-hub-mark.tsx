import { cn } from "@/lib/utils";

/** Vector brand mark — simple geometric “BH” monogram (SVG). */
export function BrainHubMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("text-[var(--primary)]", className)}
      aria-hidden
    >
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="12"
        fill="currentColor"
        opacity="0.12"
      />
      <path
        d="M14 34V14h8.2c4.3 0 7 2.3 7 5.8 0 2.3-1.2 4.1-3.3 5.1 2.6.9 4.2 2.9 4.2 5.7 0 3.8-3 6.4-7.6 6.4H14zm5.1-11.4h3c2.1 0 3.3-1 3.3-2.6s-1.2-2.5-3.3-2.5h-3v5.1zm0 8.7h3.5c2.4 0 3.8-1.1 3.8-2.9s-1.4-2.8-3.8-2.8h-3.5v5.7z"
        fill="currentColor"
      />
    </svg>
  );
}
