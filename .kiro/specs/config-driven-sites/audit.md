# Audit: the root site against Inventions, 2026-11-23

## Already one codebase

Both sites run the same Worker, API, MCP tools, service layer, calculator, credit walk, loader and pages
(home river, index, profiles, lineage graph, compare, How It Works). Nothing in `src/` or `tools/`
branches on which site it is; every difference comes from `src/sites/<site>.ts` (`git grep` for the
site keys finds only the registry, generated database types and the schema generator).

## What the root site has that Inventions does not

| Improvement | Root site | Inventions | To bring it over |
|---|---|---|---|
| **Scoring by head-count** (`scoring.breadth: "people"`, 2026-11-15): Clef rates depth, Clairic counts the people affected each year, and reach is that count's share of everyone alive | yes | no: Clef alone, level × a 1–10 reach factor | the people columns in its schema (handoff to the monorepo), then a re-score of its 945 periods with Clairic, priced by the loader's dry run before anything is paid |
| **Model-built influence graph** (`content/system-one-graph.json`): Clef proposed missing causes, Clairic sized each share and what each consequence owes its causes in all; `tools/credit-graph.ts` scales the links to fit | 3,374 links on 624 entities | 558 hand-set links on 344 entities | the tool that asked those questions is not in the repo (it ran once in the 2026-11-14 pilot), so it is written again as a tool for any site; Inventions and music both use it |

Both sites already share whole-article evidence, benefit-worded rubric levels, the every-route credit
walk and the answer cache (2026-11-15 commits `d386bf6`, `f908f88`, `101db45`, `46b5891`).

## Code that exists for one site only

| Code | Site | Fate (plan.md) |
|---|---|---|
| `src/sites/<site>/Logo.tsx`, `Hero.tsx`, `Methodology.tsx`, `ui.tsx` | both | stage 3: assets and config data |
| `src/features/music/`, `src/sites/shadowyrealm/Music.tsx`, `src/routes/music/`, `tools/music-snapshot.ts`, `public/shadowyrealm/data/` | root | stage 8: deleted once music is a site |

## What music needs from the back end

- **One side.** Music has no harm. It keeps the same schema shape as every site, with harm columns that
  stay zero; `scoring.sides: ["benefit"]` stops Clef being asked the harm questions and hides harm on
  every page. The calculator, credit walk and schema generator are unchanged.
- **The stream as its picture.** `home.picture: "stream"`, coloured by a grouping the config names and
  read from each entity's metadata (music: family and shade). The pages around it are the same as
  every site's.
- **Breadth stays "how far it travelled"** (`breadth: "reach"`), decided for music on 2026-11-22; head-counts were rejected for arts.
- **Credit from the model-built graph** above.
