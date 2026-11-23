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

## Decisions, 2026-11-23

- The root site is **History** (key `history`, schema still `shadowyrealm`); the others are **Inventions**
  and **Music**, at `inventions.` and `music.shadowyrealm.com`. ShadowyRealm is the name over all of them.
- **One side** is a setting, not a different back end: music keeps the same tables, harm columns at zero.
- **Inventions comes up to History's method**: head-counts for breadth (Clairic, share of everyone alive)
  and credit links built from the evidence. Both change its rankings, so its river is shown first.
- Every schema keeps evidence once and four-place strengths, whatever its breadth.

## Stages

Each ends deployed, tested in production and committed.

1. **Sites menu** (done).
2. **Inventions moves** to `inventions.shadowyrealm.com` (done).
3. **History rename** (done, `b92edb1`).
4. **Monorepo handoff** (`.kiro/handoffs/music-and-inventions-schema.md`): music's schema, Inventions'
   head-count columns, both sign-in addresses. Geordie carries it to a monorepo session.
5. **Sides** in the engine: Clef's request and answers (done: all 2,093 music requests match the answers
   already paid for), the service writing zero harm, every page leaving harm out.
6. **The credit tool**, for any site: Clef proposes the causes an article names that have no link, Clairic
   sizes each share and what each consequence owes in all, and `tools/credit-graph.ts` stores the graph.
   History's 2026-11-14 pilot ran this once; it is written again as a tool, priced before it runs.
7. **Inventions on head-counts**: `breadth: "people"`, its graph from stage 6, a re-score of its 945
   periods (Clairic at most $1.96), tiers calibrated again, its river shown before deploying.
8. **Picture** in the engine: the stream as a configured home picture.
9. **No UI code per site**: logos, heroes, type icons and method prose become data; `src/sites/ui.ts` goes.
10. **The music site**: its tokens, favicon and og image, `content/music/` from `music-vital/`, its graph
    from stage 6, loaded through its MCP tools, tiers calibrated, deployed at `music.shadowyrealm.com`.
11. **Retire the music page**: `shadowyrealm.com/music` and `/music/*` redirect to the music site; the
    frozen files and `src/features/music/` are deleted.
