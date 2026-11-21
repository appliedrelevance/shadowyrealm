# The River of Influence: the race

GOAL: four and a half minutes of history arriving left to right, with a leaderboard that keeps
changing hands, ending on the 2026 board, and saying why at each turn: who a leader is and what it
did. For casual viewing: one thing to read at a time, never two. The all-time countdown is a segment
of its own (Geordie, 2026-11-18: one segment per video); the race's last version with it is commit
03cc185.

OUTPUT: HyperFrames, 1920 x 1080, 30 fps. TIME: 269 s x 30 = 8070 frames. Music bed only, no voice.

SHARED WITH THE 60-SECOND CUT (`../`): the data snapshot and its pictures, the river engine
(`assets/river.js`, `FILMS.race` holds this film's clock and frame), its stylesheet, the intro and the
end card. Each is a symlink to its one home in `../assets` and `../compositions`. The race's own
panel pieces are `assets/race-kit.js` (pictures, rows, bars) and `assets/race.css`.

LOOK: as the 60-second cut (`../SPEC.md`): the site's ground, ink, benefit and harm tokens; Inter
only; tabular figures on every number. Text meant to be read is at least 28 px.

GEOMETRY:
- river x 96 to 1250, axis at y 530, half-height 285, era columns y 235 to 825 behind it; callouts
  above it (name 44 px 700, or an era's name 40 px 600; the line under it 28 px), anchored inside
  x 1250; the source line top left (x 96, top 64)
- panel x 1320 to 1824: the year at 96 px (top 140), the era at 34 px (top 254), the caption at
  28 px (top 318), ten rows 66 px apart from y 380, clipped at y 1034 so a row joins from under the
  tenth place and leaves down past it
- a row: a 52 px picture, the name 28 px 700 beside it (words dropped from the end past 390 px,
  never smaller type), a 14 px bar under it split into benefit then harm: 390 px for the leader
- the lower third x 96 to 1250, top 888: a 112 px picture, a 28 px line (the name in 700, the
  reasons in 400 behind benefit or harm swatches), and up to three 28 px lines of the site's text

OBJECTS:
- the river and its front as in the 60-second cut, with a camera: the view is the larger of a
  fifth of the axis and the front ÷ 0.8, capped at the whole axis, with smooth corners (k 0.04).
  Bands are shaded by type: organizations in the site's benefit and harm, people lighter and toward
  cyan or orange, events darker and toward indigo or crimson (OKLCH steps of ±0.06 to 0.07 L and
  14° of hue; the closest blue and red stay ΔE 17.4 apart under colour blindness, against 20.0 for
  the site's pair). No key: the shades are texture, and a callout names each entity's type
- era columns: every other era a faint column (ink at 5%), the era at the front brighter (10%),
  growing with the front; the year ticks keep their labels and lose their lines
- the reading plan (`River.readingPlan`), one text at a time, each held 0.5 s plus 0.3 s a word:
  era names first, then leader cards, then names in the gaps
- the leaderboard (`race-board`), the top ten, ranks every entity by its own benefit plus harm in the
  year at the front, linear between buckets. The bars carry the ranking without numbers: the curve's level is
  influence per century, a unit the site never shows. A row's place is its rank averaged over the
  last 0.35 s; whether it shows at all is its rank averaged over the last 1 s. The higher-ranked row
  passes over the lower one on an opaque ground-coloured backing
- pictures: each board entity's Wikimedia thumbnail, frozen by `tools/video-snapshot.ts` as one
  sRGB still cropped square. An entity with no free picture shows the site's type icon
- era names: each era after the first lands in the callout slot from 0.2 s after the front enters
  it, "The Classical World / 500 BCE to 500 CE", holding for its words (at least 2.6 s); the panel
  names the era too. A name waits up to 3 s for a card to be read; past that, the era is named in
  the panel only
- the lower third (`race-card`): a card the first time each entity leads the board for 5 s or
  more, with the two largest areas of its own profile and its description from the site. Cards
  queue: each lands once what came before has been read (plus 1 s after a card, 0.5 s after an era's
  name), while its entity still leads, and waits up to 3.5 s for an era's name it would push out. It holds its words plus 1.5 s (5 to 12 s) and leaves 0.4 s before the next. A
  description that runs past three lines stops the build
- callouts: a name every 3 to 4 s, the biggest entity by own influence starting in that slot whose
  name and line read within 2.6 s (the hold). None while a card is being read (0.5 s before it lands
  until its words are read), within 1 s of a card, or within 1 s of an era's name

SHOTS:
- 0.0 to 4.6: the intro from the 60-second cut over the empty river
- 4.2 to 258.8: the sweep, 3500 BCE to 2026 in 254.6 s; eras land in the panel and above the river as
  the front crosses their first year; a card under the river for each new leader (chapters:
  `bun tools/video-description.ts`)
- 258.8 to 261.0: the front reaches 2026 and the board holds on that year (its last change is at
  258.4 s; a longer hold is a dead stretch)
- 261.0 to 269.0: the river dims and the panel leaves (`boardEnd`, `dimAt`); the end card

SOUND: `assets/music/race-score.m4a`, our own score, the SoundCraft session
`/Volumes/Berthold/Landru/media/exports/shadowyrealm/music/soundcraft/race/race-score.scraft` (imported from `video/music/race_score.py`'s MIDI), played by BBC
Symphony Orchestra Discover and levelled by the session's automation. It keeps
the form and harmony of the generated bed it replaces (two swells with a quiet middle, a fall, a
build in D minor) with themes and an orchestration of its own, on a grid of 89.13 bpm whose bar 97
falls as the front reaches 2026 (`sweep1`, 258.8 s): the World Wars on bar 68, the Cold War on bar
72's third beat, the Digital Age on bar 81, D major at 2026. 269.0 s, −16.1 LUFS, −1.8 dBTP. It
opens on the harp from silence; the clip fades out over the last 3 s. A change to the race's
timings moves the session's notes, markers and automation, and the score is bounced again.

BANNED: as `../SPEC.md`, plus rows jittering between places, names flashing onto the board for less
than half a second, a dead centre of the frame while the river is still young, text under 28 px, a
card on screen for less than its words, two texts landing to be read at once, a picture that moves,
a picture its licence does not let us show.

QA: 10 s (Sumer's card, with its description), 43 s (the Classical World named on the river), 52 s
(Hinduism's card), 68.5 s (the Middle Ages named; the Church's card waits), 71.5 s (the Church's
card), 100 s (the Mongol Empire's card), 160 s (ten rows, one joining from under the tenth), 194 s
(the Cold War named; the Holocaust's card waits), 250 s (ten rows), 260.6 s (the 2026 board, held),
265 s (end card).
