import { createFileRoute } from "@tanstack/react-router";
import { MusicEntityPage } from "@/features/music/MusicEntityPage";
import { SITE_UI } from "@/sites/ui";

export const Route = createFileRoute("/music/$slug")({
  component: MusicSlugPage,
});

/** One entity of the site's music stream, where its UI has one. */
function MusicSlugPage() {
  const { slug } = Route.useParams();
  if (!SITE_UI.music) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-ink">Not found</h1>
        <p className="mt-4 text-ink-muted">This site has no music page.</p>
      </div>
    );
  }
  return <MusicEntityPage slug={slug} />;
}
