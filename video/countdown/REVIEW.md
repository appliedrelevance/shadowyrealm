# Review: The countdown, The 10 worst things in history

Rendered 2026-11-28 with hyperframes 0.9.42 to
`/Volumes/Berthold/Landru/media/exports/shadowyrealm/river-countdown-worst.mp4`: 1080 x 1920,
30 fps, 3600 frames, 120.000 s, 11.0 MB, with its contact sheet beside it
(`river-countdown-worst-contact-sheet.png`, the hook, the ten cards and the outro) and its
description and credits (`river-countdown-worst.description.txt`, `.credits.txt`). Data: the
`/api/realm` snapshot in `assets/realm-data.js`, taken 2026-11-28; its scores, links and timeline
match 2026-11-17's exactly. The render took 2 min 54 s.

**After every render, swap in the bed**, as the vertical Short does: the export carries the video
stream from the render and the score itself, both copied, not re-encoded:

```bash
ffmpeg -i render.mp4 -i assets/music/countdown-score.m4a -map 0:v -map 1:a -c copy -movflags +faststart river-countdown-worst.mp4
```

## Creative calls

- **Lights out** (Geordie, 2026-11-28: "Worst, A"). The river is finished from frame 0 and dark at
  12%; each card's band lights at full strength in its own colours as its number lands, and stays at
  40% once counted, so by No. 1 the ten burn together. Six of the ten began in the 186 years from the
  Black Death (1346) to the conquest of the Inca Empire (1532), and the lit bands show it.
- **A loop, the answer first.** The hook is the end state: the title over all ten lit bands. At
  4.9 s they go dark and No. 10 lands at 5.333 s; after No. 1 they relight under the title, and the
  last frame is frame 0. No title or end card; `shadowyrealm.com` is in the method line and the
  description.
- **On the beat, not the bar.** Every card holds for its words at 0.3 s a word plus 1 s. Rounded
  to whole bars at 90 bpm the ten did not fit 120 s (they need 96.5 s of reading), so each lands on
  a beat, some mid-bar, and the score's strokes follow them.
- **The card carries the why.** Rank, picture, name, kind and span, the harm share in harm red, and
  the site's own description, up to five lines. The type never shrinks; a card that does not fit
  stops the build.
- **The holds are deliberate** (`data-hold` on the card): a card holds still for 8 to 14 s while it
  is read, the river and the music moving under it.
- **The bands' edges are their own colour.** An ink edge drew the thin benefit side of a mostly-harm
  band as a white line; edged in benefit blue it reads as benefit.

## Measured

- `hyperframes check` (0.9.42): no errors, no warnings.
- The card's fit is measured in a probe 900 px wide, 36 px narrower than the card: the Studio
  preview set the Inca's description in four lines and the headless renderer in five. With the
  limit set to four lines the check reports the card as a page error, so the probe throws where it
  should. The longest card, the Inca's, ends at y 818; the ruler's labels start at y 862.
- The engine change leaves the 60-second cut, the race and the vertical Short pixel-identical:
  nine stills compared before and after, 0 pixels apart, and the race and the Short again on the
  refreshed snapshot, 0 pixels apart. The race's description and credits are byte-identical to the
  published files.
- The seam, picture: the snapshots at 0 and 119.967 s differ in no pixel. In the encode, frame 3599
  against frame 0 is 47.0 dB PSNR, H.264 noise (the Short's: 43.7 dB).
- The seam, sound: the last 0.1 s at −27.4 dBFS RMS, the first 0.1 s at −27.0; the audio sounds from
  its first sample.
- The export's loudness: −16.1 LUFS, −1.8 dBTP. Video and audio both 120.000 s.
- The strokes, below 200 Hz in the score (two passes of `lowpass=f=200`), the 230 ms after each
  card's beat against the 220 ms before: No. 10 +18.9 dB, No. 9 +15.8, No. 8 +12.4, No. 7 +8.6,
  No. 6 +17.1, No. 5 +19.7, No. 4 +16.7, No. 3 +16.7, No. 2 +16.0, No. 1 +8.9, the outro +1.3 (after
  No. 1's timpani roll). No. 7's was +0.9 dB in the first master; its stroke is no longer trimmed
  with the accompaniment under the theme. The score's own figures are in `video/music/README.md`.
- Stills at 0, 3, 5.1, 5.6, 10, 14.35 to 15.1 (the change from No. 10 to No. 9), 16, 27, 36, 59, 83,
  96, 103, 112, 114.6, 116 and 119.967 s.

## Not checked

- Nobody has watched the film loop end to start in a player, and nobody has heard the score. The
  music is measured, not heard, and not judged against the picture.
- YouTube re-encodes the upload, and the Shorts player's restart sets the seam viewers hear.
- The layout has not been seen inside the YouTube app; the lit bands' early stretches (y 1380 to
  1460, x 450 to 600) sit under where the app lays its title.
- The other four rankings build from the same code with `FILMS.countdown.ranking`, but none has been
  rendered.

## Weakest shot

No. 5, the Spanish conquest of the Inca Empire (57.333 to 71.333 s): the longest hold, 14.0 s on
one still card (No. 3 holds 13.3 s), the slowest stretch in a feed where a beat lands every 2 to 4 s.
Only the music moves once the band has lit.
