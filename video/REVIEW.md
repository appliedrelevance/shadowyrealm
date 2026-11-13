# Review: The River of Influence

Render: `/Volumes/Berthold/Landru/media/exports/shadowyrealm/river-of-influence.mp4`, 1920 x 1080,
30 fps, 1800 frames, 60.0 s, H.264 and AAC. Contact sheet beside it. Data: the `/api/realm` snapshot
in `assets/realm-data.js`, 624 entities as of 2026.

## Creative calls

- **The vertical scale follows the front.** It is the tallest column revealed so far, so the
  ancient world fills the frame at 10 s and is pressed down as each later age rises. The last frame
  is the home page's scale exactly.
- **The river swells behind a front** rather than being wiped on: each bucket grows from nothing
  over 5% of the axis, so the newest century is always rising.
- **Callouts name the biggest entity by own influence** starting in each 2.55 s of the sweep, one
  at a time, with its band lit and the rest at 0.65.
- **The finale is the all-time top three by total influence**: Ancient Egypt, the Maya and
  Hinduism. All three are thin ancient threads on the finished river, which turns the film: the
  swollen twentieth century is not where the most influence lies.
- **No names on the bands at the end.** At 1920 px the bands are thinner than 28 px type, so the
  home page's band labels place nothing; the finale replaced them.
- **Inter only.** The site names Cinzel as its display face, but never loads it, so the live site
  shows Times New Roman. The film uses the face the site actually renders for body text.
- **Music**: ACE-Step take with seed 91 of three, chosen because its loudness rises from −22 to
  −12 dB RMS across the minute; the other two are flat or fade.

Not built: the Lineage Short (one chain lighting up with its shares) and the Prior Art Short
(relationship types). The snapshot tool takes `inventions` for the second.

## Measured

- `hyperframes check`: no errors. One warning kept: `composition_file_too_large` on
  `compositions/river.html` (330 lines). The scene is one draw function over one data set;
  splitting it would separate the drawing from the layout it computes.
- Audio from the rendered file: −15.6 LUFS integrated, −2.7 dBTP true peak, no clipping. Its
  loudest moment is at 50.15 s, on the No. 3 callout, just before the end card.
- Frames: the review sheets, the phone-width sheet (every callout reads at 360 px), both seams,
  and a contact sheet cut from the rendered file.

## Not checked

- The music was measured, not heard.
- The Studio preview was scrubbed to 25 s only; playback in it was not watched end to end.

## Weakest shot

4.4 to 5.0 s: the title has gone and the river is still a few pixels wide at 4.8 s while the
counter runs through the first centuries. With more time: start the front under the title's exit,
or start the axis at the first entity (3300 BCE) instead of the site's 3500 BCE.
