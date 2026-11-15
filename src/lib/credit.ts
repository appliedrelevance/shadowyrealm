/**
 * Score composition: each entity's own profile plus the credited share of
 * everything downstream of it.
 *
 * walkShares computes the shares from the credit-bearing links, every route
 * added up, for every site; composeScores combines them with the calculator's
 * own areas. A descendant contributes its OWN profile, never its credited one,
 * so no chain is counted twice.
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

/**
 * The fixed columns plus {key}_benefit and {key}_harm for each of the site's dimensions, and in people
 * mode {key}_benefit_people and {key}_harm_people.
 */
export type AssessmentRow = {
  entity_id: number;
  period_id: number | null;
} & Record<`${string}_${"benefit" | "harm"}`, number | string> &
  Partial<Record<`${string}_${"benefit" | "harm"}_people`, number | string | null>>;

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

/**
 * Credit shares, for every site: an ancestor's share of a descendant is the chance that a walk
 * upstream from the descendant, taking each cause with its link's strength, reaches the ancestor. Every route counts, a cycle included, and the walk stops at
 * the ancestor, so a share is never above 1. Shares under 0.001 are dropped.
 *
 * Computed per ancestor by iterating h(d) = Σ over d's causes p of strength × (p is the ancestor ? 1
 * : h(p)) until nothing moves by 1e-9, at most 60 times: the rule the 2026-11-15 pilot froze. The
 * result depends only on the links, so the last one is kept for the next request with the same links.
 */
export function walkShares(links: LinkRow[], creditTypes: ReadonlySet<string>): ShareRow[] {
  const carrying = links.filter((l) => creditTypes.has(l.relationship_type) && num(l.strength) > 0);
  const key = carrying.map((l) => `${l.source_entity_id}>${l.target_entity_id}:${num(l.strength)}`).sort().join(",");
  if (lastWalk?.key === key) return lastWalk.shares;

  const ids = [...new Set(carrying.flatMap((l) => [l.source_entity_id, l.target_entity_id]))];
  const index = new Map(ids.map((id, i) => [id, i]));
  const n = ids.length;
  // The strongest link between a pair, if the same pair is linked twice.
  const strongest = new Map<string, number>();
  for (const l of carrying) {
    const k = `${index.get(l.source_entity_id)}>${index.get(l.target_entity_id)}`;
    strongest.set(k, Math.max(strongest.get(k) ?? 0, num(l.strength)));
  }
  const outTo: number[][] = Array.from({ length: n }, () => []);
  const outWeight: number[][] = Array.from({ length: n }, () => []);
  for (const [k, w] of strongest) {
    const [a, b] = k.split(">").map(Number);
    outTo[a].push(b);
    outWeight[a].push(w);
  }

  const shares: ShareRow[] = [];
  let h = new Float64Array(n);
  let next = new Float64Array(n);
  for (let a = 0; a < n; a++) {
    if (outTo[a].length === 0) continue;
    h.fill(0);
    for (let iteration = 0; iteration < 60; iteration++) {
      next.fill(0);
      for (let k = 0; k < outTo[a].length; k++) next[outTo[a][k]] += outWeight[a][k];
      for (let p = 0; p < n; p++) {
        const v = h[p];
        if (v === 0 || p === a) continue;
        const to = outTo[p];
        const weight = outWeight[p];
        for (let k = 0; k < to.length; k++) next[to[k]] += v * weight[k];
      }
      next[a] = 0;
      let change = 0;
      for (let d = 0; d < n; d++) change = Math.max(change, Math.abs(next[d] - h[d]));
      [h, next] = [next, h];
      if (change < 1e-9) break;
    }
    for (let d = 0; d < n; d++) {
      if (h[d] >= 0.001) shares.push({ ancestor_id: ids[a], descendant_id: ids[d], share: h[d] });
    }
  }
  lastWalk = { key, shares };
  return shares;
}

let lastWalk: { key: string; shares: ShareRow[] } | null = null;

/** PostgREST returns numeric columns as strings. */
function num(value: number | string): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) throw new Error(`Expected a number, got ${JSON.stringify(value)}`);
  return n;
}

/**
 * One row as calculator input. In people mode the head-counts come too; a row missing any of them
 * (an assessment made before the site counted people) has none, and the calculator leaves it unplaced.
 */
export function toAssessmentInput(scoring: ScoringConfig, row: AssessmentRow): AssessmentInput {
  const keys = dimensionKeysOf(scoring);
  const empty = emptyProfile(keys);
  const input: AssessmentInput = { period_id: row.period_id, benefit: empty.benefit, harm: empty.harm };
  for (const d of keys) {
    input.benefit[d] = num(row[`${d}_benefit`]);
    input.harm[d] = num(row[`${d}_harm`]);
  }
  if (scoring.breadth === "people") {
    const counts = keys.flatMap((d) => [row[`${d}_benefit_people`], row[`${d}_harm_people`]]);
    if (counts.every((c) => c != null)) {
      const people = emptyProfile(keys);
      for (const d of keys) {
        people.benefit[d] = num(row[`${d}_benefit_people`]!);
        people.harm[d] = num(row[`${d}_harm_people`]!);
      }
      input.people = people;
    } else {
      input.people = null;
    }
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
    assessmentsBy.set(a.entity_id, [...(assessmentsBy.get(a.entity_id) ?? []), toAssessmentInput(config.scoring, a)]);
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
