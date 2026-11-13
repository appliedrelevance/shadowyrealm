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
      sweep1: 280.2,
      calloutGap: 4.0,
      calloutHold: 3.0,
      lastCallout: 276.0,
      ranksAt: [282.6, 285.4, 288.2],
      rankHold: 2.3,
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
      layer.benefitPath = make("path", { class: "river-band-b", d: "" }, g);
      layer.harmPath = make("path", { class: "river-band-h", d: "" }, g);
      return layer;
    });
    const columnTop = benefitBase.map((b, i) => Math.max(b, harmBase[i]));
    const floor = Math.max(1, ...columnTop) * FLOOR_SHARE;
    const spotBenefit = make("path", { class: "river-band-b", d: "" }, spotGroup);
    const spotHarm = make("path", { class: "river-band-h", d: "" }, spotGroup);

    // ---- ticks: the site's labels, most recent first so the readable end keeps them ----
    const ticks = [];
    for (const year of [...realm.timeline.ticks].reverse()) {
      const u = ax.yearToUnit(year);
      const px = x(u);
      if (ticks.length > 0 && ticks[ticks.length - 1].px - px < 150) continue;
      const label = ax.formatYear(year);
      const w = widthOf(label, 28, 400);
      const line = make("line", { class: "river-grid", x1: px, x2: px, y1: RULE_TOP, y2: RULE_BOTTOM, opacity: 0 }, gridGroup);
      const text = make("text", { class: "river-tick-label", x: px, y: TICK_Y, opacity: 0 }, tickGroup);
      text.textContent = label;
      ticks.push({ u, px, w, at: timeAtFront(u), line, text });
    }

    // ---- callouts: the biggest entity (own influence) starting in each gap of the sweep ----
    const callouts = [];
    const candidates = layers
      .map((layer) => ({ layer, u: ax.bucketUnit(layer.entity.curve.from) }))
      .filter((c) => c.u > 0.008)
      .sort((a, b) => b.layer.entity.own_magnitude - a.layer.entity.own_magnitude);
    for (const c of candidates) {
      const at = timeAtFront(c.u + SWELL * 0.35);
      if (at > film.lastCallout) continue;
      if (callouts.every((p) => Math.abs(p.at - at) >= film.calloutGap)) callouts.push({ ...c, at, hold: film.calloutHold });
    }
    callouts.sort((a, b) => a.at - b.at);

    // ---- the finale: the all-time top three by total influence, lit in turn ----
    const ranked = [...layers].sort((a, b) => b.entity.total_magnitude - a.entity.total_magnitude);
    film.ranksAt.forEach((at, i) => {
      const layer = ranked[i];
      callouts.push({ layer, u: ax.bucketUnit(layer.entity.curve.from), at, hold: film.rankHold, rank: i + 1 });
    });
    const total = realm.entities.length.toLocaleString("en-US");
    for (const c of callouts) {
      const e = c.layer.entity;
      const kind = e.entity_type.charAt(0).toUpperCase() + e.entity_type.slice(1);
      const span = e.first_year === null ? kind : `${kind} · ${ax.formatSpan(e.first_year, e.last_year ?? e.first_year)}`;
      c.name = e.name;
      c.meta = c.rank ? `No. ${c.rank} of ${total} · ${span}` : span;
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
      bandsGroup.setAttribute("opacity", (1 - 0.35 * lit).toFixed(3));
      if (callout && lit > 0) {
        spotBenefit.setAttribute("d", callout.layer.benefitPath.getAttribute("d"));
        spotHarm.setAttribute("d", callout.layer.harmPath.getAttribute("d"));
        spotGroup.setAttribute("opacity", lit.toFixed(3));
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
        tick.line.setAttribute("opacity", op);
        tick.text.setAttribute("opacity", op);
        if (film.zoom) {
          const px = x(tick.u, v);
          tick.line.setAttribute("x1", px.toFixed(1));
          tick.line.setAttribute("x2", px.toFixed(1));
          tick.text.setAttribute("x", px.toFixed(1));
          tick.px = px;
        }
        const anchor = tick.px - tick.w / 2 < X0 ? "start" : tick.px + tick.w / 2 > film.frame.x1 ? "end" : "middle";
        if (tick.anchor !== anchor) {
          tick.text.setAttribute("text-anchor", anchor);
          tick.anchor = anchor;
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

  window.River = { FILMS, ERAS, SWELL, axis, clock, view, yearAt, ease, ramp, clamp01, mount };
})();
