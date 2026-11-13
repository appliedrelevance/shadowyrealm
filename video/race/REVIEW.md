# Review: The River of Influence, the race

Render: `/Volumes/Berthold/Landru/media/exports/shadowyrealm/river-race.mp4`, 1920 x 1080, 30 fps,
9000 frames, 300.0 s, H.264 and AAC. Beside it: a contact sheet cut from the render, and
`river-race.chapters.txt`, the YouTube chapters printed by `bun tools/video-chapters.ts`.

## Creative calls

- **The leaderboard ranks the year at the front**, not all time: benefit plus harm in that year,
  linear between the axis buckets, so values glide. Bars split benefit then harm and scale to the
  leader. The all-time ranking is the finale's job.
- **Two smoothing windows.** Place is rank averaged over 0.35 s, so an overtake is a quick glide;
  joining or leaving the board is rank averaged over 1 s, so a brief visit stays off. Rows carry a
  ground-coloured backing and the higher-ranked row passes over the lower one.
- **A camera for the race only.** On the log axis the first 3,500 years take a fifth of the width,
  so without it the frame's centre was empty for the first minute. The view widens with the front,
  which holds 80% of the way across; the last frames show the whole axis, as the site does.
- **Callouts every 4 s** instead of 2.55 s: the board already changes constantly, and the river
  is 1154 px wide instead of 1728.
- **Eras are my boundaries**: the First Cities, the Iron Age (1200 BCE), the Classical World
  (500 BCE), the Middle Ages (500), the Early Modern World (1450), the Industrial Age (1760), the
  World Wars (1914), the Cold War (1947), the Digital Age (1991). They live in `River.ERAS`; the
  chapters tool reads the same list.
- **Music**: ACE-Step tops out at 240 s, so the bed is take 11 (two slow swells, chosen of three
  for that shape) lowered 2.7 dB and crossfaded into the 60-second cut's take 91, whose build
  carries the finale and the end card.
- **One engine for both films.** `../assets/river.js` now draws the 60-second cut too; its frames
  are pixel-identical to the committed version at 10, 25, 40 and 48.7 s (PSNR infinite).

## Measured

- `hyperframes check`: no errors. One warning kept: `line_unread` on "Hundred Years' War", in fifth
  place for 0.53 s at 119 s. A longer stay window would hide it and make every pass lag; churn in
  the last slot is the genre.
- Audio from the rendered file: −16.1 LUFS integrated, −1.3 dBTP true peak, no clipping, loudest
  at 4:55 under the end card. The first mix peaked at 3:07 in the Industrial Age and was remixed.
- Frames: 20 stills across the film, a zoomed strip through an overtake (115 to 121 s), and the
  contact sheet from the render.

## Not checked

- The music was measured, not heard.
- Nobody has watched the 9000 frames end to end; the stills and the overtake strip are the sample.

## Weakest shot

4.2 to 16 s: the young river is a small lens at the left edge while the camera is still at its
widest-allowed zoom, and the fifth slot on the board stays empty until a fifth entity exists.
With more time: start the minimum view at a tenth of the axis, so the first cities fill the frame.
