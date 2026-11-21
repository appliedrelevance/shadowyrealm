"""The Short's score, for BBC Symphony Orchestra Discover: the race's music in 110 seconds, as a loop.

    video/music/.venv/bin/python -I video/music/short_score.py           # score, render what changed, master
    video/music/.venv/bin/python -I video/music/short_score.py --score   # only short-score.mid and the checks

The Short is the series trailer, so it carries the race's themes (race_score.py): theme A and its
counterline, theme B, the falling bass, the darkening into the World Wars, the Cold War's Lydian A
and the arrival in D major. They are moved up a fourth into D minor, the key the race builds in, and
laid on the Short's own clock (FILMS.shortLoop). `orchestra.py` renders, levels and masters it.

A Short replays as soon as it ends, so the music is written as P, from the river's restart to past
the loop point, and the master is P rotated: the film's 0 s is the crest. P's 0 s is the film's
5.6 s (FILMS.shortLoop.sweep0), where the river starts again from 3500 BCE. The grid is 4/4 at
91.95 bpm, so that 40 bars run from there to the crest on the loop point: bar 1 at 5.6 s, bar 41 at
110 s. On it the Early Modern World arrives on bar 17's downbeat and the titles return on bar 40's.

    bars  1- 4    5.6- 16.0  open        the First Cities: the harp alone, the clarinets' sigh, A F A G
    bars  5-12   16.0- 37.0  a1, a2      the Iron Age and the Classical World: theme A in D minor in
                                         the first violins and clarinets over the celli falling D C
                                         Bb A; the violas' figure joins with the Classical World,
                                         the horns' counterline with the second half
    bars 13-16   37.0- 47.4  b           the Middle Ages: theme B in the oboes, the celeste over them
    bars 17-24   47.4- 68.2  t1, t2      the Early Modern World: theme A for the strings and winds;
                                         the Industrial Age: the trombones take the counterline
    bars 25-26   68.2- 73.4  fall        D minor, theme A's head low in the celli and bassoons
    bars 27-28   73.4- 78.6  wars        the World Wars: B flat minor, the head in the trombones and
                                         celli, a snare, the tam-tam
    bars 29-30   78.6- 83.8  cold        the Cold War: A with the D# of its Lydian mode, the celeste
                                         over tremolo strings, pianissimo
    bars 31-32   83.8- 89.1  b31, b32    the build: the celli's figure on D; the Digital Age: the
                                         violas, the harp and the glockenspiel join, a roll
    bars 33-40   89.1-110.0  c1, c2      theme A for everyone, the trumpets on its second half, its
                                         last A held as the titles return; the rolls into the crest
    bar  41      110 = 0     crest       D major for the whole orchestra, the race's arrival chord
    bar  42      2.6         hook        a last stroke under the finished river
                 5.0- 5.6    drain       the harp runs down D minor as the river drains to its source
"""

import argparse
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import mido
import numpy as np
from pedalboard.io import AudioFile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))  # run with python -I, which leaves the script's folder off the path

import orchestra as orc  # noqa: E402
from orchestra import Part  # noqa: E402

SCORE = HERE / "short-score.mid"
EXPORT = Path("/Volumes/Berthold/Landru/media/exports/shadowyrealm/music")
WAV = EXPORT / "short-score.wav"
M4A = EXPORT / "short-score.m4a"

FILM = 110.0  # FILMS.shortLoop.duration
BUILD = 5.6  # FILMS.shortLoop.sweep0: the river starts again, P's 0 s
BARS = 40  # from the restart to the crest on the loop point
BEAT = (FILM - BUILD) / (BARS * 4)
SR = orc.SR
LUFS = -16.0
LIMIT = 0.79  # alimiter ceiling, linear: -2 dBFS before the true-peak overshoot


def at(bar, beat=0.0):
    """P's time of a bar (from 1) and beat (from 0): the film's time less BUILD, past the loop."""
    return ((bar - 1) * 4 + beat) * BEAT


CREST = at(BARS + 1)
assert abs(CREST - (FILM - BUILD)) < 1e-9

WINDOWS = {
    "open": (at(1), at(5)), "a1": (at(5), at(9)), "a2": (at(9), at(13)), "b": (at(13), at(17)),
    "t1": (at(17), at(21)), "t2": (at(21), at(25)), "fall": (at(25), at(27)), "wars": (at(27), at(29)),
    "cold": (at(29), at(31)), "b31": (at(31), at(32)), "b32": (at(32), at(33)), "c1": (at(33), at(37)),
    "c2": (at(37), at(41)), "crest": (at(41), at(41, 3.6)), "hook": (at(42), at(42) + 2.0),
    "drain": (FILM - 0.6, FILM),
}
# Each section's level, RMS in dB against the crest: one build from the river's source to 2026,
# breathing at the Middle Ages and dropping away for the Cold War before the last climb.
TARGET = {
    "open": -21.0, "a1": -16.0, "a2": -13.0, "b": -15.0, "t1": -9.0, "t2": -6.0, "fall": -9.0,
    "wars": -7.0, "cold": -18.0, "b31": -17.0, "b32": -12.0, "c1": -4.0, "c2": -2.0, "crest": 0.0,
    "hook": -9.0, "drain": -20.0,
}

# ---- pitch, harmony, figures (as race_score.py, on this grid) ----

NAMES = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def pitch(name):
    """'C#4' to 61."""
    m = re.fullmatch(r"([A-G])([#b]?)(\d)", name)
    assert m, name
    return NAMES[m[1]] + {"#": 1, "b": -1, "": 0}[m[2]] + 12 * (int(m[3]) + 1)


def tune(text):
    """A melody as (bar, beat, length in beats, note): 'E5:1.5' lasts 1.5 beats (1 when no length is
    written), 'r' is a rest, '|' a bar line, which must fall on a whole bar."""
    out, t = [], 0.0
    for tok in text.split():
        if tok == "|":
            assert abs(t % 4) < 1e-9, (text, t)
            continue
        name, _, ln = tok.partition(":")
        ln = float(ln) if ln else 1.0
        if name != "r":
            out.append((int(t // 4), round(t % 4, 6), ln, pitch(name)))
        t += ln
    assert abs(t % 4) < 1e-9, (text, t)
    return out


def half(phrase, k):
    """Bars 4k to 4k+3 of an eight-bar phrase, from bar 0."""
    return [(b - 4 * k, beat, ln, n) for b, beat, ln, n in phrase if 4 * k <= b < 4 * k + 4]


def later(phrase, bars):
    """The phrase from its bar `bars` on, starting at bar 0."""
    return [(b - bars, beat, ln, n) for b, beat, ln, n in phrase if b >= bars]


# A chord is a root and a colour above it, under the fifth: a third, the ninth for an open fifth,
# or the fourth for a suspension.
CHORDS = {"Dm": (2, 3), "F": (5, 4), "C": (0, 4), "A": (9, 4), "Bb": (10, 4), "Bbm": (10, 3), "D": (2, 4)}
SCALES = {"d": (2, 4, 5, 7, 9, 10, 1), "dn": (2, 4, 5, 7, 9, 10, 0), "F": (5, 7, 9, 10, 0, 2, 4),
          "bb": (10, 0, 1, 3, 5, 6, 9), "Alyd": (9, 11, 1, 3, 4, 6, 8), "D": (2, 4, 6, 7, 9, 11, 1)}
# (bar, beat, chord, scale): theme A runs over two bars each of D minor, C, B flat and A, the race's
# A G F E a fourth up; theme B over B flat and F.
HARMONY = [
    (1, 0, "Dm", "dn"), (2, 0, "F", "F"), (3, 0, "C", "F"), (4, 0, "A", "d"),
    (5, 0, "Dm", "d"), (7, 0, "C", "dn"), (9, 0, "Bb", "dn"), (11, 0, "A", "d"),
    (13, 0, "Bb", "F"), (14, 0, "F", "F"), (15, 0, "Bb", "F"), (16, 0, "F", "F"),
    (17, 0, "Dm", "d"), (19, 0, "C", "dn"), (21, 0, "Bb", "dn"), (23, 0, "A", "d"),
    (25, 0, "Dm", "dn"), (27, 0, "Bbm", "bb"), (29, 0, "A", "Alyd"),
    (31, 0, "Dm", "dn"), (33, 0, "Dm", "d"), (35, 0, "C", "dn"), (37, 0, "Bb", "dn"), (39, 0, "A", "d"),
    (41, 0, "D", "D"),
]
PEDAL = ("Dm", "dn")  # the build's figure stays on D


def harmony_at(bar, beat=0.0):
    return [(c, s) for b, bt, c, s in HARMONY if (b, bt) <= (bar, beat)][-1]


def low(pc, lo):
    """The lowest note at or above `lo` with pitch class pc."""
    return lo + (pc - lo) % 12


def triad(sym, lo):
    root, color = CHORDS[sym]
    r = low(root, lo)
    return r, r + color, r + 7


def degrees(root, scale):
    """The scale upwards from `root` (a note of it) over three octaves."""
    assert root % 12 in SCALES[scale], (root, scale)
    pcs = sorted(SCALES[scale], key=lambda p: (p - root) % 12)
    return [root + (p - root) % 12 + 12 * o for o in range(3) for p in pcs]


def root(lo):
    return lambda sym: [low(CHORDS[sym][0], lo)]


def fifth(lo):
    return lambda sym: [low(CHORDS[sym][0], lo), low(CHORDS[sym][0], lo) + 7]


def upper(lo):
    return lambda sym: list(triad(sym, lo)[1:])


def every(bar0, bars, beats):
    return [(bar0 + b, beat) for b in range(bars) for beat in beats]


def ramp(d0, d1, f):
    return d0 + (d1 - d0) * f


# Dynamics as CC1 and velocity: pp 30, p 45, mp 58, mf 72, f 90, ff 108, fff 122.

def play(part, phrase, at_bar, shift, d0, d1, legato=0.92, accent=4):
    """A melody on the part from at_bar, transposed by shift semitones, its dynamic rising from d0
    on the first note to d1 on the last. A long note breathes: its CC1 rises to the middle and
    eases at the end."""
    times = [b * 4 + beat for b, beat, *_ in phrase]
    t0, t1 = min(times), max(times)
    for b, beat, ln, n in phrase:
        d = ramp(d0, d1, (b * 4 + beat - t0) / max(t1 - t0, 1e-9))
        start = at(at_bar + b, beat)
        length = max(ln * BEAT * legato, 0.08)
        if part.short:
            part.cc(start - 0.005, 1, d)
        else:
            part.cc(start - 0.005, 1, d - 4)
            part.cc(start + 0.45 * length, 1, d + 3)
            part.cc(start + length, 1, d - 3)
        part.note(start, length, n + shift, d + (accent if beat in (0.0, 2.0) else 0))


def held(part, bar, beat, beats, notes, d0, d1, gap=0.35):
    """A chord held for `beats` less a breath of `gap` seconds, swelling (or fading) d0 to d1."""
    t0, length = at(bar, beat), beats * BEAT - gap
    part.chord(t0, length, notes, max(d0, d1), loose=0.004)
    part.swell(t0 - 0.01, t0 + length, d0, d1, steps=12)


def hits(part, events, pitches, d0, d1, length=0.4, accent=0):
    """Short notes at (bar, beat) events, pitched from the harmony there."""
    for i, (bar, beat) in enumerate(events):
        d = ramp(d0, d1, i / max(len(events) - 1, 1))
        t = at(bar, beat)
        part.cc(t - 0.01, 1, d)
        part.chord(t, length, pitches(harmony_at(bar, beat)[0]), d + (accent if beat == 0 else 0))


STEPS = (0, 4, 2, 4, 3, 4, 2, 1)  # in eighths: 1 5 3 5 4 5 3 2 of the scale, from the chord's root


def ostinato(part, bar0, bars, lo, d0, d1, pedal=None, steps=STEPS, octave=0, accent=6):
    """The strings' figure in eighths, over the harmony (or a pedal chord), its root at or above lo."""
    n = bars * 8
    for i in range(n):
        bar, beat = bar0 + i // 8, (i % 8) / 2
        sym, scale = pedal or harmony_at(bar, beat)
        note = degrees(low(CHORDS[sym][0], lo), scale)[steps[i % len(steps)]] + octave
        d = ramp(d0, d1, i / max(n - 1, 1))
        t = at(bar, beat)
        if i % 8 == 0:
            part.cc(t - 0.01, 1, d)
        part.note(t, BEAT * 0.4, note, d + (accent if beat in (0.0, 2.0) else 0))


ARP = (0, 2, 3, 4, 5, 4, 3, 2)  # of root, colour, fifth and the three an octave up: up and back


def arpeggio(part, bar0, bars, lo, d0, d1):
    """The harp in eighths up and down the chord, its root at or above lo; each note rings a beat."""
    n = bars * 8
    for i in range(n):
        bar, beat = bar0 + i // 8, (i % 8) / 2
        r, c, f = triad(harmony_at(bar, beat)[0], lo)
        tones = (r, c, f, r + 12, c + 12, f + 12)
        d = ramp(d0, d1, i / max(n - 1, 1))
        t = at(bar, beat)
        if beat == 0:
            part.cc(t - 0.01, 1, d)
        part.note(t, BEAT * 0.95, tones[ARP[i % len(ARP)]], d + (4 if beat == 0 else 0))


def roll(part, t0, t1, note, d0, d1, step=BEAT / 8):
    """A roll as 32nd-note strokes (Discover's timpani rolls render silent)."""
    n = int(round((t1 - t0) / step))
    for i in range(n):
        d = ramp(d0, d1, i / max(n - 1, 1))
        if i % 4 == 0:
            part.cc(t0 + i * step - 0.005, 1, d)
        part.note(t0 + i * step, 0.08, note, d, loose=0.004)


def stroke(part, t, note, d, length=1.0):
    part.cc(t - 0.01, 1, d)
    part.note(t, length, note, d, loose=0)


def compose():
    P, leads = {}, {}

    def part(name, *spec):
        P[name] = Part(name, *spec)
        return P[name]

    def lead(*parts):
        """The parts carrying the theme in the section being written."""
        leads.setdefault(Part.group, set()).update(p.name for p in parts)

    S, W, B, X = "Strings", "Woodwinds", "Brass", "Percussion"
    v1 = part("violins1-long", S, "Violins 1", "b", "Long")
    v1_trem = part("violins1-tremolo", S, "Violins 1", "b", "Tremolo")
    v2 = part("violins2-long", S, "Violins 2", "d", "Long")
    va = part("violas-long", S, "Violas", "f", "Long")
    va_trem = part("violas-tremolo", S, "Violas", "f", "Tremolo")
    va_spicc = part("violas-spiccato", S, "Violas", "f", "Short Spiccato")
    va_pizz = part("violas-pizzicato", S, "Violas", "f", "Short Pizzicato")
    vc = part("celli-long", S, "Celli", "h", "Long")
    vc_spicc = part("celli-spiccato", S, "Celli", "h", "Short Spiccato")
    vc_pizz = part("celli-pizzicato", S, "Celli", "h", "Short Pizzicato")
    cb = part("basses-long", S, "Basses", "j", "Long")
    cb_spicc = part("basses-spiccato", S, "Basses", "j", "Short Spiccato")
    cb_pizz = part("basses-pizzicato", S, "Basses", "j", "Short Pizzicato")
    fl = part("flutes-long", W, "Flutes a3", "b", "Long")
    ob = part("oboes-long", W, "Oboes a3", "e", "Long")
    cl = part("clarinets-long", W, "Clarinets a3", "g", "Long")
    bn = part("bassoons-long", W, "Bassoons a3", "i", "Long")
    hn = part("horns-long", B, "Horns a4", "b", "Long")
    tp = part("trumpets-long", B, "Trumpets a2", "d", "Long")
    tb = part("trombones-long", B, "Tenor Trombones a3", "f", "Long")
    tb_marc = part("trombones-marcato", B, "Tenor Trombones a3", "f", "Short Marcato")
    btb = part("bass-trombones-long", B, "Bass Trombones a2", "h", "Long")
    btb_marc = part("bass-trombones-marcato", B, "Bass Trombones a2", "h", "Short Marcato")
    tu = part("tuba-long", B, "Tuba", "i", "Long")
    tu_marc = part("tuba-marcato", B, "Tuba", "i", "Short Marcato")
    timp = part("timpani", X, "Timpani", "b", "Short Hits")
    cym = part("cymbal", X, "Untuned Percussion", "a", "Cymbal")
    bd = part("bass-drum", X, "Untuned Percussion", "a", "Bass Drum 1")
    sn = part("snare", X, "Untuned Percussion", "a", "Snare 1")
    tam = part("tam-tam", X, "Untuned Percussion", "a", "Tam Tam")
    harp = part("harp", X, "Harp", "c", "Short Sustained Discover")
    cel = part("celeste", X, "Celeste", "e", "Short Sustained Discover")
    glock = part("glockenspiel", X, "Glockenspiel", "g", "Short Hits Discover")
    bells = part("tubular-bells", X, "Tubular bells", "h", "Short Hits Discover")
    TIMP = root(48)  # the timpani sound an octave below the key, and only keys 48 to 74 play

    # The race's themes a fourth up, in D minor. Theme A over Dm Dm C C Bb Bb A A, and its
    # counterline; theme B's first half, over Bb F Bb F.
    A = tune("A5:1.5 G5:.5 F5 A5 | D6:2 C6 A5 | G5:1.5 F5:.5 E5 G5 | C6:3 r | "
             "F5:1.5 E5:.5 D5 F5 | Bb5:2 A5 F5 | E5:1.5 D5:.5 C#5 E5 | A5:3 r")
    COUNTER = tune("D4:2 E4 F4 | A4:2 G4 F4 | E4:2 F4 G4 | G4:2 E4 r | "
                   "D4:2 E4 F4 | F4:2 D4 F4 | E4:2 F4 G4 | C#4:3 r")
    THEME_B = tune("F5 Bb5 D6:2 | C6:1.5 A5:.5 F5:2 | G5 Bb5 D6 F6 | C6:3 r")

    Part.group = "open"
    # Bars 1 to 4, the First Cities: the harp alone over the celli's D, then C and A; the
    # clarinets' sigh, A F, A G F, E D, C#; a soft drum on D as the river restarts.
    arpeggio(harp, 1, 4, 45, 38, 48)
    play(cl, tune("A4:2 F4:2 | A4:2 G4 F4 | E4:2 D4:2 | C#4:3 r"), 1, 0, 44, 52)
    lead(cl)
    held(vc, 1, 0, 8, [50], 26, 38)
    held(vc, 3, 0, 4, [48], 36, 40)
    held(vc, 4, 0, 4, [45], 40, 42)
    held(va, 3, 0, 4, [55, 60], 28, 34)
    held(va, 4, 0, 4, [57, 61], 32, 36)
    stroke(timp, at(1), 50, 40, 0.3)

    Part.group = "a1"
    # Bars 5 to 8, the Iron Age: theme A's first half low in the first violins and clarinets, over
    # the harp and the celli's D and C; the violas' figure starts with the Classical World (bar 7).
    play(v1, half(A, 0), 5, -12, 52, 64)
    play(cl, half(A, 0), 5, -12, 50, 62)
    lead(v1, cl)
    arpeggio(harp, 5, 4, 45, 44, 50)
    held(vc, 5, 0, 8, [50], 40, 46)
    held(vc, 7, 0, 8, [48], 44, 48)
    hits(cb_pizz, every(5, 4, (0.0, 2.0)), root(28), 46, 54)
    ostinato(va_spicc, 7, 2, 52, 44, 52)
    hits(timp, [(5, 0.0), (7, 0.0)], TIMP, 40, 46)

    Part.group = "a2"
    # Bars 9 to 12, into the Middle Ages: the second half, the violins in octaves and the
    # clarinets, the horns' counterline under it, the celli on B flat and A.
    play(v1, half(A, 1), 9, 0, 62, 72)
    play(v2, half(A, 1), 9, -12, 58, 68)
    play(cl, half(A, 1), 9, -12, 58, 68)
    lead(v1, v2, cl)
    play(hn, half(COUNTER, 1), 9, 0, 50, 60, accent=0)
    ostinato(va_spicc, 9, 4, 52, 52, 62)
    held(vc, 9, 0, 8, [46], 46, 52)
    held(vc, 11, 0, 8, [45], 50, 54)
    hits(cb_pizz, every(9, 4, (0.0, 2.0)), root(28), 52, 60)
    arpeggio(harp, 9, 4, 45, 48, 54)
    hits(timp, [(9, 0.0), (11, 0.0)], TIMP, 46, 52)

    Part.group = "b"
    # Bars 13 to 16, the Middle Ages: theme B in the oboes, the celeste an octave over them, the
    # harp, the celli and basses plucking the roots and the violas the chords between.
    play(ob, THEME_B, 13, -12, 52, 60)
    play(cel, THEME_B, 13, 0, 56, 60, accent=0)
    lead(ob, cel)
    arpeggio(harp, 13, 4, 45, 44, 50)
    hits(vc_pizz, every(13, 4, (0.0, 2.0)), root(41), 46, 52)
    hits(va_pizz, every(13, 4, (1.0, 3.0)), upper(53), 40, 46)
    hits(cb_pizz, every(13, 4, (0.0,)), root(28), 48, 54)

    Part.group = "t1"
    # Bars 17 to 20, the Early Modern World: theme A's first half for the violins in octaves, the
    # flutes, oboes and clarinets, the horns' counterline; the strings' figure, the basses on the
    # beat and the offbeat, the timpani on 1 and 3.
    for prt, k in ((v1, 0), (v2, -12), (fl, 0), (ob, -12), (cl, -12)):
        play(prt, half(A, 0), 17, k, 70, 82)
    lead(v1, v2, fl, ob, cl)
    play(hn, half(COUNTER, 0), 17, 0, 62, 72, accent=0)
    ostinato(va_spicc, 17, 4, 52, 64, 74)
    ostinato(vc_spicc, 17, 4, 45, 64, 74)
    hits(cb_spicc, every(17, 4, (0.0, 2.0, 3.5)), root(28), 66, 76, length=0.3)
    hits(timp, every(17, 4, (0.0, 2.0)), TIMP, 58, 66)
    arpeggio(harp, 17, 4, 45, 54, 60)
    stroke(cym, at(17), 50, 78, 2.0)

    Part.group = "t2"
    # Bars 21 to 24: the second half, the first violins and flutes an octave up, the horns on the
    # theme; with the Industrial Age (bar 22) the trombones take the counterline, the bass
    # trombones mark 1 and 3, the tuba holds B flat and A, cymbal and bass drum.
    for prt, k in ((v1, 12), (v2, 0), (fl, 12), (ob, 0), (cl, -12), (hn, -12)):
        play(prt, half(A, 1), 21, k, 84, 96)
    lead(v1, v2, fl, ob, cl, hn)
    play(tb, later(half(COUNTER, 1), 1), 22, 0, 72, 84, accent=0)
    hits(btb_marc, every(22, 3, (0.0, 2.0)), root(40), 72, 84, length=0.3)
    held(tu, 22, 0, 4, [34], 74, 80)
    held(tu, 23, 0, 8, [33], 78, 86)
    ostinato(va_spicc, 21, 4, 52, 76, 86)
    ostinato(vc_spicc, 21, 4, 45, 76, 86)
    hits(cb_spicc, every(21, 4, (0.0, 2.0, 3.5)), root(28), 78, 88, length=0.3)
    hits(timp, every(21, 4, (0.0, 2.0)), TIMP, 70, 80)
    stroke(cym, at(22), 50, 92, 2.0)
    stroke(bd, at(22), 50, 90)

    Part.group = "fall"
    # Bars 25 and 26: the dominant resolves to D minor, forte and fading, theme A's head low in the
    # celli and bassoons under the strings' and horns' held chord.
    sink = tune("A3:1.5 G3:.5 F3 A3 | D4:2 C4 A3")
    play(vc, sink, 25, 0, 86, 60)
    play(bn, sink, 25, 0, 82, 58)
    lead(vc, bn)
    held(cb, 25, 0, 8, [38], 90, 54)
    held(va, 25, 0, 8, [57, 62], 86, 50)
    held(v2, 25, 0, 8, [65, 69], 84, 48)
    held(v1, 25, 0, 8, [74, 77], 84, 48)
    held(hn, 25, 0, 6, [62, 69], 86, 52)
    stroke(timp, at(25), 50, 100, 0.3)
    stroke(cym, at(25), 50, 96, 2.0)

    Part.group = "wars"
    # Bars 27 and 28, the World Wars, from the downbeat: a stroke (bass drum, tam-tam, timpani, the
    # low brass on B flat); theme A's head in B flat minor in the trombones and celli; a snare's
    # march; the basses driving the root in eighths; the horns' and violas' B flat minor.
    stroke(bd, at(27), 50, 104)
    stroke(tam, at(27), 50, 96, 4.0)
    stroke(timp, at(27), 58, 110, 0.3)
    stroke(btb_marc, at(27), 46, 104, 0.4)
    stroke(tu_marc, at(27), 34, 104, 0.4)
    wars = tune("F4:1.5 Eb4:.5 Db4 F4 | Bb4:2 Ab4 F4")
    play(tb, wars, 27, 0, 76, 88)
    play(vc, wars, 27, 0, 74, 86)
    lead(tb, vc)
    hits(sn, every(27, 2, (0.0, 1.0, 1.5, 2.0, 3.0, 3.5)), lambda s: [50], 50, 66, 0.2, accent=10)
    ostinato(cb_spicc, 27, 2, 28, 66, 76, steps=(0,) * 8)
    held(hn, 27, 0, 7.4, [58, 61, 65], 58, 70)
    held(va_trem, 27, 0, 8, [61, 65], 54, 62)
    hits(timp, [(28, 0.0), (28, 2.0)], TIMP, 74, 66, 0.3)

    Part.group = "cold"
    # Bars 29 and 30, the Cold War: A major with the D# of its Lydian mode, pianissimo, the B flat
    # minor's D flat held over as C#: the celeste's sigh, E C#, E D#, over tremolo violins and
    # violas and the celli's A. The D# falls to the build's D.
    play(cel, tune("E6:2 C#6:2 | E6:2 D#6:2"), 29, 0, 60, 56, accent=0)
    lead(cel)
    held(v1_trem, 29, 0, 8, [76, 81], 30, 36)
    held(va_trem, 29, 0, 8, [61, 64], 28, 34)
    held(vc, 29, 0, 8, [45], 30, 34)

    Part.group = "b31"
    # Bar 31: the build starts, the celli's figure on D, piano, over the basses' D.
    ostinato(vc_spicc, 31, 1, 50, 42, 52, pedal=PEDAL)
    held(cb, 31, 0, 3.8, [38], 40, 46)
    stroke(timp, at(31), 50, 40, 0.3)

    Part.group = "b32"
    # Bar 32, the Digital Age: the violas take the figure an octave up, the harp and the basses
    # join, the glockenspiel's F D; the timpani and snare roll into the tutti.
    ostinato(vc_spicc, 32, 1, 50, 52, 64, pedal=PEDAL)
    ostinato(va_spicc, 32, 1, 62, 48, 62, pedal=PEDAL)
    arpeggio(harp, 32, 1, 45, 48, 56)
    hits(cb_spicc, every(32, 1, (0.0, 2.0, 3.5)), lambda s: [38], 54, 64, length=0.3)
    play(glock, tune("F6:2 D6:2"), 32, 0, 60, 66, accent=0)
    lead(glock)
    roll(timp, at(32, 2), at(33) - 0.05, 50, 50, 96)
    roll(sn, at(32, 2), at(33) - 0.05, 50, 40, 88)

    Part.group = "c1"
    # Bars 33 to 36: theme A's first half for everyone: the violins in octaves with the flutes,
    # oboes, clarinets, horns and bassoons under them; the strings' figure, the trombones on 1 and
    # 3, the tuba on D and C.
    tutti = ((v1, 0), (v2, -12), (fl, 0), (ob, -12), (cl, -12), (hn, -12), (bn, -24))
    for prt, k in tutti:
        play(prt, half(A, 0), 33, k, 94, 104)
    lead(*(prt for prt, _ in tutti))
    ostinato(va_spicc, 33, 4, 57, 92, 100)
    ostinato(vc_spicc, 33, 4, 57, 92, 100, octave=-12)
    hits(cb_spicc, every(33, 4, (0.0, 2.0, 3.5)), root(36), 94, 102, length=0.3)
    hits(tb_marc, every(33, 4, (0.0, 2.0)), fifth(45), 86, 96, length=0.3)
    held(tu, 33, 0, 7.4, [38], 86, 94)
    held(tu, 35, 0, 7.4, [36], 88, 96)
    hits(timp, every(33, 4, (0.0, 2.0)), TIMP, 90, 100, 0.3)
    stroke(cym, at(33), 50, 110)
    stroke(bd, at(33), 50, 110)

    Part.group = "c2"
    # Bars 37 to 40: its second half, the trumpets on it, B flat to A; the front reaches 2026 in
    # bar 38 and the titles return on bar 40's downbeat, on the theme's last A. The trombones and
    # tuba hold A, the timpani and snare roll into the crest.
    tutti = ((tp, 0), (v1, 0), (v2, -12), (fl, 12), (ob, -12), (cl, -12), (hn, -12), (bn, -24))
    for prt, k in tutti:
        play(prt, half(A, 1), 37, k, 104, 118)
    lead(*(prt for prt, _ in tutti))
    ostinato(va_spicc, 37, 4, 57, 100, 112)
    ostinato(vc_spicc, 37, 4, 57, 100, 112, octave=-12)
    hits(cb_spicc, every(37, 4, (0.0, 2.0, 3.5)), root(33), 102, 112, length=0.3)
    hits(tb_marc, every(37, 2, (0.0, 2.0)), fifth(45), 96, 104, length=0.3)
    held(tb, 39, 0, 7.4, [45, 52], 96, 120)
    held(btb, 39, 0, 7.4, [33], 96, 120)
    held(tu, 37, 0, 7.4, [34], 94, 100)
    held(tu, 39, 0, 7.4, [33], 100, 120)
    hits(timp, every(37, 3, (0.0, 2.0)), TIMP, 100, 108, 0.3)
    roll(timp, at(40), at(41) - 0.05, 57, 96, 127)
    roll(sn, at(40), at(41) - 0.05, 50, 60, 118)
    stroke(cym, at(37), 50, 112)

    Part.group = "crest"
    # Bar 41, the loop point and the film's first frame: the race's arrival, D major for the whole
    # orchestra, cymbal, bass drum, timpani and a tubular bell on D, under the finished river.
    voicing = [(cb, (38,)), (tu, (38,)), (btb, (38,)), (vc, (38, 45)), (bn, (50, 57)), (tb, (50, 54, 57)),
               (hn, (62, 66, 69)), (va, (57, 62)), (v2, (66, 69)), (tp, (74, 78)), (cl, (78, 81)),
               (ob, (81, 86)), (fl, (86, 90)), (v1, (74, 86))]
    for prt, notes in voicing:
        held(prt, 41, 0, 3.6, notes, 120, 96)
    stroke(cym, at(41), 50, 120, 2.0)
    stroke(bd, at(41), 50, 122, 1.5)
    stroke(timp, at(41), 50, 124, 0.3)
    stroke(bells, at(41), 74, 110, 2.0)

    Part.group = "hook"
    # Bar 42: a last stroke on D under the titles, the low strings plucked, the harp's chord.
    stroke(timp, at(42), 50, 92, 0.3)
    stroke(bd, at(42), 50, 84, 1.5)
    hits(cb_pizz, [(42, 0.0)], lambda s: [38], 90, 90)
    hits(vc_pizz, [(42, 0.0)], lambda s: [50, 57], 86, 86)
    harp.cc(at(42) - 0.01, 1, 76)
    harp.chord(at(42), BEAT * 3, (38, 50, 54, 57, 62), 76)

    Part.group = "drain"
    # The film's 5.0 to 5.6 s: the river drains back to 3500 BCE, and the harp runs down D minor
    # from D6 to D3, into the celli's D on bar 1.
    run = degrees(50, "dn")[:15] + [86]
    run = sorted(set(run), reverse=True)
    t0, span = FILM - 0.6, 0.6
    step = span / len(run)
    harp.cc(t0 - 0.01, 1, 56)
    for i, n in enumerate(run):
        harp.note(t0 + i * step, 0.5, n, int(ramp(58, 44, i / (len(run) - 1))), loose=0)

    parts = [p for p in P.values() if p.notes]
    last = max(s for p in parts for s, *_ in p.notes)
    assert last < FILM, f"a note starts at {last:.2f} s, past the loop point"
    return parts, leads


def write_score(parts):
    """The score as MIDI: 4/4 at the grid's tempo from P's 0 s, a marker at each section."""
    tpb = 480

    def ticks(t):
        return round(t / BEAT * tpb)

    meta = [(0, mido.MetaMessage("time_signature", numerator=4, denominator=4)),
            (0, mido.MetaMessage("key_signature", key="Dm")),
            (0, mido.MetaMessage("set_tempo", tempo=round(BEAT * 1e6)))]
    meta += [(ticks(w[0]), mido.MetaMessage("marker", text=g)) for g, w in WINDOWS.items()]
    mf = mido.MidiFile(ticks_per_beat=tpb)
    track, last = mido.MidiTrack(), 0
    for tick, m in sorted(meta, key=lambda e: e[0]):
        track.append(m.copy(time=tick - last))
        last = tick
    mf.tracks.append(track)
    for part in parts:
        tr = mido.MidiTrack([mido.MetaMessage("track_name", name=f"{part.name}: {part.instrument} {part.artic}")])
        last = 0
        for m in part.messages():
            tick = ticks(m.time)
            tr.append(m.copy(time=tick - last))
            last = tick
        mf.tracks.append(tr)
    mf.save(SCORE)
    print(f"wrote {SCORE}: {len(parts)} parts, {sum(len(p.notes) for p in parts)} notes, {60 / BEAT:.2f} bpm, "
          f"bar 1 at the film's {BUILD:.1f} s, bar {BARS + 1} on the loop point")


def check_cues():
    """The grid against the film's own clock: the restart and the length, and where each era lands."""
    out = subprocess.run(["bun", "tools/music-cues.ts", "shortLoop"], cwd=ROOT, capture_output=True, text=True,
                         check=True)
    cues = json.loads(out.stdout)
    assert cues["duration"] == FILM and cues["sweep"][0] == BUILD, cues
    print("eras on the grid (bar from 1, beat from 0):")
    for e in cues["eras"]:
        beats = (e["at"] - BUILD) / BEAT
        print(f"  {e['name']:24s} {e['at']:7.2f} s  bar {int(beats // 4) + 1}, beat {beats % 4:.1f}")


def fold(total):
    """P with its tail folded onto its start, rotated so that the film's 0 s is the crest."""
    n, cut = int(round(FILM * SR)), int(round(CREST * SR))
    loop = total[:, :n].copy()
    loop[:, : total.shape[1] - n] += total[:, n:]
    return np.concatenate([loop[:, cut:], loop[:, :cut]], axis=1)


def master(film):
    """The loop to LUFS under the limiter. The limiter runs on three copies end to end and the
    middle one is kept, so its memory crosses the loop point as it will when the Short repeats; it
    takes loudness off the crest, so the gain is found again until the result sits at LUFS."""
    raw = WAV.with_name(WAV.stem + ".raw.wav")
    with AudioFile(str(raw), "w", SR, 2, bit_depth=32) as f:
        f.write(film.astype(np.float32))
    before, _ = orc.integrated(raw)
    gain = LUFS - before
    for _ in range(5):
        chain = (f"volume={gain:.2f}dB,alimiter=limit={LIMIT}:attack=5:release=80:level=false,"
                 f"atrim=start={FILM}:duration={FILM},asetpts=PTS-STARTPTS")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-stream_loop", "2", "-i", str(raw), "-af", chain,
                        "-c:a", "pcm_s24le", str(WAV)], check=True)
        lufs, peak = orc.integrated(WAV)
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
    ap.add_argument("--score", action="store_true", help="write short-score.mid and check it, no render")
    ap.add_argument("--stems", type=Path, default=Path(tempfile.gettempdir()) / "short-score-stems")
    ap.add_argument("--workers", type=int, default=orc.WORKERS, help="plug-ins rendering at once, one per process")
    args = ap.parse_args()
    check_cues()
    parts, leads = compose()
    orc.check(parts)
    write_score(parts)
    if args.score:
        return
    paths, trim = orc.render(parts, args.stems, "violins1-long", args.workers)
    stems = orc.load_stems(paths)
    print("balance: each part's RMS in its section's window with its trim, dBFS, before levelling")
    orc.balance(stems, WINDOWS, trim)
    print("levels:")
    total = orc.level(stems, leads, WINDOWS, TARGET, "crest", FILM + orc.TAIL, trim)
    master(fold(total))


if __name__ == "__main__":
    main()
