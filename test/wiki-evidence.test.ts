import { describe, expect, test } from "bun:test";
import { CLEF_CONTEXT_TOKENS, EVIDENCE_MAX_CHARS, sections, wholeArticleEvidence } from "../tools/wiki-evidence";

const article = [
  "The lead paragraph.",
  "",
  "== History ==",
  "What happened first.",
  "=== Early years ===",
  "And then.",
  "== References ==",
  "A citation.",
  "== See also ==",
  "Another article.",
].join("\n");

describe("a period's evidence", () => {
  test("is the description, then the whole article in order, without the reference sections", () => {
    expect(wholeArticleEvidence("A period.", article)).toBe(
      "A period.\n\nThe lead paragraph.\n\nHistory\nWhat happened first.\n\nEarly years\nAnd then.\n",
    );
    expect(sections(article).map((s) => s.heading)).toEqual(["", "History", "Early years"]);
  });

  test("is cut at a section boundary only where it would not fit", () => {
    const whole = wholeArticleEvidence("A period.", article);
    expect(wholeArticleEvidence("A period.", article, whole.length)).toBe(whole);
    expect(wholeArticleEvidence("A period.", article, whole.length - 1)).toBe(
      "A period.\n\nThe lead paragraph.\n\nHistory\nWhat happened first.\n",
    );
  });

  test("refuses an article whose first section alone is over the limit", () => {
    expect(() => wholeArticleEvidence("A period.", article, 15)).toThrow(/first section/);
  });

  test("fits Clef's context at the fewest characters a token has held", () => {
    expect(EVIDENCE_MAX_CHARS / 2.89 + 10_245).toBeLessThanOrEqual(CLEF_CONTEXT_TOKENS);
    expect(EVIDENCE_MAX_CHARS).toBeGreaterThan(150_000);
  });
});
