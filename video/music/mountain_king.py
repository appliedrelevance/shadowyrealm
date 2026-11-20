"""Grieg's In the Hall of the Mountain King, slow, as the Short's 110 s loop, for BBC SO Discover.

    video/music/.venv/bin/python -I video/music/mountain_king.py           # score, render, master
    video/music/.venv/bin/python -I video/music/mountain_king.py --score   # only mountain-king.mid

A render keeps the stems whose notes have not changed and renders the rest on WORKERS plug-ins at
once, each in its own process.

The notes are Grieg's own piano arrangement (Op. 46 No. 4, The University Society, 1918), typeset
for the Mutopia Project by Coyau and placed in the public domain: `sources/grieg-op46-4.mid` and
`.ly`. Each statement takes one passage of that arrangement whole, the theme with the line Grieg
sets under it; the orchestration, the tempo and the ending are this file's.

    statement 1  Grieg bars  1 to  8   the theme over the plucked bass
    statement 2  Grieg bars 33 to 40   the answer on F#, a turn on every second and fourth beat
    statement 3  Grieg bars 41 to 48   the theme over running triplets, then a scale down in octaves
    statement 4  Grieg bars 49 to 55   Più vivo: the theme over the bass galloping down B A G F#

The loop (Geordie, 2026-11-19: Mountain King, slow). The Short replays as soon as it ends, so the
music is one piece P whose last 5.6 s are the film's first: the crest, a B minor chord for the
finished river and a last stroke, then silence while the river drains (5.0 to 5.6 s). From 5.6 s P
starts again: the horns' F#, then the four statements at one tempo, 75.86 bpm (Grieg marks 138
and speeds up; this never does), and the last bar's dominant swell arrives at the chord on the
loop point.

    film  5.6 to 110.0   P   0.0 to 104.4   bar 0 the horns, bars 1 to 32 the four statements
    film  0.0 to   5.6   P 104.4 to 110.0   bar 33 the chord, bar 34 the stroke, the drain

Players breathe (Geordie, 2026-11-20: the first version held a horn F# for 25 s). No wind or brass
note lasts longer than HOLD, no wind line runs longer than LUNG without a breath, and nothing
sustained, strings included, holds one pitch longer than HOLD; `check` fails the score otherwise.
The theme passes between sections every four bars, and the held harmony is gone: the winds play
Grieg's offbeats short.

Each part is one articulation of one instrument, rendered alone through the plug-in (`bbcso.py`),
one stem per section. The sections are levelled by measure, and inside each section the parts
carrying the theme sit LEAD_DB over everything under them. Sound left over after P ends is folded
onto its start, so the file loops without a seam.
"""

import argparse
import hashlib
import json
import multiprocessing as mp
import plistlib
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
WORKERS = 8  # plug-ins rendering at once, each in its own process; the Mac has 10 cores
LUFS = -16.0
LIMIT = 0.79  # alimiter ceiling, linear: about -2 dBFS before the true-peak overshoot

# Breathing. A wind player holds a note at most two bars here (6.3 s) and breathes at least every
# four (12.7 s, Grieg's phrase); a gap of BREATH is a catch-breath. A short articulation sounds
# about SHORT whatever its written length, so the silence after it counts.
WINDS = {"Woodwinds", "Brass"}
HOLD = 2 * BAR
LUNG = 4 * BAR
BREATH = 0.3
SHORT = 0.25
LEAD_DB = 3.0  # the theme's RMS over the sum of everything under it, in every statement


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
# The cymbal and bass drum come through the chord.
TRIM = {("cymbal", "hook"): 10.0, ("bass-drum", "hook"): 8.0}


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

    @property
    def short(self):
        return self.artic.startswith("Short")

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


# A phrase is a list of (bar offset, beat, length in beats, note), cut from Grieg with `bars`.

def bars(notes, first, count):
    """Grieg's bars first .. first+count-1."""
    out = []
    for beat, ln, n in notes:
        b = int(beat // 4)
        if first <= b < first + count:
            out.append((b - first, round(beat - b * 4, 3), ln, n))
    return out


def onsets(phrase):
    groups = {}
    for x in phrase:
        groups.setdefault((x[0], x[1]), []).append(x)
    return [groups[k] for k in sorted(groups)]


def top(phrase):
    """The tune: the highest note at each onset, unless a higher one of the tune still sounds
    (Grieg's offbeat chords under a held half note are accompaniment)."""
    out, end, pitch = [], -1.0, -1
    for group in onsets(phrase):
        x = max(group, key=lambda y: y[3])
        t = x[0] * 4 + x[1]
        if t < end - 1e-6 and x[3] < pitch:
            continue
        out.append(x)
        end, pitch = t + x[2], x[3]
    return out


def under(phrase):
    tune = set(top(phrase))
    return [x for x in phrase if x not in tune]


def lowest(phrase):
    return [min(g, key=lambda y: y[3]) for g in onsets(phrase)]


def highest(phrase):
    return [max(g, key=lambda y: y[3]) for g in onsets(phrase)]


def on_beats(phrase, beats):
    return [x for x in phrase if x[1] in beats]


def off_beats(phrase, beats):
    return [x for x in phrase if x[1] not in beats]


def moved(phrase, bars_=0, semis=0, before=4.0):
    """The phrase shifted by bars and semitones, keeping only what starts before beat `before`."""
    return [(b + bars_, beat, ln, n + semis) for b, beat, ln, n in phrase if beat < before]


def play(part, phrase, at_bar, shift, v0, v1, accent=8, legato=0.9):
    """Lay a Grieg phrase on the part from at_bar, transposed by shift semitones, its velocity
    rising from v0 on the first note to v1 on the last, accents on beats 1 and 3."""
    times = [b * 4 + beat for b, beat, *_ in phrase]
    t0, t1 = min(times), max(times)
    for b, beat, ln, n in phrase:
        f = (b * 4 + beat - t0) / max(t1 - t0, 1e-9)
        vel = v0 + (v1 - v0) * f + (accent if beat in (0.0, 2.0) else 0)
        part.note(at(at_bar + b, beat), max(ln * BEAT * legato, 0.08), n + shift, vel)


HORN_CHORDS = {"Bm": (54, 59, 62), "D": (54, 57, 62)}  # F#3 B3 D4, F#3 A3 D4
TROMBONE_CHORDS = {"Bm": (47, 54), "D": (50, 57)}  # B2 F#3, D3 A3
# The timpani sound an octave below the key (key 59 measures 123.5 Hz, B2), and only keys 48 to
# 74 play: B2 is key 59, F#2 54, D2 50, A2 57. Grieg's bass names the drum by pitch class.
TIMP = {11: 59, 6: 54, 2: 50, 9: 57}


def compose():
    g = grieg()
    R, L = g["right"], g["left"]

    P, leads = {}, {}

    def part(name, *spec, **kw):
        P[name] = Part(name, *spec, **kw)
        return P[name]

    def lead(*parts):
        """The parts carrying the theme in the section being written."""
        leads.setdefault(Part.group, set()).update(p.name for p in parts)

    S, W, B, X = "Strings", "Woodwinds", "Brass", "Percussion"
    horns_long = part("horns-long", B, "Horns a4", "b", "Long")
    horns_stacc = part("horns-staccatissimo", B, "Horns a4", "b", "Short Staccatissimo")
    bassoons = part("bassoons-staccatissimo", W, "Bassoons a3", "i", "Short Staccatissimo")
    celli_pizz = part("celli-pizzicato", S, "Celli", "h", "Short Pizzicato")
    basses_pizz = part("basses-pizzicato", S, "Basses", "j", "Short Pizzicato")
    violas_pizz = part("violas-pizzicato", S, "Violas", "f", "Short Pizzicato")
    v2_pizz = part("violins2-pizzicato", S, "Violins 2", "d", "Short Pizzicato")
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

    def drum(phrase, at_bar, v0, v1_, beats=(0.0,)):
        """The timpani on the bass's notes at those beats, where the bass is a drum's pitch."""
        hits = [x for x in lowest(on_beats(phrase, beats)) if x[3] % 12 in TIMP]
        times = [b * 4 + beat for b, beat, *_ in hits]
        for b, beat, ln, n in hits:
            f = (b * 4 + beat - times[0]) / max(times[-1] - times[0], 1e-9)
            timp.note(at(at_bar + b, beat), 0.3, TIMP[n % 12], v0 + (v1_ - v0) * f + (6 if beat == 0 else 0))

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
    # Statement 1, bars 1 to 8 (Grieg 1 to 8): the theme in the bassoons and the celli's
    # pizzicato, the basses' pizzicato under it. Pianissimo.
    theme, bass = bars(R, 1, 8), bars(L, 1, 8)
    play(bassoons, theme, 1, 0, 44, 52)
    play(celli_pizz, theme, 1, 12, 44, 54)
    play(basses_pizz, bass, 1, 12, 48, 58)
    lead(bassoons, celli_pizz)

    Part.group = "s2"
    # Statement 2, bars 9 to 16 (Grieg 33 to 40): the answer on F#, clarinets and the violas'
    # pizzicato, then an octave up in the oboes and the second violins'. Under it Grieg's left hand:
    # the bass plucked on beats 1 and 3, and on 2 and 4 the turn, C# B# C#, in the celli; his
    # offbeat chords in the horns, short and soft; the timpani on the bass.
    low_half, high_half, left = bars(R, 33, 4), bars(R, 37, 4), bars(L, 33, 8)
    play(clarinets, top(low_half), 9, 0, 50, 58)
    play(violas_pizz, top(low_half), 9, 0, 50, 58)
    play(oboes, top(high_half), 13, 0, 54, 64)
    play(v2_pizz, top(high_half), 13, 0, 54, 64)
    lead(clarinets, violas_pizz, oboes, v2_pizz)
    play(horns_stacc, under(low_half), 9, -12, 40, 48, accent=0)
    play(horns_stacc, under(high_half), 13, -24, 46, 54, accent=0)
    play(basses_pizz, on_beats(left, {0.0, 2.0}), 9, 0, 52, 64)
    play(celli, off_beats(left, {0.0, 2.0}), 9, 0, 46, 60, accent=0)
    drum(left, 9, 40, 58)

    Part.group = "s3"
    # Statement 3, bars 17 to 24 (Grieg 41 to 48): the theme bowed, clarinets and violas, then
    # an octave up in the first violins and flutes with the seconds below. Under it the left
    # hand's running triplets, B E# F# D E# F#, in the celli over the basses; the horns' offbeats;
    # then Grieg's scale down in octaves, B A G F# E D C#, in the trombones, bassoons and low
    # strings, which lands the theme on B for the Più vivo.
    low_half, high_half, left = bars(R, 41, 4), bars(R, 45, 4), bars(L, 41, 8)
    play(clarinets, top(low_half), 17, 0, 62, 72)
    play(violas, top(low_half), 17, 0, 62, 72)
    play(v1, top(high_half), 21, 0, 72, 86)
    play(flutes, top(high_half), 21, 0, 72, 86)
    play(v2, top(high_half), 21, -12, 72, 86)
    lead(clarinets, violas, v1, flutes, v2)
    play(horns_stacc, under(low_half), 17, 0, 56, 64, accent=0)
    play(horns_stacc, under(high_half), 21, -12, 64, 74, accent=0)
    triplets = [x for x in left if x[0] < 6 or (x[0] == 6 and x[1] < 1.0)]
    scale = [x for x in left if x not in triplets]
    play(basses, on_beats(triplets, {0.0, 2.0}), 17, 0, 62, 80)
    play(celli, off_beats(triplets, {0.0, 2.0}), 17, 0, 58, 78, accent=0)
    drum(triplets, 17, 56, 76, beats=(0.0, 2.0))
    play(trombones, lowest(scale) + highest(scale), 17, 0, 84, 100)
    play(bassoons, lowest(scale), 17, 0, 80, 96)
    play(basses, lowest(scale), 17, 0, 84, 100)
    play(celli, highest(scale), 17, 0, 84, 100)
    drum(scale, 17, 86, 86)

    Part.group = "s4"
    # Statement 4, bars 25 to 32 (Grieg 49 to 55, Più vivo): the theme in four octaves, the
    # trumpets on it. Under it Grieg's gallop, B A G F# in eighths every half bar, in the celli,
    # violas an octave up, bassoons and basses; the brass chords on beats 1 and 3, the tuba and
    # timpani on the bass. The last bar is Grieg's cadence from bar 48, F# D F# B, with the
    # gallop's first half; then the swell on F#. The bassoons drop the eighth before bar 29 to
    # breathe.
    tune = top(bars(R, 49, 7)) + moved(top(bars(R, 48, 1)), 7, 12, before=2.0)
    left = bars(L, 49, 7) + moved(bars(L, 49, 1), 7, before=2.0)
    for prt, k in [(v1, 0), (flutes, 0), (v2, -12), (oboes, -12), (clarinets, -12), (trumpets, -12)]:
        play(prt, tune, 25, k, 90, 118)
    lead(v1, flutes, v2, oboes, clarinets, trumpets)
    gallop = highest(left)
    play(celli, gallop, 25, 0, 90, 116)
    play(violas, gallop, 25, 12, 86, 112)
    play(basses, gallop, 25, -12, 92, 118)
    play(bassoons, [x for x in gallop if (x[0], x[1]) != (3, 3.5)], 25, 0, 86, 112)
    play(tuba, on_beats(lowest(left), {0.0, 2.0}), 25, 0, 88, 116)
    drum(left, 25, 84, 112, beats=(0.0, 2.0))
    for b in range(8):
        h = "D" if b == 3 else "Bm"
        for beat in ((0.0, 2.0) if b < 7 else (0.0,)):
            horns.chord(at(25 + b, beat), BEAT * 0.9, HORN_CHORDS[h], 90 + b * 3)
            trombones.chord(at(25 + b, beat), BEAT * 0.9, TROMBONE_CHORDS[h], 88 + b * 3)

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

    parts = [p for p in P.values() if p.notes]
    return parts, leads


def check(parts):
    """Fail the score where a player could not play it: a held note past HOLD (strings included:
    nothing sustained sits still that long), or a wind line past LUNG without a breath. The parts
    of one instrument are one set of players, so their notes are checked together."""
    for p in parts:
        if not p.short:
            worst = max(ln for _, ln, *_ in p.notes)
            assert worst <= HOLD + 1e-6, f"{p.name} holds a note {worst:.1f} s (HOLD {HOLD:.1f} s)"
    players = {}
    for p in parts:
        if p.family in WINDS:
            for s, ln, *_ in p.notes:
                players.setdefault(p.instrument, []).append((s, s + (min(ln, SHORT) if p.short else ln)))
    print(f"breathing: no line past {LUNG:.1f} s without a {BREATH:.1f} s gap")
    for name, spans in sorted(players.items()):
        spans.sort()
        run0, end, longest, held = spans[0][0], spans[0][1], 0.0, max(e - s for s, e in spans)
        for s, e in spans[1:]:
            if s - end >= BREATH:
                longest = max(longest, end - run0)
                run0 = s
            end = max(end, e)
        longest = max(longest, end - run0)
        print(f"  {name:20s} longest note {held:4.1f} s, longest line {longest:5.1f} s")
        assert longest <= LUNG + 1e-6, f"{name} plays {longest:.1f} s without a breath (LUNG {LUNG:.1f} s)"


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


def fingerprint():
    """What every stem depends on besides its own notes: the plug-in's version and bbcso.py."""
    with open(Path(bbcso.PLUGIN) / "Contents" / "Info.plist", "rb") as f:
        info = plistlib.load(f)
    return (f"{info.get('CFBundleShortVersionString')}/{info.get('CFBundleVersion')}/{SR}/twice/"
            f"{hashlib.sha256((HERE / 'bbcso.py').read_bytes()).hexdigest()}")


def stem_jobs(part, stems, base):
    """The part's sections as (group, offset s, duration s, path). A stem's file name carries a hash
    of everything that sounds in it, so a stem whose part has not changed is found and kept."""
    out = []
    for group in part.groups():
        t0, t1 = part.span(group)
        offset = max(t0 - 0.1, 0.0)
        duration = t1 - offset + TAIL
        msgs = [m.dict() for m in part.messages(group, offset)]
        spec = [base, part.family, part.instrument, part.letter, part.artic, part.reverb, round(duration, 6), msgs]
        key = hashlib.sha256(json.dumps(spec, sort_keys=True).encode()).hexdigest()[:16]
        out.append((group, offset, duration, stems / f"{part.name}.{group}.{int(round(offset * SR))}.{key}.npy"))
    return out


_plugin = _template = None
TRIES = 5


def _same(a, b):
    """Two renders agree: their difference is 100 dB under the signal."""
    n = min(a.shape[1], b.shape[1])
    signal = np.sqrt(np.mean(b[:, :n] ** 2)) + 1e-12
    return np.sqrt(np.mean((a[:, :n] - b[:, :n]) ** 2)) < signal * 1e-5


def _start_worker():
    global _plugin, _template
    _plugin = bbcso.load()
    _template = bbcso.Template(_plugin.raw_state)


def _render_part(task):
    """In a worker: load the part's patch on this worker's plug-in, render its missing sections."""
    part, todo = task
    _plugin.raw_state = bbcso.state_for(_template, part.family, part.instrument, part.letter, part.artic)
    time.sleep(SETTLE)
    _plugin.parameters["reverb"].raw_value = part.reverb
    loaded = bbcso.patch_name(_plugin)[1]
    assert loaded == [f"{part.letter} - {part.instrument} - {part.artic}"], loaded
    lines = []
    for group, offset, duration, path in todo:
        # The first render after a patch change can miss samples still loading (in a test 9 of 72
        # stems differed between two runs, each its part's first section), and the plug-in is
        # otherwise deterministic: render until two renders in a row agree.
        msgs, audio = part.messages(group, offset), None
        for _ in range(TRIES):
            again = _plugin(msgs, duration=duration, sample_rate=SR, num_channels=2, buffer_size=4096, reset=True)
            if audio is not None and _same(audio, again):
                break
            audio = again
        else:
            raise AssertionError(f"{part.name} {group}: no two renders in a row agreed in {TRIES} tries")
        peak = 20 * np.log10(np.max(np.abs(audio)) + 1e-12)
        assert peak > -80, f"{part.name} {group} rendered silent"
        tmp = path.with_name(path.name + ".part")
        with open(tmp, "wb") as f:
            np.save(f, audio.astype(np.float32))
        tmp.replace(path)
        lines.append(f"  {part.name:26s} {group:5s} {sum(n[4] == group for n in part.notes):4d} notes, "
                     f"peak {peak:6.1f} dBFS")
    return lines


def render(parts, stems, workers):
    """Every part's sections as stems in `stems`, rendering only those not already there. Each worker
    is its own process with its own plug-in, one part at a time: a patch load, then its sections."""
    stems.mkdir(parents=True, exist_ok=True)
    base = fingerprint()
    jobs = {p.name: stem_jobs(p, stems, base) for p in parts}
    wanted = {path for todo in jobs.values() for *_, path in todo}
    for f in stems.iterdir():
        if f not in wanted:
            f.unlink()  # stems of notes that are no longer in the score
    tasks = [(p, [j for j in jobs[p.name] if not j[3].exists()]) for p in parts]
    tasks = sorted((t for t in tasks if t[1]), key=lambda t: -sum(j[2] for j in t[1]))
    kept = len(wanted) - sum(len(todo) for _, todo in tasks)
    print(f"{len(wanted)} stems: {kept} unchanged, {len(wanted) - kept} to render from {len(tasks)} parts "
          f"on {min(workers, len(tasks))} workers, {SETTLE:.0f} s settle per part", flush=True)
    if tasks:
        start = time.monotonic()
        with mp.get_context("spawn").Pool(min(workers, len(tasks)), initializer=_start_worker) as pool:
            for lines in pool.imap_unordered(_render_part, tasks):
                print("\n".join(lines), flush=True)
        print(f"rendered in {time.monotonic() - start:.0f} s", flush=True)
    return sorted(wanted)


def load_stems(paths):
    out = []
    for f in paths:
        name, group, offset, _ = f.stem.rsplit(".", 3)
        out.append((name, group, int(offset), np.load(f)))
    return out


def mix(stems, gains, leads=None, under_db=None):
    """Sum the stems, each at its section's gain; `under_db` trims the parts not carrying the theme."""
    length = int(round((FILM + TAIL) * SR))
    total = np.zeros((2, length), dtype=np.float64)
    for name, group, offset, audio in stems:
        db = gains[group] + TRIM.get((name, group), 0.0)
        if under_db and name not in leads.get(group, ()):
            db += under_db.get(group, 0.0)
        n = min(audio.shape[1], length - offset)
        total[:, offset:offset + n] += 10 ** (db / 20) * audio[:, :n]
    return total


def rms_db(audio, window):
    a, b = (int(round(t * SR)) for t in window)
    m = audio[:, a:b].mean(axis=0)
    return 20 * np.log10(np.sqrt(np.mean(m ** 2)) + 1e-12)


def theme_over(stems, leads, group, under_db):
    """The theme's RMS over the rest of its section, in dB, the rest trimmed by under_db."""
    flat = {g: 0.0 for g in GROUPS}
    own = [s for s in stems if s[1] == group]
    tune = mix([s for s in own if s[0] in leads[group]], flat)
    rest = mix([s for s in own if s[0] not in leads[group]], flat)
    return rms_db(tune, WINDOWS[group]) - (rms_db(rest, WINDOWS[group]) + under_db)


def level(stems, leads):
    """Inside each statement, the parts under the theme come down until it sits LEAD_DB over them;
    then section gains that put each section at TARGET against the chord, found by remixing: each
    section's window also hears the tails of the one before, so a few rounds settle it."""
    under_db = {}
    for group in leads:
        under_db[group] = min(0.0, theme_over(stems, leads, group, 0.0) - LEAD_DB)
    gains = {g: 0.0 for g in GROUPS}
    for _ in range(6):
        total = mix(stems, gains, leads, under_db)
        ref = rms_db(total, WINDOWS["hook"])
        for g in GROUPS:
            if g != "hook":
                gains[g] += ref + TARGET[g] - rms_db(total, WINDOWS[g])
    total = mix(stems, gains, leads, under_db)
    ref = rms_db(total, WINDOWS["hook"])
    for g in GROUPS:
        theme = (f", theme {theme_over(stems, leads, g, under_db[g]):+4.1f} dB over the rest "
                 f"(the rest {under_db[g]:+5.1f} dB)") if g in leads else ""
        print(f"  {g:5s} gain {gains[g]:+6.1f} dB, level {rms_db(total, WINDOWS[g]) - ref:+6.1f} dB "
              f"against the chord (target {TARGET[g]:+.1f}){theme}")
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
    ap.add_argument("--stems", type=Path, default=Path(tempfile.gettempdir()) / "mountain-king-stems")
    ap.add_argument("--workers", type=int, default=WORKERS, help="plug-ins rendering at once, one per process")
    args = ap.parse_args()
    parts, leads = compose()
    check(parts)
    write_score(parts)
    if args.score:
        return
    paths = render(parts, args.stems, args.workers)
    master(fold(level(load_stems(paths), leads)))


if __name__ == "__main__":
    main()
