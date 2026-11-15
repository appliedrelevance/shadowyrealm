import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { canonical, keyOf, SystemOneCache } from "../tools/system-one-cache";

const dirs: string[] = [];
const freshDir = () => {
  const dir = mkdtempSync(join(tmpdir(), "system-one-"));
  dirs.push(dir);
  return dir;
};
afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true });
});

describe("the System One cache", () => {
  test("keys a request by its content, not the order its keys were written in", () => {
    expect(canonical({ b: 1, a: { d: [2, { f: 3, e: 4 }], c: "x" } })).toBe('{"a":{"c":"x","d":[2,{"e":4,"f":3}]},"b":1}');
    expect(keyOf("@cf/cloudflare/clef", { state: "s", questions: { q0: 1 } })).toBe(
      keyOf("@cf/cloudflare/clef", { questions: { q0: 1 }, state: "s" }),
    );
    expect(keyOf("@cf/cloudflare/clef", { state: "s" })).not.toBe(keyOf("@cf/cloudflare/clairic", { state: "s" }));
    expect(keyOf("@cf/cloudflare/clef", { state: "s" })).not.toBe(keyOf("@cf/cloudflare/clef", { state: "t" }));
  });

  test("asks the model once, and answers from disk after that, also in a new process", async () => {
    const dir = freshDir();
    let calls = 0;
    const run = async () => ({ answers: { q0: ++calls } });
    const first = await new SystemOneCache(dir).ask("@cf/cloudflare/clef", { state: "s" }, run);
    const again = await new SystemOneCache(dir).ask("@cf/cloudflare/clef", { state: "s" }, run);
    expect(first).toEqual({ output: { answers: { q0: 1 } }, cached: false });
    expect(again).toEqual({ output: { answers: { q0: 1 } }, cached: true });
    expect(calls).toBe(1);
  });

  test("finds an answer by the key of a request built elsewhere", () => {
    const cache = new SystemOneCache(freshDir());
    cache.put("@cf/cloudflare/clef", { state: "s" }, { answers: { q0: 1 } });
    expect(cache.byKey(keyOf("@cf/cloudflare/clef", { state: "s" }))?.output).toEqual({ answers: { q0: 1 } });
    expect(cache.byKey(keyOf("@cf/cloudflare/clef", { state: "t" }))).toBeUndefined();
  });

  test("files each answer under the day it was given", () => {
    const dir = freshDir();
    const cache = new SystemOneCache(dir);
    cache.put("@cf/cloudflare/clef", { state: "a" }, 1, { at: new Date("2026-11-14T05:29:00Z") });
    cache.put("@cf/cloudflare/clef", { state: "b" }, 2, { at: new Date("2026-11-15T09:00:00Z") });
    expect(readdirSync(dir).sort()).toEqual(["2026-11-14.jsonl", "2026-11-15.jsonl"]);
  });

  test("asks again past a partial answer, unless told to accept it, and keeps the whole one", async () => {
    const dir = freshDir();
    new SystemOneCache(dir).put("@cf/cloudflare/clef", { state: "s" }, { answers: { q0: { noul: 0.7 } } }, { partial: true });
    const run = async () => ({ answers: { q0: { noul: 0.7, confidence: 0.4 } } });
    expect((await new SystemOneCache(dir).ask("@cf/cloudflare/clef", { state: "s" }, run, { acceptPartial: true })).cached).toBe(true);
    expect((await new SystemOneCache(dir).ask("@cf/cloudflare/clef", { state: "s" }, run)).cached).toBe(false);
    const reloaded = new SystemOneCache(dir).get("@cf/cloudflare/clef", { state: "s" });
    expect(reloaded?.partial).toBeUndefined();
    expect(reloaded?.output).toEqual({ answers: { q0: { noul: 0.7, confidence: 0.4 } } });
  });
});
