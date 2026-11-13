// The river of influence, shared by every film in this project: the home page's stacking, its
// logarithmic time axis and square-root height, drawn from timeline time alone.
// Each film's clock and frame are in FILMS; SPEC.md describes them shot by shot.
(() => {
  const SVG_NS = "http://www.w3.org/2000/svg";

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
      frame: { x0: 96, x1: 1824, textRight: 1728 },
    },
    // The five-minute race: race.html, with the leaderboard to the right of the river.
    race: {
      duration: 300,
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
      // The board shows the top ten. After the sweep it turns from that year to all time, and the
      // all-time ten are lit on the river counting down, No. 10 first and No. 1 last, each for its
      // words (rankHolds, River.readTime; mount checks them) and 0.4 s apart, ending before the dim.
      // Times for rank 1 to 10; re-time them if the top ten's names change.
      boardSlots: 10,
      // A leader gets a card when it holds the lead 2.5 s or more.
      leadHold: 2.5,
      allTimeAt: 259.6,
      ranksAt: [289.2, 286.2, 283.2, 279.9, 276.6, 273.6, 270.0, 267.0, 264.0, 261.0],
      rankHolds: [2.6, 2.6, 2.6, 2.9, 2.9, 2.6, 3.2, 2.6, 2.6, 2.6],
      dimAt: 292.0,
      frame: { x0: 96, x1: 1250, textRight: 1250 },
      // The camera: the view widens with the front, which holds 80% of the way across, so the river
      // fills the frame from the first minute; it never shows less than a fifth of the axis.
      zoom: { lead: 0.8, minView: 0.2 },
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

  // Vertical frame, shared by both films.
  const MID = 530;
  const HALF = 285;
  const RULE_TOP = 235;
  const RULE_BOTTOM = 825;
  const TICK_Y = 862;
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
      const leadEnd = i + 1 < leads.length ? leads[i + 1].at : film.allTimeAt;
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
    cards.forEach((card, i) => {
      const next = i + 1 < cards.length ? cards[i + 1].at : film.allTimeAt;
      const read = card.readEnd - card.at;
      card.until = Math.min(card.at + Math.min(12, Math.max(read + 1.5, 5)), next - 0.4);
      if (card.until < card.readEnd) throw new Error(`The card for ${card.slug} leaves before its words are read`);
    });
    return { cards, eraLabels };
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
    const X0 = film.frame.x0;
    const IW = film.frame.x1 - X0;
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
    const spotGroup = make("g", { class: "river-spot", opacity: 0 }, world);
    const axisLine = make("line", { class: "river-axis", x1: X0, y1: MID, x2: X0, y2: MID }, world);
    const front = make("line", { class: "river-front", x1: X0, y1: RULE_TOP, x2: X0, y2: RULE_BOTTOM, opacity: 0 }, world);
    const tickGroup = make("g", {}, world);
    const calloutGroup = make("g", { opacity: 0 }, svg);
    const calloutLeader = make("line", { class: "river-callout-leader", x1: 0, y1: 236, x2: 0, y2: 250 }, calloutGroup);
    const calloutName = make("text", { class: "river-callout-name", x: 0, y: 178 }, calloutGroup);
    const calloutMeta = make("text", { class: "river-callout-meta", x: 0, y: 218 }, calloutGroup);
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
      if (ticks.length > 0 && ticks[ticks.length - 1].px - px < 150) continue;
      const label = ax.formatYear(year);
      const w = widthOf(label, 28, 400);
      // With era columns, the eras' edges are the river's verticals and the years keep only labels.
      const line = film.eras
        ? null
        : make("line", { class: "river-grid", x1: px, x2: px, y1: RULE_TOP, y2: RULE_BOTTOM, opacity: 0 }, gridGroup);
      const text = make("text", { class: "river-tick-label", x: px, y: TICK_Y, opacity: 0 }, tickGroup);
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
    const eraName = film.eras ? make("text", { class: "river-era-name", x: 0, y: 178 }, eraLabelGroup) : null;
    const eraMeta = film.eras ? make("text", { class: "river-callout-meta", x: 0, y: 218 }, eraLabelGroup) : null;

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
    film.ranksAt.forEach((at, i) => {
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
      const w = Math.max(widthOf(c.name, 44, 700), widthOf(c.meta, 28, 400));
      c.anchor = c.px + w > film.frame.textRight ? "end" : "start";
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

    let shownCallout = null;
    return function draw(t) {
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
        if (t < c.at - 0.05 || t >= c.at + c.hold + 0.5) continue;
        callout = c;
        lit = ramp(t, c.at, 0.45, ease.inOut2) * (1 - ramp(t, c.at + c.hold - 0.05, 0.35, ease.inOut2));
      }

      for (const layer of layers) {
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
      // The band lit now: the callout's.
      const spots = new Map();
      if (callout && lit > 0) spots.set(callout.layer, lit);
      let dim = 0;
      for (const amount of spots.values()) dim = Math.max(dim, amount);
      bandsGroup.setAttribute("opacity", (1 - 0.35 * dim).toFixed(3));
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
            el.setAttribute("x", callout.px.toFixed(1));
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
        calloutLeader.setAttribute("y2", Math.max(240, crest - 8).toFixed(1));
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
        const anchor = tick.px - tick.w / 2 < X0 ? "start" : tick.px + tick.w / 2 > film.frame.x1 ? "end" : "middle";
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
            const w = Math.max(widthOf(era.label.name, 40, 600), widthOf(era.label.meta, 28, 400));
            const end = px + w > film.frame.textRight;
            for (const el of [eraName, eraMeta]) {
              el.setAttribute("x", (end ? film.frame.textRight : px).toFixed(1));
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
      const shown = (ramp(t, film.sweep0 - 0.4, 0.3, ease.expoOut) * (1 - ramp(t, film.dimAt, 0.4, ease.in2))).toFixed(3);
      for (const el of furniture) el.style.opacity = shown;

      // The end card takes the frame: the river stays, dimmed under it.
      world.setAttribute("opacity", (1 - 0.78 * ramp(t, film.dimAt, 0.8, ease.inOut2)).toFixed(3));
    };
  }

  window.River = { FILMS, ERAS, SWELL, axis, clock, view, yearAt, ease, ramp, clamp01, board, wordsIn, readTime, readingPlan, mount };
})();
