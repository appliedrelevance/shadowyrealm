/** The active site's mark: the favicon every site ships in public/<site>/, drawn on its own ground. */
export function Logo({ className }: { className?: string }) {
  return <img src="/favicon.svg" alt="" aria-hidden="true" className={className} />;
}
