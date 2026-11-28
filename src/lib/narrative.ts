/**
 * An entity's narrative (its stored biography) is two parts, separated by a blank line: its line,
 * one sentence of why it was as harmful or as beneficial as it was, which a film's card shows under
 * its name and the entity's page shows above the rest; then its paragraph, the account in full.
 * Written by tools/entity-narrative.ts. A narrative with no blank line is a paragraph alone.
 */
export function narrativeParts(text: string): { line: string | null; paragraph: string } {
  const [first, ...rest] = text.trim().split(/\n\s*\n/);
  return rest.length > 0 ? { line: first.trim(), paragraph: rest.join("\n\n").trim() } : { line: null, paragraph: first };
}
