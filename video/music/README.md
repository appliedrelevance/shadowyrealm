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
| Pad | Cinematic Synths, a sustained pad | 0 s |
| Cellos | Studio Strings > Studio Cellos | 0.6 s |
| Basses | Studio Strings > Studio Double Basses | 4.2 s, the sweep |
| Violas | Studio Strings > Studio Violas | the Classical World |
| Violins 2 | Studio Strings > Studio Violins 2 | the Middle Ages |
| Violins 1 | Studio Strings > Studio Violins 1 | the Early Modern World: the melody |
| Trombone 1, Trombone 2 | Studio Horns > Studio Trombone 1, 2 | the Industrial Age to the end of the sweep |
| Bass Trombone | Studio Horns > Studio Bass Trombone | the Industrial Age to the end of the sweep |
| Piano | Keyboard Collection, an acoustic piano | the title, each era, the three names, the end card |

Dynamics are written as controllers: CC1 (the mod wheel, Studio Strings' and Studio Horns'
dynamics) and CC11 (expression) on the strings and brass, CC11 alone on the pad, velocity on the
piano.

## Bounce

Archivo > Bounce, from the start to the "Last frame" marker (60.0 s), WAV, 48 kHz, 24-bit, no
normalising. The film fades the music in over 1.5 s and out over the last 3 s itself.
