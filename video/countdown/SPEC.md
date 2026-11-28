# The countdown: The 10 worst things in history

GOAL: a stranger in the Shorts feed sees ten of history's worst things lit one at a time on the
finished river, No. 10 to No. 1, and at the end sees all ten burning together and where in time
they sit. Storyline A, Lights out (Geordie, 2026-11-28: "Worst, A"; the others are in
`STORYLINES.md`).

OUTPUT: HyperFrames, 1080 x 1920, 30 fps, a YouTube Short that loops: no title card, no end card,
the last frame is frame 0 pixel for pixel. TIME: 90.667 s x 30 = 2720 frames. Music only, no voice:
our own score, composed in SoundCraft as the session
`/Volumes/Berthold/Landru/media/exports/shadowyrealm/music/soundcraft/countdown/countdown-score.scraft`
and played by BBC SO Discover, on the race's themes in D minor. 90 bpm in 4/4: a beat is 0.667 s,
a bar 2.667 s, the film is 34 bars, and every card lands on a beat (`bun tools/music-cues.ts
countdown` prints them).

DATA: `assets/realm-data.js`, the frozen `/api/realm`. The ranking is benefit minus harm, lowest
first (`FILMS.countdown.ranking: "worst"`, `River.RANKINGS.worst`). The same build makes the other
four rankings by changing that key. Each card says why in one sentence: the first sentence of the
entity's narrative on the site (written by `tools/entity-narrative.ts`, 12 words at most), which the
snapshot stores as `media[slug].why` for every ranking's top ten. A card without one stops the
build.

ENGINE: `assets/river.js`, `FILMS.countdown` and `River.countdownPlan`. The river is drawn finished
the whole film (the sweep's end plus 1 s) in the countdown's own frame. Each card holds for its
words (`River.readTime` of its rank, name, meta and why) plus 1 s, rounded up to whole beats, from
bar 3; the hook takes bars 1 and 2, and the outro the time left after No. 1 (at least 2 bars). The
film is as long as its words: the ten need 64.1 s of reading, and the cards end on beat 125, so the
film is the next whole bar after a 2-bar outro, 34 bars (Geordie, 2026-11-28: 88 s is fine; the
120 s cut held its five-line descriptions up to 14 s). For Worst:

| No. | Entity | Bar, beat | Lands | Beats |
| --- | --- | --- | --- | --- |
| 10 | Columbian exchange | 3, 1 | 5.333 s | 11 |
| 9 | Viking Age | 5, 4 | 12.667 s | 12 |
| 8 | Black Death | 8, 4 | 20.667 s | 11 |
| 7 | Age of Discovery | 11, 3 | 28.000 s | 12 |
| 6 | Three Kingdoms | 14, 3 | 36.000 s | 12 |
| 5 | Spanish conquest of the Inca Empire | 17, 3 | 44.000 s | 12 |
| 4 | Spanish Empire | 20, 3 | 52.000 s | 11 |
| 3 | Neo-Assyrian Empire | 23, 2 | 59.333 s | 12 |
| 2 | Atlantic slave trade | 26, 2 | 67.333 s | 12 |
| 1 | First Jewish–Roman War | 29, 2 | 75.333 s | 12 |
| outro | all ten, the title | 32, 2 | 83.333 s | 11 |

LOOK: the films' ground `#181822`, Inter (400, 700, 900), ink `#f8fafc`, muted `#94a3b8`, benefit
`#3e9ad6`, harm `#d9534f`. The material is light: the river at 12% opacity, the band in the card
at 100% with a 1.5 px edge in its own colour (so a thin benefit side reads blue), every band
already counted at 40%. The harm share in the card's
meta line is the one accent, in harm red.

THE APP'S OWN UI: nothing in the top 168 px; every word between y 168 and 1330; below y 840 no word
passes x 936. The river's harm runs on below 1330 under the app's title and buttons.

GEOMETRY (px):
- The card, top to bottom from y 192: the rank "#10" in Inter 900, 160 px, at x 72; the picture,
  160 x 160 with a 12 px radius and a 2 px line border, its right edge at x 1008, its top at y 192;
  the name, 64 px 700, line height 72, at most two lines, from y 376; the meta ("Event · 1492–1700 ·
  82% harm"), 38 px 400 muted, the share in harm red, 14 px under the name; why, one word at a
  time, 120 px 900 in ink (a word with a digit in harm red), tracking −0.02 em, its box from y 640
  at x 72. A word lands on an eighth note from 1.5 beats after the rank (two eighths for a word
  with a digit or of nine letters or more), 1.18 times its size settling in 0.14 s, and stays until
  the next; the last stays until the card leaves (`FILMS.countdown.captions`). A name past two
  lines, a meta line ending below y 616, a word wider than 900 px, or words that run past the card's
  leaving stops the build: words are cut, never type. The fit is measured 900 px wide, since the Studio preview and the
  headless renderer break lines a few pixels apart.
- The ruler: the site's year labels, 38 px 400 muted, baseline y 900; grid lines from y 916 to the
  river's foot.
- The river: x 72 to 1008, the axis at y 1250, half-height 316 (benefit up to y 934, harm down to
  y 1566).
- The hook's title, "The 10 worst / things in / history", 132 px 700, line height 1.0, tracking
  −0.02 em, x 72, top y 196; under it, 36 px 400 muted, "Benefit minus harm · shadowyrealm.com".

MOTION: enter expo.out, exit power2.in, the bands' light inOut2. The number lands on its beat:
0.35 s from 1.12 scale and 6 px blur to 1 and sharp, origin its left baseline. The rest of the card
lands 0.12 s after it, 0.3 s blur to sharp, all at once, and holds still. The card leaves 0.2 s
(blur to 6 px) ending 0.15 s before the next card's beat. A band lights 0 to 100% over 0.45 s from
its beat; the band before falls to 40% over the same 0.45 s.

SHOTS:
- 0.0 to 4.8, the hook: the title, the source line and the ruler over the river, all ten bands lit
  at 100%. The river pushes in 3% from (540, 900), the ruler's baseline.
- 4.8 to 5.1: the title and source line leave (0.3 s, power2.in, blurred); 4.9 to 5.3 the ten go
  dark to 0% and the push settles back to 100%.
- 5.333 to 83.333, the countdown: on each card's beat the number lands, its band lights, and the
  card is read; one card at a time, as the table.
- 82.983 to 83.183: No. 1's card leaves.
- 83.333 to 83.933: all ten rise to 100%; 83.566 to 84.066 the title and source line return
  (0.5 s, expo.out).
- 84.066 to 90.667: the frame is frame 0, held (`data-hold` on the titles); the last frame is frame
  0, pixel for pixel.

SOUND: the score's 0 s is the film's 0 s. Bar 1, the crest: a D minor chord blooming from soft in
the strings, winds and horns, no crash, drum or timpani at frame 0. Every card's beat: a low
stroke (timpani and basses, a bass drum from No. 5), each a step heavier from No. 10
to No. 1; under the cards an ostinato in the strings that thickens by the slot; the race's theme A
from No. 5, in the horns, then high in the strings for No. 1; in a card shorter than 18 beats the
theme stops two beats before the next card, on the dominant. Bar 32, beat 2: the ten relight on a
last stroke, and bars 33 and 34 die away into bar 1's soft chord, so the join is quiet. Mastered
−16.0 LUFS, −2.0 dBTP, no fades at either end, the bounce's tail past 90.667 s folded onto the
start.

BANNED: as the vertical Short, plus a card that moves while it is read, more than one card on
screen, a number or card that lands off its beat, the river redrawn or swept (it is finished
from frame 0), words below y 1330 or under the rail, a black first frame, and a join anyone can see
or hear at the loop.

QA: 0 s and 3 s (the hook), 5.1 s (lights out), 5.9 and 10 s (No. 10), 13.5 s (No. 9), 30 s
(No. 7), 44.8 s (No. 5, the longest name), 60.1 s (No. 3), 68 s (No. 2), 76.1 and 82 s (No. 1),
83.2 s (the outro starting), 85 s, and 90.633 s against frame 0.
