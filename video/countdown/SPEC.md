# The countdown: The 10 worst things in history

GOAL: a stranger in the Shorts feed sees ten of history's worst things lit one at a time on the
finished river, No. 10 to No. 1, and at the end sees all ten burning together and where in time
they sit. Storyline A, Lights out (Geordie, 2026-11-28: "Worst, A"; the others are in
`STORYLINES.md`).

OUTPUT: HyperFrames, 1080 x 1920, 30 fps, a YouTube Short that loops: no title card, no end card,
the last frame is frame 0 pixel for pixel. TIME: 120 s x 30 = 3600 frames. Music only, no voice:
our own score, composed in SoundCraft as the session
`/Volumes/Berthold/Landru/media/exports/shadowyrealm/music/soundcraft/countdown/countdown-score.scraft`
and played by BBC SO Discover, on the race's themes in D minor. 90 bpm in 4/4: a beat is 0.667 s,
a bar 2.667 s, 120 s is 45 bars, and every card lands on a beat (`bun tools/music-cues.ts
countdown` prints them).

DATA: `assets/realm-data.js`, the frozen `/api/realm`. The ranking is benefit minus harm, lowest
first (`FILMS.countdown.ranking: "worst"`, `River.RANKINGS.worst`). The same build makes the other
four rankings by changing that key.

ENGINE: `assets/river.js`, `FILMS.countdown` and `River.countdownPlan`. The river is drawn finished
the whole film (the sweep's end plus 1 s) in the countdown's own frame. Each card holds for its
words (`River.readTime` of its rank, name, meta and description) plus 1 s, rounded up to whole
beats, from bar 3; the hook takes bars 1 and 2, and the outro the time left after No. 1 (at least
2 bars). Whole bars do not fit: the ten need 96.5 s of reading. For Worst:

| No. | Entity | Bar, beat | Lands | Beats |
| --- | --- | --- | --- | --- |
| 10 | Columbian exchange | 3, 1 | 5.333 s | 14 |
| 9 | Viking Age | 6, 3 | 14.667 s | 17 |
| 8 | Black Death | 10, 4 | 26.000 s | 12 |
| 7 | Age of Discovery | 13, 4 | 34.000 s | 17 |
| 6 | Three Kingdoms | 18, 1 | 45.333 s | 18 |
| 5 | Spanish conquest of the Inca Empire | 22, 3 | 57.333 s | 21 |
| 4 | Spanish Empire | 27, 4 | 71.333 s | 14 |
| 3 | Neo-Assyrian Empire | 31, 2 | 80.667 s | 20 |
| 2 | Atlantic slave trade | 36, 2 | 94.000 s | 12 |
| 1 | First Jewish–Roman War | 39, 2 | 102.000 s | 19 |
| outro | all ten, the title | 44, 1 | 114.667 s | 8 |

LOOK: the films' ground `#181822`, Inter (400, 700, 900), ink `#f8fafc`, muted `#94a3b8`, benefit
`#3e9ad6`, harm `#d9534f`. The material is light: the river at 12% opacity, the band in the card
at 100% with a 1.5 px ink edge, every band already counted at 50%. The harm share in the card's
meta line is the one accent, in harm red.

THE APP'S OWN UI: nothing in the top 168 px; every word between y 168 and 1330; below y 840 no word
passes x 936. The river's harm runs on below 1330 under the app's title and buttons.

GEOMETRY (px):
- The card, top to bottom from y 192: the rank "#10" in Inter 900, 176 px, at x 72; the picture,
  176 x 176 with a 12 px radius and a 2 px line border, its right edge at x 1008, its top at y 192;
  the name, 64 px 700, line height 72, at most two lines, from y 400; the meta ("Event · 1492–1700 ·
  82% harm"), 38 px 400 muted, the share in harm red, 14 px under the name; the description, 34 px
  400 in ink-2, line height 44, at most four lines, 18 px under the meta. Width 936 (x 72 to 1008).
  A description past four lines, or a name past two, stops the build: words are cut, never type.
- The ruler: the site's year labels, 38 px 400 muted, baseline y 852; grid lines from y 868 to the
  river's foot.
- The river: x 72 to 1008, the axis at y 1210, half-height 320 (benefit up to y 890, harm down to
  y 1530).
- The hook's title, "The 10 worst / things in / history", 132 px 700, line height 1.0, tracking
  −0.02 em, x 72, top y 196; under it, 36 px 400 muted, "Benefit minus harm · shadowyrealm.com".

MOTION: enter expo.out, exit power2.in, the bands' light inOut2. The number lands on its beat:
0.35 s from 1.12 scale and 6 px blur to 1 and sharp, origin its left baseline. The rest of the card
lands 0.12 s after it, 0.3 s blur to sharp, all at once, and holds still. The card leaves 0.2 s
(blur to 6 px) ending 0.15 s before the next card's beat. A band lights 0 to 100% over 0.45 s from
its beat; the band before falls to 50% over the same 0.45 s.

SHOTS:
- 0.0 to 4.8, the hook: the title, the source line and the ruler over the river, all ten bands lit
  at 100%. The river pushes in 3% from (540, 860), the ruler holding still.
- 4.8 to 5.1: the title and source line leave (0.3 s, power2.in, blurred); 4.9 to 5.3 the ten go
  dark to 0% and the push settles back to 100%.
- 5.333 to 114.667, the countdown: on each card's beat the number lands, its band lights, and the
  card is read; one card at a time, as the table.
- 114.3 to 114.5: No. 1's card leaves.
- 114.667 to 115.267: all ten rise to 100%; 114.9 to 115.4 the title and source line return
  (0.5 s, expo.out).
- 115.4 to 120.0: the frame is frame 0; the last frame is frame 0, pixel for pixel.

SOUND: the score's 0 s is the film's 0 s. Bar 1, the crest: a D minor chord blooming from soft in
the strings, winds and horns, no crash, drum or timpani at frame 0. Every card's beat: a low
stroke (timpani and basses, a bass drum from No. 5), each a step heavier from No. 10
to No. 1; under the cards an ostinato in the strings that thickens by the slot; the race's theme A
from No. 5, in the horns, then high in the strings for No. 1. Bar 44: the ten relight on a last
stroke, and bar 45 dies away into bar 1's soft chord, so the join is quiet. Mastered −16.0 LUFS,
−2.0 dBTP, no fades at either end, the bounce's tail past 120 s folded onto the start.

BANNED: as the vertical Short, plus a card that moves while it is read, more than one card on
screen, a number or card that lands off its beat, the river redrawn or swept (it is finished
from frame 0), words below y 1330 or under the rail, a black first frame, and a join anyone can see
or hear at the loop.

QA: 0 s and 3 s (the hook), 5.1 s (lights out), 5.6 and 10 s (No. 10), 16 s (No. 9), 36 s (No. 7),
59 s (No. 5, the longest name), 83 s (No. 3, the longest description), 96 s (No. 2), 103 and 112 s
(No. 1), 114.6 s (the outro starting), 116 s, and 119.967 s against frame 0.
