// Every paid System One answer (Clef, Clairic), kept on disk and keyed by the exact request: the model
// and its input, as canonical JSON, hashed. A request asked before is answered from here, never paid
// for twice. The store is a folder of append-only JSONL files, one per day of asking, so a day's file
// never changes once the day is over.
//
// Each line: { key, model, input, output, at, partial? }. `partial` marks an answer kept in part only
// (the first link search kept each question's yes probability, not the whole answer).
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { canonical, keyOf } from "../src/lib/system-one";

// The key is the Worker's too: score_period takes answers by it.
export { canonical, keyOf };

export const DEFAULT_CACHE_DIR = "/Volumes/Berthold/Landru/work/shadowyrealm/system-one";

export interface CachedAnswer {
  key: string;
  model: string;
  input: unknown;
  output: unknown;
  at: string;
  partial?: true;
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

  /** The answer filed under a request's key, for a request built elsewhere (score_period's, say). */
  byKey(key: string): CachedAnswer | undefined {
    return this.answers.get(key);
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
