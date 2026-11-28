/**
 * Write each entity's narrative: why it scored as it did, from the same evidence its periods were
 * scored from (the whole stored Wikipedia article) and the facts of its score (which areas carry
 * it, how much came while it lasted, after it ended and through what it caused, and what it led
 * to). One paragraph of 100 to 140 words. Its first sentence stands alone, for a film's card: why
 * the entity was as harmful or as beneficial as it was, in 12 words at most.
 *
 * Reads the site's public API, asks a Workers AI writing model, and checks every narrative: its
 * length, no hedging, no talk of scores or sources, and no number that is in neither the article nor
 * the facts. Nothing is spent without --pay: without it the tool prints what the run would send.
 *
 *   CF_TOKEN_FILE=… bun tools/entity-narrative.ts [--site history] [--only slug,slug] [--model @cf/…]
 *     [--out narratives.json|narratives.jsonl] [--concurrency 3] [--pay]   (.jsonl is written as it goes and resumed)
 *
 * Then store them through the site's MCP server (update_entity's biography, which the entity's page
 * shows as its narrative); a narrative that failed its checks is held back and listed:
 *
 *   MCP_API_KEY=… bun tools/entity-narrative.ts --write narratives.jsonl [--site history] [--mcp https://…/mcp]
 *
 * Narratives already written get a new first sentence, and keep the rest except what would repeat
 * it, from the facts and the narrative alone (no article is sent):
 *
 *   CF_TOKEN_FILE=… bun tools/entity-narrative.ts --lede narratives.jsonl --out ledes.jsonl [--only …] [--pay]
 */
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { siteFor } from "../src/sites";
import { mcpCall } from "./mcp";
import { firstSentenceOf } from "./narrative-text";
import { runModel } from "./workers-ai";

const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const site = siteFor(arg("site") ?? "history");
const MODEL = arg("model") ?? "@cf/deepseek-ai/deepseek-v4.1-flash-1017";
const PAY = process.argv.includes("--pay");
const OUT = arg("out");
const CONCURRENCY = Number(arg("concurrency") ?? 3);
const headers = { "User-Agent": site.brand.userAgent };

// ---- store narratives already written: --write <file.jsonl> ----
const WRITE = arg("write");
if (WRITE) {
  const key = process.env.MCP_API_KEY ?? "";
  if (!key) throw new Error("MCP_API_KEY is not set");
  const url = arg("mcp") ?? `${site.brand.origin}/mcp`;
  const rows = readFileSync(WRITE, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as { slug: string; narrative: string; problems: string[] });
  const held = rows.filter((r) => r.problems.length > 0);
  let stored = 0;
  for (const row of rows) {
    if (row.problems.length > 0) continue;
    await mcpCall(url, key, "update_entity", { slug: row.slug, biography: row.narrative });
    stored++;
  }
  console.log(`${stored} narratives stored through ${url}; ${held.length} held back`);
  for (const row of held) console.log(`  held: ${row.slug}: ${row.problems.join("; ")}`);
  process.exit(0);
}

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

/** What the first sentence must be: the line a film shows under the entity's name. */
const LEDE = `The first sentence stands alone: a film shows it by itself for a few seconds, under the entry's name, so it must say at a glance what made the entry as harmful or as beneficial as it was. Make it one plain sentence of at most 12 words, with a verb, as concrete as the account allows: who did what to whom, with a number of people, a place or a named act where the account has one. Where the score facts say most of its weight came after it ended, say what outlived it just as concretely: the people scattered, the language spoken, the faith imposed. Write it about the side the score facts say the entry is mostly on. Never use vague words such as devastated, brutalized, reshaped, impact, aftermath, harm, legacy, lasted or endured. Do not begin it with the entry's name, which the film shows just above, or with "It", "They", "This" or "These". Use no colon, semicolon, dash, brackets or abbreviation in it, and at most one number or range; never count the years since it ended.`;

const SYSTEM = `You write the short account, on a history site, of why one entry was as harmful or as beneficial as it was, for curious readers of any age. You are given the facts of its score and the full encyclopedia article it was judged from. The score facts tell you what to explain; the article gives you what to say.

Write one paragraph of 100 to 140 words.
- ${LEDE} Never write "so harmful", "so beneficial" or "because".
- The score facts say whether it is mostly harm or mostly benefit. Write about that side: open with it and spend the paragraph on it. Give the other side one short sentence at most, and only if it is more than a fifth of the whole.
- Then show the damage (or the good) where the score facts put it first, through what happened to people: who was killed, enslaved, starved, uprooted, taxed, taught, healed, fed. Name the places and the people involved. Never name an area as a category, such as "human rights", "health", "economic" or "cultural".
- Then say what outlived it, in the article's own terms: the institutions, beliefs, populations, languages, borders or wealth it left behind. Where the score facts say most of its weight came after it ended, make that legacy the heart of the paragraph; where they say it came through what it caused, say how it brought about one or two of the things it led to. Never list names.
- Use only facts in the article or the score facts. Every number you write must appear in one of them.
- Write plainly and concretely, in the past tense for what happened. Never use the word "machinery". No hedging (perhaps, arguably, roughly, about, around, approximately, some say, it is believed). Never mention scores, weights, ranks, percentages of influence, the years since it ended as a count, the article, Wikipedia, sources or this site. Do not moralise.

Return only the paragraph.`;

const HEDGES = /\b(perhaps|arguably|roughly|approximately|about \d|around \d|some say|it is believed|possibly|likely|may have|might have)\b/i;
// Talk of the score or its sources. Lowercase only, so proper names pass (the Universal Declaration of
// Human Rights, NATO's Article 5, the Index of Prohibited Books); a word the entity's own description
// or periods use (Wikipedia, for its founders) is its subject, not machinery.
const MACHINERY =
  /\b(score[ds]?|scoring|weights?|ranks? (of|among)|wikipedia|articles?|index|magnitude|machinery|this site|so harmful|so beneficial|while it lasted|after it ended|through what it caused|years to 2026|led to nothing|human rights|economic (life|harm|damage)|cultural (losses|harm|damage))\b/;

/** The first machinery word in the text that the entity's own description and periods do not use. */
function machinery(text: string, facts: string[]) {
  const own = [facts[0], ...facts.filter((f) => f.startsWith("Period "))].join(" ").toLowerCase();
  for (const m of text.matchAll(new RegExp(MACHINERY.source, "g"))) if (!own.includes(m[0].toLowerCase())) return m[0];
  return null;
}

/** What is wrong with a first sentence, as the film's card shows it. */
function ledeProblems(first: string, name: string) {
  const words = first.split(/\s+/).filter(Boolean).length;
  const lower = first.toLowerCase();
  const own = name.toLowerCase();
  const numbers = first.match(/\d+([.,]\d+)*/g) ?? [];
  return [
    /^(It|They|This|These)\b/.test(first) ? `opens with "${first.split(" ")[0]}"` : "",
    lower.startsWith(own) || lower.startsWith(`the ${own}`) ? "opens with the entry's name" : "",
    words > 12 || words < 4 ? `first sentence ${words} words` : "",
    /[:;()\u2013\u2014]/.test(first) ? "a colon, semicolon, dash or bracket in the first sentence" : "",
    /(\b[A-Za-z]{1,2}|\b([A-Z]\.)+)\.$/.test(first) ? `the first sentence ends on an abbreviation: "${first.slice(-12)}"` : "",
    numbers.length > 2 ? `${numbers.length} numbers in the first sentence` : "",
    /\b(so harmful|so beneficial|because)\b/i.test(first) ? `"${first.match(/\b(so harmful|so beneficial|because)\b/i)![0]}" in the first sentence` : "",
    VAGUE.test(first) ? `vague: "${first.match(VAGUE)![0]}"` : "",
  ].filter(Boolean);
}

/** Words that tell the reader nothing they can see: the first sentence names the act instead. */
const VAGUE = /\b(devastat\w*|brutali[sz]\w*|reshap\w*|impact\w*|aftermath|harm\w*|legacy|lasted|outlasted|lasting|endur\w*)\b/i;


function check(text: string, facts: string[], sources: string[], name: string, most = 150) {
  const words = text.split(/\s+/).filter(Boolean).length;
  const firstSentence = firstSentenceOf(text);
  const haystack = `${facts.join(" ")} ${sources.join(" ")}`.replace(/(\d),(\d)/g, "$1$2");
  const numbers = [...text.replace(/(\d),(\d)/g, "$1$2").matchAll(/\d+(\.\d+)?/g)].map((m) => m[0]);
  // The score's own count of the years from its end to now, which the text must not repeat.
  const tailYears = facts.join(" ").match(/through the (\d+) years to/)?.[1];
  const unsourced = numbers.filter((n) => !new RegExp(`(^|[^0-9.])${n.replace(".", "\\.")}([^0-9]|$)`).test(haystack));
  const problems = [
    ...ledeProblems(firstSentence, name),
    words < 90 || words > most ? `${words} words` : "",
    HEDGES.test(text) ? `hedge: "${text.match(HEDGES)![0]}"` : "",
    machinery(text, facts) ? `machinery: "${machinery(text, facts)}"` : "",
    unsourced.length ? `unsourced numbers: ${unsourced.join(", ")}` : "",
    tailYears && numbers.includes(tailYears) ? `the years since it ended as a count: ${tailYears}` : "",
  ].filter(Boolean);
  return { words, firstSentence, problems };
}

/** The answer's text, empty when the model spent its whole budget thinking. */
const textOf = (result: unknown): { text: string; finish: string; input: number; output: number } => {
  const r = result as {
    response?: string;
    choices?: { message?: { content?: string }; finish_reason?: string }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };
  const text = (r.response ?? r.choices?.[0]?.message?.content ?? "").trim();
  const finish = r.choices?.[0]?.finish_reason ?? "unknown";
  return { text, finish, input: r.usage?.prompt_tokens ?? 0, output: r.usage?.completion_tokens ?? 0 };
};

const LEDE_SYSTEM = `You edit the short account, on a history site, of why one entry was as harmful or as beneficial as it was. You are given the facts of its score and the account as it stands.

Give the account a new first sentence. ${LEDE} Every number in it must appear in the account or the score facts. Never write "so harmful", "so beneficial" or "because", and never mention scores, ranks, percentages, the article, sources or this site.

Then give the rest of the account as it stands, changed only where a sentence would repeat the new first sentence. Keep every other sentence word for word.

Return only the paragraph, starting with the new first sentence.`;

// --lede <narratives.jsonl>: narratives already written, with their facts, to give a new first sentence.
const LEDE_FROM = arg("lede");
const before = new Map(
  LEDE_FROM
    ? readFileSync(LEDE_FROM, "utf8")
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const row = JSON.parse(line) as { slug: string; name: string; narrative: string; facts: string[] };
          return [row.slug, row] as const;
        })
    : [],
);

// A .jsonl output already holding some narratives is resumed: those entities are skipped.
const done = new Set(
  OUT?.endsWith(".jsonl") && existsSync(OUT)
    ? readFileSync(OUT, "utf8").split("\n").filter(Boolean).map((line) => (JSON.parse(line) as { slug: string }).slug)
    : [],
);
const everyone = LEDE_FROM ? [...before.keys()] : realm.entities.map((e) => e.slug);
const slugs = (arg("only")?.split(",") ?? everyone).filter((slug) => !done.has(slug));
const token = PAY ? readFileSync(process.env.CF_TOKEN_FILE ?? "", "utf8").trim() : "";
if (PAY && !token) throw new Error("Set CF_TOKEN_FILE to the file holding the Workers AI token");

let spent = 0;

/**
 * Ask for one narrative; one that fails its checks is asked for once more, with what was wrong, and
 * an empty answer is asked for afresh. A narrative still failing comes back with its problems.
 */
async function write(system: string, user: string, facts: string[], sources: string[], name: string, most: number) {
  let answer: ReturnType<typeof textOf> | null = null;
  let checked: ReturnType<typeof check> | null = null;
  let empty = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    const messages = [
      { role: "system", content: system },
      { role: "user", content: user },
      ...(answer && checked ? [{ role: "assistant", content: answer.text }, { role: "user", content: `Rewrite it: ${checked.problems.join("; ")}.` }] : []),
    ];
    // Reasoning models think before they write: the budget covers both.
    const got = textOf(await runModel(token, MODEL, { messages, max_tokens: 16000, temperature: 0.4 }));
    spent += (got.input * price.input + got.output * price.output) / 1e6;
    if (!got.text) {
      empty = `the model gave no text (finish: ${got.finish}, ${got.output} tokens)`;
      continue;
    }
    answer = got;
    checked = check(answer.text, facts, sources, name, most);
    if (checked.problems.length === 0) break;
  }
  if (!answer || !checked) return { narrative: "", words: 0, firstSentence: "", problems: [empty] };
  return { narrative: answer.text, ...checked };
}

const results: Record<string, unknown>[] = [];
let sentChars = 0;
const queue = [...slugs];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    for (let slug = queue.shift(); slug; slug = queue.shift()) {
      let ask: { system: string; user: string; facts: string[]; sources: string[]; name: string; most: number };
      if (LEDE_FROM) {
        const row = before.get(slug);
        if (!row) throw new Error(`${slug} is not in ${LEDE_FROM}`);
        const user = `SCORE FACTS\n${row.facts.join("\n")}\n\nTHE ACCOUNT AS IT STANDS\n${row.narrative}`;
        // The new sentence's numbers come from the facts or the narrative, whose own were checked
        // against the article when it was written.
        ask = { system: LEDE_SYSTEM, user, facts: row.facts, sources: [row.narrative], name: row.name, most: 160 };
      } else {
        const profile = await getJson<Profile>(`${site.brand.origin}/api/entities/${slug}`);
        const { facts, articles } = brief(profile);
        const user = `SCORE FACTS\n${facts.join("\n")}\n\nARTICLE\n${articles.join("\n\n")}`;
        ask = { system: SYSTEM, user, facts, sources: articles, name: profile.entity.name, most: 150 };
      }
      sentChars += ask.system.length + ask.user.length;
      if (!PAY) {
        results.push({ slug, chars: ask.system.length + ask.user.length });
        continue;
      }
      const written = await write(ask.system, ask.user, ask.facts, ask.sources, ask.name, ask.most);
      const row = { slug, name: ask.name, model: MODEL, ...written, facts: ask.facts };
      results.push(row);
      // A .jsonl output is written as each narrative arrives, so a long run keeps what it has paid for.
      if (OUT?.endsWith(".jsonl")) appendFileSync(OUT, `${JSON.stringify(row)}\n`);
      console.log(`${slug}: ${written.words} words${written.problems.length ? `, PROBLEMS: ${written.problems.join("; ")}` : ""}`);
    }
  }),
);

if (OUT && !OUT.endsWith(".jsonl")) writeFileSync(OUT, JSON.stringify(results, null, 2));
console.log(PAY ? `${results.length} narratives with ${MODEL}, $${spent.toFixed(4)}` : `${results.length} entities, ${sentChars.toLocaleString("en-US")} characters to send (dry run: pass --pay to write)`);
