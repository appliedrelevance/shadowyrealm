"""Grieg's In the Hall of the Mountain King, slow, as the Short's 110 s loop, for BBC SO Discover.

    video/music/.venv/bin/python video/music/mountain_king.py           # score, render, master
    video/music/.venv/bin/python video/music/mountain_king.py --score   # only mountain-king.mid

The notes are Grieg's own piano arrangement (Op. 46 No. 4, The University Society, 1918), typeset
for the Mutopia Project by Coyau and placed in the public domain: `sources/grieg-op46-4.mid` and
`.ly`. The theme (bars 1 to 8, B minor), its answer on F# (bars 9 to 16) and the bass under them
are read from that MIDI; the orchestration, the tempo and the ending are this file's.

The loop (Geordie, 2026-11-19: Mountain King, slow). The Short replays as soon as it ends, so the
music is one piece P whose last 5.6 s are the film's first: the crest, a B minor chord for the
finished river and a last stroke, then silence while the river drains (5.0 to 5.6 s). From 5.6 s P
starts again: the horns' F#, then the theme four times at one tempo, 75.86 bpm (Grieg marks 138
and speeds up; this never does), growing from bassoons and pizzicato strings to the full orchestra,
and the last bar's dominant swell arrives at the chord on the loop point.

    film  5.6 to 110.0   P   0.0 to 104.4   bar 0 the horns, bars 1 to 32 the four statements
    film  0.0 to   5.6   P 104.4 to 110.0   bar 33 the chord, bar 34 the stroke, the drain

Each part is one articulation of one instrument, rendered alone through the plug-in (`bbcso.py`)
and summed at unity: the library is recorded at the orchestra's own balance, so the dynamics are
written as velocities (the shorts) and CC1 (the longs), not as mixer levels. Sound left over
after P ends is folded onto its start, so the file loops without a seam.
"""

import argparse
import subprocess
import sys
import tempfile
import time
import zlib
from pathlib import Path
from random import Random

import mido
import numpy as np
from pedalboard.io import AudioFile

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))  # run with python -I, which leaves the script's folder off the path

import bbcso  # noqa: E402
GRIEG = HERE / "sources" / "grieg-op46-4.mid"
SCORE = HERE / "mountain-king.mid"
EXPORT = Path("/Volumes/Berthold/Landru/media/exports/shadowyrealm/music")
WAV = EXPORT / "mountain-king-loop.wav"
M4A = EXPORT / "mountain-king-loop.m4a"

FILM = 110.0
BUILD = 5.6  # FILMS.shortLoop.sweep0: the river starts again
BARS = 33  # bar 0 the horns' F#, bars 1 to 32 four eight-bar statements
BAR = (FILM - BUILD) / BARS
BEAT = BAR / 4
SR = bbcso.SR
TAIL = 4.0  # rendered past P's end, folded onto its start
REVERB = 0.25  # the plug-in's own hall, the same on every part
SETTLE = 10.0  # seconds after a patch change; rendering while samples load hangs the plug-in
LUFS = -16.0
LIMIT = 0.79  # alimiter ceiling, linear: about -2 dBFS before the true-peak overshoot


def at(bar, beat=0.0):
    """P time of a bar and beat."""
    return (bar * 4 + beat) * BEAT


# The sections, each rendered as one stem per part, and the stretch of P each is measured over.
GROUPS = ["intro", "s1", "s2", "s3", "s4", "swell", "hook"]
WINDOWS = {"intro": (at(0), at(1)), "s1": (at(1), at(9)), "s2": (at(9), at(17)), "s3": (at(17), at(25)),
           "s4": (at(25), at(32, 2)), "swell": (at(32, 2), at(33)), "hook": (at(33), at(33, 3))}
# Each section's level, RMS in dB against the chord's: a terraced crescendo, a step up per statement.
# The library's longs sound far louder than its shorts at the same marking (the first render, summed
# at unity, put the tutti statement 13 dB under the one before it), so the steps are set by measure.
TARGET = {"intro": -15.0, "s1": -16.0, "s2": -12.5, "s3": -9.0, "s4": -5.0, "swell": -2.0, "hook": 0.0}
# Inside a section: the held horns sit under the theme; the cymbal and bass drum come through the chord.
TRIM = {("horns-long", "s3"): -6.0, ("horns-long", "s4"): -6.0, ("cymbal", "hook"): 10.0, ("bass-drum", "hook"): 8.0}


class Part:
    """One articulation of one instrument. Its notes are filed under the section being written
    (`Part.group`), and each section renders as its own stem, so the sections can be levelled."""

    group = "intro"

    def __init__(self, name, family, instrument, letter, artic, reverb=REVERB):
        self.name, self.family, self.instrument, self.letter, self.artic = name, family, instrument, letter, artic
        self.reverb = reverb
        self.notes = []  # (start s, length s, note, velocity, group)
        self.ccs = []  # (time s, controller, value, group)
        self.rng = Random(zlib.crc32(name.encode()))

    def note(self, start, length, note, vel, loose=0.008):
        start += self.rng.uniform(-loose, loose) if loose else 0.0
        vel += self.rng.randint(-3, 3)
        self.notes.append((max(start, 0.0), length, note, int(min(max(vel, 1), 127)), Part.group))

    def chord(self, start, length, notes, vel, loose=0.008):
        for n in notes:
            self.note(start, length, n, vel, loose)

    def cc(self, t, cc, value):
        self.ccs.append((t, cc, int(round(value)), Part.group))

    def swell(self, t0, t1, v0, v1, cc=1, steps=24):
        for i in range(steps + 1):
            f = i / steps
            self.cc(t0 + (t1 - t0) * f, cc, v0 + (v1 - v0) * f)

    def groups(self):
        return sorted({g for *_, g in self.notes}, key=GROUPS.index)

    def span(self, group=None):
        """First and last moment of the part's events (in one section, or all), in P seconds."""
        times = [s for s, *_, g in self.notes if group in (None, g)]
        ends = [s + ln for s, ln, *_, g in self.notes if group in (None, g)]
        times += [t for t, *_, g in self.ccs if group in (None, g)]
        return min(times), max(ends + times)

    def messages(self, group=None, offset=0.0):
        """MIDI for one section (or all), times in seconds from `offset`; CC1 and CC11 start each
        section at its first written value."""
        notes = [n for n in self.notes if group in (None, n[4])]
        ccs = [c for c in self.ccs if group in (None, c[3])]
        first = {1: 40, 11: 127}
        for t, cc, v, _ in sorted(ccs):
            first.setdefault(cc, v)
        for cc in (1, 11):
            first[cc] = next((v for t, c, v, _ in sorted(ccs) if c == cc), first[cc])
        ev = [(0.0, 0, mido.Message("control_change", control=cc, value=v)) for cc, v in first.items()]
        for t, cc, v, _ in ccs:
            ev.append((t - offset, 0, mido.Message("control_change", control=cc, value=v)))
        for s, ln, n, v, _ in notes:
            ev.append((s - offset, 2, mido.Message("note_on", note=n, velocity=v)))
            ev.append((s + ln - offset, 1, mido.Message("note_off", note=n, velocity=0)))
        ev.sort(key=lambda e: (e[0], e[1]))
        return [m.copy(time=max(t, 0.0)) for t, _, m in ev]


def grieg():
    """Grieg's notes as (beat, length in beats, note), right hand and left, bar 0 the fermata."""
    mf = mido.MidiFile(GRIEG)
    hands = {}
    for name, track in (("right", mf.tracks[1]), ("left", mf.tracks[2])):
        t, on, notes = 0, {}, []
        for m in track:
            t += m.time
            if m.type == "note_on" and m.velocity:
                on[m.note] = t
            elif m.type in ("note_on", "note_off") and m.note in on:
                s = on.pop(m.note)
                notes.append((s / mf.ticks_per_beat, (t - s) / mf.ticks_per_beat, m.note))
        hands[name] = sorted(notes)
    return hands


def bars(notes, first, count):
    """Grieg's bars first .. first+count-1 as (bar offset, beat, length in beats, note)."""
    out = []
    for beat, ln, n in notes:
        b = int(beat // 4)
        if first <= b < first + count:
            out.append((b - first, beat - b * 4, ln, n))
    return out


# The last bar of the final statement cadences, as Grieg's does before his Più vivo: the theme's
# F# D F# B in eighths over B and F#, then two beats of dominant swell into the chord.
CADENCE_THEME = [(0.0, 0.25, 54), (0.5, 0.25, 50), (1.0, 0.25, 54), (1.5, 0.25, 59)]
CADENCE_BASS = [(0.0, 0.5, 23), (1.0, 0.5, 30)]


def play(part, phrase, at_bar, shift, v0, v1, accent=8, legato=0.9, cadence=False, theme=True):
    """Lay a Grieg phrase on the part from at_bar, transposed by shift = (first half, second half)
    in semitones, its velocity rising from v0 to v1 across the phrase, accents on beats 1 and 3."""
    count = 1 + max(b for b, *_ in phrase)
    for b, beat, ln, n in phrase:
        if cadence and b == count - 1:
            continue
        k = shift[0] if b < count / 2 else shift[1]
        f = (b * 4 + beat) / (count * 4)
        vel = v0 + (v1 - v0) * f + (accent if beat in (0.0, 2.0) else 0)
        part.note(at(at_bar + b, beat), max(ln * BEAT * legato, 0.08), n + k, vel)
    if cadence:
        for beat, ln, n in (CADENCE_THEME if theme else CADENCE_BASS):
            part.note(at(at_bar + count - 1, beat), max(ln * BEAT * legato, 0.08), n + shift[1], v1 + accent)


# Harmony per bar of the A statement (B minor, the fourth and eighth bars D major), for the
# violas' offbeats and the horns' chords.
def harmony_a(b):
    return "D" if b % 4 == 3 else "Bm"


VIOLA_OFFBEATS = {"Bm": (54, 59), "D": (54, 57)}  # F#3 B3, F#3 A3
HORN_CHORDS = {"Bm": (54, 59, 62), "D": (54, 57, 62)}  # F#3 B3 D4, F#3 A3 D4


def compose():
    g = grieg()
    theme_a, theme_b = bars(g["right"], 1, 8), bars(g["right"], 9, 8)
    bass_a, bass_b = bars(g["left"], 1, 8), bars(g["left"], 9, 8)

    P = {}

    def part(name, *spec, **kw):
        P[name] = Part(name, *spec, **kw)
        return P[name]

    S, W, B, X = "Strings", "Woodwinds", "Brass", "Percussion"
    horns_long = part("horns-long", B, "Horns a4", "b", "Long")
    bassoons = part("bassoons-staccatissimo", W, "Bassoons a3", "i", "Short Staccatissimo")
    celli_pizz = part("celli-pizzicato", S, "Celli", "h", "Short Pizzicato")
    basses_pizz = part("basses-pizzicato", S, "Basses", "j", "Short Pizzicato")
    violas_pizz = part("violas-pizzicato", S, "Violas", "f", "Short Pizzicato")
    timp = part("timpani", X, "Timpani", "b", "Short Hits")
    v1 = part("violins1-spiccato", S, "Violins 1", "b", "Short Spiccato")
    v2 = part("violins2-spiccato", S, "Violins 2", "d", "Short Spiccato")
    violas = part("violas-spiccato", S, "Violas", "f", "Short Spiccato")
    celli = part("celli-spiccato", S, "Celli", "h", "Short Spiccato")
    basses = part("basses-spiccato", S, "Basses", "j", "Short Spiccato")
    clarinets = part("clarinets-staccatissimo", W, "Clarinets a3", "g", "Short Staccatissimo")
    flutes = part("flutes-staccatissimo", W, "Flutes a3", "b", "Short Staccatissimo")
    oboes = part("oboes-staccatissimo", W, "Oboes a3", "e", "Short Staccatissimo")
    trumpets = part("trumpets-marcato", B, "Trumpets a2", "d", "Short Marcato")
    horns = part("horns-marcato", B, "Horns a4", "b", "Short Marcato")
    trombones = part("trombones-marcato", B, "Tenor Trombones a3", "f", "Short Marcato")
    tuba = part("tuba-marcato", B, "Tuba", "i", "Short Marcato")
    v1_trem = part("violins1-tremolo", S, "Violins 1", "b", "Tremolo")
    celli_trem = part("celli-tremolo", S, "Celli", "h", "Tremolo")
    trombones_long = part("trombones-long", B, "Tenor Trombones a3", "f", "Long")
    btrombones_long = part("bass-trombones-long", B, "Bass Trombones a2", "h", "Long")
    tuba_long = part("tuba-long", B, "Tuba", "i", "Long")
    basses_long = part("basses-long", S, "Basses", "j", "Long")
    v1_long = part("violins1-long", S, "Violins 1", "b", "Long")
    v2_long = part("violins2-long", S, "Violins 2", "d", "Long")
    violas_long = part("violas-long", S, "Violas", "f", "Long")
    celli_long = part("celli-long", S, "Celli", "h", "Long")
    trumpets_long = part("trumpets-long", B, "Trumpets a2", "d", "Long")
    bassoons_long = part("bassoons-long", W, "Bassoons a3", "i", "Long")
    cymbal = part("cymbal", X, "Untuned Percussion", "a", "Cymbal")
    bass_drum = part("bass-drum", X, "Untuned Percussion", "a", "Bass Drum 1")

    # The timpani sound an octave below the key (key 59 measures 123.5 Hz, B2), and only keys 48 to
    # 74 play: B2 is key 59, F#2 54, D2 50, A2 57. Grieg's bass names the drum by pitch class.
    TIMP = {11: 59, 6: 54, 2: 50, 9: 57}

    def timp_bass(phrase, at_bar, v0, v1_, cadence=False):
        count = 1 + max(b for b, *_ in phrase)
        for b, beat, ln, n in phrase:
            if cadence and b == count - 1:
                continue
            key = TIMP[n % 12]
            f = (b * 4 + beat) / (count * 4)
            timp.note(at(at_bar + b, beat), 0.3, key, v0 + (v1_ - v0) * f + (6 if beat == 0 else 0))
        if cadence:
            timp.note(at(at_bar + count - 1, 0), 0.3, 59, v1_ + 6)

    def roll(key, t0, t1, v0, v1_):
        n = int(round((t1 - t0) / (BEAT / 8)))
        for i in range(n):
            timp.note(t0 + i * BEAT / 8, 0.08, key, v0 + (v1_ - v0) * i / max(n - 1, 1), loose=0.004)

    # Bar 0: the horns' F#, in octaves, pianissimo, as Grieg opens.
    Part.group = "intro"
    horns_long.chord(at(0), BAR * 0.92, (54, 66), 40, loose=0)
    horns_long.swell(0.0, at(0, 2), 22, 40)
    horns_long.swell(at(0, 2), at(0, 3.7), 40, 18)

    Part.group = "s1"
    # Statement 1, bars 1 to 8: the theme in the bassoons and the celli's pizzicato, the basses'
    # pizzicato under it. Pianissimo.
    play(bassoons, theme_a, 1, (0, 0), 44, 52)
    play(celli_pizz, theme_a, 1, (12, 12), 44, 54)
    play(basses_pizz, bass_a, 1, (12, 12), 48, 58)

    Part.group = "s2"
    # Statement 2, bars 9 to 16: the answer on F#; the violas join the pizzicato, the horns hold
    # F# underneath, the timpani mark F#.
    play(bassoons, theme_b, 9, (0, 0), 52, 62)
    play(celli_pizz, theme_b, 9, (12, 12), 54, 64)
    play(violas_pizz, theme_b, 9, (12, 12), 50, 64)
    play(basses_pizz, bass_b, 9, (12, 12), 58, 68)
    horns_long.note(at(9), BAR * 8 - 0.1, 54, 50, loose=0)
    horns_long.swell(at(9), at(16, 4), 26, 52, steps=32)
    for b in range(9, 17):
        timp.note(at(b), 0.3, 54, 40 + (b - 9) * 3)

    Part.group = "s3"
    # Statement 3, bars 17 to 24: the theme bowed, violins and clarinets above, celli and
    # bassoons below; the violas on the offbeats, the horns in chords, the timpani on the bass.
    play(v1, theme_a, 17, (24, 24), 64, 86)
    play(clarinets, theme_a, 17, (24, 12), 62, 84)
    play(celli, theme_a, 17, (12, 0), 64, 86)
    play(bassoons, theme_a, 17, (12, 0), 64, 84)
    play(basses, bass_a, 17, (12, 12), 66, 88)
    timp_bass(bass_a, 17, 54, 78)
    for b in range(8):
        h = harmony_a(b)
        for beat in (1.0, 3.0):
            violas.chord(at(17 + b, beat), BEAT * 0.4, VIOLA_OFFBEATS[h], 56 + b * 2.5)
        horns_long.chord(at(17 + b), BAR - 0.12, HORN_CHORDS[h], 70, loose=0.004)
    horns_long.swell(at(17), at(25), 48, 78, steps=32)

    Part.group = "s4"
    # Statement 4, bars 25 to 32: everyone. The theme in four octaves, the brass on it, the bass
    # doubled by the tuba; the last bar cadences and swells on F# into the chord.
    for prt, shift, lo, hi in [(v1, (24, 24), 90, 118), (v2, (24, 12), 88, 116), (flutes, (36, 24), 82, 112),
                               (oboes, (24, 24), 84, 112), (clarinets, (24, 12), 86, 114),
                               (trumpets, (24, 12), 86, 118), (horns, (12, 0), 86, 118),
                               (trombones, (12, 0), 84, 116), (celli, (12, 0), 90, 118),
                               (bassoons, (12, 0), 88, 116)]:
        play(prt, theme_a, 25, shift, lo, hi, cadence=True)
    play(basses, bass_a, 25, (12, 12), 90, 118, cadence=True, theme=False)
    play(tuba, bass_a, 25, (12, 12), 86, 116, cadence=True, theme=False)
    timp_bass(bass_a, 25, 82, 112, cadence=True)
    for b in range(8):
        for beat in (1.0, 3.0):
            if b == 7 and beat == 3.0:
                continue
            violas.chord(at(25 + b, beat), BEAT * 0.4, VIOLA_OFFBEATS[harmony_a(b)], 84 + b * 3)
    # The horns hold the harmony under it, as in statement 3, louder; the last bar's two beats of
    # theme are held B minor, the swell takes over on beat 3.
    for b in range(8):
        h = "Bm" if b == 7 else harmony_a(b)
        horns_long.chord(at(25 + b), (BAR if b < 7 else 2 * BEAT) - 0.12, HORN_CHORDS[h], 100, loose=0.004)
    horns_long.swell(at(25), at(32, 2), 76, 108, steps=32)

    Part.group = "swell"
    # Bar 32, beats 3 and 4: the dominant swell. F# major in the brass and strings, a timpani roll
    # on F#, from forte to the top.
    swell0, swell1 = at(32, 2), at(33) - 0.02
    for prt, notes in [(horns_long, (54, 58, 61)), (trombones_long, (49, 54)), (btrombones_long, (42,)),
                       (tuba_long, (30,)), (basses_long, (30,)), (v1_trem, (66, 70)), (celli_trem, (42, 49))]:
        prt.chord(swell0, swell1 - swell0, notes, 100, loose=0)
        prt.swell(swell0, swell1, 64, 127, steps=16)
    roll(54, swell0, swell1, 76, 124)

    Part.group = "hook"
    # Bar 33, the loop point: B minor for the whole orchestra, three beats, cymbal and bass drum.
    chord0, chord1 = at(33), at(33, 3)
    voicing = [(basses_long, (35,)), (tuba_long, (35,)), (btrombones_long, (47,)), (celli_long, (47, 54)),
               (bassoons_long, (47, 54)), (trombones_long, (54, 59)), (horns_long, (59, 62, 66)),
               (violas_long, (62, 66)), (v2_long, (66, 71)), (trumpets_long, (71, 74)), (v1_long, (74, 83))]
    for prt, notes in voicing:
        prt.chord(chord0, chord1 - chord0, notes, 124, loose=0.003)
        prt.cc(chord0 - 0.05, 1, 124)
        prt.swell(chord1 - 0.4, chord1, 124, 100, steps=6)
    roll(59, chord0, chord1 - 0.1, 122, 108)
    cymbal.note(chord0, 1.0, 50, 116, loose=0)
    bass_drum.note(chord0, 1.0, 50, 118, loose=0)

    # Bar 34, beat 1: the last stroke, short, B in every octave; then nothing while the river drains.
    stroke = at(34)
    for prt, notes in [(trumpets, (71, 74)), (horns, (59, 66)), (trombones, (47, 54)), (tuba, (35,)),
                       (v1, (71, 83)), (v2, (66, 74)), (violas, (62, 66)), (celli, (47, 54)), (basses, (35,)),
                       (bassoons, (47, 54)), (clarinets, (66, 71)), (oboes, (71, 74)), (flutes, (83, 86))]:
        prt.chord(stroke, BEAT * 0.5, notes, 124, loose=0.003)
    timp.note(stroke, 0.3, 59, 127, loose=0)
    bass_drum.note(stroke, 1.0, 50, 104, loose=0)

    return list(P.values())


def write_score(parts):
    tpb = 480
    tempo = mido.bpm2tempo(60 / BEAT)
    mf = mido.MidiFile(ticks_per_beat=tpb)
    meta = mido.MidiTrack([mido.MetaMessage("set_tempo", tempo=tempo, time=0),
                           mido.MetaMessage("time_signature", numerator=4, denominator=4, time=0),
                           mido.MetaMessage("key_signature", key="Bm", time=0),
                           mido.MetaMessage("marker", text="film 5.6 s: the horns", time=0)])
    meta.append(mido.MetaMessage("marker", text="film 0.0 s: the chord, the loop point",
                                 time=round(at(33) / BEAT * tpb)))
    mf.tracks.append(meta)
    for part in parts:
        tr = mido.MidiTrack([mido.MetaMessage("track_name", name=f"{part.name}: {part.instrument} {part.artic}", time=0)])
        last = 0
        for m in part.messages():
            tick = round(m.time / BEAT * tpb)
            tr.append(m.copy(time=tick - last))
            last = tick
        mf.tracks.append(tr)
    mf.save(SCORE)
    print(f"wrote {SCORE}: {len(parts)} parts, {sum(len(p.notes) for p in parts)} notes, {60 / BEAT:.2f} bpm")


def render(parts, stems):
    """Each part's sections as stems in `stems`: one patch load per part, one render per section."""
    stems.mkdir(parents=True, exist_ok=True)
    plugin = bbcso.load()
    template = bbcso.Template(plugin.raw_state)
    for part in parts:
        plugin.raw_state = bbcso.state_for(template, part.family, part.instrument, part.letter, part.artic)
        time.sleep(SETTLE)
        plugin.parameters["reverb"].raw_value = part.reverb
        loaded = bbcso.patch_name(plugin)[1]
        assert loaded == [f"{part.letter} - {part.instrument} - {part.artic}"], loaded
        for group in part.groups():
            t0, t1 = part.span(group)
            offset = max(t0 - 0.1, 0.0)
            audio = plugin(part.messages(group, offset), duration=t1 - offset + TAIL, sample_rate=SR,
                           num_channels=2, buffer_size=4096, reset=True)
            peak = 20 * np.log10(np.max(np.abs(audio)) + 1e-12)
            assert peak > -80, f"{part.name} {group} rendered silent"
            np.save(stems / f"{part.name}.{group}.{int(round(offset * SR))}.npy", audio.astype(np.float32))
            print(f"  {part.name:26s} {group:5s} {sum(n[4] == group for n in part.notes):4d} notes, "
                  f"peak {peak:6.1f} dBFS", flush=True)


def load_stems(stems):
    out = []
    for f in sorted(stems.glob("*.npy")):
        name, group, offset = f.stem.rsplit(".", 2)
        out.append((name, group, int(offset), np.load(f)))
    return out


def mix(stems, gains):
    length = int(round((FILM + TAIL) * SR))
    total = np.zeros((2, length), dtype=np.float64)
    for name, group, offset, audio in stems:
        g = 10 ** ((gains[group] + TRIM.get((name, group), 0.0)) / 20)
        n = min(audio.shape[1], length - offset)
        total[:, offset:offset + n] += g * audio[:, :n]
    return total


def rms_db(audio, window):
    a, b = (int(round(t * SR)) for t in window)
    m = audio[:, a:b].mean(axis=0)
    return 20 * np.log10(np.sqrt(np.mean(m ** 2)) + 1e-12)


def level(stems):
    """Section gains that put each section at TARGET against the chord, found by remixing: each
    section's window also hears the tails of the one before, so a few rounds settle it."""
    gains = {g: 0.0 for g in GROUPS}
    for _ in range(6):
        total = mix(stems, gains)
        ref = rms_db(total, WINDOWS["hook"])
        for g in GROUPS:
            if g != "hook":
                gains[g] += ref + TARGET[g] - rms_db(total, WINDOWS[g])
    total = mix(stems, gains)
    ref = rms_db(total, WINDOWS["hook"])
    for g in GROUPS:
        print(f"  {g:5s} gain {gains[g]:+6.1f} dB, level {rms_db(total, WINDOWS[g]) - ref:+6.1f} dB "
              f"against the chord (target {TARGET[g]:+.1f})")
    return total


def fold(total):
    """P with its tail folded onto its start, rotated so the film's 0 s is P's chord."""
    n, cut = int(round(FILM * SR)), int(round((FILM - BUILD) * SR))
    loop = total[:, :n].copy()
    loop[:, : total.shape[1] - n] += total[:, n:]
    return np.concatenate([loop[:, cut:], loop[:, :cut]], axis=1)


def integrated(path):
    out = subprocess.run(["ffmpeg", "-nostats", "-hide_banner", "-i", str(path), "-af", "ebur128=peak=true",
                          "-f", "null", "-"], capture_output=True, text=True).stderr
    summary = out[out.rfind("Summary:"):]
    return float(summary.split("I:", 1)[1].split("LUFS")[0]), float(summary.split("Peak:", 1)[1].split("dBFS")[0])


def master(film):
    raw = EXPORT / "mountain-king-loop.raw.wav"
    with AudioFile(str(raw), "w", SR, 2, bit_depth=32) as f:
        f.write(film.astype(np.float32))
    # The limiter runs on three copies end to end and the middle one is kept, so its memory crosses
    # the loop point as it will when the film repeats. It takes loudness off the chord, so the gain
    # is found again after limiting until the result sits at LUFS.
    before, _ = integrated(raw)
    gain = LUFS - before
    for _ in range(5):
        chain = (f"volume={gain:.2f}dB,alimiter=limit={LIMIT}:attack=5:release=80:level=false,"
                 f"atrim=start={FILM}:duration={FILM},asetpts=PTS-STARTPTS")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-stream_loop", "2", "-i", str(raw), "-af", chain,
                        "-c:a", "pcm_s24le", str(WAV)], check=True)
        lufs, peak = integrated(WAV)
        if abs(lufs - LUFS) < 0.1:
            break
        gain += LUFS - lufs
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(WAV), "-c:a", "aac", "-b:a", "192k",
                    "-movflags", "+faststart", str(M4A)], check=True)
    raw.unlink()
    print(f"mastered: {before:.1f} LUFS before, gain {gain:+.2f} dB, {lufs:.1f} LUFS, {peak:.1f} dBTP; "
          f"wrote {WAV} and {M4A}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--score", action="store_true", help="write mountain-king.mid only")
    ap.add_argument("--mix", action="store_true", help="remix and master the stems already rendered")
    ap.add_argument("--stems", type=Path, default=Path(tempfile.gettempdir()) / "mountain-king-stems")
    args = ap.parse_args()
    parts = compose()
    write_score(parts)
    if args.score:
        return
    if not args.mix:
        for f in args.stems.glob("*.npy"):
            f.unlink()
        print(f"rendering {len(parts)} parts to {args.stems}, {SETTLE:.0f} s settle each")
        render(parts, args.stems)
    master(fold(level(load_stems(args.stems))))


if __name__ == "__main__":
    main()
