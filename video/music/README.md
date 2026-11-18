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

## A public-domain recording: Vltava

[`vltava.py`](vltava.py) cuts Smetana's *Vltava* (The Moldau), a river from its source to the sea,
to the 60-second film, from the Musopen Symphony's 2012 recording, public domain worldwide
(Wikimedia Commons, 143.7 MB FLAC, kept in
`/Volumes/Berthold/Landru/media/exports/shadowyrealm/music/source/`). The film takes one unbroken
stretch, 0:56.47 to 1:52.47: the flutes under the title, the main theme (E minor) entering with the
sweep at 4.2 s and building to its crest under the all-time names and the end card, faded out over
the last 3 s. It stops before the major-key theme and the bright closing chords (Geordie,
2026-11-18: the cut into them was too stark, and too upbeat for the genocides on the river; that
cut is commit 0b3083f). Mastered: −15.9 LUFS, −1.7 dBTP.

Musopen asks for a courtesy credit: "Music: Smetana, Vltava, performed by the Musopen Symphony
(public domain)". The piece is famous and labels register their recordings with YouTube's Content
ID, which can mistake one orchestra for another; a claim is disputed by citing the recording's
public-domain source.
