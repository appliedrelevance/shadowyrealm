# Review: The River of Influence, vertical

Render: `/Volumes/Berthold/Landru/media/exports/shadowyrealm/river-of-influence-vertical.mp4`,
1080 x 1920, 30 fps, 1800 frames, 60.0 s, H.264 and AAC, rendered 2026-11-18 in 1 min 16 s.
Contact sheet beside it. Since the render, the end card's count runs to three lines and names the
3,374 links of influence, both numbers in bold; re-render before upload. Data: the `/api/realm` snapshot in `assets/realm-data.js`, taken
2026-11-17: 624 entities as of 2026.

## Creative calls

- **Recomposed, not squeezed.** The river keeps its horizontal time axis and runs the frame's width,
  936 px, 54.2% of the landscape river's 1728 px. Turning it on its side would break the site's
  river and leave the labels nowhere to sit.
- **Words at the top, the river below them, reaching into the bottom third** (Geordie, second pass:
  use the blank space). The app lays its title, channel and buttons over the bottom of a Short, so
  no word goes below y 1330, but the picture can: the axis sits at y 1090 and the river's harm half
  runs to y 1510, under the app's overlay. The river is 840 px tall, against 600 in the first pass.
- **The year is the clock at the top,** 132 px, with the source line under it, then the year labels
  as a ruler (500 BCE, 1000, 1700, 1900, 2000) with their grid lines hanging through the callout to
  the river, then the callout itself.
- **The hook is on frame 0.** The landscape cut opens on an empty ground and lands the title word by
  word; here "Five thousand years of influence" is already set over the empty river, because the
  feed shows the first frame before anyone taps.
- **The key sits either side of the axis it describes:** "Benefit rises above the line." just above
  y 1090 and "Harm falls below it." just below, as the axis draws between them.
- **Type at 1.35 times the landscape sizes:** names 60 px, meta and year labels 38 px, the title
  112 px (the largest at which "years of influence" fits the width).
- **Callouts in a narrow frame:** the words start at the band, or end there when they would pass the
  right margin; when neither fits, they end at the right margin over the band. The Atlantic slave
  trade (25 s) and the Roman Empire's No. 3 line (50.5 s) take the third case: each is wider than
  the space on either side of its band.
- **Vaal is the mark** (Geordie: the logo, not the drawn gate; then a graphic with an alpha
  channel, not the photo). The end card shows `src/sites/shadowyrealm/vaal-mark.png`, 240 px, over
  the dimmed river in y 500 to 1330, below the dimmed ruler; the river shows around it. The URL is 84 px so that it ends
  by x 927, clear of the action rail: at 88 px it reached x 945.

## Measured

- `hyperframes check` (0.9.42): no errors, no warnings.
- The engine changes leave the landscape films untouched: 6 stills of the cut and 7 of the race,
  taken before and after, are pixel-identical; only the end card differs, where Vaal replaces the
  gate mark. A replay of every callout in headless Chrome, sampled every 0.5 s, finds the new third
  case in neither (13 callouts in the cut, 29 in the race); the nearest is 305 px from it in the
  race and 443 px in the cut.
- The rail: the ink of every word below y 840 ends by x 927 (measured on the 0, 1.5 and 58 s
  frames).
- Frames: stills at 0, 1.5, 10, 17, 25, 33, 40, 46.9, 48.7, 50.5 and 58 s, the review sheet, both
  seams, and the phone sheet, on which every line reads at 360 px wide.
- Audio from the rendered file: −15.6 LUFS integrated, −2.7 dBTP true peak, the cut's mix.
- The frame at 58 s cut from the render shows the graphic mark over the dimmed river, as in the
  58 s still.

## Not checked

- The layout has not been seen inside the YouTube app, under its real bars, overlay and rail.

## Weakest shot

4.4 to 5.0 s, as in the cut: the title has gone and the river is a sliver at the left edge while the
counter runs through the first centuries. Starting the front under the title's exit would fix it,
but the river's first buckets would then rise under the key's words, which start at the same x.
