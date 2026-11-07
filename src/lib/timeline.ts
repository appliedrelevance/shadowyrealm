/**
 * The time axis every ShadowyRealm chart shares: a logarithmic scale of years
 * before the present, so the last century is as readable as the last
 * millennium. The Worker samples curves on these buckets and the browser draws
 * them on the same scale, so the two always line up.
 */

/** The axis starts at the invention of writing. */
export const TIMELINE_START = -3200;

/** Years of offset that keep the present from sitting at infinity. */
const NEAR = 40;

/** Buckets across the whole axis. */
export const BUCKET_COUNT = 200;

/** The instant the axis ends: the end of the as-of year. */
export function timelineEnd(asOfYear: number): number {
  return asOfYear + 1;
}

/** Position of a year on the axis, 0 at TIMELINE_START and 1 at the present. */
export function yearToUnit(year: number, asOfYear: number): number {
  const end = timelineEnd(asOfYear);
  const far = Math.log(end - TIMELINE_START + NEAR);
  const near = Math.log(NEAR);
  const at = Math.log(Math.max(end - year, 0) + NEAR);
  return (far - at) / (far - near);
}

export function unitToYear(unit: number, asOfYear: number): number {
  const end = timelineEnd(asOfYear);
  const far = Math.log(end - TIMELINE_START + NEAR);
  const near = Math.log(NEAR);
  return end + NEAR - Math.exp(far - unit * (far - near));
}

/** BUCKET_COUNT + 1 edges, evenly spaced on the axis, as years. */
export function bucketEdges(asOfYear: number): number[] {
  const edges: number[] = [];
  for (let i = 0; i <= BUCKET_COUNT; i++) edges.push(unitToYear(i / BUCKET_COUNT, asOfYear));
  edges[0] = TIMELINE_START;
  edges[BUCKET_COUNT] = timelineEnd(asOfYear);
  return edges;
}

/** Tick years for the axis labels. */
export const TIMELINE_TICKS = [-3000, -2000, -1000, -500, 1, 500, 1000, 1500, 1700, 1800, 1900, 1950, 2000];

/** "500 BCE", "30 CE", "1066". Years before 1000 CE carry their era so they cannot be misread. */
export function formatYear(year: number): string {
  const y = Math.round(year);
  if (y <= 0) return `${y === 0 ? 1 : -y} BCE`;
  return y < 1000 ? `${y} CE` : `${y}`;
}

/** "1096–1099", "28–30 CE", "27 BCE–14 CE", "since 1948". */
export function formatSpan(start: number, end: number, asOfYear: number): string {
  if (end >= asOfYear) return `since ${formatYear(start)}`;
  if (start === end) return formatYear(start);
  if (start > 0 && end < 1000) return `${start}–${end} CE`;
  if (end <= 0) return `${start === 0 ? 1 : -start}–${-end} BCE`;
  return `${formatYear(start)}–${formatYear(end)}`;
}
