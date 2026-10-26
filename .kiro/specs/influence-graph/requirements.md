# Requirements Document

## Project Description (Input)

Rework ShadowyRealm's scoring so the number measures influence, and so influence flows through a graph of entities.

- **Influence, not net benefit.** An entity's score is how much it changed the world (magnitude), with the balance of benefit and harm kept as a separate direction. Today the five signed dimensions are averaged, so harm cancels benefit and a figure who transformed science while causing mass death scores like one who did nothing.
- **Reality is irrelevant.** People, fictional characters (Santa, Rumpelstiltskin, Harry Potter), organizations and other legal fictions, and events are all scored on what the idea of them did.
- **Credit flows through the graph.** A consequence credits its causes along influence links, multi-hop, by the strongest chain of link strengths. Harm done by institutions in a figure's name reaches the figure (Crusades → Church → Jesus). Events such as the Crusades and 9/11 carry most of the harm and benefit and pass it upstream.
- **Postgres does the graph.** ShadowyRealm is a research platform for Supabase and Postgres extensions. The credit graph is computed in the database: a recursive CTE first, then pgRouting as a comparison.
- **Clef does the scoring.** `research_entity` stops asking a generative model for whole-entity scores. It asks Cloudflare's Clef decision model one typed `score` question per dimension per period, and records the probabilities.

Discovery findings and the decisions made so far are in `research.md`.

## Requirements
<!-- Will be generated in /kiro-spec-requirements phase -->
