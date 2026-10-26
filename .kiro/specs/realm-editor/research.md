# Research & Design Decisions

## Summary
- **Feature**: `realm-editor`
- **Discovery Scope**: New Feature (a graph canvas and editor on the existing React SPA, plus new service writes)
- **Key Findings**:
  - **The UI today is read-only.** It has a list, a profile, a compare view and a methodology page. Relationships are fetched on the profile page but only fed into the calculator; they are never drawn. The only write is the owner's status button.
  - **The service layer can create but not change or remove** periods, assessments or links. There are 10 MCP tools, and none of them updates or deletes those three. The editor needs six new service functions, and MCP-first means six new tools to match.
  - **React Flow 12 (`@xyflow/react` 12.12.0) fits.** It works with React 19, styles nodes as ordinary components with Tailwind, and has CSS variables that map onto the AR tokens. It has no built-in layout; dagre is the recommended default for directed graphs.
  - **`bun run dev` has no Worker**, so no `/api` route works in development. `@cloudflare/vite-plugin` 1.30.0 is installed but not wired into `vite.config.ts`. Wiring it in is the first build step.
  - **Deleting a period silently zeroes its assessments.** `assessments.period_id` is `ON DELETE SET NULL`, so the assessments become unplaced and score zero.

## Research Log

### Existing front end
- **Context**: What can be reused?
- **Sources Consulted**: `src/routes/`, `src/features/`, `src/components/`, `src/lib/auth.tsx`, `src/lib/operator-api.ts`, `src/features/entities/hooks/useEntityMutations.ts`
- **Findings**:
  - Routes: `/` (entity cards, type filter), `/entity/$slug` (profile), `/compare`, `/methodology`, `/login`.
  - The profile page has sections for details, biography, dimensional scores, the radar chart, the calculation breakdown, assessment periods and score history.
  - Reads go from the browser straight to Supabase with the anon key.
  - Writes go through `operatorApi`, which sends the Supabase session token to `/api/*`. `useOperator()` asks `GET /api/session` whether the viewer is the owner, and `StatusWorkflow` shows the status button only to the owner.
  - Stack: React 19, TanStack Router and Query, Tailwind v4 on the AR tokens (`src/styles/global.css`, dark only), Recharts.
  - `react-hook-form` 7.71 and `@hookform/resolvers` 5.2 are installed but unused since the forms were deleted.
  - `components.json` configures shadcn/ui (new-york style, lucide icons), but no shadcn components exist yet.
- **Implications**:
  - The owner gate, `operatorApi` and the token set already exist.
  - The radar chart, breakdown table and methodology page assume signed scores, which the `influence-graph` spec removes, so they will be replaced rather than reused.

### Service layer and MCP surface
- **Context**: What does an editor need to write?
- **Sources Consulted**: `src/lib/sr-service.ts`, `src/worker/mcp.ts`, `src/worker/api.ts`
- **Findings**:
  - Service functions: `listEntities`, `getEntity`, `createEntity`, `updateEntity`, `setEntityStatus`, `deleteEntity` (drafts only), `addAssessment`, `addPeriod`, `addRelationship`, plus `isOperator`.
  - MCP tools mirror them one to one.
  - The Worker exposes only `GET /api/session` and `POST /api/entities/:slug/status`.
  - Missing: update and delete for periods, for assessments and for links.
- **Implications**:
  - Add six service functions with six matching MCP tools: `update_period`, `delete_period`, `update_assessment`, `delete_assessment`, `update_relationship`, `delete_relationship`.
  - Add owner-only `/api` routes for every write the editor makes. Each route is a thin wrapper, like the status route.

### Database behaviour that affects editing
- **Context**: What happens when the editor deletes or changes rows?
- **Sources Consulted**: monorepo `supabase/migrations/20260810120000_baseline.sql`, foreign keys
- **Findings**:
  - Deleting an entity cascades to its periods, assessments, links (either end) and audit entries.
  - Deleting a period sets its assessments' `period_id` to NULL, which leaves them unplaced and scoring zero.
  - Links are unique on (source, target, type), and an entity cannot link to itself.
  - After the `influence-graph` policy tightening, `anon` will read child rows of published entities only.
- **Implications**:
  - `delete_period` deletes the period's assessments in the same call and reports how many it removed. The UI shows that count before confirming.
  - The editor reads through the Worker (owner-only `GET /api/graph`), not straight from Supabase, so drafts' periods and assessments stay readable to the owner once the policies are tightened.

### React Flow
- **Context**: The graph canvas and in-place editing.
- **Sources Consulted**:
  - npm registry: `@xyflow/react` 12.12.0, 2026-09-24, peer `react >=17`.
  - `reactflow.dev/learn/customization/theming`.
  - `reactflow.dev/learn/layouting/layouting`.
- **Findings**:
  - Custom nodes and edges are plain React components, styled with Tailwind.
  - `onConnect` gives drag-to-link; edges can carry labels and buttons.
  - Theming:
    - CSS variables such as `--xy-node-background-color-default`, `--xy-edge-stroke-default`, `--xy-edge-stroke-selected-default`, `--xy-background-pattern-dots-color-default` and `--xy-controls-button-background-color-default`.
    - `colorMode` accepts `dark`, `light` or `system`.
    - Import `@xyflow/react/dist/style.css` into Tailwind's base layer so utilities override it.
  - It has no built-in auto layout.
- **Implications**:
  - Map the `--xy-*` variables to AR tokens in `global.css`, so the token checker sees no raw colour values.
  - Use `colorMode="dark"`, since ShadowyRealm's tokens are dark only.

### Layout
- **Context**: Where do nodes go?
- **Sources Consulted**: React Flow layouting guide; npm registry (`@dagrejs/dagre` 3.1.3, `elkjs` 0.12.0)
- **Findings**:
  - Dagre: a near drop-in for directed graphs, fast, and handles varying node sizes. It has no edge routing.
  - elkjs: the most configurable, with edge routing, but asynchronous and large (the docs' bundle badge reads 1,455,420 against dagre's 39,882).
  - d3-force: physics-based and iterative, so nodes keep moving, which suits exploring more than editing.
  - The guide says nothing specific about cycles. Dagre removes cycles internally before ranking; confirm on a graph that has one.
- **Implications**:
  - Dagre, left to right, so causes sit left of their consequences.
  - The owner can drag nodes; positions are not stored.
  - A later option is a time axis: put x at the entity's first period, on the Temporal Canvas's compressed scale.

### Forms and inputs
- **Context**: Editing entities, periods and benefit/harm values.
- **Sources Consulted**: npm registry (`react-hook-form` 7.91.0, `@hookform/resolvers` 6.0.0 with peer `zod ^3.25 || ^4`, `@radix-ui/react-slider` 1.6.1 with peer `react ^19`)
- **Findings**:
  - The installed `react-hook-form` 7.71 and resolvers 5.2 already work with zod 4.
  - The zod schemas in `src/lib/sr-schemas.ts` validate MCP input today.
- **Implications**:
  - Forms reuse the same zod schemas, so a value the MCP tool would reject is rejected in the form too.
  - The 0–10 benefit and harm inputs use shadcn's Slider (Radix): accessible, keyboard-driven and token-styled. There is no hand-rolled slider.

### Development loop
- **Context**: The editor cannot be built or tested without the Worker in development.
- **Sources Consulted**: `vite.config.ts`, `package.json`, `node_modules` versions, `.gitignore`
- **Findings**:
  - `vite.config.ts` loads only the React, Tailwind and TanStack Router plugins.
  - `@cloudflare/vite-plugin` 1.30.0 is installed (1.65.0 is current, peer `vite ^6.1 || ^7 || ^8`), and Vite is 6.4.1.
  - `.dev.vars` is already gitignored.
- **Implications**:
  - Add the Cloudflare plugin, so `bun run dev` serves `/api` and `/mcp` from the real Worker.
  - Local secrets for the gideon database (service role key, owner id, MCP key) go in `.dev.vars`.

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|---|---|---|---|---|
| React Flow + dagre | Node-graph editor, layered layout | Built for editing; custom nodes in Tailwind; small layout lib | No edge routing | **Selected** |
| Cytoscape.js | Graph analysis and visualisation | Strong layouts and graph algorithms | Canvas rendering; editing UI is hand-built; React wrapper is thin | Rejected: the graph algorithms belong in Postgres here |
| Sigma.js / Graphology | WebGL, large graphs | Thousands of nodes | Editing is hand-built; overkill at tens of nodes | Rejected |
| Raw D3 | Hand-built SVG | Full control | Reinvents drag, connect, zoom and selection | Rejected: don't reinvent the wheel |
| elkjs layout | Configurable, edge routing | Best routing | Asynchronous; about 37× dagre's size | Rejected for now |

## Design Decisions

### Decision: One route, editing for the owner
- **Selected Approach**: A new `/realm` route shows the graph. Anyone sees published entities read-only. The owner, detected through `useOperator()`, also sees drafts and gets drag-to-link, the edit panel and the delete and score actions.
- **Status**: Claude's pick, 2026-10-26.

### Decision: Every UI write has an MCP twin
- **Selected Approach**: Each edit is an owner-only `/api` route over a `sr-service.ts` function, and each such function also has an MCP tool. Six functions and tools are added: update and delete for periods, assessments and links.
- **Rationale**: MCP-first. The UI is a second way in, never the only way.
- **Status**: Claude's pick, from Geordie's MCP-first rule.

### Decision: The editor reads through the Worker
- **Selected Approach**: An owner-only `GET /api/graph` returns every entity with its periods, assessments and links in one response. The public canvas uses `GET /api/scores` (from `influence-graph`) for published entities.
- **Rationale**: It survives the `influence-graph` policy tightening, and the page makes one request.
- **Status**: Claude's pick.

### Decision: Deleting a period deletes its assessments
- **Selected Approach**: `delete_period` removes the period and its assessments together, returns the count, and the UI shows the count before confirming.
- **Rationale**: The foreign key would otherwise leave orphaned assessments that score zero without any sign.
- **Status**: Claude's pick.

### Decision: Live updates from MCP edits
- **Context**: When Claude edits through MCP while the canvas is open, the canvas should catch up.
- **Alternatives Considered**:
  1. TanStack Query refetch on window focus and after every UI write. This is already the default; nothing to build.
  2. Supabase Realtime on the `shadowyrealm` tables, so Claude's edits appear live. It needs the tables in the realtime publication, which is a monorepo handoff, and it fits the "explore Supabase" purpose.
- **Selected Approach**: 1 now, 2 as an optional requirement.
- **Status**: Proposed; Geordie to choose.

### Decision: Profile view replaces the radar
- **Selected Approach**: Ten values, benefit and harm side by side per dimension, each split into own and credited parts, drawn with Recharts (already installed) on the tier and series tokens.
- **Status**: Claude's pick; follows `influence-graph` Requirement 7.

## Risks & Mitigations
- **The editor depends on `influence-graph` for profile and credit data.** Build the canvas and editing on raw data first, and switch sizing and the profile view to `/api/scores` when it lands.
- **`.dev.vars` will hold the local service role key.** It is already gitignored. The gideon key is the local stack's own key, not the cloud key.
- **The graph changes under the canvas when Claude and the owner edit at once.** Last write wins; there is one operator. Refetch after every write.
- **Upgrading `@cloudflare/vite-plugin` from 1.30 to 1.65 could change dev behaviour.** Wire in the installed version first and upgrade separately.

## References
- [React Flow theming](https://reactflow.dev/learn/customization/theming): CSS variables, `colorMode`, Tailwind import order.
- [React Flow layouting](https://reactflow.dev/learn/layouting/layouting): dagre, elkjs and d3 options compared.
- `src/lib/sr-service.ts`, `src/worker/api.ts`, `src/worker/mcp.ts`: the control layer the editor wraps.
- `.kiro/specs/influence-graph/`: the profile, credit and `/api/scores` this depends on.
- `/Volumes/Berthold/Landru/code/appliedrelevance/appliedrelevance/supabase/migrations/20260810120000_baseline.sql`: foreign keys and policies.
