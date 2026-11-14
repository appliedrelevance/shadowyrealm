// Every paid System One answer (Clef, Clairic), kept on disk and keyed by the exact request: the model
// and its input, as canonical JSON, hashed. A request asked before is answered from here, never paid
// for twice. The store is a folder of append-only JSONL files, one per day of asking, so a day's file
// never changes once the day is over.
//
// Each line: { key, model, input, output, at, partial? }. `partial` marks an answer kept in part only
// (the first link search kept each question's yes probability, not the whole answer).
import { createHash } from "node:crypto";
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";

export const DEFAULT_CACHE_DIR = "/Volumes/Berthold/Landru/work/shadowyrealm/system-one";

export interface CachedAnswer {
  key: string;
  model: string;
  input: unknown;
  output: unknown;
  at: string;
  partial?: true;
}

/** JSON with every object's keys sorted, so two equal requests are one string however they were built. */
export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function keyOf(model: string, input: unknown): string {
  return createHash("sha256").update(`${model}\n${canonical(input)}`).digest("hex");
}

export class SystemOneCache {
  readonly dir: string;
  private answers = new Map<string, CachedAnswer>();

  constructor(dir = process.env.SYSTEM_ONE_CACHE ?? DEFAULT_CACHE_DIR) {
    this.dir = dir;
    if (!existsSync(dir)) return;
    for (const file of readdirSync(dir).filter((f) => f.endsWith(".jsonl")).sort()) {
      for (const line of readFileSync(`${dir}/${file}`, "utf8").split("\n")) {
        if (!line) continue;
        const answer = JSON.parse(line) as CachedAnswer;
        // A whole answer replaces a partial one for the same request, never the other way round.
        const held = this.answers.get(answer.key);
        if (!held || (held.partial && !answer.partial)) this.answers.set(answer.key, answer);
      }
    }
  }

  get size(): number {
    return this.answers.size;
  }

  get(model: string, input: unknown): CachedAnswer | undefined {
    return this.answers.get(keyOf(model, input));
  }

  /** Keeps an answer. `at` is when the model gave it, which names the day's file. */
  put(model: string, input: unknown, output: unknown, options: { at?: Date; partial?: boolean } = {}): CachedAnswer {
    const at = (options.at ?? new Date()).toISOString();
    const answer: CachedAnswer = { key: keyOf(model, input), model, input, output, at, ...(options.partial ? { partial: true as const } : {}) };
    const held = this.answers.get(answer.key);
    if (held && !(held.partial && !answer.partial)) return held;
    mkdirSync(this.dir, { recursive: true });
    appendFileSync(`${this.dir}/${at.slice(0, 10)}.jsonl`, `${JSON.stringify(answer)}\n`);
    this.answers.set(answer.key, answer);
    return answer;
  }

  /**
   * The answer to a request: from the cache when it was asked before (a partial answer counts only
   * when `acceptPartial` is set), otherwise from `run`, which is then kept.
   */
  async ask<T = unknown>(
    model: string,
    input: unknown,
    run: (model: string, input: unknown) => Promise<T>,
    options: { acceptPartial?: boolean } = {},
  ): Promise<{ output: T; cached: boolean }> {
    const held = this.get(model, input);
    if (held && (!held.partial || options.acceptPartial)) return { output: held.output as T, cached: true };
    const output = await run(model, input);
    this.put(model, input, output);
    return { output, cached: false };
  }
}
