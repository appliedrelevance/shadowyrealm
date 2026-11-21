# The River of Influence: the scores

The films' music is our own, written as notes and timed to each film's picture (Geordie,
2026-11-21: home-grown compositions only, no generated beds and no borrowed classics). Each script
writes a MIDI file against the film's own clock (`bun tools/music-cues.ts <film>`), and BBC Symphony
Orchestra Discover plays it with no DAW and no window.

| Film | Score | Rendered by | In the film |
|---|---|---|---|
| The 60-second cut | [`score.py`](score.py) → `river-60.mid` | scorerender, through SoundCraft | `video/assets/music/river-60.m4a` |
| The race | [`race_score.py`](race_score.py) → `race-score.mid` | [`orchestra.py`](orchestra.py) | `video/race/assets/music/race-score.m4a` |
| The Short, a loop | [`short_score.py`](short_score.py) → `short-score.mid` | [`orchestra.py`](orchestra.py) | `video/assets/music/short-score.m4a` |

The race and the Short share their themes: the Short is the series trailer, so it carries the
race's music. `orchestra.py` renders a score's parts, levels each section by measure to the
script's `TARGET` and masters it; scorerender (`/Volumes/Berthold/Landru/code/artcraft/scorerender`)
renders any of the MIDI files through SoundCraft, but does not level sections yet, so the race and
the Short use `orchestra.py`'s renders (the race through scorerender misses its sections' targets
by up to 4.6 dB, against 0.8 dB on average through `orchestra.py`; measured 2026-11-21).

```bash
video/music/.venv/bin/python video/music/score.py               # writes video/music/river-60.mid
video/music/.venv/bin/python -I video/music/race_score.py       # the race: score, render what changed, master
video/music/.venv/bin/python -I video/music/short_score.py      # the Short's loop, the same way
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

## The Short's loop: short_score.py

[`short_score.py`](short_score.py) writes the vertical Short's 110 s loop for BBC SO Discover:
the race's themes (theme A and its counterline, theme B, the falling bass, the World Wars' darkening,
the Cold War's Lydian A, the arrival in D major), moved up a fourth into D minor, the key the race
builds in, and laid on `FILMS.shortLoop`'s clock. Its docstring has the bar plan.

- **The grid.** 4/4 at 91.95 bpm: 40 bars from the river's restart at the film's 5.6 s to the crest
  on the loop point, so the Early Modern World falls on bar 17's downbeat and the titles return on
  bar 40's. Every era lands within a beat of the section that marks it; `check_cues` prints where.
- **The loop.** The score is written as P, from the restart to past the loop point, and the master
  is P rotated so the film's 0 s is the crest: the race's D major arrival chord for the whole
  orchestra (0 to 2.35 s), a last stroke at 2.61 s, and the harp running down D minor from D6 to D3
  while the river drains (5.0 to 5.6 s), into the celli's D on bar 1. Sound past the loop point is
  folded onto the start, and the limiter runs on three copies end to end with the middle one kept,
  so its memory crosses the join as it will when the Short repeats.
- **Players breathe**, by `orchestra.check`: no wind note past 6 s, no wind line past 12 s without a
  0.3 s gap, nothing sustained on one pitch past 6 s. The longest line is the horns' 9.7 s.
- **The theme leads**: inside each section with one, the parts under it come down until it sits
  3 dB over them (`LEAD_DB`); then each section is levelled to `TARGET`, RMS against the crest:
  open −21, a1 −16, a2 −13, b −15, t1 −9, t2 −6, fall −9, wars −7, cold −18, b31 −17, b32 −12,
  c1 −4, c2 −2 dB, the hook −9, the drain −20. Every section landed on its target.
- **Measured on the master, 2026-11-21:** 110.000 s, −16.0 LUFS, −1.6 dBTP. The crest −15.0 dBFS
  RMS, the hook −23.3, the drain −34.3, the opening −35.2. The join is a sample step at the 60th
  and 18th percentiles (left, right) of the steps in the 200 ms around it: inside the music's own
  movement, no click.
- **Rendered** in 202 s on eight plug-ins: 34 parts, 1,353 notes.
