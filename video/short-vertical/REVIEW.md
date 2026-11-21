# Review: The River of Influence, vertical: the loop

Rendered 2026-11-21 with hyperframes 0.9.42 to
`/Volumes/Berthold/Landru/media/exports/shadowyrealm/river-of-influence-vertical.mp4`: 1080 x 1920,
30 fps, 3300 frames, 110.000 s, 73.4 MB, with its contact sheet beside it (the picture is the
2026-11-19 render's: only the music changed). Data: the `/api/realm`
snapshot in `assets/realm-data.js`, taken 2026-11-17: 624 entities as of 2026.

**After every render, swap in the bed.** The render's mix starts the music 448 samples (9.3 ms)
late, which puts silence at the loop point. The export carries the video stream from the render and
the bed itself, both copied, not re-encoded:

```bash
ffmpeg -i render.mp4 -i assets/music/short-score.m4a -map 0:v -map 1:a -c copy -movflags +faststart river-of-influence-vertical.mp4
```

## Creative calls

- **A loop, hook first** (Geordie, 2026-11-18). A Short replays as soon as it ends, so the finished
  river and the music's climax are the first five seconds, and the build ends where the hook
  begins. No title or end card: big titles over the hook, `shadowyrealm.com` in the description.
- **The reset is a drain.** At 5 s the river runs back to its source in 0.6 s, the year spinning
  from 2026 to 3500 BCE, so the viewer sees what the next 98 seconds will rebuild. Nothing is called
  out while it rewinds.
- **The hook moves.** The check flagged 4.6 s of stillness on the first frames; the river now
  pushes in 3.5% over the hook, anchored at the ruler so the titles and year labels hold still, and
  settles back as it drains.
- **The key sits in empty ground.** Over the harm bands it read at 3.9:1 but the dark band edges cut
  its letters; above the finished river's left half (y 640 to 760) nothing is behind it.
- **The music is our own score, composed in SoundCraft** (Geordie, 2026-11-21: Vltava and Mountain
  King are gone, home-grown compositions only; composed fresh through the MCP). The session
  `short-score.scraft` carries the race's theme A and harmony in D minor on this film's clock, so
  the series trailer carries the series' music: the crest on the loop point (the race's D major
  arrival), a last stroke at 2.8 s, the harp and celeste running down as the river drains, then
  the eras: theme A from the Iron Age, theme B in the Middle Ages, theme A high from the Early
  Modern World (47.36 s, on its bar's downbeat), the Industrial brass, B flat minor for the World
  Wars, the Cold War pianissimo, the build, and two tutti statements into the crest.
- **The all-time top three are gone.** There is no time for them, and the hook already shows the
  finished river.

## Measured

- `hyperframes check` (0.9.42): no errors, no warnings.
- The last frame (109.966 s) against frame 0: identical, pixel for pixel (PIL difference: no box).
- During the push, the title and ruler band (y 168 to 475) moves only by sub-pixel antialiasing on
  the year labels.
- The loop audio: 110.000 s; −16.0 LUFS, −2.0 dBTP; every section within 0.5 dB of its target
  (mean 0.36 dB). Its last sample runs into its first: the join step sits at the 33rd and 57th
  percentiles (left, right) of the steps in the 200 ms around it.
- Stills at 0, 3, 5.2, 5.45, 10, 30, 55, 70, 90, 104, 107.6 and 109.966 s.
- The render, 2026-11-20: `hyperframes check` no errors, no warnings. ffprobe: 3300 frames, video
  and audio both 110.000 s. Its picture against the 2026-11-19 export: 71.0 dB PSNR on average,
  56.0 dB at the worst frame, the encoder's noise.
- The seam, picture: the snapshots at 0 and 109.966 s differ in no pixel. In the encode, frame 3299
  against frame 0 is 43.7 dB PSNR, H.264 noise (frame 0 is a keyframe, frame 3299 a predicted one);
  frames 3298 and 3299 are identical.
- The seam, sound: after the swap the decoded audio sounds from its first sample (the render's
  own mix started 9.38 ms late). The 16 ms after 110.000 s is the AAC encoder's end padding, which
  the file's edit list cuts; the music runs to 110.000 s.
- The export's loudness: −16.0 LUFS, −1.7 dBTP.

## Not checked

- Nobody has watched the film loop end to start in a player, and nobody has heard the new score
  yet. The seam in the film is measured, not heard.
- YouTube re-encodes the upload, and the Shorts player's restart sets the seam viewers hear.
- The layout has not been seen inside the YouTube app.
- The music is this project's own composition. Spitfire's terms make
  recordings made with its libraries, Discover included, royalty-free for commercial release
  (support article 11815239).

## Weakest shot

5.6 to about 20 s: the young river is a sliver at the left edge while the bassoons and plucked
celli creep in at 77 bpm, after
a hook that was the whole river. It is the reset the loop is built on, but it asks the viewer to
wait.
