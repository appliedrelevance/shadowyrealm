import { FamilyTable, MusicStream, useMusicSnapshot } from "@/features/music/MusicStream";
import { formatYear } from "@/lib/timeline";

const VITAL_ARTICLES = "https://en.wikipedia.org/wiki/Wikipedia:Vital_articles/Level/5";

/** ShadowyRealm's music page: the music that matters most, drawn as one stream through time. */
export function Music() {
  const { data, isLoading, error } = useMusicSnapshot();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-ink">
        Music{data && `, ${formatYear(data.timeline.start)} to today`}
      </h1>
      <div className="mt-2 max-w-4xl space-y-2 text-ink-2">
        <p>
          The{data && ` ${data.entities.length.toLocaleString("en-US")}`} musicians, composers, genres, traditions,
          instruments and works that matter most,{" "}
          <a href={VITAL_ARTICLES} className="text-action-ink hover:underline" target="_blank" rel="noreferrer">
            chosen to span every era and every part of the world
          </a>
          , from the oldest melody ever written down to the songs of this year.
        </p>
        <p>
          Each band is one of them, and its thickness is what it gave people in that year: joy, consolation and awe;
          worship and ritual; dancing and celebration; stories and history carried from one generation to the next. The
          further it travelled, the thicker it runs. Its colour is its family of music and its shade the branch within
          that family: Classical by era, the world's music by region. The rest of ShadowyRealm weighs good against harm;
          music is weighed only for what it gave.
        </p>
      </div>
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
