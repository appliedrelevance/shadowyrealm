/**
 * The site this SPA was built for, chosen by the Vite mode (VITE_SITE). The
 * Worker serving it names its own site in the X-Site header of every /api
 * response, and src/features/realm/api.ts refuses a mismatch.
 */
import { siteFor } from "@/sites";

export const SITE = siteFor(import.meta.env.VITE_SITE);

export const DIMENSION_KEYS: string[] = SITE.scoring.dimensions.map((d) => d.key);

export const DIMENSION_LABELS: Record<string, string> = Object.fromEntries(
  SITE.scoring.dimensions.map((d) => [d.key, d.label]),
);

/** An /api response from a Worker serving a different site than this build. */
export class SiteMismatchError extends Error {
  constructor(
    readonly built: string,
    readonly served: string,
  ) {
    super(`This page was built for "${built}", but the server answering it serves "${served}"`);
    this.name = "SiteMismatchError";
  }
}

/** Throws SiteMismatchError unless the Worker that answered serves this build's site. */
export function assertSameSite(response: Response): void {
  const served = response.headers.get("X-Site");
  if (served !== SITE.key) throw new SiteMismatchError(SITE.key, served ?? "no site");
}

/** "ten-number", "twelve-number": the size of the profile in words. */
export function profileSizeWords(): string {
  const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven",
    "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
  const n = DIMENSION_KEYS.length * 2;
  return `${words[n] ?? String(n)}-number`;
}

/** "five": the number of dimensions in words. */
export function dimensionCountWords(): string {
  const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  return words[DIMENSION_KEYS.length] ?? String(DIMENSION_KEYS.length);
}
