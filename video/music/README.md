# The River of Influence: the scores

The films' music is our own, written as notes and timed to each film's picture (Geordie,
2026-11-21: home-grown compositions only, no generated beds and no borrowed classics). Each script
writes a MIDI file against the film's own clock (`bun tools/music-cues.ts <film>`), and BBC Symphony
Orchestra Discover plays it with no DAW and no window.

| Film | Score | Rendered by | In the film |
|---|---|---|---|
| The 60-second cut | the SoundCraft session `river/river-60.scraft` | SoundCraft | `video/assets/music/river-60.m4a` |
| The race | the SoundCraft session `race/race-score.scraft` | SoundCraft | `video/race/assets/music/race-score.m4a` |
| The Short, a loop | the SoundCraft session `short-score.scraft`, composed through the MCP | SoundCraft | `video/assets/music/short-score.m4a` |

The race and the Short share their themes: the Short is the series trailer, so it carries the
race's music. Every score is a SoundCraft session (Geordie, 2026-11-20: a song is a SoundCraft
session, not a program), in `/Volumes/Berthold/Landru/media/exports/shadowyrealm/music/soundcraft/`. The Short's was composed in its session through the MCP; the
60-second cut's and the race's were imported from `score.py`'s and `race_score.py`'s MIDI, and those
scripts are now their history: changes go into the sessions. Each film's music is the session's
own bounce, levelled by the session's automation and mastered by `scraft/`.

```bash
video/music/.venv/bin/python video/music/score.py               # writes video/music/river-60.mid
video/music/.venv/bin/python -I video/music/race_score.py       # the race: score, render what changed, master
```

The environment is `video/music/.venv` (Python 3.13, `mido`, `numpy`, `pedalboard`), kept out of
git. The sections below on Logic and sfizz are how `score.py` was first played; the 60-second cut
now takes its scorerender render.

## The grid

One pickup beat of 0.6 s, then 0.9 s beats (66.67 bpm, 4/4 from bar 2). On it the picture's
moments fall on beats: the sweep at 4.2 s, the all-time names at 46.5, 48.3 and 50.1 s, the end
card at 51.9 s and the last frame at 60.0 s. The MIDI file carries a marker for each, and one for
each era as the front enters it.

## Tracks and Logic patches

Logic's sound library lives on Berthold, `/Volumes/Berthold/AppData/Logic Pro Sound Library/`
(Ajustes > General > Biblioteca de sonidos), with the packs Studio Strings, Studio Horns, Cinematic
Synths and Keyboard Collection, and Studio Piano's samples (2.04 GB), which Logic offers to
download when the instrument is first loaded. Studio Piano is not in the browser's patch list: load
it in the track's instrument slot.

| Track | Patch | Enters |
|---|---|---|
| Pad | Cinematic Synths > Warm Waves | 0 s |
| Cellos | Studio Strings > Studio Cellos | 0.6 s |
| Basses | Studio Strings > Studio Double Basses | 4.2 s, the sweep |
| Violas | Studio Strings > Studio Violas | the Classical World |
| Violins 2 | Studio Strings > Studio Violins 2 | the Middle Ages |
| Violins 1 | Studio Strings > Studio Violins 1 | the Early Modern World: the melody |
| Trombone 1, Trombone 2 | Studio Horns > Studio Trombone 1, 2 | the Industrial Age to the end of the sweep |
| Bass Trombone | Studio Horns > Studio Bass Trombone | the Industrial Age to the end of the sweep |
| Piano | Steinway Grand Piano (Geordie's choice, 2026-11-18), on the Studio Piano instrument | the title, each era, the three names, the end card |

The tracks are on MIDI channels 5 to 15: Logic imports channels 1 to 4 as external GM devices,
which make no sound, and channel 10 is GM drums. On import Logic gives each track an arbitrary
patch; load the ones above from the browser (Instrumentos, sorted by name). The Logic project with
them loaded is `/Volumes/Berthold/Landru/media/projects/logicpro/river-of-influence-score.logicx`.

Dynamics are written as controllers: CC1 (the mod wheel, Studio Strings' and Studio Horns'
dynamics) and CC11 (expression) on the strings and brass, CC11 alone on the pad, velocity on the
piano.

## Bounce and master

Turn off the metronome first (the triangle beside "1234" in the control bar, grey when off): Logic
prints its click into the bounce when it is on. Then Archivo > Bounce > Proyecto o sección: uncompressed, 24-bit, 48 kHz, to
`/Volumes/Berthold/Landru/media/exports/shadowyrealm/music/river-60.aif` (bar 1 to bar 19,
61.8 s). Then trim to the film's 60 s, fade, and bring it to the films' loudness (−15.6 LUFS, true
peak under −1.5 dBTP): measure the faded bounce's integrated loudness, apply the gain that brings it
to −15.6 LUFS, and a limiter for the peaks:

```bash
FADE="atrim=0:60,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=1.5,afade=t=out:st=57:d=3"
ffmpeg -nostats -i river-60.aif -af "$FADE,ebur128=peak=true" -f null -   # read I: from the summary
ffmpeg -i river-60.aif -af "$FADE,volume=<-15.6 minus I>dB,alimiter=limit=0.79:attack=5:release=80:level=false" …
```

Check a bounce before it goes into a film: `video/music/.venv/bin/python video/music/check.py
<bounce>` prints the loudness and the noise floor, and fails when a click falls on the beats after
the last note.

The second bounce (2026-11-18), with the metronome off and the Steinway, measured −15.1 LUFS
before mastering and −15.7 LUFS, −1.9 dBTP after, with no click after the music. The first, with
the metronome on and Pop Producer Keys on the piano, measured −17.2 LUFS before mastering and −15.7 LUFS, −1.9 dBTP
after; its quietest moments sit at −75 dBFS, with none of the hiss the generated bed had.

## Without a DAW: sfizz

[`render.py`](render.py) renders the same MIDI with no DAW and no screen: each track through an SFZ
instrument with `sfizz_render`, then levelled, mixed and reverberated with Spotify's `pedalboard`,
in about 2 s. It writes `/Volumes/Berthold/Landru/media/exports/shadowyrealm/music/river-60-sfz.wav`;
master it as above.

```bash
video/music/.venv/bin/python video/music/render.py
video/music/.venv/bin/python video/music/check.py /Volumes/Berthold/Landru/media/exports/shadowyrealm/music/river-60-sfz.wav
```

- **sfizz 1.2.3**, built from source in `/Volumes/Berthold/DevTools/sfizz/` (`build-arm64/library/bin/sfizz_render`).
  Two changes were needed on this Mac: `cmake/SfizzConfig.cmake` adds 32-bit ARM flags
  (`-mfpu=neon -mfloat-abi=hard`) to any processor matching `arm.*`, arm64 included, so its test now
  matches `^(arm|armv[0-7].*)$`; and the bundled `atomic_queue` needs
  `-Wno-missing-template-arg-list-after-template-kw` under the current clang.
- **Samples** in `/Volumes/Berthold/AppData/sfz/`: VSCO 2 Community Edition (CC0), only the six
  sustain folders the score uses (violin, viola and cello sections, contrabass, tenor trombone,
  tuba: 330 MB), and the Salamander Grand Piano, 44.1 kHz 16-bit (Alexander Holm, CC BY 3.0: a film
  that uses it credits him).
- **What the renderer does for these libraries**: VSCO changes only by velocity layer, so the
  score's CC1 becomes velocities (lifted by 25, so only the quietest passages use the soft layer)
  and a volume envelope; its sustains are 3 to 26 s recordings with no loop, so a note held past a
  bar is played again on each bar line; and the libraries arrive up to 21 dB apart, so each track
  is set to a measured level.

## Without a DAW: BBC Symphony Orchestra Discover

Spitfire's free BBC Symphony Orchestra Discover (installed 2026-11-19 with the Spitfire Audio app;
the library, 243 MB, in `/Volumes/Berthold/Landru/media/audio/spitfire/`) plays from Python with
no DAW and no window: `pedalboard` loads its VST3 as an instrument, and [`bbcso.py`](bbcso.py)
picks the instrument by rewriting the plug-in's saved state. Unlike VSCO, its longs swell on CC1
and its shorts have real staccato, spiccato, pizzicato and marcato recordings.

The time goes on loading, not playing. A loaded instrument renders at 19 to 55 times real time
with a 4096-sample buffer. Each patch change spends about 20 s reading its samples from Berthold,
at under 1% CPU. So `orchestra.py` keeps stems and runs plug-ins side by side:

- **Stems are kept.** A stem's file name carries a hash of its notes, its patch, the plug-in's
  version and `bbcso.py`. A run renders only the stems whose hash is new and deletes the rest.
  With nothing changed, a run takes 4 s.
- **Eight plug-ins at once** (`WORKERS`), each in its own process, one part at a time. On
  2026-11-20 the 34 parts, 72 stems, took 116 s, against 27 min one after another. One instance
  uses about 200 MB of memory.
- **Every stem is rendered until two renders agree.** The first render after a patch change can
  miss samples still loading. One after another, the first section of 1 part in 34 came out short
  (the intro horns, 1.2 dB quiet). Eight at once without the check, 8 parts' first sections lost
  notes, up to 7 dB. The plug-in is otherwise deterministic: a second render matches the first to
  better than −190 dB. Spitfire's `defaultShouldStreamNonRealtimeSynchronously` setting changed
  neither the speed nor the missed samples (tested set to 1, then set back to 0).

- **An instrument is a name.** The state holds the patch as XML whose articulations are named like
  the library's patch files: `BBCSODi_h___Celli___Long.zmulti` is `h - Celli - Long`. A fresh
  instance opens on Violins 1; `bbcso.state_for` rewrites it to one articulation of any
  instrument. The template's `rr_neighbourMin`/`Max` (55 to 97, the violins' compass) silence
  every note outside it, so the module opens it to 0 to 127.
- **Wait after a patch change.** The samples load in the background, and rendering 1.5 s after a
  patch change hung the plug-in (the bass drum). 10 s avoids the hang, but it does not guarantee a
  complete render: the agree-twice check above does that.
- **Timpani** play only keys 48 to 74 and sound an octave below the key (key 59 measures 123.5 Hz,
  B2). **Timpani Long Rolls** render silent, so rolls are written as 32nd-note hits.
- **Balance is not the orchestra's.** Summed at unity, the longs sound far louder than the shorts
  at the same marking: the first render put the tutti statement 13 dB under the one before it.
  Each part renders one stem per section, and the sections are levelled by measure.
- **Dynamics.** The longs ignore velocity and swell on CC1: from 40 to 110 the first violins rise
  5.4 dB. The shorts follow both velocity and CC1, about 7 dB each from 40 to 110, and 20 dB with
  both. Measured 2026-11-20 on violas spiccato, harp, celeste, snare and timpani. `orchestra.py` writes a short note's dynamic in both its
  velocity and CC1, and a long note's in CC1.
- **More than the 16 instruments of the presets plays.** The harp, celeste, glockenspiel and
  tubular bells sound from their `Short … Discover` patches, and the snare and tam-tam from
  `Untuned Percussion`.
- **The plug-in crashes its process now and then**: three segfaults in its own threads on
  2026-11-20, one inside Apple's networking library, none tied to a patch. A
  `multiprocessing.Pool` never notices a dead worker and waits for ever, with every other worker
  idle. `orchestra.py` runs its workers in a `ProcessPoolExecutor`, which reports the crash, and
  sends the unfinished parts round again on a fresh pool, up to three times. The stems already
  written are kept.

## The Short's loop: a SoundCraft session

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
- **Levels are automation.** The stems, bounced with `file.bounce_stems` (stable), are measured by
  [`scraft/short_level.py`](scraft/short_level.py): inside each section with a theme the tracks under
  it come down until it sits 3 dB over them (at most 10 dB), then a gain per section puts each at its
  target against the crest. The result is volume automation in the session: 30 points on the master
  fader (`Master 1`), 145 on 23 tracks, gliding 80 ms into each section. The stems are not kept
  (the race's and the Short's went to Berthold's Trash on 2026-11-22): to level again, or to run
  `scraft/onsets.py`, bounce them again from the session.
- **The loop.** `file.bounce_mix` (stable) renders 0 to 114 s; [`scraft/master_loop.py`](scraft/master_loop.py)
  folds the 4 s past the loop point onto the start and limits three copies end to end, keeping the
  middle one, to -16.0 LUFS.
- **Checks.** [`scraft/audit.py`](scraft/audit.py) reads the session for overlapping clips, notes
  past their clip, duplicates and the players' breathing; [`scraft/onsets.py`](scraft/onsets.py)
  measures every note's onset in its stem.
- **The soft crest** (Geordie, 2026-11-21: the opening blast was too jarring for the feed): no
  crash, drum, timpani hit, bell or trumpets at the first frame; the chord's CC1 rises 40 to 80 over
  1.4 s and settles to 60; the build's last bar dies away (CC1 to about 58) under a quiet timpani
  rumble in place of the timpani and snare rolls. `scraft/short_level.py` now sets each section
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

## The 60-second cut and the race as sessions

- **The 60-second cut**, `/Volumes/Berthold/Landru/media/exports/shadowyrealm/music/soundcraft/river/river-60.scraft`: the import of `river-60.mid`, its tracks renamed
  (the import had turned their `·` into U+FFFD) and a marker at the sweep, each era, the three
  all-time names and the end card. Its arc is in its CC1 and CC11, so it needs no automation. Its
  bounce, shaped like the film's master (60 s, fades 1.5 s in and 3 s out), matches the music in the
  film: correlation 1.00000, the difference 50.7 dB under it, every second within 0.03 dB.
- **The race**, `/Volumes/Berthold/Landru/media/exports/shadowyrealm/music/soundcraft/race/race-score.scraft`: the import of `race-score.mid` with a marker at each
  section and the levelling of `orchestra.py` as automation, from [`scraft/race_level.py`](scraft/race_level.py),
  which reads `race_score.py`'s sections, targets and theme parts: 43 points on the master fader and
  296 on 30 tracks. A fader stops at +12 dB, so the master lane sits 5 dB under the computed gains
  (from -5.1 to +11.5 dB); mastering sets the loudness. [`scraft/master.py`](scraft/master.py) cuts the
  bounce to 269 s and masters it to -16.0 LUFS, -2.0 dBTP. Against the race music approved on
  2026-11-21 (the `orchestra.py` render), section by section: 0.05 dB apart on average, 0.33 dB at
  the worst (the dominant).
- **Rendering**: the race's 37 stems were bounced on six `soundcraft-cli` processes at once, each
  keeping about six tracks (`track.delete` the rest, then `file.bounce_stems`, stable): 163 s in all,
  against 43 min for the Short's 34 stems in one process. The mix bounced in 97 s (peak memory 2.8 GB).
  The automation and markers went in as one `soundcraft-cli script` of 363 engine commands.
