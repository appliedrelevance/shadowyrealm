/**
 * Checks a content index before it is loaded, without writing anything:
 *
 *   bun tools/content-check.ts content/inventions/index.ts [--offline]
 *
 * - every slug is unique, and every entity type and link type is the site's;
 * - every link names entities in the file, with endpoint types its link type allows;
 * - no entity credits more than 1.00 of itself to its causes;
 * - an entity whose type requires an outgoing link has one;
 * - every period lies inside the site's timeline and ends by the current year,
 *   and period labels are unique within an entity;
 * - every Wikipedia title, the entity's own and any a period names, resolves
 *   to an article (skipped with --offline).
 *
 * Exits non-zero, listing every problem, when anything fails.
 */
import type { SiteContent } from "../content/types";
import { allowsEnds, describeEnds, siteFor } from "../src/sites";

const file = process.argv[2];
if (!file) throw new Error("Pass the content index, e.g. content/inventions/index.ts");
const offline = process.argv.includes("--offline");

const mod = (await import(file.startsWith("/") ? file : `${process.cwd()}/${file}`)) as { default: SiteContent<string, string>; site?: string };
if (!mod.site) throw new Error(`${file} must export \`site\``);
const site = siteFor(mod.site);
const content = mod.default;
const thisYear = new Date().getUTCFullYear();
const problems: string[] = [];

const bySlug = new Map<string, (typeof content.entities)[number]>();
for (const e of content.entities) {
  if (bySlug.has(e.slug)) problems.push(`duplicate slug "${e.slug}"`);
  bySlug.set(e.slug, e);
  if (!site.entityTypes.some((t) => t.key === e.type)) problems.push(`${e.slug}: no entity type "${e.type}"`);
  if (!e.description.trim()) problems.push(`${e.slug}: empty description`);
  if (e.periods.length === 0) problems.push(`${e.slug}: no periods`);
  const labels = new Set<string>();
  for (const p of e.periods) {
    if (labels.has(p.label)) problems.push(`${e.slug}: duplicate period label "${p.label}"`);
    labels.add(p.label);
    if (p.start < site.timeline.start) problems.push(`${e.slug} / ${p.label}: starts ${p.start}, before ${site.timeline.start}`);
    if (p.end < p.start) problems.push(`${e.slug} / ${p.label}: ends before it starts`);
    if (p.end > thisYear) problems.push(`${e.slug} / ${p.label}: ends ${p.end}, after ${thisYear}`);
    if (!p.description.trim()) problems.push(`${e.slug} / ${p.label}: empty description`);
  }
}

const incoming = new Map<string, number>();
const seen = new Set<string>();
for (const l of content.links) {
  const type = l.type ?? (site.linkTypes.some((t) => t.key === "influence") ? "influence" : undefined);
  const def = site.linkTypes.find((t) => t.key === type);
  const from = bySlug.get(l.from);
  const to = bySlug.get(l.to);
  const name = `${l.from} -> ${l.to} (${type ?? "no type"})`;
  if (!def) {
    problems.push(`${name}: no link type`);
    continue;
  }
  if (!from) problems.push(`${name}: "${l.from}" is not in the file`);
  if (!to) problems.push(`${name}: "${l.to}" is not in the file`);
  if (l.from === l.to) problems.push(`${name}: links to itself`);
  const key = `${l.from}|${l.to}|${type}`;
  if (seen.has(key)) problems.push(`${name}: linked twice`);
  seen.add(key);
  if (!l.why.trim()) problems.push(`${name}: no why`);
  if (l.share < 0 || l.share > 1) problems.push(`${name}: share ${l.share} outside 0-1`);
  if (from && to && !allowsEnds(def, from.type, to.type)) {
    problems.push(`${name}: runs ${from.type} -> ${to.type}; ${def.key} allows ${describeEnds(def.from)} -> ${describeEnds(def.to)}`);
  }
  if (def.credit) incoming.set(l.to, (incoming.get(l.to) ?? 0) + l.share);
}
for (const [slug, total] of incoming) {
  if (total > 1.000001) problems.push(`${slug}: credits ${total.toFixed(2)} of itself to its causes, more than 1.00`);
}

for (const e of content.entities) {
  const required = site.entityTypes.find((t) => t.key === e.type)?.requiresOutgoing;
  if (required && !content.links.some((l) => l.from === e.slug && l.type === required)) {
    problems.push(`${e.slug}: a ${e.type} needs an outgoing ${required} link`);
  }
}

if (!offline) {
  const titles = [...new Set(content.entities.flatMap((e) => [e.wiki, ...e.periods.flatMap((p) => (p.wiki ? [p.wiki] : []))]))];
  const missing: string[] = [];
  for (let i = 0; i < titles.length; i += 50) {
    const batch = titles.slice(i, i + 50);
    const url =
      "https://en.wikipedia.org/w/api.php?" +
      new URLSearchParams({ action: "query", titles: batch.join("|"), redirects: "1", format: "json" });
    const res = await fetch(url, { headers: { "User-Agent": site.brand.userAgent } });
    if (!res.ok) throw new Error(`Wikipedia lookup failed: HTTP ${res.status}`);
    const q = (await res.json()).query as {
      pages: Record<string, { title: string; missing?: string; invalid?: string }>;
      normalized?: { from: string; to: string }[];
      redirects?: { from: string; to: string }[];
    };
    const resolve = (t: string) => {
      let r = q.normalized?.find((n) => n.from === t)?.to ?? t;
      r = q.redirects?.find((n) => n.from === r)?.to ?? r;
      return r;
    };
    for (const t of batch) {
      const page = Object.values(q.pages).find((p) => p.title === resolve(t));
      if (!page || page.missing !== undefined || page.invalid !== undefined) missing.push(t);
    }
  }
  for (const t of missing) problems.push(`Wikipedia has no article "${t}"`);
}

const periods = content.entities.reduce((n, e) => n + e.periods.length, 0);
console.log(`${site.brand.name}: ${content.entities.length} entities, ${periods} periods, ${content.links.length} links`);
if (problems.length > 0) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exit(1);
}
console.log("No problems found.");
