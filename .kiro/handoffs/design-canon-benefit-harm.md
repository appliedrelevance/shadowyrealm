# Handoff: record ShadowyRealm's chart tokens in the design canon

**Execute from:** the appliedrelevance monorepo root checkout
(`/Volumes/Berthold/Landru/code/appliedrelevance/appliedrelevance`), on the branch it is on.
The canon `.kiro/steering/design-stack.md` lives there; the ShadowyRealm session was
authorized to commit only its database migration in that repo.

## What changed in ShadowyRealm

On 2026-11-07 ShadowyRealm added two brand-extension tokens for its impact charts and
re-stepped its categorical series, all in `src/styles/global.css` (commit `df04d17` and
later in the shadowyrealm repo):

- `--color-benefit: #3e9ad6` and `--color-harm: #d9534f`: a diverging pair. Benefit is drawn above an axis and harm below it, so position carries the polarity and colour repeats it.
- `--color-series-1` to `--color-series-5` re-stepped to OKLCH L 0.65 / C 0.14 on the same hue families: `#9d79d7`, `#1da871`, `#c47d04`, `#3496de`, `#cd689b`.

All of them pass the dataviz palette validator on the dark ground (`#181822`/`#1e1e2e`). The worst colour-blind ΔE is 20 for the benefit/harm pair and 9.7 for the series. Every slot is at least 3:1 against the surface.

## The edit

In `.kiro/steering/design-stack.md`, under **Documented brand extensions**, add this bullet
after the georgeeveritt entry:

```markdown
- **ShadowyRealm's `benefit` (#3e9ad6) and `harm` (#d9534f)**: a diverging pair for its
  impact charts. Benefit is drawn above an axis and harm below it. These colours mark data,
  never state or controls, so they are not `ok`/`crit`. Blue/red replaced gold/red because
  gold collapses into red under deuteranopia; the pair passes the dataviz validator on the
  dark ground (CVD ΔE 20). ShadowyRealm's `series-1..5` sit at OKLCH L 0.65 / C 0.14 so
  every slot is in the dark band and clears 3:1 on `surface-1`.
```

## Do not

- Change any other brand's values or the vocabulary list.
- Touch `check-tokens.mjs`. These are brand extensions, and the checker already accepts them because they are defined in the brand's `@theme`.

## Verify

`grep -n "ShadowyRealm's \`benefit\`" .kiro/steering/design-stack.md` returns one line.
