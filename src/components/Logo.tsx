import { SITE_UI } from "@/sites/ui";

/** The active site's mark. */
export function Logo({ className }: { className?: string }) {
  const Mark = SITE_UI.Logo;
  return <Mark className={className} />;
}
