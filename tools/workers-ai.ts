/**
 * Asking System One (Clef, Clairic) on Workers AI from a tool, and what it costs.
 *
 * Prices are Cloudflare's list prices per input token: Clef $0.24 a million; Clairic $0.10 a million
 * until 2026-12-01, when its introductory price ends, and $0.24 after.
 */
import { CLAIRIC_MODEL } from "../src/lib/clairic";
import { CLEF_MODEL } from "../src/lib/clef";

/** The Applied Relevance Cloudflare account, where ShadowyRealm's Workers AI runs. */
const ACCOUNT = "b874dcd2a5021696567c4cf127e875b3";

const CLAIRIC_FULL_PRICE_FROM = Date.parse("2026-12-01T00:00:00Z");

export const DOLLARS_PER_INPUT_TOKEN: Record<string, number> = {
  [CLEF_MODEL]: 0.24e-6,
  [CLAIRIC_MODEL]: Date.now() < CLAIRIC_FULL_PRICE_FROM ? 0.1e-6 : 0.24e-6,
};

/**
 * The most a character of request can cost: the most input tokens a character has taken over the
 * whole-article requests in the System One cache (2026-11-14 and 15: Clef 0.4429, Clairic 0.4738),
 * at the list price per input token.
 */
export const DOLLARS_PER_CHAR_AT_MOST: Record<string, number> = {
  [CLEF_MODEL]: 0.4429 * DOLLARS_PER_INPUT_TOKEN[CLEF_MODEL],
  [CLAIRIC_MODEL]: 0.4738 * DOLLARS_PER_INPUT_TOKEN[CLAIRIC_MODEL],
};

/** One request to a model through the Workers AI REST API; a rate limit or server error is tried again. */
export async function runModel(token: string, model: string, input: unknown): Promise<unknown> {
  for (let attempt = 0; ; attempt++) {
    let res: Response;
    try {
      res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/ai/run/${model}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
    } catch (err) {
      if (attempt >= 5) throw err;
      await Bun.sleep(5_000 * (attempt + 1));
      continue;
    }
    const body = (await res.json().catch(() => ({}))) as { success?: boolean; result?: unknown; errors?: unknown };
    if (res.ok && body.success) return body.result;
    if (attempt < 5 && (res.status === 429 || res.status >= 500)) {
      await Bun.sleep(5_000 * (attempt + 1));
      continue;
    }
    throw new Error(`${model}: HTTP ${res.status} ${JSON.stringify(body.errors)}`);
  }
}
