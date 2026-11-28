# Review: The countdown, The 10 worst things in history

Rendered 2026-11-28 with hyperframes 0.9.42 to
`/Volumes/Berthold/Landru/media/exports/shadowyrealm/river-countdown-worst.mp4`: 1080 x 1920,
30 fps, 2720 frames, 90.667 s (34 bars at 90 bpm), 9.6 MB, with its contact sheet beside it
(`river-countdown-worst-contact-sheet.png`: the hook, lights out, the ten cards and the outro) and
its description and credits (`river-countdown-worst.description.txt`, `.credits.txt`). The render
took 45 s. The first cut, 120 s with each card's five-line description, is beside it as
`river-countdown-worst-120s.*`, and its score session as
`music/soundcraft/countdown/Backups/countdown-score-120s-2026-11-28.scraft`.

Data: the `/api/realm` snapshot in `assets/realm-data.js`, refreshed 2026-11-28 after the ten
entities' narratives were stored; scores, links and timeline unchanged.

**After every render, swap in the bed**, as the vertical Short does: the export carries the video
stream from the render and the score itself, both copied, not re-encoded:

```bash
ffmpeg -i render.mp4 -i assets/music/countdown-score.m4a -map 0:v -map 1:a -c copy -movflags +faststart river-countdown-worst.mp4
```

## Creative calls

- **Lights out** (Geordie, 2026-11-28: "Worst, A"). The river is finished from frame 0 and dark at
  12%; each card's band lights at full strength in its own colours as its number lands, and stays at
  40% once counted, so by No. 1 the ten burn together. After No. 1 they relight under the title, and
  the last frame is frame 0.
- **One line of why** (Geordie, 2026-11-28, on the first cut: "unsatisfying to watch… I'd like to
  see a text description of why", then "Nobody cares about the details at all. Just a very brief
  sentence"). Each card's only text under its name and meta is the line of the entity's narrative,
  12 words at most, in 52 px semibold ink: what was done, and to whom. The site's description is
  gone from the card.
- **One word at a time** (Geordie, 2026-11-28: "It is still not dynamic enough. Can we do one
  word at a time dynamic captions?"). The line plays as single words, 120 px black, cutting in on
  the score's eighth notes, where the strings' ostinato already pulses, so the card timings and the
  score stand. Every card's last word holds at least 0.98 s before the card leaves. The one-line
  cut is beside this one as `river-countdown-worst-lines.mp4`.
- **As long as its words** (Geordie, 2026-11-28: "88s is fine"). Each card holds for its words at
  0.3 s a word plus 1 s, rounded up to beats: 11 or 12 beats, 7.3 or 8 s. The ten need 64.1 s of
  reading and end on beat 125; the next whole bar after a 2-bar outro is bar 35, so the film is 34
  bars, 90.667 s. The first cut's holds ran to 14 s.
- **Three lines picked by hand.** For Columbian exchange, Age of Discovery and Three Kingdoms the
  line is from the trial run, which was more concrete than the full run's (a list of four things for
  Age of Discovery; "and manors outlived war" for Three Kingdoms). Both runs passed the same checks.
- **The bands' edges are their own colour.** An ink edge drew the thin benefit side of a mostly-harm
  band as a white line; edged in benefit blue it reads as benefit.

## Measured

- `hyperframes check` (0.9.42): no errors, no warnings. The outro holds the title still for 6.6 s
  before the loop point; `data-hold` on the titles says so.
- Every composition's `data-duration` is `90.666`: the renderer rounds duration x fps up, and
  `90.6667` rendered 2721 frames, a second frame 0 at the loop. `90.666` renders 2720.
- The engine change leaves the 60-second cut, the race and the vertical Short pixel-identical: nine
  stills against the same moments before, 0 pixels apart.
- The seam, picture: the snapshots at 0 and 90.633 s differ in no pixel. In the encode, frame 2719
  against frame 0 is 46.5 dB PSNR, H.264 noise (the first cut: 47.0 dB).
- The seam, sound: the master is 4,352,000 samples, 34 bars exactly; its last 0.1 s at −28.1 dBFS
  RMS, its first 0.1 s at −28.2.
- The export's loudness: −16.1 LUFS, −1.8 dBTP. Video 90.667 s, audio 90.666 s.
- The score's sections within 0.03 dB of their targets. The strokes, below 200 Hz in the AAC (two
  passes of `lowpass=f=200`), the 230 ms after each card's beat against the 220 ms before: No. 10
  +15.2 dB, No. 9 +15.4, No. 8 +12.3, No. 7 +9.8, No. 6 +16.6, No. 5 +20.5, No. 4 +14.7, No. 3 +12.3,
  No. 2 +14.9, No. 1 +9.1, the outro +3.4 (after No. 1's timpani roll).
- Stills at 0, 5.9, 13.5, 36.8, 44.8, 60.1, 76.1, 83.2, 85 and 90.633 s, and the contact sheet from
  the export.

## Not checked

- Nobody has watched the film loop end to start in a player, and nobody has heard the score. The
  music is measured, not heard, and not judged against the picture. In cards of 11 and 12 beats
  theme A stops after two and a half bars, two beats before the next card; that cut is unheard.
- YouTube re-encodes the upload, and the Shorts player's restart sets the seam viewers hear.
- The layout has not been seen inside the YouTube app.
- The other four rankings build from the same code with `FILMS.countdown.ranking`, but none has been
  rendered; each needs its own length and score.

## Weakest shot

The outro (83.333 to 90.667 s): after No. 1, the title holds still over the ten lit bands for 6.6 s,
the longest still stretch in the film, while the score dies away into the loop.
