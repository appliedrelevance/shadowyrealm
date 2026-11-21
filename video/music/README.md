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

## Without a DAW: BBC Symphony Orchestra Discover

Spitfire's free BBC Symphony Orchestra Discover (installed 2026-11-19 with the Spitfire Audio app;
the library, 243 MB, in `/Volumes/Berthold/Landru/media/audio/spitfire/`) plays from Python with
no DAW and no window: `pedalboard` loads its VST3 as an instrument, and [`bbcso.py`](bbcso.py)
picks the instrument by rewriting the plug-in's saved state. Unlike VSCO, its longs swell on CC1
and its shorts have real staccato, spiccato, pizzicato and marcato recordings.

The time goes on loading, not playing. A loaded instrument renders at 19 to 55 times real time
with a 4096-sample buffer. Each patch change spends about 20 s reading its samples from Berthold,
at under 1% CPU. So `mountain_king.py` keeps stems and runs plug-ins side by side:

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
  both. Measured 2026-11-20 on violas spiccato, harp, celeste, snare and timpani. `mountain_king.py`
  leaves CC1 at 40 under its shorts. `orchestra.py` writes a short note's dynamic in both its
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

## The Short's loop: In the Hall of the Mountain King

[`mountain_king.py`](mountain_king.py) arranges Grieg's *In the Hall of the Mountain King* for BBC
SO Discover as the vertical Short's 110 s loop (Geordie, 2026-11-19: Mountain King, slow, in
place of Vltava, which was too flowery). The notes are Grieg's own piano arrangement, Op. 46 No.
4, The University Society, 1918, typeset by Coyau for the Mutopia Project and placed in the public
domain ([`sources/`](sources/), the MIDI and the LilyPond). It writes
[`mountain-king.mid`](mountain-king.mid), 34 parts, and renders, levels and masters
`/Volumes/Berthold/Landru/media/exports/shadowyrealm/music/mountain-king-loop.wav` and `.m4a`.

```bash
video/music/.venv/bin/python -I video/music/mountain_king.py           # score, render what changed, master
video/music/.venv/bin/python -I video/music/mountain_king.py --score   # only the score and the breathing check
```

- **An accelerando** (Geordie, 2026-11-20: at one pace the whole way it sounded slow and
  disconcerting). The tempo rises by the same ratio on every beat, from 76 bpm at the horns' F# to
  177 bpm at the chord, so that 49 bars fill the build, 5.6 to 110 s. Bar 0 is Grieg's horn F#.
  Then six statements, eight bars each, and each takes one passage of Grieg's arrangement whole,
  the theme with the line he sets under it. Each one is shorter than the last, from 23 s to 11 s:
  1. 77 bpm, bars 1 to 8: the theme in the bassoons and pizzicato celli over the plucked bass.
  2. 89 bpm, Grieg's bars 25 to 32: the theme an octave up, in the clarinets and pizzicato violas,
     then the oboes and second violins. Under it the celli turn F# E# F# on every second and fourth
     beat, and the horns play his offbeats, short.
  3. 102 bpm, Grieg's bars 33 to 40: the answer on F#, bowed, in the second violins and clarinets,
     then the first violins and flutes, over the turn C# B# C#.
  4. 117 bpm, Grieg's bars 41 to 48: the theme over the celli's running triplets. It ends on his
     scale down in octaves, B A G F# E D C#, in the trombones, bassoons and low strings.
  5. 134 bpm (Grieg marks 138), bars 49 to 56, the Più vivo: the theme in four octaves with the
     trumpets, over the bass galloping down B A G F# in eighths, with brass chords on beats 1 and 3.
  6. 154 bpm (Grieg's Più vivo marking), bars 57 to 64, sempre stretto: the answer on F# with its
     chords in the horns and trombones, the gallop now F# E D C#. It ends where Grieg's does, on
     the dominant: his last half note is the swell into the chord at the loop point.
- **Players breathe** (Geordie, 2026-11-20: the first version held a horn F# for 25 s, from 0:35).
  The theme passes between sections every four bars, and the winds play short. `check` fails the
  score in three cases:
  - a wind or brass note held past `HOLD`, 6 s;
  - a wind line running past `LUNG`, 12 s, without a 0.3 s gap;
  - anything sustained, strings included, holding one pitch past `HOLD`.

  A short note counts as sounding 0.25 s. All the parts of one instrument are checked together,
  because they are the same players. The limits are in seconds, so a breath takes more beats as
  the tempo rises: the bassoons' gallop rests two eighths every fourth bar, because one eighth at
  140 bpm left a 17 s line.
- **The theme leads.** Inside each statement, the parts under the theme come down until the
  theme's RMS is 3 dB over the sum of everything else (`LEAD_DB`). Then the statements are levelled
  against each other.
- **The crest is the film's first 5 s**, back at 76 bpm: B minor for the whole orchestra with
  cymbal, bass drum and a timpani roll (0 to 2.37 s), a last short stroke at 3.16 s, and silence
  while the river drains. Sound past the end is folded onto the start, and the limiter runs on
  three copies end to end, so the file loops without a seam.
- **Levels**, RMS against the chord (`TARGET`): horns −15 dB, the six statements −16, −13.5, −11,
  −8.5, −6 and −4 dB, the swell −2 dB. To put the theme 3 dB over the rest, the parts under it came
  down 9.3 to 12.1 dB in each statement. Measured on the master, 2026-11-20:
  - −16.0 LUFS integrated, −2.0 dBTP, loudness range 13.7 LU.
  - The statements −28.7, −26.2, −23.7, −21.3, −18.8 and −16.9 dBFS RMS, the swell −15.1, the
    chord −13.5.
  - The drain −60.3 dBFS.
  - The join at 110 s is a sample step at the 93rd and 41st percentiles (left, right) of the steps
    in the 200 ms around it: inside the music's own movement, no click.
- **Rendered** in 236 s on eight plug-ins: 94 stems of 95, one kept from the run before.
