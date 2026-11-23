import { FamilyTable, MusicStream, useMusicSnapshot } from "@/features/music/MusicStream";

const VITAL_ARTICLES = "https://en.wikipedia.org/wiki/Wikipedia:Vital_articles/Level/5";

/** "a, b and c" */
const listed = (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`);

/** ShadowyRealm's music page: the vital articles in music, scored and drawn as one stream. */
export function Music() {
  const { data, isLoading, error } = useMusicSnapshot();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-ink">
        Music, scored{data && `: ${data.entities.length.toLocaleString("en-US")} vital articles`}
      </h1>
      <p className="mt-2 max-w-4xl text-ink-2">
        Every musician, composer, genre, tradition, instrument and work on English Wikipedia's{" "}
        <a href={VITAL_ARTICLES} className="text-action-ink hover:underline" target="_blank" rel="noreferrer">
          Vital Articles
        </a>{" "}
        list, which its editors keep balanced across eras and regions. Clef read each one's article and scored it
        {data ? ` on ${listed(data.dimensions)}` : ""} and on how far it travelled. Music has no harm side: each band is an entity's own influence, its hue the genre family and its
        shade the list's section within it.
      </p>
      <div className="mt-6">
        {error && <p className="text-crit">Failed to load: {error.message}</p>}
        {isLoading && <div className="h-[660px] animate-pulse rounded-lg bg-surface-1" />}
        {data && (
          <>
            <MusicStream data={data} />
            <h2 className="mt-10 font-display text-xl font-bold text-ink">The families</h2>
            <div className="mt-3">
              <FamilyTable data={data} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
