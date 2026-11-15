/**
 * The key a System One request (Clef, Clairic) is known by: the model and its input as canonical
 * JSON, hashed. The System One cache (tools/system-one-cache.ts) files every paid answer under it,
 * and score_period takes answers by it, so an answer already paid for is never paid for again.
 */
import { createHash } from "node:crypto";

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

export interface SystemOneRequest {
  model: string;
  input: unknown;
  key: string;
}

export function requestOf(model: string, input: unknown): SystemOneRequest {
  return { model, input, key: keyOf(model, input) };
}
