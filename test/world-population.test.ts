import { describe, expect, test } from "bun:test";
import { meanWorldPopulation, worldPopulation } from "../src/lib/world-population";
import data from "../src/lib/world-population.json";

const series = data.series as [number, number][];

describe("the world's population", () => {
  test("is the series' value in each of its years", () => {
    for (const [year, people] of series) expect(worldPopulation(year)).toBeCloseTo(people, 3);
  });

  test("grows at a constant rate between two of the series' years", () => {
    // The series' first two years, a thousand years apart; halfway between, the population is
    // their geometric mean, not the arithmetic one.
    const [[y0, p0], [y1, p1]] = series;
    expect(worldPopulation((y0 + y1) / 2)).toBeCloseTo(Math.sqrt(p0 * p1), 3);
  });

  test("holds its first value before the series and its last after it", () => {
    expect(worldPopulation(-50_000)).toBe(series[0][1]);
    expect(worldPopulation(2100)).toBe(series[series.length - 1][1]);
  });

  test("in a typical year of a span is the mean over the span's years", () => {
    expect(meanWorldPopulation(1950, 1950)).toBeCloseTo(worldPopulation(1950), 3);
    let sum = 0;
    for (let y = 1096; y <= 1099; y++) sum += worldPopulation(y);
    expect(meanWorldPopulation(1096, 1099)).toBeCloseTo(sum / 4, 3);
  });

  test("averages the held values for spans outside the series", () => {
    expect(meanWorldPopulation(-20_000, -15_000)).toBeCloseTo(series[0][1], 3);
    expect(meanWorldPopulation(2030, 2040)).toBeCloseTo(series[series.length - 1][1], 3);
    let sum = 0;
    for (let y = 2020; y <= 2026; y++) sum += worldPopulation(y);
    expect(meanWorldPopulation(2020, 2026)).toBeCloseTo(sum / 7, 3);
  });

  test("refuses a span that ends before it starts", () => {
    expect(() => meanWorldPopulation(1900, 1899)).toThrow(/cannot end/);
  });
});
