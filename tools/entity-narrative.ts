/**
 * Write each entity's narrative: why it scored as it did, from the same evidence its periods were
 * scored from (the whole stored Wikipedia article) and the facts of its score (which areas carry
 * it, how much came while it lasted, after it ended and through what it caused, and what it led
 * to). One paragraph of 100 to 140 words; the first sentence stands alone, for a film's card.
 *
 * Reads the site's public API, asks a Workers AI writing model, and checks every narrative: its
 * length, no hedging, no talk of scores or sources, and no number that is in neither the article nor
 * the facts. Nothing is spent without --pay: without it the tool prints what the run would send.
 *
 *   CF_TOKEN_FILE=… bun tools/entity-narrative.ts [--site history] [--only slug,slug] [--model @cf/…]
 *     [--out narratives.json|narratives.jsonl] [--concurrency 3] [--pay]   (.jsonl is written as it goes and resumed)
 */
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { siteFor } from "../src/sites";
import { runModel } from "./workers-ai";

const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const site = siteFor(arg("site") ?? "history");
const MODEL = arg("model") ?? "@cf/zai-org/glm-5.3";
const PAY = process.argv.includes("--pay");
const OUT = arg("out");
const CONCURRENCY = Number(arg("concurrency") ?? 3);
const headers = { "User-Agent": site.brand.userAgent };

/** List prices per million tokens, from the account's model catalogue on 2026-11-28. */
const PRICES: Record<string, { input: number; output: number }> = {
  "@cf/zai-org/glm-5.3": { input: 1.4, output: 4.4 },
  "@cf/deepseek-ai/deepseek-v4.1-flash-1017": { input: 0.3, output: 1.2 },
  "@cf/thinkingmachines/inkling-2-small": { input: 0.3, output: 1.0 },
};
const price = PRICES[MODEL];
if (!price) throw new Error(`No price for ${MODEL}: add it to PRICES from the model catalogue`);

interface Profile {
  entity: { slug: string; name: string; entity_type: string; description: string };
  score: {
    total_magnitude: number;
    own_magnitude: number;
    credited_magnitude: number;
    benefit_total: number;
    harm_total: number;
    profile: { own: Record<"benefit" | "harm", Record<string, number>>; total: Record<"benefit" | "harm", Record<string, number>> };
    tail: { from_year: number; years: number; magnitude: number } | null;
  };
  periods: {
    label: string;
    start_year: number;
    end_year: number;
    description: string;
    magnitude: number;
    assessments: { evidence: string | null; sources: string[] | null }[];
  }[];
  links: { direction: "outgoing" | "incoming"; other: { name: string }; relationship_type: string; strength: number }[];
}

async function getJson<T>(url: string): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers });
    if (res.ok) return (await res.json()) as T;
    if (attempt < 4 && (res.status === 429 || res.status >= 500)) {
      await Bun.sleep(2000 * (attempt + 1));
      continue;
    }
    throw new Error(`${url} answered ${res.status}`);
  }
}

const realm = await getJson<{ entities: { slug: string; benefit_total: number; harm_total: number; total_magnitude: number }[] }>(
  `${site.brand.origin}/api/realm`,
);
const label = new Map(site.scoring.dimensions.map((d) => [d.key, d.label]));
const year = (y: number) => (y <= 0 ? `${1 - y} BCE` : y < 1000 ? `${y} CE` : `${y}`);
const pct = (part: number, whole: number) => `${Math.round((100 * part) / whole)}%`;

// Where an entity stands among all of them: by benefit minus harm from both ends, and by size.
const byNet = [...realm.entities].sort((a, b) => a.benefit_total - a.harm_total - (b.benefit_total - b.harm_total));
const bySize = [...realm.entities].sort((a, b) => b.total_magnitude - a.total_magnitude);
const standing = (slug: string) => {
  const n = realm.entities.length;
  const worst = byNet.findIndex((e) => e.slug === slug) + 1;
  const size = bySize.findIndex((e) => e.slug === slug) + 1;
  const lines = [`It is No. ${size} of ${n} by its total influence, benefit and harm together.`];
  if (worst <= 50) lines.push(`By benefit minus harm it is No. ${worst} of the ${n} worst.`);
  else if (n + 1 - worst <= 50) lines.push(`By benefit minus harm it is No. ${n + 1 - worst} of the ${n} best.`);
  return lines;
};

/** The facts of the score, in plain words, and the article it was scored from. */
function brief(p: Profile) {
  const s = p.score;
  const first = Math.min(...p.periods.map((x) => x.start_year));
  const last = Math.max(...p.periods.map((x) => x.end_year));
  const during = p.periods.reduce((sum, x) => sum + x.magnitude, 0);
  const after = s.tail?.magnitude ?? 0;
  const side = s.harm_total >= s.benefit_total ? "harm" : "benefit";
  const areas = (which: "benefit" | "harm") =>
    Object.entries(s.profile.total[which])
      .filter(([, v]) => v > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${label.get(k)} ${pct(v, which === "harm" ? s.harm_total : s.benefit_total)}`)
      .join(", ");
  const consequences = p.links
    .filter((l) => l.direction === "outgoing" && l.strength > 0)
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 6)
    .map((l) => l.other.name);
  const causes = p.links
    .filter((l) => l.direction === "incoming" && l.strength > 0)
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 4)
    .map((l) => l.other.name);
  const facts = [
    `${p.entity.name}: ${p.entity.entity_type}, ${year(first)} to ${year(last)}. ${p.entity.description}`,
    ...standing(p.entity.slug),
    `It is mostly ${side}: ${pct(s[`${side}_total`], s.total_magnitude)} ${side}, ${pct(s.total_magnitude - s[`${side}_total`], s.total_magnitude)} ${side === "harm" ? "benefit" : "harm"}.`,
    `Its harm, by area: ${areas("harm") || "none"}.`,
    `Its benefit, by area: ${areas("benefit") || "none"}.`,
    `While it lasted: ${pct(during, s.total_magnitude)} of its weight. ` +
      (after > 0
        ? `After it ended, through the ${s.tail!.years} years to ${year(s.tail!.from_year + s.tail!.years - 1)}: ${pct(after, s.total_magnitude)}. `
        : "") +
      `Through what it caused: ${pct(s.credited_magnitude, s.total_magnitude)}.`,
    consequences.length ? `What it led to, the strongest first: ${consequences.join("; ")}.` : "It led to nothing scored here.",
    causes.length ? `What led to it: ${causes.join("; ")}.` : "",
    ...p.periods.map((x) => `Period "${x.label}", ${year(x.start_year)} to ${year(x.end_year)}: ${x.description}`),
  ].filter(Boolean);
  // Each article once, in the order of its periods.
  const seen = new Set<string>();
  const articles: string[] = [];
  for (const period of p.periods) {
    for (const a of period.assessments) {
      const key = a.sources?.[0] ?? a.evidence?.slice(0, 200) ?? "";
      if (!a.evidence || seen.has(key)) continue;
      seen.add(key);
      articles.push(a.evidence);
    }
  }
  return { facts, articles };
}

const SYSTEM = `You write the short account, on a history site, of why one entry was as harmful or as beneficial as it was, for curious readers of any age. You are given the facts of its score and the full encyclopedia article it was judged from. The score facts tell you what to explain; the article gives you what to say.

Write one paragraph of 100 to 140 words.
- Open with the single most striking concrete thing it did, in 25 words at most: an act, a loss, a number of people, something destroyed or made. The sentence must make sense on its own, so name who did it or what it was; never begin with "It" or "They". Do not open with the entry's name followed by "was", and never write "so harmful", "so beneficial" or "because".
- The score facts say whether it is mostly harm or mostly benefit. Write about that side: open with it and spend the paragraph on it. Give the other side one short sentence at most, and only if it is more than a fifth of the whole.
- Then show the damage (or the good) where the score facts put it first, through what happened to people: who was killed, enslaved, starved, uprooted, taxed, taught, healed, fed. Name the places and the people involved. Never name an area as a category, such as "human rights", "health", "economic" or "cultural".
- Then say what outlived it, in the article's own terms: the institutions, beliefs, populations, languages, borders or wealth it left behind. Where the score facts say most of its weight came after it ended, make that legacy the heart of the paragraph; where they say it came through what it caused, say how it brought about one or two of the things it led to. Never list names.
- Use only facts in the article or the score facts. Every number you write must appear in one of them.
- Write plainly and concretely, in the past tense for what happened. No hedging (perhaps, arguably, roughly, about, around, approximately, some say, it is believed). Never mention scores, weights, ranks, percentages of influence, the years since it ended as a count, the article, Wikipedia, sources or this site. Do not moralise.

Return only the paragraph.`;

const HEDGES = /\b(perhaps|arguably|roughly|approximately|about \d|around \d|some say|it is believed|possibly|likely|may have|might have)\b/i;
const MACHINERY =
  /\b(score[ds]?|scoring|weight|influence|ranks? (of|among)|wikipedia|article|index|magnitude|this site|so harmful|so beneficial|while it lasted|after it ended|through what it caused|years to 2026|led to nothing|human rights|economic (life|harm|damage)|cultural (losses|harm|damage))\b/i;

function check(text: string, facts: string[], articles: string[]) {
  const words = text.split(/\s+/).filter(Boolean).length;
  const firstSentence = text.split(/(?<=[.!?])\s+/)[0];
  const firstWords = firstSentence.split(/\s+/).filter(Boolean).length;
  const haystack = `${facts.join(" ")} ${articles.join(" ")}`.replace(/(\d),(\d)/g, "$1$2");
  const numbers = [...text.replace(/(\d),(\d)/g, "$1$2").matchAll(/\d+(\.\d+)?/g)].map((m) => m[0]);
  const unsourced = numbers.filter((n) => !new RegExp(`(^|[^0-9.])${n.replace(".", "\\.")}([^0-9]|$)`).test(haystack));
  const problems = [
    /^(It|They|This|These)\b/.test(firstSentence) ? `opens with "${firstSentence.split(" ")[0]}"` : "",
    words < 90 || words > 150 ? `${words} words` : "",
    firstWords > 25 ? `first sentence ${firstWords} words` : "",
    HEDGES.test(text) ? `hedge: "${text.match(HEDGES)![0]}"` : "",
    MACHINERY.test(text) ? `machinery: "${text.match(MACHINERY)![0]}"` : "",
    unsourced.length ? `unsourced numbers: ${unsourced.join(", ")}` : "",
  ].filter(Boolean);
  return { words, firstSentence, problems };
}

const textOf = (result: unknown): { text: string; input: number; output: number } => {
  const r = result as {
    response?: string;
    choices?: { message?: { content?: string }; finish_reason?: string }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };
  const text = (r.response ?? r.choices?.[0]?.message?.content ?? "").trim();
  if (!text) throw new Error(`No text in the model's answer (finish: ${r.choices?.[0]?.finish_reason}, ${JSON.stringify(r.usage)})`);
  return { text, input: r.usage?.prompt_tokens ?? 0, output: r.usage?.completion_tokens ?? 0 };
};

// A .jsonl output already holding some narratives is resumed: those entities are skipped.
const done = new Set(
  OUT?.endsWith(".jsonl") && existsSync(OUT)
    ? readFileSync(OUT, "utf8").split("\n").filter(Boolean).map((line) => (JSON.parse(line) as { slug: string }).slug)
    : [],
);
const slugs = (arg("only")?.split(",") ?? realm.entities.map((e) => e.slug)).filter((slug) => !done.has(slug));
const token = PAY ? readFileSync(process.env.CF_TOKEN_FILE ?? "", "utf8").trim() : "";
if (PAY && !token) throw new Error("Set CF_TOKEN_FILE to the file holding the Workers AI token");

const results: Record<string, unknown>[] = [];
let spent = 0;
let sentChars = 0;
const queue = [...slugs];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    for (let slug = queue.shift(); slug; slug = queue.shift()) {
      const profile = await getJson<Profile>(`${site.brand.origin}/api/entities/${slug}`);
      const { facts, articles } = brief(profile);
      const user = `SCORE FACTS\n${facts.join("\n")}\n\nARTICLE\n${articles.join("\n\n")}`;
      sentChars += SYSTEM.length + user.length;
      if (!PAY) {
        results.push({ slug, facts, chars: SYSTEM.length + user.length });
        continue;
      }
      let answer: ReturnType<typeof textOf> | null = null;
      let checked: ReturnType<typeof check> | null = null;
      // A narrative that fails its checks is asked for once more, with what was wrong.
      for (let attempt = 0; attempt < 2; attempt++) {
        const messages = [
          { role: "system", content: SYSTEM },
          { role: "user", content: user },
          ...(answer && checked ? [{ role: "assistant", content: answer.text }, { role: "user", content: `Rewrite it: ${checked.problems.join("; ")}.` }] : []),
        ];
        // Reasoning models think before they write: the budget covers both.
        answer = textOf(await runModel(token, MODEL, { messages, max_tokens: 16000, temperature: 0.4 }));
        spent += (answer.input * price.input + answer.output * price.output) / 1e6;
        checked = check(answer.text, facts, articles);
        if (checked.problems.length === 0) break;
      }
      const row = { slug, name: profile.entity.name, model: MODEL, narrative: answer!.text, ...checked!, facts };
      results.push(row);
      // A .jsonl output is written as each narrative arrives, so a long run keeps what it has paid for.
      if (OUT?.endsWith(".jsonl")) appendFileSync(OUT, `${JSON.stringify(row)}\n`);
      console.log(`${slug}: ${checked!.words} words${checked!.problems.length ? `, PROBLEMS: ${checked!.problems.join("; ")}` : ""}`);
    }
  }),
);

if (OUT && !OUT.endsWith(".jsonl")) writeFileSync(OUT, JSON.stringify(results, null, 2));
console.log(PAY ? `${results.length} narratives with ${MODEL}, $${spent.toFixed(4)}` : `${results.length} entities, ${sentChars.toLocaleString("en-US")} characters to send (dry run: pass --pay to write)`);
