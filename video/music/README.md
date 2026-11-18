# The River of Influence: the score

The films' music is a score, not generated audio. [`score.py`](score.py) writes it as a MIDI file
timed to the picture, Logic Pro plays it with its own recorded instruments, and the bounce is
mastered and placed in the film.

```bash
video/music/.venv/bin/python video/music/score.py   # writes video/music/river-60.mid
bun tools/music-cues.ts short                       # the cue times it is written against
```

The environment is `video/music/.venv` (Python 3.13 and `mido`), kept out of git.

## The grid

One pickup beat of 0.6 s, then 0.9 s beats (66.67 bpm, 4/4 from bar 2). On it the picture's
moments fall on beats: the sweep at 4.2 s, the all-time names at 46.5, 48.3 and 50.1 s, the end
card at 51.9 s and the last frame at 60.0 s. The MIDI file carries a marker for each, and one for
each era as the front enters it.

## Tracks and Logic patches

Logic's sound library lives on Berthold, `/Volumes/Berthold/AppData/Logic Pro Sound Library/`
(Ajustes > General > Biblioteca de sonidos), with the packs Studio Strings, Studio Horns, Cinematic
Synths and Keyboard Collection.

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
| Piano | Keyboard Collection > Pop Producer Keys | the title, each era, the three names, the end card |

The tracks are on MIDI channels 5 to 15: Logic imports channels 1 to 4 as external GM devices,
which make no sound, and channel 10 is GM drums. On import Logic gives each track an arbitrary
patch; load the ones above from the browser (Instrumentos, sorted by name). The Logic project with
them loaded is `/Volumes/Berthold/Landru/media/projects/logicpro/river-of-influence-score.logicx`.

Dynamics are written as controllers: CC1 (the mod wheel, Studio Strings' and Studio Horns'
dynamics) and CC11 (expression) on the strings and brass, CC11 alone on the pad, velocity on the
piano.

## Bounce and master

Archivo > Bounce > Proyecto o sección: uncompressed, 24-bit, 48 kHz, to
`/Volumes/Berthold/Landru/media/exports/shadowyrealm/music/river-60.aif` (bar 1 to bar 19,
61.8 s). Then trim to the film's 60 s, fade, and bring it to the films' loudness (−15.6 LUFS, true
peak under −1.5 dBTP) with gain and a limiter:

```bash
ffmpeg -i river-60.aif -af "atrim=0:60,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=1.5,afade=t=out:st=57:d=3,volume=1.6dB,alimiter=limit=0.79:attack=5:release=80:level=false" …
```

The first bounce (2026-11-18) measured −17.2 LUFS before mastering and −15.7 LUFS, −1.9 dBTP
after; its quietest moments sit at −75 dBFS, with none of the hiss the generated bed had.
