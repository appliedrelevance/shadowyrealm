#!/usr/bin/env node
/**
 * AR design-system adherence check.
 *
 * One script, every property. It exists because each rule below is a trap that
 * already cost real time during the token migration, and a trap written down in
 * a steering document is a trap that happens again. Each is now a build
 * failure instead.
 *
 * Canon: appliedrelevance/.kiro/steering/design-stack.md
 *
 *   1  raw stock-palette utility        drift; ignores the brand palette
 *   2  raw hex outside the token file   a value that will drift from the token
 *   3  dangling var(--color-*)          renders as nothing, never errors
 *   4  var(--token, #fallback)          the fallback hides a dead token name
 *   5  utility-class E2E selector       renaming a class breaks the suite silently
 *   6  biome CSS scope vs @theme        biome aborts CSS checks on Tailwind syntax
 *
 * Deliberately a text pass, not an AST pass: what is being matched is a
 * class-name string and a CSS custom property, and text is the honest
 * representation of both. It also has to read `.astro`, which oxlint cannot
 * parse — it skips those files silently, which is how a content site ends up
 * reporting clean while checking nothing.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'

// --- configuration ---------------------------------------------------------
//
// This file is IDENTICAL in every property. Everything that legitimately
// differs lives in `tools/check-tokens.config.json` next to it — same idea as
// the tokens themselves: one set of names, per-brand values. Copying the script
// and editing it in place is how the eight copies drift apart.
//
// Config shape — every entry needs a `why`, because an exemption without a
// stated reason is indistinguishable from an oversight:
//   {
//     "hexAllowed":         [{ "pattern": "<regex>", "why": "…" }],
//     "e2eSelectorAllowed": [{ "pattern": "<regex>", "why": "…" }]
//   }

/** Roots to scan. Extra roots (tooling, e2e) matter: Tailwind scans them too. */
const ROOTS = ['src', 'tools', 'e2e'].filter((d) => existsSync(d))

const CONFIG = existsSync('tools/check-tokens.config.json')
  ? JSON.parse(readFileSync('tools/check-tokens.config.json', 'utf8'))
  : {}

/**
 * Where a literal hex is legitimate. The token file always is — that is what it
 * is for. This script always is: it has to describe the pattern it matches.
 * Everything else must be justified in the config file, with a reason.
 */
const HEX_ALLOWED = [
  /(^|\/)(styles|tokens|global|epinomy-theme)\.css$/,
  /(^|\/)check-tokens\.mjs$/,
  ...(CONFIG.hexAllowed ?? []).map((e) => new RegExp(e.pattern)),
]

/**
 * E2E files whose coupling to utility classes is known debt, justified in the
 * config. Suppresses both the selector rule and the palette-utility rule for
 * those files — they are the same finding seen from two angles, and exempting
 * one while reporting the other is just noise.
 */
const E2E_SELECTOR_ALLOWED = (CONFIG.e2eSelectorAllowed ?? []).map((e) => new RegExp(e.pattern))

const EXTS = new Set(['.astro', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.css', '.md', '.mdx'])
const SKIP_DIRS = new Set(['node_modules', 'dist', '.astro', 'results', 'test-results', 'coverage'])

const PREFIX =
  'bg|text|border|ring|divide|outline|placeholder|from|via|to|accent|caret|decoration|shadow|fill|stroke'
const PALETTE =
  'slate|gray|grey|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'

// A stock-palette utility with a numeric shade, any variant prefix, optional
// /opacity. Brand tokens named after a colour are excluded by requiring the
// numeric shade.
// NOTE: never write such a class literally in this file — Tailwind scans the
// repo and would emit dead CSS for the example.
const RAW_UTILITY = new RegExp(`\\b(?:${PREFIX})-(?:${PALETTE})-\\d{2,3}\\b`, 'g')

const HEX = '#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})'
const RAW_HEX = new RegExp(
  `\\[${HEX}\\]|["'\`]${HEX}["'\`]|(?::|\\bsolid\\b|\\bdashed\\b|\\bdotted\\b)\\s*["'\`]?\\s*${HEX}\\b`,
  'g',
)

/** `var(--token, fallback)` — the fallback masks a name that may not exist. */
const VAR_WITH_FALLBACK = /var\(\s*(--[a-z0-9-]+)\s*,[^)]*\)/g
const VAR_REF = /var\(\s*(--color-[a-z0-9-]+)/g
const VAR_DEF = /^\s*(--[a-z0-9-]+)\s*:/gm

/** A Playwright/Testing-Library locator that selects on a Tailwind utility. */
const LOCATOR = /(?:locator|querySelector(?:All)?|\$\$?)\(\s*['"`]([^'"`]+)['"`]/g
const UTILITY_IN_SELECTOR = new RegExp(
  `\\.(?:(?:${PREFIX})-(?:${PALETTE})-\\d{2,3}|` +
    `(?:flex|grid|rounded|items|justify|gap|truncate|absolute|relative|hidden|block|inline)` +
    `(?:-[a-z0-9]+)*|` +
    `(?:p|m|w|h|px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr)-[0-9.]+|` +
    `(?:bg|text|border)-(?:surface|ink|line|action|ok|warn|crit|info)(?:-[a-z0-9-]+)?)` +
    `(?![\\w-])`,
)

// --- helpers ---------------------------------------------------------------

const problems = []
const record = (file, line, rule, detail, hint) =>
  problems.push({ file, line, rule, detail, hint })

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (EXTS.has(extname(p))) out.push(p)
  }
  return out
}

/**
 * A page with its own `<!doctype html>` and no import of the site stylesheet
 * cannot reference the tokens, because it never loads them. Detected
 * structurally so the exemption cannot go stale; the site layout also declares
 * a doctype but imports the stylesheet, which keeps it in scope.
 */
const isStandaloneDocument = (t) =>
  /<!doctype html>/i.test(t) && !/global\.css|styles\/global|styles\.css|<slot/i.test(t)

/** theme-color must be a literal: browser chrome reads it before any CSS. */
const META_THEME_COLOR = /<meta[^>]*name=["']theme-color["'][^>]*>/i

// --- collect ---------------------------------------------------------------

const files = ROOTS.flatMap((r) => walk(r))
const definedVars = new Set()
const referencedVars = []

for (const file of files) {
  if (extname(file) !== '.css') continue
  for (const m of readFileSync(file, 'utf8').matchAll(VAR_DEF)) {
    definedVars.add(m[1])
    // Tailwind exposes an @theme `--color-x` under that same name.
    definedVars.add(m[1].replace('--', '--color-', 1))
  }
}

for (const file of files) {
  // This file has to spell out the patterns it matches, so it would flag its
  // own documentation. Exempt wholesale: the one thing in tooling that is
  // genuinely dangerous is a literal class name, because Tailwind compiles it
  // into dead CSS — and there are none here, by construction.
  if (/(^|\/)check-tokens\.mjs$/.test(file)) continue

  const text = readFileSync(file, 'utf8')
  if (isStandaloneDocument(text)) continue
  const hexAllowed = HEX_ALLOWED.some((re) => re.test(file))
  const isProse = ['.md', '.mdx'].includes(extname(file))
  const isE2E = file.startsWith('e2e')
  const e2eDebt = isE2E && E2E_SELECTOR_ALLOWED.some((re) => re.test(file))

  text.split('\n').forEach((line, i) => {
    const n = i + 1
    if (META_THEME_COLOR.test(line)) return

    // 1 — raw palette utility (applies everywhere, token file included)
    if (!e2eDebt)
      for (const m of line.matchAll(RAW_UTILITY))
        record(file, n, 'raw-utility', m[0], 'use a token utility')

    // 2 — raw hex. Not applied to prose: documentation that quotes a palette
    // is documenting it, and Tailwind emits CSS from class names, not hexes.
    if (!hexAllowed && !isProse)
      for (const m of line.matchAll(RAW_HEX))
        record(file, n, 'raw-hex', m[0].trim(), 'use var(--color-…) or a token utility')

    // 4 — var() with a fallback
    for (const m of line.matchAll(VAR_WITH_FALLBACK))
      record(
        file,
        n,
        'var-fallback',
        m[0].slice(0, 48),
        'drop the fallback once the token name is verified — it hides a dead name',
      )

    // 3 — collect refs for the dangling check
    for (const m of line.matchAll(VAR_REF)) referencedVars.push({ file, line: n, name: m[1] })

    // 5 — E2E selector coupled to a utility class
    if (isE2E && !e2eDebt)
      for (const m of line.matchAll(LOCATOR))
        if (UTILITY_IN_SELECTOR.test(m[1]))
          record(file, n, 'e2e-utility-selector', m[1].slice(0, 60), 'select on data-testid')
  })
}

// 3 — dangling var(--color-*)
for (const { file, line, name } of referencedVars)
  if (!definedVars.has(name) && name !== '--color-mod-')
    record(file, line, 'dangling-var', name, 'renders as nothing and never errors')

// 6 — biome lints CSS here but cannot parse Tailwind syntax
for (const cfg of ['biome.json', 'biome.jsonc']) {
  if (!existsSync(cfg)) continue
  const raw = readFileSync(cfg, 'utf8')
  const lintsCss = !/"includes"\s*:\s*\[[^\]]*\]/.test(raw) || /\.css|\{ts,tsx,js,jsx,css|\*\*\/\*"/.test(raw)
  const hasCss = files.some((f) => extname(f) === '.css')
  if (hasCss && lintsCss && !/tailwindDirectives/.test(raw))
    record(
      cfg,
      1,
      'biome-css-parser',
      'tailwindDirectives not enabled',
      'biome cannot parse @theme and aborts the whole CSS check',
    )
}

// --- report ----------------------------------------------------------------

if (problems.length === 0) {
  console.log(`Design-system adherence: clean (${files.length} files).`)
  process.exit(0)
}

const byRule = new Map()
for (const p of problems) byRule.set(p.rule, [...(byRule.get(p.rule) ?? []), p])

for (const [rule, list] of byRule) {
  console.error(`\n${rule} — ${list.length}`)
  console.error(`  ${list[0].hint}`)
  for (const p of list.slice(0, 40)) console.error(`    ${p.file}:${p.line}  ${p.detail}`)
  if (list.length > 40) console.error(`    … and ${list.length - 40} more`)
}
console.error(`\n${problems.length} adherence violation(s) across ${byRule.size} rule(s).`)
process.exit(1)
