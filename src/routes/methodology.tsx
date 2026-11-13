import { createFileRoute } from "@tanstack/react-router";
import { COPY } from "@/lib/copy";
import { usePageTitle } from "@/lib/usePageTitle";
import { SITE_UI } from "@/sites/ui";

export const Route = createFileRoute("/methodology")({
  component: MethodologyPage,
});

/** Each site's own account of its method, around tables built from its config. */
function MethodologyPage() {
  usePageTitle(COPY.methodology.heading);
  const Method = SITE_UI.Methodology;
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold text-ink">{COPY.methodology.heading}</h1>
      <Method />
    </div>
  );
}
