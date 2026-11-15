/**
 * ATIS (Advanced Temporal Impact Scoring) Calculator
 *
 * Pure functions with zero dependencies. The Worker runs them; the browser only
 * displays what the Worker returns, so an entity cannot score differently on
 * two screens.
 *
 * An entity's impact is a profile of ten numbers: a benefit and a harm for each
 * of the five dimensions. Nothing here nets one against the other.
 *
 * Every assessment belongs to one period, a window of years. Within a period,
 * each profile number has a level. How it is made depends on how the site
 * measures breadth (ScoringConfig.breadth):
 *
 *   reach:  level = dimension weight × assessed 0–10 value × reach multiplier(period's reach)
 *   people: level = dimension weight × 0–10 depth × reach multiplier(reach of the head-count)
 *
 * averaged over the period's assessments. In people mode, each benefit and harm has
 * its own reach, read from Clairic's head-count as a share of the world's population
 * in a typical year of the period (world-population.ts) on the reach rubric's 0–10
 * scale: 10 is everyone alive, and each level below it a tenth as many (reachOfShare).
 * So a dynasty that reached a third of a small world counts like a technology that
 * reaches a third of today's, and breadth spreads entities apart as the reach rubric
 * did, not by every order of magnitude between a village and the world. In people
 * mode an assessment with no head-counts cannot be placed on the curve, like one with
 * no period. Laid end to end, the periods are the
 * influence curve, and each number's score is the area under its curve up to
 * the as-of year, in influence-centuries (level × years / 100). Periods that
 * overlap add; years between periods add nothing.
 *
 * When the last period ends before the as-of year, its levels fade
 * exponentially from there, at a rate set by that period's persistence factor,
 * but never slower than what the years since have shown: a legacy that ended N
 * years ago is held to the first persistence level whose time covers N years.
 * Lasting for centuries cannot be credited before the centuries have passed.
 * The part of a legacy that consequences carry comes back as credit instead, so
 * the tail is scaled by 1 − the credit shares the entity passes on: a founder
 * who passes 80% to a church keeps a fifth of the tail, and an entity that
 * passes on 100% or more keeps none.
 *
 * Magnitude, the sum of the ten areas, only ranks entities and sets tiers.
 *
 * Dimensions, weights, the unit, the persistence time constants and the tiers
 * all come from the site's ScoringConfig (src/sites), passed in as an argument.
 */
import type { ScoringConfig, TierDef } from "../sites/types";
import { meanWorldPopulation } from "./world-population";

// ---------- Types ----------

/** One value per dimension key of the site, in the config's order. */
export type Dimensions = Record<string, number>;

/** Benefit and harm for each dimension. */
export interface Profile {
  benefit: Dimensions;
  harm: Dimensions;
}

export interface AssessmentInput {
  /** The period this assessment describes. An assessment without one cannot be placed on the curve. */
  period_id: number | null;
  /** Each value 0–10: intensity in reach mode, depth in people mode. */
  benefit: Dimensions;
  harm: Dimensions;
  /**
   * People mode: the living people affected in a typical year of the period, per dimension's benefit
   * and harm. The calculator reads each as a reach, from its share of the world's population then.
   */
  people?: Profile | null;
}

export interface PeriodInput {
  id: number;
  label: string;
  start_year: number;
  end_year: number;
  reach_factor: number;
  persistence_factor: number;
}

export type ATISTier = "minimal" | "moderate" | "significant" | "transformational" | "legendary";

export interface PeriodBreakdown {
  period_id: number;
  period: string;
  start_year: number;
  end_year: number;
  /** Years of this window that fall on or before the as-of year. */
  years: number;
  assessments: number;
  /** 1 in people mode, where each benefit and harm has its own reach (see reach). */
  reach_multiplier: number;
  /** People mode: the world's population in a typical year of the period, which the head-counts are shares of. */
  world_population: number | null;
  /** People mode: each benefit's and harm's reach, averaged over the period's assessments. */
  reach: Profile | null;
  /** Impact per year while the period lasts. */
  level: Profile;
  /** level × years / 100, in influence-centuries. */
  area: Profile;
}

export interface LegacyTail {
  from_year: number;
  years: number;
  /** The share of the tail kept after what consequences carry: 1 − credit passed on. */
  kept: number;
  /** In influence-centuries. */
  area: Profile;
}

/** One stretch of the curve at a constant level, years [start_year, end_year] inclusive. */
export interface CurveSegment {
  start_year: number;
  end_year: number;
  benefit: number;
  harm: number;
}

/** A fading part of the tail; time_constant is null when it never fades. */
export interface TailPart {
  benefit: number;
  harm: number;
  time_constant: number | null;
}

/** The influence curve summed over the five dimensions, enough to sample or integrate it anywhere. */
export interface InfluenceCurve {
  segments: CurveSegment[];
  tail: { from_year: number; parts: TailPart[] } | null;
  /** The curve stops at the end of this year. */
  as_of_year: number;
}

export interface ImpactResult {
  /** Area under each number's curve, in influence-centuries. */
  profile: Profile;
  /** Sum of the ten areas. */
  magnitude: number;
  benefit_total: number;
  harm_total: number;
  breakdown: PeriodBreakdown[];
  tail: LegacyTail | null;
  curve: InfluenceCurve;
  as_of_year: number;
  /**
   * Assessments with no period, a period that is not in the list, or (in people mode) no head-counts.
   * They contribute nothing.
   */
  unplaced_assessments: number;
  algorithm_version: string;
}

export interface ImpactOptions {
  /** Sum of the strengths of the entity's outgoing credit-bearing links; the tail keeps 1 − this, never below 0. */
  creditPassedOn: number;
  asOfYear?: number;
}

// ---------- Constants ----------

export const ALGORITHM_VERSION = "5.1.0-reach-of-humanity";

// ---------- Profile arithmetic ----------

export function dimensionKeysOf(scoring: Pick<ScoringConfig, "dimensions">): string[] {
  return scoring.dimensions.map((d) => d.key);
}

export function emptyDimensions(keys: readonly string[]): Dimensions {
  return Object.fromEntries(keys.map((k) => [k, 0]));
}

export function emptyProfile(keys: readonly string[]): Profile {
  return { benefit: emptyDimensions(keys), harm: emptyDimensions(keys) };
}

/** A value of b for key k; a profile missing one of the site's dimensions is an error, never a zero. */
function at(d: Dimensions, k: string): number {
  const v = d[k];
  if (typeof v !== "number") throw new Error(`Profile has no value for dimension "${k}"`);
  return v;
}

/** a + factor × b, number by number, over a's dimensions. */
export function addScaled(a: Profile, b: Profile, factor = 1): Profile {
  const keys = Object.keys(a.benefit);
  const out = emptyProfile(keys);
  for (const d of keys) {
    out.benefit[d] = a.benefit[d] + factor * at(b.benefit, d);
    out.harm[d] = a.harm[d] + factor * at(b.harm, d);
  }
  return out;
}

export function scaleProfile(p: Profile, factor: number): Profile {
  return addScaled(emptyProfile(Object.keys(p.benefit)), p, factor);
}

export function sumDimensions(d: Dimensions): number {
  return Object.keys(d).reduce((sum, k) => sum + d[k], 0);
}

export function profileMagnitude(p: Profile): number {
  return sumDimensions(p.benefit) + sumDimensions(p.harm);
}

// ---------- Core Algorithm ----------

/** Power scaling for reach, so that global figures stand well apart from local ones. */
export function reachMultiplier(reachFactor: number): number {
  return Math.pow(reachFactor / 5.0, 1.8) * 3.0;
}

/**
 * Years for a fading legacy to fall to 1/e of its level: the persistence level's time, capped by
 * the first level whose time covers the years since the period ended, when those are given. A
 * period that ended 17 years ago fades within a generation (25 years) at the slowest.
 */
export function persistenceTimeConstant(
  persistenceFactor: number,
  constants: readonly number[],
  yearsSinceEnd?: number,
): number {
  const index = Math.min(Math.max(Math.round(persistenceFactor), 1), constants.length) - 1;
  const claimed = constants[index];
  if (yearsSinceEnd === undefined) return claimed;
  const observed = constants.find((years) => years >= yearsSinceEnd) ?? Infinity;
  return Math.min(claimed, observed);
}

/** Area (level × years, not yet divided into centuries) under an exponentially fading level. */
export function calculateTailArea(level: number, timeConstant: number, years: number): number {
  if (years <= 0) return 0;
  if (!Number.isFinite(timeConstant)) return level * years;
  return level * timeConstant * (1 - Math.exp(-years / timeConstant));
}

/** Years of a period that fall on or before the as-of year. Years are plain integers; BCE is negative. */
function activeYears(period: PeriodInput, asOfYear: number): number {
  return Math.max(0, Math.min(period.end_year, asOfYear) - period.start_year + 1);
}

/**
 * A head-count's reach on the reach rubric's 0–10 scale, one level per factor of ten: 10 is everyone
 * alive, 9 a tenth of them, 5 one in a hundred thousand, and 0 one in ten billion or fewer. No year has
 * more people affected than alive, so a count above the population reaches 10.
 */
export function reachOfShare(count: number, population: number): number {
  if (!(population > 0)) throw new Error(`A share needs a population above zero, not ${population}`);
  if (count <= 0) return 0;
  return Math.max(0, 10 + Math.log10(Math.min(1, count / population)));
}

/**
 * One period's level and, in people mode, its reach, both averaged over its assessments: weighted
 * values × the period's reach multiplier, or in people mode weighted depth × the multiplier of each
 * benefit's and harm's own reach.
 */
function periodLevel(
  scoring: ScoringConfig,
  group: AssessmentInput[],
  multiplier: number,
  population: number | null,
): { level: Profile; reach: Profile | null } {
  const keys = dimensionKeysOf(scoring);
  const people = scoring.breadth === "people";
  let level = emptyProfile(keys);
  let reach = emptyProfile(keys);
  for (const a of group) {
    const value = { benefit: { ...a.benefit }, harm: { ...a.harm } };
    if (people) {
      const own = emptyProfile(keys);
      for (const d of keys) {
        own.benefit[d] = reachOfShare(at(a.people!.benefit, d), population!);
        own.harm[d] = reachOfShare(at(a.people!.harm, d), population!);
        value.benefit[d] = at(a.benefit, d) * reachMultiplier(own.benefit[d]);
        value.harm[d] = at(a.harm, d) * reachMultiplier(own.harm[d]);
      }
      reach = addScaled(reach, own, 1 / group.length);
    }
    level = addScaled(level, value, 1 / group.length);
  }
  const out = emptyProfile(keys);
  for (const { key: d, weight } of scoring.dimensions) {
    out.benefit[d] = weight * level.benefit[d] * multiplier;
    out.harm[d] = weight * level.harm[d] * multiplier;
  }
  return { level: out, reach: people ? reach : null };
}

export function calculateImpact(
  scoring: ScoringConfig,
  assessments: AssessmentInput[],
  periods: PeriodInput[],
  options: ImpactOptions,
): ImpactResult {
  const asOfYear = options.asOfYear ?? new Date().getFullYear();
  const keys = dimensionKeysOf(scoring);
  const yearsPerUnit = scoring.unit.years;
  const periodById = new Map(periods.map((p) => [p.id, p]));
  const assessmentsByPeriod = new Map<number, AssessmentInput[]>();
  let unplaced = 0;
  for (const assessment of assessments) {
    const period = assessment.period_id == null ? undefined : periodById.get(assessment.period_id);
    if (!period || (scoring.breadth === "people" && !assessment.people)) {
      unplaced += 1;
      continue;
    }
    const list = assessmentsByPeriod.get(period.id) ?? [];
    list.push(assessment);
    assessmentsByPeriod.set(period.id, list);
  }

  // The curve only runs up to the as-of year; a period that has not started yet does nothing.
  const placed = periods
    .filter((p) => assessmentsByPeriod.has(p.id) && p.start_year <= asOfYear)
    .sort((a, b) => a.start_year - b.start_year || a.end_year - b.end_year);

  const breakdown: PeriodBreakdown[] = [];
  const segments: CurveSegment[] = [];
  let profile = emptyProfile(keys);

  for (const period of placed) {
    const group = assessmentsByPeriod.get(period.id)!;
    const people = scoring.breadth === "people";
    const multiplier = people ? 1 : reachMultiplier(period.reach_factor);
    const population = people ? meanWorldPopulation(period.start_year, period.end_year) : null;
    const { level, reach } = periodLevel(scoring, group, multiplier, population);
    const years = activeYears(period, asOfYear);
    const area = scaleProfile(level, years / yearsPerUnit);
    profile = addScaled(profile, area);

    breakdown.push({
      period_id: period.id,
      period: period.label,
      start_year: period.start_year,
      end_year: period.end_year,
      years,
      assessments: group.length,
      reach_multiplier: multiplier,
      world_population: population,
      reach,
      level,
      area,
    });
    segments.push({
      start_year: period.start_year,
      end_year: Math.min(period.end_year, asOfYear),
      benefit: sumDimensions(level.benefit),
      harm: sumDimensions(level.harm),
    });
  }

  // Legacy tail: only the periods that end last carry on, fading from their level.
  let tail: LegacyTail | null = null;
  let curveTail: InfluenceCurve["tail"] = null;
  const kept = Math.max(0, 1 - options.creditPassedOn);
  if (breakdown.length > 0 && kept > 0) {
    const latestEnd = Math.max(...placed.map((p) => p.end_year));
    if (latestEnd < asOfYear) {
      const yearsAfter = asOfYear - latestEnd;
      let tailArea = emptyProfile(keys);
      const parts: TailPart[] = [];
      for (const row of breakdown.filter((b) => b.end_year === latestEnd)) {
        const period = periodById.get(row.period_id)!;
        const timeConstant = persistenceTimeConstant(
          period.persistence_factor,
          scoring.rubrics.persistenceTimeConstants,
          yearsAfter,
        );
        const faded = emptyProfile(keys);
        for (const d of keys) {
          faded.benefit[d] = calculateTailArea(row.level.benefit[d], timeConstant, yearsAfter);
          faded.harm[d] = calculateTailArea(row.level.harm[d], timeConstant, yearsAfter);
        }
        tailArea = addScaled(tailArea, faded, kept / yearsPerUnit);
        parts.push({
          benefit: kept * sumDimensions(row.level.benefit),
          harm: kept * sumDimensions(row.level.harm),
          time_constant: Number.isFinite(timeConstant) ? timeConstant : null,
        });
      }
      tail = { from_year: latestEnd + 1, years: yearsAfter, kept, area: tailArea };
      curveTail = { from_year: latestEnd + 1, parts };
      profile = addScaled(profile, tailArea);
    }
  }

  return {
    profile,
    magnitude: profileMagnitude(profile),
    benefit_total: sumDimensions(profile.benefit),
    harm_total: sumDimensions(profile.harm),
    breakdown,
    tail,
    curve: { segments, tail: curveTail, as_of_year: asOfYear },
    as_of_year: asOfYear,
    unplaced_assessments: unplaced,
    algorithm_version: ALGORITHM_VERSION,
  };
}

// ---------- The curve ----------

/**
 * Area (level × years) under the curve between two instants. Year y occupies
 * the interval [y, y + 1), so a period from 1096 to 1099 covers [1096, 1100).
 */
export function curveAreaBetween(curve: InfluenceCurve, from: number, to: number): { benefit: number; harm: number } {
  let benefit = 0;
  let harm = 0;
  const end = Math.min(to, curve.as_of_year + 1);
  if (end <= from) return { benefit, harm };

  for (const s of curve.segments) {
    const overlap = Math.min(end, s.end_year + 1) - Math.max(from, s.start_year);
    if (overlap > 0) {
      benefit += s.benefit * overlap;
      harm += s.harm * overlap;
    }
  }

  if (curve.tail) {
    const t0 = curve.tail.from_year;
    const a = Math.max(from, t0) - t0;
    const b = end - t0;
    if (b > a) {
      for (const part of curve.tail.parts) {
        const tau = part.time_constant;
        const factor = tau === null ? b - a : tau * (Math.exp(-a / tau) - Math.exp(-b / tau));
        benefit += part.benefit * factor;
        harm += part.harm * factor;
      }
    }
  }
  return { benefit, harm };
}

/**
 * The curve's mean level in each bucket between consecutive edges. Averaging
 * keeps area, so an event shorter than its bucket still shows, in proportion.
 */
export function sampleCurve(curve: InfluenceCurve, edges: number[]): { benefit: number[]; harm: number[] } {
  const benefit: number[] = [];
  const harm: number[] = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const width = edges[i + 1] - edges[i];
    const area = curveAreaBetween(curve, edges[i], edges[i + 1]);
    benefit.push(width > 0 ? area.benefit / width : 0);
    harm.push(width > 0 ? area.harm / width : 0);
  }
  return { benefit, harm };
}

// ---------- Classification ----------

/** The tier a magnitude falls in, or null while the site's tiers are not calibrated. */
export function classifyMagnitude(
  tiers: readonly TierDef[] | null,
  magnitude: number,
): { tier: ATISTier; descriptor: string } | null {
  if (!tiers) return null;
  let found = tiers[0];
  for (const t of tiers) if (magnitude >= t.min) found = t;
  return { tier: found.tier, descriptor: found.descriptor };
}

export function tierLabel(tiers: readonly TierDef[], tier: ATISTier): string {
  const found = tiers.find((t) => t.tier === tier);
  if (!found) throw new Error(`No tier "${tier}"`);
  return found.label;
}
