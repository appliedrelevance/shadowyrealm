/**
 * Freeze a site's realm for the video project: fetch `/api/realm` once and write
 * it, with the site's time axis, as `video/assets/realm-data.js`, together with
 * the media the race shows: each board entity's Wikimedia picture and its credit,
 * the reason a leader leads, and, for the countdowns, the first sentence of each
 * counted entity's narrative.
 *
 * A HyperFrames render seeks frame by frame and must not fetch anything, so the
 * composition reads this file through a <script> tag and the pictures from
 * `video/assets/images/` (made with macOS sips and ffmpeg). Committing both makes each video a record of one known
 * state of the data; re-run this to refresh it.
 *
 *   bun tools/video-snapshot.ts               # history
 *   bun tools/video-snapshot.ts inventions    # Inventions
 */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { siteFor } from "../src/sites";
import { firstSentenceOf } from "./narrative-text";

interface RealmEntity {
  slug: string;
  name: string;
  entity_type: string;
  description: string;
  image_url: string | null;
  first_year: number | null;
  last_year: number | null;
  own_magnitude: number;
  credited_magnitude: number;
  total_magnitude: number;
  benefit_total: number;
  harm_total: number;
  tier: string;
  curve: { from: number; benefit: number[]; harm: number[] };
}

interface Realm {
  as_of_year: number;
  entities: RealmEntity[];
  links: { source: string; target: string; relationship_type: string; strength: number; description: string }[];
}

interface Profile {
  score: { profile: { own: { benefit: Record<string, number>; harm: Record<string, number> } } };
}

const key = process.argv[2] ?? "history";
const site = siteFor(key);
const headers = { "User-Agent": site.brand.userAgent };

async function getJson<T>(url: string): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    const response = await fetch(url, { headers });
    if (response.status === 429 && attempt < 4) {
      await Bun.sleep(1000 * Number(response.headers.get("retry-after") ?? 5));
      continue;
    }
    if (!response.ok) throw new Error(`${url} answered ${response.status}: ${await response.text()}`);
    return (await response.json()) as T;
  }
}

async function getBytes(url: string): Promise<Uint8Array> {
  for (let attempt = 1; ; attempt++) {
    const response = await fetch(url, { headers });
    if (response.status === 429 && attempt < 4) {
      await Bun.sleep(1000 * Number(response.headers.get("retry-after") ?? 5));
      continue;
    }
    if (!response.ok) throw new Error(`${url} answered ${response.status}`);
    return new Uint8Array(await response.arrayBuffer());
  }
}

const url = `${site.brand.origin}/api/realm`;
const realm = await getJson<Realm>(url);
if (!Array.isArray(realm.entities) || realm.entities.length === 0) throw new Error(`${url} returned no entities`);
const bySlug = new Map(realm.entities.map((e) => [e.slug, e]));

const snapshot: Record<string, unknown> & { entities: unknown[] } = {
  site: key,
  source: url,
  taken: new Date().toISOString(),
  as_of_year: realm.as_of_year,
  timeline: site.timeline,
  entities: realm.entities.map((e) => ({
    slug: e.slug,
    name: e.name,
    entity_type: e.entity_type,
    description: e.description,
    first_year: e.first_year,
    last_year: e.last_year,
    own_magnitude: e.own_magnitude,
    credited_magnitude: e.credited_magnitude,
    total_magnitude: e.total_magnitude,
    benefit_total: e.benefit_total,
    harm_total: e.harm_total,
    tier: e.tier,
    curve: e.curve,
  })),
  links: realm.links.map((l) => ({
    source: l.source,
    target: l.target,
    relationship_type: l.relationship_type,
    strength: l.strength,
    description: l.description,
  })),
};

// ---- what the race shows, computed by the engine the race draws with ----
const g = globalThis as Record<string, unknown>;
g.window = g;
(0, eval)(readFileSync(new URL("../video/assets/river.js", import.meta.url), "utf8"));
const River = g.River as {
  FILMS: { race: unknown; countdown: { slots: number } };
  RANKINGS: Record<string, { order: (entities: RealmEntity[]) => RealmEntity[] }>;
  board: (
    realm: unknown,
    film: unknown,
  ) => { slots: number; contenders: () => Set<string>; firstLeads: () => { e: { slug: string } }[] };
};
const raceBoard = River.board(snapshot, River.FILMS.race);
const contenders = raceBoard.contenders();
const leaders = raceBoard.firstLeads().map((l) => l.e.slug);
const allTime = [...realm.entities].sort((a, b) => b.total_magnitude - a.total_magnitude).slice(0, raceBoard.slots);

// ---- why each leader leads: the two largest areas of its own profile ----
const dimensionLabel = new Map(site.scoring.dimensions.map((d) => [d.key, d.label]));
const reasons = new Map<string, { side: "benefit" | "harm"; text: string }[]>();
for (const slug of leaders) {
  const own = (await getJson<Profile>(`${site.brand.origin}/api/entities/${slug}`)).score.profile.own;
  const areas = (["benefit", "harm"] as const).flatMap((side) =>
    Object.entries(own[side]).map(([dim, value]) => ({ side, dim, value })),
  );
  areas.sort((a, b) => b.value - a.value);
  reasons.set(
    slug,
    areas.slice(0, 2).map((a) => ({ side: a.side, text: `${dimensionLabel.get(a.dim)} ${a.side}` })),
  );
}

// ---- what the countdowns show: every ranking's top entries ----
const drawn = realm.entities.filter((e) => e.curve.benefit.length > 0);
const counted = Object.values(River.RANKINGS).flatMap((ranking) =>
  ranking.order(drawn).slice(0, River.FILMS.countdown.slots).map((e) => e.slug),
);

// ---- what a countdown's card says: the first sentence of each counted entity's narrative ----
// (null where the entity has none yet; the countdown refuses to build a card without it)
const why = new Map<string, string | null>();
for (const slug of new Set(counted)) {
  const { narrative } = (await getJson<{ entity: { narrative: string | null } }>(`${site.brand.origin}/api/entities/${slug}`)).entity;
  why.set(slug, narrative ? firstSentenceOf(narrative) : null);
}

// ---- pictures: Wikimedia thumbnails, with each file's author and licence ----
const shown = new Set<string>([...contenders, ...allTime.map((e) => e.slug), ...counted]);
interface FileRef {
  slug: string;
  host: string;
  title: string;
}
const files: FileRef[] = [];
for (const slug of shown) {
  const imageUrl = bySlug.get(slug)!.image_url;
  if (!imageUrl) continue;
  const path = new URL(imageUrl).pathname.split("/");
  // /wikipedia/<wiki>/thumb/a/ab/<File>/<size>-<File>  or  /wikipedia/<wiki>/a/ab/<File>
  const wiki = path[2];
  const name = decodeURIComponent(path[3] === "thumb" ? path[6] : path[5]);
  files.push({ slug, host: wiki === "commons" ? "commons.wikimedia.org" : `${wiki}.wikipedia.org`, title: `File:${name}` });
}

interface ImageInfo {
  thumburl: string;
  descriptionurl: string;
  extmetadata?: Record<string, { value: string }>;
}
const info = new Map<string, ImageInfo>();
for (const host of new Set(files.map((f) => f.host))) {
  const titles = files.filter((f) => f.host === host).map((f) => f.title);
  for (let i = 0; i < titles.length; i += 50) {
    const batch = titles.slice(i, i + 50);
    const api =
      `https://${host}/w/api.php?action=query&format=json&formatversion=2&prop=imageinfo` +
      `&iiprop=url%7Cextmetadata&iiurlwidth=330&titles=${encodeURIComponent(batch.join("|"))}`;
    const result = await getJson<{
      query: { normalized?: { from: string; to: string }[]; pages: { title: string; missing?: boolean; imageinfo?: ImageInfo[] }[] };
    }>(api);
    const renamed = new Map((result.query.normalized ?? []).map((n) => [n.to, n.from]));
    for (const page of result.query.pages) {
      if (page.missing || !page.imageinfo) throw new Error(`${host} has no ${page.title}`);
      info.set(`${host} ${renamed.get(page.title) ?? page.title}`, page.imageinfo[0]);
    }
  }
}

const plain = (html: string | undefined) =>
  html
    ?.replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim() || null;

const PICTURE = 224; // px square: twice the card's picture, so it stays sharp
const imagesDir = new URL("../video/assets/images/", import.meta.url);
rmSync(imagesDir, { recursive: true, force: true });
mkdirSync(imagesDir, { recursive: true });
const scratch = mkdtempSync(join(tmpdir(), "video-snapshot-"));
const SRGB = "/System/Library/ColorSync/Profiles/sRGB Profile.icc";
const run = (command: string[]) => {
  const result = Bun.spawnSync(command);
  if (result.exitCode !== 0) throw new Error(`${command.join(" ")} failed: ${result.stderr.toString()}`);
  return result.stdout.toString();
};

const media: Record<string, unknown> = {};
const withheld: string[] = [];
for (const slug of shown) {
  const entry: Record<string, unknown> = { board: contenders.has(slug), image: null, credit: null };
  if (reasons.has(slug)) entry.reason = reasons.get(slug);
  if (why.has(slug)) entry.why = why.get(slug);
  const file = files.find((f) => f.slug === slug);
  if (file) {
    const meta = info.get(`${file.host} ${file.title}`);
    if (!meta) throw new Error(`No image info for ${file.title} on ${file.host}`);
    const ext = meta.extmetadata ?? {};
    if (ext.NonFree?.value === "true" || ext.NonFree?.value === "True") {
      entry.withheld = "non-free";
      withheld.push(`${bySlug.get(slug)!.name} (${file.title})`);
    } else {
      const source = (new URL(meta.thumburl).pathname.match(/\.(jpe?g|png|gif|webp)$/i)?.[1] ?? "").toLowerCase();
      if (!source) throw new Error(`Unexpected thumbnail type: ${meta.thumburl}`);
      // One still frame (an animated GIF would play on the wall clock), in sRGB (macOS sips: some
      // files carry large wide-gamut profiles), cropped square as the board and the card show it.
      // Photographs become JPEG; anything with transparency stays PNG.
      const downloaded = join(scratch, `${slug}.${source}`);
      const still = join(scratch, `${slug}.png`);
      writeFileSync(downloaded, await getBytes(meta.thumburl));
      run(["sips", "-s", "format", "png", "--matchTo", SRGB, downloaded, "--out", still]);
      const pixels = run(["ffprobe", "-v", "error", "-show_entries", "stream=pix_fmt", "-of", "csv=p=0", still]).trim();
      const suffix = /^(rgba|bgra|argb|abgr|ya|yuva|pal8)/.test(pixels) ? "png" : "jpg";
      run([
        "ffmpeg", "-v", "error", "-y", "-i", still,
        "-vf", `scale=${PICTURE}:${PICTURE}:force_original_aspect_ratio=increase,crop=${PICTURE}:${PICTURE}`,
        ...(suffix === "jpg" ? ["-q:v", "3"] : []),
        new URL(`${slug}.${suffix}`, imagesDir).pathname,
      ]);
      entry.image = `assets/images/${slug}.${suffix}`;
      entry.credit = {
        file: file.title.replace(/^File:/, ""),
        artist: plain(ext.Artist?.value),
        source: plain(ext.Credit?.value),
        license: plain(ext.LicenseShortName?.value),
        page: meta.descriptionurl,
      };
    }
  }
  media[slug] = entry;
}
snapshot.media = media;
rmSync(scratch, { recursive: true, force: true });

const out = new URL("../video/assets/realm-data.js", import.meta.url);
writeFileSync(out, `// Written by tools/video-snapshot.ts from ${url}. Do not edit.\nwindow.REALM = ${JSON.stringify(snapshot)};\n`);
const pictures = Object.values(media).filter((m) => (m as { image: string | null }).image).length;
console.log(`${snapshot.entities.length} entities, ${realm.links.length} links, as of ${realm.as_of_year} → ${out.pathname}`);
console.log(`${shown.size} entities shown in the race, ${pictures} pictures → ${imagesDir.pathname}`);
console.log(`${leaders.length} first leaders; ${raceBoard.slots} places on the board`);
if (withheld.length > 0) console.log(`withheld as non-free: ${withheld.join("; ")}`);
