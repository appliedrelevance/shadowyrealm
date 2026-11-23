import { createFileRoute } from "@tanstack/react-router";
import { usePageTitle } from "@/lib/usePageTitle";
import { SITE_UI } from "@/sites/ui";

export const Route = createFileRoute("/music/")({
  component: MusicPage,
});

/** The site's music stream, where its UI has one. */
function MusicPage() {
  const music = SITE_UI.music;
  usePageTitle(music?.label);
  if (!music) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-ink">Not found</h1>
        <p className="mt-4 text-ink-muted">This site has no music page.</p>
      </div>
    );
  }
  return <music.Page />;
}
