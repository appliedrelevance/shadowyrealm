/**
 * Score composition: each entity's own profile plus the credited share of
 * everything downstream of it.
 *
 * Postgres computes the shares (shadowyrealm.credit_shares, a recursive CTE
 * over the credit-bearing links); this module only combines them with the
 * calculator's own areas. A descendant contributes its OWN profile, never its
 * credited one, so no chain is counted twice.
 */
import type { ScoringConfig } from "../sites/types";
import {
  addScaled,
  calculateImpact,
  classifyMagnitude,
  dimensionKeysOf,
  emptyProfile,
  profileMagnitude,
  sumDimensions,
  type AssessmentInput,
  type ATISTier,
  type ImpactResult,
  type PeriodInput,
  type Profile,
} from "./atis-calculator";

/** What composition needs from a site: its scoring config and which link types carry credit. */
export interface CreditConfig {
  scoring: ScoringConfig;
  creditTypes: ReadonlySet<string>;
}

export interface PeriodRow extends PeriodInput {
  entity_id: number;
}

/** The fixed columns plus {key}_benefit and {key}_harm for each of the site's dimensions. */
export type AssessmentRow = {
  entity_id: number;
  period_id: number | null;
} & Record<`${string}_${"benefit" | "harm"}`, number | string>;

export interface LinkRow {
  source_entity_id: number;
  target_entity_id: number;
  relationship_type: string;
  strength: number | string;
}

export interface ShareRow {
  ancestor_id: number;
  descendant_id: number;
  share: number | string;
}

export interface Contribution {
  entity_id: number;
  share: number;
  /** share × the descendant's own magnitude. */
  magnitude: number;
}

export interface EntityScore {
  entity_id: number;
  own: ImpactResult;
  credited: Profile;
  total: Profile;
  own_magnitude: number;
  credited_magnitude: number;
  total_magnitude: number;
  benefit_total: number;
  harm_total: number;
  /** null while the site's tiers are not calibrated. */
  tier: ATISTier | null;
  descriptor: string | null;
  /** Every descendant that passes credit up, largest contribution first. */
  contributors: Contribution[];
  /** Every ancestor this entity passes credit to, largest share first. */
  credits: { entity_id: number; share: number }[];
}

/** PostgREST returns numeric columns as strings. */
function num(value: number | string): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) throw new Error(`Expected a number, got ${JSON.stringify(value)}`);
  return n;
}

export function toAssessmentInput(keys: readonly string[], row: AssessmentRow): AssessmentInput {
  const empty = emptyProfile(keys);
  const input: AssessmentInput = { period_id: row.period_id, benefit: empty.benefit, harm: empty.harm };
  for (const d of keys) {
    input.benefit[d] = num(row[`${d}_benefit`]);
    input.harm[d] = num(row[`${d}_harm`]);
  }
  return input;
}

export function composeScores(
  config: CreditConfig,
  entityIds: number[],
  periods: PeriodRow[],
  assessments: AssessmentRow[],
  links: LinkRow[],
  shares: ShareRow[],
  asOfYear: number,
): Map<number, EntityScore> {
  const keys = dimensionKeysOf(config.scoring);
  const ids = new Set(entityIds);
  const periodsBy = new Map<number, PeriodRow[]>();
  for (const p of periods) periodsBy.set(p.entity_id, [...(periodsBy.get(p.entity_id) ?? []), p]);
  const assessmentsBy = new Map<number, AssessmentInput[]>();
  for (const a of assessments) {
    assessmentsBy.set(a.entity_id, [...(assessmentsBy.get(a.entity_id) ?? []), toAssessmentInput(keys, a)]);
  }
  const passedOn = new Map<number, number>();
  for (const l of links) {
    if (!config.creditTypes.has(l.relationship_type) || !ids.has(l.target_entity_id)) continue;
    passedOn.set(l.source_entity_id, (passedOn.get(l.source_entity_id) ?? 0) + num(l.strength));
  }

  const own = new Map<number, ImpactResult>();
  for (const id of entityIds) {
    own.set(
      id,
      calculateImpact(config.scoring, assessmentsBy.get(id) ?? [], periodsBy.get(id) ?? [], {
        creditPassedOn: passedOn.get(id) ?? 0,
        asOfYear,
      }),
    );
  }

  const credited = new Map<number, Profile>(entityIds.map((id) => [id, emptyProfile(keys)]));
  const contributors = new Map<number, Contribution[]>(entityIds.map((id) => [id, []]));
  const credits = new Map<number, { entity_id: number; share: number }[]>(entityIds.map((id) => [id, []]));
  for (const row of shares) {
    if (!ids.has(row.ancestor_id) || !ids.has(row.descendant_id)) continue;
    const share = num(row.share);
    const descendant = own.get(row.descendant_id)!;
    credited.set(row.ancestor_id, addScaled(credited.get(row.ancestor_id)!, descendant.profile, share));
    contributors.get(row.ancestor_id)!.push({
      entity_id: row.descendant_id,
      share,
      magnitude: share * descendant.magnitude,
    });
    credits.get(row.descendant_id)!.push({ entity_id: row.ancestor_id, share });
  }

  const scores = new Map<number, EntityScore>();
  for (const id of entityIds) {
    const o = own.get(id)!;
    const c = credited.get(id)!;
    const total = addScaled(o.profile, c);
    const totalMagnitude = profileMagnitude(total);
    const tier = classifyMagnitude(config.scoring.tiers, totalMagnitude);
    scores.set(id, {
      entity_id: id,
      own: o,
      credited: c,
      total,
      own_magnitude: o.magnitude,
      credited_magnitude: profileMagnitude(c),
      total_magnitude: totalMagnitude,
      benefit_total: sumDimensions(total.benefit),
      harm_total: sumDimensions(total.harm),
      tier: tier?.tier ?? null,
      descriptor: tier?.descriptor ?? null,
      contributors: contributors.get(id)!.sort((a, b) => b.magnitude - a.magnitude),
      credits: credits.get(id)!.sort((a, b) => b.share - a.share),
    });
  }
  return scores;
}
