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
2. **Clef**, Cloudflare's decision model, scores each period in one request: benefit and harm for each dimension, plus reach and persistence. It works from evidence text taken from Wikipedia, which is stored with the score.
3. A **TypeScript calculator** turns each period into a level per year (dimension weight × value × reach) and integrates the curve into influence-centuries. A fading tail follows the last period, shrunk by the share of the legacy that its consequences carry.
4. **Postgres** computes the credit: `shadowyrealm.credit_shares()` is a recursive CTE that walks every chain of links, stops at cycles, and keeps each pair's strongest chain. It was cross-checked against pgRouting's `pgr_johnson` with edge cost −ln(strength) (`.kiro/specs/influence-graph/pgrouting-crosscheck.sql`).
5. The **Worker** adds each descendant's own profile × share and serves one computation to every page and to the MCP tools.

The full design and its decisions are in [`.kiro/specs/influence-graph/`](.kiro/specs/influence-graph/).

## Architecture

| Layer | What it is |
|---|---|
| Sites | `src/sites/<site>.ts` holds everything specific to a field: dimensions, weights, Clef wording, rubrics, entity and link types, timeline, tiers, copy and brand. `shadowyrealm` and `inventions` (Prior Art) are registered. |
| Front end | React 19, Vite, TanStack Router and Query, Tailwind v4 on the Applied Relevance design tokens, d3-scale and d3-shape for the charts |
| Worker | One Cloudflare Worker serves the SPA, `/api/*` (reads plus the owner's status control), `/mcp`, and crawler-friendly `/entity/*` pages and `/sitemap.xml` |
| Control layer | An MCP server with 12 tools (`src/worker/mcp.ts`) over a single service layer (`src/lib/sr-service.ts`). Every write, including content loading, goes through it. |
| Data | Supabase Postgres, one schema per site (`shadowyrealm`, `inventions`), generated from the site config by `tools/site-schema.ts`. Row-level security lets anyone read published entities only, and only the Worker's service role can write. |
| Scoring model | `@cf/cloudflare/clef` on Workers AI, through AI Gateway |

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

The loader is re-runnable. It creates what is missing, links causes to consequences, gathers Wikipedia evidence for each period and has Clef score it. `content/realm.ts` is the whole index: 624 entities, 733 periods and 298 links. `content/NEXT-500.md` is a readable list of the second wave of 500.
