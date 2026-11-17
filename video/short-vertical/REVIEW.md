# Review: The River of Influence, vertical

Not rendered yet: the stills go to Geordie first. Render to
`/Volumes/Berthold/Landru/media/exports/shadowyrealm/river-of-influence-vertical.mp4`, 1080 x 1920,
30 fps, 1800 frames, 60.0 s. Data: the `/api/realm` snapshot in `assets/realm-data.js`, taken
2026-11-17: 624 entities as of 2026.

## Creative calls

- **Recomposed, not squeezed.** The river keeps its horizontal time axis and runs the frame's width,
  936 px, 54.2% of the landscape river's 1728 px, and gains height: half-height 300 px against 285.
  Turning it on its side would break the site's river and leave the labels nowhere to sit.
- **One column, top to bottom:** callout, river, year labels, year, source. Every word sits between
  y 168 and 1330; below that the app draws its own title and buttons, and the frame is bare ground.
- **The hook is on frame 0.** The landscape cut opens on an empty ground and lands the title word by
  word; here "Five thousand years of influence" is already set, because the feed shows the first
  frame before anyone taps.
- **The key sits either side of the axis it describes:** "Benefit rises above the line." just above
  y 700 and "Harm falls below it." just below, as the axis draws between them.
- **Type at 1.35 times the landscape sizes:** names 60 px, meta 38 px, year labels 38 px, the year
  100 px, the title 112 px (the largest at which "years of influence" fits the width).
- **Five year labels, not seven:** 500 BCE, 1000, 1700, 1900 and 2000, 130 px apart at 38 px.
- **Callouts in a narrow frame:** the words start at the band, or end there when they would pass the
  right margin; when neither fits, they end at the right margin over the band. The Atlantic slave
  trade (25 s) and the Roman Empire's No. 3 line (50.5 s) take the third case: each is wider than
  the space on either side of its band.
- **The end card is centred over the dimmed river (y 168 to 1020),** above the year labels. Centred
  in the whole band, its last line sat on the dimmed "1700"; `check` caught it.

## Measured

- `hyperframes check` (0.9.42): no errors, no warnings, contrast 38 of 38.
- The engine change leaves the landscape films untouched: 7 stills of the cut and 8 of the race,
  taken before and after, are pixel-identical. A replay of every callout in headless Chrome, sampled
  every 0.5 s, finds the new third case in neither (13 callouts in the cut, 29 in the race); the
  nearest is 305 px from it in the race and 443 px in the cut.
- Frames: stills at 0, 1.5, 10, 17, 25, 33, 40, 46.9, 48.7, 50.5 and 58 s, the review sheet, both
  seams, and the phone sheet, on which every line reads at 360 px wide.

## Not checked

- No render yet, so no loudness measurement; the bed is the cut's, measured at −15.6 LUFS and
  −2.7 dBTP in the landscape render.
- The layout has not been seen inside the YouTube app, under its real bars and rail.

## Weakest shot

4.4 to 5.0 s, as in the cut: the title has gone and the river is a sliver at the left edge while the
counter runs through the first centuries. Starting the front under the title's exit would fix it,
but the river's first buckets would then rise under the key's words, which start at the same x.
