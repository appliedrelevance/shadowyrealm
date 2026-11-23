# Config-driven sites

Geordie, 2026-11-23: every site has the shape of the Inventions site (home river, ranked index, entity
profiles, full lineage graph, compare, How It Works), with one site menu shared by all of them. "It
should be data and configuration driven, not custom code driven. If we're writing code for each site,
that's a failure. Before you write any code, ask yourself: is there existing code we can re-use?"

A new site is a config file, a token file and its content. Nothing else.

## What is site-specific today, and what replaces it

| Today (code per site) | Replaced by |
|---|---|
| `src/sites/<site>/Logo.tsx`, an inline SVG component | `public/<site>/favicon.svg`, which every site already ships; the shared `Logo` draws it as an image |
| `src/sites/<site>/Hero.tsx` (Inventions: an SVG component; ShadowyRealm: `hero.jpg`) | an image file in `public/<site>/`, named in `brand.hero` |
| `typeIcons` in `src/sites/<site>/ui.tsx` | an icon name on each entity type in the config (`entityTypes[].icon`), read through one shared lucide registry |
| `src/sites/<site>/Methodology.tsx`, prose in JSX | the site's method prose as config data (`copy.methodology.sections`), rendered by the shared page around the shared tables |
| `src/sites/ui.ts` and `ui-types.ts`, the per-site UI registry | deleted |
| Sibling-site links in `AppLayout` | one shared site menu built from `SITES` |
| `src/features/music/*`, `src/sites/history/Music.tsx`, `/music` routes, frozen JSON in `public/history/data/` | the music site, on the shared pages, from its own schema |

Kept per site, because they are data: `src/sites/<site>.ts`, `src/sites/<site>/tokens.css` (the design
system's mechanism: brands differ in values, never in names), `public/<site>/` assets and `content/<site>/`.

## What the engine gains, as configuration

1. **Sides.** `scoring.sides: ["benefit", "harm"]` (today's behaviour) or `["benefit"]`. A one-sided site
   asks Clef only the benefit questions, and every page leaves harm out: index columns, profile bars,
   the influence curve, compare, the method tables. Music's Clef requests must come out byte for byte
   as `music-vital/score.ts` sent them, so its 2,093 answers are read from the System One cache, not paid
   for again (a test, like `test/clef-request.test.ts`).
2. **Picture.** `home.picture: "river"` (today's impact river) or `"stream"`: the centred stream, one band
   per entity, coloured by a grouping the config names (`grouping: { key, groups: [{ name, shades }] }`),
   read from each entity's metadata. The stream is today's `MusicStream`, made generic and moved into
   `src/features/realm/`.
3. **Sites menu.** Every site lists every other from `SITES`, with its favicon, name and `brand.holds`.
4. **Former addresses.** `brand.formerOrigins`: a GET to one is redirected, permanently, to the same path
   on `brand.origin`; other methods are served, so an MCP client on the old address keeps working.

## Stages

Each ends deployed, tested in production and committed.

1. **Sites menu**, from `SITES`, in place of the sibling links. Base UI `Menu` (the design canon's
   headless library).
2. **Inventions moves** to `inventions.shadowyrealm.com`; `priorart.shadowyrealm.com` redirects.
   Handoff: Google sign-in needs the new origin among the auth redirect URLs (the monorepo owns that config).
3. **No UI code per site**: logos, heroes, type icons and method prose become data; `src/sites/ui.ts` goes.
4. **Sides** in the engine, with the cache-identity test for music's requests.
5. **Picture** in the engine: the stream as a configured home picture.
6. **Music credit shares**, read from the evidence: for each of the 1,624 entities that owe credit, the
   share of it owed to its listed causes and its split among them. Offline, cached, at most $2.67 at list
   price; the stream is shown to Geordie before anything deploys.
7. **The music site**: `src/sites/music.ts`, its tokens and favicon, `content/music/` generated from
   `music-vital/`. Handoff: its schema (from `tools/site-schema.ts`) to the monorepo. Load through its MCP
   tools, calibrate tiers, deploy at `music.shadowyrealm.com`.
8. **Retire the music page**: `shadowyrealm.com/music` and `/music/*` redirect to the music site; the
   frozen files and `src/features/music/` are deleted.
