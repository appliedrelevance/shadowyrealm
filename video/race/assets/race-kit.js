// Pieces shared by the race's panel (race-board) and its lower third (race-card):
// pictures, rows and their bars. Pictures are the snapshot's Wikimedia stills
// (tools/video-snapshot.ts), or the site's type icon for an entity with no free picture. Every
// image is decoded before a composition registers its timeline, so no frame waits on one.
(() => {
  // The site's type icons: lucide 0.577 (ISC), as src/sites/history/ui.tsx uses them.
  const icon = (paths) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
  const ICONS = {
    person: icon('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
    organization: icon(
      '<path d="M10 12h4"/><path d="M10 8h4"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"/><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/>',
    ),
    event: icon(
      '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    ),
  };

  // Ten rows 66 px apart from y 380; a name gets 390 px beside its picture; a bar 390 px, or 270
  // beside a value.
  const ROW_TOP = 323;
  const PITCH = 66;
  const NAME_WIDTH = 390;
  const BAR_RACE = 390;
  const BAR_TOTAL = 270;

  window.RaceKit = (realm) => {
    const bySlug = new Map(realm.entities.map((e) => [e.slug, e]));
    const decoding = [];
    const mediaOf = (slug) => {
      const m = realm.media?.[slug];
      if (!m) throw new Error(`The snapshot has no media for ${slug}: run bun tools/video-snapshot.ts`);
      return m;
    };
    // A box of the given class holding the entity's picture, or its type icon.
    const picture = (slug, className) => {
      const box = document.createElement("div");
      box.className = className;
      const m = mediaOf(slug);
      if (m.image) {
        const img = document.createElement("img");
        img.src = m.image;
        img.alt = "";
        box.appendChild(img);
        decoding.push(img.decode());
      } else {
        box.innerHTML = ICONS[bySlug.get(slug).entity_type];
      }
      return box;
    };

    // Text measured in the face it renders in. Names that do not fit lose words from the end,
    // never type size.
    const ctx = document.createElement("canvas").getContext("2d");
    const widthOf = (text, font) => {
      ctx.font = font;
      return ctx.measureText(text).width;
    };
    const fit = (name) => {
      const font = '700 28px "Inter"';
      if (widthOf(name, font) <= NAME_WIDTH) return name;
      const words = name.split(" ");
      while (words.length > 1) {
        words.pop();
        const short = `${words.join(" ")}…`;
        if (widthOf(short, font) <= NAME_WIDTH) return short;
      }
      return name;
    };

    // A row in `parent`: the picture (none when slug is null), the name, the bar and its value.
    const makeRow = (parent, slug, name) => {
      const el = document.createElement("div");
      el.className = "board-row";
      el.style.opacity = "0";
      if (slug) el.appendChild(picture(slug, "board-pic"));
      el.insertAdjacentHTML(
        "beforeend",
        '<div class="board-name"></div><div class="board-bar"><div class="board-bar-b"></div><div class="board-bar-h"></div></div><div class="board-value"></div>',
      );
      el.querySelector(".board-name").textContent = fit(name);
      parent.appendChild(el);
      return {
        el,
        b: el.querySelector(".board-bar-b"),
        h: el.querySelector(".board-bar-h"),
        value: el.querySelector(".board-value"),
        shown: false,
      };
    };
    // The rank numbers down the left of the rows, 1 to n.
    const makeRanks = (parent, n) =>
      Array.from({ length: n }, (_, k) => {
        const el = document.createElement("div");
        el.className = "board-rank";
        el.style.top = `${ROW_TOP + k * PITCH}px`;
        el.textContent = String(k + 1);
        parent.appendChild(el);
        return el;
      });
    const setBar = (row, benefit, harm, scale, width) => {
      row.b.style.width = `${((benefit / scale) * width).toFixed(1)}px`;
      row.h.style.width = `${((harm / scale) * width).toFixed(1)}px`;
    };

    return {
      ROW_TOP,
      PITCH,
      BAR_RACE,
      BAR_TOTAL,
      bySlug,
      mediaOf,
      picture,
      widthOf,
      makeRow,
      makeRanks,
      setBar,
      ready: () => Promise.all(decoding),
    };
  };
})();
