/**
 * The gate mark: a stone arch glowing from within, after the home page's carved gate.
 * public/favicon.svg is the same drawing on its own dark ground.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="10 11 44 44" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="sr-logo-glow" cx="50%" cy="85%" r="70%">
          <stop offset="0" style={{ stopColor: "var(--color-ember)" }} />
          <stop offset="0.45" style={{ stopColor: "var(--color-crit)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-crit-soft)" }} />
        </radialGradient>
      </defs>
      <path d="M19 52V30a13 13 0 0 1 26 0v22z" fill="url(#sr-logo-glow)" />
      <path d="M19 52V30a13 13 0 0 1 26 0v22" fill="none" className="stroke-action-ink" strokeWidth="4" strokeLinejoin="round" />
      <path d="M12 52h40" className="stroke-action-ink" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
