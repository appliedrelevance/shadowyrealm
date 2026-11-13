# The River of Influence

GOAL: the viewer watches five thousand years fill in, left to right, and ends knowing that every age
looked enormous until the next one arrived.

OUTPUT: HyperFrames, 1920 x 1080, 30 fps. TIME: 60 s x 30 = 1800 frames. Music bed only, no voice.

ENGINE: `assets/river.js` draws the river for this film and for the race (`race/`); `FILMS.short`
holds this film's clock and frame, and the numbers below.

DATA: `assets/realm-data.js`, a frozen `/api/realm` snapshot written by `tools/video-snapshot.ts`.
The axis, the bucket count and the ticks come from the site config inside the snapshot. Nothing on
screen is typed by hand except the title and the end card's words.

LOOK: the site's own dark ground, not an invented void, and the river fills the frame edge to edge.
- ground `#181822` (site `--color-surface`), flat, no texture, no vignette
- ink `#f8fafc`, muted `#94a3b8`, hairlines `#333350` and `#4a4a70`
- benefit `#3e9ad6` above the axis, harm `#d9534f` below it, bands at 0.92 opacity with a
  0.5 px ground-coloured seam, exactly as the home page draws them
- accent: the gate mark's ember `#ea580c`, on the end card only
- one face, Inter: 700 for names, numbers and the title, 400 for meta lines; tabular figures on
  the year counter

GEOMETRY: river x 96 to 1824 (1728 px), axis at y 530, half-height 285 (y 245 to 815). Tick labels
baseline y 862, 28 px. Year counter bottom left, x 192, top y 900, 76 px. Source line bottom right,
28 px. Callouts top zone, name baseline y 178 at 44 px, meta baseline y 218 at 28 px, a leader down
to the river's crest.

OBJECTS:
- the river: one band per entity, oldest nearest the axis, square-root height, logarithmic time
- the front: a 1 px ink line at 45% opacity where the river is arriving
- each bucket swells from nothing to full height over 5% of the axis as the front crosses it
- the vertical scale is the tallest column revealed so far (floor 2.5% of the final maximum), so
  the ancient world fills the frame at first and is pressed down as later centuries rise; the last
  frame matches the site exactly

MOTION: enter `expo.out`, exit `power2.in`, camera and dims `power2.inOut`, the front `none`
(progress is the point). Title words blur 6 px to 0 in 0.14 s, 0.08 s apart. Exits 40% shorter
than entrances.

SHOTS:
- 0.0 to 4.4: the axis draws left to right (0.15 to 2.35, `power2.inOut`); the title lands over the
  empty frame, "Five thousand years of influence", then "Benefit rises above the line. Harm falls
  below it."; both leave by 4.4
- 4.2 to 46.2: the front crosses the whole axis in 42 s; the counter reads the year at the front,
  from 3500 BCE to 2026; tick labels land as the front passes them; about one callout every 2.5 s
  names the biggest entity (own influence) starting there, its band lit and the rest dimmed to 0.65;
  no callout starts after 44 s
- 46.2 to 52.0: the front fades; the all-time top three by total influence are lit in turn at 46.5,
  48.3 and 50.1, each "No. N of 624"; all three are ancient, thin threads on the finished river,
  which is the film's turn: the swollen twentieth century is not where the most influence lies
- 52.0 to 60.0: the river dims to 0.22; the end card: the gate mark, `shadowyrealm.com`, the
  entity count and the as-of year; hold to the end

SOUND: one ambient bed from ACE-Step, 72 bpm, swelling across the minute; fade in 1.5 s, fade out
over the last 3 s.

BANNED: the HyperFrames defaults (glow, gradients, particles, cards, corner labels, KPI tiles),
any colour not on the site, text moving while it is read (callouts and labels are still once
landed), everything fading in at once.

QA: 2.3 s (axis drawn, title), 10 s (ancient river filling the frame, a callout), 25 s (early modern,
scale pressed down), 40 s (the twentieth century), 46.9, 48.7 and 50.5 s (the top three), 58 s (end card).
