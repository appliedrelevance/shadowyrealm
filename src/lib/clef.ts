/**
 * Scoring one period with Clef, Cloudflare's decision model.
 *
 * One request per period: the evidence text is the state, and twelve `score`
 * questions ask for the benefit and harm of each dimension plus the period's
 * reach and persistence. Each question has ten levels, Clef's maximum.
 *
 * Answers are read strictly. A question without a usable expected value is an
 * error naming that question; nothing is substituted, and there is no fallback
 * model.
 */
import { DIMENSIONS, emptyDimensions, type Dimension, type Dimensions } from "./atis-calculator";

export const CLEF_MODEL = "@cf/cloudflare/clef";

export interface ClefEnv {
  AI: { run(model: string, input: unknown, options?: { gateway?: { id: string } }): Promise<unknown> };
  AI_GATEWAY_NAME: string;
}

const AREAS: Record<Dimension, string> = {
  scientific: "advancing knowledge, research and technology",
  economic: "prosperity, livelihoods, wealth and economic opportunity",
  human_rights: "freedom, dignity, safety and equal treatment of people",
  health: "physical and mental health and survival of people",
  cultural: "art, education, shared culture and social cohesion",
};

/** Intensity for the people affected; breadth is the reach question's job. */
export const INTENSITY_LEVELS = [
  "No effect on this dimension",
  "Trivial, barely noticeable",
  "Slight, limited to a few people",
  "Minor but real",
  "Moderate",
  "Substantial",
  "Major",
  "Severe",
  "Extreme, life-altering for those affected",
  "Catastrophic or transformative, the most intense effect on people in history",
];

/** Read as reach factor 1–10. */
export const REACH_LEVELS = [
  "A handful of people",
  "A village or a small group",
  "A town or a single community",
  "A city or a single profession",
  "A province or a region",
  "A nation",
  "Several nations",
  "A continent or a whole civilization",
  "Most of the world",
  "Nearly everyone alive",
];

/** Read as persistence factor 1–10; matches PERSISTENCE_TIME_CONSTANTS in the calculator. */
export const PERSISTENCE_LEVELS = [
  "Faded within a year",
  "Faded within a few years",
  "Faded within a decade",
  "Faded within a generation",
  "Lasted about a lifetime",
  "Lasted a century or two",
  "Lasted several centuries",
  "Lasted most of a millennium",
  "Lasted for millennia",
  "Permanent, with no sign of fading",
];

export interface PeriodToScore {
  entity: string;
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

export function buildClefRequest(p: PeriodToScore) {
  const when = `"${p.period}" (${span(p.start_year, p.end_year)})`;
  const leaveOut =
    p.excluded.length > 0
      ? `Leave out the effects of ${p.excluded.join(", ")}, which are scored as entities of their own.`
      : "Leave out consequences that would be entities of their own.";

  const questions: Record<string, unknown> = {};
  for (const d of DIMENSIONS) {
    for (const kind of ["benefit", "harm"] as const) {
      questions[`${d}_${kind}`] = {
        type: "score",
        instructions:
          `Judge only from the evidence text. Rate the intensity of the ${kind.toUpperCase()} that ` +
          `${p.entity}'s own direct activity during ${when} caused to the people it affected, in the area of ` +
          `${AREAS[d]}. Rate how deeply those people were affected, not how many; breadth is judged separately. ` +
          `Score only that activity in that period. ${leaveOut} ` +
          `If the evidence shows no ${kind} in this area, choose the lowest level.`,
        criteria: INTENSITY_LEVELS,
      };
    }
  }
  questions.reach = {
    type: "score",
    instructions:
      `Judge only from the evidence text. How many people did ${p.entity}'s own direct activity during ${when} ` +
      `affect while it lasted? ${leaveOut}`,
    criteria: REACH_LEVELS,
  };
  questions.persistence = {
    type: "score",
    instructions:
      `Judge only from the evidence text. After ${when} ended, how long did the effects of ${p.entity}'s own ` +
      `direct activity in it last? ${leaveOut}`,
    criteria: PERSISTENCE_LEVELS,
  };

  const state = `Subject: ${p.entity}\nPeriod under assessment: ${when}\n\nEvidence:\n${p.evidence}`;
  return { model: "clef", state, questions };
}

export interface ClefScores {
  benefit: Dimensions;
  harm: Dimensions;
  reach_factor: number;
  persistence_factor: number;
  /** Mean of the twelve answers' confidence. */
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

export function readClefAnswers(response: unknown): ClefScores {
  const body = response as { answers?: Record<string, Answer> } | null;
  const answers = body?.answers;
  if (!answers || typeof answers !== "object") throw new Error("Clef returned no answers");

  const benefit = emptyDimensions();
  const harm = emptyDimensions();
  const confidences: number[] = [];
  for (const d of DIMENSIONS) {
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

export async function runClef(env: ClefEnv, p: PeriodToScore): Promise<ClefScores> {
  const response = await env.AI.run(CLEF_MODEL, buildClefRequest(p), { gateway: { id: env.AI_GATEWAY_NAME } });
  return readClefAnswers(response);
}
