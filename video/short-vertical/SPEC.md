# The River of Influence, vertical

GOAL: the 60-second cut as a YouTube Short, the series trailer in the Shorts feed. The same film as
`video/` (its SPEC holds the story, the look and the motion); this one is recomposed for a phone,
not squeezed.

OUTPUT: HyperFrames, 1080 x 1920, 30 fps. TIME: 60 s x 30 = 1800 frames. Music bed only, no voice:
`assets/music/river-bed.m4a`, the cut's own bed.

ENGINE: `assets/river.js`, `FILMS.shortVertical`: the cut's clock and callouts with its own frame.
Every frame's geometry and type sizes live in `FILMS`, so the landscape films are untouched.

THE APP'S OWN UI: nothing in the top 168 px; every word between y 168 and 1330; below 1330 only the
ground. The action rail: below y 840, no word passes x 936.

GEOMETRY:
- river x 72 to 1008 (936 px), axis at y 700, half-height 300 (y 400 to 1000); the front and grid
  lines y 380 to 1020
- callouts: name baseline y 290 at 60 px 700, meta baseline y 344 at 38 px 400, leader from y 368
  down to the crest. The words start at the band, or end there when they would pass x 1008; when
  neither fits they end at x 1008, still over the band
- tick labels: baseline y 1068, 38 px, at least 130 px apart, ending by x 936: 500 BCE, 1000, 1700,
  1900, 2000
- year counter: x 72, top y 1110, 100 px 700, tabular figures
- source line: x 72, top y 1240, 36 px 400
- type is 1.35 times the landscape sizes (44, 28, 76 px)

SHOTS:
- frame 0: the hook, already set: "Five thousand / years of influence", 112 px 700, x 72, top y 330,
  on the empty ground. It is the first impression in the feed
- 0.15 to 2.35: the axis draws left to right at y 700; the key lands either side of it, blurred to
  sharp in 0.2 s: "Benefit rises above the line." above it at 0.5 s (top y 628), "Harm falls below
  it." below it at 0.9 s (top y 724), 48 px 400 muted
- 3.95 to 4.3: the title leaves word by word, 0.04 s apart, then the key
- 4.2 to 46.2: the sweep, as the cut: the front crosses the axis in 42 s, callouts at least 2.55 s
  apart, none after 44 s
- 46.5, 48.3, 50.1: the all-time top three, "No. N of 624"
- 52.0 to 60.0: the river dims to 0.22; the end card is centred over it in y 168 to 1020, above the
  year labels: the gate mark 180 px, `shadowyrealm.com` 96 px 700, "Who shaped the world, / for
  better and for worse?" 52 px, and the count on two lines at 40 px muted

BANNED: as the cut, plus words below y 1330 or under the rail, a black or empty first frame, and
the landscape film letterboxed or scaled into the frame.

QA: 0 s (the hook), 1.5 s (the key either side of the axis), 10, 17, 25, 33 and 40 s (callouts at
both anchors), 46.9, 48.7 and 50.5 s (the top three), 58 s (end card).
