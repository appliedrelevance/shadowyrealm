/**
 * oxlint JS plugin — AR design-system token adherence.
 *
 * Bans raw Tailwind palette utilities (`bg-<palette>-<shade>`) and raw
 * hex colors in source. Brands diverge in token *values*, never in token
 * *names*, so a literal palette reference is always a bug: it ignores the
 * brand's palette and silently breaks dark mode.
 *
 * Canon: appliedrelevance/.kiro/steering/design-stack.md
 *
 * oxlint does not implement eslint's `no-restricted-syntax`, so this ships as
 * an ESLint-compatible JS plugin (`jsPlugins` in .oxlintrc.json) instead.
 */

const PREFIX =
  'bg|text|border|ring|divide|outline|placeholder|from|via|to|accent|caret|decoration|shadow|fill|stroke'

const PALETTE =
  'slate|gray|grey|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'

// e.g. a bg/text/border utility naming a stock palette + numeric shade,
// with any variant prefix and an optional /opacity suffix.
// NOTE: never write such a class literally in this file — Tailwind scans the
// repo and would generate dead CSS for the example.
const RAW_UTILITY = new RegExp(`\\b(?:${PREFIX})-(?:${PALETTE})-\\d{2,3}\\b`)

// A hex colour, but only where the text is actually being used as one.
//
// Matching a bare `#[0-9a-f]{3,8}` anywhere is too eager: it fires on prose
// like "FAA Contract #123" and on issue references, and a rule that cries wolf
// gets switched off. Require one of three unambiguous shapes instead:
//
//   1. the whole literal is a colour         — "#0f172a", "#FFF"
//   2. a Tailwind arbitrary value            — "bg-[#E8F0FE]"
//   3. a CSS value position                  — "color: #fff", "1px solid #ccc"
//
// Hex lengths are restricted to the ones CSS actually accepts (3, 4, 6, 8), so
// "#12345" and "#123" in prose no longer match.
const HEX = '#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})'
const RAW_HEX = new RegExp(
  `^\\s*${HEX}\\s*$` + // whole literal
    `|\\[${HEX}\\]` + // Tailwind arbitrary value
    `|(?::|\\bsolid\\b|\\bdashed\\b|\\bdotted\\b|,)\\s*${HEX}\\b`, // CSS value
)

const GUIDANCE =
  'Use the AR token vocabulary: surface/surface-1/surface-2, ink/ink-2/ink-muted, ' +
  'line/line-strong, action/action-hi/action-ink/on-action, ok/warn/crit/info (+ -soft), ' +
  'plus the brand ornament (gold) and tier-* categorical ramp. ' +
  'See appliedrelevance/.kiro/steering/design-stack.md'

/** Report every distinct offending token found in a string. */
function check(context, node, text) {
  if (typeof text !== 'string' || text.length === 0) return

  const utility = text.match(RAW_UTILITY)
  if (utility) {
    context.report({
      node,
      message: `Raw Tailwind color utility "${utility[0]}". ${GUIDANCE}`,
    })
    return
  }

  const hex = text.match(RAW_HEX)
  if (hex) {
    context.report({
      node,
      message: `Raw hex color "${hex[0]}". ${GUIDANCE}`,
    })
  }
}

const noRawColor = {
  create(context) {
    return {
      Literal(node) {
        check(context, node, node.value)
      },
      // The dynamic half of `className={\`... ${x} ...\`}`
      TemplateElement(node) {
        check(context, node, node.value?.raw)
      },
      // JSX text is not a Literal in every parser build; cover it explicitly.
      JSXText(node) {
        check(context, node, node.value)
      },
    }
  },
}

export default {
  meta: { name: 'ar-tokens', version: '1.0.0' },
  rules: { 'no-raw-color': noRawColor },
}
