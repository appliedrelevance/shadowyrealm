# The River of Influence: the race

GOAL: five minutes of history arriving left to right, with a leaderboard that keeps changing hands,
ending on the turn that the most influential of all are ancient threads, not the loud recent century.

OUTPUT: HyperFrames, 1920 x 1080, 30 fps. TIME: 300 s x 30 = 9000 frames. Music bed only, no voice.

SHARED WITH THE 60-SECOND CUT (`../`): the data snapshot, the river engine (`assets/river.js`,
`FILMS.race` holds this film's clock and frame), its stylesheet, the intro and the end card. Each is
a symlink to its one home in `../assets` and `../compositions`.

LOOK: as the 60-second cut (`../SPEC.md`): the site's ground, ink, benefit and harm tokens; Inter
only; tabular figures on every number.

GEOMETRY:
- river x 96 to 1250, axis at y 530, half-height 285; callouts above it, anchored inside x 1250
- leaderboard x 1320 to 1824: the year at 96 px (top 140), the era at 34 px (top 254), the caption
  "Most influential that year" at 28 px (top 318), five rows 92 px apart from y 380
- a row: name 30 px 700 (words dropped from the end past 456 px, never smaller type), a 20 px bar
  split into benefit then harm, scaled to the leader at 350 px, the value right-aligned at 28 px
- source line bottom left, 28 px

OBJECTS:
- the river and its front as in the 60-second cut, with a camera: the view is the larger of a
  fifth of the axis and the front ÷ 0.8, capped at the whole axis, with smooth corners (k 0.04). The
  river fills the frame from the first minute and compresses into history as centuries arrive; the
  last frames show the whole axis, as the site does
- the leaderboard ranks every entity by its benefit plus harm in the year at the front, linear
  between buckets. A row's place is its rank averaged over the last 0.35 s; whether it shows at all
  is its rank averaged over the last 1 s. The higher-ranked row passes over the lower one on an
  opaque ground-coloured backing
- callouts every 4 s (hold 3 s), the biggest entity by own influence starting there; words stay
  where they land and the leader's foot follows the band under the camera

SHOTS:
- 0.0 to 4.6: the intro from the 60-second cut over the empty river
- 4.2 to 280.2: the sweep, 3500 BCE to 2026 in 276 s; eras land in the panel as the front crosses
  their first year (chapters: `bun tools/video-chapters.ts`)
- 282.6, 285.4, 288.2: the all-time top three by total influence, lit in turn, hold 2.3 s each
- 292.0 to 300.0: the river and the panel dim; the end card

SOUND: `assets/music/race-bed.m4a`: ACE-Step take 11 (240 s, two slow swells) lowered 2.7 dB and
crossfaded over 4 s into the 60-second cut's take 91, so take 91's closing build, through the top
three and the end card, is the loudest stretch of the film; levelled to −16 LUFS, −1.6 dBTP. Fade
in 1.5 s, out over the last 3 s.

BANNED: as `../SPEC.md`, plus rows jittering between places, names flashing onto the board for less
than half a second, a dead centre of the frame while the river is still young.

QA: 12 s (the young river, four on the board), 30 s and 60 s (the camera filling the frame), 115 s
(a pass: one row over the other), 205 s (1939), 272 s (2026, the whole axis), 285.6 s (No. 2),
296 s (end card).
