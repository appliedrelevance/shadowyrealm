# The River of Influence: the race

GOAL: five minutes of history arriving left to right, with a leaderboard that keeps changing hands,
ending on the turn that the most influential of all are ancient threads, not the loud recent century,
and saying why at each turn: who a leader is and what it did, where a score's credit comes from, and
why all time differs from any one year.

OUTPUT: HyperFrames, 1920 x 1080, 30 fps. TIME: 300 s x 30 = 9000 frames. Music bed only, no voice.

SHARED WITH THE 60-SECOND CUT (`../`): the data snapshot and its pictures, the river engine
(`assets/river.js`, `FILMS.race` holds this film's clock and frame), its stylesheet, the intro and the
end card. Each is a symlink to its one home in `../assets` and `../compositions`. The race's own
panel pieces are `assets/race-kit.js` (pictures, rows, bars) and `assets/race.css`.

LOOK: as the 60-second cut (`../SPEC.md`): the site's ground, ink, benefit and harm tokens; Inter
only; tabular figures on every number. Text meant to be read is at least 28 px.

GEOMETRY:
- river x 96 to 1250, axis at y 530, half-height 285; callouts above it, anchored inside x 1250;
  the source line top left (x 96, top 64)
- panel x 1320 to 1824: the year at 96 px (top 140), the era at 34 px (top 254), the caption at
  28 px (top 318), five rows 92 px apart from y 380
- a row: a 64 px picture, the name 30 px 700 beside it (words dropped from the end past 376 px,
  never smaller type), a 20 px bar split into benefit then harm: 376 px for the leader in the race,
  256 px beside a 28 px value in the tally
- the lower third x 96 to 1250, top 888: a 112 px picture, a 28 px line (the name in 700, the
  reasons in 400 behind benefit or harm swatches), and up to three 28 px lines of the site's text

OBJECTS:
- the river and its front as in the 60-second cut, with a camera: the view is the larger of a
  fifth of the axis and the front ÷ 0.8, capped at the whole axis, with smooth corners (k 0.04)
- the leaderboard (`race-board`) ranks every entity by its own benefit plus harm in the year at the
  front, linear between buckets. The bars carry the ranking without numbers: the curve's level is
  influence per century, a unit the site never shows. A row's place is its rank averaged over the
  last 0.35 s; whether it shows at all is its rank averaged over the last 1 s. The higher-ranked row
  passes over the lower one on an opaque ground-coloured backing
- pictures: each board entity's Wikimedia thumbnail, frozen by `tools/video-snapshot.ts` as one
  sRGB still cropped square. An entity with no free picture shows the site's type icon
- callouts every 4 s (hold 3 s), the biggest entity by own influence starting there
- the lower third (`race-card`): a card the first time each entity leads the board for 3 s or more,
  with the two largest areas of its own profile and its description from the site. It holds 0.5 s
  plus 0.3 s a word, at most 12 s, and leaves 0.4 s before the next. When the words do not fit the
  time or three lines, the description goes and the name and reasons stay
- the credit beat (`race-tally`): the entity whose score is most credit, chosen from the data. Its
  band and its consequences' bands light row by row, with a thread from each consequence's first
  year back to it. The tally shows its own influence, its three largest consequences and the rest,
  in whole numbers that add up to its total; the lower third gives its link to its largest
  consequence in the site's words
- all time (`race-tally`): the top five by total influence, values in the site's own numbers,
  captioned "Every year added together"; the top three on the river each give their span in years

SHOTS:
- 0.0 to 4.6: the intro from the 60-second cut over the empty river
- 4.2 to 272.2: the sweep, 3500 BCE to 2026 in 268 s; eras land in the panel as the front crosses
  their first year; a card under the river for each new leader (chapters:
  `bun tools/video-description.ts`)
- 272.8 to 280.4: the credit beat; one row every 0.8 s from 273.3
- 281.0: the panel turns to all time
- 282.6, 285.4, 288.2: the all-time top three lit in turn on the river and the board, hold 2.3 s each
- 292.0 to 300.0: the river and the panel dim; the end card

SOUND: `assets/music/race-bed.m4a`: ACE-Step take 11 (240 s, two slow swells) lowered 2.7 dB and
crossfaded over 4 s into the 60-second cut's take 91, so take 91's closing build, through the top
three and the end card, is the loudest stretch of the film; levelled to −16 LUFS, −1.6 dBTP. Fade
in 1.5 s, out over the last 3 s.

BANNED: as `../SPEC.md`, plus rows jittering between places, names flashing onto the board for less
than half a second, a dead centre of the frame while the river is still young, text under 28 px, a
card on screen for less than its words, a picture that moves, a picture its licence does not let us
show.

QA: 12 s (Ancient Egypt's card, with its description), 30 s and 60 s (the camera filling the frame),
106 s (the Mongol Empire's card), 115 s (a pass: one row over the other), 200 s (1939), 262 s
(2026: COVID-19, the United States, HIV/AIDS, the World Wide Web, Michael Jackson), 276.6 s (the
credit beat, threads drawing), 281.5 s (all time arriving), 286.4 s (No. 2), 296 s (end card).
