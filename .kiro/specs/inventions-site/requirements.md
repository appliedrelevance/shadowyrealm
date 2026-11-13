# Requirements Document

## Introduction

The inventions site is the second site on the platform (spec `site-platform`). It is an index of **inventions, inventors and products**, scored with ShadowyRealm's machinery on dimensions of its own.

It changes what influence means in three ways:
- **Five dimensions of its own**: Prosperity, Health & Safety, Knowledge & Culture, Freedom & Power, and Environment. None of them measures "advancing technology", because what an invention makes possible already reaches it as credit from the things built on it.
- **The lineage graph is the technology tree.** Link types say how one thing led to another: originated, builds on, embodies, made, led and mentored.
- **Share means originality.** The share of an invention credited to an inventor accounts for rival claimants. Whatever an invention or product does not credit to its causes is its own originality.

Benefit and harm stay apart, and the field is full of entities large on both sides. Fritz Haber's ammonia process feeds billions, and he also ran Germany's chlorine gas programme. Thomas Midgley Jr. gave the world leaded petrol and CFCs.

## Boundary Context
- **In scope**:
  - the inventions site config, copy, methodology prose and brand;
  - the `inventions` schema, by handoff;
  - the `inventions` wrangler environment;
  - the benchmark, the launch content and tier calibration;
  - measuring the credit walk on the denser technology graph, and replacing it if it is too slow.
- **Out of scope**:
  - changes to ShadowyRealm;
  - links or shared entities between sites;
  - importing links from Wikidata or patent databases.
- **Adjacent expectations**:
  - This spec starts when `site-platform` is complete.
  - Every change to the shared database is executed by a session rooted in the appliedrelevance monorepo, from `handoff.md` in this spec folder.
  - Geordie chooses the site's name and domain. Requirement 9's brand work starts from that choice.

## Requirements

### Requirement 1: The inventions schema
**Objective:** As the owner of the shared database, I want the inventions site in its own schema generated from its config, so that the two sites share code but never data.

#### Acceptance Criteria
1. `handoff.md` in this spec folder shall hold the output of `bun tools/site-schema.ts inventions`, with a verification query for each step and its expected result, for the cloud project and the local stack.
2. The shared Supabase project and the local stack shall have the `inventions` schema, exposed through the Data API.
3. `src/lib/database.types.ts` shall include the `inventions` schema, and the platform's type test shall pass for it.

### Requirement 2: Dimensions of an invention's influence
**Objective:** As a reader, I want inventions scored on the ways inventions change lives, so that the scores answer what a thing did to the world rather than how clever it was.

#### Acceptance Criteria
1. The inventions site shall score benefit and harm on five dimensions:

   | Key | Label | Benefit | Harm |
   |---|---|---|---|
   | `prosperity` | Prosperity | work saved, productivity, cheaper goods, new industries, livelihoods | livelihoods destroyed, monopoly, ruin |
   | `health` | Health & Safety | lives saved, disease and injury prevented | deaths, injury, disease, addiction |
   | `knowledge` | Knowledge & Culture | learning, communication, information, art, entertainment | misinformation, propaganda, cultural loss |
   | `freedom` | Freedom & Power | independence, choice, emancipation | coercion, surveillance, domination, enslavement |
   | `environment` | Environment | efficiency, cleaner substitutes, restoration | emissions, pollution, extraction, waste |

2. Each of the five dimensions shall have a weight of 1.0.
3. The inventions site shall have no dimension for advancing science or technology. What an invention makes possible shall reach it only as credit from the entities that build on it.
4. Clef shall judge the Environment dimension by its effect on the natural world as well as on people.

### Requirement 3: Entity types
**Objective:** As the operator, I want entity types that separate an idea from the thing sold, so that the graph can say which inventions a product contains.

#### Acceptance Criteria
1. The inventions site shall have six entity types:

   | Key | What it is | Examples |
   |---|---|---|
   | `person` | an inventor, engineer, designer, or the founder or leader of an organization in the index | Jack Kilby, Thomas Midgley Jr. |
   | `organization` | a laboratory or company that originated or made something in the index | Bell Labs, BASF |
   | `project` | a time-bound organized effort that originated an invention | Manhattan Project, ARPANET |
   | `invention` | a technique, device, material or process | transistor, Haber process |
   | `product` | one specific thing made and sold under one name, including a brand that names one product | Ford Model T, Walkman, iPhone |
   | `discovery` | a finding about nature that an invention in the index builds on | electromagnetic induction |

2. The `discovery` type shall require an outgoing `builds_on` link, so that the loader rejects a discovery that nothing in its file builds on.

### Requirement 4: Link types and credit
**Objective:** As the operator, I want link types that say how one thing led to another, so that a profile reads "invented by", "builds on" and "made by", and the credit follows the technology tree.

#### Acceptance Criteria
1. The inventions site shall have nine link types. Each points from cause to consequence:

   | Key | From | To | Credit |
   |---|---|---|---|
   | `originated` | person, organization, project | invention, discovery, product | yes |
   | `builds_on` | discovery, invention, product | invention, product | yes |
   | `embodies` | invention | product | yes |
   | `made` | organization | product | yes |
   | `led` | person | organization, project | yes |
   | `mentorship` | person | person | yes |
   | `collaboration` | any | any | no |
   | `rivalry` | any | any | no |
   | `supersedes` | invention, product | invention, product | no |

2. A `supersedes` link shall point from the old entity to the one that replaced it. The old entity's profile shall list it as "Replaced by", and the new entity's profile as "Replaced".
3. `originated` shall read "Invented by" into an invention, "Discovered by" into a discovery and "Created by" into a product.
4. `made` shall be used for the organization that brought a product to market, and `originated` into a product for the people who designed it.
5. The `why` of every `originated` link shall name the rival claimants to the same invention, where there are any. Its share shall be smaller for each rival who came close.

### Requirement 5: Clef wording
**Objective:** As the operator, I want Clef's questions phrased for the kind of thing being scored, so that a transistor is judged on its use and an inventor on their work.

#### Acceptance Criteria
1. The subject phrase shall be "{name}'s own direct activity" for a person, organization or project; "the making and use of {name}" for an invention or product; and "the spread and use of {name}" for a discovery.
2. The Environment questions shall name "the people and the natural world it affected". The other four dimensions shall name "the people it affected".
3. The site shall use the platform's `HISTORICAL_RUBRICS`, with the influence unit `{ years: 100, name: "influence-centuries" }`.

### Requirement 6: Timeline
**Objective:** As a reader, I want the river to reach back to the first farming, so that the plough and bronze have their place.

#### Acceptance Criteria
1. The timeline shall start at 10,000 BCE, with ticks at 10,000, 5,000, 3,000 and 1,000 BCE, and at 1, 1000, 1500, 1700, 1800, 1900, 1950 and 2000 CE.
2. The near offset shall be 40 years and the bucket count 200, as on ShadowyRealm.

### Requirement 7: The credit walk on a dense graph
**Objective:** As the operator, I want the credit walk measured on the technology tree, which fans out far more than history does, so that page loads stay fast.

#### Acceptance Criteria
1. With the launch set loaded, `inventions.credit_shares(false)` shall complete within 500 ms on the shared project, measured with `EXPLAIN ANALYZE`.
2. If it does not, a handoff shall replace the inventions schema's function with a PL/pgSQL relaxation that keeps the strongest share for each pair on each pass, until a pass changes nothing.
3. When the replacement is in place, it shall return the same pairs as the recursive CTE on the benchmark set, with shares that agree within 0.005.

### Requirement 8: Copy and methodology
**Objective:** As a reader, I want the site to explain itself in its own terms, so that the method is clear without ShadowyRealm's examples.

#### Acceptance Criteria
1. The methodology page shall explain the five dimensions, why there is no technology dimension, the link types, and share as originality, using examples from the inventions content.
2. The tier descriptors shall be:

   | Tier | Descriptor |
   |---|---|
   | Notable | Changed one industry or one era |
   | Major | Changed work or life across a nation or a field |
   | Great | Changed daily life across nations and generations |
   | Epochal | Defined an epoch for much of humanity |
   | Legendary | Changed how humans live, for millennia |

3. The MCP server's instructions shall describe the entity types, the link types and their direction, and the originality rule, with inventions examples.

### Requirement 9: Deployment and brand
**Objective:** As the owner, I want the inventions site live under its own name, so that readers meet it as a site in its own right.

#### Acceptance Criteria
1. `wrangler.json` shall hold an `inventions` environment: Worker `inventions`, `SITE=inventions`, assets `./dist/inventions`, the `ai` binding, the Supabase variables, and `workers_dev: true`.
2. The site shall serve on its `workers.dev` hostname until its domain is chosen. The environment shall then route the domain.
3. `src/sites/inventions/` shall hold the site's logo, hero image, Open Graph image and token values. The token values shall pass `bun run lint:tokens`.

### Requirement 10: Benchmark and tiers
**Objective:** As the operator, I want a benchmark that exercises every new link type and both kinds of two-sided entity, so that the tiers rest on real results and a broken rule shows up before launch.

#### Acceptance Criteria
1. The benchmark content file shall hold these chains, with their periods and links:
   - **Computing:** Bell Labs, William Shockley, John Bardeen, Walter Brattain, transistor, Shockley Semiconductor Laboratory, Fairchild Semiconductor, Texas Instruments, Jack Kilby, Robert Noyce, integrated circuit, Intel, Ted Hoff, Federico Faggin, microprocessor, Intel 4004, lithium-ion battery, multi-touch, Apple Inc., Steve Jobs and iPhone.
   - **Nitrogen:** Fritz Haber, Carl Bosch, BASF and the Haber process.
   - **Engines:** Thomas Newcomen, the Newcomen atmospheric engine, James Watt, the Watt steam engine, Nikolaus Otto, the internal combustion engine, Karl Benz, the Benz Patent-Motorwagen, Henry Ford, Ford Motor Company, the assembly line, the Ford Model T, Thomas Midgley Jr., General Motors, tetraethyllead and chlorofluorocarbons.
   - **Electric light:** Michael Faraday, electromagnetic induction, Joseph Swan, Thomas Edison, the incandescent light bulb, General Electric, George Westinghouse, Westinghouse Electric Corporation and the LED lamp.
   - **Scale pair:** Johannes Gutenberg, the printing press, Sony and the Walkman.
2. The benchmark shall be loaded as drafts and scored through the inventions site's MCP tools.
3. When the benchmark is scored, `research.md` in this spec folder shall record each entity's total, own and credited magnitude, its benefit and harm totals, and the date of the run.
4. `research.md` shall also record whether each of these holds:
   - Thomas Midgley Jr.'s harm total exceeds his benefit total.
   - The transistor's total magnitude exceeds the Intel 4004's.
   - The printing press's total magnitude exceeds the Walkman's.
   - Jack Kilby, Robert Noyce, Joseph Swan, Thomas Newcomen and Nikolaus Otto each have a credited magnitude greater than their own.
   - `inventions.credit_shares(false)` holds a row for (Bell Labs, iPhone) whose share equals the product of the strengths along its strongest chain.

   Each that does not hold shall be explained in `research.md` before tiers are set.
5. When the launch set is scored, the tier thresholds shall be set by the platform's calibration rule and recorded in `research.md`.
