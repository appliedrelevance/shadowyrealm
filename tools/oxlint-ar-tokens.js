/**
 * oxlint JS plugin — AR design-system token adherence.
 *
 * Bans raw Tailwind palette utilities (`bg-slate-900`, `text-gray-500`) and raw
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

// e.g. `bg-slate-900`, `hover:text-gray-500`, `dark:border-zinc-700/50`
const RAW_UTILITY = new RegExp(`\\b(?:${PREFIX})-(?:${PALETTE})-\\d{2,3}\\b`)

// Bare `#abc` / `#aabbcc` / `#aabbccdd`, but not a hex inside a longer word.
const RAW_HEX = /#[0-9a-fA-F]{3,8}\b/

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
