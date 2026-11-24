import { describe, expect, test } from "bun:test";
import { keyOf } from "../src/lib/system-one";
import {
  canHaveShaped,
  CLAIRIC_MODEL,
  CLEF_MODEL,
  inheritedRequest,
  readEstimates,
  readSearchAnswers,
  searchRequests,
  shareRequests,
  type Entry,
} from "../tools/credit-requests";
import pilot from "./fixtures/credit-search-history.json";

/**
 * Three requests of the 2026-11-14 pilot that built History's graph, from the System One cache: Albert
 * Einstein's first search request, Niels Bohr's share request and the Columbian exchange's inherited
 * request, each with the pilot's evidence and its entries in the pilot's order.
 */
describe("the credit search asks what the pilot asked", () => {
  test("a cause's search request is the pilot's, byte for byte", () => {
    const { cause, evidence, consequences, key, yes } = pilot.search;
    const [request, ...rest] = searchRequests(cause as Entry, evidence, consequences as Entry[]);
    expect(rest).toHaveLength(0);
    expect(keyOf(CLEF_MODEL, request)).toBe(key);
    const answer = { answers: Object.fromEntries(yes.map((p, i) => [`q${i}`, { noul: p }])) };
    expect(readSearchAnswers(request, answer)).toEqual(yes);
  });

  test("a consequence's share request is the pilot's, byte for byte", () => {
    const { consequence, evidence, causes, key, medians } = pilot.share;
    const [request] = shareRequests(consequence as Entry, evidence, causes as Entry[]);
    expect(keyOf(CLAIRIC_MODEL, request)).toBe(key);
    const answer = { answers: Object.fromEntries(medians.map((m, i) => [`s${i}`, { median: m }])) };
    expect(readEstimates(request, answer)).toEqual(medians);
  });

  test("a consequence's inherited request is the pilot's, byte for byte", () => {
    const { consequence, evidence, causes, key } = pilot.inherited;
    expect(keyOf(CLAIRIC_MODEL, inheritedRequest(consequence as Entry, evidence, causes as Entry[]))).toBe(key);
  });

  test("more than 64 candidates take more than one request, each numbered from q0", () => {
    const { cause, evidence, consequences } = pilot.search;
    const many = [...consequences, ...consequences.slice(0, 6)] as Entry[];
    const requests = searchRequests(cause as Entry, evidence, many);
    expect(requests.map((r) => Object.keys(r.questions).length)).toEqual([64, 6]);
    expect(Object.keys(requests[1].questions)).toEqual(["q0", "q1", "q2", "q3", "q4", "q5"]);
  });

  test("a cause can have shaped whatever had not ended when it began", () => {
    const e = (start: number, end: number): Entry => ({ slug: "x", name: "x", description: "x", periods: [{ label: "x", start, end }] });
    expect(canHaveShaped(e(1960, 1970), e(1961, 2026))).toBe(true);
    expect(canHaveShaped(e(1961, 2026), e(1960, 1970))).toBe(true);
    expect(canHaveShaped(e(1900, 2026), e(1685, 1750))).toBe(false);
  });

  test("an answer without a usable value is an error naming its question", () => {
    const { cause, evidence, consequences } = pilot.search;
    const [request] = searchRequests(cause as Entry, evidence, consequences.slice(0, 2) as Entry[]);
    expect(() => readSearchAnswers(request, { answers: { q0: { noul: 0.4 } } })).toThrow('"q1"');
    const [shares] = shareRequests(pilot.share.consequence as Entry, "x", pilot.share.causes.slice(0, 1) as Entry[]);
    expect(() => readEstimates(shares, { answers: { s0: { median: null } } })).toThrow('"s0"');
  });
});
