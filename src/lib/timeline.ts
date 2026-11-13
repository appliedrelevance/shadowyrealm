/**
 * The time axis every chart of a site shares: a logarithmic scale of years
 * before the present, so the last century is as readable as the last
 * millennium. The Worker samples curves on these buckets and the browser draws
 * them on the same scale, so the two always line up. Where the axis starts,
 * its ticks, its near offset and its bucket count come from the site config.
 */
import type { Timeline } from "../sites/types";

/** The instant the axis ends: the end of the as-of year. */
export function timelineEnd(asOfYear: number): number {
  return asOfYear + 1;
}

/** Position of a year on the axis, 0 at the timeline's start and 1 at the present. */
export function yearToUnit(year: number, asOfYear: number, timeline: Timeline): number {
  const end = timelineEnd(asOfYear);
  const far = Math.log(end - timeline.start + timeline.near);
  const near = Math.log(timeline.near);
  const at = Math.log(Math.max(end - year, 0) + timeline.near);
  return (far - at) / (far - near);
}

export function unitToYear(unit: number, asOfYear: number, timeline: Timeline): number {
  const end = timelineEnd(asOfYear);
  const far = Math.log(end - timeline.start + timeline.near);
  const near = Math.log(timeline.near);
  return end + timeline.near - Math.exp(far - unit * (far - near));
}

/** timeline.buckets + 1 edges, evenly spaced on the axis, as years. */
export function bucketEdges(asOfYear: number, timeline: Timeline): number[] {
  const edges: number[] = [];
  for (let i = 0; i <= timeline.buckets; i++) edges.push(unitToYear(i / timeline.buckets, asOfYear, timeline));
  edges[0] = timeline.start;
  edges[timeline.buckets] = timelineEnd(asOfYear);
  return edges;
}

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
