/**
 * Counting the people one period affected, with Clairic, Cloudflare's estimation model.
 *
 * For a site that measures breadth in people (ScoringConfig.breadth), each period is
 * one Clairic request beside its Clef request: the same evidence as the state, and
 * one estimate per dimension's benefit and harm of how many living people the
 * entity's own activity affected in a typical year of the period. Counts are
 * absolute, from 1 to 10 billion on a log scale. Consequences scored as entities of
 * their own are left out, as in the Clef questions.
 *
 * The wording is the one the frozen scoring was measured with (2026-11-15), so a
 * request built here is byte for byte the one in the System One cache.
 *
 * Answers are read strictly: a field without a usable median is an error naming it.
 */
import type { ScoringConfig, SiteConfig } from "../sites/types";
import { dimensionKeysOf, emptyProfile, type Profile } from "./atis-calculator";
import type { PeriodToScore } from "./clef";

export const CLAIRIC_MODEL = "@cf/cloudflare/clairic";

function span(start: number, end: number): string {
  const y = (n: number) => (n < 0 ? `${-n} BCE` : `${n}`);
  return start === end ? y(start) : `${y(start)} to ${y(end)}`;
}

export function buildClairicRequest(site: SiteConfig, p: PeriodToScore) {
  const when = `"${p.period}" (${span(p.start_year, p.end_year)})`;
  const subject = `${p.entity}'s own direct activity during ${when}`;
  const leaveOut =
    p.excluded.length > 0
      ? ` Leave out the effects of ${p.excluded.join(", ")}, which are scored as entities of their own.`
      : " No consequence of it is scored separately, so count the effects that followed from it as well.";
  const fields: Record<string, unknown> = {};
  for (const d of site.scoring.dimensions) {
    for (const side of ["benefit", "harm"] as const) {
      fields[`${d.key}_${side}`] = {
        type: "estimate",
        min: 1,
        max: 10_000_000_000,
        scale: "log",
        instructions: `In a typical year of ${when}, how many living people did ${subject} ${side} in the area of ${d.clef.area}?${leaveOut}`,
      };
    }
  }
  const state = `Subject: ${p.entity}\nPeriod under assessment: ${when}\n\nEvidence:\n${p.evidence}`;
  return { model: "clairic", state, fields };
}

export function readClairicAnswers(scoring: Pick<ScoringConfig, "dimensions">, response: unknown): Profile {
  const answers = (response as { answers?: Record<string, { median?: unknown }> } | null)?.answers;
  if (!answers || typeof answers !== "object") throw new Error("Clairic returned no answers");
  const keys = dimensionKeysOf(scoring);
  const people = emptyProfile(keys);
  for (const d of keys) {
    for (const side of ["benefit", "harm"] as const) {
      const id = `${d}_${side}`;
      const m = Number(answers[id]?.median);
      if (answers[id]?.median == null || !Number.isFinite(m) || m < 0) {
        throw new Error(`Clairic's answer to "${id}" has no usable median: ${JSON.stringify(answers[id]?.median)}`);
      }
      people[side][d] = m;
    }
  }
  return people;
}
