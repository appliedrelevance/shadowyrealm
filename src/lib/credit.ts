/**
 * Score composition: each entity's own profile plus the credited share of
 * everything downstream of it.
 *
 * Postgres computes the shares (shadowyrealm.credit_shares, a recursive CTE
 * over the credit-bearing links); this module only combines them with the
 * calculator's own areas. A descendant contributes its OWN profile, never its
 * credited one, so no chain is counted twice.
 */
import {
  addScaled,
  calculateImpact,
  classifyMagnitude,
  DIMENSIONS,
  emptyProfile,
  profileMagnitude,
  sumDimensions,
  type AssessmentInput,
  type ATISTier,
  type ImpactResult,
  type PeriodInput,
  type Profile,
} from "./atis-calculator";

/** Link types whose strength is a share of credit. collaboration and opposition only describe. */
export const CREDIT_TYPES = ["influence", "mentorship"] as const;

export function isCreditType(type: string): boolean {
  return (CREDIT_TYPES as readonly string[]).includes(type);
}

export interface PeriodRow extends PeriodInput {
  entity_id: number;
}

export interface AssessmentRow {
  entity_id: number;
  period_id: number | null;
  scientific_benefit: number | string;
  scientific_harm: number | string;
  economic_benefit: number | string;
  economic_harm: number | string;
  human_rights_benefit: number | string;
  human_rights_harm: number | string;
  health_benefit: number | string;
  health_harm: number | string;
  cultural_benefit: number | string;
  cultural_harm: number | string;
}

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
  tier: ATISTier;
  descriptor: string;
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

export function toAssessmentInput(row: AssessmentRow): AssessmentInput {
  const input: AssessmentInput = { period_id: row.period_id, benefit: emptyProfile().benefit, harm: emptyProfile().harm };
  for (const d of DIMENSIONS) {
    input.benefit[d] = num(row[`${d}_benefit`]);
    input.harm[d] = num(row[`${d}_harm`]);
  }
  return input;
}

export function composeScores(
  entityIds: number[],
  periods: PeriodRow[],
  assessments: AssessmentRow[],
  links: LinkRow[],
  shares: ShareRow[],
  asOfYear: number,
): Map<number, EntityScore> {
  const ids = new Set(entityIds);
  const periodsBy = new Map<number, PeriodRow[]>();
  for (const p of periods) periodsBy.set(p.entity_id, [...(periodsBy.get(p.entity_id) ?? []), p]);
  const assessmentsBy = new Map<number, AssessmentInput[]>();
  for (const a of assessments) {
    assessmentsBy.set(a.entity_id, [...(assessmentsBy.get(a.entity_id) ?? []), toAssessmentInput(a)]);
  }
  const passedOn = new Map<number, number>();
  for (const l of links) {
    if (!isCreditType(l.relationship_type) || !ids.has(l.target_entity_id)) continue;
    passedOn.set(l.source_entity_id, (passedOn.get(l.source_entity_id) ?? 0) + num(l.strength));
  }

  const own = new Map<number, ImpactResult>();
  for (const id of entityIds) {
    own.set(
      id,
      calculateImpact(assessmentsBy.get(id) ?? [], periodsBy.get(id) ?? [], {
        creditPassedOn: passedOn.get(id) ?? 0,
        asOfYear,
      }),
    );
  }

  const credited = new Map<number, Profile>(entityIds.map((id) => [id, emptyProfile()]));
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
    const { tier, descriptor } = classifyMagnitude(totalMagnitude);
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
      tier,
      descriptor,
      contributors: contributors.get(id)!.sort((a, b) => b.magnitude - a.magnitude),
      credits: credits.get(id)!.sort((a, b) => b.share - a.share),
    });
  }
  return scores;
}
