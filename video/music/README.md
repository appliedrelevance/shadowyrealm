# The River of Influence: the scores

The films' music is our own, written as notes and timed to each film's picture (Geordie,
2026-11-21: home-grown compositions only, no generated beds and no borrowed classics). Every score
is a SoundCraft session (Geordie, 2026-11-20: a song is a SoundCraft session, not a program), played
by BBC Symphony Orchestra Discover with no window. The film's cues come from
`bun tools/music-cues.ts <film>`.

| Film | Score | In the film |
|---|---|---|
| The 60-second cut | the session `river/river-60.scraft` | `video/assets/music/river-60.m4a` |
| The race | the session `race/race-score.scraft` | `video/race/assets/music/race-score.m4a` |
| The Short, a loop | the session `short/short-score.scraft` | `video/assets/music/short-score.m4a` |

The sessions are in `/Volumes/Berthold/Landru/media/exports/shadowyrealm/music/soundcraft/`. The
race and the Short share their themes: the Short is the series trailer, so it carries the race's
music. Changes go into the sessions. Each film's music is its session's own bounce, levelled by the
session's automation and mastered by `scraft/`.

The 60-second cut's and the race's sessions were imported on 2026-11-21 from the MIDI of
`score.py` and `race_score.py`, which wrote and rendered them before SoundCraft
(`orchestra.py`, `bbcso.py`, `render.py`, `check.py`, `transcribe.py`). Those scripts were retired
on 2026-11-22 and are in git history.

The environment is `video/music/.venv` (Python 3.13, `numpy`, `pedalboard`), kept out of git.

| Script | Does |
|---|---|
| [`scraft/short_level.py`](scraft/short_level.py), [`scraft/race_level.py`](scraft/race_level.py) | measure a session's stems and write its levelling as automation points for the MCP |
| [`scraft/master.py`](scraft/master.py) | cut a bounce to the film's length and master it to a loudness |
| [`scraft/master_loop.py`](scraft/master_loop.py) | master the Short's bounce as a seamless loop |
| [`scraft/audit.py`](scraft/audit.py) | read a session for overlapping clips, stray notes, duplicates and the players' breathing |
| [`scraft/onsets.py`](scraft/onsets.py) | measure every note's onset in its stem |

**The stems are not kept** (the race's and the Short's were deleted on 2026-11-22). To level a
session again, or to run `scraft/onsets.py`, bounce them again from the session with
`file.bounce_stems` (stable), on several `soundcraft-cli` processes at once (see the race below).

## BBC Symphony Orchestra Discover

Spitfire's free library (installed 2026-11-19 with the Spitfire Audio app; 243 MB in
`/Volumes/Berthold/Landru/media/audio/spitfire/`). Measured 2026-11-20:

- **Dynamics.** The longs ignore velocity and swell on CC1: from 40 to 110 the first violins rise
  5.4 dB. The shorts follow both velocity and CC1, about 7 dB each from 40 to 110, and 20 dB with
  both. Write a short note's dynamic in both its velocity and CC1, and a long note's in CC1.
- **Balance is not the orchestra's.** Summed at unity, the longs sound far louder than the shorts
  at the same marking: a tutti statement came out 13 dB under the passage before it. So every
  session is levelled by measure, section by section, as automation.
- **Timpani** play only keys 48 to 74 and sound an octave below the key (key 59 measures 123.5 Hz,
  B2). **Timpani Long Rolls** render silent, so rolls are written as 32nd-note hits.
- **More than the 16 instruments of the presets plays.** The harp, celeste, glockenspiel and
  tubular bells sound from their `Short … Discover` patches, and the snare and tam-tam from
  `Untuned Percussion`.
- **Loading.** A patch change spends about 20 s reading its samples from Berthold, and the first
  render after one can miss samples still loading; a second render matches the first to better than
  −190 dB.

## The Short's loop

The Short's score is the session
`/Volumes/Berthold/Landru/media/exports/shadowyrealm/music/soundcraft/short/short-score.scraft`,
composed through SoundCraft's MCP (2026-11-21): 34 BBC SO Discover tracks taken from the race's
session, with their patches and calibrated faders, then 1,307 notes in 140 clips written with
`midi.new_clip`, `midi.note_add` and `midi.cc_ramp`, and doublings copied between tracks with
`edit.copy`/`edit.paste` and moved with `midi.notes_move`. It carries the race's theme A, its
counterline and theme B in D minor, and a marker for each section.

- **Film time.** The session's 0 s is the film's 0 s: the crest on bar 1, two bars of hook at 85.71
  bpm, then 40 bars of 91.95 bpm from the river's restart at 5.6 s to the loop point at 110 s (bar
  43). Notes are in ticks (960 a quarter); clip starts are `bars_beats` positions the engine resolves.
- **Levels are automation.** The stems are measured by
  [`scraft/short_level.py`](scraft/short_level.py): inside each section with a theme the tracks under
  it come down until it sits 3 dB over them (at most 10 dB), then a gain per section puts each at its
  target against the crest. The result is volume automation in the session: 30 points on the master
  fader (`Master 1`), 145 on 23 tracks, gliding 80 ms into each section.
- **The loop.** `file.bounce_mix` (stable) renders 0 to 114 s; [`scraft/master_loop.py`](scraft/master_loop.py)
  folds the 4 s past the loop point onto the start and limits three copies end to end, keeping the
  middle one, to -16.0 LUFS.
- **The soft crest** (Geordie, 2026-11-21: the opening blast was too jarring for the feed): no
  crash, drum, timpani hit, bell or trumpets at the first frame; the chord's CC1 rises 40 to 80 over
  1.4 s and settles to 60; the build's last bar dies away (CC1 to about 58) under a quiet timpani
  rumble in place of the timpani and snare rolls. `scraft/short_level.py` sets each section
  against the build's peak (c2), the crest 8 dB under it. Its stems bounced on six processes in
  97 s. On the master: every section within 0.4 dB of its target; the first 0.1 s at -24.7 dBFS RMS
  (-10.9 before), the last 0.1 s at -23.5 dBFS, the join at the 13th and 37th percentiles.
- **Measured, 2026-11-21:** 1,307 notes, no overlaps or stray notes, the longest wind line 9.8 s.
  Every note sounds in its stem; 13 long or low notes take 60 to 120 ms to rise above -70 dBFS. The
  master: 110.000 s, -16.0 LUFS, -2.0 dBTP; every section within 0.5 dB of its target (mean 0.36
  dB); the join at the 33rd and 57th percentiles of the steps around it. The stems took 43 min in
  one process (peak memory 1.7 GB), the mix 79 s.
- **Known engine faults** (reported to the SoundCraft session): `edit.copy` of part of a MIDI clip
  also carries the notes after the range; `track.new {kind: "master"}` ignores its name.

## The 60-second cut and the race

- **The 60-second cut**, `/Volumes/Berthold/Landru/media/exports/shadowyrealm/music/soundcraft/river/river-60.scraft`:
  one pickup beat of 0.6 s, then 0.9 s beats (66.67 bpm, 4/4 from bar 2), so the sweep (4.2 s), the
  three all-time names (46.5, 48.3 and 50.1 s) and the end card (51.9 s) fall on beats. A marker at
  the sweep, each era, the three names and the end card. Its arc is in its CC1 and CC11, so it needs
  no automation. Its bounce is mastered as the film's music: cut to 60 s, faded 1.5 s in and 3 s
  out, brought to −15.6 LUFS under a limiter (measure the faded bounce's integrated loudness, then
  apply the gain that brings it there):

  ```bash
  FADE="atrim=0:60,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=1.5,afade=t=out:st=57:d=3"
  ffmpeg -nostats -i BOUNCE.wav -af "$FADE,ebur128=peak=true" -f null -   # read I: from the summary
  ffmpeg -i BOUNCE.wav -af "$FADE,volume=<-15.6 minus I>dB,alimiter=limit=0.79:attack=5:release=80:level=false" …
  ```

  The session's bounce, shaped that way, matches the music in the film: correlation 1.00000, the
  difference 50.7 dB under it, every second within 0.03 dB.
- **The race**, `/Volumes/Berthold/Landru/media/exports/shadowyrealm/music/soundcraft/race/race-score.scraft`:
  a grid of 89.13 bpm whose bar 97 lands on the front's arrival at 2026 (258.8 s), a marker at each
  section, and its levelling as automation from [`scraft/race_level.py`](scraft/race_level.py),
  which holds the race's sections, targets and theme parts: 43 points on the master fader and 296 on
  30 tracks. A fader stops at +12 dB, so the master lane sits 5 dB under the computed gains (from
  -5.1 to +11.5 dB); mastering sets the loudness. [`scraft/master.py`](scraft/master.py) cuts the
  bounce to 269 s and masters it to -16.0 LUFS, -2.0 dBTP. Against the race music approved on
  2026-11-21 (the last render before SoundCraft), section by section: 0.05 dB apart on average,
  0.33 dB at the worst (the dominant).
- **Rendering**: the race's 37 stems were bounced on six `soundcraft-cli` processes at once, each
  keeping about six tracks (`track.delete` the rest, then `file.bounce_stems`, stable): 163 s in all,
  against 43 min for the Short's 34 stems in one process. The mix bounced in 97 s (peak memory 2.8 GB).
  The automation and markers went in as one `soundcraft-cli script` of 363 engine commands.
