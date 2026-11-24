/**
 * The System One requests that build a site's credit links from evidence, worded as the 2026-11-14
 * pilot that built History's graph (system-one/2026-11-14.jsonl), so a request built here from the
 * pilot's pairs and evidence is byte for byte the pilot's.
 *
 * 1. The search. Each cause is one or more Clef requests: its own evidence as the state, and one
 *    yes/no question per candidate consequence, at most 64 to a request. A consequence the answer
 *    gives at least CAUSE_AT_LEAST is a proposal.
 * 2. The shares. Each consequence with proposals is one or more Clairic requests on its own evidence:
 *    one estimate per cause of the share of the consequence owed to it.
 * 3. The inherited share. One Clairic request per consequence with credit: the share of it owed to
 *    all its causes taken together. tools/credit-graph.ts scales its links down to it.
 */
import { CLAIRIC_MODEL } from "../src/lib/clairic";
import { CLEF_MAX_QUESTIONS, CLEF_MODEL } from "../src/lib/clef";

export { CLAIRIC_MODEL, CLEF_MODEL };

/** The yes probability at which Clef's answer makes a candidate a proposal. */
export const CAUSE_AT_LEAST = 0.5;
/** A cause's description is cut to this many characters inside a share question. */
const SHARE_DESCRIPTION_CHARS = 160;
/** Estimates per Clairic request; a consequence with more causes takes more requests. */
export const SHARES_PER_REQUEST = 64;

export interface Entry {
  slug: string;
  name: string;
  description: string;
  periods: { label: string; start: number; end: number }[];
}

const year = (n: number) => (n < 0 ? `${-n} BCE` : `${n}`);
const span = (a: number, b: number) => (a === b ? year(a) : `${year(a)} to ${year(b)}`);

/** When an entry began: its first period's start. */
export const startOf = (e: Entry) => e.periods[0].start;
/** When an entry ended: its last period's end. */
export const endOf = (e: Entry) => Math.max(...e.periods.map((p) => p.end));

/** A cause can have shaped a consequence that had not ended when the cause began. */
export const canHaveShaped = (cause: Entry, consequence: Entry) => startOf(cause) <= endOf(consequence);

function state(role: "Cause" | "Consequence", e: Entry, evidence: string): string {
  const periods = e.periods.map((p) => `${p.label} (${span(p.start, p.end)})`).join("; ");
  return `${role}: ${e.name}. ${e.description}\nPeriods: ${periods}\n\nEvidence about ${e.name}:\n${evidence}`;
}

function chunks<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export interface SearchRequest {
  model: "clef";
  state: string;
  questions: Record<string, { type: "noul"; instructions: string }>;
}

/** The search requests for one cause, its candidate consequences in the order given. */
export function searchRequests(cause: Entry, evidence: string, consequences: Entry[]): SearchRequest[] {
  return chunks(consequences, CLEF_MAX_QUESTIONS).map((batch) => ({
    model: "clef",
    state: state("Cause", cause, evidence),
    questions: Object.fromEntries(
      batch.map((c, i) => [
        `q${i}`,
        {
          type: "noul",
          instructions:
            `Did ${cause.name}'s work or existence make "${c.name}" possible, or substantially shape it? ` +
            `${c.name}: ${c.description} (began ${year(startOf(c))}).`,
        },
      ]),
    ),
  }));
}

/** The yes probability of each question in a search request, in question order. */
export function readSearchAnswers(request: SearchRequest, output: unknown): number[] {
  const answers = (output as { answers?: Record<string, { noul?: unknown }> } | null)?.answers;
  if (!answers || typeof answers !== "object") throw new Error("Clef returned no answers");
  return Object.keys(request.questions).map((id) => {
    const p = answers[id]?.noul;
    if (typeof p !== "number" || !Number.isFinite(p) || p < 0 || p > 1) {
      throw new Error(`Clef's answer to "${id}" has no usable yes probability: ${JSON.stringify(p)}`);
    }
    return p;
  });
}

interface Estimate {
  type: "estimate";
  min: 0;
  max: 1;
  step: 0.01;
  instructions: string;
}

export interface ClairicRequest {
  model: "clairic";
  state: string;
  fields: Record<string, Estimate>;
}

const estimate = (instructions: string): Estimate => ({ type: "estimate", min: 0, max: 1, step: 0.01, instructions });

/** The share requests for one consequence, its causes in the order given. */
export function shareRequests(consequence: Entry, evidence: string, causes: Entry[]): ClairicRequest[] {
  return chunks(causes, SHARES_PER_REQUEST).map((batch) => ({
    model: "clairic",
    state: state("Consequence", consequence, evidence),
    fields: Object.fromEntries(
      batch.map((c, i) => [
        `s${i}`,
        estimate(
          `What share of ${consequence.name}'s existence and effects is owed to ${c.name} ` +
            `(${c.description.slice(0, SHARE_DESCRIPTION_CHARS)})? 0 means none of it, 1 means all of it.`,
        ),
      ]),
    ),
  }));
}

/** The request for the share of one consequence owed to all its causes together. */
export function inheritedRequest(consequence: Entry, evidence: string, causes: Entry[]): ClairicRequest {
  const n = consequence.name;
  return {
    model: "clairic",
    state: state("Consequence", consequence, evidence),
    fields: {
      inherited: estimate(
        `${n} came after ${causes.map((c) => c.name).join(", ")}. Of everything ${n} was and did, what share is owed ` +
          `to these, taken together? The rest is what was new with ${n} itself: its own ideas, choices and work. ` +
          "0 means it owed them nothing, 1 means it was wholly their product.",
      ),
    },
  };
}

/** Each field's median, in field order. */
export function readEstimates(request: ClairicRequest, output: unknown): number[] {
  const answers = (output as { answers?: Record<string, { median?: unknown }> } | null)?.answers;
  if (!answers || typeof answers !== "object") throw new Error("Clairic returned no answers");
  return Object.keys(request.fields).map((id) => {
    const m = answers[id]?.median;
    if (typeof m !== "number" || !Number.isFinite(m) || m < 0 || m > 1) {
      throw new Error(`Clairic's answer to "${id}" has no usable median: ${JSON.stringify(m)}`);
    }
    return m;
  });
}
