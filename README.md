# ShadowyRealm

**[shadowyrealm.com](https://shadowyrealm.com)** ranks people, institutions and events by their influence across five thousand years: who shaped the world, for better and for worse.

The same engine runs a second site, **[Prior Art](https://priorart.shadowyrealm.com)**, which scores inventions, inventors and products on dimensions of their own. Each site is a config in `src/sites/`, a Postgres schema and a Worker deployment (spec: [`.kiro/specs/site-platform/`](.kiro/specs/site-platform/)).

ShadowyRealm measures influence, not virtue. Every entity carries ten numbers, a benefit and a harm for each of five dimensions (scientific, economic, human rights, health, cultural). They are never netted against each other. Influence also flows backward through history: each consequence passes a share of its weight to its causes, so the First Crusade credits the Catholic Church, and the Church credits Jesus.

## What's on the site

- **The river of influence** (home): every entity's own influence, year by year, stacked on a logarithmic time axis. Benefit rises above the line and harm falls below it.
- **Lineage** (`/realm`): every entity placed at the year it began, with arrows from cause to consequence. Selecting one lights up the chain it draws credit from and the chain it passes credit to.
- **Profiles**: total influence split into own and credited, the influence curve, the ten-number profile, lineage with shares, and the evidence each period was scored from.
- **Compare** and **How It Works**.

## How a score is made

1. An entity's direct activity is divided into **periods**: a reign, a ministry, a war, a company's platform era.
2. Two of Cloudflare's System One models read each period's evidence, its description and the whole Wikipedia article, which is stored with the score. **Clef** rates the depth of each dimension's benefit and harm for the people affected, and how long the effects lasted. **Clairic** counts the living people the entity's own activity benefited and harmed in a typical year of the period, in each dimension.
3. A **TypeScript calculator** turns each period into a level per year (dimension weight × depth × people) and integrates the curve into influence-centuries. A fading tail follows the last period, shrunk by the share of the legacy that its consequences carry.
4. The **influence graph** is the curated links plus the causes Clef proposed and Clairic sized (`content/system-one-graph.json`). Each consequence gives away at most what Clairic says it owes its causes together, and its links are scaled to fit (`tools/credit-graph.ts`).
5. The **Worker** computes the credit (`walkShares` in `src/lib/credit.ts`): an ancestor's share of a descendant is the chance that a walk upstream from the descendant, taking each cause with its link's strength, reaches the ancestor, every route added up. It adds each descendant's own profile × share and serves one computation to every page and to the MCP tools.

Prior Art keeps the earlier method: Clef alone, a level of weight × value × reach, and Postgres's strongest-chain `credit_shares()`. `ScoringConfig.breadth` (`src/sites/types.ts`) chooses between the two.

The full design and its decisions are in [`.kiro/specs/influence-graph/`](.kiro/specs/influence-graph/).

## Architecture

| Layer | What it is |
|---|---|
| Sites | `src/sites/<site>.ts` holds everything specific to a field: dimensions, weights, Clef wording, rubrics, entity and link types, timeline, tiers, copy and brand. `shadowyrealm` and `inventions` (Prior Art) are registered. |
| Front end | React 19, Vite, TanStack Router and Query, Tailwind v4 on the Applied Relevance design tokens, d3-scale and d3-shape for the charts |
| Worker | One Cloudflare Worker serves the SPA, `/api/*` (reads plus the owner's status control), `/mcp`, and crawler-friendly `/entity/*` pages and `/sitemap.xml` |
| Control layer | An MCP server with 13 tools (`src/worker/mcp.ts`) over a single service layer (`src/lib/sr-service.ts`). Every write, including content loading, goes through it. |
| Data | Supabase Postgres, one schema per site (`shadowyrealm`, `inventions`), generated from the site config by `tools/site-schema.ts`. Row-level security lets anyone read published entities only, and only the Worker's service role can write. |
| Scoring models | `@cf/cloudflare/clef` and `@cf/cloudflare/clairic` on Workers AI, through AI Gateway |

## Working on it

```bash
bun install
bun run test                          # unit tests, run against every site's config
bun run build                         # typecheck, then build each site into dist/<site>/
bunx wrangler deploy                  # deploy ShadowyRealm
bunx wrangler deploy --env inventions # deploy Prior Art
bun run e2e                           # read-only browser tests, against shadowyrealm.com by default
E2E_SITE=inventions E2E_BASE_URL=https://priorart.shadowyrealm.com bunx playwright test --project=site
SITE=inventions bunx vite             # a dev server for one site
```

CI (`.github/workflows/ci.yml`) runs the lint, the design-token check, the unit tests and the build on every push to `main` and every pull request. Deploys stay manual.

Content lives in `content/` (ShadowyRealm) and `content/inventions/` (Prior Art). Check a content index, then load it through that site's MCP tools:

```bash
bun tools/content-check.ts content/inventions/index.ts
MCP_URL=https://shadowyrealm.com/mcp MCP_API_KEY=… bun tools/realm-load.ts content/realm.ts --publish
MCP_URL=https://priorart.shadowyrealm.com/mcp MCP_API_KEY=… bun tools/realm-load.ts content/inventions/index.ts --publish
```

The loader is re-runnable. It creates what is missing, links causes to consequences, gathers Wikipedia evidence for each period and has it scored. `content/realm.ts` is the whole index: 624 entities, 733 periods, 298 curated links and 3,576 System One proposals, of which 3,076 are kept as links. `content/NEXT-500.md` is a readable list of the second wave of 500.

Videos live in `video/`, [HyperFrames](https://hyperframes.heygen.com) projects: HTML compositions rendered to MP4 frame by frame. `video/` is the 60-second River of Influence and `video/race/` the five-minute race with its live leaderboard; both draw the river with `video/assets/river.js`. A render never fetches, so it reads a frozen copy of `/api/realm` that `tools/video-snapshot.ts` writes to `video/assets/realm-data.js`, with the race's pictures in `video/assets/images/`: Wikimedia stills made with macOS `sips` and ffmpeg, each with its author and licence. Each project's `SPEC.md` is its film shot by shot.

```bash
bun tools/video-snapshot.ts                       # refresh the data both videos show
bun tools/video-description.ts                    # the race's YouTube description: chapters and picture credits
bun tools/video-description.ts --credits          # every picture's file, author, licence and page
cd video && npx hyperframes check                 # lint, layout, contrast and timing; likewise in video/race
npx hyperframes render --output /Volumes/Berthold/Landru/media/exports/shadowyrealm/river-of-influence.mp4
cd race && npx hyperframes render --output /Volumes/Berthold/Landru/media/exports/shadowyrealm/river-race.mp4
```
