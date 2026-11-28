// The river of influence, shared by every film in this project: the home page's stacking, its
// logarithmic time axis and square-root height, drawn from timeline time alone.
// Each film's clock and frame are in FILMS; SPEC.md describes them shot by shot.
(() => {
  const SVG_NS = "http://www.w3.org/2000/svg";

  // A frame's verticals and type sizes, in px. The 16:9 films share these; each film adds its x0
  // and x1 (the river's ends) and textRight (the furthest right a callout may reach).
  const LANDSCAPE = {
    mid: 530, // the axis
    half: 285, // the river's half-height
    ruleTop: 235, // the front's ends, and the grid lines'
    ruleBottom: 825,
    tickY: 862, // tick labels' baseline
    tickGap: 150, // the least distance between two ticks
    nameY: 178, // a callout's name baseline, its meta line's, and the top of its leader
    metaY: 218,
    leaderTop: 236,
    type: { name: 44, meta: 28, tick: 28, era: 40 },
  };

  const FILMS = {
    // The 60-second cut: index.html.
    short: {
      duration: 60,
      axisIn: 0.15,
      axisDur: 2.2,
      sweep0: 4.2,
      sweep1: 46.2,
      calloutGap: 2.55,
      calloutHold: 2.25,
      lastCallout: 44.0,
      ranksAt: [46.5, 48.3, 50.1],
      rankHold: 1.5,
      dimAt: 52.0,
      frame: { ...LANDSCAPE, x0: 96, x1: 1824, textRight: 1728 },
    },
    // The race, 4:29: race/index.html, with the leaderboard to the right of the river.
    race: {
      duration: 269,
      axisIn: 0.15,
      axisDur: 2.2,
      sweep0: 4.2,
      sweep1: 258.8,
      // Calm pacing, for casual viewing: one thing to read at a time. A name lands every 3 to 4 s,
      // but waits while a leader's card or an era's name is being read.
      pacing: "calm",
      calloutGap: 3.0,
      calloutWindow: 1.0,
      calloutHold: 2.6,
      lastCallout: 254.6,
      // A faint column for every other era, a brighter one for the era at the front, and the era's
      // name above the river as the front enters it. The bands are shaded by entity type.
      eras: true,
      typeShades: true,
      // The board shows the top ten. The film ends on the 2026 board: the front reaches 2026 at
      // sweep1, the board holds there 2.2 s (its last change is at 258.4 s; a longer hold is a dead
      // stretch), and at boardEnd it leaves as the river dims for the end card. The all-time countdown is a segment of its own (Geordie, 2026-11-18).
      boardSlots: 10,
      // A leader gets a card when it holds the lead 5 s or more.
      leadHold: 5,
      // A card stays until the next one lands, so the lower third is never empty after the first;
      // where the next is this far off, the biggest arrival in the top three gets a card of its own
      // once the one before has had its time (Geordie, 2026-11-21).
      fillGap: 14,
      boardEnd: 261.0,
      dimAt: 261.0,
      frame: { ...LANDSCAPE, x0: 96, x1: 1250, textRight: 1250 },
      // The camera: the view widens with the front, which holds 80% of the way across, so the river
      // fills the frame from the first minute; it never shows less than a fifth of the axis.
      zoom: { lead: 0.8, minView: 0.2 },
    },
  };

  // The 60-second cut recomposed at 1080 x 1920 for YouTube Shorts: short-vertical/. The same
  // clock and callouts. Every word sits between y 168 and 1330, clear of the app's bars, so the
  // words stack at the top (the year and source, the year labels as a ruler, the callout) and the
  // river runs the width below them, its harm reaching down under the app's title and buttons,
  // where only the picture goes. Type is 1.35 times the landscape sizes.
  FILMS.shortVertical = {
    ...FILMS.short,
    frame: {
      x0: 72,
      x1: 1008,
      textRight: 1008,
      tickY: 462,
      tickGap: 130,
      gridTop: 478, // the grid lines hang from the ruler, through the callout, to the river
      nameY: 556,
      metaY: 610,
      leaderTop: 634,
      ruleTop: 650,
      mid: 1090,
      half: 420,
      ruleBottom: 1530,
      type: { name: 60, meta: 38, tick: 38, era: 54 },
    },
  };

  // The vertical Short as a loop (Geordie, 2026-11-18): a Short replays as soon as it ends, so its
  // first frame is the hook and its last frame runs straight back into the first. The finished
  // river opens under the title (hook.until), drains back to its source (hook.drain), refills from
  // 3500 BCE over the sweep, and the title returns over the finished river from hook.outro, so the
  // last frame is drawn as the first. No title card, no end card, no all-time finale.
  FILMS.shortLoop = {
    ...FILMS.shortVertical,
    duration: 110,
    axisIn: 0,
    axisDur: 0.01,
    sweep0: 5.6,
    sweep1: 104.0,
    calloutGap: 3.4,
    calloutHold: 2.4,
    lastCallout: 100.5,
    ranksAt: [],
    dimAt: Infinity,
    hook: { until: 5.0, drain: 0.6, outro: 106.5 },
  };

  // The countdown (Geordie, 2026-11-28): No. 10 to No. 1 of one ranking on the finished river, a
  // vertical Short that loops: countdown/. The river is drawn finished from frame 0 and dark; each
  // card's band lights as its number lands on a beat of the score (bpm, in 4/4), and stays at half
  // strength once counted. Each card holds for its words plus cardPad, rounded up to whole beats,
  // from bar hookBars + 1; the outro takes the time left after No. 1. The hook and the outro show
  // all ten lit under the title, so the last frame is the first.
  FILMS.countdown = {
    duration: (34 * 240) / 90, // 34 bars at 90 bpm, 90.667 s: the ten cards' one-line why (2026-11-28)
    ranking: "worst",
    slots: 10,
    bpm: 90,
    hookBars: 2,
    outroBars: 2, // at least
    cardPad: 1.0,
    finished: true,
    axisIn: 0,
    axisDur: 0.01,
    sweep0: 0,
    sweep1: 1,
    lastCallout: -1,
    ranksAt: [],
    dimAt: Infinity,
    // The river at dim. A band rises to full strength over `on` as its card lands and falls to
    // `counted` as the next lands. In the hook all ten are lit and go dark from `dark` over
    // `darkDur`; in the outro they rise again over `rise`.
    light: { dim: 0.12, counted: 0.4, on: 0.45, dark: 4.9, darkDur: 0.4, rise: 0.6 },
    frame: {
      x0: 72,
      x1: 1008,
      textRight: 1008,
      tickY: 900,
      tickGap: 130,
      gridTop: 916,
      nameY: 556,
      metaY: 610,
      leaderTop: 634,
      ruleTop: 916,
      mid: 1250,
      half: 316,
      ruleBottom: 1574,
      type: { name: 60, meta: 38, tick: 38, era: 54 },
    },
  };

  // The countdowns' rankings. Each orders the entities, names the side its share is of, and gives
  // the hook's title and method line.
  const netOf = (e) => e.benefit_total - e.harm_total;
  const shareOf = (e, side) => (side === "harm" ? e.harm_total : e.benefit_total) / e.total_magnitude;
  const byName = (a, b) => a.name.localeCompare(b.name);
  const RANKINGS = {
    total: {
      side: "harm",
      title: ["The 10 biggest", "influences in", "history"],
      method: "Ranked by benefit plus harm",
      order: (es) => [...es].sort((a, b) => b.total_magnitude - a.total_magnitude || byName(a, b)),
    },
    best: {
      side: "benefit",
      title: ["The 10 best", "things in", "history"],
      method: "Ranked by benefit minus harm",
      order: (es) => [...es].sort((a, b) => netOf(b) - netOf(a) || byName(a, b)),
    },
    worst: {
      side: "harm",
      title: ["The 10 worst", "things in", "history"],
      method: "Ranked by benefit minus harm",
      order: (es) => [...es].sort((a, b) => netOf(a) - netOf(b) || byName(a, b)),
    },
    pureGood: {
      side: "benefit",
      title: ["The 10 purest", "good things in", "history"],
      method: "Under 2% harm, ranked by size",
      order: (es) => es.filter((e) => shareOf(e, "harm") < 0.02).sort((a, b) => b.total_magnitude - a.total_magnitude || byName(a, b)),
    },
    pureEvil: {
      side: "harm",
      title: ["The 10 purest", "evils in", "history"],
      method: "Under 2% benefit, ranked by size",
      order: (es) => es.filter((e) => shareOf(e, "benefit") < 0.02).sort((a, b) => b.total_magnitude - a.total_magnitude || byName(a, b)),
    },
  };

  // Eras for the race's panel and its YouTube chapters, by the year they begin.
  const ERAS = [
    { year: -3500, name: "The First Cities" },
    { year: -1200, name: "The Iron Age" },
    { year: -500, name: "The Classical World" },
    { year: 500, name: "The Middle Ages" },
    { year: 1450, name: "The Early Modern World" },
    { year: 1760, name: "The Industrial Age" },
    { year: 1914, name: "The World Wars" },
    { year: 1947, name: "The Cold War" },
    { year: 1991, name: "The Digital Age" },
  ];

  const SWELL = 0.05; // each bucket rises over 5% of the axis behind the front
  const FLOOR_SHARE = 0.025; // the vertical scale never drops below 2.5% of the final maximum

  // ---- easing, all functions of time alone ----
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const ease = {
    expoOut: (p) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p)),
    inOut2: (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
    in2: (p) => p * p,
    smooth: (p) => p * p * (3 - 2 * p),
  };
  const ramp = (t, t0, dur, fn) => fn(clamp01((t - t0) / dur));

  // ---- the site's time axis (src/lib/timeline.ts) ----
  function axis(realm) {
    const timeline = realm.timeline;
    const asOf = realm.as_of_year;
    const end = asOf + 1;
    const far = Math.log(end - timeline.start + timeline.near);
    const near = Math.log(timeline.near);
    const formatYear = (year) => {
      const y = Math.round(year);
      if (y <= 0) return `${y === 0 ? 1 : -y} BCE`;
      return y < 1000 ? `${y} CE` : `${y}`;
    };
    return {
      buckets: timeline.buckets,
      asOf,
      yearToUnit: (year) => (far - Math.log(Math.max(end - year, 0) + timeline.near)) / (far - near),
      unitToYear: (unit) => end + timeline.near - Math.exp(far - unit * (far - near)),
      bucketUnit: (i) => (i + 0.5) / timeline.buckets,
      formatYear,
      formatSpan: (start, stop) => {
        if (stop >= asOf) return `since ${formatYear(start)}`;
        if (start === stop) return formatYear(start);
        if (start > 0 && stop < 1000) return `${start}–${stop} CE`;
        if (stop <= 0) return `${start === 0 ? 1 : -start}–${-stop} BCE`;
        return `${formatYear(start)}–${formatYear(stop)}`;
      },
    };
  }

  // The front's position on the axis at time t, and the time it reaches unit u.
  function clock(film) {
    const span = film.sweep1 - film.sweep0;
    return {
      frontAt: (t) => clamp01((t - film.sweep0) / span) * (1 + SWELL),
      timeAtFront: (u) => film.sweep0 + (u / (1 + SWELL)) * span,
    };
  }

  // How much of the axis the frame shows when the front is at f: all of it unless the film has a
  // camera. Smooth corners, so the front never jolts between moving and holding.
  const smoothMax = (a, b, k) => (a + b + Math.sqrt((a - b) * (a - b) + k * k)) / 2;
  const smoothMin = (a, b, k) => (a + b - Math.sqrt((a - b) * (a - b) + k * k)) / 2;
  function view(film, f) {
    if (!film.zoom) return 1;
    return smoothMin(smoothMax(film.zoom.minView, f / film.zoom.lead, 0.04), 1, 0.04);
  }

  // The year the front stands at, as the counter shows it.
  function yearAt(ax, f) {
    return Math.min(ax.asOf, ax.unitToYear(Math.min(1, f)));
  }

  // ---- the race's leaderboard: every entity's own level in the year at the front, ranked ----
  const BOARD_SLOTS = 5;
  function board(realm, film) {
    const slots = film.boardSlots ?? BOARD_SLOTS;
    const ax = axis(realm);
    const { frontAt } = clock(film);
    const N = ax.buckets;
    const entities = realm.entities.filter((e) => e.curve.benefit.length > 0);
    // Benefit and harm at fractional bucket p, linear between buckets.
    const levelAt = (e, p) => {
      const at = (i) => {
        const k = i - e.curve.from;
        return k >= 0 && k < e.curve.benefit.length ? [e.curve.benefit[k], e.curve.harm[k] ?? 0] : [0, 0];
      };
      const i0 = Math.floor(p);
      const w = p - i0;
      const a = at(i0);
      const b = at(i0 + 1);
      return [a[0] * (1 - w) + b[0] * w, a[1] * (1 - w) + b[1] * w];
    };
    const bucketAt = (t) => Math.min(N - 1, Math.max(0, Math.min(1, frontAt(t)) * N - 0.5));
    // The top six at time t: the five on the board and the one about to join it.
    const standings = (t) => {
      const p = bucketAt(t);
      const rows = [];
      for (const e of entities) {
        const [b, h] = levelAt(e, p);
        if (b + h > 0.05) rows.push({ e, b, h, total: b + h });
      }
      rows.sort((x, y) => y.total - x.total || x.e.name.localeCompare(y.e.name));
      return rows.slice(0, slots + 1);
    };
    // The first time each entity leads, when it keeps the lead at least `hold` seconds.
    const firstLeads = (hold = film.leadHold ?? 3, step = 0.1) => {
      const runs = [];
      for (let k = 0; film.sweep0 + k * step <= film.sweep1; k++) {
        const t = film.sweep0 + k * step;
        const lead = standings(t)[0]?.e;
        if (!lead) continue;
        const last = runs[runs.length - 1];
        if (last && last.e === lead) last.until = t;
        else runs.push({ e: lead, at: t, until: t });
      }
      const seen = new Set();
      const leads = [];
      for (const r of runs) {
        if (r.until - r.at < hold || seen.has(r.e.slug)) continue;
        seen.add(r.e.slug);
        leads.push({ e: r.e, at: r.at });
      }
      return leads;
    };
    // Every entity that is ever in the top six, so its row can be built before the first frame.
    const contenders = (step = 0.05) => {
      const slugs = new Set();
      for (let k = 0; film.sweep0 + k * step <= film.sweep1 + step; k++) {
        for (const r of standings(film.sweep0 + k * step)) slugs.add(r.e.slug);
      }
      return slugs;
    };
    return { slots, levelAt, bucketAt, standings, firstLeads, contenders };
  }


  // ---- reading: a text holds 0.5 s plus 0.3 s a word, near the BBC's subtitle pace ----
  const wordsIn = (text) => (text ?? "").split(/\s+/).filter((w) => w && w !== "·").length;
  const readTime = (n) => 0.5 + 0.3 * n;

  // ---- the race's reading plan: what lands to be read, one thing at a time ----
  // Era names: each era after the first (the intro is on screen then) is named above the river from
  // 0.2 s after the front enters it, holding for its words; a name may wait up to 3 s for the
  // reading before it to end, and otherwise the era is named in the panel only.
  // Leader cards: one the first time each entity leads the board. Each waits until what came before
  // has been read, plus a rest (1 s after a card, 0.5 s after an era's name), and must land while
  // its entity still leads. A card waits up to 3.5 s for an era's name that it would otherwise push
  // out. It holds for its words plus 1.5 s (at least 5 s, at most 12 s), leaving 0.4 s before the next.
  const ERA_WAIT = 3.0;
  const CARD_WAIT = 3.5;
  function readingPlan(realm, film) {
    const ax = axis(realm);
    const { timeAtFront } = clock(film);
    const eraLabels = !film.eras
      ? []
      : ERAS.map((era, i) => {
          const next = ERAS[i + 1];
          const name = era.name;
          const meta = `${ax.formatYear(era.year)} to ${next ? ax.formatYear(next.year) : "today"}`;
          const earliest = timeAtFront(ax.yearToUnit(era.year)) + 0.2;
          const read = readTime(wordsIn(name) + wordsIn(meta));
          return { i, name, meta, earliest, read, hold: Math.max(film.calloutHold, read), shown: i > 0 };
        });
    const leads = board(realm, film).firstLeads();
    const pending = leads.map((lead, i) => {
      const e = lead.e;
      const reasons = realm.media[e.slug]?.reason;
      if (!reasons) throw new Error(`The snapshot has no reason for leader ${e.slug}: run bun tools/video-snapshot.ts`);
      const read = readTime(wordsIn(e.name) + reasons.reduce((n, r) => n + wordsIn(r.text), 0) + wordsIn(e.description));
      const leadEnd = i + 1 < leads.length ? leads[i + 1].at : film.boardEnd;
      return { slug: e.slug, title: e.name, reasons, body: e.description || null, earliest: lead.at + 0.6, read, leadEnd };
    });
    const labels = eraLabels.filter((l) => l.shown);
    const cards = [];
    let free = -Infinity;
    let ci = 0;
    let li = 0;
    while (ci < pending.length || li < labels.length) {
      const card = pending[ci];
      const label = labels[li];
      const cardAt = card ? Math.max(card.earliest, free) : Infinity;
      const labelAt = label ? Math.max(label.earliest, free) : Infinity;
      let labelFirst = Boolean(label) && labelAt <= cardAt;
      if (label && card && !labelFirst) {
        // The card goes first unless that pushes the era's name out and the card can wait for it.
        const labelAfter = Math.max(label.earliest, cardAt + card.read + 1.0);
        const cardAfter = labelAt + label.read + 0.5;
        labelFirst = labelAfter > label.earliest + ERA_WAIT && cardAfter - cardAt <= CARD_WAIT && cardAfter < card.leadEnd;
      }
      if (labelFirst) {
        li++;
        if (labelAt > label.earliest + ERA_WAIT) {
          label.shown = false;
          continue;
        }
        label.at = labelAt;
        label.readEnd = labelAt + label.read;
        free = label.readEnd + 0.5;
        continue;
      }
      ci++;
      if (cardAt >= card.leadEnd) throw new Error(`${card.slug}'s card would land after it lost the lead (${cardAt.toFixed(1)} s)`);
      cards.push({ slug: card.slug, title: card.title, reasons: card.reasons, body: card.body, at: cardAt, readEnd: cardAt + card.read });
      free = cardAt + card.read + 1.0;
    }
    // A card's own time: its words plus 1.5 s, at least 5 s, at most 12 s. With film.fillGap a card
    // stays until the next lands (0.4 s before it), so the lower third is never empty after the first.
    const ownTime = (card) => Math.min(12, Math.max(card.readEnd - card.at + 1.5, 5));
    const holdUntil = (sorted) =>
      sorted.map((card, i) => {
        const next = i + 1 < sorted.length ? sorted[i + 1].at : film.boardEnd;
        return film.fillGap ? next - 0.4 : Math.min(card.at + ownTime(card), next - 0.4);
      });
    // Gap cards: where the next card lands film.fillGap seconds or more after the one before, a card
    // for the biggest arrival in the top three then (its best place there, then its total influence),
    // one not carded yet: its name and the site's description, read at the same pace. It lands once
    // the card before has had its own time (or 0.6 s after the arrival), while the entity is still in
    // the top three, never while a card or an era's name is being read, and is read 1 s before the next.
    if (film.fillGap) {
      const standingsOf = board(realm, film).standings;
      const STEP = 0.1;
      const stays = [];
      const open = new Map();
      for (let k = 0; film.sweep0 + k * STEP <= film.sweep1; k++) {
        const t = film.sweep0 + k * STEP;
        const top = standingsOf(t).slice(0, 3);
        const now = new Set(top.map((r) => r.e.slug));
        top.forEach((r, i) => {
          const s = open.get(r.e.slug);
          if (s) {
            s.until = t;
            s.best = Math.min(s.best, i + 1);
          } else open.set(r.e.slug, { e: r.e, at: t, until: t, best: i + 1 });
        });
        for (const [slug, s] of open) {
          if (!now.has(slug)) {
            stays.push(s);
            open.delete(slug);
          }
        }
      }
      stays.push(...open.values());
      stays.sort((a, b) => a.best - b.best || b.e.total_magnitude - a.e.total_magnitude || a.at - b.at);
      const read = labels.filter((l) => l.shown && l.at !== undefined);
      const busy = (a, z) =>
        cards.some((c) => a < c.readEnd + 1.0 && c.at < z + 1.0) || read.some((l) => a < l.readEnd + 0.5 && l.at < z + 1.0);
      for (;;) {
        const sorted = [...cards].sort((x, y) => x.at - y.at);
        const gaps = sorted.map((c, i) => [c.at + ownTime(c), i + 1 < sorted.length ? sorted[i + 1].at : film.boardEnd, c.at]);
        const carded = new Set(cards.map((c) => c.slug));
        let added = null;
        for (const [g0, g1, landed] of gaps) {
          if (g1 - landed < film.fillGap) continue;
          for (const s of stays) {
            if (carded.has(s.e.slug) || s.until <= g0 || s.at >= g1) continue;
            const e = s.e;
            const length = readTime(wordsIn(e.name) + wordsIn(e.description));
            let at = Math.max(g0, s.at + 0.6);
            while (busy(at, at + length) && at < s.until) at += STEP;
            if (at >= s.until || at + length + 1.0 > g1 || busy(at, at + length)) continue;
            added = { slug: e.slug, title: e.name, reasons: [], body: e.description || null, at, readEnd: at + length, arrival: true };
            break;
          }
          if (added) break;
        }
        if (!added) break;
        cards.push(added);
      }
      cards.sort((x, y) => x.at - y.at);
    }
    holdUntil(cards).forEach((until, i) => {
      const card = cards[i];
      card.until = until;
      if (card.until < card.readEnd) throw new Error(`The card for ${card.slug} leaves before its words are read`);
    });
    return { cards, eraLabels };
  }

  // ---- the countdown's plan: the ranking's top entries, No. 10 first, each on a beat ----
  // An entry's words are its rank, name, meta line and why: the first sentence of its narrative,
  // from the snapshot's media. It holds for them plus
  // film.cardPad, rounded up to whole beats. Each entry is lit from `at` until the next lands
  // (`until`); No. 1's until is the outro. `beat` counts from 0 at the film's start, and `bar` and
  // `beatInBar` (both from 1) place it in the score.
  function countdownPlan(realm, film) {
    const ranking = RANKINGS[film.ranking];
    if (!ranking) throw new Error(`No ranking "${film.ranking}": ${Object.keys(RANKINGS).join(", ")}`);
    const ax = axis(realm);
    const bar = 240 / film.bpm;
    const drawn = realm.entities.filter((e) => e.curve.benefit.length > 0);
    const list = ranking.order(drawn).slice(0, film.slots);
    if (list.length < film.slots) throw new Error(`${film.ranking} has ${list.length} entries; the countdown needs ${film.slots}`);
    const entries = list.map((e, i) => {
      const kind = e.entity_type.charAt(0).toUpperCase() + e.entity_type.slice(1);
      const span = e.first_year === null ? null : ax.formatSpan(e.first_year, e.last_year ?? e.first_year);
      const share = `${Math.round(100 * shareOf(e, ranking.side))}% ${ranking.side}`;
      const kindSpan = span ? `${kind} · ${span}` : kind;
      const why = realm.media?.[e.slug]?.why;
      if (!why) throw new Error(`${e.name} has no narrative to say why: write it with tools/entity-narrative.ts, then refresh the snapshot`);
      const words = 1 + wordsIn(e.name) + wordsIn(kindSpan) + wordsIn(share) + wordsIn(why);
      return { rank: i + 1, e, slug: e.slug, name: e.name, kindSpan, share, body: why, read: readTime(words) };
    });
    const beat = bar / 4;
    const place = (b) => ({ beat: b, bar: Math.floor(b / 4) + 1, beatInBar: (b % 4) + 1, at: b * beat });
    let b = film.hookBars * 4;
    for (const entry of [...entries].reverse()) {
      entry.beats = Math.ceil((entry.read + film.cardPad) / beat - 1e-9);
      Object.assign(entry, place(b));
      b += entry.beats;
    }
    const outro = place(b);
    const loopBeat = Math.round(film.duration / beat);
    if (Math.abs(loopBeat * beat - film.duration) > 1e-6 || loopBeat % 4 !== 0) {
      throw new Error(`${film.duration} s is not a whole number of bars at ${film.bpm} bpm`);
    }
    if (loopBeat - outro.beat < film.outroBars * 4) {
      throw new Error(`The cards end on beat ${outro.beat}; the outro needs ${film.outroBars} bars before the loop at beat ${loopBeat}`);
    }
    for (const entry of entries) entry.until = entry.rank === 1 ? outro.at : entries[entry.rank - 2].at;
    return { ranking, entries, bar, beat, outro, outroAt: outro.at, loopBeat };
  }

  /**
   * Draw the river into `svg` for `film`. Call after document.fonts.ready, so text is measured in
   * the face it renders in. Returns draw(t), a pure function of timeline time. `yearEl`, when
   * given, shows the year at the front.
   */
  function mount({ svg, realm, film, yearEl, furniture = [] }) {
    const ax = axis(realm);
    const { frontAt, timeAtFront } = clock(film);
    const N = ax.buckets;
    const fr = film.frame;
    const { mid: MID, half: HALF, ruleTop: RULE_TOP, ruleBottom: RULE_BOTTOM, type } = fr;
    const X0 = fr.x0;
    const IW = fr.x1 - X0;
    const x = (u, v = 1) => X0 + (u / v) * IW;

    const make = (tag, attrs, parent) => {
      const el = document.createElementNS(SVG_NS, tag);
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
      parent.appendChild(el);
      return el;
    };
    const world = make("g", {}, svg);
    const eraGroup = film.eras ? make("g", { class: "river-eras" }, world) : null;
    const gridGroup = make("g", {}, world);
    const bandsGroup = make("g", { class: "river-bands" }, world);
    // A countdown's lit bands keep their own colours at the edge, so a sliver reads as its side.
    const spotGroup = make("g", { class: film.ranking ? "river-spot river-spot-own" : "river-spot", opacity: 0 }, world);
    const axisLine = make("line", { class: "river-axis", x1: X0, y1: MID, x2: X0, y2: MID }, world);
    const front = make("line", { class: "river-front", x1: X0, y1: RULE_TOP, x2: X0, y2: RULE_BOTTOM, opacity: 0 }, world);
    const tickGroup = make("g", {}, world);
    const calloutGroup = make("g", { opacity: 0 }, svg);
    // Type sizes come from the frame, so what is measured is what is drawn.
    const sized = (el, size) => {
      el.style.fontSize = `${size}px`;
      return el;
    };
    const calloutLeader = make("line", { class: "river-callout-leader", x1: 0, y1: fr.leaderTop, x2: 0, y2: fr.leaderTop + 14 }, calloutGroup);
    const calloutName = sized(make("text", { class: "river-callout-name", x: 0, y: fr.nameY }, calloutGroup), type.name);
    const calloutMeta = sized(make("text", { class: "river-callout-meta", x: 0, y: fr.metaY }, calloutGroup), type.meta);
    const measure = make("text", { class: "river-measure", x: -4000, y: -4000, "data-layout-ignore": "" }, svg);
    const widthOf = (text, size, weight) => {
      measure.setAttribute("font-size", size);
      measure.setAttribute("font-weight", weight);
      measure.textContent = text;
      return measure.getComputedTextLength();
    };

    // ---- the layers, stacked as the home page stacks them: oldest nearest the axis ----
    const ordered = realm.entities
      .filter((e) => e.curve.benefit.length > 0)
      .sort((a, b) => (a.first_year ?? 0) - (b.first_year ?? 0) || a.name.localeCompare(b.name));
    const benefitBase = new Array(N).fill(0);
    const harmBase = new Array(N).fill(0);
    const layers = ordered.map((entity) => {
      const { from, benefit, harm } = entity.curve;
      const start = Math.max(0, from - 1);
      const stop = Math.min(N - 1, from + benefit.length);
      const layer = { entity, start, stop, b0: [], b1: [], h0: [], h1: [], drawn: false };
      for (let i = start; i <= stop; i++) {
        const k = i - from;
        const b = k >= 0 && k < benefit.length ? benefit[k] : 0;
        const h = k >= 0 && k < harm.length ? harm[k] : 0;
        layer.b0.push(benefitBase[i]);
        layer.h0.push(harmBase[i]);
        benefitBase[i] += b;
        harmBase[i] += h;
        layer.b1.push(benefitBase[i]);
        layer.h1.push(harmBase[i]);
      }
      const g = make("g", { opacity: "0.92" }, bandsGroup);
      // With type shades, people and events take their own shade of benefit and harm (river.css).
      const type = film.typeShades ? ` t-${entity.entity_type}` : "";
      layer.benefitPath = make("path", { class: `river-band-b${type}`, d: "" }, g);
      layer.harmPath = make("path", { class: `river-band-h${type}`, d: "" }, g);
      return layer;
    });
    const columnTop = benefitBase.map((b, i) => Math.max(b, harmBase[i]));
    const floor = Math.max(1, ...columnTop) * FLOOR_SHARE;
    // Lit bands: one pair of paths per band lit at once, each under its own opacity.
    const spotPairs = [];
    const spotPair = (k) => {
      while (spotPairs.length <= k) {
        const g = make("g", { opacity: 0 }, spotGroup);
        spotPairs.push({
          g,
          benefit: make("path", { class: "river-band-b", d: "" }, g),
          harm: make("path", { class: "river-band-h", d: "" }, g),
        });
      }
      return spotPairs[k];
    };
    spotPair(0);
    const layerOf = new Map(layers.map((layer) => [layer.entity.slug, layer]));

    // ---- ticks: the site's labels, most recent first so the readable end keeps them ----
    const ticks = [];
    for (const year of [...realm.timeline.ticks].reverse()) {
      const u = ax.yearToUnit(year);
      const px = x(u);
      if (ticks.length > 0 && ticks[ticks.length - 1].px - px < fr.tickGap) continue;
      const label = ax.formatYear(year);
      const w = widthOf(label, type.tick, 400);
      // With era columns, the eras' edges are the river's verticals and the years keep only labels.
      const line = film.eras
        ? null
        : make("line", { class: "river-grid", x1: px, x2: px, y1: fr.gridTop ?? RULE_TOP, y2: RULE_BOTTOM, opacity: 0 }, gridGroup);
      const text = sized(make("text", { class: "river-tick-label", x: px, y: fr.tickY, opacity: 0 }, tickGroup), type.tick);
      text.textContent = label;
      ticks.push({ u, px, w, at: timeAtFront(u), line, text });
    }

    // ---- eras: a faint column for every other era, a brighter one for the era at the front, and
    // each era's name and years in the callout slot as the front enters it, when the reading plan
    // gives it the slot ----
    const plan = film.pacing === "calm" || film.eras ? readingPlan(realm, film) : null;
    const eraCols = !film.eras
      ? []
      : ERAS.map((era, i) => {
          const u0 = ax.yearToUnit(era.year);
          const u1 = i + 1 < ERAS.length ? ax.yearToUnit(ERAS[i + 1].year) : 1;
          const label = plan.eraLabels[i];
          return {
            i,
            u0,
            u1,
            enter: timeAtFront(u0),
            leave: u1 < 1 ? timeAtFront(u1) : film.sweep1,
            label: label.shown ? label : null,
            rect: make("rect", { class: "river-era", x: X0, y: RULE_TOP, width: 0, height: RULE_BOTTOM - RULE_TOP, opacity: 0 }, eraGroup),
          };
        });
    const eraLabels = eraCols.filter((c) => c.label);
    const eraLabelGroup = film.eras ? make("g", { opacity: 0 }, svg) : null;
    const eraName = film.eras ? sized(make("text", { class: "river-era-name", x: 0, y: fr.nameY }, eraLabelGroup), type.era) : null;
    const eraMeta = film.eras ? sized(make("text", { class: "river-callout-meta", x: 0, y: fr.metaY }, eraLabelGroup), type.meta) : null;

    // ---- callouts: the biggest entity (own influence) starting in each gap of the sweep ----
    const labelOf = (e) => {
      const kind = e.entity_type.charAt(0).toUpperCase() + e.entity_type.slice(1);
      return e.first_year === null ? kind : `${kind} · ${ax.formatSpan(e.first_year, e.last_year ?? e.first_year)}`;
    };
    const callouts = [];
    const candidates = layers
      .map((layer) => ({ layer, u: ax.bucketUnit(layer.entity.curve.from) }))
      .filter((c) => c.u > 0.008)
      .sort((a, b) => b.layer.entity.own_magnitude - a.layer.entity.own_magnitude);
    if (film.pacing === "calm") {
      // One thing to read at a time. A name never lands while a leader's card is being read (from
      // 0.5 s before it lands until its words are read) or an era's name is up (1 s either side),
      // nor within 1 s of a card. Otherwise the next name is the biggest entity starting gap to
      // gap + window seconds after the last, among those whose label reads within the hold.
      const { cards } = plan;
      const blocked = [
        ...cards.map((c) => [c.at - 0.5, c.readEnd]),
        ...eraLabels.map((c) => [c.label.at - 1.0, c.label.at + c.label.hold + 1.0]),
      ];
      const pool = candidates
        .map((c) => ({ ...c, at: timeAtFront(c.u + SWELL * 0.35) }))
        .filter((c) => c.at <= film.lastCallout && readTime(wordsIn(c.layer.entity.name) + wordsIn(labelOf(c.layer.entity))) <= film.calloutHold)
        .filter((c) => !blocked.some(([a, b]) => c.at + film.calloutHold > a && c.at < b))
        .filter((c) => !cards.some((card) => Math.abs(card.at - c.at) < 1));
      let last = -Infinity;
      for (let t = film.sweep0 + 0.5; t < film.lastCallout; ) {
        const lo = Math.max(t, last + film.calloutGap);
        const pick = pool.find((c) => c.at >= lo && c.at <= lo + film.calloutWindow);
        if (!pick) {
          t += 0.5;
          continue;
        }
        callouts.push({ ...pick, hold: film.calloutHold });
        last = pick.at;
        t = pick.at;
      }
    } else {
      for (const c of candidates) {
        const at = timeAtFront(c.u + SWELL * 0.35);
        if (at > film.lastCallout) continue;
        if (callouts.every((p) => Math.abs(p.at - at) >= film.calloutGap)) callouts.push({ ...c, at, hold: film.calloutHold });
      }
    }
    callouts.sort((a, b) => a.at - b.at);

    // ---- the finale: the all-time top ranks by total influence, lit in turn ----
    const ranked = [...layers].sort((a, b) => b.entity.total_magnitude - a.entity.total_magnitude);
    (film.ranksAt ?? []).forEach((at, i) => {
      const layer = ranked[i];
      const hold = film.rankHolds ? film.rankHolds[i] : film.rankHold;
      callouts.push({ layer, u: ax.bucketUnit(layer.entity.curve.from), at, hold, rank: i + 1 });
    });

    const total = realm.entities.length.toLocaleString("en-US");
    for (const c of callouts) {
      const e = c.layer.entity;
      const span = labelOf(e);
      c.name = e.name;
      c.meta = c.rank ? `No. ${c.rank} of ${total} · ${span}` : span;
      if (c.rank && film.rankHolds) {
        c.meta = `No. ${c.rank} · ${span}`;
        const read = readTime(wordsIn(c.name) + wordsIn(c.meta));
        if (read > c.hold + 1e-9) throw new Error(`No. ${c.rank}, ${c.name}, needs ${read.toFixed(1)} s to read and holds ${c.hold} s: re-time FILMS.race`);
      }
      c.px = x(c.u, view(film, frontAt(c.at)));
      const w = Math.max(widthOf(c.name, type.name, 700), widthOf(c.meta, type.meta, 400));
      if (w > fr.textRight - X0) throw new Error(`${c.name}'s callout is ${Math.ceil(w)} px wide; the frame has ${fr.textRight - X0}`);
      // The words start at the band, or end there when they would pass textRight. When neither
      // fits, as in a narrow frame, they end at textRight, still over the band.
      c.textX = c.px + w <= fr.textRight || c.px - w >= X0 ? c.px : fr.textRight;
      c.anchor = c.px + w <= fr.textRight ? "start" : "end";
    }

    const reveal = new Float64Array(N);
    const bandPath = (layer, lo, hi, last, sign, scale, v) => {
      let top = "";
      let bottom = "";
      for (let k = 0; k <= last; k++) {
        const i = layer.start + k;
        const px = x(ax.bucketUnit(i), v).toFixed(1);
        top += `${k === 0 ? "M" : "L"}${px},${(MID - sign * Math.sqrt((reveal[i] * hi[k]) / scale) * HALF).toFixed(1)}`;
      }
      for (let k = last; k >= 0; k--) {
        const i = layer.start + k;
        const px = x(ax.bucketUnit(i), v).toFixed(1);
        bottom += `L${px},${(MID - sign * Math.sqrt((reveal[i] * lo[k]) / scale) * HALF).toFixed(1)}`;
      }
      return `${top}${bottom}Z`;
    };

    // A looping film's hook: before hook.until the river is drawn finished; over hook.drain it runs
    // back to its source, the front and the years rewinding; then the sweep plays as written.
    // Nothing is called out in either.
    const finished = film.sweep1 + 1;
    const hookTime = (t) => {
      if (film.finished) return { t: finished, quiet: true };
      if (!film.hook || t >= film.hook.until + film.hook.drain) return { t, quiet: false };
      if (t < film.hook.until) return { t: finished, quiet: true };
      const p = ease.inOut2((t - film.hook.until) / film.hook.drain);
      return { t: finished + (film.sweep0 - finished) * p, quiet: true };
    };

    // A countdown's lights: how lit each entry's band is at clock time t.
    const countdown = film.ranking ? countdownPlan(realm, film) : null;
    const litLevel = (entry, t) => {
      const L = film.light;
      let level = t < entry.at ? 1 - ramp(t, L.dark, L.darkDur, ease.inOut2) : ramp(t, entry.at, L.on, ease.inOut2);
      if (t >= entry.at && entry.rank > 1) level *= 1 - (1 - L.counted) * ramp(t, entry.until, L.on, ease.inOut2);
      return level + (1 - level) * ramp(t, countdown.outroAt, L.rise, ease.inOut2);
    };

    let shownCallout = null;
    let riverDrawn = false;
    return function draw(clockTime) {
      const { t, quiet } = hookTime(clockTime);
      const f = frontAt(t);
      const v = view(film, f);
      let scale = floor;
      for (let i = 0; i < N; i++) {
        reveal[i] = ease.smooth(clamp01((f - ax.bucketUnit(i)) / SWELL));
        const top = reveal[i] * columnTop[i];
        if (top > scale) scale = top;
      }

      // The callout on screen now, and how lit its band is.
      let callout = null;
      let lit = 0;
      for (const c of callouts) {
        if (quiet || t < c.at - 0.05 || t >= c.at + c.hold + 0.5) continue;
        callout = c;
        lit = ramp(t, c.at, 0.45, ease.inOut2) * (1 - ramp(t, c.at + c.hold - 0.05, 0.35, ease.inOut2));
      }

      // A finished river never changes, so it is drawn once.
      for (const layer of film.finished && riverDrawn ? [] : layers) {
        let last = -1;
        for (let k = 0; k <= layer.stop - layer.start; k++) if (reveal[layer.start + k] > 0) last = k;
        if (last < 0) {
          if (layer.drawn) {
            layer.benefitPath.setAttribute("d", "");
            layer.harmPath.setAttribute("d", "");
            layer.drawn = false;
          }
          continue;
        }
        last = Math.min(layer.stop - layer.start, last + 1);
        layer.benefitPath.setAttribute("d", bandPath(layer, layer.b0, layer.b1, last, 1, scale, v));
        layer.harmPath.setAttribute("d", bandPath(layer, layer.h0, layer.h1, last, -1, scale, v));
        layer.drawn = true;
      }
      riverDrawn = true;
      // The band lit now: the callout's, or in a countdown every entry's at its own level, over the
      // dark river.
      const spots = new Map();
      if (countdown) {
        for (const entry of countdown.entries) {
          const level = litLevel(entry, clockTime);
          if (level > 0.0005) spots.set(layerOf.get(entry.slug), level);
        }
      } else if (callout && lit > 0) spots.set(callout.layer, lit);
      let dim = 0;
      for (const amount of spots.values()) dim = Math.max(dim, amount);
      bandsGroup.setAttribute("opacity", (countdown ? film.light.dim : 1 - 0.35 * dim).toFixed(3));
      if (spots.size > 0) {
        let k = 0;
        for (const [layer, amount] of spots) {
          const pair = spotPair(k++);
          if (film.typeShades) {
            pair.benefit.setAttribute("class", layer.benefitPath.getAttribute("class"));
            pair.harm.setAttribute("class", layer.harmPath.getAttribute("class"));
          }
          pair.benefit.setAttribute("d", layer.benefitPath.getAttribute("d"));
          pair.harm.setAttribute("d", layer.harmPath.getAttribute("d"));
          pair.g.setAttribute("opacity", amount.toFixed(3));
        }
        for (; k < spotPairs.length; k++) spotPairs[k].g.setAttribute("opacity", "0");
        spotGroup.setAttribute("opacity", "1");
      } else {
        spotGroup.setAttribute("opacity", "0");
      }

      // Callout text: lands blurred to sharp, holds still, leaves.
      if (callout) {
        if (shownCallout !== callout) {
          calloutName.textContent = callout.name;
          calloutMeta.textContent = callout.meta;
          for (const el of [calloutName, calloutMeta]) {
            el.setAttribute("x", callout.textX.toFixed(1));
            el.setAttribute("text-anchor", callout.anchor);
          }
          calloutLeader.setAttribute("x1", callout.px.toFixed(1));
          shownCallout = callout;
        }
        const enter = ramp(t, callout.at, 0.3, ease.expoOut);
        const leave = ramp(t, callout.at + callout.hold, 0.18, ease.in2);
        calloutGroup.setAttribute("opacity", (enter * (1 - leave)).toFixed(3));
        calloutGroup.style.filter = `blur(${(6 * (1 - enter) + 6 * leave).toFixed(2)}px)`;
        const i = Math.min(N - 1, callout.layer.entity.curve.from);
        const crest = MID - Math.sqrt((reveal[i] * columnTop[i]) / scale) * HALF;
        // The words stay where they landed; the leader's foot follows the band under the camera.
        calloutLeader.setAttribute("x2", x(callout.u, v).toFixed(1));
        calloutLeader.setAttribute("y2", Math.max(fr.leaderTop + 4, crest - 8).toFixed(1));
      } else {
        calloutGroup.setAttribute("opacity", "0");
      }

      // The axis draws in; the front leads the river and leaves when it is done.
      axisLine.setAttribute("x2", (X0 + IW * ramp(t, film.axisIn, film.axisDur, ease.inOut2)).toFixed(1));
      const frontX = Math.min(film.frame.x1, x(f, v));
      front.setAttribute("x1", frontX.toFixed(1));
      front.setAttribute("x2", frontX.toFixed(1));
      front.setAttribute(
        "opacity",
        (0.45 * ramp(t, film.sweep0 - 0.3, 0.3, ease.inOut2) * (1 - ramp(t, film.sweep1, 0.6, ease.inOut2))).toFixed(3),
      );
      for (const tick of ticks) {
        const op = ramp(t, tick.at, 0.4, ease.expoOut).toFixed(3);
        tick.line?.setAttribute("opacity", op);
        tick.text.setAttribute("opacity", op);
        if (film.zoom) {
          const px = x(tick.u, v);
          tick.line?.setAttribute("x1", px.toFixed(1));
          tick.line?.setAttribute("x2", px.toFixed(1));
          tick.text.setAttribute("x", px.toFixed(1));
          tick.px = px;
        }
        const anchor = tick.px - tick.w / 2 < X0 ? "start" : tick.px + tick.w / 2 > fr.x1 ? "end" : "middle";
        if (tick.anchor !== anchor) {
          tick.text.setAttribute("text-anchor", anchor);
          tick.anchor = anchor;
        }
      }

      // Era columns grow with the front; the one it is in brightens while it is there.
      for (const col of eraCols) {
        if (f <= col.u0) {
          col.rect.setAttribute("opacity", "0");
          continue;
        }
        const left = Math.max(X0, x(col.u0, v));
        const right = Math.min(film.frame.x1, x(Math.min(col.u1, f), v));
        col.rect.setAttribute("x", left.toFixed(1));
        col.rect.setAttribute("width", Math.max(0, right - left).toFixed(1));
        const here = ramp(t, col.enter, 0.6, ease.inOut2) * (1 - ramp(t, col.leave, 0.6, ease.inOut2));
        const zebra = col.i % 2 === 1 ? 0.05 : 0;
        col.rect.setAttribute("opacity", (zebra + (0.1 - zebra) * here).toFixed(3));
      }
      // The era's name: lands blurred to sharp at the column's left edge, holds for its words, leaves.
      if (film.eras) {
        const era = eraLabels.find((c) => t >= c.label.at - 0.05 && t < c.label.at + c.label.hold + 0.3);
        if (era) {
          if (eraLabelGroup.dataset.era !== String(era.i)) {
            eraName.textContent = era.label.name;
            eraMeta.textContent = era.label.meta;
            const px = Math.max(X0, x(era.u0, view(film, frontAt(era.label.at)))) + 12;
            const w = Math.max(widthOf(era.label.name, type.era, 600), widthOf(era.label.meta, type.meta, 400));
            const end = px + w > fr.textRight;
            for (const el of [eraName, eraMeta]) {
              el.setAttribute("x", (end ? fr.textRight : px).toFixed(1));
              el.setAttribute("text-anchor", end ? "end" : "start");
            }
            eraLabelGroup.dataset.era = String(era.i);
          }
          const enter = ramp(t, era.label.at, 0.3, ease.expoOut);
          const leave = ramp(t, era.label.at + era.label.hold, 0.18, ease.in2);
          eraLabelGroup.setAttribute("opacity", (enter * (1 - leave)).toFixed(3));
          eraLabelGroup.style.filter = `blur(${(6 * (1 - enter) + 6 * leave).toFixed(2)}px)`;
        } else {
          eraLabelGroup.setAttribute("opacity", "0");
        }
      }

      // The counter and the furniture arrive with the front and leave for the end card.
      if (yearEl) yearEl.textContent = ax.formatYear(yearAt(ax, f));
      // In a loop they arrive as the river drains and leave for the title at hook.outro.
      const shown = film.hook
        ? ramp(clockTime, film.hook.until, 0.25, ease.expoOut) * (1 - ramp(clockTime, film.hook.outro, 0.6, ease.in2))
        : ramp(t, film.sweep0 - 0.4, 0.3, ease.expoOut) * (1 - ramp(t, film.dimAt, 0.4, ease.in2));
      for (const el of furniture) el.style.opacity = shown.toFixed(3);

      // The end card takes the frame: the river stays, dimmed under it.
      world.setAttribute("opacity", (1 - 0.78 * ramp(t, film.dimAt, 0.8, ease.inOut2)).toFixed(3));
    };
  }

  window.River = {
    FILMS,
    ERAS,
    RANKINGS,
    SWELL,
    axis,
    clock,
    view,
    yearAt,
    ease,
    ramp,
    clamp01,
    board,
    wordsIn,
    readTime,
    readingPlan,
    countdownPlan,
    shareOf,
    mount,
  };
})();
