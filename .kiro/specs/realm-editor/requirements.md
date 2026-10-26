# Requirements Document

## Project Description (Input)

Give ShadowyRealm a front end for seeing and editing the influence graph by hand, alongside the MCP tools.

- **A graph canvas.**
  - Entities are nodes, sized by magnitude.
  - Credit links are arrows labelled with their strength; descriptive links are drawn differently.
  - The owner creates a link by dragging from one node to another and edits its strength in place. The 100% incoming cap is enforced.
  - Anyone can browse the published graph read-only.
- **An entity editor.** Selecting a node opens a panel that edits:
  - the entity's name, type and description;
  - its periods (years, reach, persistence);
  - each period's ten benefit and harm values;
  - a "Score with Clef" action that runs `score_period`.
- **A profile view.** Benefit and harm side by side for each dimension, split into the entity's own impact and what is credited to it from downstream. It replaces the radar chart.
- **One control layer.** Every edit goes through owner-only Worker routes that wrap the same service functions the MCP tools use. Every new write also gets an MCP tool, so nothing can be done in the UI that Claude cannot do.

This reverses the 2026-10-02 decision that the web UI is display-only, apart from the status button. Forms are a second way into the control layer, not a second control layer.

It depends on the `influence-graph` spec for the ten-number profile, credit and `GET /api/scores`. Until that lands, the canvas shows raw entities and links.

Discovery findings are in `research.md`.

## Requirements
<!-- Will be generated in /kiro-spec-requirements phase -->
