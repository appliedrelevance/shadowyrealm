/**
 * Scoring one period with Clef, Cloudflare's decision model.
 *
 * One request per period: the evidence text is the state, and the questions
 * ask for the benefit and harm of each of the site's dimensions plus the
 * period's reach and persistence. Each question has ten levels, Clef's maximum.
 * The wording comes from the site config: each dimension supplies its area,
 * who it affected and its depth sentence, each entity type its subject phrase,
 * and the rubrics their levels.
 *
 * Answers are read strictly. A question without a usable expected value is an
 * error naming that question; nothing is substituted, and there is no fallback
 * model.
 */
import { entityTypeOf } from "../sites";
import type { ScoringConfig, SiteConfig } from "../sites/types";
import { dimensionKeysOf, emptyDimensions, type Dimensions } from "./atis-calculator";

export const CLEF_MODEL = "@cf/cloudflare/clef";

/** Clef answers at most this many questions per request. */
export const CLEF_MAX_QUESTIONS = 64;

export interface ClefEnv {
  AI: { run(model: string, input: unknown, options?: { gateway?: { id: string } }): Promise<unknown> };
  AI_GATEWAY_NAME: string;
}

export interface PeriodToScore {
  entity: string;
  /** Picks the subject phrase the questions use. */
  entity_type: string;
  period: string;
  start_year: number;
  end_year: number;
  /** Consequences scored as entities of their own, which the answers must leave out. */
  excluded: string[];
  evidence: string;
}

function span(start: number, end: number): string {
  const y = (n: number) => (n < 0 ? `${-n} BCE` : `${n}`);
  return start === end ? y(start) : `${y(start)} to ${y(end)}`;
}

export function buildClefRequest(site: SiteConfig, p: PeriodToScore) {
  const { dimensions, rubrics } = site.scoring;
  const subject = entityTypeOf(site, p.entity_type).clefSubject(p.entity);
  const when = `"${p.period}" (${span(p.start_year, p.end_year)})`;
  const leaveOut =
    p.excluded.length > 0
      ? `Leave out the effects of ${p.excluded.join(", ")}, which are scored as entities of their own.`
      : "Leave out consequences that would be entities of their own.";

  const questions: Record<string, unknown> = {};
  for (const d of dimensions) {
    for (const kind of ["benefit", "harm"] as const) {
      questions[`${d.key}_${kind}`] = {
        type: "score",
        instructions:
          `Judge only from the evidence text. Rate the intensity of the ${kind.toUpperCase()} that ` +
          `${subject} during ${when} caused to ${d.clef.affected}, in the area of ` +
          `${d.clef.area}. ${d.clef.depth} ` +
          `Score only that activity in that period. ${leaveOut} ` +
          `If the evidence shows no ${kind} in this area, choose the lowest level.`,
        criteria: rubrics.intensity,
      };
    }
  }
  questions.reach = {
    type: "score",
    instructions:
      `Judge only from the evidence text. How many people did ${subject} during ${when} ` +
      `affect while it lasted? ${leaveOut}`,
    criteria: rubrics.reach,
  };
  questions.persistence = {
    type: "score",
    instructions:
      `Judge only from the evidence text. After ${when} ended, how long did the effects of ${subject} ` +
      `in it last? ${leaveOut}`,
    criteria: rubrics.persistence,
  };

  const count = Object.keys(questions).length;
  if (count > CLEF_MAX_QUESTIONS) {
    throw new Error(`${site.brand.name} asks ${count} Clef questions per period; Clef answers at most ${CLEF_MAX_QUESTIONS}`);
  }

  const state = `Subject: ${p.entity}\nPeriod under assessment: ${when}\n\nEvidence:\n${p.evidence}`;
  return { model: "clef", state, questions };
}

export interface ClefScores {
  benefit: Dimensions;
  harm: Dimensions;
  reach_factor: number;
  persistence_factor: number;
  /** Mean of the answers' confidence. */
  confidence: number;
}

interface Answer {
  type?: unknown;
  score?: unknown;
  confidence?: unknown;
}

function read(answers: Record<string, Answer>, id: string): { score: number; confidence: number } {
  const a = answers[id];
  if (!a || a.type !== "score") throw new Error(`Clef returned no score answer for "${id}"`);
  if (typeof a.score !== "number" || !Number.isFinite(a.score) || a.score < 0 || a.score > 9) {
    throw new Error(`Clef's answer to "${id}" has no usable expected value: ${JSON.stringify(a.score)}`);
  }
  if (typeof a.confidence !== "number" || !Number.isFinite(a.confidence)) {
    throw new Error(`Clef's answer to "${id}" has no confidence value`);
  }
  return { score: a.score, confidence: a.confidence };
}

/** Expected value 0–9 to a level 0–10. */
function level(score: number): number {
  return Math.round(((score * 10) / 9) * 100) / 100;
}

/** Expected value 0–9 to a factor 1–10. */
function factor(score: number): number {
  return Math.round(score) + 1;
}

export function readClefAnswers(scoring: Pick<ScoringConfig, "dimensions">, response: unknown): ClefScores {
  const body = response as { answers?: Record<string, Answer> } | null;
  const answers = body?.answers;
  if (!answers || typeof answers !== "object") throw new Error("Clef returned no answers");

  const keys = dimensionKeysOf(scoring);
  const benefit = emptyDimensions(keys);
  const harm = emptyDimensions(keys);
  const confidences: number[] = [];
  for (const d of keys) {
    const b = read(answers, `${d}_benefit`);
    const h = read(answers, `${d}_harm`);
    benefit[d] = level(b.score);
    harm[d] = level(h.score);
    confidences.push(b.confidence, h.confidence);
  }
  const reach = read(answers, "reach");
  const persistence = read(answers, "persistence");
  confidences.push(reach.confidence, persistence.confidence);

  return {
    benefit,
    harm,
    reach_factor: factor(reach.score),
    persistence_factor: factor(persistence.score),
    confidence: confidences.reduce((s, c) => s + c, 0) / confidences.length,
  };
}

export async function runClef(env: ClefEnv, site: SiteConfig, p: PeriodToScore): Promise<ClefScores> {
  const response = await env.AI.run(CLEF_MODEL, buildClefRequest(site, p), { gateway: { id: env.AI_GATEWAY_NAME } });
  return readClefAnswers(site.scoring, response);
}
