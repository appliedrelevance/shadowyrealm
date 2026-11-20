# The River of Influence, vertical: the loop

GOAL: the series trailer as a YouTube Short that loops. A Short replays as soon as it ends, so the
first frame is the hook and the last frame runs straight back into the first (Geordie, 2026-11-18:
hook first, then the slow build, no title or end card, big titles instead). The finished river
opens under the title with the music's climax, drains back to its source, refills over five
thousand years with the music building, and arrives where it started.

OUTPUT: HyperFrames, 1080 x 1920, 30 fps. TIME: 110 s x 30 = 3300 frames. Music only, no voice:
`assets/music/mountain-king-loop.m4a`, Grieg's *In the Hall of the Mountain King* (public domain),
arranged from his piano arrangement for BBC Symphony Orchestra Discover by
`video/music/mountain_king.py` (Geordie, 2026-11-20). The loop: the crest first, a B minor chord
and a last stroke at 3.16 s, silence while the river drains, then from 5.6 s the horns' F# and six
statements accelerating from 76 to 177 bpm into the chord. Mastered −16.0 LUFS, −2.0 dBTP. No
fades at either end.

ENGINE: `assets/river.js`, `FILMS.shortLoop`: the vertical frame of `FILMS.shortVertical` with a
110 s clock and a hook. Its `draw(t)` takes the hook as a remap of time: before 5.0 s the river is
drawn finished (the sweep's end plus 1 s), from 5.0 to 5.6 s it runs back to the sweep's start
(power2.inOut), and from 5.6 s the sweep plays as written; nothing is called out in the hook or the
drain. The landscape films have no hook and draw as before.

THE APP'S OWN UI: nothing in the top 168 px; every word between y 168 and 1330. Below 1330 the app
lays its title, channel and buttons over the video, so only the picture goes there. The action rail:
below y 840, no word passes x 936.

GEOMETRY: as the vertical cut. The year counter (x 72, top y 200, 132 px 700) and the source line
(top y 352, 36 px) at the top, the year labels as a ruler (baseline y 462, 38 px), callouts at
y 556/610 (60/38 px), the river x 72 to 1008 with its axis at y 1090 and half-height 420.

THE TITLES (`compositions/titles.html`): "5,000 years / of influence", 112 px 700, x 72, top y 196;
the key "Benefit above the line. / Harm below it.", 52 px 600, x 72, top y 640, in the empty ground
above the finished river's left half (its benefit starts below y 800 there), clear of the bands.

SHOTS:
- 0.0 to 5.0, the hook: the finished river at 2026, the ruler, the titles; the year and source are
  off. The river pushes in 3.5% from the ruler (origin 540, 470), so the ruler and titles stay put
- 4.7 to 5.0: the titles leave (0.3 s, power2.in, blurred); 5.0 to 5.25 the year and source arrive
- 5.0 to 5.6, the drain: the river runs back to its source, the front and the year rewinding from
  2026 to 3500 BCE, the push settling back to full size
- 5.6 to 104.0, the sweep: the front crosses the axis in 98.4 s; a callout at least 3.4 s apart,
  held 2.4 s, none after 100.5 s
- 104.0 to 104.6: the front fades; the river is finished
- 106.5 to 107.1: the year and source leave; 106.9 to 107.4 the titles return (0.5 s, expo.out)
- 107.4 to 110.0: the frame is the hook's first frame; the last frame is frame 0, pixel for pixel

BANNED: as the cut, plus a title or end card, words below y 1330 or under the rail, a black or empty
first frame, a join anyone can see or hear at the loop, and the landscape film scaled into the frame.

QA: 0 s and 3 s (the hook), 5.2 and 5.45 s (the drain), 10, 30, 55, 70 and 90 s (the build and its
callouts), 104 s (2026), 107.6 s (the titles back), 109.966 s (the last frame, against frame 0).
