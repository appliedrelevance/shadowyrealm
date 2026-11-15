/**
 * The world's population, for turning a head-count into a share of living humanity.
 *
 * The series is Our World in Data's long-run World population (world-population.json): every
 * thousand years from 10,000 BCE, then every hundred, ten and finally every year to 2023. Between
 * two of its years the population grows at a constant rate (it is interpolated on a log scale);
 * before the first year it is the first value, and after the last it is the last.
 */
import data from "./world-population.json";

const series = data.series as [number, number][];
const FIRST = series[0][0];
const LAST = series[series.length - 1][0];

/** The world's population in a year. Years are plain integers; BCE is negative. */
export function worldPopulation(year: number): number {
  if (year <= FIRST) return series[0][1];
  if (year >= LAST) return series[series.length - 1][1];
  let hi = 1;
  while (series[hi][0] < year) hi++;
  const [y0, p0] = series[hi - 1];
  const [y1, p1] = series[hi];
  return p0 * Math.pow(p1 / p0, (year - y0) / (y1 - y0));
}

/** cumulative[i] = the sum of worldPopulation over the years FIRST … FIRST + i − 1. */
let cumulative: Float64Array | null = null;

function sumThrough(year: number): number {
  if (!cumulative) {
    cumulative = new Float64Array(LAST - FIRST + 2);
    for (let i = 1; i < cumulative.length; i++) cumulative[i] = cumulative[i - 1] + worldPopulation(FIRST + i - 1);
  }
  // Years outside the series repeat its first or last value.
  if (year < FIRST) return (year - FIRST + 1) * series[0][1];
  if (year > LAST) return cumulative[cumulative.length - 1] + (year - LAST) * series[series.length - 1][1];
  return cumulative[year - FIRST + 1];
}

/** The world's mean population over the years start … end inclusive: its population in a typical year of them. */
export function meanWorldPopulation(start: number, end: number): number {
  if (end < start) throw new Error(`A span of years cannot end (${end}) before it starts (${start})`);
  return (sumThrough(end) - sumThrough(start - 1)) / (end - start + 1);
}
