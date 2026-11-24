/**
 * The influence graph the index stores for a site whose content includes System One's graph
 * (tools/credit-search.ts; History's is content/system-one-graph.json): the curated links plus
 * System One's proposals, with every consequence's credit-bearing links scaled to what it owes its
 * causes. A curated link that carries no share takes the one System One set for it (shares).
 *
 * A consequence gives away at most Clairic's share of it owed to all its causes together (inherited).
 * When its curated links and proposals add up to more, all of them are scaled down by the same
 * factor; the rest of it was new with it, so a walk back through history stops there that often.
 * Proposals under MIN_SHARE before scaling, or under 0.01 after, are dropped. Links that carry no
 * credit pass through unchanged.
 *
 * This is the rule the 2026-11-15 pilot froze (its graph.ts, SCALE=inherited).
 */
export const MIN_SHARE = 0.05;

export interface SystemOneGraph {
  inherited: Record<string, number>;
  proposals: { from: string; to: string; p: number; share: number }[];
  /** Clairic's share for each curated link that carries none. */
  shares?: { from: string; to: string; type: string; share: number }[];
}

export interface CuratedLink {
  from: string;
  to: string;
  /** Left out where System One sets it (SystemOneGraph.shares). */
  share?: number;
  type: string;
  why: string;
}

export interface StoredLink extends CuratedLink {
  share: number;
  proposed: boolean;
}

export function storedGraph(given: CuratedLink[], creditTypes: ReadonlySet<string>, systemOne: SystemOneGraph): StoredLink[] {
  const set = new Map((systemOne.shares ?? []).map((s) => [`${s.from} ${s.to} ${s.type}`, s.share]));
  const curated = given.map((l) => {
    if (l.share != null) return { ...l, share: l.share };
    const share = set.get(`${l.from} ${l.to} ${l.type}`);
    if (share === undefined) throw new Error(`The link ${l.from} -> ${l.to} (${l.type}) has no share, and System One set none`);
    return { ...l, share };
  });
  const carries = (l: { type: string; share: number }) => creditTypes.has(l.type) && l.share > 0;
  const held = new Map<string, number>();
  for (const l of curated) if (carries(l)) held.set(l.to, (held.get(l.to) ?? 0) + l.share);

  // Every consequence's proposals in file order, kept from MIN_SHARE up.
  const proposals = new Map<string, SystemOneGraph["proposals"]>();
  for (const p of systemOne.proposals) {
    if (!(p.share >= MIN_SHARE)) continue;
    proposals.set(p.to, [...(proposals.get(p.to) ?? []), p]);
  }

  const scale = new Map<string, number>();
  const added: StoredLink[] = [];
  for (const to of new Set([...proposals.keys(), ...held.keys()])) {
    const own = proposals.get(to) ?? [];
    const total = (held.get(to) ?? 0) + own.reduce((s, p) => s + p.share, 0);
    if (total === 0) continue;
    const cap = systemOne.inherited[to];
    if (cap === undefined) throw new Error(`System One gives no inherited share for "${to}"`);
    const k = total > cap ? cap / total : 1;
    scale.set(to, k);
    for (const p of own) {
      const share = p.share * k;
      if (share < 0.01) continue;
      added.push({
        from: p.from,
        to,
        share,
        type: "influence",
        why: `Proposed by System One: Clef judged it a cause (p ${p.p.toFixed(2)}), and Clairic put the share at ${p.share.toFixed(2)} before scaling.`,
        proposed: true,
      });
    }
  }
  const kept = curated.map((l) => ({ ...l, share: carries(l) ? l.share * (scale.get(l.to) ?? 1) : l.share, proposed: false }));
  return [...kept, ...added];
}
