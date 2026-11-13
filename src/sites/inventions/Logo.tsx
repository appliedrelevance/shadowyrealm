/**
 * The Prior Art mark: a gear drawn like a patent figure, its outline in the
 * drawing's ink with a copper hub. public/inventions/favicon.svg is the same
 * drawing on its own blueprint ground.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="6 6 52 52" className={className} aria-hidden="true">
      <path
        d="M32.00 13.50 L35.38 8.24 L39.77 9.29 L40.40 15.52 L45.08 18.92 L51.19 17.59 L53.55 21.44 L49.59 26.28 L50.50 32.00 L55.76 35.38 L54.71 39.77 L48.48 40.40 L45.08 45.08 L46.41 51.19 L42.56 53.55 L37.72 49.59 L32.00 50.50 L28.62 55.76 L24.23 54.71 L23.60 48.48 L18.92 45.08 L12.81 46.41 L10.45 42.56 L14.41 37.72 L13.50 32.00 L8.24 28.62 L9.29 24.23 L15.52 23.60 L18.92 18.92 L17.59 12.81 L21.44 10.45 L26.28 14.41 Z"
        className="fill-surface-1 stroke-ink"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="32" r="8" className="fill-action stroke-ink" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="2.5" className="fill-surface" />
    </svg>
  );
}
